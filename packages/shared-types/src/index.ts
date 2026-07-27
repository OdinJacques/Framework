export interface Brand {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: string;
  userType: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  userEmail: string;
  items: OrderItem[];
}
