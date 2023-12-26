<script setup>
import { useTodoStore } from "@/stores/todo";
import { onMounted, reactive, watch ,ref, computed} from "vue";
const todolistStore = useTodoStore();
const tabState = reactive({
  activeTab: 1,
});

watch(
  () => tabState.activeTab,
  (newValue, oldValue) => {
    console.log("Active tab changed from", oldValue, "to", newValue);
  }
);

onMounted(async () => {
  try {
    await todolistStore.LoadTodos();
    console.log("onmounted", todolistStore.todos);
  } catch (error) {
    console.log(error);
  }
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
}
    


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
        <div v-for="todo in todolistStore.todos" :key="todo.id">
          <div class="flex flex-row justify-between items-center my-2">
            <input type="checkbox" checked="checked" class="checkbox" />
            {{ todo.name }} {{ todo.id }}  : Status :{{ todo.status }}
            <div class=" flex flex-row gap-3"> 
              <button class="btn btn-secondary">edit</button>
              <button class="btn btn-primary">delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
