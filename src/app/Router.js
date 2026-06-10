/**
 * Vue Router configuration.
 *
 * @module Router
 */

import { createRouter, createWebHistory } from "vue-router";
import { APP_HOME_PATH } from "@/app/Config";
import { useAuthStore } from "@/stores/auth";
import authRoutes from "@/routes/AuthRoutes";
import appRoutes from "@/routes/AppRoutes";

const Router = createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/auth",
      redirect: "/auth/login",
      name: "Auth",
      component: () => import("@/Views/Layouts/AuthLayout.vue"),
      children: authRoutes,
    },
    {
      path: "/",
      redirect: APP_HOME_PATH,
      name: "Main",
      component: () => import("@/Views/Layouts/MainLayout.vue"),
      children: appRoutes,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: APP_HOME_PATH,
    },
  ],
});

Router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore();
  const canUseConsole = auth.isAuthenticated || import.meta.env.DEV;

  if (to.name === "AuthCallback" && to.query.token) {
    await auth.completeGoogleLogin(String(to.query.token));
    next({ path: APP_HOME_PATH, replace: true });
    return;
  }

  if (to.meta?.public === true) {
    if (canUseConsole && to.name === "Login") {
      next({ path: APP_HOME_PATH });
      return;
    }
    next();
    return;
  }

  if (!canUseConsole) {
    next({ name: "Login" });
    return;
  }

  if (auth.token && !auth.user) {
    await auth.fetchUser();
  }

  next();
});

export default Router;
