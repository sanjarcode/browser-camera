function gotMedia(mediaStream) {
  const mediaStreamTrack = mediaStream.getVideoTracks()[0];
  const imageCapture = new ImageCapture(mediaStreamTrack);
  return imageCapture;
}

async function loadImageToPage(imageCapture, destinationElement) {
  const clickedPhotoBlob = await imageCapture.takePhoto();

  try {
    destinationElement.src = URL.createObjectURL(clickedPhotoBlob);
    destinationElement.onload = () => {
      URL.revokeObjectURL(this.src);
    };
  } catch (error) {
    console.error("takePhoto() error:", error);
  }
}

async function loadVideoToPage(imageCapture, destinationElement) {
  const imageBitmap = await imageCapture.grabFrame();
  try {
    destinationElement.width = imageBitmap.width;
    destinationElement.height = imageBitmap.height;
    await destinationElement.getContext("2d").drawImage(imageBitmap, 0, 0);
  } catch (error) {
    console.error("takePhoto() error:", error);
  }
  return imageBitmap;
}

async function main(destinationElement, loadingFunction) {
  const userMedia = await navigator.mediaDevices.getUserMedia({ video: true });
  try {
    const gottenMedia = gotMedia(userMedia);
    await loadingFunction(gottenMedia, destinationElement);
    // const result = await new FaceDetector().detect(imageBitmap);
    // console.log(result);
  } catch (error) {
    console.error("getUserMedia() error:", error);
  }
}

function videoHandler() {
  const canvas = document.querySelector("canvas");
  //   main(canvas);
  setInterval(() => {
    main(canvas, loadVideoToPage);
  }, 1000 / 22); // 60fps
}

function imageHandler() {
  const img = document.querySelector("img");
  main(img, loadImageToPage);
}
