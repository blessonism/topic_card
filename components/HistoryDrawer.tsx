import React from 'react';
import { TopicCardData } from '../types';
import { XIcon, SparklesIcon, PenIcon } from './Icons';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomCreator: () => void;
  history: TopicCardData[];
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, onOpenCustomCreator, history }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 dark:bg-black/60 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
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
            <div className="absolute top-0 right-0 w-64 h-64 dark:bg-purple-900/10 bg-blue-100/40 rounded-full blur-[80px] pointer-events-none transition-colors duration-500"></div>

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
                <div className="p-6 pb-2">
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

                {/* Section: History Header */}
                <div className="px-6 py-4 flex items-center gap-3">
                    <div className="h-[1px] flex-1 dark:bg-white/5 bg-black/5"></div>
                    <span className="text-[10px] uppercase tracking-widest dark:text-white/30 text-black/30">Recent Echoes</span>
                    <div className="h-[1px] flex-1 dark:bg-white/5 bg-black/5"></div>
                </div>

                {/* Section: History List */}
                <div className="px-6 pb-6 space-y-4">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 dark:text-white/30 text-black/30 text-sm border border-dashed dark:border-white/5 border-black/10 rounded-xl">
                            <p>No echoes found.</p>
                        </div>
                    ) : (
                        history.slice().reverse().map((card, idx) => (
                            <div key={card.timestamp || idx} className="group relative rounded-xl p-5 border transition-all duration-300
                                dark:bg-white/5 dark:border-white/5 dark:hover:bg-white/10 dark:hover:border-white/20
                                bg-white/50 border-black/5 hover:bg-white hover:border-black/10 hover:shadow-sm
                            ">
                            <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-serif dark:text-white/90 text-gray-900 font-medium">{card.title}</h3>
                                    <span className="text-[10px] uppercase dark:text-white/30 text-black/40 border dark:border-white/10 border-black/10 px-1.5 py-0.5 rounded">
                                        Lvl {card.intensity}
                                    </span>
                            </div>
                            <p className="text-sm dark:text-white/60 text-gray-600 leading-relaxed dark:group-hover:text-white/80 group-hover:text-gray-900 transition-colors line-clamp-2">
                                {card.question}
                            </p>
                            <div className="mt-3 flex gap-2 overflow-hidden">
                                    {card.tags.map((t, i) => (
                                        <span key={i} className="text-[10px] dark:text-white/30 text-gray-400">#{t}</span>
                                    ))}
                            </div>
                            </div>
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