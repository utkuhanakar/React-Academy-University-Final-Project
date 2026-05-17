import type { Lesson } from '../types'

/** Yaygın başlangıç sıralı React konu planına paralel: ES6 hazırlığı ve JSX girişi. */
export const introLessons: Lesson[] = [
  {
    id: 'intro-react-es6',
    moduleId: 'intro',
    title: 'React ES6 (Destructuring, Arrow Functions, Spread Operator)',
    difficulty: 'başlangıç',
    content: `
## Neden ES6?

React kod tabanında üçlünün hedefi daha kısa satırdan önce **okunabilirlik ve güvenilir \`this\`/state kalıplarıdır**. Çizgisel sıralı dış materyallerden biri olarak [W3Schools JavaScript kursu](https://www.w3schools.com/js/default.asp), arrow ve diziler için pratik bloklar sunar (kodu kopyalamak yerine aynı fikrin kendi kısa denemenizi yazın). Birinci paragraf: klasik blok; ikinci paragraf: destructuring; üçüncü küçük spread ile yeni yüzeysel nesne üretin — çıktıları yan yana kıyaslayın.

## Arrow functions

Kısa sözdizimi dışında önemli fark: ok fonksiyonları \`this\`i **lexically** bağlar — sınıf bileşenlerinden hook tabanlı bileşenlere geçince bile, *callback* içinde \`this\` avcılığı yapmadan düşünebilirsiniz çünkü çoğu React kodu işlev bileşenidir ve \`this\` zaten yoktur.

## Destructuring

\`const { ad, soyad } = kisi\` ile nesneden alan çekmek; \`const [a, b] = dizi\` ile dizi parçalamak, props ve hook dönüşlerinde tekrarı azaltır.

## Spread

\`{ ...onceki, yeniAlan: 1 }\` immutable güncelleme kalıbının kalbidir — React, referans değişimini kıyaslayarak yeniden render kararı verir.

> **Pratik not:** “Spread ile yüzeysel kopya alırım; iç içe nesnede tüm ağacı güncellemem gerekir mi?” veya “Arrow function ile geleneksel function arasında **event handler** bağlamı nasıl fark eder?” gibi üçlü konular sık birlikte sorulur ve ele alınır.

> **Pratik not:** “Aşağıdaki kod çıktısı nedir?” tipinde \`[...dizi, x]\` veya \`{...obj, a:1}\` birleştirme sorularına hazır olun.
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

> **Pratik not:** “JSX arka planda neye dönüşür?” ve “Neden \`class\` yerine \`className\`?” — kısa cevaplı sorularda en sık gelen ikilidir.

> **Pratik not:** “JSX içinde JavaScript ifadesi yazmak için hangi sözdizimi kullanılır?” — \`{ }\` ile süslü parantez sorusu neredeyse klasiktir.
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

> **Pratik not:** \`style\` özniteliğinde çift süslü parantez kullanımı: dıştaki JSX ifadesi, içteki ise stil nesnesidir.

> **Pratik not:** \`&&\` ile ternary arasındaki fark; \`0 && …\` tuzak sorusuna hazırlıklı olun.
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

> **Pratik not:** “Koşullu render” ile “kontrollü bileşen (form)” — kavramları birbirine karıştırmayın; benzer görünen soru kökleri çoğu zaman özellikleri birbirinden ayırmanızı bekler.

> **Pratik not:** Kısa kod: \`a || b\` ile \`a ?? b\` farkı (nullish birleştirici) props varsayılanlarında çıkabilir.
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
