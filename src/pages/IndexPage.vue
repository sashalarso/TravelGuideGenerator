<script setup>
import { defineComponent, ref, onMounted } from "vue";

import useAuthUser from "src/composables/UseAuthUser";
import useSupabase from "src/boot/supabase";
import { useRouter } from "vue-router";
import { route } from "quasar/wrappers";

defineComponent({
  name: "IndexPage",
});
const { user } = useAuthUser();
onMounted(() => {
  if (user._rawValue != null) {
    get_rooms(user._rawValue.email);
    get_guest_rooms(user._rawValue.email);
    get_members();
  }
});

const router = useRouter();
const my_id = ref("");
const { supabase } = useSupabase();
const send_room = async () => {
  const data = await supabase
    .from("rooms")
    .select("id")
    .match({ owner: user._rawValue.email });

  //console.log(data.data[0].id);
  my_id.value = data.data[0].id;
  //console.log(my_id.value);

  router.push(`/room/${my_id.value}`);
};

const my_rooms = ref([]);
const my_guest_rooms = ref([]);
const usernames = ref([]);
const my_email = user.email;

async function new_room(my_email, guest_email) {
  const { data } = supabase
    .from("rooms")
    .insert({ owner: my_email, guest: guest_email })
    .select();
}
async function get_rooms(my_email) {
  const { data } = await supabase
    .from("rooms")
    .select("owner")
    .match({ guest: my_email });
  console.log(data);
  if (data) {
    my_rooms.value = data;
    //console.log(my_rooms);
    for (let i = 0; i < my_rooms.value.length; i++) {
      const { data } = await supabase
        .from("profiles")
        .select("username,pp")
        .match({ email: my_rooms.value[i].owner });
      usernames.value.push(data);
      console.log(usernames.value);
      //console.log(usernames.value[0]);
    }
  }
}
async function get_guest_rooms(my_email) {
  const { data } = await supabase
    .from("rooms")
    .select("guest")
    .match({ owner: my_email });

  if (data) {
    my_guest_rooms.value = data;
  }
}

async function go_room(pseudo) {
  const { data } = await supabase
    .from("profiles")
    .select("email")
    .match({ username: pseudo });

  const test = await supabase.from("rooms").select("id").match({
    owner: user._rawValue.email,
    guest: data[0].email,
  });
  const second = await supabase.from("rooms").select("id").match({
    owner: data[0].email,
    guest: user._rawValue.email,
  });
  console.log(test);
  console.log(second);
  if (test.data.length > 0) {
    router.push(`/room/${test.data[0].id}`);
  }

  if (second) {
    router.push(`/room/${second.data[0].id}`);
  }
}
async function go_to_room(pseudo) {
  const { data } = await supabase
    .from("profiles")
    .select("email")
    .match({ username: pseudo });
  const id = await supabase
    .from("rooms")
    .select("id")
    .contains("members", [user._rawValue.email, data[0].email]);
  if (id.data) {
    router.push(`/room/${id.data[0].id}`);
  }
}
const usernamess = ref([]);
const emails = ref([]);
async function get_members() {
  const { data } = await supabase
    .from("rooms")
    .select("members")
    .contains("members", [user._rawValue.email]);

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].members.length; j++) {
      if (data[i].members[j] != user._rawValue.email) {
        emails.value.push(data[i].members[j]);
      }
    }
  }
  console.log(emails.value);
  for (let i = 0; i < emails.value.length; i++) {
    const { data } = await supabase
      .from("profiles")
      .select("username,pp")
      .match({ email: emails.value[i] });
    usernamess.value.push(data);
  }
  console.log(usernamess);
}
const prompt = ref(false);
const pseudo = ref("");
const first_message = ref("");

async function create_conv(username, message) {
  const resp = await supabase
    .from("profiles")
    .select("email")
    .match({ username: username });
  const email = resp.data[0].email;
  const { data } = await supabase
    .from("rooms")
    .insert({ members: [email, user._rawValue.email] });
  const new_id = data[0].id;
  const test = await supabase
    .from("messages")
    .insert({ message: message, sender: user._rawValue.email, room: new_id });
  router.push(`/room/${new_id}`);
}
</script>

<template lang="pug">
q-page.column
  //p(v-if="!!user").q-ma-lg.text-h6.text-purple-9.flex.flex-center Hello {{ user.user_metadata.name }}

  p(v-if="user")

    p.q-ma-lg Hello {{ user.email }}


    q-btn(color="primary" icon="add" style="margin-left: 500px;" @click="prompt=true") Nouvelle discussion
    q-dialog(v-model="prompt" )
      q-card
        q-card-section Entrez le nom d'utilisateur du destinataire
        q-card-section
          q-input(dense v-model="pseudo",@keyup-enter="prompt=false")
        q-card-section Votre message
        q-card-section
          q-input(dense v-model="first_message")
        q-card-actions(align="right")
          q-btn(flat,label="Annuler",v-close-popup)
          q-btn(flat,label="Envoyer",v-close-popup,@click="create_conv(pseudo,first_message)")


    p(v-for="user in usernamess" style="margin-left: 500px; margin-top: 5px;" class="row")
      q-card(class="my-card my_test" @click="go_to_room(user[0].username)" style="width: 200px;" )
        q-img(:src="user[0].pp" style="width : 200px; height: 100px;" rounded)
        q-card-section
          div(class="text-h6") {{ user[0].username }}

</template>

<style>
.my_test:hover {
  transform: scale(1.2);
}
</style>
