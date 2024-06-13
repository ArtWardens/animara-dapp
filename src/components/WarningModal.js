import React, { useEffect } from 'react';

const WarningModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 overflow-y-auto z-[1000]">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black bg-light opacity-[50%]"></div>
            <div className="z-50 bg-white h-[250px] p-3 mx-2 md:mx-0 rounded-[30px] shadow">
              <div className="flex justify-end w-[800px]">
                <button onClick={onClose} className="text-white rounded-full">
                  <img
                  src={"/assets/images/x.png"}
                  width={50}
                  height={50}
                  alt='x'
                  />
                </button>
              </div>
              <div className="mt-4 w-full h-full flex justify-center ">
                <h1>Game Has been reset</h1>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WarningModal;