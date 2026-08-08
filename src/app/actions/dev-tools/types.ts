export interface DevToolsUser {
  id: string;
  userId: string;
  fullName: string;
  email?: string;
  isEmailVerified: boolean;
  primaryNumber?: string;
  isPrimaryNumberVerified: boolean;
  dateOfBirth?: string;
  locality?: string;
  provider: string;
  accountStatus: string;
  isFullyRegistered: boolean;
  isNewUser: boolean;
  createdAt: string;
}

export interface DevToolsDeletedUser {
  id: string;
  userId: string;
  fullName: string;
  accountStatus: string;
  deletedAt?: string;
  deleteFeedback?: string;
  createdAt: string;
  audit: { action: string; at: string }[];
  originalEmail?: string;
  originalPrimaryNumber?: string;
  originalFullName?: string;
}

export interface DevToolsDeletedUserListing {
  id: string;
  adsId?: string;
  name: string;
  category: string;
  subcategory: string;
  status: string;
  sellerInfo: { name: string; phone: string; email: string };
  createdAt: string;
}

export interface DevToolsDeletedUserConversation {
  id: string;
  adId: string;
  adTitle: string;
  otherParticipant: { id: string; name: string };
  lastMessage: string;
  lastMessageAt: string;
}

export interface DevToolsDeletedUserData {
  listings: DevToolsDeletedUserListing[];
  conversations: DevToolsDeletedUserConversation[];
}

export interface DevToolsConversationMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export interface DevToolsConversationSummary {
  adId: string;
  adTitle: string;
  participants: { id: string; fullName: string }[];
}

export interface DevToolsConversationDetail {
  conversation: DevToolsConversationSummary | null;
  messages: DevToolsConversationMessage[];
}
