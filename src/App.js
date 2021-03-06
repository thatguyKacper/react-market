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
import EditListing from './pages/EditListing';
import EditNews from './pages/EditNews';
import { createGlobalStyle } from 'styled-components';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html::-webkit-scrollbar {
    display: none;
  }

  body {
    font-family: 'Montserrat', sans-serif;
    background-color: #f2f4f8;
    margin: 0;
    box-sizing: border-box;
  }

  button {
    outline: none;
    border: none;
    cursor: pointer;
  }

  a {
    text-decoration: none;
    display: block;
    color: #000000;
  }
`;

function App() {
  return (
    <>
      <CartProvider>
        <GlobalStyle />
        <Router>
          <Routes>
            <Route path='/' element={<Explore />}></Route>
            <Route
              path='/category/:categoryName'
              element={<Category />}
            ></Route>
            <Route path='/offers' element={<Offers />}></Route>
            <Route path='/profile' element={<PrivateProfile />}>
              <Route path='/profile' element={<Profile />}></Route>
            </Route>
            <Route path='/sign-in' element={<Signin />}></Route>
            <Route path='/sign-up' element={<Signup />}></Route>
            <Route path='/forgot-password' element={<ForgotPassword />}></Route>
            <Route path='/create-product' element={<PrivateAdmin />}>
              <Route path='/create-product' element={<CreateListing />}></Route>
            </Route>
            <Route path='/create-news' element={<PrivateAdmin />}>
              <Route path='/create-news' element={<CreateNews />}></Route>
            </Route>
            <Route path='/edit-product/:productId' element={<PrivateAdmin />}>
              <Route
                path='/edit-product/:productId'
                element={<EditListing />}
              ></Route>
            </Route>
            <Route path='/edit-news/:newsId' element={<PrivateAdmin />}>
              <Route path='/edit-news/:newsId' element={<EditNews />}></Route>
            </Route>
            <Route
              path='/category/:categoryName/:productId'
              element={<Listing />}
            ></Route>
            <Route path='/cart' element={<Cart />}></Route>
          </Routes>
          <Navbar />
        </Router>
        <ToastContainer />
      </CartProvider>
    </>
  );
}

export default App;
