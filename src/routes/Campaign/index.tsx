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
  X,
  Info,
  Play,
  Clock,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/Campaign/")({
  component: Campaign,
});

// Ghana regions
const ghanaRegions = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Central",
  "Eastern",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Bono",
  "Bono East",
  "Ahafo",
  "Savannah",
  "North East",
  "Oti",
  "Western North",
];

// Mock video data with better placeholders
const userVideos = [
  {
    id: 1,
    title: "Summer Product Launch 2025",
    duration: "0:45",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
    uploadDate: "2025-09-15",
  },
  {
    id: 2,
    title: "Brand Story - Behind the Scenes",
    duration: "1:20",
    thumbnail:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=225&fit=crop",
    uploadDate: "2025-09-10",
  },
  {
    id: 3,
    title: "Customer Testimonials Compilation",
    duration: "0:30",
    thumbnail:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=225&fit=crop",
    uploadDate: "2025-09-05",
  },
  {
    id: 4,
    title: "New Collection Preview",
    duration: "0:55",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
    uploadDate: "2025-08-28",
  },
  {
    id: 5,
    title: "Special Offer Announcement",
    duration: "0:25",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
    uploadDate: "2025-08-20",
  },
  {
    id: 6,
    title: "How It Works - Product Demo",
    duration: "1:45",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
    uploadDate: "2025-08-15",
  },
];

function Campaign(): JSX.Element {
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);
  const [campaignName, setCampaignName] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);
  const [budget, setBudget] = useState<string>("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [walletBalance] = useState<number>(5250.75);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showCampaignForm, setShowCampaignForm] = useState<boolean>(false);
  const [showVideoDialog, setShowVideoDialog] = useState<boolean>(false);
  const [selectedVideoForDialog, setSelectedVideoForDialog] =
    useState<any>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const formatCurrency = (amount: number): string => `GHS ${amount.toFixed(2)}`;

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

  const toggleRegionSelection = (region: string): void => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  const handleVideoClick = (video: any): void => {
    setSelectedVideoForDialog(video);
    setShowVideoDialog(true);
  };

  const calculateEstimatedReach = (): number => {
    const budgetNum: number = parseFloat(budget) || 0;
    const regionMultiplier =
      selectedRegions.length > 0 ? selectedRegions.length * 0.8 : 1;
    return Math.round(budgetNum * 150 * regionMultiplier);
  };

  const filteredVideos = userVideos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canProceedToStep2 = (): boolean => {
    return selectedVideos.length > 0 && campaignName.trim() !== "";
  };

  const canLaunchCampaign = (): boolean => {
    return (
      selectedVideos.length > 0 &&
      campaignName.trim() !== "" &&
      duration >= 1 &&
      parseFloat(budget) > 0 &&
      parseFloat(budget) <= walletBalance &&
      selectedRegions.length > 0
    );
  };

  const launchCampaign = (): void => {
    alert("Campaign launched successfully!");
    setSelectedVideos([]);
    setCampaignName("");
    setBudget("");
    setDuration(1);
    setSelectedRegions([]);
    setShowCampaignForm(false);
    setCurrentStep(1);
  };

  const selectedVideoObjects = userVideos.filter((v) =>
    selectedVideos.includes(v.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-20">
        <div className="px-4 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-all hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-gray-900 to-purple-700 bg-clip-text text-transparent">
                  Create New Campaign
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Select videos and configure your campaign
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm bg-gradient-to-r from-purple-50 to-blue-50 px-3 py-2 rounded-full border border-purple-200">
              <Wallet className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-gray-800">
                {formatCurrency(walletBalance)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="bg-white/60 backdrop-blur-sm border-b px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search your videos by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all duration-200 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Info Banner */}
        {selectedVideos.length === 0 && (
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-b px-4 py-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-900">
                  Get started by selecting your videos
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  Choose one or more videos from your library to include in this
                  campaign. You can select multiple videos to rotate during the
                  campaign period.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Selection Summary */}
        {selectedVideos.length > 0 && (
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-b px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-purple-900 block">
                    {selectedVideos.length} video
                    {selectedVideos.length > 1 ? "s" : ""} selected
                  </span>
                  <span className="text-xs text-purple-700">
                    Ready to configure campaign
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowCampaignForm(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Continue to Setup
              </button>
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="p-4">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No videos found
              </h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className={`group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 cursor-pointer ${
                    selectedVideos.includes(video.id)
                      ? "ring-2 ring-purple-500 shadow-xl scale-[1.02]"
                      : ""
                  }`}
                >
                  {/* Video Thumbnail */}
                  <div
                    className="relative"
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-all duration-300">
                          <Play
                            className="w-7 h-7 text-purple-600 ml-1"
                            fill="currentColor"
                          />
                        </div>
                      </div>

                      {/* Duration badge */}
                      <div className="absolute bottom-2 right-2 bg-black/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md flex items-center space-x-1 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{video.duration}</span>
                      </div>

                      {/* Selection checkbox */}
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVideoSelection(video.id);
                          }}
                          className="relative"
                        >
                          {selectedVideos.includes(video.id) ? (
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg border-2 border-white/70 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div
                    className="p-4"
                    onClick={() => toggleVideoSelection(video.id)}
                  >
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight mb-2 group-hover:text-purple-700 transition-colors duration-200">
                      {video.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Uploaded {new Date(video.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Preview Dialog */}
      {showVideoDialog && selectedVideoForDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Dialog Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Video Preview
              </h3>
              <button
                onClick={() => setShowVideoDialog(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Video Display */}
            <div className="p-6">
              <div className="aspect-video bg-gray-900 rounded-xl mb-4 overflow-hidden relative group">
                <img
                  src={selectedVideoForDialog.thumbnail}
                  alt={selectedVideoForDialog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                    <Play
                      className="w-10 h-10 text-purple-600 ml-1"
                      fill="currentColor"
                    />
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 text-lg mb-2">
                {selectedVideoForDialog.title}
              </h4>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedVideoForDialog.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(
                    selectedVideoForDialog.uploadDate
                  ).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    toggleVideoSelection(selectedVideoForDialog.id);
                    setShowVideoDialog(false);
                  }}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    selectedVideos.includes(selectedVideoForDialog.id)
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800"
                  }`}
                >
                  {selectedVideos.includes(selectedVideoForDialog.id)
                    ? "Remove from Campaign"
                    : "Add to Campaign"}
                </button>
                <button
                  onClick={() => setShowVideoDialog(false)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Form Modal */}
      {showCampaignForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Campaign Setup
                  </h2>
                  <p className="text-purple-100 text-sm mt-1">
                    Step {currentStep} of 2
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCampaignForm(false);
                    setCurrentStep(1);
                  }}
                  className="p-2 hover:bg-white/20 rounded-full transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <>
                  {/* Selected Videos Summary */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      Selected Videos ({selectedVideos.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedVideoObjects.map((video) => (
                        <div
                          key={video.id}
                          className="flex items-center gap-2 bg-white rounded-lg p-2"
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-16 h-9 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {video.title}
                            </p>
                            <p className="text-xs text-gray-600">
                              {video.duration}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campaign Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Summer Product Launch 2025"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Campaign Duration *
                    </label>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <span className="text-lg font-semibold text-gray-900">
                            {duration} month{duration > 1 ? "s" : ""}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          ~{duration * 30} days
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="12"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="w-full accent-purple-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>1 month</span>
                        <span>12 months</span>
                      </div>
                    </div>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceedToStep2()}
                    className={`w-full py-4 rounded-xl font-semibold transition-all ${
                      canProceedToStep2()
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue to Budget & Targeting
                  </button>
                </>
              )}

              {/* Step 2: Budget & Targeting */}
              {currentStep === 2 && (
                <>
                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Campaign Budget *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600" />
                      <input
                        type="number"
                        placeholder="0.00"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full pl-12 pr-16 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg font-semibold"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                        GHS
                      </div>
                    </div>

                    {budget && parseFloat(budget) > walletBalance && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600 bg-red-50 rounded-lg p-3">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          Insufficient wallet balance
                        </span>
                      </div>
                    )}

                    {budget &&
                      parseFloat(budget) > 0 &&
                      parseFloat(budget) <= walletBalance && (
                        <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3">
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Budget approved
                            </span>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Target Regions */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Target Regions * ({selectedRegions.length} selected)
                    </label>
                    <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-2">
                        {ghanaRegions.map((region) => (
                          <button
                            key={region}
                            onClick={() => toggleRegionSelection(region)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              selectedRegions.includes(region)
                                ? "bg-purple-600 text-white shadow-md"
                                : "bg-white text-gray-700 border border-gray-300 hover:border-purple-400"
                            }`}
                          >
                            {region}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Performance Estimation */}
                  {budget &&
                    parseFloat(budget) > 0 &&
                    selectedRegions.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-purple-200">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                          Estimated Campaign Performance
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">
                              Daily Budget
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {formatCurrency(
                                parseFloat(budget) / (duration * 30)
                              )}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">
                              Estimated Reach
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {formatNumber(calculateEstimatedReach())}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">
                              Target Areas
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {selectedRegions.length} regions
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={launchCampaign}
                      disabled={!canLaunchCampaign()}
                      className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                        canLaunchCampaign()
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Launch Campaign
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
