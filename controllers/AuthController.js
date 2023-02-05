const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        const { email, password } = req.body

        const user = await User.findOne({ where: { email: email } })

        if(!user) {
            req.flash('message', 'usuário não encontrado')
            res.render('auth/login')
            return
        }

        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch) {
            req.flash('message', 'senha incorreta!')
            res.render('auth/login')
            return
        }
        req.session.userid = user.id

        req.flash('message', 'login realizado com sucesso!')

        // garante que a sessão seja salva antes de redirecionar (com uma callback)
        req.session.save(() => {
            res.redirect('/')
        })
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {

        const { name, email, password, confirmPassword } = req.body

        if (password !== confirmPassword) {
            req.flash('message', 'as senhas são diferentes!')
            res.render('auth/register')

            return
        }

        const checkIfUserExists = await User.findOne({ where: { email: email } })

        if (checkIfUserExists) {
            req.flash('message', 'email já cadastrado no sistema!')
            res.render('auth/register')

            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {
            const createdUser = await User.create(user)

            // inicializar sessão
            req.session.userid = createdUser.id

            req.flash('message', 'cadastro efetuado com sucesso!')

            // garante que a sessão seja salva antes de redirecionar (com uma callback)
            req.session.save(() => {
                res.redirect('/')
            })
        } catch (error) {
            console.log(error)
        }

    }

    static async logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}