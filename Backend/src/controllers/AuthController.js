const User = require('../modals/AuthModel');
const { hashPassword, comparePassword, generateToken } = require('../helper/authHelper');
const { handle200, handle201 } = require('../helper/successHandler');
const { handle401, handle422, handle500, formatSequelizeError } = require('../helper/errorHandler');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation for missing fields
        if (!username || !email || !password) {
            return handle422(res, {
                general: "Username, email, and password are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return handle422(res, {
                email: "Email already registered"
            });
        }

        // Hash password using helper
        const hashedPassword = await hashPassword(password);

        // Create user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return handle201(res, {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
        }, "User registered successfully");

    } catch (error) {
        if (error.name.startsWith('Sequelize')) {
            return formatSequelizeError(res, error);
        }
        return handle500(res, error);
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return handle422(res, {
                general: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return handle401(res, "Invalid email or password");
        }

        // Check password using helper
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return handle401(res, "Invalid email or password");
        }

        // Generate JWT using helper
        const token = generateToken({ 
            id: user.id, 
            username: user.username, 
            email: user.email,
            role: user.role
        });

        return handle200(res, {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        }, "Login successful");

    } catch (error) {
        return handle500(res, error);
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
        });

        if (!user) {
            return handle500(res, { message: "User not found in database" });
        }

        return handle200(res, user, "User profile retrieved");
    } catch (error) {
        return handle500(res, error);
    }
};
// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        return handle200(res, users, "All users retrieved successfully");
    } catch (error) {
        return handle500(res, error);
    }
};
