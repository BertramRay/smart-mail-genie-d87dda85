const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user.model');
require('dotenv').config();

/**
 * 配置Passport策略
 * @param {Object} passport - Passport实例
 */
const configPassport = (passport) => {
  // GitHub OAuth策略
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 从GitHub资料中提取数据
          const { id, displayName, username, photos, emails } = profile;
          
          // 尝试查找现有用户
          let user = await User.findOne({ githubId: id });
          
          // 如果用户不存在，则创建新用户
          if (!user) {
            // 获取邮箱 (可能是私密的)
            const email = emails && emails.length > 0 ? emails[0].value : `${username}@github.com`;
            
            // 获取头像
            const avatar = photos && photos.length > 0 ? photos[0].value : '';
            
            user = await User.create({
              githubId: id,
              name: displayName || username,
              email,
              username,
              avatar,
              password: `github_${id}`,  // 设置一个无法猜测的密码
              isVerified: true,  // GitHub验证的用户自动视为已验证
              provider: 'github',
            });
          }
          
          return done(null, user);
        } catch (error) {
          console.error('GitHub认证错误:', error);
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

module.exports = configPassport; 