import React, { useState, useEffect } from 'react';
import { XIcon, PenIcon, SparklesIcon, LayersIcon } from './Icons';
import { TopicCardData } from '../types';

interface CustomTopicInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TopicCardData) => void;
}

const IntensitySelector: React.FC<{ value: number; onChange: (val: number) => void }> = ({ value, onChange }) => {
    return (
        <div className="flex flex-col items-center gap-1.5">
            <span className="text-[9px] uppercase tracking-[0.2em] dark:text-white/30 text-black/30">Intensity</span>
            <div className="flex gap-1.5 items-center justify-center px-4 py-2 dark:bg-black/20 bg-black/5 rounded-full border dark:border-white/5 border-black/5 transition-all duration-300 hover:dark:border-white/20 hover:border-black/10">
                {[1, 2, 3, 4, 5].map((i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onChange(i)}
                        className={`group relative w-1 rounded-full transition-all duration-500 ease-out ${
                            i <= value 
                            ? 'h-4 dark:bg-white bg-black dark:shadow-[0_0_6px_rgba(255,255,255,0.4)] shadow-[0_0_3px_rgba(0,0,0,0.2)]' 
                            : 'h-2 dark:bg-white/10 bg-black/10 hover:bg-black/20 dark:hover:bg-white/20'
                        }`}
                    >
                         {/* Hover glow effect */}
                        <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 dark:bg-white/50 bg-black/20 blur-[1px] transition-opacity duration-300"></span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export const CustomTopicInput: React.FC<CustomTopicInputProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [intensity, setIntensity] = useState(3);
  const [isClosing, setIsClosing] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
        setIsClosing(false);
        setTitle("");
        setDescription("");
        setQuestion("");
        setTagsInput("");
        setIntensity(3);
    }
  }, [isOpen]);

  // Handle the close animation sequence
  const handleClose = () => {
      setIsClosing(true);
      // Wait for the animation duration (300ms) before triggering the parent unmount
      setTimeout(() => {
          onClose();
          setIsClosing(false); 
      }, 300);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCard: TopicCardData = {
        title: title || "无题",
        description: description || "灵感源自此刻...",
        question: question || "准备好开始了吗？",
        tags: tagsInput.split(/[,，\s]+/).filter(t => t.length > 0).slice(0, 3), 
        intensity,
        timestamp: Date.now(),
        isUserGenerated: true
    };
    
    if (newCard.tags.length === 0) newCard.tags = ["Original", "Thought"];

    setIsClosing(true);
    setTimeout(() => {
        onSubmit(newCard);
    }, 300);
  };

  // Only render if open or currently animating out
  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60] px-4 overflow-hidden">
      {/* Backdrop with slow blur transition */}
      <div 
        className={`absolute inset-0 dark:bg-black/80 bg-gray-900/40 backdrop-blur-md transition-opacity duration-300 ease-in-out ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />

      {/* The "Foundry" Modal */}
      <div className={`
            relative w-full max-w-md 
            dark:bg-[#08080a] bg-[#f8f9fa] 
            border dark:border-white/10 border-white
            shadow-[0_0_50px_rgba(0,0,0,0.2)] dark:shadow-[0_0_50px_rgba(0,0,0,0.8)]
            rounded-3xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300
            ${isClosing ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0 animate-enter-power'}
      `}>
         
         {/* Premium Background Effects */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-[300px] h-[300px] dark:bg-indigo-600/10 bg-blue-300/20 rounded-full blur-[100px] pointer-events-none transition-colors duration-500"></div>
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] dark:bg-purple-600/10 bg-orange-300/20 rounded-full blur-[100px] pointer-events-none transition-colors duration-500"></div>
         
         {/* Header */}
         <div className="relative z-10 px-8 py-6 flex justify-between items-center bg-gradient-to-b dark:from-white/5 from-black/5 to-transparent">
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.3em] dark:text-white/40 text-black/40">Mode</span>
                <h3 className="text-xl font-serif dark:text-white text-gray-900 tracking-wide flex items-center gap-2">
                    Card Foundry <PenIcon className="w-4 h-4 dark:text-white/50 text-black/50" />
                </h3>
            </div>
            <button 
                type="button"
                onClick={handleClose}
                className="group p-2 rounded-full dark:hover:bg-white/10 hover:bg-black/10 transition-colors cursor-pointer"
            >
                <XIcon className="w-6 h-6 dark:text-white/30 text-black/30 dark:group-hover:text-white group-hover:text-black transition-colors" />
            </button>
         </div>

         {/* Form Content */}
         <div className="relative z-10 flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
             <form id="card-form" onSubmit={handleSubmit} className="flex flex-col gap-8 h-full">
                
                {/* Title & Description Group */}
                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="w-full relative group">
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="THE TITLE"
                            maxLength={12}
                            className="w-full bg-transparent border-b dark:border-white/10 border-black/10 py-2 text-3xl font-serif font-bold text-center dark:text-white text-black dark:placeholder:text-white/10 placeholder:text-black/10 focus:outline-none dark:focus:border-white/40 focus:border-black/40 transition-all uppercase tracking-wider"
                            autoFocus
                        />
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] dark:bg-white bg-black transition-all duration-500 group-focus-within:w-1/2"></span>
                    </div>

                    <input 
                        type="text" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a poetic subtitle or context..."
                        maxLength={40}
                        className="w-full bg-transparent py-1 text-sm italic text-center dark:text-white/60 text-gray-500 dark:placeholder:text-white/10 placeholder:text-black/10 focus:outline-none dark:hover:text-white/80 hover:text-gray-800 transition-colors font-serif"
                    />
                </div>

                {/* Main Question Area */}
                <div className="space-y-2 flex-1">
                    <label className="text-[10px] uppercase tracking-widest dark:text-white/30 text-black/30 block pl-1">The Content</label>
                    <div className="relative group h-full min-h-[140px]">
                        <div className="absolute inset-0 dark:bg-white/5 bg-black/5 rounded-2xl border dark:border-white/10 border-black/5 transition-all duration-300 dark:group-focus-within:bg-white/10 group-focus-within:bg-black/5 dark:group-focus-within:border-white/20 group-focus-within:border-black/20 dark:group-focus-within:shadow-[0_0_20px_rgba(255,255,255,0.05)] group-focus-within:shadow-[0_0_20px_rgba(0,0,0,0.05)]"></div>
                        <textarea 
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Write your topic, dare, or deep question here..."
                            className="relative w-full h-full bg-transparent p-5 text-lg dark:text-white text-gray-800 dark:placeholder:text-white/10 placeholder:text-black/20 focus:outline-none resize-none leading-relaxed"
                        />
                    </div>
                </div>

                {/* Footer Metadata */}
                <div className="grid grid-cols-2 gap-6 pt-4 pb-4">
                    <div className="space-y-2">
                         <label className="text-[10px] uppercase tracking-widest dark:text-white/30 text-black/30 block mb-1">Tags</label>
                         <div className="flex items-center gap-2 border-b dark:border-white/10 border-black/10 py-2 dark:focus-within:border-white/40 focus-within:border-black/40 transition-colors">
                             <LayersIcon className="w-3 h-3 dark:text-white/30 text-black/30" />
                             <input 
                                type="text"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                placeholder="Deep, Fun..."
                                className="w-full bg-transparent text-xs dark:text-white text-black dark:placeholder:text-white/20 placeholder:text-black/20 focus:outline-none"
                             />
                         </div>
                    </div>
                    <div className="flex justify-end items-end">
                        <IntensitySelector value={intensity} onChange={setIntensity} />
                    </div>
                </div>

             </form>
         </div>

         {/* Action Bar */}
         <div className="relative z-10 p-6 dark:bg-black/40 bg-white/40 border-t dark:border-white/10 border-black/5 backdrop-blur-md">
            <button 
                type="submit"
                form="card-form"
                disabled={!title.trim() || !question.trim()}
                className="w-full group relative flex items-center justify-center gap-3 px-8 py-4 dark:bg-white bg-[#1a1a1a] dark:text-black text-white rounded-xl font-bold tracking-widest uppercase text-xs dark:hover:bg-gray-200 hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
                <span className="relative z-10">Forge Card</span>
                <SparklesIcon className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform" />
                
                {/* Shine Effect */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700"></div>
                </div>
            </button>
         </div>

      </div>
    </div>
  );
};