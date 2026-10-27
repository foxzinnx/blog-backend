import { NotFoundError } from "@/domain/errors/not-found.error.js";
import { UnauthorizedError } from "@/domain/errors/unauthorized.error.js";
import type { PostRepository } from "@/domain/repositories/post.repository.js";
import { UniqueEntityId } from "@/domain/value-objects/unique-entity-id.vo.js";

export class DeletePostUseCase {
    constructor(private readonly postRepository: PostRepository){}

    async execute(id: string, authorId: string): Promise<void> {
        const postId = new UniqueEntityId(id);
        const authorIdVO = new UniqueEntityId(authorId);

        const result = await this.postRepository.findById(postId);

        if(!result || !result.post){
            throw new NotFoundError('Post');
        }

        const { post } = result;

        if(!post){
            throw new NotFoundError('Post');
        }

        if(!post.authorId.equals(authorIdVO)){
            throw new UnauthorizedError();
        }

        await this.postRepository.delete(postId);
    }
}