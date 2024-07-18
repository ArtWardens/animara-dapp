export const getImagePath = (userProgress, gameData, currentMascot, currentUser) => {

    // const currentLevel = gameData?.[currentMascot?.version]?.level;
    const currentLevel = currentUser?.level;
    const numberOfClicks = gameData?.[currentMascot?.version]?.numberOfClicks || 0;
    const hitsCount = numberOfClicks / userProgress.EarnPerTap;

    // console.log(currentLevel);
    // console.log(hitsCount);
  
    let basePath = '../../assets/images/clicker-character/';
    if (hitsCount === 0) {
      return `${basePath}${currentLevel}-initial.png`;
    } else if (hitsCount % 2 === 1) {
      return `${basePath}${currentLevel}-hits-1.png`;
    } else {
      return `${basePath}${currentLevel}-hits-2.png`;
    }
  };

  export const getAllImagePaths = (currentUser) => {
    const currentLevel = currentUser.level;
    let basePath = '../../assets/images/clicker-character/';
    return [
      `${basePath}${currentLevel}-initial.png`,
      `${basePath}${currentLevel}-hits-1.png`,
      `${basePath}${currentLevel}-hits-2.png`,
    ];
  };
  