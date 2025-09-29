'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '@/type/client/business/survey/inbox-survey.type';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  profile: UserProfile;
  size?: 'sm' | 'md' | 'lg';
  showOnlineStatus?: boolean;
  className?: string;
}

export function UserAvatar({ profile, size = 'md', showOnlineStatus = false, className }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('relative', className)}>
      <Avatar className={cn(sizeClasses[size])}>
        <AvatarImage src={profile.avatar} alt={profile.name} />
        <AvatarFallback className='bg-blue-100 text-blue-600 font-medium'>{getInitials(profile.name)}</AvatarFallback>
      </Avatar>
      {showOnlineStatus && (
        <div
          className={cn(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
            profile.isOnline ? 'bg-green-500' : 'bg-gray-400'
          )}
        />
      )}
    </div>
  );
}
