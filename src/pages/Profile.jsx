import { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import styled from 'styled-components';

const ProfileWrapper = styled.div`
  margin-bottom: 10rem;
  margin: 1rem;
  margin-bottom: 10rem;

  @media (min-width: 1024px) {
    margin: 3rem;
  }
`;
const ProfileHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageHeader = styled.p`
  font-size: 2rem;
  font-weight: 800;
`;

const LogoutBtn = styled.button`
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #00cc66;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
`;

const ProfileDetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 500px;
`;

const ProfileDetailsText = styled.p`
  font-weight: 600;
`;

const ChangePersonalDetails = styled.p`
  cursor: pointer;
  font-weight: 600;
  color: #00cc66;
`;

const ProfileCard = styled.div`
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.2);
  max-width: 500px;
`;

const ProfileInput = styled.input`
  box-shadow: rgba(0, 0, 0, 0.11);
  border: none;
  background: #ffffff;
  border-radius: 3rem;
  height: 3rem;
  width: 100%;
  outline: none;
  font-family: 'Montserrat', sans-serif;
  padding: 0 3rem;
  font-size: 1rem;

  @media (min-width: 1100px) {
    padding: 0 5rem;
  }
`;

const ProfileName = styled(ProfileInput)`
  all: unset;
  margin: 0.3rem 0;
  font-weight: 600;
  width: 100%;
`;

const ProfileEmail = styled(ProfileName)`
  font-weight: 500;
`;

const ProfileFieldActive = styled(ProfileName)`
  background-color: rgba(44, 44, 44, 0.1);
`;

const CreateListing = styled(Link)`
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 0.25rem 1rem;
  box-shadow: rgba(0, 0, 0, 0.2);
  margin-top: 2rem;
  font-weight: 600;
  max-width: 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function Profile() {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  const logOut = () => {
    auth.signOut();
    navigate('/');
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        const userRef = doc(db, 'users', auth.currentUser.uid);

        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error('Could not update profile details');
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <ProfileWrapper>
      <ProfileHeader>
        <PageHeader>My Profile</PageHeader>
        <LogoutBtn type='button' onClick={logOut}>
          Logout
        </LogoutBtn>
      </ProfileHeader>

      <main>
        <ProfileDetailsHeader>
          <ProfileDetailsText>Personal Details</ProfileDetailsText>
          <ChangePersonalDetails
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </ChangePersonalDetails>
        </ProfileDetailsHeader>

        <ProfileCard>
          <form>
            {!changeDetails ? (
              <ProfileName
                type='text'
                id='name'
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
              />
            ) : (
              <ProfileFieldActive
                type='text'
                id='name'
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
              />
            )}
            {!changeDetails ? (
              <ProfileEmail
                type='text'
                id='email'
                disabled={!changeDetails}
                value={email}
                onChange={onChange}
              />
            ) : (
              <ProfileFieldActive
                type='text'
                id='email'
                disabled={!changeDetails}
                value={email}
                onChange={onChange}
              />
            )}
          </form>
        </ProfileCard>

        {auth.currentUser.metadata.createdAt === '1656428823385' ? (
          <>
            <CreateListing to='/create-product'>
              <img src={homeIcon} alt='home' />
              <p>Create listing</p>
              <img src={arrowRight} alt='arrow right' />
            </CreateListing>
            <CreateListing to='/create-news'>
              <img src={homeIcon} alt='home' />
              <p>Create news</p>
              <img src={arrowRight} alt='arrow right' />
            </CreateListing>
          </>
        ) : (
          <></>
        )}
      </main>
    </ProfileWrapper>
  );
}
