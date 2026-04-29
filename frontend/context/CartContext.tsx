import { createContext, useContext, useState, ReactNode } from "react";

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients?: string[];
  extras?: { name: string; price: number }[];
}

export interface CartItem {
  id: string;
  itemId: number;
  name: string;
  basePrice: number;
  image: string;
  quantity: number;
  removedIngredients: string[];
  extraIngredients: { name: string; price: number }[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (config: {
    itemId: number;
    removedIngredients?: string[];
    extraIngredients?: { name: string; price: number }[];
  }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// TODO: Replace with real data from API
export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Juicy beef patty with fresh lettuce, tomato, and special sauce",
    price: 8.99,
    category: "Burgers",
    image:
      "https://images.unsplash.com/photo-1671106672702-5626deb87b0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzc0Mzk4ODI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ingredients: ["Lettuce", "Tomato", "Onion", "Pickles"],
    extras: [
      { name: "Cheese", price: 1.0 },
      { name: "Bacon", price: 1.5 },
      { name: "Avocado", price: 2.0 },
    ],
  },
  {
    id: 2,
    name: "Margherita Pizza",
    description: "Fresh mozzarella, basil, and tomato sauce on crispy crust",
    price: 12.99,
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1727198826083-6693684e4fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzQ0NjgwNjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ingredients: ["Mozzarella", "Basil", "Tomato Sauce"],
    extras: [
      { name: "Extra Cheese", price: 1.5 },
      { name: "Pepperoni", price: 2.0 },
    ],
  },
  {
    id: 3,
    name: "Sushi Platter",
    description: "Assorted fresh sushi with wasabi and pickled ginger",
    price: 15.99,
    category: "Sushi",
    image:
      "https://images.unsplash.com/photo-1625937751876-4515cd8e78bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHBsYXR0ZXJ8ZW58MXx8fHwxNzc0NDQ2MjQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ingredients: ["Salmon", "Tuna", "Avocado", "Cucumber"],
    extras: [
      { name: "Extra Wasabi", price: 0.5 },
      { name: "Spicy Mayo", price: 0.75 },
    ],
  },
  {
    id: 4,
    name: "Caesar Salad",
    description: "Crisp romaine, parmesan, croutons with creamy caesar dressing",
    price: 9.99,
    category: "Salads",
    image:
      "https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NzQ0NzI3MDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ingredients: ["Romaine", "Parmesan", "Croutons"],
    extras: [
      { name: "Grilled Chicken", price: 3.0 },
      { name: "Extra Parmesan", price: 1.0 },
    ],
  },
  {
    id: 5,
    name: "Cappuccino",
    description: "Rich espresso with steamed milk and foam",
    price: 4.5,
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1622868300874-0a1c2a9458fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsYXR0ZSUyMGN1cHxlbnwxfHx8fDE3NzQ0ODk2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    extras: [
      { name: "Extra Shot", price: 1.0 },
      { name: "Vanilla Syrup", price: 0.5 },
    ],
  },
  {
    id: 6,
    name: "Fish Tacos",
    description: "Grilled fish with cabbage slaw and chipotle mayo",
    price: 11.99,
    category: "Tacos",
    image:
      "https://images.unsplash.com/photo-1707604341704-74abdc25e52a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWNvcyUyMG1leGljYW4lMjBmb29kfGVufDF8fHx8MTc3NDM4OTA0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    ingredients: ["Fish", "Cabbage", "Chipotle Mayo", "Cilantro"],
    extras: [
      { name: "Guacamole", price: 1.5 },
      { name: "Sour Cream", price: 0.75 },
    ],
  },
  {
    id: 7,
    name: "Club Sandwich",
    description: "Triple-decker with turkey, bacon, lettuce, and tomato",
    price: 10.5,
    category: "Sandwiches",
    image:
      "https://images.unsplash.com/photo-1768854592371-1042a977798a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGRlbGklMjBmcmVzaHxlbnwxfHx8fDE3NzQ0MDc0NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ingredients: ["Turkey", "Bacon", "Lettuce", "Tomato"],
    extras: [
      { name: "Avocado", price: 2.0 },
      { name: "Swiss Cheese", price: 1.0 },
    ],
  },
  {
    id: 8,
    name: "Penne Alfredo",
    description: "Creamy parmesan sauce with grilled chicken",
    price: 13.99,
    category: "Pasta",
    image:
      "https://images.unsplash.com/photo-1609166639722-47053ca112ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGl0YWxpYW4lMjBkaXNofGVufDF8fHx8MTc3NDQ4OTY5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    ingredients: ["Penne", "Alfredo Sauce", "Chicken", "Parmesan"],
    extras: [
      { name: "Extra Chicken", price: 3.0 },
      { name: "Broccoli", price: 1.5 },
    ],
  },
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (config: {
    itemId: number;
    removedIngredients?: string[];
    extraIngredients?: { name: string; price: number }[];
  }) => {
    const item = menuItems.find((i) => i.id === config.itemId);
    if (!item) return;

    const newCartItem: CartItem = {
      id: `${config.itemId}-${Date.now()}`,
      itemId: config.itemId,
      name: item.name,
      basePrice: item.price,
      image: item.image,
      quantity: 1,
      removedIngredients: config.removedIngredients ?? [],
      extraIngredients: config.extraIngredients ?? [],
    };

    setCart((prev) => [...prev, newCartItem]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce((sum, item) => {
    const extrasPrice = item.extraIngredients.reduce((s, e) => s + e.price, 0);
    return sum + (item.basePrice + extrasPrice) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
