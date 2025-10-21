import { useCallback, useEffect, useRef, useState, type JSX } from "react";
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
  Loader2,
} from "lucide-react";
import { ghanaRegions, type PublisherPost } from "@/components/campaign/types";
import { toast } from "sonner";
import ApiService from "@/helpers/api.service";
import { Storage } from "@/helpers/local.storage";
import { useSocket } from "@/context/SocketContext";
import SkeletonDemo from "./VideoSkeletonCard";
import { useNavigate } from "@tanstack/react-router";
import { formatDate } from "@/helpers/utilFunctions";
import { cardColors } from "@/components/post/types/interface";
import Hls from "hls.js";

export function Campaign(): JSX.Element {
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null); // Changed to single video ID
  const [campaignName, setCampaignName] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);
  const [budget, setBudget] = useState<string>("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showCampaignForm, setShowCampaignForm] = useState<boolean>(false);
  const [showVideoDialog, setShowVideoDialog] = useState<boolean>(false);
  const [selectedVideoForDialog, setSelectedVideoForDialog] =
    useState<any>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<PublisherPost[]>([]);
  const { id } = Storage.getPublisherId("publisherId") || {};
  const [isLaunching, setIsLaunching] = useState(false);
  const [walletId, setWalletId] = useState<string>("");

  const formatCurrency = (amount: number): string => `GHS ${amount.toFixed(2)}`;
  const { UploadingEventData, publishedVideo } = useSocket();
  const [showUploadingSkeleton, setShowUploadingSkeleton] =
    useState<boolean>(false);
  const navigate = useNavigate();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  // Changed to handle single video selection
  const selectVideo = (videoId: number): void => {
    setSelectedVideoId(videoId);
  };

  const deselectVideo = (): void => {
    setSelectedVideoId(null);
  };

  const toggleVideoSelection = (videoId: number): void => {
    if (selectedVideoId === videoId) {
      deselectVideo();
    } else {
      selectVideo(videoId);
    }
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

  const filteredVideos = posts.filter((video) =>
    video.resourceTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Updated validation for single video
  const canProceedToStep2 = (): boolean => {
    return selectedVideoId !== null && campaignName.trim() !== "";
  };

  const canLaunchCampaign = (): boolean => {
    return (
      selectedVideoId !== null &&
      campaignName.trim() !== "" &&
      duration >= 1 &&
      parseFloat(budget) > 0 &&
      parseFloat(budget) <= walletBalance &&
      selectedRegions.length > 0
    );
  };

  const launchCampaign = async (): Promise<void> => {
    // Updated validation for single video
    if (selectedVideoId === null) {
      toast.error("Please select one video.");
      return;
    }
    if (!campaignName.trim()) {
      toast.error("Please enter a campaign name.");
      return;
    }
    if (!budget || Number(budget) <= 0) {
      toast.error("Please enter a valid budget.");
      return;
    }

    try {
      setIsLaunching(true);

      const payload = {
        campaignAmount: Number(budget),
        autoDeduct: true,
        name: campaignName,
        duration: duration,
        publisherWalletId: walletId,
        regions: selectedRegions,
        resourceIds: [selectedVideoId.toString()], // Single video ID
        isCampaign: true,
      };

      const results = await ApiService.post_api(
        "/campaign-wallet/create",
        payload
      );

      console.log("results", results);
      toast.success("🎯 Campaign launched successfully!");
      navigate({ to: "/posts" });

      // Reset form and states
      setSelectedVideoId(null);
      setCampaignName("");
      setBudget("");
      setDuration(1);
      setSelectedRegions([]);
      setShowCampaignForm(false);
      setCurrentStep(1);
    } catch (error) {
      console.error("Failed to launch campaign:", error);
      toast.error("❌ Failed to launch campaign. Please try again.");
    } finally {
      setIsLaunching(false);
    }
  };

  // Get single selected video object
  const selectedVideoObject =
    posts.find((v) => v.id === selectedVideoId) || null;

  const fetchPublisherPosts = useCallback(
    async (isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }
        const response = await ApiService.get_api(
          `/resources/publisher/${id}?isCampaign=${false}`
        );
        setPosts(response.data);
        toast.info("Campaign these Posts!!!");
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchPublisherPosts(true);
  }, [fetchPublisherPosts]);

  const fetchPublisherWallet = useCallback(
    async (isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }
        const response = await ApiService.get_api(
          `/publisher-wallet/publisher/${id}/wallet`
        );
        setWalletBalance(response.data.tokenAmount);
        setWalletId(response.data.id);
        toast.info("fetched Account Balance!!");
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchPublisherWallet(true);
  }, [fetchPublisherWallet]);

  useEffect(() => {
    if (UploadingEventData) {
      console.log(
        "🚀 Got Uploading Event Data in component:",
        UploadingEventData
      );
      setShowUploadingSkeleton(true);
    }
  }, [UploadingEventData]);

  useEffect(() => {
    if (publishedVideo) {
      setShowUploadingSkeleton(false);
      fetchPublisherPosts(false);
    }
  }, [publishedVideo, fetchPublisherPosts]);

  const getCardColor = (index: number) => {
    return cardColors[index % cardColors.length];
  };

  // Add this state at the top of your component
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Add this effect to handle HLS initialization and cleanup
  useEffect(() => {
    if (!showVideoDialog || !selectedVideoForDialog?.videoResource?.videoUrl) {
      // Cleanup when dialog closes
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    const video = videoRef.current;
    const videoUrl = selectedVideoForDialog.videoResource.videoUrl;

    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest loaded");
      });

      hls.on(Hls.Events.ERROR, (__, data) => {
        console.error("HLS error:", data);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = videoUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [showVideoDialog, selectedVideoForDialog]);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

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
                  Select one video and configure your campaign
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
        {selectedVideoId === null && (
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-b px-4 py-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-900">
                  Get started by selecting one video
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  Choose a single video from your library to feature in this
                  campaign.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Selection Summary */}
        {selectedVideoId !== null && (
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-b px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-purple-900 block">
                    1 video selected
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
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <p className="text-sm text-gray-600 font-medium">
                  Loading your posts...
                </p>
              </div>
            </div>
          )}

          {!isLoading && (
            <div className="space-y-3">
              {isRefreshing && (
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    <span className="text-sm text-purple-700 font-medium">
                      Updating posts...
                    </span>
                  </div>
                </div>
              )}
              {showUploadingSkeleton && <SkeletonDemo />}

              {filteredVideos.length === 0 && !showUploadingSkeleton && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-sm">
                    No posts found matching your criteria.
                  </p>
                </div>
              )}

              {filteredVideos.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No videos found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredVideos.map((video, index) => {
                    const colorScheme = getCardColor(index);

                    return (
                      <div
                        key={video.id}
                        className={`group ${colorScheme.bg} border ${colorScheme.border} ${colorScheme.hover} rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 cursor-pointer ${
                          selectedVideoId === video.id
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
                              src={video.imgResource.imageUrl}
                              alt={video.resourceTitle}
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
                              <span>{video.videoResource.VideoLength}</span>
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
                                {selectedVideoId === video.id ? (
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
                            {video.resourceTitle}
                          </h3>
                          <p className="text-xs text-gray-500">
                            Uploaded {formatDate(video.updatedAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
                {/* Video Element */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  controls={isPlaying}
                  playsInline
                  poster={selectedVideoForDialog.imgResource.imageUrl}
                />

                {/* Play Button Overlay - only show when not playing */}
                {!isPlaying && (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={handlePlayVideo}
                  >
                    <div className="w-20 h-20 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110">
                      <Play
                        className="w-10 h-10 text-purple-600 ml-1"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                )}
              </div>

              <h4 className="font-semibold text-gray-900 text-lg mb-2">
                {selectedVideoForDialog.resourceTitle}
              </h4>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedVideoForDialog.videoResource.VideoLength}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(
                    selectedVideoForDialog.updatedAt
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
                    selectedVideoId === selectedVideoForDialog.id
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800"
                  }`}
                >
                  {selectedVideoId === selectedVideoForDialog.id
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
                  {/* Selected Video Summary */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      Selected Video
                    </h3>
                    {selectedVideoObject && (
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                        <img
                          src={selectedVideoObject.imgResource.imageUrl}
                          alt={selectedVideoObject.resourceTitle}
                          className="w-20 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {selectedVideoObject.resourceTitle}
                          </p>
                          <p className="text-xs text-gray-600">
                            {selectedVideoObject.videoResource?.VideoLength ||
                              "N/A"}
                          </p>
                        </div>
                      </div>
                    )}
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
                      {isLaunching ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                          Launching...
                        </>
                      ) : (
                        "Launch Campaign"
                      )}
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
