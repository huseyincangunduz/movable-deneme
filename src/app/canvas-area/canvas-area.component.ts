import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  ElementRef
} from "@angular/core";
import { OnPinch, OnScale, OnDrag, OnRotate, OnResize, OnWarp } from "moveable";

import { NgxMoveableComponent } from "ngx-moveable";
import { Frame } from "scenejs";
import { ElementMapper } from "./elementMapper";

@Component({
  selector: 'app-canvas-area',
  templateUrl: './canvas-area.component.html',
  styleUrls: ['./canvas-area.component.scss']
})
export class CanvasAreaComponent implements OnInit {

  target: HTMLElement;
  @ViewChild("label", { static: false }) label: ElementRef;
  @ViewChild("moveable", { static: false }) moveable: NgxMoveableComponent;
  scalable = true;
  resizable = false;
  warpable = false;
  mapper: ElementMapper;

  constructor() {
    this.mapper = new ElementMapper();
  }

  frame = new Frame({
    left: "0px",
    top: "0px",
    transform: {
      rotate: "0deg",
      scaleX: 1,
      scaleY: 1,
      matrix3d: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    }
  });

  generateFrame(element) {
    return this.mapper.getCanvasOfElement(element)
  }

  ngOnInit(): void {
    window.addEventListener("resize", this.onWindowReisze);
  }
  ngOnDestroy(): void {
    window.removeEventListener("resize", this.onWindowReisze);
  }
  onWindowReisze = () => {
    this.moveable.updateRect();
  };
  clickScalable() {
    this.scalable = true;
    this.resizable = false;
    this.warpable = false;
  }
  clickResizable() {
    this.scalable = false;
    this.resizable = true;
    this.warpable = false;
  }
  clickWarpable() {
    this.scalable = false;
    this.resizable = false;
    this.warpable = true;
  }

  setTransform(target: HTMLElement | SVGAElement | any) {
    target.style.cssText = this.generateFrame(target).toCSS();
    // const h = target.getBoundingClientRect().height, w = target.getBoundingClientRect().width
    // if (h) {
    //   target.style.height = `${h}px`;
    // }
    // if (w) {
    //   target.style.width = `${w}px`;
    // }
  }

  setLabel(clientX, clientY, text, element) {
    const frame = this.generateFrame(element);
    this.label.nativeElement.style.cssText = `
display: block; transform: translate(${clientX}px, ${clientY -
      10}px) translate(-100%, -100%) translateZ(-100px);`;
    this.label.nativeElement.innerHTML = text;
  }
  
  onPinch({ target, clientX, clientY }: OnPinch) {
    const frame = this.generateFrame(target);
    setTimeout(() => {
      this.setLabel(
        clientX,
        clientY,
        `X: ${frame.get("left")}
  <br/>Y: ${frame.get("top")}
  <br/>W: ${frame.get("width")}
  <br/>H: ${frame.get("height")}
  <br/>S: ${frame.get("transform", "scaleX").toFixed(2)}, ${frame
          .get("transform", "scaleY")
          .toFixed(2)}
  <br/>R: ${parseFloat(frame.get("transform", "rotate")).toFixed(1)}deg
  `, target
      );
    });
  }
  onDrag({ target, clientX, clientY, top, left, isPinch }: OnDrag) {
    const frame = this.generateFrame(target);
    frame.set("left", `${left}px`);
    frame.set("top", `${top}px`);
    this.setTransform(target);
    if (!isPinch) {
      this.setLabel(clientX, clientY, `X: ${left}px<br/>Y: ${top}px`, target);
    }
  }
  onScale({ target, delta, clientX, clientY, isPinch }: OnScale) {
    const frame = this.generateFrame(target);
    const scaleX = frame.get("transform", "scaleX") * delta[0];
    const scaleY = frame.get("transform", "scaleY") * delta[1];
    frame.set("transform", "scaleX", scaleX);
    frame.set("transform", "scaleY", scaleY);
    this.setTransform(target);
    if (!isPinch) {
      this.setLabel(
        clientX,
        clientY,
        `S: ${scaleX.toFixed(2)}, ${scaleY.toFixed(2)}`, target
      );
    }
  }
  onRotate({ target, clientX, clientY, beforeDelta, isPinch }: OnRotate) {
    const frame = this.generateFrame(target);
    const deg = parseFloat(frame.get("transform", "rotate")) + beforeDelta;

    frame.set("transform", "rotate", `${deg}deg`);
    this.setTransform(target);
    if (!isPinch) {
      this.setLabel(clientX, clientY, `R: ${deg.toFixed(1)}`,target);
    }
  }
  onResize({ target, clientX, clientY, width, height, isPinch }: OnResize) {
    const frame = this.generateFrame(target);
    frame.set("width", `${width}px`);
    frame.set("height", `${height}px`);
    this.setTransform(target);
    if (!isPinch) {
      this.setLabel(clientX, clientY, `W: ${width}px<br/>H: ${height}px`, target);
    }
  }
  onWarp({ target, clientX, clientY, delta, multiply }: OnWarp) {
    const frame = this.generateFrame(target);
    frame.set(
      "transform",
      "matrix3d",
      multiply(frame.get("transform", "matrix3d"), delta)
    );
    this.setTransform(target);
    this.setLabel(clientX, clientY, `X: ${clientX}px<br/>Y: ${clientY}px`, target);
  }
  onEnd() {
    this.label.nativeElement.style.display = "none";
  }
  setTarget(event: MouseEvent) {
    this.target = event.currentTarget as HTMLElement;
  }
}
