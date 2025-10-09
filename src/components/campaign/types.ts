// Ghana regions
export const ghanaRegions = [
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

export interface PublisherPost {
  id: number;
  duration?: string;
  imageUrl: string;
  imgResource: { imageUrl: string };
  videoResource: { VideoLength: string };
  uploadDate: string; // Consider using Date type if you plan to parse it
  resourceTitle: string;
  createdAt?: string; // or Date if you plan to parse it as a Date object
  updatedAt: string; // or Date if you plan to parse it as a Date object
}

export const userVideos = [
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
