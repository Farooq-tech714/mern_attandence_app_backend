// import mongoose, { Document, Schema } from 'mongoose';

// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
// }

// const userSchema = new Schema<IUser>(
//   {
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true },
//     password: { type: String, required: true, minlength: 6 },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<IUser>('User', userSchema);

// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true, 
//     lowercase: true, 
//     trim: true 
//   },
//   password: { type: String, required: true },
// });

// export default mongoose.model('User', userSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  department?: string;
  profileImage?: string; // store filename or cloud URL
  status: 'In Office' | 'Out of Office' | 'In Meeting' | 'On Break' | 'On Leave';
  lastSeen?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { type: String, required: true },
    phone: { type: String },
    department: { type: String },
    profileImage: { type: String },

    // 🔹 Status for attendance / availability
    status: { 
      type: String, 
      enum: ['In Office', 'Out of Office', 'In Meeting', 'On Break', 'On Leave'], 
      default: 'Out of Office' 
    },

    // 🔹 For online tracking or sorting by last activity
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
