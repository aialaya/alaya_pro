const cache = new Map<string,HTMLImageElement>()
function loadImage(url:string, options = {crossOrigin:''}) :Promise<HTMLImageElement> {
    return new Promise(function (resolve, reject) {
      let img = document.createElement("img");
      img.crossOrigin = 'anonymous';  
      let done = () => {
        img.onload = img.onerror = null;
        resolve(img);
      };
      if (url) {
        img.onload = done;
        img.onerror = () => {
          reject(new Error("Error loading " + img.src));
        };
        options.crossOrigin !== '' && (img.crossOrigin = options.crossOrigin);
        img.src = url;
      } else {
        done();
      }
    });
  }
  function loadImageCache(url:string, options = {crossOrigin:''}) :Promise<HTMLImageElement> {
    if(cache.has(url)){
        return Promise.resolve(cache.get(url) as HTMLImageElement)
    }
    return loadImage(url, options).then(img=>{
        cache.set(url,img)
        return img
    })
  }
  function loadImages(images:string[]) :Promise<HTMLImageElement[]> {
    return Promise.all(images.map((image) => loadImageCache(image)));
  }
  
  export { loadImage, loadImages,loadImageCache };