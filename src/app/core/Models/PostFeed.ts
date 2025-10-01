export interface postFeed {
    postId: number;
    content: string;
    authorName: string;
    caption?: string;
    mediaFiles: MediaVm[];
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    bio: string;
    profilePictureUrl: string;
    isILiked: boolean;
    userId: string
}
export interface MediaVm {
    mediaId: number;
    fileName: string;
    contentType: string;
    mediaType: string;
    url: string;
}
