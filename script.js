document.addEventListener('DOMContentLoaded', async () => {
  const offerForm = document.getElementById('offer-form');
  const ilSelect = document.getElementById('il');
  const ilceSelect = document.getElementById('ilce');
  const mahalleSelect = document.getElementById('mahalle');
  const offersList = document.getElementById('offers-list');

  // Mevcut teklifleri yükle
  const loadOffers = async () => {
    try {
      const response = await fetch('/api/get-offers');
      if (!response.ok) {
        throw new Error(`Teklifler alınamadı: ${response.status} ${response.statusText}`);
      }
      const offers = await response.json();

      // Teklifleri görüntüle
      offersList.innerHTML = '';
      if (offers.length === 0) {
        offersList.innerHTML = '<p>Henüz teklif yok.</p>';
        return;
      }

      offers.forEach(offer => {
        const offerDiv = document.createElement('div');
        offerDiv.classList.add('offer');
        offerDiv.innerHTML = `
          <p><strong>Yemek:</strong> ${offer.food}</p>
          <p><strong>Fiyat:</strong> ${offer.price} TL</p>
          <p><strong>Konum:</strong> ${offer.il}, ${offer.ilce}, ${offer.mahalle}</p>
          <p><strong>Teslimat Zamanı:</strong> ${new Date(offer.deliveryTime).toLocaleString()}</p>
          <p><strong>Alerji:</strong> ${offer.allergy || 'Yok'}</p>
          <p><strong>Teklif Süresi:</strong> ${offer.offerDuration} saat</p>
          <p><strong>Kullanıcı:</strong> ${offer.userEmail}</p>
          <hr>
        `;
        offersList.appendChild(offerDiv);
      });
    } catch (error) {
      console.error('Hata:', error);
      offersList.innerHTML = '<p>Teklifler yüklenirken bir hata oluştu: ' + error.message + '</p>';
    }
  };

  // Sayfa yüklendiğinde teklifleri yükle
  await loadOffers();

  // Konum verilerini yükle
  try {
    const response = await fetch('/locations.json');
    if (!response.ok) {
      throw new Error(`Konum verileri yüklenemedi: ${response.status} ${response.statusText}`);
    }
    const locations = await response.json();

    // İl seçeneklerini doldur
    ilSelect.innerHTML = '<option value="">İl Seçin</option>';
    Object.keys(locations).forEach(il => {
      const option = document.createElement('option');
      option.value = il;
      option.textContent = il;
      ilSelect.appendChild(option);
    });

    // İl seçildiğinde ilçeleri güncelle
    ilSelect.addEventListener('change', () => {
      const il = ilSelect.value;
      ilceSelect.innerHTML = '<option value="">İlçe Seçin</option>';
      mahalleSelect.innerHTML = '<option value="">Mahalle Seçin</option>';
      if (il && locations[il]) {
        Object.keys(locations[il]).forEach(ilce => {
          const option = document.createElement('option');
          option.value = ilce;
          option.textContent = ilce;
          ilceSelect.appendChild(option);
        });
      }
    });

    // İlçe seçildiğinde mahalleleri güncelle
    ilceSelect.addEventListener('change', () => {
      const il = ilSelect.value;
      const ilce = ilceSelect.value;
      mahalleSelect.innerHTML = '<option value="">Mahalle Seçin</option>';
      if (il && ilce && locations[il][ilce]) {
        locations[il][ilce].forEach(mahalle => {
          const option = document.createElement('option');
          option.value = mahalle;
          option.textContent = mahalle;
          mahalleSelect.appendChild(option);
        });
      }
    });
  } catch (error) {
    console.error('Hata:', error);
    alert('Konum verileri yüklenirken bir hata oluştu: ' + error.message);
  }

  // Teklif formu gönderimi
  offerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      food: document.getElementById('food').value,
      price: document.getElementById('price').value,
      il: document.getElementById('il').value,
      ilce: document.getElementById('ilce').value,
      mahalle: document.getElementById('mahalle').value,
      deliveryTime: document.getElementById('deliveryTime').value,
      allergy: document.getElementById('allergy').value,
      offerDuration: document.getElementById('offerDuration').value,
      userEmail: 'test@example.com', // Kimlik doğrulama olmadığı için geçici bir e-posta
    };

    try {
      const response = await fetch('/api/save-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Teklif başarıyla oluşturuldu! ID: ' + result.offerId);
        offerForm.reset();
        // Teklif oluşturulduktan sonra listeyi güncelle
        await loadOffers();
      } else {
        alert('Hata oluştu: ' + result.message);
      }
    } catch (error) {
      alert('Hata oluştu: ' + error.message);
    }
  });
});