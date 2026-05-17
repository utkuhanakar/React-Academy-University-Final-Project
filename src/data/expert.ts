import type { Lesson } from '../types'

/** Uzman konular ve kapanış için geniş kod laboratuvarı. */
export const expertLessons: Lesson[] = [
  {
    id: 'expert-use-reducer',
    moduleId: 'expert',
    title: 'useReducer (Karmaşık State Yönetimi)',
    difficulty: 'ileri',
    content: `
## useReducer ne zaman?

\`useState\` birden çok alt alanın birbirine bağlı güncellendiği senaryolarda kalabalıklaşabilir. **useReducer**, güncellemeyi **aksiyon + reducer** ile merkezi bir fonksiyona taşır; “önce elimizi çevir, sonra state’i türet” düşüncesi reducer ile netleşir.

## Temel imza

\`const [state, dispatch] = useReducer(reducer, baslangicState)\` — dispatch yalnızca **aksiyon nesnesi** (genelde \`{ type, payload? }\`) gönderir; asıl iş kuralları \`reducer(state, action)\` içindedir.

## Immutable güncelleme

Reducer **yeni state** döndürmelidir; eski state’i mutasyona uğratmayın. İç içe nesnelerde spread veya küçük yardımcılar tercih edilir.

> **İpucu:** “useState ile useReducer seçimi?” — Basit skaler veya tek nesne: useState; çok adımlı, raporlanabilir iş kuralları: reducer daha okunaklı olabilir.

> **İpucu:** “Reducer saf fonksiyon mu?” — Evet; yan etki, API çağrısı reducer içinde **olmalı değildir**; yan etkiler useEffect / event handler’da kalır.
`.trim(),
    codeExamples: [
      {
        title: 'Sayaç: increment / decrement',
        code: `type Aksiyon =
  | { type: 'arttir' }
  | { type: 'azalt' }
  | { type: 'sifirla' }

function sayacReducer(durum: number, aksiyon: Aksiyon): number {
  switch (aksiyon.type) {
    case 'arttir':
      return durum + 1
    case 'azalt':
      return durum - 1
    case 'sifirla':
      return 0
  }
}`,
      },
      {
        title: 'Form nesnesi (birleşik alan)',
        code: `type Form = { ad: string; eposta: string; adim: number }

type FA =
  | { type: 'degistir'; alan: keyof Omit<Form, 'adim'>; deger: string }
  | { type: 'ileri' }

function formReducer(s: Form, a: FA): Form {
  if (a.type === 'degistir') {
    return { ...s, [a.alan]: a.deger }
  }
  return { ...s, adim: Math.min(s.adim + 1, 2) }
}`,
      },
    ],
    quiz: {
      question:
        'useReducer ile ilgili aşağıdakilerden hangisi doğrudur?',
      choices: [
        'Reducer içinde doğrudan API isteği atılmalıdır; bu React’in resmi desenidir',
        'Reducer saf bir fonksiyon olmalı ve genellikle yeni state döndürmek için immutability ile çalışır',
        'dispatch çağrıları asenkron olarak sıraya alınmaz; senkron işler',
        'useReducer yalnız class bileşenlerinde kullanılabilir',
      ],
      correctAnswer:
        'Reducer saf bir fonksiyon olmalı ve genellikle yeni state döndürmek için immutability ile çalışır',
    },
    dragOrderActivity: {
      title: 'Alıştırma sırası — reducer tasarımı',
      description:
        'Kod sırasından önce bu düzeni kurmak tekrarlarda ve uzun süreli projelerde zaman kazandırır.',
      items: [
        {
          id: 'shape',
          text: 'State şeklini ve olası aksiyon türlerini netleştir',
        },
        {
          id: 'pure',
          text: 'saf reducer(prev, action) → nextState yaz (mutasyon yok)',
        },
        {
          id: 'dispatch',
          text: 'Olay işleyicide dispatch({ type: ... }) ile güncelle',
        },
      ],
      correctOrderIds: ['shape', 'pure', 'dispatch'],
    },
    challenge: {
      initialCode: `import { useReducer } from 'react'

type S = { deger: number }
type A = { type: 'carp2' } | { type: 'ekle'; n: number }

function r(s: S, a: A): S {
  if (a.type === 'carp2') return { deger: s.deger * 2 }
  return { deger: s.deger + a.n }
}

export default function App() {
  const [s, d] = useReducer(r, { deger: 1 })
  return (
    <div style={{ fontFamily: 'system-ui', padding: 12 }}>
      <p>{s.deger}</p>
      <button type="button" onClick={() => d({ type: 'ekle', n: 3 })}>
        +3
      </button>
      <button type="button" onClick={() => d({ type: 'carp2' })}>
        ×2
      </button>
    </div>
  )
}`,
      expectedOutputDescription:
        'Sayı düğmelerle değişmeli; reducer ile useReducer kullanımı korunmalı.',
    },
  },
  {
    id: 'expert-context-detay',
    moduleId: 'expert',
    title: 'Context API Detayları',
    difficulty: 'ileri',
    content: `
## Provider ve value

\`Context.Provider\` her seviyede sarılabilir; **en yakın** Provider’ın \`value\`’su \`useContext\` ile okunur. Varsayılan değer (\`createContext(bos)\`), Provider dışında test/debug içindir.

## Neden yeniden render?

Context **value** referansı değiştiğinde, bu context’i tüketen bileşenler güncellenir. Her render’da \`value={{ a: 1 }}\` yazmak **yeni nesne** ürettiği için gereksiz render dalgalanması yaratabilir; \`useMemo\` ile value’yu stabilize etmek klasik optimizasyondur.

## Context ≠ global Redux

Context veri **tekilleştirme** ve **prop drilling azaltma** içindir; yüksek frekanslı güncellenecek veriyi kökten aşağı itmek performansı zorlayabilir — state parçalama (\`useState\` + props, veya küçük context’ler) düşünülür.

> **İpucu:** “context.splitting” — Kimlik / tema / locale ayrı context; tek dev context yerine.

> **İpucu:** “Consumer vs useContext?” — Sınıflarda Consumer; fonksiyonlarda useContext modern yol.
`.trim(),
    codeExamples: [
      {
        title: 'İki Provider iç içe',
        code: `const Tema = createContext<'acik' | 'koyu'>('acik')
const Dil = createContext<'tr' | 'en'>('tr')

function Sayfa() {
  const tema = useContext(Tema)
  const dil = useContext(Dil)
  return (
    <p style={{ color: tema === 'koyu' ? '#fff' : '#111' }}>
      {dil === 'tr' ? 'Merhaba' : 'Hello'}
    </p>
  )
}`,
      },
    ],
    quiz: {
      question:
        'Context Provider’da `value` her render’da yeni bir nesne olarak verilirse aşağıdakilerden hangisi beklenir?',
      choices: [
        'Context kullanan alt bileşenler hiç yeniden render olmaz',
        'Context’i dinleyen bileşenler değer referansı değiştiği için sık sık yeniden render olabilir',
        'React otomatik olarak referans eşitliğini yok sayar',
        'Sadece sınıf bileşenleri etkilenir',
      ],
      correctAnswer:
        "Context’i dinleyen bileşenler değer referansı değiştiği için sık sık yeniden render olabilir",
    },
    clozeActivity: {
      title: 'Context performans özeti',
      text: '`value` olarak her render’da yeni bir nesne vermek güncellenen tüketicilerde sık ____ yaratır; value’yu sabitlemek için projede sıkça ____ kullanılır.',
      blanks: [{ accepted: ['yeniden render'] }, { accepted: ['useMemo'] }],
      wordBank: ['yeniden render', 'useMemo', 'useRef', 'forEach'],
    },
    challenge: {
      initialCode: `import { createContext, useContext, useState } from 'react'

const SayacCtx = createContext<{
  n: number
  artir: () => void
} | null>(null)

function Icerik() {
  const s = useContext(SayacCtx)
  if (!s) return null
  return (
    <button type="button" onClick={s.artir}>
      {s.n}
    </button>
  )
}

export default function App() {
  const [n, setN] = useState(0)
  const deger = { n, artir: () => setN((x) => x + 1) }
  return (
    <SayacCtx.Provider value={deger}>
      <Icerik />
    </SayacCtx.Provider>
  )
}`,
      expectedOutputDescription:
        'SayacCtx ile sayaç tıklanınca artmalı; Provider value nesnesi korunmalı.',
    },
  },
  {
    id: 'expert-portals',
    moduleId: 'expert',
    title: 'React Portals (Modal Yapımı)',
    difficulty: 'ileri',
    content: `
## createPortal

\`createPortal(oc, domDugumu)\` aynı React ağacında kalırken DOM’da **farklı bir konteynere** çizim yapar. Modal, tooltip, bildirim çekmecesi için sık kullanılır; **event bubbling** React ağacına göre çalışmaya devam eder.

## Erişilebilirlik

Modalda \`role="dialog"\`, odak tuzağı (\`aria-modal\`), kapatma ve Escape ile kapanma erişilebilir ve profesyonel arayüzlerde sık beklenen detaylardır.

## z-index ve taşma

Portal hedefi genelde \`document.body\` altında \`position: fixed\` bir sarmalayıcıdır; böylece üst öğenin \`overflow: hidden\`’ından kurtulur.

> **İpucu:** “Portal neden event parent’ta yakalanır?” — Fiber ağacı hala üst bileşenin altında; DOM ebeveynliği farklı olsa da sentetik olay kabarcıklanması React ağacına göre düşünülür.

> **İpucu:** “SSR ve portal hedefi?” — Sunucuda \`document\` yoktur; hedef düğümü sadece istemci tarafında oluşturun / guard edin.
`.trim(),
    codeExamples: [
      {
        title: 'Minimal modal taşıma',
        code: `import { createPortal } from 'react-dom'

function Modal({ acik, cocuk }: { acik: boolean; cocuk: React.ReactNode }) {
  if (!acik) return null
  return createPortal(
    <div className="modal-root">{cocuk}</div>,
    document.body,
  )
}`,
      },
    ],
    quiz: {
      question: 'createPortal kullanımının başlıca amacı nedir?',
      choices: [
        'React bileşenlerini tamamen React dışına çıkarmak ve olayları durdurmak',
        'Aynı React ağacını koruyarak bileşeni DOM’da farklı bir düğüm altında canlandırmak',
        'Sadece CSS animasyonlarını hızlandırmak',
        'Virtual DOM’u devre dışı bırakmak',
      ],
      correctAnswer:
        'Aynı React ağacını koruyarak bileşeni DOM’da farklı bir düğüm altında canlandırmak',
    },
    dragOrderActivity: {
      title: 'Portal kurulum sırası (özet)',
      items: [
        { id: 'need', text: 'DOM’da ayrı bir köke ihtiyaç olduğundan emin ol (modal vb.)' },
        { id: 'target', text: 'Hedef düğümü seç (çoğunlukla document.body altı)' },
        { id: 'call', text: 'createPortal(icerik, hedefDugum) ile çiz' },
      ],
      correctOrderIds: ['need', 'target', 'call'],
    },
    challenge: {
      initialCode: `import { useState } from 'react'
import { createPortal } from 'react-dom'

function ModalIci() {
  return (
    <div
      style={{
        padding: 24,
        background: '#1e1e2e',
        color: '#fff',
        borderRadius: 12,
        minWidth: 280,
      }}
    >
      Portal içeriği
    </div>
  )
}

export default function App() {
  const [acik, setAcik] = useState(false)
  return (
    <div style={{ padding: 12, fontFamily: 'system-ui' }}>
      <button type="button" onClick={() => setAcik(true)}>
        Modal aç
      </button>
      {acik
        ? createPortal(
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,.5)',
                display: 'grid',
                placeItems: 'center',
              }}
              onClick={() => setAcik(false)}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <ModalIci />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}`,
      expectedOutputDescription:
        'Modal createPortal ile body altında açılmalı; arka plan tıklanınca kapanmalı.',
    },
  },
  {
    id: 'expert-error-boundaries',
    moduleId: 'expert',
    title: 'Error Boundaries (Hata Yakalama)',
    difficulty: 'ileri',
    content: `
## Sınıf bileşeni zorunluluğu

**Error boundary** şu an için **yalnızca sınıf bileşeninde** \`static getDerivedStateFromError\` ve/veya \`componentDidCatch\` ile kurulur (deneysel hook’lar dışında). Yakalanan hatalar: render, yaşam döngüsü, alt ağaçtaki constructor’lar; **olay işleyici** ve asenkron kod doğrudan yakalanmaz.

## Granüler sarma

Uygulamayı tek bir kök boundary ile sarmalamak “beyaz ekran”ı önler; modül bazında sarma daha iyi izolasyon sağlar.

## Fallback UI

Kullanıcıya “bir şey kırıldı, yenile veya geri dön” mesajı; prod’da hata raporlama servisine \`componentDidCatch\` içinde log isteği.

> **İpucu:** “Neden hook handler hataları boundary’e düşmez?” — Boundary yakalama modeli render/lifecycle hatalarına odaklanır; handler için try/catch kullanılır.

> **İpucu:** “getDerivedStateFromError vs didCatch?” — Biri state güncellemesi için; diğeri yan etki / log için.
`.trim(),
    codeExamples: [
      {
        title: 'Sınıf boundary iskeleti',
        code: `import { Component, type ErrorInfo, type ReactNode } from 'react'

type P = { children: ReactNode }
type S = { hasError: boolean }

export class HataSiniri extends Component<P, S> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error(err, info.componentStack)
  }

  render() {
    if (this.state.hasError) return <p>Panel kurtarılamadı.</p>
    return this.props.children
  }
}`,
      },
    ],
    quiz: {
      question:
        'Error boundary’ler hangi hata türlerini varsayılan olarak yakalar?',
      choices: [
        'Tüm Promise reddleri ve useEffect içindeki tüm hatalar',
        'Render ve yaşam döngüsü metotlarında oluşan hatalar (çocuk ağaçta); olay işleyici içindeki hatalar doğrudan kapsanmaz',
        'Yalnızca strict mode uyarıları',
        'Yalnızca CSS ile ilgili hatalar',
      ],
      correctAnswer:
        'Render ve yaşam döngüsü metotlarında oluşan hatalar (çocuk ağaçta); olay işleyici içindeki hatalar doğrudan kapsanmaz',
    },
    dragOrderActivity: {
      title: 'Error boundary kurulum sırası',
      items: [
        { id: 'class', text: 'Sınıf bileşeninde getDerivedStateFromError / didCatch tanımla' },
        { id: 'wrap', text: 'Riskli alt ağacı boundary ile sar' },
        { id: 'fallback', text: 'State hata ise kullanıcıya fallback UI göster' },
      ],
      correctOrderIds: ['class', 'wrap', 'fallback'],
    },
    challenge: {
      initialCode: `import { useState } from 'react'
import { Component, type ReactNode } from 'react'

function Bozulan() {
  throw new Error('demo')
  return null
}

type P = { children: ReactNode }
type S = { hata: boolean }

class Sinir extends Component<P, S> {
  state: S = { hata: false }

  static getDerivedStateFromError() {
    return { hata: true }
  }

  render() {
    if (this.state.hata) {
      return <p style={{ color: 'crimson' }}>Yakalandı: alt bileşen hata verdi.</p>
    }
    return this.props.children
  }
}

export default function App() {
  const [goster, setGoster] = useState(false)
  return (
    <div style={{ padding: 12, fontFamily: 'system-ui' }}>
      <button type="button" onClick={() => setGoster(true)}>
        Hata üret
      </button>
      <Sinir>{goster ? <Bozulan /> : <span>Henüz yok</span>}</Sinir>
    </div>
  )
}`,
      expectedOutputDescription:
        "Düğmeye basıldığında hata mesajı boundary'de yakalanıp 'Yakalandı' metni görünmeli.",
    },
  },
  {
    id: 'expert-site-mimarisi',
    moduleId: 'expert',
    title: 'Bu uygulama içeriği nasıl örgütlenmiş? (repo turu)',
    difficulty: 'orta',
    content: `
## Tek cümle

Bu tek sayfa bir **React + Vite** uygulamasıdır; ders içerikleri \`src/data/**\` içinde saklanır, \`src/App.tsx\` hangi ana panelde (ders, stüdyo veya modül özeti) olduğunu seçer ve \`lesson\` seçimleri \`LessonWorkspace\` ile çizilir.

## Girdi noktası

- \`index.html\`: geliştirme sunucusunun bağladığı tek sayfa.
- \`src/main.tsx\`: React kök oluşturur; genelde tema ve sık sık yeniden oluşturmada üst bileşeni sarar (\`StrictMode\`).

## Nereden ders okunuyor?

- \`src/data/intro.ts\`, \`components.ts\`, \`hooks.ts\` vb. düz diziler olarak \`Lesson\` kayıtları üretir.
- \`src/data/lessons.ts\`: bu dizileri **birleştirir** — uygulama genel sırası burada belirlenir.
- Böylece yeni madde için çoğu zaman \`lesson\` kaydı yazıp \`lessons.ts\`'e eklemeniz ve **benzersiz** \`id\` vermeniz yeterlidir.

## Bileşenler

| Dosya | Rol |
| :--- | :--- |
| \`App.tsx\` | Panel anahtarı, arama filtresi, ilerlemeyle senk |
| \`LessonWorkspace.tsx\` | Tek ders: Markdown, kod, bilgi sınamaları ve etkinlikler |
| \`SkillsStudioPage.tsx\` | Peş peşe yol, hatırlatıcı kartlar |
| \`Sidebar.tsx\` | Modül düzeninde liste |
| \`hooks/useSyncedLearningProgress.ts\` | Yerel + isteğe bağlı bulutta ilerleyiş |

Tailwind için sınıflar doğrudan \`className\` olarak kullanılmıştır (\`tailwind.config*\` tema çizgisiyle uyumlu).

## Siz projeyi uzatırken

Yeni özellik: önce bileşeni \`components/\` içinde çıkarın, veri gerekiyorsa \`types\` ile sözleşmeyi netleştirin ve \`hooks\`'a bağlayın — bu repodaki mevcut desen böyle sürdürülebilir.
`.trim(),
    codeExamples: [
      {
        title: 'Dosya bağlantısı: ders dizisinden App’e kadar iz',
        caption: 'Parça parça küçük modüller → tek bileşişik liste',
        code: `// Örnek: lessons.ts yapısı
import { introLessons } from './intro'

export const lessons = [...introLessons /* diğer modüller */]

// App.tsx (özet)
import { lessons } from './data/lessons'

export default function App() {
  const active = lessons.find((l) => l.id === kimlikSecimi)
  return /* … */
}`,
      },
    ],
    quiz: {
      question:
        'Bu projede ders sırasının (hangi gösterim sırasına göre sıralanılacağının) net tanımı için hangi dosya birincildir?',
      choices: [
        '`package.json`; script listesi sırayı seçer.',
        '`src/data/lessons.ts`; modül dosyalarından gelen diziler tek yerde birleştirilir.',
        '`tailwind.config.ts`; sıra alfabetik seçilir.',
        '`index.css`; her ders seçici ile listelenmiştir.',
      ],
      correctAnswer:
        '`src/data/lessons.ts`; modül dosyalarından gelen diziler tek yerde birleştirilir.',
    },
    clozeActivity: {
      title: 'Bu repo’nun yapısı',
      text: 'Ders sırasının birleştirildiği birincil dosya ____ iken tema ve bileşen yerleşimi için ____ altı kullanılır.',
      blanks: [{ accepted: ['lessons.ts', 'src/data/lessons.ts'] }, { accepted: ['src/components/', 'components/'] }],
      wordBank: ['lessons.ts', 'src/components/', 'package.json', 'index.html'],
    },
    challenge: {
      initialCode: `export default function ProjeOzeti() {
  return (
    <div style={{ fontFamily: 'system-ui', padding: 14, maxWidth: 560 }}>
      <h2>Mini öz</h2>
      <ul>
        <li>Veri klasörüm: src/data (çok öğeler)</li>
        <li>Birincil seçici: lessons.ts</li>
        <li>Düzeni taşıyan: App.tsx</li>
      </ul>
      <p>
        Görevin: bu listeye <strong>bir gözden geçirdiğim bileşen</strong>{' '}
        (örn. Sidebar) ekleyerek satır daha yaz.
      </p>
    </div>
  )
}`,
      expectedOutputDescription:
        'Özet metni önizlemede görünmeli ve listeye `Sidebar`, `SkillsStudioPage` veya `LessonWorkspace` gibi bu repodaki bir bileşen adı daha eklenmeli.',
    },
  },
  {
    id: 'expert-performans-ve-bundle',
    moduleId: 'expert',
    title: 'Performans: useMemo ve kod bölme (lazy + Suspense fikri)',
    difficulty: 'ileri',
    content: `
## Neden ilk paket küçültülmeli?

Kullanıcı her şeyi aynı anda indirmek zorunda kalmamalıdır. Büyük grafikleri, üçüncü parti editörleri veya “bir sekmede açılacak laboratuvar”ı \`React.lazy\` ile **yüklenince getirilir** yapabilirsiniz; etrafına \`<Suspense fallback={...}>\` koymak kullanıcıya boş bekletmez.

## useMemo / memo

Çok pahalı **saf hesapları** gereksiz yere yeniden yapmayın. \`memo\`, prop’ları değişmeyince çocuk render’ını atlayabilir — ama yanlış her yere “optimizasyon” koymak okunabilirliği düşürür.

## Ölçekleme sırası

1. Çalışan doğru bileşeni önce doğrulayın.  
2. Gerçek cihaz / Lighthouse / Profiler ile darboğazı bulun.  
3. Gerekirse lazy bölün veya gereksiz re-render kesin — erken mikro-opt’tan kaçının.

> **İpucu:** Bu repoda \`npm run build\` çıktısında uyarı çıkması normal; paketi bölmek performans iyileştirmesinin bir parçasıdır.
`.trim(),
    codeExamples: [
      {
        title: 'Ana yüklemeden ayırmayı düşünmek (isimsiz öz)',
        caption: '`lazy` + dinamik `import()` genelde sekme veya modal rotası ile bağlanır',
        code: `// Öz fikir: ihtiyaç olunca yükle
const BuyukLabor = lazy(() => import('./BuyukLabor'))

function Kok() {
  return (
    <Suspense fallback={<p>Yükleniyor…</p>}>
      <BuyukLabor />
    </Suspense>
  )
}`,
      },
      {
        title: 'Pahalı türetin',
        caption: '`useMemo` saf hesaplama için uygun seçim düşünülebilir',
        code: `const filtrelenmis = useMemo(
  () => kayitlar.filter((k) => k.puan >= esik),
  [kayitlar, esik],
)`,
      },
    ],
    quiz: {
      question:
        '`React.lazy` ile dinamik `import()` bir arada kullanıldığında ağaçta tipik olarak ne beklenir?',
      choices: [
        'Bileşen sunucuda önceden derlenmez; SSR her zaman iptal olur.',
        'Varsayılan export edilen bileşen, kod ihtiyaç doğunca yüklenen parçadan gelir.',
        'CSS dosyası artık yüklenemez.',
        'Hook kuralları ihlali otomatik kabul olur.',
      ],
      correctAnswer:
        'Varsayılan export edilen bileşen, kod ihtiyaç doğunca yüklenen parçadan gelir.',
    },
    dragOrderActivity: {
      title: 'Alıştırma sırası — yükleme bütçesi',
      description: 'Önce doğru sonra hızlı: tipik sıra.',
      items: [
        {
          id: 'chunk',
          text: 'Gerçekten büyük modülü lazy + dinamik import ile kenara al',
        },
        { id: 'suspense', text: 'Kullanıcıya fallback için Suspense sınırı ekle' },
        { id: 'verify', text: 'Build ve istemci ölçümü ile farkını doğrula' },
      ],
      correctOrderIds: ['chunk', 'suspense', 'verify'],
    },
    challenge: {
      initialCode: `import { memo, useMemo, useState } from 'react'

/** Pahalı türetin gibi düşün: n kareleri */
function kareleriHesap(n: number) {
  let s = 0
  for (let i = 0; i <= n; i += 1) s += i * i
  return s
}

const Satir = memo(function Satir({ etiket, deger }: { etiket: string; deger: number }) {
  return (
    <span>
      {etiket}: {deger}
    </span>
  )
})

export default function App() {
  const [n, setN] = useState(4)
  const toplamKareler = useMemo(() => kareleriHesap(n), [n])

  return (
    <div style={{ fontFamily: 'system-ui', padding: 12 }}>
      <button type="button" onClick={() => setN((x) => (x >= 12 ? 0 : x + 1))}>
        n artır/az
      </button>
      <p style={{ marginTop: 12 }}>
        <Satir etiket="0..n kareleri toplamı" deger={toplamKareler} />
      </p>
    </div>
  )
}`,
      expectedOutputDescription:
        'useMemo ile kareleriHesap n’ye bağlı kalmalı; Satir memo ile sarılı ve buton ile n ve toplam değişmeli.',
    },
  },
  {
    id: 'expert-testing-rtl-paradigma',
    moduleId: 'expert',
    title: 'Bileşen testleri — React Testing Library düşüncesi',
    difficulty: 'ileri',
    content: `
## Ne test edilir?

Kullanıcının gördüğü metin, düğmenin görünür etiketi ve **erişilebilir rol**: \`screen.getByRole('button', { name: /kaydet/i })\`.

## Anti-pattern

Üretim bileşenine yalnızca test için \`data-testid\` sızdırmadan önce mümkünse roller ve görünür metin seçin — erişilebilirlik ve test aynı hizaya gelir.

## Vitest veya Jest

Bu öğrenme ortamında yerleşik test koşucusu yok; yine de **derleyici + test ortamı + RTL** bileşiklerinin rolünü ayırmak yaygın olarak sorulur.

> **İsteğe bağlı:** Kendi projenizde küçük bir düğmenin görünümünü doğrulayan kısa bir test taslağı çıkarabilirsiniz — burada doğrulanmaz, kendi araç zincirinizi pekiştirmek içindir.
`.trim(),
    codeExamples: [
      {
        title: 'RTL sorgusu (pseudo)',
        caption: 'Gerçek projede `@testing-library/react` yüklüdür varsayımı',
        code: `import { render, screen } from '@testing-library/react'

test('kaydet görünür', () => {
  render(<KayitForm />)
  expect(screen.getByRole('button', { name: /kaydet/i })).toBeEnabled()
})`,
      },
    ],
    quiz: {
      question:
        'React Testing Library yaklaşımında hangi sıra tipik olarak benimsenir?',
      choices: [
        'Önce DOM iç yapı seçicisi; rol ve metin gereksiz',
        'Kullanıcı gibi görünür metin / rol ile sorgula; gerektiğinde test id',
        'Yalnızca Redux store snapshot’ına bak',
        'Sadece sınıf isimleriyle CSS seçimi zorunlu',
      ],
      correctAnswer:
        'Kullanıcı gibi görünür metin / rol ile sorgula; gerektiğinde test id',
    },
    clozeActivity: {
      title: 'RTL seçimleri',
      text:
        'Düğmeye sıklıkla görünür ____ üzerinden ulaşılır; seçicide ise ____ rolü yaygın bir hedeftir.',
      blanks: [
        { accepted: ['metin', 'etiket', 'isim'] },
        { accepted: ['button', 'düğme'] },
      ],
      wordBank: ['metin', 'button', 'class', 'reducer'],
    },
    challenge: {
      initialCode: `/** Test edilebilir (erişilebilir) küçük parça şablonu */
export default function KayitOzeti() {
  return (
    <section aria-label="kayıt özeti">
      <h2 style={{ marginTop: 0 }}>Özet panel</h2>
      <button type="button">Kaydet</button>
      <p style={{ opacity: 0.75 }} role="note">
        Not: RL testinde bu düğüm button rolünde yakalanır.
      </p>
    </section>
  )
}`,
      expectedOutputDescription:
        'Başlık, “Kaydet” düğmesi ve aria-label ile bölüm alanı görünmeli.',
    },
  },
  {
    id: 'expert-build-env-ve-yayinlama',
    moduleId: 'expert',
    title: 'Build, ortam değişkenleri ve güvenli dağıtım',
    difficulty: 'ileri',
    content: `
## Vite + env

Ön yüz için değişken adı \`VITE_\` ile başlamalıdır: \`import.meta.env.VITE_SUPABASE_URL\`. Derleme sırasında yerleştirilir; **gerçek gizli üretim anahtarı** ise repoda saklanmamalıdır.

## Üretim derlemesi ve yayın

\`npm run build\` → \`dist\` klasörü; çıktıyı çoğu projede Netlify, Vercel veya GitHub Pages gibi statik barındırma hizmetlerine yükleyebilir ya da seçtiğiniz CI/CD sürecine dahil edebilirsiniz.

## .gitignore

\`.env\`, \`.env.local\` gibi yerel sırları uzağa itin; gerekiyorsa \`.env.example\` ile *şablonda* eksik anahtar adları gösterin.

> **Uyarı:** Ekranda gördüğünüz anon public key bile “kirli geçmiş” içindir — repoya koymak yerine dağıtım panelinde tanımla.
`.trim(),
    codeExamples: [
      {
        title: 'Okuma özü',
        code: `const u = import.meta.env.VITE_API_URL ?? 'http://localhost:8787'
console.log(u)`,
      },
    ],
    quiz: {
      question:
        'Hangisi üretim gizli anahtarları için daha güvenli bir yaklaşımdır?',
      choices: [
        'Üretim gizli anahtarını `src/constants.ts` içine gömerek repoya göndermek',
        'Geliştiricide `.env.local` kullanıp sırrı `.gitignore` ile dışarıda tutmak ve dağıtımda host secret kullanmak',
        'Secrets’ları `readme.md` içine yazmak',
        'Çevresel hiçbir değişken kullanmadan her şeyi sabit olarak gömmek',
      ],
      correctAnswer:
        'Geliştiricide `.env.local` kullanıp sırrı `.gitignore` ile dışarıda tutmak ve dağıtımda host secret kullanmak',
    },
    dragOrderActivity: {
      title: 'Güvenli yayın sırası',
      items: [
        { id: 'ignore', text: 'Sırları repodan çıkar (.gitignore + örnek env şeması)' },
        { id: 'build', text: 'npm run build ile üretim paketini üret (dist)' },
        { id: 'publish', text: 'Seçilen hosta yükle ve public URL doğrula' },
      ],
      correctOrderIds: ['ignore', 'build', 'publish'],
    },
    clozeActivity: {
      title: 'Vite derlemesi',
      text:
        'Geliştirme sunucusu `vite` iken klasik üretim derlemesi genelde ____ komutu ve çıktı klasörü çoğu senaryoda ____ olur.',
      blanks: [{ accepted: ['npm run build', 'build'] }, { accepted: ['dist'] }],
      wordBank: ['npm run build', 'build', 'dist', 'node_modules'],
    },
    challenge: {
      initialCode: `/**
 * import.meta.env sadece VITE_* prefiksini tarayıcıya taşır.
 * Bu ön izlemede değişken tanımlı olmayabilir — metin olarak gösterilir.
 */
const tabanUrl = String(import.meta.env.VITE_DENEME_API ?? '(yerelde tanımlı değil)')

export default function OrtamOzeti() {
  return (
    <ul style={{ fontFamily: 'monospace', fontSize: 14 }}>
      <li>VITE_DENEME_API → {tabanUrl}</li>
      <li>Derlemede sırlar kod gövdesine gömülmemeli (.env ile host)</li>
    </ul>
  )
}`,
      expectedOutputDescription:
        'Liste iki satır gösterir; ilk satır yerel ortam mesajını ve ikinci güvenlik notunu içerir.',
    },
  },
  {
    id: 'expert-todo-buyuk-calismasi',
    moduleId: 'expert',
    title: 'Büyük çalışma — Todo uygulaması',
    difficulty: 'ileri',
    lessonLayout: 'laboratory',
    content: `
## Laboratuvar — tek görev

Tebrikler: konu tekrarından sonra büyük ve birleştirici bir **örnek görev**. Bu ekranda **ekstra teorik blok yok** — sadece aşağıdaki editör ve görev metni var.

**Görev:** Aşağıdaki boş şablondan başlayarak **kendi Todo uygulamanı** yaz. Ekleme, listeleme, tamamlandı işaretleme ve silme davranışını kendin tasarla; \`useState\` ve/veya \`useReducer\` ile state’i yönet. Stil serbest; önemli olan **çalışan, anlaşılır bir özet proje** çıkarmak.

> Bu alan bilinç olarak “devasa challenge” için genişletilmiştir. **Kodu sıfırla** düğmesiyle başlangıç şablonuna dönebilirsin.

> **İpucu:** Hata durumunda console’u ve canlı önizlemeyi kontrol et; \`key\` ve kontrollü input’ları gözden kaçırma.
`.trim(),
    codeExamples: [
      {
        title: 'Çalışma alanı (şablon)',
        code: `// Aşağıdaki Canlı kod alanında App bileşenini büyüt — bu blok sadece hatırlatma.
export default function App() {
  return <p>Todo: boş şablondan başla.</p>
}`,
      },
    ],
    quiz: {
      question:
        'Laboratuvar görevi için hangisi en uygun yaklaşımdır?',
      choices: [
        'State’i yalnızca window üzerinde global değişkenle tutmak',
        'Liste ve formları React state ile kontrollü/kurallı şekilde yönetmek',
        'Hiç state kullanmadan doğrudan DOM innerHTML yazmak',
        'Her satır için ayrı React root oluşturmak',
      ],
      correctAnswer:
        'Liste ve formları React state ile kontrollü/kurallı şekilde yönetmek',
    },
    dragOrderActivity: {
      title: 'Todo laboratuvarı — önerilen adımlar',
      description: 'Kapsamlı bir projede sıra genelde böyle işler.',
      items: [
        { id: 'model', text: 'Görev tipi ve alanları (metin, bitti vb.) seç' },
        { id: 'state', text: 'useState/useReducer ile listeyi tek kaynakta tut' },
        { id: 'ui', text: 'Ekleme, listeleme, tamamla ve sil UI’sini bağla' },
      ],
      correctOrderIds: ['model', 'state', 'ui'],
    },
    challenge: {
      initialCode: `import { useState } from 'react'

type Gorev = { id: string; metin: string; bitti: boolean }

export default function App() {
  const [liste, setListe] = useState<Gorev[]>([])
  const [metin, setMetin] = useState('')

  function ekle() {
    const t = metin.trim()
    if (!t) return
    setListe((l) => [...l, { id: String(Date.now()), metin: t, bitti: false }])
    setMetin('')
  }

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: 480,
        margin: '0 auto',
        padding: 16,
      }}
    >
      <h1 style={{ marginTop: 0 }}>Todo ile büyük çalışma</h1>
      <p style={{ opacity: 0.85, lineHeight: 1.5 }}>
        Bu şablonda minimal ekleme akışı var. <strong>Geliştir:</strong> tamamla /
        sil / filtre / sayaç — özgürsün.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={metin}
          onChange={(e) => setMetin(e.target.value)}
          placeholder="Yeni görev"
          style={{ flex: 1, padding: '8px 10px' }}
        />
        <button type="button" onClick={ekle}>
          Ekle
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {liste.map((g) => (
          <li
            key={g.id}
            style={{
              padding: '8px 0',
              borderBottom: '1px solid #3333',
              textDecoration: g.bitti ? 'line-through' : undefined,
              opacity: g.bitti ? 0.6 : 1,
            }}
          >
            {g.metin}
          </li>
        ))}
      </ul>
    </div>
  )
}`,
      expectedOutputDescription:
        'Todo akışını genişletmeli; önizlemede anlamlı etkileşim (ekleme, tamamlama, silme vb.) görülmeli. Bu alanda otomatik notlandırma yok — çıktıyı kendi kontrol listenizle doğrulayın.',
    },
  },
]
