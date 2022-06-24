// DATA
export const PROJECTS = [
  {
    title: "Connected Mine",
    img: "https://i.imgur.com/j9kOzZS.png"
  },
  {
    title: "AVEnueS",
    img: "https://i.imgur.com/KksqRGy.png"
  },
  {
    title: "Damen Shipyards",
    img: "https://i.imgur.com/EzLK14L.png"
  },
  {
    title: "Gun Training in VR",
    img: "https://miro.medium.com/max/1080/0*pQr2iF3MqOVjQHjI"
  },
  {
    title: "Hololens Surgery",
    img: "https://i.imgur.com/KULOaQM.png"
  },
  {
    title: "Future Hyperloop Traveler",
    img: "https://i.imgur.com/873lbha.png"
  },
  {
    title: "VR Tetris",
    img: "https://i.imgur.com/K8aqfNC.png"
  },
  {
    title: "Mystical Well",
    img: "https://miro.medium.com/max/1400/1*7rSJDJ-oA-HX4WCtjNbsIQ.png"
  },
  {
    title: "Accenture One Space",
    img:
      "https://media-exp1.licdn.com/dms/image/C4E12AQGcZRe1WlhJZg/article-cover_image-shrink_600_2000/0/1632262281314?e=2147483647&v=beta&t=W1yykArfH4_bu0HWn68SYqVsqzLOVt8kT6fsuOhAAuU"
  },
  {
    title: "Random VR Project",
    img:
      "https://www.gannett-cdn.com/-mm-/01b3f144eb141b8cf7f41fc13e2b94d422d4e858/c=61-0-1862-1018/local/-/media/IAGroup/DesMoines/2014/09/22/1411405133000-Day4Globe.jpg"
  }
];

// SCREEN
export const SCREEN_SIZES = {
  width: window.innerWidth,
  height: window.innerHeight
};

// CAMERA
export const CAMERA_FOV = 30;
//(Math.atan(9 / 16) / Math.PI) * 180
export const CAMERA_FOV_RADIANS = CAMERA_FOV * (Math.PI / 180);
export const CAMERA_OFFSET = 1.5;

// MAGIC NUMBERS
export const cameraDistanceToThumbnail = 4.712;

// PROJECT
// width and height must follow the 16:9 ratio
export const PROJECT_WIDTH =
  2 *
  Math.tan(CAMERA_FOV_RADIANS / 2) *
  (SCREEN_SIZES.width / SCREEN_SIZES.height) *
  cameraDistanceToThumbnail;
export const PROJECT_HEIGTH = (9 / 16) * PROJECT_WIDTH;
export const PROJECT_DISTANCE_BETWEEN = 4;
export const PROJECT_OFFSET = 0.1;
export const PROJECT_BEND_POWER = 1.2;
export const PROJECT_BEND_STATE_FORWARD = 0;
export const PROJECT_BEND_STATE_BACKWARD = 1;
export const PROJECT_OFFSET_Y = 0.4;

// TUNNEL
export const RADIUS = 300;
export const TURNS = 3;
export const OBJ_PER_TURN = 600;
export const ANGLE_STEP = (Math.PI * 2) / OBJ_PER_TURN;
export const HEIGHT_STEP = 0.35;

export function getHelixCoordinatesBy(counter) {
  const x = HEIGHT_STEP * counter;
  const y = -Math.cos(ANGLE_STEP * counter) * RADIUS;
  const z = Math.sin(-ANGLE_STEP * counter) * RADIUS;

  return { x, y, z };
}

// REGENERATE
export const REGENERATION_NUMBER = 1;
