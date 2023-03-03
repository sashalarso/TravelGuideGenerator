<script setup>
import { defineComponent, ref } from "vue";
import { onMounted } from "vue";

import useAuthUser from "src/composables/UseAuthUser";
import useSupabase from "src/boot/supabase";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

defineComponent({
  name: "RoomPage",
});
const router = useRouter();
const route = useRoute();
const { user } = useAuthUser();
const me = user._rawValue.email;
onMounted(() => {
  get_messages(route.params.id);
  get_profile(me);
});

const { supabase } = useSupabase();
const messages = ref([]);
const my_message = ref("");
const senders = ref([]);

const listen_new = supabase
  .from("messages")
  .on("INSERT", (payload) => {
    messages.value.push({
      message: payload.new["message"],
      sender: payload.new["sender"],
      created_at: payload.new["created_at"],
    });
  })

  .subscribe();

async function send_message(message) {
  const { data } = await supabase
    .from("messages")
    .insert({
      message: message,
      sender: user._rawValue.email,
      room: route.params.id,
    })
    .select();
}
async function get_messages(id) {
  const { data } = await supabase
    .from("messages")
    .select("message, sender,created_at")
    .match({ room: id });

  for (let i = 0; i < data.length; i++) {
    messages.value.push(data[i]);
  }
}
function scroll() {
  const element = document.getElementById("bottom");
  element.scrollTo(0, 500);
}
const username = ref("");
const pp = ref("");
async function get_profile(my_email) {
  const { data } = await supabase
    .from("profiles")
    .select("username,pp")
    .match({ email: my_email });
  console.log(data);
  username.value = data[0].username;
  pp.value = data[0].pp;
}
</script>

<template lang="pug">
q-page

  div(class="bg-brown-2 ",style="width: 500px; margin: 0 auto;").q-px-xl
    p(v-for="message in messages")
      p(v-if="me==message.sender").text-right
        q-chat-message(:text="[message.message]",:name="username",sent,:stamp="message.created_at",:avatar="pp")
      p(v-if="me!=message.sender",color="light-green-10")
        q-chat-message(:text="[message.message]",:name="message.sender",:stamp="message.created_at")
  div(class="row justify-center")
    q-input(v-model="my_message" rounded outlined   )
    q-btn(rounded icon="send" @click="send_message(my_message)" id="bottom")

</template>
