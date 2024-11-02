const Users = require('../models/userModel.js')

const verifyUser = async (req, res, next) => {
    try {
        if (!req.session.userUuid) {
            return res.status(401).json({ message: 'Silahkan login' });
        }
        const user = await Users.findOne({
            where: {
                uuid: req.session.userUuid
            }
        });
        if (!user) {
            return res.status(404).json({ msg: 'Akun tidak ditemukan' });
        }
        req.user = user;
        req.userUuid = user.uuid;
        req.role = user.role;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const adminOnly = async (req, res, next) => {
    try {
        if (!req.session.userUuid) {
            return res.status(401).json({ message: 'Silahkan login' });
        }
        const user = await Users.findOne({
            where: {
                uuid: req.session.userUuid
            }
        });
        // if (!user || req.role !== 'admin') {
        //     return res.status(403).json({ message: 'Anda tidak memiliki akses' });
        // }
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
        if(user.role !== "admin") return res.status(403).json({msg: "Akses terlarang"});
        next(); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports ={
    verifyUser,
    adminOnly
}
