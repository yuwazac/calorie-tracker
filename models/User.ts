import bcrypt from 'bcryptjs';
import  mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  dailyCalorieGoal: number;
  onboardingCompleted: boolean;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,   
        lowercase: true,
        trim: true,

        match: [
            /^\s+@\s+\.\s+$/,
            'Please fill a valid email address'
        ]
    },
    password: {
        type: String,
        required: true, 
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [32, 'Password cannot exceed 32 characters'],
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    dailyCalorieGoal: {
        type: Number,
       default: 2000,
    },
    onboardingCompleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

// pre-save hook to hash the password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
} 

export default mongoose.model<IUser>('User', userSchema);