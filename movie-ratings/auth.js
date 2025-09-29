const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { ObjectId } = require("mongodb");
const mongodb = require("./db/connect");

async function usersCol() {
  return mongodb.getDb().db().collection("users");
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('GitHub login profile:', {
            id: profile.id,
            username: profile.username,
            emails: (profile.emails || []).map(e => e.value)
         });
        const col = await usersCol();
        const doc = {
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName || "",
          emails: (profile.emails || []).map((e) => e.value),
          avatarUrl: profile.photos?.[0]?.value || "",
          profileUrl: profile.profileUrl || "",
          github: profile._json,
          updatedAt: new Date(),
        };

        const result = await col.findOneAndUpdate(
          { githubId: profile.id },
          {
            $set: {
              username: doc.username,
              displayName: doc.displayName,
              emails: doc.emails,
              avatarUrl: doc.avatarUrl,
              profileUrl: doc.profileUrl,
              github: doc.github,
              updatedAt: doc.updatedAt,
            },
            $setOnInsert: { githubId: doc.githubId, createdAt: new Date() },
          },
          { upsert: true, returnDocument: "after" }
        );

        return done(null, result.value);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const col = await usersCol();
    const user = await col.findOne({ _id: new ObjectId(id) });
    done(null, user || null);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
