import z from 'zod';

export const TPassword = z
  .string()
  .min(8, { message: 'validation_short_password' })
  .max(50, { message: 'validation_too_long_password' });

export const TSignupPayload = z
  .object({
    firstName: z
      .string()
      .min(1, { message: 'validation_required_field' })
      .max(50),
    lastName: z
      .string()
      .min(1, { message: 'validation_required_field' })
      .max(50),
    email: z.email({ message: 'validation_invalid_email' }),
    password: TPassword,
    confirmPassword: TPassword,
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: 'validation_passwords_dont_match',
      path: ['confirmPassword'],
    }
  );

export const TLoginPayload = z.object({
  email: z.email({ message: 'validation_invalid_email' }),
  password: TPassword,
});
