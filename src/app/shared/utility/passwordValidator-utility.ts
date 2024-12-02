import { AbstractControl, ValidationErrors } from '@angular/forms';

export default class PasswordValidatorUtility(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return { required: true }; // Parol boşdursa
  }

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const validLength = value.length >= 8;

  if (!hasUpperCase) {
    return { passwordStrength: 'Password must contain at least one uppercase letter.' };
  }

  if (!hasLowerCase) {
    return { passwordStrength: 'Password must contain at least one lowercase letter.' };
  }

  if (!hasNumber) {
    return { passwordStrength: 'Password must contain at least one number.' };
  }

  if (!validLength) {
    return { passwordStrength: 'Password must be at least 8 characters long.' };
  }

  return null; // Bütün şərtlər ödənilibsə, problem yoxdur
}
