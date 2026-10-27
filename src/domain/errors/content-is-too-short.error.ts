import { DomainError } from "./domain-error.js";

export class ContentIsTooShortError extends DomainError {
    readonly code = 'CONTENT_IS_TOO_SHORT';

    constructor(minLength: number){
        super(`O conteúdo do post precisa ter no mínimo ${minLength} ${minLength > 1 ? 'caracteres': 'caracter'}`);
        this.name = 'ContentIsTooShortError';
    }
}