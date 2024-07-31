import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom/dist";

function Header({ currentUser }) {

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const trigger = useRef(null);

  const handleButtonClick = (link) => {
    if (link) {
      navigate(link);
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const buttons = [
    { name: 'AMIPALS', link: '/clicker' },
    { name: 'EARLY BIRD', link: '/early-bird' },
    { name: 'MINT', link: '/mint' },
    { name: 'REFERRAL', link: '/referral' },
    { name: 'LOCK', link: '/amipals-lock' }
  ];

  const [imageSrcLogout, setImageSrcLogout] = useState("../assets/images/clicker-character/logout.png");
  const handleMouseEnterLogout = () => setImageSrcLogout("../assets/images/clicker-character/logout-hover.png");
  const handleMouseLeaveLogout = () => setImageSrcLogout("../assets/images/clicker-character/logout.png");

  // Function to format number with commas
  const formatNumberWithCommas = (number) => {
    return number ? number.toLocaleString() : '0';
  };

  return (
    <>
      <div
        className="flex flex-row absolute top-8 z-10 p-1 pr-8 gap-2 left-24"
        style={{
          border: '3px solid #F4FBFF',
          borderRadius: '500px 200px 200px 500px',
          background: 'var(--0163BE, #0163BE)',
          boxShadow: '3px 2px 0px 0px #517296 inset',
          zIndex: 91,
        }}
      >
        <div className="p-1 w-20 h-20">
          <a onClick={handleEditProfile}>
            <img
              src={"../assets/images/clicker-character/2-initial.png"}
              alt="profile"
              className="justify-self-center rounded-full w-24 cursor-pointer"
              style={{
                border: '4px solid var(--80E8FF, #80E8FF)',
                background: 'lightgray 50%',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </a>
        </div>

        <div className="flex flex-col place-content-center">
          <div className="font-outfit text-md">
            {currentUser?.name}
          </div>

          <div className="gap-2 flex">
            <img
              className="w-8 object-contain"
              src={"../assets/images/clicker-character/gem.png"}
              alt="gem"
            />
            <div className="relative flex items-center justify-center">
              <span
                className="relative text-3xl text-amber-500 tracking-normal"
                style={{
                  WebkitTextStrokeWidth: '1.75px',
                  WebkitTextStrokeColor: 'var(--Color-11, #FFF)'
                }}
              >
                {formatNumberWithCommas(currentUser?.coins)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex absolute top-12 gap-2 right-24 z-96 items-center"
        style={{
          zIndex: 91,
        }}
      >
        {buttons.map(({ name, link }) => (
          <button
            key={name}
            onClick={() => handleButtonClick(link)}
            className={`flex w-[146px] h-[60px] p-5 justify-center items-center gap-1.5 rounded-[10px] border border-[#E59E69] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset,0px_4px_4px_0px_rgba(136,136,136,0.48)] bg-[#FFB23F] hover:bg-[#FFDC62] hover:pl-[24px] hover:pr-[20px] hover:border-1 hover:border-[#E59E69] hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] hover:rotate-6 hover:scale-105 transition-transform duration-300 ease-in-out ${currentPath === link ? 'transform rotate-6 bg-[#FFDC62]' : ''}`}
          >
            <span className="text-center text-white text-xl font-normal font-['Luckiest_Guy'] capitalize leading-[18px]">{name}</span>
          </button>
        ))}

        <button
          className="transition ease-in-out p-2 hover:scale-105"
          onMouseEnter={handleMouseEnterLogout}
          onMouseLeave={handleMouseLeaveLogout}
          ref={trigger}
        >
          <img
            src={imageSrcLogout}
            className="h-full w-full"
            alt="logout"
          />
        </button>
      </div>
    </>
  );
}

Header.propTypes = {
    currentUser: PropTypes.object, 
    totalClicks: PropTypes.number
  }

export default Header;
