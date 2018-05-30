const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: String,
  },
  {
    timestamps: true,
  },
);

// Set the 'fullname' virtual property
userSchema
  .virtual('fullName')
  .get(function() {
    return this.firstName + ' ' + this.lastName;
  })
  .set(function(fullName) {
    var splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
  });
userSchema.set('toJSON', {
  getters: true,
  virtuals: false,
});

userSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hashedPassword) {
      if (err) {
        return next(err);
      }
      user.password = hashedPassword;
      this.updatedAt = Date.now();
      next();
    });
  });
});

userSchema.methods.authenticate = async password => {
  return await bcrypt.compare(password, password);
};

userSchema.methods.name = () => {
  return this.displayName || this.username;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
