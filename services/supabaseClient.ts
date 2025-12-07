
import { createClient } from '@supabase/supabase-js';

// Вставляем ключи напрямую, чтобы гарантировать подключение
const supabaseUrl = "https://gcfnafkxqxhitpggwkik.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZm5hZmt4cXhoaXRwZ2d3a2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MjI0NjEsImV4cCI6MjA3OTI5ODQ2MX0.NHVsdwqDgjd7GijykrfTJzo6gdmrQbexz8xVPy538WU";

console.log("✅ Supabase Client Initialized with provided keys");

export const supabase = createClient(supabaseUrl, supabaseKey);
