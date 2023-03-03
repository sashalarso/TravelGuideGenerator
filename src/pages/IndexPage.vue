<script setup>
import { defineComponent, ref, onMounted } from "vue";

import useAuthUser from "src/composables/UseAuthUser";
import useSupabase from "src/boot/supabase";
import { useRouter } from "vue-router";

defineComponent({
  name: "IndexPage",
});
const { user } = useAuthUser();
onMounted(() => {
  if (user._rawValue != null) {
    console.log(user);
    get_rooms(user._rawValue.email);
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

  console.log(data.data[0].id);
  my_id.value = data.data[0].id;
  console.log(my_id.value);

  router.push(`/room/${my_id.value}`);
};
</script>

<template lang="pug">
q-page.column
  //p(v-if="!!user").q-ma-lg.text-h6.text-purple-9.flex.flex-center Hello {{ user.user_metadata.name }}
  p(v-if="user")
    p.q-ma-lg Hello {{ user.email }}
    p(v-for="my_room in my_rooms")
      p(@click="send_room()") {{ my_room.guest }}

</template>

<script>
const { supabase } = useSupabase();

const my_rooms = ref([]);
const { user } = useAuthUser();
const my_email = user.email;
async function new_room(my_email, guest_email) {
  const { data } = supabase
    .from("rooms")
    .insert({ owner: my_email, guest: guest_email })
    .select();
}
async function get_rooms(my_email) {
  console.log(my_email);
  const { data } = await supabase
    .from("rooms")
    .select("guest")
    .match({ owner: my_email });
  my_rooms.value = data;
  console.log(my_rooms.value[0].guest);
}
</script>
