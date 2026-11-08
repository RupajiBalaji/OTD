import type { ClosetItem } from '../../context/ClosetContext';

export type BodyFrame = 'runway' | 'hourglass' | 'athletic' | 'petite';

export type PosePreset = 'stand' | 'hand_on_hip' | 'walk_step' | 'wave';

export type GarmentTemplateType =
  | 'tee'
  | 'shirt'
  | 'kurta'
  | 'hoodie_sweater'
  | 'jacket_blazer'
  | 'jeans_trousers'
  | 'shorts'
  | 'skirt'
  | 'dress'
  | 'saree'
  | 'sneakers'
  | 'sandals_slippers'
  | 'formal_shoes'
  | 'accessories'
  | 'generic';

export type GarmentPattern = 'solid' | 'stripe' | 'check' | 'floral' | 'print';

export interface SkinToneDefinition {
  id: string;
  name: string;
  hex: string;
  shadowHex: string;
  highlightHex: string;
}

export interface HairstyleDefinition {
  id: string;
  name: string;
  category: 'short' | 'medium' | 'long' | 'updo';
  description: string;
}

export interface HairColorDefinition {
  id: string;
  name: string;
  hex: string;
  highlightHex: string;
}

export interface CharacterCustomization {
  skinToneId: string;
  bodyFrame: BodyFrame;
  hairstyleId: string;
  hairColorId: string;
  avatarVersion: number;
}

export interface GarmentVisualProps {
  itemId?: string;
  name: string;
  category: string;
  templateType: GarmentTemplateType;
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  pattern: GarmentPattern;
  fit?: 'slim' | 'tailored' | 'relaxed';
  sleeve?: 'short' | 'long' | 'sleeveless';
  length?: 'short' | 'regular' | 'long';
  neckline?: 'crew' | 'v' | 'collar' | 'mandarin';
  printTextureUrl?: string;
  isFallback?: boolean;
}

export interface CharacterOutfitState {
  top?: ClosetItem | null;
  bottom?: ClosetItem | null;
  footwear?: ClosetItem | null;
  outerwear?: ClosetItem | null;
  onePiece?: ClosetItem | null;
  accessory?: ClosetItem | null;
}

export interface BodyAnchorCoordinates {
  // Head
  headCenter: [number, number];
  headRadiusX: number;
  headRadiusY: number;
  neckTop: [number, number];
  neckBottom: [number, number];
  collarboneY: number;

  // Torso
  shoulderLeft: [number, number];
  shoulderRight: [number, number];
  chestY: number;
  waistLeft: [number, number];
  waistRight: [number, number];
  waistCenter: [number, number];
  hipLeft: [number, number];
  hipRight: [number, number];
  crotchY: number;

  // Legs & Feet
  kneeLeft: [number, number];
  kneeRight: [number, number];
  ankleLeft: [number, number];
  ankleRight: [number, number];
  footLeft: [number, number];
  footRight: [number, number];

  // Arms & Hands
  elbowLeft: [number, number];
  elbowRight: [number, number];
  wristLeft: [number, number];
  wristRight: [number, number];
  handLeft: [number, number];
  handRight: [number, number];
}
