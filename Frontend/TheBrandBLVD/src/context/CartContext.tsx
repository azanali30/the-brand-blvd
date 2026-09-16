import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// ==========================================
// TYPES
// ==========================================

export interface ProductVariant {
  size: string;
  price: number;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  images: string[];

  variants: ProductVariant[];

  colors: string[];

  isNewArrival: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CartData {
  items: CartItem[];
}

interface CartContextType {
  cart: CartData;
  cartCount: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

// ==========================================
// PROVIDER
// ==========================================

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartData>({
    items: [],
  });

  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://the-brand-blvd.onrender.com/api/cart",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart);
      } else {
        setCart({ items: [] });
      }
    } catch (error) {
      console.error("Fetch cart error:", error);

      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const cartCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ==========================================
// HOOK
// ==========================================

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};