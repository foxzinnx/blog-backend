import type { PostOutputDTO, PostWithAuthorOutputDTO, UpdatePostInputDTO } from "@/application/dtos/post.dto.js";
import { NotFoundError } from "@/domain/errors/not-found.error.js";
import { UnauthorizedError } from "@/domain/errors/unauthorized.error.js";
import type { PostRepository } from "@/domain/repositories/post.repository.js";
import { Content } from "@/domain/value-objects/content.vo.js";
import { UniqueEntityId } from "@/domain/value-objects/unique-entity-id.vo.js";

export class UpdatePostUseCase {
    constructor(private readonly postRepository: PostRepository){}

    async execute(input: UpdatePostInputDTO): Promise<PostWithAuthorOutputDTO> {
        const postId = new UniqueEntityId(input.postId);
        const authorId = new UniqueEntityId(input.authorId);

        const result = await this.postRepository.findById(postId);
        if(!result){
            throw new NotFoundError('Post');
        }

        const { post, author } = result;

        if(!post.authorId.equals(authorId)){
            throw new UnauthorizedError();
        }

        if(input.content){
            const newContent = Content.create(input.content);
            post.updateContent(newContent);
        }

        if(input.status){
            post.applyStatusChange(post, input.status);
        }

        await this.postRepository.save(post);

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