export function cropper() {
  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  var image = new Image();
  image.src = "https://live.staticflickr.com/47/150654741_ae02588670_b.jpg";

  /**
   * Draw the image with drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
   * Crop operations require all nine parameters:
    - image: the image to crop
    - sx, sy - x-coordinate, and the y-coordinate from which to start cropping the image.
    - sw, sh - width of the cropped version, starting from sx and sy.
      dx, dy - point from which to start drawing the cropped version on the canvas.
      dw, dh - width and height of the cropped version to be displayed.
   */
  image.onload = () => {
    const size = Math.min(image.width, image.height);
    context.drawImage(image, 100, 100, 200, 200, 50, 50, 200, 200);
  };
}
