import { DomainError } from "./domain-error.js";

export class NameIsTooShortError extends DomainError {
    readonly code = 'NAME_IS_TOO_SHORT';

    constructor(minLength: number){
        super(`O nome é muito curto (min ${minLength} caracteres)`);
        this.name = 'NameIsTooShortError';
    }
}