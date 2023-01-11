<template>
  <VContainer align="center" v-if="user && items">
    <VRow>
      <VCol>
        <AddItemToTab :items="items" />
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VCard max-width="800px">
          <VCardTitle> Current Tab </VCardTitle>
          <VCardText>
            <VTable density="compact">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in items" :key="index">
                  <tr v-if="count()[item.name] > 0">
                    <td>{{ item.name }}</td>
                    <td>{{ count()[item.name] }}</td>
                    <td>
                      {{
                        new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: "CAD",
                        }).format(item.price)
                      }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </VTable>
          </VCardText>
          <VCardText>
            <VRow>
              <VCol align="right">
                <h3 class="mr-2">Total: {{ total() }}</h3>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VCard max-width="800px">
          <VCardTitle> Recent Transactions </VCardTitle>
          <VCardText>
            <VPagination v-model="page" :length="MathTime()" />
            <VTable>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in visibleItems" :key="index">
                  <tr v-if="count()[item.name] > 0">
                    <td>{{ item.name }}</td>
                    <td>
                      {{
                        new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: "CAD",
                        }).format(item.price)
                      }}
                    </td>
                    <td>
                      {{ item.date.toDate().toLocaleDateString() }}
                    </td>
                    <td>
                      {{ item.date.toDate().toLocaleTimeString() }}
                    </td>
                    <DeleteItemFromTab :item="item" v-if="canDelete(item.date)" />
                  </tr>
                </template>
              </tbody>
            </VTable>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VFooter app color="primary" height="50px">
          <VRow justify="center" no-gutters>
            <FeedBack />
          </VRow>
        </VFooter>
      </VCol>
    </VRow>
  </VContainer>
  <VContainer v-else fluid align="center">
    <VRow>
      <VCol>
        <h1>Fetching your profile...</h1>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <VProgressLinear indeterminate />
      </VCol>
    </VRow>
  </VContainer>
</template>

<route lang="json">
{
  "path": "/user",
  "name": "user",
  "meta": {
    "requiresAuth": true
  }
}
</route>

<script setup lang="ts">
import type { Timestamp } from "firebase/firestore";
import type { User, Item } from "@/types";

const router = useRouter();

// data
const page = ref(1);
const perPage = 5;
const user = ref<User | null>(null);
const items = ref<Item[]>([]);

// firebase
const itemSub = onSnapshot(doc(db, "admin/items"), (doc) => {
  items.value = doc.data()?.food as Item[];
});

const userSub = onSnapshot(
  // @ts-expect-error
  doc(db, "users", auth.currentUser.uid),
  (doc) => {
    if (doc.exists()) {
      user.value = doc.data() as User;
      user.value.tab.reverse();
    } else {
      console.log("No such document!");
    }
  }
);

onBeforeUnmount(() => {
  itemSub();
  userSub();
});
// computed properties
const count = () => {
  const total = {} as { [key: string]: number };
  items.value?.forEach((item) => {
    total[item.name] = 0;
  });
  user.value?.tab?.forEach((item) => {
    total[item.name]++;
  });
  return total;
};

const total = () => {
  let total = 0;
  user.value?.tab?.forEach((item) => {
    total += item.price;
  });
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(total);
};

const visibleItems = computed(() => {
  return user.value?.tab.slice(
    (page.value - 1) * perPage,
    page.value * perPage
  );
});

const canDelete = (date: Timestamp) => {
  const now = new Date();
  const diff = now.getTime() - date.toDate().getTime();
  return diff < 300000;
};

// methods
const MathTime = () => {
  if (user.value?.tab.length) {
    return Math.ceil(user.value.tab.length / perPage);
  }
};

setTimeout(() => {
  if (!user.value) {
    router.push({
      name: "error",
    });
  }
}, 5000);
</script>
