import { LivePost } from "@/components/post/livePost";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/")({
  component: LivePost,
});
