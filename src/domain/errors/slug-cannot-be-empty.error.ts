import { DomainError } from "./domain-error.js";

export class SlugCannotBeEmptyError extends DomainError {
    readonly code = 'SLUG_CANNOT_BE_EMPTY';

    constructor(){
        super('O texto do slug não pode estar vazio');
        this.name = 'SlugCannotBeEmptyError';
    }
}