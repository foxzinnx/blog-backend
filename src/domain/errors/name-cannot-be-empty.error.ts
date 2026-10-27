import { DomainError } from "./domain-error.js";

export class NameCannotBeEmptyError extends DomainError {
    readonly code = 'NAME_CANNOT_BE_EMPTY';

    constructor(){
        super('O nome não pode ser vazio');
        this.name = 'NameCannotBeEmptyError';
    }
}