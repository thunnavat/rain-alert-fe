import { createRouter, createWebHistory } from "vue-router"
import { watch } from "vue"
import HomePage from "../views/HomePage.vue"
import RainFall from "../views/RainFall.vue"
import SubScribe from "../views/SubScribe.vue"
import Report from "../views/ReportPage.vue"
import Login from "../views/LoginPage.vue"
import Profile from "../views/ProfilePage.vue"

const history = createWebHistory(import.meta.env.BASE_URL)
const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/rainfall", name: "Rain Fall", component: RainFall },
  { path: "/subscribe", name: "Subscribe", component: SubScribe },
  { path: "/report", name: "Report Bug", component: Report },
  { path: "/login", name: "Login", component: Login },
  { path: "/profile", name: "Profile", component: Profile}
]


const router = createRouter({ history, routes })

export default router
