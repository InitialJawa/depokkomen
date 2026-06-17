export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'kick_live';
export type TikTokTemplate = 'video' | 'reply';
export type InstagramTemplate = 'comment' | 'live';

export interface AdditionalComment {
  id: string;
  avatarUrl: string;
  username: string;
  isVerified: boolean;
  commentText: string;
}

export interface CommentState {
  platform: Platform;
  tiktokTemplate: TikTokTemplate;
  instagramTemplate: InstagramTemplate;
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
  additionalComments: AdditionalComment[];
  hideLiveBackground: boolean;
}

export const defaultState: CommentState = {
  platform: 'tiktok',
  tiktokTemplate: 'video',
  instagramTemplate: 'comment',
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
  additionalComments: [],
  hideLiveBackground: false,
};
