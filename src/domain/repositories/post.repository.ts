import type { AuthorData } from "@//types/author.type.js";
import type { Post } from "../entities/post.entity.js";
import type { UniqueEntityId } from "../value-objects/unique-entity-id.vo.js";

export interface PostRepository {
    create(post: Post): Promise<void>;
    findById(id: UniqueEntityId): Promise<{ post: Post; author: AuthorData } | null>;
    findAll(): Promise<{ post: Post; author: AuthorData }[]>;
    save(post: Post): Promise<void>;
    delete(id: UniqueEntityId): Promise<void>;
}