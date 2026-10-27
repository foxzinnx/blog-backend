import { DomainError } from "./domain-error.js";

export class InvalidEmailAddressError extends DomainError {
    readonly code = 'INVALID_EMAIL_ADDRESS';

    constructor(){
        super('Endereço de email inválido');
        this.name = 'InvalidEmailAddressError';
    }
}