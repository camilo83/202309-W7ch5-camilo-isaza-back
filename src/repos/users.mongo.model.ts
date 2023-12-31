import { Schema, model } from 'mongoose';
import { User } from '../entities/user.js';

const usersSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwd: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  surname: String,
  age: Number,
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Friend',
    },
  ],
  enemies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Enemie',
    },
  ],
});

usersSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});

export const UserModel = model<User>('User', usersSchema, 'users');
