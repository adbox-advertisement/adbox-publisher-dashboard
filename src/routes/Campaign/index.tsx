import { createFileRoute } from "@tanstack/react-router";
import { useState, type JSX } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Calendar,
  DollarSign,
  AlertCircle,
  Wallet,
  Search,
  Filter,
  X,
  Info,
  Play,
  Clock,
} from "lucide-react";
import { userVideos, type Video } from "@/components/campaign/videos";

export const Route = createFileRoute("/Campaign/")({
  component: Campaign,
});

function Campaign(): JSX.Element {
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);
  const [campaignName, setCampaignName] = useState<string>("");
  const [duration, setDuration] = useState<number>(1); // months
  const [budget, setBudget] = useState<string>("");
  const [walletBalance] = useState<number>(125.5);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCampaignForm, setShowCampaignForm] = useState<boolean>(false);
  const [showVideoDialog, setShowVideoDialog] = useState<boolean>(false);
  const [selectedVideoForDialog, setSelectedVideoForDialog] =
    useState<Video | null>(null);

  const formatCurrency = (amount: number): string => `GH₵${amount.toFixed(2)}`;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const toggleVideoSelection = (videoId: number): void => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleVideoClick = (video: Video): void => {
    setSelectedVideoForDialog(video);
    setShowVideoDialog(true);
  };

  const calculateEstimatedReach = (): number => {
    const budgetNum: number = parseFloat(budget) || 0;
    return Math.round(budgetNum * 100);
  };

  const filteredVideos = userVideos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canCreateCampaign = (): boolean => {
    return (
      selectedVideos.length > 0 &&
      campaignName.trim() !== "" &&
      duration >= 1 &&
      parseFloat(budget) > 0 &&
      parseFloat(budget) <= walletBalance
    );
  };

  const launchCampaign = (): void => {
    // Here you would typically send the campaign data to your backend
    alert("Campaign launched successfully!");
    // Reset form or navigate away
    setSelectedVideos([]);
    setCampaignName("");
    setBudget("");
    setDuration(1);
    setShowCampaignForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-20">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-all hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-purple-700 bg-clip-text text-transparent">
                Create Campaign
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
              <Wallet className="w-4 h-4 text-purple-600" />
              <span className="font-medium">
                {formatCurrency(walletBalance)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white/60 backdrop-blur-sm border-b px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Search your videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 bg-white/80 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all duration-200 placeholder-gray-400"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-purple-100 rounded-full transition-all"
          >
            <Filter className="w-4 h-4 text-purple-500" />
          </button>
        </div>
      </div>

      {/* Info Banner - Shows when no videos are selected */}
      {selectedVideos.length === 0 && (
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-b px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-900">
                Select videos to continue your campaign
              </p>
              <p className="text-xs text-purple-700 mt-1">
                Choose one or more videos from your library to promote in this
                campaign
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {selectedVideos.length > 0 && (
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-b px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-purple-900">
                {selectedVideos.length} video
                {selectedVideos.length > 1 ? "s" : ""} selected
              </span>
            </div>
            <button
              onClick={() => setShowCampaignForm(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Create Campaign
            </button>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="p-4">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No videos found
            </h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className={`group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 ${
                  selectedVideos.includes(video.id)
                    ? "ring-2 ring-purple-400 shadow-xl scale-[1.02] bg-gradient-to-br from-purple-50 to-white"
                    : ""
                }`}
              >
                {/* Video Thumbnail - Clickable */}
                <div
                  className="relative cursor-pointer"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-2xl overflow-hidden relative">
                    <img
                      src={video.thumbnail}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300">
                        <Play className="w-6 h-6 text-purple-600 ml-1" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{video.duration}</span>
                    </div>

                    {/* Selection indicator */}
                    <div className="absolute top-3 right-3">
                      {selectedVideos.includes(video.id) ? (
                        <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full border-2 border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Video Info - Clickable for selection */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => toggleVideoSelection(video.id)}
                >
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight mb-3 group-hover:text-purple-700 transition-colors duration-200">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Dialog */}
      {showVideoDialog && selectedVideoForDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-md animate-in zoom-in-95 duration-300 ease-out">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Video Preview
                </h3>
                <button
                  onClick={() => setShowVideoDialog(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all hover:scale-110"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="aspect-video bg-gray-100 rounded-xl mb-4 overflow-hidden">
                <img
                  src={selectedVideoForDialog.thumbnail}
                  alt={selectedVideoForDialog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h4 className="font-medium text-gray-900 mb-2">
                {selectedVideoForDialog.title}
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                This is a placeholder for video preview functionality.
              </p>

              <button
                onClick={() => setShowVideoDialog(false)}
                className="w-full bg-purple-600 text-white py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Form Modal */}
      {showCampaignForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[100vh] sm:max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 sm:zoom-in-95 duration-300 ease-out">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-gray-50 border-b px-6 py-4 rounded-t-3xl sm:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 animate-in slide-in-from-left duration-500 delay-150">
                  Campaign Details
                </h2>
                <button
                  onClick={() => setShowCampaignForm(false)}
                  className="p-2 hover:bg-white/60 rounded-full transition-all hover:scale-110 animate-in slide-in-from-right duration-500 delay-150"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Selected Videos Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-gray-50 rounded-xl p-4 animate-in slide-in-from-left duration-500 delay-200">
                <h3 className="font-medium text-gray-800 mb-2">
                  Selected Videos
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedVideos.length} video
                  {selectedVideos.length > 1 ? "s" : ""} will be promoted
                </p>
              </div>

              {/* Campaign Name */}
              <div className="animate-in slide-in-from-left duration-500 delay-300">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  placeholder="Enter campaign name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 focus:scale-[1.02]"
                />
              </div>

              {/* Duration */}
              <div className="animate-in slide-in-from-left duration-500 delay-400">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="flex items-center space-x-4">
                  <Calendar className="w-5 h-5 text-purple-500 transition-transform duration-200 hover:scale-110" />
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="flex-1 accent-purple-500 transition-all duration-200"
                  />
                  <span className="font-medium text-gray-800 min-w-[80px] text-sm sm:text-base transition-all duration-200">
                    {duration} month{duration > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Budget */}
              <div className="animate-in slide-in-from-left duration-500 delay-500">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-500 transition-transform duration-200 hover:scale-110" />
                  <input
                    type="number"
                    placeholder="Enter budget amount"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full pl-12 pr-16 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 focus:scale-[1.02]"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    GH₵
                  </div>
                </div>

                {budget && parseFloat(budget) > walletBalance && (
                  <div className="mt-2 flex items-center space-x-2 text-red-600 animate-in slide-in-from-bottom duration-300">
                    <AlertCircle className="w-4 h-4 animate-pulse" />
                    <span className="text-sm">Insufficient balance</span>
                  </div>
                )}
              </div>

              {/* Budget Estimation */}
              {budget &&
                parseFloat(budget) > 0 &&
                parseFloat(budget) <= walletBalance && (
                  <div className="bg-gradient-to-r from-purple-50 to-gray-50 rounded-xl p-4 animate-in slide-in-from-bottom duration-500 delay-200">
                    <h3 className="font-medium text-gray-800 mb-3">
                      Estimated Performance
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center animate-in slide-in-from-left duration-300 delay-100">
                        <span className="text-gray-600">Daily Budget</span>
                        <span className="font-medium text-gray-800">
                          {formatCurrency(parseFloat(budget) / (duration * 30))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center animate-in slide-in-from-left duration-300 delay-200">
                        <span className="text-gray-600">Estimated Reach</span>
                        <span className="font-medium text-gray-800">
                          {formatNumber(calculateEstimatedReach())} people
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              {/* Launch Button */}
              <div className="pt-2 animate-in slide-in-from-bottom duration-500 delay-600">
                <button
                  onClick={launchCampaign}
                  disabled={!canCreateCampaign()}
                  className={`w-full py-4 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base transform hover:scale-[1.02] active:scale-[0.98] ${
                    canCreateCampaign()
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Launch Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
