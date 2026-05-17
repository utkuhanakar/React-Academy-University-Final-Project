/** Hızlı hatırlatıcı kartları — çalışma stüdyosu sekmesi için tek kaynak. */
export type QuickReferenceCard = Readonly<{
  title: string
  summary: string
  code: string
  lang: string
  tag: string
}>

export const QUICK_REFERENCE_CARDS: ReadonlyArray<QuickReferenceCard> = [
  {
    title: 'useState',
    tag: 'Hook',
    summary: 'Bileşende yerel state tutar; setter yeni render planlar.',
    code: `const [n, setN] = useState(0)
setN((x) => x + 1)`,
    lang: 'tsx',
  },
  {
    title: 'useEffect',
    tag: 'Hook',
    summary: 'Render sonrası yan etki; bağımlılık listesi ne zaman tekrar çalışacağını belirler.',
    code: `useEffect(() => {
  const id = setInterval(() => {}, 1000)
  return () => clearInterval(id)
}, [])`,
    lang: 'tsx',
  },
  {
    title: 'useRef',
    tag: 'Hook',
    summary: 'DOM veya render tetiklemeyen kalıcı kutu; .current mutasyona açık.',
    code: `const r = useRef<HTMLInputElement>(null)
r.current?.focus()`,
    lang: 'tsx',
  },
  {
    title: 'useContext',
    tag: 'Hook',
    summary: 'En yakın Provider’ın value değerini okur; Provider değişince yeniden render.',
    code: `const Tema = createContext<'a' | 'k'>('a')
const t = useContext(Tema)`,
    lang: 'tsx',
  },
  {
    title: 'useReducer',
    tag: 'Hook',
    summary: 'Karmaşık state geçişlerini (action + reducer) merkezileştirir.',
    code: `const [s, d] = useReducer(reducer, baslangic)
d({ type: 'ekle', id: 'x' })`,
    lang: 'tsx',
  },
  {
    title: 'useMemo / useCallback',
    tag: 'Hook',
    summary: 'Hesaplanan değeri veya fonksiyon referansını bağımlılığa göre önbelleğe alır.',
    code: `const toplam = useMemo(() => a + b, [a, b])
const fn = useCallback(() => {}, [dep])`,
    lang: 'tsx',
  },
  {
    title: 'useLayoutEffect',
    tag: 'Hook',
    summary: 'DOM’a yazımdan hemen sonra senkron çalışır; ölçüm / flicker önler.',
    code: `useLayoutEffect(() => {
  const w = ref.current?.offsetWidth
}, [])`,
    lang: 'tsx',
  },
  {
    title: 'Props',
    tag: 'Veri',
    summary: 'Üstten alta salt okunur parametreler; tek yönlü veri akışını taşır.',
    code: `type P = { ad: string; onSil: () => void }
function X({ ad, onSil }: P) { ... }`,
    lang: 'tsx',
  },
  {
    title: 'children',
    tag: 'Kompozisyon',
    summary: 'Etiket çocukları slot olarak iletilir; layout / kart bileşenlerinde sık.',
    code: `<Kart baslik="Özet">{icerik}</Kart>`,
    lang: 'tsx',
  },
  {
    title: 'Olaylar (events)',
    tag: 'DOM',
    summary: "JSX'te camelCase onClick; handler'a argüman için arrow kullan.",
    code: `<button onClick={() => sil(id)}>Sil</button>`,
    lang: 'tsx',
  },
  {
    title: 'Koşullu render',
    tag: 'JSX',
    summary: 'Ternary iki dal; && ile dikkat (0 tuzaklığı).',
    code: `{acik ? <Panel /> : null}
{n > 0 && <Uyari />}`,
    lang: 'tsx',
  },
  {
    title: 'Listeler & key',
    tag: 'Liste',
    summary: 'Kardeşler arasında stabil kimlik; indeks son çare.',
    code: `{items.map((x) => (
  <li key={x.id}>{x.ad}</li>
))}`,
    lang: 'tsx',
  },
  {
    title: 'Formlar (kontrollü)',
    tag: 'Form',
    summary: 'value + onChange ile tek kaynak React state.',
    code: `<input
  value={metin}
  onChange={(e) => setMetin(e.target.value)}
/>`,
    lang: 'tsx',
  },
  {
    title: 'createPortal',
    tag: 'Portal',
    summary: "DOM'da başka kökte çizmek için (modal tooltip).",
    code: `createPortal(<Modal />, document.body)`,
    lang: 'tsx',
  },
  {
    title: 'Error boundary',
    tag: 'Hata',
    summary: 'Sınıf bileşeninde getDerivedStateFromError / componentDidCatch.',
    code: `static getDerivedStateFromError() {
  return { hasError: true }
}`,
    lang: 'tsx',
  },
  {
    title: 'Fragment',
    tag: 'JSX',
    summary: 'Ekstra DOM düğümü eklemeden birden çok çocuk.',
    code: `<>satir1</> // veya <Fragment>`,
    lang: 'tsx',
  },
]
