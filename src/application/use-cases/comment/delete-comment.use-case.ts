import type { DeleteCommentInputDTO } from "@/application/dtos/comment.dto.js";
import { NotFoundError } from "@/domain/errors/not-found.error.js";
import { UnauthorizedError } from "@/domain/errors/unauthorized.error.js";
import type { CommentRepository } from "@/domain/repositories/comment.repository.js";
import type { UserRepository } from "@/domain/repositories/user.repository.js";
import { UniqueEntityId } from "@/domain/value-objects/unique-entity-id.vo.js";

export class DeleteCommentUseCase{
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly userRepository: UserRepository
    ){}

    async execute(input: DeleteCommentInputDTO): Promise<void> {
        const commentId = new UniqueEntityId(input.commentId);
        const result = await this.commentRepository.findById(commentId);
        if(!result || !result.comment){
            throw new NotFoundError('Comentário');
        }

        const authorId = new UniqueEntityId(input.authorId);
        const existingAuthor = await this.userRepository.findById(authorId);
        if(!existingAuthor){
            throw new NotFoundError('Usuário');
        }

        const { comment, author } = result;

        if(!comment.authorId.equals(authorId)){
            throw new UnauthorizedError();
        }

        await this.commentRepository.delete(commentId);
    }
}