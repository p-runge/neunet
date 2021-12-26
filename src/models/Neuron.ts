import { v4 as uuidv4 } from "uuid";
import { Connection } from ".";

export class Neuron {
  private _id: string;
  private _bias: number;

  constructor(
    private _inputConnections: Connection[] = [],
    private _outputConnections: Connection[] = []
  ) {
    this._id = uuidv4();
    this._bias = Math.random();
  }

  get id(): string {
    return this._id;
  }
  get inputConnections(): Connection[] {
    return this._inputConnections;
  }
  get outputConnections(): Connection[] {
    return this._outputConnections;
  }
  get bias(): number {
    return this._bias;
  }
}
