import { createRouter, createWebHashHistory } from "vue-router"
import HomePage from "../views/Homepage.vue"

const history = createWebHashHistory(import.meta.env.BASE_URL)
const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/rainfall", name: "RainFall" },
  { path: "/subscribe", name: "Subscribe" },
  { path: "/report", name: "Report Bug" }
]

const router = createRouter({ history, routes })

export default router
