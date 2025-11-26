import React, { useState, useCallback, useEffect } from 'react';
import { TopicCategory, TopicCardData, GenerationState } from './types';
import { generateTopic } from './services/geminiService';
import { Card } from './components/Card';
import { CategorySelector } from './components/CategorySelector';
import { RefreshIcon, MenuIcon, SunIcon, MoonIcon, PenIcon } from './components/Icons';
import { HistoryDrawer } from './components/HistoryDrawer';
import { CustomTopicInput } from './components/CustomTopicInput';

const App: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<TopicCategory>(TopicCategory.FUN);
  const [cardData, setCardData] = useState<TopicCardData | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [history, setHistory] = useState<TopicCardData[]>([]);
  // Filter only user-generated cards for the specific "My Collection" deck
  const userCards = history.filter(c => c.isUserGenerated);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCustomInputOpen, setIsCustomInputOpen] = useState(false);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [generationState, setGenerationState] = useState<GenerationState>({
    isLoading: false,
    error: null,
  });

  // Apply theme class to html element
  useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleDraw = useCallback(async () => {
    if (generationState.isLoading) return;

    if (isFlipped) {
      setIsFlipped(false);
      await new Promise(r => setTimeout(r, 600)); 
    }

    setGenerationState({ isLoading: true, error: null });
    setCardData(null); 
    setIsFlipped(true);

    try {
      let data: TopicCardData;

      // STRATEGY: Isolate User Deck vs AI Deck
      if (currentCategory === TopicCategory.MY_COLLECTION) {
          await new Promise(r => setTimeout(r, 800)); // Simulate suspense
          
          if (userCards.length > 0) {
             // Pick random card from user collection
             const randomIndex = Math.floor(Math.random() * userCards.length);
             data = userCards[randomIndex];
          } else {
             // Empty State Card
             data = {
                 title: "空空如也",
                 description: "你的收藏集还在沉睡。",
                 question: "去右上角【铸造卡片】，创造属于你的第一张灵感卡片吧。",
                 tags: ["System", "Guide"],
                 intensity: 1,
                 timestamp: Date.now(),
                 isUserGenerated: false
             };
          }
      } else {
          // AI Generation
          data = await generateTopic(currentCategory);
          // Only add AI cards to history (User cards are added upon creation)
          setHistory(prev => [...prev, data]);
      }
      
      setCardData(data);
      
    } catch (err) {
      setGenerationState({ isLoading: false, error: 'Failed to generate topic' });
    } finally {
      setGenerationState({ isLoading: false, error: null });
    }
  }, [currentCategory, isFlipped, generationState.isLoading, userCards]);

  const handleCategoryChange = (cat: TopicCategory) => {
    if (generationState.isLoading) return;
    setCurrentCategory(cat);
    
    // Reset flip if switching categories to avoid confusion
    if (isFlipped) {
        setIsFlipped(false);
    }
  };

  const handleCustomSubmit = async (data: TopicCardData) => {
    setIsCustomInputOpen(false);
    
    // 1. If currently showing a card, flip back first
    if (isFlipped) {
        setIsFlipped(false);
        await new Promise(r => setTimeout(r, 600));
    }
    
    // 2. Start "Loading" (Minting) phase
    setGenerationState({ isLoading: true, error: null });
    setCardData(null);
    setIsFlipped(true); // Flip to back (shows loader)
    
    // 3. Simulate magical minting process
    setTimeout(() => {
        // Save to global history (which populates MY_COLLECTION)
        setHistory(prev => [...prev, data]);
        
        // Strategy: Immediate Gratification. 
        // Show the card immediately regardless of current category.
        setCardData(data);
        
        // Optional: Switch category to Collection so next draw is also from collection?
        // Let's keep current category to allow user to easily go back to AI, 
        // but the current view is their creation.
        
        setGenerationState({ isLoading: false, error: null });
    }, 1200);
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ease-in-out flex flex-col
        dark:bg-[#050505] dark:text-white dark:selection:bg-white/20 dark:selection:text-white
        bg-[#f2f2f2] text-gray-900 selection:bg-black/10 selection:text-black
    `}>
      
      {/* Background Ambience - Dual Mode */}
      <div className="fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0">
        {/* Dark Mode Ambience */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        </div>

        {/* Light Mode Ambience */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}>
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-200/20 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-200/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-dust.png')] opacity-[0.4]"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex justify-between items-center dark:border-white/5 border-black/5 border-b backdrop-blur-sm transition-colors duration-500">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 dark:bg-white bg-black rounded-full dark:shadow-[0_0_10px_white] shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-colors duration-500"></div>
            <h1 className="font-serif text-lg tracking-[0.2em] uppercase dark:text-white/90 text-black/80 transition-colors duration-500">Lumina Cards</h1>
        </div>
        
        <div className="flex items-center gap-3">
             {/* Theme Toggle */}
            <button 
                onClick={toggleTheme}
                className="group p-2 rounded-full dark:bg-white/5 bg-black/5 dark:border-white/10 border-black/5 border transition-all hover:scale-105 active:scale-95"
            >
                <div className="relative w-5 h-5">
                    <SunIcon className={`absolute inset-0 w-full h-full text-black/70 transition-all duration-500 ${isDarkMode ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`} />
                    <MoonIcon className={`absolute inset-0 w-full h-full text-white/70 transition-all duration-500 ${isDarkMode ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`} />
                </div>
            </button>

            {/* Menu Toggle */}
            <button 
                onClick={() => setIsDrawerOpen(true)}
                className="group p-2 rounded-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/5 dark:hover:bg-white/10 hover:bg-black/10 transition-all dark:text-white/70 text-black/60 dark:hover:text-white hover:text-black"
            >
                <MenuIcon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start py-8 gap-12 w-full max-w-4xl mx-auto">
        
        {/* The Card Stage */}
        <div className="w-full flex justify-center perspective-1000">
           {/* Card Aspect Ratio Container: Keeps everything aligned */}
           <div className="relative w-full max-w-sm aspect-[3/4]">
                
               {/* === Stack Layer 3 (Bottom - Fanned Left) === */}
               <div 
                 className={`absolute inset-0 w-full h-full rounded-3xl transition-all duration-700 ease-in-out border z-0
                    dark:bg-[#1a1a1a] dark:border-white/10
                    bg-[#e6e6e6] border-black/5 origin-bottom-left
                    ${generationState.isLoading 
                        ? 'translate-y-3 scale-90 opacity-20 rotate-0' 
                        : 'translate-y-1 scale-[0.92] dark:opacity-100 opacity-40 -rotate-2.5 -translate-x-1'
                    }
                 `}
               ></div>

               {/* === Stack Layer 2 (Middle - Fanned Right) === */}
               <div 
                 className={`absolute inset-0 w-full h-full rounded-3xl transition-all duration-700 ease-in-out border shadow-lg z-10
                    dark:bg-gradient-to-br dark:from-[#111] dark:via-[#0a0a0a] dark:to-[#050505] dark:border-white/10
                    bg-gradient-to-br from-[#fcfcfc] via-[#f5f5f7] to-[#e6e6e6] border-black/5 origin-bottom-right
                    ${generationState.isLoading 
                        ? 'translate-y-1 scale-95 opacity-50 rotate-0' 
                        : 'translate-y-0.5 scale-[0.96] dark:opacity-100 opacity-60 rotate-1.5 translate-x-1'
                    }
                 `}
               >
                    {/* Subtle texture for the stack edge */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
               </div>

               {/* === Main Active Card === */}
               <div className={`relative z-20 w-full h-full transition-transform duration-500 origin-center ${generationState.isLoading ? 'scale-[0.98]' : 'scale-100'}`}>
                    <Card 
                        data={cardData} 
                        isFlipped={isFlipped} 
                        isLoading={generationState.isLoading} 
                    />
               </div>
           </div>
        </div>

        {/* Controls */}
        <div className="w-full flex flex-col items-center gap-8 relative z-30 pb-10">
            
            {/* Category Pills */}
            <div className="w-full flex flex-col items-center gap-4">
                <p className="text-center text-[10px] dark:text-white/30 text-black/30 uppercase tracking-[0.3em] transition-colors duration-500">Select Frequency</p>
                <CategorySelector 
                    selected={currentCategory} 
                    onSelect={handleCategoryChange} 
                    disabled={generationState.isLoading}
                />
            </div>

            {/* Main Action Button */}
            <button
                onClick={handleDraw}
                disabled={generationState.isLoading}
                className={`
                    group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full font-serif text-sm tracking-widest uppercase transition-all duration-500 
                    hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed 
                    
                    /* Dark Mode Styles */
                    dark:bg-white dark:text-black dark:border-white 
                    dark:shadow-[0_0_30px_rgba(255,255,255,0.1)] dark:hover:shadow-[0_0_50px_rgba(255,255,255,0.25)]
                    
                    /* Light Mode Styles */
                    bg-[#1a1a1a] text-white border-black/5
                    shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]
                `}
            >
                {generationState.isLoading ? (
                    <span className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full dark:bg-black bg-white animate-[bounce_1s_infinite_0ms]"></span>
                         <span className="w-1.5 h-1.5 rounded-full dark:bg-black bg-white animate-[bounce_1s_infinite_200ms]"></span>
                         <span className="w-1.5 h-1.5 rounded-full dark:bg-black bg-white animate-[bounce_1s_infinite_400ms]"></span>
                    </span>
                ) : (
                    <>
                        <span className="font-bold">
                            {isFlipped ? "Draw Another" : "Reveal Destiny"}
                        </span>
                        <RefreshIcon className={`w-4 h-4 transition-transform duration-700 ease-out group-hover:rotate-180`} />
                    </>
                )}
            </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
         <p className="text-[10px] dark:text-white/20 text-black/20 tracking-[0.3em] font-serif uppercase dark:hover:text-white/40 hover:text-black/40 transition-colors cursor-default">
            Designed for Deep Connection
         </p>
      </footer>

      {/* Drawers & Modals */}
      <HistoryDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onOpenCustomCreator={() => setIsCustomInputOpen(true)}
        history={history} 
      />
      
      <CustomTopicInput 
        isOpen={isCustomInputOpen}
        onClose={() => setIsCustomInputOpen(false)}
        onSubmit={handleCustomSubmit}
      />

    </div>
  );
};

export default App;