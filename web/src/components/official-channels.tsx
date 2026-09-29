import { ArrowUpRight, Globe, BookOpen, Camera } from 'lucide-react';
import channels from '../../../content/official-channels.json';

const icons = { website: Globe, blog: BookOpen, instagram: Camera };

export function OfficialChannels({
  variant = 'visit',
}: {
  variant?: 'visit' | 'footer' | 'about';
}) {
  return (
    <nav
      className={`official-channels official-channels-${variant}`}
      aria-label="영통탑내과 공식 채널"
      lang="ko"
    >
      {channels.map((channel) => {
        const Icon = icons[channel.id as keyof typeof icons];
        return (
          <a key={channel.id} href={channel.url} target="_blank" rel="noopener noreferrer external">
            <Icon size={20} aria-hidden="true" />
            <span>
              <strong>{channel.label}</strong>
              {variant !== 'footer' && (
                <span className="channel-description">{channel.description}</span>
              )}
            </span>
            <ArrowUpRight size={16} aria-hidden="true" />
            <span className="sr-only">(새 창)</span>
          </a>
        );
      })}
    </nav>
  );
}
