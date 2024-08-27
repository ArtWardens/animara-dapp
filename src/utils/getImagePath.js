const basePath = '/assets/images/clicker-character';

export const getAllImagePaths = (currentUser) => {
  const currentLevel = currentUser?.level || 1;
  
  return [
    `${basePath}/${currentLevel}-initial.webp`,
    `${basePath}/${currentLevel}-hits-1.webp`,
    `${basePath}/${currentLevel}-hits-2.webp`,
  ];
};
  