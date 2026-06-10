/**
 * Main application routes (console shell).
 *
 * @module AppRoutes
 */

const routes = [
  {
    path: "chat",
    name: "Chat",
    component: () => import("@/Views/Pages/Code/ChatPage.vue"),
  },
];

export default routes;
