const express = require('express');
const{
    getUser,
    getUserByUuid,
    createUser,
    updateUser,
    deleteUser
} = require('../controller/userController.js');
const { adminOnly } = require('../middleware/userMiddleware.js')
const router = express.Router();

router.get('/users', getUser);
router.get('/users/:uuid', adminOnly,getUserByUuid);
router.post('/createUsers',adminOnly, createUser);
router.put('/updateUsers/:uuid',adminOnly,updateUser);
router.delete('/deleteUsers/:uuid',adminOnly ,deleteUser);

module.exports = router

