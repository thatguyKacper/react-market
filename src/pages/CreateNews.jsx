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
    name: '',
    description: '',
    slug: '',
    image: '',
  });

  const { name, description, slug, image } = formData;

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

    const imgUrl = await Promise.all(
      [...image].map((img) => storeImg(img))
    ).catch(() => {
      setLoading(false);
      toast.error('Images not uploaded');
      return;
    });

    // console.log(imgUrls);

    const formDataCopy = {
      ...formData,
      imgUrl,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.image;

    const docRef = await addDoc(collection(db, 'news'), formDataCopy);

    setLoading(false);

    toast.success('News saved');

    navigate(`/`);
  };

  const onChange = (e) => {
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        image: e.target.files,
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
        <p className='pageHeader'>Create News</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className='formLabel'>Name</label>
          <input
            className='formInputName'
            type='text'
            id='name'
            value={name}
            maxLength='32'
            minLength='2'
            required
            onChange={onChange}
          />
          <label className='formLabel'>Description</label>
          <input
            className='formInputName'
            type='text'
            id='description'
            value={description}
            maxLength='32'
            minLength='2'
            required
            onChange={onChange}
          />
          <label className='formLabel'>Slug</label>
          <input
            className='formInputName'
            type='text'
            id='slug'
            value={slug}
            required
            onChange={onChange}
          />
          <label className='formLabel'>Image</label>
          <input
            className='formInputFile'
            type='file'
            id='image'
            accept='.jpg,.png,.jpeg'
            required
            onChange={onChange}
          />
          <button type='submit' className='primaryButton createListingButton'>
            Create News
          </button>
        </form>
      </main>
    </div>
  );
}
