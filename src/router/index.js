import { createRouter, createWebHashHistory } from "vue-router"
import HomePage from "../views/Homepage.vue"
import RainFall from "../views/RainFall.vue"

const history = createWebHashHistory(import.meta.env.BASE_URL)
const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/rainfall", name: "Rain Fall", component: RainFall },
  { path: "/subscribe", name: "Subscribe" },
  { path: "/report", name: "Report Bug" }
]

const router = createRouter({ history, routes })

export default router
