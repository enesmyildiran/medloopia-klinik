// Test verisi ekleme
const { pool } = require('./database');

async function addTestData() {
    try {
        // Test kliniği ekle
        await pool.query(`
            INSERT INTO clinics (klinik_adi, adres, telefon, email)
            VALUES ('Medloopia Test Kliniği', 'Antalya', '0532-123-4567', 'info@medloopia.com')
            ON CONFLICT DO NOTHING
        `);
        
        console.log('✅ Test kliniği eklendi');
        
    } catch (error) {
        console.error('Hata:', error);
    } finally {
        await pool.end();
    }
}

addTestData();