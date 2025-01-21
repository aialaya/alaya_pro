import { defineStore } from 'pinia'
import { getTaskListApi } from '@/api'

export const useTaskStore = defineStore('task', {
  state: () => ({
    allTasks: 0,
    currentTasks: 0,
    completedTasks: 0,
    expirationDate: '',
    tasks: [] as Array<Api.TaskList.TaskItem>,
  }),
  
  actions: {
    setTask(taskList: Api.TaskList.Resp) {
      this.allTasks = taskList.allTasks
      this.currentTasks = taskList.currentTasks
      this.completedTasks = taskList.completedTasks
      this.expirationDate = taskList.expirationDate
      this.tasks = taskList.tasks
    },
    async getTaskList() {
      try {
        const data = await getTaskListApi()
        if (data.code === 200) {
          this.setTask(data.data!)
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        throw new Error(error as string)
      }
    },
  },
}) 
