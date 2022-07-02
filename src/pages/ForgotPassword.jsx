import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import styled from 'styled-components';

const PageContainer = styled.div`
  margin: 1rem;

  @media (min-width: 1024px) {
    margin: 3rem;
  }
`;

const PageHeader = styled.p`
  font-size: 2rem;
  font-weight: 800;
`;

const ForgotPasswordInput = styled.input`
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

const ForgotInput = styled(ForgotPasswordInput)`
  margin-bottom: 2rem;
  background: url('./assets/svg/personIcon.svg') #ffffff 2.5% center no-repeat;
`;

const ForgotBar = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: inherit;

  @media (min-width: 1024px) {
    justify-content: start;
  }
`;

const ForgotText = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
`;

const ForgotButton = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  background-color: #00cc66;
  border-radius: 50%;

  @media (min-width: 1024px) {
    margin-left: 3rem;
  }
`;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      await sendPasswordResetEmail(auth, email);

      toast.success('Email was send');

      navigate('/sign-in');
    } catch (error) {
      toast.error('Could not send reset email');
    }
  };

  return (
    <PageContainer>
      <header>
        <PageHeader>Forgot Password</PageHeader>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <ForgotInput
            type='email'
            placeholder='Email'
            id='email'
            value={email}
            onChange={onChange}
          />

          <ForgotBar>
            <ForgotText>Send Reset Link</ForgotText>
            <ForgotButton>
              <ArrowRightIcon fill='#fff' width='34px' height='34px' />
            </ForgotButton>
          </ForgotBar>
        </form>
      </main>
    </PageContainer>
  );
}
