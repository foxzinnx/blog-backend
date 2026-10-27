import { BioIsTooLongError } from "../errors/bio-is-too-long.error.js";

export class Bio {
    private static readonly MAX_LENGTH = 160;
    private readonly _value: string;

    private constructor(value: string){
        this._value = value;
        Object.freeze(this);
    }

    static create(bio: string): Bio {
        if(bio.length > Bio.MAX_LENGTH){
            throw new BioIsTooLongError(Bio.MAX_LENGTH);
        }

        return new Bio(bio);
    }

    get value(): string {
        return this._value;
    }

    equals(other: Bio): boolean {
        return this._value === other._value;
    }
}