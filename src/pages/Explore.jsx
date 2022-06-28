import { Link } from 'react-router-dom';
import shoesCategoryImage from '../assets/img/eebec51f.jpeg';
import hatsCategoryImage from '../assets/img/6e5630db.jpg';
import sunglassesCategoryImage from '../assets/img/312272.jpeg';
import othersCategoryImage from '../assets/img/7ff39960.jpeg';

export default function Explore() {
  return (
    <div className='explore'>
      <header>
        <p className='pageHeader'>Explore</p>
      </header>

      <main>
        <p className='exploreCategoryHeading'>Categories</p>
        <div className='exploreCategories'>
          <Link to='/category/shoes'>
            <img
              src={shoesCategoryImage}
              alt='shoes'
              className='exploreCategoryImg'
            />
            <p className='exploreCategoryName'>Shoes</p>
          </Link>
          <Link to='/category/hats'>
            <img
              src={hatsCategoryImage}
              alt='hats'
              className='exploreCategoryImg'
            />
            <p className='exploreCategoryName'>Hats</p>
          </Link>
          <Link to='/category/sunglasses'>
            <img
              src={sunglassesCategoryImage}
              alt='sunglasses'
              className='exploreCategoryImg'
            />
            <p className='exploreCategoryName'>Sunglasses</p>
          </Link>
          <Link to='/category/others'>
            <img
              src={othersCategoryImage}
              alt='others'
              className='exploreCategoryImg'
            />
            <p className='exploreCategoryName'>Others</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
