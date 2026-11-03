import { User } from '@/domain/entities/user.entity.js';
import { Bio } from '@/domain/value-objects/bio.vo.js';
import { Email } from '@/domain/value-objects/email.vo.js';
import { Name } from '@/domain/value-objects/name.vo.js';
import { Slug } from '@/domain/value-objects/slug.vo.js';
import { describe, expect, it } from 'vitest';

function makeUserProps(overrides: Partial<{
    name: Name,
    slug: Slug,
    bio?: Bio,
    email: Email,
    passwordHash: string
}> = {}){
    return {
        name: Name.create('John Doe'),
        slug: Slug.create('johndoe'),
        bio: Bio.create('AI Engineer'),
        email: Email.create('johndoe@gmail.com'),
        passwordHash: 'hashed-password',
        ...overrides
    }
}

describe('User Entity', () => {
    describe('create', () => {
        it('should create a valid user', () => {
            const user = User.create(makeUserProps());

            expect(user.id.value).toBeDefined();
            expect(user.name.value).toBe('John Doe');
            expect(user.slug.value).toBe('johndoe');
            expect(user.email.value).toBe('johndoe@gmail.com');
            expect(user.passwordHash).toBe('hashed-password');
            expect(user.bio?.value).toBe('AI Engineer');
        });

        it('should set createdAt and updatedAt on creation', () => {
            const user = User.create(makeUserProps());

            expect(user.createdAt).toBeInstanceOf(Date);
            expect(user.updatedAt).toBeInstanceOf(Date);
        });
    });

    describe('update', () => {
        it('should update the name', () => {
            const user = User.create(makeUserProps());
            const newName = Name.create('Novo nome');

            user.updateName(newName);

            expect(user.name.value).toBe('Novo nome');
        });

        it('should update the slug', () => {
            const user = User.create(makeUserProps());
            const newSlug = Slug.create('newslug');

            user.updateSlug(newSlug);

            expect(user.slug.value).toBe('newslug');
        });

        it('should update the email', () => {
            const user = User.create(makeUserProps());
            const newEmail = Email.create('novoemail@gmail.com');

            user.updateEmail(newEmail);

            expect(user.email.value).toBe('novoemail@gmail.com');
        });

        it('should update the bio', () => {
            const user = User.create(makeUserProps());
            const newBio = Bio.create('Minha nova BIO');

            user.updateBio(newBio);

            expect(user.bio?.value).toBe('Minha nova BIO');
        });

        it('should update the password', () => {
            const user = User.create(makeUserProps());
            
            user.updatePassword('new-hashed-pass');

            expect(user.passwordHash).toBe('new-hashed-pass')
        });
    });

    describe('toOutputDTO', () => {
        it('should return primitive values, never exposing password', () => {
            const user = User.create(makeUserProps());

            const dto = user.toOutputDTO();

            expect(dto).toEqual({
                id: user.id.value,
                name: 'John Doe',
                slug: 'johndoe',
                bio: 'AI Engineer',
                email: 'johndoe@gmail.com',
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            });

            expect(dto).not.toHaveProperty('passwordHash');
        });
    });
})