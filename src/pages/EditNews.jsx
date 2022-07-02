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
import styled from 'styled-components';

const EditNewsWrapper = styled.div`
  margin: 1rem;
  margin-bottom: 10rem;

  @media (min-width: 1024px) {
    margin: 3rem;
  }
`;

const PageHeader = styled.p`
  font-size: 2rem;
  font-weight: 800;
`;

const FormLabel = styled.label`
  font-weight: 600;
  margin-top: 1rem;
  display: block;
`;

const EditNewsInput = styled.input`
  box-shadow: rgba(0, 0, 0, 0.11);
  background: #ffffff;
  border: none;
  border-radius: 1rem;
  height: 3rem;
  max-width: 326px;
  outline: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  outline: none;
  margin: 0.5rem 0.5rem 0 0;
  padding: 0.9rem 3rem;
`;

const FormButton = styled.button`
  padding: 0.9rem 3rem;
  background-color: #ffffff;
  font-weight: 600;
  border-radius: 1rem;
  font-size: 1rem;
  margin: 0.5rem 0.5rem 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImagesInfo = styled.p`
  font-size: 0.9rem;
  opacity: 0.75;
`;

const FormInputFile = styled.input`
  &::-webkit-file-upload-button {
    background-color: #00cc66;
    border: none;
    color: #ffffff;
    font-weight: 600;
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;
    margin-right: 1rem;
    cursor: pointer;
  }
`;

const EditNewsButton = styled(FormButton)`
  cursor: pointer;
  background: #00cc66;
  padding: 0.85rem 2rem;
  color: #ffffff;
  font-size: 1.25rem;
  width: 80%;
  margin: 0 auto;
  margin-top: 2rem;
`;

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
    <EditNewsWrapper>
      <header>
        <PageHeader>Edit News</PageHeader>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <FormLabel>Name</FormLabel>
          <EditNewsInput
            type='text'
            id='name'
            value={name}
            maxLength='32'
            minLength='2'
            required
            onChange={onChange}
          />
          <FormLabel>Description</FormLabel>
          <EditNewsInput
            type='text'
            id='description'
            value={description}
            maxLength='32'
            minLength='2'
            required
            onChange={onChange}
          />
          <FormLabel>Slug</FormLabel>
          <EditNewsInput
            type='text'
            id='slug'
            value={slug}
            required
            onChange={onChange}
          />
          <FormLabel>Image</FormLabel>
          <ImagesInfo>Only one image available</ImagesInfo>
          <FormInputFile
            type='file'
            id='image'
            accept='.jpg,.png,.jpeg'
            required
            onChange={onChange}
          />
          <EditNewsButton type='submit'>Edit News</EditNewsButton>
        </form>
      </main>
    </EditNewsWrapper>
  );
}
