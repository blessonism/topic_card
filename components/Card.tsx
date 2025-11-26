import React from 'react';
import { TopicCardData } from '../types';
import { SparklesIcon, PenIcon } from './Icons';

interface CardProps {
  data: TopicCardData | null;
  isFlipped: boolean;
  isLoading: boolean;
}

const IntensityMeter: React.FC<{ level: number }> = ({ level }) => {
    return (
        <div className="flex gap-1 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div 
                    key={i} 
                    className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                        i <= level 
                        ? 'dark:bg-white/90 dark:shadow-[0_0_8px_rgba(255,255,255,0.6)] bg-gray-800 shadow-[0_0_4px_rgba(0,0,0,0.3)]' 
                        : 'dark:bg-white/10 bg-black/10'
                    }`}
                />
            ))}
        </div>
    )
}

export const Card: React.FC<CardProps> = ({ data, isFlipped, isLoading }) => {
  return (
    // Perspective Container: Increased depth (2000px) for a more cinematic, less distorted 3D look
    <div className="relative w-full h-full group perspective-2000 mx-auto">
      
      {/* The 3D Object */}
      <div
        className={`relative w-full h-full preserve-3d transition-all duration-[800ms] ease-spring transform-style-3d ${
          isFlipped 
            ? 'rotate-y-180' // Standard Flip
            : 'rotate-y-0'
        }`}
        style={{
            // Subtle tilt when flipping for realism (simulates hand toss)
            transform: isFlipped ? 'rotateY(180deg) scale(1) translateZ(0px)' : 'rotateY(0deg) scale(1) translateZ(0px)'
        }}
      >
        {/* ================= Front of Card (Deck Back / Logo) ================= */}
        <div className="absolute w-full h-full backface-hidden rounded-3xl overflow-hidden shadow-2xl transition-all duration-500
          border dark:border-white/10 border-gray-200
          dark:bg-gradient-to-br dark:from-[#151515] dark:via-[#0a0a0a] dark:to-[#1a1a1a]
          bg-gradient-to-br from-[#fcfcfc] via-[#f5f5f7] to-[#e6e6e6]
        ">
          {/* Moving Sheen Effect (Only visible during transition) */}
          <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12 transition-transform duration-[1000ms] ease-out-expo ${isFlipped ? 'translate-x-full' : '-translate-x-full'}`}></div>

          {/* Textures */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] dark:opacity-20 opacity-0 transition-opacity duration-500"></div>
          
          {/* Decorative Orbs - Dark Mode */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] animate-pulse-slow dark:opacity-100 opacity-0 transition-opacity duration-500"></div>
          
          {/* Decorative Orbs - Light Mode (Golden/Warm) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-orange-200/40 rounded-full blur-[60px] animate-pulse-slow dark:opacity-0 opacity-100 transition-opacity duration-500"></div>

          {/* Center Logo */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="relative group-hover:scale-110 transition-transform duration-700 ease-spring">
                <div className="absolute inset-0 dark:bg-white/20 bg-black/5 blur-xl rounded-full"></div>
                {/* Removed animate-float for a more static, high-end look */}
                <SparklesIcon className="w-16 h-16 dark:text-white/80 text-gray-800/80 relative z-10 transition-colors duration-500" />
            </div>
            <h2 className="mt-8 text-2xl font-serif dark:text-white/60 text-gray-600 tracking-[0.3em] uppercase transition-colors duration-500">Lumina</h2>
          </div>
          
          {/* Border/Rim Glow */}
          <div className="absolute inset-0 rounded-3xl ring-1 dark:ring-white/10 ring-black/5"></div>
        </div>

        {/* ================= Back of Card (Content) ================= */}
        {/* rotate-y-180 makes this face opposite to the front */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-3xl overflow-hidden shadow-2xl transition-colors duration-500
            dark:bg-[#050505] bg-[#fafafa]
            border dark:border-white/20 border-gray-200/50
        ">
           {/* Moving Sheen Effect on Back */}
           <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 transition-transform duration-[1200ms] ease-out-expo delay-100 ${isFlipped ? 'translate-x-full' : '-translate-x-full'}`}></div>

           {/* Glass Background */}
           <div className="absolute inset-0 dark:bg-white/5 bg-white/40 backdrop-blur-md transition-colors duration-500"></div>
           
           {/* Ambient Color Blobs */}
           <div className="absolute top-0 right-0 w-64 h-64 dark:bg-indigo-500/10 bg-blue-300/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-colors duration-500"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 transition-colors duration-500"></div>

           <div className="relative z-10 h-full flex flex-col p-8 text-center justify-between">
              
              {/* Card Header */}
              <div className="flex justify-between items-start dark:opacity-60 opacity-40 transition-opacity duration-500">
                <div className="flex items-center gap-2">
                    {data?.isUserGenerated ? (
                        <PenIcon className="w-4 h-4 dark:text-white text-black" />
                    ) : (
                        <SparklesIcon className="w-4 h-4 dark:text-white text-black" />
                    )}
                    <span className="text-[10px] tracking-widest uppercase font-mono dark:text-white text-black">
                        {data?.isUserGenerated ? "Handcrafted" : "Oracle Card"}
                    </span>
                </div>
              </div>

              {isLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                      <div className="w-10 h-10 border-2 dark:border-white/10 border-black/10 dark:border-t-white border-t-black rounded-full animate-spin"></div>
                      <p className="text-sm dark:text-white/50 text-black/40 animate-pulse font-serif italic">Weaving destiny...</p>
                  </div>
              ) : data ? (
                <>
                    <div className="flex-1 flex flex-col items-center justify-center animate-enter-power" style={{ animationDelay: '0.2s' }}>
                        <div className="mb-6">
                            <h3 className="text-3xl font-serif font-bold dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-white dark:to-white/60 text-gray-900 mb-2 transition-colors duration-500 leading-tight">
                                {data.title}
                            </h3>
                            <div className="h-px w-12 dark:bg-white/30 bg-black/10 mx-auto rounded-full transition-colors duration-500 mt-4"></div>
                        </div>
                        
                        <p className="dark:text-white/70 text-gray-500 italic text-sm mb-8 leading-relaxed font-serif px-2 transition-colors duration-500">
                            "{data.description}"
                        </p>

                        <div className="dark:bg-white/5 bg-white/60 border dark:border-white/10 border-black/5 shadow-sm rounded-2xl p-6 backdrop-blur-sm w-full transition-all duration-500">
                            <p className="text-lg font-medium dark:text-white text-gray-800 leading-relaxed transition-colors duration-500">
                                {data.question}
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 animate-enter-power" style={{ animationDelay: '0.4s' }}>
                        <div className="flex justify-center flex-wrap gap-2 mb-4">
                            {data.tags.map((tag, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider dark:bg-white/10 bg-black/5 dark:text-white/60 text-black/50 border dark:border-white/5 border-black/5 transition-colors duration-500">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase tracking-widest dark:text-white/30 text-black/30 transition-colors duration-500">Intensity</span>
                            <IntensityMeter level={data.intensity} />
                        </div>
                    </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center dark:text-white/40 text-black/30 font-serif italic">
                    The cards are silent.
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};