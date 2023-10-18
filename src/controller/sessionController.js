import { UserDTO } from "../dao/usersDTO.js";

class CustomSessionsController {
  getCurrentSession(req, res) {
    const user = new UserDTO(req.session.user);
    return res.send(JSON.stringify(user));
  }

  handleDashboard(req, res) {
    req.session.user = req.user;
    return res.redirect('/home');
  }
}

export const customSessionsController = new CustomSessionsController();
