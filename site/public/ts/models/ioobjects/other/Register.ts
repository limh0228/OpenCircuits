import {V, Vector} from "../../../utils/math/Vector";
import {ClampedValue} from "../../../utils/ClampedValue";
import {XMLNode} from "../../../utils/io/xml/XMLNode";
import {Component} from "../Component";

//
// Register is an abstract superclass for general Registers.
//
export abstract class Register extends Component {
    protected isBuffered: boolean = false;
    protected buffer: boolean = false;
    protected clock: boolean = false;
    protected last_clock: boolean = false;
    protected state: boolean[];

    constructor(numInputs: number, buffered: boolean) {
        super(new ClampedValue(numInputs + (buffered ? 1 : 0)), new ClampedValue(4,1,8), V(60, 60));
        this.isBuffered = buffered;
        this.state = new Array(this.getOutputPortCount());
    }

    // @overide
    protected setPortCount(arr: Array<Port>, val: ClampedValue, newVal: number, type: typeof InputPort | typeof OutputPort) {
        super.setPortCount(arr, val, newVal, type);
        if (newVal != this.state.length) {
            for (let i = this.state.length; i < newVal; i++)
                this.state.push(false);
        }
    }

    public save(node: XMLNode): void {
        super.save(node);

        node.addAttribute("inputs", this.getInputPortCount());
        node.addAttribute("outputs", this.getOutputPortCount());
    }

    public load(node: XMLNode): void {
        super.load(node);

        this.setInputPortCount(node.getIntAttribute("inputs"));
        this.setOutputPortCount(node.getIntAttribute("outputs"));
    }

    public getImageName() {
        return "register.svg";
    }
}
