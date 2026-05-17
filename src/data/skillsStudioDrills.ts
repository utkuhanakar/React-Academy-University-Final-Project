import type { LessonQuiz } from '../types'

/** Peş peşe alıştırma kartları — Skills Studio ilk sekme */
export interface SkillDrillCard {
  id: string
  title: string
  subtitle: string
  quiz: LessonQuiz
}

export const SKILLS_STUDIO_DRILLS: readonly SkillDrillCard[] = [
  {
    id: 'drill-hook-usestate-shape',
    title: 'useState dönüş çifti',
    subtitle: 'Hook',
    quiz: {
      question: '`const [durum, guncelle] = useState(0);` ifadesinin doğru özeti?',
      choices: [
        'Sırasıyla güncelleyici, sonra başlangıç durumunu taşır',
        'İlk değişken okunur durumdur; ikincisi güncelleyendir',
        '`guncelle` senkron biçimde DOM’ı zorlar',
        '`useState` ancak Redux ile birlikte çalışır',
      ],
      correctAnswer:
        'İlk değişken okunur durumdur; ikincisi güncelleyendir',
    },
  },
  {
    id: 'drill-useeffect-clean',
    title: 'Efekt cleanup',
    subtitle: 'useEffect',
    quiz: {
      question: '`useEffect` içinden neden zaman zaman bir fonksiyon dönmek gerekebilir?',
      choices: [
        'Çünkü React bu kalıbla render sayısını sıfırlar garanti olarak',
        'Temiz fonksiyon abonelik, dinleyici veya zamanlayıcıyı yeni koşuya geçirmeden koparmaktır',
        'Return JSX üretmezse olay yakalayıcı oluşturmaz garanti olarak',
        'Cleanup JSX’te yasaklı olduğu için gerek ya da gereksiz hata seç',
      ],
      correctAnswer:

        'Temiz fonksiyon abonelik, dinleyici veya zamanlayıcıyı yeni koşuya geçirmeden koparmaktır',

    },

  },

  {

    id: 'drill-context-use',

    title: 'Context ile prop drilling',

    subtitle: 'Mimari',

    quiz: {


      question: 'Çapraz bileşenlere sık sık gereken yapıların paylaşımında doğru motivasyon?',


      choices: [

        '`Context` Redux yerine gereken her yerde seçilmelidir zorları',

        '`Theme`/yerelleştirme gibi sık gereken yapıların prop zincirsiz merkezi sağlanması',
        '`Context` sadece hata yakalamak için vardır',
        '`Context` yalnızca class bileşeninde çalışır',
      ],

      correctAnswer:


        '`Theme`/yerelleştirme gibi sık gereken yapıların prop zincirsiz merkezi sağlanması',


    },


  },
  {
    id: 'drill-usememo-when',
    title: '`useMemo` ne zaman?',
    subtitle: 'Performans',
    quiz: {
      question:
        '`useMemo` ile ilk çağırmada hesap üretilen değeri önbelleğe alma kararı daha çok hangi bağlam için geçerlidir?',
      choices: [
        'Her render’ın mutlaka hızlı olması için gereken her bileşende',
        'Gerçekten pahalı hesap ya da gereksiz re-render’a yol açan nesne/dizi yeniden oluşumunu kesmek için',
        '`useMemo` olmadan React hiçbir zaman render etmeyi reddeder',
        'Yalnızca Redux store’a bağlı bileşenlerde anlamlıdır',
      ],
      correctAnswer:
        'Gerçekten pahalı hesap ya da gereksiz re-render’a yol açan nesne/dizi yeniden oluşumunu kesmek için',
    },
  },
  {
    id: 'drill-usecallback-purpose',
    title: '`useCallback` sıklığı',
    subtitle: 'Hooks',
    quiz: {
      question:
        '`useCallback(fn, deps)` sıklıkla hangi tür gereksinim veya tuzak için düşünülür?',
      choices: [
        'İmperatif olarak DOM’a yazmak için Redux yerine seçilir',
        'Alt bileşenlere iletilen ve bellekte referans kimliği önem taşıyan callback’leri `deps` değişmeden sabitlemek',
        '`useMemo` varsa mutlaka `useCallback` de eklenmelidir',
        'Yalnızca zamanlayıcı başlatmak için kullanılır; parametre gerektiremez.',
      ],
      correctAnswer:
        'Alt bileşenlere iletilen ve bellekte referans kimliği önem taşıyan callback’leri `deps` değişmeden sabitlemek',
    },
  },
  {
    id: 'drill-forms-default-submitted',
    title: '`defaultValue` + submit',
    subtitle: 'Form',
    quiz: {
      question:
        'Kontrolsüz (uncontrolled) bir `<input>` değişimini yakalamada tipik yaklaşım hangisidir?',
      choices: [
        '`value={state}` unutup yalnızca `MutationObserver` beklemek',
        'Form gönderiminde `FormData`/ref ile DOM’dan güncel değeri okumak ya da küçük değişimi `onChange` ile yakalamak',
        '`preventDefault` yalnızca sunucu tarafında anlamlıdır',
        'Kontrollü ile kontrolsüzün ayrımı gereksizdir',
      ],
      correctAnswer:
        'Form gönderiminde `FormData`/ref ile DOM’dan güncel değeri okumak ya da küçük değişimi `onChange` ile yakalamak',
    },
  },
  {
    id: 'drill-list-key-stable-id',
    title: '`key` ve kimlik',
    subtitle: 'Listeler',
    quiz: {
      question:
        'Sunucudan gelen liste öğelerinde `key` için genelde en sağlıklı tercih hangisidir?',
      choices: [
        'Her yeniden çıkarmanın başında yeniden seçilmek için `Math.random()`',
        'Varsa kalıcı `id`; yoksa yalnızca sıranın garanti olarak sabit olduğu durumlarda son çareden dizin',
        '`key` yalnızca test ortamları için zorunludur',
        '`Fragment` olduğunda liste satırı kimliği gerekmez',
      ],
      correctAnswer:
        'Varsa kalıcı `id`; yoksa yalnızca sıranın garanti olarak sabit olduğu durumlarda son çareden dizin',
    },
  },
  {
    id: 'drill-useeffect-async-iife',
    title: '`useEffect` ve async',
    subtitle: 'useEffect',
    quiz: {
      question:
        'Efekt fonksiyonunu doğrudan `async () => { … }` vermeyi sıkça kaçının; temeline en yakını hangisi?',
      choices: [
        'React async ise derlemeyi durdurur.',
        '`async` fonksiyon `Promise` döndürür; React ise bazen döndürülen değerde temizlik işlevini beklediği için belirsiz/dağınık sıra doğurabilir.',
        '`fetch` yalnızca `useReducer` ile yazılmalıdır.',
        'Yalnızca Redux mağaza bileşenlerinde yanlıştır.',
      ],
      correctAnswer:
        '`async` fonksiyon `Promise` döndürür; React ise bazen döndürülen değerde temizlik işlevini beklediği için belirsiz/dağınık sıra doğurabilir.',
    },
  },
  {
    id: 'drill-synthetic-events',
    title: 'Sentetik olaylar',
    subtitle: 'Olaylar',
    quiz: {
      question:
        'React’taki sentetik (SyntheticEvent) yaklaşımının ana fikrine en yakın ifade hangisidir?',
      choices: [
        'Gerçek olay yokmuş gibi kurgulanır',
        'Gerçek tarayıcı olayını daha tutarlı bir arayüzle sararak çoğu senaryoda benzer kullanıcı deneyimi sunmak',
        'Sentetik olaylar yalnızca geliştirme modunda oluşur',
        '`preventDefault` çağırmayı sunucuya özgü kılar',
      ],
      correctAnswer:
        'Gerçek tarayıcı olayını daha tutarlı bir arayüzle sararak çoğu senaryoda benzer kullanıcı deneyimi sunmak',
    },
  },
  {
    id: 'drill-prop-drilling-plain',
    title: 'Prop drilling',
    subtitle: 'Mimari',
    quiz: {
      question: '“Prop drilling” neyi tanımlar?',
      choices: [
        '`props` üst bileşende yazıldığı için alt bileşen hiç props alamazdır',
        'Veriyi hedef bileşene ulaşana dek ara bileşenlere prop olarak ardışık iletmek',
        '`Context` kullanmak her zaman antipattern olarak kabul edilir',
        '`useRef`, prop zinciri sorununu doğrudan ortadan kaldırır',
      ],
      correctAnswer:
        'Veriyi hedef bileşene ulaşana dek ara bileşenlere prop olarak ardışık iletmek',
    },
  },
]
