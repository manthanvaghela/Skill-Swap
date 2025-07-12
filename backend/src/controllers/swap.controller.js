import Swap from '../models/SwapRequest.model.js'
import mongoose from 'mongoose'

// Helper function to validate status
const isValidStatus = (status) => ['pending', 'accepted', 'rejected'].includes(status)



const createSwap = async (req, res) => {
    try {
        const { toUser, offeredSkill, requestedSkill, message = '' } = req.body

        if (!offeredSkill || !requestedSkill) {
            return res.status(400).json({ error: 'offeredSkill and requestedSkill are required.' })
        }

        if (toUser && toUser === req.userId) {
            return res.status(400).json({ error: 'Cannot create a swap with yourself.' })
        }

        const swap = await Swap.create({
            fromUser: req.userId,
            toUser: toUser || null,  // optional
            offeredSkill: offeredSkill.trim(),
            requestedSkill: requestedSkill.trim(),
            message: message.trim(),
            status: toUser ? 'pending' : 'open' // if toUser set, status pending else open for public
        })

        res.status(201).json({
            message: toUser ? 'Swap request sent to user.' : 'Public swap request created.',
            swap
        })
    } catch (error) {
        console.error('Create Swap Error:', error)
        res.status(500).json({ error: 'Server error while creating swap.' })
    }
}

const getSwapsForUser = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId)

        const swaps = await Swap.aggregate([
            {
                $match: {
                    $or: [
                        { toUser: null, status: 'open' },       // public swaps
                        { fromUser: userId },                    // swaps created by user
                        { toUser: userId }                       // swaps sent to user
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'fromUser',
                    foreignField: '_id',
                    as: 'fromUser'
                }
            },
            { $unwind: '$fromUser' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'toUser',
                    foreignField: '_id',
                    as: 'toUser'
                }
            },
            {
                $unwind: {
                    path: '$toUser',
                    preserveNullAndEmptyArrays: true     // allow null toUser for public swaps
                }
            },
            {
                $project: {
                    offeredSkill: 1,
                    requestedSkill: 1,
                    message: 1,
                    status: 1,
                    createdAt: 1,
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
        const { status } = req.body;
        if (!status || !isValidStatus(status)) {
            return res.status(400).json({ error: 'Invalid status value.' });
        }

        const swap = await Swap.findById(req.params.id);
        if (!swap) {
            return res.status(404).json({ error: 'Swap not found.' });
        }

        // Only allow update if swap has a toUser and it's the logged-in user
        if (!swap.toUser || swap.toUser.toString() !== req.userId) {
            return res.status(403).json({ error: 'You are not authorized to update this swap.' });
        }

        if (swap.status !== 'pending') {
            return res.status(400).json({ error: 'Cannot update a swap that is already accepted or rejected.' });
        }

        swap.status = status;
        await swap.save();

        res.json(swap);
    } catch (error) {
        console.error('Update Swap Status Error:', error);
        res.status(500).json({ error: 'Server error while updating swap status.' });
    }
};

const deleteSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ error: 'Swap not found.' });
    }

    // Check if the logged-in user is either the sender or receiver of the swap
    if (
      swap.fromUser.toString() !== req.userId &&
      (!swap.toUser || swap.toUser.toString() !== req.userId)
    ) {
      return res.status(403).json({ error: 'You are not authorized to delete this swap.' });
    }

    await swap.deleteOne();

    res.json({ message: 'Swap deleted successfully.' });
  } catch (error) {
    console.error('Delete Swap Error:', error);
    res.status(500).json({ error: 'Server error while deleting swap.' });
  }
};


export {
    createSwap,
    getSwapsForUser,
    updateSwapStatus,
    deleteSwap
}