import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../component/Spinner';
import { toast } from 'react-toastify';

export default function CreateListing() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'shoes',
    brand: '',
    model: '',
    inStock: 'false',
    price: '',
    size: [],
    images: {},
    description: '',
  });

  const { brand, model, inStock, price, size, images, description } = formData;

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const storeImg = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();

        const filename = `${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, 'images/' + filename);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          (snapshot) => snapshot.bytesTransferred / snapshot.totalBytes,
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map((img) => storeImg(img))
    ).catch(() => {
      setLoading(false);
      toast.error('Images not uploaded');
      return;
    });

    // console.log(imgUrls);

    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy);

    setLoading(false);

    toast.success('Listing saved');

    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  const onChange = (e) => {
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='profile'>
      <header>
        <p className='pageHeader'>Create Listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className='formLabel'>Category</label>
          <select className='formInputSelect' id='type' onChange={onChange}>
            <option value='shoes'>Shoes</option>
            <option value='hats'>Hats</option>
            <option value='sunglasses'>Sunglasses</option>
            <option value='others'>Others</option>
          </select>
          <label className='formLabel'>Brand</label>
          <input
            className='formInputName'
            type='text'
            id='brand'
            value={brand}
            maxLength='32'
            minLength='2'
            required
            onChange={onChange}
          />
          <label className='formLabel'>Model</label>
          <input
            className='formInputName'
            type='text'
            id='model'
            value={model}
            maxLength='32'
            minLength='2'
            required
            onChange={onChange}
          />
          <label className='formLabel'>Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='price'
              value={price}
              min='10'
              max='99999'
              required
              onChange={onChange}
            />
          </div>
          <label className='formLabel'>Description</label>
          <textarea
            className='formInputDescription'
            type='text'
            id='description'
            value={description}
            required
            onChange={onChange}
          />
          <label className='formLabel'>Sizes</label>
          <input
            className='formInputName'
            type='text'
            id='size'
            value={size}
            onChange={onChange}
            placeholder='seperated with " , "'
          />
          <label className='formLabel'>In Stock</label>
          <div className='formButtons'>
            <button
              type='button'
              className={inStock === 'true' ? 'formButtonActive' : 'formButton'}
              id='inStock'
              value='true'
              onClick={onChange}
            >
              Yes
            </button>
            <button
              type='button'
              className={
                inStock === 'false' ? 'formButtonActive' : 'formButton'
              }
              id='inStock'
              value='false'
              onClick={onChange}
            >
              No
            </button>
          </div>
          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>The first image will be the cover.</p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            accept='.jpg,.png,.jpeg'
            multiple
            required
            onChange={onChange}
          />
          <button type='submit' className='primaryButton createListingButton'>
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}
