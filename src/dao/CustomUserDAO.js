//@ts-check
import { UserModel } from "./models/usersModel.js";
import { UserDTO } from "./usersDTO.js";

export class UserDAO {
  async getUsers(limit, filter) {
    try {
      const users = await UserModel.find(filter).limit(limit).lean();
      return users;
      const userDTOs = users.map(user => new UserDTO(user)); return userDTOs;
    } catch (err) {
      throw (`Error accesing users ${err}`);
    }
  };

  async addUser(newUser) {
    try {
      let createdUser = await UserModel.create(newUser);
      return createdUser;
    } catch (err) {
      throw (`Error adding user ${err}`);
    };
  };

  async updateUser(id, fieldsToUpdate) {
    try {
      const userUpdated = await UserModel.findByIdAndUpdate(id, fieldsToUpdate, { new: true });
      return userUpdated;
    } catch (err) {
      throw (`couldnt update user with id ${id}. ${err}`);
    };
  };

  async deleteUser(id) {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(id);
      return deletedUser;
    } catch (err) {
      throw (`Error deleting user ${err}`);
    };
  };

  async deleteUsers(filter) {
    try {
      const data = await UserModel.deleteMany(filter)
      return data
    } catch (err) {
      throw (`Error deleting users ${err}`);
    }
  }
}

export const userDAO = new UserDAO();