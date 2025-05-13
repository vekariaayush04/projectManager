import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
} from "passport-google-oauth20";
import { db } from "../db/db";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
      passReqToCallback: false,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        const isUser = await db.user.findUnique({
          where: {
            id: profile.id,
          },
        });
        if (!isUser) {
          const user = await db.user.create({
            data: {
              id: profile.id,
              name: profile.displayName,
              email: profile.emails![0].value,
            },
          });
          return done(null, user);
        }
        return done(null, isUser);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// Serialize user (store user ID in session)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user (get user by ID from session)
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    done(null, user);
  } catch (error) {
    done(error as Error, null);
  }
});

export default passport;
