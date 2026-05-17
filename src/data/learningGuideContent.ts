import type { LessonModuleId } from '../types'

/** Öğrenme Rehberi Markdown’ı: tek teknik doküman özeti (mimari, src envanteri, Lesson alanları, betik/Supabase/tema/receteler). Aynı modülde GLOSSARY ve GUIDE_SECTION_ORDER da LearningGuidePage tarafından kullanılır. */
export const LEARNING_GUIDE_MARKDOWN = `
## Bu rehberin amacı

Bu Markdown metni projeyi **tek kaynak**tan öğrenmeye yönelik düzenlenmiştir: mimari öz, **tam dosya sözlüğü**, veri-modeli tarifi, doğrulama betikleri, isteğe bağlı bulut, tema ve özelleştirme yolları. Bu metin + aynı dosyada tanımlı \`GLOSSARY\` + bu sayfadaki **tam müfredat listesi** (LearningGuidePage) birlikte tüm yüzeyi kaplar.

**Nasıl okunmalı.** Üst sıradaki blokları sırayla bitirin (ürün öz → komutlar → ekran-dosya eşlemesi → **App** durumu → **src** envanteri → Lesson alanları → kalıcı/bulut → derleme). Belirli bir dosyayı arıyorsanız **Dosya envanteri** başlığında Ctrl+F yapın veya doğrudan \`learningGuideContent.ts\` düzenleyicide arayın.

## Ürün özeti

| Özellik | Uygulama |
| --- | --- |
| Çalışma modeli | **Tek sayfa (SPA)**; React Router kullanılmaz |
| Dil ve çalışma ortamı | **TypeScript** + **Vite** |
| Arayüz | **Tailwind CSS 4**, \`tailwindcss\` + \`@tailwindcss/typography\` (Vite ile) |
| Müfredat metni | **Markdown** (**react-markdown**) |
| Kod görselleştirme | **react-syntax-highlighter** |
| Canlı kod alanı | **react-live** (seçilen derslerde) |
| İsteğe bağlı uzak kimlik ve senkron | **Supabase istemci** (\`@supabase/supabase-js\`) |

### Depo kökünde sık dokunulan dosyalar

| Dosya / klasör | İşlev |
| --- | --- |
| **package.json** | Bağımlılıklar, \`npm run …\` betikleri |
| **vite.config.ts** | Vite eklentileri (React, Tailwind), \`manualChunks\` ile paket bölmüşü |
| **tsconfig.json**, **tsconfig.app.json**, **tsconfig.node.json** | TypeScript projesi ve araçların derleme ayrımı |
| **eslint.config.js** | ESLint düz yapı kuralları |
| **index.html** | SPA giriş kabuğu, \`theme-color\`, ilk tema script’i (\`dark\` sınıfı), manifest linki |
| **public/manifest.json** | PWA yüzünde gösterge; ikon/meta |
| **src/main.tsx** → **src/App.tsx** | Köke montaj sırası: stiller → **ThemeProvider** → **App** |
| **dist/** (\`npm run build\` sonrası) | Yerel olarak üretilmiş statik dağıtım çıktısı |

---

## Yerel araç kutusu

| Komut | Ne zaman |
| --- | --- |
| \`npm run dev\` | Geliştirme sunucusu |
| \`npm run build\` | \`tsc -b\` + üretim derlemesi; çıktı \`dist/\` |
| \`npm run preview\` | \`dist\` ön izleme sunucusu |
| \`npm run lint\` | ESLint taraması |
| \`npm run validate-quizzes\` | Quiz verisi tutarlılığı (**scripts/verify-lesson-quizzes.ts**) |
| \`npm run validate-activities\` | Cloze / drag aktivite verisi (**scripts/verify-lesson-activities.ts**) |
| \`npm run validate-all\` | İki doğrulamayı sırayla çalıştırır |

İçerik değiştirmeden sonra en azından \`npm run validate-all\`; dağıtımdan önce \`npm run build\`.

### Baştan sona yükleme zinciri

1. Tarayıcı **index.html**: isteğe göre kök öğeye \`dark\` (tema yanlış flaşını azaltmak için).
2. **src/main.tsx**: \`./index.css\` → \`StrictMode\` → **ThemeProvider** → **App**.
3. **App.tsx**: ilk çizim üst bileşenden başlar (**Header**, \`Sidebar\`, \`main\` içeriği seçilen panele göre).

---

## Ekran parçası → kaynak dosya haritası

| Görünen alan | Açmanız gereken dosya(glar) |
| --- | --- |
| Üst çubuk, arama, sekmeler, ilerleme çubuğu, tema düğmesi | **src/components/Header.tsx** |
| Soldaki modül başlıkları ve ders listesi, tamamlanan işaretleri | **src/components/Sidebar.tsx** |
| Ders kartı gövdesi: Markdown, kod, quiz, etkinlik, canlı kod, “bitir” akışı | **src/components/LessonWorkspace.tsx**, **LessonCard.tsx**, **Quiz.tsx**, **CodePlayground.tsx**, **LessonStudyAux.tsx** |
| Kod blok işleme (Markdown içindeki fence’ler) | **src/components/MarkdownCodeBlocks.tsx** |
| Sürükleyerek sıra / kod şeridi / cloze bileşenleri | **src/components/lessonActivities/** altı |
| Ana yerleşim: hangi panel açılıyor; arama filtresi; \`Sidebar\` + \`main\` birleşimi | **src/App.tsx** |
| Modül özet kartları ve isteğe bağlı görev şablonları | **src/components/CategoriesPage.tsx** |
| Çalışma stüdyosu (kartlar, peş peşe yol) | **src/components/SkillsStudioPage.tsx** (+ veri için aşağıdaki “Stüdyo verisi”) |
| Hesap kutusu ve sunucu uyarıları | **src/components/CloudSyncPanel.tsx** |
| Sayfa dip metni ve site adı props | **src/components/Footer.tsx** |
| Tema seçimi bağlamı (açık / koyu / sistem) | **src/theme/ThemeProvider.tsx**, **themeContext.ts** |
| SPA kök bağlama ve provider sarmalı | **src/main.tsx** |
| Gövde arka planı, koyu mod \`color-scheme\`, animasyonlı sınıflar | **src/index.css** |

---

## Uygulama durumu mantığı (**src/App.tsx**)

Burada iki boyut seçilir ve birleştirilir: **hangi panel** görünsün, **hangi ders kartı** yükünü oluştursun.

### Saklanan seçim durumları (**useState**)

| State | Tür (kavram) | Görev |
| --- | --- | --- |
| \`mainPanel\` | \`lesson\` · \`skills\` · \`categories\` · \`guide\` değerlerinden biri | Orta ana alanda **ders**, **Stüdyo**, **Modüller**, **Öğrenme Rehberi** arasında geçiş |
| \`searchQuery\` | dize | Üst bardaki metin filtresi; başlık, gövde ve kod başlığı/özetlerinde düşük harf ile arama |
| \`currentLessonId\` | dize | Sidebar veya liste üzerinden **bilinçli** seçilmiş ders |
| \`lessonChoiceExplicit\` | boolean | Kullanıcı elle ders seçtiyse, hidrasyon sonrası uzaktan saklanmış “son ders” tercihi **otomatik olarak ezmez** |
| \`sidebarMobileOpen\` | boolean | Küçük ekranda yan menünün kaplaması + arka katman butonunun davranışı |

### Hesaplanan değişkenler (**useMemo**)

- **LESSON_CURRICULUM_IDS**: \`lessons.map((l) => l.id)\` — müfredat sırasına göre tüm kimlik dizisi (**bulut ile birleştirme** sıralamasına da kullanılır).
- **mergedLessonId**: \`progressHydrated\`, \`lessonChoiceExplicit\`, \`syncedLastLessonId\` ve yerel seçim birleştirilir: saklanmış ilerleme gelene kadar mevcut seçim; sonra ya elle seçim kalır ya uzaktan saklanmış son kart.
- **filteredLessons**: arama filtresi uygulanmış ders kümesi; **Sidebar.section** oluşturmada kullanılır (**moduleId + filtre uyumu**).
- **sidebarSections**: \`SECTION_ORDER\` (intro … expert) sırasıyla başlıklar ve her modülün dersleri; **Sidebar** ile **CategoriesPage** aynı veriyi kullanır.
- **activeLesson**, **nextLessonId**, **completedLessonCount** vb.: gezinme ve gösterge hesapları.

### **SECTION_ORDER** (App içinde sabitlenmiş modül sırası)

Şu sıra hem yan menüde hem **Modül** görünümünde temeldir: **intro** → **components** → **state-lists** → **hooks** → **expert**. **learningGuideContent.ts** içindeki **GUIDE_SECTION_ORDER** ile hizalı tutulması önerilir (aynı sıra garantisi).

### Gecikmeli yüklenen bileşenler (**React.lazy / Suspense**)

\`CategoriesPage\`, \`SkillsStudioPage\`, \`LearningGuidePage\` dinamik import ile bu dosyayı okuyan blokta listelenmiştir. **Suspense** altında yüklemede rolleri dolu olan \`LazyPanelSkeleton\` döner (**aria-busy**, dönen gösterge).

### Önemli olay bağları (canlı gösterimde sıra ile denenebilir)

- Ders seç → \`handleSelectLessonFromSidebar\`: mobil menü kapalı, panel **lesson**, \`lessonChoiceExplicit\` true, \`lastLessonId\` senkron’a yazılır.
- Sekmeler (**Header**) → Modül / Rehber / Stüdyo → ilgili \`handleOpen...\` (**mainPanel** değişir).
- Üst araç çubuğu ders seçiliyken \`LessonWorkspace\`; aksi üç panelden biri.

**Route yok:** URL parametresi yazılmadığı için “şu bağlantıyı gönder” ile belirli ders seçili gelmez — sunumda uygulamayı açıp sol listeden seçmek öngörülür.

---

## src klasörü — eksiksiz dosya envanteri

Aşağıdaki tabloyu **arama** yapmadan doğrudan buradan tarayarak dosya seçilebilir. Yollar **src/** ile başlar.

### Bileşenler (**src/components/**)

Üst dizindeki ana yerleşim dosyası: **src/App.tsx** — bu klasörün **bir üst** seviyesindedir (\`Sidebar\`, \`Header\`, \`LessonWorkspace\` buradan oluşturulur).

| Dosya | Ne iş yapar |
| --- | --- |
| **Header.tsx** | Başlık, arama, Stüdyo / Modül / Rehber sekmesi, tema, mobil menü, ilerleme çubuğu. |
| **Sidebar.tsx** | Modül bloklarında ders listesi ve tamamlanma görseli; Stüdyo çağrı bağları. |
| **LessonWorkspace.tsx** | Aktif kartın yaşam döngüsü — etkinlik / quiz / kod görev sırasının orkestrasyonu (**key** yeniden seçimde sıfır). |
| **LessonCard.tsx** | Kart gövdesi (Markdown kartı dahil yapısı). |
| **LessonStudyAux.tsx** | Yardımcı özet kartları (**lessonStudyAids** bağlar). |
| **Quiz.tsx** | Çoktan seçmeli arayüz ve geri bildirim (titreşim sınıfları **index.css**). |
| **CodePlayground.tsx** | react-live kutusu (**challenge** uyumu). |
| **MarkdownCodeBlocks.tsx** | Markdown içinden kod fence render’ları + **createMarkdownComponents** çıktısı. |
| **CloudSyncPanel.tsx** | Hesap bağlama OTP ve senk uyarı yüzleri. |
| **Footer.tsx** | Dip metni. |
| **CategoriesPage.tsx** | Modül özeti kartları (**DEFAULT_TASKS** ile önerilen mini görevler). |
| **SkillsStudioPage.tsx** | Stüdyo sekmeli deneyimi; **practicePath**, drills ve hızlı referans kartları. |
| **LearningGuidePage.tsx** | Bu Markdown’ın render edildiği + tam müfredat listesi (**GLOSSARY**, **GUIDE_SECTION_ORDER**) |

### Aktivite alt klasörü (**src/components/lessonActivities/**)

| Dosya |
| --- |
| **ClozeChallenge.tsx** |
| **DragOrderChallenge.tsx** |
| **DragCodeChallenge.tsx** |

### Veri (**src/data/**)

| Dosya |
| --- |
| **lessons.ts**, **intro.ts**, **components.ts**, **state-lists.ts** (*içinden* **advanced.ts** dahil etmek üzere), **hooks.ts**, **expert.ts** |
| **lessonStudyAids.ts**, **learningGuideContent.ts**, **practicePath.ts**, **skillsStudioDrills.ts**, **quickReferenceCards.ts** |

### Türler, araç katmanları, bağlar

| Dosya | Ne iş yapar |
| --- | --- |
| **types/index.ts** | Tüm Lesson / quiz / aktivite / challenge yüz yapısı. |
| **hooks/useSyncedLearningProgress.ts** | Yerel okuma-yazma + uzak birleştirme + OTP oturumu. |
| **utils/userProgressStorage.ts** | Yerel saklama ayrıştırma / güvenli yazma / müfredata göre sıralama. |
| **utils/extendedProgress.ts** | Stüdyo ile ilişkilenmiş JSON alt modeli (**coerce**, **merge**, DB’ye dönüş). |
| **utils/lessonQuizHelpers.ts** | doğru dizin seçimi (**validate-quizzes.ts** için de kullanılır). |
| **utils/clozeHelpers.ts** | cloze doğruluğu (**ClozeChallenge** bağlı işler). |
| **utils/practicePathShuffle.ts** | Rota sıra karıştırması geçerliliği. |
| **utils/buildPlaygroundInitialCode.ts** | Canlı koda bağlı yardımcı üretimi (kart tarafından çağrılabilir). |
| **utils/engagementStreak.ts**, **utils/dateLocal.ts** | Günlük seri ve tarih çizgisi kullanıcıya özel olarak. |

### Tema

| Dosya |
| --- |
| **theme/ThemeProvider.tsx**, **theme/themeContext.ts**, **theme/useTheme.ts** |

### Diğer

| Dosya |
| --- |
| **main.tsx**, **index.css**, **supabase/client.ts**, **assets/** (**vite.svg**, **react.svg**) |

---

## Müfredat verisi ve tip sözleşmesi

- **Tam ders dizisi birleştirilir:** **src/data/lessons.ts** içinde (\`intro\`, \`components\`, \`state-lists\`, \`hooks\`, \`expert\` dizileri sıralı olarak spread edilir).
- **Alan tanımları:** **src/types/index.ts** → **Lesson**, **LessonQuiz**, **LessonClozeActivity**, **LessonDragOrderActivity**, **LessonDragCodeActivity**, challenge tipi dahil tek kaynak şema mantığıdır.
- **Modül bazlı içerik dosyaları:** **src/data/intro.ts**, **components.ts**, **state-lists.ts**, **hooks.ts**, **expert.ts**.
- **Dış özet / mini görevler (Stüdyo yan kartları dahil destekliyse):** **src/data/lessonStudyAids.ts** (\`LESSON_RECAPS\`, \`LESSON_EXTRA_TASKS\`).
- **Peş peşe alıştırma sırası:** **src/data/practicePath.ts**
- **Hızlı stüdyo kartları:** **src/data/skillsStudioDrills.ts**
- **Hızlı hatırlatıcı kartları:** **src/data/quickReferenceCards.ts**

Yeni kart eklemenin tipik sırası: ilgili modül *.ts içinde nesne oluşturmak → gerekliyse özet kartı **lessonStudyAids** ile eşlemek → \`validate-all\`.

### **Lesson** alanı — kısa sözlük (**src/types/index.ts**)

| Alan | Zorunlu | Görev |
| --- | --- | --- |
| \`id\` | Evet | Ders anahtarı; ilerlemenin bağlandığı dizge |
| \`moduleId\` | Evet | **intro**, **components**, **state-lists**, **hooks**, **expert** — blok ve filtre sırası |
| \`title\`, \`difficulty\` | Evet | Görünen başlık, zorluk etiketi |
| \`lessonLayout\` | Hayır | \`default\` veya büyük canlı kod için \`laboratory\` |
| \`content\` | Evet | Markdown anlatım |
| \`codeExamples\` | Evet | Örnek kod dizisi (**title**, **code**, isteğe **caption**) |
| \`quiz\` | Evet | Birinci çoktan seçmeli |
| \`extraQuizChecks\` | Hayır | Ek bilgi sınaması soruları |
| \`dragOrderActivity\`, \`dragCodeActivity\`, \`clozeActivity\` | Hayır | Etkinlikler (**validate-activities** bunları doğrular) |
| \`challenge\` | Evet | \`LessonChallenge\`: react-live için \`initialCode\` ve \`expectedOutputDescription\` |

### **advanced.ts** bağlantısı

**src/data/advanced.ts** içindeki \`advanced-…\` ders kartları doğrudan \`lessons.ts\`'e yazılmaz; **src/data/state-lists.ts** üzerinden \`additionalStateListsLessons\` ile içe aktarılmış **state-lists** modülüne bağlanarak son birleştirilir.

### Betik doğrulama kapsamları (**scripts/**)

- **verify-lesson-quizzes.ts**: (**1**) tüm müfredat \`lessons\`, (**2**) **PRACTICE_PATH_STEPS** içinde quiz, (**3**) **SKILLS_STUDIO_DRILLS** quiz alanları. \`correctAnswer\`, \`choices\` içinden **aynı yazılmış** bir seçenekle eşlenmelidir (**quizCorrectAnswerIndex**).
- **verify-lesson-activities.ts**: yalnız \`lessons\` üzerinden cloze / drag sıra / kod parça sırası tutarlılığı.

Yeni aktivite türleri eklendiğinde \`scripts/verify-lesson-activities.ts\` kapsamını genişletmek gerekir; Stüdyo kartları ise şimdilik öncelikle quiz doğruluğu ile yakalanmıştır.

---

## Kalıcı durum ve bulut katmanı

| Konu | Konum veya anahtar |
| --- | --- |
| Tam kullanıcı ilerlemesi (JSON) | \`localStorage\` anahtarı **react-akademi:user-progress-v1** (**src/utils/userProgressStorage.ts**) |
| Eski sade tamamlanan ders anahtarı (taşıma uyumu) | **react-akademi:completed-lesson-ids** |
| Birleştirilmiş hook | **src/hooks/useSyncedLearningProgress.ts** |
| Uzak senk yapısı | **src/supabase/client.ts** (ortam değişkenleri yoksa özellikler çoğu zaman nötr fallback’te kalır; **bulut isteğe bağlıdır**) |
| FOUC önleyici ilk tema (**html** üzerinde \`dark\` sınıfı) | **index.html** içindeki ilk \`<script>\` bloğu; kalıcı tercih **react-akademi:theme** (**THEME_STORAGE_KEY**, **themeContext.ts**) |

Tarayıcı Geliştirici Araçları → **Application** → **Local Storage**: yukarıdaki anahtarlarla beklenmiş JSON’un üretim sırasında değişmediğini doğrulayabilirsiniz.

### Yerel süre yapı özeti (**userProgressStorage.ts** — v2 nesnesi)

**completedLessonIds**, **lastLessonId**, **extended** (bir sonraki alt başlık). Eski kullanıcılar için **lesson id remap** tablosu aynı dosyada (eski kimliklerin yenilere bağlandığı kod sabitleri) tutulur.

### Extended paket (**extendedProgress.ts**) — **version: 1**

- **practicePath**: peş peşe rotada **cursor**, “en uzun kusursuz” sayaçları, yanlışa dönüşler, sıra için **orderedStepIds** gibi takip alanları (**practicePathShuffle.ts** doğruluğuyla).
- **engagement**: günlük seri birikimi (**engagementStreak.ts**).
- **pathPreferences**: zamanlı cevaplama modunun açılıp kapanması ve soru süresi seçenekleri.
- **skillsLastTab**: Stüdyoda son sekme (**drills**, **reference**, **path**).

### İsteğe bağlı **Supabase** yüzünde öz

- Ortam iki değişkenden ibaret (**VITE_SUPABASE_URL**, **VITE_SUPABASE_ANON_KEY**) — eksik ise \`getSupabaseClient()\` **null**.
- Bekleniş: \`learning_progress\` üzerinden **UPSERT**, alanların TypeScript yüzünde özeti (**LearningProgressRow** — **supabase/client.ts**).
- Asıl auth ve RLS tasarımları konsol işini kaplar; kod yalın istemcidir ve **OTP e-postası** bağlamını **hook** sürdürür.

---

## Üretim derlemesi ve parça bölümleme

- **vite.config.ts** içindeki \`manualChunks\`: node_modules içinden **syntax-highlighter**, **react-live**, **react-markdown** ayrı paketlenebilir; büyük paylaşılan kütüphanelerde ilk indirimi parçalı tutma hedefi.
- Bazı çıktılar hâlen büyük olabilir; Vite uyarısı yalnızca hatırlatmacadır — ek bölüşüm gerekiyorsa aynı dosyada kural eklenmelidir.

---

## Statik yüz ve PWA izleri

- **index.html**: başlık, **theme-color**, PWA için **manifest** bağlantısı, ilk yüklemede tema sınıfı.
- **public/manifest.json** ve görseller (**public/**): kurulum diyaloğu için minimal meta.
- Büyük içeriklerin gerçek “çevrimdışı cache” politikası kodda yer almayabilir; manifest + tema rengi seviyesidir.

---

## Görünüm ve renk: nereden değiştirilir?

Proje çoğu renkleri **Tailwind yardımcı sınıfları** ile seçer (**className=\`...\`**). Arama sırasında dosyada Tailwind anahtarı arayın (örn. emerald, sky, green, neutral hex).

### Global arka plan ve koyu mod gövdesi

- **src/index.css**: \`body\` ve \`.dark body\` arka plan / metin renkleri; \`@media print\` altında nötr çıktı.
- **theme-color**: **index.html** \`<meta name="theme-color" content="#16a34a" />\`; tarayıcı UI rengini etkiler.

### Üst çubuk (aktif sekme, vurgu, ilerleme çubuğu)

- Dosya **src/components/Header.tsx**.
- Aktif sekme ve hover’da sık kullanılan tokenlar örnek olarak: **emerald**, **sky**, **green-600**, **neutral** zinciri; düğümü bulmak için bileşeni açıp ilgili \`border-*\`, \`bg-*\`, \`text-*\` yardımcılarını değiştirmek yeterlidir.

### Ana iskelet (kenar şeridi, kart zeminleri)

- **src/App.tsx** kök div ve orta kolon (**border**, **shadow**, **bg-white**, koyu temada **dark:bg-[#…]** sınıfları).

Talepte “bir bloğun rengini” değiştirmek için: tarayıcıda **Inspect → seçili öğede class listesi**, dosyada ilgili \`className\` dizgesini doğrudan güncelle; global davranış **index.css** veya tema script’idir.

### Vite ortam değişkenleri (\`.env*\`)

Tarayıcıya sızmak istenen değişken **VITE_** önekli olmalıdır (aksi durumda \`import.meta.env\` tarafından istemciden kullanılmaz). **Supabase URL / anon anahtarı** böyle bağlanmıştır. Hassas değerleri repoya yazmayın; yerelde \`.env.local\` kullanın (gitignore’a ekli olmalı).

---

## Yazdırma modu

- **src/App.tsx** bazı üst sarmallarda **print:bg-white** veya bileşenlerde **print:hidden** (kenar çubukları, bazı yan paneller) kullanır.
- **src/index.css** yazdırımda koyu temayı nötr zemine çeken kuralları içerebilir.

---

## Yakın gösterim — hızlı yanıtlar özeti

| Sorulan | Aç veya söylediğin öz |
| --- | --- |
| Uygulama kaynak görünümü hangi klasörde? | **src/components** arayüz; **src/data** içerik |
| Tek ders kartı yapısı nereden okunuyor? | **Lesson** tipi **src/types/index.ts**; örnek kayıtlar **intro.ts**, **hooks.ts**, **expert.ts** vb. dosyalar içinde (**src/data/** klasöründe birleştirilir) |
| Quiz metinleri nereden geliyor? | Aynı **Lesson** nesnesindeki \`quiz\` / \`extraQuizChecks\` |
| Sürükleyerek sıra hangi bileşenden? | **src/components/lessonActivities/** + **LessonWorkspace.tsx** bağlama props |
| Uygulama sayfa route kullanıyor mu? | Hayır — **mainPanel + lessonId** (**App.tsx**) |
| Performans bölmüş mü? | **React.lazy** (App.tsx) + **vite.config.ts manualChunks** |
| Derlemeden sonra nereye düşüyor? | **dist/** klasörü; ön kontrol için \`npm run preview\` |
| “Bu renk nerden geliyor?” | İlgili bileşen **className** + gerekliyse **index.css** |
| Bulut bağlanmıyor mu? | \`VITE_SUPABASE_URL\`, \`VITE_SUPABASE_ANON_KEY\` ile konsolda **RLS** ve \`learning_progress\` şemasını doğrula |
| İlerlemeyi sıfırlamak? | DevTools → **Application** → \`react-akademi:user-progress-v1\` sil; sayfa yenile (**veya gizli pencere**) |

---

## Etkileşim türleri (teknik öz)

| Tür | Veri kaynağı | Görünür bileşen |
| --- | --- | --- |
| Çoktan seçmeli | \`lesson.quiz\`, \`extraQuizChecks\` | **Quiz** (**getShuffledQuizView** ile ekranda şık sırası deterministik olarak karıştırılır — veriyi değiştirmez). |
| Sürükleyerek kavram sırası | \`dragOrderActivity\` | **DragOrderChallenge** |
| Kod şeridi sırası | \`dragCodeActivity\` | **DragCodeChallenge** |
| Cloze | \`clozeActivity\` (**\`___\`** yer tutucuları) | **ClozeChallenge** |
| Canlı kod görevi | \`lesson.challenge\` | **CodePlayground** + **LessonWorkspace** akışı |

---

## Markdown işleme hattı (ders kartı için)

**LessonCard / LessonWorkspace**, \`lesson.content\` dizgesini **react-markdown** ile çizerken **MarkdownCodeBlocks** çıktısını bileşen eşlemesi olarak verir (**createMarkdownComponents**). Böylece metin içi \`\`\`js gibi bloklar prism / highlighter yüzleri ile oluşur; canlı bloklar ders yapısı gereği ayırtlıdır (**CodePlayground**).

---

## Çalışma sırası (müfredat önerisi)

ES6 ve JSX başlangıç → bileşenler ve props → state, listeler ve formlar → hooks → uzman blokları (**expert-site-mimarisi**, performans, RTL, üretim, büyük laboratuvar). Tepe tepeye Stüdyo kartlarıyla tekrarı **practicePath.ts** sırasından tamamlayınca daha istikrarlı ölçülür.

---

## Uzman modülü kart dizilişi (iç içerik referansı)

Kavram sırasına uygun okuma sırası: **expert-site-mimarisi** → **expert-performans-ve-bundle** → **expert-testing-rtl-paradigma** → **expert-build-env-ve-yayinlama** → **expert-todo-buyuk-calismasi**.  
Not: öğrenci arayüzünde ders \`id\` değerinde bağlantılar ASCII ile \`expert-build-env-ve-yayinlama\` yazılır; Türkçe anlam olarak **“yayımlama”** (ortamını dağıtma) bağlamıdır.

---

## “Hemen bu dosyayı aç” — viva / sınıf sınavı tarzı özet

Amaç: yalnızca bu başlığı ve yukarıdaki dosya haritasını kullanarak hocanın sorabileceği “sistem nerede oturmuş?” sorularına hızlı cevap.

### Yerleşim (layout) ve kart çerçevesi

- **Ana üç sütunun birleştiği yer:** **App.tsx** — panel seçimi (\`lesson\`, \`skills\`, \`categories\`, \`guide\`) ve seçili ders.
- **Tek ders kartının tamamı (Markdown gövdesi + quiz çerçevesi):** **LessonCard.tsx** (\`lesson-md prose\`). Kenarlık/yarıçap değişimi çoğu zaman buradaki Tailwind yardımcılarından.
- **Modül özeti kutuları (öğrenme çıktıları listesi):** **CategoriesPage.tsx** — metinleri Markdown olarak çizer (\`DEFAULT_TASKS\`); **lesson id** kod parçası görünümü burada oluşur.
- **Çalışma stüdyosu:** **SkillsStudioPage.tsx** — kartlar ve peş peşe yolda kullanılan **Quiz** bileşeni; şık sırasını **lessonQuizHelpers** karıştırır.

### Metin işleme

- **Ders Markdown’ı işleyen bileşen eşlemesi:** **MarkdownCodeBlocks.tsx** — başlıkların anchor planı (**LessonReadingGuide** ile) burada bağlanır.
- **Globall stillerde satır içi kod / tipografi tuzakları:** **index.css** (\`.lesson-md\` alt seçiciler).

### Öğretim içeriği nereden gelir?

- **Bireysel kart kayıtları:** modül bazlı (**intro.ts**, **components.ts**, **state-lists.ts**, **hooks.ts**, **expert.ts**) + gelişmiş ders paketleri **state-lists** üzerinden.
- **Birleştirilmiş dizi:** **src/data/lessons.ts**.
- **Yardımcı özet blokları:** **lessonStudyAids.ts**.

### Quiz ve sıra etkinlikleri

- **Doğru cevap metni ile şık eşleşmesini doğrula:** **npm run validate-quizzes** → **quizCorrectAnswerIndex**.
- **Arayüzde şık yerinin her seferinde aynı harfede olmaması:** **getShuffledQuizView(scopeKey, …)** — veri sırasından bağımsız gösterim; \`correctAnswer\` dizide birebir aynı kalmalıdır.
- **Sürükleyerek sıra — geribildirim:** **DragOrderChallenge.tsx**’te “**Sıramı doğrula**” ile satır yeşili/turuncu ve “kaç öğe doğru yerde?” özeti görünür; tam sıra tutunca üst bileşene **true** bildirilir.

### Kalıcı veri anahtarı (özet)

- **Tam ilerleme:** \`react-akademi:user-progress-v1\` (**userProgressStorage.ts** ile okunup yazılır).

---

### Tek tabloda katman fotoğrafı

| Soru kalıbı | Cevap özü |
| --- | --- |
| “SPA nereden başlıyor?” | index.html tema script’i → main.tsx StrictMode → App |
| “Modül seçince ne dosya işler?” | App.tsx içinde Sidebar + seçilen LessonCard veya CategoriesPage vb. |
| “Yeni ders ekliyorum?” | İlgili data/*.ts nesnesini yaz → lessons.ts sırasına ekle → validate-all |
| “Renk/teal/emerald nerden?” | İlgili bileşende className; global gövde index.css |

---

## Sözlük ve modül sırası bileşeni

Bu sayfanın üstünde listelenen kavram tablosı ve modül sıra haritası aynı modül içinde (**src/data/learningGuideContent.ts**) \`GLOSSARY\`, \`GUIDE_SECTION_ORDER\` sabitleriyle üretilir; **LearningGuidePage** bunları bağlar.

---

## Dış referans

Çekirdek kütüphane ve desen doğruluğu için [React resmi dökümantasyonu](https://react.dev).

---

## Rapor özeti için isteğe bağlı tek paragraf şablonu

*(İstenirse akademik yüzeysel özete sıkıştırmak için.)* SPA eğitim istemcisinde müfredat **TypeScript veri kartlarından** akar; kullanıcı arayüzü **işlev bileşenleri**, **quiz ve etkinlik bileşenleri** ve gerektiğinde **react-live** ile pratik gerektiren konuların bir birleşimidir; ders sırasının ve veri doğruluğunun kontrolünde yapı zamanı doğrulama betikleri kullanılmıştır; isteğe bağlı **yerel-depo + uzak kimlik birleştirmesi** ilerlemenin sürekliliğini artırır.
`.trim()

export type GlossaryEntry = {
  term: string
  /** Kısa, düz Türkçe */
  blurp: string
  /** Yukarıdan derse sıçrama (varsa ilk eşleşen) */
  lessonIdHint?: string
}

export const GLOSSARY: readonly GlossaryEntry[] = [
  {
    term: 'Bileşen (component)',
    blurp:
      'Arayüzün yeniden kullanılabilir parçası; çoğu derste fonksiyon olarak yazılır.',
    lessonIdHint: 'components-class-vs-functional',
  },
  {
    term: 'Props',
    blurp:
      'Üstten alta inen parametre kümesi; salt okunur kabul edilir, olay için callback kullanılır.',
    lessonIdHint: 'components-props-nedir',
  },
  {
    term: 'State',
    blurp:
      'Bileşenin içinde zamanla değişen veri; güncellenince yeniden çizim (render) tetiklenebilir.',
    lessonIdHint: 'hooks-use-state',
  },
  {
    term: 'JSX',
    blurp:
      'JavaScript içinde HTML-benzeri ağaç yazımı; derleyicide createElement/jsx çağrılarına dönüşür.',
    lessonIdHint: 'intro-jsx-nedir',
  },
  {
    term: 'Hook',
    blurp:
      'İşlev bileşeninde `use…` ile state, yan etki, bağlam ve daha fazlasını bağlayan API.',
    lessonIdHint: 'hooks-what-is',
  },
  {
    term: 'Virtual DOM / reconcile',
    blurp:
      'Gerçek DOM’un hafif modeli ile önceki ve yeni UI ağacı karşılaştırılır, minimal güncelleme yapılır.',
    lessonIdHint: 'state-lists-lists-key',
  },
  {
    term: 'Context',
    blurp:
      'Props zinciri uzadığında değeri Provider ile yayma; value referansına dikkat.',
    lessonIdHint: 'hooks-use-context',
  },
  {
    term: 'Portal',
    blurp:
      'DOM’da farklı bir düğüme çizim; modal ve tooltip için sık seçilir.',
    lessonIdHint: 'expert-portals',
  },
  {
    term: 'Error boundary',
    blurp:
      'Alt ağaçtaki render hatalarında kullanıcıya fallback gösteren (çoğunlukla sınıf) bileşen.',
    lessonIdHint: 'expert-error-boundaries',
  },
  {
    term: 'Code splitting / lazy',
    blurp:
      'İhtiyaç anında yükleme için `React.lazy`; beklemede kullanıcıya `Suspense` içinde küçük bir fallback gösterilir.',
    lessonIdHint: 'expert-performans-ve-bundle',
  },
  {
    term: 'React Testing Library',
    blurp:
      'Testte DOM ve kullanıcı akışına odaklanma; seçicilerde rol ve görünür metin önceliklidir.',
    lessonIdHint: 'expert-testing-rtl-paradigma',
  },
  {
    term: 'import.meta.env',
    blurp:
      'Vite’ta yapı zamanı enjekte edilen ortam değişkenleri; istemci tarafına yalnızca `VITE_` ile başlayanlar açılır.',
    lessonIdHint: 'expert-build-env-ve-yayinlama',
  },
]

/** Modül etiketi → sıra (App ile aynı). */
export const GUIDE_SECTION_ORDER: readonly LessonModuleId[] = [
  'intro',
  'components',
  'state-lists',
  'hooks',
  'expert',
]

export const GUIDE_SECTION_TITLES: Record<LessonModuleId, string> = {
  intro: 'ES6 & JSX temelleri',
  components: 'Bileşenler & Props',
  'state-lists': 'State, Listeler & Formlar',
  hooks: 'React Hooks',
  expert: 'Uzman Seviyesi',
}
