import {DEBUG_SHOW_CULLBOXES,
        DEFAULT_FILL_COLOR,
        DEFAULT_BORDER_COLOR,
        DEFAULT_BORDER_WIDTH,
        SELECTED_FILL_COLOR,
        SELECTED_BORDER_COLOR} from "../../Constants";

import {V} from "../../math/Vector";

import {Renderer} from "../Renderer";
import {IOLabelRenderer} from "./IOLabelRenderer";
import {IOPortRenderer} from "./IOPortRenderer";
import {GateRenderer} from "./gates/GateRenderer";
import {MultiplexerRenderer} from "./other/MultiplexerRenderer";
import {SevenSegmentDisplayRenderer} from "./outputs/SevenSegmentDisplayRenderer";

import {Transform} from "../../math/Transform";
import {Camera} from "../../Camera";

import {FlipFlop} from "../../../models/ioobjects/flipflops/FlipFlop";
import {Latch} from "../../../models/ioobjects/latches/Latch";
import {Encoder} from "../../../models/ioobjects/other/Encoder";
import {Multiplexer} from "../../../models/ioobjects/other/Multiplexer";
import {Demultiplexer} from "../../../models/ioobjects/other/Demultiplexer";
import {Component} from "../../../models/ioobjects/Component";
import {PressableComponent} from "../../../models/ioobjects/PressableComponent";
import {Gate} from "../../../models/ioobjects/gates/Gate";
import {LED} from "../../../models/ioobjects/outputs/LED";
import {SevenSegmentDisplay} from "../../../models/ioobjects/outputs/SevenSegmentDisplay";
import {IC} from "../../../models/ioobjects/other/IC";

import {Images} from "../../Images";

export var ComponentRenderer = (function() {

    let drawBox = function(renderer: Renderer, transform: Transform, selected: boolean) {
        let borderCol = (selected ? SELECTED_BORDER_COLOR : DEFAULT_BORDER_COLOR);
        let fillCol   = (selected ? SELECTED_FILL_COLOR   : DEFAULT_FILL_COLOR);
        renderer.rect(0, 0, transform.getSize().x, transform.getSize().y, fillCol, borderCol, DEFAULT_BORDER_WIDTH);
    }

    return {
        render(renderer: Renderer, camera: Camera, object: Component, selected: boolean) {
            // Check if object is on the screen
            if (!camera.cull(object.getCullBox()))
                return;

            renderer.save();

            let transform = object.getTransform();
            let imgName = object.getImageName();

            let dPos = V(0,0);
            let size = transform.getSize();

            // Transform the renderer
            renderer.transform(camera, transform);

            // Draw IO ports
            for (let i = 0; i < object.getInputPortCount(); i++)
                IOPortRenderer.renderIPort(renderer, object.getInputPort(i), selected);

            for (let i = 0; i < object.getOutputPortCount(); i++)
                IOPortRenderer.renderOPort(renderer, object.getOutputPort(i), selected);

            // Draw background box for pressable components
            if (object instanceof PressableComponent) {
                if (object.isOn())
                    imgName = object.getOnImageName();

                // Set size/pos for drawing image to be size of "pressable" part
                size = object.getPressableBox().getSize();
                dPos = object.getPressableBox().getPos();

                let box = transform;
                drawBox(renderer, box, selected);
            }

            // Specific renderers
            if (object instanceof Gate)
                GateRenderer.render(renderer, camera, object, selected);
            else if (object instanceof Multiplexer || object instanceof Demultiplexer)
                MultiplexerRenderer.render(renderer, camera, object, selected);
            else if (object instanceof SevenSegmentDisplay)
                SevenSegmentDisplayRenderer.render(renderer, camera, object, selected);
            else if (object instanceof FlipFlop || object instanceof Latch || object instanceof IC
                || object instanceof Encoder)
                drawBox(renderer, transform, selected);

            // Draw tinted image
            let tint = (selected ? SELECTED_FILL_COLOR : undefined);
            if (object instanceof LED)
                tint = object.getColor();

            if (imgName)
                renderer.image(Images.GetImage(imgName), 0, 0, size.x, size.y, tint);

            // Draw LED turned on
            if (object instanceof LED) {
                if (object.isOn())
                    renderer.image(Images.GetImage(object.getOnImageName()), 0, 0, 3*size.x, 3*size.y, object.getColor());
            }

            // Render the IOLabels, does not render labels if they are blank
            IOLabelRenderer.render(renderer, camera, object);

            renderer.restore();

            if (DEBUG_SHOW_CULLBOXES) {
                renderer.save();
                let cullBox = object.getCullBox();
                renderer.transform(camera, cullBox);
                renderer.rect(0, 0, cullBox.getSize().x, cullBox.getSize().y, '#ff00ff', '#000000', 0, 0.5);
                renderer.restore();
            }
        }
    };
})();
