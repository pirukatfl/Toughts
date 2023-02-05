const express = require('express')
const router = express.Router()
const ToughtController = require('../controllers/ToughtController')

// const checkAuth = require('../helpers/auth').checkAuth

router.get('/add', ToughtController.createTought)
router.post('/add', ToughtController.createToughtSave)
router.get('/dashboard', ToughtController.dashboard)
router.get('/', ToughtController.showToughts)

module.exports = router