<script setup>
import { ref, onMounted ,watch } from "vue";
import { useRoute } from "vue-router";
import { useTodoStore } from "@/stores/todo";
const todolistStore = useTodoStore(); 

// Access the id from the query
const iditem = ref("");
const route = useRoute();
onMounted(async () => {
  // Get the id from the query
  iditem.value = route.params.id;
  console.log(iditem.value);
});
const name = ref("");
const IsValid = ref(false); 
const status = ref("");
watch([name, status], ([newName, newStatus], [oldName, oldStatus]) => {
    if (!/^[a-zA-Z]+$/.test(newName) || newName.length <= 0 || newStatus.length <= 0) {
        IsValid.value = false;
    } else {
        IsValid.value = true;
    }
    console.log("Active tab changed from", IsValid.value, newName, newStatus);
});
const SubmitEdit = async () =>{
    try{
        const body = {
            name: name.value,
            status: status.value,
        }
        await todolistStore.EditTodos(iditem.value, body);
        name.value = '';
        status.value = '';
    }
    catch(error){
        console.log(error);
    }
}
</script>

<template>
  <div class="w-1/2 mx-auto">
    <div class="flex items-center">
      <RouterLink :to="{ name: 'home' }">
        <button class="btn btn-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
          >
            <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
            />
          </svg>
        </button>
      </RouterLink>
      <div class="ml-3">Edit</div>
    </div>
    <div class="flex items-center">
      <div>Item</div>
      <div class="badge badge-neutral">id: {{ iditem }}</div>
    </div>

    <div>
      <div> 
        Item name
      </div>
      <input class="input input-primary w-full" v-model="name" />
      
    </div>


    <div>
        <div>Status</div>
        <select class="select select-secondary w-full" v-model="status">
            <option disabled selected>Pick your Status</option>
            <option>Pending</option>
            <option>Doing</option>
            <option>Done</option>
        </select>
    </div>
    
    <button class="btn btn-primary w-full" :disabled="!IsValid" @click="SubmitEdit">Submit Edit</button>
  </div>
</template>
