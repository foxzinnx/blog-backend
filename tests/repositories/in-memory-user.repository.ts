import type { User } from "@/domain/entities/user.entity.js";
import type { UserRepository } from "@/domain/repositories/user.repository.js";
import type { UniqueEntityId } from "@/domain/value-objects/unique-entity-id.vo.js";

export class InMemoryUserRepository implements UserRepository {
    public items: User[] = [];
    
    async create(user: User): Promise<void> {
        this.items.push(user);
    }

    async findById(id: UniqueEntityId): Promise<User | null> {
        return this.items.find((u) => u.id.equals(id)) ?? null;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.items.find((u) => u.email.value === email) ?? null;
    }

    async findBySlug(slug: string): Promise<User | null> {
        return this.items.find((u) => u.slug.value === slug) ?? null;
    }

    async save(user: User): Promise<void> {
        const index = this.items.findIndex((i) => i.id.equals(user.id));

        if(index > 0) this.items[index] = user;
    }

    async delete(id: UniqueEntityId): Promise<void> {
        this.items = this.items.filter((u) => !u.id.equals(id));
    }
}