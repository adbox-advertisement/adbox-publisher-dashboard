import { Zap, Radio } from "lucide-react";

export const CampaignChip = ({
  campaignStatus,
}: {
  campaignStatus: string;
}) => {
  const isPublic = campaignStatus === "PUBLIC";

  return (
    <div className="flex items-center">
      <div className="relative">
        {!isPublic && (
          <>
            {/* Beeping animation rings - for private/draft */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-orange-400 rounded-full opacity-50 animate-ping"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-orange-400 rounded-full opacity-40 animate-pulse"></div>
          </>
        )}

        {isPublic && (
          <>
            {/* Beeping animation rings - for public */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-violet-300 rounded-full opacity-50 animate-ping"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-violet-300 rounded-full opacity-40 animate-pulse"></div>
          </>
        )}

        {/* Main chip */}
        <div
          className={`relative ${
            isPublic
              ? "bg-gradient-to-r from-purple-500 to-violet-400"
              : "bg-gradient-to-r from-red-500 to-orange-500"
          } text-white px-2 py-1 rounded-full shadow-lg flex items-center gap-1 text-xs sm:px-3 sm:gap-1.5`}
        >
          {isPublic ? (
            <>
              <Zap className="w-3 h-3 animate-pulse sm:w-3 sm:h-3" />
              <span className="font-semibold whitespace-nowrap">Live</span>
            </>
          ) : (
            <>
              <Radio className="w-3 h-3 animate-pulse sm:w-3 sm:h-3" />
              <span className="font-semibold whitespace-nowrap">Paused</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
