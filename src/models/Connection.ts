import { v4 as uuidv4 } from 'uuid';
import { random } from '../utils';
import { Neuron } from '.';

export class Connection {
  public static MIN_WEIGHT = -4;

  public static MAX_WEIGHT = 4;

  private _id: string;

  private _weight: number;

  constructor(private _from: Neuron, private _to: Neuron) {
    this._id = uuidv4();

    this._weight = random(Connection.MIN_WEIGHT, Connection.MAX_WEIGHT);
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
