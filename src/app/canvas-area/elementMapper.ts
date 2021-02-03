import { Frame } from "scenejs";
const MAP_ID_ATTRIBUTE_KEY = "map-id";
export class ElementMapper {
    map: { [key: string]: HTMLElement } = {};
    canvases: { [key: string]: Frame } = {};

    getMapId(element: HTMLElement) {
        const mapId = element.getAttribute(MAP_ID_ATTRIBUTE_KEY) || this.registerMap(element);
        return mapId;
    }

    getCanvasOfElement(element: HTMLElement) {
        const mapId = this.getMapId(element);
        if (!this.canvases[mapId]) 
        {
            this.canvases[mapId] = new Frame({
                left: "0px",
                top: "0px",
                transform: {
                  rotate: "0deg",
                  scaleX: 1,
                  scaleY: 1,
                  matrix3d: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
                }
              });
        }
        return this.canvases[mapId];
        
    }

    registerMap(element: HTMLElement): string {
        let mapIdNew;
        do {
            mapIdNew = Math.random().toString(36).slice(2);
        }
        while (this.map[mapIdNew] != null)
        this.map[mapIdNew] = element;
        element.setAttribute(MAP_ID_ATTRIBUTE_KEY, mapIdNew)
        return mapIdNew;
    }
}