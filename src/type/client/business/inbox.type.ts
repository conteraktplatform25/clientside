import {
  ConstInboxCategory,
  ConstAssignee,
  ConstChatStatus,
  ConstTagLabels,
  ConstSorting,
} from '@/lib/constants/inbox.constant';

export type TInboxCategory = (typeof ConstInboxCategory)[number];
export type TAssignee = (typeof ConstAssignee)[number];
export type TChatStatus = (typeof ConstChatStatus)[number];
export type TTagLabels = (typeof ConstTagLabels)[number];
export type TSorting = (typeof ConstSorting)[number];

export interface TUserMessageProfile {
  userId: number;
  full_name: string;
  initials: string;
  message: string;
  tag_title?: string;
  color?: string;
  color_text?: string;
  agent?: string;
  time: string;
}

export interface IMessageAttachment {
  id: string; // client-side temp ID
  name: string;
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE';
  file: File; // actual File object
  previewUrl: string; // URL.createObjectURL
}

export interface ISender {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface IMessageWithSender {
  id: string;
  text: string | null;
  createdAt: Date;
  senderId: string;
  status: 'SENDING' | 'SENT' | 'DELIVERED' | 'ERROR';
  sender: ISender;
  attachments: IMessageAttachment[];
}

export type ChatAttachment = IMessageAttachment;
