import bcrypt from 'bcrypt';

export default (User) => {

  // Trigger method's before save
  User.pre('save', async function (next) {
    console.log('\n----\n --- Before save user --- \n----\n')
    let user = this;

    // if username from social network exists then new username!
    if (user.provider !== 'local' && (user.isNew || user.isModified('username'))) {

      let username = await new Promise((resolve, reject) => {
        (function calc(username) {
          user.constructor.findOneByUsername(username)
            .then(exists => exists ? calc(`${username}1`) : resolve(username))
            .catch(err => reject(err));
        })(user.username);
      });

      user.username = username; // set new username
    }

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password'))
      return next();

    // generate a salt
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      return next();
    } catch (error) {
      console.log(error);
    }

  });

  // Trigger method's after save
  User.post('save', function (err, doc, next) {

    if (err.name === 'MongoError' && err.code === 11000) {
      return next(`'username "${doc.username}" not available.'`);
    } else {
      return next(err);
    }
  });

};