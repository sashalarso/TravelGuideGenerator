<script setup>
import { defineComponent, ref, reactive, toRefs } from "vue";
import useAuthUser from "src/composables/UseAuthUser";
import useNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";
import InputEmailComponent from "src/components/InputEmailComponent.vue";
import InputPasswordComponent from "src/components/InputPasswordComponent.vue";
import useSupabase from "src/boot/supabase";

defineComponent({ name: "SignUpComponent" });

const router = useRouter();
const { signUp, user } = useAuthUser();
const { notifyError, notifySuccess } = useNotify();
const { supabase } = useSupabase();
const form = reactive({
  name: "",
  email: "",
  password: "",
});
const pp = ref("");
const username = ref("");

const handleSignUp = async () => {
  try {
    user.value = await signUp(form);
    // ({ email, password } = form.value)
    notifySuccess(
      `Successful sign up as ${form.email} and automatically signed in`
    );
    router.push({
      name: "emailConfirmationPage",
      params: { email: form.email },
    });
  } catch (error) {
    notifyError(error.message);
  }
};
async function create_profile(my_username, my_pp) {
  const { data } = await supabase
    .from("profiles")
    .insert({ email: form.email, username: my_username, pp: my_pp });
}
</script>

<template lang="pug">
q-form.row.justify-center(@submit.prevent="handleSignUp")
  .col-md-4.col-sm-6.col-xs-10.q-gutter-y-md
    q-input(
      label="Name",
      v-model="form.name",
      lazy-rules,
      :rules="[val => (val && val.length > 0) || 'Name is required']"
      )
    InputEmailComponent(v-model="form.email")
    InputPasswordComponent(v-model="form.password")
    .full-width.q-pt-md.q-gutter-y-sm
    q-input(
      label="Nom d'utilisateur",
      v-model="username",

      )
    q-input(
      label="Photo de profil",
      v-model="pp",

      )
    q-btn.full-width(
        label="Sign Up",
        color="primary",
        outline, rounded,
        type="submit",
        @click="create_profile(username,pp)"
      )
</template>

// kuezabeiz@LDR117 // kuezabeiz@CRI117 // kuezabeiz@Home117
