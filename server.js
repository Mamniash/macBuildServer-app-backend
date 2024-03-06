import 'colors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import cors from 'cors'

import { errorHandler, notFound } from './app/middleware/error.middleware.js'

import authRoutes from './app/auth/auth.routes.js'
import { prisma } from './app/prisma.js'

dotenv.config()

const app = express()

async function main() {
	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

	app.use(cors())
	app.use(express.json())

	const __dirname = path.resolve()

	app.use('/uploads', express.static(path.join(__dirname, '/uploads/')))

	app.use('/api/auth', authRoutes)

	app.use(notFound)
	app.use(errorHandler)

	const PORT = process.env.PORT || 5000
	const IP = 'localhost'

	app.listen(
		PORT,
		IP,
		console.log(
			`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
				.blue.bold
		)
	)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
