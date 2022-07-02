import { Link } from 'react-router-dom';
import shoesCategoryImage from '../assets/img/eebec51f.jpeg';
import hatsCategoryImage from '../assets/img/6e5630db.jpg';
import sunglassesCategoryImage from '../assets/img/312272.jpeg';
import othersCategoryImage from '../assets/img/7ff39960.jpeg';
import Slider from '../component/Slider';
import styled from 'styled-components';

const ExploreWrapper = styled.div`
  margin: 1rem;

  @media (min-width: 1024px) {
    margin: 3rem;
  }
  @media (min-width: 1217px) {
    margin-bottom: 10rem;
  }
  @media (max-height: 536) {
    margin-bottom: 10rem;
  }
`;
const PageHeader = styled.div`
  font-size: 2rem;
  font-weight: 800;
`;

const ExploreCategoryHeading = styled.p`
  font-weight: 700;
  margin-top: 3rem;
`;

const ExploreCategories = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
  }
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

const ExploreCategoryImg = styled.img`
  min-height: 115px;
  height: 15vw;
  width: 100%;
  border-radius: 1.5rem;
  object-fit: cover;
  margin: 0 auto;
`;

const ExploreCategoryName = styled.p`
  font-weight: 500;
  text-align: left;
`;

export default function Explore() {
  return (
    <ExploreWrapper>
      <header>
        <PageHeader>Explore</PageHeader>
      </header>

      <main>
        <Slider />

        <ExploreCategoryHeading>Categories</ExploreCategoryHeading>
        <ExploreCategories>
          <Link to='/category/shoes'>
            <ExploreCategoryImg src={shoesCategoryImage} alt='shoes' />
            <ExploreCategoryName>Shoes</ExploreCategoryName>
          </Link>
          <Link to='/category/hats'>
            <ExploreCategoryImg src={hatsCategoryImage} alt='hats' />
            <ExploreCategoryName>Hats</ExploreCategoryName>
          </Link>
          <Link to='/category/sunglasses'>
            <ExploreCategoryImg
              src={sunglassesCategoryImage}
              alt='sunglasses'
            />
            <ExploreCategoryName>Sunglasses</ExploreCategoryName>
          </Link>
          <Link to='/category/others'>
            <ExploreCategoryImg src={othersCategoryImage} alt='others' />
            <ExploreCategoryName>Others</ExploreCategoryName>
          </Link>
        </ExploreCategories>
      </main>
    </ExploreWrapper>
  );
}
