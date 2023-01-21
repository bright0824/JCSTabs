<template>
  <VDialog
    v-model="dialog"
    :max-width="user?.roles.admin ? '350px' : '500px'"
    :overlay="true"
    persistent
    transition="dialog-transition"
  >
    <template #activator="{ props }">
      <VSwitch
        color="success"
        label="Administrator"
        v-bind="props"
        :model-value="user?.roles?.admin"
        :disabled="checkPerms().disabled"
        :loading="loading.switch"
        @click="(dialog = true), (loading.switch = true)"
        :messages="checkPerms().message"
      />
    </template>
    <VCard
      :loading="loading.dialog"
      :max-height="user?.roles.admin ? '120px' : '340px'"
    >
      <VCardTitle>Are you sure?</VCardTitle>
      <VCardSubtitle>
        This will {{ user?.roles[props.role] ? "remove" : "add" }} the user as
        an {{ props.role }}.
      </VCardSubtitle>
      <VCardText v-if="!user?.roles.admin">
        When a user is an administrator they can:
        <VList>
          <VListItem v-for="(item, index) in perms.admin" :key="item">
            <VListItemTitle>{{ index + 1 + ". " + item }}</VListItemTitle>
          </VListItem>
        </VList>
      </VCardText>
      <VCardActions>
        <VBtn
          color="primary"
          text
          @click="toggleRole()"
          :loading="loading.dialog"
        >
          OK
        </VBtn>
        <VBtn color="red" text @click="close()"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import type { User } from "@/types";
import { defineProps, ref } from "vue";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebase";
import { useFirebaseAuth } from "vuefire";

const auth = useFirebaseAuth();

const props = defineProps<{
  user: User | null;
  role: string;
}>();

// data
const dialog = ref(false);
const loading = ref({
  switch: false,
  dialog: false,
});
const error = ref({
  code: null,
  message: null,
} as { code: string | null; message: string | null });

const perms = {
  admin: ["can edit any user", "can edit any item", "clear users tab"],
};

// methods
const toggleRole = async () => {
  loading.value.switch = true;
  try {
    const toggleRole = httpsCallable(functions, "toggleRole");
    await toggleRole({ email: props.user?.info.email, role: props.role });
    loading.value.switch = false;
  } catch (err) {
    console.log(err);
    const { code, message } = err as { code: string; message: string };
    error.value = { code, message };
  } finally {
    loading.value.dialog = false;
  }
};

const checkPerms = () => {
  if (props.user?.info.email == auth?.currentUser?.email) {
    return {
      disabled: true,
      message: "You cannot change your own permissions",
    };
  }
  if (props.user?.roles.admin) {
    return {
      disabled: false,
      message: `Click to remove ${props.role} permissions`,
    };
  }
  if (props.user?.roles.dev) {
    return {
      disabled: true,
      message: "This user is a developer",
    };
  }
  return {
    disabled: false,
    message: `Click to add ${props.role} permissions`,
  };
};

const close = () => {
  dialog.value = false;
  loading.value.switch = false;
  loading.value.dialog = false;
};
</script>
