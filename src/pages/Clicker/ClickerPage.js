import React from "react";
import ClickerView from "./ClickerView";
import Header from "../../components/Header.jsx";
import { useMobileMenuOpen } from '../../sagaStore/slices';

function ClickerPage() {
  const mobileMenuOpen = useMobileMenuOpen();

  return (
    <div
      className="w-full mx-auto bg-clicker-game bg-no-repeat bg-cover h-screen relative -z-99"
      style={{
        backgroundImage: `url(/assets/images/clicker-character/clickerBg.webp)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
          
      <Header />

      <div className={`flex items-center justify-center h-full gap-4 ${mobileMenuOpen ? `hidden` : ``}`}>
        <ClickerView />
      </div>
    </div>
  );
}

export default ClickerPage;
