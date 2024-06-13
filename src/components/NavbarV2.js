import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/store.ts";
import { handleLogout, handleEmailVerification } from "../firebase/auth.ts";

const NavbarV2 = () => {
  const [isOthersDropdownVisible, setOthersDropdownVisible] = useState(false);
  const [isProfileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [isMobileNavVisible, setMobileNavVisible] = useState(false);
  const { user, signOut } = useUserStore();
  const navigate = useNavigate();
  console.log(user);
  return (
    <>
      <nav className="w-[full] flex gap-3 h-20 sticky top-0 z-50 backdrop-brightness-75 backdrop-blur-sm">
        <div className="logo branding p-4 lg:w-80 w-full flex justify-center">
          <Link to="/" className="w-[50%] md:w-[40%] flex items-center gap-2">
            <video width="200" height="100%" autoPlay loop muted playsInline>
              <source src="assets/images/logo.webm" type="video/webm" />
            </video>
            <video className="hidden xl:flex" width="100" height="100%" autoPlay loop muted playsInline>
              <source src="assets/images/moveon.webm" type="video/webm" />
          </video>
          </Link>
        </div>
        <video className="lg:hidden" width="100" height="100%" autoPlay loop muted playsInline>
              <source src="assets/images/moveon.webm" type="video/webm" />
        </video>
        <ul className="navlinks hidden text-lg tracking-wider lg:flex w-[70%] xl:w-full justify-center items-center">
          <Link to="/nft">
            <li className="p-3 whitespace-nowrap px-[5rem] nav-item nav-left rounded-tl-sm rounded-br-sm">
              Buy NFT
            </li>
          </Link>
          <Link to="/whitepaper">
            <li className="p-3 whitespace-nowrap px-[5rem] nav-item nav-left rounded-tl-sm rounded-br-sm">
              Whitepaper
            </li>
          </Link>
          <Link to="/world">
            <li className="flex flex-col mx-5 items-center justify-center">
              <img src="assets/images/world.svg" alt="" className="h-5 w-auto" />
              <span className="uppercase text-lg">World</span>
            </li>
          </Link>
          <Link to="/games">
            <li className="p-3 whitespace-nowrap px-[5rem] nav-item nav-right rounded-tr-sm rounded-bl-sm">
              Games
            </li>
          </Link>
          <Link to="/tokens">
            <li className="p-3 whitespace-nowrap px-[5rem] nav-item nav-right rounded-tr-sm rounded-bl-sm">
              Tokens
            </li>
          </Link>
        </ul>
        <div
          className="login w-auto px-5 hidden justify-between items-center gap-5 lg:flex"
          // onMouseLeave={() => setOthersDropdownVisible(false)}
        >
          <span
            className="flex flex-col relative h-full"
            onMouseEnter={() => setOthersDropdownVisible(true)}
            onMouseLeave={() => setOthersDropdownVisible(false)}
          >
            <button className="h-full w-auto flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M12 14l8-6H4l8 6z" fill="currentColor"></path>
              </svg>
              <span className="text-xl uppercase hover:underline underline-offset-4">
                Others
              </span>
            </button>
            {isOthersDropdownVisible && (
              <div
                id="dropdown"
                className="absolute translate-y-11 z-10  divide-y divide-gray-100 shadow w-44 bg-black bg-opacity-75"
              >
                <ul
                  className="py-2 text-lg tracking-wider dark:text-gray-200"
                  aria-labelledby="dropdownDefaultButton"
                >
                  <li>
                    <Link
                      to="/news"
                      className="block px-4 py-2 hover:bg-fuchsia-600 hover:text-white"
                    >
                      News
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="block px-4 py-2 hover:bg-fuchsia-600 hover:text-white"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <a
                      href="/test"
                      className="block px-4 py-2  hover:bg-fuchsia-600 hover:text-white"
                    >
                      Leaderboard
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </span>
          <div className="float-end flex items-center h-full">
            {user != null ? (
              // <div
              //   className="flex flex-col relative text-xl whitespace-nowrap cursor-pointer uppercase primary-btn py-2 px-8 bg-fuchsia-600 underline underline-offset-2"
              //   // onClick={async () => {
              //   //   if (await handleLogout()) {
              //   //     signOut();
              //   //   }
              //   // }}
              // >
              <span
                className="flex flex-col relative h-full"
                onMouseEnter={() => setProfileDropdownVisible(true)}
                onMouseLeave={() => setProfileDropdownVisible(false)}
              >
                <button className="h-full w-auto flex items-center gap-2">
                  {/* svg filled dropdown icon */}
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 14l8-6H4l8 6z" fill="currentColor"></path>
                  </svg>

                  <span className="text-xl text-left uppercase hover:underline underline-offset-4 whitespace-nowrap">
                    {user.displayName?.length > 10
                      ? user.displayName?.slice(0, 10) + "..."
                      : user.displayName}
                  </span>
                </button>
                {isProfileDropdownVisible && (
                  <div
                    id="dropdown"
                    className="absolute right-0 translate-y-11 z-10  divide-y divide-gray-100 shadow w-44 bg-black bg-opacity-75"
                  >
                    <ul
                      className="py-2 text-lg tracking-wider dark:text-gray-200"
                      aria-labelledby="dropdownDefaultButton"
                    >
                      <li>
                        <Link
                          to="/news"
                          className="block px-4 py-2 hover:bg-fuchsia-600 hover:text-white"
                        >
                          Member Area
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/edit-profile"
                          className="block px-4 py-2 hover:bg-fuchsia-600 hover:text-white"
                        >
                          Edit Profile
                        </Link>
                      </li>
                      <li
                        className="px-4 py-2 text-red-500 hover:underline underline-offset-4 cursor-pointer flex items-center"
                        onClick={async () => {
                          if (await handleLogout()) {
                            signOut();
                            navigate("/");
                          }
                        }}
                      >
                        <img
                          src={"assets/icons/logout.svg"}
                          className="rounded-full h-6 w-6"
                        />
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </span>
            ) : (
              // </div>
              <Link
                to={"/login"}
                className="text-xl whitespace-nowrap cursor-pointer uppercase primary-btn py-2 px-8 bg-fuchsia-600 underline underline-offset-2"
              >
                Login
              </Link>
            )}
            {/* <div className="text-xl whitespace-nowrap cursor-pointer uppercase primary-btn py-2 px-8 bg-fuchsia-600 underline underline-offset-2">
              Login
            </div> */}
          </div>
        </div>
        <div className="mobile-nav h-full w-full lg:hidden flex justify-center">
          <button className="h-full w-auto flex items-center gap-2">
            {isMobileNavVisible ? (
              <svg
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                onClick={() => setMobileNavVisible(false)}
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                onClick={() => setMobileNavVisible(true)}
              >
                <path
                  d="M4 6H20M4 12H20M4 18H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            )}
          </button>
        </div>
      </nav>
      <nav
        className={`mobile-navbar fixed overflow-hidden ${isMobileNavVisible ? "" : "translate-x-full"} h-full w-full bg-black bg-opacity-75 backdrop-blur-sm z-50 flex justify-end transition-all`}
      >
        <ul className="h-[calc(100vh-64px)] bg-[#1a1a1a] w-64 flex flex-col items-center gap-5 relative text-2xl py-5">
          <div className="h-24 w-full p-3 flex items-center">
            <div className=" w-full h-20 cut-topleft-bottomright-corner">
              <div
                onClick={async () => {
                  if (user != null) {
                    if (await handleLogout()) {
                      signOut();
                      setMobileNavVisible(false);
                      navigate("/");
                    }
                  } else {
                    navigate("/login");
                    setMobileNavVisible(false);
                  }
                }}
                className="button h-full flex items-center justify-center gradient-blue-transparent-fuschia-bottomRight"
              >
                {user != null ? (
                  <>
                    <img
                      src={user?.photoURL || "assets/images/lock.png"}
                      className="mx-3 rounded-full h-8 w-8"
                    />
                    <div className="font-acumin w-full">
                      <h1 className="text-sm font-semibold outline-4 [text-shadow:_0_0px_10px_rgb(192_38_211_/_100%)]">
                        {user.displayName}
                      </h1>
                      <h6 className=" text-xs text-fuchsia-600">
                        Click to logout
                      </h6>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src="assets/images/lock.png"
                      className="mx-3 rounded-full h-8 w-8"
                    />
                    <div className="font-acumin w-full">
                      <h1 className="text-sm font-semibold outline-4 [text-shadow:_0_0px_10px_rgb(192_38_211_/_100%)]">
                        Not logged in
                      </h1>
                      <h6 className=" text-xs text-fuchsia-600">
                        Login/Register
                      </h6>
                    </div>
                  </>
                )}
                {/* <img src="/lock.png" className="mx-3" /> */}
                {/* <div className="font-acumin w-full">
                  <h1 className="text-sm font-semibold outline-4 [text-shadow:_0_0px_10px_rgb(192_38_211_/_100%)]">
                    Not logged in
                  </h1>
                  <h6 className=" text-xs text-fuchsia-600">Login/Register</h6>
                </div> */}
              </div>
            </div>
          </div>
          <img
            src="assets/images/mobileNavBottom.png"
            className="absolute bottom-0 object-cover w-full h-1/2 z-0"
            alt=""
          />
          <Link to="/nft" className="z-10 hover:underline underline-offset-2">
            <li>Buy NFT</li>
          </Link>
          <Link
            to="/whitepaper"
            className="z-10 hover:underline underline-offset-2"
          >
            <li>Whitepaper</li>
          </Link>
          <Link to="/world" className="z-10 hover:underline underline-offset-2">
            <li>World</li>
          </Link>
          <Link to="/games" className="z-10 hover:underline underline-offset-2">
            <li>Games</li>
          </Link>
          <Link
            to="/tokens"
            className="z-10 hover:underline underline-offset-2"
          >
            <li>Tokens</li>
          </Link>
          <div className="flex gap-3 p-0 md:hidden">
            <a href="https://x.com/moworldgame">
              <img className="cursor-pointer" src="assets/icons/x.svg" alt="X" />
            </a>
            <a href="https://discord.com/invite/6CpMr7Bb">
              <img className="cursor-pointer" src="assets/icons/discord.svg" alt="Discord" />
            </a>
            <a href="https://t.me/moveonworld">
              <img className="cursor-pointer" src="assets/icons/telegram.svg" alt="Telegram" />
            </a>
            <a href="https://instagram.com/moworldgame/">
              <img className="cursor-pointer" src="assets/icons/instagram.svg" alt="Instagram" />
            </a>
          </div>
        </ul>
      </nav>
    </>
  );
};

export default NavbarV2;
