import type { PostOutputDTO } from "@//application/dtos/post.dto.js";
import { Entity } from "../base/base.entity.js";
import type { PostStatus } from "../enums/post-status.enum.js";
import { CannotPublishArchivedPostError } from "../errors/cannot-publish-archived-post.error.js";
import { CannotUpdateArchivedPostError } from "../errors/cannot-update-archived-post.error.js";
import type { Content } from "../value-objects/content.vo.js";
import type { UniqueEntityId } from "../value-objects/unique-entity-id.vo.js";
import { InvalidStatusError } from "../errors/invalid-status.error.js";

interface PostProps {
    authorId: UniqueEntityId;
    content: Content;
    status: PostStatus;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export class Post extends Entity<PostProps> {
    private constructor(props: PostProps, id?: UniqueEntityId){
        super(props, id);
    }

    static create(props: Omit<PostProps, 'createdAt' | 'updatedAt' | 'publishedAt'>, id?: UniqueEntityId): Post {
        const now = new Date();

        const isPublished = props.status === 'PUBLISHED';
        
        return new Post(
            {
                ...props,
                createdAt: now,
                updatedAt: now,
                publishedAt: isPublished ? now : null
            },
            id
        )
    }

    static reconstitute(props: PostProps, id?: UniqueEntityId){
        return new Post(props, id);
    }

    get authorId(): UniqueEntityId {
        return this._props.authorId;
    }

    get content(): Content {
        return this._props.content;
    }

    get status(): PostStatus {
        return this._props.status;
    }

    get publishedAt(): Date | null {
        return this._props.publishedAt;
    }

    get createdAt(): Date {
        return this._props.createdAt;
    }

    get updatedAt(): Date {
        return this._props.updatedAt;
    }

    isDraft(): boolean {
        return this._props.status === 'DRAFT';
    }

    isPublished(): boolean {
        return this._props.status === 'PUBLISHED';
    }

    isArchived(): boolean {
        return this._props.status === 'ARCHIVED';
    }

    draft(): void {
        this._props.status = 'DRAFT';
        this.touch();
    }

    publish(): void {
        if(this.isArchived()){
            throw new CannotPublishArchivedPostError();
        }

        if(this.isPublished()){
            return;
        }

        this._props.status = 'PUBLISHED';
        this._props.publishedAt = new Date();
        this.touch();
    }

    archive(): void {
        this._props.status = 'ARCHIVED';
        this.touch();
    }

    updateContent(newContent: Content): void {
        if(this.isArchived()){
            throw new CannotUpdateArchivedPostError();
        }

        this._props.content = newContent;
        this.touch();
    }

    applyStatusChange(post: Post, newStatus: PostStatus): void {
        if(newStatus === post.status){
            return;
        }

        switch(newStatus){
            case "PUBLISHED":
                post.publish();
                break;
            case "ARCHIVED":
                post.archive();
                break;
            case "DRAFT":
                post.draft();
                break;
            default:
                throw new InvalidStatusError();
        }
    }

    private touch(){
        this._props.updatedAt = new Date();
    }

    toOutputDTO(): PostOutputDTO {
        return {
            id: this.id.value,
            authorId: this._props.authorId.value,
            content: this._props.content.value,
            status: this._props.status,
            publishedAt: this._props.publishedAt,
            createdAt: this._props.createdAt,
            updatedAt: this._props.updatedAt
        }
    }
}