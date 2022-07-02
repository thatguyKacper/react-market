import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
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

const SigninInput = styled.input`
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
  margin-bottom: 2rem;

  @media (min-width: 1100px) {
    padding: 0 5rem;
  }
`;

const EmailInput = styled(SigninInput)`
  background: url('./assets/svg/personIcon.svg') #ffffff 2.5% center no-repeat;
`;

const PasswordInputDiv = styled.div`
  position: relative;
`;

const PasswordInput = styled(SigninInput)`
  background: url('./assets/svg/lockIcon.svg') #ffffff 2.5% center no-repeat;
`;

const ShowPassword = styled.img`
  cursor: pointer;
  position: absolute;
  top: -4%;
  right: 1%;
  padding: 1rem;
`;

const ForgotPasswordLink = styled(Link)`
  cursor: pointer;
  color: #00cc66;
  font-weight: 600;
  text-align: right;
`;

const SignInBar = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: inherit;

  @media (min-width: 1024px) {
    justify-content: start;
  }
`;

const SignInText = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
`;

const SignInButton = styled.button`
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

const RegisterLink = styled(Link)`
  margin-top: 4rem;
  color: #00cc66;
  font-weight: 600;
  text-align: center;
  margin-bottom: 3rem;
`;

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        navigate('/');
      }
    } catch (error) {
      toast.error('Bad User Credentials');
    }
  };

  return (
    <>
      <PageContainer>
        <header>
          <PageHeader>Welcome Back!</PageHeader>
        </header>

        <form onSubmit={onSubmit}>
          <EmailInput
            type='email'
            placeholder='Email'
            id='email'
            value={email}
            onChange={onChange}
          />
          <PasswordInputDiv>
            <PasswordInput
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              id='password'
              value={password}
              onChange={onChange}
            />
            <ShowPassword
              src={visibilityIcon}
              alt='show password'
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
            <ForgotPasswordLink to='/forgot-password'>
              Forgot Password
            </ForgotPasswordLink>

            <SignInBar>
              <SignInText>Sign in</SignInText>
              <SignInButton>
                <ArrowRightIcon fill='#fff' width='34px' height='34px' />
              </SignInButton>
            </SignInBar>
          </PasswordInputDiv>
        </form>

        <RegisterLink to='/sign-up'>Sign Up Instead</RegisterLink>
      </PageContainer>
    </>
  );
}
