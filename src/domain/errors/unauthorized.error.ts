import { DomainError } from "./domain-error.js";

export class UnauthorizedError extends DomainError {
    readonly code = 'UNAUTHORIZED';

    constructor(){
        super('Não autorizado');
        this.name = 'UnauthorizedError';
    }
}