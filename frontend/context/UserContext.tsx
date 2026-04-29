import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  hasPaymentMethod: boolean;
  selectedPaymentMethod: string | null;
  setPaymentMethod: (method: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// TODO: Replace with real user/payment data from backend
export function UserProvider({ children }: { children: ReactNode }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const setPaymentMethod = (method: string) => setSelectedPaymentMethod(method);

  return (
    <UserContext.Provider
      value={{
        hasPaymentMethod: selectedPaymentMethod !== null,
        selectedPaymentMethod,
        setPaymentMethod,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
