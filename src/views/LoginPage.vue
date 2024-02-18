<script setup>
import { useRoute } from "vue-router"
import { ref, onMounted } from "vue"
import axios from "axios"
const lineLoginUrl =
  "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2003424448&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Ftt3%2Flogin&state=cp23tt3mtj&scope=profile%20openid"
const url = import.meta.env.PROD ? import.meta.env.VITE_API_URL : "/api"
const route = useRoute()
const userInfo = ref()

const getInitialProps = async () => {
  const lineCode = route.query.code
  try {
    if (lineCode) {
      const params = new URLSearchParams()
      params.append("grant_type", "authorization_code")
      params.append("code", lineCode)
      params.append("redirect_uri", "http://localhost:5173/tt3/login")
      params.append("client_id", "2003424448")
      params.append("client_secret", "6448af88b9fa3786a350bd4ee089c532")

      const request = await axios.post(
        "https://api.line.me/oauth2/v2.1/token",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )

      const tokenData = request.data
      const verifyParams = new URLSearchParams()
      verifyParams.append("id_token", tokenData.id_token)
      verifyParams.append("client_id", "2003424448")
      const requestVerify = await axios.post(
        "https://api.line.me/oauth2/v2.1/verify",
        verifyParams,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )
      userInfo.value = {
        lineToken: tokenData,
        profile: requestVerify.data
      }
      console.log(userInfo.value)
    }
    if (userInfo.value) {
      await axios
        .post(`${url}/register`, {
          username: userInfo.value.profile.sub,
          displayName: userInfo.value.profile.name,
          picture: userInfo.value.profile.picture,
          registerType: "LINE"
        })
        .then(async () => {
          await axios
            .post(`${url}/login`, {
              username: userInfo.value.profile.sub,
              channelId: userInfo.value.profile.aud,
              registerType: "LINE"
            })
            .then((res) => {
              localStorage.setItem("access_token", res.data.accessToken)
            })
        })
    }
  } catch (error) {
    console.error(error)
  }
}
onMounted(() => {
  getInitialProps()
})
</script>

<template>
  <div>
    <a :href="lineLoginUrl">
      <button class="bg-[#06C755] flex items-center justify-items-center py-1">
        <img
          src="../assets/LineIcon.png"
          alt="LineIcon"
          class="w-10 h-10 mr-3"
        />
        <span class="pr-2">Log in with LINE</span>
      </button>
    </a>
  </div>
</template>

<style scoped></style>
