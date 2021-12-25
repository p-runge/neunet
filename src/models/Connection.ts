import { v4 as uuidv4 } from "uuid";
import { Neuron } from ".";

export class Connection {
  private _id: string;
  private _weight: number;

  constructor(private _from: Neuron, private _to: Neuron) {
    this._id = uuidv4();
    this._weight = Math.random();
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
}
