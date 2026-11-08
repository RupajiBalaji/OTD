import React from 'react';
import type { BodyAnchorCoordinates, GarmentVisualProps } from './character.types';
import { getShade, getHighlight } from './character.palette';

interface GarmentTemplateProps {
  anchors: BodyAnchorCoordinates;
  props: GarmentVisualProps;
  idPrefix?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

/**
 * Generates an SVG pattern in <defs> if the garment has a pattern.
 */
export const GarmentPatternDef: React.FC<{
  patternId: string;
  pattern: string;
  primaryColor: string;
  secondaryColor?: string;
  printTextureUrl?: string;
}> = ({ patternId, pattern, primaryColor, secondaryColor = '#FFFFFF', printTextureUrl }) => {
  if (pattern === 'print' && printTextureUrl) {
    return (
      <pattern id={patternId} patternUnits="objectBoundingBox" width="1" height="1">
        <image href={printTextureUrl} x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </pattern>
    );
  }

  if (pattern === 'stripe') {
    return (
      <pattern id={patternId} width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill={primaryColor} />
        <line x1="0" y1="0" x2="0" y2="12" stroke={secondaryColor} strokeWidth="3" opacity="0.6" />
      </pattern>
    );
  }

  if (pattern === 'check') {
    return (
      <pattern id={patternId} width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill={primaryColor} />
        <rect width="8" height="8" fill={secondaryColor} opacity="0.25" />
        <rect x="8" y="8" width="8" height="8" fill={secondaryColor} opacity="0.25" />
      </pattern>
    );
  }

  if (pattern === 'floral') {
    return (
      <pattern id={patternId} width="24" height="24" patternUnits="userSpaceOnUse">
        <rect width="24" height="24" fill={primaryColor} />
        <circle cx="12" cy="12" r="3" fill={secondaryColor} opacity="0.4" />
        <circle cx="8" cy="12" r="2" fill={secondaryColor} opacity="0.3" />
        <circle cx="16" cy="12" r="2" fill={secondaryColor} opacity="0.3" />
        <circle cx="12" cy="8" r="2" fill={secondaryColor} opacity="0.3" />
        <circle cx="12" cy="16" r="2" fill={secondaryColor} opacity="0.3" />
      </pattern>
    );
  }

  return null;
};

// -------------------------------------------------------------------------------------------------
// 1. TEE / T-SHIRT
// -------------------------------------------------------------------------------------------------
export const TeeGarment: React.FC<GarmentTemplateProps> = ({ anchors, props, idPrefix = 'tee', onClick, isSelected }) => {
  const fill = props.pattern !== 'solid' ? `url(#${idPrefix}-pat)` : props.primaryColor;
  const shadow = getShade(props.primaryColor, 0.2);

  const [slx, sly] = anchors.shoulderLeft;
  const [srx, sry] = anchors.shoulderRight;
  const [wlx, wly] = anchors.waistLeft;
  const [wrx] = anchors.waistRight;
  const hemY = wly + 28;

  // Short sleeve endpoints
  const sleeveL: [number, number] = [anchors.elbowLeft[0] + 6, anchors.elbowLeft[1] - 30];
  const sleeveR: [number, number] = [anchors.elbowRight[0] - 6, anchors.elbowRight[1] - 30];

  return (
    <g
      id="garment-tee"
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' : 'hover:opacity-95'}`}
    >
      <defs>
        <GarmentPatternDef
          patternId={`${idPrefix}-pat`}
          pattern={props.pattern}
          primaryColor={props.primaryColor}
          secondaryColor={props.secondaryColor}
          printTextureUrl={props.printTextureUrl}
        />
      </defs>

      {/* Torso & short sleeves combined silhouette */}
      <path
        d={`M ${slx} ${sly + 2}
           C ${slx - 4} ${sly + 10}, ${sleeveL[0] - 2} ${sleeveL[1] - 8}, ${sleeveL[0]} ${sleeveL[1]}
           L ${sleeveL[0] + 16} ${sleeveL[1] + 8}
           L ${wlx - 2} ${wly - 20}
           L ${wlx - 2} ${hemY}
           Q 200 ${hemY + 6} ${wrx + 2} ${hemY}
           L ${wrx + 2} ${wly - 20}
           L ${sleeveR[0] - 16} ${sleeveR[1] + 8}
           L ${sleeveR[0]} ${sleeveR[1]}
           C ${sleeveR[0] + 2} ${sleeveR[1] - 8}, ${srx + 4} ${sry + 10}, ${srx} ${sry + 2}
           C ${srx - 14} ${anchors.collarboneY + 2}, 214 ${anchors.collarboneY - 2}, 200 ${anchors.collarboneY - 2}
           C 186 ${anchors.collarboneY - 2}, ${slx + 14} ${anchors.collarboneY + 2}, ${slx} ${sly + 2} Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />

      {/* Crew / V-neck Collar */}
      {props.neckline === 'v' ? (
        <path
          d={`M 186 ${anchors.collarboneY} L 200 ${anchors.collarboneY + 20} L 214 ${anchors.collarboneY}`}
          stroke={shadow}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <path
          d={`M 186 ${anchors.collarboneY} Q 200 ${anchors.collarboneY + 14} 214 ${anchors.collarboneY}`}
          stroke={shadow}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      )}

      {/* Subtle crease folds */}
      <path
        d={`M ${wlx + 4} ${wly - 4} Q ${wlx + 18} ${wly - 2} ${wlx + 24} ${wly + 8}`}
        stroke={shadow}
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <path
        d={`M ${wrx - 4} ${wly - 4} Q ${wrx - 18} ${wly - 2} ${wrx - 24} ${wly + 8}`}
        stroke={shadow}
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
    </g>
  );
};

// -------------------------------------------------------------------------------------------------
// 2. SHIRT / BUTTON-DOWN
// -------------------------------------------------------------------------------------------------
export const ShirtGarment: React.FC<GarmentTemplateProps> = ({ anchors, props, idPrefix = 'shirt', onClick, isSelected }) => {
  const fill = props.pattern !== 'solid' ? `url(#${idPrefix}-pat)` : props.primaryColor;
  const shadow = getShade(props.primaryColor, 0.25);
  const isLongSleeve = props.sleeve !== 'short';

  const [slx, sly] = anchors.shoulderLeft;
  const [srx, sry] = anchors.shoulderRight;
  const [wlx, wly] = anchors.waistLeft;
  const [wrx] = anchors.waistRight;
  const hemY = wly + 32;

  const cuffL = isLongSleeve ? anchors.wristLeft : [anchors.elbowLeft[0] + 6, anchors.elbowLeft[1] - 15];
  const cuffR = isLongSleeve ? anchors.wristRight : [anchors.elbowRight[0] - 6, anchors.elbowRight[1] - 15];

  return (
    <g
      id="garment-shirt"
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' : 'hover:opacity-95'}`}
    >
      <defs>
        <GarmentPatternDef
          patternId={`${idPrefix}-pat`}
          pattern={props.pattern}
          primaryColor={props.primaryColor}
          secondaryColor={props.secondaryColor}
          printTextureUrl={props.printTextureUrl}
        />
      </defs>

      {/* Main Shirt Body */}
      <path
        d={`M ${slx} ${sly + 2}
           L ${cuffL[0]} ${cuffL[1]}
           L ${cuffL[0] + 14} ${cuffL[1] + 6}
           L ${wlx - 2} ${wly - 15}
           L ${wlx - 2} ${hemY}
           Q 200 ${hemY + 8} ${wrx + 2} ${hemY}
           L ${wrx + 2} ${wly - 15}
           L ${cuffR[0] - 14} ${cuffR[1] + 6}
           L ${cuffR[0]} ${cuffR[1]}
           L ${srx} ${sry + 2}
           C ${srx - 12} ${anchors.collarboneY + 2}, 212 ${anchors.collarboneY - 2}, 200 ${anchors.collarboneY - 2}
           C 188 ${anchors.collarboneY - 2}, ${slx + 12} ${anchors.collarboneY + 2}, ${slx} ${sly + 2} Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />

      {/* Central Button Placket */}
      <line x1="200" y1={anchors.collarboneY + 8} x2="200" y2={hemY + 4} stroke={shadow} strokeWidth="1.5" />
      {/* Placket Buttons */}
      {[0, 24, 48, 72, 96].map((offset, idx) => (
        <circle
          key={idx}
          cx="200"
          cy={anchors.collarboneY + 18 + offset}
          r="1.8"
          fill="#FFFFFF"
          stroke={shadow}
          strokeWidth="0.8"
        />
      ))}

      {/* Crisp Tailored Collar Wings */}
      <path
        d={`M 188 ${anchors.collarboneY - 4} L 196 ${anchors.collarboneY + 12} L 200 ${anchors.collarboneY + 6} L 204 ${anchors.collarboneY + 12} L 212 ${anchors.collarboneY - 4} Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.4"
      />

      {/* Left Chest Pocket */}
      <path
        d={`M 172 ${anchors.chestY - 10} L 186 ${anchors.chestY - 10} L 186 ${anchors.chestY + 8} L 179 ${anchors.chestY + 13} L 172 ${anchors.chestY + 8} Z`}
        stroke={shadow}
        strokeWidth="1.0"
        fill="none"
        opacity="0.6"
      />
    </g>
  );
};

// -------------------------------------------------------------------------------------------------
// 3. KURTA
// -------------------------------------------------------------------------------------------------
export const KurtaGarment: React.FC<GarmentTemplateProps> = ({ anchors, props, idPrefix = 'kurta', onClick, isSelected }) => {
  const fill = props.pattern !== 'solid' ? `url(#${idPrefix}-pat)` : props.primaryColor;
  const shadow = getShade(props.primaryColor, 0.25);
  const goldAccent = '#D4AF37';

  const [slx, sly] = anchors.shoulderLeft;
  const [srx, sry] = anchors.shoulderRight;
  const [wlx, wly] = anchors.waistLeft;
  const [wrx] = anchors.waistRight;
  const hemY = anchors.kneeLeft[1] - 30; // Elegantly falls past hips to upper knee

  return (
    <g
      id="garment-kurta"
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' : 'hover:opacity-95'}`}
    >
      <defs>
        <GarmentPatternDef
          patternId={`${idPrefix}-pat`}
          pattern={props.pattern}
          primaryColor={props.primaryColor}
          secondaryColor={props.secondaryColor}
          printTextureUrl={props.printTextureUrl}
        />
      </defs>

      {/* Main Kurta Body with Long Flowing Slits */}
      <path
        d={`M ${slx} ${sly + 2}
           L ${anchors.wristLeft[0]} ${anchors.wristLeft[1]}
           L ${anchors.wristLeft[0] + 16} ${anchors.wristLeft[1] + 6}
           L ${wlx - 2} ${wly - 10}
           L ${wlx - 6} ${anchors.hipLeft[1] + 15}
           L ${wlx - 8} ${hemY}
           L 200 ${hemY}
           L ${wrx + 8} ${hemY}
           L ${wrx + 6} ${anchors.hipRight[1] + 15}
           L ${wrx + 2} ${wly - 10}
           L ${anchors.wristRight[0] - 16} ${anchors.wristRight[1] + 6}
           L ${anchors.wristRight[0]} ${anchors.wristRight[1]}
           L ${srx} ${sry + 2}
           C ${srx - 12} ${anchors.collarboneY + 2}, 212 ${anchors.collarboneY - 2}, 200 ${anchors.collarboneY - 2}
           C 188 ${anchors.collarboneY - 2}, ${slx + 12} ${anchors.collarboneY + 2}, ${slx} ${sly + 2} Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />

      {/* Traditional Side Slits */}
      <line x1={wlx - 6} y1={anchors.hipLeft[1] + 20} x2={wlx - 8} y2={hemY} stroke={shadow} strokeWidth="1.5" />
      <line x1={wrx + 6} y1={anchors.hipRight[1] + 20} x2={wrx + 8} y2={hemY} stroke={shadow} strokeWidth="1.5" />

      {/* Mandarin / Nehru Stand Collar */}
      <path
        d={`M 188 ${anchors.collarboneY + 2} C 194 ${anchors.collarboneY - 5}, 206 ${anchors.collarboneY - 5}, 212 ${anchors.collarboneY + 2}`}
        stroke={goldAccent}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Embroidered Placket with Gold Detailing */}
      <rect x="197" y={anchors.collarboneY + 2} width="6" height="60" fill={goldAccent} rx="1" opacity="0.8" />
      {[12, 26, 40, 54].map((offset, idx) => (
        <circle key={idx} cx="200" cy={anchors.collarboneY + offset} r="1.5" fill="#FFFFFF" />
      ))}
    </g>
  );
};

// -------------------------------------------------------------------------------------------------
// 4. HOODIE / SWEATER
// -------------------------------------------------------------------------------------------------
export const HoodieSweaterGarment: React.FC<GarmentTemplateProps> = ({ anchors, props, idPrefix = 'hoodie', onClick, isSelected }) => {
  const fill = props.pattern !== 'solid' ? `url(#${idPrefix}-pat)` : props.primaryColor;
  const shadow = getShade(props.primaryColor, 0.25);

  const [slx, sly] = anchors.shoulderLeft;
  const [srx, sry] = anchors.shoulderRight;
  const [wlx, wly] = anchors.waistLeft;
  const [wrx] = anchors.waistRight;
  const hemY = wly + 36;

  return (
    <g
      id="garment-hoodie"
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' : 'hover:opacity-95'}`}
    >
      <defs>
        <GarmentPatternDef
          patternId={`${idPrefix}-pat`}
          pattern={props.pattern}
          primaryColor={props.primaryColor}
          secondaryColor={props.secondaryColor}
          printTextureUrl={props.printTextureUrl}
        />
      </defs>

      {/* Relaxed Silhouette with ribbed waist */}
      <path
        d={`M ${slx - 2} ${sly + 2}
           L ${anchors.wristLeft[0] - 2} ${anchors.wristLeft[1]}
           L ${anchors.wristLeft[0] + 16} ${anchors.wristLeft[1] + 6}
           L ${wlx - 4} ${wly - 10}
           L ${wlx - 4} ${hemY}
           Q 200 ${hemY + 4} ${wrx + 4} ${hemY}
           L ${wrx + 4} ${wly - 10}
           L ${anchors.wristRight[0] - 16} ${anchors.wristRight[1] + 6}
           L ${anchors.wristRight[0] + 2} ${anchors.wristRight[1]}
           L ${srx + 2} ${sry + 2}
           C ${srx - 12} ${anchors.collarboneY}, 214 ${anchors.collarboneY - 4}, 200 ${anchors.collarboneY - 4}
           C 186 ${anchors.collarboneY - 4}, ${slx + 12} ${anchors.collarboneY}, ${slx - 2} ${sly + 2} Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />

      {/* Relaxed Hood Neckline / Fold */}
      <path
        d={`M 182 ${anchors.collarboneY - 4} C 192 ${anchors.collarboneY + 16}, 208 ${anchors.collarboneY + 16}, 218 ${anchors.collarboneY - 4}`}
        fill={shadow}
        opacity="0.3"
      />
      <path
        d={`M 184 ${anchors.collarboneY - 2} Q 200 ${anchors.collarboneY + 14} 216 ${anchors.collarboneY - 2}`}
        stroke={shadow}
        strokeWidth="2.5"
        fill="none"
      />
      {/* Drawstrings */}
      <path d={`M 194 ${anchors.collarboneY + 12} L 192 ${anchors.collarboneY + 45}`} stroke="#ECEAE4" strokeWidth="1.8" strokeLinecap="round" />
      <path d={`M 206 ${anchors.collarboneY + 12} L 208 ${anchors.collarboneY + 45}`} stroke="#ECEAE4" strokeWidth="1.8" strokeLinecap="round" />

      {/* Kangaroo Pocket */}
      <path
        d={`M ${wlx + 10} ${wly + 8}
           L ${wlx + 18} ${wly + 28}
           L ${wrx - 18} ${wly + 28}
           L ${wrx - 10} ${wly + 8}
           L ${wrx - 16} ${wly + 8}
           L 200 ${wly + 8}
           L ${wlx + 16} ${wly + 8} Z`}
        fill="none"
        stroke={shadow}
        strokeWidth="1.2"
        opacity="0.65"
      />
    </g>
  );
};

// -------------------------------------------------------------------------------------------------
// 5. JACKET / BLAZER
// -------------------------------------------------------------------------------------------------
export const JacketBlazerGarment: React.FC<GarmentTemplateProps> = ({ anchors, props, idPrefix = 'blazer', onClick, isSelected }) => {
  const fill = props.pattern !== 'solid' ? `url(#${idPrefix}-pat)` : props.primaryColor;
  const shadow = getShade(props.primaryColor, 0.3);

  const [slx, sly] = anchors.shoulderLeft;
  const [srx, sry] = anchors.shoulderRight;
  const [wlx, wly] = anchors.waistLeft;
  const [wrx] = anchors.waistRight;
  const hemY = wly + 38;

  return (
    <g
      id="garment-blazer"
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' : 'hover:opacity-95'}`}
    >
      <defs>
        <GarmentPatternDef
          patternId={`${idPrefix}-pat`}
          pattern={props.pattern}
          primaryColor={props.primaryColor}
          secondaryColor={props.secondaryColor}
          printTextureUrl={props.printTextureUrl}
        />
      </defs>

      {/* Structured Tailored Blazer Silhouette */}
      <path
        d={`M ${slx - 2} ${sly + 2}
           L ${anchors.wristLeft[0] - 2} ${anchors.wristLeft[1]}
           L ${anchors.wristLeft[0] + 16} ${anchors.wristLeft[1] + 6}
           L ${wlx - 4} ${wly - 10}
           L ${wlx - 5} ${hemY}
           L ${wrx + 5} ${hemY}
           L ${wrx + 4} ${wly - 10}
           L ${anchors.wristRight[0] - 16} ${anchors.wristRight[1] + 6}
           L ${anchors.wristRight[0] + 2} ${anchors.wristRight[1]}
           L ${srx + 2} ${sry + 2}
           C ${srx - 12} ${anchors.collarboneY + 2}, 212 ${anchors.collarboneY - 2}, 200 ${anchors.collarboneY - 2}
           C 188 ${anchors.collarboneY - 2}, ${slx + 12} ${anchors.collarboneY + 2}, ${slx - 2} ${sly + 2} Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.4"
      />

      {/* Deep Notch Lapels */}
      {/* Left Lapel */}
      <path
        d={`M 188 ${anchors.collarboneY} L 180 ${anchors.collarboneY + 25} L 186 ${anchors.collarboneY + 28} L 194 ${wly + 6} L 199 ${wly + 6} L 196 ${anchors.collarboneY} Z`}
        fill={getShade(props.primaryColor, 0.1)}
        stroke={shadow}
        strokeWidth="1.2"
      />
      {/* Right Lapel */}
      <path
        d={`M 212 ${anchors.collarboneY} L 220 ${anchors.collarboneY + 25} L 214 ${anchors.collarboneY + 28} L 206 ${wly + 6} L 201 ${wly + 6} L 204 ${anchors.collarboneY} Z`}
        fill={getShade(props.primaryColor, 0.1)}
        stroke={shadow}
        strokeWidth="1.2"
      />

      {/* Horn Button Accent */}
      <circle cx="201" cy={wly + 10} r="2.2" fill="#1C1917" stroke="#D4AF37" strokeWidth="0.8" />
      <circle cx="201" cy={wly + 24} r="2.2" fill="#1C1917" stroke="#D4AF37" strokeWidth="0.8" />

      {/* Flap Pockets */}
      <line x1={wlx + 6} y1={wly + 22} x2={wlx + 24} y2={wly + 22} stroke={shadow} strokeWidth="2" strokeLinecap="round" />
      <line x1={wrx - 24} y1={wly + 22} x2={wrx - 6} y2={wly + 22} stroke={shadow} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
};

// -------------------------------------------------------------------------------------------------
// 6. JEANS / TROUSERS
// -------------------------------------------------------------------------------------------------
export const JeansTrousersGarment: React.FC<GarmentTemplateProps> = ({ anchors, props, idPrefix = 'trousers', onClick, isSelected }) => {
  const fill = props.pattern !== 'solid' ? `url(#${idPrefix}-pat)` : props.primaryColor;
  const shadow = getShade(props.primaryColor, 0.25);
  const isDenim = props.primaryColor.toLowerCase().includes('blue') || props.name.toLowerCase().includes('jean');

  const [wlx, wly] = anchors.waistLeft;
  const [wrx, wry] = anchors.waistRight;
  const [hlx, hly] = anchors.hipLeft;
  const [hrx, hry] = anchors.hipRight;
  const [alx, aly] = anchors.ankleLeft;
  const [arx, ary] = anchors.ankleRight;

  return (
    <g
      id="garment-trousers"
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' : 'hover:opacity-95'}`}
    >
      <defs>
        <GarmentPatternDef
          patternId={`${idPrefix}-pat`}
          pattern={props.pattern}
          primaryColor={props.primaryColor}
          secondaryColor={props.secondaryColor}
          printTextureUrl={props.printTextureUrl}
        />
      </defs>

      {/* Full tailored trouser / jean silhouette */}
      <path
        d={`M ${wlx - 2} ${wly}
           C ${hlx - 4} ${hly - 10}, ${hlx - 2} ${hly + 20}, ${anchors.kneeLeft[0] - 10} ${anchors.kneeLeft[1]}
           L ${alx - 8} ${aly}
           L ${alx + 8} ${aly}
           L ${anchors.kneeLeft[0] + 8} ${anchors.kneeLeft[1]}
           L 200 ${anchors.crotchY + 8}
           L ${anchors.kneeRight[0] - 8} ${anchors.kneeRight[1]}
           L ${arx - 8} ${ary}
           L ${arx + 8} ${ary}
           L ${anchors.kneeRight[0] + 10} ${anchors.kneeRight[1]}
           C ${hrx + 2} ${hry + 20}, ${hrx + 4} ${hly - 10}, ${wrx + 2} ${wry}
           Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />

      {/* Waistband */}
      <path
        d={`M ${wlx - 2} ${wly + 6} Q 200 ${wly + 8} ${wrx + 2} ${wry + 6}`}
        stroke={shadow}
        strokeWidth="1.5"
        fill="none"
      />

      {/* Fly / Crotch Crease */}
      <line x1="200" y1={wly + 6} x2="200" y2={anchors.crotchY + 4} stroke={shadow} strokeWidth="1.5" />

      {/* Denim Stitching or Press Creases */}
      {isDenim ? (
        <>
          {/* Contrast gold jean rivets & pocket curves */}
          <path
            d={`M ${wlx + 2} ${wly + 10} Q ${wlx + 14} ${wly + 16} ${wlx + 18} ${hly}`}
            stroke="#D97706"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d={`M ${wrx - 2} ${wly + 10} Q ${wrx - 14} ${wly + 16} ${wrx - 18} ${hly}`}
            stroke="#D97706"
            strokeWidth="1.2"
            fill="none"
          />
        </>
      ) : (
        <>
          {/* Crisp sartorial center crease on trousers */}
          <line
            x1={anchors.kneeLeft[0]}
            y1={hly + 10}
            x2={alx}
            y2={aly - 4}
            stroke={shadow}
            strokeWidth="1"
            opacity="0.4"
          />
          <line
            x1={anchors.kneeRight[0]}
            y1={hly + 10}
            x2={arx}
            y2={ary - 4}
            stroke={shadow}
            strokeWidth="1"
            opacity="0.4"
          />
        </>
      )}
    </g>
  );
};

// -------------------------------------------------------------------------------------------------
// 7. SHORTS
// -------------------------------------------------------------------------------------------------
export const ShortsGarment: React.FC<GarmentTemplateProps> = ({ anchors, props, idPrefix = 'shorts', onClick, isSelected }) => {
  const fill = props.pattern !== 'solid' ? `url(#${idPrefix}-pat)` : props.primaryColor;
  const shadow = getShade(props.primaryColor, 0.25);

  const [wlx, wly] = anchors.waistLeft;
  const [wrx, wry] = anchors.waistRight;
  const hemY = anchors.kneeLeft[1] - 38;

  return (
    <g
      id="garment-shorts"
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' : 'hover:opacity-95'}`}
    >
      <defs>
        <GarmentPatternDef
          patternId={`${idPrefix}-pat`}
          pattern={props.pattern}
          primaryColor={props.primaryColor}
          secondaryColor={props.secondaryColor}
          printTextureUrl={props.printTextureUrl}
        />
      </defs>

      <path
        d={`M ${wlx - 2} ${wly}
           C ${anchors.hipLeft[0] - 4} ${anchors.hipLeft[1]}, ${anchors.hipLeft[0] - 2} ${anchors.hipLeft[1] + 30}, ${anchors.kneeLeft[0] - 12} ${hemY}
           L ${anchors.kneeLeft[0] + 10} ${hemY}
           L 200 ${anchors.crotchY + 6}
           L ${anchors.kneeRight[0] - 10} ${hemY}
           L ${anchors.kneeRight[0] + 12} ${hemY}
           C ${anchors.hipRight[0] + 2} ${anchors.hipRight[1] + 30}, ${anchors.hipRight[0] + 4} ${anchors.hipRight[1]}, ${wrx + 2} ${wry}
           Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />
      <line x1="200" y1={wly + 6} x2="200" y2={anchors.crotchY + 4} stroke={shadow} strokeWidth="1.5" />
    </g>
  );
};

// -------------------------------------------------------------------------------------------------
// 8. SKIRT
// -------------------------------------------------------------------------------------------------
export const SkirtGarment: React.FC<GarmentTemplateProps> = ({ anchors, props, idPrefix = 'skirt', onClick, isSelected }) => {
  const fill = props.pattern !== 'solid' ? `url(#${idPrefix}-pat)` : props.primaryColor;
  const shadow = getShade(props.primaryColor, 0.25);

  const [wlx, wly] = anchors.waistLeft;
  const [wrx, wry] = anchors.waistRight;
  const hemY = anchors.kneeLeft[1] + (props.length === 'long' ? 90 : 15);

  return (
    <g
      id="garment-skirt"
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' : 'hover:opacity-95'}`}
    >
      <defs>
        <GarmentPatternDef
          patternId={`${idPrefix}-pat`}
          pattern={props.pattern}
          primaryColor={props.primaryColor}
          secondaryColor={props.secondaryColor}
          printTextureUrl={props.printTextureUrl}
        />
      </defs>

      {/* Flared A-line silhouette */}
      <path
        d={`M ${wlx - 2} ${wly}
           C ${anchors.hipLeft[0] - 8} ${anchors.hipLeft[1]}, ${wlx - 18} ${hemY - 30}, ${wlx - 26} ${hemY}
           Q 200 ${hemY + 12} ${wrx + 26} ${hemY}
           C ${wrx + 18} ${hemY - 30}, ${anchors.hipRight[0] + 8} ${anchors.hipRight[1]}, ${wrx + 2} ${wry}
           Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />

      {/* Elegant pleat flutes */}
      <path d={`M 188 ${wly + 4} Q 185 ${hemY - 20} 182 ${hemY + 4}`} stroke={shadow} strokeWidth="1" fill="none" opacity="0.4" />
      <path d={`M 200 ${wly + 4} Q 200 ${hemY - 20} 200 ${hemY + 6}`} stroke={shadow} strokeWidth="1" fill="none" opacity="0.4" />
      <path d={`M 212 ${wly + 4} Q 215 ${hemY - 20} 218 ${hemY + 4}`} stroke={shadow} strokeWidth="1" fill="none" opacity="0.4" />
    </g>
  );
};

// -------------------------------------------------------------------------------------------------
// 9. DRESS
// -------------------------------------------------------------------------------------------------
export const DressGarment: React.FC<GarmentTemplateProps> = ({ anchors, props, idPrefix = 'dress', onClick, isSelected }) => {
  const fill = props.pattern !== 'solid' ? `url(#${idPrefix}-pat)` : props.primaryColor;
  const shadow = getShade(props.primaryColor, 0.25);

  const [slx, sly] = anchors.shoulderLeft;
  const [srx, sry] = anchors.shoulderRight;
  const [wlx, wly] = anchors.waistLeft;
  const [wrx] = anchors.waistRight;
  const hemY = anchors.kneeLeft[1] + 25;

  return (
    <g
      id="garment-dress"
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' : 'hover:opacity-95'}`}
    >
      <defs>
        <GarmentPatternDef
          patternId={`${idPrefix}-pat`}
          pattern={props.pattern}
          primaryColor={props.primaryColor}
          secondaryColor={props.secondaryColor}
          printTextureUrl={props.printTextureUrl}
        />
      </defs>

      {/* Fluid evening dress silhouette */}
      <path
        d={`M ${slx + 4} ${sly + 6}
           C ${slx + 6} ${anchors.chestY}, ${wlx} ${wly - 10}, ${wlx} ${wly}
           C ${wlx - 6} ${anchors.hipLeft[1]}, ${wlx - 16} ${hemY - 40}, ${wlx - 22} ${hemY}
           Q 200 ${hemY + 10} ${wrx + 22} ${hemY}
           C ${wrx + 16} ${hemY - 40}, ${wrx + 6} ${anchors.hipRight[1]}, ${wrx} ${wly}
           C ${wrx} ${wly - 10}, ${srx - 6} ${anchors.chestY}, ${srx - 4} ${sry + 6}
           Q 200 ${anchors.collarboneY + 16} ${slx + 4} ${sly + 6} Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />

      {/* Sweetheart or draped neckline contour */}
      <path
        d={`M 184 ${anchors.collarboneY + 4} Q 200 ${anchors.collarboneY + 22} 216 ${anchors.collarboneY + 4}`}
        stroke={shadow}
        strokeWidth="1.5"
        fill="none"
      />
    </g>
  );
};

// -------------------------------------------------------------------------------------------------
// 10. SAREE
// -------------------------------------------------------------------------------------------------
export const SareeGarment: React.FC<GarmentTemplateProps> = ({ anchors, props, idPrefix = 'saree', onClick, isSelected }) => {
  const fill = props.pattern !== 'solid' ? `url(#${idPrefix}-pat)` : props.primaryColor;
  const shadow = getShade(props.primaryColor, 0.3);
  const zariGold = '#E5C07B';

  const [slx, sly] = anchors.shoulderLeft;
  const [srx, sry] = anchors.shoulderRight;
  const [wlx, wly] = anchors.waistLeft;
  const [wrx] = anchors.waistRight;
  const hemY = anchors.ankleLeft[1] - 10;

  return (
    <g
      id="garment-saree"
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' : 'hover:opacity-95'}`}
    >
      <defs>
        <GarmentPatternDef
          patternId={`${idPrefix}-pat`}
          pattern={props.pattern}
          primaryColor={props.primaryColor}
          secondaryColor={props.secondaryColor}
          printTextureUrl={props.printTextureUrl}
        />
      </defs>

      {/* 1. Cropped Choli Blouse */}
      <path
        d={`M ${slx} ${sly + 2}
           L ${anchors.elbowLeft[0] + 8} ${anchors.elbowLeft[1] - 25}
           L ${anchors.elbowLeft[0] + 20} ${anchors.elbowLeft[1] - 18}
           L ${wlx + 2} ${anchors.chestY + 25}
           L ${wrx - 2} ${anchors.chestY + 25}
           L ${anchors.elbowRight[0] - 20} ${anchors.elbowRight[1] - 18}
           L ${anchors.elbowRight[0] - 8} ${anchors.elbowRight[1] - 25}
           L ${srx} ${sry + 2}
           Q 200 ${anchors.collarboneY + 12} ${slx} ${sly + 2} Z`}
        fill={props.secondaryColor || '#800020'}
        stroke={shadow}
        strokeWidth="1.2"
      />

      {/* 2. Draped Skirt & Pleats (Full Length) */}
      <path
        d={`M ${wlx - 2} ${wly + 10}
           C ${anchors.hipLeft[0] - 6} ${anchors.hipLeft[1]}, ${wlx - 12} ${hemY - 50}, ${wlx - 14} ${hemY}
           L ${wrx + 14} ${hemY}
           C ${wrx + 12} ${hemY - 50}, ${anchors.hipRight[0] + 6} ${anchors.hipRight[1]}, ${wrx + 2} ${wly + 10}
           Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />

      {/* Ornate Gold Zari Border on Hem */}
      <rect x={wlx - 14} y={hemY - 8} width={wrx - wlx + 28} height="8" fill={zariGold} opacity="0.9" />

      {/* 3. Center Waist Pleats */}
      {[194, 198, 202, 206].map((x, idx) => (
        <line key={idx} x1={x} y1={wly + 12} x2={x - 2} y2={hemY - 8} stroke={shadow} strokeWidth="1.2" opacity="0.6" />
      ))}

      {/* 4. Elegant Cross-Body Draped Pallu (Flowing over Left Shoulder) */}
      <path
        d={`M ${wrx - 4} ${wly + 14}
           C ${wrx - 14} ${anchors.chestY + 10}, 190 ${anchors.chestY - 5}, ${slx + 6} ${sly + 4}
           L ${slx - 6} ${sly + 6}
           C ${slx - 2} ${anchors.chestY}, ${wlx + 10} ${anchors.chestY + 20}, ${wlx + 14} ${wly + 14}
           Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />
      {/* Golden Zari Border on Pallu */}
      <path
        d={`M ${wrx - 4} ${wly + 14} C ${wrx - 14} ${anchors.chestY + 10}, 190 ${anchors.chestY - 5}, ${slx + 6} ${sly + 4}`}
        stroke={zariGold}
        strokeWidth="3.5"
        fill="none"
      />

      {/* Flowing Pallu Drop Behind Left Arm */}
      <path
        d={`M ${slx + 4} ${sly + 4}
           C ${slx - 14} ${sly + 80}, ${slx - 18} ${wly + 60}, ${slx - 12} ${anchors.kneeLeft[1] - 40}
           L ${slx - 24} ${anchors.kneeLeft[1] - 30}
           C ${slx - 30} ${wly + 50}, ${slx - 24} ${sly + 80}, ${slx - 6} ${sly + 6} Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />
      <line x1={slx - 24} y1={anchors.kneeLeft[1] - 30} x2={slx - 12} y2={anchors.kneeLeft[1] - 40} stroke={zariGold} strokeWidth="3" />
    </g>
  );
};

// -------------------------------------------------------------------------------------------------
// 11. SNEAKERS
// -------------------------------------------------------------------------------------------------
export const SneakersGarment: React.FC<GarmentTemplateProps> = ({ anchors, props, onClick, isSelected }) => {
  const fill = props.primaryColor;
  const soleColor = '#FFFFFF';
  const shadow = getShade(props.primaryColor, 0.3);

  const [flx, fly] = anchors.footLeft;
  const [frx, fry] = anchors.footRight;

  return (
    <g
      id="garment-sneakers"
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' : 'hover:opacity-95'}`}
    >
      {/* Left Sneaker */}
      <path
        d={`M ${anchors.ankleLeft[0] - 6} ${anchors.ankleLeft[1] + 4}
           L ${flx - 12} ${fly + 2}
           C ${flx - 14} ${fly + 8}, ${flx - 12} ${fly + 12}, ${flx - 6} ${fly + 14}
           L ${flx + 12} ${fly + 14}
           C ${flx + 14} ${fly + 8}, ${anchors.ankleLeft[0] + 8} ${anchors.ankleLeft[1] + 8}, ${anchors.ankleLeft[0] + 6} ${anchors.ankleLeft[1] + 4} Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />
      {/* Left Sole */}
      <path
        d={`M ${flx - 13} ${fly + 11} L ${flx + 13} ${fly + 11} L ${flx + 12} ${fly + 15} L ${flx - 12} ${fly + 15} Z`}
        fill={soleColor}
        stroke="#CBD5E1"
        strokeWidth="0.8"
      />
      {/* Laces */}
      <line x1={flx - 4} y1={fly + 5} x2={flx + 4} y2={fly + 5} stroke="#FFFFFF" strokeWidth="1.2" />
      <line x1={flx - 3} y1={fly + 8} x2={flx + 3} y2={fly + 8} stroke="#FFFFFF" strokeWidth="1.2" />

      {/* Right Sneaker */}
      <path
        d={`M ${anchors.ankleRight[0] - 6} ${anchors.ankleRight[1] + 4}
           C ${anchors.ankleRight[0] - 8} ${anchors.ankleRight[1] + 8}, ${frx - 14} ${fry + 8}, ${frx - 12} ${fry + 14}
           L ${frx + 6} ${fry + 14}
           C ${frx + 12} ${fry + 12}, ${frx + 14} ${fry + 8}, ${frx + 12} ${fry + 2}
           L ${anchors.ankleRight[0] + 6} ${anchors.ankleRight[1] + 4} Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />
      {/* Right Sole */}
      <path
        d={`M ${frx - 13} ${fry + 11} L ${frx + 13} ${fry + 11} L ${frx + 12} ${fry + 15} L ${frx - 12} ${fry + 15} Z`}
        fill={soleColor}
        stroke="#CBD5E1"
        strokeWidth="0.8"
      />
      {/* Laces */}
      <line x1={frx - 4} y1={fry + 5} x2={frx + 4} y2={fry + 5} stroke="#FFFFFF" strokeWidth="1.2" />
      <line x1={frx - 3} y1={fry + 8} x2={frx + 3} y2={fry + 8} stroke="#FFFFFF" strokeWidth="1.2" />
    </g>
  );
};

// -------------------------------------------------------------------------------------------------
// 12. SANDALS / SLIPPERS
// -------------------------------------------------------------------------------------------------
export const SandalsSlippersGarment: React.FC<GarmentTemplateProps> = ({ anchors, props, onClick, isSelected }) => {
  const strapColor = props.primaryColor;

  const [flx, fly] = anchors.footLeft;
  const [frx, fry] = anchors.footRight;

  return (
    <g
      id="garment-sandals"
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' : 'hover:opacity-95'}`}
    >
      {/* Left Sandal Sole */}
      <path
        d={`M ${flx - 11} ${fly + 13} L ${flx + 11} ${fly + 13} L ${flx + 10} ${fly + 16} L ${flx - 10} ${fly + 16} Z`}
        fill="#A18265"
        stroke="#593C23"
        strokeWidth="0.8"
      />
      {/* Left Straps (Minimalist Luxe Slide) */}
      <path
        d={`M ${flx - 8} ${fly + 4} Q ${flx} ${fly + 7} ${flx + 8} ${fly + 4}`}
        stroke={strapColor}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M ${flx - 6} ${fly + 9} Q ${flx} ${fly + 12} ${flx + 6} ${fly + 9}`}
        stroke={strapColor}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Right Sandal Sole */}
      <path
        d={`M ${frx - 11} ${fry + 13} L ${frx + 11} ${fry + 13} L ${frx + 10} ${fry + 16} L ${frx - 10} ${fry + 16} Z`}
        fill="#A18265"
        stroke="#593C23"
        strokeWidth="0.8"
      />
      {/* Right Straps */}
      <path
        d={`M ${frx - 8} ${fry + 4} Q ${frx} ${fry + 7} ${frx + 8} ${fry + 4}`}
        stroke={strapColor}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M ${frx - 6} ${fry + 9} Q ${frx} ${fry + 12} ${frx + 6} ${fry + 9}`}
        stroke={strapColor}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
};

// -------------------------------------------------------------------------------------------------
// 13. FORMAL SHOES
// -------------------------------------------------------------------------------------------------
export const FormalShoesGarment: React.FC<GarmentTemplateProps> = ({ anchors, props, onClick, isSelected }) => {
  const fill = props.primaryColor;
  const shadow = getShade(props.primaryColor, 0.4);
  const highlight = getHighlight(props.primaryColor, 0.2);

  const [flx, fly] = anchors.footLeft;
  const [frx, fry] = anchors.footRight;

  return (
    <g
      id="garment-formal-shoes"
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' : 'hover:opacity-95'}`}
    >
      {/* Left Shoe */}
      <path
        d={`M ${anchors.ankleLeft[0] - 5} ${anchors.ankleLeft[1] + 3}
           L ${flx - 13} ${fly + 5}
           C ${flx - 16} ${fly + 10}, ${flx - 14} ${fly + 14}, ${flx - 6} ${fly + 15}
           L ${flx + 11} ${fly + 15}
           C ${flx + 13} ${fly + 10}, ${anchors.ankleLeft[0] + 8} ${anchors.ankleLeft[1] + 6}, ${anchors.ankleLeft[0] + 5} ${anchors.ankleLeft[1] + 3} Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />
      {/* Polished leather highlight */}
      <path d={`M ${flx - 10} ${fly + 8} Q ${flx} ${fly + 11} ${flx + 8} ${fly + 8}`} stroke={highlight} strokeWidth="1.2" fill="none" opacity="0.6" />
      {/* Stacked Heel */}
      <rect x={flx + 4} y={fly + 14} width="7" height="3" fill="#1C1917" />

      {/* Right Shoe */}
      <path
        d={`M ${anchors.ankleRight[0] - 5} ${anchors.ankleRight[1] + 3}
           C ${anchors.ankleRight[0] - 8} ${anchors.ankleRight[1] + 6}, ${frx - 13} ${fry + 10}, ${frx - 11} ${fry + 15}
           L ${frx + 6} ${fry + 15}
           C ${frx + 14} ${fry + 14}, ${frx + 16} ${fry + 10}, ${frx + 13} ${fry + 5}
           L ${anchors.ankleRight[0] + 5} ${anchors.ankleRight[1] + 3} Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />
      <path d={`M ${frx - 8} ${fry + 8} Q ${frx} ${fry + 11} ${frx + 10} ${fry + 8}`} stroke={highlight} strokeWidth="1.2" fill="none" opacity="0.6" />
      <rect x={frx - 11} y={fry + 14} width="7" height="3" fill="#1C1917" />
    </g>
  );
};

// -------------------------------------------------------------------------------------------------
// 14. ACCESSORIES (Watch, Bag, Sunglasses)
// -------------------------------------------------------------------------------------------------
export const AccessoriesGarment: React.FC<GarmentTemplateProps> = ({ anchors, props, onClick, isSelected }) => {
  const gold = '#D4AF37';
  const name = props.name.toLowerCase();

  return (
    <g
      id="garment-accessories"
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' : 'hover:opacity-95'}`}
    >
      {/* Luxury Watch on Left Wrist */}
      <rect
        x={anchors.wristLeft[0] - 6}
        y={anchors.wristLeft[1] - 3}
        width="12"
        height="6"
        rx="2"
        fill={gold}
        stroke="#996515"
        strokeWidth="0.8"
      />
      <circle cx={anchors.wristLeft[0]} cy={anchors.wristLeft[1]} r="2" fill="#FFFFFF" />

      {/* Bag / Tote next to right hand if mentioned */}
      {(name.includes('bag') || name.includes('tote') || name.includes('clutch')) && (
        <g id="accessory-bag">
          {/* Strap hanging from hand */}
          <path
            d={`M ${anchors.handRight[0]} ${anchors.handRight[1]} Q ${anchors.handRight[0] + 8} ${anchors.handRight[1] + 20} ${anchors.handRight[0] + 6} ${anchors.handRight[1] + 35}`}
            stroke="#593C23"
            strokeWidth="2"
            fill="none"
          />
          {/* Bag Body */}
          <rect
            x={anchors.handRight[0] - 4}
            y={anchors.handRight[1] + 35}
            width="28"
            height="32"
            rx="4"
            fill={props.primaryColor}
            stroke={gold}
            strokeWidth="1.2"
          />
          <circle cx={anchors.handRight[0] + 10} cy={anchors.handRight[1] + 46} r="2" fill={gold} />
        </g>
      )}

      {/* Sunglasses on Face if mentioned */}
      {(name.includes('glass') || name.includes('shade') || name.includes('spectacle')) && (
        <g id="accessory-sunglasses">
          <ellipse cx={anchors.headCenter[0] - 7} cy={anchors.headCenter[1] + 3} rx="6" ry="4" fill="#1C1917" stroke={gold} strokeWidth="0.8" />
          <ellipse cx={anchors.headCenter[0] + 7} cy={anchors.headCenter[1] + 3} rx="6" ry="4" fill="#1C1917" stroke={gold} strokeWidth="0.8" />
          <line x1={anchors.headCenter[0] - 1} y1={anchors.headCenter[1] + 2} x2={anchors.headCenter[0] + 1} y2={anchors.headCenter[1] + 2} stroke={gold} strokeWidth="1" />
        </g>
      )}
    </g>
  );
};

// -------------------------------------------------------------------------------------------------
// 15. GENERIC FALLBACK
// -------------------------------------------------------------------------------------------------
export const GenericGarment: React.FC<GarmentTemplateProps> = ({ anchors, props, idPrefix: _idPrefix = 'generic', onClick, isSelected }) => {
  const fill = props.primaryColor;
  const shadow = getShade(props.primaryColor, 0.25);

  const [wlx, wly] = anchors.waistLeft;
  const [wrx] = anchors.waistRight;
  const hemY = wly + 28;

  return (
    <g
      id="garment-generic-fallback"
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'filter drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]' : 'hover:opacity-95'}`}
    >
      <path
        d={`M ${anchors.shoulderLeft[0]} ${anchors.shoulderLeft[1]}
           L ${wlx} ${hemY}
           L ${wrx} ${hemY}
           L ${anchors.shoulderRight[0]} ${anchors.shoulderRight[1]}
           Z`}
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
        strokeDasharray="4 2"
      />
    </g>
  );
};
