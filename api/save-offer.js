// Geçici olarak teklifleri bir dizi içinde tutacağız (sunucu yeniden başlatıldığında sıfırlanır)
let offers = [];

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const data = req.body;
    const { food, price, il, ilce, mahalle, deliveryTime, allergy, offerDuration, userEmail } = data;

    // Yeni teklifi ekle
    const newOffer = {
      id: Date.now(), // Benzersiz ID için zaman damgası
      food,
      price,
      il,
      ilce,
      mahalle,
      deliveryTime,
      allergy,
      offerDuration,
      userEmail,
      status: 'Açık',
      createdAt: new Date().toISOString(),
    };

    offers.push(newOffer);

    return res.status(200).json({ message: 'Teklif başarıyla kaydedildi', offerId: newOffer.id });
  } catch (error) {
    return res.status(500).json({ message: 'Hata oluştu', error: error.message });
  }
};