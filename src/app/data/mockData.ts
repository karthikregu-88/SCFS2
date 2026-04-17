import { FoodItem, Order } from '../types';

export const mockFoodItems: FoodItem[] = [
  // Breakfast
  {
    id: '1',
    name: 'Classic Pancakes',
    description: 'Fluffy pancakes with maple syrup and butter',
    price: 149,
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    available: true,
  },
  {
    id: '2',
    name: 'Breakfast Burrito',
    description: 'Scrambled eggs, cheese, bacon, and salsa',
    price: 199,
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
    available: true,
  },
  {
    id: '3',
    name: 'Avocado Toast',
    description: 'Whole grain bread with smashed avocado and poached egg',
    price: 179,
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
    available: true,
  },
  
  // Main Course
  {
    id: '4',
    name: 'Grilled Chicken Sandwich',
    description: 'Grilled chicken breast with lettuce, tomato, and special sauce',
    price: 229,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
    available: true,
  },
  {
    id: '5',
    name: 'Beef Burger',
    description: 'Juicy beef patty with cheese, lettuce, and pickles',
    price: 259,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    available: true,
  },
  {
    id: '6',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 299,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    available: true,
  },
  {
    id: '7',
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with bacon and parmesan cheese',
    price: 249,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    available: true,
  },
  {
    id: '8',
    name: 'Chicken Biryani',
    description: 'Aromatic rice with spiced chicken and raita',
    price: 329,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
    available: true,
  },
  
  // Salads
  {
    id: '9',
    name: 'Caesar Salad',
    description: 'Romaine lettuce with Caesar dressing, croutons, and parmesan',
    price: 199,
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    available: true,
  },
  {
    id: '10',
    name: 'Greek Salad',
    description: 'Fresh vegetables with feta cheese and olives',
    price: 219,
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
    available: true,
  },
  
  // Beverages
  {
    id: '11',
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice',
    price: 99,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    available: true,
  },
  {
    id: '12',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam',
    price: 119,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    available: true,
  },
  {
    id: '13',
    name: 'Iced Tea',
    description: 'Refreshing iced tea with lemon',
    price: 79,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    available: true,
  },
  {
    id: '14',
    name: 'Smoothie Bowl',
    description: 'Mixed berry smoothie with granola and fresh fruits',
    price: 159,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
    available: true,
  },
  
  // Desserts
  {
    id: '15',
    name: 'Chocolate Brownie',
    description: 'Rich chocolate brownie with vanilla ice cream',
    price: 129,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400',
    available: true,
  },
  {
    id: '16',
    name: 'Cheesecake',
    description: 'Creamy New York style cheesecake',
    price: 159,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400',
    available: true,
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    userId: 'user1',
    userName: 'John Doe',
    items: [
      { ...mockFoodItems[4], quantity: 1 }, // Beef Burger
      { ...mockFoodItems[11], quantity: 1 }, // Cappuccino
    ],
    total: 378,
    status: 'preparing',
    timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
  },
  {
    id: 'ORD002',
    userId: 'user2',
    userName: 'Sarah Smith',
    items: [
      { ...mockFoodItems[7], quantity: 1 }, // Chicken Biryani
      { ...mockFoodItems[12], quantity: 1 }, // Iced Tea
    ],
    total: 408,
    status: 'ready',
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
  },
];