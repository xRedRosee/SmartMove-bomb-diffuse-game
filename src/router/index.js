import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SingleplayerView from "../views/SingleplayerView.vue";
import MultiplayerView from "../views/MultiplayerView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/singleplayer",
      name: "singleplayer",
      component: SingleplayerView,
    },
    {
      path: "/multiplayer",
      name: "multiplayer",
      component: MultiplayerView,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/AboutView.vue')
    }
  ],
});

export default router;
