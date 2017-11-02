// @flow
import mongoose, { Schema } from 'mongoose'

const userSchema:Object = new Schema({
  username: { type: String, required: true, unique: true },
  slug: {type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: [
      'unverified',
      'active',
      'disabled',
      'blocked'
    ],
    default: 'unverified'
  },
  updatedAt: { type: Date},
  roles: [String]
});

userSchema
  .pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updatedAt = currentDate;

    next();
  }).virtual('createdAt').get( function () {
    if (this["_created"]) return this["_created"];
    return this["_created"] = this._id.getTimestamp();
  });

const User:Object = mongoose.model('User', userSchema);
export default User;
