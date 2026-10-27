import { DomainError } from "./domain-error.js";

export class CannotUpdateArchivedPostError extends DomainError {
    readonly code = 'CANNOT_UPDATE_ARCHIVED_POST';

    constructor(){
        super('Não é possível editar um post arquivado');
        this.name = 'CannotUpdateArchivedPostError';
    }
}