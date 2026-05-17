import type { LessonQuiz } from '../types'

export interface PracticePathStep {
  readonly id: string
  readonly moduleLabel: string
  readonly quiz: LessonQuiz
}

/** Peş peşe alıştırma rotası — tek sıra; yanlışta yol sıfırlanır ve kalıcı sayaç güncellenir */
export const PRACTICE_PATH_STEPS: readonly PracticePathStep[] = [
  {
    id: 'pp-es6-arrow-context',
    moduleLabel: 'ES6 temeli',
    quiz: {
      question:
        'İşlev bileşeninde event handler’a ok fonksiyonu bağlarken, geleneksel `function handler(){}` yazısından en bariz teorik avantaj nedir?',
      choices: [
        'Ok fonksiyonu `class` bileşeni constructor’ında `bind` gerektirdiği için kısayoldur.',
        '`this` lexical kaplaması: ok fonksiyonu çağıranın `this` değil, tanımlandığı bağlamdan okur.',
        '`this` her zaman DOM düğümüne bağlanır.',
        'Ok fonksiyonlar `arguments` nesnesinde daha hızlıdır.',
      ],
      correctAnswer:
        '`this` lexical kaplaması: ok fonksiyonu çağıranın `this` değil, tanımlandığı bağlamdan okur.',
    },
  },
  {
    id: 'pp-es6-spread-copy',
    moduleLabel: 'ES6 temeli',
    quiz: {
      question: '`const y = { ...x, a: 1 }` ifadesinin yaygın React kullanımı için doğru özeti hangisidir?',
      choices: [
        '`x` içindeki tüm özellikleri klonlar ve `a` alanını (varsa üzerine) yazar.',
        '`x`’i doğrudan mutasyona açar; `a` sadece referans olarak eklenir.',
        'Sadece bir seviye derin klon üretir; iç içe her alan güvenilir biçimde kopyalanır.',
        '`x` yüzeysel değişmez kopya oluşturmaz.',
      ],
      correctAnswer:
        '`x` içindeki tüm özellikleri klonlar ve `a` alanını (varsa üzerine) yazar.',
    },
  },
  {
    id: 'pp-jsx-classname',
    moduleLabel: 'JSX',
    quiz: {
      question:
        'JSX’te HTML’deki `class` özniteliği yerine neden `className` kullanılır?',
      choices: [
        'React tarihinden kalma gereksiz fark;tarayıcı yine class kabul eder.',
        '`class` JavaScript’te ayrılmış kelime olduğu ve JSX içinde özellik adı olarak çakıştığı için.',
        '`className` daha kısa yazılabildiği için.',
        '`className` yalnızca TypeScript’te zorunludur.',
      ],
      correctAnswer:
        '`class` JavaScript’te ayrılmış kelime olduğu ve JSX içinde özellik adı olarak çakıştığı için.',
    },
  },
  {
    id: 'pp-jsx-expression-brace',
    moduleLabel: 'JSX',
    quiz: {
      question: 'JSX içinde JavaScript ifadesi gömmek için hangi ayraç doğrudur?',
      choices: ['( )', '${ }', '{ }', '<% %>'],
      correctAnswer: '{ }',
    },
  },
  {
    id: 'pp-jsx-conditional-zero',
    moduleLabel: 'JSX',
    quiz: {
      question:
        '`{count && <Badge />}` ifadesinin yaygın “0 tuzağı” açıklaması hangisi?',
      choices: [
        '`count` falsy ise hiçbir şey çizmez; doğru varsayım böyledir.',
        '`count` 0 ise ifade sonucu sayıdır (0); React bazen ekranda 0 basar.',
        'React sıfırı JSX’te hiçbir zaman yazdırmaz.',
        'Ternary yazmak JSX’te yasaktır.',
      ],
      correctAnswer:
        '`count` 0 ise ifade sonucu sayıdır (0); React bazen ekranda 0 basar.',
    },
  },
  {
    id: 'pp-components-props',
    moduleLabel: 'Bileşenler',
    quiz: {
      question: 'Props akışına dair doğru özeti seçin:',
      choices: [
        'Props üst→alt doğru okunabilir çocuktan üste geri doğrudur.',
        'Props üst bileşenden alt bileşene tek yön salt okunur veri olarak gider.',
        'Çocuktan güncellenen props doğrudan ebeveyne yazılır.',
        'Her props değişimi DOM’da `querySelector` tetiklemelidir.',
      ],
      correctAnswer:
        'Props üst bileşenden alt bileşene tek yön salt okunur veri olarak gider.',
    },
  },
  {
    id: 'pp-components-children',
    moduleLabel: 'Bileşenler',
    quiz: {
      question:
        '`function Layout({ children }) { … }` ve `<Layout><p>A</p></Layout>` yapısı `children` ile neyi sağlar?',
      choices: [
        'Çocuklar props yerine doğrudan `document.body` yazılır.',
        'Çocuklar özel öznitelik olmadan kompozisyon slotu olarak iletilir.',
        '`children` yalnızca dize olabilir.',
        '`children` sadece sınıf bileşeninde vardır.',
      ],
      correctAnswer:
        'Çocuklar özel öznitelik olmadan kompozisyon slotu olarak iletilir.',
    },
  },
  {
    id: 'pp-events-handler',
    moduleLabel: 'Olaylar',
    quiz: {
      question:
        'JSX’te `onClick={() => tikla(id)}` ile `onClick={tikla(id)}` karşılaştırmasında doğru çıkarım hangisi?',
      choices: [
        'İkisi de aynı davranışı üretir; fark görünmez.',
        'İlk biçim tıkta çağırmayı erteler; ikincisi sıklıkla render sırasında hemen tetiklenebilir.',
        'İkinci biçim yalnızca TypeScript için geçerlidir.',
        "`onClick` yalnızca string olarak handler kabul eder.",
      ],
      correctAnswer:
        'İlk biçim tıkta çağırmayı erteler; ikincisi sıklıkla render sırasında hemen tetiklenebilir.',
    },
  },
  {
    id: 'pp-state-intro',
    moduleLabel: 'State',
    quiz: {
      question:
        '`const [sayi, setSayi] = useState(0); setSayi(sayi + 1); setSayi(sayi + 1);` kümesi kesintisiz aynı event’te koşunca olası çıktı (closure dikkate)?',
      choices: [
        'Çoğu durumda değişiklik sırayla yığıldığı için 2 artar beklenmez; fonksiyonel güncelleme `setSayi(v=>v+1)` gerekebilir.',
        '`sayi` her zaman doğrudan 2 artırılır garantisi verilir.',
        'React paralel olarak iki güncellemeden yalnız birini işler garanti edilir.',
        '`useState` birden fazla çağrıyı yasaklar.',
      ],
      correctAnswer:
        'Çoğu durumda değişiklik sırayla yığıldığı için 2 artar beklenmez; fonksiyonel güncelleme `setSayi(v=>v+1)` gerekebilir.',
    },
  },
  {
    id: 'pp-list-key-stable',
    moduleLabel: 'Listeler',
    quiz: {
      question: 'Liste içinde kardeş JSX öğeleri için stabil `key` seçiminde doğru yaklaşım hangisi?',
      choices: [
        'Render indeksleri her zaman en iyisidir çünkü benzersizdir.',
        'Domain kimliği (ör. kullanıcı `id`) tercih; indeks yalnızca listenin sıralaması güvenilir ise son çaredir.',
        '`key` sadece stil seçicidir, davranış etkilemez.',
        'Aynı `key` farklı tür öğede sorun çıkarmaz.',
      ],
      correctAnswer:
        'Domain kimliği (ör. kullanıcı `id`) tercih; indeks yalnızca listenin sıralaması güvenilir ise son çaredir.',
    },
  },
  {
    id: 'pp-form-controlled',
    moduleLabel: 'Form',
    quiz: {
      question: 'Tam kontrollü bir metin kutusu için gereken üçlünün özeti hangisi doğru?',
      choices: [
        '`defaultValue`, `readonly`, `suppressHydrationWarning`',
        '`value`, `onChange` ve state ile tek doğruluk kaynağı',

        '`ref.current.value` doğrudan mutasyon ile',
        '`name` özelliği yeterlidir; state gerekmez',
      ],
      correctAnswer:
        '`value`, `onChange` ve state ile tek doğruluk kaynağı',
    },
  },
  {
    id: 'pp-hooks-rules',
    moduleLabel: 'Hooks',
    quiz: {
      question: 'Hooks kurallarından hangisi doğrudur?',
      choices: [
        'Hookları koşula göre ara sıra çağırmak uygulanabilirdir.',

        'Hooklar yalnızca işlev bileşeninin tepesinde (veya custom hook’un tepesinde) çağrılmalıdır.',
        '`use*` çağrısı `for` içinde olabilir; React izin verir.',
        'Class bileşeni içinden hook çağrısı normaldir.',
      ],
      correctAnswer:
        'Hooklar yalnızca işlev bileşeninin tepesinde (veya custom hook’un tepesinde) çağrılmalıdır.',
    },
  },
  {
    id: 'pp-use-effect-deps-empty',
    moduleLabel: 'useEffect',
    quiz: {
      question: '`useEffect(()=>{ fetchData() }, [])` yaygın anlamı?',
      choices: [
        'Her render’da `fetchData` çalışır.',
        'Yalnızca ilk mount sonrasında bir kez çalışır (strict modda yeniden bağlanması dev modda oluşabilir).',
        'Bağımlılık listesi yanlıştır olasılık nedeniyle konsola doğrudan hata yazılır.',
        'Asla tetiklenmez.',
      ],
      correctAnswer:
        'Yalnızca ilk mount sonrasında bir kez çalışır (strict modda yeniden bağlanması dev modda oluşabilir).',
    },
  },
  {
    id: 'pp-use-effect-deps-missing-problem',
    moduleLabel: 'useEffect',
    quiz: {
      question:
        'Efekt içinde bileşenden gelen bir değişken kullanılıp bağımlılık dizisine eklenmezse sık sonuç ne olur?',
      choices: [
        'React otomatik bağımlılık çıkarımı yapar ve sorunu kapatır.',
        'Stale (bayat) kapanış değişkenleri: efekt yanlış/eskimiş değerlerle çalışabilir.',

        'Performans garanti olarak her zaman yükselir.',
        '`useEffect` hook’unu React devre dışı bırakır.',
      ],
      correctAnswer:
        'Stale (bayat) kapanış değişkenleri: efekt yanlış/eskimiş değerlerle çalışabilir.',
    },
  },
  {
    id: 'pp-use-ref-meaning',
    moduleLabel: 'useRef',
    quiz: {
      question:
        '`useRef<number>(0)` ile tutulan kutunun bileşende tipik tasarruf nedeni hangisi?',
      choices: [
        'Her `.current` değişiminde garanti olarak yeniden render tetiklemek için',
        '`current` yazımının render uyandırmaması gereken kalıcı alan için (DOM, zamanlayıcı tanıtıcıları vb.)',
        '`useMemo` ile aynı önbelleği paylaşıyor olduğu için',
        '`ref` doğrudan global state oluşturmak içindir',
      ],
      correctAnswer:
        '`current` yazımının render uyandırmaması gereken kalıcı alan için (DOM, zamanlayıcı tanıtıcıları vb.)',
    },
  },
  {
    id: 'pp-context-consumer',
    moduleLabel: 'Context',
    quiz: {
      question:
        'Context’te `Provider` içinde güncellenen `value`, tüketen bileşende ne zaman yeniden görünüm tetiklenebilir?',
      choices: [
        'Hiçbir zaman; context sadece prop drilling alternatifidir',

        '`value` değişerek context’in abonelerinin yeniden render olması beklenebilir',
        'Yalnızca doğrudan `useContext` çağıran bileşene değil, tüm ağaca zorlar',
        '`value` sadece SSR’da güncellenir',
      ],
      correctAnswer:
        '`value` değişerek context’in abonelerinin yeniden render olması beklenebilir',
    },
  },
  {
    id: 'pp-reducer-basics',
    moduleLabel: 'useReducer',
    quiz: {
      question:
        'dispatch nesnesinin { type: "ekle", id } biçiminde gönderildiği klasik yapının useReducer için rolü nedir?',
      choices: [
        'DOM olayına doğrudan eşlik edip prop iletilmesini gerektirir',

        'Eylem ile durum güncellemesini merkezileştirir; karmaşık state geçişlerinde okuma kolaylığı sağlar',
        '`dispatch` Redux olmadan yasaktır',
        '`useState` için zorunlu alternatiftir',
      ],
      correctAnswer:
        'Eylem ile durum güncellemesini merkezileştirir; karmaşık state geçişlerinde okuma kolaylığı sağlar',
    },
  },
  {
    id: 'pp-portals',
    moduleLabel: 'Portal',
    quiz: {
      question: '`createPortal` tipik olarak ne zaman seçilir?',
      choices: [
        'CSS sırasını bozmadan aynı ebeveynde kalmayı zorladığı için',
        '`z-index`/overflow sıkışması olmadan başka kök düğümde çizmek (modal/overlay için)',

        'Server tarafında render devre dışı bırakmak için',

        '`useMemo`’nun yerini almak için',
      ],
      correctAnswer:
        '`z-index`/overflow sıkışması olmadan başka kök düğümde çizmek (modal/overlay için)',
    },
  },
  {
    id: 'pp-error-boundary',
    moduleLabel: 'Hata',
    quiz: {
      question: 'Çoğu klasik çocuk bileşen hatasını yakayıp kullanıcıya yedek arayüz gösterme deseni?',
      choices: [
        '`try/catch` her işlev bileşen gövdesinde yeter',

        '`Error boundary` olarak sınıf bileşeni veya yakın gelecek için destekli mekanizmalar',

        '`window.onerror` React’ın yer tutucusudur',


        '`useEffect` yan etkisi hataları her zaman yakalar',
      ],
      correctAnswer:
        '`Error boundary` olarak sınıf bileşeni veya yakın gelecek için destekli mekanizmalar',
    },
  },
  {
    id: 'pp-performance-memo',
    moduleLabel: 'Performans',
    quiz: {
      question:

        '`useMemo` seçiminde sık doğru yaklaşım hangisi?',


      choices: [
        'Her hesap kullanıcıya görünmezse gereksiz bile `useMemo` eklemek daha güvenilir performans için önerilir',
        'Pahalı kesin hesaplama ya da doğru özellik eşitliği ile props kararsız yeniden oluşumları için dikkatli seçim yapılır; her şey için değildir',

        '`useMemo` render sayısı garanti sıfır yapar',


        'Bağımlılık listesi seçilmez ise React derleyici çıkarımı doğrudur garanti olarak',
      ],
      correctAnswer:
        'Pahalı kesin hesaplama ya da doğru özellik eşitliği ile props kararsız yeniden oluşumları için dikkatli seçim yapılır; her şey için değildir',
    },
  },
  {
    id: 'pp-mutasyon-anti-pattern',
    moduleLabel: 'State',
    quiz: {
      question:
        'Aşağıdakilerden hangisi React ile uyum için genelde kaçınılması gereken bir kalıptır?',
      choices: [
        'Spread veya yüzeysel kopyalarla güncellenmiş nesne oluşturmak',
        'Mevcut state nesnesine doğrudan yazıp mutasyon sonra aynı referans bekleyerek güvenmek',

        '`useReducer` ile yeni nesne döndürerek geçiş tanımlamak',
        '`setX` için fonksiyonel güncelleyici yazmak',

      ],

      correctAnswer:

        'Mevcut state nesnesine doğrudan yazıp mutasyon sonra aynı referans bekleyerek güvenmek',

    },

  },

  {
    id: 'pp-lifting-state-up',
    moduleLabel: 'Mimari',
    quiz: {
      question:

        'İki kardeş bileşen aynı değişen veriyi paylaşmalı; en tipik doğru çözüm hangisidir?',


      choices: [

        'Aynı state’i `localStorage`’dan her render’da okuma',

        'State’i en yakın ortak ebebeyne taşıyıp ikisine prop olarak verip geri bildirimi callback ile almak',

        'Her kardeşe farklı kopyayı `cloneDeep` ile vermek',
        '`window.event` ile paylaşılan global yazmak',

      ],

      correctAnswer:

        'State’i en yakın ortak ebebeyne taşıyıp ikisine prop olarak verip geri bildirimi callback ile almak',

    },

  },

  {
    id: 'pp-react-memo-purpose',
    moduleLabel: 'Performans',
    quiz: {
      question:
        '`React.memo` bileşeni sıklıkla hangi durum için anlamlı bir seçim olur?',
      choices: [
        'Hiçbir bileşen yeniden render olmamalı varsayımında',
        'Prop’ları nadiren ama bileşenin render’ı ağır veya sık gereksiz re-render tuzakları var ise',
        'Hook kullanılmayan her bileşen için zorunlu standart seçim olarak',
        'Sadece sınıf bileşenleri sararken kullanılmalı olduğu için',
      ],
      correctAnswer:
        'Prop’ları nadiren ama bileşenin render’ı ağır veya sık gereksiz re-render tuzakları var ise',
    },
  },
  {
    id: "pp-key-random-bad",
    moduleLabel: "Liste",
    quiz: {
      question: "Liste için her yeniden oluşturmada sürekli yeni key (ör. Math.random üretimi) kullanmak neden kaçınılması gereken bir hatadır?",
      choices: [
        "`key` yalnızca stil sırasını belirlediği için davranışı etkilemez",
        "`key` her seferinde değiştiğinde React satırları eşleştiremez; bileşen içi state ve odak kaybolabilir",
        "Liste performansını her zaman garanti olarak artırır benzersiz `key` sayesinde",
        "Üretimde React otomatik olarak stabil `key` üretip sorunu düzeltir",
      ],
      correctAnswer: "`key` her seferinde değiştiğinde React satırları eşleştiremez; bileşen içi state ve odak kaybolabilir",
    },
  },
  {
    id: "pp-batch-state-updates",
    moduleLabel: "State",
    quiz: {
      question: "Aynı sentetik olay içinde birkaç `useState` güncellenmesi ardı ardı çağrılırsa çoğu senaryoda ne beklenir?",
      choices: [
        "Her güncellenme garanti olarak ayrı yeniden görünüm ve boyama gerektirir",
        "React uygun olduğunda birden fazla güncellemeyi tek görünüm turunda toplayabilir",
        "Yalnızca ilk çağrı işlenir, diğerleri tamamen yok sayılır",
        "`setState` yalnızca sınıf bileşenlerinde toplanır işlev bileşeninde tek tek işlenir",
      ],
      correctAnswer: "React uygun olduğunda birden fazla güncellemeyi tek görünüm turunda toplayabilir",
    },
  },
  {
    id: "pp-custom-hook-naming",
    moduleLabel: "Hooks",
    quiz: {
      question: "Özel (custom) bir hook yazarken beklenen isim ve çağrı düzeni nedir?",
      choices: [
        "`getDataOnClick` gibi özgün isim yeter kuralları yokmuş gibi düşünülür",
        "`use` ile başlamalıdır ve işlev bileşeninin tepesinden veya başka hook’un gövdesinden çağrılmalıdır",
        "`useFetchDataHook` yazılsa bile PascalCase seçildiyse yeterlidir",
        "`hook_` sonekiye gelmesi gereklidir ve yalnızca `try` içinden çağrılmalıdır",
      ],
      correctAnswer: "`use` ile başlamalıdır ve işlev bileşeninin tepesinden veya başka hook’un gövdesinden çağrılmalıdır",
    },
  },
  {
    id: "pp-forward-ref-use",
    moduleLabel: "İleri JSX",
    quiz: {
      question: "`forwardRef` sıklıkla hangi ihtiyaç için kullanılır?",
      choices: [
        "Global Redux deposu oluşturmak için",
        "Üst bileşenden alt DOM düğümüne `ref` taşımak (odak atlama ölçüm vb.)",
        "`key` üretimi için alternatif olarak",
        "`useEffect` çağırmayı yasaklamak için",
      ],
      correctAnswer: "Üst bileşenden alt DOM düğümüne `ref` taşımak (odak atlama ölçüm vb.)",
    },
  },
  {
    id: "pp-lazy-suspense-basics",
    moduleLabel: "Kod bölme",
    quiz: {
      question: "`React.lazy` ile yüklenecek bileşeni çizen akışta tipik olarak hangisi eşlik eder?",
      choices: [
        "`StrictMode` yalnız",
        "`Suspense` ve yükleme bekleme süresinde gösterilecek `fallback` bileşeni",
        "`createPortal`",
        "`Fragment` yüklemeye zorlar",
      ],
      correctAnswer: "`Suspense` ve yükleme bekleme süresinde gösterilecek `fallback` bileşeni",
    },
  },
  {
    id: "pp-strict-mode-dev",
    moduleLabel: "Geliştirme",
    quiz: {
      question: "Geliştirme sırasında `StrictMode` altında bazı efektlerin iki kurulum ve temizleme ile çalıştırılmasının asıl yararı daha çok hangisidir?",
      choices: [
        "Üretimde de aynı şekilde çift çalıştırmayı garantilemek",
        "Özellikle eşzamanlı yaklaşımlara hazırlık için yan etkiyi sınamak ve sızdıran ya da yanlış temizlik kalıplarını erken fark etmek",
        "Sadece performans uyarısı basmak konsolda görünür",
        "`use*` hook çağrılarını otomatik olarak yeniden sıralayıp düzeltmek",
      ],
      correctAnswer: "Özellikle eşzamanlı yaklaşımlara hazırlık için yan etkiyi sınamak ve sızdıran ya da yanlış temizlik kalıplarını erken fark etmek",
    },
  },
  {
    id: "pp-uncontrolled-vs-controlled",
    moduleLabel: "Form",
    quiz: {
      question: "Kontrollü ve kontrolsüz girdiyi karşılaştırınca `defaultValue` verilen ve sonrasında React state ile senk tutulmayan alan daha çok nedir?",
      choices: [
        "`value` ile bağlı `onChange` ve React state kombinasyonu",
        "`defaultValue` ile başlatılıp sonra değişim çoğu durumda DOM’un kendi güncellenmesine bırakılan alan",
        "`readOnly` ve `required` kombinasyonu",
        "`preventDefault` her olay işleyicide zorunludur deseni",
      ],
      correctAnswer: "`defaultValue` ile başlatılıp sonra değişim çoğu durumda DOM’un kendi güncellenmesine bırakılan alan",
    },
  },
  {
    id: "pp-which-snippet-render",
    moduleLabel: "Okuma",
    quiz: {
      question: "`items` boş diziyken `{items.length && <Liste />}` ifadesinden ekranda sık görülen çıktı hangisidir?",
      choices: [
        "Boş dizi yüzünden sonuç asla çıkmaz ekranı temiz tutar",
        "Sayı `0` çıktısı (`&&` ifadesinin solu 0 iken falsy olarak kalan değeri render edebilir)",
        "Yalnızca liste bileşeninin yükleme metni",
        "`undefined` dize olarak yazdırılır",
      ],
      correctAnswer: "Sayı `0` çıktısı (`&&` ifadesinin solu 0 iken falsy olarak kalan değeri render edebilir)",
    },
  },
  {
    id: "pp-hydration-mismatch-hint",
    moduleLabel: "SSR / istemci",
    quiz: {
      question: "Sunucunun ürettiği HTML ilk istemci çizimiyle uyuşmadığında sık kullanıcı/hata mesajı hangi kavrama bağlıdır?",
      choices: [
        "Hidrasyon uyumsuzluğu (sunucu ve istemci markup farklı)",
        "Yalnızca kod parçası (lazy) yükleme hatası",
        "Portal hedef düğümü bulunamadı",
        "Yalnızca tip denetimi hatası",
      ],
      correctAnswer: "Hidrasyon uyumsuzluğu (sunucu ve istemci markup farklı)",
    },
  },
  {
    id: "pp-children-prop-type",
    moduleLabel: "Tip",
    quiz: {
      question: "`ReactNode` türünde `children` alanı daha çok neyi içerebilir?",
      choices: [
        "Yalnızca JSX elemanı",
        "Metin sayı JSX diziler fragment `null` ve `undefined` gibi sık JSX çocuklarının birleşimi",
        "Her zaman yalnızca `Promise` döndürülebilir",
        "Yalnızca dizge",
      ],
      correctAnswer: "Metin sayı JSX diziler fragment `null` ve `undefined` gibi sık JSX çocuklarının birleşimi",
    },
  },
  {
    id: "pp-functional-setstate-motivation",
    moduleLabel: "State",
    quiz: {
      question:
        "Aynı olay işleyicide üst üste iki kez `setSayac(sayac + 1)` kullanmak kapanıştaki eski değer yüzünden beklediğin artışı vermeyebilir. Bunun için hangi yaklaşım daha güvenilir kabul edilir?",
      choices: [
        "`setSayac(sayac + 1)` yazmaya devam etmek; React otomatik düzeltir",
        "`setSayac((s) => s + 1)` gibi fonksiyonel güncelleyici kullanmak",
        "`flushSync` ile her güncellenmeyi zorlamak",
        "`useMemo` ile sayacı türetmek",
      ],
      correctAnswer: "`setSayac((s) => s + 1)` gibi fonksiyonel güncelleyici kullanmak",
    },
  },
  {
    id: "pp-render-avoid-side-effects",
    moduleLabel: "Temeller",
    quiz: {
      question:
        "İşlev bileşeni render sırasında aşağıdakilerden hangisi genelde yan etki olarak sayılır ve kaçınılması gereken yerdir?",
      choices: [
        "Props ile gelen dizeleri JSX içinde yazmak",
        "`Date.now()`, rastgele üretmek veya `localStorage` gibi sisteme doğrudan yazmak",
        "`return` ile doğrudan JSX dönmek",
        "`useState` başlangıç değişkenini doğrudan okuyup göstermek",
      ],
      correctAnswer:
        "`Date.now()`, rastgele üretmek veya `localStorage` gibi sisteme doğrudan yazmak",
    },
  },
  {
    id: "pp-use-state-lazy-initializer-exam",
    moduleLabel: "Hooks",
    quiz: {
      question:
        "`useState(() => ilkDeger)` yazımında `ilkDeger` hangi sıklıkta hesaplatılmayı hedefler?",
      choices: [
        "İlk oluşturmada bir kez; pahalı hesabı gereksiz yere yeniden yapmayı engeller",
        "Her oluşturmada yeniden hesaplatmak için",
        "Yalnızca ilgili `useEffect` koşmasıyla",
        "`useReducer` zorladığı zamanlarda sı yalnızca",
      ],
      correctAnswer:
        "İlk oluşturmada bir kez; pahalı hesabı gereksiz yere yeniden yapmayı engeller",
    },
  },
  {
    id: "pp-fragment-shorthand-tip",
    moduleLabel: "JSX",
    quiz: {
      question:
        "`React.Fragment` yerine ekstra DOM düğümü eklemeden kullanılacak JSX sözdizimi kısaltması hangisiyle gösterilir?",
      choices: [
        "`ReactDOM.createPortal` kısaltılmışıdır",
        "`React.Fragment` için sözdizimi kısaltmasıdır",
        "`Suspense` yer tutucusu olarak çalışır",
        "`React.memo` sarmayıcısıdır",
      ],
      correctAnswer: "`React.Fragment` için sözdizimi kısaltmasıdır",
    },
  },
  {
    id: "pp-use-callback-deps",
    moduleLabel: "Hooks",
    quiz: {
      question:
        "`useCallback(fn, [])` yazıldığında `fn` için hangisi beklenmelidir?",
      choices: [
        "Her oluşturmada yeni `fn`; boş liste sadece bellek artırımı olarak önerilir",
        "Kapamada kullanılmayan stabil değerler bile varsa doğru bağımlılıksız yaklaşımdır garanti olarak",
        "Boş dizi ilk oluşturmadaki `fn` ile kapanmış kalır; sonradan bileşenden gelen değer gerekiyorsa bağımlılıklara dahil etmek gerekebilir",
        "`useCallback` diğer hook’ların kurallarından muaftır ve koşullu çağrılabilir",
      ],
      correctAnswer:
        "Boş dizi ilk oluşturmadaki `fn` ile kapanmış kalır; sonradan bileşenden gelen değer gerekiyorsa bağımlılıklara dahil etmek gerekebilir",
    },
  },
  {
    id: "pp-use-memo-deps-changes",
    moduleLabel: "Hooks",
    quiz: {
      question:
        "`useMemo(() => costly(a), [a])` içinde bağımlılık `a` değişince ne olması beklenir?",
      choices: [
        "`costly(a)` seçilen önbellekten okunur; tekrar hesap yapılmaz",
        "`a` için referans eşitsizlik değişirse seçici yeniden çalıştırılıp döndürülen değer güncellenir",
        "`useMemo` yalnızca `StrictMode` dışında anlam taşır son sürümde",
        "Bağımlılık liste boş ise `a` bile değişse sonuç aynı kalır her zaman garanti olarak",
      ],
      correctAnswer:
        "`a` için referans eşitsizlik değişirse seçici yeniden çalıştırılıp döndürülen değer güncellenir",
    },
  },
  {
    id: "pp-use-layout-effect-vs-effect",
    moduleLabel: "Hooks",
    quiz: {
      question:
        "`useEffect` ile `useLayoutEffect` için tetiklenme zamanıyla ilgili doğru ayrım hangisidir?",
      choices: [
        "`useLayoutEffect` DOM güncellemesinden sonra ve tarayıcı boyamasından önce senkron çalışır; ölçüm veya giderek titreme gibi durumlarda göz önüne alınır.",
        "İkisi aynı anda ve aynı sırada çalışır; seçim önemsizdir.",
        "`useEffect` yalnızca sınıf bileşenlerinde kullanılabilir.",
        "`useLayoutEffect` yalnızca sunucu tarafında (SSR) güvenlidir.",
      ],
      correctAnswer:
        "`useLayoutEffect` DOM güncellemesinden sonra ve tarayıcı boyamasından önce senkron çalışır; ölçüm veya giderek titreme gibi durumlarda göz önüne alınır.",
    },
  },
  {
    id: "pp-prop-drilling-tradeoff",
    moduleLabel: "Mimari",
    quiz: {
      question:
        "Orta derinlikte ara bileşenlere gereksiz yere `prop` iletme (prop drilling) en çok hangi konu olarak ele alınır?",
      choices: [
        "Çoğu durumda yalın ve okunaklı yaklaşım olmasına karşın derin yapılarda sık sık gereksiz aracı parametre oluşturan bakım külfeti",
        "Tek doğru yaklaşım olduğu için asla bağlam veya yükselmiş state gerektirmez",
        "SSR ile uyumsuz olduğu için yasaktır",
        "`key` atamakla doğrudan çözülür",
      ],
      correctAnswer:
        "Çoğu durumda yalın ve okunaklı yaklaşım olmasına karşın derin yapılarda sık sık gereksiz aracı parametre oluşturan bakım külfeti",
    },
  },
  {
    id: "pp-composition-vs-inheritance-react",
    moduleLabel: "Bileşenler",
    quiz: {
      question:
        "React’te yeni varyasyonlar için sınıf kalıtımından çok hangi yaklaşım öne çıkar?",
      choices: [
        "`extends` ile bileşen hiyerarşisini sürekli derinleştirmek",
        "Özellikler ve bileşik çocuklarla kompozisyon (children veya doğrudan prop bileşenleri)",
        "Global `window.ReactView` yazmak",
        "`dangerouslySetInnerHTML` kullanarak şablonu zorlamak",
      ],
      correctAnswer:
        "Özellikler ve bileşik çocuklarla kompozisyon (children veya doğrudan prop bileşenleri)",
    },
  },
  {
    id: "pp-refs-not-for-state-general",
    moduleLabel: "useRef",
    quiz: {
      question:
        "Ekranda güncellenmesi gereken bir sayaç (tıklama sayısı) için en yaygın doğru model hangisidir?",
      choices: [
        "`useRef` ile tutmak; `.current` artınca React otomatik yeniden çizer",
        "`useState` ile tutup `setState` ile güncellemek",
        "DOM’a doğrudan `innerHTML += 1` yazmak",
        "`useMemo` ile sıfır bağımlılıkta türetmek",
      ],
      correctAnswer: "`useState` ile tutup `setState` ile güncellemek",
    },
  },
  {
    id: "pp-async-in-effect-cleanup-race",
    moduleLabel: "useEffect",
    quiz: {
      question:
        "`useEffect` içinde başlatılan asenkron iş, bileşen unmount olduktan sonra tamamlanırsa tipik risk ne olur?",
      choices: [
        "React fetch’i otomatik olarak iptal ettiği için risk yoktur",
        "Unmount sonrası `setState` çağrısı uyarı veya beklenmeyen güncellemelere yol açabilir; iptal/abonelik veya bayrakla korunmak gerekir",
        "`StrictMode` üretimde tüm asenkron işleri durdurur",
        "Konsola yazılan sıra her zaman gerçek sırayı garanti eder",
      ],
      correctAnswer:
        "Unmount sonrası `setState` çağrısı uyarı veya beklenmeyen güncellemelere yol açabilir; iptal/abonelik veya bayrakla korunmak gerekir",
    },
  },
  {
    id: "pp-event-pooling-legacy-note",
    moduleLabel: "Olaylar",
    quiz: {
      question:
        "Eski React sürümlerinde (sentetik olay havuzu dönemi) olay nesnesine `setTimeout` ile ertelenmiş kodda erişmenin sorun çıkarması genelde neyle açıklanırdı?",
      choices: [
        "Olay nesnesi yeniden kullanıldığı için asenkron blokta alanlar artık güvenilir olmayabilirdi",
        "`preventDefault` yalnızca `useEffect` içinde çağrılabilirdi",
        "`stopPropagation` doğal DOM’da yasaktı",
        "React’ın capture aşaması yoktu",
      ],
      correctAnswer:
        "Olay nesnesi yeniden kullanıldığı için asenkron blokta alanlar artık güvenilir olmayabilirdi",
    },
  },
  {
    id: "pp-typescript-react-props-optional",
    moduleLabel: "Tip",
    quiz: {
      question:
        "`title?: string` olan bir prop’u JSX içinde koşullu göstermek için hangisi uygundur?",
      choices: [
        "`title` her zaman tanımlıdır; doğrudan `{title}` yeterlidir",
        "`title && <h1>{title}</h1>` veya benzeri koşullu render",
        "`any` kullanmak tip güvenliği için tercih edilir",
        "`exactOptionalPropertyTypes` bu sorunu otomatik çözer",
      ],
      correctAnswer: "`title && <h1>{title}</h1>` veya benzeri koşullu render",
    },
  },
  {
    id: "pp-relative-import-boundary-note",
    moduleLabel: "Mimari",
    quiz: {
      question:
        "Çok düzeyli `../../../` import yollarını azaltmak ve modüller arası bağı gevşetmek için sık kullanılan yöntemlerden hangisi uygundur?",
      choices: [
        "`@/` veya `src/` için yol takma adları (alias) ve net klasör/dosya sınırları tanımlamak",
        "Tüm import’ları doğrudan `window` nesnesinden okumak",
        "Dosya içi `eval` ile modül seçmek",
        "`key` özelliği ile dinamik import yolu vermek",
      ],
      correctAnswer:
        "`@/` veya `src/` için yol takma adları (alias) ve net klasör/dosya sınırları tanımlamak",
    },
  },
  {
    id: "pp-tailwind-vs-inline-styles-react",
    moduleLabel: "Stil",
    quiz: {
      question:
        "Bu projede olduğu gibi Tailwind yardımcı sınıfları (`className`) kullanmanın satır içi `style={{}}`’e göre yaygın avantajı nedir?",
      choices: [
        "Tema, aralık ve tipografi tutarlılığını token/sınıf setiyle toparlamak",
        "Her stil değişiminde React’ın sanal DOM’u devre dışı kalır",
        "Satır içi stil her zaman erişilebilirlik açısından üstündür",
        "`className` yalnızca sunucu tarafında çalışır",
      ],
      correctAnswer:
        "Tema, aralık ve tipografi tutarlılığını token/sınıf setiyle toparlamak",
    },
  },
  {
    id: "pp-vite-vs-cra-modern-bundling",
    moduleLabel: "Araç",
    quiz: {
      question:
        "Vite tabanlı geliştirme sunucusunun klasik webpack tabanlı dev sunuculara göre sık vurgulanan farkı hangisidir?",
      choices: [
        "Geliştirmede native ESM ve hızlı HMR; üretimde genelde Rollup ile paketleme",
        "Geliştirmede her istekte tüm uygulamayı tek seferde paketlemek zorunluluğu",
        "Yalnızca CommonJS modüllerini desteklemesi",
        "`npm` olmadan çalışması",
      ],
      correctAnswer:
        "Geliştirmede native ESM ve hızlı HMR; üretimde genelde Rollup ile paketleme",
    },
  },
  {
    id: "pp-react-19-async-transition-preview",
    moduleLabel: "Sunum",
    quiz: {
      question:
        "`startTransition` ile sarılan state güncellemeleri React’ın eşzamanlılık modelinde nasıl konumlanır?",
      choices: [
        "Acil (ör. yazı girişi) güncellemelere göre düşük öncelikli ve kesintiye uğrayabilir iş olarak işlenebilir",
        "Her zaman senkron ve engelleyici şekilde önce çalışır",
        "`flushSync` ile aynı anlama gelir",
        "Yalnızca sınıf bileşenlerinde tanımlıdır",
      ],
      correctAnswer:
        "Acil (ör. yazı girişi) güncellemelere göre düşük öncelikli ve kesintiye uğrayabilir iş olarak işlenebilir",
    },
  },
  {
    id: "pp-csp-vs-inline-script-edu",
    moduleLabel: "Güvenlik",
    quiz: {
      question:
        "Katı içerik güvenliği politikasında (Content-Security-Policy) `unsafe-inline` kapatılırsa ne sık sık engellenir?",
      choices: [
        "Şartsız satır içi `<script>...</script>` ve çoğu satır içi olay özelliği",
        "Yalnızca HTTPS istekleri",
        "Yalnızca üçüncü taraf CDN’leri",
        "Yalnızca `className` kullanımı",
      ],
      correctAnswer:
        "Şartsız satır içi `<script>...</script>` ve çoğu satır içi olay özelliği",
    },
  },
  {
    id: "pp-synthetic-vs-native-events",
    moduleLabel: "Olaylar",
    quiz: {
      question:
        "React’ta `onClick` gibi JSX olayları ile ilgili doğru ifade hangisidir?",
      choices: [
        "Doğrudan DOM’daki `addEventListener` ile birebir aynı olay nesnesini verir; fark yoktur",
        "Olaylar genelde sentetik sarmalayıcı üzerinden yönetilir; davranış ve özellikler doğal olayla her zaman özdeş değildir",
        "React 18’den itibaren `onClick` kullanımı yasaktır",
        "`onClickCapture` diye bir kavram yoktur",
      ],
      correctAnswer:
        "Olaylar genelde sentetik sarmalayıcı üzerinden yönetilir; davranış ve özellikler doğal olayla her zaman özdeş değildir",
    },
  },
  {
    id: "pp-dangerously-inner-html-reminder",
    moduleLabel: "Güvenlik",
    quiz: {
      question:
        "`dangerouslySetInnerHTML` ile ham HTML basarken hangi risk özellikle vurgulanır?",
      choices: [
        "Sanitize edilmemiş `__html` içeriğinin XSS riski oluşturması",
        "`key` özniteliğinin eksik kalması",
        "`className` değişkeninin fazla uzun olması",
        "`React.lazy` içe aktarımının başarısız olması",
      ],
      correctAnswer: "Sanitize edilmemiş `__html` içeriğinin XSS riski oluşturması",
    },
  },
]

export const PRACTICE_PATH_STEP_IDS: readonly string[] = PRACTICE_PATH_STEPS.map(
  (s) => s.id,
)
