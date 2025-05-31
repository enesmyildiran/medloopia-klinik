// Medloopia - Professional Dental Tourism Management System
// v2.0 - Enhanced with Professional Dental Chart & Derec API Integration Ready

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./database');
const crypto = require('crypto');
const Patient = require('./models/Patient');
const Offer = require('./models/Offer');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/treatments', require('./routes/treatments'));
app.use('/api/dental-chart', require('./routes/dentalChart'));

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Ana sayfa - Professional Satış Paneli
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Medloopia - Professional Dental Management</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(10px);
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding: 30px;
                    background: linear-gradient(45deg, #3498db, #2ecc71);
                    border-radius: 15px;
                    color: white;
                    box-shadow: 0 10px 30px rgba(52, 152, 219, 0.3);
                }
                .form-section {
                    background: #f8f9fa;
                    padding: 30px;
                    border-radius: 15px;
                    margin: 30px 0;
                    border-left: 5px solid #3498db;
                }
                .form-group {
                    margin: 20px 0;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: bold;
                    color: #2c3e50;
                }
                .form-group input, .form-group select {
                    width: 100%;
                    padding: 15px;
                    border: 2px solid #e0e0e0;
                    border-radius: 10px;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                }
                .form-group input:focus, .form-group select:focus {
                    border-color: #3498db;
                    box-shadow: 0 0 15px rgba(52, 152, 219, 0.3);
                    outline: none;
                }
                .btn {
                    background: linear-gradient(45deg, #27ae60, #2ecc71);
                    color: white;
                    padding: 18px 35px;
                    border: none;
                    border-radius: 10px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    width: 100%;
                    margin: 10px 0;
                }
                .btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 35px rgba(39, 174, 96, 0.4);
                }
                .btn-secondary {
                    background: linear-gradient(45deg, #3498db, #2980b9);
                }
                .btn-secondary:hover {
                    box-shadow: 0 12px 35px rgba(52, 152, 219, 0.4);
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin: 30px 0;
                }
                .stat-card {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    text-align: center;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease;
                }
                .stat-card:hover {
                    transform: translateY(-5px);
                }
                .stat-number {
                    font-size: 2.5em;
                    font-weight: bold;
                    color: #3498db;
                    margin-bottom: 10px;
                }
                .stat-label {
                    color: #7f8c8d;
                    font-weight: 500;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🦷 Medloopia</h1>
                    <h2>Professional Dental Tourism Management</h2>
                    <p>Gelişmiş Hasta ve Teklif Yönetim Sistemi</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number" id="totalPatients">0</div>
                        <div class="stat-label">Toplam Hasta</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="activeOffers">0</div>
                        <div class="stat-label">Aktif Teklif</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="completedTreatments">0</div>
                        <div class="stat-label">Tamamlanan</div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h2>🆕 Yeni Hasta Kaydı</h2>
                    <form action="/hasta-ekle" method="POST">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div class="form-group">
                                <label>Hasta Adı *</label>
                                <input type="text" name="ad" required placeholder="Hasta adını girin">
                            </div>
                            <div class="form-group">
                                <label>Hasta Soyadı</label>
                                <input type="text" name="soyad" placeholder="Hasta soyadını girin">
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div class="form-group">
                                <label>Telefon *</label>
                                <input type="text" name="telefon" required placeholder="+49-123-456789">
                            </div>
                            <div class="form-group">
                                <label>E-posta</label>
                                <input type="email" name="email" placeholder="hasta@email.com">
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div class="form-group">
                                <label>Ülke</label>
                                <select name="ulke">
                                    <option value="Almanya">🇩🇪 Almanya</option>
                                    <option value="İngiltere">🇬🇧 İngiltere</option>
                                    <option value="Fransa">🇫🇷 Fransa</option>
                                    <option value="Hollanda">🇳🇱 Hollanda</option>
                                    <option value="Belçika">🇧🇪 Belçika</option>
                                    <option value="İsviçre">🇨🇭 İsviçre</option>
                                    <option value="Avusturya">🇦🇹 Avusturya</option>
                                    <option value="İtalya">🇮🇹 İtalya</option>
                                    <option value="İspanya">🇪🇸 İspanya</option>
                                    <option value="Diğer">🌍 Diğer</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Dil Tercihi</label>
                                <select name="dil">
                                    <option value="tr">🇹🇷 Türkçe</option>
                                    <option value="en">🇬🇧 English</option>
                                    <option value="de">🇩🇪 Deutsch</option>
                                    <option value="fr">🇫🇷 Français</option>
                                    <option value="ar">🇸🇦 العربية</option>
                                </select>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn">
                            👤 Hasta Ekle ve Özel Link Oluştur
                        </button>
                    </form>
                </div>

                <div style="text-align: center; margin: 40px 0;">
                    <a href="/hasta-listesi" class="btn btn-secondary" style="text-decoration: none; display: inline-block; width: auto; padding: 18px 35px;">
                        📋 Hasta Listesi ve Teklif Yönetimi
                    </a>
                </div>
                
                <div style="background: #e8f5e8; padding: 25px; border-radius: 15px; margin: 30px 0;">
                    <h3>🚀 Yeni Özellikler</h3>
                    <ul style="color: #27ae60; font-weight: 500;">
                        <li>✨ Professional 3D Diş Haritası</li>
                        <li>📊 Gelişmiş Raporlama Sistemi</li>
                        <li>🔗 Derec API Entegrasyonu Hazır</li>
                        <li>📱 Mobil Uyumlu Tasarım</li>
                        <li>🎨 Premium Animasyonlar</li>
                    </ul>
                </div>
            </div>
            
            <script>
                // İstatistikleri yükle
                fetch('/api/stats')
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('totalPatients').textContent = data.totalPatients || 0;
                        document.getElementById('activeOffers').textContent = data.activeOffers || 0;
                        document.getElementById('completedTreatments').textContent = data.completedTreatments || 0;
                    })
                    .catch(err => console.log('Stats yüklenemedi'));
            </script>
        </body>
        </html>
    `);
});

// API: İstatistikler
app.get('/api/stats', async (req, res) => {
    try {
        const totalPatients = await Patient.countDocuments();
        const activeOffers = await Offer.countDocuments({ status: 'sent' });
        const completedTreatments = await Patient.countDocuments({ status: 'completed' });
        
        res.json({
            totalPatients,
            activeOffers,
            completedTreatments
        });
    } catch (error) {
        res.json({ totalPatients: 0, activeOffers: 0, completedTreatments: 0 });
    }
});

// Hasta ekleme - Enhanced
app.post('/hasta-ekle', async (req, res) => {
    try {
        const { ad, soyad, telefon, email, ulke, dil } = req.body;
        
        const linkId = crypto.randomBytes(16).toString('hex');
        
        const hasta = await Patient.create({
            firstName: ad,
            lastName: soyad,
            phone: telefon,
            email: email || null,
            country: ulke,
            language: dil || 'tr',
            uniqueLinkId: linkId,
            clinicId: 1,
            salesUserId: 1
        });
        
        const hastaLink = `http://localhost:${PORT}/hasta/${hasta.uniqueLinkId}`;
        
        res.send(`
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Hasta Başarıyla Eklendi - Medloopia</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
                    .container { max-width: 800px; margin: 50px auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
                    .success-header { text-align: center; color: #27ae60; margin-bottom: 30px; }
                    .patient-card { background: #e8f5e8; padding: 25px; border-radius: 15px; margin: 25px 0; border-left: 5px solid #27ae60; }
                    .link-card { background: #e3f2fd; padding: 25px; border-radius: 15px; margin: 25px 0; border-left: 5px solid #3498db; }
                    .link-text { background: white; padding: 15px; border-radius: 8px; word-break: break-all; font-family: monospace; border: 2px dashed #3498db; }
                    .btn { background: linear-gradient(45deg, #27ae60, #2ecc71); color: white; padding: 15px 30px; border: none; border-radius: 10px; text-decoration: none; display: inline-block; margin: 10px; font-weight: bold; transition: transform 0.3s ease; }
                    .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(39,174,96,0.4); }
                    .btn-secondary { background: linear-gradient(45deg, #3498db, #2980b9); }
                    .qr-section { text-align: center; margin: 30px 0; padding: 25px; background: #f8f9fa; border-radius: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="success-header">
                        <h1>✅ Hasta Başarıyla Eklendi!</h1>
                        <p>Özel hasta linki oluşturuldu ve kullanıma hazır</p>
                    </div>
                    
                    <div class="patient-card">
                        <h3>👤 Hasta Bilgileri</h3>
                        <p><strong>Ad Soyad:</strong> ${ad} ${soyad || ''}</p>
                        <p><strong>Telefon:</strong> ${telefon}</p>
                        <p><strong>E-posta:</strong> ${email || 'Belirtilmedi'}</p>
                        <p><strong>Ülke:</strong> ${ulke}</p>
                        <p><strong>Dil:</strong> ${dil || 'tr'}</p>
                    </div>
                    
                    <div class="link-card">
                        <h3>🔗 Özel Hasta Linki</h3>
                        <p>Bu linki WhatsApp, E-posta veya SMS ile hastaya gönderin:</p>
                        <div class="link-text">${hastaLink}</div>
                        <div style="text-align: center; margin: 20px 0;">
                            <button onclick="copyToClipboard('${hastaLink}')" class="btn">
                                📋 Linki Kopyala
                            </button>
                            <a href="https://wa.me/?text=Merhaba ${ad} ${soyad || 'Bey/Hanım'}, diş tedavi teklifiniz hazır: ${hastaLink}" target="_blank" class="btn" style="background: linear-gradient(45deg, #25D366, #128C7E);">
                                📱 WhatsApp ile Gönder
                            </a>
                        </div>
                    </div>
                    
                    <div class="qr-section">
                        <h3>📱 QR Kod ile Kolay Erişim</h3>
                        <div id="qrcode" style="margin: 20px 0;"></div>
                        <p style="color: #666; font-size: 14px;">Hastanıza QR kodu göstererek kolayca erişim sağlayabilir</p>
                    </div>
                    
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="/teklif-olustur/${hasta._id}" class="btn" style="font-size: 18px; padding: 20px 40px;">
                            💰 Şimdi Teklif Oluştur
                        </a>
                        <a href="/hasta-listesi" class="btn btn-secondary">
                            📋 Hasta Listesi
                        </a>
                        <a href="/" class="btn btn-secondary">
                            🏠 Ana Sayfa
                        </a>
                    </div>
                </div>
                
                <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
                <script>
                    // QR Kod oluştur
                    QRCode.toCanvas(document.getElementById('qrcode'), '${hastaLink}', function (error) {
                        if (error) console.error(error);
                    });
                    
                    function copyToClipboard(text) {
                        navigator.clipboard.writeText(text).then(function() {
                            alert('✅ Link kopyalandı! Hastaya gönderebilirsiniz.');
                        });
                    }
                </script>
            </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Hasta ekleme hatası:', error);
        res.status(500).send(`
            <div style="text-align: center; margin: 100px; font-family: Arial;">
                <h1 style="color: #e74c3c;">❌ Hata Oluştu</h1>
                <p>Hasta eklenirken bir sorun yaşandı: ${error.message}</p>
                <a href="/" style="background: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px;">Ana Sayfaya Dön</a>
            </div>
        `);
    }
});

// Professional Hasta Listesi
app.get('/hasta-listesi', async (req, res) => {
    try {
        const hastalar = await Patient.find()
            .populate({
                path: 'offers',
                select: 'totalPrice status createdAt'
            })
            .sort({ createdAt: -1 });

        let hastaListesiHTML = hastalar.map(hasta => {
            const tarih = new Date(hasta.createdAt).toLocaleDateString('tr-TR');
            const statusColor = hasta.status === 'new' ? '#ffc107' : 
                               hasta.status === 'offered' ? '#17a2b8' :
                               hasta.status === 'accepted' ? '#28a745' : '#6c757d';
            const statusText = hasta.status === 'new' ? '🆕 Yeni' : 
                              hasta.status === 'offered' ? '💰 Teklif Verildi' :
                              hasta.status === 'accepted' ? '✅ Kabul Edildi' : '📋 Beklemede';
            
            const sonTeklif = hasta.offers && hasta.offers.length > 0 ? hasta.offers[0] : null;
            
            return `
                <div class="patient-card">
                    <div class="patient-header">
                        <div class="patient-info">
                            <h3>${hasta.firstName} ${hasta.lastName || ''}</h3>
                            <div class="patient-details">
                                <span>📞 ${hasta.phone}</span>
                                <span>🌍 ${hasta.country}</span>
                                <span>📅 ${tarih}</span>
                                ${hasta.email ? `<span>📧 ${hasta.email}</span>` : ''}
                            </div>
                            <span class="status-badge" style="background: ${statusColor};">${statusText}</span>
                        </div>
                        <div class="patient-actions">
                            <a href="/teklif-olustur/${hasta._id}" class="btn btn-success">
                                💰 ${sonTeklif ? 'Teklifi Güncelle' : 'Teklif Oluştur'}
                            </a>
                            <a href="/hasta/${hasta.uniqueLinkId}" target="_blank" class="btn btn-primary">
                                👁️ Hasta Sayfası
                            </a>
                            ${sonTeklif ? `<div class="price-tag">💵 ${sonTeklif.totalPrice.toLocaleString()} TL</div>` : ''}
                        </div>
                    </div>
                    ${sonTeklif ? `
                        <div class="offer-summary">
                            <small>Son teklif: ${new Date(sonTeklif.createdAt).toLocaleDateString('tr-TR')} - ${sonTeklif.totalPrice.toLocaleString()} TL</small>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        res.send(`
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Hasta Listesi - Medloopia</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
                    .container { max-width: 1200px; margin: 0 auto; }
                    .header { background: rgba(255,255,255,0.95); border-radius: 20px; padding: 30px; margin-bottom: 30px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
                    .patient-card { background: white; border-radius: 15px; padding: 25px; margin: 20px 0; box-shadow: 0 8px 25px rgba(0,0,0,0.1); transition: transform 0.3s ease; }
                    .patient-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.15); }
                    .patient-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
                    .patient-info h3 { margin: 0 0 10px 0; color: #2c3e50; font-size: 1.4em; }
                    .patient-details { display: flex; flex-wrap: wrap; gap: 15px; margin: 10px 0; }
                    .patient-details span { background: #f8f9fa; padding: 5px 12px; border-radius: 20px; font-size: 0.9em; color: #495057; }
                    .status-badge { color: white; padding: 6px 15px; border-radius: 20px; font-size: 0.85em; font-weight: bold; }
                    .patient-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
                    .btn { padding: 10px 20px; border: none; border-radius: 8px; text-decoration: none; font-weight: bold; transition: all 0.3s ease; display: inline-block; }
                    .btn:hover { transform: translateY(-2px); }
                    .btn-success { background: linear-gradient(45deg, #28a745, #20c997); color: white; }
                    .btn-primary { background: linear-gradient(45deg, #007bff, #6610f2); color: white; }
                    .btn-secondary { background: linear-gradient(45deg, #6c757d, #495057); color: white; }
                    .price-tag { background: linear-gradient(45deg, #ffc107, #fd7e14); color: white; padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 0.9em; }
                    .offer-summary { margin-top: 15px; padding-top: 15px; border-top: 1px solid #e9ecef; color: #6c757d; }
                    .search-bar { margin: 20px 0; }
                    .search-bar input { width: 100%; padding: 15px; border: 2px solid #e9ecef; border-radius: 10px; font-size: 16px; }
                    @media (max-width: 768px) {
                        .patient-header { flex-direction: column; align-items: flex-start; }
                        .patient-actions { width: 100%; justify-content: space-between; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📋 Professional Hasta Yönetimi</h1>
                        <p>Toplam ${hastalar.length} hasta kayıtlı</p>
                        <div style="margin: 20px 0;">
                            <a href="/" class="btn btn-secondary">🏠 Ana Sayfa</a>
                        </div>
                    </div>
                    
                    <div class="search-bar">
                        <input type="text" id="searchInput" placeholder="🔍 Hasta ara (ad, telefon, ülke...)">
                    </div>
                    
                    <div id="patientList">
                        ${hastalar.length > 0 ? hastaListesiHTML : `
                            <div style="text-align: center; padding: 60px; background: white; border-radius: 15px;">
                                <h3>👥 Henüz hasta kaydı yok</h3>
                                <p>İlk hastanızı eklemek için ana sayfaya dönün</p>
                                <a href="/" class="btn btn-success">➕ Yeni Hasta Ekle</a>
                            </div>
                        `}
                    </div>
                </div>
                
                <script>
                    // Search functionality
                    document.getElementById('searchInput').addEventListener('input', function(e) {
                        const searchTerm = e.target.value.toLowerCase();
                        const patientCards = document.querySelectorAll('.patient-card');
                        
                        patientCards.forEach(card => {
                            const text = card.textContent.toLowerCase();
                            card.style.display = text.includes(searchTerm) ? 'block' : 'none';
                        });
                    });
                </script>
            </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Hasta listesi hatası:', error);
        res.status(500).send('Hata oluştu: ' + error.message);
    }
});

// Basit Diş Haritası - Teklif Oluşturma Sayfası
app.get('/teklif-olustur/:hastaId', async (req, res) => {
    try {
        const hasta = await Patient.findById(req.params.hastaId);
        
        if (!hasta) {
            return res.status(404).send('Hasta bulunamadı');
        }
        
        res.send(`
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Teklif Oluştur - Medloopia</title>
                <style>
                    body {
                        font-family: 'Segoe UI', sans-serif;
                        margin: 0; padding: 20px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                    }
                    .container {
                        max-width: 1200px; margin: 0 auto;
                        background: rgba(255, 255, 255, 0.95);
                        border-radius: 20px; padding: 40px;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    }
                    .header {
                        text-align: center; margin-bottom: 30px; padding: 25px;
                        background: linear-gradient(45deg, #3498db, #2ecc71);
                        border-radius: 15px; color: white;
                    }
                    .patient-info {
                        background: #e8f5e8; padding: 20px; border-radius: 15px;
                        margin: 20px 0; border-left: 5px solid #28a745;
                    }
                    .treatment-form {
                        background: #f8f9fa; padding: 30px; border-radius: 15px;
                        margin: 20px 0;
                    }
                    .form-group { margin: 20px 0; }
                    .form-group label {
                        display: block; margin-bottom: 8px;
                        font-weight: bold; color: #2c3e50;
                    }
                    .form-group input, .form-group select, .form-group textarea {
                        width: 100%; padding: 12px; border: 2px solid #e0e0e0;
                        border-radius: 8px; font-size: 14px; box-sizing: border-box;
                    }
                    .btn {
                        padding: 12px 25px; border: none; border-radius: 8px;
                        font-weight: bold; cursor: pointer; margin: 5px;
                        transition: all 0.3s ease;
                    }
                    .btn-success { background: #28a745; color: white; }
                    .btn-danger { background: #dc3545; color: white; }
                    .btn-primary { background: #007bff; color: white; }
                    .btn-secondary { background: #6c757d; color: white; }
                    .btn:hover { transform: translateY(-2px); }
                    .treatment-list {
                        background: #f8f9fa; padding: 20px; border-radius: 15px;
                        margin: 20px 0; min-height: 80px;
                    }
                    .treatment-item {
                        background: white; padding: 15px; margin: 10px 0;
                        border-radius: 8px; border: 1px solid #e0e0e0;
                    }
                    .total-price {
                        background: #2c3e50; color: white; padding: 20px;
                        border-radius: 10px; text-align: center; font-size: 18px;
                        font-weight: bold; margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>💰 Teklif Oluştur</h1>
                        <p>Hasta için detaylı tedavi teklifi hazırlayın</p>
                    </div>
                    
                    <div class="patient-info">
                        <h3>👤 ${hasta.firstName} ${hasta.lastName || ''}</h3>
                        <p>📞 ${hasta.phone} | 🌍 ${hasta.country}</p>
                    </div>
                    
                    <div class="treatment-form">
                        <h3>🦷 Tedavi Ekle</h3>
                        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 15px; align-items: end;">
                            <div class="form-group">
                                <label>Tedavi Türü:</label>
                                <select id="tedaviTuru">
                                    <option value="">Tedavi Seçin</option>
                                    <option value="Dolgu" data-price="800">💎 Beyaz Dolgu - 800 TL</option>
                                    <option value="Kanal Tedavisi" data-price="2500">🔴 Kanal Tedavisi - 2.500 TL</option>
                                    <option value="Kaplama" data-price="3500">👑 Zirkon Kaplama - 3.500 TL</option>
                                    <option value="İmplant" data-price="12000">🔩 İmplant - 12.000 TL</option>
                                    <option value="Çekim" data-price="300">❌ Diş Çekimi - 300 TL</option>
                                    <option value="Temizlik" data-price="400">✨ Diş Temizliği - 400 TL</option>
                                    <option value="Veneer" data-price="4000">⭐ Laminate Veneer - 4.000 TL</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Fiyat (TL):</label>
                                <input type="number" id="tedaviFiyat" placeholder="0">
                            </div>
                            <div class="form-group">
                                <label>Adet:</label>
                                <input type="number" id="tedaviAdet" value="1" min="1">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Diş Numaraları (opsiyonel):</label>
                            <input type="text" id="disNumaralari" placeholder="Örn: 11, 21, 22">
                        </div>
                        
                        <div class="form-group">
                            <label>Açıklama:</label>
                            <textarea id="tedaviAciklama" rows="2" placeholder="Tedavi detayları..."></textarea>
                        </div>
                        
                        <button onclick="addTedavi()" class="btn btn-success">
                            ➕ Tedavi Ekle
                        </button>
                    </div>
                    
                    <div class="treatment-list">
                        <h3>📋 Seçilen Tedaviler</h3>
                        <div id="tedaviListesi">
                            <p style="color: #666; text-align: center;">Henüz tedavi eklenmedi</p>
                        </div>
                        <div id="toplamFiyat" class="total-price">
                            Toplam: 0 TL
                        </div>
                    </div>
                    
                    <form action="/teklif-kaydet" method="POST" style="text-align: center; margin: 30px 0;">
                        <input type="hidden" name="patientId" value="${hasta._id}">
                        <input type="hidden" id="tedaviVerileri" name="tedaviVerileri" value="">
                        
                        <div style="max-width: 600px; margin: 0 auto;">
                            <div class="form-group">
                                <label>Teklif Başlığı:</label>
                                <input type="text" name="offerTitle" value="${hasta.firstName} ${hasta.lastName} - Diş Tedavi Teklifi">
                            </div>
                            
                            <div class="form-group">
                                <label>Genel Notlar:</label>
                                <textarea name="notes" rows="3" placeholder="Tedavi planı hakkında genel bilgiler..."></textarea>
                            </div>
                        </div>
                        
                        <button type="submit" onclick="prepareTedaviData()" class="btn btn-primary" style="padding: 15px 30px; font-size: 16px;">
                            💾 Teklifi Kaydet
                        </button>
                        <a href="/hasta-listesi" class="btn btn-secondary" style="padding: 15px 30px; text-decoration: none; display: inline-block;">
                            ← Hasta Listesi
                        </a>
                    </form>
                </div>
                
                <script>
                let tedaviVerileri = [];
                let toplamFiyat = 0;
                
                function addTedavi() {
                    const tedavi = document.getElementById('tedaviTuru').value;
                    const fiyat = parseFloat(document.getElementById('tedaviFiyat').value) || 0;
                    const adet = parseInt(document.getElementById('tedaviAdet').value) || 1;
                    const disNumaralari = document.getElementById('disNumaralari').value;
                    const aciklama = document.getElementById('tedaviAciklama').value;
                    
                    if (!tedavi || fiyat <= 0) {
                        alert('⚠️ Lütfen tedavi türü ve geçerli bir fiyat girin!');
                        return;
                    }
                    
                    const yeniTedavi = {
                        treatmentName: tedavi,
                        unitPrice: fiyat,
                        quantity: adet,
                        totalPrice: fiyat * adet,
                        toothNumbers: disNumaralari,
                        description: aciklama
                    };
                    
                    tedaviVerileri.push(yeniTedavi);
                    updateTedaviListesi();
                    clearForm();
                }
                
                function removeTedavi(index) {
                    tedaviVerileri.splice(index, 1);
                    updateTedaviListesi();
                }
                
                function updateTedaviListesi() {
                    const listElement = document.getElementById('tedaviListesi');
                    const toplamElement = document.getElementById('toplamFiyat');
                    
                    if (tedaviVerileri.length === 0) {
                        listElement.innerHTML = '<p style="color: #666; text-align: center;">Henüz tedavi eklenmedi</p>';
                        toplamFiyat = 0;
                    } else {
                        let html = '';
                        toplamFiyat = 0;
                        
                        tedaviVerileri.forEach((tedavi, index) => {
                            toplamFiyat += tedavi.totalPrice;
                            html += '<div class="treatment-item">' +
                                '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                                    '<div>' +
                                        '<strong>' + getTedaviIcon(tedavi.treatmentName) + ' ' + tedavi.treatmentName + '</strong>' +
                                        '<div style="color: #666; font-size: 14px;">Adet: ' + tedavi.quantity + ' | Birim: ' + tedavi.unitPrice.toLocaleString() + ' TL</div>' +
                                        (tedavi.toothNumbers ? '<div style="color: #666; font-size: 12px;">Dişler: ' + tedavi.toothNumbers + '</div>' : '') +
                                        (tedavi.description ? '<div style="color: #666; font-size: 12px;">' + tedavi.description + '</div>' : '') +
                                        '<div style="color: #27ae60; font-weight: bold;">Toplam: ' + tedavi.totalPrice.toLocaleString() + ' TL</div>' +
                                    '</div>' +
                                    '<button onclick="removeTedavi(' + index + ')" class="btn btn-danger" style="padding: 8px 12px;">🗑️</button>' +
                                '</div>' +
                            '</div>';
                        });
                        
                        listElement.innerHTML = html;
                    }
                    
                    toplamElement.innerHTML = 'Toplam: ' + toplamFiyat.toLocaleString() + ' TL';
                }
                
                function getTedaviIcon(tedavi) {
                    const icons = {
                        'Dolgu': '💎', 'Kanal Tedavisi': '🔴', 'Kaplama': '👑',
                        'İmplant': '🔩', 'Çekim': '❌', 'Temizlik': '✨', 'Veneer': '⭐'
                    };
                    return icons[tedavi] || '🦷';
                }
                
                function clearForm() {
                    document.getElementById('tedaviTuru').value = '';
                    document.getElementById('tedaviFiyat').value = '';
                    document.getElementById('tedaviAdet').value = '1';
                    document.getElementById('disNumaralari').value = '';
                    document.getElementById('tedaviAciklama').value = '';
                }
                
                function prepareTedaviData() {
                    document.getElementById('tedaviVerileri').value = JSON.stringify(tedaviVerileri);
                }
                
                // Auto-fill price when treatment changes
                document.getElementById('tedaviTuru').addEventListener('change', function() {
                    const selectedOption = this.options[this.selectedIndex];
                    const price = selectedOption.getAttribute('data-price');
                    if (price) {
                        document.getElementById('tedaviFiyat').value = price;
                    }
                });
                </script>
            </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Teklif oluşturma hatası:', error);
        res.status(500).send('Hata oluştu: ' + error.message);
    }
});

// Teklif kaydetme
app.post('/teklif-kaydet', async (req, res) => {
    try {
        const { patientId, offerTitle, notes, tedaviVerileri } = req.body;
        
        const treatments = JSON.parse(tedaviVerileri || '[]');
        
        if (treatments.length === 0) {
            return res.status(400).send('Hiç tedavi seçilmedi!');
        }
        
        let totalPrice = 0;
        treatments.forEach(treatment => {
            totalPrice += treatment.totalPrice;
        });
        
        // Mevcut teklifi kontrol et
        const existingOffer = await Offer.findOne({ patientId });
        
        let offer;
        
        if (existingOffer) {
            // Mevcut teklifi güncelle
            existingOffer.offerTitle = offerTitle;
            existingOffer.totalPrice = totalPrice;
            existingOffer.notes = notes;
            existingOffer.status = 'sent';
            existingOffer.treatments = treatments;
            existingOffer.updatedAt = new Date();
            
            offer = await existingOffer.save();
        } else {
            // Yeni teklif oluştur
            offer = await Offer.create({
                patientId,
                offerTitle,
                totalPrice,
                notes,
                status: 'sent',
                treatments
            });
        }
        
        // Hasta durumunu güncelle
        await Patient.findByIdAndUpdate(patientId, { 
            status: 'offered',
            updatedAt: new Date()
        });
        
        res.send(`
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <title>Teklif Kaydedildi - Medloopia</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
                    .container { max-width: 600px; margin: 50px auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; }
                    .success-icon { font-size: 60px; margin-bottom: 20px; }
                    .btn { background: linear-gradient(45deg, #27ae60, #2ecc71); color: white; padding: 15px 30px; border: none; border-radius: 10px; text-decoration: none; display: inline-block; margin: 10px; font-weight: bold; }
                    .btn-secondary { background: linear-gradient(45deg, #3498db, #2980b9); }
                    .summary { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="success-icon">✅</div>
                    <h1 style="color: #27ae60;">Teklif Başarıyla Kaydedildi!</h1>
                    
                    <div class="summary">
                        <h3>📊 Teklif Özeti</h3>
                        <p><strong>Tedavi Sayısı:</strong> ${treatments.length}</p>
                        <p><strong>Toplam Tutar:</strong> ${totalPrice.toLocaleString()} TL</p>
                    </div>
                    
                    <p>Hasta artık kendi linkinde detaylı teklifi görebilir! 🦷</p>
                    
                    <div style="margin: 30px 0;">
                        <a href="/hasta-listesi" class="btn">📋 Hasta Listesi</a>
                        <a href="/" class="btn btn-secondary">🏠 Ana Sayfa</a>
                    </div>
                </div>
            </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Teklif kaydetme hatası:', error);
        res.status(500).send('Hata oluştu: ' + error.message);
    }
});

// Enhanced Patient Page with Quote Display
app.get('/hasta/:linkId', async (req, res) => {
    try {
        const hasta = await Patient.findOne({ uniqueLinkId: req.params.linkId });
        
        if (!hasta) {
            return res.status(404).send(`
                <!DOCTYPE html>
                <html><head><meta charset="UTF-8"><title>Hasta Bulunamadı</title></head>
                <body style="font-family: Arial; text-align: center; margin: 100px auto; max-width: 600px;">
                    <h1 style="color: #e74c3c;">❌ Hasta Bulunamadı</h1>
                    <p>Bu link geçersiz veya süresi dolmuş olabilir.</p>
                </body></html>
            `);
        }
        
        // Hasta için teklif var mı kontrol et
        const teklifler = await Offer.find({ patientId: hasta._id, status: { $ne: 'draft' } })
            .sort({ createdAt: -1 });
        
        const mevcutTeklif = teklifler[0];
        
        // Son erişim zamanını güncelle
        hasta.lastAccess = new Date();
        await hasta.save();
        
        if (mevcutTeklif) {
            // Teklif sayfasını göster
            let tedaviListesi = '';
            let toplamFiyat = 0;
            
            teklifler.forEach(tedavi => {
                if (tedavi.treatment_name) {
                    toplamFiyat += parseFloat(tedavi.total_price || 0);
                    tedaviListesi += `
                        <div style="border: 1px solid #ddd; padding: 20px; margin: 15px 0; border-radius: 10px; background: #f9f9f9;">
                            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">${getTreatmentIcon(tedavi.treatment_name)} ${tedavi.treatment_name}</h4>
                            ${tedavi.tooth_numbers ? `<p><strong>Dişler:</strong> ${tedavi.tooth_numbers}</p>` : ''}
                            <p><strong>Adet:</strong> ${tedavi.quantity || 1}</p>
                            <p><strong>Birim Fiyat:</strong> ${parseFloat(tedavi.unit_price || 0).toLocaleString()} TL</p>
                            <p><strong>Toplam:</strong> ${parseFloat(tedavi.total_price || 0).toLocaleString()} TL</p>
                            ${tedavi.description ? `<p><strong>Açıklama:</strong> ${tedavi.description}</p>` : ''}
                        </div>
                    `;
                }
            });
            
            res.send(`
                <!DOCTYPE html>
                <html lang="${hasta.dil || 'tr'}">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Diş Tedavi Teklifi - Medloopia</title>
                    <style>
                        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
                        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
                        .header { text-align: center; background: linear-gradient(45deg, #3498db, #2ecc71); color: white; padding: 30px; border-radius: 15px; margin-bottom: 30px; }
                        .patient-info { background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0; }
                        .quote-section { background: #f8f9fa; padding: 25px; border-radius: 15px; margin: 25px 0; }
                        .total-section { background: #2c3e50; color: white; padding: 25px; border-radius: 15px; text-align: center; margin: 25px 0; }
                        .total-amount { font-size: 2em; font-weight: bold; margin: 10px 0; }
                        .action-buttons { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 30px 0; }
                        .btn { padding: 15px 20px; border: none; border-radius: 10px; font-weight: bold; text-decoration: none; text-align: center; transition: transform 0.3s ease; }
                        .btn:hover { transform: translateY(-2px); }
                        .btn-whatsapp { background: #25D366; color: white; }
                        .btn-pdf { background: #e74c3c; color: white; }
                        .notes-section { background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🦷 Medloopia Diş Kliniği</h1>
                            <h2>${mevcutTeklif.offer_title || 'Diş Tedavi Teklifi'}</h2>
                        </div>
                        
                        <div class="patient-info">
                            <h3>👤 Hoş Geldiniz ${hasta.firstName} ${hasta.lastName || ''}!</h3>
                            <p><strong>Telefon:</strong> ${hasta.phone}</p>
                            <p><strong>Ülke:</strong> ${hasta.country}</p>
                        </div>
                        
                        <div class="quote-section">
                            <h3>🦷 Tedavi Planınız</h3>
                            <p><strong>Oluşturulma Tarihi:</strong> ${new Date(mevcutTeklif.createdAt).toLocaleDateString('tr-TR')}</p>
                            ${tedaviListesi}
                        </div>
                        
                        <div class="total-section">
                            <h3>💰 Toplam Maliyet</h3>
                            <div class="total-amount">${toplamFiyat.toLocaleString()} TL</div>
                            <p>Tüm tedaviler dahil</p>
                        </div>
                        
                        ${mevcutTeklif.notes ? `
                            <div class="notes-section">
                                <h4>📝 Özel Notlar</h4>
                                <p>${mevcutTeklif.notes}</p>
                            </div>
                        ` : ''}
                        
                        <div class="action-buttons">
                            <a href="https://wa.me/905321234567" target="_blank" class="btn btn-whatsapp">
                                📱 WhatsApp ile İletişim
                            </a>
                            <button onclick="window.print()" class="btn btn-pdf">
                                🖨️ PDF Olarak Kaydet
                            </button>
                        </div>
                        
                        <div style="text-align: center; margin-top: 40px; color: #666;">
                            <p>🏥 <strong>Medloopia Dental Clinic</strong></p>
                            <p>📍 Antalya, Turkey | 📞 +90 532 123 4567</p>
                        </div>
                    </div>
                </body>
                </html>
            `);
        } else {
            // Bekleme sayfası
            res.send(`
                <!DOCTYPE html>
                <html lang="${hasta.dil || 'tr'}">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Teklifiniz Hazırlanıyor - Medloopia</title>
                    <style>
                        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
                        .container { max-width: 600px; margin: 50px auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; }
                        .loading { font-size: 50px; margin: 30px 0; animation: pulse 2s infinite; }
                        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
                        .patient-info { background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: left; }
                        .btn { background: #25D366; color: white; padding: 15px 25px; border: none; border-radius: 10px; text-decoration: none; display: inline-block; margin: 15px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🦷 Medloopia Diş Kliniği</h1>
                        <h2>Hoş Geldiniz ${hasta.firstName} ${hasta.lastName || ''}!</h2>
                        
                        <div class="patient-info">
                            <h3>📋 Bilgileriniz</h3>
                            <p><strong>Telefon:</strong> ${hasta.phone}</p>
                            <p><strong>Ülke:</strong> ${hasta.country}</p>
                        </div>
                        
                        <div class="loading">⏳</div>
                        <h3>Teklifiniz Hazırlanıyor</h3>
                        <p>Diş tedavi teklifiniz uzman doktorlarımız tarafından hazırlanmaktadır. Kısa süre içinde detaylı teklifinizi bu sayfada görebileceksiniz.</p>
                        <p><strong>Bu sayfayı favorilerinize ekleyebilirsiniz.</strong></p>
                        
                        <a href="https://wa.me/905321234567" target="_blank" class="btn">
                            📱 WhatsApp ile İletişim
                        </a>
                    </div>
                </body>
                </html>
            `);
        }
        
    } catch (error) {
        console.error('Hasta sayfası hatası:', error);
        res.status(500).send('Hata oluştu: ' + error.message);
    }
});

// Utility Functions
function getTreatmentIcon(treatmentName) {
    const icons = {
        'Dolgu': '💎', 'Kanal Tedavisi': '🔴', 'Kaplama': '👑',
        'İmplant': '🔩', 'Çekim': '❌', 'Temizlik': '✨', 'Veneer': '⭐'
    };
    return icons[treatmentName] || '🦷';
}

// Test endpoint
app.get('/test', (req, res) => {
    res.send('✅ Medloopia Professional System Running!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});