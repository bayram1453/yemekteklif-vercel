const fs = require('fs').promises;
const path = require('path');

exports.handler = async () => {
  try {
    const offersFilePath = path.join(__dirname, '../offers.json');
    let offers = [];

    // offers.json dosyasını oku
    try {
      const data = await fs.readFile(offersFilePath, 'utf8');
      offers = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Dosya yoksa boş bir dizi döndür
        offers = [];
      } else {
        throw error;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(offers),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Teklifler alınırken bir hata oluştu: ' + error.message }),
    };
  }
};