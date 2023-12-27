<script setup>
import { useTodoStore } from "@/stores/todo";
import { onMounted, reactive, watch ,ref, computed} from "vue";
import Loading from "@/components/Loading.vue";

const todolistStore = useTodoStore();
const tabState = reactive({
  activeTab: 1,
});
const IsLoading = ref(false); 
watch(
  async () => tabState.activeTab,
  (newValue, oldValue) => {
    console.log("Active tab changed from", oldValue, "to", newValue);
    console.log('Here is Tabstring state' , tabString.value) 

  }
);

onMounted(async () => {
  IsLoading.value = true;
  try {
    await todolistStore.LoadTodos();
    console.log("onmounted", todolistStore.todos);
  } catch (error) {
    console.log(error);
  }
  IsLoading.value = false;
});
const name = ref('');
const IsValid = ref(false);
const tabString = computed(() => {
  switch (tabState.activeTab) {
    case 1:
      return "Pending";
    case 2:
      return "Doing";
    case 3:
      return "Done";
    default:
      return "Pending";
  }
});
watch(name, (newValue, oldValue) => {
  if (!/^[a-zA-Z]+$/.test(newValue) || newValue.length <= 0) {
     IsValid.value = false;
  }
  else{
    IsValid.value = true;
  }

  console.log("Active tab changed from", IsValid.value , newValue);
});

const SummitAdd = async()=>{
  IsLoading.value = true;
  try{
    console.log('Homeview', tabState.activeTab , tabString.value)
    await todolistStore.AddTodos({
      name: name.value,
      status: tabString.value,
    });
    name.value = '';
  }
  catch(error){
    console.log(error);
  }
  IsLoading.value = false;
}

const DeleteTodo = async(id)=>{
  IsLoading.value = true;
  try{
    await todolistStore.DeleteTodo(id);
  }
  catch(error){
    console.log(error);
  }
  IsLoading.value = false;
}
const UpdateTodo = async(event , todo)=>{
  IsLoading.value = true;
  try{
    console.log('update',todo , event.target.checked);
    let status = ''; 
    if(event.target.checked){
      status = 'Done';
    }
    else{
      status = 'Pending';
    }
    const body = {
      name: todo.name,
      status: status,
    }
    console.log('body', body);
    await todolistStore.EditTodos(todo.id , body);
  }
  catch(error){
    console.log(error);
  }
  IsLoading.value = false;
}
const filterTodo = computed(() => {
  switch (tabState.activeTab) {
    case 1:
      return todolistStore.todos.filter((todo) => todo.status === "Pending");
    case 2:
      return todolistStore.todos.filter((todo) => todo.status === "Doing");
    case 3:
      return todolistStore.todos.filter((todo) => todo.status === "Done");
    default:
      return todolistStore.todos.filter((todo) => todo.status === "Pending");
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    if(tabState.activeTab -1  < 1){
      tabState.activeTab = 3;
    }
    else{
      tabState.activeTab = Math.max(tabState.activeTab - 1, 1);
    }
  } else if (event.key === "ArrowRight") {
    if(tabState.activeTab + 1 > 3){
      tabState.activeTab = 1;
    }
    else{
      tabState.activeTab = Math.min(tabState.activeTab + 1, 3);
    }
  }
});
</script>

<template>
  <div class="container mx-auto h-screen p-5">
    <Loading v-if="IsLoading" />
    <div class="flex flex-row justify-between">
      <input class="input input-primary w-full" v-model="name"/>
      <button class="btn btn-primary ml-3 sm:ml-5" :disabled="!IsValid" @click="SummitAdd">add</button>
    </div>

    <div role="tablist" class="tabs tabs-boxed my-5">
      <a
        role="tab"
        class="tab"
        :class="{ 'tab-active': tabState.activeTab === 1 }"
        @click="tabState.activeTab = 1"
      >
        Pending
      </a>
      <a
        role="tab"
        class="tab"
        :class="{ 'tab-active': tabState.activeTab === 2 }"
        @click="tabState.activeTab = 2"
      >
        Doing
      </a>
      <a
        role="tab"
        class="tab"
        :class="{ 'tab-active': tabState.activeTab === 3 }"
        @click="tabState.activeTab = 3"
      >
        Done
      </a>
    </div>

    <div class="flex flex-col">
      <div>
        <div v-for="todo in filterTodo" :key="todo.id">
          <div class="flex flex-row justify-between items-center my-2">
            <input type="checkbox" class="checkbox" @change="UpdateTodo($event,todo)" :checked="todo.status === 'Done'" />
            <div :class="{ 'line-through': todo.status === 'Done' }">
              {{ todo.name }} {{ todo.status }}
            </div>
            <div class=" flex flex-row gap-3"> 
              <RouterLink :to="{ name: 'EditTodo', params: { id: todo.id } }">
                <button class="btn btn-secondary" :disabled="IsLoading">edit</button> 
              </RouterLink>
              <button class="btn btn-primary" @click="DeleteTodo(todo.id)" :disabled="IsLoading">delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
