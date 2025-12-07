
const express = require('express');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Config
const app = express();
const PORT = process.env.PORT || 3000;
const SUPABASE_URL = "https://gcfnafkxqxhitpggwkik.supabase.co"; 
// Note: In a real server env, use process.env.SUPABASE_ANON_KEY
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZm5hZmt4cXhoaXRwZ2d3a2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MjI0NjEsImV4cCI6MjA3OTI5ODQ2MX0.NHVsdwqDgjd7GijykrfTJzo6gdmrQbexz8xVPy538WU";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const indexPath = path.resolve(__dirname, 'dist', 'index.html');

// Static files
app.use(express.static(path.resolve(__dirname, 'dist'), { index: false }));

// Helper to replace meta tags
const injectMeta = (html, data) => {
    return html
        .replace(/<title>.*?<\/title>/, `<title>${data.title} | HODL Jewelry</title>`)
        .replace(/content="HODL Jewelry — Титан и Сталь"/g, `content="${data.title}"`)
        .replace(/content="Премиальные украшения из титана и стали.*?"/g, `content="${data.description}"`)
        .replace(/content="https:\/\/images.unsplash.com\/photo-1622398925373-3f91b1e275f5\?auto=format&fit=crop&q=80&w=1000"/g, `content="${data.image}"`);
};

// 1. Handle Product Routes for Social Bots
app.get('/product/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        let html = fs.readFileSync(indexPath, 'utf8');

        // Fetch product from DB
        // Try by ID first, then slug
        let { data: product } = await supabase.from('products').select('*').eq('id', slug).single();
        
        if (!product) {
             const { data: productBySlug } = await supabase.from('products').select('*').eq('slug', slug).single();
             product = productBySlug;
        }

        if (product) {
            // Check if image is Base64 (starts with data:image) - TG doesn't like base64 in OG tags
            // If it is base64, we might need a workaround or use the fallback URL if available.
            // For now, we pass it, but ideal setup uses hosted image URLs.
            const imageUrl = product.image_url || (product.images && product.images[0]);
            
            html = injectMeta(html, {
                title: product.name,
                description: product.description.substring(0, 150) + '...',
                image: imageUrl
            });
        }
        
        res.send(html);
    } catch (e) {
        console.error(e);
        res.sendFile(indexPath);
    }
});

// 2. Handle Magazine Routes for Social Bots
app.get('/mag/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        let html = fs.readFileSync(indexPath, 'utf8');

        let { data: article } = await supabase.from('articles').select('*').eq('id', slug).single();
        if (!article) {
             const { data: articleBySlug } = await supabase.from('articles').select('*').eq('slug', slug).single();
             article = articleBySlug;
        }

        if (article) {
            html = injectMeta(html, {
                title: article.title,
                description: article.excerpt,
                image: article.image_url || article.imageUrl
            });
        }
        
        res.send(html);
    } catch (e) {
        console.error(e);
        res.sendFile(indexPath);
    }
});

// 3. Fallback for all other routes
app.get('*', (req, res) => {
    res.sendFile(indexPath);
});

app.listen(PORT, () => {
    console.log(`Node server listening on port ${PORT}`);
});
