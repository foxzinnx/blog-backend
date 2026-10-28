import type { UserOutputDTO } from "../../application/dtos/user.dto.js";
import { Entity } from "../base/base.entity.js";
import { Bio } from "../value-objects/bio.vo.js";
import { Email } from "../value-objects/email.vo.js";
import { Name } from "../value-objects/name.vo.js";
import { Slug } from "../value-objects/slug.vo.js";
import type { UniqueEntityId } from "../value-objects/unique-entity-id.vo.js";

interface UserProps {
    name: Name;
    slug: Slug;
    bio?: Bio | null;
    email: Email;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export class User extends Entity<UserProps>{
    private constructor(props: UserProps, id?: UniqueEntityId){
        super(props, id);
    }

    static create(props: Omit<UserProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId): User {
        const now = new Date();
        
        return new User(
            {
                ...props,
                createdAt: now,
                updatedAt: now
            },
            id
        )
    }

    static reconstitute(props: UserProps, id?: UniqueEntityId){
        return new User(props, id);
    }

    get name(): Name { return this._props.name }
    get slug(): Slug { return this._props.slug }
    get bio(): Bio | null { return this._props.bio ?? null }
    get email(): Email { return this._props.email }
    get passwordHash(): string { return this._props.passwordHash }
    get createdAt(): Date { return this._props.createdAt }
    get updatedAt(): Date { return this._props.updatedAt }

    updateName(newName: Name): void {
        this._props.name = newName;
        this.touch();
    }

    updateSlug(newSlug: Slug): void {
        this._props.slug = newSlug;
        this.touch();
    }

    updateBio(newBio: Bio): void {
        this._props.bio = newBio;
        this.touch();
    }

    updateEmail(newEmail: Email): void {
        this._props.email = newEmail;
        this.touch();
    }

    updatePassword(password: string): void {
        this._props.passwordHash = password;
        this.touch();
    }

    toOutputDTO(): UserOutputDTO {
        return {
            id: this.id.value,
            name: this._props.name.value,
            email: this._props.email.value,
            bio: this._props.bio?.value ?? null,
            slug: this._props.slug.value,
            createdAt: this._props.createdAt,
            updatedAt: this._props.updatedAt
        }
    }

    private touch(){
        this._props.updatedAt = new Date();
    }
}