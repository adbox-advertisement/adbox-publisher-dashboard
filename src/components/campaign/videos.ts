// export interface Video {
//   id: number;
//   title: string;
//   thumbnail: string;
//   duration: string;
//   views: number;
//   engagement: string;
//   uploaded: string;
// }

export interface CampaignObjective {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
}

export type Step = "videos" | "details" | "budget" | "review" | "success";

// // Mock user videos
// export const userVideos: Video[] = [
//   {
//     id: 1,
//     title: "Amazing sunset timelapse",
//     thumbnail:
//       "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=400&fit=crop",
//     duration: "0:45",
//     views: 15420,
//     engagement: "4.2%",
//     uploaded: "2 days ago",
//   },
//   {
//     id: 2,
//     title: "Cooking tutorial: Perfect pasta",
//     thumbnail:
//       "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=400&fit=crop",
//     duration: "2:15",
//     views: 8930,
//     engagement: "3.8%",
//     uploaded: "5 days ago",
//   },
//   {
//     id: 3,
//     title: "Dance challenge compilation",
//     thumbnail:
//       "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=400&fit=crop",
//     duration: "1:30",
//     views: 23100,
//     engagement: "5.1%",
//     uploaded: "1 week ago",
//   },
// ];

export interface Video {
  id: number;
  title: string;
  hlsUrl: string; // Changed from thumbnail
  duration: string;
  views: number;
  engagement: string;
  thumbnail: string;
  uploaded: string;
}

export const userVideos: Video[] = [
  {
    id: 1,
    title: "Amazing sunset timelapse",
    hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    thumbnail:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=400&fit=crop",
    duration: "0:45",
    views: 15420,
    engagement: "4.2%",
    uploaded: "2 days ago",
  },
  {
    id: 2,
    title: "Cooking tutorial: Perfect pasta",
    hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    thumbnail:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=400&fit=crop",

    duration: "2:15",
    views: 8930,
    engagement: "3.8%",
    uploaded: "5 days ago",
  },
  {
    id: 3,
    title: "Dance challenge compilation",
    thumbnail:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=400&fit=crop",

    hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    duration: "1:30",
    views: 23100,
    engagement: "5.1%",
    uploaded: "1 week ago",
  },
];
