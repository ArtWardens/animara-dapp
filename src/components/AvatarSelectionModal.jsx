import React, { useState } from 'react';

// const selectAvatarApi = async (avatarUrl) => {
//   try {
//     const response = await fetch('/api/select-avatar', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ avatarUrl }), 
//     });

//     if (!response.ok) {
//       throw new Error('Failed to select avatar');
//     }

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error('Error selecting avatar:', error);
//   }
// };

const AvatarSelectionModal = ({ isOpen, onClose, onAvatarSave }) => {
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null); 

  const avatars = [
    '/assets/images/avatarBg.webp', 
    '/assets/images/activeDog.webp', 
    '/assets/images/activeDog.webp', 
    '/assets/images/activeDog.webp', 
    '/assets/images/activeDog.webp', 
    '/assets/images/activeDog.webp', 
    '/assets/images/activeDog.webp', 
    '/assets/images/activeDog.webp', 
    '/assets/images/activeDog.webp', 
    '/assets/images/activeDog.webp', 
    '/assets/images/activeDog.webp', 
  ];

  if (!isOpen) return null;

  const handleAvatarClick = (index) => {
    setSelectedAvatarIndex(index); 
  };

  const handleSaveChanges = async () => {
    if (selectedAvatarIndex !== null) {
      const selectedAvatar = avatars[selectedAvatarIndex];
      onAvatarSave(selectedAvatar); 
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedAvatarIndex(null); 
    onClose(); 
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-[1000]" 
      onClick={handleClose} 
    >
      <div 
        className="relative w-full max-w-[95vw] p-6 rounded-lg shadow-lg sm:max-w-[80vw] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[900px]"
        style={{
          backgroundImage: 'url("/assets/images/avatarBg.webp")',
          backgroundPosition: "center",
          backgroundRepeat: 'no-repeat', 
        }}
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Close Button */}
        <button
          className="absolute w-8 h-8 text-2xl text-white top-3 right-3 hover:brightness-75"
          onClick={handleClose} 
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="mb-4 text-2xl font-bold text-center text-yellow-500 uppercase">
          Profile Image
        </h2>

        {/* Avatars Grid */}
        <div className="grid grid-cols-3 gap-4 md:grid-cols-5 lg:grid-cols-5 max-h-[300px] md:max-h-[400px] lg:max-h-[500px] overflow-y-auto p-2">
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className={`w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full cursor-pointer border-2 ${
                selectedAvatarIndex === index ? 'border-yellow-500' : 'border-transparent' 
              }`}
              onClick={() => handleAvatarClick(index)} 
            />
          ))}
        </div>

        {/* Save Changes Button */}
        <div className="mt-6 text-center">
          <button
            className="px-6 py-2 text-white transition-all bg-yellow-500 rounded-[20px] hover:bg-yellow-600"
            onClick={handleSaveChanges} 
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelectionModal;
