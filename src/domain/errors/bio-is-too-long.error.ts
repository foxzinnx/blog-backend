import { DomainError } from "./domain-error.js";

export class BioIsTooLongError extends DomainError {
    readonly code = 'BIO_IS_TOO_LONG';

    constructor(maxLength: number){
        super(`O tamanho da bio está muito grande (max ${maxLength} caracteres)`);
        this.name = 'BioIsTooLongError';
    }
}