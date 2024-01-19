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

	let countExerciseTimesCompleted = await prisma.exerciseLog.count({
		where: {
			userId: req.user.id,
			isCompleted: true
		}
	})

	const kgs = await prisma.exerciseTime.aggregate({
		where: {
			exerciseLog: {
				userId: req.user.id
			},
			isCompleted: true
		},

		_sum: {
			weight: true
		}
	})

	const workouts = await prisma.workoutLog.count({
		where: {
			userId: user.id,
			isCompleted: true
		}
	})

	const labels = ['Minutes', 'Workouts', 'Kgs']

	if (kgs._sum.weight > 1000) {
		kgs._sum.weight = Math.round(kgs._sum.weight / 1000)
		labels[2] = 'Tons'
	}

	if (countExerciseTimesCompleted > 200) {
		countExerciseTimesCompleted = Math.round(countExerciseTimesCompleted / 60)
		labels[0] = 'Hour'
	}

	res.json({
		...user,
		statistics: [
			{
				label: labels[0],
				value: Math.ceil(countExerciseTimesCompleted * 2.3) || 0
			},
			{
				label: labels[1],
				value: workouts
			},
			{
				label: labels[2],
				value: kgs._sum.weight || 0
			}
		]
	})
})
