document.addEventListener('DOMContentLoaded', async () => {
  const offerForm = document.getElementById('offer-form');
  const ilSelect = document.getElementById('il');
  const ilceSelect = document.getElementById('ilce');
  const mahalleSelect = document.getElementById('mahalle');

  // Konum verilerini yükle
  try {
    const response = await fetch('/locations.json');
    if (!response.ok) {
      throw new Error('Konum verileri yüklenemedi');
    }
    const locations = await response.json();

    // İl seçeneklerini doldur
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
      if (il) {
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
      if (il && ilce) {
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
      } else {
        alert('Hata oluştu: ' + result.message);
      }
    } catch (error) {
      alert('Hata oluştu: ' + error.message);
    }
  });
});