const validateUser = (req, res, next) => {
    try {
        const { username, email, password, confirmPassword, oldPassword, newPassword } = req.body;
        const path = req.path;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (path === '/user/login') {
            if (!email || !password) {
                throw Object.assign(Error("Please provide both email and password"), { code: 400 });
            }
            if (!emailRegex.test(email)) {
                throw Object.assign(Error("Please provide a valid email address"), { code: 400 });
            }
        } else if (path === '/user/register') {
            if (!username || !email || !password || !confirmPassword) {
                throw Object.assign(Error("Please provide all required fields"), { code: 400 });
            }
            if (!emailRegex.test(email)) {
                throw Object.assign(Error("Please provide a valid email address"), { code: 400 });
            }
            if (password.trim().length < 6) {
                throw Object.assign(Error("Password must be 6 characters long"), { code: 400 });
            }
            if (password !== confirmPassword) {
                throw Object.assign(Error("Password and confirm password must match"), { code: 400 });
            }
        } else if (path === '/user/update') {
            if (email && !emailRegex.test(email)) {
                throw Object.assign(Error("Please provide a valid email address"), { code: 400 });
            }
            if (newPassword) {
                if (newPassword.trim().length < 6) {
                    throw Object.assign(Error("Password must be 6 characters long"), { code: 400 });
                }
                if (!oldPassword) {
                    throw Object.assign(Error("Please provide your old password to set a new password"), { code: 400 });
                }
            }
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = validateUser;