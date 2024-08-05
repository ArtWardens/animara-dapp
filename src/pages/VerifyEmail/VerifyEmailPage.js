import React from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyEmailPage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className='flex flex-col justify-center items-center w-screen h-screen'>
      <div className='flex justify-center items-center mb-4'>
        <h1 className='text-4xl md:text-6xl lg:text-9xl font-semibold text-center'>Please Verify Your Email</h1>
      </div>

      <div className='flex justify-center items-center'>
        <p className='text-center'>If you have already verified your email, <span onClick={handleLoginRedirect} className='text-blue-500 cursor-pointer'>click here</span> to proceed to the login page.</p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
