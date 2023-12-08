import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';


function ReportsDashboard() {
    const [prompt, setPrompt] = useState('');
    const [csvData, setCsvData] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [address, setAddress] = useState(''); // State for the address

    useEffect(() => {
        // Retrieve the address from local storage when the component mounts
        const storedAddress = localStorage.getItem('address');
        if (storedAddress) {
            setAddress(storedAddress);
        }
    }, []);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSendClick = async () => {
    // Combine the prompt and csvData into a single string
    const combinedMessage = `Prompt: ${prompt}\nCSV Data for analysis: ${csvData}\n location: ${address}`;
  
    // Show loading Swal
    Swal.fire({
      title: 'Sending Data...',
      text: 'Please wait.',
      icon: 'info',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api-connector/aichat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: combinedMessage }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Close the loading Swal and show the success message
      Swal.fire({
        title: 'Success!',
        text: 'Data sent successfully.',
        icon: 'success'
      });
  
      setAiResponse(data.message);
    } catch (error) {
      console.error("Error sending data: ", error);
  
      // Close the loading Swal and show the error message
      Swal.fire({
        title: 'Error',
        text: 'Failed to send data.',
        icon: 'error'
      });
  
      setAiResponse("Failed to send data.");
    }
  };
  

  const handleFileUpload = (event) => {
    // Logic to handle file upload
    console.log('File uploaded:', event.target.files[0]);
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-5">Analysis</h2>

      <div>
        <input 
          type="file" 
          onChange={handleFileUpload} 
          className="mb-5"
        />
      </div>

      <div className="mb-5">
        <input 
          type="text" 
          value={prompt} 
          onChange={handlePromptChange} 
          placeholder="Enter prompt here"
          className="p-3 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
        />
        <button 
          onClick={handleSendClick}
          className="bg-green-500 text-white rounded px-6 py-3 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Send
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">AI Response:</h3>
        <div className="bg-gray-100 p-3 rounded max-w-xl mx-auto whitespace-pre-wrap">
          {aiResponse}
        </div>
      </div>
    </div>
  );
}

export default ReportsDashboard;
