import { defineStore } from "pinia";
import { deepClone } from "@/utils";
import {Scenes} from "@/stores"

const LIMIT = 30;

export const useDesignStore = defineStore("design",{
  state: () => ({
    queue: [] as Scenes[],
    pointer: -1,
  }),
  getters: {
    getActivity: (state):Scenes => {
      console.log(state.queue[state.pointer],'getActivity')
      return state.queue[state.pointer];
    },
    getIsUndo: (state):boolean => {
      return state.pointer > 0;
    },
    getIsRedo:(state):boolean=>{
      return state.pointer < state.queue.length - 1
    }
  },
  actions: {
    clearQueue() {
      this.queue = []
      this.pointer = -1
    },
    record(data: Scenes) {
      while (this.pointer < this.queue.length - 1) {
        this.queue.pop();
      }
      this.pointer++;
      this.queue.push(deepClone<Scenes>(data));
      if (this.queue.length - 1 > LIMIT) {
        this.queue.shift();
      }
      console.log(this.queue,'record')
    },
    undo() {
      if (this.pointer > 0) {
        this.pointer--;
      }
    },
    redo() {
      if (this.pointer < this.queue.length - 1) {
        this.pointer++;
      }
    },
  },
});
