
import { defineStore } from 'pinia'
import axios from 'axios'

const url = 'https://65863e32468ef171392e148a.mockapi.io'
export const useTodoStore = defineStore('todo', {
  state: () => ({
     todos : []
  }),
  getters: {
    
  },
  actions: {
    async LoadTodos() {
      try {
        const response = await axios.get(`${url}/todos`);
        this.todos = response.data
        // Handle the response data here
      } catch (error) {
        console.log(error)
        // Handle any errors that occurred during the request
      }
    }
   
  },
}) 
