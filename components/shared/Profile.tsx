import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Link as LinkIcon } from 'lucide-react';

export interface ProfileProps {
  username: string;
  name?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate?: string;
  followingCount?: number;
  followersCount?: number;
  verified?: boolean;
  tags?: string[];
}

const Profile: React.FC<ProfileProps> = ({
  username,
  name,
  avatarUrl,
  bannerUrl,
  bio,
  location,
  website,
  joinDate,
  followingCount,
  followersCount,
  verified = false,
  tags = [],
}) => {
  return (
    <Card className="w-full animate-fade-in-down">
      {bannerUrl && (
        <div 
          className="h-96 bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerUrl})` }}
        />
      )}
      <CardHeader className="relative">
        <Avatar className="w-24 h-24 border-4 border-background absolute -top-12 left-4">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={name || username} />
          ) : (
            <AvatarFallback>{(name || username).slice(0, 2).toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
        <div className="ml-32 mt-2">
          <h2 className="text-2xl font-bold flex items-center text-foreground">
            {name || username}
            {verified && (
              <Badge variant="secondary" className="ml-2">
                <span className="sr-only">Verified</span>
                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">@{username}</p>
        </div>
      </CardHeader>
      <CardContent>
        {bio && <p className="mb-4 animate-fade-in text-foreground">{bio}</p>}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
          {location && (
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <span>{location}</span>
            </div>
          )}
          {website && (
            <div className="flex items-center">
              <LinkIcon className="mr-2 h-4 w-4" />
              <a href={website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {joinDate && (
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Joined {joinDate}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;