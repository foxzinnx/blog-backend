import { DomainError } from "./domain-error.js";

export class CannotArchiveDraftPostError extends DomainError {
    readonly code = 'CANNOT_ARCHIVE_DRAFT_POST';

    constructor() {
        super('Não é possível arquivar um rascunho');
        this.name = 'CannotArchiveDraftPostError';
    }
}