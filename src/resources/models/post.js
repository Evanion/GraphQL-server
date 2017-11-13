// @flow
/* eslint no-underscore-dangle: 0 */
import mongoose, { Schema } from 'mongoose';

const postSchema: Object = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  status: {
    type: String,
    enum: ['draft', 'hidden', 'locked', 'open'],
    default: 'open'
  },
  updatedAt: { type: Date },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

postSchema.pre('save', function updatedAt(next) {
  // change the updated_at field to current date
  this.updatedAt = new Date();

  next();
});

postSchema.virtual('createdAt').get(function createdAt() {
  if (this._created) return this._created;
  this._created = this._id.getTimestamp();
  return this._created;
});

postSchema.virtual('id').get(function getId() {
  return this._id;
});

const Post: Object = mongoose.model('Post', postSchema);
export default Post;
