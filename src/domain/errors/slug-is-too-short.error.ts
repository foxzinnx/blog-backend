import { DomainError } from "./domain-error.js";

export class SlugIsTooShortError extends DomainError {
    readonly code = 'SLUG_IS_TOO_SHORT';

    constructor(minLength: number){
        super(`O texto do slug é muito curto (min ${minLength} caracteres)`);
        this.name = 'SlugIsTooShortError';
    }
}