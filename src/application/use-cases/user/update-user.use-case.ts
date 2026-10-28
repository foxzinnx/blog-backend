import type { UpdateUserInputDTO } from "@/application/dtos/user.dto.js";
import { EmailAlreadyInUseError } from "@/domain/errors/email-already-in-use.error.js";
import { NotFoundError } from "@/domain/errors/not-found.error.js";
import { SlugAlreayInUseError } from "@/domain/errors/slug-alreay-in-use.error.js";
import type { UserRepository } from "@/domain/repositories/user.repository.js";
import { Bio } from "@/domain/value-objects/bio.vo.js";
import { Email } from "@/domain/value-objects/email.vo.js";
import { Name } from "@/domain/value-objects/name.vo.js";
import { Slug } from "@/domain/value-objects/slug.vo.js";
import { UniqueEntityId } from "@/domain/value-objects/unique-entity-id.vo.js";

export class UpdateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ){}

    async execute(id: string, input: UpdateUserInputDTO){
        const userId = new UniqueEntityId(id);
        const user = await this.userRepository.findById(userId);
        if(!user){
            throw new NotFoundError('Usuário');
        }

        if(input.email && input.email !== user.email.value){
            const existingByEmail = await this.userRepository.findByEmail(input.email);
            if(existingByEmail){
                throw new EmailAlreadyInUseError();
            }

            const newEmail = Email.create(input.email);
            user.updateEmail(newEmail);
        }

        if(input.name){
            const newName = Name.create(input.name);
            user.updateName(newName);
        }

        if(input.slug && input.slug !== user.slug.value){
            const existingBySlug = await this.userRepository.findBySlug(input.slug);
            if(existingBySlug){
                throw new SlugAlreayInUseError();
            }
            
            const newSlug = Slug.create(input.slug);
            user.updateSlug(newSlug);
        }

        if(input.bio){
            const newBio = Bio.create(input.bio);
            user.updateBio(newBio);
        }

        await this.userRepository.save(user);

        return user.toOutputDTO();
    }
}