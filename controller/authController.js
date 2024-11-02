const Users = require('../models/userModel.js')
const argon2 = require('argon2');
const session = require('express-session');
const { uuid } = require('uuidv4');

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Harap isi username dan password' });
    }
    try {
        const user = await Users.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'Akun tidak ditemukan' });
        }
        const match = await argon2.verify(user.password, password);
        if (!match) {
            return res.status(400).json({ message: 'Password salah' });
        }
        req.session.userUuid = user.uuid;
        await req.session.save();
        res.status(200).json({
            uuid: user.uuid,
            name: user.name,
            username: user.username,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const me = async (req, res) => {
    if (!req.session.userUuid) {
        return res.status(401).json({ message: 'Anda belum login' });
    }
    try {
        const user = await Users.findOne({
            attributes: ['uuid', 'name', 'role'],
            where: {
                uuid: req.session.userUuid
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'Akun tidak ditemukan' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
        res.status(200).json({ msg: "Anda telah logout" });
    });
}

module.exports =
{
    login,
    me,
    logout
}