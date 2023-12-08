import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import videoSrc from '../videos/winery.mp4';
import { useNavigate } from 'react-router-dom';

function Home() {

    const navigate = useNavigate(); // Initialize navigate function

    const handleButtonClick = () => {
      navigate('/dashboard'); // Navigate to Dashboard on button click
    };
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Video with z-index lower than the overlay */}
      <video autoPlay loop muted className="absolute z-10 w-auto min-w-full min-h-full max-w-none">
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Black Overlay with higher z-index than the video but lower than the content */}
   

        {/* Text Content with the highest z-index */}
        <div className="content z-20 absolute p-5 text-white flex flex-col items-center justify-center h-full w-full">
        <div className="text-center">
          {/* Header and Type Animation */}
          <h1 className="text-5xl font-bold mb-3">Welcome to EcoGrowAI: the future of your farm</h1>
          <TypeAnimation
            sequence={[
              'Analyse your farm output',
              1000, // Delay
              'Plan for your farm output',
              1000,
              'Analyse your feed and animal health',
              1000,
              'Analyse your finances like a pro',
              1000,
              // Restart the animation
            ]}
            wrapper="span"
            speed={50}
            style={{ fontSize: '2em' }}
            repeat={Infinity}
          />
        </div>

        {/* Button placed outside the text centering div */}
        <button className="mt-5 bg-transparent hover:bg-white text-white font-semibold hover:text-black py-2 px-4 border border-white hover:border-transparent rounded-full"  onClick={handleButtonClick}>
          Let's Start
        </button>
      </div>
    </div>
  );
}

export default Home;
