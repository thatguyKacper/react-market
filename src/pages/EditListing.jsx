import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../component/Spinner';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const EditListingWrapper = styled.div`
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

// const Form = styled;

const FormLabel = styled.label`
  font-weight: 600;
  margin-top: 1rem;
  display: block;
`;

const FormSelect = styled.select`
  padding: 0.9rem 3rem;
  background-color: #ffffff;
  font-weight: 600;
  border-radius: 1rem;
  font-size: 1rem;
  margin: 0.5rem 0.5rem 0 0;
  border: none;
  outline: none;
  cursor: pointer;
  max-width: 326px;
`;

const EditListingInput = styled.input`
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

const FormInputTextarea = styled.textarea`
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

const FormButtonsDiv = styled.div`
  display: flex;
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

const FormButtonActive = styled(FormButton)`
  background-color: #00cc66;
  color: #ffffff;
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

const EditListingButton = styled(FormButton)`
  cursor: pointer;
  background: #00cc66;
  padding: 0.85rem 2rem;
  color: #ffffff;
  font-size: 1.25rem;
  width: 80%;
  margin: 0 auto;
  margin-top: 2rem;
`;

export default function EditListing() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
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

  const { brand, model, inStock, price, images, description } = formData;

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    setLoading(true);

    const fetchListing = async () => {
      const docRef = doc(db, 'products', params.productId);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate('/');
        toast.error('Listing does not exist');
      }
    };
    fetchListing();
  }, [navigate, params.productId]);

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

    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;

    const docRef = doc(db, 'products', params.productId);

    await updateDoc(docRef, formDataCopy);

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
    <EditListingWrapper>
      <header>
        <PageHeader>Edit Listing</PageHeader>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <FormLabel>Category</FormLabel>
          <FormSelect id='type' onChange={onChange}>
            <option value='shoes'>Shoes</option>
            <option value='hats'>Hats</option>
            <option value='sunglasses'>Sunglasses</option>
            <option value='others'>Others</option>
          </FormSelect>
          <FormLabel>Brand</FormLabel>
          <EditListingInput
            type='text'
            id='brand'
            value={brand}
            maxLength='32'
            minLength='2'
            required
            onChange={onChange}
          />
          <FormLabel>Model</FormLabel>
          <EditListingInput
            type='text'
            id='model'
            value={model}
            maxLength='32'
            minLength='2'
            required
            onChange={onChange}
          />
          <FormLabel>Price</FormLabel>
          <div className='formPriceDiv'>
            <EditListingInput
              type='number'
              id='price'
              value={price}
              min='10'
              max='99999'
              required
              onChange={onChange}
            />
          </div>
          <FormLabel>Description</FormLabel>
          <FormInputTextarea
            type='text'
            id='description'
            value={description}
            onChange={onChange}
          />
          <FormLabel>In Stock</FormLabel>
          <FormButtonsDiv>
            {inStock === 'true' ? (
              <FormButtonActive
                type='button'
                id='inStock'
                value='true'
                onClick={onChange}
              >
                Yes
              </FormButtonActive>
            ) : (
              <FormButton
                type='button'
                id='inStock'
                value='true'
                onClick={onChange}
              >
                Yes
              </FormButton>
            )}

            {inStock === 'false' ? (
              <FormButtonActive
                type='button'
                id='inStock'
                value='false'
                onClick={onChange}
              >
                No
              </FormButtonActive>
            ) : (
              <FormButton
                type='button'
                id='inStock'
                value='false'
                onClick={onChange}
              >
                No
              </FormButton>
            )}
          </FormButtonsDiv>
          <FormLabel>Images</FormLabel>
          <ImagesInfo>The first image will be the cover.</ImagesInfo>
          <FormInputFile
            type='file'
            id='images'
            accept='.jpg,.png,.jpeg'
            multiple
            onChange={onChange}
          />
          <EditListingButton type='submit'>Edit Listing</EditListingButton>
        </form>
      </main>
    </EditListingWrapper>
  );
}
