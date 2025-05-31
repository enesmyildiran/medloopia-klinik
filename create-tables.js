// Medloopia tabloları oluşturma scripti
const { pool } = require('./database');

async function createTables() {
    try {
        console.log('📊 Tablolar oluşturuluyor...');

        // 1. Klinikler tablosu
        await pool.query(`
            CREATE TABLE IF NOT EXISTS clinics (
                id SERIAL PRIMARY KEY,
                klinik_adi VARCHAR(255) NOT NULL,
                adres TEXT,
                telefon VARCHAR(50),
                email VARCHAR(255),
                whatsapp_link VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ clinics tablosu oluşturuldu');

        // 2. Kullanıcılar tablosu
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255),
                role VARCHAR(50) NOT NULL,
                ad VARCHAR(100),
                soyad VARCHAR(100),
                clinic_id INTEGER REFERENCES clinics(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                active BOOLEAN DEFAULT true
            )
        `);
        console.log('✅ users tablosu oluşturuldu');

        // 3. Hastalar tablosu
        await pool.query(`
            CREATE TABLE IF NOT EXISTS patients (
                id SERIAL PRIMARY KEY,
                ad VARCHAR(100) NOT NULL,
                soyad VARCHAR(100),
                telefon VARCHAR(50),
                ulke VARCHAR(100),
                unique_link_id VARCHAR(255) UNIQUE NOT NULL,
                clinic_id INTEGER REFERENCES clinics(id),
                sales_user_id INTEGER REFERENCES users(id),
                status VARCHAR(50) DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_access TIMESTAMP
            )
        `);
        console.log('✅ patients tablosu oluşturuldu');

        // 4. Teklifler tablosu
        await pool.query(`
            CREATE TABLE IF NOT EXISTS offers (
                id SERIAL PRIMARY KEY,
                patient_id INTEGER REFERENCES patients(id),
                offer_title VARCHAR(255),
                total_price DECIMAL(10,2),
                currency VARCHAR(10) DEFAULT 'TL',
                status VARCHAR(50) DEFAULT 'draft',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ offers tablosu oluşturuldu');

        // 5. Tedaviler tablosu
        await pool.query(`
            CREATE TABLE IF NOT EXISTS treatments (
                id SERIAL PRIMARY KEY,
                offer_id INTEGER REFERENCES offers(id),
                treatment_name VARCHAR(255) NOT NULL,
                quantity INTEGER DEFAULT 1,
                unit_price DECIMAL(10,2),
                total_price DECIMAL(10,2),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ treatments tablosu oluşturuldu');

        // 6. Mesajlar tablosu
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                patient_id INTEGER REFERENCES patients(id),
                sender_type VARCHAR(50) NOT NULL,
                sender_name VARCHAR(100),
                message_text TEXT NOT NULL,
                is_read BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ messages tablosu oluşturuldu');

        console.log('🎉 Tüm tablolar başarıyla oluşturuldu!');
        
    } catch (error) {
        console.error('❌ Tablo oluşturma hatası:', error);
    } finally {
        await pool.end();
    }
}

createTables();