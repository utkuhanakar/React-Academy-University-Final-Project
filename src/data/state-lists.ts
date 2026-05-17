import type { Lesson } from '../types'
import { additionalStateListsLessons } from './advanced'

/** Koşullu render, listeler, formlar ve submit (eski `advanced` dersleri dahil). */
export const stateListsLessons: Lesson[] = [
  {
    id: 'state-lists-conditionals',
    moduleId: 'state-lists',
    title: 'Conditionals (Koşullu Render - && ve Ternary)',
    difficulty: 'başlangıç',
    content: `
## \`&&\` ile kısa devre

\`{kosul && <B />}\` — \`kosul\` yanlış benzeri (\`false\`, \`null\`, \`undefined\`, \`0\` dikkat!) ise sağ taraf değerlendirilmez. **Dikkat:** \`0 && <B />\` ekranda \`0\` basabilir; bu yüzden bazen \`{sayi > 0 && ...}\` veya \`Boolean(x) && ...\` kullanılır.

## Ternary \`? :\`

İki dala ihtiyaç varsa \`{a ? <X /> : <Y />}\` klasik çözümdür. Okunabilirlik için karmaşık koşulları üstte bir değişkene çıkarmak iyidir.

## Erken return

Bileşen gövdesinde \`if (!veri) return <Yukleniyor />\` deseni, iç içe ternary’leri azaltır.

> **Pratik not:** “\`&&\` ile \`? :\` ne zaman?” — iki sonuç dengeli ise ternary; yalnızca “göster/gösterme” için \`&&\`.

> **Pratik not:** “React’ta \`if\` JSX içinde neden doğrudan yok?” — JSX bir ifade; if **ifadesi** olmadığı için blok yerine ternary veya önce hesaplanmış değişken kullanılır.
`.trim(),
    codeExamples: [
      {
        title: '&& tuzak: 0',
        code: `export default function Demo({ n }: { n: number }) {
  return (
    <div>
      {/* n=0 iken ekranda 0 görebilirsiniz */}
      {n && <span>Pozitif kabul</span>}
      {n > 0 && <span>Artık güvenli</span>}
    </div>
  )
}`,
      },
      {
        title: 'Ternary ile iki dal',
        code: `function Durum({ aktif }: { aktif: boolean }) {
  return <span>{aktif ? 'Açık' : 'Kapalı'}</span>
}`,
      },
    ],
    quiz: {
      question:
        '`{count && <Badge />}` ifadesinde `count` 0 olduğunda ekranda ne görebilirsiniz?',
      choices: [
        'Hiçbir şey (tamamen boş)',
        'Metin veya sayı olarak "0" görünebilir — `&&` sol tarafı 0 iken sol değer render edilir',
        'Her zaman Badge bileşeni render edilir',
        'React derleme hatası verir',
      ],
      correctAnswer:
        'Metin veya sayı olarak "0" görünebilir — `&&` sol tarafı 0 iken sol değer render edilir',
    },
    clozeActivity: {
      title: 'Alıştırma — && ile ternary',
      text: 'Tek koşulla isteğe bağlı küçük parça göstermek için sıkça ___ kullanılır; iki dengeli seçenek için ise ___ daha uygundur.',
      blanks: [{ accepted: ['&&'] }, { accepted: ['ternary'] }],
      wordBank: ['&&', 'ternary', 'if bloğu', 'while'],
    },
    challenge: {
      initialCode: `import { useState } from 'react'

export default function App() {
  const [acik, setAcik] = useState(false)
  return (
    <div>
      <button type="button" onClick={() => setAcik((a) => !a)}>
        Paneli {acik ? 'gizle' : 'göster'}
      </button>
      {acik ? (
        <p style={{ marginTop: '0.75rem' }}>Gizlenebilir içerik açık.</p>
      ) : (
        <p style={{ marginTop: '0.75rem', opacity: 0.6 }}>İçerik kapalı.</p>
      )}
    </div>
  )
}`,
      expectedOutputDescription:
        'Düğme metni duruma göre değişmeli; ternary ile iki farklı paragraf mesajından biri görünmeli.',
    },
  },
  {
    id: 'state-lists-lists-key',
    moduleId: 'state-lists',
    title: 'Lists (Map kullanımı ve Key propu)',
    difficulty: 'orta',
    content: `
## \`.map\` ile liste

Dizi elemanlarını JSX listesine dönüştürmek için \`items.map(item => <li key={...}>...</li>)\` kullanılır. **\`key\`**, aynı ebeveyn altındaki kardeşler arasında hangi sanal öğenin hangi gerçek DOM düğümü / fiber ile ilişkili olduğunu React’e söyler.

## Key neden hayati?

- **Doğru yeniden kullanım:** Aynı konuma “yeni” öğe geldiğinde React, key ile **önceki öğe ile aynı mantıksal kimlik mi** diye anlar. Yanlış key, state’in yanlış satıra “taşınmasına”, animasyon/odak kaybına ve verimsiz DOM işlemine yol açar.
- **Virtual DOM diff:** React önceki render ağacı ile sonrakini kıyaslar. Kardeş listelerde **key**, hangi düğümlerin taşınacağının, silineceğinin veya ekleneceğinin kararını stabil hale getirir. Key yoksa veya indeks ile sahte key kullanılıyorsa sıra değişince performans ve durum tutarlılığı bozulur.

## İndeks key ne zaman zayıftır?

Liste **sıralanabilir**, **eleman eklenip çıkarılabilir** veya **filtrlenirse** indeks key yanıltıcıdır; mümkünse **sabit ve benzersiz id** (ör. veritabanı \`id\`) kullanın.

> **Pratik not:** “\`key\` prop’u neden elemeye değil, listedeki kardeşlere ilişkindir?” — Reconciliation algoritması kardeş listeleri karşılaştırır.

> **Pratik not:** “Virtual DOM nedir?” — Gerçek DOM’un hafif ağaç temsili; diff sonrası minimal gerçek DOM güncellemesi.

> **Pratik not:** “key={Math.random()} neden kötü?” — Her render’da yeni key → tüm öğeler destroy/remount; state kaybı ve performans felaketi.
`.trim(),
    codeExamples: [
      {
        title: 'map + key',
        code: `type O = { id: string; ad: string }

function Liste({ ogeler }: { ogeler: O[] }) {
  return (
    <ul>
      {ogeler.map((o) => (
        <li key={o.id}>{o.ad}</li>
      ))}
    </ul>
  )
}`,
      },
      {
        title: 'İndeks key riski (açıklama)',
        code: `// Sıra değişince indeks artık aynı öğeyi temsil etmeyebilir;
// iç input state'i yanlış satıra "zıplayabilir".
{liste.map((metin, i) => (
  <li key={i}>{metin}</li>
))}`,
      },
    ],
    quiz: {
      question:
        'Liste render ederken `key` prop’unun birincil amacı hangisidir?',
      choices: [
        'CSS stillerini otomatik uygulamak',
        'Aynı ebeveyn altındaki kardeş elemanlar arasında öğeleri kararlı biçimde tanımlayıp reconciliation’ı doğru yönlendirmek',
        'Olayları (events) event delegation ile yakalamak',
        'Tarayıcı erişilebilirliği için `id` özniteliği yerine kullanılmak',
      ],
      correctAnswer:
        'Aynı ebeveyn altındaki kardeş elemanlar arasında öğeleri kararlı biçimde tanımlayıp reconciliation’ı doğru yönlendirmek',
    },
    dragCodeActivity: {
      title: 'Alıştırma — map + key şeridi',
      description: 'Liste satırının tipik sırası.',
      pieces: [
        { id: 'map', code: '{ogeler.map((o) => (' },
        { id: 'row', code: '<tr key={o.id}>' },
        { id: 'tail', code: '</tr>\n\t\t))}' },
      ],
      correctOrderIds: ['map', 'row', 'tail'],
    },
    challenge: {
      initialCode: `type Kayit = { id: string; ders: string; kredi: number }

const baslangic: Kayit[] = [
  { id: 'c1', ders: 'Veri Yapıları', kredi: 4 },
  { id: 'c2', ders: 'İşletim Sistemleri', kredi: 3 },
]

export default function App() {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: 4 }}>Ders</th>
          <th style={{ textAlign: 'right', padding: 4 }}>Kredi</th>
        </tr>
      </thead>
      <tbody>
        {baslangic.map((k) => (
          <tr key={k.id}>
            <td style={{ padding: 4 }}>{k.ders}</td>
            <td style={{ padding: 4, textAlign: 'right' }}>{k.kredi}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}`,
      expectedOutputDescription:
        'Tabloda her satır stabil `id` ile `key` kullanmalı; iki ders adı ve kredi sütunu okunmalı.',
    },
  },
  {
    id: 'state-lists-forms-controlled',
    moduleId: 'state-lists',
    title: 'Forms (Input yönetimi)',
    difficulty: 'orta',
    content: `
## Kontrollü bileşen (Controlled Component)

Input’un **değeri** React state’inden gelir (\`value={state}\`) ve her değişiklikte \`onChange\` ile **setState** yapılır. Böylece “tek doğruluk kaynağı” React’tir; DOM kendi içinde serbest bırakılmaz.

## Neden kontrollü?

- Doğrulama (validation), maskeleme, biçimlendirme tek yerde yapılır.
- State ve UI her zaman senkron kalır.

## Kontrolsüz (uncontrolled) karşıt

\`ref\` ile DOM’dan okuma — basit formlarda da kullanılır; özette “iki yöntem farklı kullanım alanı” olarak bilinebilir.

> **Pratik not:** “\`value\` verip \`onChange\` vermezsem?” — Uyarı / salt okunur hissi; kontrollü bileşen düzgün çalışmaz.

> **Sık sorulan:** “Checkbox’ta \`value\` yerine?” — \`checked\` + \`onChange\`; seçim kutularında \`value\` farklı anlam taşır.
`.trim(),
    codeExamples: [
      {
        title: 'Kontrollü metin',
        code: `import { useState } from 'react'

export default function TekAlan() {
  const [ad, setAd] = useState('')
  return (
    <input
      value={ad}
      onChange={(e) => setAd(e.target.value)}
      placeholder="Ad"
    />
  )
}`,
      },
      {
        title: 'Birden çok alan (nesne state)',
        code: `import { useState } from 'react'

type F = { email: string; sifre: string }

export default function Form() {
  const [f, setF] = useState<F>({ email: '', sifre: '' })
  return (
    <>
      <input
        value={f.email}
        onChange={(e) => setF((x) => ({ ...x, email: e.target.value }))}
      />
      <input
        type="password"
        value={f.sifre}
        onChange={(e) => setF((x) => ({ ...x, sifre: e.target.value }))}
      />
    </>
  )
}`,
      },
    ],
    quiz: {
      question:
        'Kontrollü bir metin kutusu için aşağıdakilerden hangisi doğrudur?',
      choices: [
        '`value` React state’inden gelir ve `onChange` ile state güncellenir',
        '`defaultValue` ile kontrollü bileşen tanımlanır; onChange gerekmez',
        'DOM’daki değer tek kaynak kabul edilir; React sadece izler',
        '`value` verilmez; yalnızca `onChange` ile okunur',
      ],
      correctAnswer: '`value` React state’inden gelir ve `onChange` ile state güncellenir',
    },
    dragOrderActivity: {
      title: 'Alıştırma sırası — kontrollü alan düşün',
      description: 'Başarılı kontrollü tek satır yapısı.',
      items: [
        {
          id: 'state',
          text: 'useState veya uygun tek kaynak ile değer alanı oluştur',
        },
        { id: 'value', text: 'input value={durum} ile DOM’u state’e bağla' },
        {
          id: 'change',
          text: 'onChange içinde güncellenmiş dizgeyi setter’a ilet',
        },
      ],
      correctOrderIds: ['state', 'value', 'change'],
    },
    challenge: {
      initialCode: `import { useState } from 'react'

export default function App() {
  const [eposta, setEposta] = useState('')

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 320 }}>
      <span>E-posta (kontrollü)</span>
      <input
        type="email"
        value={eposta}
        onChange={(e) => setEposta(e.target.value)}
        autoComplete="off"
      />
      <small style={{ opacity: 0.7 }}>Uzunluk: {eposta.length}</small>
    </label>
  )
}`,
      expectedOutputDescription:
        'Yazı yazıldıkça karakter sayısı güncellenmeli; input kontrollü (value + onChange) olmalı.',
    },
  },
  {
    id: 'state-lists-forms-submit',
    moduleId: 'state-lists',
    title: 'Forms Submit ve PreventDefault',
    difficulty: 'orta',
    content: `
## \`form\` ve \`onSubmit\`

Çok alanlı formlarda \`<form onSubmit={handler}>\` kullanmak **Enter** tuşu ile gönderimi ve erişilebilirliği doğal hale getirir.

## \`preventDefault\`

Tarayıcı, form gönderiminde sayfayı **yeniden yükleme** (tam sayfa navigation) eğilimindedir. SPA’da \`event.preventDefault()\` ile bu varsayılanı durdurur, sonra API / state güncellersiniz.

## Tip güvenliği

TypeScript’te \`React.FormEvent\` veya \`FormEvent<HTMLFormElement>\` kullanılabilir; projede \`e: FormEvent\` → build util \`React.FormEvent\` ile düzeltilir.

> **Pratik not:** “\`onSubmit\` ile düğme \`onClick\` farkı?” — Enter ve form semantiği; birden çok gönderim yolu.

> **Pratik not:** “Neden bazen \`type=\\"button\\"\`?” — form içinde yanlışlıkla submit’i engellemek için.
`.trim(),
    codeExamples: [
      {
        title: 'Submit + preventDefault',
        code: `import { FormEvent, useState } from 'react'

export default function KayitFormu() {
  const [sonuc, setSonuc] = useState<string | null>(null)

  function gonder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSonuc('Gönderildi (sayfa yenilenmedi)')
  }

  return (
    <form onSubmit={gonder}>
      <button type="submit">Kaydet</button>
      {sonuc}
    </form>
  )
}`,
      },
    ],
    quiz: {
      question:
        'React SPA’da form `onSubmit` içinde `event.preventDefault()` çağrılmasının başlıca nedeni nedir?',
      choices: [
        "React'ın sentetik olay havuzunu temizlemek",
        'Tarayıcının tam sayfa yenilemesi / varsayılan POST navigasyonunu engellemek',
        'CSS geçiş animasyonlarını iptal etmek',
        '`key` prop’unu yeniden hesaplamak',
      ],
      correctAnswer:
        'Tarayıcının tam sayfa yenilemesi / varsayılan POST navigasyonunu engellemek',
    },
    dragOrderActivity: {
      title: 'Alıştırma sırası — SPA form gönderimi',
      description: '`onSubmit` ile çalışan tipik sıra.',
      items: [
        { id: 'wire', text: '<form onSubmit={handler}> ile dinleyici bağla' },
        {
          id: 'stop',
          text: 'Handler’da preventDefault ile varsayılan yenilemeyi durdur',
        },
        { id: 'work', text: 'Doğrulama/state/API gibi işi kendi kodunuzda tamamla' },
      ],
      correctOrderIds: ['wire', 'stop', 'work'],
    },
    challenge: {
      initialCode: `import { useState } from 'react'

export default function App() {
  const [ad, setAd] = useState('')
  const [mesaj, setMesaj] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMesaj('Hoş geldin, ' + (ad.trim() || 'misafir'))
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}
    >
      <label>
        Ad
        <input
          value={ad}
          onChange={(e) => setAd(e.target.value)}
          style={{ display: 'block', width: '100%', marginTop: 4 }}
        />
      </label>
      <button type="submit">Gönder</button>
      {mesaj != null ? <p style={{ margin: 0 }}>{mesaj}</p> : null}
    </form>
  )
}`,
      expectedOutputDescription:
        'Form gönderilince sayfa tam yenilenmemeli; preventDefault sonrası kişiselleştirilmiş hoş geldin mesajı görünmeli.',
    },
  },
  ...additionalStateListsLessons,
]
