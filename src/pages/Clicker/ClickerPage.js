import React from "react";
import ClickerView from "./ClickerView";
import backgroundImageClicker from '../../assets/images/clicker-character/clickerBg.png';
import '../../styles/globals.css';

function ClickerPage() {
  return (
    <div
      className="w-full mx-auto bg-clicker-game bg-no-repeat bg-cover h-screen relative cursor-pointer -z-99"
      style={{
        backgroundImage: `url(${backgroundImageClicker})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex items-center justify-center h-full gap-4">
        
        <ClickerView />

      </div>
    </div>
  );
}

export default ClickerPage;
