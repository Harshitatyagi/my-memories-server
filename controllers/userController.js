// controllers/userController.js

import User from "../models/user.js"
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });

    try {
        await user.save();
        const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: 86400 });
        res.status(200).send({ auth: true, token });
    } catch (error) {
        res.status(500).send('Error registering user.');
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).send('No user found.');

        const isValidPassword = user.password === password;
        if (!isValidPassword) return res.status(401).send({ auth: false, token: null });

        const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: 86400 });
        res.status(200).send({ auth: true, token });
    } catch (error) {
        res.status(500).send('Error on the server.');
    }
};

export default { register, login };
