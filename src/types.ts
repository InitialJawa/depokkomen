export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'twitter';
export type TikTokTemplate = 'video' | 'reply';

export interface CommentState {
  platform: Platform;
  tiktokTemplate: TikTokTemplate;
  theme: 'light' | 'dark';
  username: string; 
  handle: string; 
  avatarUrl: string;
  isVerified: boolean;
  commentText: string;
  likeCount: string;
  viewCount: string;
  retweetCount: string;
  replyCount: string;
  timestamp: string;
  isTransparentBg: boolean;
}

export const defaultState: CommentState = {
  platform: 'tiktok',
  tiktokTemplate: 'video',
  theme: 'light',
  username: 'Kreator Keren',
  handle: '@kreator_keren',
  avatarUrl: 'https://api.dicebear.com/8.x/notionists/svg?seed=Kreator',
  isVerified: true,
  commentText: 'Wah, kontennya bermanfaat banget kak! Makasih banyak yaa 🔥',
  likeCount: '3.4K',
  viewCount: '1.2M',
  retweetCount: '800',
  replyCount: '24',
  timestamp: '2j lalu',
  isTransparentBg: false,
};
