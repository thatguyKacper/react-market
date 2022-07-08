import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../firebase.config';

export const fetchCollection = async (category) => {
  try {
    const productsRef = collection(db, 'products');

    const q = query(
      productsRef,
      where('type', '==', category),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const querySnap = await getDocs(q);

    let products = [];

    querySnap.forEach((doc) => {
      // console.log(doc.data());
      return products.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    return products;
  } catch (error) {
    toast.error('Could not fetch products');
  }
};
