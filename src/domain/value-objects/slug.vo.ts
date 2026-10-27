import { SlugCannotBeEmptyError } from "../errors/slug-cannot-be-empty.error.js";
import { SlugIsTooLongError } from "../errors/slug-is-too-long.error.js";
import { SlugIsTooShortError } from "../errors/slug-is-too-short.error.js";

export class Slug {
    private static readonly MIN_LENGTH = 3;
    private static readonly MAX_LENGTH: 50;
    private readonly _value: string;

    private constructor(value: string){
        this._value = value;
        Object.freeze(this);
    }

    static create(slug: string): Slug {
        if(!slug || slug.trim() === ""){
            throw new SlugCannotBeEmptyError();
        }

        const formattedSlug = Slug.createSlug(slug);

        if(formattedSlug.length < Slug.MIN_LENGTH){
            throw new SlugIsTooShortError(Slug.MIN_LENGTH);
        }

        if(formattedSlug.length > Slug.MAX_LENGTH){
            throw new SlugIsTooLongError(Slug.MAX_LENGTH);
        }

        return new Slug(formattedSlug);
    }

    private static createSlug(text: string): string {
        return text
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/[\s-]+/g, "-")
            .replace(/^-+|-+\$/g, "");
    }

    get value(): string {
        return this._value;
    }

    equals(other: Slug): boolean {
        return this._value === other._value;
    }
}