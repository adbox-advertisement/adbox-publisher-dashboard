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
