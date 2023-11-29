import { prisma } from '../prisma.js'
import asyncHandler from 'express-async-handler'
import { faker } from '@faker-js/faker'
import { hash, verify } from 'argon2'
import { generateToken } from './generate-token.js'
import { UserFields } from '../utils/user.utils.js'

export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await prisma.user.findUnique({
		where: {
			email: email
		}
	})

	if (!user) {
		res.status(400)
		throw new Error('User is not exist')
	}

	const isMatch = await verify(user.password, password)

	if (isMatch) {
		const token = generateToken(user.id)
		res.json({ user, token })
	} else {
		res.status(401)
		throw new Error('Email and password are not correct')
	}

	res.json({
		passwordIn: password,
		passwordUsHash: user.password,
		isMatch
	})
})

export const getUsers = asyncHandler(async (req, res) => {
	const user = await prisma.user.findMany()

	res.json(user)
})

export const registerUser = asyncHandler(async (req, res) => {
	console.log(req.body)
	const { email, password } = req.body
	const isHaveUser = await prisma.user.findUnique({
		where: {
			email: email
		}
	})

	if (isHaveUser) {
		res.status(400)
		throw new Error('User already exists')
	}

	const user = await prisma.user.create({
		data: {
			email,
			password: await hash(password),
			name: faker.internet.userName()
		},
		select: UserFields
	})

	const token = generateToken(user.id)

	res.json({ user, token })
})
