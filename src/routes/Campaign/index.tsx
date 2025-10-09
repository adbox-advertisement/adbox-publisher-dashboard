import { Campaign } from "@/components/campaign/Campaign";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/Campaign/")({
  component: Campaign,
});
