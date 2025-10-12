import { useCallback, useEffect, useState } from "react";
import {
  FiSearch,
  FiDownload,
  FiEdit,
  FiTrash2,
  FiVideo,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiPlay,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { Eye, Heart, MessageCircle, Lock } from "lucide-react";

import ApiService from "@/helpers/api.service";
import { Storage } from "@/helpers/local.storage";
import { toast } from "sonner";
import { useSocket } from "@/context/SocketContext";
import { Edit3, Globe, Loader2, Play, Trash2 } from "lucide-react";
import { CampaignChip } from "@/components/post/campaignChip";
import { formatDate } from "@/helpers/utilFunctions";
import CampaignSkeletonDemo from "@/components/post/CampaignSkeleton";
import { cardColors } from "@/components/post/interface";
import { VideoPlayerDialog } from "@/components/post/player";
import EditVideoPlayerDialog from "@/components/post/edit";
import DeleteCampaignDialog from "./DeleteCampaignDialog";

export function LivePost() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaignPosts, setCampaignPosts] = useState<any[]>([]);
  const [showUploadingSkeleton, setShowUploadingSkeleton] =
    useState<boolean>(false);
  const [updatingPrivacyPostId, setUpdatingPrivacyPostId] = useState<
    number | null
  >(null);

  const [activePostMenu, setActivePostMenu] = useState<number | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const { UploadingEventData, publishedVideo } = useSocket();

  const filteredCampaigns = campaignPosts.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateProgress = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const fetchPublisherPosts = useCallback(async (isInitialLoad = false) => {
    const { id } = Storage.getPublisherId("publisherId") || {};
    try {
      if (isInitialLoad) {
        setIsLoading(true);
      }
      const response = await ApiService.get_api(
        `/campaign-wallet/publisher/${id}/campaign`
      );
      setCampaignPosts(response.data);
      toast.info("Your campaign!!!");
      console.log("response : ", response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !document
          .querySelector(`.post-menu-${activePostMenu}`)
          ?.contains(target)
      ) {
        setActivePostMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activePostMenu]);

  useEffect(() => {
    fetchPublisherPosts(true);
  }, [fetchPublisherPosts]);

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

  function getTotalVideoLengthInSeconds(campaign: any): number {
    let totalSeconds = 0;
    const resources = campaign.resources || [];

    for (const resource of resources) {
      const length = resource?.videoResource?.VideoLength;
      if (!length) continue;

      const parts = length.split(":").map(Number);
      let seconds = 0;

      if (parts.length === 2) {
        const [minutes, secs] = parts;
        seconds = minutes * 60 + secs;
      } else if (parts.length === 3) {
        const [hours, minutes, secs] = parts;
        seconds = hours * 3600 + minutes * 60 + secs;
      }

      totalSeconds += seconds;
    }

    return totalSeconds;
  }

  function getRegionCount(campaign: any): number {
    if (!campaign?.resources) return 0;

    // Collect all regions from all resources
    const allRegions = campaign.resources.flatMap(
      (res: any) => res.regions || []
    );

    // Remove duplicates
    const uniqueRegions = [...new Set(allRegions)];

    return uniqueRegions.length;
  }
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [expandedCampaigns, setExpandedCampaigns] = useState(new Set());

  const toggleCampaignVideos = (campaignId: any) => {
    setExpandedCampaigns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const togglePrivacy = async (postId: number) => {
    try {
      setUpdatingPrivacyPostId(postId);

      // Find the post within the resources array
      const currentPost = campaignPosts
        .flatMap((campaign) => campaign.resources)
        .find((post) => post.id === postId);

      if (!currentPost) {
        toast.error("Post not found");
        return;
      }

      const newStatus = currentPost.status === "private" ? "public" : "private";

      await ApiService.put_api(`/resources/publisher/${postId}/update`, {
        status: newStatus,
      });

      // Update the nested resources array
      setCampaignPosts(
        campaignPosts.map((campaign) => ({
          ...campaign,
          resources: campaign.resources.map((post: any) =>
            post.id === postId ? { ...post, status: newStatus } : post
          ),
        }))
      );

      toast.success(`Post made ${newStatus} successfully!`);
    } catch (error) {
      console.error("Failed to update post privacy:", error);
      toast.error("Failed to update post privacy. Please try again.");
    } finally {
      setUpdatingPrivacyPostId(null);
      setActivePostMenu(null);
    }
  };

  function extractVideoTitle(filename: string): string {
    const match = filename.match(/_\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z/);
    if (!match) return filename;

    return filename.slice(0, match.index).replace(/_+$/, "").trim();
  }

  const getCardColor = (index: number) => {
    return cardColors[index % cardColors.length];
  };
  function calculateTotalBudget(
    campaigns: { campaignAmount: number }[]
  ): number {
    return campaigns.reduce(
      (total, campaign) => total + (campaign.campaignAmount || 0),
      0
    );
  }

  const [videoUrl, setVideoUrl] = useState<string>("");
  const handleThumbnailClick = (postId: number, videoUrl?: string): void => {
    setVideoUrl(videoUrl || "");
    setSelectedPostId(postId);
    setIsDialogOpen(true);
  };
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEditClick = (postId: number): void => {
    setSelectedPostId(postId);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto pb-8">
      {/* Summary Cards */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-700 text-sm font-medium">
                Total Budget
              </span>
              <div className="bg-purple-200 rounded-full p-2">
                <FiDollarSign className="w-4 h-4 text-purple-700" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-purple-900">
              {/* GHS {totalBudget.toLocaleString()} */}
              GHS {calculateTotalBudget(campaignPosts).toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-700 text-sm font-medium">
                Total Spent
              </span>
              <div className="bg-green-200 rounded-full p-2">
                <FiDollarSign className="w-4 h-4 text-green-700" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-900">
              {/* GHS {totalSpent.toLocaleString()} */}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-700 text-sm font-medium">
                Active Campaigns
              </span>
              <div className="bg-blue-200 rounded-full p-2">
                <FiPlay className="w-4 h-4 text-blue-700" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-blue-900">
              {campaignPosts.reduce(
                (total, campaign) => total + (campaign.resources?.length || 0),
                0
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="paused">Paused</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <FiDownload className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {showUploadingSkeleton && <CampaignSkeletonDemo />}

      {/* {filteredCampaigns.length === 0 && !showUploadingSkeleton && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-sm">
            No posts found matching your criteria.
          </p>
        </div>
      )} */}

      {isLoading && !showUploadingSkeleton && <CampaignSkeletonDemo />}

      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FiVideo className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          filteredCampaigns.map((campaign, index) => {
            const colorScheme = getCardColor(index);

            return (
              <div
                key={campaign.id}
                className={`${colorScheme.bg} rounded-xl border ${colorScheme.border} hover:shadow-lg ${colorScheme.hover} transition-all duration-200`}
              >
                {/* Campaign Header */}
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                          {extractVideoTitle(campaign.name)}
                        </h3>
                        <CampaignChip />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          {formatDate(campaign.createdAt)} -{" "}
                          {formatDate(campaign.endDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <FiEdit className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                        <FiTrash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                  {/* Campaign Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Videos */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FiVideo className="w-4 h-4 text-gray-600" />
                        <span className="text-xs font-medium text-gray-600">
                          Videos
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {campaign.resources.length} video
                        {campaign.resources.length !== 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Total: {getTotalVideoLengthInSeconds(campaign)}s
                      </p>
                    </div>

                    {/* Budget */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FiDollarSign className="w-4 h-4 text-gray-600" />
                        <span className="text-xs font-medium text-gray-600">
                          Budget
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        GHS {campaign.campaignAmount.toLocaleString()}
                      </p>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#764ba2] to-[#667eea] h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${calculateProgress(campaign.spent, campaign.campaignAmount)}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {calculateProgress(
                            campaign.spent,
                            campaign.campaignAmount
                          ).toFixed(0)}
                          % spent
                        </p>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FiClock className="w-4 h-4 text-gray-600" />
                        <span className="text-xs font-medium text-gray-600">
                          Duration
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {Math.ceil(
                          (new Date(campaign.endDate).getTime() -
                            new Date(campaign.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Campaign period
                      </p>
                    </div>

                    {/* Regions */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FiMapPin className="w-4 h-4 text-gray-600" />
                        <span className="text-xs font-medium text-gray-600">
                          Locations
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {getRegionCount(campaign)} region
                        {getRegionCount(campaign) !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  {/* Videos List - ACCORDION */}
                  <div className="border-t border-gray-200 pt-4">
                    <button
                      onClick={() => toggleCampaignVideos(campaign.id)}
                      className="w-full cursor-pointer flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <FiVideo
                          className="w-4 h-4 text-purple-700 "
                          style={{
                            animation: "wiggle 0.6s ease-in-out infinite",
                          }}
                        />
                        <h4 className="text-sm font-semibold text-gray-700">
                          Campaign Videos ({campaign.resources.length})
                        </h4>
                      </div>
                      {expandedCampaigns.has(campaign.id) ? (
                        <FiChevronUp className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                      ) : (
                        <FiChevronDown className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                      )}
                    </button>

                    <style>{`
                           @keyframes wiggle {
                           0%, 100% { transform: rotate(-8deg); }
                             50% { transform: rotate(8deg); }
                                  }
                       `}</style>

                    {/* Expandable Content ------------------------------- */}
                    {/* Expandable Campaign Videos Section */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        expandedCampaigns.has(campaign.id)
                          ? "max-h-[2500px] opacity-100 mt-4"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="space-y-3">
                        {campaign.resources.map((video: any) => (
                          <div
                            key={video.id}
                            className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all shadow-sm"
                          >
                            {/* Thumbnail Section */}
                            <div
                              onClick={() =>
                                handleThumbnailClick(
                                  video.id,
                                  video.videoResource?.videoUrl
                                )
                              }
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  handleThumbnailClick(video.id);
                                }
                              }}
                              aria-label={`Play video: ${video.resourceTitle}`}
                              className="relative flex-shrink-0 group cursor-pointer w-full sm:w-32 md:w-40"
                            >
                              <img
                                src={video.videoResource?.thumbnail?.imageUrl}
                                alt={video.resourceTitle}
                                className="w-full aspect-video rounded-lg object-cover border border-gray-200 transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-md"
                              />

                              {/* Play Overlay */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-6 h-6 text-white drop-shadow-lg" />
                              </div>

                              {/* Video Length */}
                              {video.videoResource?.VideoLength && (
                                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded-md">
                                  {video.videoResource.VideoLength}
                                </div>
                              )}
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 min-w-0 space-y-3">
                              {/* Title and Privacy Status */}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="font-semibold text-gray-900 text-base truncate">
                                  {video.resourceTitle}
                                </p>
                                <span
                                  className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${
                                    video.status === "private"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : "bg-green-50 text-green-700 border-green-200"
                                  }`}
                                >
                                  {video.status === "private" ? (
                                    <>
                                      <Lock className="w-3 h-3" /> Private
                                    </>
                                  ) : (
                                    <>
                                      <Globe className="w-3 h-3" /> Public
                                    </>
                                  )}
                                </span>
                              </div>

                              {/* Metadata */}
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                                {video.createdAt && (
                                  <span>
                                    Uploaded:{" "}
                                    <span className="text-gray-800 font-medium">
                                      {video.createdAt && (
                                        <span className="text-gray-800 text-xs sm:text-sm">
                                          {new Date(
                                            video.createdAt
                                          ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                          })}
                                        </span>
                                      )}
                                    </span>
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3 text-gray-400" />
                                  <span className="font-medium">
                                    {formatNumber(
                                      video._count.ViewerViewsOnResource
                                    )}
                                  </span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3 text-gray-400" />
                                  <span className="font-medium">
                                    {formatNumber(
                                      video._count.ViewerLikesOnResource
                                    )}
                                  </span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3 text-gray-400" />
                                  <span className="font-medium">
                                    {formatNumber(
                                      video._count.ViewerCommentsOnResource
                                    )}
                                  </span>
                                </span>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-2 pt-2">
                                <button
                                  onClick={() => togglePrivacy(video.id)}
                                  disabled={updatingPrivacyPostId === video.id}
                                  className={`flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    video.status === "private"
                                      ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                                      : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                                  }`}
                                >
                                  {updatingPrivacyPostId === video.id ? (
                                    <>
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                      <span>Updating...</span>
                                    </>
                                  ) : video.status === "private" ? (
                                    <>
                                      <Globe className="w-3 h-3" />
                                      <span>Make Public</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-3 h-3" />
                                      <span>Make Private</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  onClick={() => handleEditClick(video.id)}
                                  className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setIsDeleteOpen(true);
                                  }}
                                  className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Regions List */}{" "}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    {" "}
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      {" "}
                      Target Regions{" "}
                    </h4>{" "}
                    <div className="flex flex-wrap gap-2">
                      {" "}
                      {[
                        ...new Set(
                          campaign.resources?.flatMap(
                            (res: any) => res.regions || []
                          ) || []
                        ),
                      ].map((region: any) => (
                        <span
                          key={region}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                        >
                          {" "}
                          {region}{" "}
                        </span>
                      ))}{" "}
                    </div>{" "}
                  </div>
                  {/* Performance Stats */}
                  {campaign.status !== "scheduled" && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Performance
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">
                            Impressions
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {campaign.impressions?.toLocaleString() || "0"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Clicks</p>
                          <p className="text-lg font-bold text-gray-900">
                            {campaign.clicks?.toLocaleString() || "0"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">CTR</p>
                          <p className="text-lg font-bold text-gray-900">
                            {campaign.impressions > 0
                              ? (
                                  (campaign.clicks / campaign.impressions) *
                                  100
                                ).toFixed(2)
                              : 0}
                            %
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">
                            Cost/Click
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            GHS{" "}
                            {campaign.clicks > 0
                              ? (campaign.spent / campaign.clicks).toFixed(2)
                              : 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <DeleteCampaignDialog
          isOpen={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onConfirm={() => console.log("Campaign deleted")}
          campaignName="Summer Promo 2025"
        />

        {selectedPostId && (
          <VideoPlayerDialog
            src={videoUrl}
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            companyLogo="https://placehold.co/100x100.png"
            companyName="Adbox Gh"
            videoTitle="Getting Started with Our Platform"
            videoDescription="This video walks you through the basics of using our dashboard, managing content, and understanding the key features."
          />
        )}
        {selectedPostId && (
          <EditVideoPlayerDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
        )}
      </div>
    </div>
  );
}
