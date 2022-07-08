import { useState, useContext } from 'react';
import Spinner from '../component/Spinner';
import ListingItem from './ListingItem';
import styled from 'styled-components';
import CartContex from '../context/CartContext';
import deleteIcon from '../assets/svg/deleteIcon.svg';

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
`;

const ListingItemDiv = styled.div`
  position: relative;
`;

export default function Cart() {
  const [loading, setLoading] = useState(false);
  const [addToCart, setAddToCart] = useContext(CartContex);

  // const onDelete = (index) => {
  //   setAddToCart([...addToCart.slice(0, index), ...addToCart.slice(index + 1)]);
  // };

  return (
    <CategoryWrapper>
      <header>
        <PageHeader>Cart</PageHeader>
      </header>

      <main>
        {addToCart ? (
          addToCart.map((product, index) => (
            <ListingItemDiv key={index}>
              <ListingItem product={product.product} id={product.id} />
              <ListingIcon>
                <img src={deleteIcon} alt='delete' />
              </ListingIcon>
            </ListingItemDiv>
          ))
        ) : (
          <></>
        )}
      </main>
    </CategoryWrapper>
  );
}
