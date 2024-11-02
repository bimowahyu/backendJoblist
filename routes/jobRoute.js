const exporess = require('express')
const {
getJob,
getJobByUuid,
getJobMonth,
createJob,
updateJob,
deleteJob
} = require  ('../controller/jobController.js')
const { verifyUser, adminOnly } = require('../middleware/userMiddleware.js')
const router = exporess.Router()

router.get('/job',verifyUser, getJob);
router.get('/getjobmonth/',adminOnly,getJobMonth)
router.get('/job/:uuid',verifyUser, getJobByUuid);
router.post('/createjob', verifyUser,createJob);
router.put('/updatejob/:uuid', verifyUser, updateJob);
router.delete('/deletejob/:uuid', verifyUser, deleteJob)


module.exports = router