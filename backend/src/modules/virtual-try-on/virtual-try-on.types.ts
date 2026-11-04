export interface GenerateTryOnDto {
  outfitId?: string;
  itemIds?: string[];
  lightingPreset?: 'Golden Hour' | 'Candlelight Dinner' | 'Editorial Studio' | 'Natural Daylight';
  pose?: 'frontal' | 'three_quarter' | 'profile' | 'dynamic_walking';
  personaType?: 'boy' | 'girl' | 'women' | 'man';
  customPhotoUrl?: string;
  skinTone?: string;
  bodyShape?: string;
  height?: string;
}
