import type { CreateCommentInputDTO } from "@/application/dtos/comment.dto.js";
import { Comment } from "@/domain/entities/comment.entity.js";
import { NotFoundError } from "@/domain/errors/not-found.error.js";
import type { CommentRepository } from "@/domain/repositories/comment.repository.js";
import type { PostRepository } from "@/domain/repositories/post.repository.js";
import type { UserRepository } from "@/domain/repositories/user.repository.js";
import { Content } from "@/domain/value-objects/content.vo.js";
import { UniqueEntityId } from "@/domain/value-objects/unique-entity-id.vo.js";

export class CreateCommentUseCase {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly userRepository: UserRepository,
        private readonly postRepository: PostRepository
    ){}

    async execute(input: CreateCommentInputDTO){
        const authorId = new UniqueEntityId(input.authorId);
        const postId = new UniqueEntityId(input.postId);
        
        const author = await this.userRepository.findById(authorId);
        if(!author){
            throw new NotFoundError('Usuário');
        }

        const post = await this.postRepository.findById(postId);
        if(!post){
            throw new NotFoundError('Post');
        }

        const comment = Comment.create({
            authorId,
            postId,
            content: Content.create(input.content)
        });

        await this.commentRepository.create(comment);

        return comment.toOutputDTO();
    }
}