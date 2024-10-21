import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom/dist';
import { MoonLoader } from 'react-spinners';
import { logOut, useUserDetails, useLocalCoins, setMobileMenuOpen, useMobileMenuOpen } from '../sagaStore/slices';
import DynamicNumberDisplay from './DynamicNumberDisplay';

function Header() {
  const mobileMenuOpen = useMobileMenuOpen();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;
  const currentUser = useUserDetails();
  const localCoins = useLocalCoins();
  const trigger = useRef(null);
  const coinsDisplayRef = useRef(null);

  // navigation bar setup
  const navDestinations = [
    { name: 'ANITAP', link: '/anitap' },
    { name: 'MINT', link: '/mint' },
    { name: 'REFERRAL', link: '/referral' },
  ];
  const handleButtonClick = (link) => {
    dispatch(setMobileMenuOpen(false));
    if (link) {
      navigate(link);
    }
  };
  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  // setup logout button
  const [imageSrcLogout, setImageSrcLogout] = useState('/assets/images/clicker-character/logout.webp');
  const handleMouseEnterLogout = () => setImageSrcLogout('/assets/images/clicker-character/logout-hover.webp');
  const handleMouseLeaveLogout = () => setImageSrcLogout('/assets/images/clicker-character/logout.webp');

  const handleLogout = () => {
    dispatch(logOut());
  };

  // State for loading profile image
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const adjustFontSize = () => {
      const element = coinsDisplayRef.current;
      const containerWidth = element.parentElement.offsetWidth;
      let newFontSize = 36;

      element.style.fontSize = `${newFontSize}px`;

      while (element.scrollWidth > containerWidth && newFontSize > 12) {
        newFontSize -= 1;
        element.style.fontSize = `${newFontSize}px`;
      }
    };

    adjustFontSize();
  }, [localCoins]);

  // Function to format number with commas
  const formatNumberWithCommas = (number) => {
    return number ? number?.toLocaleString() : '0';
  };

  const getProfilePic = useCallback(() => {
    // use placeholder image if user not loaded yet
    if (!currentUser) {
      return '/assets/images/activeDog.webp';
    }

    // get user profile picture
    let photoUrl = currentUser.photoUrl;

    // returns placeholder if profile picture is not set yet
    if (photoUrl === '') {
      photoUrl = '/assets/images/activeDog.webp';
    }

    // process google user content
    if (photoUrl.indexOf('googleusercontent.com') !== -1) {
      photoUrl = `${photoUrl}?alt=media`;
    }

    return photoUrl;
  }, [currentUser]);

  return (
    <div className="w-full container pb-52">
      {/* User Card */}
      <div
        className={`flex flex-row absolute md:min-w-[300px] lg:min-w-[300px] max-w-[70dvw] top-[4rem] z-10 lg:ml-14 p-1 pr-2 gap-2 lg:scale-[120%]
          ${currentUser?.ownsNFT && currentUser?.walletAddr !== '' ? 'glowing-border left-[2rem] xl:left-[6rem]' : 'default-border left-[1rem] xl:left-[5rem]'} 
          ${mobileMenuOpen ? 'hidden' : ''}`}
      >
        {/* profile picture */}
        <div className={`w-28 h-28 absolute -top-[18px] -left-4 flex justify-center items-center
          ${currentUser?.ownsNFT && currentUser?.walletAddr !== '' ? 'nft-profile-border' : 'profile-border'}
        `}>
          <button onClick={handleEditProfile} className="group relative ">
            {loadingImage && (
              <div className="h-18 flex justify-center items-center bg-[#003459] rounded-full">
                <MoonLoader color={'#FFFFFF'} />
              </div>
            )}
            <img
              src={getProfilePic()}
              alt="profile"
              className="justify-self-center rounded-full w-16 group-hover:brightness-[0.55] transition-all duration-300"
              style={{
                background: '#111928 50%',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                display: loadingImage ? 'none' : 'block',
              }}
              onLoad={() => setLoadingImage(false)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/images/activeDog.webp';
                setLoadingImage(false);
              }}
            />
            <img
              src="/assets/icons/edit.webp"
              alt="edit"
              className="invisible group-hover:visible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white fill-white"
            />
          </button>
        </div>

        <div className="flex-none w-12">
        </div>
        {/* user details */}
        <div className="flex flex-col place-content-center flex-grow">
          <div className={`pt-1 pl-10 font-LuckiestGuy text-md flex user-detail-1
            ${currentUser?.ownsNFT && currentUser?.walletAddr !== '' ? 'bg-[#573A00]' : 'bg-[#003459]'}
          `}>
            <p className="flex-1">{currentUser?.name || 'Animara User'}</p>
            <p className={`flex-1 ml-2 xs:ml-4 font-LuckiestGuy text-md text-right
              ${currentUser?.ownsNFT && currentUser?.walletAddr !== '' ? 'text-[#FFB23F]' : 'text-[#80E8FF]'}
            `}>LV.{currentUser?.level}</p>
          </div>

          <div className={`pb-1 pl-10 gap-1 xs:gap-2 flex user-detail-2
            ${currentUser?.ownsNFT && currentUser?.walletAddr !== '' 
              ? 'bg-gradient-to-l from-[#573A00] from-5% via-[#FFB800] via-90% to-[#FFFFFF]' 
              : 'bg-gradient-to-l from-[#003459] from-20% via-[#0032A1] via-40% to-[#2D72FF]'}
          `}>
            <img className="w-6 xs:w-8 object-contain" src={'/assets/images/clicker-character/gem.webp'} alt="gem" />
            <div className="relative flex items-center justify-center max-w-44">
              <span
                ref={coinsDisplayRef}
                id="header-coins"
                className="relative text-2xl xs:text-3xl text-[#FFC85A] font-LuckiestGuy tracking-normal w-full overflow-hidden text-left drop-shadow-md"
              >
                {formatNumberWithCommas(localCoins)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Bar */}
      <div
        className="hidden lg:flex absolute top-16 gap-2 right-[4rem] z-96 items-center"
        style={{
          zIndex: 91,
        }}
      >
        {navDestinations.map(({ name, link }) => (
          <button
            key={name}
            onClick={() => handleButtonClick(link)}
            className={`flex w-[146px] h-[60px] p-5 justify-center items-center gap-1.5 rounded-[10px] border border-[#E59E69] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset,0px_4px_4px_0px_rgba(136,136,136,0.48)] bg-[#FFB23F] hover:bg-[#FFDC62] hover:pl-[24px] hover:pr-[20px] hover:border-1 hover:border-[#E59E69] hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] hover:rotate-6 hover:scale-105 transition-transform duration-300 ease-in-out ${currentPath === link ? 'transform rotate-6 bg-[#FFDC62]' : ''}`}
          >
            <span className="text-center text-white text-xl capitalize leading-[18px]">{name}</span>
          </button>
        ))}

        <button
          className="transition ease-in-out p-2 hover:scale-105"
          onMouseEnter={handleMouseEnterLogout}
          onMouseLeave={handleMouseLeaveLogout}
          onClick={handleLogout}
          ref={trigger}
        >
          <img src={imageSrcLogout} className="h-full w-full" alt="logout" />
        </button>
      </div>

      {/* Mobile Hamburger Menu Button */}
      <button
        className="transition ease-in-out hover:scale-105 lg:hidden absolute top-[5rem] right-[2rem] xl:right-[4rem] z-50"
        onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
      >
        <svg
          className={`h-9 w-9 text-amber-500 ${mobileMenuOpen ? 'hidden' : 'block'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={'M4 6h16M4 12h16m-7 6h7'} />
        </svg>
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="h-full absolute inset-0 z-40 flex flex-col items-center justify-start py-[3rem] px-[4rem] overflow-hidden"
          style={{
            backgroundImage: 'url("/assets/images/clicker-character/clickerWall.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div
            className={`w-full flex flex-col 
            ${window.innerHeight < 768 ? 'space-y-2' : 'space-y-4'}  
          `}
          >
            <div className="w-full flex flex-row justify-between">
              <div className="flex items-center space-x-3">
                <a className="" href="https://animara.world" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/icons/logo.webp" alt="Animara Logo" className="h-12" />
                </a>
              </div>

              <button
                className="transition ease-in-out hover:scale-105 xl:hidden right-[3rem] xl:right-[4rem] z-50"
                onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
              >
                <svg
                  className="h-9 w-9 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={'M6 18L18 6M6 6l12 12'} />
                </svg>
              </button>
            </div>

            <div
              className={`w-full h-full text-center -z-50 py-[3rem] px-[1rem] scale-110
                bg-cover bg-no-repeat 
                md:bg-contain md:px-[3.5rem]
                lg:bg-contain
              `}
              style={{
                backgroundImage: 'url("/assets/images/clicker-character/sticky-Note.webp")',
                backgroundPosition: 'center',
              }}
            >
              {loadingImage && (
                <div className="flex justify-center items-center">
                  <MoonLoader color={'#FFB23F'} />
                </div>
              )}

              <div className={`w-32 h-32 flex m-auto
                ${currentUser?.ownsNFT && currentUser?.walletAddr !== '' ? 'nft-profile-border' : 'profile-border'}
              `}>
                <img
                  src={getProfilePic()}
                  alt="profile"
                  className={`rounded-full m-auto w-20`}
                  style={{
                    background: '#111928 50%',
                  }}
                  onClick={handleEditProfile}
                />
              </div>
              {currentUser?.isKOL && (
                <div className="bg-sky-700 rounded-lg items-center p-2 m-auto w-fit">
                  <span className="text-white text-xs tracking-wider font-outfit whitespace-nowrap">Certified KOL</span>
                </div>
              )}
              <p className={`text-md text-[#003459] font-medium font-outfit ${currentUser?.isKOL ? 'mt-[0.5rem': '-mt-2'}`}> {currentUser?.name}</p>
              <DynamicNumberDisplay 
                number={currentUser?.coins} 
                divClassName={"gap-[0.5rem] flex place-content-center"}
                imgSrc={"/assets/images/clicker-character/gem.webp"}
                imgClassName={"w-10 object-contain"}
                spanClassName={"text-[32px] xl:text-4xl text-[#FFAA00] tracking-normal font-LuckiestGuy pr-2"}
              />
              <DynamicNumberDisplay 
                number={currentUser?.profitPerHour} 
                divClassName={"gap-[0.5rem] flex place-content-center"}
                imgSrc={"/assets/icons/explora-point.webp"}
                imgClassName={"w-10 object-contain"}
                spanClassName={"text-[32px] xl:text-4xl text-[#00B9E1] tracking-normal font-LuckiestGuy pr-2"}
              />
            </div>

            <div
              className={`mt-[4rem] z-60
              ${window.innerHeight < 768 ? 'space-y-2' : 'space-y-4'}  
            `}
            >
              {navDestinations.map(({ name, link }) => (
                <div className="flex flex-row items-center group" key={name}>
                  <button
                    onClick={() => handleButtonClick(link)}
                    className={`block w-full text-left py-2 text-[#00b8e1] hover:text-[#ffc75a] font-LuckiestGuy font-bold leading-8 tracking-wider transition-all duration-500 
                    ${window.innerHeight < 768 ? 'text-3xl' : 'text-4xl'}`}
                  >
                    {name}
                  </button>
                  <img
                    className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    src="/assets/images/clicker-character/arrow-right.webp"
                    alt="right arrow"
                  />
                </div>
              ))}
            </div>

            {/* Logout button */}
            <div className="pt-4">
              <button
                className="transition ease-in-out hover:scale-105 flex items-center"
                onMouseEnter={handleMouseEnterLogout}
                onMouseLeave={handleMouseLeaveLogout}
                onClick={handleLogout}
                ref={trigger}
              >
                <img src={imageSrcLogout} className="h-12 w-12" alt="logout" />
                <span className="ml-2 text-4xl text-[#ff647a] capitalize leading-9">LOGOUT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
