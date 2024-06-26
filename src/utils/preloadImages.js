export const preloadImages = (imagePaths) => {
    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });
  };
  