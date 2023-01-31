import { createRouter, createWebHistory } from "vue-router/auto";
import { useFirebaseAuth } from "vuefire";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
});

router.beforeEach(async (to, from) => {
  const auth = useFirebaseAuth();
  const { admin } =
    (await auth?.currentUser
      ?.getIdTokenResult()
      .then((idTokenResult) => idTokenResult.claims)) || {};

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if (requiresAuth && !auth?.currentUser) {
    return { name: "login" };
  }

  if (requiresAdmin && !admin) {
    return from.path;
  }
});

export default router;
