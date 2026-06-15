import { writeFileSync } from 'fs'
import { pinyin } from 'pinyin-pro'
import { nouns, verbs, adjectives, adverbs, conjunctions } from './wordData.js'

function toPinyin(text) {
  return pinyin(text, { toneType: 'symbol', type: 'array' }).join(' ')
}

function capitalizePinyin(sentence) {
  const py = toPinyin(sentence)
  return py.charAt(0).toUpperCase() + py.slice(1)
}

const categories = [
  { name: '名词', words: nouns },
  { name: '动词', words: verbs },
  { name: '形容词', words: adjectives },
  { name: '副词', words: adverbs },
  { name: '连词', words: conjunctions },
]

let id = 1
const vocabulary = []

for (const { name, words } of categories) {
  for (const [word, vietnamese, example, exampleVietnamese] of words) {
    vocabulary.push({
      id: id++,
      word,
      pinyin: toPinyin(word),
      vietnamese,
      category: name,
      example,
      examplePinyin: capitalizePinyin(example),
      exampleVietnamese,
    })
  }
}

const outPath = new URL('../src/data/vocabulary.json', import.meta.url)
writeFileSync(outPath, JSON.stringify(vocabulary, null, 2), 'utf-8')
console.log(`Generated ${vocabulary.length} words -> ${outPath.pathname}`)
