
import React from "react";
import { ProgressBar } from "react-progressbar-fancy";

const ProgressSection = ({ gameData, currentMascot }) => {
  const quest = gameData?.[currentMascot?.version]?.quest;
  const numberOfClicks = gameData?.[currentMascot?.version]?.numberOfClicks;
  return (
    <div className="absolute bottom-10 w-1/2 mx-auto">
      {
        numberOfClicks >= 0 && numberOfClicks<=10 && <div>
        <div className="flex justify-between mx-4">
          <div className="flex items-center">
            <img
              src={"../assets/images/hamar2.png"}
              width={40}
              height={40}
              className="h-6 w-6"
              alt="hamar image"
            />
            <p>
              <span className=" passed-quest1 text-2xl font-extrabold outlinefont">
                {numberOfClicks}
              </span>
              <span className=" text-purple-900 font-semibold">{" "}/ {" "} 100</span>
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <p className=" text-purple-900 font-semibold">100</p>
            <img
              src={"../assets/images/gem2.png"}
              width={40}
              height={40}
              className="h-6 w-6"
              alt="hamar image"
            />
          </div>
        </div>
        <ProgressBar
          score={numberOfClicks*10}
          progressColor="#7A0BA0"
          primaryColor="#ffba07"
          secondaryColor="#ffeea3"
          hideText={true}
          className="text-center"
        />
        </div>
      }
      {
        numberOfClicks >= 11 && numberOfClicks<=20 && <div>
        <div className="flex justify-between mx-4">
          <div className="flex items-center">
            <img
              src={"../assets/images/hamar2.png"}
              width={40}
              height={40}
              className="h-6 w-6"
              alt="hamar image"
            />
            <p>
              <span className=" text-yellow-400 text-2xl font-extrabold outlinefont">
                {numberOfClicks}
              </span>
              <span className=" text-purple-900 font-semibold">/200</span>
            </p>
          </div>
          <div className="flex items-center">
            <p className=" text-purple-900 font-semibold">100</p>
            <img
              src={"../assets/images/gem2.png"}
              width={40}
              height={40}
              className="h-6 w-6"
              alt="hamar image"
            />
          </div>
        </div>
        <ProgressBar
          score={numberOfClicks != 0 ? (numberOfClicks-10)*10: numberOfClicks*5}
          progressColor="#7A0BA0"
          primaryColor="#ffba07"
          secondaryColor="#ffeea3"
          hideText={true}
          className="text-center"
        />
        </div>
      }
      {
        numberOfClicks >= 21 && numberOfClicks<=30 && <div>
        <div className="flex justify-between mx-4">
          <div className="flex items-center">
            <img
              src={"../assets/images/hamar2.png"}
              width={40}
              height={40}
              className="h-6 w-6"
              alt="hamar image"
            />
            <p>
              <span className=" text-yellow-400 text-2xl font-extrabold outlinefont">
                {numberOfClicks}
              </span>
              <span className=" text-purple-900 font-semibold">/500</span>
            </p>
          </div>
          <div className="flex items-center">
            <p className=" text-purple-900 font-semibold">100</p>
            <img
              src={"../assets/images/gem2.png"}
              width={40}
              height={40}
              className="h-6 w-6"
              alt="hamar image"
            />
          </div>
        </div>
        <ProgressBar
          score={numberOfClicks != 0 ? (numberOfClicks-20)*10: numberOfClicks*3.33}
          progressColor="#7A0BA0"
          primaryColor="#ffba07"
          secondaryColor="#ffeea3"
          hideText={true}
          className="text-center"
        />
        </div>
      }
      {
        numberOfClicks >= 31 && numberOfClicks<=40 && <div>
        <div className="flex justify-between mx-4">
          <div className="flex items-center">
            <img
              src={"../assets/images/hamar2.png"}
              width={40}
              height={40}
              className="h-6 w-6"
              alt="hamar image"
            />
            <p>
              <span className=" text-yellow-400 text-2xl font-extrabold outlinefont">
                {numberOfClicks}
              </span>
              <span className=" text-purple-900 font-semibold">/1000</span>
            </p>
          </div>
          <div className="flex items-center">
            <p className=" text-purple-900 font-semibold">100</p>
            <img
              src={"../assets/images/gem2.png"}
              width={40}
              height={40}
              className="h-6 w-6"
              alt="hamar image"
            />
          </div>
        </div>
        <ProgressBar
          score={numberOfClicks != 0 ? (numberOfClicks-30)*10: numberOfClicks*2.5}
          progressColor="#7A0BA0"
          primaryColor="#ffba07"
          secondaryColor="#ffeea3"
          hideText={true}
          className="text-center"
        />
        </div>
      }
      {
        numberOfClicks >= 41 && numberOfClicks<=50 && <div>
        <div className="flex justify-between mx-4">
          <div className="flex items-center">
            <img
              src={"../assets/images/hamar2.png"}
              width={40}
              height={40}
              className="h-6 w-6"
              alt="hamar image"
            />
            <p>
              <span className=" text-yellow-400 text-2xl font-extrabold outlinefont">
                {numberOfClicks}
              </span>
              <span className=" text-purple-900 font-semibold">/5000</span>
            </p>
          </div>
          <div className="flex items-center">
            <p className=" text-purple-900 font-semibold">100</p>
            <img
              src={"../assets/images/gem2.png"}
              width={40}
              height={40}
              className="h-6 w-6"
              alt="hamar image"
            />
          </div>
        </div>
        <ProgressBar
          score={numberOfClicks != 0 ? (numberOfClicks-40)*10: numberOfClicks*2}
          progressColor="#7A0BA0"
          primaryColor="#ffba07"
          secondaryColor="#ffeea3"
          hideText={true}
          className="text-center"
        />
        </div>
      }
      
    </div>
  );
};

export default ProgressSection;
