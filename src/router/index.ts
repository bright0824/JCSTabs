import { createRouter, createWebHistory } from "vue-router/auto";

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(import.meta.env.BASE_URL),
});

export default router;
