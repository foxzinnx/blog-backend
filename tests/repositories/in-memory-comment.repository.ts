import type { Comment } from "@/domain/entities/comment.entity.js";
import type { CommentRepository } from "@/domain/repositories/comment.repository.js";
import type { UniqueEntityId } from "@/domain/value-objects/unique-entity-id.vo.js";
import type { AuthorData } from "@/types/author.type.js";

export class InMemoryCommentRepository implements CommentRepository {
    public comments: Comment[] = [];
    public authors: AuthorData[] = [];

    addAuthor(author: AuthorData): void {
        const exists = this.authors.some((a) => a.id === author.id);
        if(!exists){
            this.authors.push(author);
        }
    }

    async create(comment: Comment): Promise<void> {
        this.comments.push(comment);
    }

    async findById(id: UniqueEntityId): Promise<{ comment: Comment; author: AuthorData; } | null> {
        const comment = this.comments.find((c) => c.id.equals(id));

        if(!comment) return null;

        const author = this.authors.find((a) => a.id === comment.authorId.value);

        if(!author){
            throw new Error(`Author with id ${comment.authorId.value} not found.`);
        }

        return { comment, author }
    }

    async findAllCommentsByPostId(postId: UniqueEntityId): Promise<{ comment: Comment; author: AuthorData; }[]> {
        const result: { comment: Comment; author: AuthorData }[] = [];

        for(const comment of this.comments){
            if(comment.postId.equals(postId)){
                const author = this.authors.find((a) => a.id === comment.authorId.value);

                if(!author){
                    throw new Error(`Author with id ${comment.authorId.value} not found.`);
                }

                result.push({ comment, author });
            }
        }

        return result;
    }

    async save(comment: Comment): Promise<void> {
        const index = this.comments.findIndex((c) => c.id.equals(comment.id));

        if(index > 0){
            this.comments[index] = comment;
        } else {
            this.comments.push(comment);
        }
    }

    async delete(id: UniqueEntityId): Promise<void> {
        this.comments = this.comments.filter((c) => !c.id.equals(id));
    }
}