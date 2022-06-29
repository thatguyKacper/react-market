import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { useAdmin } from '../hooks/useAdmin';
import Spinner from './Spinner';

export function PrivateProfile() {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return <Spinner />;
  }

  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />;
}

export function PrivateAdmin() {
  const { loggedIn, checkingStatus } = useAdmin();

  if (checkingStatus) {
    return <Spinner />;
  }

  return loggedIn ? <Outlet /> : <Navigate to='/' />;
}
