export interface WritePostDto {
    userId: string;
    content?: string;
    caption?: string;
    mediaFiles?: File[];
}