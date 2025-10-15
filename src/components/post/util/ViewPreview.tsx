import type { UserProfile } from "../types/interface";

export function ViewPreview({
  views,
  onViewAll,
}: {
  views: UserProfile[];
  onViewAll: () => void;
}) {
  if (!views || views.length === 0) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayUsers = views.slice(0, 3);
  const remaining = views.length - displayUsers.length;

  const getViewText = () => {
    if (views.length === 1) return `Viewed by ${views[0].viewer.fullName}`;
    if (views.length === 2)
      return `Viewed by ${views[0].viewer.fullName} and ${views[1].viewer.fullName}`;
    if (views.length === 3)
      return `Viewed by ${views[0].viewer.fullName}, ${views[1].viewer.fullName} and ${views[2].viewer.fullName}`;
    return `Viewed by ${views[0].viewer.fullName}, ${views[1].viewer.fullName} and ${remaining} ${remaining === 1 ? "other" : "others"}`;
  };

  return (
    <button
      onClick={onViewAll}
      className="flex items-center gap-2 hover:underline group"
    >
      {/* Avatar Stack */}
      <div className="flex -space-x-2">
        {displayUsers.map((user, idx) => (
          <div key={user.id} className="relative" style={{ zIndex: 10 - idx }}>
            {user.viewer.image ? (
              <img
                src={user.viewer.image}
                alt={user.viewer.fullName}
                className="w-6 h-6 rounded-full border-2 border-white object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-semibold border-2 border-white">
                {getInitials(user.viewer.fullName)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View Text */}
      <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
        {getViewText()}
      </span>
    </button>
  );
}
