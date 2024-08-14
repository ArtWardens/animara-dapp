export const getImagePath = (currentUser) => {
  const currentLevel = currentUser.level || 1;
  const hitsCount = currentUser.maxStamina - currentUser.stamina || 0;

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
  