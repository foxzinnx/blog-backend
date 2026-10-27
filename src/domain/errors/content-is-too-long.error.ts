import { DomainError } from "./domain-error.js";

export class ContentIsTooLongError extends DomainError {
    readonly code = 'CONTENT_IS_TOO_LONG';

    constructor(maxLength: number){
        super(`O conteúdo do post está muito grande (max ${maxLength} caracteres)`);
        this.name = 'ContentIsTooLongError';
    }
}