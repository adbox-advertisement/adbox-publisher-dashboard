import VideoUploads from "@/components/upload/upload";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/upload/")({
  component: VideoUploads,
});
