const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { MongoClient, ObjectId } = require('mongodb');

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);
let usersCol;

async function getUsersCol() {
  if (!usersCol) {
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect();
    }
    const db = client.db(); // default DB from URI
    usersCol = db.collection('users');
    await usersCol.createIndex({ githubId: 1 }, { unique: true });
  }
  return usersCol;
}

passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL || process.env.GITHUB_CALLBACK_URL, // support either
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const users = await getUsersCol();
      const doc = {
        githubId: profile.id,
        username: profile.username,
        displayName: profile.displayName || '',
        emails: (profile.emails || []).map(e => e.value),
        avatarUrl: profile.photos?.[0]?.value || '',
        profileUrl: profile.profileUrl || '',
        github: profile._json,
        updatedAt: new Date()
      };

      const result = await users.findOneAndUpdate(
        { githubId: profile.id },
        {
          $set: {
            username: doc.username,
            displayName: doc.displayName,
            emails: doc.emails,
            avatarUrl: doc.avatarUrl,
            profileUrl: doc.profileUrl,
            github: doc.github,
            updatedAt: doc.updatedAt
          },
          $setOnInsert: { githubId: doc.githubId, createdAt: new Date() }
        },
        { upsert: true, returnDocument: 'after' }
      );

      return done(null, result.value);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const users = await getUsersCol();
    const user = await users.findOne({ _id: new ObjectId(id) });
    done(null, user || null);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
