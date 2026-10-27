import type { User } from "../entities/user.entity.js";
import type { UniqueEntityId } from "../value-objects/unique-entity-id.vo.js";

export interface UserRepository {
    create(user: User): Promise<void>;
    findById(id: UniqueEntityId): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findBySlug(slug: string): Promise<User | null>;
    save(user: User): Promise<void>;
    delete(id: UniqueEntityId): Promise<void>;
}