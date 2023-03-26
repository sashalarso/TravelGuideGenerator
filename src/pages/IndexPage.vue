<script setup>
import { defineComponent, onMounted, ref } from "vue";

defineComponent({
  name: "IndexPage",
});
onMounted(() => {
  place.value = "";
});
async function prompt(place, duration) {
  load.value = true;
  const body = {
    model: "text-davinci-003",
    prompt: "fais moi un guide de voyage de " + duration + " jours à " + place,
    max_tokens: 2048,
  };
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization:
        "Bearer " + "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",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  load.value = false;

  trip.value = data["choices"][0]["text"].replace(/\bJour\b/g, "\nJour");
  jours.value = trip.value.split("Jour");
  console.log(jours.value);
  resp.value = data["choices"][0]["text"].replace(/\n/g, "<br/>");
  const test = jours.value.shift();
}
const trip = ref("");
const jours = ref([]);
const place = ref("");
const resp = ref("");
const load = ref(false);
const duration = ref(0);
</script>

<template lang="pug">
q-page(style="background-color: beige;")


  div(style="display: flex; align-items: center; justify-content: center; " v-if="load==true")
    q-circular-progress(
        indeterminate
        size="300px"
        :thickness="0.5"
        color="lime"
        center-color="grey-8"
        track-color="transparent"
        style=" ")

  q-input(v-model="place",style="width: 50%; margin: auto;")
  q-input(v-model="duration" style="width: 50%; margin: auto;")
  div(style="")
    q-btn(icon="send", @click="prompt(place,duration)"  ) Générer
  div(v-for="(jour,index) in jours ", style="width: 50%; margin: auto; background-color: azure; border-radius: 10px ; border: solid greenyellow;")
    div(style="margin-left: auto; margin-right: auto; text-align: center;").q-ma-md Jour {{index+1}}
    div  {{ jour }}



</template>
