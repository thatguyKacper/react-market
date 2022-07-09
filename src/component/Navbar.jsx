import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as OfferIcon } from '../assets/svg/offerIcon.svg';
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg';
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg';
import { ReactComponent as Cart } from '../assets/svg/cartIcon.svg';
import styled from 'styled-components';

const NavbarFooter = styled.footer`
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  height: 85px;
  background-color: #ffffff;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavbarNav = styled.nav`
  width: 100%;
  margin-top: 0.75rem;
  overflow-y: hidden;
`;

const NavbarListItems = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const NavbarListItem = styled.li`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavbarListItemName = styled.p`
  margin-top: 0.25rem;
  font-size: 14px;
  font-weight: 600;
  color: #8f8f8f;
`;

const NavbarListItemNameActive = styled(NavbarListItemName)`
  color: #2c2c2c;
`;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <NavbarFooter>
      <NavbarNav>
        <NavbarListItems>
          <NavbarListItem onClick={() => navigate('/')}>
            <ExploreIcon
              fill={isActive('/') ? '#2c2c2c' : '#8f8f8f'}
              width='36px'
              height='36px'
            />
            {isActive('/') ? (
              <NavbarListItemNameActive>Explore</NavbarListItemNameActive>
            ) : (
              <NavbarListItemName>Explore</NavbarListItemName>
            )}
          </NavbarListItem>
          <NavbarListItem onClick={() => navigate('/offers')}>
            <OfferIcon
              fill={isActive('/offers') ? '#2c2c2c' : '#8f8f8f'}
              width='36px'
              height='36px'
            />
            {isActive('/offers') ? (
              <NavbarListItemNameActive>Offers</NavbarListItemNameActive>
            ) : (
              <NavbarListItemName>Offers</NavbarListItemName>
            )}
          </NavbarListItem>
          <NavbarListItem onClick={() => navigate('/profile')}>
            <PersonOutlineIcon
              fill={
                isActive('/sign-in') ||
                isActive('/sign-up') ||
                isActive('/profile')
                  ? '#2c2c2c'
                  : '#8f8f8f'
              }
              width='36px'
              height='36px'
            />
            {isActive('/sign-in') ||
            isActive('/sign-up') ||
            isActive('/profile') ? (
              <NavbarListItemNameActive>Profile</NavbarListItemNameActive>
            ) : (
              <NavbarListItemName>Profile</NavbarListItemName>
            )}
          </NavbarListItem>
          <NavbarListItem onClick={() => navigate('/cart')}>
            <Cart
              fill={isActive('/cart') ? '#2c2c2c' : '#8f8f8f'}
              width='36px'
              height='36px'
            />
            {isActive('/cart') ? (
              <NavbarListItemNameActive>Cart</NavbarListItemNameActive>
            ) : (
              <NavbarListItemName>Cart</NavbarListItemName>
            )}
          </NavbarListItem>
        </NavbarListItems>
      </NavbarNav>
    </NavbarFooter>
  );
}
