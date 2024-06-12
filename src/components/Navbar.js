import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  return (
    <nav className="flex items-center text-3xl justify-between py-4 px-[5rem] absolute top-0 left-0 w-[100%] lg:px-[5rem] z-50">
      <div className="w-[4rem]">
        <Link to="/">
          <img
            className="cursor-pointer mr-12 object-cover"
            src="/logo.png"
            alt="logo"
          />
        </Link>
      </div>
      <ul id="main-nav" className="flex justify-center mr-[-5rem]">
        <Link to="/nft">
          <li className="p-3 px-[5rem] nav-item nav-left rounded-tl-sm rounded-br-sm">
            Buy NFT
          </li>
        </Link>
        <li className="p-3 px-[5rem] nav-item nav-left rounded-tl-sm rounded-br-sm">
          Whitepaper
        </li>
        <Link to="/world">
          <li className="flex flex-col mx-5 items-center">
            <img src="/world.svg" alt="" />
            <span className="uppercase text-lg">World</span>
          </li>
        </Link>
        <Link to="/games">
          <li className="p-3 px-[5rem] nav-item nav-right rounded-tr-sm rounded-bl-sm">
            Games
          </li>
        </Link>
        <li className="p-3 px-[5rem] nav-item nav-right rounded-tr-sm rounded-bl-sm">
          Tokens
        </li>
      </ul>
      <ul className="flex items-center text-2xl">
        <li
          className="relative cursor-pointer mr-12 uppercase underline"
          onMouseEnter={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
        >
          Others
          {isDropdownVisible && (
            <ul className="absolute left-[50%]  top-[130%] -translate-x-[50%] flex flex-col border border-white">
              <li className="p-3 bg-[#5f5f5f]">
                <Link to={"/"}>News</Link>
              </li>
              <li className="p-3 bg-[#64646459] ">
                <Link className="opacity-[0.5]" to={"/"}>
                  FAQ
                </Link>
              </li>
              <li className="p-3 bg-[#64646459] ">
                <Link className="opacity-[0.5]" to={"/"}>
                  Leaderboard
                </Link>
              </li>
            </ul>
          )}
        </li>
        <Link to="/login">
          <li
            id="login"
            className="cursor-pointer uppercase underline primary-btn py-2 px-8 pr-12  bg-[#b537f2] hover:bg-transparent hover:text-[#b537f2]"
          >
            Login
          </li>
        </Link>
      </ul>
    </nav>
  );
};

export default Navbar;
