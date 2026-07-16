const profileService = require('../services/profile.service');

class ProfileController {
  async getProfile(req, res, next) {
    try {
      const profile = await profileService.getProfile(req.user.id);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const profile = await profileService.updateProfile(req.user.id, req.body);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
