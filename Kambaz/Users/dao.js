import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function UsersDao() {
  const createUser = async (user) => {
    try {
      const newUser = { ...user, _id: uuidv4() };
      return await model.create(newUser);
    } catch (error) {
      console.error("Error in createUser:", error);
      throw error;
    }
  };

  const findAllUsers = async () => {
    try {
      return await model.find();
    } catch (error) {
      console.error("Error in findAllUsers:", error);
      throw error;
    }
  };

  const findUserById = async (userId) => {
    try {
      return await model.findById(userId);
    } catch (error) {
      console.error("Error in findUserById:", error);
      throw error;
    }
  };

  const findUsersByPartialName = async (partialName) => {
    try {
      const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
      return await model.find({
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
        ],
      });
    } catch (error) {
      console.error("Error in findUsersByPartialName:", error);
      throw error;
    }
  };

  const findUsersByRole = async (role) => {
    try {
      return await model.find({ role: role });
    } catch (error) {
      console.error("Error in findUsersByRole:", error);
      throw error;
    }
  };

  const findUserByUsername = async (username) => {
    try {
      return await model.findOne({ username: username });
    } catch (error) {
      console.error("Error in findUserByUsername:", error);
      throw error;
    }
  };

  const findUserByCredentials = async (username, password) => {
    try {
      return await model.findOne({ username: username, password: password });
    } catch (error) {
      console.error("Error in findUserByCredentials:", error);
      throw error;
    }
  };

  const updateUser = async (userId, user) => {
    try {
      return await model.updateOne({ _id: userId }, { $set: user });
    } catch (error) {
      console.error("Error in updateUser:", error);
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      return await model.findByIdAndDelete(userId);
    } catch (error) {
      console.error("Error in deleteUser:", error);
      throw error;
    }
  };

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser,
    findUsersByRole,
    findUsersByPartialName,
  };
}
