import { NuxtAuthHandler } from '#auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    //@ts-ignore  Using .default for SSR compatibility
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  ],
  callbacks: {
    async signIn({ user }) {
      console.log(user);
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
    },
    async session({ session, user }) {
      // session.user = {
      //   name: user.name || null,
      //   email: user.email || null,
      //   image: user.image || null,
      // };
      // session.expires = new Date(session.expires).toISOString();
      return session;
    },
  }
})
