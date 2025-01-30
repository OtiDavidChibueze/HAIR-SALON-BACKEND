import Joi from "joi";

const createUser = Joi.object({
  profilePic: Joi.object({
    url: Joi.string().uri().optional().default("").messages({
      "string.uri": "Avatar URL must be a valid URI.",
    }),
    publicId: Joi.string().optional().default(""),
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

  phone: Joi.string()
    .pattern(/^(?:\+234|0)[789][01]\d{8}$/) // Nigerian phone number format
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base":
        "Phone number must be a valid Nigerian number (e.g., +2348123456789 or 08123456789)",
    }),

  role: Joi.string()
    .valid("User", "Admin", "SuperAdmin")
    .default("User")
    .messages({
      "string.base": "Role must be a string.",
      "any.only": "Role must be one of ['customer', 'admin', 'superAdmin'].",
    }),

  address: Joi.object({
    street: Joi.string().required().messages({
      "string.empty": "Street is required",
    }),
    city: Joi.string().required().messages({
      "string.empty": "City is required",
    }),
    state: Joi.string().required().messages({
      "string.empty": "State is required",
    }),
    postalCode: Joi.string()
      .pattern(/^[0-9]{5}(-[0-9]{4})?$/)
      .min(5)
      .max(9)
      .required()
      .messages({
        "string.empty": "Postal Code is required",
        "string.pattern.base":
          "Postal Code must be a valid format (e.g., 12345 or 12345-6789)",
      }),
    country: Joi.string().required().messages({
      "string.empty": "Country is required",
    }),
  }).required(),

  createdAt: Joi.date()
    .default(() => new Date())
    .messages({
      "date.base": "Created At must be a valid date.",
    }),

  isVerified: Joi.boolean().default(false).messages({
    "boolean.base": "Is verified must be a boolean.",
  }),

  location: Joi.object({
    type: Joi.string().valid("Point").required().messages({
      "string.base": "Location type must be a string.",
      "string.empty": "Location type is required.",
      "any.only": 'Location type must be "Point".',
    }),
    coordinates: Joi.array()
      .items(
        Joi.number().required().messages({
          "number.base": "Coordinates must contain numbers.",
          "any.required": "Coordinate values are required.",
        })
      )
      .length(2)
      .required()
      .custom((value, helpers) => {
        const [longitude, latitude] = value;
        if (longitude < -180 || longitude > 180) {
          return helpers.message("Longitude must be between -180 and 180.");
        }
        if (latitude < -90 || latitude > 90) {
          return helpers.message("Latitude must be between -90 and 90.");
        }
        return value;
      })
      .messages({
        "array.base": "Coordinates must be an array of numbers.",
        "array.length":
          "Coordinates must contain exactly two values: [longitude, latitude].",
      }),
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
