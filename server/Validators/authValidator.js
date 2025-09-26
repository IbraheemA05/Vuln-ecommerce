import Joi from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().required().trim(),
  password: Joi.string().required(),
});

export const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
    }),
  confirmPassword: Joi.valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match.",
  }),
  role: Joi.string().valid("vendor", "customer").required(),
});


export const resetPasswordSchema = Joi.alternatives().try(
  Joi.object({
    email: Joi.string().email().required(),
  }),
  Joi.object({
    token: Joi.string().hex().length(64).required(),
    newPassword: Joi.string().min(8).required(),
  })
);

export const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ["customer", "vendor", "admin"], default: "customer" },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true, strict: true });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


export const updateProfileSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
    }),
  confirmPassword: Joi.valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match.",
  }),
  role: Joi.string().valid("vendor", "customer").required(),
});

  
export const updateRoleSchema = Joi.object({
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  role: Joi.string().valid("customer", "vendor", "admin").required(),
});