// @flow
/* eslint no-underscore-dangle: 0 */
import mongoose, { Schema } from 'mongoose';

const postSchema: Object = new Schema({
  body: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
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

const Post: Object = mongoose.model('Reply', postSchema);
export default Post;
