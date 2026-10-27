import { User } from "../../../domain/entities/user.entity.js";
import { EmailAlreadyInUseError} from "../../../domain/errors/email-already-in-use.error.js";
import { SlugAlreayInUseError } from "../../../domain/errors/slug-alreay-in-use.error.js";
import type { UserRepository } from "../../../domain/repositories/user.repository.js";
import { Email } from "../../../domain/value-objects/email.vo.js";
import { Name } from "../../../domain/value-objects/name.vo.js";
import { Slug } from "../../../domain/value-objects/slug.vo.js";
import type { CreateUserInputDTO, UserOutputDTO } from "../../dtos/user.dto.js";
import type { Hasher } from "../../ports/hasher.js";

export class CreateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hasher: Hasher
    ){}

    async execute(input: CreateUserInputDTO): Promise<UserOutputDTO>{
        const existingEmail = await this.userRepository.findByEmail(input.email);
        if(existingEmail){
            throw new EmailAlreadyInUseError();
        }

        const existingSlug = await this.userRepository.findBySlug(input.slug);
        if(existingSlug){
            throw new SlugAlreayInUseError();
        }

        const hashedPassword = await this.hasher.hash(input.password);

        const user = User.create({
            name: Name.create(input.name),
            email: Email.create(input.email),
            passwordHash: hashedPassword,
            slug: Slug.create(input.slug)
        });

        await this.userRepository.create(user);

        return user.toOutputDTO();
    }
}