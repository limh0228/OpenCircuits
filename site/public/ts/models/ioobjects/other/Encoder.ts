import {DEFAULT_SIZE} from "../../../utils/Constants";
import {V} from "../../../utils/math/Vector";
import {Component} from "../Component";
import {ClampedValue} from "../../../utils/ClampedValue";
import {InputPort}from "../../../models/ioobjects/InputPort";
import {OutputPort}from "../../../models/ioobjects/OutputPort";

export class Encoder extends Component{

/*
NEEDS:
- the first input doesn't matter (the enable)
- array of inputs
- array of outputs
- size/type of encoder (4:2 or 8:3)

PROBLEMS/THINGS TO TAKE INTO ACCOUNT
- only one input can be 1. the rest must be zero
- if a priotiyy encoder, then more than one 1 can be allowed in inputs
  but priority is given to
- There is an ambiguity, when all outputs of encoder are equal to zero. Because, it could
  be the code corresponding to the inputs, when only least significant input is one or when
  all inputs are zero.
*/
	public constructor() {
		super(new ClampedValue(4,2,Math.pow(2,8)), new ClampedValue(2,1,8), V(DEFAULT_SIZE*2, DEFAULT_SIZE*2));
		this.setLabels();
		super.updatePortPositions(this.inputs);
	}

	public setLabels(){
		//labels for the inputs
		for(let i = 0; i < this.inputs.length; i++) this.getInputPort(i).setName("D" + String(i));

		//labels for the output
		for(let j = 0; j < this.outputs.length; j++) this.getOutputPort(j).setName("Q" + String(j));
	}

	//@Override
	public setOutputPortCount(val: number): void {
		this.setPortCount(this.outputs, this.outputPortCount, val, OutputPort);
		this.setPortCount(this.inputs, this.inputPortCount, Math.pow(2,val), InputPort);
		this.setLabels();
		this.transform.setSize(V(DEFAULT_SIZE*2, DEFAULT_SIZE*(this.inputs.length/2)));
		super.updatePortPositions(this.inputs);
	}

	//@Override
	public activate() {
		let index = -1;
        for (let i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].getIsOn()) {
				//index is which input is on
                index = i;
            }
        }
		//if all the inputs are off
        if (index == -1)
            return; // undefined behavior

		for (let i = this.outputs.length-1; i >= 0; i--) {
            const num = 1 << i;
            if (num > index) {
                this.outputs[i].activate(false);
            }
			else {
                this.outputs[i].activate(true);
                index -= num;
            }
        }
	}

	public getDisplayName() {
		return "Encoder";
	}

    public getXMLName(): string {
        return "encoder";
    }
}
