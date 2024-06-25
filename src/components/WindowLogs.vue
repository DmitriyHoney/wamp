<template>
  <log-string
    v-for="(log, idx) in logs"
    :log="log"
    :key="idx"
    :search="search"
    :isHightlight="resSearch.includes(idx)"
  />
</template>

<script setup>
import LogString from "./LogString.vue";
defineProps(["logs", "resSearch", "search"]);
</script>

<style lang="scss" scoped></style>
