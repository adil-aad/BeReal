import User from "../models/User.js";

export const sendFriendRequest = async (req, res) => {
  const receiver = await User.findById(req.params.id)
  const sender = await User.findById(req.user._id)

  if (!receiver) return res.status(404).json({ message: "User not found" })

  // Safety check
  if (!receiver.friendRequests) {
    receiver.friendRequests = []
  }

  if (receiver.friendRequests.includes(sender._id))
    return res.status(400).json({ message: "Request already sent" })

  receiver.friendRequests.push(sender._id)
  await receiver.save()

  res.json({ message: "Friend request sent" })
}

// Accept Friend Request
export const acceptFriendRequest = async (req, res) => {
  const sender = await User.findById(req.params.id)
  const receiver = await User.findById(req.user._id)

  if (!sender || !receiver) return res.status(404).json({ message: "User not found" })

  // Safety checks for both arrays
  if (!receiver.friends) receiver.friends = []
  if (!sender.friends) sender.friends = []
  if (!receiver.friendRequests) receiver.friendRequests = []

  if (receiver.friends.includes(sender._id)) {
    return res.status(400).json({ message: "Already friends" })
  }

  // Remove from requests and add to friends
  receiver.friendRequests = receiver.friendRequests.filter(
    (id) => id.toString() !== sender._id.toString()
  );

  receiver.friends.push(sender._id)
  sender.friends.push(receiver._id)

  await receiver.save()
  await sender.save()

  res.json({ message: "Friend added" })
};

// Get My Friends
export const getFriends = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "friends",
    "username profilePic"
  );

  res.json(user ? user.friends : [])
}


export const getFriendRequests = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "friendRequests",
    "username profilePic"
  );

  res.json(user.friendRequests);
};
