<script setup>
import { useTodoStore } from "@/stores/todo";
import { onMounted, reactive, watch } from "vue";

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
</script>

<template>
  <div class="container mx-auto h-screen p-5">
    <div class="flex flex-row justify-between">
      <input class="input input-primary w-full" />
      <button class="btn btn-primary ml-3 sm:ml-5">add</button>
    </div>

    <div role="tablist" class="tabs tabs-boxed">
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
            {{ todo.name }}
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
