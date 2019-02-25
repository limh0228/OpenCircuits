import {Register} from "./Register";

export class PIPO extends Register {
	
	public constructor(buffered: boolean) {
		super(6, buffered);
	}

	private updateInputs() {
		
	}
	//make something that edits the number of inputs when the register size changes

	// @Override
	public activate() {
		this.last_clock = this.clock;
		this.clock = this.inputs[1].getIsOn();
		if (this.isBuffered) this.buffer = this.inputs[2].getIsOn();
		const set = this.inputs[0].getIsOn();

		if (this.clock && !this.last_clock) {
			if (set) {
				//go through inputs and assign to register
				for (let i = 2 + (this.isBuffered ? 1 : 0); i < this.inputs.length; i++)
					this.state[i] = this.inputs[i].getIsOn();
			} else {
				//the first of the parallel inputs is the default data line
				this.state.pop();
				this.state.unshift(this.inputs[2 + (this.isBuffered ? 1 : 0)].getIsOn());
			}
		}

		if (!this.isBuffered || this.buffer) {
			for (let i = 0; i < this.outputs.length; i++)
				super.activate(this.state[i], i);	
		}
	}

	public getDisplayName(): string {
		return this.isBuffered ? "Buffered PIPO Register" : "PIPO Register";
	}

	public getXMLName(): string {
		return "sipo";
	}
}
