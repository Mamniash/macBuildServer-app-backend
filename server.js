import express from 'express'
import authRoutes from './app/auth/auth.routes.js'
import userRoutes from './app/user/user.routes.js'
import 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { prisma } from './app/prisma.js'
import { errorHandler, notFound } from './app/middleware/error.middleware.js'

async function main() {
	const app = express()
	dotenv.config()
	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

	app.use(express.json())

	app.use('/auth', authRoutes)
	app.use('/user', userRoutes)

	app.use(notFound)
	app.use(errorHandler)

	const PORT = process.env.PORT || 5000

	app.listen(PORT, () =>
		console.log(
			`Server is running on ${PORT} in mode ${process.env.NODE_ENV}`.blue
				.bold
		)
	)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.log(e)
		await prisma.$disconnect()
		process.exit(1)
	})
