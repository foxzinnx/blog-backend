import { randomUUID } from 'node:crypto';

export class UniqueEntityId {
    private readonly _value: string;

    constructor(id?: string){
        this._value = id ?? randomUUID();
    }

    get value(): string {
        return this._value;
    }

    equals(other: UniqueEntityId): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }
}