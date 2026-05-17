## Ne iş yapar?

`useEffect`, bileşeni çizdikten sonra yan etkiyi sırayla çalıştırır: veri çekmek veya iptal etmek, abonelik açmak, zamanlayıcı kurmak, pencere `resize` olayına kaydolmak veya DOM’a dokunmak gibi işler için kullanırsınız. Bunları doğrudan render gövdesine gömmek okumayı zorlaştırır ve sıra beklentinizi daha çabuk bozacak dallanmalara götürür.

## Üç bağlılık listesi yazım şekli

**1 — Parametresiz** (`useEffect(fn)`): Her görünüşte çalışabilir — içerde koşulsuz `setState` varsa sonsuz sıçrama riski çıkar ve üretimde çoğu kez gereksiz gürültü üretir.

**2 — Boş liste** (`useEffect(fn, [])`): “Yaşama bir kez kur; gerekiyorsa unmount’ta sök” modeli. Geliştirme sırasında Strict Mode, kur–sök sırasını bilinçle ekstra deneyebilir; bu üretim davranışını kopyalamaz.

**3 — Dolu liste** (`useEffect(fn, [a, b])`): `Object.is` benzeri kıyasla izlenir — obje veya dizi her render’da yeni referansla üretiliyorsa efekt sık sık yeniden tetiklenir.

## Referans tuzakları

`useEffect(() => {...}, [{ x: 1 }])` gibi bağımlılıkta doğrudan yeni nesne yazmak, her görünüşte “yeni referans” üretildiği için efektleri istemeden tekrarlatabilir. Gerekirse üstten stabil referans verin veya `useMemo` ile sınırlandırın.

## Cleanup (geri dönüş)

`return () => { ... }` ile önceki kurulumu sökün: zamanlayıcıyı iptal edin, `AbortController` ile isteği kesin, `removeEventListener` çağırın. Böylece çift abonelik ve bellek taşması riskini azaltırsınız.

### Dolu liste akışı

- Bir kimlik değişti: önce eski kimlik için cleanup, sonra yeni kimlik için kurulum.
- Bileşen kapandı: son cleanup sırayla çalışır.

### Boş liste akışı

- İlk oluş kurulumunu ve çıkış temizliğini görürsünüz. Geliştirme sırasında Strict Mode’un bu sırayı gereğinden ek denemesi normal bir uyarıcıdır — üretimi bozmaz.

> **İpucu:** `react-hooks/exhaustive-deps` uyarısı çoğu zaman efektin bir önceki render’dan eski bağlamla yakalanması (**stale closure**) riskine işaret eder — gereksiz yere liste genişletmeyin ama gerçekten kullandığınız değerleri yazmaktan da kaçınmayın.

> **İpucu:** `useLayoutEffect`, çizimden hemen önce senkron çalışır; titreşimi veya kaymayı düzeltme gibi nadir işler için uygundur — uzun süren ağ işlerini buraya taşımayın.
