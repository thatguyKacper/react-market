import { createContext, useState } from 'react';

const CartContex = createContext();

export const CartProvider = ({ children }) => {
  const [addToCart, setAddToCart] = useState([]);

  return (
    <CartContex.Provider value={[addToCart, setAddToCart]}>
      {children}
    </CartContex.Provider>
  );
};

export default CartContex;
