import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import CartContex from '../context/CartContext';

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

const FormButton = styled.button`
  padding: 0.9rem 3rem;
  background-color: #ffffff;
  font-weight: 600;
  border-radius: 1rem;
  font-size: 1rem;
  margin: 0.5rem 0.5rem 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddToCartButton = styled(FormButton)`
  cursor: pointer;
  background: #00cc66;
  padding: 0.85rem 2rem;
  color: #ffffff;
  font-size: 1.25rem;
  width: 80%;
  margin: 0 auto;
  margin-top: 2rem;
`;

export default function Listing() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState(null);

  const [addToCart, setAddToCart] = useContext(CartContex);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'products', params.productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log(docSnap.data());
        setProduct(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [navigate, params.productId]);

  const onDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete product: ${product.brand} - ${product.model}?`
      )
    ) {
      await deleteDoc(doc(db, 'products', params.productId));
      toast.success('Listing deleted');
    }
    navigate(`/category/${product.type}`);
  };

  const handleCart = async () => {
    setAddToCart([...addToCart, { product, id: params.productId }]);
    navigate('/cart');
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
        {product.imgUrls.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${product.imgUrls[index]}) center no-repeat`,
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
            onClick={() => navigate(`/edit-product/${params.productId}`)}
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
          {product.brand} - ${' '}
          {product.isOffer ? product.discountPrice : product.price}
        </ListingName>
        {product.inStock ? (
          <ListingInStock>In Stock</ListingInStock>
        ) : (
          <ListingNotAvailable>Not Available</ListingNotAvailable>
        )}

        {product.isOffer && (
          <DiscountPrice>
            - ${product.price - product.discountPrice}
          </DiscountPrice>
        )}

        <ListingDetailsList>
          <ListingDetailsListItem>{product.model}</ListingDetailsListItem>
          <ListingDetailsListItem>{product.description}</ListingDetailsListItem>
        </ListingDetailsList>

        {product.inStock && auth.currentUser && (
          <AddToCartButton type='button' onClick={handleCart}>
            Add To Cart
          </AddToCartButton>
        )}
      </ListingDetails>
    </main>
  );
}
