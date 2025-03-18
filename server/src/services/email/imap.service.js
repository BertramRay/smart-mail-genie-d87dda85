const Imap = require('imap');
const { simpleParser } = require('mailparser');
const { promisify } = require('util');
const Email = require('../../models/email.model');

class ImapService {
  constructor(mailboxConfig) {
    this.config = {
      user: mailboxConfig.imap.user,
      password: mailboxConfig.imap.password,
      host: mailboxConfig.imap.host,
      port: mailboxConfig.imap.port,
      tls: mailboxConfig.imap.tls,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 10000,
    };
    this.imap = new Imap(this.config);
  }

  // 连接到 IMAP 服务器
  connect() {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', resolve);
      this.imap.once('error', reject);
      this.imap.connect();
    });
  }

  // 关闭连接
  disconnect() {
    return new Promise((resolve) => {
      this.imap.once('end', resolve);
      this.imap.end();
    });
  }

  // 打开指定的邮箱
  openBox(boxName = 'INBOX', readOnly = true) {
    return new Promise((resolve, reject) => {
      this.imap.openBox(boxName, readOnly, (err, box) => {
        if (err) return reject(err);
        resolve(box);
      });
    });
  }

  // 搜索邮件
  search(criteria = ['UNSEEN'], boxName = 'INBOX') {
    return new Promise(async (resolve, reject) => {
      try {
        await this.connect();
        const box = await this.openBox(boxName, false);
        
        this.imap.search(criteria, (err, results) => {
          if (err) {
            this.disconnect();
            return reject(err);
          }
          
          if (!results || results.length === 0) {
            this.disconnect();
            return resolve([]);
          }
          
          const emails = [];
          
          const fetch = this.imap.fetch(results, { bodies: '', markSeen: true });
          
          fetch.on('message', (msg, seqno) => {
            const email = {};
            
            msg.on('body', (stream, info) => {
              let buffer = '';
              
              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
              });
              
              stream.once('end', () => {
                simpleParser(buffer, (err, parsed) => {
                  if (err) {
                    console.error('Error parsing email:', err);
                    return;
                  }
                  
                  Object.assign(email, parsed);
                });
              });
            });
            
            msg.once('attributes', (attrs) => {
              email.uid = attrs.uid;
              email.flags = attrs.flags;
              email.seqno = seqno;
            });
            
            msg.once('end', () => {
              emails.push(email);
            });
          });
          
          fetch.once('error', (err) => {
            this.disconnect();
            reject(err);
          });
          
          fetch.once('end', () => {
            this.disconnect();
            resolve(emails);
          });
        });
      } catch (error) {
        this.disconnect();
        reject(error);
      }
    });
  }

  // 获取最近的 n 封邮件
  async getRecentEmails(limit = 20, boxName = 'INBOX') {
    try {
      await this.connect();
      const box = await this.openBox(boxName, false);
      
      // 计算要获取的邮件范围
      const total = box.messages.total;
      const start = Math.max(1, total - limit + 1);
      const end = total;
      
      if (total === 0) {
        await this.disconnect();
        return [];
      }
      
      const range = `${start}:${end}`;
      
      return new Promise((resolve, reject) => {
        const emails = [];
        
        const fetch = this.imap.fetch(range, { bodies: '', markSeen: false });
        
        fetch.on('message', (msg, seqno) => {
          const email = {};
          
          msg.on('body', (stream, info) => {
            let buffer = '';
            
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
            
            stream.once('end', () => {
              simpleParser(buffer)
                .then(parsed => {
                  Object.assign(email, parsed);
                })
                .catch(err => {
                  console.error('Error parsing email:', err);
                });
            });
          });
          
          msg.once('attributes', (attrs) => {
            email.uid = attrs.uid;
            email.flags = attrs.flags;
            email.seqno = seqno;
          });
          
          msg.once('end', () => {
            emails.push(email);
          });
        });
        
        fetch.once('error', (err) => {
          this.disconnect();
          reject(err);
        });
        
        fetch.once('end', () => {
          this.disconnect();
          resolve(emails);
        });
      });
    } catch (error) {
      await this.disconnect();
      throw error;
    }
  }

  // 将解析的邮件转换为我们的数据模型格式
  static mapToEmailModel(parsedEmail, userId, mailboxId) {
    const from = parsedEmail.from ? {
      name: parsedEmail.from.value[0].name || '',
      email: parsedEmail.from.value[0].address || '',
    } : { name: '', email: '' };

    const to = parsedEmail.to ? parsedEmail.to.value.map(recipient => ({
      name: recipient.name || '',
      email: recipient.address || '',
    })) : [];

    const cc = parsedEmail.cc ? parsedEmail.cc.value.map(recipient => ({
      name: recipient.name || '',
      email: recipient.address || '',
    })) : [];

    const bcc = parsedEmail.bcc ? parsedEmail.bcc.value.map(recipient => ({
      name: recipient.name || '',
      email: recipient.address || '',
    })) : [];

    const attachments = parsedEmail.attachments ? parsedEmail.attachments.map(attachment => ({
      filename: attachment.filename,
      contentType: attachment.contentType,
      size: attachment.size,
      content: attachment.size <= 1024 * 1024 ? attachment.content : null, // 只存储小于1MB的附件
      path: attachment.size > 1024 * 1024 ? `attachments/${userId}/${parsedEmail.messageId}/${attachment.filename}` : null,
    })) : [];

    return {
      user: userId,
      mailbox: mailboxId,
      messageId: parsedEmail.messageId,
      subject: parsedEmail.subject || '(无主题)',
      from,
      to,
      cc,
      bcc,
      inReplyTo: parsedEmail.inReplyTo || null,
      references: parsedEmail.references || [],
      text: parsedEmail.text || '',
      html: parsedEmail.html || '',
      attachments,
      date: parsedEmail.date || new Date(),
      receivedDate: new Date(),
      isRead: parsedEmail.flags && parsedEmail.flags.includes('\\Seen'),
      isStarred: parsedEmail.flags && parsedEmail.flags.includes('\\Flagged'),
    };
  }

  // 保存邮件到数据库
  static async saveEmailsToDB(emails, userId, mailboxId) {
    const savedEmails = [];
    
    for (const email of emails) {
      const mappedEmail = ImapService.mapToEmailModel(email, userId, mailboxId);
      
      try {
        // 使用 messageId 检查是否已存在
        const existingEmail = await Email.findOne({ messageId: mappedEmail.messageId });
        
        if (existingEmail) {
          // 更新现有邮件的标志（已读、星标等）
          existingEmail.isRead = mappedEmail.isRead;
          existingEmail.isStarred = mappedEmail.isStarred;
          await existingEmail.save();
          savedEmails.push(existingEmail);
        } else {
          // 创建新邮件
          const newEmail = new Email(mappedEmail);
          await newEmail.save();
          savedEmails.push(newEmail);
        }
      } catch (error) {
        console.error(`Error saving email (${mappedEmail.messageId}):`, error);
      }
    }
    
    return savedEmails;
  }
}

module.exports = ImapService; 