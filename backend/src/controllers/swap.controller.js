import Swap from '../models/SwapRequest.model.js'

// Helper function to validate status
const isValidStatus = (status) => ['pending', 'accepted', 'rejected'].includes(status)

const createSwap = async (req, res) => {
    try {
        const { toUser, offeredSkill, requestedSkill, message = '' } = req.body

        if (!toUser || !offeredSkill || !requestedSkill) {
            return res.status(400).json({ error: 'toUser, offeredSkill, and requestedSkill are required.' })
        }

        if (toUser === req.userId) {
            return res.status(400).json({ error: 'Cannot create a swap with yourself.' })
        }

        const swap = await Swap.create({
            fromUser: req.userId,
            toUser,
            offeredSkill: offeredSkill.trim(),
            requestedSkill: requestedSkill.trim(),
            message: message.trim(),
            status: 'pending'
        })

        res.status(201).json(swap)
    } catch (error) {
        console.error('Create Swap Error:', error)
        res.status(500).json({ error: 'Server error while creating swap.' })
    }
}

const getSwapsForUser = async (req, res) => {
    try {
        const swaps = await Swap.aggregate([
            {
                $match: {
                    $or: [
                        { fromUser: new mongoose.Types.ObjectId(req.userId) },
                        { toUser: new mongoose.Types.ObjectId(req.userId) }
                    ]
                }
            },
            // Lookup fromUser details
            {
                $lookup: {
                    from: 'users',
                    localField: 'fromUser',
                    foreignField: '_id',
                    as: 'fromUser'
                }
            },
            { $unwind: '$fromUser' },
            // Lookup toUser details
            {
                $lookup: {
                    from: 'users',
                    localField: 'toUser',
                    foreignField: '_id',
                    as: 'toUser'
                }
            },
            { $unwind: '$toUser' },
            // Project only necessary fields from fromUser and toUser
            {
                $project: {
                    offeredSkill: 1,
                    requestedSkill: 1,
                    message: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    fromUser: {
                        _id: 1,
                        name: 1,
                        email: 1
                    },
                    toUser: {
                        _id: 1,
                        name: 1,
                        email: 1
                    }
                }
            }
        ])


        res.json(swaps)
    } catch (error) {
        console.error('Get Swaps Error:', error)
        res.status(500).json({ error: 'Server error while fetching swaps.' })
    }
}

const updateSwapStatus = async (req, res) => {
    try {
        const { status } = req.body
        if (!status || !isValidStatus(status)) {
            return res.status(400).json({ error: 'Invalid status value.' })
        }

        const swap = await Swap.findById(req.params.id)
        if (!swap) {
            return res.status(404).json({ error: 'Swap not found.' })
        }

        if (swap.toUser.toString() !== req.userId) {
            return res.status(403).json({ error: 'You are not authorized to update this swap.' })
        }

        if (swap.status !== 'pending') {
            return res.status(400).json({ error: 'Cannot update a swap that is already accepted or rejected.' })
        }

        swap.status = status
        await swap.save()

        res.json(swap)
    } catch (error) {
        console.error('Update Swap Status Error:', error)
        res.status(500).json({ error: 'Server error while updating swap status.' })
    }
}


export {
    createSwap,
    getSwapsForUser,
    updateSwapStatus
}