import React, { useEffect, useRef, useState } from "react";
import { X, Heart, MessageCircle, Search, ChevronDown } from "lucide-react";
import Hls from "hls.js";

interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  isPinned: boolean;
  isCreator: boolean;
  replies: Comment[];
  isReplying?: boolean;
}

interface VideoPlayerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  companyLogo: string;
  companyName: string;
  videoTitle: string;
  videoDescription: string;
}

type FilterType = "all" | "liked";

export const VideoPlayerDialog: React.FC<VideoPlayerDialogProps> = ({
  isOpen,
  onOpenChange,
  src,
  companyLogo,
  companyName,
  videoTitle,
  videoDescription,
}) => {
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [newComment, setNewComment] = useState<string>("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [showComments, setShowComments] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  // Enhanced comments with more realistic data
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      text: "This is absolutely amazing! The production quality is top-notch 🔥",
      timestamp: "2h ago",
      likes: 42,
      isLiked: true,
      isPinned: false,
      isCreator: false,
      replies: [
        {
          id: 11,
          user: companyName,
          avatar: companyLogo,
          text: "Thank you so much! We put a lot of effort into this one 😊",
          timestamp: "1h ago",
          likes: 8,
          isLiked: false,
          isPinned: false,
          isCreator: true,
          replies: [],
        },
      ],
    },
    {
      id: 2,
      user: "Mike Chen",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      text: "Could you make a tutorial on how you achieved this effect? Would love to learn!",
      timestamp: "3h ago",
      likes: 23,
      isLiked: false,
      isPinned: false,
      isCreator: false,
      replies: [],
    },
    {
      id: 3,
      user: "Emma Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      text: "The music choice is perfect! What's the name of the track?",
      timestamp: "4h ago",
      likes: 15,
      isLiked: true,
      isPinned: false,
      isCreator: false,
      replies: [],
    },
    {
      id: 4,
      user: "David Park",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      text: "Incredible work! This deserves way more views. Sharing with my team 🚀",
      timestamp: "5h ago",
      likes: 31,
      isLiked: false,
      isPinned: false,
      isCreator: false,
      replies: [],
    },
  ]);

  // Animate dialog open/close
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 50);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 200);
    }
  }, [isOpen]);

  // Enhanced video setup effect with better mobile support
  useEffect(() => {
    if (!videoRef.current || !shouldRender) return;

    const video = videoRef.current;
    setVideoLoaded(false);

    const isHLSUrl = src.includes(".m3u8");

    if (isHLSUrl) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: false,
          lowLatencyMode: true,
          backBufferLength: 90,
        });

        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setVideoLoaded(true);
          video
            .play()
            .catch((err) =>
              console.log(
                "Autoplay blocked, interaction required:",
                err.message
              )
            );
        });

        hls.on(Hls.Events.ERROR, (__, data) => {
          console.error("HLS error:", data);

          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log(
                  "Fatal network error encountered, trying to recover..."
                );
                hls.startLoad();
                break;

              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log(
                  "Fatal media error encountered, trying to recover..."
                );
                hls.recoverMediaError();
                break;

              default:
                console.log("Unrecoverable error, destroying HLS instance...");
                hls.destroy();
                break;
            }
          } else {
            // Non-fatal errors like bufferStalledError
            if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
              console.log("Buffer stalled, attempting recovery...");
              hls.recoverMediaError();
            }
          }
        });

        return () => {
          hls.destroy();
        };
      } else {
        // Native Safari HLS
        video.src = src;
        video.load();
        setVideoLoaded(true);
      }
    } else {
      // MP4 or other video
      video.src = src;
      video.load();
      setVideoLoaded(true);
      video.addEventListener("loadedmetadata", () => {
        video
          .play()
          .catch((err) =>
            console.log("Autoplay blocked, interaction required:", err.message)
          );
      });
    }

    const handleCanPlay = () => setVideoLoaded(true);
    const handleLoadedData = () => setVideoLoaded(true);

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadeddata", handleLoadedData);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [src, shouldRender]);

  const handleLikeComment = (
    commentId: number,
    isReply: boolean = false,
    parentId?: number
  ): void => {
    setComments((prev: Comment[]) =>
      prev.map((comment: Comment) => {
        if (!isReply && comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply: Comment) =>
              reply.id === commentId
                ? {
                    ...reply,
                    isLiked: !reply.isLiked,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  }
                : reply
            ),
          };
        }
        return comment;
      })
    );
  };

  const handleAddComment = (): void => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      user: companyName,
      avatar: companyLogo,
      text: newComment,
      timestamp: "now",
      likes: 0,
      isLiked: false,
      isPinned: false,
      isCreator: true,
      replies: [],
    };

    setComments((prev: Comment[]) => [comment, ...prev]);
    setNewComment("");
  };

  const handleReply = (): void => {
    if (!replyText.trim() || !replyingTo) return;

    const reply: Comment = {
      id: Date.now(),
      user: companyName,
      avatar: companyLogo,
      text: replyText,
      timestamp: "now",
      likes: 0,
      isLiked: false,
      isPinned: false,
      isCreator: true,
      replies: [],
    };

    setComments((prev: Comment[]) =>
      prev.map((comment: Comment) =>
        comment.id === replyingTo
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    );

    setReplyText("");
    setReplyingTo(null);
  };

  const filteredComments: Comment[] = comments.filter((comment: Comment) => {
    const matchesSearch: boolean =
      comment.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.user.toLowerCase().includes(searchQuery.toLowerCase());

    switch (filterType) {
      case "liked":
        return matchesSearch && comment.isLiked;
      default:
        return matchesSearch;
    }
  });

  const CommentItem: React.FC<{
    comment: Comment;
    isReply?: boolean;
    parentId?: number;
  }> = ({ comment, isReply = false, parentId }) => (
    <div className={`${isReply ? "ml-6 sm:ml-8 md:ml-12 mt-3" : "mb-4"}`}>
      <div className="flex space-x-2 sm:space-x-3">
        <div className="relative flex-shrink-0">
          <img
            src={comment.avatar}
            alt={comment.user}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
          />
          {comment.isCreator && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-xs sm:text-sm text-gray-900 truncate">
              {comment.user}
            </span>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {comment.timestamp}
            </span>
          </div>

          <p className="text-sm text-gray-800 mb-2 leading-relaxed break-words">
            {comment.text}
          </p>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => handleLikeComment(comment.id, isReply, parentId)}
              className={`flex items-center space-x-1 text-xs ${
                comment.isLiked
                  ? "text-red-500"
                  : "text-gray-500 active:text-red-500"
              } transition-colors touch-manipulation`}
            >
              <Heart
                className={`w-3 h-3 sm:w-4 sm:h-4 ${comment.isLiked ? "fill-current" : ""}`}
              />
              <span>{comment.likes}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-xs text-gray-500 active:text-blue-500 transition-colors flex items-center space-x-1 touch-manipulation"
              >
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Reply</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          isReply={true}
          parentId={comment.id}
        />
      ))}

      {/* Reply input */}
      {replyingTo === comment.id && (
        <div className="ml-6 sm:ml-8 md:ml-12 mt-3 flex space-x-2">
          <img
            src={companyLogo}
            alt={companyName}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <input
              type="text"
              placeholder={`Reply to ${comment.user}...`}
              value={replyText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setReplyText(e.target.value)
              }
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                e.key === "Enter" && handleReply()
              }
              className="w-full border border-gray-300 rounded-full px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleReply}
                className="px-3 sm:px-4 py-1 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 active:bg-blue-700 transition-colors touch-manipulation"
              >
                Reply
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText("");
                }}
                className="px-3 sm:px-4 py-1 text-gray-500 text-xs active:text-gray-700 transition-colors touch-manipulation"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-200 ease-out ${
        isAnimating ? "bg-black/60 opacity-100" : "bg-black/0 opacity-0"
      }`}
    >
      <div
        className={`fixed inset-0 w-full h-full bg-white transition-transform duration-200 ease-out ${
          isAnimating ? "scale-100" : "scale-95"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-black/50 hover:bg-black/70 active:bg-black/80 text-white rounded-full p-2 transition-colors touch-manipulation"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Mobile Layout */}
        <div className="flex flex-col h-full lg:hidden">
          {/* Video Section */}
          <div
            className="relative bg-black flex-shrink-0"
            style={{ height: "40vh" }}
          >
            <video
              ref={videoRef}
              controls
              playsInline // Critical for iOS inline playback
              webkit-playsinline="true" // Legacy iOS support
              muted={false} // Allow sound on mobile
              preload="metadata" // Better mobile performance
              className="w-full h-full object-contain"
              onLoadStart={() => console.log("Video load started")}
              onCanPlay={() => console.log("Video can play")}
              onError={(e: React.SyntheticEvent<HTMLVideoElement, Event>) =>
                console.error("Video error:", e)
              }
            />

            {/* Loading indicator */}
            {!videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>

          {/* Video Info Header */}
          <div className="p-3 sm:p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={companyLogo}
                alt={companyName}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-gray-800 truncate">
                  {companyName}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{comments.length} comments</span>
                  <span>•</span>
                  <span>
                    {comments.reduce((acc, c) => acc + c.likes, 0)} likes
                  </span>
                </div>
              </div>
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
              {videoTitle}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
              {videoDescription}
            </p>
          </div>

          {/* Comments Toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 border-b border-gray-200 touch-manipulation"
          >
            <span className="text-sm font-medium text-gray-700">
              Comments ({comments.length})
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showComments ? "rotate-180" : ""}`}
            />
          </button>

          {/* Comments Section (Mobile) */}
          {showComments && (
            <div className="flex-1 flex flex-col bg-white min-h-0">
              {/* Search and Filter */}
              <div className="p-3 sm:p-4 border-b border-gray-200 space-y-3">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search comments..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchQuery(e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFilterType(e.target.value as FilterType)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                  >
                    <option value="all">All</option>
                    <option value="liked">Liked</option>
                  </select>
                </div>

                {/* Add Comment */}
                <div className="flex space-x-2">
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewComment(e.target.value)
                      }
                      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                        e.key === "Enter" && handleAddComment()
                      }
                      className="flex-1 border border-gray-300 rounded-full px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                {filteredComments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">
                      {searchQuery
                        ? "No comments found matching your search."
                        : "No comments yet. Be the first to comment!"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredComments.map((comment) => (
                      <CommentItem key={comment.id} comment={comment} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex h-full">
          {/* Left Section - Video */}
          <div
            className={`flex-[0.6] bg-black relative transition-all duration-500 delay-100 ${
              isAnimating
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }`}
          >
            <video
              ref={videoRef}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
              onLoadStart={() => console.log("Desktop video load started")}
              onCanPlay={() => console.log("Desktop video can play")}
              onError={(e: React.SyntheticEvent<HTMLVideoElement, Event>) =>
                console.error("Desktop video error:", e)
              }
            />

            {/* Loading indicator */}
            {!videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}
          </div>

          {/* Right Section - Info */}
          <div
            className={`flex-[0.4] bg-white border-l border-gray-200 transition-all duration-500 delay-200 ${
              isAnimating
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div className="w-full h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="w-12 h-12 rounded-full border border-gray-300"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {companyName}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{comments.length} comments</span>
                      <span>•</span>
                      <span>
                        {comments.reduce((acc, c) => acc + c.likes, 0)} likes
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {videoTitle}
                  </h2>
                  <p className="text-gray-600 text-sm">{videoDescription}</p>
                </div>
              </div>

              {/* Comments Controls */}
              <div className="p-4 border-b border-gray-200 space-y-3">
                {/* Search and Filter */}
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search comments..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchQuery(e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={filterType}
                      onChange={(e) =>
                        setFilterType(e.target.value as "all" | "liked")
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All</option>
                      <option value="liked">Liked</option>
                    </select>
                  </div>
                </div>

                {/* Add Comment */}
                <div className="flex space-x-3">
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewComment(e.target.value)
                      }
                      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                        e.key === "Enter" && handleAddComment()
                      }
                      className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4">
                {filteredComments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchQuery
                        ? "No comments found matching your search."
                        : "No comments yet. Be the first to comment!"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredComments.map((comment) => (
                      <CommentItem key={comment.id} comment={comment} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
