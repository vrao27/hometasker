import React from "react";

interface AvatarProps {
  userId: string;    
  username?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  userId,
  username = "User",
  size = 40,
}) => {
  // Use userId as the seed
  const seed = encodeURIComponent(userId);
  const src = `https://api.dicebear.com/6.x/pixel-art/svg?seed=${seed}`;

  return (
    <img
      src={src}
      alt={`${username} avatar`}
      width={size}
      height={size}
      className="rounded-full bg-gray-100"
      style={{ objectFit: "cover" }}
    />
  );
};