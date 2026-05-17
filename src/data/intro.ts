import type { Lesson } from '../types'

/** Yaygın başlangıç sıralı React konu planına paralel: ES6 hazırlığı ve JSX girişi. */
export const introLessons: Lesson[] = [
  {
    id: 'intro-react-es6',
    moduleId: 'intro',
    title: 'React ES6 (Destructuring, Arrow Functions, Spread Operator)',
    difficulty: 'başlangıç',
    content: `
## Neden önce ES6?

React bileşeni yazdığınızda üç kalıpla sürekli karşılaşırsınız: nesneden alan seçme, kısa ve okunabilir fonksiyonlar yazmak, state veya birleştirilmiş veriyi bozmadan güncelleme. Bunlar ayrı ayrı “söz dizimi dersi” gibi görünür; pratikte aynı hedefe işler — **hatayı azaltan, daha kısa ve sürdürülebilir** kod yazmak.

Dış başvuru için [W3Schools’un JavaScript bölümü](https://www.w3schools.com/js/default.asp) üzerinden ilerlemek gayet doğaldır. Ancak kodu kopyalayı yapıştırmadan, aynı fikrin **kendi küçük denemenizi** yazmak çok daha faydalıdır: parametre sırasında neyin değiştiğini siz seçersiniz.

## Arrow functions (ok fonksiyonları)

**\`=>\`** yazımının amacı hem tekrarı azaltmak hem de “bu fonksiyon kısa, net ve çoğu yerde sıradan bağlam gerektiren bir iş yapıyor” sinyali vermektir.

Sınıflı bileşenlerden gelen arkadaşlar için önemli fark şudur: **klasik** \`function\` ile bildirilmiş bir metot bazen \`this\`’in beklenenden farklı olmasına yol açarken ok fonksiyonu bağlamını **yeniden oluşturmaz**; gerekiyorsa kapanış (closure) veya parametre olarak veri kullanırsınız. İşlev bileşeni dünyasında \`this\` zaten sık kullanılmadığı için beyninizi yormayı burada düşük tutmak mümkündür — yine de olay işleyicide “ben bu değişkene hep erişeceğim” varsayımında oklar okumayı rahatlatır.

## Destructuring (yıkımlama)

\`const { ad, soyad = 'Misafir' } = kisi;\` yapısı, props nesnesinden alan seçerken gereksiz noktalı erişimi azaltır.

\`const [ilk, ikinci] = liste;\`, hook’ların sıra tabanlı dönüşlerini okumanın da anahtarıdır. Burada sık tuzak şudur: **iç içe** bir yerde olduğunuzu unutursanız yüzeysel keşif yaparsınız — her seviyede gereken alanın bilinçle çekildiğinden emin olun.

## Spread (yayımlama — yüzeysel birleştirme)

\`const yeni = { ...onceki, puan: 10 };\` kalıbı, yüzeysel bir kopyanın üzerine alan yazmak için kullanılır. Referansların değişmemesi gerektiği senaryoda (özellikle React state’inde) bu çok sık günlük rutindir.

Unutmayın: spread tek başına derin yapıların **otomatik klonu** olmaz; iç içe bir düğüm değişecekse seçtiğiniz seviye için yeniden nesne oluşturmanız gerekir — aksi hâlde aynı iç referansa iki yerden yanlışlıkla yazarsınız.

## Rest parametreleri ile toplama

\`function topla(ilki, ...digerleri) {}\` yazımında \`...\` parametre olarak “kalan argümanları dizi olarak topla” anlamına gelir; yayılma işleciyle sık sık yan yana konur ama **bağlamına göre** anlamı değişir.

## Küçük alıştırma planı (10–15 dk)

1. Küçük bir objeyi \`...\` ile kopyalayın; iç içe alanı değiştirmeden konsolda adresler karşılaştırın.

2. Aynı kodu klasik fonksiyon ve ok ile yazmayı iki satır için deneyin; okuması hangisinde daha hızlı elinize oturuyor?

> **İpucu:** Sınavlarda sık gelen tuzak bileşeni: yüzeysel kopyanın yetmediği yer ile “ok fonksiyonu doğal olarak daha güvenli” yanlış genellemesini karıştırmak. İkisinin sınırını not defterinizde yan yana tutun.

> **İpucu:** \`[...,dizi]\` ile \`{ ...dizi }\` hayal etmeyin — biri dizinin elemanlarına yayılır, diğeri genellikle sözdizimi hatası ya da doğru olmadığınız bir kalıbdır.

> **Sıkça sorulan:** \`structuredClone\` ne zaman? Derin yapı gerekiyorsa veya tarayıcı yeterliyse sık gerekebilir; React state’inde her seferinde gerekmeyeceği gibi, maliyet ve serileştirme sınırlarını da düşünün.
`.trim(),
    codeExamples: [
      {
        title: 'Parametre yıkımlama ve varsayılan',
        code: `type Kullanici = { ad: string; yas?: number }

function selam({ ad, yas = 18 }: Kullanici) {
  return \`\${ad}, \${yas}\`
}

console.log(selam({ ad: 'Mert' }))`,
      },
      {
        title: 'Spread ile kopya ve üzerine yazma',
        code: `const stil = { renk: 'kırmızı', kalin: true }
const genis = { ...stil, renk: 'mavi' }
// genis.kalin === true, genis.renk === 'mavi'`,
      },
      {
        title: 'Ok fonksiyon ve dizi metotları',
        code: `const sayilar = [1, 2, 3, 4]
const ciftler = sayilar.filter((n) => n % 2 === 0).map((n) => n * 10)
// ciftler: [20, 40]`,
      },
      {
        title: 'Dizi yıkımlama ve rest',
        code: `const [ilk, ikinci, ...geriKalan] = [10, 20, 30, 40]
// geriKalan: [30, 40]`,
      },
      {
        title: 'Ok fonksiyonla event handler içinde bağlam özeti',
        code: `type Log = { (msg: string): void }

function Form({ log }: { log: Log }) {
  const degerRef = { mevcut: '' }

  return (
    <input
      onChange={(e) => {
        degerRef.mevcut = e.target.value
        log(degerRef.mevcut)
      }}
    />
  )
}`,
      },
      {
        title: 'İç içe nesnede seçili alanı yüzeysel spread ile güncelleme',
        code: `type State = {
  kullanici: {
    kimlik: { id: string; rol: string }
    tercih: { tema: 'acik' | 'koyu' }
  }
}

function temaDegistir(onceki: State): State {
  return {
    ...onceki,
    kullanici: {
      ...onceki.kullanici,
      tercih: { tema: onceki.kullanici.tercih.tema === 'acik' ? 'koyu' : 'acik' },
    },
  }
}`,
      },
    ],
    quiz: {
      question:
        'İç içe (nested) immutable güncelleme gerektiğinde aşağıdakilerden hangisi genellikle önerilmeyen veya sorunlu bir “tek hamlede derin kopya” yaklaşımıdır?',
      choices: [
        'İç içe alanlar için açıkça spread ile yeni nesneler üretmek',
        '{ ...user, "profil.sehir": "Ankara" } ile noktalı anahtar kullanmak (geçersiz sözdizimi)',
        'Immer gibi structural sharing araçları kullanmak',
        'JSON.parse(JSON.stringify(obj)) ile derin kopya almak',
      ],
      correctAnswer: 'JSON.parse(JSON.stringify(obj)) ile derin kopya almak',
    },
    extraQuizChecks: [
      {
        question:
          '`const yeni = { ...eski }` ile kurulan yüzeysel birleştirme hakkında hangi ifade doğrudur?',
        choices: [
          '`yeni` içinden `yeni.profil.logoUrl = "?";` yazmak, `eski.profil` ile aynı referans satırından etkilenebilir',
          '`yeni`, `eski` ile hiçbir alanı ortak kullanamaz; kopyanın tamamı sıfır bellekte oluşmuştur',
          'Spread, iç içe tüm dalları garanti olarak klonladığı için `immer` gereksiz kalır',
          'React state’inde spread kullanımı `key` gereksinimini otomatik çözer',
        ],
        correctAnswer:
          '`yeni` içinden `yeni.profil.logoUrl = "?";` yazmak, `eski.profil` ile aynı referans satırından etkilenebilir',
      },
      {
        question: '`const [a,, b] = [1, 2, 3]` işleminden sonra `b` hangi sayıdır?',
        choices: ['1', '2', '`undefined` çünkü sözdizimi hatası vardır', '3', '0'],
        correctAnswer: '3',
      },
      {
        question:
          'Çoğu modern React kodunda `this` bağlamından kaçmak için sık seçilen yaklaşım hangisidir?',
        choices: [
          'Tamamen işlev bileşeni + props ve parametre bağlama kullanmak; gerekiyorsa kapanış',
          '`this` bağlamını `useEffect` içinde sıfırlamak',
          '`children` kullanmak',
          '`createElement`’i doğrudan `document.body` ile çağırmak',
        ],
        correctAnswer:
          'Tamamen işlev bileşeni + props ve parametre bağlama kullanmak; gerekiyorsa kapanış',
      },
    ],
    dragOrderActivity: {
      title: 'Alıştırma sırası — yüzeysel immutable güncelleme',
      description: 'Nesne state’inde tipik doğru sıra.',
      items: [
        { id: 'copy', text: 'Mevcut nesneden yüzeysel kopyayı spread ile üret' },
        { id: 'patch', text: 'Değişen alanı yeni nesnede yaz' },
        { id: 'set', text: 'Yeni nesne referansını state’e ver' },
      ],
      correctOrderIds: ['copy', 'patch', 'set'],
    },
    challenge: {
      initialCode: `const sayilar = [3, 1, 4]

const toplam = sayilar.reduce((a, b) => a + b, 0)
const genis = [...sayilar, toplam]

export default function App() {
  return (
    <pre style={{ margin: 0, fontFamily: 'monospace' }}>
      {JSON.stringify(genis, null, 2)}
    </pre>
  )
}`,
      expectedOutputDescription:
        'Önizlemede JSON olarak önce dizi elemanları, sonunda toplam içeren bir dizi görünmeli (ör. [3,1,4,8] benzeri).',
    },
  },
  {
    id: 'intro-jsx-nedir',
    moduleId: 'intro',
    title: 'JSX Nedir?',
    difficulty: 'başlangıç',
    content: `
## Tanım

**JSX**, JavaScript’e XML-benzeri sözdizimi ekleyen bir uzantıdır. Tarayıcı doğrudan JSX okumaz; derleyici onu \`React.createElement\` çağrılarına (veya eşdeğeri) dönüştürür. Bu yüzden JSX, “HTML yazıyorum” hissi verse de aslında **JavaScript ifadesidir**.

İlk günlerde zihinsel model şöyle kurulabilir: **etiket adı** bir fonksiyon veya string (yerleşik DOM etiketleri), **öznitelikler** props nesnesi, **içerik** üçüncü ve sonraki argümanlar. Basit HTML denemelerini [W3Schools HTML referansı](https://www.w3schools.com/html/default.asp) ile karşılaştırıp “aynı bilgi JSX’te nasıl kalıyor?” sorusunu deftere dökmek, ileride **bileşen ağacı** kavramını taşır.

## className

DOM’da \`class\` özniteliği varken JSX’te **className** kullanırız; çünkü \`class\` ECMAScript tarafında ayrılmış anahtar kelimedir.

## Tek kök ve parçalanma

Bir bileşen fonksiyonu çoğu zaman tek bir kök öğe veya anlamlı bir parçalanmış yapı döndürür; JSX ağacı, React’in sanal DOM ile gerçek DOM’u eşleştirdiği veri yapısına karşılık gelir.

> **İpucu:** “JSX arka planda neye dönüşür?” ve “Neden \`class\` yerine \`className\`?” — kısa cevaplı sorularda en sık gelen ikilidir.

> **İpucu:** “JSX içinde JavaScript ifadesi yazmak için hangi sözdizimi kullanılır?” — \`{ }\` ile süslü parantez sorusu neredeyse klasiktir.
`.trim(),
    codeExamples: [
      {
        title: 'createElement ile eşdeğer parça',
        code: `import { createElement } from 'react'

const el = createElement('h1', { className: 'baslik' }, 'Merhaba')
// JSX: <h1 className="baslik">Merhaba</h1>`,
      },
      {
        title: 'İç içe JSX',
        code: `function Kart({ baslik, cocuk }: { baslik: string; cocuk: React.ReactNode }) {
  return (
    <section className="kart">
      <h2>{baslik}</h2>
      <div>{cocuk}</div>
    </section>
  )
}`,
      },
      {
        title: 'Koşullu sınıf dizesi',
        code: `type Props = { vurgulu: boolean }

function Etiket({ vurgulu }: Props) {
  const sinif = ['etiket', vurgulu ? 'etiket--vurgulu' : ''].join(' ')
  return <span className={sinif}>Durum</span>
}`,
      },
    ],
    quiz: {
      question:
        'JSX derlemesi sonucunda tipik olarak hangi tür JavaScript çağrıları üretilir (React 17+ derleyici varsayımlarıyla)?',
      choices: [
        'Yalnızca document.createElement çağrıları',
        'React.createElement (veya jsx runtime) çağrıları ve argüman olarak type, props, children',
        'innerHTML şablon stringleri',
        'eval ile dinamik kod üretimi',
      ],
      correctAnswer:
        'React.createElement (veya jsx runtime) çağrıları ve argüman olarak type, props, children',
    },
    clozeActivity: {
      title: 'Alıştırma — JSX ve className',
      description: '`___` boşluklarını kelime havuzundan doldurun.',
      text: 'JSX’te DOM sınıfı için öznitelik olarak ___ kullanılır; ___ tek başına özellik adı olarak JS’te çakışır.',
      blanks: [{ accepted: ['className'] }, { accepted: ['class'] }],
      wordBank: ['className', 'class', 'style', 'id'],
    },
    challenge: {
      initialCode: `export default function App() {
  return (
    <main className="ornek">
      <h1 className="baslik">JSX bir ifadedir</h1>
    </main>
  )
}`,
      expectedOutputDescription:
        'Önizlemede h1 ve “JSX bir ifadedir” metni görünmeli; className özniteliği korunmuş olmalı.',
    },
  },
  {
    id: 'intro-jsx-expressions-attributes',
    moduleId: 'intro',
    title: 'JSX Expressions ve Attributes',
    difficulty: 'orta',
    content: `
## Süslü parantez

\`{ }\` içine herhangi bir **ifade** yazabilirsiniz: değişken, fonksiyon çağrısı, kısa koşul. **İfade olmayan** şeyler (ör. \`if\` bloğu) doğrudan yerleştirilemez; ternary veya önceden hesaplanmış değişken kullanılır.

## Öznitelikler

Boolean özniteliklerinde \`disabled={true}\` veya sadece \`disabled\` (JSX kısayolu) gibi kalıplar görürsünüz. \`style\` bir **nesne** alır: \`style={{ margin: 8 }}\` — dış süslü JSX, iç süslü nesnedir.

## Children

İçerik, çocuk düğümler olarak iletilir; metin ve eleman karışımları yaygındır.

> **İpucu:** \`style\` özniteliğinde çift süslü parantez kullanımı: dıştaki JSX ifadesi, içteki ise stil nesnesidir.

> **İpucu:** \`&&\` ile ternary arasındaki fark; \`0 && …\` tuzak sorusuna hazırlıklı olun.
`.trim(),
    codeExamples: [
      {
        title: 'Ternary ile sınıf',
        code: `type Props = { aktif: boolean }

function Pill({ aktif }: Props) {
  return (
    <span className={aktif ? 'pill pill--on' : 'pill'}>
      {aktif ? 'Açık' : 'Kapalı'}
    </span>
  )
}`,
      },
      {
        title: 'style nesnesi',
        code: `export function Kutu() {
  return (
    <div
      style={{
        padding: '8px 12px',
        borderRadius: 8,
        backgroundColor: '#eef2ff',
      }}
    >
      Kutu
    </div>
  )
}`,
      },
      {
        title: 'Araya gömülü ifade',
        code: `const ad = 'Selin'
export function Selamlama() {
  return <p>Hoş geldin, {ad.toUpperCase()}</p>
}`,
      },
    ],
    quiz: {
      question:
        'Aşağıdaki JSX ifadelerinden hangisi genellikle uygunsuz veya hatalıdır?',
      choices: [
        '<div style={{ opacity: 0.5 }} />',
        '<div className={false ? "a" : "b"} />',
        '<div>{if (x) y}</div>',
        '<div>{x > 0 ? "pozitif" : "değil"}</div>',
      ],
      correctAnswer: '<div>{if (x) y}</div>',
    },
    clozeActivity: {
      title: 'Alıştırma — style ve süslü parantez',
      description: '`style={{ }}` biçimini tamamlayan kavramlar.',
      text: '`style={{ padding: 4 }}` ifadesinde dış süslü parantezler JSX içinde ___ demektir; içteki `{}` ise stil için bir JavaScript ___ döndürür.',
      blanks: [{ accepted: ['bir ifade', 'ifade gömme'] }, { accepted: ['nesne', 'object'] }],
      wordBank: ['bir ifade', 'nesne', 'string', 'dizi'],
    },
    challenge: {
      initialCode: `export default function App() {
  const not = 9
  return (
    <p>
      ders notu: <strong>{not}</strong> —{' '}
      {not >= 50 ? 'Geçti' : 'Kaldı'}
    </p>
  )
}`,
      expectedOutputDescription:
        'Metin içinde not değeri ve Geçti/Kaldı durumu görünmeli (not 9 iken “Kaldı”).',
    },
  },
  {
    id: 'intro-jsx-if-statements',
    moduleId: 'intro',
    title: 'JSX İf Statements (Koşullar)',
    difficulty: 'orta',
    content: `
## JSX içinde if yok (doğrudan)

**if** ifadesi bir *değer* üretmez; JSX çocuk konumunda yalnızca ifadeler oturur. Bu yüzden koşulları **üstte** hesaplayın veya **ternary** / **&&** kullanın.

## Ternary

\`kosul ? a : b\` her iki dalda da makul öğe döndürmelidir; “hiçbir şey” için \`null\` kullanın.

## && dikkat

\`sayi && <Badge />\` yazarken \`sayi\` **0** olursa ekranda \`0\` çıkabilir — bu yüzden \`sayi > 0 && …\` veya Boolean dönüşümü tercih edilir.

## Erken dönüş

Bileşen gövdesinde \`if (!veri) return <Uyari />\` kalıbı okunabilirliği artırır.

> **İpucu:** “Koşullu render” ile “kontrollü bileşen (form)” — kavramları birbirine karıştırmayın; benzer görünen soru kökleri çoğu zaman özellikleri birbirinden ayırmanızı bekler.

> **İpucu:** Kısa kod: \`a || b\` ile \`a ?? b\` farkı (nullish birleştirici) props varsayılanlarında çıkabilir.
`.trim(),
    codeExamples: [
      {
        title: 'Erken dönüş + yükleme',
        code: `type Props = { yukleniyor: boolean; hata: string | null }

export function Panel({ yukleniyor, hata }: Props) {
  if (yukleniyor) return <p>Yükleniyor…</p>
  if (hata) return <p role="alert">{hata}</p>
  return <p>İçerik hazır.</p>
}`,
      },
      {
        title: '&& ve sıfır tuzak örneği',
        code: `export function HataOrnegi({ adet }: { adet: number }) {
  return (
    <div>
      {/* adet 0 ise ekranda 0 gösterebilir */}
      <p>{adet && <span>Var</span>}</p>
      <p>{adet > 0 && <span>Var</span>}</p>
    </div>
  )
}`,
      },
      {
        title: 'Liste boş/dolu durumları',
        code: `export function Liste({ ogeler }: { ogeler: string[] }) {
  if (ogeler.length === 0) {
    return <p>Kayıt yok.</p>
  }
  return (
    <ul>
      {ogeler.map((o) => (
        <li key={o}>{o}</li>
      ))}
    </ul>
  )
}`,
      },
    ],
    quiz: {
      question:
        'Aşağıdakilerden hangisi tipik olarak JSX içinde doğrudan { if (...) { ... } } yazmaya gerek kalmadan eşdeğer bir yaklaşımdır?',
      choices: [
        'Sadece while döngüsü kullanmak',
        'Koşulu üst kapsamda hesaplayıp sonucu değişkende tutmak ve {sonuc} ile yazmak',
        "JSX içine ham for döngüsü gömerek çıktı üretmek",
        'Sadece switch-case JSX çocuğu olarak yazılabilir',
      ],
      correctAnswer:
        'Koşulu üst kapsamda hesaplayıp sonucu değişkende tutmak ve {sonuc} ile yazmak',
    },
    dragOrderActivity: {
      title: 'Alıştırma sırası — JSX’te dallanma',
      description: 'Doğrudan `if {}` bloklarından kaçının; bu çalışma düzeni sık kullanılır.',
      items: [
        {
          id: 'plan',
          text: 'Gösterilecek seçenek sayısını veya sıfır tuzaklarını düşün (&& mi ternary mi)',
        },
        {
          id: 'expr',
          text: 'Ternary yaz veya JSX’i önce yerel bir değişkende üret',
        },
        { id: 'embed', text: 'Sonucu return içinde JSX ağacına { } ile yerleştir' },
      ],
      correctOrderIds: ['plan', 'expr', 'embed'],
    },
    challenge: {
      initialCode: `export default function App() {
  const stok = 0
  return (
    <div>
      <p>Stok: {stok}</p>
      <p>{stok > 0 ? 'Satışta' : 'Tükendi'}</p>
    </div>
  )
}`,
      expectedOutputDescription:
        'Stok 0 iken “Tükendi” görünmeli; ternary ile koşul net olmalı.',
    },
  },
]
