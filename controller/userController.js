const { where } = require('sequelize');
const Users = require('../models/userModel.js')
const argon2 = require('argon2');


const getUser = async(req,res)=>{
    try {
        const response = await Users.findAll({
            attributes:['uuid','name','username','role']
        });
        res.status(200).json({
            status: 200,
            message: 'Success get all data',
            data: response
        });
        // res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const getUserByUuid = async(req, res)=>{
    try {
        const { uuid } = req.params;
        if(!uuid)
            return res.status(404).json({message: 'user tidak di temukan'})
        const response = await Users.findOne({
            attributes:['uuid','name','username','role'],
            where: {
                uuid
            }   
        })
        res.status(200).json({
            status: 200,
            message: 'Success get data by uuid',
            data: response
        });
        // res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const createUser = async(req, res)=>{
    try {
        const {name, username, password, confpassword, role} = req.body;
        if(password !== confpassword)
            return res.status(400).json({message: 'validasi password tidak sesuai'})
        const hashedPassword = await argon2.hash(password);
        await Users.create({
            name:name,
            username:username,
            password:hashedPassword,
            role:role
        })
        res.status(201).json({
            status: 201,
            message: 'Success',
            data: Users
        });
        // res.status(201).json({msg: 'Akun berhasil di buat'});
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const updateUser = async(req, res)=>{
    try {
        const { uuid } = req.params;
        const user = await Users.findOne({
            where:{
                uuid
            }
        })
        if(!user)
            return res.status(400).json({message: 'user tidak di temukan'})
        
        const {name, username, password, confpassword, role} = req.body;
        let hashPassword = user.password;
        if (password && password !== "") {
            if (password !== confpassword) return res.status(400).json({ msg: "Password tidak valid" });
            hashPassword = await argon2.hash(password);
        }
        await Users.update({
            name:name || user.name,
            username:username || user.username,
            password:hashPassword,
            role:role || user.role
        },{
            where:{
                uuid
            }
        });
        const updatedUser = await Users.findOne({
            where: {
                uuid
            }
        });
        res.status(200).json({
            status: 200,
            message: 'Success',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const updateByUser = async (req, res) => {
    try {
        const { uuid } = req.params;
        const user = await Users.findOne({
            where:{
                uuid
            }
        })
        if(!user)
            return res.status(404).json({msg: "user tidak di temukan"})
        const { name, password } = req.body;
        
    } catch (error) {
        
    }
}

const deleteUser = async(req, res)=>{
    const { uuid } = req.params;
    if (!uuid) return res.status(400).json({ msg: "UUID tidak valid atau kosong" });
    try {
        const user = await Users.findOne({
            where:{
                uuid
            }
        });
        if(!user)return res.status(404).json({ msg: "Akun tidak ditemukan" });
        await user.destroy({
            where:{
                uuid
            }
        })
        res.status(200).json({
            status: 200,
            message: 'Success delete'
           
        });
        // res.status(200).json('akun berhasil di hapus')
    } catch (error) {
        res.status(500).json(error.message)
    }
}

module.exports = {
    getUser,
    getUserByUuid,
    createUser,
    updateUser,
    deleteUser,
    updateByUser
}