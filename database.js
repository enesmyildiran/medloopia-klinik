const mongoose = require('mongoose');

// MongoDB bağlantı fonksiyonu
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/medloopia', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB bağlantısı başarılı: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB bağlantı hatası:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;