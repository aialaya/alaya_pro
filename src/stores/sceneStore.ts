import { defineStore } from "pinia";
import {RectData,SpotData} from "@/components/MarkCanvas"
export interface Scene {
  id:number
  imgUrl:string
  imgWidth:number
  imgHeight:number
  rects:Array<RectData|SpotData>
  result:string
}

export interface Scenes {
  scenes: Scene[];
  currentIndex: number;
}

export const useSceneStore = defineStore("scene",{
  state: () => ({
    scenes: [] as Scene[],
    currentIndex: 0,
  }),
  getters: {
    getCurrentScene: (state):Scene => {
      return state.scenes[state.currentIndex];
    },
  },
  actions: {
    loadHistoryToScene(history:Scenes) {
      this.scenes = history.scenes;
      this.currentIndex = history.currentIndex;
    },
    clearScene() {
      this.scenes = []
      this.currentIndex = 0
    },
    setActive(index:number) {
      this.currentIndex = index;
    },
    setRects(rects:Array<RectData|SpotData>){
      this.scenes[this.currentIndex].rects = rects
    },
    saveImage(img:string){
      return this.scenes[this.currentIndex].result = img
    }
  },
});
