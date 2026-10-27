import type { AuthorData } from "@/types/author.type.js";
import type { Comment } from "../entities/comment.entity.js";
import type { UniqueEntityId } from "../value-objects/unique-entity-id.vo.js";

export interface CommentRepository {
    create(comment: Comment): Promise<void>;
    findById(id: UniqueEntityId): Promise<{ comment: Comment; author: AuthorData } | null>;
    findAllCommentsByPostId(postId: UniqueEntityId): Promise<{ comment: Comment; author: AuthorData }[]>;
    save(comment: Comment): Promise<void>;
    delete(id: UniqueEntityId): Promise<void>;
}