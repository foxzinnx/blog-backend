import { DomainError } from "./domain-error.js";

export class InvalidStatusError extends DomainError {
    readonly code = 'INVALID_STATUS';

    constructor(){
        super('Status inválido');
        this.name = 'InvalidStatusError';
    }
}