export enum TopicCategory {
  ICEBREAKER = '破冰',
  DEEP_TALK = '深度',
  FUN = '趣味',
  WORKPLACE = '职场',
  ROMANCE = '情感',
  CREATIVE = '脑洞',
  MY_COLLECTION = '收藏集', // User generated content
  CUSTOM = '自定义' // Legacy internal use or specific prompt mode
}

export interface TopicCardData {
  title: string;
  description: string;
  question: string;
  tags: string[];
  intensity: number; // 1-5 scale of how "deep" or "active" it is
  timestamp?: number; // For history sorting
  isUserGenerated?: boolean; // To distinguish visual style
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
}