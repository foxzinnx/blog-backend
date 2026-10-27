import { UniqueEntityId } from "../value-objects/unique-entity-id.vo.js";

export abstract class Entity<Props>{
    protected readonly _id: UniqueEntityId;
    protected _props: Props;

    protected constructor(props: Props, id?: UniqueEntityId){
        this._id = id ?? new UniqueEntityId(id);
        this._props = props;
    }

    get id(): UniqueEntityId {
        return this._id;
    }

    equals(other: Entity<Props>): boolean {
        return this._id.equals(other._id);
    }
}