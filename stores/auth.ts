import { defineStore } from 'pinia'

interface User {
    id: string;
    email: string;
    role: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: useCookie<string | null>('auth_token').value || null,
        user: null as User | null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login(credentials: any) {
            const config = useRuntimeConfig()
            try {
                const data = await $fetch<{ access_token: string }>(`${config.public.apiBase}/auth/login`, {
                    method: 'POST',
                    body: credentials
                })

                this.token = data.access_token
                const cookie = useCookie('auth_token')
                cookie.value = data.access_token

                // Fetch profile
                await this.fetchProfile()

                return true
            } catch (error) {
                console.error('Login failed', error)
                throw error
            }
        },
        async fetchProfile() {
            const config = useRuntimeConfig()
            if (!this.token) return

            try {
                const user = await $fetch<User>(`${config.public.apiBase}/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                })
                this.user = user
            } catch (error) {
                this.logout()
            }
        },
        logout() {
            this.token = null
            this.user = null
            const cookie = useCookie('auth_token')
            cookie.value = null
            navigateTo('/login')
        }
    }
})
