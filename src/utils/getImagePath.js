const basePath = '/assets/images/clicker-character';

export const getAllImagePaths = (currentUser) => {
  const currentLevel = currentUser?.level || 1;
  
  return [
    `${basePath}/${currentLevel}-initial.png`,
    `${basePath}/${currentLevel}-hits-1.png`,
    `${basePath}/${currentLevel}-hits-2.png`,
  ];
};
  