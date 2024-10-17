const basePath = '/assets/images/clicker-character/ani-character-leveling';

export const getAllImagePaths = (currentUser) => {
  const currentLevel = currentUser?.level || 1;
  const effectiveLevel = Math.floor((currentLevel - 1) / 2) + 1;
  
  return [
    `${basePath}/${effectiveLevel}-initial.webp`,
    `${basePath}/${effectiveLevel}-hits-1.webp`,
    `${basePath}/${effectiveLevel}-hits-2.webp`,
  ];
};