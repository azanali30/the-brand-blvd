export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed";

export type PaymentMethod =
  | "card"
  | "cod";

export type DeliveryMethod =
  | "standard"
  | "express";

export interface OrderItem {
  product?: {
    _id: string;
    name: string;
    images?: string[];
  };

  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
}

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
}

export interface Order {
  _id: string;

  user?: OrderUser;

  items: OrderItem[];

  shippingAddress: ShippingAddress;

  deliveryMethod: DeliveryMethod;

  deliveryFee: number;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  orderStatus: OrderStatus;

  subtotal: number;

  total: number;

  createdAt: string;

  updatedAt?: string;
}