const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const Discord = require("discord.js")
const client = new Client({
  intents: INTENTS,
  allowedMentions: {
    parse: ["users"]
  },
  partials: PARTIALS,
  retryLimit: 32
});

const kufurKelimeleri = ['küfür1', 'küfür2', 'am']; // Küfür içeren kelimeler
const reklamKelimeleri = ['reklam1', 'reklam2', 'reklam3']; // Reklam içeren kelimeler
const userBanLimits = new Map(); // Kullanıcılara özel ban limiti bilgilerini saklamak için bir harita (map) kullanıyoruz.

client.on('ready', () => {
  console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
});

client.on('messageCreate', message => {
  // Küfür kontrolü
  if (kufurKelimeleri.some(kufur => message.content.toLowerCase().includes(kufur))) {
    message.delete();
    message.reply('Küfür etmek yasak!').then(msg => msg.delete({ timeout: 3000 }));
  }

  // Reklam kontrolü
  if (reklamKelimeleri.some(reklam => message.content.toLowerCase().includes(reklam))) {
    message.delete();
    message.reply('Reklam yapmak yasak!').then(msg => msg.delete({ timeout: 3000 }));
  }

  // Diğer işlemler buraya eklenebilir

  // Prefix kontrolü
  const prefix = '/';
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Komutları ayır
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Kullanıcıya özel ban limiti ayarlama komutu
  if (command === 'banlimit-ayarla') {
    const newBanLimit = parseInt(args[0], 10);

    if (isNaN(newBanLimit) || newBanLimit <= 0) {
      message.reply('Geçerli bir ban limiti belirtmelisiniz.');
      return;
    }

    // Kullanıcının belirlediği yeni ban limitini sakla
    userBanLimits.set(message.author.id, newBanLimit);

    message.reply(`Ban limitiniz başarıyla ${newBanLimit} olarak ayarlandı.`);
  }

  // Kullanıcıyı atma (kick) komutu
  if (command === 'kick') {
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.members.cache.get(user.id);
      if (member) {
        member.kick('Kick komutu kullanıldı').then(() => {
          message.reply(`${user.tag} başarıyla atıldı.`);
        }).catch(err => {
          message.reply('Kullanıcıyı atarken bir hata oluştu.');
          console.error(err);
        });
      } else {
        message.reply('Bu kullanıcı bu sunucuda bulunmuyor.');
      }
    } else {
      message.reply('Lütfen atılacak kullanıcıyı etiketleyin.');
    }
  }

  // Diğer komutlar buraya eklenebilir
});

client.login('MTE3NjIzNTEzNDI0NTE0MjYyMA.GJTI0B.1Oiw5i-pLU_CtbvMYhAzgjqAlMUgNmI6VKBUbA');