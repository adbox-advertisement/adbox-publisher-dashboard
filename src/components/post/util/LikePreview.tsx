import type { UserProfile } from "../types/interface";

export function LikePreview({
  likes,
  onViewAll,
}: {
  likes: UserProfile[];
  onViewAll: () => void;
}) {
  if (!likes || likes.length === 0) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayUsers = likes.slice(0, 3);
  const remaining = likes.length - displayUsers.length;

  const getLikeText = () => {
    if (likes.length === 1) return `Liked by ${likes[0].viewer.fullName}`;
    if (likes.length === 2)
      return `${likes[0].viewer.fullName} and ${likes[1].viewer.fullName}`;
    if (likes.length === 3)
      return `${likes[0].viewer.fullName}, ${likes[1].viewer.fullName} and ${likes[2].viewer.fullName}`;
    return `${likes[0].viewer.fullName}, ${likes[1].viewer.fullName} and ${remaining} ${remaining === 1 ? "other" : "others"}`;
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
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-[10px] font-semibold border-2 border-white">
                {getInitials(user.viewer.fullName)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Like Text */}
      <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
        {getLikeText()}
      </span>
    </button>
  );
}
