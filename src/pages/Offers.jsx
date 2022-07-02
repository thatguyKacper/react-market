import { useEffect, useState } from 'react';
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

export default function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');

        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        const querySnap = await getDocs(q);

        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        let listings = [];

        querySnap.forEach((doc) => {
          // console.log(doc.data());
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings');
      }
    };
    fetchListings();
  }, []);

  const onFetchMoreListings = async () => {
    try {
      const listingsRef = collection(db, 'listings');

      const q = query(
        listingsRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        limit(10),
        startAfter(lastFetchedListing)
      );

      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      let listings = [];

      querySnap.forEach((doc) => {
        // console.log(doc.data());
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch listings');
    }
  };

  return (
    <CategoryWrapper>
      <header>
        <PageHeader>Offers</PageHeader>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <CategoryListings>
              {listings.map((listing) => (
                // console.log(listing.data)
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </CategoryListings>
          </main>
          {lastFetchedListing && (
            <LoadMore onClick={onFetchMoreListings}>Load More</LoadMore>
          )}
        </>
      ) : (
        <p>No special offers</p>
      )}
    </CategoryWrapper>
  );
}
