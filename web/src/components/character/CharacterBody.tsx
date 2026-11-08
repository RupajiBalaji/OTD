import React from 'react';
import type { BodyAnchorCoordinates, CharacterCustomization } from './character.types';
import { getSkinTone, getHairstyle, getHairColor } from './character.palette';

interface CharacterBodyProps {
  anchors: BodyAnchorCoordinates;
  customization: CharacterCustomization;
  isBlinking?: boolean;
}

export const CharacterHairBack: React.FC<CharacterBodyProps> = ({
  anchors,
  customization,
}) => {
  const hair = getHairstyle(customization.hairstyleId);
  const color = getHairColor(customization.hairColorId);
  const [hx, hy] = anchors.headCenter;

  if (hair.id === 'long_straight' || hair.id === 'long_waves') {
    return (
      <g id="hair-back" className="transition-all duration-300">
        <path
          d={`M ${hx - 24} ${hy + 14} 
             C ${hx - 32} ${hy + 60}, ${hx - 36} ${anchors.collarboneY + 70}, ${hx - 30} ${anchors.collarboneY + 130}
             C ${hx - 15} ${anchors.collarboneY + 140}, ${hx + 15} ${anchors.collarboneY + 140}, ${hx + 30} ${anchors.collarboneY + 130}
             C ${hx + 36} ${anchors.collarboneY + 70}, ${hx + 32} ${hy + 60}, ${hx + 24} ${hy + 14} Z`}
          fill={color.hex}
          opacity="0.95"
        />
        <path
          d={`M ${hx - 18} ${hy + 22} 
             C ${hx - 24} ${hy + 75}, ${hx - 28} ${anchors.collarboneY + 90}, ${hx - 22} ${anchors.collarboneY + 125}
             L ${hx + 22} ${anchors.collarboneY + 125}
             C ${hx + 28} ${anchors.collarboneY + 90}, ${hx + 24} ${hy + 75}, ${hx + 18} ${hy + 22} Z`}
          fill={color.highlightHex}
          opacity="0.3"
        />
      </g>
    );
  }

  if (hair.id === 'top_knot') {
    return (
      <g id="hair-back-bun">
        <ellipse
          cx={hx}
          cy={hy - anchors.headRadiusY - 10}
          rx={15}
          ry={13}
          fill={color.hex}
        />
        <ellipse
          cx={hx - 3}
          cy={hy - anchors.headRadiusY - 12}
          rx={7}
          ry={6}
          fill={color.highlightHex}
          opacity="0.4"
        />
      </g>
    );
  }

  return null;
};

export const CharacterBody: React.FC<CharacterBodyProps> = ({
  anchors,
  customization,
  isBlinking = false,
}) => {
  const skin = getSkinTone(customization.skinToneId);
  const [hx, hy] = anchors.headCenter;
  const [hrx, hry] = [anchors.headRadiusX, anchors.headRadiusY];

  // Head and jaw path (fashion illustration oval with gently tapered chin)
  const headPath = `
    M ${hx} ${hy - hry}
    C ${hx + hrx} ${hy - hry}, ${hx + hrx * 0.98} ${hy}, ${hx + hrx * 0.7} ${hy + hry * 0.72}
    C ${hx + hrx * 0.4} ${hy + hry}, ${hx} ${hy + hry * 1.05}, ${hx} ${hy + hry * 1.05}
    C ${hx} ${hy + hry * 1.05}, ${hx - hrx * 0.4} ${hy + hry}, ${hx - hrx * 0.7} ${hy + hry * 0.72}
    C ${hx - hrx * 0.98} ${hy}, ${hx - hrx} ${hy - hry}, ${hx} ${hy - hry} Z
  `;

  return (
    <g id="character-body" className="transition-all duration-300 select-none">
      {/* 1. Neck with graceful trapezius transition */}
      <path
        d={`M ${hx - 9} ${hy + hry * 0.75}
           C ${hx - 9} ${anchors.collarboneY - 15}, ${hx - 14} ${anchors.collarboneY - 6}, ${anchors.shoulderLeft[0] + 12} ${anchors.collarboneY}
           L ${anchors.shoulderRight[0] - 12} ${anchors.collarboneY}
           C ${hx + 14} ${anchors.collarboneY - 6}, ${hx + 9} ${anchors.collarboneY - 15}, ${hx + 9} ${hy + hry * 0.75} Z`}
        fill={skin.hex}
      />
      {/* Neck Shadow Under Chin */}
      <path
        d={`M ${hx - 8} ${hy + hry * 0.8}
           C ${hx - 4} ${hy + hry * 1.02}, ${hx + 4} ${hy + hry * 1.02}, ${hx + 8} ${hy + hry * 0.8}
           L ${hx + 9} ${hy + hry + 12}
           L ${hx - 9} ${hy + hry + 12} Z`}
        fill={skin.shadowHex}
        opacity="0.32"
      />

      {/* 2. Torso Silhouette with natural anatomical shoulder slope */}
      <path
        d={`M ${anchors.shoulderLeft[0]} ${anchors.shoulderLeft[1]}
           C ${anchors.shoulderLeft[0] + 8} ${anchors.chestY}, ${anchors.waistLeft[0] - 4} ${anchors.waistLeft[1] - 15}, ${anchors.waistLeft[0]} ${anchors.waistLeft[1]}
           C ${anchors.waistLeft[0] + 4} ${anchors.waistLeft[1] + 35}, ${anchors.hipLeft[0] - 6} ${anchors.hipLeft[1] - 15}, ${anchors.hipLeft[0]} ${anchors.hipLeft[1]}
           L ${anchors.hipRight[0]} ${anchors.hipRight[1]}
           C ${anchors.hipRight[0] + 6} ${anchors.hipRight[1] - 15}, ${anchors.waistRight[0] - 4} ${anchors.waistRight[1] + 35}, ${anchors.waistRight[0]} ${anchors.waistRight[1]}
           C ${anchors.waistRight[0] + 4} ${anchors.waistRight[1] - 15}, ${anchors.shoulderRight[0] - 8} ${anchors.chestY}, ${anchors.shoulderRight[0]} ${anchors.shoulderRight[1]}
           C ${anchors.shoulderRight[0] - 18} ${anchors.collarboneY + 2}, ${hx + 14} ${anchors.collarboneY - 4}, ${hx} ${anchors.collarboneY - 2}
           C ${hx - 14} ${anchors.collarboneY - 4}, ${anchors.shoulderLeft[0] + 18} ${anchors.collarboneY + 2}, ${anchors.shoulderLeft[0]} ${anchors.shoulderLeft[1]} Z`}
        fill={skin.hex}
      />

      {/* Collarbone Accent */}
      <path
        d={`M ${hx - 24} ${anchors.collarboneY + 2} Q ${hx - 12} ${anchors.collarboneY + 6} ${hx - 4} ${anchors.collarboneY + 2}`}
        stroke={skin.shadowHex}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d={`M ${hx + 4} ${anchors.collarboneY + 2} Q ${hx + 12} ${anchors.collarboneY + 6} ${hx + 24} ${anchors.collarboneY + 2}`}
        stroke={skin.shadowHex}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />

      {/* 3. Left Leg (Thigh, Knee, Calf, Ankle) */}
      <path
        d={`M ${anchors.hipLeft[0] + 4} ${anchors.hipLeft[1]}
           C ${anchors.hipLeft[0] - 6} ${anchors.hipLeft[1] + 60}, ${anchors.kneeLeft[0] - 10} ${anchors.kneeLeft[1] - 25}, ${anchors.kneeLeft[0] - 8} ${anchors.kneeLeft[1]}
           C ${anchors.kneeLeft[0] - 7} ${anchors.kneeLeft[1] + 55}, ${anchors.ankleLeft[0] - 6} ${anchors.ankleLeft[1] - 20}, ${anchors.ankleLeft[0] - 5} ${anchors.ankleLeft[1]}
           L ${anchors.ankleLeft[0] + 6} ${anchors.ankleLeft[1]}
           C ${anchors.ankleLeft[0] + 5} ${anchors.ankleLeft[1] - 20}, ${anchors.kneeLeft[0] + 7} ${anchors.kneeLeft[1] + 55}, ${anchors.kneeLeft[0] + 8} ${anchors.kneeLeft[1]}
           C ${anchors.kneeLeft[0] + 8} ${anchors.kneeLeft[1] - 25}, 200 ${anchors.crotchY + 35}, 200 ${anchors.crotchY} Z`}
        fill={skin.hex}
      />
      {/* Left Foot */}
      <path
        d={`M ${anchors.ankleLeft[0] - 5} ${anchors.ankleLeft[1]}
           C ${anchors.ankleLeft[0] - 7} ${anchors.footLeft[1] - 6}, ${anchors.footLeft[0] - 9} ${anchors.footLeft[1] + 4}, ${anchors.footLeft[0] - 4} ${anchors.footLeft[1] + 12}
           L ${anchors.footLeft[0] + 8} ${anchors.footLeft[1] + 12}
           C ${anchors.footLeft[0] + 9} ${anchors.footLeft[1] + 4}, ${anchors.ankleLeft[0] + 7} ${anchors.footLeft[1] - 6}, ${anchors.ankleLeft[0] + 6} ${anchors.ankleLeft[1]} Z`}
        fill={skin.hex}
      />

      {/* 4. Right Leg (Thigh, Knee, Calf, Ankle) */}
      <path
        d={`M 200 ${anchors.crotchY}
           C 200 ${anchors.crotchY + 35}, ${anchors.kneeRight[0] - 8} ${anchors.kneeRight[1] - 25}, ${anchors.kneeRight[0] - 8} ${anchors.kneeRight[1]}
           C ${anchors.kneeRight[0] - 7} ${anchors.kneeRight[1] + 55}, ${anchors.ankleRight[0] - 5} ${anchors.ankleRight[1] - 20}, ${anchors.ankleRight[0] - 6} ${anchors.ankleRight[1]}
           L ${anchors.ankleRight[0] + 5} ${anchors.ankleRight[1]}
           C ${anchors.ankleRight[0] + 6} ${anchors.ankleRight[1] - 20}, ${anchors.kneeRight[0] + 7} ${anchors.kneeRight[1] + 55}, ${anchors.kneeRight[0] + 8} ${anchors.kneeRight[1]}
           C ${anchors.kneeRight[0] + 10} ${anchors.kneeRight[1] - 25}, ${anchors.hipRight[0] + 6} ${anchors.hipRight[1] + 60}, ${anchors.hipRight[0] - 4} ${anchors.hipRight[1]} Z`}
        fill={skin.hex}
      />
      {/* Right Foot */}
      <path
        d={`M ${anchors.ankleRight[0] - 6} ${anchors.ankleRight[1]}
           C ${anchors.ankleRight[0] - 7} ${anchors.footRight[1] - 6}, ${anchors.footRight[0] - 9} ${anchors.footRight[1] + 4}, ${anchors.footRight[0] - 8} ${anchors.footRight[1] + 12}
           L ${anchors.footRight[0] + 4} ${anchors.footRight[1] + 12}
           C ${anchors.footRight[0] + 9} ${anchors.footRight[1] + 4}, ${anchors.ankleRight[0] + 7} ${anchors.footRight[1] - 6}, ${anchors.ankleRight[0] + 5} ${anchors.ankleRight[1]} Z`}
        fill={skin.hex}
      />

      {/* 5. Left Arm & Hand with smooth anatomical contours */}
      <path
        d={`M ${anchors.shoulderLeft[0]} ${anchors.shoulderLeft[1]}
           C ${anchors.shoulderLeft[0] - 7} ${anchors.shoulderLeft[1] + 35}, ${anchors.elbowLeft[0] - 6} ${anchors.elbowLeft[1] - 15}, ${anchors.elbowLeft[0] - 5} ${anchors.elbowLeft[1]}
           C ${anchors.elbowLeft[0] - 4} ${anchors.elbowLeft[1] + 35}, ${anchors.wristLeft[0] - 4} ${anchors.wristLeft[1] - 15}, ${anchors.wristLeft[0] - 3} ${anchors.wristLeft[1]}
           L ${anchors.wristLeft[0] + 6} ${anchors.wristLeft[1]}
           C ${anchors.wristLeft[0] + 5} ${anchors.wristLeft[1] - 15}, ${anchors.elbowLeft[0] + 5} ${anchors.elbowLeft[1] + 35}, ${anchors.elbowLeft[0] + 5} ${anchors.elbowLeft[1]}
           C ${anchors.elbowLeft[0] + 5} ${anchors.elbowLeft[1] - 15}, ${anchors.shoulderLeft[0] + 7} ${anchors.shoulderLeft[1] + 35}, ${anchors.shoulderLeft[0] + 5} ${anchors.shoulderLeft[1] + 10} Z`}
        fill={skin.hex}
      />
      {/* Left Hand */}
      <path
        d={`M ${anchors.wristLeft[0] - 3} ${anchors.wristLeft[1]}
           C ${anchors.wristLeft[0] - 5} ${anchors.handLeft[1] - 12}, ${anchors.handLeft[0] - 5} ${anchors.handLeft[1] - 4}, ${anchors.handLeft[0]} ${anchors.handLeft[1]}
           C ${anchors.handLeft[0] + 5} ${anchors.handLeft[1] - 4}, ${anchors.wristLeft[0] + 7} ${anchors.handLeft[1] - 12}, ${anchors.wristLeft[0] + 6} ${anchors.wristLeft[1]} Z`}
        fill={skin.hex}
      />

      {/* 6. Right Arm & Hand */}
      <path
        d={`M ${anchors.shoulderRight[0]} ${anchors.shoulderRight[1]}
           C ${anchors.shoulderRight[0] + 7} ${anchors.shoulderRight[1] + 35}, ${anchors.elbowRight[0] + 6} ${anchors.elbowRight[1] - 15}, ${anchors.elbowRight[0] + 5} ${anchors.elbowRight[1]}
           C ${anchors.elbowRight[0] + 4} ${anchors.elbowRight[1] + 35}, ${anchors.wristRight[0] + 4} ${anchors.wristRight[1] - 15}, ${anchors.wristRight[0] + 3} ${anchors.wristRight[1]}
           L ${anchors.wristRight[0] - 6} ${anchors.wristRight[1]}
           C ${anchors.wristRight[0] - 5} ${anchors.wristRight[1] - 15}, ${anchors.elbowRight[0] - 5} ${anchors.elbowRight[1] + 35}, ${anchors.elbowRight[0] - 5} ${anchors.elbowRight[1]}
           C ${anchors.elbowRight[0] - 5} ${anchors.elbowRight[1] - 15}, ${anchors.shoulderRight[0] - 7} ${anchors.shoulderRight[1] + 35}, ${anchors.shoulderRight[0] - 5} ${anchors.shoulderRight[1] + 10} Z`}
        fill={skin.hex}
      />
      {/* Right Hand */}
      <path
        d={`M ${anchors.wristRight[0] - 6} ${anchors.wristRight[1]}
           C ${anchors.wristRight[0] - 7} ${anchors.handRight[1] - 12}, ${anchors.handRight[0] - 5} ${anchors.handRight[1] - 4}, ${anchors.handRight[0]} ${anchors.handRight[1]}
           C ${anchors.handRight[0] + 5} ${anchors.handRight[1] - 4}, ${anchors.wristRight[0] + 5} ${anchors.handRight[1] - 12}, ${anchors.wristRight[0] + 3} ${anchors.wristRight[1]} Z`}
        fill={skin.hex}
      />

      {/* 7. Head Contour */}
      <path d={headPath} fill={skin.hex} />
      {/* Soft Cheek Blush */}
      <ellipse cx={hx - 9} cy={hy + 8} rx={6} ry={4} fill={skin.shadowHex} opacity="0.22" />
      <ellipse cx={hx + 9} cy={hy + 8} rx={6} ry={4} fill={skin.shadowHex} opacity="0.22" />

      {/* 8. Refined Minimalist Face (Blinking Eyes, Brows, Lips) */}
      <path
        d={`M ${hx - 12} ${hy - 2} Q ${hx - 7} ${hy - 5} ${hx - 2} ${hy - 2}`}
        stroke="#2E231D"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <path
        d={`M ${hx + 2} ${hy - 2} Q ${hx + 7} ${hy - 5} ${hx + 12} ${hy - 2}`}
        stroke="#2E231D"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      {/* Eyes */}
      {isBlinking ? (
        <>
          <path
            d={`M ${hx - 11} ${hy + 3} Q ${hx - 7} ${hy + 5} ${hx - 3} ${hy + 3}`}
            stroke="#2E231D"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${hx + 3} ${hy + 3} Q ${hx + 7} ${hy + 5} ${hx + 11} ${hy + 3}`}
            stroke="#2E231D"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : (
        <>
          <ellipse cx={hx - 7} cy={hy + 3} rx={3} ry={1.8} fill="#2E231D" />
          <circle cx={hx - 8} cy={hy + 2.5} r={0.7} fill="#FFFFFF" />
          <ellipse cx={hx + 7} cy={hy + 3} rx={3} ry={1.8} fill="#2E231D" />
          <circle cx={hx + 6} cy={hy + 2.5} r={0.7} fill="#FFFFFF" />
        </>
      )}

      {/* Nose Bridge Hint */}
      <path
        d={`M ${hx} ${hy + 4} L ${hx + 0.5} ${hy + 9} L ${hx - 1} ${hy + 10.5}`}
        stroke={skin.shadowHex}
        strokeWidth="1.0"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.6"
      />

      {/* Elegant Lips */}
      <path
        d={`M ${hx - 5} ${hy + 17} Q ${hx} ${hy + 15.5} ${hx + 5} ${hy + 17} Q ${hx} ${hy + 19.5} ${hx - 5} ${hy + 17} Z`}
        fill={skin.shadowHex}
        opacity="0.75"
      />
    </g>
  );
};

export const CharacterHairFront: React.FC<CharacterBodyProps> = ({
  anchors,
  customization,
}) => {
  const hair = getHairstyle(customization.hairstyleId);
  const color = getHairColor(customization.hairColorId);
  const [hx, hy] = anchors.headCenter;
  const [hrx, hry] = [anchors.headRadiusX, anchors.headRadiusY];

  switch (hair.id) {
    case 'short_fade':
      return (
        <g id="hair-front-fade">
          <path
            d={`M ${hx - hrx * 0.95} ${hy - 2}
               C ${hx - hrx * 1.1} ${hy - hry * 0.8}, ${hx - hrx * 0.8} ${hy - hry * 1.3}, ${hx} ${hy - hry * 1.25}
               C ${hx + hrx * 0.8} ${hy - hry * 1.3}, ${hx + hrx * 1.1} ${hy - hry * 0.8}, ${hx + hrx * 0.95} ${hy - 2}
               C ${hx + hrx * 0.9} ${hy - hry * 0.3}, ${hx + hrx * 0.4} ${hy - hry * 0.7}, ${hx} ${hy - hry * 0.65}
               C ${hx - hrx * 0.4} ${hy - hry * 0.7}, ${hx - hrx * 0.9} ${hy - hry * 0.3}, ${hx - hrx * 0.95} ${hy - 2} Z`}
            fill={color.hex}
          />
          <path
            d={`M ${hx - 12} ${hy - hry * 1.1} Q ${hx} ${hy - hry * 1.2} ${hx + 10} ${hy - hry * 1.05}`}
            stroke={color.highlightHex}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />
        </g>
      );

    case 'short_pixie':
      return (
        <g id="hair-front-pixie">
          <path
            d={`M ${hx - hrx * 1.05} ${hy + 4}
               C ${hx - hrx * 1.15} ${hy - hry * 0.9}, ${hx - hrx * 0.6} ${hy - hry * 1.25}, ${hx} ${hy - hry * 1.2}
               C ${hx + hrx * 0.7} ${hy - hry * 1.25}, ${hx + hrx * 1.15} ${hy - hry * 0.9}, ${hx + hrx * 1.05} ${hy + 4}
               C ${hx + hrx * 0.7} ${hy - hry * 0.2}, ${hx + 4} ${hy - hry * 0.4}, ${hx - 4} ${hy - hry * 0.5}
               C ${hx - 10} ${hy - hry * 0.45}, ${hx - hrx * 0.8} ${hy - hry * 0.1}, ${hx - hrx * 1.05} ${hy + 4} Z`}
            fill={color.hex}
          />
        </g>
      );

    case 'curly_bob':
      return (
        <g id="hair-front-curly-bob">
          <path
            d={`M ${hx - hrx * 1.25} ${hy + 16}
               C ${hx - hrx * 1.35} ${hy - hry * 0.8}, ${hx - hrx * 0.8} ${hy - hry * 1.3}, ${hx} ${hy - hry * 1.25}
               C ${hx + hrx * 0.8} ${hy - hry * 1.3}, ${hx + hrx * 1.35} ${hy - hry * 0.8}, ${hx + hrx * 1.25} ${hy + 16}
               C ${hx + hrx * 0.95} ${hy + 18}, ${hx + hrx * 0.7} ${hy - hry * 0.4}, ${hx} ${hy - hry * 0.6}
               C ${hx - hrx * 0.7} ${hy - hry * 0.4}, ${hx - hrx * 0.95} ${hy + 18}, ${hx - hrx * 1.25} ${hy + 16} Z`}
            fill={color.hex}
          />
          <circle cx={hx - 18} cy={hy + 10} r={4} fill={color.hex} />
          <circle cx={hx + 18} cy={hy + 10} r={4} fill={color.hex} />
          <circle cx={hx - 16} cy={hy - 8} r={5} fill={color.hex} />
          <circle cx={hx + 16} cy={hy - 8} r={5} fill={color.hex} />
        </g>
      );

    case 'curly_afro':
      return (
        <g id="hair-front-afro">
          <ellipse
            cx={hx}
            cy={hy - hry * 0.45}
            rx={hrx * 1.45}
            ry={hry * 1.25}
            fill={color.hex}
          />
          <circle cx={hx - 22} cy={hy - 24} r={6} fill={color.highlightHex} opacity="0.2" />
          <circle cx={hx} cy={hy - 32} r={7} fill={color.highlightHex} opacity="0.25" />
          <circle cx={hx + 22} cy={hy - 24} r={6} fill={color.highlightHex} opacity="0.2" />
        </g>
      );

    case 'long_straight':
      return (
        <g id="hair-front-straight">
          <path
            d={`M ${hx - hrx * 1.05} ${hy + 28}
               C ${hx - hrx * 1.15} ${hy - hry * 0.8}, ${hx - hrx * 0.8} ${hy - hry * 1.25}, ${hx} ${hy - hry * 1.2}
               C ${hx + hrx * 0.8} ${hy - hry * 1.25}, ${hx + hrx * 1.15} ${hy - hry * 0.8}, ${hx + hrx * 1.05} ${hy + 28}
               C ${hx + hrx * 0.9} ${hy + 10}, ${hx + hrx * 0.75} ${hy - hry * 0.4}, ${hx} ${hy - hry * 0.65}
               C ${hx - hrx * 0.75} ${hy - hry * 0.4}, ${hx - hrx * 0.9} ${hy + 10}, ${hx - hrx * 1.05} ${hy + 28} Z`}
            fill={color.hex}
          />
          <path
            d={`M ${hx - 10} ${hy - hry * 0.9} Q ${hx} ${hy - hry * 1.0} ${hx + 10} ${hy - hry * 0.9}`}
            stroke={color.highlightHex}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.35"
          />
        </g>
      );

    case 'long_waves':
      return (
        <g id="hair-front-waves">
          <path
            d={`M ${hx - hrx * 1.15} ${hy + 32}
               C ${hx - hrx * 1.3} ${hy - hry * 0.7}, ${hx - hrx * 0.8} ${hy - hry * 1.25}, ${hx} ${hy - hry * 1.2}
               C ${hx + hrx * 0.8} ${hy - hry * 1.25}, ${hx + hrx * 1.3} ${hy - hry * 0.7}, ${hx + hrx * 1.15} ${hy + 32}
               C ${hx + hrx * 0.9} ${hy + 15}, ${hx + hrx * 0.75} ${hy - hry * 0.4}, ${hx} ${hy - hry * 0.65}
               C ${hx - hrx * 0.75} ${hy - hry * 0.4}, ${hx - hrx * 0.9} ${hy + 15}, ${hx - hrx * 1.15} ${hy + 32} Z`}
            fill={color.hex}
          />
        </g>
      );

    case 'slicked_back':
      return (
        <g id="hair-front-slicked">
          <path
            d={`M ${hx - hrx * 0.95} ${hy - 2}
               C ${hx - hrx * 1.05} ${hy - hry * 0.8}, ${hx - hrx * 0.75} ${hy - hry * 1.25}, ${hx} ${hy - hry * 1.22}
               C ${hx + hrx * 0.75} ${hy - hry * 1.22}, ${hx + hrx * 1.05} ${hy - hry * 0.8}, ${hx + hrx * 0.95} ${hy - 2}
               C ${hx + hrx * 0.8} ${hy - hry * 0.6}, ${hx + 8} ${hy - hry * 0.75}, ${hx} ${hy - hry * 0.72}
               C ${hx - 8} ${hy - hry * 0.75}, ${hx - hrx * 0.8} ${hy - hry * 0.6}, ${hx - hrx * 0.95} ${hy - 2} Z`}
            fill={color.hex}
          />
        </g>
      );

    case 'top_knot':
      return (
        <g id="hair-front-bun-front">
          <path
            d={`M ${hx - hrx * 0.95} ${hy + 2}
               C ${hx - hrx * 1.05} ${hy - hry * 0.8}, ${hx - hrx * 0.75} ${hy - hry * 1.2}, ${hx} ${hy - hry * 1.18}
               C ${hx + hrx * 0.75} ${hy - hry * 1.2}, ${hx + hrx * 1.05} ${hy - hry * 0.8}, ${hx + hrx * 0.95} ${hy + 2}
               C ${hx + hrx * 0.75} ${hy - hry * 0.5}, ${hx + 10} ${hy - hry * 0.7}, ${hx} ${hy - hry * 0.7}
               C ${hx - 10} ${hy - hry * 0.7}, ${hx - hrx * 0.75} ${hy - hry * 0.5}, ${hx - hrx * 0.95} ${hy + 2} Z`}
            fill={color.hex}
          />
        </g>
      );

    default:
      return null;
  }
};
