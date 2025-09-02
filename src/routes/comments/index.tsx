import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/comments/")({
  component: Comments,
});

function Comments() {
  return <div>Hello "/comments/"!</div>;
}
