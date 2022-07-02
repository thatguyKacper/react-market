import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../component/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { toast } from 'react-toastify';
import editIcon from '../assets/svg/editIcon.svg';
import deleteIcon from '../assets/svg/deleteIcon.svg';
import styled from 'styled-components';

const ListingIconDiv = styled.div`
  cursor: pointer;
  position: fixed;
  top: 3%;
  right: 1%;
  z-index: 2;
  display: flex;
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
`;

const LinkCopied = styled.p`
  position: fixed;
  top: 8%;
  right: 2%;
  z-index: 2;
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
`;

const ListingDetails = styled.div`
  position: relative;
  margin: 1rem;

  @media (min-width: 1024px) {
    margin: 3rem;
  }
`;

const ListingName = styled.p`
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const ListingInStock = styled.p`
  padding: 0.25rem 0.5rem;
  background-color: #00cc66;
  color: #ffffff;
  border-radius: 2rem;
  display: inline;
  font-weight: 600;
  font-size: 0.8rem;
  margin-right: 1rem;
`;

const ListingNotAvailable = styled(ListingInStock)`
  background-color: #cc0000;
`;

const DiscountPrice = styled.p`
  padding: 0.25rem 0.5rem;
  background-color: #000000;
  color: #ffffff;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline;
`;

const ListingDetailsList = styled.ul`
  padding: 0;
  list-style-type: none;
`;

const ListingDetailsListItem = styled.li`
  margin: 0.3rem 0;
  font-weight: 500;
  opacity: 0.8;
  margin-right: 0.3rem;
`;

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState(null);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);

  const onDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete listing: ${listing.brand} - ${listing.model}?`
      )
    ) {
      await deleteDoc(doc(db, 'listings', params.listingId));
      toast.success('Listing deleted');
    }
    navigate(`/category/${listing.type}`);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        navigation
        pagination
        slidesPerView={1}
      >
        {listing.imgUrls.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='swiper-slide'
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      {auth.currentUser &&
      auth.currentUser.metadata.createdAt === '1656428823385' ? (
        <ListingIconDiv>
          <ListingIcon
            onClick={() => navigate(`/edit-listing/${params.listingId}`)}
          >
            <img src={editIcon} alt='edit' />
          </ListingIcon>
          <ListingIcon onClick={onDelete}>
            <img src={deleteIcon} alt='delete' />
          </ListingIcon>
        </ListingIconDiv>
      ) : (
        <ListingIconDiv>
          <ListingIcon
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setShareLink(true);
              setTimeout(() => {
                setShareLink(false);
              }, 2000);
            }}
          >
            <img src={shareIcon} alt='share' />
          </ListingIcon>
        </ListingIconDiv>
      )}
      {shareLink && <LinkCopied>Link Copied!</LinkCopied>}
      <ListingDetails>
        <ListingName>
          {listing.brand} - ${' '}
          {listing.offer ? listing.discountPrice : listing.price}
        </ListingName>
        {listing.inStock ? (
          <ListingInStock>In Stock</ListingInStock>
        ) : (
          <ListingNotAvailable>Not Available</ListingNotAvailable>
        )}

        {listing.offer && (
          <DiscountPrice>
            - ${listing.price - listing.discountPrice}
          </DiscountPrice>
        )}

        <ListingDetailsList>
          <ListingDetailsListItem>{listing.model}</ListingDetailsListItem>
          <ListingDetailsListItem>{listing.description}</ListingDetailsListItem>
          {/* <ul className='listingDetailsListSize'>
            {listing.size.map((size) => (
              <li key={size}>{size}</li>
            ))}
          </ul> */}
        </ListingDetailsList>

        {listing.inStock && auth.currentUser && (
          <Link to='/cart' className='primaryButton'>
            Add To Cart
          </Link>
        )}
      </ListingDetails>
    </main>
  );
}
