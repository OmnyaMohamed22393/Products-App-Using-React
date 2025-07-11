import * as yup from 'yup';

export const loginSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .matches(/^\S*$/, 'Username cannot contain spaces'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one number, and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender'),
  address: yup
    .string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters'),
  city: yup
    .string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters'),
  state: yup
    .string()
    .required('State is required')
    .min(2, 'State must be at least 2 characters'),
  zipCode: yup
    .string()
    .required('ZIP code is required')
    .matches(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
  country: yup
    .string()
    .required('Country is required')
    .min(2, 'Country must be at least 2 characters'),
});
