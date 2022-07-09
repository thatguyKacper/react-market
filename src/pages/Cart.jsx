import { useContext } from 'react';
// import Spinner from '../component/Spinner';
import ListingItem from './ListingItem';
import styled from 'styled-components';
import CartContex from '../context/CartContext';
import deleteIcon from '../assets/svg/deleteIcon.svg';
import useCart from '../hooks/useCart';

const CategoryWrapper = styled.div`
  margin: 1rem;
  margin-bottom: 10rem;

  @media (min-width: 1024px) {
    margin: 3rem;
  }
`;

const PageHeader = styled.p`
  font-size: 2rem;
  font-weight: 800;
`;

const CartListings = styled.ul`
  padding: 0;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

const ListingIcon = styled.div`
  background-color: #ffffff;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.5rem;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
`;

const ListingItemDiv = styled.div`
  position: relative;
`;

export default function Cart() {
  // const [loading, setLoading] = useState(false);
  const [cart] = useContext(CartContex);

  const { removeFromOrder } = useCart({ cart });

  return (
    <CategoryWrapper>
      <header>
        <PageHeader>Cart</PageHeader>
      </header>

      <main>
        <CartListings>
          {cart ? (
            cart.map((product, index) => (
              <ListingItemDiv key={index}>
                <ListingItem product={product.product} id={product.id} />
                <ListingIcon>
                  <img
                    src={deleteIcon}
                    alt='delete'
                    onClick={() => removeFromOrder(index)}
                  />
                </ListingIcon>
              </ListingItemDiv>
            ))
          ) : (
            <p>Nothing in cart </p>
          )}
        </CartListings>
      </main>
    </CategoryWrapper>
  );
}
