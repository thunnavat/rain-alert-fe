import axios from "axios"
const url = import.meta.env.PROD ? import.meta.env.VITE_API_URL : "/api"
import { userData } from "../store/userData"



export const UserDataApi = {
    getDistrict: () => {
        const userId = userData()
        if(userId.getUserId != 'UserId not found'){
            return axios.get(`${url}/districtUserSubscribe/${userId.getUserId.userId}`, {
                headers: {'Authorization': `Bearer ${userId.getUserId.token}`}
            }).then((res) => {
                console.log(res)
            })

        }
        else if(userId.getUserId == 'UserId not found'){
            return 'Not Logged In Yet'
        }
    },

    addDistrict: (district) => {
        console.log('district added')
        const userId = userData()
        axios.post(`${url}/districtUserSubscribe`, {
            userId: `${userId.getUserId.userId}`,
            districtSubscribe: district
        },
        {
            headers: {'Authorization': `Bearer ${userId.getUserId.token}`}
        })
    }
}