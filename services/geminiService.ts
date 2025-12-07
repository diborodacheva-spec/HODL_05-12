
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (
  name: string,
  material: string,
  category: string
): Promise<string> => {
  try {
    const prompt = `
      Ты профессиональный копирайтер для люксового ювелирного бренда HODL Jewelry.
      Напиши привлекательное, элегантное и продающее описание товара для сайта.
      
      Название: ${name}
      Материал: ${material}
      Категория: ${category}
      
      Описание должно быть на русском языке, длиной около 2-3 предложений. Используй слова, подчеркивающие статус, качество и уникальность. Избегай клише.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Описание не сгенерировано.";
  } catch (error) {
    console.error("Error generating description:", error);
    throw new Error("Не удалось сгенерировать описание. Проверьте API Key.");
  }
};

export const generateRichProductDetails = async (
  name: string,
  material: string,
  category: string
): Promise<string> => {
  try {
    const prompt = `
      Ты — креативный директор бренда HODL Jewelry (киберпанк, минимализм, титан).
      Напиши подробную, структурированную статью о товаре "${name}" (${category}, ${material}).
      
      Верни **ТОЛЬКО HTML код**.
      
      СТРУКТУРА (Обязательно используй эти теги, так как они стилизованы на сайте):
      
      1. <h2>ФИЛОСОФИЯ И ДИЗАЙН</h2>
         - Напиши красивый абзац о вдохновении.
         - Используй <strong> для выделения ключевых смыслов.
      
      2. <h2>МАТЕРИАЛЫ И ТЕХНОЛОГИИ</h2>
         - Подробно опиши ${material}.
         - Можно использовать маркированный список <ul> с <li>.
      
      3. <h2>КОМУ ПОДОЙДЕТ</h2>
         - Опиши стиль владельца.
      
      Стиль текста: Уверенный, дорогой, немного футуристичный.
      Не используй классы (class="..."), только чистые теги h2, h3, p, ul, li, strong, blockquote.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let text = response.text || "";
    // Clean up if the model wraps it in markdown code blocks
    text = text.replace(/```html/g, '').replace(/```/g, '').trim();
    
    return text;
  } catch (error) {
    console.error("Error generating rich details:", error);
    throw new Error("AI Error");
  }
};

export const generateImageAlt = async (
  name: string,
  category: string,
  material?: string,
  context?: string // Additional context (e.g. for articles)
): Promise<string> => {
  try {
    const prompt = `
      Ты SEO-специалист. Напиши короткий (до 10 слов), описательный Alt-текст (альтернативный текст) для изображения.
      Текст должен быть на русском языке, без кавычек, конкретный и описывать визуальную часть для поисковиков.
      
      Объект: ${name}
      Категория: ${category}
      Материал/Детали: ${material || 'Не указано'}
      Контекст: ${context || 'Фотография товара на белом или темном фоне'}
      
      Пример хорошего Alt: "Мужское кольцо из титана с карбоновой вставкой крупным планом"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || `${category} ${name} ${material || ''}`;
  } catch (error) {
    console.error("Error generating alt text:", error);
    throw new Error("AI Error");
  }
};

export const generateCrossLinks = async (
    articleTitle: string,
    articleExcerpt: string,
    availableProducts: { id: string; name: string; category: string }[],
    availableArticles: { id: string; title: string; category: string }[]
): Promise<{ productIds: string[], articleIds: string[] }> => {
    try {
        const productsList = availableProducts.map(p => `- ID: ${p.id}, Name: ${p.name}, Cat: ${p.category}`).join('\n');
        const articlesList = availableArticles.map(a => `- ID: ${a.id}, Title: ${a.title}, Cat: ${a.category}`).join('\n');

        const prompt = `
            Ты контент-менеджер ювелирного бренда. 
            Твоя задача — сделать перелинковку (Cross-linking).
            
            1. Проанализируй статью: "${articleTitle}" (${articleExcerpt}).
            2. Выбери из списка ТОВАРОВ те, которые лучше всего подходят по смыслу к статье (максимум 4 товара).
            3. Выбери из списка СТАТЕЙ те, которые было бы интересно прочитать после этой (максимум 2 статьи).
            
            СПИСОК ТОВАРОВ (Products):
            ${productsList}
            
            СПИСОК ДРУГИХ СТАТЕЙ (Articles):
            ${articlesList}
            
            Верни ответ ТОЛЬКО в валидном формате JSON, без лишнего текста и markdown:
            {
              "productIds": ["id_товара_1", "id_товара_2"],
              "articleIds": ["id_статьи_1", "id_статьи_2"]
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const jsonText = response.text || "{}";
        // Clean up markdown block if present (though responseMimeType should handle it)
        const cleanJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Error generating cross links:", error);
        return { productIds: [], articleIds: [] };
    }
};

export const generateMarketingImage = async (promptContext: string): Promise<string> => {
    try {
        const fullPrompt = `
            Generate a high-quality, photorealistic image for a luxury jewelry brand's winter marketing campaign.
            Aesthetic: Dark, cyberpunk, neon accents, winter atmosphere, snow, bokeh, elegant, premium.
            Context: ${promptContext}
            No text in the image.
        `;

        // Using Imagen 3.0 via generateImages as per coding guidelines for image generation
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-001',
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                aspectRatio: '1:1',
                outputMimeType: 'image/jpeg'
            }
        });

        const base64Data = response.generatedImages?.[0]?.image?.imageBytes;
        if (base64Data) {
            return `data:image/jpeg;base64,${base64Data}`;
        }
        
        throw new Error("No image data returned");

    } catch (error) {
        console.error("Error generating marketing image:", error);
        // Fallback to a placeholder if AI fails
        return "https://images.unsplash.com/photo-1516714435131-44d6a64dc6a2?auto=format&fit=crop&q=80&w=800";
    }
};
