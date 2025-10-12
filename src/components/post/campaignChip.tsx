import { Zap } from "lucide-react";

export const CampaignChip = () => (
  <div className=" flex items-center ">
    <div className="relative">
      {/* Beeping animation rings */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-violet-300 rounded-full opacity-50 animate-ping"></div>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-violet-300 rounded-full opacity-40 animate-pulse"></div>
      {/* Main chip */}
      <div className="relative bg-gradient-to-r from-purple-500 to-violet-400 text-white px-2 py-1 rounded-full shadow-lg flex items-center gap-1 text-xs sm:px-3 sm:gap-1.5">
        <Zap className="w-3 h-3 animate-pulse sm:w-3 sm:h-3" />
        <span className="font-semibold whitespace-nowrap">Live</span>
      </div>
    </div>
  </div>
);
