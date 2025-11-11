import React from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";

const Card = () => {
  return (
    <div className="max-w-xl w-full bg-white dark:bg-[#151517] border border-gray-200 dark:border-[#2a2a2f] rounded-2xl shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500" />
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 truncate">
              Comet UI Patterns
            </h3>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
              <span>Design Insights</span>
              <span>•</span>
              <span>2h ago</span>
              <span>•</span>
              <span>Public</span>
            </div>
          </div>
        </div>
        <button className="p-2 rounded-xl border border-gray-200 dark:border-[#2a2a2f] text-gray-500 hover:bg-gray-100 dark:hover:bg-[#1b1b1f] transition">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Media */}
      <div className="aspect-video bg-gradient-to-br from-blue-600/20 via-purple-500/10 to-transparent border-y border-gray-200 dark:border-[#2a2a2f]" />

      {/* Body */}
      <div className="px-4 pt-3 pb-2 text-[15px] text-gray-700 dark:text-gray-200">
        Subtle elevation, rounded corners, and sensible spacing—this card mirrors
        the clean, comfy “Comet” look. Add media above, keep text crisp below, and
        use the action row for your UX.{" "}
        <a href="#" className="text-blue-500 hover:underline">
          Learn more
        </a>
        .
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pb-4 pt-1 flex-wrap">
        <button className="flex items-center justify-center gap-2 flex-1 border border-gray-200 dark:border-[#2a2a2f] rounded-xl py-2.5 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-[#1b1b1f] hover:text-blue-600 dark:hover:text-gray-100 transition">
          <Heart size={18} />
          Like
          <span className="ml-auto text-sm text-gray-400">120</span>
        </button>
        <button className="flex items-center justify-center gap-2 flex-1 border border-gray-200 dark:border-[#2a2a2f] rounded-xl py-2.5 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-[#1b1b1f] hover:text-blue-600 dark:hover:text-gray-100 transition">
          <MessageCircle size={18} />
          Comment
          <span className="ml-auto text-sm text-gray-400">34</span>
        </button>
        <button className="flex items-center justify-center gap-2 flex-1 border border-gray-200 dark:border-[#2a2a2f] rounded-xl py-2.5 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-[#1b1b1f] hover:text-blue-600 dark:hover:text-gray-100 transition">
          <Share2 size={18} />
          Share
        </button>
      </div>
    </div>
  );
};

export default Card;
