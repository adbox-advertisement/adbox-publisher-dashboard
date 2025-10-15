export interface Post {
  id: number;
  resourceTitle: string; // Changed from 'title' to match 'post.resourceTitle'
  status: "public" | "private";
  deletestatus: "public" | "private";
  videoResource: {
    thumbnail: {
      imageUrl: string; // Matches 'post.videoResource.thumbnail.imageUrl'
    };
    VideoLength: string | null; // Matches 'post.videoResource.VideoLength'
  };
  type: "video" | "image"; // Unchanged
  duration: string | null; // Unchanged
  createdAt: string | null; // Unchanged
  _count: {
    ViewerViewsOnResource: number; // Matches 'post._count.ViewerViewsOnResource'
    ViewerLikesOnResource: number; // Matches 'post._count.ViewerLikesOnResource'
    ViewerCommentsOnResource: number; // Matches 'post._count.ViewerCommentsOnResource'
  };
}

export type SortBy = "views" | "likes" | "comments" | "date";
export type SortOrder = "asc" | "desc";

export const cardColors = [
  {
    bg: "bg-gradient-to-br from-purple-50/30 to-pink-50/30",
    border: "border-purple-100",
    hover: "hover:shadow-purple-200/50",
  },
  {
    bg: "bg-gradient-to-br from-blue-50/30 to-cyan-50/30",
    border: "border-blue-100",
    hover: "hover:shadow-blue-200/50",
  },
  {
    bg: "bg-gradient-to-br from-green-50/30 to-emerald-50/30",
    border: "border-green-100",
    hover: "hover:shadow-green-200/50",
  },
  {
    bg: "bg-gradient-to-br from-orange-50/30 to-amber-50/30",
    border: "border-orange-100",
    hover: "hover:shadow-orange-200/50",
  },
  {
    bg: "bg-gradient-to-br from-rose-50/30 to-red-50/30",
    border: "border-rose-100",
    hover: "hover:shadow-rose-200/50",
  },
  {
    bg: "bg-gradient-to-br from-indigo-50/30 to-violet-50/30",
    border: "border-indigo-100",
    hover: "hover:shadow-indigo-200/50",
  },
];

export interface UserProfile {
  id: number;
  viewer: {
    fullName: string;
    image?: string;
  };
  name: string;

  avatar?: string;
  profileImage?: string;
}
