import Users from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email']
        })
        res.json(users)
    } catch (error) {
        console.log(error)
    }
}

export const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    if (password !== confirmPassword) return res.status(400).json({ message: "Password & Confirm Password not match" })
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    try {
        await Users.create({
            name: name,
            email: email,
            password: hashedPassword,
        })
        res.json({ message: "Register Success" })
    } catch (error) {
        console.log(error)
    }
}

export const loginUser = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        })
        const match = await bcrypt.compare(req.body.password, user.password)
        if(!match) return res.status(400).json({ message: "Wrong email or password" })
        const userId = user.id
        const name = user.name
        const email = user.email
        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '60s'
        })
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        await Users.update({refresh_token: refreshToken}, {
            where: {
                id: userId
            }
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
            // secure: true
        })
        res.json({ accessToken })
    } catch (error) {
        res.status(400).json({ message: "Email not found" })
    }
}

export const logoutUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) return res.sendStatus(204)
    const user = await Users.findOne({
        where: {
            refresh_token: refreshToken
        }
    })
    if(!user) return res.sendStatus(204)
    const userId = user.id
    await Users.update({ refresh_token: null}, {
        where: {
            id: userId
        }
    })
    res.clearCookie('refreshToken')
    return res.sendStatus(200)
}