import {  UserService } from '../services/userService.js';
import {  sendEmail } from '../utils/emailUtils.js';

class CustomUsersController {
register(req, res) {
    return  UserService.register(res);
  }

  async registerFail(req, res) {
    return  UserService.registerFail(res);
  }

  async registerPassport(req, res) {
    if (!req.user) {
      return res.json({ error: 'user doesnt exist' });
    }
    return  UserService.initializeDashboard(req, res);
  }

  async login(req, res) {
    return res.render('login', {});
  }

  loginPassport(req, res) {
    if (!req.user) {
      return res.json({ error: 'Error in credentials' });
    }
    
    return UserService.initializeDashboard(req, res);
  }

  async loginFail(req, res) {
    return  UserService.loginFail(res);
  }

  async logOut(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).render('error', { error: 'couldnt close session' });
      }
      return res.redirect('/auth/login');
    });
  }

  async dashboard(req, res) {
    console.log('dashboard3')
    const user = req.session.user;
    return res.render('home', { user: user });
  }

  async changePremiumUser(req, res) {
    try {
      const userId = req.params.uid;
      const userData = await  UserService.getUserByIdOrEmail(userId, null);
      const userChanged = userData?.isPremium
        ? await  UserService.updateUser(userId, { isPremium: false })
        : await  UserService.updateUser(userId, { isPremium: true });
      return res.json(userChanged);
    } catch (err) {
      return res.status(500).json({ error: 'Error changing users' });
    }
  }

  async changeUserRole(req, res) {
    try {
      const userId = req.params.uid;
      const userData = await  UserService.getUserByIdOrEmail(userId, null);
      const newRole = userData?.role === 'user' ? 'admin' : 'user';
      const userChanged = await  UserService.updateUser(userId, { role: newRole });
      console.log(userChanged);
      return res.json(userChanged);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error changing user role' });
    }
  }

  async profile(req, res) {
    const user = req.session.user;
    return res.render('profile', { user: user });
  }

  async getUsers(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const users = await  UserService.getUsers(limit);
      res.render('users', { users });
    } catch (err) {
      return res.status(500).json({ error: 'Error obtaining users' });
    }
  }

  async getUserById(req, res) {
    const uid = req.params.uid;
    try {
      const user = await  UserService.getUserByIdOrEmail(uid, null);
      if (!user) {
        throw `User with id ${uid} doesn't exist in the database`;
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: `Didn't find user: ${err}` });
    }
  }

  async deleteUser(req, res) {
    const uid = req.params.uid;
    try {
      const deletedUserId = await  UserService.deleteUser(uid);
      return res.json({ userId: deletedUserId });
    } catch (err) {
      return res.status(500).json({ error: `Failed to delete user: ${err}` });
    }
  }

  async deleteInactiveUsers(req, res) {
    try {
      const now = new Date();
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(now.getDate() - 2);
      const usersToDelete = await  userManager.getUsers(0, { lastLoginDate: { $lt: twoDaysAgo } });

      let deletedUserCount = 0;

      for (const user of usersToDelete) {
        try {
           sendEmail(user.email);
          await userService.deleteUser(user._id);
          deletedUserCount++;
        } catch (err) {
          console.error(`Error deleting user ${user._id}: ${err}`);
        }
      }

      return res.json(usersToDelete);
    } catch (err) {
      return res.status(500).json({ error: `Could not delete users: ${err}` });
    }
  }
}

export const customUsersController = new CustomUsersController();
