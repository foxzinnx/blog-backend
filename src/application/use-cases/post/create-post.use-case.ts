import type { PostRepository } from "@//domain/repositories/post.repository.js";
import type { CreatePostInputDTO, PostOutputDTO } from "../../dtos/post.dto.js";
import type { UserRepository } from "@//domain/repositories/user.repository.js";
import { NotFoundError } from "@//domain/errors/not-found.error.js";
import { Post } from "@//domain/entities/post.entity.js";
import { UniqueEntityId } from "@//domain/value-objects/unique-entity-id.vo.js";
import { Content } from "@//domain/value-objects/content.vo.js";
import type { PostStatus } from "@//domain/enums/post-status.enum.js";

export class CreatePostUseCase {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly userRepository: UserRepository
    ){}

    async execute(input: CreatePostInputDTO): Promise<PostOutputDTO>{
        const authorId = new UniqueEntityId(input.authorId);
        const user = await this.userRepository.findById(authorId);
        if(!user){
            throw new NotFoundError('Usuário');
        }

        const post = Post.create({
            authorId,
            content: Content.create(input.content),
            status: input.status as PostStatus,
        });

        await this.postRepository.create(post);

        return post.toOutputDTO();
    }
}