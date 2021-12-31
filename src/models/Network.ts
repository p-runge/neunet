import { random } from '../utils';
import { Connection, Neuron, InnerNeuron } from '.';

export class Network {
  private _innerNeurons: Neuron[];

  private static connectNeurons(inputNeuron: Neuron, outputNeuron: Neuron) {
    const c = new Connection(inputNeuron, outputNeuron);
    inputNeuron.addOutputConnection(c);
    outputNeuron.addInputConnection(c);
  }

  constructor(
    private _sensoryNeurons: Neuron[],
    private _motorNeurons: Neuron[],
    innerNeuronsAmount: number,
    connectionDensity: number,
  ) {
    this._innerNeurons = [...Array(innerNeuronsAmount)].map(() => {
      return new Neuron({} as InnerNeuron);
    });

    const allInputNeurons: Neuron[] = this.sensoryNeurons.concat(
      this.innerNeurons,
    );
    const allOutputNeurons: Neuron[] = this.motorNeurons.concat(
      this.innerNeurons,
    );
    allInputNeurons.forEach((inputNeuron) => {
      allOutputNeurons.forEach((outputNeuron) => {
        if (
          !inputNeuron.isDependingOn(outputNeuron) && random() <= connectionDensity
        ) {
          Network.connectNeurons(inputNeuron, outputNeuron);
        }
      });
    });

    this.cleanse();
  }

  get sensoryNeurons(): Neuron[] {
    return this._sensoryNeurons;
  }

  get innerNeurons(): Neuron[] {
    return this._innerNeurons;
  }

  get motorNeurons(): Neuron[] {
    return this._motorNeurons;
  }

  private cleanse(): void {
    this._sensoryNeurons = this._sensoryNeurons.filter(Neuron.isValid);
    this._innerNeurons = this._innerNeurons.filter(Neuron.isValid);
    this._motorNeurons = this._motorNeurons.filter(Neuron.isValid);
  }

  read(): void {
    this.sensoryNeurons.forEach((sensoryNeuron) => {
      sensoryNeuron.mayFire();
    });
  }

  toJSON() {
    return {
      sensoryNeurons: this._sensoryNeurons.map((n) => {
        return n.toJSON();
      }),
      innerNeurons: this._innerNeurons.map((n) => {
        return n.toJSON();
      }),
      motorNeurons: this._motorNeurons.map((n) => {
        return n.toJSON();
      }),
    };
  }
}
