const session = require('express-session')
const Tought = require('../models/Tought')
const User = require('../models/User')

module.exports = class ToughtsController {
    static async showToughts(req, res) {
        res.render('toughts/home')
    }

    static async dashboard(req, res) {
        const userId = req.session.userid

        const user = await User.findOne({ where: { id: userId } , include: Tought, plain: true })

        if (!user) {
            res.redirect('/login')
        }
        
        // console.log(user)
        const toughts = user.Toughts.map((result) => result.dataValues)

        console.log(toughts)

        res.render('toughts/dashboard', { toughts })
    }

    static createTought(req, res) {
        res.render('toughts/create')
    }

    static async createToughtSave(req, res) {
        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        await Tought.create(tought)

        req.flash('message', 'Pensamento criado com sucesso!')

        req.session.save(() => {
            res.redirect('/dashboard')
        })
    }
}