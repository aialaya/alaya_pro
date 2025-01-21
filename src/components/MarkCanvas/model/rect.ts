import { v4 as uuidv4 } from 'uuid';

export type RectData = {
   index: number;
   uuid: string;
   tag: string;
   type: string;
   timestamp: number;
   dpr: number;
   color: string;
   minX: number;
   minY: number;
   maxX: number;
   maxY: number;
   vertexSize: number;
   scale: number;
   realScale: number;
   dragging: boolean;
   resizing: boolean;
   changed: boolean;
   vertexIndex: number;
}

export const getInitRectData = (index:number,dpr:number,startX:number,startY:number,scale:number):RectData => {
  return {
    index: index,
    uuid: uuidv4(),
    tag: 'undefined',
    type:'rect',
    timestamp: Date.now(),
    dpr:dpr,
    color:'rgba(0, 0, 255, 0.3)',
    minX:startX,
    minY:startY,
    maxX:startX,
    maxY:startY,
    vertexSize:5*dpr,
    scale:scale,
    realScale:scale,
    dragging:false,
    resizing:false,
    changed:false,
    vertexIndex:-1,
  }
}

export class Rect {
  ctx: CanvasRenderingContext2D
  data:RectData
  constructor(ctx: CanvasRenderingContext2D,data:RectData) {
    this.ctx = ctx
    this.data = data
  }
  getType(): string {
    return this.data.type;
  }

  getId(): string {
    return this.data.uuid;
  }

  getTtg(): string {
    return this.data.tag;
  }
  setTtg(tag:string){
    this.data.tag = tag
  }
  setIndex(index:number){
    this.data.index = index
  }
  getIndex():number{
    return this.data.index
  }
  setColor(color: string): void {
    this.data.color = color;
  }
  adjustCoordinate() {
    let temp = 0;
    if (this.data.minX > this.data.maxX) {
      temp = this.data.minX;
      this.data.minX = this.data.maxX;
      this.data.maxX = temp;
    }
    if (this.data.minY > this.data.maxY) {
      temp = this.data.minY;
      this.data.minY = this.data.maxY;
      this.data.maxY = temp;
    }
  }
  draw(scale: number) {
    if (this.data.minX === this.data.maxX || this.data.minY === this.data.maxY) {
      return;
    }
    this.data.realScale = 1 / this.data.scale * scale;
    const factor = this.data.realScale * this.data.dpr;
    const minX = this.data.minX * factor;
    const minY = this.data.minY * factor;
    const maxX = this.data.maxX * factor;
    const maxY = this.data.maxY * factor;
    this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(minX, minY);
      this.ctx.lineTo(maxX, minY);
      this.ctx.lineTo(maxX, maxY);
      this.ctx.lineTo(minX, maxY);
      this.ctx.lineTo(minX, minY);
      this.ctx.fillStyle = this.data.color;
      this.ctx.strokeStyle = "#1AE28E";
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = 'square';
      this.ctx.fill();
      this.ctx.stroke();
    this.ctx.restore();
    this.drawVertex(minX, maxX, minY, maxY);
  }
  drawLabel(scale:number) {
    this.data.realScale = 1 / this.data.scale * scale;
    const factor = this.data.realScale * this.data.dpr;
    const minX = this.data.minX * factor;
    const minY = (this.data.minY-6) * factor;
    this.ctx.save();
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#1AE28E';
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.7)";  
      this.ctx.shadowOffsetX = 0;                  
      this.ctx.shadowOffsetY = 0;                   
      this.ctx.shadowBlur = 3;                     
      this.ctx.fillText(`${this.data.index}.${this.data.tag}`, minX, minY);
    this.ctx.restore();
  }
  drawVertex(minX: number, maxX: number, minY: number, maxY: number) {
    this.ctx.save();
    const size = this.data.vertexSize;
      for (const point of [
        [minX, minY], [maxX, minY],
        [maxX, maxY], [minX, maxY]
    ]) {
        this.ctx.beginPath();
        this.ctx.arc(point[0], point[1], size, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.strokeStyle = '#009DFF';
        this.ctx.fill();
        this.ctx.stroke();
    }
    this.ctx.restore();
  }
  isSelected(x: number, y: number) {
    return this.isPointInside(x, y) || this.isPointInsideVertex(x, y) !== -1;
  }
  isPointInside(x: number, y: number) {
    x = x / this.data.realScale;
    y = y / this.data.realScale;
    return x >= this.data.minX && x <= this.data.maxX && y >= this.data.minY && y <= this.data.maxY;
  }
  isPointInsideVertex(x: number, y: number) {
    x = x / this.data.realScale;
    y = y / this.data.realScale;
    const vertices = [
        {x: this.data.minX, y: this.data.minY},
        {x: this.data.maxX, y: this.data.minY},
        {x: this.data.maxX, y: this.data.maxY},
        {x: this.data.minX, y: this.data.maxY}
    ];
    
    const radius = this.data.vertexSize / 2;
    let index = -1;
    
    for (let i = 0; i < vertices.length; i++) {
        const vx = vertices[i].x;
        const vy = vertices[i].y;
        const distance = Math.sqrt(Math.pow(x - vx, 2) + Math.pow(y - vy, 2));
        if (distance <= radius) {
            index = i;
            break;
        }
    }
    
    return index;
}
  mouseDown(x: number, y: number): boolean {
    this.data.vertexIndex = this.isPointInsideVertex(x, y);
    if (this.data.vertexIndex !== -1) {
      this.data.resizing = true;
      return true
    } else if (this.isPointInside(x, y)) {
      this.data.dragging = true;
      return true
    }
    return false
  }

  mouseMove(e: MouseEvent, that: { prevX: number, prevY: number },updateHandler?: (prevX: number, prevY: number) => void) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    if (this.data.dragging) {
      this.data.changed = true;
      const deltaX = mouseX - that.prevX;
      const deltaY = mouseY - that.prevY;
      const scaledDeltaX = (mouseX - that.prevX) / this.data.realScale;
      const scaledDeltaY = (mouseY - that.prevY) / this.data.realScale;
      this.data.minX += scaledDeltaX;
      this.data.minY += scaledDeltaY;
      this.data.maxX += scaledDeltaX;
      this.data.maxY += scaledDeltaY;
      if (updateHandler) {
        updateHandler(deltaX, deltaY);
      }
    }
    if (this.data.resizing) {
      this.data.changed = true;
      const scaledX = mouseX / this.data.realScale;
      const scaledY = mouseY / this.data.realScale;
      switch (this.data.vertexIndex) {
        case 0:
          this.data.minX = scaledX;
          this.data.minY = scaledY;
          break;
        case 1:
          this.data.maxX = scaledX;
          this.data.minY = scaledY;
          break;
        case 2:
          this.data.maxX = scaledX;
          this.data.maxY = scaledY;
          break;
        case 3:
          this.data.minX = scaledX;
          this.data.maxY = scaledY;
          break;
      }
    }
  }

  mouseUp() {
    this.data.dragging = false;
    this.data.resizing = false;
    this.adjustCoordinate();
    if (this.data.minX === this.data.maxX) {
      this.data.maxX += 1;
    }
    if(this.data.minY === this.data.maxY) {
      this.data.maxY += 1;
    }
  }
}
