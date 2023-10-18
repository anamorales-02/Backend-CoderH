import { userDAO } from '../dao/CustomUserDAO.js';
import { createHash } from '../utils/passwordUtils.js';
import { cartService } from '../services/cartService.js';

export class UserServiceManager {
  async register(res) {
    return res.render('register', {});
  }

  registrationFailed(res) {
    return res.json({ error: 'Registration failed' });
  }

  loginFailed(res) {
    return res.json({ error: 'Login failed' });
  }

  initializeDashboard(req, res) {
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName, 
      age: req.user.age,
      isAdmin: req.user.isAdmin,
      isPremium: req.user.isPremium,
      idCart: req.user.idCart
    };
    console.log(req.user);
  
    return res.redirect('/auth/dashboard')
  }

  async listUsers(limit, filter) {
    try {
      const users = await  userDAO.getUsers(limit, filter);
      return users;
    } catch (err) {
      throw err;
    }
  }

  async addUser(newUser) {
    try {
      const users = await this.listUsers();
      const userExists = users.some((user) => user.email === newUser.email);
      if (userExists) {
        throw "The user you are trying to register already exists.";
      }

      const cartId = await cartService.createCart();
      const userToCreate = {
        email: newUser.email && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(newUser.email) ? newUser.email : (() => { throw ("Please enter a valid email.") })(),
        firstName: newUser.firstName ? newUser.firstName : (() => { throw ("Please enter a First Name.") })(),
        lastName: newUser.lastName ? newUser.lastName : (() => { throw ("Please enter a Last Name.") })(),
        age: newUser.age ? newUser.age : '80',
        isPremium: true,
        role: 'user',
        password: createHash(newUser.password),
        idCart: cartId._id,
        lastLoginDate: new Date()
      };

      let createdUser = await  userDAO.addUser(userToCreate);
      return createdUser;
    } catch (err) {
      throw (`Error adding user: ${err}`);
    }
  }

  async updateUser(id, fieldsToUpdate) {
    try {
      const userToUpdate = { ...fieldsToUpdate };
      for (const field in fieldsToUpdate) {
        switch (field) {
          case "email":
            userToUpdate.email = fieldsToUpdate.email !== "" ? fieldsToUpdate.email : (() => { throw ("Please enter an email.") })();
            break;
          case "firstName":
            userToUpdate.firstName = fieldsToUpdate.firstName !== "" ? fieldsToUpdate.firstName : (() => { throw ("Please enter a First Name.") })();
            break;
          case "lastName":
            userToUpdate.lastName = fieldsToUpdate.lastName !== "" ? fieldsToUpdate.lastName : (() => { throw ("Please enter a Last Name.") })();
            break;
          case "age":
            userToUpdate.age = fieldsToUpdate.age !== "" ? fieldsToUpdate.age : (() => { throw ("Please enter your Age (in years).") })();
            break;
          case "role":
            userToUpdate.role = fieldsToUpdate.role !== "" ? fieldsToUpdate.role : "";
            break;
          case "isPremium":
            userToUpdate.isPremium = fieldsToUpdate.isPremium !== "" ? fieldsToUpdate.isPremium : "";
            break;
          case "lastLoginDate":
            userToUpdate.lastLoginDate = fieldsToUpdate.lastLoginDate !== "" ? fieldsToUpdate.lastLoginDate : Date.now()
            break;
          default:
            break;
        }
      };

      const userUpdated = await  userDAO.updateUser({ _id: id }, userToUpdate);
      return userUpdated;
    } catch (err) {
      throw (`Unable to modify User with ID ${id}. ${err}`);
    }
  }

  async getUserByIdOrEmail(id, email) {
    try {
      console.log('Getting user test')
      const users = await  userDAO.getUsers();
    
      let _id, _email;
      if (id) {
        _id = users.find((user) => user._id.toString() === id.toString());
        _id && _id != undefined ? _id : _id = null;
        return _id;
      } else if (email) {
        _email = users.find((user) => user.email.toString() === email.toString());
        _email && _email != undefined ? _email : null;
        return _email;
      }
    } catch (err) {
      throw (`Failed to find User: ${err}`);
    }
  }

  async deleteUser(userId) {
    try {
      const cartUser = await this.getUserByIdOrEmail(userId, null);
      await  userDAO.deleteUser(userId);
      const userCartId = await cartService.getCartById(cartUser.idCart);
      await cartService.deleteCart(userCartId);
      return userId;
    } catch (err) {
      throw (`Failed to delete user: ${err}`);
    }
  }
}

export const UserService = new UserServiceManager();
