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
import styled from 'styled-components';

const CreateNewsWrapper = styled.div`
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

const CreateNewsInput = styled.input`
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

const CreateNewsButton = styled(FormButton)`
  cursor: pointer;
  background: #00cc66;
  padding: 0.85rem 2rem;
  color: #ffffff;
  font-size: 1.25rem;
  width: 80%;
  margin: 0 auto;
  margin-top: 2rem;
`;

export default function CreateNews() {
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
    <CreateNewsWrapper>
      <header>
        <PageHeader>Create News</PageHeader>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <FormLabel>Name</FormLabel>
          <CreateNewsInput
            type='text'
            id='name'
            value={name}
            maxLength='32'
            minLength='2'
            required
            onChange={onChange}
          />
          <FormLabel>Description</FormLabel>
          <CreateNewsInput
            type='text'
            id='description'
            value={description}
            maxLength='32'
            minLength='2'
            required
            onChange={onChange}
          />
          <FormLabel>Slug</FormLabel>
          <CreateNewsInput
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
          <CreateNewsButton type='submit'>Create News</CreateNewsButton>
        </form>
      </main>
    </CreateNewsWrapper>
  );
}
