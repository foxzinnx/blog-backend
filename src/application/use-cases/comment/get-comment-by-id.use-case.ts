import type { CommentWithAuthorOutputDTO } from "@/application/dtos/comment.dto.js";
import { NotFoundError } from "@/domain/errors/not-found.error.js";
import type { CommentRepository } from "@/domain/repositories/comment.repository.js";
import { UniqueEntityId } from "@/domain/value-objects/unique-entity-id.vo.js";

export class GetCommentByIdUseCase {
    constructor(private readonly commentRepository: CommentRepository){}

    async execute(id: string): Promise<CommentWithAuthorOutputDTO> {
        const commentId = new UniqueEntityId(id);
        const result = await this.commentRepository.findById(commentId);

        if(!result || !result.comment){
            throw new NotFoundError('Comentário');
        }

        const { comment, author } = result;

        const commentDTO = comment.toOutputDTO();

        return {
            id: commentDTO.id,
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