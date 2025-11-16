const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { executeQuery } = require('../config/db');

// ✅ Local strategy configuration
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // can be email or phone
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const phone = req.body.phone || null; // allow login via phone
        const [user] = await executeQuery(
          'SELECT * FROM users WHERE email = ? OR phone = ?',
          [email, phone]
        );

        if (!user) {
          return done(null, false, { message: '❌ User not found. Please register first.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: '❌ Invalid email/phone or password.' });
        }

        // ✅ Authentication successful
        return done(null, user);
      } catch (err) {
        console.error('Passport Auth Error:', err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [user] = await executeQuery('SELECT * FROM users WHERE user_id = ?', [id]);
    done(null, user || null);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
