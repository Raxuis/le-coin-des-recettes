import { NuxtAuthHandler } from '#auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default NuxtAuthHandler({
  secret: process.env.NUXT_AUTH_SECRET,
  providers: [
    //@ts-ignore  Using .default for SSR compatibility
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email || '' },
        })

        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              email: user.email || '',
              name: user.name || '',
              image: user.image || '',
            },
          })
        }

        return true
      } catch (error) {
        console.error("Error during sign-in:", error)
        return false
      }
    }
  }
})
