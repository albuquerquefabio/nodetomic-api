import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [
      true, 'Username is required.'
    ],
    unique: true
  },
  password: {
    type: String
  },
  name: {
    type: String
  },
  lastname: String,
  email: {
    type: String,
    lowercase: true
  },
  photo: String,
  provider: {
    type: String,
    required: [
      true, 'Provider is required.'
    ],
    default: 'local'
  },
  roles: {
    type: Array,
    default: ['user']
  },
  status: {
    type: Number,
    default: 1,
    required: [true, 'Status is required.']
  },
  date: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  social: {
    id: String,
    info: {}
  }
});

UserSchema.path('username').index({ unique: true });

UserSchema.plugin(mongoosePaginate);

require('./hooks/user.hook').default(UserSchema);
require('./statics/user.static').default(UserSchema);
UserSchema.methods = {
  // Compare password
  authenticate(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

};

export default mongoose.model('User', UserSchema);