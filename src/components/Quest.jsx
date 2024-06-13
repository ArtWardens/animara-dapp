
import React, { useEffect, useState } from "react";
import TASK_TEXT from "../assets/images/TASK-TEXT.png";

const Quest = ({ gameData, currentMascot }) => {
  const numberOfClicks = gameData?.[currentMascot?.version]?.numberOfClicks;
  const quest = gameData?.[currentMascot?.version]?.quest;
  return (
    <div className="w-[30%] h-screen flex justify-center items-center">
      {/* <Tilt> */}
      {/* <div style={{ height: '300px', backgroundColor: 'darkgreen' }}> */}
      <div className=" w-[323px] h-[387px] bg-quest-card bg-no-repeat bg-cover rounded-[14px] shadow-inner  relative flex flex-col justify-center items-center">
        <div className="absolute top-[-50px] -left-1 w-[65%]">
          <h3 className="text-fuchsia-600 text-[80px] task font-LuckiestGuy relative  z-20">
            Task
            <img
              height={29}
              width={238}
              src={TASK_TEXT}
              alt="TASK_TEXT"
              className="absolute object-cover  bottom-3 -z-20"
            />
          </h3>
        </div>

        <div className="w-[95%]  flex flex-col justify-center items-center gap-2 ">
          <div className=" flex justify-between items-center gap-3">
            <div className="flex items-center justify-center gap-1">
              <div className="relative">
                <p
                  className={` ${
                    quest >= 1 ? "passed-quest1" : "tsk-text"
                  }  font-LuckiestGuy `}
                >
                  10
                </p>
                {
                  quest>=1 && <img
                  src={"../assets/images/star.png"}
                  width={10}
                  height={10}
                  className="h-4 w-4 passed-quest2 absolute top-1 -left-2"
                  alt="hamar image"
                />
                }
                {
                  quest>=1 && <img
                  src={"../assets/images/star.png"}
                  width={10}
                  height={10}
                  className="h-5 w-5 passed-quest2 absolute bottom-0 left-[30%]"
                  alt="hamar image"
                />
                }
                
                {/* <img
                src={"../assets/images/star.png"}
                width={10}
                height={10}
                className="h-4 w-4 passed-quest2 absolute bottom-0 -right-2 top-[30%]"
                alt="hamar image"
              /> */}
              </div>
              <img
                src={"../assets/images/hamar2.png"}
                width={30}
                height={30}
                alt="hamar image "
                className="w-[30px] h-[30px]"
              />
            </div>
            <span className="text-white block text-[10px] space-x-1">
              <span>.</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
            <div className="flex items-center justify-center gap-2">
              <p
                className={` ${
                  quest >= 1 ? "passed-quest2" : "tsk-point"
                }  font-LuckiestGuy `}
              >
                100
              </p>
              {
                quest>=1? <div className="relative">
                  <img
                src={"../assets/images/gem3.png"}
                width={40}
                height={40}
                className="h-7 w-7 passed-quest2"
                alt="hamar image"
              />
              <img
                src={"../assets/images/star.png"}
                width={10}
                height={10}
                className="h-3 w-3 passed-quest2 absolute bottom-[15%] right-[10%]"
                alt="hamar image"
              />
                </div>: <img
              src={"../assets/images/gem.png"}
              width={40}
              height={40}
              className="h-7 w-7 passed-quest2"
              alt="hamar image"
            />
              }
              
            </div>

            
            
          </div>
          <img
              src={"../assets/images/separetor.png"}
              width={40}
              height={260}
              className="h-[3px] w-36"
              alt="hamar image"
            />
          <div className=" flex justify-between items-center gap-3">
            <div className="flex items-center justify-center gap-1">
              <div className="relative">
                <p
                  className={` ${
                    quest >= 2 ? "passed-quest1" : "tsk-text"
                  }  font-LuckiestGuy `}
                >
                  20
                </p>
                {
                  quest>=2 && <img
                  src={"../assets/images/star.png"}
                  width={10}
                  height={10}
                  className="h-4 w-4 passed-quest2 absolute top-1 -left-2"
                  alt="hamar image"
                />
                }
                {
                  quest>=2 && <img
                  src={"../assets/images/star.png"}
                  width={10}
                  height={10}
                  className="h-5 w-5 passed-quest2 absolute bottom-0 left-[30%]"
                  alt="hamar image"
                />
                }
              </div>
              <img
                src={"../assets/images/hamar2.png"}
                width={30}
                height={30}
                alt="hamar image "
                className="w-[30px] h-[30px]"
              />
            </div>
            <span className="text-white block text-[10px] space-x-1">
              <span>.</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
            <div className="flex items-center justify-center gap-2">
              <p
                className={` ${
                  quest >= 2 ? "passed-quest2" : "tsk-point"
                }  font-LuckiestGuy `}
              >
                100
              </p>
              {
                quest>=2? <div className="relative">
                  <img
                src={"../assets/images/gem3.png"}
                width={40}
                height={40}
                className="h-7 w-7 passed-quest2"
                alt="hamar image"
              />
              <img
                src={"../assets/images/star.png"}
                width={10}
                height={10}
                className="h-3 w-3 passed-quest2 absolute bottom-[15%] right-[10%]"
                alt="hamar image"
              />
                </div>: <img
              src={"../assets/images/gem.png"}
              width={40}
              height={40}
              className="h-7 w-7 passed-quest2"
              alt="hamar image"
            />
              }
              
            </div>

            
            
          </div>
          <img
              src={"../assets/images/separetor.png"}
              width={40}
              height={260}
              className="h-[3px] w-36"
              alt="hamar image"
            />
          <div className=" flex justify-between items-center gap-3">
            <div className="flex items-center justify-center gap-1">
              <div className="relative">
                <p
                  className={` ${
                    quest >= 3 ? "passed-quest1" : "tsk-text"
                  }  font-LuckiestGuy `}
                >
                  30
                </p>
                {
                  quest>=3 && <img
                  src={"../assets/images/star.png"}
                  width={10}
                  height={10}
                  className="h-4 w-4 passed-quest2 absolute top-1 -left-2"
                  alt="hamar image"
                />
                }
                {
                  quest>=3 && <img
                  src={"../assets/images/star.png"}
                  width={10}
                  height={10}
                  className="h-5 w-5 passed-quest2 absolute bottom-0 left-[30%]"
                  alt="hamar image"
                />
                }
                
                {/* <img
                src={"../assets/images/star.png"}
                width={10}
                height={10}
                className="h-4 w-4 passed-quest2 absolute bottom-0 -right-2 top-[30%]"
                alt="hamar image"
              /> */}
              </div>
              <img
                src={"../assets/images/hamar2.png"}
                width={30}
                height={30}
                alt="hamar image "
                className="w-[30px] h-[30px]"
              />
            </div>
            <span className="text-white block text-[10px] space-x-1">
              <span>.</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
            <div className="flex items-center justify-center gap-2">
              <p
                className={` ${
                  quest >= 3 ? "passed-quest2" : "tsk-point"
                }  font-LuckiestGuy `}
              >
                100
              </p>
              {
                quest>=3? <div className="relative">
                  <img
                src={"../assets/images/gem3.png"}
                width={40}
                height={40}
                className="h-7 w-7 passed-quest2"
                alt="hamar image"
              />
              <img
                src={"../assets/images/star.png"}
                width={10}
                height={10}
                className="h-3 w-3 passed-quest2 absolute bottom-[15%] right-[10%]"
                alt="hamar image"
              />
                </div>: <img
              src={"../assets/images/gem.png"}
              width={40}
              height={40}
              className="h-7 w-7 passed-quest2"
              alt="hamar image"
            />
              }
              
            </div>

            
            
          </div>
          <img
              src={"../assets/images/separetor.png"}
              width={40}
              height={260}
              className="h-[3px] w-36"
              alt="hamar image"
            />
          <div className=" flex justify-between items-center gap-3">
            <div className="flex items-center justify-center gap-1">
              <div className="relative">
                <p
                  className={` ${
                    quest >= 4 ? "passed-quest1" : "tsk-text"
                  }  font-LuckiestGuy `}
                >
                  40
                </p>
                {
                  quest>=4 && <img
                  src={"../assets/images/star.png"}
                  width={10}
                  height={10}
                  className="h-4 w-4 passed-quest2 absolute top-1 -left-2"
                  alt="hamar image"
                />
                }
                {
                  quest>=4 && <img
                  src={"../assets/images/star.png"}
                  width={10}
                  height={10}
                  className="h-5 w-5 passed-quest2 absolute bottom-0 left-[30%]"
                  alt="hamar image"
                />
                }
                
                {/* <img
                src={"../assets/images/star.png"}
                width={10}
                height={10}
                className="h-4 w-4 passed-quest2 absolute bottom-0 -right-2 top-[30%]"
                alt="hamar image"
              /> */}
              </div>
              <img
                src={"../assets/images/hamar2.png"}
                width={30}
                height={30}
                alt="hamar image "
                className="w-[30px] h-[30px]"
              />
            </div>
            <span className="text-white block text-[10px] space-x-1">
              <span>.</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
            <div className="flex items-center justify-center gap-2">
              <p
                className={` ${
                  quest >= 4 ? "passed-quest2" : "tsk-point"
                }  font-LuckiestGuy `}
              >
                100
              </p>
              {
                quest>=4? <div className="relative">
                  <img
                src={"../assets/images/gem3.png"}
                width={40}
                height={40}
                className="h-7 w-7 passed-quest2"
                alt="hamar image"
              />
              <img
                src={"../assets/images/star.png"}
                width={10}
                height={10}
                className="h-3 w-3 passed-quest2 absolute bottom-[15%] right-[10%]"
                alt="hamar image"
              />
                </div>: <img
              src={"../assets/images/gem.png"}
              width={40}
              height={40}
              className="h-7 w-7 passed-quest2"
              alt="hamar image"
            />
              }
              
            </div>

            
            
          </div>
          <img
              src={"../assets/images/separetor.png"}
              width={40}
              height={260}
              className="h-[3px] w-36"
              alt="hamar image"
            />
          <div className=" flex justify-between items-center gap-3">
            <div className="flex items-center justify-center gap-1">
              <div className="relative">
                <p
                  className={` ${
                    quest >= 5 ? "passed-quest1" : "tsk-text"
                  }  font-LuckiestGuy `}
                >
                  50
                </p>
                {
                  quest>=5 && <img
                  src={"../assets/images/star.png"}
                  width={10}
                  height={10}
                  className="h-4 w-4 passed-quest2 absolute top-1 -left-2"
                  alt="hamar image"
                />
                }
                {
                  quest>=5 && <img
                  src={"../assets/images/star.png"}
                  width={10}
                  height={10}
                  className="h-5 w-5 passed-quest2 absolute bottom-0 left-[30%]"
                  alt="hamar image"
                />
                }
                
                {/* <img
                src={"../assets/images/star.png"}
                width={10}
                height={10}
                className="h-4 w-4 passed-quest2 absolute bottom-0 -right-2 top-[30%]"
                alt="hamar image"
              /> */}
              </div>
              <img
                src={"../assets/images/hamar2.png"}
                width={30}
                height={30}
                alt="hamar image "
                className="w-[30px] h-[30px]"
              />
            </div>
            <span className="text-white block text-[10px] space-x-1">
              <span>.</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
            <div className="flex items-center justify-center gap-2">
              <p
                className={` ${
                  quest >= 5 ? "passed-quest2" : "tsk-point"
                }  font-LuckiestGuy `}
              >
                100
              </p>
              {
                quest>=5? <div className="relative">
                  <img
                src={"../assets/images/gem3.png"}
                width={40}
                height={40}
                className="h-7 w-7 passed-quest2"
                alt="hamar image"
              />
              <img
                src={"../assets/images/star.png"}
                width={10}
                height={10}
                className="h-3 w-3 passed-quest2 absolute bottom-[15%] right-[10%]"
                alt="hamar image"
              />
                </div>: <img
              src={"../assets/images/gem.png"}
              width={40}
              height={40}
              className="h-7 w-7 passed-quest2"
              alt="hamar image"
            />
              }
              
            </div>

            
            
          </div>
          <img
              src={"../assets/images/separetor.png"}
              width={40}
              height={260}
              className="h-[3px] w-36"
              alt="hamar image"
            />
          {/* <div className=" flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span
                className={`${
                  quest >= 2 ? "text-yellow-400" : "text-white"
                } text-2xl font-extrabold outlinefont`}
              >
                200
              </span>
              <img
                src={"../assets/images/hamar2.png"}
                width={40}
                height={40}
                alt="hamar image"
              />
            </div>
            <span className="text-white">. . . . .</span>
            <div className="flex items-center">
              <p className="text-2xl font-semibold text-white font-LuckiestGuy outlinefont">
                100PT
              </p>
              <img
                src={"../assets/images/gem2.png"}
                width={40}
                height={40}
                className="h-7 w-7"
                alt="hamar image"
              />
            </div>
          </div>
          <div className=" flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span
                className={`${
                  quest >= 3 ? "text-yellow-400" : "text-white"
                } text-2xl font-extrabold outlinefont`}
              >
                500
              </span>
              <img
                src={"../assets/images/hamar2.png"}
                width={40}
                height={40}
                alt="hamar image"
              />
            </div>
            <span className="text-white">. . . . .</span>
            <div className="flex items-center">
              <p className="text-2xl font-semibold text-white font-LuckiestGuy outlinefont">
                100PT
              </p>
              <img
                src={"../assets/images/gem2.png"}
                width={40}
                height={40}
                className="h-7 w-7"
                alt="hamar image"
              />
            </div>
          </div>
          <div className=" flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span
                className={`${
                  quest >= 4 ? "text-yellow-400" : "text-white"
                } text-2xl font-extrabold outlinefont`}
              >
                1000
              </span>
              <img
                src={"../assets/images/hamar2.png"}
                width={40}
                height={40}
                alt="hamar image"
              />
            </div>
            <span className="text-white">. . . . .</span>
            <div className="flex items-center">
              <p className="text-2xl font-semibold text-white font-LuckiestGuy outlinefont">
                100PT
              </p>
              <img
                src={"../assets/images/gem2.png"}
                width={40}
                height={40}
                className="h-7 w-7"
                alt="hamar image"
              />
            </div>
          </div>
          <div className=" flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span
                className={`${
                  quest >= 5 ? "text-yellow-400" : "text-white"
                } text-2xl font-extrabold outlinefont`}
              >
                5000
              </span>
              <img
                src={"../assets/images/hamar2.png"}
                width={40}
                height={40}
                alt="hamar image"
              />
            </div>
            <span className="text-white">. . . . .</span>
            <div className="flex items-center">
              <p className="text-2xl font-semibold text-white font-LuckiestGuy outlinefont">
                100PT
              </p>
              <img
                src={"../assets/images/gem2.png"}
                width={40}
                height={40}
                className="h-7 w-7"
                alt="hamar image"
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Quest;