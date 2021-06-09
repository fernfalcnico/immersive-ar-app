import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./components/Home.vue";
import SceneHome from "./components/SceneHome.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",

  routes: [
      {
        path: "/",
        name: "Home",
        component: Home,
      },
      {
        path: "/session",
        name: "SceneHome",
        component: SceneHome,
      },
  ]
});

export default router;