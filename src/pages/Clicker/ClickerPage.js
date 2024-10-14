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
      className="w-full mx-auto bg-clicker-game bg-no-repeat bg-cover min-h-screen relative -z-99"
      style={{
        backgroundImage: `url(/assets/images/clicker-character/clickerBg.webp)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
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

      <div className={`flex items-start justify-center h-full gap-4 xl:mt-[-2rem] ${mobileMenuOpen ? `hidden` : ``}`}>
        <ClickerView />
      </div>
    </div>
  );
}

export default ClickerPage;
