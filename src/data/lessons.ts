import { introLessons } from './intro'
import { componentsLessons } from './components'
import { stateListsLessons } from './state-lists'
import { hooksLessons } from './hooks'
import { expertLessons } from './expert'
import type { Lesson } from '../types'

/**
 * Tüm modüllerden gelen derslerin birleşik listesi.
 * Sıra: giriş → bileşenler → state/list/form → hooks → uzman → büyük çalışma laboratuvarı.
 */
export const lessons: Lesson[] = [
  ...introLessons,
  ...componentsLessons,
  ...stateListsLessons,
  ...hooksLessons,
  ...expertLessons,
]

export type { Lesson } from '../types'
