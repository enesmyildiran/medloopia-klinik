// Eksik sütunları ekleme
const { pool } = require('./database');

async function fixDatabase() {
    try {
        console.log('🔧 Veritabanı düzeltiliyor...');
        
        // treatments tablosuna tooth_numbers sütunu ekle
        await pool.query(`
            ALTER TABLE treatments 
            ADD COLUMN IF NOT EXISTS tooth_numbers VARCHAR(255)
        `);
        console.log('✅ tooth_numbers sütunu eklendi');
        
        // offers tablosuna valid_until sütunu da ekleyelim (ileride gerekli olabilir)
        await pool.query(`
            ALTER TABLE offers 
            ADD COLUMN IF NOT EXISTS valid_until DATE
        `);
        console.log('✅ valid_until sütunu eklendi');
        
        console.log('🎉 Veritabanı güncellendi!');
        
    } catch (error) {
        console.error('❌ Düzeltme hatası:', error);
    } finally {
        await pool.end();
    }
}

fixDatabase();