import { CalloutInterface } from "./base";
import { v4 as uuidv4 } from 'uuid';

export interface Xy {
    x: number;
    y: number;
}

export interface SpotData {
     index: number;
     uuid: string;
     tag:string;
     type:string;
     timestamp:number;
     Point:Array<Xy>;
     dpr:number;
     fill:boolean;
     color:string;
     scale:number;
     vertexSize: number;
     realScale:number;
     selectedRectIndex:number;
     changed:boolean;
     vertexIndex:number;
}

export function getInitSpotData(index:number,point:Array<Xy>,dpr:number,scale:number){
    return {
        index:index,
        uuid:uuidv4(),
        tag:'undefined',
        type:'spot',
        timestamp: Date.now(),
        dpr:dpr,
        color:'rgba(0, 0, 255, 0.3)',
        fill:false,
        Point:point,
        scale:scale,
        realScale:scale,
        changed:false,
        vertexIndex:-1,
        selectedRectIndex:-1,
        vertexSize:5 * dpr,
    }
}



const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
export class Spot implements CalloutInterface {
    ctx:CanvasRenderingContext2D;
    data:SpotData;
    constructor(ctx: CanvasRenderingContext2D, data:SpotData) {
        this.ctx = ctx;
        this.data = data;
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
    draw(scale:number) {
        this.ctx.save();
        this.drawVertex(scale);
        this.drawBorder(scale);
        this.ctx.restore();
    }
    getType(): string {
        return this.data.type;
    }
    getId(): string {
        return this.data.uuid;
    }
    setColor(color: string): void {
        this.data.color = color;
    }
    drawCircle(x:number,y:number,scale:number,bgColor:string,borderColor:string) {
        this.data.realScale = 1 / this.data.scale * scale;
        const factor = this.data.realScale * this.data.dpr;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * factor, y * factor, this.data.vertexSize * factor, 0, 2 * Math.PI);
        this.ctx.fillStyle = bgColor;
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = 2;
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }
    drawVertex(scale:number) {
        for(let i = 0; i < this.data.Point.length; i++) {
            this.ctx.save();
            if(i == 0 && !this.data.fill){
                this.ctx.fillStyle = '#FFFFFF';
            }else{
                this.ctx.fillStyle = '#FFFFFF';
            }
            this.drawCircle(this.data.Point[i].x, this.data.Point[i].y, scale, '#FFFFFF', '#009DFF');
            this.ctx.restore();
        }
    }
    drawLine(startPoint:Xy,endPoint:Xy,scale:number) {
        this.data.realScale = 1 / this.data.scale * scale;
        const factor = this.data.realScale * this.data.dpr;
        this.ctx.beginPath();
        this.ctx.moveTo(startPoint.x * factor, startPoint.y * factor);
        this.ctx.lineTo(endPoint.x * factor, endPoint.y * factor);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#1AE28E';
        this.ctx.stroke();
    }
    drawBorder(scale:number) {
        this.data.realScale = 1 / this.data.scale * scale;
        const factor = this.data.realScale * this.data.dpr;
        if (this.data.Point.length === 0 || this.data.Point.length === 1) {
            return;
        }
        this.ctx.save();
        this.ctx.beginPath();
        const firstPoint = this.data.Point[0];
        this.ctx.moveTo(firstPoint.x * factor, firstPoint.y * factor);
        for(let i = 1; i < this.data.Point.length; i++) {
            const point = this.data.Point[i];
            this.ctx.lineTo(point.x * factor, point.y * factor);
        }
        if(this.data.fill) {
            this.ctx.closePath();
            this.ctx.fillStyle = this.data.color;
            this.ctx.fill();
        }
        this.ctx.strokeStyle = '#1AE28E';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.restore();
    }
  drawLabel(scale:number) {
    this.data.realScale = 1 / this.data.scale * scale;
    const factor = this.data.realScale * this.data.dpr;
    const minX = this.data.Point[0].x * factor;
    const minY = (this.data.Point[0].y-6) * factor;
    this.ctx.save();
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#1AE28E';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`${this.data.index}.${this.data.tag}`, minX, minY);
    this.ctx.restore();
  }
    isSelected(x:number, y:number) :boolean{
        return this.isPointInside(x, y) || this.isPointInsideVertex(x, y) !== -1;
    }
    isPointInside(x: number, y: number) :boolean {
        if (!ctx) return false;
        const factor = this.data.realScale * this.data.dpr;
        const scaledX = x / factor;
        const scaledY = y / factor;
        canvas.width = this.ctx.canvas.width;
        canvas.height = this.ctx.canvas.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        const firstPoint = this.data.Point[0];
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (let i = 1; i < this.data.Point.length; i++) {
            const point = this.data.Point[i];
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        return ctx.isPointInPath(scaledX, scaledY);
    }
    isPointOnVertex(x: number, y: number,index:number) :boolean {
        const factor = this.data.realScale * this.data.dpr;
        const vertexScreenX = this.data.Point[index].x * factor;
        const vertexScreenY = this.data.Point[index].y * factor;
        const radius = 5 * this.data.dpr;
        const distance = Math.sqrt(
            Math.pow(x - vertexScreenX, 2) + 
            Math.pow(y - vertexScreenY, 2)
        );
        return distance <= radius;
    }
    isPointInsideVertex(x: number, y: number) :number {
        for (let i = 0; i < this.data.Point.length; i++) {
            if(this.isPointOnVertex(x, y, i)){
                return i;
            }
        }
        return -1;
    }
    mouseDown(x: number, y: number):boolean {
        this.data.vertexIndex = this.isPointInsideVertex(x, y);
        if (this.data.vertexIndex !== -1) {
            this.setSelected();
            return true;
        } else if (this.isPointInside(x, y)) {
            this.setSelected();
            return true;
        }
        return false;
    }
    setSelected(){
        this.data.changed = true;
    }
    mouseMove(x:number,y:number) :void{
       this.data.Point = this.data.Point.map(point => {
            point.x += x
            point.y += y
            return point
        })||[]
    }
    mouseUp() {
        this.data.changed = false;
    }

}