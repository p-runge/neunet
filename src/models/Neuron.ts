import { v4 as uuidv4 } from "uuid";
import { tanh } from "../utils";
import { Connection } from ".";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IOFunc = (neuron: Neuron) => number; // return 0-1

export interface SensoryNeuron {
  _inputFunction: IOFunc;
  _outputConnections?: Connection[];
}
export interface MotorNeuron {
  _inputConnections?: Connection[];
  _outputFunction: IOFunc;
}
export interface InnerNeuron {
  _inputConnections: Connection[];
  _outputConnections: Connection[];
}

export enum NeuronType {
  SENSORY = "SENSORY",
  MOTOR = "MOTOR",
  INNER = "INNER",
}

export class Neuron {
  static startsAtSensoryNeuron = ({
    type,
    inputConnections,
  }: Neuron): boolean => {
    return (
      type === NeuronType.SENSORY ||
      !!inputConnections?.find((c) => Neuron.startsAtSensoryNeuron(c.from))
    );
  };

  static endsAtMotorNeuron = ({ type, outputConnections }: Neuron): boolean => {
    return (
      type === NeuronType.MOTOR ||
      !!outputConnections?.find((c) => Neuron.endsAtMotorNeuron(c.to))
    );
  };

  static isValid = (neuron: Neuron): boolean => {
    return (
      Neuron.startsAtSensoryNeuron(neuron) && Neuron.endsAtMotorNeuron(neuron)
    );
  };

  private _id: string;
  private _type: NeuronType;
  private _inputFunction?: IOFunc;
  private _outputFunction?: IOFunc;
  private _inputConnections?: Connection[];
  private _outputConnections?: Connection[];

  constructor(neuron: SensoryNeuron | MotorNeuron | InnerNeuron) {
    const { _inputFunction } = neuron as SensoryNeuron;
    const { _outputFunction } = neuron as MotorNeuron;
    const { _inputConnections, _outputConnections } = neuron as InnerNeuron;

    // some of these functions may be undefined depending on the used neuron type for the payload
    this._inputFunction = _inputFunction;
    this._outputFunction = _outputFunction;

    this._type = (_inputFunction as IOFunc | undefined)
      ? NeuronType.SENSORY
      : (_outputFunction as IOFunc | undefined)
      ? NeuronType.MOTOR
      : NeuronType.INNER;

    this._inputConnections = (_inputFunction as IOFunc | undefined)
      ? undefined
      : _inputConnections || [];
    this._outputConnections = (_outputFunction as IOFunc | undefined)
      ? undefined
      : _outputConnections || [];

    this._id = uuidv4().substring(0, 8);
  }

  get id(): string {
    return this._id;
  }
  get type(): NeuronType {
    return this._type;
  }
  get inputConnections(): Connection[] | undefined {
    return this._inputConnections;
  }
  get outputConnections(): Connection[] | undefined {
    return this._outputConnections;
  }
  addInputConnection(connection: Connection) {
    if (this._inputConnections) {
      this._inputConnections.push(connection);
    } else {
      throw new Error(
        "Neuron has no inputConnections and can therefore not get any added"
      );
    }
  }
  addOutputConnection(connection: Connection) {
    if (this._outputConnections) {
      this._outputConnections.push(connection);
    } else {
      throw new Error(
        "Neuron has no outputConnections and can therefore not get any added"
      );
    }
  }

  // returns value between (-1/0) and 1
  getOutputValue(): number {
    // think about buffering value in prop and transform this into a real getter for performance reasons
    if (this._inputFunction) {
      return this._inputFunction(this);
    } else if (this._inputConnections) {
      return tanh(
        this._inputConnections
          .map((c) => c.from.getOutputValue() * c.weight)
          .reduce((a, b) => a + b, 0)
      );
    } else {
      throw new Error(
        `Neuron has no input of any kind: ${JSON.stringify(this)}`
      );
    }
  }

  mayFire(): void {
    if (this.getOutputValue() > 0) {
      if (this._outputFunction) {
        this._outputFunction(this);
      }
      if (this._outputConnections) {
        this._outputConnections.forEach((c) => {
          c.to.mayFire();
        });
      }
    }
  }

  isDependingOn(neuron: Neuron): boolean {
    return (
      this === neuron ||
      !!(this.inputConnections || []).find((c) => c.from.isDependingOn(neuron))
    );
  }

  toJSON() {
    return {
      id: this._id,
      type: this._type,
      inputConnections: this._inputConnections?.map((c) => c.toJSON()),
      outputConnections: this._outputConnections?.map((c) => c.toJSON()),
    };
  }
}
