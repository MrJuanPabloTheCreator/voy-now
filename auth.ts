var bcrypt = require('bcryptjs');
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import { LoginSchema } from "./schemas/authSchema";
import toast from "react-hot-toast";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [
    Google,
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null
        }  

        try {
          const { email, password } = validatedFields.data;
          const getUserByEmail = await fetch('https://partydo-57zobzleq-mrjuanpablothecreators-projects.vercel.app/api/credentials', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(email),
          });

          const { success, existingUser } = await getUserByEmail.json();
          if(success && existingUser.provider === 'credentials'){
            if (await bcrypt.compare(password, existingUser.password)) {
              return existingUser;
            }
            return null;
          }
        } catch (error) {
          console.error('Error during user authorization:', error);
        }
        return null;
      },    
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }){
      // Check if there is a session already on!!!!!!!!!!!!
      if(!account){
        return false;
      }

      const getUserByEmail = await fetch('https://partydo-57zobzleq-mrjuanpablothecreators-projects.vercel.app/api/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user.email),
      });
      
      const { success, existingUser } = await getUserByEmail.json();
      if(success){
        if(existingUser.provider !== account.provider){
          return false;
        }
        user.id = existingUser.user_id;
      } else {
        //Insert user into DB using Google Info
        const newUser = await fetch('https://partydo-57zobzleq-mrjuanpablothecreators-projects.vercel.app/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            provider: account.provider,
            image: user.image || 'https://example.com/default-image.jpg',
          }),
        });

        const { success, userId } = await newUser.json();
        if (success) {
          user.id = userId;
        } else {
          toast.error('Unexpected error occured')
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
      }
      // console.log('-----------Token-----------',token)
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      // console.log('-----------Session-----------',session)
      return session;
    },
    async redirect(){
      return 'https://partydo-57zobzleq-mrjuanpablothecreators-projects.vercel.app/home'
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
})