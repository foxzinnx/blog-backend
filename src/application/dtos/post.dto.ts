import type { PostStatus } from "@/domain/enums/post-status.enum.js";

export interface CreatePostInputDTO {
    authorId: string;
    content: string;
    status: PostStatus;
}

export interface UpdatePostInputDTO {
    postId: string;
    authorId: string;
    content?: string;
    status?: PostStatus;
}

export interface PostOutputDTO {
    id: string;
    authorId: string;
    content: string;
    status: PostStatus;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface PostWithAuthorOutputDTO {
    id: string;
    content: string;
    status: PostStatus;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    author: {
        id: string;
        name: string;
        slug: string;
        bio: string | null;
    }
}