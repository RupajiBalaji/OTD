import { VenueIntelligence } from './venues.types';

export class VenuesService {
  private static CURATED_VENUES: VenueIntelligence[] = [
    {
      id: 'v_amore',
      name: "L'Amore Ristorante",
      address: 'Road No. 36, Jubilee Hills, Hyderabad',
      category: 'Fine Dining',
      formality: 4,
      recommendedVibe: 'Sartorial Minimalist',
      dressCodeAdvice: 'Smart tailored trousers, silk-cashmere knit or crisp Oxford shirt, soft loafers.',
      tags: ['Fine Dining', 'Date Night', 'Romantic', 'Intimate Lighting'],
    },
    {
      id: 'v_olive',
      name: 'Olive Bistro',
      address: 'Durgam Cheruvu, Jubilee Hills, Hyderabad',
      category: 'Rooftop Lounge',
      formality: 3,
      recommendedVibe: 'Old Money Heritage',
      dressCodeAdvice: 'Unstructured hopsack blazer, camp collar linen shirt, gurkha chinos or suede loafers.',
      tags: ['Lake View', 'Terrace', 'Al Fresco', 'Weekend Brunch'],
    },
    {
      id: 'v_aer',
      name: 'Aer Lounge',
      address: 'Four Seasons, Worli, Mumbai',
      category: 'Rooftop Lounge',
      formality: 4,
      recommendedVibe: 'Clean Minimalist',
      dressCodeAdvice: 'Deep charcoal or midnight tones, tailored jacket, architectural leather boots or slip-ons.',
      tags: ['Skyline View', 'Cocktails', 'Elevated Ambience', 'Nightlife'],
    },
    {
      id: 'v_soho',
      name: 'Soho House',
      address: 'Juhu Tara Road, Mumbai',
      category: 'Art Gallery',
      formality: 3,
      recommendedVibe: 'Relaxed Contemporary',
      dressCodeAdvice: 'Creative luxury: relaxed pleats, fine-gauge merino rollneck, clean white leather low-tops.',
      tags: ['Members Club', 'Creative Hub', 'Contemporary Art', 'Coastal'],
    },
    {
      id: 'v_taj',
      name: 'The Taj Falaknuma Palace',
      address: 'Engine Bowli, Fatima Nagar, Hyderabad',
      category: 'Gala Ballroom',
      formality: 5,
      recommendedVibe: 'Formal Architectural',
      dressCodeAdvice: 'Black-tie or dinner jacket with forward-pleat wool trousers, patent or polished calfskin shoes.',
      tags: ['Heritage Palace', 'Ultra Luxury', 'Royal Ambience', 'High Ceremony'],
    },
    {
      id: 'v_roastery',
      name: 'Roastery Coffee House',
      address: 'Banjara Hills, Hyderabad',
      category: 'Casual Cafe',
      formality: 2,
      recommendedVibe: 'Low-Key Relaxed',
      dressCodeAdvice: 'Open-collar washed linen shirt, clean selvedge denim or brushed cotton chinos, minimalist sneakers.',
      tags: ['Artisanal Coffee', 'Courtyard Garden', 'Casual Social', 'Weekend Afternoon'],
    },
  ];

  /**
   * Search and auto-classify venue context
   */
  public static async searchVenues(query: string = ''): Promise<VenueIntelligence[]> {
    const q = query.trim().toLowerCase();
    if (!q) {
      return this.CURATED_VENUES;
    }

    const matches = this.CURATED_VENUES.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q))
    );

    if (matches.length > 0) {
      return matches;
    }

    // Dynamic heuristic classification for custom/unlisted venues
    const dynamicVenue = this.classifyCustomVenue(query);
    return [dynamicVenue, ...this.CURATED_VENUES.slice(0, 3)];
  }

  private static classifyCustomVenue(name: string): VenueIntelligence {
    const lower = name.toLowerCase();

    if (lower.includes('bistro') || lower.includes('dining') || lower.includes('restaurant')) {
      return {
        id: `dyn_${Date.now()}`,
        name,
        address: 'Curated Location',
        category: 'Fine Dining',
        formality: 4,
        recommendedVibe: 'Sartorial Minimalist',
        dressCodeAdvice: 'Tailored trousers, crisp textured shirt or fine knit, leather footwear.',
        tags: ['Dining', 'Curated Ambience'],
      };
    }

    if (lower.includes('rooftop') || lower.includes('lounge') || lower.includes('bar')) {
      return {
        id: `dyn_${Date.now()}`,
        name,
        address: 'Skyline Terrace',
        category: 'Rooftop Lounge',
        formality: 3,
        recommendedVibe: 'Effortless Elegance',
        dressCodeAdvice: 'Elevated smart casual with breathable evening layers and sleek footwear.',
        tags: ['Rooftop', 'Evening Vibe'],
      };
    }

    if (lower.includes('club') || lower.includes('night')) {
      return {
        id: `dyn_${Date.now()}`,
        name,
        address: 'Downtown Entertainment',
        category: 'Nightlife Club',
        formality: 3,
        recommendedVibe: 'Sharp Modern',
        dressCodeAdvice: 'Dark monochrome tones, crisp architectural silhouette, clean designer sneakers or boots.',
        tags: ['Nightlife', 'High Energy'],
      };
    }

    if (lower.includes('cafe') || lower.includes('coffee') || lower.includes('brunch')) {
      return {
        id: `dyn_${Date.now()}`,
        name,
        address: 'Neighborhood Cafe',
        category: 'Casual Cafe',
        formality: 2,
        recommendedVibe: 'Low-Key Relaxed',
        dressCodeAdvice: 'Linen or pima cotton top, comfortable relaxed chinos or raw denim, minimal sneakers.',
        tags: ['Casual', 'Daytime'],
      };
    }

    return {
      id: `dyn_${Date.now()}`,
      name,
      address: 'Private Destination',
      category: 'Executive Office',
      formality: 3,
      recommendedVibe: 'Clean Minimalist',
      dressCodeAdvice: 'Versatile smart casual: tailored trousers, Oxford shirt or knitwear, classic loafers.',
      tags: ['Smart Casual', 'Bespoke Setting'],
    };
  }
}
