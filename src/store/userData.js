
    import { defineStore } from 'pinia'

    export const userData = defineStore('data', {
        state: () => ({
               userId: '',
               userName: '',
               displayName: '',
               picture: '',
               role: ''
            }),
        getters: {
            getUserData(state) {
                return state
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
            setProvince(province) {
                this.provinces.push(province)
            },
            removeProvince(province) {
                this.provinces = this.provinces.filter((p) => !p.includes(province))
            }
        }
    })
