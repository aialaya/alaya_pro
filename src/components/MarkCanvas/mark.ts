import { Rect,RectData,getInitRectData } from './model/rect'
import { Spot,SpotData,getInitSpotData } from './model/spot'
import { events } from '@/utils'
import { loadImageCache } from '@/utils'

class MarkCanvas {
  creating: "rect" | "spot" | "move" | "select" | ''
  canvasChanged: boolean
  dpr: number
  scale: number
  maxScale: number
  minScale: number
  adaptiveScale: number
  scaleStep: number
  currentX: number
  currentY: number
  currentImageUrl: string
  currentImageWidth: number
  currentImageHeight: number
  currentImage: HTMLImageElement
  wrapperRef: HTMLDivElement
  canvasRef: HTMLCanvasElement
  bufferCanvas: HTMLCanvasElement
  currentRect: Rect | Spot | null
  selectedRectIndex: number
  prevX: number
  prevY: number
  allRects:Array<RectData|SpotData>
  file:string
  private history: Array<Array<RectData | SpotData>> = []
  private currentHistoryIndex: number = -1
  private readonly MAX_HISTORY = 30

  constructor({view,viewBox,imageUrl,imageWidth,imageHeight}:{view:HTMLCanvasElement,viewBox:HTMLDivElement,imageUrl:string,imageWidth:number,imageHeight:number}){
    this.creating = ''
    this.canvasChanged = false
    this.dpr = window.devicePixelRatio || 1
    this.scale = 0
    this.maxScale = 3.0
    this.minScale = 0.1
    this.adaptiveScale = 0
    this.scaleStep = 0.1
    this.currentX = 0
    this.currentY = 0
    this.currentImageUrl = imageUrl
    this.currentImageWidth = imageWidth
    this.currentImageHeight = imageHeight
    this.currentImage = new Image()
    this.wrapperRef = viewBox
    this.canvasRef = view
    this.bufferCanvas = document.createElement('canvas')
    this.currentRect = null
    this.selectedRectIndex = -1
    this.prevX = 0
    this.prevY = 0
    this.allRects = []
    this.setCurrentScene(imageUrl,imageWidth,imageHeight)
    this.history = []
    this.currentHistoryIndex = -1
    this.file = ''
    this.saveHistory()
  }
  setCurrentScene = (imgUrl:string,imgWidth:number,imgHeight:number)=>{
    const bufferCtx = this.bufferCanvas.getContext('2d');
    if(!bufferCtx) return;
    this.currentImageUrl = imgUrl
    this.currentImageWidth = imgWidth
    this.currentImageHeight = imgHeight
    this.loadImage()
  }
  record = () => {
    this.saveHistory()
  }
  setIsCallout = (type:"rect" | "spot" | "move" | "select" | '')=>{
    this.currentRect = null
    this.selectedRectIndex = -1
    this.creating = type
  }
  loadImage = async () => {
    const image = await loadImageCache(this.currentImageUrl)
    this.currentImageWidth = image.width * this.dpr;
    this.currentImageHeight = image.height * this.dpr;
    this.currentImage = image
    this.setSize();
    this.drawCanvas();
    this.setCenter();
  }
    setSize = () => {
      if (this.scale === 0) {
          const width = this.wrapperRef.clientWidth * this.dpr;
          const height = this.wrapperRef.clientHeight * this.dpr;
          const scaleX = width / this.currentImageWidth;
          const scaleY = height / this.currentImageHeight;
          this.scale = Math.min(scaleX, scaleY);
          this.adaptiveScale = this.scale;
      }
      const scaledWidth = this.currentImageWidth * this.scale;
      const scaledHeight = this.currentImageHeight * this.scale;
      this.canvasRef.width = scaledWidth;
      this.canvasRef.height = scaledHeight;
      this.canvasRef.style.width = `${scaledWidth / this.dpr}px`;
      this.canvasRef.style.height = `${scaledHeight / this.dpr}px`;
      this.bufferCanvas.width = scaledWidth;
      this.bufferCanvas.height = scaledHeight;
      this.bufferCanvas.style.width = `${scaledWidth / this.dpr}px`;
      this.bufferCanvas.style.height = `${scaledHeight / this.dpr}px`;
    }
    setCenter = () => {
      const scaledWidth = this.currentImageWidth * this.scale;
      const scaledHeight = this.currentImageHeight * this.scale;
      if (this.wrapperRef.clientHeight <= scaledHeight / this.dpr) {
        this.wrapperRef.style.justifyContent = '';
        } else {
        this.wrapperRef.style.justifyContent = 'center';
        }
        if (this.wrapperRef.clientWidth <= scaledWidth / this.dpr) {
        this.wrapperRef.style.alignItems = '';
        } else {
        this.wrapperRef.style.alignItems = 'center';
        }
    }
    drawLine = (x:number,y:number)=>{
        if(this.creating === '') return;
        const ctx = this.canvasRef.getContext('2d');
        if(!ctx) return;
        ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
        ctx.drawImage(this.bufferCanvas, 0, 0);
        ctx.setLineDash([8, 5]);
        ctx.beginPath();
        ctx.moveTo(x * this.dpr, 0);
        ctx.lineTo(x * this.dpr, this.canvasRef.height);
        ctx.moveTo(0, y * this.dpr);
        ctx.lineTo(this.canvasRef.width, y * this.dpr);
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }
    deleteMark = ()=>{
        if(this.selectedRectIndex === -1) return;
        this.allRects.splice(this.selectedRectIndex, 1);
        this.selectedRectIndex = -1;
        this.currentRect = null;
        this.drawCanvas();
        this.record()
    }
    loadHistory = (rects:Array<RectData|SpotData>)=>{
        this.allRects = rects
        this.drawCanvas()
    }
    addRect = (rect:Spot|Rect)=>{
        this.allRects.push(rect.data)
    }
    zoomIn = ()=>{
        this.scale += this.scaleStep;
        if (this.scale > this.maxScale) {
        this.scale = this.maxScale;
        }
        this.setSize();
        this.drawCanvas();
    }
    zoomOut = ()=>{
        this.scale -= this.scaleStep;
        if (this.scale < this.minScale) {
            this.scale = this.minScale;
        }
        this.setSize();
        this.drawCanvas();
    }
    drawCanvas = () => {
        const ctx = this.canvasRef.getContext('2d');
        if(!ctx) return;
        const bufferCtx = this.bufferCanvas.getContext('2d');
        if(!bufferCtx) return;
        const width = this.canvasRef.width;
        const height = this.canvasRef.height;
        bufferCtx.clearRect(0, 0, width, height);
        if(this.currentImage){
            bufferCtx.drawImage(this.currentImage, 0, 0, width, height);
        }
        if (this.currentRect) {
            if(this.currentRect instanceof Rect){
                this.currentRect.draw(this.scale);
                if(this.currentRect.data.tag !== "undefined"){
                    this.currentRect.drawLabel(this.scale);
                }
            }
            if(this.currentRect instanceof Spot){
                this.currentRect.draw(this.scale);
                if(this.currentRect.data.tag !== "undefined"){
                    this.currentRect.drawLabel(this.scale);
                }
            }
        }
        for (const data of this.allRects) {
            let rect:Rect|Spot
            if(data.type === 'rect'){
                rect = new Rect(bufferCtx,data as RectData)
            }else{
                rect = new Spot(bufferCtx,data as SpotData)
            }
            if (this.currentRect && rect.getId() === this.currentRect.getId()) {
                rect.setColor('rgba(255, 0, 0, 0.2)');
            } else {
                rect.setColor('rgba(0, 0, 255, 0.3)');
            }
            rect.draw(this.scale);
        }
        ctx.drawImage(this.bufferCanvas, 0, 0, width, height);
        this.saveImage()
    }
    setTtg = (uuid:string,tag:string)=>{
        for (let index = 0; index < this.allRects.length; index++) {
            const element = this.allRects[index];
            if(element.uuid === uuid){
                element.tag = tag
            }
        }
    }
    handleClick = (e: MouseEvent)=>{
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        if (this.creating === 'spot') {
            this.prevX = mouseX;
            this.prevY = mouseY;
            const bufferCtx = this.bufferCanvas.getContext('2d');
            if (!bufferCtx) return;
            if(this.currentRect){
                if (this.currentRect instanceof Spot) {
                    if(this.currentRect.isPointOnVertex(mouseX, mouseY,0)){
                        this.currentRect.data.fill = true;
                        events.emit('addMark',{x:e.offsetX,y:e.offsetY,uuid:this.currentRect.getId()});
                        this.currentRect = null;
                    }else {
                        this.currentRect.data.Point.push({x:mouseX,y:mouseY})
                    }
                }
            }else{
                this.currentRect = new Spot(bufferCtx,getInitSpotData(this.allRects.length, [{x:mouseX,y:mouseY}],this.dpr,this.scale));
                this.addRect(this.currentRect);
            }
            this.record();
            this.drawCanvas();
        }
    }
    handleMouseMove = (e: MouseEvent) => {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        try {
            if (this.creating === 'rect' && this.currentRect) {
                (this.currentRect as Rect).data.maxX = mouseX;
                (this.currentRect as Rect).data.maxY = mouseY;
            }
            if(this.creating === 'move' && this.currentRect) {
                if (this.currentRect instanceof Rect) {
                    this.currentRect.mouseMove(e, {prevX: this.prevX, prevY: this.prevY}, (deltaX, deltaY) => {
                        this.prevX += deltaX;
                        this.prevY += deltaY;
                        events.emit('move',{prevX: this.prevX, prevY: this.prevY})
                    });
                }
                if (this.currentRect instanceof Spot) {
                   const deltaX =  mouseX - this.prevX
                   const deltaY =  mouseY - this.prevY
                   this.currentRect.mouseMove(deltaX,deltaY)
                   this.prevX = mouseX
                   this.prevY = mouseY
                }
                setTimeout(()=>{
                    this.record()
                },500)
            }
            this.drawCanvas();
            if (this.creating == 'rect') {
                this.drawLine(mouseX, mouseY);
            }
            if (this.creating === 'spot' && this.currentRect) {
                if (this.currentRect instanceof Spot) {
                   const startPointIndex = this.currentRect.data.Point.length - 1
                   const {x,y} = this.currentRect.data.Point[startPointIndex]
                   const bufferCtx = this.canvasRef.getContext('2d');
                   if (!bufferCtx) return;
                   bufferCtx.save()
                   bufferCtx.beginPath();
                   bufferCtx.moveTo(x,y);
                   bufferCtx.lineTo(mouseX,mouseY);
                   bufferCtx.strokeStyle = '#1AE28E';
                   bufferCtx.stroke();
                   bufferCtx.restore()
                }
            }
        } catch (error) {
            console.error('Error in handleMouseMove:', error);
        }
    }
    handleMouseDown = (e: MouseEvent) => {
        try {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;
            this.prevX = mouseX;
            this.prevY = mouseY;
            if (this.creating === 'move') {
                this.currentRect = null;
                this.selectedRectIndex = -1;
            const bufferCtx = this.bufferCanvas.getContext('2d');
            if(!bufferCtx) return;
            for (let i = this.allRects.length - 1; i > -1; i--) {
                const data = this.allRects[i];
                let rect:Rect|Spot
                if(data.type === 'rect'){
                    rect = new Rect(bufferCtx,data as RectData)
                }else{
                    rect = new Spot(bufferCtx,data as SpotData)
                }
                if (rect.isSelected(mouseX, mouseY)) {
                    this.currentRect = rect as Rect | Spot;
                    this.selectedRectIndex = i;
                    events.emit('selectMark',this.currentRect.getId())
                        break;
                    }
                }
            }
            if (this.creating === 'rect') {
                const bufferCtx = this.bufferCanvas.getContext('2d');
                if (!bufferCtx) return;
                const data = getInitRectData(this.allRects.length,this.dpr,mouseX,mouseY,this.scale)
                this.currentRect = new Rect(bufferCtx,data);
            }
            if (this.creating === 'move' && this.currentRect) {
                this.currentRect.mouseDown(mouseX, mouseY);
            }
            this.drawCanvas();
        } catch (error) {
            console.error('Error in handleMouseDown:', error);
        }
    }
    handleMouseUp = (e: MouseEvent) => {
        try {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;
            if (this.prevX === mouseX && this.prevY === mouseY && this.creating === 'rect') {
                this.currentRect = null;
                this.drawCanvas();
                return;
            }            
            if (this.creating === 'rect' && this.currentRect) {
              (this.currentRect as Rect).data.maxX = mouseX;
              (this.currentRect as Rect).data.maxY = mouseY;
              if ((this.currentRect as Rect).data.minX !== (this.currentRect as Rect).data.maxX
                  && (this.currentRect as Rect).data.minY !== (this.currentRect as Rect).data.maxY) {
                this.addRect(this.currentRect);
                events.emit('addMark',{x:e.offsetX,y:e.offsetY,uuid:this.currentRect.getId()});
                this.currentRect = null;
              }
              this.record()
            }
            if (this.creating === 'move' && this.currentRect) {
                if (this.currentRect instanceof Rect) {
                    (this.currentRect as Rect).mouseUp();
                }
                if (this.currentRect instanceof Spot) {
                    this.currentRect = null;
                }
                this.record()
            }
            this.drawCanvas();
        } catch (error) {
            console.error('Error in handleMouseUp:', error);
        }
    }
    private saveHistory = () => {
      if (this.currentHistoryIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.currentHistoryIndex + 1)
      }
      this.history.push(JSON.parse(JSON.stringify(this.allRects)))
      this.currentHistoryIndex++
      if (this.history.length > this.MAX_HISTORY) {
        this.history.shift()
        this.currentHistoryIndex--
      }
    }
    undo = () => {
      if (this.currentHistoryIndex > 0) {
        this.currentHistoryIndex--
        this.allRects = JSON.parse(JSON.stringify(this.history[this.currentHistoryIndex]))
        this.drawCanvas()
      }
    }
    redo = () => {
      if (this.currentHistoryIndex < this.history.length - 1) {
        this.currentHistoryIndex++
        this.allRects = JSON.parse(JSON.stringify(this.history[this.currentHistoryIndex]))
        this.drawCanvas()
      }
    }
    getIsRedo = ()=>{
      return this.currentHistoryIndex < this.history.length - 1
    }
    getIsUndo = ()=>{
      return this.currentHistoryIndex > 0
    }
    saveImage = ()=>{
        const canvas = this.canvasRef as HTMLCanvasElement
         this.file = canvas.toDataURL("image/png");
    }
}


export {MarkCanvas}
