import React, { useState } from 'react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

function DataA() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [apiResponse, setApiResponse] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file is an Excel file
      if (/\.(xls|xlsx)$/i.test(file.name)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          // Assuming the first sheet is the target sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const csvData = XLSX.utils.sheet_to_csv(worksheet);
          // Create a Blob from the CSV data
          const csvBlob = new Blob([csvData], { type: 'text/csv' });
          // Update the file state to the new CSV Blob
          setFile(new File([csvBlob], "converted.csv", { type: 'text/csv' }));
        };
        reader.readAsBinaryString(file);
      } else {
        setFile(file);
      }
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async () => {
    if (!file) {
      Swal.fire('Error', 'Please select a CSV file.', 'error');
      return;
    }
  
    // Show loading Swal
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we analyze your data.',
      icon: 'info',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);
    formData.append('description', description);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api-connector/analysis/', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setApiResponse(data.message);
  
      // Close the loading Swal and show success message
      Swal.fire('Success!', 'Data processed successfully.', 'success');
    } catch (error) {
      console.error('Error:', error);
  
      // Close the loading Swal and show error message
      Swal.fire('Error', 'Failed to process data.', 'error');
    }
  };
  

  return (
    <div className="p-10">
      <h2 className="text-2xl font-semibold mb-4">Data Analysis</h2>

      <div>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".csv"
          className="mb-4"
        />
        <textarea 
          placeholder="Enter description" 
          value={description}
          onChange={handleDescriptionChange}
          className="w-full p-2 border border-gray-300 mb-4"
        />
        <textarea 
          placeholder="Enter prompt" 
          value={prompt}
          onChange={handlePromptChange}
          className="w-full p-2 border border-gray-300 mb-4"
        />
        <button 
          onClick={handleSubmit}
          className="bg-blue-500 text-white rounded px-6 py-3 hover:bg-blue-600"
        >
          Analyze Data
        </button>
      </div>

      {apiResponse && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">API Response:</h3>
          <div className="bg-gray-100 p-3 rounded">
            {apiResponse}
          </div>
        </div>
      )}
    </div>
  );
}

export default DataA;
