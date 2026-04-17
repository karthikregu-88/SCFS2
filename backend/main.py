from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_all, Column, String, Float, Boolean, Integer, ForeignKey, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import uuid

# Database Setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./scfs.db"
Base = declarative_base()
engine = create_all(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- SQLAlchemy Models ---
class UserDB(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String) # 'customer' or 'admin'

class FoodItemDB(Base):
    __tablename__ = "food_items"
    id = Column(String, primary_key=True)
    name = Column(String)
    description = Column(Text)
    price = Column(Float)
    category = Column(String)
    image = Column(String)
    available = Column(Boolean, default=True)

class OrderDB(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    user_name = Column(String)
    total = Column(Float)
    status = Column(String) # 'pending', 'preparing', 'ready', 'completed'
    order_time = Column(DateTime, default=datetime.utcnow)
    payment_id = Column(String, nullable=True)

class OrderItemDB(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, ForeignKey("orders.id"))
    food_item_id = Column(String)
    name = Column(String)
    quantity = Column(Integer)
    price = Column(Float)

Base.metadata.create_all(bind=engine)

# --- FastAPI App ---
app = FastAPI()

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Schemas ---
class LoginRequest(BaseModel):
    email: str
    password: str

class OrderCreate(BaseModel):
    userId: str
    userName: str
    items: List[dict]
    total: float
    paymentId: Optional[str] = "SIMULATED_PAYMENT"

# --- Endpoints ---

@app.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == req.email, UserDB.password == req.password).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}

@app.get("/menu")
def get_menu(db: Session = Depends(get_db)):
    return db.query(FoodItemDB).all()

@app.post("/orders")
def place_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"
    new_order = OrderDB(
        id=order_id,
        user_id=order_data.userId,
        user_name=order_data.userName,
        total=order_data.total,
        status="pending",
        payment_id=order_data.paymentId
    )
    db.add(new_order)
    
    for item in order_data.items:
        db.add(OrderItemDB(
            order_id=order_id,
            food_item_id=item['id'],
            name=item['name'],
            quantity=item['quantity'],
            price=item['price']
        ))
    
    db.commit()
    return {"order_id": order_id, "status": "success"}

@app.get("/admin/orders")
def get_all_orders(db: Session = Depends(get_db)):
    # This is what the Admin UI will poll
    orders = db.query(OrderDB).order_by(OrderDB.order_time.desc()).all()
    result = []
    for o in orders:
        items = db.query(OrderItemDB).filter(OrderItemDB.order_id == o.id).all()
        result.append({
            "id": o.id,
            "userName": o.user_name,
            "total": o.total,
            "status": o.status,
            "orderTime": o.order_time,
            "items": items
        })
    return result

@app.patch("/admin/orders/{order_id}")
def update_status(order_id: str, status: str, db: Session = Depends(get_db)):
    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if order:
        order.status = status
        db.commit()
        return {"status": "updated"}
    raise HTTPException(status_code=404, detail="Order not found")

# Initialize Data (Run once)
@app.on_event("startup")
def startup_populate():
    db = SessionLocal()
    if db.query(FoodItemDB).count() == 0:
        # Add mock items from your frontend data
        items = [
            FoodItemDB(id="1", name="Veggie Burger", price=149, category="Main Course", available=True),
            FoodItemDB(id="2", name="Chicken Pizza", price=249, category="Main Course", available=True),
        ]
        db.add_all(items)
        # Add default admin
        db.add(UserDB(id="admin", name="Canteen Admin", email="admin@campus.edu", password="admin123", role="admin"))
        db.commit()
    db.close()