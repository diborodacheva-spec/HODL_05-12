

export interface ProductSEO {
  title?: string;
  description?: string;
  keywords?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string; // Friendly URL part
  price: number;
  description: string;
  category: string;
  imageUrl: string; // Deprecated, kept for backward compatibility (primary image)
  imageAlt?: string; // SEO Alt text
  images: string[]; // Array of base64 or URLs
  material: string;
  marketUrl: string; // Link to Yandex Market
  seo?: ProductSEO;
  seoText?: string; // Long form SEO article/story for the product page
  faq?: FAQItem[]; // Structured FAQ for Rich Snippets
  relatedIds?: string[]; // Manual cross-selling
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string; // Short description for cards
  content: string; // Full HTML content
  category: string;
  imageUrl: string;
  imageAlt?: string; // Alt text for the main image
  date: string;
  readTime: string;
  author?: string;
  tags: string[];
  isFeatured: boolean; // If true, shows as big hero article
  seo?: ProductSEO;
  relatedProductIds?: string[]; // IDs of products mentioned or relevant
  relatedArticleIds?: string[]; // IDs of similar articles
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UniquenessImage {
    url: string;
    label: string;
}

export interface LinkItem {
    id: string;
    label: string;
    url: string;
    isHighlight?: boolean; // For buttons like Yandex Market
}

export interface FeatureItem {
    id: string;
    icon: string; // 'hexagon' | 'shield' | 'zap' | 'ru'
    title: string;
    description: string;
}

export interface SEOSettings {
    page: string; // 'home' | 'shop' | 'mag' | 'global'
    title: string;
    description: string;
    keywords: string;
}

// New Interfaces for Curator and Mag Promo
export interface CuratorProfile {
    name: string;
    role: string;
    imageUrl: string;
    descriptionP1: string;
    descriptionP2: string;
    quote: string;
    signature: string;
}

export interface MagPromo {
    isVisible: boolean;
    title: string;
    text: string;
    buttonText: string;
    linkUrl: string;
    imageUrl: string;
}

export interface ScarcitySettings {
    isEnabled: boolean;
    label: string;
    minTotal: number;
    maxTotal: number;
    minSoldPct: number;
    maxSoldPct: number;
}

export interface PopupSettings {
    isEnabled: boolean;
    style: 'cyber' | 'festive' | 'side-image'; // Added side-image
    pageFilter: 'all' | 'shop' | 'mag';
    title: string;
    text: string;
    imageUrl: string; // Main Character/Image
    secondaryImageUrl?: string; // Project Logo (Winter in Moscow)
    buttonText: string;
    linkUrl: string;
    timerMinutes?: number; // For countdown
}

export type StoreContextType = {
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (product: Product) => Promise<void>; // Full update
  updateProductSEO: (id: string, seo: ProductSEO) => Promise<void>;
  updateProductAdvanced: (id: string, updates: Partial<Product>) => Promise<void>;
  
  articles: Article[];
  addArticle: (article: Article) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  updateArticle: (article: Article) => Promise<void>;

  isAdmin: boolean;
  toggleAdmin: () => void;
  isDemoMode: boolean; // Indicates if we are running on fallback data
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  
  // Hero
  heroImage: string;
  updateHeroImage: (url: string) => void;
  heroPrimaryLink: string;
  updateHeroPrimaryLink: (link: string) => void;
  heroSecondaryLink: string;
  updateHeroSecondaryLink: (link: string) => void;

  // Uniqueness
  uniquenessImages: UniquenessImage[];
  updateUniquenessImage: (index: number, url: string) => void;
  uniquenessLink: string;
  updateUniquenessLink: (link: string) => void;

  // Made in Moscow
  madeInMoscowLogo: string;
  updateMadeInMoscowLogo: (url: string) => void;
  madeInMoscowText: string;
  updateMadeInMoscowText: (text: string) => void;
  madeInMoscowLink: string;
  updateMadeInMoscowLink: (link: string) => void;
  brandLogo: string;
  updateBrandLogo: (url: string) => void;
  
  // New Navigation Management
  headerLinks: LinkItem[];
  updateHeaderLinks: (links: LinkItem[]) => void;
  footerLinks: LinkItem[];
  updateFooterLinks: (links: LinkItem[]) => void;
  footerContacts: string;
  updateFooterContacts: (html: string) => void;

  // Features Block
  features: FeatureItem[];
  updateFeatures: (features: FeatureItem[]) => void;
  featuresLink: string;
  updateFeaturesLink: (link: string) => void;

  // Made Forever Block Links
  madeForeverMarketLink: string;
  updateMadeForeverMarketLink: (link: string) => void;
  madeForeverCareLink: string;
  updateMadeForeverCareLink: (link: string) => void;

  // Mag Settings
  magSubtitle: string;
  magDescription: string;
  updateMagSettings: (subtitle: string, description: string) => void;
  
  curatorProfile: CuratorProfile;
  updateCuratorProfile: (profile: CuratorProfile) => void;
  
  magPromo: MagPromo;
  updateMagPromo: (promo: MagPromo) => void;

  // SEO
  seoSettings: SEOSettings[];
  updateSEOSettings: (settings: SEOSettings[]) => void;

  // Scarcity Widget
  scarcitySettings: ScarcitySettings;
  updateScarcitySettings: (settings: ScarcitySettings) => void;

  // Popup
  popupSettings: PopupSettings;
  updatePopupSettings: (settings: PopupSettings) => void;
};