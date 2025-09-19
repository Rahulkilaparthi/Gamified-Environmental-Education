import React from 'react';
import { Sprout, Trophy, Star, Recycle, Droplet, Sun, Bug, Zap, Globe, Shirt, Carrot, Waves } from 'lucide-react';

interface BadgeIconProps {
  iconName: string;
  className?: string;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({ iconName, className }) => {
  const icons: { [key: string]: React.ElementType } = {
    seedling: Sprout,
    trophy: Trophy,
    star: Star,
    recycle: Recycle,
    droplet: Droplet,
    sun: Sun,
    bug: Bug,
    zap: Zap,
    globe: Globe,
    shirt: Shirt,
    carrot: Carrot,
    waves: Waves,
  };

  const IconComponent = icons[iconName] || Star; // Default icon

  return <IconComponent className={className} />;
};