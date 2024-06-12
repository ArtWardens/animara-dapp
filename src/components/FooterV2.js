import React from "react";
import { Link } from "react-router-dom";

const FooterV2 = () => {
  return (
    <div className="h-auto w-full bg-[#1e1e1e]">
      <div className="wrapper flex flex-col lg:flex-row justify-around">
        <div className="logo branding flex flex-col justify-center p-20">
          <img className="w-16 h-auto" src="/logo.png" alt="" />
          <h6 className="text-3xl mt-10">
            SUBSCRIBE AND RECEIVE OUR NEWSLETTER <br /> TO FOLLOW THE NEWS
          </h6>
          <div className="relative mt-10 max-w-xl">
            <input
              className=" bg-transparent border-b border-white w-[100%] text-lg outline-none py-2 font-outfit"
              placeholder="Enter email address"
              type="email"
            />
            <button className="absolute right-0 primary-btn bg-[#E429FF] bottom-0 text-xl py-2 px-10 pr-14 no-underline border-b border-white ">
              Send
            </button>
          </div>
        </div>
        <div className="social-links lg:p-20 overflow-hidden">
          <span className="relative">
            <div className="flex bg-zinc-900 p-10 cut-topleft-corner z-40">
              <ul className="flex flex-col gap-4 pr-28">
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/about">Tournaments</Link>
                </li>
                <li>
                  <Link to="/about">Ladder</Link>
                </li>
                <li>
                  <Link to="/about">Shop</Link>
                </li>
                <li>
                  <Link to="/about">Community</Link>
                </li>
                <li>
                  <Link to="/about">Stream</Link>
                </li>
                <li>
                  <Link to="/about">Blog</Link>
                </li>
                <li>
                  <Link to="/about">Help Center</Link>
                </li>
              </ul>
              <ul className="flex flex-col justify-between self-start gap-6 items-start border-l border-[#49244e] pl-12 pr-16">
                <li>
                  <Link to="/" className="flex gap-3">
                    <img src="/socials/twitch.svg" alt="" />
                    <p>Twitch</p>
                  </Link>
                </li>
                <li>
                  <Link to="/" className="flex gap-3">
                    <img src="/socials/instagram.svg" alt="" />
                    <p>Instagram</p>
                  </Link>
                </li>
                <li>
                  <Link to="/" className="flex gap-3">
                    <img src="/socials/twitter.svg" alt="" />
                    <p>Twitter</p>
                  </Link>
                </li>
                <li>
                  <Link to="/" className="flex gap-3">
                    <img src="/socials/youtube.svg" alt="" />
                    <p>Yoututbe</p>
                  </Link>
                </li>
                <div className="mt-4 flex flex-col gap-4">
                  <li>
                    <Link to="/contact">Contact Us</Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/terms-and-conditions">Terms & Conditions</Link>
                  </li>
                </div>
              </ul>
            </div>
            <img
              src="/footer_triangle.svg"
              className="absolute bottom-0 -right-36 block z-50"
              alt=""
            />
          </span>
        </div>
      </div>
      <h1 className="text-[#888a8b] py-3 block font-outfit text-center">
        &copy; 2024 MO. All rights reserved
      </h1>
    </div>
  );
};

export default FooterV2;
