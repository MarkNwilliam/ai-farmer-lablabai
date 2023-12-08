//AIzaSyA3YVLTGuGesO27kFo1QGZq-lPNebj3ihg
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import Swal from 'sweetalert2';

const containerStyle = {
  width: '100%',
  height: '50vh'


};

function HomeDashboard() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selected, setSelected] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [apiResponse, setApiResponse] = useState(''); 
  const [address, setAddress] = useState(''); 


  useEffect(() => {
    // This effect will run every time the `address` state changes
    if (address) {
        localStorage.setItem('address', address);
    }
}, [address]);

  // Function to format soil data for display
  const formatSoilData = (data) => {
    if (!data || !data.properties || !data.properties.layers) return 'No data available';

    return data.properties.layers.map(layer => {
      return `${layer.name}: ${layer.depths.map(depth => 
        `${depth.label} - Mean: ${depth.values.mean}, Uncertainty: ${depth.values.uncertainty}`).join(', ')}\n`;
    }).join('\n');
  };

  const displayKeySoilData = (data) => {
    if (!data || !data.properties || !data.properties.layers) {
      return 'No data available';
    }
  
    // Define key properties to display
    const keyProperties  = ['bdod', 'cec', 'cfvo', 'clay', 'nitrogen', 'ocd', 'ocs', 'phh2o', 'sand', 'silt', 'soc', 'wv0010', 'wv0033', 'wv1500'];
    return keyProperties.map(property => {
      const layer = data.properties.layers.find(layer => layer.name === property);
      if (layer && layer.depths[0].values.mean !== null) {
        return `${property.toUpperCase()} - Mean: ${layer.depths[0].values.mean}`;
      }
      return null; // Return null if the mean value is not available
    }).filter(Boolean).join('\n'); // Filter out null values and join the rest
  };
  
  
 // Function to handle text input change
 const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendClick = async () => {
    Swal.fire({
        title: 'Fetching soil data...',
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
        body: JSON.stringify({ message: "So this is the user prompt: "+inputValue+" and here is the users location: "+address }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.message)
     
      setApiResponse(data.message); // Store the response data in state
      setInputValue(''); // Clear the input field
      console.log(apiResponse)
      Swal.fire({
        title: 'Success!',
        text: 'Check it out',
        icon: 'success',
      }).then(() => {
        setApiResponse(data); // Update the response after Swal closes
      });
      console.log(apiResponse)
    } catch (error) {
      console.error("Error sending message: ", error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to send message.',
        icon: 'error',
      });
    }
  };

 // Function to fetch soil data
 const fetchSoilData = async (latitude, longitude) => {

    console.log(latitude)
    console.log(longitude)
    Swal.fire({
      title: 'Fetching soil data...',
      text: 'Please wait.',
      icon: 'info',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${longitude}&lat=${latitude}`;
      const response = await fetch(url);
     console.log(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
     
      setSoilData(displayKeySoilData(data));

      Swal.fire({
        title: 'Success!',
        text: 'Soil data fetched successfully.',
        icon: 'success'
      });
    } catch (error) {
      console.error("Error fetching soil data: ", error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch soil data.',
        icon: 'error'
      });
    }
  };

  const handleMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setCurrentPosition({ lat: latitude, lng: longitude });
        setSelectedLocation({ lat: latitude, lng: longitude });
  
        // Call the reverse geocoding API
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA3YVLTGuGesO27kFo1QGZq-lPNebj3ihg`;
        try {
          const response = await fetch(geocodeUrl);
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            // Get the formatted address from the first result
            setAddress(data.results[0].formatted_address)
            console.log("Location name:", address);
            // You can also set this address to a state or display it in your component
          }
        } catch (error) {
          console.error("Error fetching location name: ", error);
        }
      },
      (error) => {
        console.error('Error getting geolocation', error);
      }
    );
  };
  

  const onSelect = item => {
    setSelected(item);
  };

  // Function to handle fetching data for a new location
  const handleFetchData = () => {
    if (selectedLocation) {
      fetchSoilData(selectedLocation.lat, selectedLocation.lng);
    }
  };

  return (
    <div className="main-content">
    <LoadScript googleMapsApiKey="AIzaSyA3YVLTGuGesO27kFo1QGZq-lPNebj3ihg">
      <GoogleMap 
        mapContainerStyle={containerStyle} 
        center={currentPosition || { lat: 0, lng: 0 }} 
        zoom={10} 
        onClick={(e) => setSelectedLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
      >
        {selectedLocation && (
          <Marker position={selectedLocation} onClick={() => onSelect(selectedLocation)} />
        )}
        {selected && (
          <InfoWindow position={selected} onCloseClick={() => setSelected(null)}>
            <div>
              <h3>You are here!</h3>
              <p>Soil Data:</p>
              <pre>{formatSoilData(soilData)}</pre>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
    </LoadScript>

    <div className="mt-4 flex gap-2">
        <button 
          onClick={handleMyLocation}
          className="bg-green-500 text-white rounded px-6 py-3 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          My Location
        </button>
        <button 
          onClick={handleFetchData}
          className="bg-green-500 text-white rounded px-6 py-3 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Get Data for Selected Location
        </button>
      </div>

      <div className="mt-4 soil-data-display">
        <h3 className="text-lg font-semibold">Soil Data:</h3>
        <pre className="bg-gray-100 p-3 rounded">{soilData}</pre>
      </div>


      <div className="mt-4 flex gap-2">
        <input 
          type="text" 
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter text here"
          className="p-3 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button 
          onClick={handleSendClick}
          className="bg-green-500 text-white rounded px-6 py-3 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Send
        </button>
      </div>

      <div className="mt-4">
  <h3 className="text-lg font-semibold">API Response:</h3>
  <div className="bg-gray-100 p-3 rounded max-w-xl mx-auto whitespace-pre-wrap"> {/* Use whitespace-pre-wrap for natural breaks */}
    {apiResponse.message} {/* Display the response message directly */}
  </div>
</div>
 

</div>
  );
}

export default HomeDashboard;
