import type { CommentWithAuthorOutputDTO } from "@/application/dtos/comment.dto.js";
import { NotFoundError } from "@/domain/errors/not-found.error.js";
import type { CommentRepository } from "@/domain/repositories/comment.repository.js";
import type { PostRepository } from "@/domain/repositories/post.repository.js";
import { UniqueEntityId } from "@/domain/value-objects/unique-entity-id.vo.js";

export class GetAllCommentsByPostId{
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly postRepository: PostRepository
    ){}

    async execute(id: string): Promise<CommentWithAuthorOutputDTO[]>{
        const postId = new UniqueEntityId(id);
        const post = await this.postRepository.findById(postId);
        if(!post){
            throw new NotFoundError('Post');
        }

        const commentsWithAuthor = await this.commentRepository.findAllCommentsByPostId(postId);

        return commentsWithAuthor.map(({ comment, author }) => ({
            id: comment.id.value,
            postId: comment.postId.value,
            content: comment.content.value,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            author
        }));
    }
}