export interface VenueIntelligence {
  id: string;
  name: string;
  address: string;
  category: 'Rooftop Lounge' | 'Fine Dining' | 'Casual Cafe' | 'Executive Office' | 'Gala Ballroom' | 'Art Gallery' | 'Nightlife Club';
  formality: 1 | 2 | 3 | 4 | 5;
  recommendedVibe: string;
  dressCodeAdvice: string;
  tags: string[];
}
