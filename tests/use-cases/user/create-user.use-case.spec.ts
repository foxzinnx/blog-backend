import type { Hasher } from "@/application/ports/hasher.js";
import { CreateUserUseCase } from "@/application/use-cases/user/create-user.use-case.js";
import { EmailAlreadyInUseError } from "@/domain/errors/email-already-in-use.error.js";
import { SlugAlreadyInUseError } from "@/domain/errors/slug-already-in-use.error.js";
import { FakeHasher } from "tests/fakes/fake-hasher.js";
import { InMemoryUserRepository } from "tests/repositories/in-memory-user.repository.js";
import { beforeEach, describe, expect, it } from "vitest";

let userRepository: InMemoryUserRepository;
let hasher: FakeHasher;
let sut: CreateUserUseCase;

function makeInput(overrides: Partial<{
    name: string;
    email: string;
    slug: string;
}> = {}){
    return {
        name: overrides.name ?? 'Bryan Gomes',
        email: overrides.email ?? 'john@gmail.com',
        password: 'teste1234',
        slug: overrides.slug ?? 'johndoe'
    }
}

describe('CreateUserUseCase', () => {
    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        hasher = new FakeHasher();
        sut = new CreateUserUseCase(userRepository, hasher)
    })
    
    describe('create', () => {
        it('should create a user with valid data', async () => {
            const result = await sut.execute(makeInput());

            expect(result.id).toBeDefined();
            expect(result.name).toBe('Bryan Gomes');
            expect(result.email).toBe('john@gmail.com');
            expect(result.slug).toBe('johndoe');
            expect(userRepository.items).toHaveLength(1);
        });

        it('should hash the password before saving', async () => {
            const result = await sut.execute(makeInput());

            const userOnRepo = await userRepository.findByEmail(result.email);
            expect(userOnRepo?.passwordHash).toBe('hashed:teste1234');
        });

        it('should throw EmailAlreadyInUseError when email is already taken', async () => {
            await sut.execute(makeInput());

            await expect(
                sut.execute(makeInput({ slug: 'outro-slug' }))
            ).rejects.toBeInstanceOf(EmailAlreadyInUseError)
        });

        it('should throw SlugAlreadyInUseError when slug is already taken', async () => {
            await sut.execute(makeInput());

            await expect(
                sut.execute(makeInput({ email: 'outro@gmail.com' }))
            ).rejects.toBeInstanceOf(SlugAlreadyInUseError)
        });

        it('should not create the user when email already exists', async () => {
            await sut.execute(makeInput());

            await expect(
                sut.execute(makeInput({ slug: 'outro-slug' }))
            ).rejects.toThrow();

            expect(userRepository.items).toHaveLength(1);
        });

        it('should not create the user when slug already exists', async () => {
            await sut.execute(makeInput());

            await expect(
                sut.execute(makeInput({ email: 'outro@gmail.com' }))
            ).rejects.toThrow();

            expect(userRepository.items).toHaveLength(1);
        })
    })
})