import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";

export default class ValidatorUtility {
  static dateOfBirthValidator(minAge: number, maxAge: number) {
    return (control: FormGroup): ValidationErrors | null => {
      console.log(control);
      const dateOfBirth = control.get("dateOfBirth")?.value;
      const currentErrors = control.get("dateOfBirth").errors;
      const dateOfBirthControl = control.get("dateOfBirth");
      if (!dateOfBirth) {
        // Date of birth is not provided
        return null; // No validation error
      }

      // Calculate the age based on the date of birth
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();

      // Check if the age is within the specified range
      if (age < minAge || age > maxAge) {
        dateOfBirthControl.setErrors({ ...currentErrors, ageOutOfRange: true });
        return { ageOutOfRange: true };
      } else {
        dateOfBirthControl.setErrors(currentErrors);
        return null;
      }
    };
  }

  static matchingPasswords(control: AbstractControl) {
    const password = control.get("password").value;
    const confirmPassword = control.get("confirmPassword").value;
    const currentErrors = control.get("confirmPassword").errors;
    const confirmControl = control.get("confirmPassword");

    if (compare(password, confirmPassword)) {
      confirmControl.setErrors({ ...currentErrors, not_matching: true });
    } else {
      confirmControl.setErrors(currentErrors);
    }
  }
}
function compare(password: string, confirmPassword: string) {
  return password !== confirmPassword && confirmPassword !== "";
}
