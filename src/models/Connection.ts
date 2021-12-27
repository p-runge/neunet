import { random } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { Neuron } from ".";

export class Connection {
  private _id: string;
  private _weight: number;

  constructor(private _from: Neuron, private _to: Neuron) {
    this._id = uuidv4();

    const minWeight = -4;
    const maxWeight = 4;
    this._weight = random(minWeight, maxWeight);
  }

  get id(): string {
    return this._id;
  }
  get from(): Neuron {
    return this._from;
  }
  get to(): Neuron {
    return this._to;
  }
  get weight(): number {
    return this._weight;
  }

  toJSON() {
    return {
      id: this._id,
      weight: this._weight,
      from: this._from.id,
      to: this._to.id,
    };
  }
}
