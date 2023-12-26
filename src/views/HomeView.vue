<script setup>
import { useTodoStore} from '@/stores/todo'
import { onMounted } from 'vue';

const todolistStore = useTodoStore()
onMounted( async () => {
   try{
     await todolistStore.LoadTodos();
     console.log('onmounted',todolistStore.todos)
   }
   catch(error){
     console.log(error)
   }
})
</script>

<template>
  <div class=" bg-red-800">
    Home
  </div>
  <div>
    <ul>
      <li v-for="todo in todolistStore.todos" :key="todo.id">
        {{ todo.name}}  :status {{ todo.status }}
      </li>
    </ul>
  </div>
</template>
    

