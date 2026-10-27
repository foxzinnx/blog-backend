import type { UpdateCommentInputDTO } from "@/application/dtos/comment.dto.js";
import { NotFoundError } from "@/domain/errors/not-found.error.js";
import { UnauthorizedError } from "@/domain/errors/unauthorized.error.js";
import type { CommentRepository } from "@/domain/repositories/comment.repository.js";
import { Content } from "@/domain/value-objects/content.vo.js";
import { UniqueEntityId } from "@/domain/value-objects/unique-entity-id.vo.js";

export class UpdateCommentUseCase {
    constructor(private readonly commentRepository: CommentRepository){}

    async execute(input: UpdateCommentInputDTO){
        const commentId = new UniqueEntityId(input.commentId);
        const authorId = new UniqueEntityId(input.authorId);

        const result = await this.commentRepository.findById(commentId);
        if(!result || !result.comment){
            throw new NotFoundError('Comentário');
        }
        
        const { comment, author } = result;

        if(!comment.authorId.equals(authorId)){
            throw new UnauthorizedError();
        }

        if(input.content){
            const newContent = Content.create(input.content);
            comment.updateContent(newContent);
        }

        await this.commentRepository.save(comment);

        const commentDTO = comment.toOutputDTO();

        return {
            id: commentDTO.id,
            authorId: commentDTO.authorId,
            postId: commentDTO.postId,
            content: commentDTO.content,
            createdAt: commentDTO.createdAt,
            updatedAt: commentDTO.updatedAt,
            author: {
                id: author.id,
                name: author.name,
                slug: author.slug,
                bio: author.bio
            }
        }
    }
}