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

    get value(): string {
        return this._value;
    }

    get domain(): string {
        const domain = this._value.split('@')[1]!;

        return domain;
    }

    equals(other: Email): boolean {
        return this._value === other._value;
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

    private static isValid(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,10}$/;
        if(!emailRegex.test(email)) return false;
        
        const [local, domain] = email.split('@');

        if(local?.startsWith('.') || local?.endsWith('.')) return false;
        if(local?.includes('..')) return false;
        if(domain?.startsWith('-') || domain?.endsWith('-')) return false;
        if(domain?.startsWith('.') || domain?.endsWith('.')) return false;

        return true;
    }
}