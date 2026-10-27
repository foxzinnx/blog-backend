import { NotFoundError } from "@/domain/errors/not-found.error.js";
import type { PostRepository } from "@/domain/repositories/post.repository.js";
import { UniqueEntityId } from "@//domain/value-objects/unique-entity-id.vo.js";
import type { PostWithAuthorOutputDTO } from "@/application/dtos/post.dto.js";

export class GetPostByIdUseCase{
    constructor(
        private readonly postRepository: PostRepository
    ){}

    async execute(id: string): Promise<PostWithAuthorOutputDTO>{
        const postId = new UniqueEntityId(id);
        const result = await this.postRepository.findById(postId);

        if(!result || !result.post){
            throw new NotFoundError('Post');
        }

        const { post, author } = result;
        const postDTO = post.toOutputDTO();

        return {
            id: postDTO.id,
            content: postDTO.content,
            status: postDTO.status,
            publishedAt: postDTO.publishedAt,
            createdAt: postDTO.createdAt,
            updatedAt: postDTO.updatedAt,
            author: {
                id: author.id,
                name: author.name,
                slug: author.slug,
                bio: author.bio
            }
        }
    }
}