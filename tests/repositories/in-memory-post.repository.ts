import type { Post } from "@/domain/entities/post.entity.js";
import type { PostRepository } from "@/domain/repositories/post.repository.js";
import type { UniqueEntityId } from "@/domain/value-objects/unique-entity-id.vo.js";
import type { AuthorData } from "@/types/author.type.js";

export class InMemoryPostRepository implements PostRepository {
    public posts: Post[] = [];
    public authors: AuthorData[] = [];
    
    async create(post: Post): Promise<void> {
        this.posts.push(post);
    }
    
    async findById(id: UniqueEntityId): Promise<{ post: Post; author: AuthorData; } | null> {
        const post = this.posts.find((p) => p.id.equals(id));
        if(!post) return null;

        const author = this.authors.find((a) => a.id === post?.authorId.value);
        if(!author){
            throw new Error(`Author with id ${post.authorId.value} not found.`);
        }

        return { post, author }
    }

    async findAll(): Promise<{ post: Post; author: AuthorData; }[]> {
        const result: { post: Post; author: AuthorData }[] = [];
        
        for(const post of this.posts){
            const author = this.authors.find((a) => a.id === post.authorId.value);

            if(!author){
                throw new Error(`Author with id ${post.authorId.value} not found.`);
            }

            result.push({ post, author });
        }

        return result.sort(
            (a, b) => b.post.createdAt.getTime() - a.post.createdAt.getTime()
        );
    }

    async save(post: Post): Promise<void> {
        const index = this.posts.findIndex((p) => p.id.equals(post.id));

        if(index >= 0) {
            this.posts[index] = post;
        } else {
            this.posts.push(post);
        }
    }

    async delete(id: UniqueEntityId): Promise<void> {
        this.posts = this.posts.filter((p) => !p.id.equals(id));
    }
}