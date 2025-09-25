import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/analytics/")({
  component: Analytics,
});

function Analytics() {
  return (
    <div className="">
      <h1 className="text-2xl font-bold">Analytics</h1>
    </div>
  );
}
