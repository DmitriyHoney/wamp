<template>
  <!-- {{ search }} -->
  <div
    class="base-log"
    :class="{
      warn: log.Level === 'WARN',
      trace: log.Level === 'TRACE',
      error: log.Level === 'ERROR',
    }"
  >
    <div class="base-log__time" v-html="highlight(log.Timestamp)"></div>
    <div class="base-log__level" v-html="highlight(log.Level)"></div>
    <div class="base-log__message" v-html="highlight(log.Message)"></div>
  </div>
</template>

<script setup>
const props = defineProps(["log", "isHightlight", "search"]);
const highlight = (str) => {
  if (!props.isHightlight) return str;
  let search = props.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var re = new RegExp(search, "g");
  console.log(111, search.length);
  if (search.length > 0) return str.replace(re, `<mark>$&</mark>`);
  else return str;
};
</script>

<style scoped>
.base-log {
  display: flex;
  flex-wrap: wrap;
  /* gap: 20px; */
  font-size: 16px;
  /* margin-bottom: 7px; */
  /* border-bottom: 1px solid #ccc; */
  border-top: 1px solid #ccc;
  padding: 7px;
}
.base-log.warn {
  color: orange;
}
.base-log.error {
  color: red;
}
.base-log.trace {
  color: gray;
}
.base-log__time {
  width: 200px;
}
.base-log__level {
  width: 200px;
}
</style>
