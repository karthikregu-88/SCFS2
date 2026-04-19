import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Float, Boolean, Integer, ForeignKey, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel

# --- CONFIG ---
COLLEGE_DOMAIN = "@cvr.ac.in"
SQLALCHEMY_DATABASE_URL = "sqlite:///./scfs.db"
Base = declarative_base()
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- MODELS ---
class UserDB(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String)

class FoodItemDB(Base):
    __tablename__ = "food_items"
    id = Column(String, primary_key=True)
    name = Column(String)
    description = Column(Text, nullable=True)
    price = Column(Float)
    category = Column(String)
    image = Column(Text)  # Optimized to store Base64 strings from camera/files
    available = Column(Boolean, default=True)

class OrderDB(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True)
    user_name = Column(String)
    user_email = Column(String)
    total = Column(Float)
    status = Column(String, default="Pending")
    payment_done = Column(Boolean, default=False)
    razorpay_id = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    items = relationship("OrderItemDB", back_populates="parent_order")

class OrderItemDB(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True)
    order_id = Column(String, ForeignKey("orders.id"))
    item_name = Column(String)
    quantity = Column(Integer)
    parent_order = relationship("OrderDB", back_populates="items")

Base.metadata.create_all(bind=engine)

# --- APP INITIALIZATION ---
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

# --- SCHEMAS ---
class LoginRequest(BaseModel):
    email: str
    password: str

class FoodItemSchema(BaseModel):
    name: str
    description: Optional[str] = ""
    price: float
    category: str
    image: str
    available: bool = True

class CartItem(BaseModel):
    name: str
    quantity: int

class OrderRequest(BaseModel):
    user_name: str
    user_email: str
    total: float
    items: List[CartItem]
    payment_done: bool = False
    razorpay_id: Optional[str] = None

# --- ENDPOINTS ---

@app.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    if not req.email.lower().endswith(COLLEGE_DOMAIN):
        raise HTTPException(status_code=403, detail=f"Please use your {COLLEGE_DOMAIN} email")
    user = db.query(UserDB).filter(UserDB.email == req.email, UserDB.password == req.password).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}

@app.get("/menu")
def get_menu(db: Session = Depends(get_db)):
    return db.query(FoodItemDB).all()

@app.post("/menu")
def add_menu_item(item: FoodItemSchema, db: Session = Depends(get_db)):
    db_item = FoodItemDB(id=uuid.uuid4().hex[:8], **item.dict())
    db.add(db_item)
    db.commit()
    return {"status": "success"}

@app.delete("/menu/{item_id}")
def delete_menu_item(item_id: str, db: Session = Depends(get_db)):
    db_item = db.query(FoodItemDB).filter(FoodItemDB.id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Not found")

# Endpoint for students to place orders
@app.post("/place-order")
def place_order(req: OrderRequest, db: Session = Depends(get_db)):
    order_id = f"ORD-{uuid.uuid4().hex[:6].upper()}"
    new_order = OrderDB(
        id=order_id,
        user_name=req.user_name,
        user_email=req.user_email,
        total=req.total,
        payment_done=req.payment_done,
        razorpay_id=req.razorpay_id
    )
    db.add(new_order)
    
    for item in req.items:
        order_item = OrderItemDB(
            order_id=order_id,
            item_name=item.name,
            quantity=item.quantity
        )
        db.add(order_item)
    
    db.commit()
    return {"status": "success", "order_id": order_id}

# Optimized Admin Endpoint to show student names, items bought, and payment status
@app.get("/admin/orders")
def get_admin_orders(db: Session = Depends(get_db)):
    orders = db.query(OrderDB).order_by(OrderDB.timestamp.desc()).all()
    return [{
        "id": o.id, 
        "name": o.user_name, 
        "email": o.user_email,
        "total": o.total, 
        "paid": o.payment_done, 
        "time": o.timestamp.strftime("%I:%M %p"),
        "items": [{"name": i.item_name, "qty": i.quantity} for i in o.items]
    } for o in orders]

@app.on_event("startup")
def startup():
    db = SessionLocal()
    # Pre-populate roles for testing
    if db.query(UserDB).count() == 0:
        db.add(UserDB(id="adm", name="Admin", email=f"admin{COLLEGE_DOMAIN}", password="admin_cvr_123", role="canteen"))
        db.add(UserDB(id="stu", name="Student", email=f"student{COLLEGE_DOMAIN}", password="student_cvr_123", role="student"))
        db.commit()
    db.close()