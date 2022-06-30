import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../component/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';

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

      <div
        className='shareIconDiv'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLink(true);
          setTimeout(() => {
            setShareLink(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt='' />
      </div>

      {shareLink && <p className='linkCopied'>Link Copied!</p>}

      <div className='listingDetails'>
        <p className='listingName'>
          {listing.brand} - ${' '}
          {listing.offer ? listing.discountPrice : listing.price}
        </p>
        <p
          className={listing.inStock ? 'listingInStock' : 'listingNotAvailable'}
        >
          {listing.inStock ? 'In Stock' : 'Not Available'}
        </p>
        {listing.offer && (
          <p className='discountPrice'>
            - ${listing.price - listing.discountPrice}
          </p>
        )}

        <ul className='listingDetailsList'>
          <li>{listing.model}</li>
          <ul className='listingDetailsListSize'>
            {listing.size.map((size) => (
              <li key={size}>{size}</li>
            ))}
          </ul>
        </ul>

        {listing.inStock && auth.currentUser && (
          <Link to='/cart' className='primaryButton'>
            Add To Cart
          </Link>
        )}
      </div>
    </main>
  );
}