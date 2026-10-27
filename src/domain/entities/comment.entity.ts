import type { CommentOutputDTO } from "@/application/dtos/comment.dto.js";
import { Entity } from "../base/base.entity.js";
import { Content } from "../value-objects/content.vo.js";
import type { UniqueEntityId } from "../value-objects/unique-entity-id.vo.js";

interface CommentProps {
    authorId: UniqueEntityId;
    postId: UniqueEntityId;
    content: Content;
    createdAt: Date;
    updatedAt: Date;
}

export class Comment extends Entity<CommentProps>{
    private constructor(props: CommentProps, id?: UniqueEntityId){
        super(props, id);
    }

    static create(props: Omit<CommentProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId): Comment {
        const now = new Date()
        
        return new Comment(
            {
                ...props,
                createdAt: now,
                updatedAt: now
            },
            id
        );
    }

    static reconstitute(props: CommentProps, id?: UniqueEntityId){
        return new Comment(props, id);
    }

    get authorId(): UniqueEntityId {
        return this._props.authorId;
    }

    get postId(): UniqueEntityId {
        return this._props.postId;
    }

    get content(): Content {
        return this._props.content;
    }

    get createdAt(): Date {
        return this._props.createdAt;
    }

    get updatedAt(): Date {
        return this._props.updatedAt;
    }

    updateContent(newContent: Content): void {
        this._props.content = newContent;
        this._props.updatedAt = new Date();
    }

    toOutputDTO(): CommentOutputDTO {
        return {
            id: this.id.value,
            authorId: this._props.authorId.value,
            postId: this._props.postId.value,
            content: this._props.content.value,
            createdAt: this._props.createdAt,
            updatedAt: this._props.updatedAt
        }
    }
}