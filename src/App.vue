<script setup lang="ts">
import WindowLogs from "./components/WindowLogs.vue";
import BaseFilterByLevel from "./components/BaseFilterByLevel.vue";
import { AppClass } from "./core/WampCore";
import { ref, computed, watch } from "vue";

const app = new AppClass();
const typeLog = ref([]);
const resSearch = ref([]);
const search = ref("");

const logs = computed(() => {
  let res = app.state.logs;
  resSearch.value = [];

  if (typeLog.value.length) {
    res = res.filter((log) => typeLog.value.includes(log.Level));
  }
  if (search.value) {
    res
      .map((i) => JSON.stringify(i))
      .forEach((l, idx) =>
        l.indexOf(search.value) >= 0 ? resSearch.value.push(idx) : null
      );
  }
  return res;
});
const startPos = ref(0);
const handleGoToString = () => {
  if (!resSearch.value) return;

  if (resSearch.value.length === startPos.value) startPos.value = 0;
  document
    .getElementById(`log_${resSearch.value[startPos.value]}`)
    ?.scrollIntoView();
  startPos.value++;
};

watch(
  () => search.value,
  () => {
    startPos.value = 0;
  }
);
</script>

<template>
  <input type="text" v-model="search" @keyup.enter="handleGoToString" />
  <base-filter-by-level v-model="typeLog" />
  <window-logs :logs="logs" :resSearch="resSearch" :search="search" />
</template>

<style scoped></style>
