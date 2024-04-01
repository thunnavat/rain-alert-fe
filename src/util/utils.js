import axios from "axios"
const url = import.meta.env.PROD ? import.meta.env.VITE_API_URL : "/api"
import { userData } from "../store/userData"



export const UserDataApi = {

    setDistrict: () => {
        const profile = userData()
        console.log(profile.getUserId)
        axios.put(`${url}/users/updateProfile`, JSON.parse(JSON.stringify({
            districtSubscribe: JSON.parse(JSON.stringify(profile.districtSubscribed))
        })),
        {
            headers: {'Authorization': `Bearer ${localStorage.getItem("access_token")}`}
        })
    }
}