import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingSpinnerContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingSpinner = styled.div`
  width: 64px;
  height: 64px;
  border: 8px solid;
  border-color: #00cc66 transparent #00cc66 transparent;
  border-radius: 50%;
  animation: ${spin} 1.2s linear infinite;
`;

function Spinner() {
  return (
    <LoadingSpinnerContainer>
      <LoadingSpinner />
    </LoadingSpinnerContainer>
  );
}

export default Spinner;
