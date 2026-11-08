import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type {
  CharacterCustomization,
  PosePreset,
  CharacterOutfitState,
} from './character.types';
import { getBodyAnchors } from './character.anchors';
import { CharacterHairBack, CharacterBody, CharacterHairFront } from './CharacterBody';
import {
  TeeGarment,
  ShirtGarment,
  KurtaGarment,
  HoodieSweaterGarment,
  JacketBlazerGarment,
  JeansTrousersGarment,
  ShortsGarment,
  SkirtGarment,
  DressGarment,
  SareeGarment,
  SneakersGarment,
  SandalsSlippersGarment,
  FormalShoesGarment,
  AccessoriesGarment,
  GenericGarment,
} from './CharacterGarments';
import { mapClosetItemToVisualProps } from './garment-mapper';

export interface StylizedCharacterProps {
  customization?: Partial<CharacterCustomization>;
  outfit?: CharacterOutfitState;
  pose?: PosePreset;
  onSlotClick?: (slot: 'top' | 'bottom' | 'footwear' | 'outerwear' | 'onePiece' | 'accessory') => void;
  selectedSlot?: string | null;
  className?: string;
  height?: number | string;
  width?: number | string;
}

const DEFAULT_CUSTOMIZATION: CharacterCustomization = {
  skinToneId: 'olive',
  bodyFrame: 'runway',
  hairstyleId: 'short_fade',
  hairColorId: 'rich_black',
  avatarVersion: 1,
};

export const StylizedCharacter: React.FC<StylizedCharacterProps> = ({
  customization = {},
  outfit = {},
  pose = 'stand',
  onSlotClick,
  selectedSlot,
  className = '',
  height = '100%',
  width = '100%',
}) => {
  const reducedMotion = useReducedMotion();
  const [isBlinking, setIsBlinking] = useState(false);

  const activeCustomization: CharacterCustomization = {
    ...DEFAULT_CUSTOMIZATION,
    ...customization,
  };

  const anchors = getBodyAnchors(activeCustomization.bodyFrame, pose);

  // Periodic blinking effect for realistic yet elegant life
  useEffect(() => {
    if (reducedMotion) return;
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, [reducedMotion]);

  // Map outfit items to visual props
  const topVisual = mapClosetItemToVisualProps(outfit.top);
  const bottomVisual = mapClosetItemToVisualProps(outfit.bottom);
  const footwearVisual = mapClosetItemToVisualProps(outfit.footwear);
  const outerwearVisual = mapClosetItemToVisualProps(outfit.outerwear);
  const onePieceVisual = mapClosetItemToVisualProps(outfit.onePiece);
  const accessoryVisual = mapClosetItemToVisualProps(outfit.accessory);

  // Breathing & subtle idle sway animation variants
  const breatheAnimation = reducedMotion
    ? {}
    : {
        y: [0, -4, 0],
        rotate: [0, 0.4, -0.4, 0],
        transition: {
          duration: 4.8,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        },
      };

  const layerTransition = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { duration: 0.28, ease: 'easeOut' as const },
  };

  // Helper to render the appropriate top/one-piece garment
  const renderTopGarment = () => {
    if (onePieceVisual?.templateType === 'saree') {
      return null; // Rendered in saree layer
    }
    if (onePieceVisual?.templateType === 'dress') {
      return (
        <DressGarment
          anchors={anchors}
          props={onePieceVisual}
          onClick={() => onSlotClick?.('onePiece')}
          isSelected={selectedSlot === 'onePiece'}
        />
      );
    }

    if (!topVisual) return null;

    switch (topVisual.templateType) {
      case 'kurta':
        return (
          <KurtaGarment
            anchors={anchors}
            props={topVisual}
            onClick={() => onSlotClick?.('top')}
            isSelected={selectedSlot === 'top'}
          />
        );
      case 'shirt':
        return (
          <ShirtGarment
            anchors={anchors}
            props={topVisual}
            onClick={() => onSlotClick?.('top')}
            isSelected={selectedSlot === 'top'}
          />
        );
      case 'tee':
        return (
          <TeeGarment
            anchors={anchors}
            props={topVisual}
            onClick={() => onSlotClick?.('top')}
            isSelected={selectedSlot === 'top'}
          />
        );
      case 'hoodie_sweater':
        return (
          <HoodieSweaterGarment
            anchors={anchors}
            props={topVisual}
            onClick={() => onSlotClick?.('top')}
            isSelected={selectedSlot === 'top'}
          />
        );
      default:
        return (
          <GenericGarment
            anchors={anchors}
            props={topVisual}
            onClick={() => onSlotClick?.('top')}
            isSelected={selectedSlot === 'top'}
          />
        );
    }
  };

  // Helper to render bottom garment
  const renderBottomGarment = () => {
    if (onePieceVisual) return null; // Dresses and sarees cover bottom
    if (!bottomVisual) return null;

    switch (bottomVisual.templateType) {
      case 'shorts':
        return (
          <ShortsGarment
            anchors={anchors}
            props={bottomVisual}
            onClick={() => onSlotClick?.('bottom')}
            isSelected={selectedSlot === 'bottom'}
          />
        );
      case 'skirt':
        return (
          <SkirtGarment
            anchors={anchors}
            props={bottomVisual}
            onClick={() => onSlotClick?.('bottom')}
            isSelected={selectedSlot === 'bottom'}
          />
        );
      case 'jeans_trousers':
      default:
        return (
          <JeansTrousersGarment
            anchors={anchors}
            props={bottomVisual}
            onClick={() => onSlotClick?.('bottom')}
            isSelected={selectedSlot === 'bottom'}
          />
        );
    }
  };

  // Helper to render footwear
  const renderFootwearGarment = () => {
    if (!footwearVisual) return null;

    switch (footwearVisual.templateType) {
      case 'sneakers':
        return (
          <SneakersGarment
            anchors={anchors}
            props={footwearVisual}
            onClick={() => onSlotClick?.('footwear')}
            isSelected={selectedSlot === 'footwear'}
          />
        );
      case 'sandals_slippers':
        return (
          <SandalsSlippersGarment
            anchors={anchors}
            props={footwearVisual}
            onClick={() => onSlotClick?.('footwear')}
            isSelected={selectedSlot === 'footwear'}
          />
        );
      case 'formal_shoes':
      default:
        return (
          <FormalShoesGarment
            anchors={anchors}
            props={footwearVisual}
            onClick={() => onSlotClick?.('footwear')}
            isSelected={selectedSlot === 'footwear'}
          />
        );
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{ height, width }}
    >
      <svg
        viewBox="0 0 400 700"
        className="w-full h-full max-h-full drop-shadow-md"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Soft atelier ambient pedestal shadow */}
        <ellipse cx="200" cy="670" rx="90" ry="14" fill="#000000" opacity="0.08" />

        {/* Motion animated body group with idle breathing & sway */}
        <motion.g animate={breatheAnimation}>
          {/* Layer 1: Back Hair */}
          <CharacterHairBack anchors={anchors} customization={activeCustomization} />

          {/* Layer 2: Anatomical Illustration Base Body */}
          <CharacterBody
            anchors={anchors}
            customization={activeCustomization}
            isBlinking={isBlinking}
          />

          {/* Layer 3: Bottom Garment (Isolated Layer Transition) */}
          <AnimatePresence mode="wait">
            {bottomVisual && (
              <motion.g
                key={`bottom-${bottomVisual.itemId || bottomVisual.templateType}-${bottomVisual.primaryColor}`}
                {...layerTransition}
              >
                {renderBottomGarment()}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Layer 4: Top / Dress Garment (Isolated Layer Transition) */}
          <AnimatePresence mode="wait">
            {(topVisual || onePieceVisual?.templateType === 'dress') && (
              <motion.g
                key={`top-${(topVisual || onePieceVisual)?.itemId || (topVisual || onePieceVisual)?.templateType}-${(topVisual || onePieceVisual)?.primaryColor}`}
                {...layerTransition}
              >
                {renderTopGarment()}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Layer 5: Outerwear Garment */}
          <AnimatePresence mode="wait">
            {outerwearVisual && (
              <motion.g
                key={`outer-${outerwearVisual.itemId || outerwearVisual.templateType}-${outerwearVisual.primaryColor}`}
                {...layerTransition}
              >
                <JacketBlazerGarment
                  anchors={anchors}
                  props={outerwearVisual}
                  onClick={() => onSlotClick?.('outerwear')}
                  isSelected={selectedSlot === 'outerwear'}
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Layer 6: Saree Draped Ensemble (Crosses entire torso and shoulder) */}
          <AnimatePresence mode="wait">
            {onePieceVisual?.templateType === 'saree' && (
              <motion.g
                key={`saree-${onePieceVisual.itemId}-${onePieceVisual.primaryColor}`}
                {...layerTransition}
              >
                <SareeGarment
                  anchors={anchors}
                  props={onePieceVisual}
                  onClick={() => onSlotClick?.('onePiece')}
                  isSelected={selectedSlot === 'onePiece'}
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Layer 7: Footwear (Isolated Layer Transition: changing slippers changes only this!) */}
          <AnimatePresence mode="wait">
            {footwearVisual && (
              <motion.g
                key={`foot-${footwearVisual.itemId || footwearVisual.templateType}-${footwearVisual.primaryColor}`}
                {...layerTransition}
              >
                {renderFootwearGarment()}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Layer 8: Accessories */}
          <AnimatePresence mode="wait">
            {accessoryVisual && (
              <motion.g
                key={`acc-${accessoryVisual.itemId || accessoryVisual.templateType}`}
                {...layerTransition}
              >
                <AccessoriesGarment
                  anchors={anchors}
                  props={accessoryVisual}
                  onClick={() => onSlotClick?.('accessory')}
                  isSelected={selectedSlot === 'accessory'}
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Layer 9: Front Hair */}
          <CharacterHairFront anchors={anchors} customization={activeCustomization} />
        </motion.g>
      </svg>
    </div>
  );
};
