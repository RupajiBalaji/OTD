import type { BodyFrame, PosePreset, BodyAnchorCoordinates } from './character.types';

const BASE_FRAMES: Record<BodyFrame, BodyAnchorCoordinates> = {
  runway: {
    headCenter: [200, 82],
    headRadiusX: 22,
    headRadiusY: 28,
    neckTop: [200, 108],
    neckBottom: [200, 138],
    collarboneY: 144,
    shoulderLeft: [148, 154],
    shoulderRight: [252, 154],
    chestY: 194,
    waistLeft: [168, 256],
    waistRight: [232, 256],
    waistCenter: [200, 256],
    hipLeft: [158, 332],
    hipRight: [242, 332],
    crotchY: 350,
    kneeLeft: [176, 482],
    kneeRight: [224, 482],
    ankleLeft: [178, 616],
    ankleRight: [222, 616],
    footLeft: [176, 650],
    footRight: [224, 650],
    elbowLeft: [136, 242],
    elbowRight: [264, 242],
    wristLeft: [134, 330],
    wristRight: [266, 330],
    handLeft: [133, 362],
    handRight: [267, 362],
  },
  hourglass: {
    headCenter: [200, 82],
    headRadiusX: 22,
    headRadiusY: 28,
    neckTop: [200, 108],
    neckBottom: [200, 138],
    collarboneY: 144,
    shoulderLeft: [152, 156],
    shoulderRight: [248, 156],
    chestY: 196,
    waistLeft: [172, 254],
    waistRight: [228, 254],
    waistCenter: [200, 254],
    hipLeft: [148, 330],
    hipRight: [252, 330],
    crotchY: 348,
    kneeLeft: [174, 478],
    kneeRight: [226, 478],
    ankleLeft: [178, 614],
    ankleRight: [222, 614],
    footLeft: [176, 648],
    footRight: [224, 648],
    elbowLeft: [138, 244],
    elbowRight: [262, 244],
    wristLeft: [136, 330],
    wristRight: [264, 330],
    handLeft: [135, 362],
    handRight: [265, 362],
  },
  athletic: {
    headCenter: [200, 80],
    headRadiusX: 23,
    headRadiusY: 29,
    neckTop: [200, 106],
    neckBottom: [200, 136],
    collarboneY: 142,
    shoulderLeft: [140, 150],
    shoulderRight: [260, 150],
    chestY: 190,
    waistLeft: [164, 256],
    waistRight: [236, 256],
    waistCenter: [200, 256],
    hipLeft: [160, 334],
    hipRight: [240, 334],
    crotchY: 352,
    kneeLeft: [174, 484],
    kneeRight: [226, 484],
    ankleLeft: [176, 618],
    ankleRight: [224, 618],
    footLeft: [174, 652],
    footRight: [226, 652],
    elbowLeft: [130, 238],
    elbowRight: [270, 238],
    wristLeft: [128, 328],
    wristRight: [272, 328],
    handLeft: [127, 360],
    handRight: [273, 360],
  },
  petite: {
    headCenter: [200, 86],
    headRadiusX: 21,
    headRadiusY: 27,
    neckTop: [200, 112],
    neckBottom: [200, 140],
    collarboneY: 146,
    shoulderLeft: [156, 158],
    shoulderRight: [244, 158],
    chestY: 196,
    waistLeft: [172, 252],
    waistRight: [228, 252],
    waistCenter: [200, 252],
    hipLeft: [160, 324],
    hipRight: [240, 324],
    crotchY: 340,
    kneeLeft: [176, 466],
    kneeRight: [224, 466],
    ankleLeft: [178, 600],
    ankleRight: [222, 600],
    footLeft: [176, 634],
    footRight: [224, 634],
    elbowLeft: [142, 238],
    elbowRight: [258, 238],
    wristLeft: [140, 320],
    wristRight: [260, 320],
    handLeft: [139, 350],
    handRight: [261, 350],
  },
};

export function getBodyAnchors(frame: BodyFrame, pose: PosePreset = 'stand'): BodyAnchorCoordinates {
  const base = { ...BASE_FRAMES[frame] || BASE_FRAMES.runway };

  switch (pose) {
    case 'hand_on_hip': {
      // Left arm placed gracefully on hip with natural elbow flexion
      const hipX = base.waistLeft[0];
      const hipY = base.waistLeft[1];
      base.elbowLeft = [base.shoulderLeft[0] - 24, hipY - 14];
      base.wristLeft = [hipX - 4, hipY];
      base.handLeft = [hipX + 4, hipY + 6];
      // Subtle weight shift towards the right hip
      base.hipLeft = [base.hipLeft[0] - 3, base.hipLeft[1]];
      base.hipRight = [base.hipRight[0] - 3, base.hipRight[1]];
      break;
    }
    case 'walk_step': {
      // Left leg forward, right leg slightly back and angled
      base.kneeLeft = [base.kneeLeft[0] - 5, base.kneeLeft[1] - 6];
      base.ankleLeft = [base.ankleLeft[0] - 6, base.ankleLeft[1] - 3];
      base.footLeft = [base.footLeft[0] - 6, base.footLeft[1] - 3];

      base.kneeRight = [base.kneeRight[0] + 6, base.kneeRight[1] + 4];
      base.ankleRight = [base.ankleRight[0] + 8, base.ankleRight[1] + 2];
      base.footRight = [base.footRight[0] + 8, base.footRight[1] + 2];

      // Counter-balancing arms
      base.elbowLeft = [base.elbowLeft[0] - 6, base.elbowLeft[1] + 4];
      base.wristLeft = [base.wristLeft[0] - 8, base.wristLeft[1] + 8];
      base.elbowRight = [base.elbowRight[0] + 4, base.elbowRight[1] - 8];
      base.wristRight = [base.wristRight[0] + 6, base.wristRight[1] - 14];
      break;
    }
    case 'wave': {
      // Right arm raised gracefully in fashion greeting
      base.elbowRight = [base.shoulderRight[0] + 28, base.shoulderRight[1] - 28];
      base.wristRight = [base.shoulderRight[0] + 38, base.shoulderRight[1] - 68];
      base.handRight = [base.shoulderRight[0] + 40, base.shoulderRight[1] - 88];
      break;
    }
    case 'stand':
    default:
      break;
  }

  return base;
}
