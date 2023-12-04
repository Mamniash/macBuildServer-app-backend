import asyncHandler from 'express-async-handler'

import { prisma } from '../../prisma.js'

import { addPrevValues } from './add-prev-values.util.js'

// @desc    Get exerciseLog
// @route   GET /api/exercises/log/:id
// @access  Private
export const getExerciseLog = asyncHandler(async (req, res) => {
	const exerciseLog = await prisma.exerciseLog.findUnique({
		where: {
			id: +req.params.id
		},
		include: {
			exercise: true,
			times: {
				orderBy: {
					id: 'asc'
				}
			}
		}
	})

	if (!exerciseLog) {
		res.status(404)
		throw new Error('Exercise Log not found!')
	}

	const prevExerciseLog = await prisma.exerciseLog.findFirst({
		where: {
			exerciseId: exerciseLog.exerciseId,
			userId: req.user.id,
			isCompleted: true
		},
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			times: true
		}
	})

	res.json({
		...exerciseLog,
		times: addPrevValues(exerciseLog, prevExerciseLog)
	})
})

// @desc    Get exerciseLogs
// @route   GET /api/exercises/log
// @access  Private
export const getAllExerciseLogs = asyncHandler(async (req, res) => {
	const exerciseLogs = await prisma.exerciseLog.findMany({
		include: {
			user: true,
			workoutLog: true,
			exercise: true,
			_count: true,
			times: {
				orderBy: {
					id: 'asc'
				}
			}
		}
	})

	if (!exerciseLogs) {
		res.status(404)
		throw new Error('ExerciseLogs not found!')
	}

	res.json(exerciseLogs)
})
