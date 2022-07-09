import { createContext, useState } from 'react';

const CartContex = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  return (
    <CartContex.Provider value={[cart, setCart]}>
      {children}
    </CartContex.Provider>
  );
};

export default CartContex;
