const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user.model');
require('dotenv').config();

/**
 * 配置Passport策略
 * @param {Object} passport - Passport实例
 */
const configPassport = (passport) => {
  // 打印OAuth配置信息
  console.log('GitHub OAuth配置:', {
    clientID: process.env.GITHUB_CLIENT_ID ? '已配置' : '未配置',
    clientSecret: process.env.GITHUB_CLIENT_SECRET ? '已配置' : '未配置',
    callbackURL: process.env.GITHUB_CALLBACK_URL || '未配置'
  });

  // GitHub OAuth策略
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ['user:email'],
        // 需要包含passReqToCallback选项以便可以访问请求对象
        passReqToCallback: true,
        // 增加请求超时时间
        customHeaders: { 'User-Agent': 'Smart-Mail-Genie-App' }
      },
      async (req, accessToken, refreshToken, profile, done) => {
        console.log('GitHub OAuth回调信息:', {
          hasAccessToken: !!accessToken,
          tokenLength: accessToken ? accessToken.length : 0,
          profileId: profile?.id,
          refreshToken: !!refreshToken,
          params: req.query, // 添加请求参数
          headers: req.headers['user-agent'] // 添加请求头信息
        });
        
        // 检查accessToken是否存在
        if (!accessToken) {
          console.error('GitHub OAuth错误: 未获取到访问令牌');
          return done(new Error('未获取到GitHub访问令牌'), null);
        }
        
        try {
          // 从GitHub资料中提取数据
          const { id, displayName, username, photos, emails } = profile;
          
          console.log('GitHub OAuth验证成功，用户信息:', {
            id,
            displayName,
            username,
            hasEmails: emails && emails.length > 0,
            hasPhotos: photos && photos.length > 0
          });
          
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
            
            console.log('已创建新GitHub用户:', user._id);
          } else {
            console.log('已找到现有GitHub用户:', user._id);
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