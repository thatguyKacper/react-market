import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAdmin = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user.metadata.createdAt === '1656428823385') {
        setLoggedIn(true);
      }
      setCheckingStatus(false);
    });
  });

  return { loggedIn, checkingStatus };
};
