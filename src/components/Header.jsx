import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom/dist";
import { PropagateLoader } from "react-spinners";
import { logOut, useUserDetails, useLocalCoins } from "../sagaStore/slices";

const lngs = {
    en: { nativeName: "English" },
    cn: { nativeName: "中文" },
  };

function Header() {
    const { i18n } = useTranslation();
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPath = location.pathname;
    const currentUser = useUserDetails();
    const localCoins = useLocalCoins();
    const trigger = useRef(null);
    const coinsDisplayRef = useRef(null);

    const handleLangChange = (lng) => {
        i18n.changeLanguage(lng);
        setLangDropdownOpen(false);
      };

<<<<<<< HEAD
  // navigation bar setup
  const navDestinations = [
    { name: 'ANITAP', link: '/anitap' },
    { name: 'MINT', link: '/mint' },
    { name: 'REFERRAL', link: '/referral' },
  ];
  const handleButtonClick = (link) => {
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

  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
=======
    // navigation bar setup
    const navDestinations = [
        { name: 'ANITAP', link: '/anitap' },
        { name: 'MINT', link: '/mint' },
        { name: 'REFERRAL', link: '/referral' },
    ];
    const handleButtonClick = (link) => {
        if (link) {
            navigate(link);
        }
    };
    const handleEditProfile = () => {
        navigate('/edit-profile');
>>>>>>> origin/dev-1.0-hy
    };

    // setup logout button
    const [imageSrcLogout, setImageSrcLogout] = useState("/assets/images/clicker-character/logout.png");
    const handleMouseEnterLogout = () => setImageSrcLogout("/assets/images/clicker-character/logout-hover.png");
    const handleMouseLeaveLogout = () => setImageSrcLogout("/assets/images/clicker-character/logout.png");

    const handleLogout = () => {
        dispatch(logOut());
    };

<<<<<<< HEAD
  return (
    <>
      {/* Desktop Menu */}
      <div
        className={`flex flex-row absolute top-[3rem] z-10 p-1 pr-4 gap-2 left-[1rem] xl:left-[4rem] ${
          mobileMenuOpen ? 'hidden' : ''
        }`}
        style={{
          border: '3px solid #F4FBFF',
          borderRadius: '500px 200px 200px 500px',
          background: 'var(--0163BE, #0163BE)',
          boxShadow: '3px 2px 0px 0px #517296 inset',
          zIndex: 91,
        }}
      >
        <div className="p-1 w-20 h-20 relative">
          <button onClick={handleEditProfile} className="group relative">
            {loadingImage && (
              <div className="flex justify-center items-center">
                <div className="flex justify-center items-center h-56">
                  <PropagateLoader color={'#FFB23F'} />
                </div>
              </div>
            )}
            <img
              src={currentUser?.photoUrl ? currentUser.photoUrl : '/assets/images/clicker-character/2-initial.webp'}
              alt="profile"
              className="justify-self-center rounded-full w-24 cursor-pointer group-hover:brightness-[0.55] transition-all duration-300"
              style={{
                border: '4px solid var(--80E8FF, #80E8FF)',
                background: 'lightgray 50%',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                display: loadingImage ? 'none' : 'block',
              }}
              onLoad={() => setLoadingImage(false)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/images/clicker-character/2-initial.webp';
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
=======
    // State for mobile menu
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
>>>>>>> origin/dev-1.0-hy


<<<<<<< HEAD
          <div className="gap-2 flex">
            <img className="w-8 object-contain" src={'/assets/images/clicker-character/gem.webp'} alt="gem" />
            <div className="relative flex items-center justify-center w-44">
              <span
                ref={coinsDisplayRef}
                className="relative text-3xl text-amber-500 tracking-normal w-full overflow-hidden text-left"
=======
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
        return number ? number.toLocaleString() : '0';
    };

    return (
        <>
            {/* Desktop Menu */}
            <div className={`flex flex-row absolute top-[3rem] z-10 p-1 pr-4 gap-2 left-[1rem] xl:left-[4rem] ${
                    mobileMenuOpen ? 'hidden' : ''
                }`}
>>>>>>> origin/dev-1.0-hy
                style={{
                    border: '3px solid #F4FBFF',
                    borderRadius: '500px 200px 200px 500px',
                    background: 'var(--0163BE, #0163BE)',
                    boxShadow: '3px 2px 0px 0px #517296 inset',
                    zIndex: 91,
                }}
<<<<<<< HEAD
              >
                {formatNumberWithCommas(localCoins)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="hidden xl:flex absolute top-16 gap-2 right-[4rem] z-96 items-center"
        style={{
          zIndex: 91,
        }}
      >
        <div className="relative">
          <img
            src="/assets/images/clicker-character/locale.webp"
            className="w-[3dvw] xl:w-[1.5dvw] cursor-pointer"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            alt="change locale"
          />
          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-[150px] bg-slate-800 shadow-lg rounded-md z-10">
              {Object.keys(lngs).map((lng) => (
                <button
                  className="block w-full px-4 py-2 text-left hover:bg-slate-500"
                  type="submit"
                  key={lng}
                  onClick={() => handleLangChange(lng)}
                  disabled={i18n.resolvedLanguage === lng}
                >
                  {lngs[lng].nativeName}
                </button>
              ))}
            </div>
          )}
        </div>

        {navDestinations.map(({ name, link }) => (
          <button
            key={name}
            onClick={() => handleButtonClick(link)}
            className={`flex w-[146px] h-[60px] p-5 justify-center items-center gap-1.5 rounded-[10px] border border-[#E59E69] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset,0px_4px_4px_0px_rgba(136,136,136,0.48)] bg-[#FFB23F] hover:bg-[#FFDC62] hover:pl-[24px] hover:pr-[20px] hover:border-1 hover:border-[#E59E69] hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] hover:rotate-6 hover:scale-105 transition-transform duration-300 ease-in-out ${currentPath === link ? 'transform rotate-6 bg-[#FFDC62]' : ''}`}
          >
            <span className="text-center text-white text-xl font-normal font-['Luckiest_Guy'] capitalize leading-[18px]">
              {name}
            </span>
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

      {/* Mobile Menu Button */}
      <button
        className="transition ease-in-out hover:scale-105 xl:hidden absolute top-[5rem] right-[2rem] xl:right-[4rem] z-50"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
          className="fixed inset-0 z-40 flex flex-col justify-center p-[4rem]"
          style={{
            backgroundImage: 'url("/assets/images/clicker-character/clickerWall.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="flex flex-row justify-between">
            <div className="left-[3rem] flex items-center space-x-4">
              <img src="/assets/images/clicker-character/animara-logo.webp" alt="Animara Logo" className="h-8" />
            </div>

            <button
              className="transition ease-in-out hover:scale-105 xl:hidden right-[3rem] xl:right-[4rem] z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
            className="text-center w-auto h-full place-content-center scale-125 mt-[5rem] -z-50"
            style={{
              backgroundImage: 'url("/assets/images/clicker-character/sticky-Note.webp")',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {loadingImage && (
              <div className="flex justify-center items-center">
                <PropagateLoader color={'#FFB23F'} />
              </div>
            )}

            <img
              src={currentUser?.photoUrl ? currentUser.photoUrl : '/assets/images/clicker-character/2-initial.webp'}
              alt="profile"
              className="items-center rounded-full w-32 mx-auto mb-4"
              style={{
                border: '4px solid var(--80E8FF, #80E8FF)',
                background: 'lightgray 50%',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
              onClick={handleEditProfile}
            />
            {currentUser?.isKOL && (
              <span className="bg-sky-700 rounded-lg items-center xl:ml-[1rem] p-2">
                <span className="text-white text-xs tracking-wider font-outfit whitespace-nowrap">Certified KOL</span>
              </span>
            )}
            <p className="text-lg text-[#003459] font-medium font-outfit mt-4 mb-1"> {currentUser?.name}</p>
            <div className="gap-2 flex place-content-center">
              <img className="w-8 object-contain" src={'/assets/images/clicker-character/gem.webp'} alt="gem" />
              <div className="items-center justify-center">
                <span
                  className="text-4xl text-amber-500 tracking-normal pr-2"
                  style={{
                    WebkitTextStrokeWidth: '1.75px',
                    WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                  }}
                >
                  {formatNumberWithCommas(currentUser?.coins)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-[4rem] mb-16 z-60">
            {navDestinations.map(({ name, link }) => (
              <div className="flex flex-row items-center group" key={name}>
                <button
                  onClick={() => handleButtonClick(link)}
                  className="block w-full text-left py-2 text-[#00b8e1] hover:text-[#ffc75a] text-4xl font-LuckiestGuy font-bold leading-9 tracking-wider transition-all duration-500"
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
            <button
              className="transition ease-in-out hover:scale-105 flex items-center"
              onMouseEnter={handleMouseEnterLogout}
              onMouseLeave={handleMouseLeaveLogout}
              onClick={handleLogout}
              ref={trigger}
=======
            >
                <div className="p-1 w-20 h-20 relative">
                <button
                    onClick={handleEditProfile}
                    className="group relative"
                    >
                    {loadingImage && (
                        <div className="flex justify-center items-center">
                            <div className="flex justify-center items-center h-56">
                                <PropagateLoader color={"#FFB23F"} />
                            </div>
                        </div>
                    )}
                    <img
                        src={currentUser?.photoUrl ? currentUser.photoUrl : "/assets/images/clicker-character/2-initial.png"}
                        alt="profile"
                        className="justify-self-center rounded-full w-24 cursor-pointer group-hover:brightness-[0.55] transition-all duration-300"
                        style={{
                            border: '4px solid var(--80E8FF, #80E8FF)',
                            background: 'lightgray 50%',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            display: loadingImage ? 'none' : 'block'
                        }}
                        onLoad={() => setLoadingImage(false)}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/assets/images/clicker-character/2-initial.png";
                            setLoadingImage(false);
                        }}
                    />
                    <img
                        src="/assets/icons/edit.png"
                        alt="edit"
                        className="invisible group-hover:visible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white fill-white"
                    />
                    </button>
                </div>

                <div className="flex flex-col place-content-center">
                    <div className="font-outfit text-md flex">
                        <p>{currentUser?.name || 'Animara User'}</p>
                        <p className="ml-4 font-LuckiestGuy text-[#F46700]">LV.{currentUser?.level}</p>
                    </div>

                    <div className="gap-2 flex">
                        <img
                            className="w-8 object-contain"
                            src={"/assets/images/clicker-character/gem.png"}
                            alt="gem"
                        />
                        <div className="relative flex items-center justify-center w-44">
                            <span
                                ref={coinsDisplayRef}
                                className="relative text-3xl text-amber-500 tracking-normal w-full overflow-hidden text-left"
                                style={{
                                    WebkitTextStrokeWidth: '1.75px',
                                    WebkitTextStrokeColor: 'var(--Color-11, #FFF)'
                                }}
                            >
                                {formatNumberWithCommas(localCoins)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="hidden xl:flex absolute top-16 gap-2 right-[4rem] z-96 items-center"
                style={{
                    zIndex: 91,
                }}
>>>>>>> origin/dev-1.0-hy
            >
                <div className="relative">
                    <img
                    src="/assets/images/clicker-character/locale.png"
                    className="w-[3dvw] xl:w-[1.5dvw] cursor-pointer"
                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                    alt="change locale"
                    />
                    {langDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-[150px] bg-slate-800 shadow-lg rounded-md z-10">
                        {Object.keys(lngs).map((lng) => (
                        <button
                            className="block w-full px-4 py-2 text-left hover:bg-slate-500"
                            type="submit"
                            key={lng}
                            onClick={() => handleLangChange(lng)}
                            disabled={i18n.resolvedLanguage === lng}
                        >
                            {lngs[lng].nativeName}
                        </button>
                        ))}
                    </div>
                    )}
                </div>
              
                {navDestinations.map(({ name, link }) => (
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
                    onClick={handleLogout}
                    ref={trigger}
                >
                    <img
                        src={imageSrcLogout}
                        className="h-full w-full"
                        alt="logout"
                    />
                </button>
            </div>

            {/* Mobile Menu Button */}
            <button
                className="transition ease-in-out hover:scale-105 xl:hidden absolute top-[5rem] right-[2rem] xl:right-[4rem] z-50"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                <svg className={`h-9 w-9 text-amber-500 ${ mobileMenuOpen ? 'hidden' : 'block' }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={"M4 6h16M4 12h16m-7 6h7"} />
                </svg>
            </button>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 flex flex-col justify-center p-[4rem]"
                    style={{
                        backgroundImage: 'url("/assets/images/clicker-character/clickerWall.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <div className="flex flex-row justify-between">
                        <div className="left-[3rem] flex items-center space-x-4">
                            <img
                                src="/assets/images/clicker-character/animara-logo.png"
                                alt="Animara Logo"
                                className="h-8"
                            />
                        </div>

                        <button
                            className="transition ease-in-out hover:scale-105 xl:hidden right-[3rem] xl:right-[4rem] z-50"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <svg className="h-9 w-9 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={"M6 18L18 6M6 6l12 12"} />
                            </svg>
                        </button>
                    </div>   

                    <div
                        className="text-center w-auto h-full place-content-center scale-125 mt-[5rem] -z-50"
                        style={{
                            backgroundImage: 'url("/assets/images/clicker-character/sticky-Note.png")',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        {loadingImage && (
                            <div className="flex justify-center items-center">
                              <PropagateLoader color={"#FFB23F"} />
                          </div>
                        )}

                        <img
                            src={currentUser?.photoUrl ? currentUser.photoUrl : "/assets/images/clicker-character/2-initial.png"}
                            alt="profile"
                            className="items-center rounded-full w-32 mx-auto mb-4"
                            style={{
                                border: '4px solid var(--80E8FF, #80E8FF)',
                                background: 'lightgray 50%',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                            }}
                            onClick={handleEditProfile}
                        />
                        {currentUser?.isKOL && (
                            <span className="bg-sky-700 rounded-lg items-center xl:ml-[1rem] p-2">
                                <span className="text-white text-xs tracking-wider font-outfit whitespace-nowrap">
                                    Certified KOL
                                </span>
                            </span>
                        )}
                        <p className="text-lg text-[#003459] font-medium font-outfit mt-4 mb-1"> {currentUser?.name}</p>
                        <div className="gap-2 flex place-content-center">
                            <img
                                className="w-8 object-contain"
                                src={"/assets/images/clicker-character/gem.png"}
                                alt="gem"
                            />
                            <div className="items-center justify-center">
                                <span
                                    className="text-4xl text-amber-500 tracking-normal pr-2"
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

                    <div className="space-y-4 mt-[4rem] mb-16 z-60">
                    {navDestinations.map(({ name, link }) => (
                        <div className="flex flex-row items-center group" key={name}>
                            <button
                                onClick={() => handleButtonClick(link)}
                                className="block w-full text-left py-2 text-[#00b8e1] hover:text-[#ffc75a] text-4xl font-LuckiestGuy font-bold leading-9 tracking-wider transition-all duration-500"
                            >
                                {name}
                            </button>
                            <img
                                className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                src="/assets/images/clicker-character/arrow-right.png"
                                alt="right arrow"
                            />
                        </div>
                    ))}
                        <button
                            className="transition ease-in-out hover:scale-105 flex items-center"
                            onMouseEnter={handleMouseEnterLogout}
                            onMouseLeave={handleMouseLeaveLogout}
                            onClick={handleLogout}
                            ref={trigger}
                        >
                            <img
                                src={imageSrcLogout}
                                className="h-12 w-12"
                                alt="logout"
                            />
                            <span className="ml-2 text-4xl text-[#ff647a] capitalize leading-9">LOGOUT</span>
                        </button>

                    </div>
                </div>
            )}
        </>
    );
}

export default Header;
