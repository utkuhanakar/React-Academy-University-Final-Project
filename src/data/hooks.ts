import type { Lesson } from '../types'

/** W3Schools tarzı başlıklar: Hooks, useState, useEffect, useRef, useContext. */
export const hooksLessons: Lesson[] = [
  {
    id: 'hooks-what-is',
    moduleId: 'hooks',
    title: 'What is Hooks?',
    difficulty: 'başlangıç',
    content: `
## Hooks nedir?

**Hooks**, işlev bileşenlerinde **state**, **yan etki**, **ref** ve **context** gibi özelliklere \`useSomething()\` çağrılarıyla erişmenizi sağlayan React API’sidir. Kurallar: yalnızca **işlev bileşeni veya özel hook** gövdesinin **üst düzeyinde** çağrılır; döngü, koşul veya iç içe fonksiyon içinde **rastgele** çağırmayın — böylece her render’da aynı sırada hook çağrıları çalışır.

## Neden sınıf yaşam döngüsü değil?

Hooks, yan etkileri \`useEffect\` ile “bileşenin bu kısmı şunu yapıyor” şeklinde **yatay** organize etmenizi sağlar; \`componentDidMount\` / \`componentDidUpdate\` bölünmesinden daha okunabilir olabilir.

## Özel hook

\`useAuth\`, \`useWindowSize\` gibi \`use\` ile başlayan fonksiyonlar mantığı paylaşır; state’i paylaşmazlar — her çağrı kendi kapalı state’ini kurar.

> **İpucu:** “Hook kuralları ihlal edilirse ne olur?” — Çağrı sırası kayar; React iç state ile eşleşme bozulur (hata ve garip bug’lar).

> **Sıkça sorulan:** “Custom hook’a prop geçilir mi?” — Evet, argüman olarak; ama hook içinde aynı sırada hook çağrısı korunmalı.
`.trim(),
    codeExamples: [
      {
        title: 'Temel işlev bileşeni + hook (taslak)',
        code: `import { useState } from 'react'

export default function Sayaç() {
  const [n, setN] = useState(0)
  return <button type="button" onClick={() => setN(n + 1)}>{n}</button>
}`,
      },
    ],
    quiz: {
      question:
        'Hooks ile ilgili aşağıdaki ifadelerden hangisi doğrudur?',
      choices: [
        'Hook’ları döngü veya koşul içinde koşuya bağlı olarak çağırmak React tarafından önerilir',
        "Hook'lar yalnızca fonksiyon bileşenlerinin veya özel hook'ların en üst düzeyinde çağrılmalıdır",
        'Class bileşenlerinde `useState` doğrudan kullanılır',
        'Her custom hook çağrısı otomatik olarak global paylaşımlı tek state oluşturur',
      ],
      correctAnswer:
        "Hook'lar yalnızca fonksiyon bileşenlerinin veya özel hook'ların en üst düzeyinde çağrılmalıdır",
    },
    extraQuizChecks: [
      {
        question:
          'Özel bir hook örneği `useSepet()` her bileşenden çağrıldığında state için ne yapar?',
        choices: [
          'Çağıran bileşene özel saklama oluşturur; global tek state zorunlu değildir',
          'Tüm bileşenler aynı sepet nesnesini zorla paylaşmak zorundadır',
          'Yalnızca class bileşenlerinde kullanılabilir',
          '`useMemo` ile aynı davranışı verir',
        ],
        correctAnswer:
          'Çağıran bileşene özel saklama oluşturur; global tek state zorunlu değildir',
      },
      {
        question:
          'Üç hook çağrısı üst düzeyde sırayla yazılmışken koşulla dördüncü bir hook çalıştırmaya çalışırsanız tipik olarak ne beklenir?',
        choices: [
          'Çağrı sırası render’lar arasında kayabilir — React uyarısı / kural ihlali',
          'Üretimde React sessizce yok sayar',
          'Bu yaklaşım resmi olarak önerilen optimizasyon kuralıdır',
          'Yalnızca TypeScript hata verir; çalışma zamanı sorun çıkarmaz',
        ],
        correctAnswer:
          'Çağrı sırası render’lar arasında kayabilir — React uyarısı / kural ihlali',
      },
    ],
    dragOrderActivity: {
      title: 'Tek render turunda sıra',
      description: 'Tek bir bileşende tipik oluşum düzenini sıraya koyun.',
      items: [
        { id: 'calls', text: 'Hook çağrıları aynı sırada yürütülür' },
        { id: 'jsx', text: 'Bileşen JSX çıktısını döndürür' },
        {
          id: 'commit',
          text: 'React farkları hesaplar ve DOM/commit aşamasını işler',
        },
      ],
      correctOrderIds: ['calls', 'jsx', 'commit'],
    },
    challenge: {
      initialCode: `import { useState } from 'react'

function uzunlukCiftMi(x: string) {
  return x.length % 2 === 0
}

export default function App() {
  const [metin, setMetin] = useState('Hooks')
  const cift = uzunlukCiftMi(metin)
  return (
    <div>
      <input value={metin} onChange={(e) => setMetin(e.target.value)} />
      <p style={{ marginTop: 8 }}>Uzunluk çift mi? {cift ? 'evet' : 'hayır'}</p>
    </div>
  )
}`,
      expectedOutputDescription:
        'Metin uzunluğu çiftken “evet”, tekken “hayır” yazmalı; özel mantık JSX ile birleşmiş olmalı.',
    },
  },
  {
    id: 'hooks-use-state',
    moduleId: 'hooks',
    title: 'useState',
    difficulty: 'başlangıç',
    content: `
## Tanım

\`const [deger, setDeger] = useState(baslangic)\` — bileşen içinde **lokal state** tutar. \`setDeger\` çağrısı yeni bir render planlar; güncelleme **asenkron** batch’lenebilir.

## Immutable güncelleme

State’i **doğrudan mutasyonla** değiştirmeyin (\`state.push(...)\` ile aynı dizi referansı). Bunun yerine **yeni referans** üretin (\`setDeger([...state, x])\`, nesnede spread). React, referans değişimine göre “fark var mı?” diye karşılaştırabilir; mutasyon referansı sakladığı sürece yeniden render veya zincir reaksiyonu beklediğiniz gibi gitmeyebilir.

> **Sıkça sorulan:** “State doğrudan neden değiştirilmez?” — React, önceki ve sonraki state snapshot’larını öngörülebilir şekilde kıyaslar; mutasyon geçmişi gizler, zaman içi güncellemeleri ve bail-out mantığını bozar; ekip içi yordam tutarlılığı ve hata ayıklama zorlaşır.

> **İpucu:** \`setSayac(sayac + 1)\` ile \`setSayac((s) => s + 1)\` — ardışık güncellemelerde ikinci biçim güvenilir.
`.trim(),
    codeExamples: [
      {
        title: 'Lazy initializer',
        code: `import { useState } from 'react'

export default function Demo() {
  const [n, setN] = useState(() => 10)
  return <button type="button" onClick={() => setN((x) => x + 1)}>{n}</button>
}`,
      },
      {
        title: 'Nesne state (spread)',
        code: `import { useState } from 'react'

type U = { ad: string; puan: number }

export default function Profil() {
  const [u, setU] = useState<U>({ ad: 'Ali', puan: 0 })
  return (
    <button
      type="button"
      onClick={() => setU((x) => ({ ...x, puan: x.puan + 1 }))}
    >
      {u.ad}: {u.puan}
    </button>
  )
}`,
      },
    ],
    quiz: {
      question:
        'Aşağıdakilerden hangisi React state güncellemesi için önerilen yaklaşımdır?',
      choices: [
        'Dizi state’inde `liste.push(yeni)` ile aynı referansı mutasyonla genişletmek',
        'Nesne veya dizi için kopya oluşturup setState’e yeni referans vermek (immutability)',
        '`useState` dönen setter’ı hiç kullanmadan doğrudan state değişkenini atamak',
        'Her render’da `useState` başlangıç argümanını değiştirmek',
      ],
      correctAnswer:
        'Nesne veya dizi için kopya oluşturup setState’e yeni referans vermek (immutability)',
    },
    challenge: {
      initialCode: `import { useState } from 'react'

export default function App() {
  const [ogrenciler, setOgrenciler] = useState<string[]>([])

  function ekle() {
    const ad = 'Öğrenci ' + (ogrenciler.length + 1)
    setOgrenciler((onceki) => [...onceki, ad])
  }

  return (
    <div>
      <button type="button" onClick={ekle}>
        Ekle (immutable)
      </button>
      <ul style={{ marginTop: 8 }}>
        {ogrenciler.map((o, i) => (
          <li key={i}>{o}</li>
        ))}
      </ul>
    </div>
  )
}`,
      expectedOutputDescription:
        'Her tıklamada listeye yeni öğe eklenmeli; spread ile yeni dizi kullanıldığı için önceki state mutasyonsuz kalmalı.',
    },
  },
  {
    id: 'hooks-use-effect',
    moduleId: 'hooks',
    title: 'useEffect',
    difficulty: 'orta',
    content: "## Ne iş yapar?\n\n`useEffect`, bileşeni çizdikten sonra yan etkiyi sırayla çalıştırır: veri çekmek veya iptal etmek, abonelik açmak, zamanlayıcı kurmak, pencere `resize` olayına kaydolmak veya DOM’a dokunmak gibi işler için kullanırsınız. Bunları doğrudan render gövdesine gömmek okumayı zorlaştırır ve sıra beklentinizi daha çabuk bozacak dallanmalara götürür.\n\n## Üç bağlılık listesi yazım şekli\n\n**1 — Parametresiz** (`useEffect(fn)`): Her görünüşte çalışabilir — içerde koşulsuz `setState` varsa sonsuz sıçrama riski çıkar ve üretimde çoğu kez gereksiz gürültü üretir.\n\n**2 — Boş liste** (`useEffect(fn, [])`): “Yaşama bir kez kur; gerekiyorsa unmount’ta sök” modeli. Geliştirme sırasında Strict Mode, kur–sök sırasını bilinçle ekstra deneyebilir; bu üretim davranışını kopyalamaz.\n\n**3 — Dolu liste** (`useEffect(fn, [a, b])`): `Object.is` benzeri kıyasla izlenir — obje veya dizi her render’da yeni referansla üretiliyorsa efekt sık sık yeniden tetiklenir.\n\n## Referans tuzakları\n\n`useEffect(() => {...}, [{ x: 1 }])` gibi bağımlılıkta doğrudan yeni nesne yazmak, her görünüşte “yeni referans” üretildiği için efektleri istemeden tekrarlatabilir. Gerekirse üstten stabil referans verin veya `useMemo` ile sınırlandırın.\n\n## Cleanup (geri dönüş)\n\n`return () => { ... }` ile önceki kurulumu sökün: zamanlayıcıyı iptal edin, `AbortController` ile isteği kesin, `removeEventListener` çağırın. Böylece çift abonelik ve bellek taşması riskini azaltırsınız.\n\n### Dolu liste akışı\n\n- Bir kimlik değişti: önce eski kimlik için cleanup, sonra yeni kimlik için kurulum.\n- Bileşen kapandı: son cleanup sırayla çalışır.\n\n### Boş liste akışı\n\n- İlk oluş kurulumunu ve çıkış temizliğini görürsünüz. Geliştirme sırasında Strict Mode’un bu sırayı gereğinden ek denemesi normal bir uyarıcıdır — üretimi bozmaz.\n\n> **İpucu:** `react-hooks/exhaustive-deps` uyarısı çoğu zaman efektin bir önceki render’dan eski bağlamla yakalanması (**stale closure**) riskine işaret eder — gereksiz yere liste genişletmeyin ama gerçekten kullandığınız değerleri yazmaktan da kaçınmayın.\n\n> **İpucu:** `useLayoutEffect`, çizimden hemen önce senkron çalışır; titreşimi veya kaymayı düzeltme gibi nadir işler için uygundur — uzun süren ağ işlerini buraya taşımayın.",
    codeExamples: [
      {
        title: 'Mount + cleanup (interval)',
        code: `import { useEffect, useState } from 'react'

export default function Saat() {
  const [t, setT] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setT(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return <span>{new Date(t).toLocaleTimeString()}</span>
}`,
      },
      {
        title: 'Bağımlılıklı efekt — id değişince yeniden abonelik',
        code: `import { useEffect, useState } from 'react'

export default function Dinleyici({ kullaniciId }: { kullaniciId: string }) {
  const [mesaj, setMesaj] = useState('')
  useEffect(() => {
    setMesaj('yükleniyor...')
    const ctrl = new AbortController()
    void fetch('/api/kullanici/' + kullaniciId, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => setMesaj(d.ad))
      .catch(() => setMesaj('hata'))
    return () => ctrl.abort()
  }, [kullaniciId])
  return <p>{mesaj}</p>
}`,
      },
      {
        title: 'Sekme başlığı için kur + cleanup — bağımlılıkta geri yükleme',
        code: `import { useEffect } from 'react'

export default function BaslikSenk({ baslik }: { baslik: string }) {
  useEffect(() => {
    const onceki = document.title
    document.title = baslik
    return () => {
      document.title = onceki
    }
  }, [baslik])

  return (
    <p style={{ margin: 0 }}>
      Aktif başlık: {baslik}. Cleanup ile önceki \`document.title\` sırayla geri yüklenir.
    </p>
  )
}`,
      },
    ],
    quiz: {
      question:
        '`useEffect(() => { ... }, [])` (boş bağımlılık dizisi) ile ilgili doğru ifade hangisidir?',
      choices: [
        'Bu efekt her render’dan sonra mutlaka çalışır',
        'Bu efekt genellikle yalnızca mount’ta kurulur; cleanup varsa unmount’ta (ve strict mode geliştirmede ek davranışlar) çalışır',
        'Boş dizi yazmak `useEffect` kullanımını yasaklar',
        'Boş dizi, efektin hiç çalışmayacağı anlamına gelir',
      ],
      correctAnswer:
        'Bu efekt genellikle yalnızca mount’ta kurulur; cleanup varsa unmount’ta (ve strict mode geliştirmede ek davranışlar) çalışır',
    },
    extraQuizChecks: [
      {
        question:
          'Parametresiz `useEffect(fn)` ve gövdesinde koşulsuz `setSayac((s) => s + 1)` varsa ne beklemek daha mantıklıdır?',
        choices: [
          'Sonsuz veya gereğinden sık render riski yükselir (çökme veya takılma ihtimali artar)',
          '`useEffect` yalnızca unmount sırasında bir kez tetiklenir',
          'Tarayıcı bu kalıp yüzünden derlemeyi durdurur',
          'Üretimde bu kalıp kullanıcıdan özel izin gerektirir',
        ],
        correctAnswer:
          'Sonsuz veya gereğinden sık render riski yükselir (çökme veya takılma ihtimali artar)',
      },
      {
        question:
          '`useEffect` içinde döndürdüğünüz cleanup işlevi ne zaman çalışır?',
        choices: [
          'Aynı efekt yeniden çalışmadan önce önceki kurulumu iptal etmek için ve bileşenden çıktığınızda',
          'Her render sırasında, JSX ile aynı anda',
          '`useMemo` yeniden sıra aldığında',
          'Yalnızca sunucu tarafında (SSR) anlamlıdır',
        ],
        correctAnswer:
          'Aynı efekt yeniden çalışmadan önce önceki kurulumu iptal etmek için ve bileşenden çıktığınızda',
      },
      {
        question:
          '`useLayoutEffect` için hangi ifade genelde daha doğrudur?',
        choices: [
          'Tarayıcı çizimi öncesinde DOM üzerinde senkron çalışır; kayma/titreşim düzeltmeleri veya doğrudan ölçüm için genelde bunu seçersiniz',
          'Uzun süren istekleri `useEffect` yerine burada sürdürmek önerilir',
          'Bu hook’un bağımlılık dizisi yazılmazsa derleme sırasında yasaklanır',
          'Üretimde Strict Mode bu hook’un tamamını sıfırlar ve atlar',
        ],
        correctAnswer:
          'Tarayıcı çizimi öncesinde DOM üzerinde senkron çalışır; kayma/titreşim düzeltmeleri veya doğrudan ölçüm için genelde bunu seçersiniz',
      },
    ],
    clozeActivity: {
      title: 'useEffect özeti — boşluklar',
      description: 'Kelime havuzundan seçerek `___` yerlerini doldurun.',
      text: 'Yan etkileri ifade etmek için çoğu zaman ___ kullanılırız. Dependency array olarak ___ verildiğinde efekt tek seferlik kurulum için çalışır.',
      blanks: [
        { accepted: ['useEffect'] },
        { accepted: ['[]', 'boş dizi'] },
      ],
      wordBank: ['useState', 'useReducer', 'useEffect', '[]', 'boş dizi'],
    },
    challenge: {
      initialCode: `import { useEffect, useState } from 'react'

export default function App() {
  const [genislik, setGenislik] = useState(window.innerWidth)

  useEffect(() => {
    function guncelle() {
      setGenislik(window.innerWidth)
    }
    window.addEventListener('resize', guncelle)
    return () => window.removeEventListener('resize', guncelle)
  }, [])

  return <p style={{ margin: 0 }}>Pencere genişliği: {genislik}px</p>
}`,
      expectedOutputDescription:
        'Sayfa genişliği değiştikçe metin güncellenmeli; cleanup ile listener kaldırılmalı (boş dizi + return cleanup).',
    },
  },
  {
    id: 'hooks-use-ref',
    moduleId: 'hooks',
    title: 'useRef',
    difficulty: 'orta',
    content: `
## Ref ne işe yarar?

\`useRef\`, bileşen her render olduğunda **aynı nesneyi** döndürür; asıl iş yaptığımız yer \`.current\` alanıdır. Burayı güncellersiniz ama tarayıcı yeniden çizimi **state setter** gibi otomatik tetiklemez. Bu yüzden ref’i genelde iki iş için kullanıyoruz: DOM öğesi tutmak (\`ref={r}\`) ve render dışında sayacı / zamanlayıcı kimliğini / önceki değeri saklamak.

\`const r = useRef<T>(baslangic)\` yazdığınızda \`r.current\`’in ilk değeri \`baslangic\`; sonra istediğiniz zaman \`r.current = ...\` diyebilirsiniz.

## State’ten ne farkı var?

- **State:** Setter ile güncelleme yaparsınız → React bileşeni yeniden render edebilir.
- **Ref:** Yalnızca \`.current\`’i değiştirdiğinizde → çoğu senaryoda ekranda bir şey olmaz; veri bileşende durur ama “görsel güncelleme” için çoğu zaman ekstra state veya başka tetik gerekebilir.

## Ne zaman işinize yarar?

- Input’a odak vermek, ölçü almak.
- Interval / timeout kimliği; bir önceki props veya state değerini tutmak.

> **İpucu:** Ref’te sakladığınız bir bilgiyi kullanıcıya göstermek istiyorsanız, ref değişince arayüzün de yenilenmesi gerekir. Ref bunu tek başına yapmaz; çoğu kez yan yana küçük bir **state** veya tetikleyici bir mekanizma gerekir.

> **Sıkça sorulan:** \`useRef(null)\` ile DOM’a bağladığınızda ilk render’da \`current\` çoğu zaman henüz \`null\` olabilir. DOM’a güvenilir şekilde erişmek için genelde bu okumayı bir \`useEffect\` içine koymak mantıklıdır.
`.trim(),
    codeExamples: [
      {
        title: 'DOM ref',
        code: `import { useEffect, useRef } from 'react'

export default function Odak() {
  const el = useRef<HTMLInputElement>(null)
  useEffect(() => {
    el.current?.focus()
  }, [])
  return <input ref={el} defaultValue="imleç burada" />
}`,
      },
    ],
    quiz: {
      question: '`useRef` ile ilgili hangi ifade doğrudur?',
      choices: [
        '`ref.current` atamak her zaman bileşenin yeniden render edilmesini zorunlu kılar',
        '`useRef` DOM düğümü veya render tetiklemeyen kalıcı kutu için kullanılabilir',
        'Ref yalnızca class bileşenlerinde kullanılabilir',
        'Ref içi değer her zaman immutable olmalıdır; .current yazılamaz',
      ],
      correctAnswer:
        '`useRef` DOM düğümü veya render tetiklemeyen kalıcı kutu için kullanılabilir',
    },
    challenge: {
      initialCode: `import { useRef, useState } from 'react'

export default function App() {
  const [sayi, setSayi] = useState(0)
  const renderSayaci = useRef(0)
  renderSayaci.current += 1

  return (
    <div>
      <p style={{ marginTop: 0 }}>Sayaç: {sayi}</p>
      <p style={{ opacity: 0.75 }}>Bu bileşen kaç kez render oldu (debug)? {renderSayaci.current}</p>
      <button type="button" onClick={() => setSayi((s) => s + 1)}>
        Artır
      </button>
    </div>
  )
}`,
      expectedOutputDescription:
        'Sayaç artınca render sayısı da artmalı; ref render’ları sayıyor ve artırma yeniden render tetiklemiyor.',
    },
  },
  {
    id: 'hooks-use-context',
    moduleId: 'hooks',
    title: 'useContext',
    difficulty: 'orta',
    content: `
## Context nedir?

Props zinciri çok uzadığında **Provider** ile ağaçta değer sunar, alt bileşenler \`useContext\` ile okur. Context **sık sık değişen** yüksek frekanslı veri için her zaman ilk tercih olmayabilir (gereksiz re-render dalgaları); ancak tema, locale, auth özeti için uygundur.

## \`createContext\` + Provider

\`const TemaCtx = createContext<'acik' | 'kapali'>('acik')\` — varsayılan değer yalnızca Provider yoksa kullanılır.

## \`useContext(TemaCtx)\`

En yakın Provider’ın \`value\`’sünü döner; bileşen Provider değiştikçe **yeniden render** olur.

> **İpucu:** “Context vs Redux/Zustand?” — Küçük–orta global ihtiyaç için context; daha büyük ve raporlamalı için store araçları; kısa tanım için trade-off yeterli.

> **Sıkça sorulan:** “\`value=\` prop’unda her render’da yeni obje?” — Alt ağaç gereksiz render; \`useMemo\` ile değer sabitleme veya parçalama stratejisi.
`.trim(),
    codeExamples: [
      {
        title: 'Minimal tema context',
        code: `import { createContext, useContext, useState } from 'react'

const Tema = createContext<'acik' | 'koyu'>('acik')

function Icerik() {
  const t = useContext(Tema)
  return <p style={{ color: t === 'koyu' ? '#fff' : '#111' }}>Metin</p>
}

export default function Kok() {
  const [t, setT] = useState<'acik' | 'koyu'>('acik')
  return (
    <Tema.Provider value={t}>
      <button type="button" onClick={() => setT((x) => (x === 'acik' ? 'koyu' : 'acik'))}>
        tema
      </button>
      <Icerik />
    </Tema.Provider>
  )
}`,
      },
    ],
    quiz: {
      question: 'useContext ile ilgili doğru ifade hangisidir?',
      choices: [
        'Context değeri props gibi üstten alta iletilemez; yalnızca Redux ile mümkündür',
        '`useContext`, ilgili Context için en yakın Provider’ın value değerini döndürür',
        'Context kullanan bileşen hiçbir zaman yeniden render edilmez',
        'createContext çağrısı her render’da yapılmalıdır',
      ],
      correctAnswer:
        '`useContext`, ilgili Context için en yakın Provider’ın value değerini döndürür',
    },
    dragCodeActivity: {
      title: 'Context şeritlerini sıraya dizin',
      description: 'Minimal bir Context akışı için parçaları mantıklı sırada birleştirin.',
      pieces: [
        { id: 'mk', code: "const Dil = createContext<'tr' | 'en'>('tr')" },
        { id: 'prov', code: '<Dil.Provider value={dil}>…</Dil.Provider>' },
        { id: 'use', code: 'const dilKodu = useContext(Dil)' },
      ],
      correctOrderIds: ['mk', 'prov', 'use'],
    },
    challenge: {
      initialCode: `import { createContext, useContext, useState } from 'react'

const Dil = createContext<'tr' | 'en'>('tr')

function Baslik() {
  const d = useContext(Dil)
  return (
    <h2 style={{ marginTop: 0 }}>
      {d === 'tr' ? 'Merhaba' : 'Hello'}
    </h2>
  )
}

export default function App() {
  const [dil, setDil] = useState<'tr' | 'en'>('tr')
  return (
    <Dil.Provider value={dil}>
      <Baslik />
      <button type="button" onClick={() => setDil((x) => (x === 'tr' ? 'en' : 'tr'))}>
        Dil değiştir
      </button>
    </Dil.Provider>
  )
}`,
      expectedOutputDescription:
        'Dil değişince başlık “Merhaba” / “Hello” arasında geçmeli; Provider + useContext birlikte çalışmalı.',
    },
  },
  {
    id: 'hooks-use-memo',
    moduleId: 'hooks',
    title: 'useMemo',
    difficulty: 'orta',
    content: `
## Ne zaman?

\`useMemo(() => hesap(...), deps)\`, **saf** ve **maliyetli** dönüşümleri gereksiz yere yeniden yapmayı azaltmak için kullanılır. React dep listesi değiştirmeden önceki değeri kullanır; bu bir “söz” değil **optimizasyon ipucudur**.

## useMemo ile useCallback ilişkisi

\`useCallback(fn, deps)\`, \`useMemo(() => fn, deps)\` ile yakın düşünülebilir; okunabilirlik için fonksiyon önbelleklemede çoğu zaman **useCallback** seçilir.

> **Uyarı:** “Her şeyi useMemo ile sarmala” doğru yaklaşım değildir — önce state modelini sade tutun; profil gerekmiyorsa erken mikro-opt yapmayın.

> **Stale riski:** Hesap içinde güncelliği kaçırmamak için bağımlılık listesi eksiksiz tutulmalıdır.
`.trim(),
    codeExamples: [
      {
        title: 'Filtrelenmiş liste (örnek)',
        code: `import { useMemo, useState } from 'react'

type O = { id: string; tag: string }

export default function Liste({ kayitlar }: { kayitlar: O[] }) {
  const [f, setF] = useState('hepsi')
  const gorunur = useMemo(
    () => (f === 'hepsi' ? kayitlar : kayitlar.filter((x) => x.tag === f)),
    [kayitlar, f],
  )
  return <ul>{gorunur.map((x) => <li key={x.id}>{x.id}</li>)}</ul>
}`,
      },
    ],
    quiz: {
      question: '`useMemo` ile ilgili hangi ifade en doğrudur?',
      choices: [
        '`useMemo` olmadan React hiçbir state güncellemesi yapamaz',
        '`useMemo` saf hesaplama sonucunu bağımlılıklar değişmediyse yeniden kullanmak için kullanılabilir',
        '`useMemo` side effect zamanlamayı garantiler',
        'Bağımlılık dizisi her zaman yazılmamalıdır',
      ],
      correctAnswer:
        '`useMemo` saf hesaplama sonucunu bağımlılıklar değişmediyse yeniden kullanmak için kullanılabilir',
    },
    challenge: {
      initialCode: `import { useMemo, useState } from 'react'

const veri = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function App() {
  const [esik, setEsik] = useState(5)
  const buyukToplam = useMemo(
    () => veri.filter((n) => n >= esik).reduce((a, b) => a + b, 0),
    [esik],
  )
  return (
    <div>
      <label>
        Eşik:{' '}
        <input type="range" min={1} max={9} value={esik} onChange={(e) => setEsik(Number(e.target.value))} />
      </label>
      <p style={{ marginTop: 8 }}>Üst diziden toplam: {buyukToplam}</p>
    </div>
  )
}`,
      expectedOutputDescription:
        'Kaydırıcı değiştikçe eşiğin üzerindeki öğelerin toplamı güncellenmeli; hesap useMemo ile esik bağlı olmalı.',
    },
  },
  {
    id: 'hooks-use-callback',
    moduleId: 'hooks',
    title: 'useCallback',
    difficulty: 'orta',
    content: `
## Rolü

\`useCallback(fn, deps)\`, **aynı fonksiyon kimliği** gerektiğinde (alt bileşen \`memo\`, bazı efekt/listener kalıpları) referansı sabitler.

## Ne zaman gereklidir?

Küçük projelerde her handler’da şart değildir; “prop olarak geçilen children” ve cost’lu alt ağaçlarda gereksiz re-render kesmek için değerlidir.

> **Dikkat:** useCallback kullanılsa bile iç kapama güncelliği için **tam bağımlılık listesi** gerekir; aksi halde stale handler riski oluşur.
`.trim(),
    codeExamples: [
      {
        title: 'Handler referansını sabitlemek',
        code: `import { useCallback, useState } from 'react'

export default function Ana() {
  const [say, setSay] = useState(0)
  const artir = useCallback(() => setSay((x) => x + 1), [])
  return <button type="button" onClick={artir}>{say}</button>
}`,
      },
    ],
    quiz: {
      question: '`useCallback` için doğru özet hangisidir?',
      choices: [
        'İç fonksiyonu her çağırmada sıfır bağımlılıkla sıfır maliyette çalıştırır',
        'Bağımlılıklar sabit olduğu sürece aynı referanslı fonksiyon döndürmeye yardım edebilir',
        'Yan etkiyi sırayla çalıştırmayı garanti eder',
        'DOM olaylarında ok fonksiyonu yazmayı React yasaklar',
      ],
      correctAnswer:
        'Bağımlılıklar sabit olduğu sürece aynı referanslı fonksiyon döndürmeye yardım edebilir',
    },
    challenge: {
      initialCode: `import { memo, useCallback, useState } from 'react'

const Satir = memo(function Satir({ etiket, tikla }: { etiket: string; tikla: () => void }) {
  return (
    <li>
      <button type="button" onClick={tikla}>{etiket}</button>
    </li>
  )
})

export default function App() {
  const [hedef, setHedef] = useState('')
  const handler = useCallback(() => setHedef('tiklandi'), [])
  return (
    <ul style={{ paddingLeft: '1rem' }}>
      <Satir etiket="A" tikla={handler} />
      <Satir etiket="B" tikla={handler} />
      <p style={{ marginTop: 8 }}>Son: {hedef || 'bekliyor'}</p>
    </ul>
  )
}`,
      expectedOutputDescription:
        'Her iki satırda aynı useCallback ile verilen handler kullanılıyor olmalı; tıklanınca “tiklandi”.',
    },
  },
  {
    id: 'hooks-use-layout-effect',
    moduleId: 'hooks',
    title: 'useLayoutEffect',
    difficulty: 'ileri',
    content: `
## Effect vs LayoutEffect

- **useEffect**: genelde tarayıcı **paint** sonrasında asenkron planlanır; ağ/abonelik gibi yan etkiler için uygundur.
- **useLayoutEffect**: DOM mutasyonundan **hemen sonra**, kullanıcı ekranda görebilmeden önce senkron çalışır; ölçüm, scroll konumu düzeltme, **layout titreşimi (flash)** azaltmak için seçilir.

> **Uyarı:** Ağır iş useLayoutEffect’e koymak giriş geciktirmesi yapar — yalnızca gerçekten paint öncesi gerekiyorsa kullanın.

> **SSR notu:** Sunucuda useLayoutEffect uyarısı alınabilir; sunucuya özgü ise useEffect kullanın veya koşula alın.
`.trim(),
    codeExamples: [
      {
        title: 'Boyut ölçümü (taslak)',
        code: `import { useLayoutEffect, useRef, useState } from 'react'

export default function Kutum() {
  const r = useRef<HTMLDivElement>(null)
  const [gen, setGen] = useState(0)
  useLayoutEffect(() => {
    setGen(r.current?.offsetWidth ?? 0)
  }, [])
  return <div ref={r} style={{ width: 120 }}>{gen}px</div>
}`,
      },
    ],
    quiz: {
      question: '`useLayoutEffect` için en uygun seçenek hangisidir?',
      choices: [
        'REST API çağrıları için ilk tercih',
        'Çoğu zaman useEffect ile aynı zamanlama garantisini verir',
        'Ölçüm ve paint öncesi DOM düzeni düzeltmesi gerektiğinde düşünülür',
        'React Strict Mode’da hiç tetiklenmez',
      ],
      correctAnswer:
        'Ölçüm ve paint öncesi DOM düzeni düzeltmesi gerektiğinde düşünülür',
    },
    challenge: {
      initialCode: `import { useLayoutEffect, useRef, useState } from 'react'

export default function App() {
  const kutu = useRef<HTMLDivElement>(null)
  const [yuk, setYuk] = useState(0)

  useLayoutEffect(() => {
    const h = kutu.current?.getBoundingClientRect().height ?? 0
    setYuk(Math.round(h))
  }, [])

  return (
    <div ref={kutu} style={{ border: '1px solid #888', padding: 12 }}>
      <p style={{ margin: 0 }}>Ölçülen içerik yüksekliği: {yuk}px</p>
    </div>
  )
}`,
      expectedOutputDescription:
        'Mount sonrasında kutu içi yüksekliği layout effect ile okunmuş ve yaklaşık piksel değeri gösterilmiş olmalı.',
    },
  },
  {
    id: 'hooks-use-id',
    moduleId: 'hooks',
    title: 'useId',
    difficulty: 'orta',
    content: `
## Amaç

\`useId()\`, bileşen ağacında **stabil**, sunucu-istemci dostu kimlik üretir. Form \`label htmlFor\` / \`aria-*\`, SVG \`defs\`, benzersiz \`key\` gerektiren ama sıra yerine süreğen id istenen durumlarda uygundur.

## Anti-pattern

Liste elemanında **liste öğesi** için \`Math.random()\` kullanmak her render’da farklı id üretir; erişilebilirlik/hidrasyon için kötüdür — **domain id’si veya sıra ile üretilmiş sabit kimlikler** daha iyidir.
`.trim(),
    codeExamples: [
      {
        title: 'htmlFor bağlama',
        code: `import { useId } from 'react'

export default function Alan() {
  const id = useId()
  return (
    <>
      <label htmlFor={id}>E-posta</label>
      <input id={id} type="email" />
    </>
  )
}`,
      },
    ],
    quiz: {
      question: '`useId()` hakkında hangisi doğrudur?',
      choices: [
        'Rastgele guid üretimi için tasarlanmıştır ve her çağırmada farklıdır',
        'Hydration dostu bileşen kapsamlı kimlik oluşturmaya yardım edebilir',
        'Yalnızca sunucuda çalışır; istemcide kullanılmamalıdır',
        'liste.map içinde kullanılmak için önerilir',
      ],
      correctAnswer:
        'Hydration dostu bileşen kapsamlı kimlik oluşturmaya yardım edebilir',
    },
    challenge: {
      initialCode: `import { useId, useState } from 'react'

export default function App() {
  const uid = useId()
  const aciklamaId = uid + '-not'
  const [v, setV] = useState('')
  return (
    <div>
      <label htmlFor={aciklamaId}>Not</label>
      <textarea
        id={aciklamaId}
        value={v}
        onChange={(e) => setV(e.target.value)}
        rows={3}
      />
      <p style={{ marginTop: 8 }}>Uzunluk: {v.length}</p>
    </div>
  )
}`,
      expectedOutputDescription:
        'label ve textarea aynı id ile bağlı olmalı; metin yazıldıkça karakter uzunluğu güncellenmeli.',
    },
  },
  {
    id: 'hooks-custom-nested',
    moduleId: 'hooks',
    title: 'Custom hook desenleri',
    difficulty: 'ileri',
    content: `
## Soyutlama düzeyi

Custom hook, **yeniden kullanılabilir kapalı mantıktır**. İsimleri \`use\` ile başlamalıdır; içlerinde başka hook’lar çağırılabilir.

## Yaygın desenler

- **Tek sorumluluk:** “pencere genişliği”, “sunucuya yazma”, “konum izni”.
- **Parametreli:** \`function useAralik(min: number, max: number)\` gibi başlangıç argümanları.
- **Dönüş tipi küçük tutun:** sıkça küçük nesne yerine küçük sayıda primitive + fonksiyon.

> **Hata ayıklama:** Paylaşımlı tek state oluşturmazlar; her bileşende ayrı **örnek** oluşur.
`.trim(),
    codeExamples: [
      {
        title: 'useToggle örneği',
        code: `import { useCallback, useState } from 'react'

export function useToggle(baslangic = false) {
  const [v, setV] = useState(baslangic)
  const ac = useCallback(() => setV(true), [])
  const kapat = useCallback(() => setV(false), [])
  const degistir = useCallback(() => setV((x) => !x), [])
  return { v, ac, kapat, degistir }
}`,
      },
    ],
    quiz: {
      question: 'Custom hook’lar için doğru yaklaşım hangisidir?',
      choices: [
        'Birden fazla bileşende aynı hook çağrısı otomatik global paylaşımlı tek state oluşturur',
        '`useThing` içinde bileşene özel sırayla başka hook’lar kullanılabilir',
        'Custom hook yalnızca class bileşenlerinden çağrılmalıdır',
        'Dosya başına tek custom hook yazılmalıdır; birden fazla olması yasaktır',
      ],
      correctAnswer:
        '`useThing` içinde bileşene özel sırayla başka hook’lar kullanılabilir',
    },
    dragOrderActivity: {
      title: 'Custom hook paketinin adımları',
      description: 'Paylaşılan mantığı çıkarma sırasını düzenleyin.',
      items: [
        { id: 'identify', text: 'Yinelenen state + efekt desenini tespit edin' },
        { id: 'extract', text: '`use*` fonksiyonuna taşıyın; parametreleri belirginleştirin' },
        {
          id: 'return',
          text: 'Dışarı küçük, tutarlı API (setter + hesap sahaları) dönün',
        },
        { id: 'test', text: 'Bir–iki bileşende deneyerek sınırını not edin' },
      ],
      correctOrderIds: ['identify', 'extract', 'return', 'test'],
    },
    challenge: {
      initialCode: `import { useCallback, useMemo, useState } from 'react'

function useFormText(baslik: string) {
  const [v, setV] = useState('')
  const etiket = useMemo(() => baslik.trim() || 'Alan', [baslik])
  const temizle = useCallback(() => setV(''), [])
  const karakterSayisi = v.length
  return { v, setV, etiket, temizle, karakterSayisi }
}

export default function App() {
  const f = useFormText('Özet ')
  return (
    <label style={{ display: 'block', maxWidth: 320 }}>
      {f.etiket}
      <input value={f.v} onChange={(e) => f.setV(e.target.value)} style={{ marginTop: 6, width: '100%' }} />
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <button type="button" onClick={f.temizle}>Temizle</button>
        <span>{f.karakterSayisi}</span>
      </div>
    </label>
  )
}`,
      expectedOutputDescription:
        'Custom hook çıktısı etiketi, yazılmış metni temiz düğmesi ve karakter sayısını yönetmeli.',
    },
  },
]
