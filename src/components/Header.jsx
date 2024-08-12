import { PropTypes } from "prop-types";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { logOut } from "../sagaStore/slices";

function Header({ currentUser }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
        { name: 'AMIPALS', link: '/amipals' },
        { name: 'EARLY BIRD', link: '/early-bird' },
        { name: 'MINT', link: '/mint' },
        { name: 'REFERRAL', link: '/referral' },
        // { name: 'LOCK', link: '/clicker-lock' }
    ];

    const [imageSrcLogout, setImageSrcLogout] = useState("../assets/images/clicker-character/logout.png");
    const handleMouseEnterLogout = () => setImageSrcLogout("../assets/images/clicker-character/logout-hover.png");
    const handleMouseLeaveLogout = () => setImageSrcLogout("../assets/images/clicker-character/logout.png");

    const handleLogout = () => {
        dispatch(logOut());
    };

    // State for mobile menu
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const totalClicksRef = useRef(null);

    // State for loading profile image
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
        const adjustFontSize = () => {
          const element = totalClicksRef.current;
          const containerWidth = element.parentElement.offsetWidth;
          let newFontSize = 34;
          
          element.style.fontSize = `${newFontSize}px`;
          
          while (element.scrollWidth > containerWidth && newFontSize > 12) {
            newFontSize -= 1;
            element.style.fontSize = `${newFontSize}px`;
          }
        };
    
        adjustFontSize();
      }, [currentUser?.coins]);

    // Function to format number with commas
    const formatNumberWithCommas = (number) => {
        return number ? number.toLocaleString() : '0';
    };

    return (
        <>
            {/* Desktop Menu */}
            <div className="hidden sm:flex flex-row absolute top-8 z-10 p-1 pr-4 gap-2 left-24"
                style={{
                    border: '3px solid #F4FBFF',
                    borderRadius: '500px 200px 200px 500px',
                    background: 'var(--0163BE, #0163BE)',
                    boxShadow: '3px 2px 0px 0px #517296 inset',
                    zIndex: 91,
                }}
            >
                <div className="p-1 w-20 h-20 relative">
                    <a onClick={handleEditProfile}>
                        {loadingImage && (
                            <div className="flex justify-center items-center">
                            <div className="flex justify-center items-center h-56">
                              <PropagateLoader color={"#FFB23F"} />
                            </div>
                          </div>
                        )}
                        <img
                            src={currentUser?.photoUrl ? currentUser.photoUrl : "../assets/images/clicker-character/2-initial.png"}
                            alt="profile"
                            className="justify-self-center rounded-full w-24 cursor-pointer"
                            style={{
                                border: '4px solid var(--80E8FF, #80E8FF)',
                                background: 'lightgray 50%',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                display: loadingImage ? 'none' : 'block'
                            }}
                            onLoad={() => setLoadingImage(false)}
                            onError={() => setLoadingImage(false)}
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
                        <div className="relative flex items-center justify-center w-32">
                            <span
                                ref={totalClicksRef}
                                className="relative text-3xl text-amber-500 tracking-normal w-full overflow-hidden text-left"
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
                className="hidden sm:flex absolute top-12 gap-2 right-24 z-96 items-center"
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
                className="transition ease-in-out hover:scale-105 sm:hidden absolute top-8 right-8 z-50"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                <svg className="h-9 w-9 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                </svg>
            </button>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 flex flex-col justify-center px-12"
                    style={{
                        backgroundImage: 'url("../../assets/images/clicker-character/clickerWall.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <div className="absolute top-12 left-12 flex items-center space-x-4">
                        <img
                            src="../assets/images/clicker-character/animara-logo.png"
                            alt="Animara Logo"
                            className="h-8"
                        />
                    </div>

                    <div
                        className="text-center w-auto h-full place-content-center scale-125 mt-20 -z-50"
                        style={{
                            backgroundImage: 'url("../../assets/images/clicker-character/sticky-Note.png")',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <img
                            src={"../assets/images/clicker-character/2-initial.png"}
                            alt="profile"
                            className="items-center rounded-full w-32 mx-auto mb-4"
                            style={{
                                border: '4px solid var(--80E8FF, #80E8FF)',
                                background: 'lightgray 50%',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                            }}
                        />
                        <span className="bg-sky-700 rounded-lg items-center px-2 py-1">
                            <span className="text-white text-xs font-outfit">Certified KOL</span>
                        </span>
                        <p className="text-lg text-[#003459] font-medium font-outfit mt-4 mb-1"> {currentUser?.name}</p>
                        <div className="gap-2 flex place-content-center">
                            <img
                                className="w-8 object-contain"
                                src={"../assets/images/clicker-character/gem.png"}
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

                    <div className="space-y-4 mb-16 z-60">
                        {buttons.map(({ name, link }) => (
                            <button
                                key={name}
                                onClick={() => handleButtonClick(link)}
                                className="block w-full text-left py-2 text-[#00b8e1] text-4xl font-bold hover:bg-blue-700 leading-9 tracking-wider"
                            >
                                {name}
                            </button>
                        ))}
                        <button
                            className="transition ease-in-out hover:scale-105 flex items-center"
                            onMouseEnter={handleMouseEnterLogout}
                            onMouseLeave={handleMouseLeaveLogout}
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

Header.propTypes = {
    currentUser: PropTypes.object, 
    totalClicks: PropTypes.number
  }

export default Header;
