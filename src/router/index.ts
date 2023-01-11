import { createRouter, createWebHistory } from "vue-router/auto";

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(import.meta.env.BASE_URL),
});

router.beforeEach(async (to, from) => {
  const { currentUser } = auth;
  const { admin } =
    (await currentUser
      ?.getIdTokenResult()
      .then((idTokenResult) => idTokenResult.claims)) || {};

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if (requiresAuth && !currentUser) {
    return { name: "login" };
  }

  if (requiresAdmin && !admin) {
    return from.path;
  }
});

export default router;
