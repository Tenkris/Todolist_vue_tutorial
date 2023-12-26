
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
    },
    async AddTodos(todo) {
      try {
        console.log('pinia',todo)
        const body = {
          name: todo.name,
          status: todo.status,
        }
        const response = await axios.post(`${url}/todos`,body);
        this.todos.push(response.data)
        // Handle the response data here
      } catch (error) {
        console.log(error)
        // Handle any errors that occurred during the request
      }
    },
    async DeleteTodo(id){
      try {
        await axios.delete(`${url}/todos/${id}`);
        this.todos = this.todos.filter((item) => item.id !== id)
        // Handle the response data here
      } catch (error) {
        console.log(error)
        // Handle any errors that occurred during the request
      }
    },
    async EditTodos(id , todo) {
      try {
        const body = {
          name: todo.name,
          status: todo.status,
        }
        const response = await axios.put(`${url}/todos/${id}`,body);
        this.todos = this.todos.map((item) => item.id === id ? response.data : item)
        // Handle the response data here
      } catch (error) {
        console.log(error)
        // Handle any errors that occurred during the request
      }
    },
  },

}) 
