// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    css: ['~/assets/css/main.css'],
    googleFonts: {
        families: {
            Lora: true,
            "Playfair Display": true,
        }
    },
    colorMode: {
        preference: 'light'
    },
    auth: {
        isEnabled: true,
        disableServerSideAuth: false,
        baseURL: process.env.BASE_URL ? `${process.env.BASE_URL}/api/auth` : `http://localhost:${process.env.PORT || 3000}/api/auth`,
        provider: {
            defaultProvider: "google",
            type: "authjs",
            trustHost: false,
        },
        sessionRefresh: {
            enablePeriodically: true,
            enableOnWindowFocus: true,
        },
        auth: {
            globalAppMiddleware: true
        }
    },
    modules: [
        '@vueuse/nuxt',
        '@nuxt/image',
        '@nuxtjs/google-fonts',
        '@nuxt/ui',
        '@sidebase/nuxt-auth',
        '@vueuse/motion/nuxt',
    ]
})
