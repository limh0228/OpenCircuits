import "jest";

import {CircuitDesigner} from "../../../../../../site/public/ts/models/CircuitDesigner";
import {Switch}          from "../../../../../../site/public/ts/models/ioobjects/inputs/Switch";
import {Encoder}         from "../../../../../../site/public/ts/models/ioobjects/other/Encoder";
import {LED}             from "../../../../../../site/public/ts/models/ioobjects/outputs/LED";

describe("Encoder", () => {
    let designer = new CircuitDesigner(0);
    let y0 = new Switch(), y1 = new Switch(), y2 = new Switch(), y3 = new Switch();
    let E = new Encoder(), q0 = new LED(), q1 = new LED();

    designer.addObjects([y0, y1, y2, y3, E, q0, q1]);
    designer.connect(y0, 0,  E, 0);
    designer.connect(y1, 0,  E, 1);
    designer.connect(y2, 0,  E, 2);
    designer.connect(y3, 0,  E, 3);

    designer.connect(E, 0,  q0, 0);
    designer.connect(E, 1,  q1, 0);

    it("Initial State", () => {
        expect(q0.isOn()).toBe(false);
        expect(q1.isOn()).toBe(false);
    });
    it("Test first state: Enable is HIGH", () => {
        y0.activate(true);
        expect(q0.isOn()).toBe(false);
        expect(q1.isOn()).toBe(false);
    });
    it("Test Second state: w/ enable HIGH", () => {
        y1.activate(true);
        expect(q0.isOn()).toBe(true);
        expect(q1.isOn()).toBe(false);
    });
    it("Test third state: w/ enable HIGH", () => {
        y2.activate(true);
        expect(q0.isOn()).toBe(false);
        expect(q1.isOn()).toBe(true);
    });
    it("Test fourth state: w/ enable HIGH", () => {
        y3.activate(true);
        expect(q0.isOn()).toBe(true);
        expect(q1.isOn()).toBe(true);
    });
    it("Remove other inputs", () => {
        y2.activate(false);
        expect(q0.isOn()).toBe(true);
        expect(q1.isOn()).toBe(true);

        y1.activate(false);
        expect(q0.isOn()).toBe(true);
        expect(q1.isOn()).toBe(true);

        y0.activate(false);
        expect(q0.isOn()).toBe(true);
        expect(q1.isOn()).toBe(true);
    });
    //make a test for the 8:3 encoder
});
