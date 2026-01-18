import * as User from "../models/userModel.js"

export const getUserById = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    await User.deleteUser(req.params.id)
    res.json({ message: "User deleted" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
