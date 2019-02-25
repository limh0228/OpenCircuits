import {Register} from "./Register";

export class SIPO extends Register {

    public constructor(buffered: boolean) {
        super(3, buffered);
    }

    // @Override
    public activate() {
        this.last_clock = this.clock;
        this.clock = this.inputs[2].getIsOn();
        if (this.isBuffered) this.buffer = this.inputs[3].getIsOn();
        const data = this.inputs[0].getIsOn();
        const reset = this.inputs[1].getIsOn();

        if (this.clock && !this.last_clock) {
            if (reset)
                this.state = new Array(this.state.length);
            else {
                this.state.pop();
                this.state.unshift(data);
            }
        }

        if (!this.isBuffered || this.buffer) {
            for (let i = 0; i < this.outputs.length; i++)
                super.activate(this.state[i], i);	
        }
    }

    public getDisplayName(): string {
        return this.isBuffered ? "Buffered SIPO Register" : "SIPO Register";
    }

    public getXMLName(): string {
        return "sipo";
    }
}
