<script setup lang="ts">
import { ref } from "vue";
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
const typeLog = ref([]);
const handleChange = (e) => {
  if (e.target.checked)
    emit("update:modelValue", [...props.modelValue, e.target.value]);
  else
    emit(
      "update:modelValue",
      [...props.modelValue].filter((i) => i !== e.target.value)
    );
};
</script>

<template>
  <div class="base-filters">
    <label>
      <input
        type="checkbox"
        name="foo"
        value="WARN"
        :modelValue="modelValue"
        @change="handleChange"
      />WARN</label
    >
    <label>
      <input
        type="checkbox"
        name="foo"
        value="DEBUG"
        v-model="typeLog"
        :modelValue="modelValue"
        @change="handleChange"
      />DEBUG</label
    >
    <label>
      <input
        type="checkbox"
        name="foo"
        value="TRACE"
        v-model="typeLog"
        :modelValue="modelValue"
        @change="handleChange"
      />TRACE</label
    >
    <label>
      <input
        type="checkbox"
        name="foo"
        value="ERROR"
        v-model="typeLog"
        :modelValue="modelValue"
        @change="handleChange"
      />ERROR</label
    >
  </div>
</template>

<style scoped></style>
