// Password validation
export const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push(`At least ${minLength} characters`);
    if (!hasUpperCase) errors.push('At least one uppercase letter');
    if (!hasLowerCase) errors.push('At least one lowercase letter');
    if (!hasNumbers) errors.push('At least one number');
    if (!hasSpecialChar) errors.push('At least one special character');

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Generate OTP
export const generateOTP = (length = 6) => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};

// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone number validation
export const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
};

// Token management
export const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
    localStorage.removeItem('authToken');
};

// User session management
export const setUserSession = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const getUserSession = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const clearUserSession = () => {
    localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getAuthToken();
};

// Format phone number
export const formatPhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumber;
};

// Password strength meter
export const getPasswordStrength = (password) => {
    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    // Calculate percentage
    const maxStrength = 6;
    const percentage = (strength / maxStrength) * 100;

    // Determine strength level
    let level = 'weak';
    if (percentage >= 80) level = 'strong';
    else if (percentage >= 60) level = 'medium';

    return {
        percentage,
        level,
    };
}; 