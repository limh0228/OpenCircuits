import {GRID_SIZE} from "../Constants";
import {GRID_LINE_COLOR} from "./Styles";

import {V} from "../math/Vector";

import {Renderer} from "./Renderer";
import {Camera} from "../Camera";

import {Style} from "./Style";

export const Grid = (() => {

    return {
        render(renderer: Renderer, camera: Camera): void {
            const step = GRID_SIZE/camera.getZoom();

            const cpos = camera.getPos().scale(1.0/camera.getZoom()).sub(renderer.getSize().scale(0.5));

            let cpx = cpos.x - Math.floor(cpos.x / step) * step;
            if (cpx < 0) cpx += step;
            let cpy = cpos.y - Math.floor(cpos.y / step) * step;
            if (cpy < 0) cpy += step;

            // Batch-render the lines = uglier code + way better performance
            renderer.save();
            renderer.setStyle(new Style(undefined, GRID_LINE_COLOR, 1.0 / camera.getZoom()));
            renderer.beginPath();
            for (let x = -cpx; x <= renderer.getSize().x-cpx+step; x += step)
                renderer.pathLine(V(x, 0), V(x, renderer.getSize().y));
            for (let y = -cpy; y <= renderer.getSize().y-cpy+step; y += step)
                renderer.pathLine(V(0, y), V(renderer.getSize().x, y));
            renderer.closePath();
            renderer.stroke();
            renderer.restore();
        }
    };
})();
