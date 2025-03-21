document.addEventListener('DOMContentLoaded', async () => {
    const netlifyIdentity = window.netlifyIdentity;
    const offerForm = document.getElementById('offer-form');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const authSection = document.getElementById('auth-section');
    const offerSection = document.getElementById('offer-section');
    const ilSelect = document.getElementById('il');
    const ilceSelect = document.getElementById('ilce');
    const mahalleSelect = document.getElementById('mahalle');
  
    // Konum verilerini yükle
    const response = await fetch('/locations.json');
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
  
    // Netlify Identity ile giriş/çıkış işlemleri
    netlifyIdentity.on('init', user => {
      if (user) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline';
        offerSection.style.display = 'block';
      } else {
        loginBtn.style.display = 'inline';
        logoutBtn.style.display = 'none';
        offerSection.style.display = 'none';
      }
    });
  
    netlifyIdentity.on('login', () => {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline';
      offerSection.style.display = 'block';
      netlifyIdentity.close();
    });
  
    netlifyIdentity.on('logout', () => {
      loginBtn.style.display = 'inline';
      logoutBtn.style.display = 'none';
      offerSection.style.display = 'none';
    });
  
    loginBtn.addEventListener('click', () => netlifyIdentity.open());
    logoutBtn.addEventListener('click', () => netlifyIdentity.logout());
  
    // Teklif formu gönderimi
    offerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = netlifyIdentity.currentUser();
      if (!user) {
        alert('Lütfen önce giriş yapın!');
        return;
      }
  
      const formData = {
        food: document.getElementById('food').value,
        price: document.getElementById('price').value,
        il: document.getElementById('il').value,
        ilce: document.getElementById('ilce').value,
        mahalle: document.getElementById('mahalle').value,
        deliveryTime: document.getElementById('deliveryTime').value,
        allergy: document.getElementById('allergy').value,
        offerDuration: document.getElementById('offerDuration').value,
        userEmail: user.email,
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