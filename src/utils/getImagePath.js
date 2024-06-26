// utils/getImagePath.js
export const getImagePath = (userProgress, gameData, currentMascot) => {
    const currentLevel = userProgress.currentLevel;
    const numberOfClicks = gameData?.[currentMascot?.version]?.numberOfClicks || 0;
    const hitsCount = numberOfClicks / userProgress.EarnPerTap;
  
    let basePath = '../../assets/images/clicker-character/';
    if (hitsCount === 0) {
      return `${basePath}${currentLevel}-initial.png`;
    } else if (hitsCount % 2 === 1) {
      return `${basePath}${currentLevel}-hits-1.png`;
    } else {
      return `${basePath}${currentLevel}-hits-2.png`;
    }
  };

  export const getAllImagePaths = (userProgress) => {
    const currentLevel = userProgress.currentLevel;
    let basePath = '../../assets/images/clicker-character/';
    return [
      `${basePath}${currentLevel}-initial.png`,
      `${basePath}${currentLevel}-hits-1.png`,
      `${basePath}${currentLevel}-hits-2.png`,
    ];
  };
  