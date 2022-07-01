import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { updateDoc, getDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../component/Spinner';
import { toast } from 'react-toastify';

export default function EditNews() {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    image: '',
  });

  const { name, description, slug, image } = formData;

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    setLoading(true);

    const fetchListing = async () => {
      const docRef = doc(db, 'news', params.newsId);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setNews(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate('/');
        toast.error('News does not exist');
      }
    };
    fetchListing();
  }, [navigate, params.newsId]);

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

    const docRef = doc(db, 'news', params.newsId);

    await updateDoc(docRef, formDataCopy);

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
        <p className='pageHeader'>Edit News</p>
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
            Edit News
          </button>
        </form>
      </main>
    </div>
  );
}
