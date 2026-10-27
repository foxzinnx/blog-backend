import type { AuthorData } from "@/types/author.type.js";

export interface CreateCommentInputDTO {
    authorId: string;
    postId: string;
    content: string;
}

export interface CommentOutputDTO {
    id: string;
    authorId: string;
    postId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateCommentInputDTO{
    authorId: string;
    commentId: string;
    content?: string;
}

export interface DeleteCommentInputDTO {
    authorId: string;
    commentId: string;
}

export interface CommentWithAuthorOutputDTO {
    id: string;
    postId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author: AuthorData
}