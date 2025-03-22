export type DebateMode = 'creative' | 'business' | 'philosophy' | 'casual';

export type MessageSender = 'user' | 'ai';

export interface Message {
   id: string;
   debateSessionId: string;
   sender: MessageSender;
   content: string;
   createdAt: string;
}

export interface DebateSession {
   id: string;
   userId: string;
   title: string;
   mode: DebateMode;
   status: 'active' | 'completed' | 'archived';
   createdAt: string;
   updatedAt: string;
   messages?: Message[];
}

export interface StartDebateSessionRequest {
   topic: string;
   mode?: DebateMode;
}

export interface SendMessageRequest {
   message: string;
}

export interface StartDebateSessionResponse {
   success: boolean;
   session: DebateSession;
   messages: Message[];
}

export interface SendMessageResponse {
   success: boolean;
   messages: Message[];
}

export interface GetDebateSessionResponse {
   success: boolean;
   session: DebateSession;
}

export interface GetUserDebateSessionsResponse {
   success: boolean;
   sessions: DebateSession[];
} 