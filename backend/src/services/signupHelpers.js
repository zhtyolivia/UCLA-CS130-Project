const bcrypt = require('bcrypt');
const { emailExistsInBoth } = require('./validationHelpers');
const { createUser, generateAuthToken, verifyGoogleToken} = require('./authHelpers');

const handleTraditionalSignup = async (Model, email, password, name, phonenumber) => {
    // Input validation can be performed here or passed from the caller function

    // Check if email already exists
    if (await emailExistsInBoth(Model, email)) {
        throw new Error("User with this email already exists");
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await createUser(Model, {
        email,
        password: hashPassword,
        name,
        phonenumber,
    });

    // Generate authentication token
    const authToken = generateAuthToken(user._id);

    return { user, authToken };
};

async function handleGoogleSignup(req, res, accountType, token) {
    try {
        const payload = await verifyGoogleToken(token);
        let user;
        let Model = accountType === 'driver' ? Driver : Passenger;
        let emailExists = await emailExistsInBoth(Driver, Passenger, payload.email);

        if (emailExists) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        user = await createUser(Model, {
            email: payload.email,
            name: payload.name,
            password: null,
            phonenumber: '',
        });

        const authToken = generateAuthToken(user._id);
        res.status(200).json({ message: `${accountType} registered successfully via Google`, token: authToken, user });
    } catch (error) {
        res.status(500).json({ message: 'Error during Google signup', error });
    }
};

module.exports = {
    handleTraditionalSignup,
    handleGoogleSignup
};
