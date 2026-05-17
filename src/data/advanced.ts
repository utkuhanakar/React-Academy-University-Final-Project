import type { Lesson } from '../types'

/** Ek state/list/form dersleri — `state-lists` modülüne dahil edilir. */
export const additionalStateListsLessons: Lesson[] = [
  {
    id: 'advanced-form-yonetimi',
    moduleId: 'state-lists',
    title: 'Form Yönetimi',
    difficulty: 'orta',
    content: `
## Kontrollü bileşenler

Metin kutusu, seçim listesi ve onay kutusu gibi öğelerde **değeri state’ten okuyup** olayla güncelliyorsanız, buna kontrollü bileşen denir. Böylece React, ekrandaki değer ile veri modeli arasında tek yön kurar ve “programatik” güncelleme yapmak kolaylaşır (ör. formu sıfırlamak).

## Gönderim ve doğrulama

\`onSubmit\` içinde \`preventDefault\` ile tam sayfa yenilemeyi engelleyip kendi işleminizi yaparsınız. Doğrulama hatalarını alan bazında state’te tutmak yaygındır; kullanıcı düzelttikçe ilgili hatayı temizlemek iyi bir UX alışkanlığıdır.

## Tipler ve erişilebilirlik

\`htmlFor\` ile etiketleri input’lara bağlayın; hata mesajlarını \`role="alert"\` veya \`aria-describedby\` ile ilişkilendirin. Öğrenci projelerinde bu adımlar sık atlanır; erişilebilirlik notu ders notlarınızda sabit bir başlık olarak dursun.
    `.trim(),
    codeExamples: [
      {
        title: 'Basit kayıt formu ve hata alanı',
        code: `import { useState, type FormEvent } from 'react'

const epostaUygun = (s: string) => /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(s)

export default function Kayit() {
  const [eposta, setEposta] = useState('')
  const [hata, setHata] = useState<string | null>(null)

  function gonder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!epostaUygun(eposta)) {
      setHata('Geçerli bir e-posta girin.')
      return
    }
    setHata(null)
    alert('Kayıt isteği gönderildi: ' + eposta)
  }

  return (
    <form onSubmit={gonder} noValidate>
      <label htmlFor="ep">E-posta</label>
      <input
        id="ep"
        type="email"
        value={eposta}
        onChange={(e) => setEposta(e.target.value)}
        aria-invalid={Boolean(hata)}
        aria-describedby="ep-hata"
      />
      {hata ? (
        <p id="ep-hata" role="alert">
          {hata}
        </p>
      ) : null}
      <button type="submit">Gönder</button>
    </form>
  )
}`,
      },
      {
        title: 'Alanları nesnede toplamak',
        code: `import { useState } from 'react'

type Kayit = { ad: string; sinif: string }

export default function OgrenciKayit() {
  const [k, setK] = useState<Kayit>({ ad: '', sinif: '' })
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        console.log(k)
      }}
    >
      <input
        value={k.ad}
        onChange={(e) => setK((x) => ({ ...x, ad: e.target.value }))}
      />
      <select
        value={k.sinif}
        onChange={(e) => setK((x) => ({ ...x, sinif: e.target.value }))}
      >
        <option value="">Sınıf seçin</option>
        <option value="hazırlık">Hazırlık</option>
        <option value="1">1. sınıf</option>
      </select>
      <button type="submit">Kaydet</button>
    </form>
  )
}`,
      },
    ],
    quiz: {
      question:
        'Kontrollü bir input’ta value prop’u verildiğinde onChange atlanırsa ne olur?',
      choices: [
        "Kullanıcı yazamaz; React değeri sabit tutar.",
        'Tarayıcı otomatik olarak uncontrolled moda geçer.',
        "Sadece TypeScript hata verir.",
        'Performans iyileşir.',
      ],
      correctAnswer: "Kullanıcı yazamaz; React değeri sabit tutar.",
    },
    clozeActivity: {
      title: 'Alıştırma — erişilebilir tek alanlı form',
      text: '`label` ile girdiyi bağlamak için `htmlFor` değeri, `input` üzerindeki ___ özniteliği ile ___ olmalıdır.',
      blanks: [{ accepted: ['id'] }, { accepted: ['eşleşmeli', 'aynı olmalı'] }],
      wordBank: ['id', 'eşleşmeli', 'className', 'rastgele'],
    },
    challenge: {
      initialCode: `import { useState } from 'react'

export default function SoruFormu() {
  const [cevap, setCevap] = useState('')
  const [gonderildi, setGonderildi] = useState(false)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setGonderildi(true)
      }}
    >
      <label htmlFor="cv">En sevdiğiniz React konusu?</label>
      <input
        id="cv"
        value={cevap}
        onChange={(e) => setCevap(e.target.value)}
      />
      <button type="submit">Gönder</button>
      {gonderildi ? <p>Cevabınız kaydedildi (örnek).</p> : null}
    </form>
  )
}`,
      expectedOutputDescription:
        'Gönder’e basıldığında onay mesajı görünmeli; geçersiz durumda formun kilitlenmemesi yeterlidir.',
    },
  },
  {
    id: 'advanced-liste-render-map',
    moduleId: 'state-lists',
    title: 'Liste Render Etme (Map)',
    difficulty: 'orta',
    content: `
## map ile listeleme

React’te bir dizi veriyi arayüze dökmek için \`dizi.map\` en yaygın yoldur. Her öğe bir \`key\` ile işaretlenmelidir; **liste sırası değişecekse** (ekleme, silme, sıralama) kararlı ve benzersiz bir anahtar seçmek reconciler için önemlidir. Sabit kimlik yoksa geçici olarak indeks kullanılabilir; ancak sıra sık değişen listelerde indeks anahtarı performans ve durum tutma sorunlarına yol açabilir.

## Minimal öğe bileşeni

Her satırı küçük bir bileşene ayırmak, okuma ve test etmeyi kolaylaştırır. Üst bileşen yalnızca veri kaynağı ve düzenleme politikalarını taşır.

## Boş ve yükleme durumları

Dizi boşken kullanıcıya anlamlı bir mesaj göstermek, “kırık ekran” hissini önler. Yükleme sırasında iskelet veya metin etiketi, beklemeyi yönetilebilir kılar.
    `.trim(),
    codeExamples: [
      {
        title: 'Sabit anahtar ile katalog listesi',
        code: `type Kitap = { id: string; baslik: string }

const veri: Kitap[] = [
  { id: 'k1', baslik: 'Lineer Cebir' },
  { id: 'k2', baslik: 'Ayrık Matematik' },
]

function KitapSatiri({ baslik }: { baslik: string }) {
  return <li>{baslik}</li>
}

export default function KutuphaneListesi() {
  return (
    <ul>
      {veri.map((kitap) => (
        <KitapSatiri key={kitap.id} baslik={kitap.baslik} />
      ))}
    </ul>
  )
}`,
      },
      {
        title: 'Filtre ile alt liste',
        code: `import { useMemo, useState } from 'react'

const dersler = ['Fizik I', 'Kimya I', 'Matematik I', 'Programlama I']

export default function FiltreliDersler() {
  const [arama, setArama] = useState('')
  const sonuc = useMemo(() => {
    const q = arama.trim().toLowerCase()
    return dersler.filter((d) => d.toLowerCase().includes(q))
  }, [arama])

  return (
    <div>
      <input value={arama} onChange={(e) => setArama(e.target.value)} />
      <ul>
        {sonuc.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    </div>
  )
}`,
      },
    ],
    quiz: {
      question:
        'Liste öğelerinde key olarak rastgele Math.random() kullanmak neden önerilmez?',
      choices: [
        'Her render’da yeni anahtar üretilir ve React öğeleri yanlış tanır.',
        'React yalnızca sayısal key kabul eder.',
        'Math.random SSR’da çalışmaz.',
        'TypeScript buna izin vermez.',
      ],
      correctAnswer:
        'Her render’da yeni anahtar üretilir ve React öğeleri yanlış tanır.',
    },
    dragOrderActivity: {
      title: 'Liste render — tipik sıra',
      items: [
        { id: 'data', text: 'Liste verisini bileşene prop veya state olarak al' },
        {
          id: 'map',
          text: 'Öğeler için .map ile kardeş JSX üret (key ile)',
        },
        { id: 'empty', text: 'Boş liste özel durumunu kullanıcıya göster' },
      ],
      correctOrderIds: ['data', 'map', 'empty'],
    },
    challenge: {
      initialCode: `import { useState } from 'react'

const ilk: { id: number; metin: string }[] = [
  { id: 1, metin: 'Görev metnini oku' },
  { id: 2, metin: 'Sunuma hazırlan' },
]

export default function GorevListesi() {
  const [gorevler, setGorevler] = useState(ilk)

  function sil(id: number) {
    setGorevler((liste) => liste.filter((g) => g.id !== id))
  }

  return (
    <ul>
      {gorevler.map((g) => (
        <li key={g.id}>
          {g.metin}{' '}
          <button type="button" onClick={() => sil(g.id)}>
            Sil
          </button>
        </li>
      ))}
    </ul>
  )
}`,
      expectedOutputDescription:
        'Sil düğmesine basınca ilgili satır listeden kalkmalı; kalan öğelerin sırası bozulmadan güncellenmeli.',
    },
  },
  {
    id: 'advanced-kosullu-render',
    moduleId: 'state-lists',
    title: 'Koşullu Render',
    difficulty: 'orta',
    content: `
## Üç temel biçim

Koşullu içerik için sık kullanılan kalıplar: \`&&\` operatörü (sol taraf yanlışlıkla \`0\` olmamalı), üçlü operatör \`a ? b : c\`, veya önce bir \`let icerik\` değişkeni atayıp sonra tek \`return\` ile dönmek. Okunurluk, ekip kültürüne göre değişir; uzun zincirlerde erken \`return\` ile “guard clause” yazmak beyni yormaz.

## null ve boolean

React \`null\`, \`undefined\`, \`false\`’u genelde görmezden gelir; **sayı 0** ise ekranda \`0\` gösterebilir—bu, koşullu render hatalarında sık yapılan bir tuzaktır. \` Boolean(deger) && ...\` veya açık karşılaştırma tercih edin.

## Stratejik parçalama

Koşul karmaşıklaştığında, koşulu hesaplayan küçük bir fonksiyon veya \`useMemo\` ile türetilmiş bayrak, JSX’i sade tutar; daha büyük projelerde de “önce mantık, sonra JSX” yaklaşımını savunurum.
    `.trim(),
    codeExamples: [
      {
        title: 'Üyelik durumuna göre panel',
        code: `type Kullanici = { ad: string }

export default function Panel({
  kullanici,
}: {
  kullanici: Kullanici | null
}) {
  if (!kullanici) {
    return <p>Lütfen giriş yapın.</p>
  }
  return <p>Hoş geldiniz, {kullanici.ad}</p>
}`,
      },
      {
        title: 'Üçlü operatör ile sınıf seçimi',
        code: `export function DurumSatir({
  aktif,
}: {
  aktif: boolean
}) {
  return (
    <div className={aktif ? 'satir satir--secili' : 'satir'}>
      {aktif ? 'Seçili' : 'Seçilmedi'}
    </div>
  )
}`,
      },
    ],
    quiz: {
      question:
        'Aşağıdakilerden hangisi React’ta beklenmedik biçimde ekranda "0" gösterebilir?',
      choices: [
        '{false && <span />}',
        '{count && <Liste />}  // count bazı durumlarda 0 sayısı olabilir',
        '{null && <span />}',
        '{true && <span />}',
      ],
      correctAnswer:
        '{count && <Liste />}  // count bazı durumlarda 0 sayısı olabilir',
    },
    challenge: {
      initialCode: `import { useState } from 'react'

export default function KapiEtiketi() {
  const [acik, setAcik] = useState(false)
  return (
    <div>
      <button type="button" onClick={() => setAcik((a) => !a)}>
        Kapıyı {acik ? 'kapat' : 'aç'}
      </button>
      <p>{acik ? 'Kapı açık — geçebilirsiniz.' : 'Kapı kapalı bekleyin.'}</p>
    </div>
  )
}`,
      expectedOutputDescription:
        'Düğme etiketi ve alt paragraf metni kapının durumu ile tutarlı şekilde değişmeli.',
    },
  },
]
