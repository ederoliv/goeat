import { useState } from 'react';

interface AvatarProps {
  name: string;
  imageUrl: string | null | undefined;
  className?: string;
}

// Profile image, or the name's initial when there is none (or it fails to load).
export function Avatar({ name, imageUrl, className = '' }: AvatarProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (imageUrl && imageUrl !== failedUrl) {
    return <img src={imageUrl} alt={name} onError={() => setFailedUrl(imageUrl)} className={`object-cover ${className}`} />;
  }
  return <div className={`flex items-center justify-center font-bold ${className}`}>{name.charAt(0)}</div>;
}
