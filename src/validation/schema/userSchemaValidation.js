import Joi from "joi";

const createUser = Joi.object({
  avatar: Joi.object({
    url: Joi.string().uri().optional().messages({
      "string.uri": "Avatar URL must be a valid URI.",
    }),
    publicId: Joi.string().optional(),
  }).optional(),

  name: Joi.string().min(3).max(50).required().trim().messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 50 characters.",
    "any.required": "Name is required.",
  }),

  email: Joi.string()
    .email()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .trim()
    .messages({
      "string.base": "Email must be a string.",
      "string.empty": "Email is required.",
      "string.email": "Email must be a valid email address.",
      "string.pattern.base":
        "Email format is invalid. Ensure it follows 'example@domain.com'.",
      "any.required": "Email is required.",
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$"
      )
    )
    .required()
    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 128 characters.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),

  role: Joi.string()
    .valid("customer", "admin", "superAdmin")
    .default("customer")
    .messages({
      "string.base": "Role must be a string.",
      "any.only": "Role must be one of ['customer', 'admin', 'superAdmin'].",
    }),

  createdAt: Joi.date()
    .default(() => new Date())
    .messages({
      "date.base": "Created At must be a valid date.",
    }),

  isVerified: Joi.boolean().default(false).messages({
    "boolean.base": "Is verified must be a boolean.",
  }),
}).unknown(true); // Allows unknown properties (like timestamps) to pass through

const login = Joi.object({
  email: Joi.string()
    .email()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .trim()
    .messages({
      "string.base": "Email must be a string.",
      "string.empty": "Email is required.",
      "string.email": "Email must be a valid email address.",
      "string.pattern.base":
        "Email format is invalid. Ensure it follows 'example@domain.com'.",
      "any.required": "Email is required.",
    }),

  password: Joi.string().required().messages({
    "string.base": "Password must be a string.",
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
});

const forgottenPassword = Joi.object({
  email: Joi.string()
    .email()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .trim()
    .messages({
      "string.base": "Email must be a string.",
      "string.empty": "Email is required.",
      "string.email": "Email must be a valid email address.",
      "string.pattern.base":
        "Email format is invalid. Ensure it follows 'example@domain.com'.",
      "any.required": "Email is required.",
    }),
});

const resetPassword = Joi.object({
  newPassword: Joi.string()
    .min(8)
    .max(128)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$"
      )
    )
    .required()
    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 128 characters.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),
  comfirmPassword: Joi.string()
    .min(8)
    .max(128)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$"
      )
    )
    .required()
    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 128 characters.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),
});

export { createUser, login, forgottenPassword, resetPassword };
