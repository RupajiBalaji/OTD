export interface ShoppingRecommendationDto {
  id: string;
  category: string;
  name: string;
  brand: string;
  reason: string;
  urgency: 'High' | 'Medium' | 'Low';
  estimatedPrice: number;
  imageUrl: string;
  affiliateUrl: string;
}
