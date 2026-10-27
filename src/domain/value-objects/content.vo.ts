import { ContentIsTooLongError } from "../errors/content-is-too-long.error.js";
import { ContentIsTooShortError } from "../errors/content-is-too-short.error.js";

export class Content {
    private static readonly MIN_LENGTH = 1;
    private static readonly MAX_LENGTH = 60;
    private readonly _value: string;

    private constructor(content: string){
        this._value = content;
    }

    static create(content: string): Content {
        return new Content(Content.validate(content));
    }

    private static validate(content: string){
        const trimmed = content.trim();

        if(!trimmed || trimmed.length < Content.MIN_LENGTH){
            throw new ContentIsTooShortError(Content.MIN_LENGTH);
        }

        if(trimmed.length > Content.MAX_LENGTH){
            throw new ContentIsTooLongError(Content.MAX_LENGTH);
        }

        return trimmed;
    }

    get value(): string {
        return this._value;
    }

    equals(other: Content): boolean {
        return this._value === other._value;
    }
}