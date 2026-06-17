import React from 'react';
import { CommentState } from './types';

const usernames = ['Reza Gaming', 'Siti Beauty', 'Budi Santoso', 'Lestari', 'Andi Tech', 'Ayu Foodie'];
const comments = [
  'Wah, kontennya bermanfaat banget kak!',
  'Info loker bang? 🙏',
  'Gila sih ini epic banget! 🔥🔥🔥',
  'Makasih infonya kak...',
  'Ada yang tau judul lagunya?',
  'Bisa dijelasin lebih detail nggak bagian akhirnya?'
];

export function getRandomState(currentState: CommentState): CommentState {
  const name = usernames[Math.floor(Math.random() * usernames.length)];
  const comment = comments[Math.floor(Math.random() * comments.length)];
  const seed = Math.random().toString(36).substring(7);
  
  return {
    ...currentState,
    username: name,
    handle: `@${name.replace(/\s+/g, '').toLowerCase()}${Math.floor(Math.random() * 100)}`,
    avatarUrl: `https://api.dicebear.com/8.x/notionists/svg?seed=${seed}`,
    isVerified: Math.random() > 0.5,
    commentText: comment,
    likeCount: Math.floor(Math.random() * 1000) + (Math.random() > 0.5 ? 'K' : ''),
    timestamp: `${Math.floor(Math.random() * 24) + 1}j lalu`
  };
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function renderFormattedText(text: string) {
  const parts = text.split(/(\[(?:highlight|blur|cut)\].*?\[\/(?:highlight|blur|cut)\])/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('[highlight]') && part.endsWith('[/highlight]')) {
      const content = part.substring(11, part.length - 12);
      return <mark key={index} className="bg-yellow-300 text-black px-0.5 rounded">{content}</mark>;
    }
    if (part.startsWith('[blur]') && part.endsWith('[/blur]')) {
      const content = part.substring(6, part.length - 7);
      return <span key={index} className="blur-[4px] select-none text-transparent">{content}</span>;
    }
    if (part.startsWith('[cut]') && part.endsWith('[/cut]')) {
      const content = part.substring(5, part.length - 6);
      return <span key={index} className="opacity-0 select-none">-</span>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
