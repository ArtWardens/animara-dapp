import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const DynamicNumberDisplay = ({ number, divClassName, imgSrc, imgClassName, spanClassName }) => {
  const containerRef = useRef(null); // Reference to the component container
  const [showFullNumber, setShowFullNumber] = useState(true); // Track whether to show full or short form

  // Function to format numbers into short forms
  const formatNumber = (num) => {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(2) + 'B';
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'M';
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(2) + 'K';
    } else {
      return num.toString();
    }
  };

  // Format the number with commas for better readability
  const formatFullNumber = (num) => {
    return num?.toLocaleString();
  };

  // Check the available space and decide whether to show full or short number
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const fullNumberWidth = containerRef.current.scrollWidth;

        // If the full number fits, show it; otherwise, show short form
        if (fullNumberWidth > containerWidth) {
          setShowFullNumber(false);
        } else {
          setShowFullNumber(true);
        }
      }
    };

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize); // Check on window resize

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className={`${divClassName || "flex items-center space-x-2"}`}>
      {/* Currency Icon */}
      <img src={`${imgSrc || "/assets/images/coin.webp"}`} alt="coin" className={`${imgClassName || "w-5 h-5 mr-2"}`} />

      {/* Display number based on available space */}
      <span className={`${spanClassName || "text-xl font-bold text-gray-800"}`}>
        {showFullNumber ? formatFullNumber(number) : formatNumber(number)}
      </span>
    </div>
  );
};

// PropTypes for validation
DynamicNumberDisplay.propTypes = {
  number: PropTypes.number.isRequired,
  divClassName: PropTypes.string,
  imgSrc: PropTypes.string,
  imgClassName: PropTypes.string,
  spanClassName: PropTypes.string,
};

export default DynamicNumberDisplay;
