
import React, { useState, useRef, useEffect } from 'react';
import { useStore, extractErrorMessage } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { generateProductDescription, generateImageAlt, generateCrossLinks, generateMarketingImage, generateRichProductDetails } from '../services/geminiService';
import { slugify } from '../utils/slugify';
import { Wand2, Loader2, Plus, Image as ImageIcon, AlertTriangle, ArrowLeft, Upload, Save, Settings, Wifi, WifiOff, LayoutTemplate, FileWarning, CheckCircle, Award, Fingerprint, Trash2, Link as LinkIcon, List, Zap, Shield, Hexagon, Hammer, Search, X, Check, Database, Copy, Globe, Menu, ShoppingBag, BookOpen, Star, PenTool, Hash, Clock, Calendar, AlignLeft, User, Megaphone, Wrench, Sparkles, Network, FileImage, ExternalLink, Type, MessageSquare, RotateCcw, Layout, ShoppingCart, Map, FileCode, Download, Flame, Activity, Home, Rss, Share2, HelpCircle, CheckSquare, Snowflake, Palette, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product, LinkItem, FeatureItem, SEOSettings, ProductSEO, Article, CuratorProfile, MagPromo, ScarcitySettings, FAQItem, PopupSettings } from '../types';
import WinterPopup from '../components/WinterPopup';

type Tab = 'products' | 'journal' | 'settings' | 'tools';
type WidgetType = 'image' | 'card';
type CompressionTaskIndex = number | 'moscow_logo' | 'brand_logo' | 'article_main' | 'curator_img' | 'promo_img' | 'article_widget' | 'popup_img' | 'popup_secondary_img';

export default function Admin() {
  const { 
      isAdmin, 
      isDemoMode,
      products, 
      addProduct, 
      deleteProduct,
      updateProduct,
      updateProductSEO,
      updateProductAdvanced,
      articles,
      addArticle,
      deleteArticle,
      updateArticle,
      heroImage, 
      updateHeroImage, 
      heroPrimaryLink, 
      updateHeroPrimaryLink, 
      heroSecondaryLink, 
      updateHeroSecondaryLink,
      uniquenessImages, 
      updateUniquenessImage, 
      uniquenessLink, 
      updateUniquenessLink: storeUpdateUniquenessLink, 
      madeInMoscowLogo, 
      updateMadeInMoscowLogo: storeUpdateMadeInMoscowLogo,
      madeInMoscowText, 
      updateMadeInMoscowText: storeUpdateMadeInMoscowText,
      madeInMoscowLink, 
      updateMadeInMoscowLink: storeUpdateMadeInMoscowLink,
      brandLogo,
      updateBrandLogo,
      headerLinks,
      updateHeaderLinks,
      footerLinks,
      updateFooterLinks,
      footerContacts,
      updateFooterContacts,
      features,
      updateFeatures,
      featuresLink,
      updateFeaturesLink,
      madeForeverMarketLink,
      updateMadeForeverMarketLink,
      madeForeverCareLink,
      updateMadeForeverCareLink,
      magSubtitle,
      magDescription,
      updateMagSettings,
      curatorProfile,
      updateCuratorProfile,
      magPromo,
      updateMagPromo,
      seoSettings,
      updateSEOSettings,
      scarcitySettings,
      updateScarcitySettings,
      popupSettings,
      updatePopupSettings
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<Tab>('products');

  // --- PRODUCT FORM STATE ---
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    category: '',
    material: '',
    marketUrl: '',
    description: '',
    imageAlt: '',
    seoText: ''
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const multipleImageInputRef = useRef<HTMLInputElement>(null);
  const productFormRef = useRef<HTMLDivElement>(null);
  
  const [newProductSEO, setNewProductSEO] = useState<ProductSEO>({
      title: '',
      description: '',
      keywords: ''
  });
  const [showSeoInputs, setShowSeoInputs] = useState(false);
  
  // --- ADVANCED SEO MODAL STATE ---
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editSEOData, setEditSEOData] = useState<ProductSEO>({ title: '', description: '', keywords: '' });
  const [editFAQ, setEditFAQ] = useState<FAQItem[]>([]);
  const [editRelatedIds, setEditRelatedIds] = useState<string[]>([]);

  // --- ARTICLE FORM STATE ---
  const DEFAULT_ARTICLE_FORM = {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Tech',
      imageUrl: '',
      imageAlt: '',
      author: 'Виктор Рейд',
      readTime: '5 мин',
      date: new Date().toLocaleDateString('ru-RU'),
      isFeatured: false,
      tags: '',
      relatedProductIds: [] as string[],
      relatedArticleIds: [] as string[]
  };

  const [articleForm, setArticleForm] = useState(DEFAULT_ARTICLE_FORM);
  const [articleSeo, setArticleSeo] = useState<ProductSEO>({ title: '', description: '', keywords: '' });
  const [showArticleSeo, setShowArticleSeo] = useState(false);
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  
  // Widget State
  const [articleWidgetType, setArticleWidgetType] = useState<WidgetType>('image');
  const [articleWidgetImg, setArticleWidgetImg] = useState('');
  const [articleWidgetCaption, setArticleWidgetCaption] = useState('');
  const [articleWidgetAlt, setArticleWidgetAlt] = useState('');
  const [articleWidgetLink, setArticleWidgetLink] = useState('');


  // --- SETTINGS LOCAL STATE ---
  const [localHeroImage, setLocalHeroImage] = useState(heroImage);
  const [localHeroPrimaryLink, setLocalHeroPrimaryLink] = useState(heroPrimaryLink);
  const [localHeroSecondaryLink, setLocalHeroSecondaryLink] = useState(heroSecondaryLink);
  const [localUniquenessLink, setLocalUniquenessLink] = useState(uniquenessLink);
  const [localMoscowLogo, setLocalMoscowLogo] = useState(madeInMoscowLogo);
  const [localMoscowText, setLocalMoscowText] = useState(madeInMoscowText);
  const [localMoscowLink, setLocalMoscowLink] = useState(madeInMoscowLink);
  const [localBrandLogo, setLocalBrandLogo] = useState(brandLogo);
  const [localHeaderLinks, setLocalHeaderLinks] = useState<LinkItem[]>(headerLinks);
  const [localFooterLinks, setLocalFooterLinks] = useState<LinkItem[]>(footerLinks);
  const [localFooterContacts, setLocalFooterContacts] = useState(footerContacts);
  const [localFeatures, setLocalFeatures] = useState<FeatureItem[]>(features);
  const [localFeaturesLink, setLocalFeaturesLink] = useState(featuresLink);
  const [localMadeForeverMarketLink, setLocalMadeForeverMarketLink] = useState(madeForeverMarketLink);
  const [localMadeForeverCareLink, setLocalMadeForeverCareLink] = useState(madeForeverCareLink);
  const [localSEOSettings, setLocalSEOSettings] = useState<SEOSettings[]>(seoSettings);
  const [localScarcity, setLocalScarcity] = useState<ScarcitySettings>(scarcitySettings);
  const [localPopup, setLocalPopup] = useState<PopupSettings>(popupSettings);
  
  const [localMagSubtitle, setLocalMagSubtitle] = useState(magSubtitle);
  const [localMagDescription, setLocalMagDescription] = useState(magDescription);
  
  // Curator & Promo Local State
  const [localCurator, setLocalCurator] = useState<CuratorProfile>(curatorProfile);
  const [localMagPromo, setLocalMagPromo] = useState<MagPromo>(magPromo);

  // --- UTM GENERATOR STATE ---
  const [utmData, setUtmData] = useState({
      baseUrl: 'https://hodl-jewelry.ru',
      source: 'yandex_market',
      medium: 'cpc',
      campaign: 'promo_winter',
      content: '',
      term: ''
  });
  const [generatedUtm, setGeneratedUtm] = useState('');

  // --- SITEMAP & RSS STATE ---
  const [sitemapXml, setSitemapXml] = useState('');
  const [rssXml, setRssXml] = useState('');
  const [useHashLinks, setUseHashLinks] = useState(false);

  const [showSqlModal, setShowSqlModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingAlt, setIsGeneratingAlt] = useState(false);
  const [isGeneratingRich, setIsGeneratingRich] = useState(false);
  const [isGeneratingLinks, setIsGeneratingLinks] = useState(false);
  const [isGeneratingPopupImg, setIsGeneratingPopupImg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compressionTask, setCompressionTask] = useState<{
    index: CompressionTaskIndex;
    originalSize: number;
    dataUrl: string;
  } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  
  // POPUP PREVIEW STATE
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);

  // Sync settings when store updates
  useEffect(() => {
      setLocalHeroImage(heroImage);
      setLocalHeroPrimaryLink(heroPrimaryLink);
      setLocalHeroSecondaryLink(heroSecondaryLink);
      setLocalUniquenessLink(uniquenessLink);
      setLocalMoscowLogo(madeInMoscowLogo);
      setLocalMoscowText(madeInMoscowText);
      setLocalMoscowLink(madeInMoscowLink);
      setLocalBrandLogo(brandLogo);
      setLocalHeaderLinks(headerLinks);
      setLocalFooterLinks(footerLinks);
      setLocalFooterContacts(footerContacts);
      setLocalFeatures(features);
      setLocalFeaturesLink(featuresLink);
      setLocalMadeForeverMarketLink(madeForeverMarketLink);
      setLocalMadeForeverCareLink(madeForeverCareLink);
      setLocalSEOSettings(seoSettings);
      setLocalScarcity(scarcitySettings);
      setLocalPopup(popupSettings);
      setLocalMagSubtitle(magSubtitle);
      setLocalMagDescription(magDescription);
      setLocalCurator(curatorProfile);
      setLocalMagPromo(magPromo);
  }, [heroImage, heroPrimaryLink, heroSecondaryLink, uniquenessLink, madeInMoscowLogo, madeInMoscowText, madeInMoscowLink, brandLogo, headerLinks, footerLinks, footerContacts, features, featuresLink, madeForeverMarketLink, madeForeverCareLink, seoSettings, scarcitySettings, popupSettings, magSubtitle, magDescription, curatorProfile, magPromo]);

  // Auto-slug for Product
  useEffect(() => {
      if (formData.name && !editId) {
          const autoSlug = slugify(formData.name);
          setFormData(prev => ({ ...prev, slug: autoSlug }));
      }
  }, [formData.name, editId]);

  // Auto-slug for Article (only if not editing, to avoid overwriting existing slug)
  useEffect(() => {
      if (articleForm.title && !editingArticleId) {
          setArticleForm(prev => ({ ...prev, slug: slugify(articleForm.title) }));
      }
  }, [articleForm.title, editingArticleId]);

  // Auto-generate UTM
  useEffect(() => {
      try {
          const url = new URL(utmData.baseUrl);
          if (utmData.source) url.searchParams.set('utm_source', utmData.source);
          if (utmData.medium) url.searchParams.set('utm_medium', utmData.medium);
          if (utmData.campaign) url.searchParams.set('utm_campaign', utmData.campaign);
          if (utmData.content) url.searchParams.set('utm_content', utmData.content);
          if (utmData.term) url.searchParams.set('utm_term', utmData.term);
          setGeneratedUtm(url.toString());
      } catch (e) {
          setGeneratedUtm("Invalid Base URL");
      }
  }, [utmData]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-6" />
        <h2 className="text-3xl font-display font-bold mb-4">Доступ ограничен</h2>
        <Link to="/" className="text-cyan-400 border-b border-cyan-400 pb-1">Вернуться на главную</Link>
      </div>
    );
  }

  // --- HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditProduct = (product: Product) => {
      setEditId(product.id);
      setFormData({
          name: product.name,
          slug: product.slug || '',
          price: String(product.price),
          category: product.category,
          material: product.material,
          marketUrl: product.marketUrl,
          description: product.description,
          imageAlt: product.imageAlt || '',
          seoText: product.seoText || ''
      });
      setUploadedImages(product.images || [product.imageUrl]);
      if (product.seo) {
          setNewProductSEO(product.seo);
      } else {
          setNewProductSEO({ title: '', description: '', keywords: '' });
      }
      
      // Scroll to form
      productFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
      setEditId(null);
      setFormData({ name: '', slug: '', price: '', category: '', material: '', marketUrl: '', description: '', imageAlt: '', seoText: '' });
      setUploadedImages([]);
      setNewProductSEO({ title: '', description: '', keywords: '' });
  };

  const handleArticleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setArticleForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleArticleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
      setArticleForm(prev => ({ ...prev, isFeatured: e.target.checked }));
  };

  const handleEditArticle = (article: Article) => {
      setArticleForm({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          imageUrl: article.imageUrl,
          imageAlt: article.imageAlt || '',
          author: article.author || '',
          readTime: article.readTime,
          date: article.date,
          isFeatured: article.isFeatured,
          tags: article.tags.join(', '),
          relatedProductIds: article.relatedProductIds || [],
          relatedArticleIds: article.relatedArticleIds || []
      });
      setArticleSeo(article.seo || { title: '', description: '', keywords: '' });
      setEditingArticleId(article.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditArticle = () => {
      setArticleForm(DEFAULT_ARTICLE_FORM);
      setArticleSeo({ title: '', description: '', keywords: '' });
      setEditingArticleId(null);
  };

  const handleDeleteArticle = async (id: string) => {
      if (window.confirm("Вы уверены, что хотите удалить эту статью?")) {
          await deleteArticle(id);
          if (editingArticleId === id) cancelEditArticle();
      }
  };
  
  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.category || !formData.material) {
      setError("Заполните название, категорию и материал для AI генерации.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const desc = await generateProductDescription(formData.name, formData.material, formData.category);
      setFormData(prev => ({ ...prev, description: desc }));
    } catch (err) {
      setError("Ошибка API. Попробуйте позже.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateRichDescription = async () => {
    if (!formData.name || !formData.category) {
        alert("Заполните название и категорию");
        return;
    }
    setIsGeneratingRich(true);
    try {
        const richHtml = await generateRichProductDetails(formData.name, formData.material || 'Premium Material', formData.category);
        setFormData(prev => ({ ...prev, seoText: richHtml }));
    } catch (e) {
        alert("Ошибка генерации");
    } finally {
        setIsGeneratingRich(false);
    }
  };

  const handleGenerateProductAlt = async () => {
      if (!formData.name) {
          alert("Введите название товара для генерации Alt текста");
          return;
      }
      setIsGeneratingAlt(true);
      try {
          const alt = await generateImageAlt(formData.name, formData.category || 'Аксессуары', formData.material);
          setFormData(prev => ({ ...prev, imageAlt: alt }));
      } catch (e) {
          alert("Ошибка генерации Alt текста");
      } finally {
          setIsGeneratingAlt(false);
      }
  };

  const handleGenerateArticleAlt = async () => {
      if (!articleForm.title) {
          alert("Введите заголовок статьи для генерации Alt текста");
          return;
      }
      setIsGeneratingAlt(true);
      try {
          const alt = await generateImageAlt(articleForm.title, articleForm.category, 'Article Image', `Статья о ${articleForm.tags}`);
          setArticleForm(prev => ({ ...prev, imageAlt: alt }));
      } catch (e) {
          alert("Ошибка генерации Alt текста");
      } finally {
          setIsGeneratingAlt(false);
      }
  };

  const handleGenerateCrossLinks = async () => {
      if (!articleForm.title || !articleForm.excerpt) {
          alert("Заполните Заголовок и Краткое описание статьи.");
          return;
      }
      setIsGeneratingLinks(true);
      try {
          const simpleProducts = products.map(p => ({ id: p.id, name: p.name, category: p.category }));
          const simpleArticles = articles.map(a => ({ id: a.id, title: a.title, category: a.category }));
          const result = await generateCrossLinks(articleForm.title, articleForm.excerpt, simpleProducts, simpleArticles);
          if (result) {
              setArticleForm(prev => ({
                  ...prev,
                  relatedProductIds: result.productIds,
                  relatedArticleIds: result.articleIds
              }));
              alert(`AI подобрал: ${result.productIds.length} товаров и ${result.articleIds.length} статей.`);
          }
      } catch (e) {
          alert("Ошибка AI перелинковки.");
      } finally {
          setIsGeneratingLinks(false);
      }
  };

  const handleGeneratePopupImage = async () => {
      setIsGeneratingPopupImg(true);
      try {
          const context = localPopup.title + " " + localPopup.text;
          const imgUrl = await generateMarketingImage(context);
          setLocalPopup(prev => ({ ...prev, imageUrl: imgUrl }));
          alert("Зимняя картинка сгенерирована!");
      } catch (e) {
          alert("Ошибка генерации картинки.");
      } finally {
          setIsGeneratingPopupImg(false);
      }
  };
  
    const handleGenerateSitemap = () => {
      const baseUrl = 'https://hodl-jewelry.ru';
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      // Static
      ['/', '/shop', '/mag'].forEach(path => {
          xml += `  <url><loc>${baseUrl}${path}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>\n`;
      });
      // Products
      products.forEach(p => {
          xml += `  <url><loc>${baseUrl}/product/${p.slug || p.id}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
      });
      // Articles
      articles.forEach(a => {
          xml += `  <url><loc>${baseUrl}/mag/${a.slug || a.id}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
      });
      xml += `</urlset>`;
      setSitemapXml(xml);
  };

  const handleGenerateRss = () => {
      const baseUrl = 'https://hodl-jewelry.ru';
      let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>HODL Jewelry Mag</title>
  <link>${baseUrl}</link>
  <description>Журнал о культуре, технологиях и стиле</description>
  <language>ru</language>
  <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
`;
      articles.forEach(a => {
          xml += `  <item>
    <title>${a.title}</title>
    <link>${baseUrl}/mag/${a.slug || a.id}</link>
    <guid isPermaLink="true">${baseUrl}/mag/${a.slug || a.id}</guid>
    <description>${a.excerpt}</description>
    <pubDate>${new Date(a.date).toUTCString()}</pubDate>
    <content:encoded><![CDATA[${a.content}]]></content:encoded>
    ${a.imageUrl ? `<enclosure url="${a.imageUrl}" type="image/jpeg" />` : ''}
  </item>\n`;
      });
      xml += `</channel></rss>`;
      setRssXml(xml);
  };
    
    const downloadSitemap = () => {
        const blob = new Blob([sitemapXml], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        a.click();
    };

    const downloadRss = () => {
        const blob = new Blob([rssXml], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rss.xml';
        a.click();
    };

  const insertImageToContent = () => {
    if (!articleWidgetImg) return;
      
      const finalAlt = articleWidgetAlt || articleWidgetCaption || "Изображение в статье";
      
      let htmlBlock = "";

      if (articleWidgetType === 'card') {
          htmlBlock = `
<div class="my-10 p-5 bg-dark-800 border border-white/10 rounded-xl flex flex-col md:flex-row gap-6 items-center shadow-lg group hover:border-cyan-400/30 transition-all not-prose">
  <div class="w-full md:w-1/3 aspect-[4/3] bg-black/20 rounded-lg overflow-hidden shrink-0">
    <img src="${articleWidgetImg}" alt="${finalAlt}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
  </div>
  <div class="flex-1 text-center md:text-left">
    <div class="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-2">Рекомендация</div>
    <h4 class="text-xl font-display font-bold text-white mb-2 leading-tight">${articleWidgetCaption || 'Название товара'}</h4>
    <p class="text-sm text-gray-400 mb-6 font-light">
       Отличный выбор, который дополняет стиль. Нажмите ниже, чтобы узнать детали.
    </p>
    ${articleWidgetLink ? `
    <a href="${articleWidgetLink}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:brightness-110 transition-all shadow-lg hover:shadow-cyan-400/20">
      Купить / Смотреть <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    </a>` : ''}
  </div>
</div>
<p></p>`;

      } else {
          htmlBlock = `
<figure class="my-8 relative group">`;
          
          if (articleWidgetLink) {
              htmlBlock += `
  <a href="${articleWidgetLink}" target="_blank" rel="noopener noreferrer" class="block relative cursor-pointer">
      <img src="${articleWidgetImg}" alt="${finalAlt}" class="w-full h-auto rounded-xl border border-white/10 transition-transform duration-300 group-hover:brightness-110" />
      <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-white/20 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </div>
  </a>`;
          } else {
              htmlBlock += `
  <img src="${articleWidgetImg}" alt="${finalAlt}" class="w-full h-auto rounded-xl border border-white/10" />`;
          }

          if (articleWidgetCaption || articleWidgetLink) {
              htmlBlock += `
  <figcaption class="text-center text-xs text-gray-500 mt-3 italic">
      ${articleWidgetCaption}`;
              
              if (articleWidgetLink) {
                 htmlBlock += ` <a href="${articleWidgetLink}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-cyan-400 ml-2 not-italic hover:underline font-bold">Смотреть <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>`;
              }
              htmlBlock += `
  </figcaption>`;
          }
          htmlBlock += `
</figure>
<p></p>`;
      }
      
      setArticleForm(prev => ({
          ...prev,
          content: prev.content + "\n" + htmlBlock
      }));
      
      setArticleWidgetImg('');
      setArticleWidgetCaption('');
      setArticleWidgetAlt('');
      setArticleWidgetLink('');
      setArticleWidgetType('image');
      
      alert(articleWidgetType === 'card' ? "Рекомендация добавлена!" : "Фото добавлено!");
  }

  // Updated Generic Upload to include 'popup_secondary_img'
  const handleGenericUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void, taskIndex?: CompressionTaskIndex) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const fileSizeMB = file.size / (1024 * 1024);
      const reader = new FileReader();
      reader.onloadend = () => {
          const result = reader.result as string;
          if (fileSizeMB > 1 && taskIndex !== undefined) {
             setCompressionTask({ index: taskIndex, originalSize: fileSizeMB, dataUrl: result });
          } else {
             setter(result);
          }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
  };
  
  // Updated Execution of Compression
  const executeCompression = async () => {
      if (!compressionTask) return;
      setIsCompressing(true);
      try {
          const targetSize = (compressionTask.index === 'popup_img' || compressionTask.index === 'popup_secondary_img') ? 0.3 : 0.8;
          const compressedBase64 = await compressImage(compressionTask.dataUrl, targetSize);
          
          if (compressionTask.index === 'moscow_logo') setLocalMoscowLogo(compressedBase64);
          else if (compressionTask.index === 'brand_logo') setLocalBrandLogo(compressedBase64);
          else if (compressionTask.index === 'article_main') setArticleForm(prev => ({...prev, imageUrl: compressedBase64}));
          else if (compressionTask.index === 'curator_img') setLocalCurator(prev => ({...prev, imageUrl: compressedBase64}));
          else if (compressionTask.index === 'promo_img') setLocalMagPromo(prev => ({...prev, imageUrl: compressedBase64}));
          else if (compressionTask.index === 'article_widget') setArticleWidgetImg(compressedBase64);
          else if (compressionTask.index === 'popup_img') setLocalPopup(prev => ({...prev, imageUrl: compressedBase64}));
          else if (compressionTask.index === 'popup_secondary_img') setLocalPopup(prev => ({...prev, secondaryImageUrl: compressedBase64}));
          else if (typeof compressionTask.index === 'number') updateUniquenessImage(compressionTask.index, compressedBase64);
          
          setCompressionTask(null);
      } catch (e) { alert("Не удалось сжать изображение."); } finally { setIsCompressing(false); }
  };
  
  // Handlers for Products/Articles submit etc (reuse existing)
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    const hasSEO = newProductSEO.title || newProductSEO.description || newProductSEO.keywords;
    const finalImages = uploadedImages.length > 0 ? uploadedImages : [`https://source.unsplash.com/random/800x800/?jewelry,dark`];
    
    try {
        if (editId) {
            // UPDATE EXISTING PRODUCT
            await updateProduct({
                id: editId,
                name: formData.name,
                slug: formData.slug || slugify(formData.name),
                price: Number(formData.price),
                category: formData.category || 'Аксессуары',
                material: formData.material || 'Сталь',
                imageUrl: finalImages[0], 
                imageAlt: formData.imageAlt,
                images: finalImages,
                description: formData.description || 'Описание отсутствует.',
                marketUrl: formData.marketUrl || 'https://market.yandex.ru',
                seo: hasSEO ? newProductSEO : undefined,
                seoText: formData.seoText
            });
            alert("Товар обновлен!");
            setEditId(null);
        } else {
            // ADD NEW PRODUCT
            await addProduct({
              id: Date.now().toString(),
              name: formData.name,
              slug: formData.slug || slugify(formData.name),
              price: Number(formData.price),
              category: formData.category || 'Аксессуары',
              material: formData.material || 'Сталь',
              imageUrl: finalImages[0], 
              imageAlt: formData.imageAlt,
              images: finalImages,
              description: formData.description || 'Описание отсутствует.',
              marketUrl: formData.marketUrl || 'https://market.yandex.ru',
              seo: hasSEO ? newProductSEO : undefined,
              seoText: formData.seoText
            });
            alert("Товар добавлен!");
        }
        
        // Only clear form if successful
        setFormData({ name: '', slug: '', price: '', category: '', material: '', marketUrl: '', description: '', imageAlt: '', seoText: '' });
        setUploadedImages([]);
        setNewProductSEO({ title: '', description: '', keywords: '' });
        
    } catch (e) {
        // Error is alerted in addProduct, but we prevent form clear here
        console.error("Submit failed (prevented form clear)", e);
    }
  };

  const handleSubmitArticle = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!articleForm.title) { alert("Ошибка: Укажите Заголовок статьи."); return; }
      if (!articleForm.excerpt) { alert("Ошибка: Укажите Краткое описание (Excerpt)."); return; }

      setIsSubmittingArticle(true);

      try {
        const tagsArray = articleForm.tags.split(',').map(t => t.trim()).filter(Boolean);
        const hasSEO = articleSeo.title || articleSeo.description || articleSeo.keywords;

        const commonData = {
            title: articleForm.title,
            slug: articleForm.slug || slugify(articleForm.title),
            excerpt: articleForm.excerpt,
            content: articleForm.content || `<p>${articleForm.excerpt}</p>`,
            category: articleForm.category,
            imageUrl: articleForm.imageUrl || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
            imageAlt: articleForm.imageAlt,
            date: articleForm.date,
            readTime: articleForm.readTime,
            author: articleForm.author,
            tags: tagsArray,
            isFeatured: articleForm.isFeatured,
            seo: hasSEO ? articleSeo : undefined,
            relatedProductIds: articleForm.relatedProductIds,
            relatedArticleIds: articleForm.relatedArticleIds
        };

        if (editingArticleId) {
            await updateArticle({
                id: editingArticleId,
                ...commonData
            });
            alert("Статья успешно обновлена!");
        } else {
            await addArticle({
                id: Date.now().toString(),
                ...commonData
            });
            alert("Статья успешно опубликована!");
        }

        cancelEditArticle();
      } catch (err: any) {
          console.error("Article submit error:", typeof err === 'object' ? JSON.stringify(err, null, 2) : err);
          const msg = extractErrorMessage(err);
          alert(`Ошибка публикации: ${msg}`);
      } finally {
          setIsSubmittingArticle(false);
      }
  };
  
    const openEditSEO = (product: Product) => {
      setEditingProduct(product);
      setEditSEOData({
          title: product.seo?.title || '',
          description: product.seo?.description || '',
          keywords: product.seo?.keywords || ''
      });
      setEditFAQ(product.faq || []);
      setEditRelatedIds(product.relatedIds || []);
  };

  const saveEditSEO = async () => {
      if (!editingProduct) return;
      await updateProductAdvanced(editingProduct.id, {
          seo: editSEOData,
          faq: editFAQ,
          relatedIds: editRelatedIds
      });
      setEditingProduct(null);
      alert("SEO и Связи обновлены!");
  };

  const toggleRelatedProduct = (id: string) => {
      if (editRelatedIds.includes(id)) {
          setEditRelatedIds(prev => prev.filter(pid => pid !== id));
      } else {
          setEditRelatedIds(prev => [...prev, id]);
      }
  };

  const addFaqItem = () => setEditFAQ(prev => [...prev, { question: '', answer: '' }]);
  const updateFaqItem = (idx: number, field: keyof FAQItem, value: string) => {
      const newFaq = [...editFAQ];
      newFaq[idx][field] = value;
      setEditFAQ(newFaq);
  };
  const removeFaqItem = (idx: number) => setEditFAQ(prev => prev.filter((_, i) => i !== idx));
  
  const compressImage = async (base64Str: string, targetSizeMB: number = 0.5): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_WIDTH = 1000; 
            if (width > MAX_WIDTH) { height = Math.round((height * MAX_WIDTH) / width); width = MAX_WIDTH; }
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            let quality = 0.8;
            let dataUrl = canvas.toDataURL('image/jpeg', quality);
            while (dataUrl.length > (targetSizeMB * 1024 * 1024 * 1.37) && quality > 0.3) {
                quality -= 0.1;
                dataUrl = canvas.toDataURL('image/jpeg', quality);
            }
            resolve(dataUrl);
        }
        img.onerror = () => resolve(base64Str);
    });
  };

  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsCompressing(true);
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64: string = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
        });
        try { newImages.push(await compressImage(base64, 0.5)); } catch { newImages.push(base64); }
    }
    setUploadedImages(prev => [...prev, ...newImages]);
    setIsCompressing(false);
    if(multipleImageInputRef.current) multipleImageInputRef.current.value = '';
  };
  
    const copySqlToClipboard = () => {
        const sql = `
-- 1. Enable needed extensions
create extension if not exists "uuid-ossp";

-- 2. Create products table if missing, or update columns
create table if not exists products (
  id text primary key,
  name text,
  slug text,
  price numeric,
  description text,
  category text,
  material text,
  image_url text,
  image_alt text,
  images text[],
  market_url text,
  seo jsonb,
  seo_text text,
  faq jsonb,
  related_ids text[]
);
alter table products add column if not exists slug text;
alter table products add column if not exists image_alt text;
alter table products add column if not exists images text[];
alter table products add column if not exists seo_text text;
alter table products add column if not exists faq jsonb;
alter table products add column if not exists related_ids text[];

-- Ensure uniqueness of slugs
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'products_slug_key') then
    alter table products add constraint products_slug_key unique (slug);
  end if;
end $$;

-- 3. Create articles table
create table if not exists articles (
  id text primary key,
  title text,
  slug text,
  excerpt text,
  content text,
  category text,
  image_url text,
  image_alt text,
  date text,
  read_time text,
  author text,
  tags text[],
  is_featured boolean,
  seo jsonb,
  related_product_ids text[],
  related_article_ids text[]
);
alter table articles add column if not exists slug text;
alter table articles add column if not exists image_alt text;
alter table articles add column if not exists related_product_ids text[];
alter table articles add column if not exists related_article_ids text[];

-- Ensure uniqueness of slugs
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'articles_slug_key') then
    alter table articles add constraint articles_slug_key unique (slug);
  end if;
end $$;

-- 4. Create app_settings table
create table if not exists app_settings (
  key text primary key,
  value text
);

-- 5. Enable RLS (Row Level Security)
alter table products enable row level security;
alter table articles enable row level security;
alter table app_settings enable row level security;

-- 6. Policies (Public Read, Anon Update for Demo)
-- Drop existing policies to avoid conflict
drop policy if exists "Public read products" on products;
drop policy if exists "Enable insert for everyone" on products;
drop policy if exists "Enable update for everyone" on products;
drop policy if exists "Enable delete for everyone" on products;

create policy "public_read_products" on products for select using (true);
create policy "public_insert_products" on products for insert with check (true);
create policy "public_update_products" on products for update using (true);
create policy "public_delete_products" on products for delete using (true);

drop policy if exists "Public read articles" on articles;
create policy "public_read_articles" on articles for select using (true);
create policy "public_insert_articles" on articles for insert with check (true);
create policy "public_update_articles" on articles for update using (true);
create policy "public_delete_articles" on articles for delete using (true);

drop policy if exists "Public read settings" on app_settings;
create policy "public_read_settings" on app_settings for select using (true);
create policy "public_insert_settings" on app_settings for insert with check (true);
create policy "public_update_settings" on app_settings for update using (true);
`;
        navigator.clipboard.writeText(sql);
        alert("SQL скопирован! Выполните его в Supabase -> SQL Editor.");
    };

    const updateUniquenessLink = (link: string) => { setLocalUniquenessLink(link); storeUpdateUniquenessLink(link); };
    
  return (
    <div className="min-h-screen py-12 text-white relative">
        {/* COMPRESSION MODAL */}
        {compressionTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-dark-900 border border-white/20 p-8 rounded-2xl max-w-sm w-full text-center">
                    <FileWarning className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Файл слишком большой ({compressionTask.originalSize.toFixed(1)} MB)</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        Для быстрой работы сайта изображения должны быть легкими. Мы автоматически сожмем и оптимизируем его.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => setCompressionTask(null)}
                            className="px-6 py-3 border border-gray-600 rounded-full text-sm font-bold hover:bg-white/10"
                        >
                            Отмена
                        </button>
                        <button 
                            onClick={executeCompression}
                            disabled={isCompressing}
                            className="px-6 py-3 bg-cyan-400 text-black rounded-full text-sm font-bold hover:bg-white transition-colors flex items-center gap-2"
                        >
                            {isCompressing ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                            Оптимизировать
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* POPUP PREVIEW */}
        {isPreviewPopupOpen && (
            <WinterPopup 
                forceVisible={true} 
                overrideSettings={localPopup}
                onCloseOverride={() => setIsPreviewPopupOpen(false)}
            />
        )}

        {/* SQL MODAL */}
        {showSqlModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                <div className="bg-dark-800 p-8 rounded-xl max-w-2xl w-full border border-white/10 relative">
                    <button onClick={() => setShowSqlModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><Database className="text-cyan-400"/> Настройка Базы Данных</h3>
                    <p className="text-gray-400 mb-6">Скопируйте этот SQL код и выполните его в Supabase (раздел SQL Editor), чтобы создать таблицы.</p>
                    <button onClick={copySqlToClipboard} className="w-full py-3 bg-cyan-400 text-black font-bold uppercase rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2">
                        <Copy size={18}/> Скопировать SQL код
                    </button>
                </div>
            </div>
        )}

        {/* ADVANCED SEO MODAL */}
        {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
                <div className="bg-dark-900 border border-white/10 w-full max-w-4xl rounded-2xl p-8 relative my-8">
                     <button onClick={() => setEditingProduct(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
                     <h3 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                         <Search className="text-cyan-400" /> SEO и Связи: {editingProduct.name}
                     </h3>
                     
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         {/* LEFT: SEO & FAQ */}
                         <div className="space-y-6">
                             <div className="bg-dark-800 p-4 rounded-xl border border-white/5">
                                 <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-4">Meta Tags</h4>
                                 <div className="space-y-3">
                                     <input className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-sm text-white" placeholder="Title Tag" value={editSEOData.title} onChange={e => setEditSEOData({...editSEOData, title: e.target.value})} />
                                     <input className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-sm text-white" placeholder="Meta Description" value={editSEOData.description} onChange={e => setEditSEOData({...editSEOData, description: e.target.value})} />
                                     <input className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-sm text-white" placeholder="Keywords (comma separated)" value={editSEOData.keywords} onChange={e => setEditSEOData({...editSEOData, keywords: e.target.value})} />
                                 </div>
                             </div>

                             <div className="bg-dark-800 p-4 rounded-xl border border-white/5">
                                 <div className="flex justify-between items-center mb-4">
                                     <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest">FAQ (Schema)</h4>
                                     <button onClick={addFaqItem} className="text-xs bg-cyan-900/50 text-cyan-400 px-2 py-1 rounded hover:bg-cyan-400 hover:text-black transition-colors">+ Вопрос</button>
                                 </div>
                                 <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700">
                                     {editFAQ.map((item, idx) => (
                                         <div key={idx} className="flex gap-2 items-start">
                                             <div className="flex-1 space-y-2">
                                                 <input className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" placeholder="Вопрос" value={item.question} onChange={e => updateFaqItem(idx, 'question', e.target.value)} />
                                                 <textarea className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white resize-none" rows={2} placeholder="Ответ" value={item.answer} onChange={e => updateFaqItem(idx, 'answer', e.target.value)} />
                                             </div>
                                             <button onClick={() => removeFaqItem(idx)} className="text-red-500 hover:text-red-400 p-1"><Trash2 size={14} /></button>
                                         </div>
                                     ))}
                                     {editFAQ.length === 0 && <p className="text-xs text-gray-500 italic">Нет вопросов</p>}
                                 </div>
                             </div>
                         </div>

                         {/* RIGHT: Related Products */}
                         <div className="bg-dark-800 p-4 rounded-xl border border-white/5 h-full flex flex-col">
                             <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-4">Похожие товары (Cross-sell)</h4>
                             <p className="text-xs text-gray-500 mb-4">Выберите товары, которые будут показаны в блоке "Вам может понравиться".</p>
                             
                             <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 space-y-2 max-h-[400px]">
                                 {products.filter(p => p.id !== editingProduct.id).map(p => {
                                     const isSelected = editRelatedIds.includes(p.id);
                                     return (
                                         <div 
                                            key={p.id} 
                                            onClick={() => toggleRelatedProduct(p.id)}
                                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition-all ${isSelected ? 'bg-cyan-900/20 border-cyan-400/50' : 'bg-dark-900 border-transparent hover:bg-white/5'}`}
                                         >
                                             <img src={p.imageUrl} className="w-10 h-10 rounded object-cover" alt="" />
                                             <div className="flex-1">
                                                 <div className={`text-sm font-bold ${isSelected ? 'text-cyan-400' : 'text-white'}`}>{p.name}</div>
                                                 <div className="text-[10px] text-gray-500">{p.category}</div>
                                             </div>
                                             {isSelected && <CheckCircle size={16} className="text-cyan-400" />}
                                         </div>
                                     );
                                 })}
                             </div>
                         </div>
                     </div>
                     
                     <div className="mt-8 flex justify-end gap-4">
                         <button onClick={() => setEditingProduct(null)} className="px-6 py-3 text-gray-400 hover:text-white transition-colors">Отмена</button>
                         <button onClick={saveEditSEO} className="px-8 py-3 bg-cyan-400 text-black font-bold uppercase rounded-lg hover:bg-white transition-colors">Сохранить изменения</button>
                     </div>
                </div>
            </div>
        )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
           {/* ... Header ... */}
           <div className="flex items-center gap-4 mb-4 md:mb-0">
             <Link to="/" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                 <ArrowLeft size={20} />
             </Link>
             <div>
                <h1 className="text-4xl font-display font-black uppercase tracking-tight">Панель Управления</h1>
             </div>
          </div>
          <div className="flex gap-4">
             {/* Tabs */}
             <div className="bg-dark-800 rounded-lg p-1 flex border border-white/10">
                {(['products', 'journal', 'settings', 'tools'] as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-all ${
                            activeTab === tab 
                            ? 'bg-white text-black shadow-lg' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {tab === 'products' ? 'Товары' : tab === 'journal' ? 'Журнал' : tab === 'settings' ? 'Настройки' : 'Инструменты'}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
           <div ref={productFormRef}>
               {/* Add/Edit Product Form */}
               <div className="bg-dark-800 p-8 rounded-3xl border border-white/10 mb-12 shadow-2xl shadow-black/50">
                   <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                            {editId ? <PenTool className="text-cyan-400" /> : <Plus className="text-cyan-400" />} 
                            {editId ? 'Редактировать товар' : 'Добавить новый товар'}
                        </h2>
                        {editId && (
                            <button onClick={handleCancelEdit} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1">
                                <X size={16} /> Отмена редактирования
                            </button>
                        )}
                   </div>
                   
                   <form onSubmit={handleSubmitProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                           <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Название</label>
                               <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 outline-none transition-colors" placeholder="Кольцо Cyberpunk 2077" required />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                               <div>
                                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Цена (₽)</label>
                                   <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 outline-none transition-colors" placeholder="4500" required />
                               </div>
                               <div>
                                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Категория</label>
                                   <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 outline-none transition-colors">
                                       <option value="">Выберите...</option>
                                       <option value="Кольца">Кольца</option>
                                       <option value="Браслеты">Браслеты</option>
                                       <option value="Подвески">Подвески</option>
                                       <option value="Аксессуары">Аксессуары</option>
                                   </select>
                               </div>
                           </div>
                           <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Материал</label>
                               <input type="text" name="material" value={formData.material} onChange={handleInputChange} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 outline-none transition-colors" placeholder="Титан / Сталь 316L" />
                           </div>
                           <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ссылка на Маркет</label>
                               <input type="url" name="marketUrl" value={formData.marketUrl} onChange={handleInputChange} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 outline-none transition-colors" placeholder="https://market.yandex.ru/..." />
                           </div>
                       </div>
                       
                       <div className="space-y-6">
                           <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex justify-between">
                                   Описание
                                   <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="text-cyan-400 hover:text-white flex items-center gap-1 text-[10px] transition-colors">
                                       {isGenerating ? <Loader2 className="animate-spin" size={12} /> : <Wand2 size={12} />} Сгенерировать AI
                                   </button>
                               </label>
                               <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 outline-none transition-colors resize-none" placeholder="Краткое описание товара..." />
                           </div>

                           <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Фотографии (Мультизагрузка)</label>
                               <div className="relative border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors group">
                                   <input 
                                       type="file" 
                                       multiple 
                                       accept="image/*"
                                       ref={multipleImageInputRef}
                                       onChange={handleMultipleImagesUpload}
                                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                   />
                                   <div className="flex flex-col items-center pointer-events-none">
                                       <Upload className="text-gray-500 group-hover:text-cyan-400 mb-2 transition-colors" size={24} />
                                       <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Перетащите файлы или кликните</span>
                                   </div>
                               </div>
                               {/* Preview Uploaded Images */}
                               {uploadedImages.length > 0 && (
                                   <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                       {uploadedImages.map((img, idx) => (
                                           <div key={idx} className="relative w-16 h-16 shrink-0 rounded overflow-hidden border border-white/10 group">
                                               <img src={img} alt="" className="w-full h-full object-cover" />
                                               <button 
                                                   type="button" 
                                                   onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                                                   className="absolute top-0 right-0 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                               >
                                                   <X size={12} />
                                               </button>
                                           </div>
                                       ))}
                                   </div>
                               )}
                           </div>
                           
                           <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex justify-between">
                                   Alt Текст (SEO)
                                   <button type="button" onClick={handleGenerateProductAlt} disabled={isGeneratingAlt} className="text-cyan-400 hover:text-white flex items-center gap-1 text-[10px] transition-colors">
                                       {isGeneratingAlt ? <Loader2 className="animate-spin" size={12} /> : <Wand2 size={12} />} AI
                                   </button>
                               </label>
                               <input type="text" name="imageAlt" value={formData.imageAlt} onChange={handleInputChange} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 outline-none transition-colors" placeholder="Кольцо из титана..." />
                           </div>

                            <div className="pt-2">
                                <button type="button" onClick={() => setShowSeoInputs(!showSeoInputs)} className="text-xs text-gray-400 hover:text-white underline mb-4 flex items-center gap-1">
                                    {showSeoInputs ? 'Скрыть SEO настройки' : 'Показать SEO настройки'}
                                </button>
                                {showSeoInputs && (
                                    <div className="space-y-4 p-4 bg-black/20 rounded-lg border border-white/5">
                                        <input type="text" placeholder="SEO Title" value={newProductSEO.title} onChange={(e) => setNewProductSEO({...newProductSEO, title: e.target.value})} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" />
                                        <input type="text" placeholder="SEO Description" value={newProductSEO.description} onChange={(e) => setNewProductSEO({...newProductSEO, description: e.target.value})} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" />
                                        <input type="text" placeholder="SEO Keywords" value={newProductSEO.keywords} onChange={(e) => setNewProductSEO({...newProductSEO, keywords: e.target.value})} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" />
                                        
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex justify-between">
                                                Длинное SEO описание (HTML)
                                                <button type="button" onClick={handleGenerateRichDescription} disabled={isGeneratingRich} className="text-purple-400 hover:text-white flex items-center gap-1 text-[10px] transition-colors">
                                                   {isGeneratingRich ? <Loader2 className="animate-spin" size={12}/> : <Sparkles size={12}/>} ✨ Сгенерировать Красивое Описание (AI)
                                                </button>
                                            </label>
                                            <textarea name="seoText" value={formData.seoText} onChange={handleInputChange} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white h-48 font-mono" placeholder="<p>История создания...</p>" />
                                        </div>
                                    </div>
                                )}
                            </div>

                           <button type="submit" className={`w-full py-4 text-black font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${editId ? 'bg-cyan-400 hover:bg-cyan-300' : 'bg-white hover:bg-cyan-400'}`}>
                               {editId ? <Save size={18} /> : <Plus size={18} />} 
                               {editId ? 'Сохранить изменения' : 'Добавить товар'}
                           </button>
                       </div>
                   </form>
               </div>

               {/* Product List */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   {products.map((product) => (
                       <ProductCard 
                          key={product.id} 
                          product={product} 
                          isAdminView={true} 
                          onEditSEO={openEditSEO}
                          onEdit={handleEditProduct}
                       />
                   ))}
               </div>
           </div>
        )}

        {/* --- JOURNAL TAB --- */}
        {activeTab === 'journal' && (
           <div>
               {/* 1. Article Editor */}
               <div className="bg-dark-800 p-8 rounded-3xl border border-white/10 mb-12 shadow-2xl">
                   <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                            <BookOpen className="text-purple-500" />
                            {editingArticleId ? 'Редактировать статью' : 'Написать статью'}
                        </h2>
                        {editingArticleId && (
                            <button onClick={cancelEditArticle} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"><X size={14}/> Отмена</button>
                        )}
                   </div>
                   
                   <form onSubmit={handleSubmitArticle} className="space-y-6">
                       {/* Main Fields */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-4">
                               <input name="title" value={articleForm.title} onChange={handleArticleChange} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="Заголовок статьи" required />
                               <textarea name="excerpt" value={articleForm.excerpt} onChange={handleArticleChange} rows={3} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none resize-none" placeholder="Краткий анонс (Excerpt)..." required />
                               <div className="grid grid-cols-2 gap-4">
                                    <input name="category" value={articleForm.category} onChange={handleArticleChange} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="Категория (Tech, Style...)" />
                                    <input name="readTime" value={articleForm.readTime} onChange={handleArticleChange} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="Время чтения (5 мин)" />
                               </div>
                           </div>
                           
                           <div className="space-y-4">
                               {/* Image Upload */}
                               <div className="relative border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-purple-500 transition-colors group h-[140px] flex flex-col justify-center items-center">
                                   <input type="file" accept="image/*" onChange={(e) => handleGenericUpload(e, (url) => setArticleForm(prev => ({...prev, imageUrl: url})), 'article_main')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                   {articleForm.imageUrl ? (
                                       <img src={articleForm.imageUrl} className="h-full object-contain" alt="Preview" />
                                   ) : (
                                       <>
                                        <ImageIcon className="text-gray-500 mb-2" />
                                        <span className="text-xs text-gray-400">Обложка статьи</span>
                                       </>
                                   )}
                               </div>
                               
                               <div className="flex gap-2">
                                   <input name="imageAlt" value={articleForm.imageAlt} onChange={handleArticleChange} className="flex-1 bg-dark-900 border border-gray-700 rounded-lg p-3 text-white text-xs" placeholder="Alt текст для картинки" />
                                   <button type="button" onClick={handleGenerateArticleAlt} disabled={isGeneratingAlt} className="bg-white/10 hover:bg-white/20 p-3 rounded-lg text-purple-400 transition-colors" title="Сгенерировать Alt"><Wand2 size={16}/></button>
                               </div>
                               
                               <label className="flex items-center gap-3 cursor-pointer bg-dark-900 p-3 rounded-lg border border-gray-700">
                                   <input type="checkbox" checked={articleForm.isFeatured} onChange={handleArticleCheckbox} className="w-5 h-5 text-purple-500 rounded bg-gray-700 border-gray-600 focus:ring-purple-500" />
                                   <span className="text-sm font-bold uppercase tracking-wide">Featured (Hero статья)</span>
                               </label>
                           </div>
                       </div>
                       
                       {/* Content Editor & Widgets */}
                       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                           <div className="lg:col-span-2">
                               <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">HTML Контент</label>
                               <textarea name="content" value={articleForm.content} onChange={handleArticleChange} className="w-full h-96 bg-dark-900 border border-gray-700 rounded-lg p-4 text-white font-mono text-sm focus:border-purple-500 outline-none" placeholder="<p>Текст статьи...</p>" />
                           </div>
                           
                           {/* Widget Builder */}
                           <div className="bg-dark-900 p-4 rounded-xl border border-white/5 h-fit">
                               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Layout size={14}/> Вставка виджетов</h4>
                               <div className="space-y-3">
                                   <div className="flex gap-2">
                                       <button type="button" onClick={() => setArticleWidgetType('image')} className={`flex-1 py-2 text-xs font-bold rounded ${articleWidgetType === 'image' ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400'}`}>Фото</button>
                                       <button type="button" onClick={() => setArticleWidgetType('card')} className={`flex-1 py-2 text-xs font-bold rounded ${articleWidgetType === 'card' ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400'}`}>Карточка</button>
                                   </div>
                                   
                                   <div className="border border-dashed border-gray-700 rounded p-4 text-center cursor-pointer hover:border-purple-500 relative">
                                        <input type="file" accept="image/*" onChange={(e) => handleGenericUpload(e, setArticleWidgetImg, 'article_widget')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        {articleWidgetImg ? <img src={articleWidgetImg} className="h-20 mx-auto object-contain" alt="Widget" /> : <span className="text-xs text-gray-500">Загрузить фото</span>}
                                   </div>
                                   
                                   <input value={articleWidgetCaption} onChange={e => setArticleWidgetCaption(e.target.value)} className="w-full bg-dark-800 border border-gray-700 rounded p-2 text-xs text-white" placeholder={articleWidgetType === 'card' ? "Название товара" : "Подпись к фото"} />
                                   <input value={articleWidgetLink} onChange={e => setArticleWidgetLink(e.target.value)} className="w-full bg-dark-800 border border-gray-700 rounded p-2 text-xs text-white" placeholder="Ссылка (https://...)" />
                                   
                                   <button type="button" onClick={insertImageToContent} className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded transition-colors">+ Вставить в текст</button>
                               </div>
                           </div>
                       </div>
                       
                       {/* Advanced Article SEO & Relations */}
                       <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                           <button type="button" onClick={() => setShowArticleSeo(!showArticleSeo)} className="text-xs text-purple-400 hover:text-white mb-4 flex items-center gap-1 font-bold uppercase tracking-widest">
                               <Settings size={14}/> SEO и Перелинковка
                           </button>
                           
                           {showArticleSeo && (
                               <div className="space-y-4 animate-fade-in">
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                       <input value={articleSeo.title} onChange={e => setArticleSeo({...articleSeo, title: e.target.value})} className="bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" placeholder="SEO Title" />
                                       <input value={articleSeo.description} onChange={e => setArticleSeo({...articleSeo, description: e.target.value})} className="bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" placeholder="SEO Description" />
                                       <input value={articleForm.tags} onChange={e => setArticleForm({...articleForm, tags: e.target.value})} className="bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" placeholder="Теги (через запятую)" />
                                   </div>
                                   
                                   <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                                       <button type="button" onClick={handleGenerateCrossLinks} disabled={isGeneratingLinks} className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white rounded text-xs font-bold transition-colors">
                                           {isGeneratingLinks ? <Loader2 className="animate-spin" size={14}/> : <Network size={14}/>} AI Auto-Link
                                       </button>
                                       <span className="text-xs text-gray-500">Автоматически подберет товары и статьи по смыслу.</span>
                                   </div>
                               </div>
                           )}
                       </div>

                       <button type="submit" disabled={isSubmittingArticle} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-purple-400 transition-colors flex items-center justify-center gap-2">
                           {isSubmittingArticle ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                           {editingArticleId ? 'Сохранить изменения' : 'Опубликовать статью'}
                       </button>
                   </form>
               </div>
               
               {/* 2. Article List */}
               <div className="bg-dark-800 p-8 rounded-3xl border border-white/10 mb-12">
                   <h3 className="text-xl font-bold font-display uppercase mb-6 text-white">Все статьи ({articles.length})</h3>
                   <div className="space-y-4">
                       {articles.map(article => (
                           <div key={article.id} className="flex items-center justify-between bg-dark-900 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                               <div className="flex items-center gap-4">
                                   <img src={article.imageUrl} alt="" className="w-12 h-12 rounded object-cover" />
                                   <div>
                                       <div className="text-white font-bold text-sm">{article.title}</div>
                                       <div className="text-xs text-gray-500">{article.category} · {article.date}</div>
                                   </div>
                               </div>
                               <div className="flex items-center gap-2">
                                   {article.isFeatured && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
                                   <button onClick={() => handleEditArticle(article)} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white"><PenTool size={16}/></button>
                                   <button onClick={() => handleDeleteArticle(article.id)} className="p-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 text-red-500"><Trash2 size={16}/></button>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
               
               {/* 3. Settings: Curator & Promo */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Curator Settings */}
                   <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
                       <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><User size={18} className="text-purple-500"/> Профиль Куратора</h3>
                       <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-black/50 relative group">
                                    <input type="file" onChange={(e) => handleGenericUpload(e, (url) => setLocalCurator(prev => ({...prev, imageUrl: url})), 'curator_img')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    <img src={localCurator.imageUrl} className="w-full h-full object-cover" alt="Curator" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <input value={localCurator.name} onChange={e => setLocalCurator({...localCurator, name: e.target.value})} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" placeholder="Имя" />
                                    <input value={localCurator.role} onChange={e => setLocalCurator({...localCurator, role: e.target.value})} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" placeholder="Роль" />
                                </div>
                            </div>
                            <textarea value={localCurator.quote} onChange={e => setLocalCurator({...localCurator, quote: e.target.value})} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white italic" rows={2} placeholder="Цитата" />
                            <button onClick={() => updateCuratorProfile(localCurator)} className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded uppercase">Сохранить профиль</button>
                       </div>
                   </div>

                   {/* Promo Settings */}
                   <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
                       <div className="flex justify-between items-center mb-4">
                           <h3 className="text-lg font-bold text-white flex items-center gap-2"><Megaphone size={18} className="text-cyan-400"/> Промо-блок</h3>
                           <input type="checkbox" checked={localMagPromo.isVisible} onChange={e => setLocalMagPromo({...localMagPromo, isVisible: e.target.checked})} className="toggle" />
                       </div>
                       <div className="space-y-4">
                           <input value={localMagPromo.title} onChange={e => setLocalMagPromo({...localMagPromo, title: e.target.value})} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" placeholder="Заголовок" />
                           <input value={localMagPromo.text} onChange={e => setLocalMagPromo({...localMagPromo, text: e.target.value})} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" placeholder="Текст" />
                           <div className="relative h-20 bg-dark-900 rounded border border-dashed border-gray-700 flex items-center justify-center cursor-pointer hover:border-cyan-400 group">
                               <input type="file" onChange={(e) => handleGenericUpload(e, (url) => setLocalMagPromo({...localMagPromo, imageUrl: url}), 'promo_img')} className="absolute inset-0 opacity-0 cursor-pointer" />
                               {localMagPromo.imageUrl ? <img src={localMagPromo.imageUrl} className="h-full object-contain" alt="Promo" /> : <span className="text-xs text-gray-500">Загрузить картинку</span>}
                           </div>
                           <button onClick={() => updateMagPromo(localMagPromo)} className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded uppercase">Сохранить промо</button>
                       </div>
                   </div>
               </div>
           </div>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === 'settings' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* 1. Hero Block */}
               <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xl font-bold font-display uppercase mb-6 text-white flex items-center gap-2">
                       <Home size={20} className="text-cyan-400" /> Главная (Hero)
                   </h3>
                   <div className="space-y-4">
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Основное изображение</label>
                       <div className="flex items-center gap-4">
                           <img src={localHeroImage} alt="Hero" className="w-20 h-20 object-cover rounded-lg border border-white/10" />
                           <div className="flex-1">
                               <input type="file" accept="image/*" onChange={(e) => handleGenericUpload(e, setLocalHeroImage)} className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 mb-2" />
                               <input type="text" value={localHeroImage} onChange={(e) => setLocalHeroImage(e.target.value)} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" placeholder="URL изображения" />
                           </div>
                       </div>
                       
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mt-4">Кнопки</label>
                       <input value={localHeroPrimaryLink} onChange={(e) => setLocalHeroPrimaryLink(e.target.value)} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" placeholder="Ссылка кнопки 1 (Маркет)" />
                       <input value={localHeroSecondaryLink} onChange={(e) => setLocalHeroSecondaryLink(e.target.value)} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" placeholder="Ссылка кнопки 2 (Каталог)" />
                       
                       <button onClick={() => { updateHeroImage(localHeroImage); updateHeroPrimaryLink(localHeroPrimaryLink); updateHeroSecondaryLink(localHeroSecondaryLink); }} className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest rounded-lg hover:bg-cyan-400 transition-colors mt-4">
                           Сохранить Hero
                       </button>
                   </div>
               </div>
               
               {/* 2. Uniqueness Block */}
               <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xl font-bold font-display uppercase mb-6 text-white flex items-center gap-2">
                       <Fingerprint size={20} className="text-purple-500" /> Уникальность
                   </h3>
                   <div className="grid grid-cols-2 gap-4 mb-4">
                       {uniquenessImages.map((img, idx) => (
                           <div key={idx} className="relative group">
                               <img src={img.url} alt={img.label} className="w-full h-24 object-cover rounded-lg border border-white/10" />
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-2">
                                   <input type="file" accept="image/*" onChange={(e) => handleGenericUpload(e, (url) => updateUniquenessImage(idx, url), idx)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                   <Upload size={16} className="text-white mb-1" />
                                   <span className="text-[10px] text-white">Загрузить</span>
                               </div>
                               <div className="absolute bottom-1 left-1 bg-black/50 px-2 rounded text-[10px] text-white">{img.label}</div>
                           </div>
                       ))}
                   </div>
                   <input value={localUniquenessLink} onChange={(e) => setLocalUniquenessLink(e.target.value)} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white mb-4" placeholder="Ссылка кнопки" />
                   <button onClick={() => updateUniquenessLink(localUniquenessLink)} className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest rounded-lg hover:bg-purple-400 transition-colors">
                       Сохранить блок
                   </button>
               </div>

               {/* 3. Navigation Links */}
               <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xl font-bold font-display uppercase mb-6 text-white flex items-center gap-2">
                       <Map size={20} className="text-blue-500" /> Навигация
                   </h3>
                   
                   <div className="space-y-6">
                       <div>
                           <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Хедер (Меню)</h4>
                           {localHeaderLinks.map((link, idx) => (
                               <div key={link.id} className="flex gap-2 mb-2">
                                   <input value={link.label} onChange={(e) => { const n = [...localHeaderLinks]; n[idx].label = e.target.value; setLocalHeaderLinks(n); }} className="w-1/3 bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" />
                                   <input value={link.url} onChange={(e) => { const n = [...localHeaderLinks]; n[idx].url = e.target.value; setLocalHeaderLinks(n); }} className="flex-1 bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" />
                               </div>
                           ))}
                           <button onClick={() => updateHeaderLinks(localHeaderLinks)} className="text-xs text-cyan-400 hover:text-white uppercase font-bold">Сохранить меню</button>
                       </div>
                       
                       <div>
                           <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Футер (Инфо)</h4>
                           {localFooterLinks.map((link, idx) => (
                               <div key={link.id} className="flex gap-2 mb-2">
                                   <input value={link.label} onChange={(e) => { const n = [...localFooterLinks]; n[idx].label = e.target.value; setLocalFooterLinks(n); }} className="w-1/3 bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" />
                                   <input value={link.url} onChange={(e) => { const n = [...localFooterLinks]; n[idx].url = e.target.value; setLocalFooterLinks(n); }} className="flex-1 bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" />
                               </div>
                           ))}
                           <button onClick={() => updateFooterLinks(localFooterLinks)} className="text-xs text-cyan-400 hover:text-white uppercase font-bold">Сохранить футер</button>
                       </div>
                   </div>
               </div>
               
               {/* 4. Made in Moscow & Brand */}
               <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xl font-bold font-display uppercase mb-6 text-white flex items-center gap-2">
                       <Award size={20} className="text-red-500" /> Бренд & Москва
                   </h3>
                   
                   <div className="space-y-4">
                       {/* Brand Logo */}
                       <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                           <div className="w-12 h-12 bg-black rounded flex items-center justify-center relative group cursor-pointer">
                               {localBrandLogo ? <img src={localBrandLogo} className="h-8 w-auto" alt="Brand"/> : <span className="text-xs">LOGO</span>}
                               <input type="file" onChange={(e) => handleGenericUpload(e, setLocalBrandLogo, 'brand_logo')} className="absolute inset-0 opacity-0 cursor-pointer" />
                           </div>
                           <div className="flex-1">
                               <p className="text-xs font-bold uppercase text-gray-500">Логотип сайта (Navbar/Footer)</p>
                               <button onClick={() => updateBrandLogo(localBrandLogo)} className="text-xs text-white hover:text-cyan-400">Сохранить</button>
                           </div>
                       </div>
                       
                       {/* Moscow Block */}
                       <div className="flex items-center gap-4">
                           <div className="w-16 h-16 bg-black rounded flex items-center justify-center relative group cursor-pointer">
                               {localMoscowLogo ? <img src={localMoscowLogo} className="h-10 w-auto" alt="Moscow"/> : <span className="text-xs">MSK</span>}
                               <input type="file" onChange={(e) => handleGenericUpload(e, setLocalMoscowLogo, 'moscow_logo')} className="absolute inset-0 opacity-0 cursor-pointer" />
                           </div>
                           <div className="flex-1">
                               <p className="text-xs font-bold uppercase text-gray-500">Логотип "Сделано в Москве"</p>
                           </div>
                       </div>
                       <textarea value={localMoscowText} onChange={(e) => setLocalMoscowText(e.target.value)} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" rows={3} placeholder="Текст о Москве (HTML)" />
                       <input value={localMoscowLink} onChange={(e) => setLocalMoscowLink(e.target.value)} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-xs text-white" placeholder="Ссылка кнопки" />
                       
                       <button onClick={() => { storeUpdateMadeInMoscowLogo(localMoscowLogo); storeUpdateMadeInMoscowText(localMoscowText); storeUpdateMadeInMoscowLink(localMoscowLink); }} className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest rounded-lg hover:bg-red-400 transition-colors">
                           Сохранить блок Москвы
                       </button>
                   </div>
               </div>

                {/* 5. Marketing & Scarcity Widget */}
                <div className="bg-dark-800 p-6 rounded-2xl border border-white/10 md:col-span-2">
                    <h3 className="text-xl font-bold font-display uppercase mb-6 text-white flex items-center gap-2">
                        <Flame size={20} className="text-orange-500" /> Маркетинг и Дефицит (Scarcity)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                             <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Виджет активен</label>
                                <input type="checkbox" checked={localScarcity.isEnabled} onChange={(e) => setLocalScarcity({...localScarcity, isEnabled: e.target.checked})} className="w-5 h-5 accent-orange-500" />
                             </div>
                             <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Текст метки (Label)</label>
                                    <input value={localScarcity.label} onChange={(e) => setLocalScarcity({...localScarcity, label: e.target.value})} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-white" placeholder="Limited Edition" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">Мин. Всего</label>
                                        <input type="number" value={localScarcity.minTotal} onChange={(e) => setLocalScarcity({...localScarcity, minTotal: Number(e.target.value)})} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">Макс. Всего</label>
                                        <input type="number" value={localScarcity.maxTotal} onChange={(e) => setLocalScarcity({...localScarcity, maxTotal: Number(e.target.value)})} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">Мин. % Продано</label>
                                        <input type="number" value={localScarcity.minSoldPct} onChange={(e) => setLocalScarcity({...localScarcity, minSoldPct: Number(e.target.value)})} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">Макс. % Продано</label>
                                        <input type="number" value={localScarcity.maxSoldPct} onChange={(e) => setLocalScarcity({...localScarcity, maxSoldPct: Number(e.target.value)})} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-white" />
                                    </div>
                                </div>
                             </div>
                             <p className="text-xs text-gray-500 mt-4 italic">
                                * Числа генерируются автоматически на основе ID товара, чтобы быть постоянными для каждого пользователя.
                             </p>
                        </div>
                        <div className="flex flex-col justify-end">
                            <button onClick={() => updateScarcitySettings(localScarcity)} className="w-full py-4 bg-orange-500 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20">
                                Сохранить настройки дефицита
                            </button>
                        </div>
                    </div>
                </div>

           </div>
        )}

        {/* --- TOOLS TAB --- */}
        {activeTab === 'tools' && (
            <div className="space-y-8">
                
                {/* 1. Winter/Promo Popup Manager */}
                <div className="bg-dark-800 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                         <div>
                             <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                                 <Snowflake className="text-cyan-400" /> Маркетинговый Попап
                             </h3>
                             
                             <div className="space-y-6">
                                 <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl border border-white/5">
                                     <span className="font-bold text-gray-300">Активен на сайте</span>
                                     <input type="checkbox" checked={localPopup.isEnabled} onChange={(e) => setLocalPopup({...localPopup, isEnabled: e.target.checked})} className="w-6 h-6 accent-cyan-400" />
                                 </div>
                                 
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Стиль</label>
                                         <select value={localPopup.style} onChange={(e) => setLocalPopup({...localPopup, style: e.target.value as any})} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white">
                                             <option value="cyber">Cyber Glass (Default)</option>
                                             <option value="festive">Festive Orange (Promo)</option>
                                             <option value="side-image">Композиция сбоку (3D)</option>
                                         </select>
                                     </div>
                                     <div>
                                         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Показывать на</label>
                                         <select value={localPopup.pageFilter} onChange={(e) => setLocalPopup({...localPopup, pageFilter: e.target.value as any})} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white">
                                             <option value="all">Все страницы</option>
                                             <option value="shop">Только Каталог</option>
                                             <option value="mag">Только Журнал</option>
                                         </select>
                                     </div>
                                 </div>

                                 <div className="space-y-4">
                                      <input value={localPopup.title} onChange={(e) => setLocalPopup({...localPopup, title: e.target.value})} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white" placeholder="Заголовок (Например: Зима в Москве)" />
                                      <textarea value={localPopup.text} onChange={(e) => setLocalPopup({...localPopup, text: e.target.value})} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white" rows={2} placeholder="Текст акции..." />
                                      <div className="grid grid-cols-2 gap-4">
                                          <input value={localPopup.buttonText} onChange={(e) => setLocalPopup({...localPopup, buttonText: e.target.value})} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white" placeholder="Текст кнопки" />
                                          <input value={localPopup.linkUrl} onChange={(e) => setLocalPopup({...localPopup, linkUrl: e.target.value})} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white" placeholder="Ссылка" />
                                      </div>
                                      
                                      {/* Timer (only for festive/side-image usually) */}
                                      <div>
                                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Таймер (минут)</label>
                                          <input type="number" value={localPopup.timerMinutes || 30} onChange={(e) => setLocalPopup({...localPopup, timerMinutes: Number(e.target.value)})} className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-white" />
                                      </div>
                                 </div>
                             </div>
                         </div>
                         
                         <div className="space-y-6">
                             <div className="relative h-48 bg-dark-900 rounded-xl border border-dashed border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 group overflow-hidden">
                                 <input type="file" onChange={(e) => handleGenericUpload(e, (url) => setLocalPopup({...localPopup, imageUrl: url}), 'popup_img')} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                 {localPopup.imageUrl ? (
                                     <img src={localPopup.imageUrl} className="w-full h-full object-contain p-2" alt="Popup Main" />
                                 ) : (
                                     <div className="text-center">
                                         <ImageIcon size={32} className="text-gray-500 mx-auto mb-2" />
                                         <span className="text-xs text-gray-400">Основное изображение</span>
                                     </div>
                                 )}
                                 
                                 <button onClick={handleGeneratePopupImage} disabled={isGeneratingPopupImg} className="absolute bottom-2 right-2 z-30 bg-purple-500 text-white text-[10px] px-2 py-1 rounded shadow hover:bg-purple-400 flex items-center gap-1">
                                     {isGeneratingPopupImg ? <Loader2 className="animate-spin" size={10} /> : <Wand2 size={10} />} AI Generate
                                 </button>
                             </div>
                             
                             {/* Secondary Logo Upload */}
                             <div className="relative h-20 bg-dark-900 rounded-xl border border-dashed border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 group overflow-hidden">
                                 <input type="file" onChange={(e) => handleGenericUpload(e, (url) => setLocalPopup({...localPopup, secondaryImageUrl: url}), 'popup_secondary_img')} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                 {localPopup.secondaryImageUrl ? (
                                     <img src={localPopup.secondaryImageUrl} className="h-full object-contain p-2" alt="Secondary Logo" />
                                 ) : (
                                     <span className="text-xs text-gray-400">Вторичный лого (Зима в Москве)</span>
                                 )}
                             </div>

                             <div className="flex gap-4">
                                 <button 
                                    onClick={() => setIsPreviewPopupOpen(true)}
                                    className="flex-1 py-4 bg-dark-900 border border-cyan-400 text-cyan-400 font-bold uppercase tracking-widest rounded-xl hover:bg-cyan-400 hover:text-black transition-colors flex items-center justify-center gap-2"
                                >
                                    <Eye size={18} /> Предпросмотр
                                </button>
                                <button 
                                    onClick={() => updatePopupSettings(localPopup)} 
                                    className="flex-1 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> Сохранить
                                </button>
                             </div>
                         </div>
                    </div>
                </div>

                {/* 2. SEO Generators (Sitemap/RSS) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Globe size={18}/> Генерация Sitemap.xml</h3>
                        <p className="text-xs text-gray-400 mb-4">Обновляйте карту сайта после добавления товаров.</p>
                        <div className="flex gap-2">
                            <button onClick={handleGenerateSitemap} className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 text-sm">Сгенерировать</button>
                            {sitemapXml && <button onClick={downloadSitemap} className="px-4 py-2 bg-cyan-400 text-black font-bold rounded hover:bg-white text-sm">Скачать .xml</button>}
                        </div>
                    </div>
                    <div className="bg-dark-800 p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Rss size={18}/> Генерация RSS (Яндекс/Дзен)</h3>
                        <p className="text-xs text-gray-400 mb-4">Лента для турбо-страниц и новостей.</p>
                        <div className="flex gap-2">
                            <button onClick={handleGenerateRss} className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 text-sm">Сгенерировать</button>
                            {rssXml && <button onClick={downloadRss} className="px-4 py-2 bg-orange-400 text-black font-bold rounded hover:bg-white text-sm">Скачать .xml</button>}
                        </div>
                    </div>
                </div>

                {/* 3. Database Management */}
                <div className="bg-dark-800 p-6 rounded-2xl border border-white/10 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2"><Database size={18}/> Управление Базой Данных</h3>
                        <p className="text-xs text-gray-400">Создание таблиц, миграции и исправление ошибок Supabase.</p>
                    </div>
                    <button onClick={() => setShowSqlModal(true)} className="px-6 py-3 bg-purple-500 text-white font-bold uppercase rounded-lg hover:bg-purple-600 transition-colors">
                        Настройка БД (SQL)
                    </button>
                </div>
            </div>
        )}
    </div>
  );
}
