import { useNavigate, useLocation } from "react-router-dom";
import {ReactComponent as OfferIcon} from '../assets/svg/offerIcon.svg'
import {ReactComponent as ExploreIcon} from '../assets/svg/exploreIcon.svg'
import {ReactComponent as PersonOutlineIcon} from '../assets/svg/personOutlineIcon.svg'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (route) => {
    if (route === location.pathname) {
      return true
    }
  }

  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate('/')}>
            <ExploreIcon fill={isActive('/') ? '#2c2c2c' : '#8f8f8f'} width="36px" height="36px"/>
            <p className={isActive('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Explore</p>
          </li>
          <li className="navbarListItem" onClick={() => navigate('/offers')}>
            <OfferIcon fill={isActive('/offers') ? '#2c2c2c' : '#8f8f8f'} width="36px" height="36px"/>
            <p className={isActive('/offers') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Offer</p>
          </li>
          <li className="navbarListItem" onClick={() => navigate('/profile')}>
            <PersonOutlineIcon fill={isActive('/profile') ? '#2c2c2c' : '#8f8f8f'} width="36px" height="36px"/>
            <p className={isActive('/profile') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Profile</p>
          </li>
        </ul>
      </nav>
    </footer>
  )
}
