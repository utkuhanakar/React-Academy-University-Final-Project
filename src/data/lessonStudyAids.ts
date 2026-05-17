/** Ders sonrası hızlı özet (Markdown); tekrar okumayı kısaltır. */
export const LESSON_RECAPS: Record<string, string> = {
  'intro-react-es6': `
- **Ok fonksiyonları** ve **yıkımlama**, props ve hook dönüşlerinde tekrar azaltır.
- **Spread** ile yüzeysel kopya: state güncellemede yeni nesne referansı üretmenin temelidir.
- Derin yapı gerekiyorsa katman katman yay veya uygun araç seç.
`.trim(),
  'intro-jsx-nedir': `
- **JSX** JavaScript içinde bileşen ağacı yazdırır; çoğu zaman HTML gibi görünür ama ifadedir.
- **className** kullan; DOM’daki **class** kelimesi JS’te çakışır.
- Derleyici JSX’i **createElement** çağrılarına dönüştürür.
`.trim(),
  'intro-jsx-expressions-attributes': `
- **Süslü parantez** ile ifade göm; dize ve sayıyı karıştırma.
- **Boolean** ve **style** nesneleri için çift süslü veya yardımcı kalıplar kullan.
- HTML’den farklı olay ve öznitelik adları (camelCase vb.) sık sorulur.
`.trim(),
  'intro-jsx-if-statements': `
- Koşulu JSX’te **ternary** veya uygun küçük bileşene bölerek yaz.
- **&&** ile dikkat: **0**, **NaN**, boş diziler gibi yanlış-pozitif gösterimlere düşülmesin.
- Karmaşıklıkta erken dönüş + alt bileşen okunabilirliği artırır.
`.trim(),
  'components-class-vs-functional': `
- Fonksiyon bileşeni + hook’lar günümüz tipik yaklaşımıdır.
- Sınıf bileşenleri hâlâ **error boundary** ve eski kod tabanlarında görülür.
- Aynı props → aynı UI fikrini koru; yan etkiler **useEffect** gibi yerlere kayar.
`.trim(),
  'components-props-nedir': `
- **Props**, üstten alta okunan veridir; doğrudan **mut etmeyerek** güncellenir düşün.
- Küçük, net bileşen arayüzleri test ve yeniden kullanımı kolaylaştırır.
- Varsayılan değerleri üst bileşenden veya fonksiyon parametrelerinden ver.
`.trim(),
  'components-props-destructuring': `
- \`({ ad }) =>\` veya parametre bloklarıyla okunabilirlik artır.
- Varsayılan parametreler ve isteğe bağlı alanlarla tip kullanımı düzenli kalır.
- Rest kalıbı \`...gerisi\` ile fazla prop’u forward etmek mümkündür.
`.trim(),
  'components-props-children': `
- **children** slotu layout ve sarmalayıcı bileşenlerde kompozisyon sağlar.
- **ReactNode** geniş kapsamı metin, eleman, dizi veya null kapsar.
- İsimlendirilmiş slotlar bazen ayrı prop’larla daha net olur.
`.trim(),
  'components-events': `
- **onClick** vb. camelCase; handler’ı çağrıyı ertelemek için ok fonksiyonu ile sarmala.
- **event** nesnesini asenkron işte saklarken **persist** / değer kopyalama gerekebilir.
- Form ve klavye olayları erişilebilirlik için birlikte düşünülmeli.
`.trim(),
  'state-lists-conditionals': `
- State minimal tut; türetilebileni hesaplamayla çıkar (**useMemo** gerektiğinde).
- Tek kaynak doğruluğu özellikle form ve seçim mantığında kritiktir.
- Koşulu UI ve state senkronu okunabilir yardımcı fonksiyonlara böl.
`.trim(),
  'state-lists-lists-key': `
- **key**, kardeşler arasında kimliktir; domain id tercih edilir.
- Sıranın sık değiştiği liste yoksa indeks son çare olabilir.
- key prop’u bileşenin kendi props’una karışmaz; React iç mekaniğidir.
`.trim(),
  'state-lists-forms-controlled': `
- **value + onChange + state** üçlüsü kontrollü girdinin omurgasıdır.
- Checkbox/radio/select için doğru özellik adlarını seç.
- Çok alanlı formları nesne olarak modellemeyi düşün.
`.trim(),
  'state-lists-forms-submit': `
- Native **submit** olayında **preventDefault** genelde gereklidir.
- Doğrulama hataları state veya küçük alt bileşenlerle kullanıcıya gösterilir.
- Yükleme durumunu ayrı flag ile göstermek iyi UX’tir.
`.trim(),
  'hooks-what-is': `
- Hook’lar bileşen çağrısı sırasında React’ın durum yaşamına bağlıdır.
- Koşulsuz ve aynı sırada çağırma kuralı vardır.
- Custom hook’lar paylaşılan mantığı fonksiyon halinde paketler.
`.trim(),
  'hooks-use-state': `
- **setState** fonksiyonel güncelleyici yığılan güncellemeler için güvenlidir.
- Obje yerine daha basit değişmezler gerekiyorsa parçalayarak düşün.
- Rendering çizelgesi yüzünden güncellemeler toplu işlenebilir.
`.trim(),
  'hooks-use-effect': `
- Yan etkiyi bileşendeki veri/UI senkronu için kullan.
- Bağımlılıklar doğru seçilmezse **bayat kapanış** riski oluşur.
- Temiz fonksiyon abonelik ve zamanlayıcıları bağlar.
`.trim(),
  'hooks-use-ref': `
- DOM tutamağı veya render tetiklemeyen kalıcı sayaç için uygundur.
- **.current** doğrudan mutasyona açıktır; re-render bekleme.
- **forwardRef** ile çocuğa ref iletmek yaygın kalıptır.
`.trim(),
  'hooks-use-context': `
- Context, prop drilling’i azaltır; çok sık değişen devasa value performans tuzaklarına yol açabilir.
- Sağlayıcıyı ihtiyaç duyulan alt ağaçta tut.
- Tüketici bileşen value değişince yeniden render olur.
`.trim(),
  'hooks-use-memo': `
- **useMemo** saf ve pahalı hesapların önbelleği için seçilir; gereksiz sarmalamaktan kaçının.
- Bağımlılık listesi **exhaustive** tutulmadıysa yanlış sonuç oluşabilir (stale).
- **Derlenmiş liste** ile **filtre** birlikte çok sık görülür.
`.trim(),
  'hooks-use-callback': `
- **useCallback**, alt bileşenlere iletilen **handler referansını** stabilize etmeye yarar (\`memo\` ile sık kombinasyon).
- Boş bileşeni her handler’da sarmak şart değildir — önce ölçüm/profil sonra optimizasyon.
- Bağımlılıkları eksik bırakmak **bayat closure** doğurabilir.
`.trim(),
  'hooks-use-layout-effect': `
- **useLayoutEffect** paint öncesi senkron çalışır; ölçüm ve titreşimi azaltmak için seçilir.
- Ağ çağrısı için genelde uygun değildir (**useEffect** tercih edilir).
- sunucuda/layout içerik uyarısı: SSR gereksinimlerine göre useEffect ile dengeleyin.
`.trim(),
  'hooks-use-id': `
- **useId**, erişilebilirlik bağları ve bileşen kapsamlı stabil kimlikler için uygundur.
- Liste elemanına rastgele id üretmek yerine domain id kullanın veya sıra ile türetin.
`.trim(),
  'hooks-custom-nested': `
- Custom hook’lar içindeki hook sırası her çağırmada aynı kalmalıdır.
- Küçük, okunabilir dönüş API’leri tasarlayın; tek iş yapan soyutlamalar daha dayanıklıdır.
`.trim(),
  'advanced-form-yonetimi': `
- Orta/ileri formlarda doğrulama ve hata mesajı stratejisi net olmalı.
- Alan bazlı state veya küçük reducer düzeni okunabilirlik sağlar.
- Async gönderimlerde çift tıklama ve yarış durumlarına dikkat.
`.trim(),
  'advanced-liste-render-map': `
- **map** ile üretilen elemanlarda **key** zorunludur.
- Boş/tek eleman durumları için erken dönüş veya placeholder düşün.
- Liste ve filtre state’ini karıştırma.
`.trim(),
  'advanced-kosullu-render': `
- Çok dallı UI’da küçük alt bileşenler okunabilirliği artırır.
- **Fragment** ile gereksiz DOM eklemeden grupla.
- Sunucu ve istemci render farklılıklarında dikkat (hydration).
`.trim(),
  'expert-use-reducer': `
- **dispatch + reducer** karmaşık geçişleri okunur kılar.
- State ve eylem tiplerini net isimlendir.
- Yan etkiler reducer dışında kalmalıdır.
`.trim(),
  'expert-context-detay': `
- Context değerini parçalara bölmek gereksiz render’ı azaltabilir.
- Sağlayıcı memoization bazen gerekir.
- Varsayılan değer ve tip güvenliği kullanıcı hatalarını azaltır.
`.trim(),
  'expert-portals': `
- **createPortal** modal ve tooltip gibi z-index/overflow sorunlarını çözer.
- Olay kabarcıklanması ve odak yönetimi portal ile birlikte planlanır.
- SSR senaryolarında kök seçimine dikkat.
`.trim(),
  'expert-error-boundaries': `
- Sınıf tabanlı boundary çocuk ağaçtaki render hatalarını yakalayabilir.
- Olay işleyicideki hataları ve asenkron hataları ayrı ele alın.
- Kullanıcıya düşen nazik fallback metinleri ve yeniden deneme sun.
`.trim(),
  'expert-site-mimarisi': `
- **src/data** ile **src/components** ve **src/hooks** ayrımına dikkat: veriyi burada düşünün, JSX’yi buraya taşıyın.
- “Tek sayfa + durum seçili ders id’si” modelinde **URL yeniden yazma yerine SPA durumu** vardır; raporda bunu açıklayabilirsin.
- Küçük değişiklikler bile **aynı anda veri dosyası + UI** dokunuşu gerektirdiğinden, commit’leri mantıklı küçült.
`.trim(),
  'expert-performans-ve-bundle': `
- **React.lazy** ve **Suspense** ile gerekmeyen ekranın ilk yüklemede bekletilmesini azaltır; fallback kısa ve anlamlı olsun.
- **Çok sık yanlışlaştırma:** her şey için memo / useMemo — önce gereksiz render’ın kaynağını ara.
- Büyük üçüncü parti paketleri **ayırmak için** paket derleyicide manualChunks benzeri bölüşüm düşün.
`.trim(),
  'expert-testing-rtl-paradigma': `
- **“Nasıl uygulanmış?” değil, “kullanıcı ne görür?”** sorusuyla test yaz; seçicilerde görünür metin ve erişilebilir ad önceliklidir.
- **userEvent** ile davranış, **jest-dom** ile beklenti; zamanlayıcı ve ağ için waitFor veya find ile sabır.
- **Implementation detayı** sızmaması için sadece kullanıcıya açılan API’leri (placeholder, başlık, düğme adı) hedefleyin.
`.trim(),
  'expert-build-env-ve-yayinlama': `
- **Vite**’ta npm run build çıktısı genelde **dist** klasöründe durur; yayın için base path/host kuralına uyun.
- **Geliştirme sırları .env;** yayında sadece VITE_ önekiyle kasıtlı paylaşılanlar istemci tarafına gider — hassas anahtarı oraya yazma.
- **import.meta.env** ile ortam seç (DEV veya PROD, mod adı); özellik bayrakları tek kaynaktan okunsun.
`.trim(),
  'expert-todo-buyuk-calismasi': `
- Küçük adımlarla doğrula: liste ekle/sil/filtre gibi gereksinimler bir arada çalışmalı.
- State kaldırımı tek kaynak üzerinden güncellenmeli.
- Karmaşıklıkta reducer veya bileşen bölmesi düşünün.
`.trim(),
}

export function lessonRecapMarkdown(lessonId: string): string {
  return (
    LESSON_RECAPS[lessonId]?.trim() ??
    `Bu kart için henüz kısa özet yazılmamış — üstteki anlatımı kullanarak tekrar edebilirsin.`
  )
}

/** Ders içi ek pratik görevleri (isteğe bağlı) */
export const LESSON_EXTRA_TASKS: Record<string, readonly string[]> = {
  'intro-react-es6': [
    'Bir kullanıcı nesnesinden yıkımlayıp alan güncelle; sonra spread ile üçüncü bir alanı ekle.',
    'İki useState güncellemesini yanlış çift artır ve ardından fonksiyonel güncelleyici ile düzelt.',
    'Sürükle-bırak sırasındaki üç adımı deftere kendi küçük nesne state örneğinle eşleştir.',
  ],
  'intro-jsx-nedir': [
    'Aynı bileşende createElement ve JSX sürümlerini yan yana yazıp çıktıyı karşılaştır.',
    'className ile iki farklı stil sınıfı birleştir (sabit dize).',
  ],
  'intro-jsx-expressions-attributes': [
    'Bir URL’yi ve bir sayıyı süslü parantezle aynı paragrafta göster.',
    'style nesnesinde hem padding hem color ile küçük bir kutu çiz.',
  ],
  'intro-jsx-if-statements': [
    'count 0 iken && ile 0 basıldığını gözlemle; ardından ternary ile düzelt.',
    'Üç durumlu (yükleniyor / hata / veri) mini kart yaz.',
  ],
  'components-class-vs-functional': [
    'Aynı props’u alan fonksiyon bileşenini çiz; render’da konsola prop’u logla.',
    'Sınıf bileşen örneğini okuyup hangi parçanın hook karşılığı olduğunu listele.',
    'Tek yönlü akış şemasını (props–callback–state) kart üzerine çizip bir örnekle etiketle.',
  ],
  'components-props-nedir': [
    'İç içe iki bileşen yaz: üst altına metin ve sayı prop’u geçir.',
    'Props’u doğrudan mutasyon yapmaya çalışıp neden kaçınılacağını açıkla.',
  ],
  'components-props-destructuring': [
    'Varsayılan değerli iki prop’u destruction ile al ve eksik geçir.',
    'Rest ile kalan prop’ları bir alt bileşene spread et.',
  ],
  'components-props-children': [
    'Card bileşeni yaz: başlık prop’u + children gövde.',
    'children yerine render prop desenini kıyasla (kısa not).',
  ],
  'components-events': [
    'Buton tıklamasında id’yi ok fonksiyonu ile ilet; ikinci buton yanlış kalıbı göster.',
    'Form submit’te preventDefault ve state güncellemesini birleştir.',
  ],
  'state-lists-conditionals': [
    'İki state’i birleştirip türetilebilen değeri hesapla (ör. filtrelenmiş liste).',
    'Koşullu render’ı küçük yardımcı bileşene taşı.',
  ],
  'state-lists-lists-key': [
    'id’siz geçici liste ile key=index riskini kısa notla açıklayıp sonra id ekle.',
    'Liste elemanına silme butonu ekle ve filtre güncelle.',
  ],
  'state-lists-forms-controlled': [
    'Tek kontrollü input + küçük sayaç aynı formda yaşasın.',
    'Şifre alanında göster/gizle toggles ile state senkronu kur.',
  ],
  'state-lists-forms-submit': [
    'Doğrulama hatası olduğunda mesaj göster ve gönderimi engelle.',
    'Gönderim sırasında butonu devre dışı bırakan flag ekle.',
  ],
  'hooks-what-is': [
    'Kendi başına custom hook çıkarıp iki bileşende paylaştır.',

    'Hook kurallarından birini özellikle yorum satırında hatırlat.',
  ],

  'hooks-use-state': [
    'Birden fazla setState sırasını fonksiyonel güncelleyici ile doğrula.',
    'Nested state yerine yüzeysel parçalı state deneyerek taşı.',

  ],
  'hooks-use-effect': [
    'Bağımlılığı kasıtlı çıkararak bayat kapama oluştur ve düzelt.',
    'Abonelik aç/kapa cleanup kalıbını yaz.',
  ],
  'hooks-use-ref': [
    'Input’a mount’ta odak atan ref ile dene.',

    'Render saymayan sayaç için ref ile useState farkını not al.',
  ],
  'hooks-use-context': [
    'Tema sağlayıcı + tüketici ile küçük örnek kur.',
    'Context value’yu parçalara bölmeyi tartış (yorum).',
    'Şerit sürükleme sırasını kendi bağlam örneğinle karşılaştırılabilir sırayla yeniden yaz.',
  ],
  'hooks-use-memo': [
    'Büyük dizi filtresinin bağımlılığını yanlış bırakıp düzelt; sonucu doğrula.',
    'Çok basit matematik için useMemo gerekip gerekmediğini yazılı kıyasla.',
  ],
  'hooks-use-callback': [
    'İki düğme için aynı handler referansını useCallback ile paylaş.',
    'Bağımlılığı bilerek çıkararak bayat kapama yakalayıp düzelt.',
  ],
  'hooks-use-layout-effect': [
    'useEffect ile kutunun boyutunu sonra ölç; layout effect ile paint öncesini gözlemle.',
    'Ağ çağrısının neden useLayoutEffect için kötü fikir olduğunu yaz.',
  ],
  'hooks-use-id': [
    'Alan + uyarı kutusu için useId ile eş çift oluştur (label/description).',
    'Formda iki kullanıcı alanıyla id çakışmasını nasıl önlersin yaz.',
  ],
  'hooks-custom-nested': [
    'useDebouncedText gibi bir hook çıkarımı yaz (minimal).',
    'useToggle’ı parametre ile başlat ve iki bileşende paylaşıp davranışı karşılaştır.',
  ],
  'advanced-form-yonetimi': [
    'Alan bazlı hata nesnesini gösteren mini form doğrula.',
    'Debounced doğrulama veya küçük geciktirme taslağı düşün.',
  ],
  'advanced-liste-render-map': [
    'Arama kutusuyla filtrelenen liste yaz.',
    'Boş liste için kullanıcı dostu mesaj göster.',

  ],
  'advanced-kosullu-render': [
    'Üç bileşeni tek router benzeri state ile seç.',
    'SSR uyarısı yok varsayımıyla koşulu portal denemesi yaz.',
  ],
  'expert-use-reducer': [
    'En az üç eylem türü olan reducer yaz ve dispatch zinciri kur.',
    'Yan etkiyi reducer dışına taşı (useEffect).',
  ],
  'expert-context-detay': [
    'Context’i iki ayrı sağlayıcıya böl (tema + oturum benzeri).',
    'useMemo ile value önbellekleme denemesi yap.',
  ],
  'expert-portals': [
    'Modal portal ile body’ye çiz; dış tıklamada kapatmayı planla.',
    'Focus trap ihtiyacını not defterine yaz.',
  ],
  'expert-error-boundaries': [
    'Kasıtlı throw eden çocukla boundary fallback’i göster.',
    'Asenkron hata ile render hatası farkını listele.',

  ],
  'expert-site-mimarisi': [
    'Çiziminizde ana akışları işaretleyin: `App.tsx` → `Sidebar`/`LessonViewer`/`CloudSync`.',
    'Bir ders kartını “veri katmanı + görünüm” diye iki sütunda özetleyin.',
    '`src/types` ile `hooks`/`data` içinde kullanılan tipleri eşlemeye çalışın.',
  ],
  'expert-performans-ve-bundle': [
    'Kendi mini depoda tek bir bileşeni `lazy` yapıp `Suspense` fallback’ini göster.',
    'Vite çıktınız için `vite build` süresini ve yaklaşık chunk sayısını not al.',
    '`useMemo` ile ve olmadan aynı filtreyi kısa bir örnekle kıyaslayıp gereksiz optimizasyonu tartış.',
  ],
  'expert-testing-rtl-paradigma': [
    'Basit bir buton bileşeni için RTL ile “tıkla → metin güncellenir” testi yaz (örnek repo).',
    '`getByRole` ile iki farklı buton varsa `{ name }` seçicisinin nasıl gerektiğini göster.',
    'Çocuk bileşeni mock’lamak yerine küçük sarmallayıcı üzerinden entegrasyon tercihi notu çıkar.',
  ],
  'expert-build-env-ve-yayinlama': [
    'Yalnızca yerel kullanım için `VITE_PUBLIC_APP_NAME` tanımla ve bileşende oku.',
    '`npm run preview` ile `dist/` sunumunu klasör yapısı ile birlikte rapora yaz.',
    'Gerçek API anahtarını kodda yer tutucuyla bırakıp güvenlik maddesi ekle.',
  ],
  'expert-todo-buyuk-calismasi': [
    'Todo filtresini (tüm/açık/tamam) reducer veya küçük state makinesine taşı.',

    'localStorage’a kalıcılığı hook ile bağla.',

  ],
}

export function lessonExtraTasks(lessonId: string): readonly string[] {
  return LESSON_EXTRA_TASKS[lessonId] ?? []
}
