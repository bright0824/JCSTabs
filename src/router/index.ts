import { createRouter, createWebHistory } from "vue-router/auto";
import { getCurrentUser, useFirebaseAuth } from "vuefire";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
});

router.beforeEach(async (to, from) => {
  const currentUser = await getCurrentUser();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if (requiresAuth) {
    if (!currentUser) {
      return {
        path: "/login",
        query: {
          redirect: to.fullPath,
        },
      };
    }
    if (requiresAdmin) {
      const { admin } =
        (await currentUser
          ?.getIdTokenResult()
          .then((idTokenResult) => idTokenResult.claims)) || {};
      if (!admin) {
        return false;
      }
    }
  }
});

export default router;
