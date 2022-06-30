import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PrivateProfile, PrivateAdmin } from './component/PrivateRoute';
import Explore from './pages/Explore';
import Category from './pages/Category';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Navbar from './component/Navbar';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';
import CreateNews from './pages/CreateNews';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />}></Route>
          <Route path='/category/:categoryName' element={<Category />}></Route>
          <Route path='/offers' element={<Offers />}></Route>
          <Route path='/profile' element={<PrivateProfile />}>
            <Route path='/profile' element={<Profile />}></Route>
          </Route>
          <Route path='/sign-in' element={<Signin />}></Route>
          <Route path='/sign-up' element={<Signup />}></Route>
          <Route path='/forgot-password' element={<ForgotPassword />}></Route>
          <Route path='/create-listing' element={<PrivateAdmin />}>
            <Route path='/create-listing' element={<CreateListing />}></Route>
          </Route>
          <Route path='/create-news' element={<PrivateAdmin />}>
            <Route path='/create-news' element={<CreateNews />}></Route>
          </Route>
          <Route
            path='/category/:categoryName/:listingId'
            element={<Listing />}
          ></Route>
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
