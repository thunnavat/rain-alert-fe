import { defineStore } from "pinia"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

const url = import.meta.env.PROD ? import.meta.env.VITE_API_URL : "/api"

export const userData = defineStore("data", {
  state: () => ({
    userId: "",
    email: "",
    displayName: "",
    picture: "",
    districtSubscribed: [],
    notifyToken: "",
    notificationByLine: false,
    notificationByEmail: false,
    role: "",
    loginStatus: false,
    registerType: "",
  }),
  persist: true,
  getters: {
    getUserData() {
      const token = localStorage.getItem("access_token")
      if (token != null) {
        const decode = jwtDecode(token)
        return decode
      } else {
        return "Token not found"
      }
    },
    getUserId() {
      const token = localStorage.getItem("access_token")
      if (token != null) {
        const decode = jwtDecode(token)
        const userId = {
          userId: decode.userId,
          token: token
        }
        return userId
      } else {
        return "UserId not found"
      }
    },
    getLoginStatus() {
      const token = localStorage.getItem("access_token")
      if (token != null) {
        this.loginStatus = true
      } else if (token == null) {
        this.loginStatus = false
      }
    }
  },
  actions: {
    setUserData(
      userId,
      email,
      displayName,
      picture,
      districtSubscribed,
      notifyToken,
      notificationByLine,
      notificationByEmail,
      role,
    ) {
      this.userId = userId
      this.email = email
      this.displayName = displayName
      this.picture = picture
      this.districtSubscribed = districtSubscribed
      this.notifyToken = notifyToken
      this.notificationByLine = notificationByLine
      this.notificationByEmail = notificationByEmail
      this.role = role
    },
    async getProfile() {
        const token = localStorage.getItem("access_token")
        const response = await axios.get(
            `${url}/login/profile`,
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        )
        const data = response.data
        this.email = data.email
        this.displayName = data.displayName
        this.picture = data.picture
        this.districtSubscribed = data.districtSubscribe
        this.notifyToken = data.notifyToken
        this.notificationByLine = data.notificationByLine
        this.notificationByEmail = data.notificationByEmail
        this.registerType = data.registerType
    },
    setProvince(province) {
      this.districtSubscribed.push(province)
    },
    removeProvince(province) {
      this.districtSubscribed = this.districtSubscribed.filter((p) => !p.includes(province))
    }
  }
})