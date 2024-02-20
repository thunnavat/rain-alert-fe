
    import { defineStore } from 'pinia'
    import { jwtDecode } from "jwt-decode";

    export const userData = defineStore('data', {
        state: () => ({
               userId: '',
               userName: '',
               displayName: '',
               picture: '',
               role: '',
               count: 0
            }),
        getters: {
            getUserData() {
                const token = localStorage.getItem('access_token');
                if(token != null){
                    const decode = jwtDecode(token)
                    return decode
                }
                else {
                    return 'Token not found'
                }
            },
            getUserId() {
                const token = localStorage.getItem("access_token");
                if(token != null){
                    const decode = jwtDecode(token)
                    const userId = {
                        userId: decode.userId,
                        token: token
                    }
                    return userId
                }
                else {
                    return 'UserId not found'
                }
            },
            getLoginStatus() {
                const token = localStorage.getItem("access_token");
                if(token != null){
                    this.count++
                    return this.count
                }else if(token == null){
                    return 'Not Logged In'
                }
            }
        },
        actions: {
            setUserData(userId, userName, displayName, picture, role) {
                this.userId = userId
                this.userName = userName
                this.displayName = displayName
                this.picture = picture
                this.role = role
            }
        }
    })

    export const userSubscribe = defineStore('province', {
        state: () => ({
            provinces: []
        }),
        getters: {
            getProvinces(state) {
                return state
            }
        },
        actions: {
            setInitProvince(province){
                this.provinces = province
            },
            setProvince(province) {
                this.provinces.push(province)
                
            },
            removeProvince(province) {
                this.provinces = this.provinces.filter((p) => !p.includes(province))
            }
        }
    })
