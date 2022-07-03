import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../component/Spinner';
import ListingItem from './ListingItem';
import styled from 'styled-components';

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

const CategoryListings = styled.ul`
  padding: 0;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

const LoadMore = styled.p`
  cursor: pointer;
  width: 8rem;
  margin: 0 auto;
  text-align: center;
  padding: 0.25rem 0.5rem;
  background-color: #000000;
  color: #ffffff;
  font-weight: 600;
  border-radius: 1rem;
  opacity: 0.7;
  margin-top: 2rem;
`;

export default function Category() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const productsRef = collection(db, 'products');

        const q = query(
          productsRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        const querySnap = await getDocs(q);

        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        let products = [];

        querySnap.forEach((doc) => {
          // console.log(doc.data());
          return products.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setProducts(products);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch products');
      }
    };
    fetchListings();
  }, [params.categoryName]);

  const onFetchMoreListings = async () => {
    try {
      const productsRef = collection(db, 'products');

      const q = query(
        productsRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        limit(10),
        startAfter(lastFetchedListing)
      );

      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      let products = [];

      querySnap.forEach((doc) => {
        // console.log(doc.data());
        return products.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setProducts((prevState) => [...prevState, ...products]);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch products');
    }
  };

  return (
    <CategoryWrapper>
      <header>
        <PageHeader>{params.categoryName}</PageHeader>
      </header>

      {loading ? (
        <Spinner />
      ) : products && products.length > 0 ? (
        <>
          <main>
            <CategoryListings>
              {products.map((product) => (
                <ListingItem
                  product={product.data}
                  id={product.id}
                  key={product.id}
                />
              ))}
            </CategoryListings>
          </main>
          {lastFetchedListing && (
            <LoadMore onClick={onFetchMoreListings}>Load More</LoadMore>
          )}
        </>
      ) : (
        <p>No products for {params.categoryName}</p>
      )}
    </CategoryWrapper>
  );
}
