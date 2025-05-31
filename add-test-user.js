// Test kullanıcısı ekleme
const { pool } = require('./database');

async function addTestUser() {
    try {
        // Test kullanıcısı ekle
        await pool.query(`
            INSERT INTO users (email, role, ad, soyad, clinic_id)
            VALUES ('satici@medloopia.com', 'sales', 'Test', 'Satıcı', 1)
            ON CONFLICT (email) DO NOTHING
        `);
        
        console.log('✅ Test satış kullanıcısı eklendi');
        
    } catch (error) {
        console.error('Hata:', error);
    } finally {
        await pool.end();
    }
}

addTestUser();