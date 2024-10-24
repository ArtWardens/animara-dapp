import React, { useEffect, useRef } from "react";
import ClickerView from "./ClickerView";
import Header from "../../components/Header.jsx";
import { useMobileMenuOpen } from '../../sagaStore/slices';

function ClickerPage() {
  const mobileMenuOpen = useMobileMenuOpen();
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
    }
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-between w-full h-full bg-no-repeat bg-cover bg-clicker-game"
      style={{
        backgroundImage: `url(/assets/images/clicker-character/clickerBg.webp)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '100vh',  
        overflow: 'hidden', 
      }}
    >
      <Header />

      {/* Audio component with volume set via ref */}
      {/* <audio 
        ref={audioRef} 
        src="https://storage.animara.world/Beats%20of%20the%20Islands%20-%20Yaland%20Vibes.mp3" 
        autoPlay 
        loop 
      /> */}
      
      {/* Main content area */}
      <div className={`absolute -bottom-0 flex flex-col items-center justify-end  w-full h-full ${mobileMenuOpen ? `hidden` : ``}`}>
        <ClickerView />
      </div>
    </div>
  );
}



export default ClickerPage;
