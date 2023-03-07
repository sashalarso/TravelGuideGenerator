<script setup>
import { defineComponent } from "vue";
import MyRooms from "src/components/MyRooms.vue";
defineComponent({
  name: "IndexPage",
});
</script>

<template lang="pug">
q-page
  MyRooms
</template>
