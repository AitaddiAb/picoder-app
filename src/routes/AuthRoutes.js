/**
 * Authentication shell routes.
 *
 * @module AuthRoutes
 */

const routes = [
  {
    path: "login",
    name: "Login",
    meta: { public: true },
    component: () => import("@/Views/Pages/Auth/LoginPage.vue"),
  },
  {
    path: "callback",
    name: "AuthCallback",
    meta: { public: true },
    component: () => import("@/Views/Pages/Auth/CallbackPage.vue"),
  },
];

export default routes;
