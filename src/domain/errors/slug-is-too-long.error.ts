import { DomainError } from "./domain-error.js";

export class SlugIsTooLongError extends DomainError {
    readonly code = 'SLUG_IS_TOO_LONG';

    constructor(maxLength: number){
        super(`O texto do slug é muito grande (max ${maxLength} caracteres)`);
        this.name = 'SlugIsTooLongError';
    }
}