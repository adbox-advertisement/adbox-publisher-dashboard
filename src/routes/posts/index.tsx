import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type JSX, useCallback } from "react";
import {
  Eye,
  Heart,
  MessageCircle,
  Play,
  Search,
  Edit3,
  Trash2,
  Lock,
  Globe,
  Filter,
  X,
  Loader2,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSocket } from "../../context/SocketContext";
import type { Post, SortBy, SortOrder } from "../../components/post/interface";
import { SkeletonCard } from "../../components/post/skeleton";
import ApiService from "@/helpers/api.service";
import { toast } from "sonner";
import { Storage } from "@/helpers/local.storage";
import { VideoPlayerDialog } from "@/components/post/player";
import EditVideoPlayerDialog from "@/components/post/edit";

// Campaign Chip Component
const CampaignChip = () => (
  <div className="relative mr-4 mt-4 flex items-center ">
    <div className="relative">
      {/* Beeping animation rings */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full opacity-75 animate-ping"></div>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full opacity-50 animate-pulse"></div>
      {/* Main chip */}
      <div className="relative bg-gradient-to-r from-purple-500 to-violet-600 text-white px-2 py-1 rounded-full shadow-lg flex items-center gap-1 text-xs sm:px-3 sm:gap-1.5">
        <Zap className="w-3 h-3 animate-pulse sm:w-3 sm:h-3" />
        <span className="font-semibold whitespace-nowrap">Go Live</span>
      </div>
    </div>
  </div>
);

export const Route = createFileRoute("/posts/")({
  component: Posts,
});

function Posts(): JSX.Element {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showFiltersDialog, setShowFiltersDialog] = useState<boolean>(false);
  const [activePostMenu, setActivePostMenu] = useState<number | null>(null);
  const [showUploadingSkeleton, setShowUploadingSkeleton] =
    useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [updatingPrivacyPostId, setUpdatingPrivacyPostId] = useState<
    number | null
  >(null);
  const [appliedMinViews, setAppliedMinViews] = useState<string>("");
  const [appliedMinLikes, setAppliedMinLikes] = useState<string>("");
  const [appliedMinComments, setAppliedMinComments] = useState<string>("");
  const [appliedPrivacyFilter, setAppliedPrivacyFilter] = useState<
    "all" | "public" | "private"
  >("all");
  const [tempMinViews, setTempMinViews] = useState<string>("");
  const [tempMinLikes, setTempMinLikes] = useState<string>("");
  const [tempMinComments, setTempMinComments] = useState<string>("");
  const [tempPrivacyFilter, setTempPrivacyFilter] = useState<
    "all" | "public" | "private"
  >("all");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const fetchPublisherPosts = useCallback(async (isInitialLoad = false) => {
    const { id } = Storage.getPublisherId("publisherId") || {};
    try {
      if (isInitialLoad) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      const response = await ApiService.get_api(`/resources/publisher/${id}`);
      setPosts(response.data);
      toast.info("Your Posts!!!");
      console.log("response : ", response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPublisherPosts(true);
  }, [fetchPublisherPosts]);

  const { UploadingEventData, publishedVideo } = useSocket();

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

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const handleDelete = (postId: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((post) => post.id !== postId));
    }
    setActivePostMenu(null);
  };

  const togglePrivacy = async (postId: number) => {
    try {
      setUpdatingPrivacyPostId(postId);
      const currentPost = posts.find((post) => post.id === postId);
      if (!currentPost) {
        toast.error("Post not found");
        return;
      }
      const newStatus = currentPost.status === "private" ? "public" : "private";
      await ApiService.put_api(`/resources/publisher/${postId}/update`, {
        status: newStatus,
      });
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, status: newStatus } : post
        )
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

  const openFiltersDialog = () => {
    setTempMinViews(appliedMinViews);
    setTempMinLikes(appliedMinLikes);
    setTempMinComments(appliedMinComments);
    setTempPrivacyFilter(appliedPrivacyFilter);
    setShowFiltersDialog(true);
  };

  const applyFilters = () => {
    setAppliedMinViews(tempMinViews);
    setAppliedMinLikes(tempMinLikes);
    setAppliedMinComments(tempMinComments);
    setAppliedPrivacyFilter(tempPrivacyFilter);
    setShowFiltersDialog(false);
  };

  const clearAllFilters = () => {
    setTempMinViews("");
    setTempMinLikes("");
    setTempMinComments("");
    setTempPrivacyFilter("all");
    setAppliedMinViews("");
    setAppliedMinLikes("");
    setAppliedMinComments("");
    setAppliedPrivacyFilter("all");
    setSearchTerm("");
    setSortBy("date");
    setSortOrder("desc");
  };

  const clearIndividualFilter = (filterType: string) => {
    switch (filterType) {
      case "views":
        setAppliedMinViews("");
        break;
      case "likes":
        setAppliedMinLikes("");
        break;
      case "comments":
        setAppliedMinComments("");
        break;
      case "privacy":
        setAppliedPrivacyFilter("all");
        break;
    }
  };

  const hasActiveFilters = () => {
    return (
      appliedMinViews ||
      appliedMinLikes ||
      appliedMinComments ||
      appliedPrivacyFilter !== "all"
    );
  };

  const filteredPosts: Post[] = posts
    .filter((post) => {
      const matchesSearch = post.resourceTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesViews =
        !appliedMinViews ||
        post._count.ViewerViewsOnResource >= parseInt(appliedMinViews);
      const matchesLikes =
        !appliedMinLikes ||
        post._count.ViewerLikesOnResource >= parseInt(appliedMinLikes);
      const matchesComments =
        !appliedMinComments ||
        post._count.ViewerCommentsOnResource >= parseInt(appliedMinComments);
      const matchesPrivacy =
        appliedPrivacyFilter === "all" ||
        (appliedPrivacyFilter === "public" && post.status === "public") ||
        (appliedPrivacyFilter === "private" && post.status === "private");
      return (
        matchesSearch &&
        matchesViews &&
        matchesLikes &&
        matchesComments &&
        matchesPrivacy
      );
    })
    .sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortBy) {
        case "views":
          aVal = a._count.ViewerViewsOnResource;
          bVal = b._count.ViewerViewsOnResource;
          break;
        case "likes":
          aVal = a._count.ViewerLikesOnResource;
          bVal = b._count.ViewerLikesOnResource;
          break;
        case "comments":
          aVal = a._count.ViewerCommentsOnResource;
          bVal = b._count.ViewerCommentsOnResource;
          break;
        case "date":
          aVal = new Date(a.createdAt || "1970-01-01").getTime();
          bVal = new Date(b.createdAt || "1970-01-01").getTime();
          break;
        default:
          return 0;
      }
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
    });

  const handleThumbnailClick = (postId: number): void => {
    setSelectedPostId(postId);
    setIsDialogOpen(true);
  };

  const handleEditClick = (postId: number): void => {
    setSelectedPostId(postId);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="px-3 py-4 max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        {/* Mobile-First Header */}
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-900 mb-4 sm:text-xl">
            My Posts
          </h1>
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent text-sm"
              disabled={isLoading}
            />
          </div>
          {/* Controls Row */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <Dialog
              open={showFiltersDialog}
              onOpenChange={setShowFiltersDialog}
            >
              <DialogTrigger asChild>
                <button
                  onClick={openFiltersDialog}
                  disabled={isLoading}
                  className={`flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all font-medium text-sm ${
                    hasActiveFilters()
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : ""
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {hasActiveFilters() && (
                    <span className="bg-indigo-500 text-white text-xs rounded-full w-2 h-2"></span>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md mx-auto bg-white backdrop-blur-sm rounded-2xl">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-base font-semibold text-gray-900">
                    Advanced Filters
                  </DialogTitle>
                  <DialogDescription className="text-xs text-gray-600 mt-1">
                    Set your filtering preferences and tap apply to update
                    results.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Minimum Views
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={100000}
                        step={1000}
                        value={tempMinViews || 0}
                        onChange={(e) => setTempMinViews(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {tempMinViews
                          ? `≥ ${formatNumber(parseInt(tempMinViews))} views`
                          : "No minimum"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Minimum Likes
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={5000}
                        step={50}
                        value={tempMinLikes || 0}
                        onChange={(e) => setTempMinLikes(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {tempMinLikes
                          ? `≥ ${formatNumber(parseInt(tempMinLikes))} likes`
                          : "No minimum"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Minimum Comments
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={1000}
                        step={10}
                        value={tempMinComments || 0}
                        onChange={(e) => setTempMinComments(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {tempMinComments
                          ? `≥ ${formatNumber(parseInt(tempMinComments))} comments`
                          : "No minimum"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Privacy
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["all", "public", "private"].map((option) => (
                        <button
                          key={option}
                          onClick={() =>
                            setTempPrivacyFilter(
                              option as "all" | "public" | "private"
                            )
                          }
                          className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                            tempPrivacyFilter === option
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 active:bg-gray-100"
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={clearAllFilters}
                    className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-xl transition-all font-medium text-sm"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={applyFilters}
                    className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl transition-all font-medium shadow-sm text-sm"
                  >
                    Apply Filters
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                disabled={isLoading}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="date">Sort by Date</option>
                <option value="views">Sort by Views</option>
                <option value="likes">Sort by Likes</option>
                <option value="comments">Sort by Comments</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                disabled={isLoading}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
          {hasActiveFilters() && (
            <div className="flex flex-wrap gap-2 mt-4">
              {appliedMinViews && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                  ≥ {formatNumber(parseInt(appliedMinViews))} Views
                  <button
                    onClick={() => clearIndividualFilter("views")}
                    className="hover:bg-indigo-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {appliedMinLikes && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                  ≥ {formatNumber(parseInt(appliedMinLikes))} Likes
                  <button
                    onClick={() => clearIndividualFilter("likes")}
                    className="hover:bg-indigo-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {appliedMinComments && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                  ≥ {formatNumber(parseInt(appliedMinComments))} Comments
                  <button
                    onClick={() => clearIndividualFilter("comments")}
                    className="hover:bg-indigo-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {appliedPrivacyFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full capitalize">
                  {appliedPrivacyFilter} Only
                  <button
                    onClick={() => clearIndividualFilter("privacy")}
                    className="hover:bg-indigo-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        {/* Loading State */}
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
        {/* Posts List */}
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
            {showUploadingSkeleton && (
              <div className="space-y-3">
                {[1].map((i) => (
                  <SkeletonCard key={`uploading-${i}`} index={i - 1} />
                ))}
              </div>
            )}
            {filteredPosts.length === 0 && !showUploadingSkeleton && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-sm">
                  No posts found matching your criteria.
                </p>
              </div>
            )}
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-gray-200 transition-colors hover:shadow-sm"
              >
                <div className="p-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="relative flex-shrink-0 cursor-pointer group"
                      onClick={() => handleThumbnailClick(post.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleThumbnailClick(post.id);
                        }
                      }}
                      aria-label={`Play video: ${post.resourceTitle}`}
                    >
                      <img
                        src={post.videoResource.thumbnail.imageUrl}
                        alt={post.resourceTitle}
                        className="w-20 h-20 rounded-lg object-cover border border-gray-200 transition-transform duration-200 group-hover:scale-105 group-hover:shadow-md sm:w-24 sm:h-24"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-white drop-shadow-lg" />
                      </div>
                      {post.videoResource.VideoLength && (
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                          {post.videoResource.VideoLength}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex  items-start justify-between mb-2">
                        <h3 className="text-gray-900 font-semibold text-sm leading-tight pr-2 line-clamp-2 sm:text-base">
                          {post.resourceTitle}
                        </h3>
                        <CampaignChip />
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                            post.status === "private"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {post.status === "private" ? (
                            <>
                              <Lock className="w-3 h-3" />
                              Private
                            </>
                          ) : (
                            <>
                              <Globe className="w-3 h-3" />
                              Public
                            </>
                          )}
                        </span>
                        {post.createdAt && (
                          <span className="text-gray-500 text-xs">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3 sm:flex sm:gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-gray-400" />
                          <span className="font-medium">
                            {formatNumber(post._count.ViewerViewsOnResource)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-gray-400" />
                          <span className="font-medium">
                            {formatNumber(post._count.ViewerLikesOnResource)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-gray-400" />
                          <span className="font-medium">
                            {formatNumber(post._count.ViewerCommentsOnResource)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => togglePrivacy(post.id)}
                          disabled={updatingPrivacyPostId === post.id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            post.status === "private"
                              ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                              : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                          }`}
                        >
                          {updatingPrivacyPostId === post.id ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Updating...</span>
                            </>
                          ) : post.status === "private" ? (
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
                          onClick={() => handleEditClick(post.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Video Player Dialog */}
        {selectedPostId && (
          <VideoPlayerDialog
            src="https://adbox-bucket.s3.us-east-1.amazonaws.com/videos/0e4c37b8-5e2c-477d-996f-50a618ebd134/hls/master.m3u8"
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            companyLogo="https://placehold.co/100x100.png"
            companyName="Adbox Gh"
            videoTitle="Getting Started with Our Platform"
            videoDescription="This video walks you through the basics of using our dashboard, managing content, and understanding the key features."
          />
        )}
        {/* Edit Video Dialog */}
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
