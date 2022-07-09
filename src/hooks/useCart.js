import { useContext } from 'react';
import CartContex from '../context/CartContext';

export default function useCart({ product, id }) {
  const [cart, setCart] = useContext(CartContex);

  function addToOrder(orderedProduct) {
    setCart([...cart, orderedProduct]);
  }

  function removeFromOrder(index) {
    setCart([...cart.slice(0, index), ...cart.slice(index + 1)]);
  }

  return {
    addToOrder,
    removeFromOrder,
  };
}
