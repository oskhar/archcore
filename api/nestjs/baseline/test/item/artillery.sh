#!/bin/bash

# Konfigurasi
REPORT_FILE="report.json"
CONFIG_FILE="art-config.yml"
PY_SCRIPT="../visualizer.py"

echo "🚀 Menyiapkan Artillery (Native System)..."

# 1. Cek apakah Artillery terinstall di sistem
if ! command -v artillery &> /dev/null
then
    echo "❌ Error: Command 'artillery' tidak ditemukan."
    echo "👉 Silakan install menggunakan: npm install -g artillery@latest"
    exit 1
fi

# Tampilkan versi Artillery yang digunakan
echo "ℹ️  Menggunakan Artillery versi:"
artillery -V

# 2. Cek Python (Arch Linux menggunakan 'python' sebagai Python 3 secara default)
if ! command -v python &> /dev/null
then
    echo "❌ Error: Python tidak ditemukan."
    exit 1
fi

# 3. Hapus report lama jika ada
if [ -f "$REPORT_FILE" ]; then
    rm "$REPORT_FILE"
fi

# 4. Jalankan Artillery
echo "🔥 Mulai Stress Test..."
# Menjalankan artillery native
artillery run --output $REPORT_FILE $CONFIG_FILE

# 5. Visualisasi dengan Python
if [ -f "$REPORT_FILE" ]; then
    echo "✅ Test Selesai! Data tersimpan di $REPORT_FILE"
    
    if [ -f "$PY_SCRIPT" ]; then
        echo "📊 Membuat Visualisasi Grafik..."
        # Menggunakan 'python' karena di Arch Linux python merujuk ke python3
        python $PY_SCRIPT $REPORT_FILE
    else
        echo "⚠️  File $PY_SCRIPT tidak ditemukan. Silakan buat file python tersebut terlebih dahulu."
    fi
else
    echo "❌ Gagal menghasilkan report JSON. Cek log error di atas."
fi
