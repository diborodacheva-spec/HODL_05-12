
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, StoreContextType, CartItem, UniquenessImage, LinkItem, FeatureItem, SEOSettings, ProductSEO, Article, CuratorProfile, MagPromo, ScarcitySettings, PopupSettings } from '../types';
import { supabase } from '../services/supabaseClient';
import { slugify } from '../utils/slugify';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// --- DEFAULTS ---
const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?auto=format&fit=crop&q=80&w=1000';
const DEFAULT_HERO_PRIMARY_LINK = 'https://market.yandex.ru';
const DEFAULT_HERO_SECONDARY_LINK = '/shop';

const DEFAULT_UNIQUENESS_IMAGES: UniquenessImage[] = [
    { url: 'https://images.unsplash.com/photo-1537429149818-bc0c98d2756d?auto=format&fit=crop&q=80&w=500', label: 'Идея' },
    { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=500', label: 'Пропорции' },
    { url: 'https://images.unsplash.com/photo-1565516725350-93a55c207c6f?auto=format&fit=crop&q=80&w=500', label: 'Ручная работа' },
    { url: 'https://images.unsplash.com/photo-1618401479427-c8ef9465fbe1?auto=format&fit=crop&q=80&w=500', label: 'Характер' },
];
const DEFAULT_UNIQUENESS_LINK = 'https://market.yandex.ru';

const DEFAULT_MOSCOW_TEXT = `Мы — участники программы <span class="text-cyan-400 font-bold">«Сделано в Москве»</span>. Украшения <strong class="text-white"> HODL</strong> появляются на городских витринах, а затем уезжают в разные страны — как артефакты <span class="text-blue-500 font-bold">силы</span> и <span class="text-purple-500 font-bold">свободы</span>.`;
const DEFAULT_MOSCOW_LINK = "https://market.yandex.ru";

const DEFAULT_HEADER_LINKS: LinkItem[] = [
    { id: '1', label: 'Философия', url: '/', isHighlight: false },
    { id: '2', label: 'Коллекции', url: '/shop', isHighlight: false },
    { id: '3', label: 'HODL MAG', url: '/mag', isHighlight: false },
    { id: '4', label: 'Яндекс Маркет', url: 'https://market.yandex.ru', isHighlight: true }
];

const DEFAULT_FOOTER_LINKS: LinkItem[] = [
    { id: '1', label: 'О бренде', url: '/', isHighlight: false },
    { id: '2', label: 'Где купить', url: '/shop', isHighlight: false },
    { id: '3', label: 'Яндекс Маркет', url: 'https://market.yandex.ru', isHighlight: false }
];

const DEFAULT_FOOTER_CONTACTS = `
<li>Москва, Пресненская наб., 12</li>
<li>+7 (916) 101 03 93</li>
<li>info@hodl-jewelry.ru</li>
`;

const DEFAULT_FEATURES: FeatureItem[] = [
    { id: '1', icon: 'shield', title: 'Гарантия и обмен', description: 'Если украшение повредилось — отправим новое бесплатно. Каждое изделие проходит проверку, а в редком случае брака — решаем вопрос без споров.' },
    { id: '2', icon: 'zap', title: 'Гипоаллергенные материалы', description: 'Используем титан и медицинскую сталь 316L — безопасны для кожи, не темнеют и не вызывают реакций.' },
    { id: '3', icon: 'hexagon', title: 'Только оригинальные изделия', description: 'Фирменная упаковка, логотип и бирка. Каждая партия сертифицирована — вы получаете подлинный продукт бренда.' },
    { id: '4', icon: 'ru', title: 'Лёгкий возврат и размер', description: '<a href="/size-calculator.html" target="_blank" rel="noopener noreferrer" class="text-cyan-400 font-bold hover:text-white border-b border-cyan-400 transition-colors">Онлайн-калькулятор</a> поможет точно подобрать размер. Если промахнётесь — просто заменим изделие. Дарим промокод на замену.' }
];
const DEFAULT_FEATURES_LINK = '/mag';
const DEFAULT_MADE_FOREVER_MARKET_LINK = "https://market.yandex.ru";
const DEFAULT_MADE_FOREVER_CARE_LINK = "/mag";

const DEFAULT_MAG_SUBTITLE = "Культура. Технологии. Стиль.";
const DEFAULT_MAG_DESCRIPTION = "Мы пишем для тех, кто создает будущее, а не просто наблюдает за ним.";

const DEFAULT_CURATOR: CuratorProfile = {
    name: "Виктор Рейд",
    role: "Куратор HODL Journal",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    descriptionP1: "Работает с украшениями как с инструментами: тестирует посадку, ощущения от гравировки и то, как кольцо «ведёт себя» в реальной жизни — не только на фото.",
    descriptionP2: "Отвечает за смыслы, которые мы закладываем в каждое кольцо: от выбора материала до символики гравировок. Раньше работал стратегом в дизайн-студии.",
    quote: "«Я верю, что украшения — это не про внешний вид. Это про решение, которое человек принимает для себя».",
    signature: "V. Reid"
};

const DEFAULT_MAG_PROMO: MagPromo = {
    isVisible: true,
    title: "НОВАЯ КОЛЛЕКЦИЯ TITANIUM",
    text: "Посмотрите, как аэрокосмический титан превращается в артефакты стиля.",
    buttonText: "Смотреть на Маркете",
    linkUrl: "https://market.yandex.ru",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800"
};

const DEFAULT_SEO_SETTINGS: SEOSettings[] = [
    { page: 'home', title: 'HODL Jewelry — Титан и Сталь', description: 'Премиальные украшения из титана и стали. Сделано в Москве.', keywords: 'украшения, титан, сталь, кольца' },
    { page: 'shop', title: 'Каталог HODL Jewelry', description: 'Коллекции колец и аксессуаров из титана и стали.', keywords: 'каталог, купить кольцо, мужские кольца' },
    { page: 'mag', title: 'HODL MAG — Журнал о стиле', description: 'Статьи о культуре, технологиях и стиле.', keywords: 'журнал, стиль, мода, технологии' }
];

const DEFAULT_SCARCITY_SETTINGS: ScarcitySettings = {
    isEnabled: true,
    label: "Limited Edition",
    minTotal: 500,
    maxTotal: 5000,
    minSoldPct: 75,
    maxSoldPct: 98
};

const DEFAULT_POPUP: PopupSettings = {
    isEnabled: false,
    style: 'festive',
    pageFilter: 'all',
    title: "Приглушаем свет на -30%",
    text: "И зажигаем скидки — они уже на вашей личной распродаже.",
    imageUrl: "https://hodl-jewelry.ru/mouse-promo.png", // Placeholder for user uploaded image
    secondaryImageUrl: "",
    buttonText: "К товарам",
    linkUrl: "/shop",
    timerMinutes: 30
};

// Helper to extract error message
export const extractErrorMessage = (error: any): string => {
    if (!error) return "Неизвестная ошибка";
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    if (error.message) return error.message;
    return JSON.stringify(error);
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Settings State
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO_IMAGE);
  const [heroPrimaryLink, setHeroPrimaryLink] = useState(DEFAULT_HERO_PRIMARY_LINK);
  const [heroSecondaryLink, setHeroSecondaryLink] = useState(DEFAULT_HERO_SECONDARY_LINK);
  const [uniquenessImages, setUniquenessImages] = useState<UniquenessImage[]>(DEFAULT_UNIQUENESS_IMAGES);
  const [uniquenessLink, setUniquenessLink] = useState(DEFAULT_UNIQUENESS_LINK);
  const [madeInMoscowLogo, setMadeInMoscowLogo] = useState('');
  const [madeInMoscowText, setMadeInMoscowText] = useState(DEFAULT_MOSCOW_TEXT);
  const [madeInMoscowLink, setMadeInMoscowLink] = useState(DEFAULT_MOSCOW_LINK);
  const [brandLogo, setBrandLogo] = useState('');
  const [headerLinks, setHeaderLinks] = useState<LinkItem[]>(DEFAULT_HEADER_LINKS);
  const [footerLinks, setFooterLinks] = useState<LinkItem[]>(DEFAULT_FOOTER_LINKS);
  const [footerContacts, setFooterContacts] = useState(DEFAULT_FOOTER_CONTACTS);
  const [features, setFeatures] = useState<FeatureItem[]>(DEFAULT_FEATURES);
  const [featuresLink, setFeaturesLink] = useState(DEFAULT_FEATURES_LINK);
  const [madeForeverMarketLink, setMadeForeverMarketLink] = useState(DEFAULT_MADE_FOREVER_MARKET_LINK);
  const [madeForeverCareLink, setMadeForeverCareLink] = useState(DEFAULT_MADE_FOREVER_CARE_LINK);
  const [magSubtitle, setMagSubtitle] = useState(DEFAULT_MAG_SUBTITLE);
  const [magDescription, setMagDescription] = useState(DEFAULT_MAG_DESCRIPTION);
  const [curatorProfile, setCuratorProfile] = useState<CuratorProfile>(DEFAULT_CURATOR);
  const [magPromo, setMagPromo] = useState<MagPromo>(DEFAULT_MAG_PROMO);
  const [seoSettings, setSeoSettings] = useState<SEOSettings[]>(DEFAULT_SEO_SETTINGS);
  const [scarcitySettings, setScarcitySettings] = useState<ScarcitySettings>(DEFAULT_SCARCITY_SETTINGS);
  const [popupSettings, setPopupSettings] = useState<PopupSettings>(DEFAULT_POPUP);

  const fetchProducts = async () => {
      try {
          const { data, error } = await supabase.from('products').select('*');
          if (error) throw error;
          if (data) {
              const mapped = data.map((item: any) => ({
                  id: item.id,
                  name: item.name,
                  slug: item.slug || slugify(item.name),
                  price: item.price,
                  description: item.description,
                  category: item.category,
                  material: item.material,
                  imageUrl: item.image_url,
                  imageAlt: item.image_alt,
                  images: item.images || [item.image_url],
                  marketUrl: item.market_url,
                  seo: item.seo,
                  seoText: item.seo_text,
                  faq: item.faq || [],
                  relatedIds: item.related_ids || []
              }));
              setProducts(mapped);
              setIsDemoMode(false);
          }
      } catch (e) {
          console.error("Supabase load failed:", e);
          setIsDemoMode(true);
      }
  };

  const fetchArticles = async () => {
    try {
        const { data, error } = await supabase.from('articles').select('*');
        if (error) {
            // Ignore error if table doesn't exist yet (handled by demo mode or admin setup)
            if (error.code === '42P01') {
                console.warn("Articles table not found. Running in partial mode.");
                return;
            }
            throw error;
        }
        if (data) {
            const mapped = data.map((item: any) => ({
                id: item.id,
                title: item.title,
                slug: item.slug || slugify(item.title),
                excerpt: item.excerpt,
                content: item.content,
                category: item.category,
                image_url: item.imageUrl,
                image_alt: item.imageAlt,
                date: item.date,
                read_time: item.readTime,
                author: item.author,
                tags: item.tags || [],
                is_featured: item.isFeatured,
                seo: item.seo,
                related_product_ids: item.relatedProductIds,
                related_article_ids: item.relatedArticleIds
            }));
            setArticles(mapped);
        }
    } catch (e) {
        console.error("Supabase articles load failed:", e);
    }
  };

  const fetchSettings = async () => {
      try {
          const { data, error } = await supabase.from('app_settings').select('*');
          if (error) throw error;
          if (data) {
              data.forEach((row: any) => {
                  if (row.key === 'hero_image') setHeroImage(row.value);
                  if (row.key === 'hero_link_1') setHeroPrimaryLink(row.value);
                  if (row.key === 'hero_link_2') setHeroSecondaryLink(row.value);
                  if (row.key === 'uniqueness_images') setUniquenessImages(JSON.parse(row.value));
                  if (row.key === 'uniqueness_link') setUniquenessLink(row.value);
                  if (row.key === 'moscow_logo') setMadeInMoscowLogo(row.value);
                  if (row.key === 'moscow_text') setMadeInMoscowText(row.value);
                  if (row.key === 'moscow_link') setMadeInMoscowLink(row.value);
                  if (row.key === 'brand_logo') setBrandLogo(row.value);
                  if (row.key === 'header_links') setHeaderLinks(JSON.parse(row.value));
                  if (row.key === 'footer_links') setFooterLinks(JSON.parse(row.value));
                  if (row.key === 'footer_contacts') setFooterContacts(row.value);
                  if (row.key === 'features') setFeatures(JSON.parse(row.value));
                  if (row.key === 'features_link') setFeaturesLink(row.value);
                  if (row.key === 'made_forever_market_link') setMadeForeverMarketLink(row.value);
                  if (row.key === 'made_forever_care_link') setMadeForeverCareLink(row.value);
                  if (row.key === 'mag_subtitle') setMagSubtitle(row.value);
                  if (row.key === 'mag_description') setMagDescription(row.value);
                  if (row.key === 'curator_profile') setCuratorProfile(JSON.parse(row.value));
                  if (row.key === 'mag_promo') setMagPromo(JSON.parse(row.value));
                  if (row.key === 'seo_settings') setSeoSettings(JSON.parse(row.value));
                  if (row.key === 'scarcity_settings') setScarcitySettings(JSON.parse(row.value));
                  if (row.key === 'popup_settings') setPopupSettings(JSON.parse(row.value));
              });
          }
      } catch (e) {
          console.error("Settings load failed", e);
      }
  };

  useEffect(() => {
    fetchProducts();
    fetchArticles();
    fetchSettings();
  }, []);

  const saveSetting = async (key: string, value: string) => {
      if (isDemoMode) return;
      await supabase.from('app_settings').upsert({ key, value });
  };

  const toggleAdmin = () => setIsAdmin(!isAdmin);

  // --- Products ---
  const addProduct = async (product: Product) => {
    if (isDemoMode) {
        setProducts([...products, product]);
        return;
    }
    
    // Attempt 1: Full Payload
    const fullPayload = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        description: product.description,
        category: product.category,
        material: product.material,
        image_url: product.imageUrl,
        image_alt: product.imageAlt,
        images: product.images,
        market_url: product.marketUrl,
        seo: product.seo,
        seo_text: product.seoText,
        faq: product.faq,
        related_ids: product.relatedIds
    };

    let { error } = await supabase.from('products').insert(fullPayload);

    // Error Handling: Duplicate Key (Slug) - 23505
    if (error && error.code === '23505') {
        console.warn("Duplicate slug detected. Auto-appending random suffix...", error.message);
        
        const suffix = Math.floor(Math.random() * 10000).toString();
        const newSlug = `${product.slug}-${suffix}`;
        fullPayload.slug = newSlug;
        
        // Retry insertion with new slug
        const retry = await supabase.from('products').insert(fullPayload);
        error = retry.error;
        
        if (!error) {
             console.log(`Product inserted with new slug: ${newSlug}`);
        }
    }

    // Error Handling: Schema Mismatch (42703) - Column does not exist
    if (error && (error.code === '42703' || error.message?.includes('column') || error.message?.includes('does not exist'))) {
        console.warn("Supabase: Schema mismatch detected. Retrying with minimal payload.", error);
        
        const minimalPayload = {
            id: product.id,
            name: product.name,
            slug: fullPayload.slug, // Use potentially updated slug
            price: product.price,
            description: product.description,
            category: product.category,
            material: product.material,
            image_url: product.imageUrl,
            market_url: product.marketUrl,
            seo: product.seo
        };

        const retry = await supabase.from('products').insert(minimalPayload);
        error = retry.error;
    }

    if (error) { 
        console.error("Supabase Insert Error:", JSON.stringify(error, null, 2));
        alert("Ошибка сохранения: " + (error.message || "Неизвестная ошибка")); 
        throw error;
    }
    
    await fetchProducts();
  };
  
  const updateProduct = async (product: Product) => {
    if (isDemoMode) {
        setProducts(products.map(p => p.id === product.id ? product : p));
        return;
    }

    const payload = {
        name: product.name,
        slug: product.slug,
        price: product.price,
        description: product.description,
        category: product.category,
        material: product.material,
        image_url: product.imageUrl,
        image_alt: product.imageAlt,
        images: product.images,
        market_url: product.marketUrl,
        seo: product.seo,
        seo_text: product.seoText,
        // Preserve FAQ and RelatedIDs if not explicitly updated here (usually handled via advanced modal)
        // But for full update we should probably include them if they are in the object
    };

    const { error } = await supabase.from('products').update(payload).eq('id', product.id);

    if (error) {
        console.error("Supabase Update Error:", error);
        alert("Ошибка обновления: " + error.message);
        throw error;
    }
    
    await fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    if (isDemoMode) {
        setProducts(products.filter(p => p.id !== id));
    } else {
        await supabase.from('products').delete().eq('id', id);
        fetchProducts();
    }
  };

  const updateProductSEO = async (id: string, seo: ProductSEO) => {
      if (!isDemoMode) {
          await supabase.from('products').update({ seo }).eq('id', id);
          fetchProducts();
      } else {
          setProducts(products.map(p => p.id === id ? { ...p, seo } : p));
      }
  };

  const updateProductAdvanced = async (id: string, updates: Partial<Product>) => {
      if (!isDemoMode) {
          const dbUpdates: any = {};
          if (updates.seo) dbUpdates.seo = updates.seo;
          if (updates.faq) dbUpdates.faq = updates.faq;
          if (updates.relatedIds) dbUpdates.related_ids = updates.relatedIds;
          
          const { error } = await supabase.from('products').update(dbUpdates).eq('id', id);
          if (error) throw error;
          fetchProducts();
      } else {
          setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
      }
  };

  // --- Articles ---
  const addArticle = async (article: Article) => {
      if (isDemoMode) {
          setArticles([...articles, article]);
      } else {
          const { error } = await supabase.from('articles').insert({
              id: article.id,
              title: article.title,
              slug: article.slug,
              excerpt: article.excerpt,
              content: article.content,
              category: article.category,
              image_url: article.imageUrl,
              image_alt: article.imageAlt,
              date: article.date,
              read_time: article.readTime,
              author: article.author,
              tags: article.tags,
              is_featured: article.isFeatured,
              seo: article.seo,
              related_product_ids: article.relatedProductIds,
              related_article_ids: article.relatedArticleIds
          });
          if (error) throw error;
          fetchArticles();
      }
  };

  const updateArticle = async (article: Article) => {
     if (isDemoMode) return;
     const { error } = await supabase.from('articles').update({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          image_url: article.imageUrl,
          image_alt: article.imageAlt,
          date: article.date,
          read_time: article.readTime,
          author: article.author,
          tags: article.tags,
          is_featured: article.isFeatured,
          seo: article.seo,
          related_product_ids: article.relatedProductIds,
          related_article_ids: article.relatedArticleIds
     }).eq('id', article.id);
     if (error) throw error;
     fetchArticles();
  };

  const deleteArticle = async (id: string) => {
      if (isDemoMode) {
          setArticles(articles.filter(a => a.id !== id));
      } else {
          await supabase.from('articles').delete().eq('id', id);
          fetchArticles();
      }
  };

  // --- Cart ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };
  const clearCart = () => setCart([]);

  // --- Update Methods for Settings ---
  const updateHeroImage = (url: string) => { setHeroImage(url); saveSetting('hero_image', url); };
  const updateHeroPrimaryLink = (link: string) => { setHeroPrimaryLink(link); saveSetting('hero_link_1', link); };
  const updateHeroSecondaryLink = (link: string) => { setHeroSecondaryLink(link); saveSetting('hero_link_2', link); };
  
  const updateUniquenessImage = (index: number, url: string) => {
      const newImages = [...uniquenessImages];
      newImages[index].url = url;
      setUniquenessImages(newImages);
      saveSetting('uniqueness_images', JSON.stringify(newImages));
  };
  const updateUniquenessLink = (link: string) => { setUniquenessLink(link); saveSetting('uniqueness_link', link); };

  const updateMadeInMoscowLogo = (url: string) => { setMadeInMoscowLogo(url); saveSetting('moscow_logo', url); };
  const updateMadeInMoscowText = (text: string) => { setMadeInMoscowText(text); saveSetting('moscow_text', text); };
  const updateMadeInMoscowLink = (link: string) => { setMadeInMoscowLink(link); saveSetting('moscow_link', link); };
  const updateBrandLogo = (url: string) => { setBrandLogo(url); saveSetting('brand_logo', url); };

  const updateHeaderLinks = (links: LinkItem[]) => { setHeaderLinks(links); saveSetting('header_links', JSON.stringify(links)); };
  const updateFooterLinks = (links: LinkItem[]) => { setFooterLinks(links); saveSetting('footer_links', JSON.stringify(links)); };
  const updateFooterContacts = (html: string) => { setFooterContacts(html); saveSetting('footer_contacts', html); };

  const updateFeatures = (items: FeatureItem[]) => { setFeatures(items); saveSetting('features', JSON.stringify(items)); };
  const updateFeaturesLink = (link: string) => { setFeaturesLink(link); saveSetting('features_link', link); };

  const updateMadeForeverMarketLink = (link: string) => { setMadeForeverMarketLink(link); saveSetting('made_forever_market_link', link); };
  const updateMadeForeverCareLink = (link: string) => { setMadeForeverCareLink(link); saveSetting('made_forever_care_link', link); };

  const updateMagSettings = (subtitle: string, description: string) => {
      setMagSubtitle(subtitle);
      setMagDescription(description);
      saveSetting('mag_subtitle', subtitle);
      saveSetting('mag_description', description);
  };
  
  const updateCuratorProfile = (profile: CuratorProfile) => { setCuratorProfile(profile); saveSetting('curator_profile', JSON.stringify(profile)); };
  const updateMagPromo = (promo: MagPromo) => { setMagPromo(promo); saveSetting('mag_promo', JSON.stringify(promo)); };

  const updateSEOSettings = (settings: SEOSettings[]) => { setSeoSettings(settings); saveSetting('seo_settings', JSON.stringify(settings)); };
  const updateScarcitySettings = (settings: ScarcitySettings) => { setScarcitySettings(settings); saveSetting('scarcity_settings', JSON.stringify(settings)); };
  const updatePopupSettings = (settings: PopupSettings) => { setPopupSettings(settings); saveSetting('popup_settings', JSON.stringify(settings)); };

  return (
    <StoreContext.Provider value={{
      products, addProduct, deleteProduct, updateProduct, updateProductSEO, updateProductAdvanced,
      articles, addArticle, deleteArticle, updateArticle,
      isAdmin, toggleAdmin, isDemoMode,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      heroImage, updateHeroImage, heroPrimaryLink, updateHeroPrimaryLink, heroSecondaryLink, updateHeroSecondaryLink,
      uniquenessImages, updateUniquenessImage, uniquenessLink, updateUniquenessLink,
      madeInMoscowLogo, updateMadeInMoscowLogo, madeInMoscowText, updateMadeInMoscowText, madeInMoscowLink, updateMadeInMoscowLink,
      brandLogo, updateBrandLogo,
      headerLinks, updateHeaderLinks, footerLinks, updateFooterLinks, footerContacts, updateFooterContacts,
      features, updateFeatures, featuresLink, updateFeaturesLink,
      madeForeverMarketLink, updateMadeForeverMarketLink, madeForeverCareLink, updateMadeForeverCareLink,
      magSubtitle, magDescription, updateMagSettings,
      curatorProfile, updateCuratorProfile,
      magPromo, updateMagPromo,
      seoSettings, updateSEOSettings,
      scarcitySettings, updateScarcitySettings,
      popupSettings, updatePopupSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};
