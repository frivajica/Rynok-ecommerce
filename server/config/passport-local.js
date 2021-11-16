const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/Users");
const state = "pending";
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      // Match Email's User
      const user = await User.find({ email: email });
      console.log("esto es user", user);
      if (!user) return done(null, false, { message: "email not found" });

      // Match Password's User
      const match = await new User(...user).matchPassword(password);
      console.log(match, "esto es match");
      if (match) return done(null, user);

      return done(null, false, { message: "password not found" });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("esto es de la serializacion", user);
  if (user.googleId) {
    done(null, user.googleId);
  } else if (user.facebookId) {
    done(null, user.facebookId);
  } else {
    done(null, user[0]._id);
  }
  //(user.facebookId) done(null, user.facebookId);
  //(user[0]._id) done(null, user[0]._id)
});

//el registro al parecer lo hace bine porque te trae el req.user, el tema seria el logueo
//fijate que creo que no hcae falta la condicion ya que ya tiene _id el usuario registrado por facebook
passport.deserializeUser((id, done) =>
  User.find({ facebookId: id }).then((userf) => {
    console.log("esto es deserializacion", userf);
    userf
      ? done(null, userf)
      : User.find({ googleId: id }).then((userg) => {
          console.log("esto es deserializacion", userg);
          userg ? done(null, userg) : User.find({ _id: id }).then((user) => done(null, user));
        });
  })
);
