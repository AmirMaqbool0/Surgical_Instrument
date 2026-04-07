// Define constants for OTP purposes
const OTP_PURPOSES = {
    LOGIN: "login",
    EMAIL_VERIFICATION: "email_verification",
    RESET_PASSWORD: "reset_password",
    REDEMPTION_CODE: "redemption_code",
    FORGOT_PASSWORD : "forgot-password",
    LOGIN_WITH_VENDOR : "longin-with-vendor"
};

const OTP_SENDER_PLATFORM = {
    EMAIL : 'email',

}

module.exports = {
    OTP_PURPOSES,
    OTP_SENDER_PLATFORM
}