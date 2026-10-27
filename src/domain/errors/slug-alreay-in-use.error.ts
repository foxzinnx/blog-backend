import { DomainError } from "./domain-error.js";

export class SlugAlreayInUseError extends DomainError {
    readonly code = 'SLUG_ALREADY_IN_USE';

    constructor(){
        super('Este slug já está em uso');
        this.name = 'SlugAlreadyInUseError';
    }
}