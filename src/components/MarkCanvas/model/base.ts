
interface CalloutInterface {
    getTtg(): string
    draw(scale: number): void
    getType(): string
    getId(): string
    getIndex(): number
    setIndex(index: number): void
    setColor(color: string): void
    isSelected(x: number, y: number): boolean
    setTtg(ttg: string): void
}


  
export type {CalloutInterface}