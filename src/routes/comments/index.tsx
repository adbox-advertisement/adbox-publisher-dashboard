import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/comments/")({
  component: Comments,
});

function Comments() {
  return (
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus sed fuga
      cupiditate officia porro, eaque placeat labore harum facilis animi minima
      nihil nemo sequi minus veniam delectus! Dolore, at id?
    </div>
  );
}
