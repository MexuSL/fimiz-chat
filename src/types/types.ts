export type User = {
    userId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    fullName?: string;
    profileImage: string;
    bio: string;
    password: string;
    pinCode: string;
    lastSeenStatus?: string | Date | null;
    gender: string;
    accountNumber?: string;
    email: string;
    dob: string;
    following?: boolean;
    verified: boolean;
    verificationRank: "low" | "medium" | "high" | string;
    EncryptionKey?: { publicKey: string };
    createdAt: Date;
    updatedAt: Date;
};

export type IMessage = {
    messageId: string;
    senderId: string;
    recipientId: string;
    text: string;
    user: User;
    image?: string;
    video?: string;
    audio?: string;
    seen?: boolean;
    sent?: boolean;
    received?: boolean;
    pending?: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type ChatReturnType = {
    messageId: number;
    text: string;
    image: string;
    audio: string;
    video: string;
    otherFile?: string;
    sent: boolean;
    received: boolean;
    pending: boolean;
    createdAt: Date;
    updatedAt?: Date;
    user: Record<string, any>;
};

export type OnlineType = {
    roomId: string;
    userId: string;
};

export type RecordingType = {
    roomId: string;
    userId: string;
    recording: boolean;
};

export type TypingType = {
    roomId: string;
    userId: string;
    typing: boolean;
};

export type RoomReturnType = {
    roomId: string;
    senderId: string;
    recipientId: string;
    lastText: string;
    messageType: string;
    recipientReadStatus: boolean;
    numberOfUnreadText: number;
    deleted?:boolean;
    muted?: boolean;
    archived?: boolean;
    pinned?: boolean;
    deletedAt?: Date | null;
    mutedAt?: Date | null;
    pinnedAt?: Date | null;
    archivedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
};


