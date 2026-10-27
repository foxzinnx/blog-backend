import { NameCannotBeEmptyError } from "../errors/name-cannot-be-empty.error.js";
import { NameIsTooLongError } from "../errors/name-is-too-long.error.js";
import { NameIsTooShortError } from "../errors/name-is-too-short.error.js";

export class Name {
    private static readonly MIN_LENGTH = 3;
    private static readonly MAX_LENGTH = 70;
    private readonly _value: string;

    private constructor(name: string){
        this._value = name;
    }

    static create(name: string): Name {
        return new Name(Name.validate(name));
    }

    private static validate(name: string): string {
        const trimmed = name.trim();

        if(!trimmed){
            throw new NameCannotBeEmptyError();
        }

        if(trimmed.length < Name.MIN_LENGTH){
            throw new NameIsTooShortError(Name.MIN_LENGTH);
        }

        if(trimmed.length > Name.MAX_LENGTH){
            throw new NameIsTooLongError(Name.MAX_LENGTH);
        }

        return trimmed;
    }

    get value(): string {
        return this._value;
    }

    equals(other: Name): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }
}