import { DomainError } from "./domain-error.js";

export class CannotPublishArchivedPostError extends DomainError {
    readonly code = 'CANNOT_PUBLISH_ARCHIVED_POST';

    constructor(){
        super('Não é possível publicar um post arquivado');
        this.name = 'CannotPublishArchivedPostError';
    }
}