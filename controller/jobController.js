const {Op, where } = require('sequelize')
const Job = require('../models/jobModel.js')
const users = require('../models/userModel.js')
const moment = require('moment')

//get job by session user
const getJob = async(req, res)=>{
    try {
        const { bulan, tahun } = req.query;
        const userUuid = req.user.uuid;
        const startDate = moment(`${tahun}-${bulan}-01`).startOf('month').toDate();
        const endDate = moment(startDate).endOf('month').toDate();
        const response = await Job.findAll({
            where: { userUuid },
            date: { [Op.between]: [startDate, endDate] },
           attributes:['uuid','job','date','userUuid','createdAt'],
           include:[{
            model:users,
            attributes:['uuid','name','role']
           }]

        })
        res.status(200).json({
            status: 200,
            message: 'Success',
            data: response
        });
        // res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error.message)
    }
}
const getJobMonth = async (req, res) => {
    try {
        const bulan = req.query.bulan;
        const tahun = req.query.tahun;
        const startDate = moment(`${tahun}-${bulan}-01`).startOf('month').format('YYYY-MM-DD');
        const endDate = moment(`${tahun}-${bulan}-01`).endOf('month').format('YYYY-MM-DD');

        const response = await Job.findAll({
            where: {
                date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            attributes: ['uuid', 'job', 'date', 'userUuid', 'createdAt'],
            include: [{
                model: users,
                attributes: ['uuid', 'name']
            }]
        });

        res.status(200).json({
            status: 200,
            message: 'Success',
            data: response
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getJobByUuid = async(req, res)=>{
    try {
        const { uuid } = req.params;
        if(!uuid)res.status(404).json({message:'Data tidak di temukan'})
        const response = await Job.findOne({
        where:{
            uuid: uuid
        }
    });
    if (!response) {
        return res.status(404).json({ message: 'Data tidak di temukan' });
    }

    res.status(200).json({
        status: 200,
        message: 'Success',
        data: response
    });
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const createJob = async (req, res) => {
    try {
        const user = req.user; 
        if (!user) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        const date = moment().format('YYYY-MM-DD');
        const jobData = req.body.job;
        const newJob = await Job.create({
            job: jobData,
            date: date,
            userUuid: user.uuid
        });
        const createdJob = await Job.findOne({
            where: {
                uuid: newJob.uuid
            }
        });
        return res.status(201).json({
            status: 201,
            message: 'Success',
            data: createdJob
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateJob = async(req, res)=> {
    try {
        const { uuid } = req.params;
        const job = await Job.findOne({
            where:{
                uuid: uuid
            }
        });
        if(!job)
            res.status(404).json({message:'Data tidak di temukan'})
        const date = moment().format('YYYY-MM-DD')
        const { jobData } = req.body;
        if (typeof jobData !== 'string') {
            return res.status(400).json({ message: 'Hayo lo error' });
        }
        await Job.update({
            job: jobData,
            date: date
        },{
            where:{
                uuid: uuid
            }
        })
        const updateJob = await Job.findOne({
            where:{
                uuid: uuid
            }
        })
        return res.status(200).json({
            status: 200,
            message: 'Success Update data',
            data: updateJob
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const deleteJob = async(req, res)=> {
    const { uuid } = req.params;
    if (!uuid) return res.status(400).json({ msg: "UUID tidak valid atau kosong" });
    try {
        const job = await Job.findOne({
            where:{
                uuid:uuid
            }
        });
        if(!job)
            return res.status(404).json({message:'Data tidak di temukan'})
        await Job.destroy({
            where: {
                uuid: uuid
            }
        });
        return res.status(200).json({
            status: 200,
            message: 'Success Delete data',
            data: Job
        })
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

module.exports = {
    getJob,
    getJobByUuid,
    getJobMonth,
    createJob,
    updateJob,
    deleteJob
}