// // components/UploadForm.js
// import { useState } from 'react';

// export default function UploadForm({ onUpload }) {
//   const [file, setFile] = useState(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('file', file);

//     const response = await fetch('/api/upload', {
//       method: 'POST',
//       body: formData,
//     });

    

//     const data = await response.json();
//     // console.log(`data from uploadform : ${JSON.stringify(data)}`);
//     onUpload(data);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="file" onChange={handleFileChange} />
//       <button type="submit">Upload</button>
//     </form>
//   );
// }


import { useState, useRef } from "react";

export default function UploadForm({ onUpload }) {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      handleSubmit(e.target.files[0]);
    }
  };

  const handlePaste = (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.includes("image")) {
        const blob = item.getAsFile();
        setFile(blob);
        handleSubmit(blob);
        break;
      }
    }
  };

  const handleSubmit = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    onUpload(data);
  };

  const triggerFileSelect = () => fileInputRef.current.click();

  return (
    <div
      onClick={triggerFileSelect}
      onPaste={handlePaste}
      tabIndex="0"
      className="flex w-60 h-60 justify-center items-center  border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {!file && (
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16l-3-3m0 0l3-3m-3 3h18m-9 9V9m0 12l3-3m-3 3l-3-3"
          ></path>
        </svg>
      )}
      {file && (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="max-h-[200px] w-auto border-2 border-blue-500 rounded"
        />
      )}
    </div>
  );
}
