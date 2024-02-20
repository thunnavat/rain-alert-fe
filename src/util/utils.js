import axios from "axios"
const url = import.meta.env.PROD ? import.meta.env.VITE_API_URL : "/api"
import { userData, userSubscribe } from "../store/userData"



export const UserDataApi = {
    getDistrict: () => {
        const userId = userData()
        const userSub = userSubscribe()
        if(userId.getUserId != 'UserId not found'){
            return axios.get(`${url}/districtUserSubscribe/${userId.getUserId.userId}`, {
                headers: {'Authorization': `Bearer ${userId.getUserId.token}`}
            }).then((res) => {
                userSub.setInitProvince(res.data[0].districtSubscribe);
            })

        }
        else if(userId.getUserId == 'UserId not found'){
            return 'Not Logged In Yet'
        }
    },

    setDistrict: () => {
        const userId = userData()
        const districtSub = userSubscribe()
        axios.put(`${url}/districtUserSubscribe/${userId.getUserId.userId}`, JSON.parse(JSON.stringify({
            userId: `${userId.getUserId.userId}`,
            districtSubscribe: JSON.parse(JSON.stringify(districtSub.provinces))
        })),
        {
            headers: {'Authorization': `Bearer ${userId.getUserId.token}`}
        })
    }
}