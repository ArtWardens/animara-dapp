import React, { useState, useEffect } from "react";

const Loading = () =>{
  const [loadingTick, setLoadingTick] = useState(0);

  useEffect(()=>{
    const tickTimer = setInterval(()=>{
      setLoadingTick(1 + (loadingTick + 1) % 3);
    },1000)
    return () => clearInterval(tickTimer);
  },[loadingTick, setLoadingTick]);

  return (
    <div className="flex bg-dark w-screen h-screen justify-center items-center">
      <span className='m-auto text-white text-xl lg:text-3xl'>
        {`Loading ${loadingTick === 1 ? `...` : loadingTick === 2 ? `..` : `.`}`}  
      </span>
    </div>
  );
}

export default Loading;