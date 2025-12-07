
import React from 'react';
import { ShieldCheck, RefreshCcw, Zap, Truck, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const HodlProtection: React.FC = () => {
  const shimmerGradientClass = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500 animate-shimmer bg-[length:200%_auto]";

  return (
    <div className="min-h-screen py-20 bg-dark-900 relative overflow-hidden">
      <SEO 
        title="HODL Protection — Гарантия, Обмен и Сервис" 
        description="Как работает защита покупателя HODL Jewelry. Пожизненная гарантия на титан, легкий обмен размера и поддержка клиентов."
        keywords="гарантия hodl, обмен кольца, возврат украшений, сервис, ремонт"
      />

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center p-4 bg-cyan-900/20 rounded-full border border-cyan-500/30 mb-6 animate-pulse-slow">
                <ShieldCheck size={48} className="text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-6 leading-none">
                HODL <span className={shimmerGradientClass}>PROTECTION</span>
            </h1>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                Мы не просто продаем украшения. Мы берем на себя ответственность за то, как они служат вам в реальной жизни.
            </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* Pillar 1 */}
            <div className="bg-dark-800/50 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/5 rounded-lg group-hover:bg-cyan-400 group-hover:text-black transition-colors">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white">Пожизненная гарантия</h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm">
                    Титан и сталь 316L не ржавеют. Если с металлом что-то случится само по себе (коррозия, трещины без удара) — мы заменим изделие на новое. Без срока давности.
                </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-dark-800/50 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/5 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <RefreshCcw size={24} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white">Обмен размера</h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm">
                    Промахнулись с размером при заказе онлайн? Не проблема. Напишите нам в течение 7 дней после получения, и мы организуем обмен на подходящий размер.
                </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-dark-800/50 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/5 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Truck size={24} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white">Безопасная доставка</h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm">
                    Мы страхуем каждое отправление. Если посылка потеряется или повредится в пути (что бывает крайне редко), мы вышлем новый заказ за свой счет.
                </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-dark-800/50 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-green-400/50 transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/5 rounded-lg group-hover:bg-green-400 group-hover:text-black transition-colors">
                        <CheckCircle2 size={24} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white">Проверка качества</h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm">
                    Каждое кольцо проверяется вручную перед отправкой: на плавность вращения (для спиннеров), качество гравировки и отсутствие царапин.
                </p>
            </div>
        </div>

        {/* Detailed Info Section */}
        <div className="space-y-16">
            
            {/* Section 1 */}
            <div className="prose prose-invert prose-lg max-w-none">
                <h2 className="text-3xl font-display font-bold text-white mb-6 border-l-4 border-cyan-400 pl-4">
                    Как происходит обмен?
                </h2>
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <ol className="list-decimal list-inside space-y-4 text-gray-300">
                        <li>Свяжитесь с нами в Telegram или WhatsApp (контакты ниже).</li>
                        <li>Сообщите номер заказа и на какой размер нужно поменять.</li>
                        <li>Отправьте кольцо нам (инструкцию предоставит менеджер).</li>
                        <li>Как только мы получим возврат и проверим его состояние (отсутствие следов носки), мы сразу вышлем новое кольцо.</li>
                    </ol>
                </div>
            </div>

            {/* Section 2 */}
            <div className="prose prose-invert prose-lg max-w-none">
                <h2 className="text-3xl font-display font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">
                    Что не является гарантийным случаем?
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-dark-800 p-6 rounded-xl border border-red-500/20">
                        <div className="flex items-center gap-2 mb-3 text-red-400 font-bold">
                            <AlertTriangle size={20} /> Механические повреждения
                        </div>
                        <p className="text-sm text-gray-400">
                            Глубокие царапины, вмятины от ударов о твердые предметы, деформация формы кольца вследствие сильного сжатия. Титан прочен, но не неуязвим.
                        </p>
                    </div>
                    <div className="bg-dark-800 p-6 rounded-xl border border-red-500/20">
                        <div className="flex items-center gap-2 mb-3 text-red-400 font-bold">
                            <AlertTriangle size={20} /> Химическое воздействие
                        </div>
                        <p className="text-sm text-gray-400">
                            Пятна от агрессивных кислот, щелочей или растворителей (промышленных). Бытовая химия обычно безопасна, но мы рекомендуем снимать кольца при уборке.
                        </p>
                    </div>
                </div>
            </div>

            {/* FAQ Accordion */}
            <div>
                <h2 className="text-3xl font-display font-bold text-white mb-8 flex items-center gap-3">
                   <HelpCircle className="text-cyan-400" /> FAQ: Частые вопросы
                </h2>
                <div className="space-y-4">
                    <details className="group bg-dark-800 rounded-xl border border-white/5 overflow-hidden">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-white group-hover:text-cyan-400 transition-colors">
                            <span>Насколько прочное черное покрытие?</span>
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <div className="text-gray-400 px-6 pb-6 text-sm leading-relaxed border-t border-white/5 pt-4">
                            Мы используем PVD или DLC покрытие (как на дорогих часах). Оно проникает в структуру металла. Оно не отслаивается кусками, как краска. Со временем, спустя годы, оно может слегка посветлеть на гранях ("винтажный эффект"), но это происходит очень медленно.
                        </div>
                    </details>

                    <details className="group bg-dark-800 rounded-xl border border-white/5 overflow-hidden">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-white group-hover:text-cyan-400 transition-colors">
                            <span>Можно ли купаться с кольцами?</span>
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <div className="text-gray-400 px-6 pb-6 text-sm leading-relaxed border-t border-white/5 pt-4">
                            Да, абсолютно. Титан и сталь 316L инертны. Вы можете плавать в море, бассейне или принимать душ. Они не окисляются и не оставляют следов на коже.
                        </div>
                    </details>
                    
                    <details className="group bg-dark-800 rounded-xl border border-white/5 overflow-hidden">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-white group-hover:text-cyan-400 transition-colors">
                            <span>Сколько стоит доставка при обмене?</span>
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <div className="text-gray-400 px-6 pb-6 text-sm leading-relaxed border-t border-white/5 pt-4">
                            Если ошибка с нашей стороны (брак или не тот товар) — все расходы за наш счет. Если вам не подошел размер, который вы выбрали сами, пересылку оплачивает покупатель (по тарифам СДЭК или Почты), а услуги по замене мы предоставляем бесплатно.
                        </div>
                    </details>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center py-12 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-3xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">Остались вопросы?</h3>
                <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                    Наша поддержка работает каждый день. Мы поможем подобрать размер или оформить обмен.
                </p>
                <div className="flex justify-center gap-4">
                    <a href="https://t.me/hodl_support" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-cyan-400 transition-colors">
                        Написать в Telegram
                    </a>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default HodlProtection;
