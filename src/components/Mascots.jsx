import { mascots } from "../utils/local.db";
import React, { useState } from "react";

const Mascots = ({
  currentMascot,
  setCurrentMascot,
  gameData,
  setDelay,
  isLeaderBoardOpen,
  setIsLeaderBoardOpen,
}) => {
  // const handleOpen = () => {
  //   setIsLeaderBoardOpen(true);
  // }
  const [isModalOpen, setIModalOpen] = useState(true);
  const closeModal = () => {
    setIModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10 ml-14 mt-16 w-[30%] relative z-50">
      {/* mascot 1 */}
      <div>
        {currentMascot.version === mascots[0].version ? (


          <div className="relative w-[250px]  h-[100px] rotate-[20deg] -ml-3">
            <img
              src={"../assets/images/activeDogBg.png"}
              className="absolute -top-14 object-cover"
              fill
              alt="Dog"
            />

            <img
              src={"../assets/images/activeDog.png"}
              className="absolute w-[100px] h-[100px] -top-5"
              width={200}
              height={200}
              alt="Dog"
            />
            <div className="flex gap-4 justify-start items-end absolute right-6 top-1/2 -translate-y-1/2">
            <p className="active-dog ">
              DOG
            </p>
            <p className="text-[#A05209] relative top-2 ">
            {gameData?.mascot1?.quest}/5
            </p>

            </div>
            


            </div>

        ) : (


          <div 
               onClick={() => {
              setCurrentMascot(mascots[0]);
              setDelay(true);
            }}
          
          className="relative w-[200px]  h-[70px] rotate-[22deg] ml-5">

            <img
              src={"../assets/images/initialDogBg.png"}
              className="absolute -top-14 "
              fill
              alt="Dog"
            />

            <img
              src={"../assets/images/initialDog.png"}
              className="absolute w-[90px] h-[90px] bottom-2 -right-2"
              width={200}
              height={200}
              alt="Dog"
            />

         <div className="flex gap-4 justify-start items-end absolute left-2 top-1/2 -translate-y-1/2">
            <p className="inactive-dog ">
              DOG
            </p>
            <p className="text-[#580475] relative top-2 ">
            {gameData?.mascot1?.quest}/5
            </p>

            </div>


        </div>
        
        )}
      </div>

      {/* mascot 2  */}
      <div>
        {
        
        currentMascot.version === mascots[1].version ? (


          <div className="relative w-[250px]  h-[100px] -ml-10">
            <img
              src={"../assets/images/activeDogBg.png"}
              className="absolute -top-14 object-cover"
              fill
              alt="Dog"
            />

            <img
              src={"../assets/images/activeDog.png"}
              className="absolute w-[100px] h-[100px] -top-5"
              width={200}
              height={200}
              alt="Dog"
            />


<img
              src={"../assets/images/activeDog.png"}
              className="absolute w-[100px] h-[100px] -top-5"
              width={200}
              height={200}
              alt="Dog"
            />
            <div className="flex gap-4 justify-start items-end absolute right-6 top-1/2 -translate-y-1/2">
            <p className="active-dog ">
              DOG
            </p>
            <p className="text-[#A05209] relative top-2 ">
            {gameData?.mascot2?.quest}/5
            </p>

            </div>


            </div>
        
        
       
        ) : (
          <div 
          onClick={() => {
         setCurrentMascot(mascots[1]);
         setDelay(true);
       }}
     
     className="relative w-[200px]  h-[70px]  -ml-2">

<img
         src={"../assets/images/initialDogBg.png"}
         className="absolute -top-14 "
         fill
         alt="Dog"
       />

       

<img
              src={"../assets/images/initialDog.png"}
              className="absolute w-[90px] h-[90px] bottom-2 -right-2"
              width={200}
              height={200}
              alt="Dog"
            />

         <div className="flex gap-4 justify-start items-end absolute left-2 top-1/2 -translate-y-1/2">
            <p className="inactive-dog ">
              DOG
            </p>
            <p className="text-[#580475] relative top-2 ">
            {gameData?.mascot1?.quest}/5
            </p>

            </div>


   </div>
         
        )}
      </div>
      {/* mascot 3  */}
      <div>
        {

currentMascot.version === mascots[2].version ? (


  <div className="relative w-[250px]  h-[100px] -rotate-[20deg] -ml-4">
    <img
      src={"../assets/images/activeDogBg.png"}
      className="absolute -top-14 object-cover"
      fill
      alt="Dog"
    />

    <img
      src={"../assets/images/activeDog.png"}
      className="absolute w-[100px] h-[100px] -top-5"
      width={200}
      height={200}
      alt="Dog"
    />

<img
              src={"../assets/images/activeDog.png"}
              className="absolute w-[100px] h-[100px] -top-5"
              width={200}
              height={200}
              alt="Dog"
            />
            <div className="flex gap-4 justify-start items-end absolute right-6 top-1/2 -translate-y-1/2">
            <p className="active-dog ">
              DOG
            </p>
            <p className="text-[#A05209] relative top-2 ">
            {gameData?.mascot3?.quest}/5
            </p>

            </div>


    </div>
        
        

        ) : (

          <div 
          onClick={() => {
         setCurrentMascot(mascots[2]);
         setDelay(true);
       }}
     
     className="relative w-[200px]  h-[70px]   -rotate-[22deg] ml-8">

<img
         src={"../assets/images/initialDogBg.png"}
         className="absolute -top-14 "
         fill
         alt="Dog"
       />

<img
              src={"../assets/images/initialDog.png"}
              className="absolute w-[90px] h-[90px] bottom-2 -right-2"
              width={200}
              height={200}
              alt="Dog"
            />

         <div className="flex gap-4 justify-start items-end absolute left-2 top-1/2 -translate-y-1/2">
            <p className="inactive-dog ">
              DOG
            </p>
            <p className="text-[#580475] relative top-2 ">
            {gameData?.mascot1?.quest}/5
            </p>

            </div>


   </div>
       
        )}
      </div>

      <div>
        <img
          src={"../assets/images/leaderboardbtn.png"}
          className=" select-none -rotate-[18deg] -ml-10 mt-4"
          onClick={() => setIsLeaderBoardOpen(true)}
          width={260}
          height={180}
          alt="leaderboard"
          draggable="false"
        />
      </div>
    </div>
  );
};

export default Mascots;
