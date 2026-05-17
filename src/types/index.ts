/** Ders kartı yerleşimi: `laboratory` yalnızca geniş canlı kod alanı odaklı ders içindir. */
export type LessonLayoutKind = 'default' | 'laboratory'

/** Modül kimliği: içerik `data/` altında dosyalara ayrılır. */
export type LessonModuleId =
  | 'intro'
  | 'components'
  | 'state-lists'
  | 'hooks'
  | 'expert'

/** Ders içinde gösterilecek tek bir kod örneği. */
export interface LessonCodeExample {
  /** Örnek başlığı (ör. “Props ile veri aktarımı”). */
  title: string
  /** Örnek kaynak kodu. */
  code: string
  /** İsteğe bağlı kısa açıklama. */
  caption?: string
}

/** Çoktan seçmeli hızlı kontrol sorusu. */
export interface LessonQuiz {
  question: string
  /** Şıklar; sıra sabittir. */
  choices: readonly string[]
  /**
   * Doğru şıkkın metni; `choices` içindeki değerlerden biriyle
   * birebir aynı olmalıdır.
   */
  correctAnswer: string
}

/** Sürükleyerek veya oklarla doğru sıraya dizme (adımlar, kavramlar). */
export interface LessonDragOrderActivity {
  title: string
  description?: string
  items: readonly { id: string; text: string }[]
  correctOrderIds: readonly string[]
}

/** Kod parçalarını doğru sıraya dizme. */
export interface LessonDragCodeActivity {
  title: string
  description?: string
  pieces: readonly { id: string; code: string }[]
  correctOrderIds: readonly string[]
}

/** `___` ile işaretlenmiş boşluklar; `wordBank` ve `blanks` aynı sayıda olmalıdır. */
export interface LessonClozeActivity {
  title: string
  description?: string
  text: string
  blanks: readonly { accepted: readonly string[] }[]
  wordBank: readonly string[]
}

/** Uygulama genelinde kullanılan ders kaydı. */
export interface Lesson {
  id: string
  moduleId: LessonModuleId
  title: string
  difficulty: 'başlangıç' | 'orta' | 'ileri'
  /** Varsayılan: tam ders kartı. `laboratory`: kısa giriş + büyük görev alanı. */
  lessonLayout?: LessonLayoutKind
  /** Konu anlatımı (Markdown veya düz metin). */
  content: string
  /** Birden fazla örnek kod. */
  codeExamples: readonly LessonCodeExample[]
  quiz: LessonQuiz
  /** Birincil quiz’e ek isteğe bağlı hızlı kontroller; hepsi doğruysa ders adımı geçer. */
  readonly extraQuizChecks?: readonly LessonQuiz[]
  /** İsteğe bağlı etkinlikler — tamamlanmadan “Dersi bitir” açılmaz. */
  dragOrderActivity?: LessonDragOrderActivity
  dragCodeActivity?: LessonDragCodeActivity
  clozeActivity?: LessonClozeActivity
  challenge: LessonChallenge
}

/** Canlı görev: başlangıç kodu + beklenen sonuç tanımı. */
export interface LessonChallenge {
  /** CodePlayground / react-live başlangıç kaynağı (çoğu ders `export default` içerir). */
  initialCode: string
  /** Öğrencinin önizlemede veya davranışta görmesi beklenen çıktının metinsel tanımı. */
  expectedOutputDescription: string
}
