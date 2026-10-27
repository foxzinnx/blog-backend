import { DomainError } from "./domain-error.js";

export class NameIsTooLongError extends DomainError {
    readonly code = 'NAME_IS_TOO_LONG';

    constructor(maxLength: number){
        super(`O nome é muito grande (max ${maxLength} caracteres)`);
        this.name = 'NameIsTooLongError';
    }
}