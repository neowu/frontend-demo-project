export class InputValidator {
    static validateUsername(value: string): string | null {
        return /^[a-zA-Z0-9_]{6,16}$/.test(value) ? null : "user name is required";
    }

    static validatePassword(value: string): string | null {
        return /^(?=.*\d)(?=.*[a-zA-Z])([0-9a-zA-Z]){6,30}$/.test(value) ? null : "password is required";
    }
}
