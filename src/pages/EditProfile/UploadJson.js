import React, { useState } from 'react';
import { uploadJsonToFirestore } from '../../firebase/firebaseConfig';

const UploadButton = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }
  
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const jsonContent = JSON.parse(event.target.result);
  
        // Check if jsonContent is an array and contains objects
        try {
          const result = await uploadJsonToFirestore(jsonContent);
          console.log(result);
  
          if (result.data.success) {
            alert('File uploaded successfully!');
          } else {
            alert('Failed to upload file.');
          }
        } catch(e) {
          alert(e);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };
  

  return (
    <div>
      <input type="file" accept=".json" onChange={handleFileChange} />
      <button
        className={`w-[200px] h-[60px] rounded-[26px] justify-between items-center inline-flex bg-amber-400}`}
        onClick={handleUpload}
      >
        <div className={`w-[200px] h-[60px] px-[30px] py-5 rounded-[26px] border border-orange-300 justify-between items-center flex bg-amber-300`}>
          <div className="text-center text-white text-xl font-bold capitalize leading-tight">
            Upload
          </div>
        </div>
      </button>
    </div>
  );
};

export default UploadButton;
