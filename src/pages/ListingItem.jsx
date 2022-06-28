import { Link } from 'react-router-dom';

export default function ListingItem({ listing, id }) {
  return (
    <li className='categoryListing'>
      <Link
        to={`/category/${listing.type}/${id}`}
        className='categoryListingLink'
      >
        <img
          src={listing.imgUrls[0]}
          alt={listing.name}
          className='categoryListingImg'
        />
        <div className='categoryListingDetails'>
          <p
            className={
              listing.inStock
                ? 'categoryListingInStock'
                : 'categoryListingNotAvailable'
            }
          >
            {listing.inStock ? 'In Stock' : 'Not available'}
          </p>
          <p className='categoryListingName'>{listing.brand}</p>
          <p className='categoryListingInfoText'>{listing.model}</p>
          <p className='categoryListingPrice'>{listing.price}$</p>
        </div>
      </Link>
    </li>
  );
}
