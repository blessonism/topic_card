import React from 'react';
import { TopicCategory } from '../types';

interface CategorySelectorProps {
  selected: TopicCategory;
  onSelect: (category: TopicCategory) => void;
  disabled: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selected, onSelect, disabled }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
      {Object.values(TopicCategory)
        .filter(cat => cat !== TopicCategory.CUSTOM) // Keep 'Custom' hidden as it's a creation mode
        .map((cat) => {
          const isCollection = cat === TopicCategory.MY_COLLECTION;
          
          return (
            <button
            key={cat}
            onClick={() => onSelect(cat)}
            disabled={disabled}
            className={`
                px-4 py-2 rounded-full text-sm transition-all duration-300 border
                /* Dark Mode Logic */
                dark:hover:border-white/30 dark:hover:text-white/80
                
                ${selected === cat 
                    ? isCollection 
                        ? 'dark:bg-gradient-to-r dark:from-indigo-600 dark:to-purple-600 dark:text-white dark:border-transparent dark:shadow-[0_0_15px_rgba(120,50,255,0.4)] bg-black text-white'
                        : 'dark:bg-white dark:text-black dark:border-white dark:shadow-[0_0_15px_rgba(255,255,255,0.3)] bg-[#1a1a1a] text-white border-black shadow-[0_0_15px_rgba(0,0,0,0.15)]'
                    : isCollection
                        ? 'dark:text-indigo-300 dark:border-indigo-500/30 text-indigo-800 border-indigo-200'
                        : 'dark:bg-transparent dark:text-white/50 dark:border-white/10 bg-transparent text-black/50 border-black/10'
                }
                
                /* Hover non-selected */
                ${selected !== cat ? 'hover:border-black/30 hover:text-black/80' : ''}

                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            >
            {cat}
            </button>
        )})}
    </div>
  );
};