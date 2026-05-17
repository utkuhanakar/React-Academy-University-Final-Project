import type { Lesson } from '../types'

/** Bileşenler, props, children ve olay yönetimi. */
export const componentsLessons: Lesson[] = [
  {
    id: 'components-class-vs-functional',
    moduleId: 'components',
    title: 'Components (Class vs Functional)',
    difficulty: 'başlangıç',
    content: `
## Class bileşen

Sınıf bileşeninde yaşam döngüsü **metotlar** (\`componentDidMount\`, \`componentDidUpdate\`) ve durum **\`this.state\` / \`this.setState\`** ile yönetilir. Bu model yıllarca standarttı; ancak \`this\` bağlama hataları, HOC/render props karmaşıklığı ve aynı mantığı küçük parçalara bölmek sınıf tabanlı akışta daha pahalıdır.

## Functional bileşen + Hooks

Bugün **işlev bileşenleri** tercih edilmesinin başlıca nedenleri:

- **Hooks** (\`useState\`, \`useEffect\` …) ile state ve yan etkileri, sınıf yaşam döngüsü yerine **doğrudan fonksiyon gövdesinde** ifade edersiniz; akış okunabilir kalır.
- **Daha az şablon kod**: \`extends React.Component\`, constructor, \`this\` bağlama yoktur.
- **Ağaçta sıkılaştırma (tree-shaking)** ve paketleme açısından sıkça daha küçük çıktı; sınıf yapıları ve yardımcılar bazen daha fazla bağlam taşır.
- **Concurrent / yeni React özellikleri** (ör. Suspense ile veri desenleri) işlev bileşeni + hooks çizgisinde geliştirilir.
- **Mental model**: “props girer, JSX çıkar” — yan etkiler \`useEffect\` ile etiketlenmiş bloklarda; bu, takım içi tutarlılığı artırır.

> **Pratik not:** “Class bileşende neden \`this\` bağlama gerekir, işlev bileşende neden gerekmez?” — olay işleyicilerinde class’ta \`this.method\` veya ok fonksiyon sınıf alanı vs işlev bileşende düz fonksiyon.

## Props ve tek yönlü veri akışı

**Props** üst bileşenden alt bileşene **salt okunur** veri taşır; alt bileşen props’u “üsteki state’i doğrudan değiştirmek için” kullanmaz — üst, **callback** (\`onDegisti\` gibi) vererek çocuğa “ne zaman ve nasıl güncelleneceği” hakkında bir kanal açar. Bu, React’in **tek yönlü (unidirectional) veri akışı** modelidir: veri aşağı, olaylar yukarı.

> **Pratik not:** “Props mutasyona uyar mı?” — props nesnesini çocukta doğrudan değiştirmek antidir; üst durumu güncellemek üstteki \`setState\`/setter ile yapılır (immutable güncelleme).
`.trim(),
    codeExamples: [
      {
        title: 'İşlev bileşeni',
        code: `type SelamProps = { ad: string }

function Selam(props: SelamProps) {
  return <p>Merhaba, {props.ad}</p>
}`,
      },
      {
        title: 'Sınıf bileşeni (karşılaştırma)',
        code: `import { Component } from 'react'

type P = { ad: string }

class Selam extends Component<P> {
  render() {
    return <p>Merhaba, {this.props.ad}</p>
  }
}`,
      },
      {
        title: 'Tek yönlü akış: üst state, alt props + callback',
        code: `import { useState } from 'react'

function Ust() {
  const [sayi, setSayi] = useState(0)
  return <Alt deger={sayi} onArtir={() => setSayi((n) => n + 1)} />
}

type AltProps = { deger: number; onArtir: () => void }

function Alt({ deger, onArtir }: AltProps) {
  return (
    <button type="button" onClick={onArtir}>
      Sayı: {deger}
    </button>
  )
}`,
      },
    ],
    quiz: {
      question:
        'Aşağıdakilerden hangisi, günümüzde işlev bileşenlerinin sınıf bileşenlere göre sıkça tercih edilmesinin ana nedenlerinden biri DEĞİLDİR?',
      choices: [
        'Hooks ile state ve yan etkilerin aynı bileşen fonksiyonunda ifade edilebilmesi',
        'props’un her zaman üstten alta salt okunur akması',
        'React ekibinin yeni özellikleri çoğunlukla Hooks çizgisinde sunması',
        'Concurrent mode ve modern API’lerin işlev bileşeniyle uyumunun daha iyi olması',
      ],
      correctAnswer: 'props’un her zaman üstten alta salt okunur akması',
    },
    dragOrderActivity: {
      title: 'Alıştırma sırası — tek yönlü veri akışı',
      description: 'Kısa bileşende tipik doğru sıra.',
      items: [
        { id: 'props', text: 'Üst, veriyi props ile alta iletir' },
        {
          id: 'cb',
          text: 'Çocukta olay olunca callback ile üste haber gönderilir',
        },
        { id: 'state', text: 'Üst bileşende state immutably güncellenir' },
      ],
      correctOrderIds: ['props', 'cb', 'state'],
    },
    challenge: {
      initialCode: `import { useState } from 'react'

function Alt({
  etiket,
  artir,
}: {
  etiket: string
  artir: () => void
}) {
  return (
    <button type="button" onClick={artir}>
      {etiket}
    </button>
  )
}

export default function App() {
  const [n, setN] = useState(0)
  return (
    <div>
      <p style={{ marginTop: 0 }}>Sayaç: {n}</p>
      <Alt etiket="Bir artır" artir={() => setN((x) => x + 1)} />
    </div>
  )
}`,
      expectedOutputDescription:
        '“Bir artır” düğmesine basıldığında üstteki sayaç değeri birer birer artmalı; tek yönlü akış (callback yukarı) çalışmalı.',
    },
  },
  {
    id: 'components-props-nedir',
    moduleId: 'components',
    title: 'Props Nedir?',
    difficulty: 'başlangıç',
    content: `
## Tanım

**Props** (properties), bir React bileşenine dışarıdan geçirilen **argümanlar**dır. Çalışma anında bileşen çağrısı şu haliyle düşünülür: \`Selam({ ad: 'Ayşe' })\` — JSX’te \`<Selam ad="Ayşe" />\`.

## Salt okunur sözleşme

Alt bileşen, gelen props’u **kaynağı kabul eder**; üst bileşenin state’inin “tek doğruluk kaynağı” olduğu hiyerarşide, çocuk props’u kendi keyfiyle değiştirerek üstü bozmaz — gerekiyorsa üstten gelen **callback** ile üstü uyarır.

## “Yukarıdan aşağıya” akış

Ağaçta bir düğüm render edildiğinde, o render için props değerleri **üstten hesaplanır** ve çocuğa iletilir. Aynı props ile çocuk deterministik JSX üretmeye çalışır (saf bileşen düşüncesi). Bu, debug ve test edilebilirliği artırır.

> **Pratik not:** “Props vs state” — props dış dünyadan gelen **parametre**, state bileşenin içinde tuttuğu **değiştirilir veri**; ikisini birbirine katmayın.

> **Pratik not:** “Prop drilling” — props zinciri çok uzadığında context veya durum yükseltme stratejileri sorulabilir; tanımı bilin.
`.trim(),
    codeExamples: [
      {
        title: 'Temel props',
        code: `type KartProps = { baslik: string; altBaslik?: string }

function Kart({ baslik, altBaslik }: KartProps) {
  return (
    <section>
      <h2>{baslik}</h2>
      {altBaslik != null ? <p>{altBaslik}</p> : null}
    </section>
  )
}`,
      },
      {
        title: 'Çocuğa fonksiyon geçmek (yukarı bildirim)',
        code: `type F = { deger: number; onDegisti: (yeni: number) => void }

function Editor({ deger, onDegisti }: F) {
  return (
    <input
      type="number"
      value={deger}
      onChange={(e) => onDegisti(Number(e.target.value))}
    />
  )
}`,
      },
    ],
    quiz: {
      question:
        'React’te alt bileşenin üst bileşenin durumunu güvenli biçimde güncellemek için hangi kalıp uygundur?',
      choices: [
        'Alt bileşen üstün props nesnesindeki state alanını doğrudan mutasyonla değiştirir',
        'Üst bileşen state tutar ve setter’ı veya setter çağıran bir callback’i prop olarak çocuğa verir',
        'Alt bileşen window üzerinde global bir değişken kullanır',
        'Alt bileşen props’u spread ile kopyalayıp içindeki bir alanı değiştirir (referans aynı kalır)',
      ],
      correctAnswer:
        'Üst bileşen state tutar ve setter’ı veya setter çağıran bir callback’i prop olarak çocuğa verir',
    },
    clozeActivity: {
      title: 'Alıştırma — props terimleri',
      text: 'Dış dünyadan gelen parametre kümesine React’te sıklıkla ___ denir ve alt bileşen tarafından salt ___ kabul edilir.',
      blanks: [
        { accepted: ['props', 'özellikler'] },
        { accepted: ['okunur'] },
      ],
      wordBank: ['props', 'okunur', 'yazılır', 'global'],
    },
    challenge: {
      initialCode: `type MsgProps = { metin: string; vurgulu?: boolean }

function Mesaj({ metin, vurgulu = false }: MsgProps) {
  return (
    <p style={{ fontWeight: vurgulu ? 700 : 400, marginTop: 0 }}>{metin}</p>
  )
}

export default function App() {
  return (
    <div>
      <Mesaj metin="Örnek: props salt okunur" />
      <Mesaj metin="Bu satır kalın" vurgulu />
    </div>
  )
}`,
      expectedOutputDescription:
        'İki satır metin görünmeli; ikinci satır kalın (fontWeight 700), ilki normal olmalı.',
    },
  },
  {
    id: 'components-props-destructuring',
    moduleId: 'components',
    title: 'Props Destructuring',
    difficulty: 'başlangıç',
    content: `
## Neden yıkımlama?

\`function B({ ad, yas }: Props)\` yazmak, \`props.ad\` tekrarını azaltır ve **hangi alanların kullanıldığını** imza düzeyinde gösterir. TypeScript ile birlikte IDE otomatik tamamlama sağlar.

## Varsayılanlar

Yıkımlamada varsayılan değer verebilirsiniz: \`function K({ baslik = 'Adsız' }: KProps)\`. Bu, **opsiyonel** props için yerel varsayılan üretir.

## Rest ile kalan props

\`const { cocuk, ...diger } = props\` — çocuğu ve diğer DOM özniteliklerini ayırmak için sık kullanılır (wrapper bileşenler).

> **Pratik not:** “Props yıkımlaması, props nesnesini mutasyona uğratır mı?” — Hayır; yıkımlama yeni yerel bağlamalar üretir, üstün ilettiği nesneyi değiştirmek zorunda değilsiniz.

> **Pratik not:** “Nested props güvenli mi?” — İç içe nesnede opsiyonel zincir (\`props?.a?.b\`) veya varsayılanlar; undefined erişimi sık tuzak soru tipidir.
`.trim(),
    codeExamples: [
      {
        title: 'Parametre yıkımlama',
        code: `type P = { x: number; y: number }

function Nokta({ x, y }: P) {
  return (
    <span>
      ({x}, {y})
    </span>
  )
}`,
      },
      {
        title: 'Rest ve forward',
        code: `type BtnProps = React.ComponentProps<'button'> & { theme?: 'bir' | 'iki' }

function TemaButonu({ theme = 'bir', children, ...btn }: BtnProps) {
  const renk = theme === 'bir' ? '#1e40af' : '#047857'
  return (
    <button type="button" style={{ background: renk, color: '#fff' }} {...btn}>
      {children}
    </button>
  )
}`,
      },
    ],
    quiz: {
      question:
        'Aşağıdakilerden hangisi props yıkımlaması (destructuring) ile ilgili doğru bir ifadedir?',
      choices: [
        'Yıkımlama üst bileşenin oluşturduğu props nesnesini her zaman mutasyonla değiştirir',
        'Yıkımlama, kullanılan alanları yerel değişkenlere bağlar; varsayılanlar ile opsiyonel alanlar için yerel değer tanımlanabilir',
        'Yıkımlama sadece class bileşenlerinde mümkündür',
        'Rest parametreleri TypeScript’te kullanılamaz',
      ],
      correctAnswer:
        'Yıkımlama, kullanılan alanları yerel değişkenlere bağlar; varsayılanlar ile opsiyonel alanlar için yerel değer tanımlanabilir',
    },
    clozeActivity: {
      title: 'Alıştırma — yıkımlama ve kalan props',
      text: '`function Dugme({ tema, ...diger }: P)` yazımında `tema` alanı için ___ kullanılmış olur; `...diger` ise kalan özelliklere ___ uygulanır.',
      blanks: [{ accepted: ['yıkımlama'] }, { accepted: ['spread'] }],
      wordBank: ['yıkımlama', 'spread', 'mutasyon', 'children'],
    },
    challenge: {
      initialCode: `type SatirProps = {
  etiket: string
  deger: string
  vurgu?: boolean
}

function Satir({
  etiket,
  deger,
  vurgu = false,
}: SatirProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '0.35rem',
        background: vurgu ? '#eef2ff' : 'transparent',
        padding: vurgu ? '4px 8px' : 0,
        borderRadius: 6,
      }}
    >
      <strong>{etiket}</strong>
      <span>{deger}</span>
    </div>
  )
}

export default function App() {
  return (
    <div>
      <Satir etiket="Ad:" deger="Zeynep" />
      <Satir etiket="Not:" deger="95" vurgu />
    </div>
  )
}`,
      expectedOutputDescription:
        'İki satır “Ad:” ve “Not:” görünmeli; “Not:” satırı arka planı açık morumsu (vurgu) ile seçili hissi vermeli.',
    },
  },
  {
    id: 'components-props-children',
    moduleId: 'components',
    title: 'Props Children',
    difficulty: 'orta',
    content: `
## \`children\` nedir?

JSX’te bir bileşenin açılış ve kapanış etiketleri arasındaki içerik, **\`children\`** prop’u olarak iletilir. Tür: genelde \`React.ReactNode\` — metin, eleman, dizi veya null olabilir.

## Bileşim (composition)

\`children\` ile **çerçeve** bileşenleri yazarsınız: \`Kart\`, \`Modal\`, \`Layout\` içeriği dışarıdan alır; bu, prop drilling’i azaltır ve “slot” benzeri esneklik sağlar.

## \`children\` ile props çakışması

Aynı anda hem \`children\` hem açık prop’lar kullanılabilir; API tasarımında “zorunlu içerik \`children\` mı yoksa adlandırılmış prop mu?” tutarlılığı önemlidir.

> **Pratik not:** “\`children\` her zaman JSX metni midir?” — Hayır; herhangi bir \`ReactNode\` olabilir (ör. koşullu alt ağaç).

> **Pratik not:** “Render props vs children” — biri fonksiyon döndürür (\`{() => ...}\`), diğeri doğrudan içerik; iki deseni ayırmak sık gerekiyor.
`.trim(),
    codeExamples: [
      {
        title: 'Sade çerçeve',
        code: `type KutuProps = { baslik: string; children: React.ReactNode }

function Kutu({ baslik, children }: KutuProps) {
  return (
    <section style={{ border: '1px solid #cbd5e1', padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>{baslik}</h3>
      {children}
    </section>
  )
}

// Kullanım: <Kutu baslik="Özet">...</Kutu>`,
      },
    ],
    quiz: {
      question:
        'Aşağıdakilerden hangisi `children` prop’u için yanlıştır?',
      choices: [
        'İç içe JSX içeriği parent’tan child’a `children` ile aktarılabilir',
        '`children` yalnızca düz metin (string) olabilir; başka hiçbir tür olamaz',
        '`React.ReactNode` türü geniş bir içerik ailesini kapsar',
        'Çerçeve bileşenler (card, layout) için composition deseninde sık kullanılır',
      ],
      correctAnswer:
        '`children` yalnızca düz metin (string) olabilir; başka hiçbir tür olamaz',
    },
    dragOrderActivity: {
      title: 'Alıştırma — composition adımları',
      description: '`children` ile çerçeve bileşen kurma sırası.',
      items: [
        { id: 'type', text: 'Props tipinde children (React.ReactNode) tanımla' },
        { id: 'place', text: 'Bileşen gövdesinde {children} ile slotu kullan' },
        {
          id: 'consume',
          text: 'Üst JSX’te açılış-kapanış etiketleri arasına içerik yaz',
        },
      ],
      correctOrderIds: ['type', 'place', 'consume'],
    },
    challenge: {
      initialCode: `type PanelProps = {
  ust: React.ReactNode
  children: React.ReactNode
}

function IkiBolme({ ust, children }: PanelProps) {
  return (
    <div style={{ border: '1px solid #94a3b8', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: 10, background: '#f1f5f9', fontWeight: 600 }}>{ust}</div>
      <div style={{ padding: 10 }}>{children}</div>
    </div>
  )
}

export default function App() {
  return (
    <IkiBolme ust={<span>Üst bilgi</span>}>
      <p style={{ margin: 0 }}>Alt gövde: children ile geldi.</p>
    </IkiBolme>
  )
}`,
      expectedOutputDescription:
        'Üst gri bölümde “Üst bilgi”, alt bölümde paragrafla “Alt gövde” metni görünmeli.',
    },
  },
  {
    id: 'components-events',
    moduleId: 'components',
    title: 'Events (Olay Yönetimi)',
    difficulty: 'orta',
    content: `
## Neden \`onClick\`, neden \`onclick\` değil?

HTML’de öznitelik **küçük harf** \`onclick\` olabilir; **JSX** ise DOM özniteliklerini **camelCase** yazar (\`onClick\`, \`onChange\`, \`onSubmit\`). JSX derlemesi bu isimleri React’in **SyntheticEvent** sistemine bağlar — tutarlı API ve tarayıcı uyumu sağlanır.

## \`onClick={fonksiyon}\` vs \`onClick={fonksiyon()}\`

- **Referans vermek**: \`onClick={handleClick}\` — tıklanınca çalışır.
- **Çağırıvermek**: \`onClick={handleClick()}\` — **render anında** çalışır; bu genelde hatadır (sonsuz döngü veya gereksiz yan etki).

## Parametre geçmek için ok fonksiyon

Handler’a argüman vermek için \`onClick={() => sec(id)}\` veya \`onClick={(e) => sec(id, e)}\` kullanılır. Doğrudan \`onClick={sec(id)}\` yazmak **hemen çağırır**.

> **Pratik not:** “Sentetik olay ve native olay farkı?” — \`preventDefault\`/pooling (React 18 öncesi pooling vurgusu ders kitaplarında kalabilir) — asıl güç sentetik sarmalamada tutarlı davranış oluşturmak.

> **Pratik not:** \`onClick={handler}\` ile \`onClick={() => handler('a')}\` farkı — ilki referans, ikisi tıklanınca çağrılan kapama (closure).
`.trim(),
    codeExamples: [
      {
        title: 'Referans vs yanlış çağırma',
        code: `function Dogru({ onSil }: { onSil: () => void }) {
  return <button type="button" onClick={onSil}>Sil</button>
}

function YanlisDemo() {
  // onClick={uyari()} render’da uyariyi hemen çalıştırır — bu yüzden kullanmayın
  return <button type="button" onClick={() => alert('tık')}>Tıkla</button>
}`,
      },
      {
        title: 'Liste öğesi kimliği ile ok fonksiyon',
        code: `type Oge = { id: string; ad: string }

function Liste({ ogeler }: { ogeler: Oge[] }) {
  return (
    <ul>
      {ogeler.map((o) => (
        <li key={o.id}>
          {o.ad}{' '}
          <button type="button" onClick={() => console.log('sec', o.id)}>
            seç
          </button>
        </li>
      ))}
    </ul>
  )
}`,
      },
    ],
    quiz: {
      question:
        'Aşağıdakilerden hangisi, JSX’te tıklama olayı dinlerken doğru kullanımdır?',
      choices: [
        'button onclick="handler()"',
        'button onClick={handler} (handler fonksiyon referansı)',
        'button onClick={handler()} (handler hemen render sırasında çalışır)',
        'button ONCLICK={handler} (büyük harflerle yazılan HTML özniteliği)',
      ],
      correctAnswer: 'button onClick={handler} (handler fonksiyon referansı)',
    },
    clozeActivity: {
      title: 'Alıştırma — onClick doğru bağlama',
      text: 'Tıklanınca çalışması için handler’ı `onClick=` ile ___ verin; parametre gerekiyorsa ___ ile sarın.',
      blanks: [
        { accepted: ['referans olarak', 'referans'] },
        { accepted: ['ok fonksiyon', 'arrow fonksiyon'] },
      ],
      wordBank: ['referans olarak', 'ok fonksiyon', 'hemen çağır()', 'string'],
    },
    challenge: {
      initialCode: `import { useState } from 'react'

export default function App() {
  const [son, setSon] = useState<string>('—')

  function merhaba(isim: string) {
    setSon('Merhaba, ' + isim)
  }

  return (
    <div>
      <p style={{ marginTop: 0 }}>Son mesaj: {son}</p>
      <button type="button" onClick={() => merhaba('Derin')}>
        Derin’e selam (parametreli)
      </button>
    </div>
  )
}`,
      expectedOutputDescription:
        'Düğmeye basıldığında “Son mesaj: Merhaba, Derin” görünmeli; `onClick` içinde arrow ile parametre aktarımı kullanılmalı.',
    },
  },
]
