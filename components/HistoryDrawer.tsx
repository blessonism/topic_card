import React, { useState } from 'react';
import { TopicCardData } from '../types';
import { XIcon, SparklesIcon, PenIcon, StarIcon, TrashIcon, ChevronDownIcon, GripVerticalIcon, LayersIcon } from './Icons';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomCreator: () => void;
  history: TopicCardData[];
  favorites: TopicCardData[];
  onAddToFavorites: (card: TopicCardData) => void;
  onRemoveFromFavorites: (timestamp: number) => void;
}

interface DrawerCardProps {
    card: TopicCardData;
    isFavorite: boolean;
    onRemove?: () => void;
    onDragStart?: (e: React.DragEvent) => void;
}

// Sub-component for individual card items in the drawer
const DrawerCard: React.FC<DrawerCardProps> = ({ 
    card, 
    isFavorite, 
    onRemove, 
    onDragStart 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div 
            draggable={!isFavorite}
            onDragStart={onDragStart}
            className={`
                group relative flex flex-col rounded-xl border transition-all duration-500 overflow-hidden
                ${isFavorite 
                    ? 'dark:bg-indigo-950/20 bg-indigo-50/40 dark:border-indigo-500/20 border-indigo-200 shadow-[0_2px_10px_rgba(99,102,241,0.05)]'
                    : 'dark:bg-white/5 bg-white/50 border dark:border-white/5 border-black/5 hover:border-black/10 dark:hover:border-white/20 cursor-grab active:cursor-grabbing hover:shadow-md'
                }
            `}
        >
            {/* High-End Gradient Accent Line for Favorites (replacing the thick solid border) */}
            {isFavorite && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 opacity-60"></div>
            )}
            
            {/* Header / Summary Row */}
            <div 
                className={`p-3 pl-4 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${isExpanded ? 'bg-black/5 dark:bg-white/5' : ''}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* Drag Grip (History only) */}
                {!isFavorite && (
                    <div className="text-black/20 dark:text-white/20 group-hover:text-black/40 dark:group-hover:text-white/40 transition-colors">
                        <GripVerticalIcon className="w-4 h-4" />
                    </div>
                )}

                <div className="flex-1 min-w-0 relative">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h4 className={`text-sm font-serif font-medium truncate transition-colors ${
                            isFavorite 
                            ? 'dark:text-indigo-200 text-indigo-900 group-hover:dark:text-white group-hover:text-indigo-700' 
                            : 'dark:text-white/90 text-gray-900'
                        }`}>
                            {card.title}
                        </h4>
                        
                        {/* Intensity Dots - Subtler */}
                        <div className="flex gap-0.5 opacity-50">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-0.5 h-0.5 rounded-full ${i <= (card.intensity > 3 ? 3 : card.intensity) ? 'dark:bg-white bg-black' : 'dark:bg-white/20 bg-black/10'}`} />
                            ))}
                        </div>
                    </div>
                    {/* Collapsed Preview Text */}
                    {!isExpanded && (
                        <p className={`text-[10px] truncate transition-colors ${isFavorite ? 'dark:text-indigo-200/40 text-indigo-900/40' : 'dark:text-white/40 text-black/40'}`}>
                            {card.question}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    {/* Expand/Collapse Toggle */}
                    <div className={`p-1 rounded-full transition-all duration-300 ${isExpanded ? 'rotate-180 dark:bg-white/10 bg-black/5' : 'rotate-0'}`}>
                        <ChevronDownIcon className={`w-3 h-3 ${isFavorite ? 'dark:text-indigo-300/50 text-indigo-400' : 'dark:text-white/30 text-black/30'}`} />
                    </div>
                    
                    {/* Remove Action (Favorites only) */}
                    {isFavorite && onRemove && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className="p-1.5 ml-1 rounded-full hover:bg-red-500/10 text-transparent hover:text-red-500 transition-colors group/trash"
                            title="Remove from deck"
                        >
                            <TrashIcon className="w-3.5 h-3.5 dark:text-indigo-300/20 text-indigo-900/20 group-hover/trash:text-red-500 transition-colors" />
                        </button>
                    )}
                </div>
            </div>

            {/* Expanded Content (Accordion) */}
            <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="px-4 pb-4 pt-2">
                        {/* Divider */}
                        <div className={`h-[1px] w-12 mb-3 ${isFavorite ? 'dark:bg-indigo-500/20 bg-indigo-500/10' : 'dark:bg-white/10 bg-black/5'}`}></div>
                        
                        <p className={`text-xs italic mb-2 font-serif ${isFavorite ? 'dark:text-indigo-100/60 text-indigo-900/60' : 'dark:text-white/50 text-gray-500'}`}>
                            "{card.description}"
                        </p>
                        
                        <p className={`text-sm leading-relaxed mb-4 ${isFavorite ? 'dark:text-indigo-50 text-indigo-950' : 'dark:text-white/90 text-gray-800'}`}>
                            {card.question}
                        </p>

                        <div className="flex flex-wrap gap-1.5 opacity-80">
                            {card.tags.map((tag, idx) => (
                                <span key={idx} className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                                    isFavorite 
                                    ? 'dark:bg-indigo-500/10 bg-indigo-500/5 dark:border-indigo-500/20 border-indigo-200 dark:text-indigo-200 text-indigo-800'
                                    : 'dark:bg-white/5 bg-black/5 dark:border-white/5 border-black/5 dark:text-white/50 text-black/50'
                                }`}>
                                    {tag}
                                </span>
                            ))}
                            <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                                isFavorite 
                                    ? 'dark:bg-indigo-500/5 bg-indigo-500/5 dark:border-indigo-500/10 border-indigo-100 dark:text-indigo-200/50 text-indigo-800/50'
                                    : 'dark:bg-white/5 bg-black/5 dark:border-white/5 border-black/5 dark:text-white/30 text-black/30'
                                }`}>
                                {card.isUserGenerated ? 'Handcrafted' : 'Oracle'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ 
    isOpen, onClose, onOpenCustomCreator, history, favorites, onAddToFavorites, onRemoveFromFavorites 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent, card: TopicCardData) => {
    e.dataTransfer.setData("application/json", JSON.stringify(card));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const data = e.dataTransfer.getData("application/json");
    if (data) {
        try {
            const card = JSON.parse(data) as TopicCardData;
            onAddToFavorites(card);
        } catch (err) {
            console.error("Failed to parse dropped item", err);
        }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 dark:bg-black/80 bg-gray-900/30 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm border-l shadow-2xl z-50 transform transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] 
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        dark:bg-[#0a0a0c] dark:border-white/10 
        bg-[#ffffff] border-black/5
        `}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Ambient Background in Drawer */}
            <div className="absolute top-0 right-0 w-64 h-64 dark:bg-indigo-900/10 bg-blue-100/40 rounded-full blur-[80px] pointer-events-none transition-colors duration-500"></div>

            {/* Header */}
            <div className="p-6 border-b dark:border-white/5 border-black/5 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 dark:text-white/50 text-black/40" />
                    <h2 className="text-lg font-serif tracking-widest uppercase dark:text-white/90 text-gray-900">Control</h2>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 dark:hover:bg-white/5 hover:bg-black/5 rounded-full transition-colors dark:text-white/50 text-black/40 dark:hover:text-white hover:text-black"
                >
                    <XIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
                
                {/* Section: Create */}
                <div className="px-6 pt-6 pb-2">
                    <button
                        onClick={() => {
                            onClose();
                            setTimeout(onOpenCustomCreator, 100);
                        }}
                        className="group relative w-full flex items-center justify-between p-5 rounded-xl border transition-all duration-300 overflow-hidden
                        dark:bg-gradient-to-br dark:from-white/10 dark:to-white/5 dark:border-white/10 dark:hover:border-white/30
                        bg-gradient-to-br from-gray-100 to-white border-black/5 hover:border-black/20 hover:shadow-lg
                        "
                    >
                         <div className="flex flex-col items-start gap-1 relative z-10">
                             <span className="text-lg font-serif font-bold dark:text-white text-gray-900">Forge Card</span>
                             <span className="text-xs dark:text-white/50 text-gray-500">Design your own topic</span>
                         </div>
                         <div className="relative z-10 w-10 h-10 rounded-full dark:bg-white/10 bg-black/5 flex items-center justify-center dark:group-hover:bg-white dark:group-hover:text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
                             <PenIcon className="w-4 h-4" />
                         </div>

                         {/* Hover Shine */}
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    </button>
                </div>

                {/* Section: My Deck (Drop Zone) */}
                <div className="px-6 py-4">
                     <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2">
                             <StarIcon className="w-3 h-3 dark:text-indigo-400 text-indigo-500" filled />
                             <span className="text-[10px] uppercase tracking-widest dark:text-white/50 text-black/50">My Collection ({favorites.length})</span>
                         </div>
                         {favorites.length > 0 && (
                            <span className="text-[9px] dark:text-white/20 text-black/20 italic">
                                Active Deck
                            </span>
                         )}
                     </div>
                     
                     <div 
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleDrop}
                        className={`
                            min-h-[140px] rounded-2xl border transition-all duration-300 p-2 flex flex-col gap-2 relative overflow-hidden
                            ${isDragOver 
                                ? 'dark:border-indigo-500/50 border-indigo-400/50 dark:bg-indigo-900/20 bg-indigo-50/50 scale-[1.01] shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                                : favorites.length > 0 
                                    ? 'dark:border-white/5 border-black/5 dark:bg-white/5 bg-gray-50/50' 
                                    : 'dark:border-white/5 border-black/5 border-dashed dark:bg-transparent bg-transparent'
                            }
                        `}
                     >
                        {favorites.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3 opacity-60">
                                <div className={`p-4 rounded-full dark:bg-white/5 bg-black/5 transition-transform duration-500 ${isDragOver ? 'scale-110 rotate-12' : ''}`}>
                                    <LayersIcon className="w-6 h-6 dark:text-white/20 text-black/20" />
                                </div>
                                <div>
                                    <p className="text-xs dark:text-white/50 text-black/50 font-medium tracking-wide">DECK EMPTY</p>
                                    <p className="text-[10px] dark:text-white/30 text-black/30 mt-1">Drag cards here to build your collection</p>
                                </div>
                            </div>
                        ) : (
                            favorites.map((card, idx) => (
                                <DrawerCard 
                                    key={`fav-${card.timestamp}-${idx}`} 
                                    card={card} 
                                    isFavorite={true} 
                                    onRemove={() => card.timestamp && onRemoveFromFavorites(card.timestamp)}
                                />
                            ))
                        )}
                     </div>
                </div>

                {/* Section: History Header */}
                <div className="px-6 py-2 flex items-center gap-3">
                    <div className="h-[1px] flex-1 dark:bg-white/5 bg-black/5"></div>
                    <span className="text-[10px] uppercase tracking-widest dark:text-white/30 text-black/30">Recent Echoes</span>
                    <div className="h-[1px] flex-1 dark:bg-white/5 bg-black/5"></div>
                </div>

                {/* Section: History List */}
                <div className="px-6 pb-6 space-y-3">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 dark:text-white/30 text-black/30 text-sm border border-dashed dark:border-white/5 border-black/10 rounded-xl">
                            <p className="font-serif italic">No history yet...</p>
                        </div>
                    ) : (
                        history.slice().reverse().map((card, idx) => (
                            <DrawerCard 
                                key={`hist-${card.timestamp}-${idx}`} 
                                card={card} 
                                isFavorite={false} 
                                onDragStart={(e) => handleDragStart(e, card)}
                            />
                        ))
                    )}
                </div>
            </div>
            
            <div className="p-4 text-center border-t dark:border-white/5 border-black/5 text-[10px] dark:text-white/20 text-black/20 uppercase tracking-widest relative z-10">
                Lumina Cards Collection
            </div>
        </div>
      </div>
    </>
  );
};