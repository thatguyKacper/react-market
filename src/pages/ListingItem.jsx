import { Link } from 'react-router-dom';
import styled from 'styled-components';

const CategoryListing = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
`;

const CategoryListingLink = styled(Link)`
  display: contents;
`;

const CategoryListingImg = styled.img`
  width: 30%;
  height: 100px;
  border-radius: 1.5rem;
  object-fit: cover;

  @media (min-width: 1024px) {
    width: 100%;
    height: 217px;
  }
`;

const CategoryListingDetails = styled.div`
  width: 65%;

  @media (min-width: 1024px) {
    /* width: 80%; */
    margin-left: 1.5rem;
  }
`;

const CategoryListingInStock = styled.p`
  font-weight: 600;
  font-size: 0.7rem;
  opacity: 0.8;
  margin-bottom: 0;
  color: #00cc66;
`;

const CategoryListingNotAvailable = styled(CategoryListingInStock)`
  color: #cc0000;
`;

const CategoryListingName = styled.p`
  font-weight: 600;
  font-size: 1.25rem;
  margin: 0;
`;

const CategoryListingInfoText = styled.p`
  font-weight: 500;
  font-size: 0.7rem;
`;

const CategoryListingPrice = styled.p`
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: #00cc66;
  margin-bottom: 0;
  display: flex;
  align-items: center;
`;

export default function ListingItem({ product, id }) {
  return (
    <CategoryListing>
      <CategoryListingLink to={`/category/${product.type}/${id}`}>
        <CategoryListingImg src={product.imgUrls[0]} alt={product.name} />
        <CategoryListingDetails>
          {product.inStock ? (
            <CategoryListingInStock>In Stock</CategoryListingInStock>
          ) : (
            <CategoryListingNotAvailable>
              Not available
            </CategoryListingNotAvailable>
          )}

          <CategoryListingName>{product.brand}</CategoryListingName>
          <CategoryListingInfoText>{product.model}</CategoryListingInfoText>
          <CategoryListingPrice>
            {product.isOffer ? product.discountPrice : product.price}$
          </CategoryListingPrice>
        </CategoryListingDetails>
      </CategoryListingLink>
    </CategoryListing>
  );
}
