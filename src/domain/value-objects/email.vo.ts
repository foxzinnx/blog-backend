import { InvalidEmailAddressError } from "../errors/invalid-email-address.error.js";

export class Email {
    private readonly _value: string;

    private constructor(value: string){
        this._value = value;
        Object.freeze(this);
    }

    static create(email: string): Email {
        return new Email(Email.validate(email));
    }

    private static isValid(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    private static validate(email: string){
        if(typeof email !== 'string'){
            throw new InvalidEmailAddressError();
        }

        const normalized = email.toLowerCase().trim();

        if(!Email.isValid(normalized)){
            throw new InvalidEmailAddressError();
        }

        return normalized;
    }

    get value(): string {
        return this._value;
    }

    equals(other: Email): boolean {
        return this._value === other._value;
    }
}