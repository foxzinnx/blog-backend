import type { PostRepository } from "@/domain/repositories/post.repository.js";

export class GetAllPostsUseCase {
    constructor(private readonly postRepository: PostRepository){}

    async execute(){
        return this.postRepository.findAll();
    }
}