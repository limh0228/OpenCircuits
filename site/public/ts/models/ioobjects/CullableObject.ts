import {Vector,V} from "../../utils/math/Vector";
import {Transform} from "../../utils/math/Transform";

import {IOObject} from "./IOObject"

export abstract class CullableObject extends IOObject {
    private cullTransform: Transform;

    public constructor() {
        super();

        this.cullTransform = new Transform(V(), V());
    }

    private updateCullTransform(): void {
        // @TODO change this cause it's inefficient to
        //  recalculate the cull box if nothing has changed

        const min = this.getMinPos();
        const max = this.getMaxPos();

        this.cullTransform.setSize(max.sub(min));
        this.cullTransform.setPos(min.add(max).scale(0.5));
    }

    public getCullBox(): Transform {
        this.updateCullTransform();
        return this.cullTransform;
    }

    public copy(): CullableObject {
        const copy = <CullableObject>super.copy();
        copy.cullTransform = this.cullTransform.copy();
        return copy;
    }

    public abstract getMinPos(): Vector;
    public abstract getMaxPos(): Vector;

}
