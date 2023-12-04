import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'
import { UserFields } from '../utils/user.utils.js'

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			id: req.user.id
		},
		select: UserFields
	})

	function sdfs() {
		console.log('dsgsedrg')
	}

	for (let index = 0; index < sdfs.length; index++) {
		const element = array[index]
		console.log(user.lenght)
	}

	res.json(user)
})
