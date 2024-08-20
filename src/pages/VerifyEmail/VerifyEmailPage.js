import React from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyEmailPage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Background pattern */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: "url('/assets/images/background-pattern.png')",
          backgroundSize: '2000',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />

      {/* Logo */}
      <div className="absolute top-5 left-5">
        <img 
          src="/assets/icons/logo.png" 
          alt="Anipara Logo" 
          className="h-8 w-auto"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full">
        <div className="bg-[#161B1F] p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
          {/* logo */}
          <div className="flex justify-center items-center mb-6">
            <img 
              src="/assets/icons/verify-email.png"
              alt="limited access"
              className="w-24 h-24"
            />
          </div>
          <h2 
            className="text-amber-500 text-4xl font-bold mb-4">
            Please verify your email
          </h2>
          <p className="text-slate-200">
            If you already verified your email, {' '}
            <span onClick={handleLoginRedirect} className='text-blue-500 cursor-pointer'>
              CLICK HERE
            </span>
            {' '} to proceed to the login page.
          </p>
        </div>
      </div>

    </div>
  );
};

export default VerifyEmailPage;
