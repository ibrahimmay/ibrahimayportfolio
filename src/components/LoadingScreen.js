import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prevProgress + 2;
        });
      }, 50);

      return () => clearInterval(timer);
    }
  }, [isLoading]);

  return (
    <div className={`loading-screen ${!isLoading ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${progress}%` }}></div>
          <div className="loading-text">{progress}%</div>
        </div>
        <div className="name-container">
          <h1 className="loading-name">İBRAHİM AY</h1>
          <div className="loading-line"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 