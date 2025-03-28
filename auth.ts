import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // const parsedCredentials = z
                //     .object({ email: z.string().email(), password: z.string().min(6) })
                //     .safeParse(credentials);

                // if (parsedCredentials.success) {
                //     const { email, password } = parsedCredentials.data;

                //     const user = await getUser(email);
                //     if (!user) return null;

                //     const passwordsMatch = await bcrypt.compare(password, user.password);
                //     if (passwordsMatch) return user;
                // }

                // console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});