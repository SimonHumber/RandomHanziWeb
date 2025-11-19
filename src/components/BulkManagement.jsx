import { useState, useEffect } from 'react'
import { loadHSKData, loadTOCFLData, loadKanjiData, loadSentenceData } from '../utils/dataLoader'
import { getRandomlyDisabledIds, randomlyDisableItems, reenableRandomlyDisabled, getDisabledIds } from '../utils/storage'

const AVAILABLE_LEVELS = {
  hsk: [1, 2],
  tocfl: [1],
  kanji: [1, 2],
  sentence: []
}

function BulkManagement() {
  const [category, setCategory] = useState('hsk')
  const [level, setLevel] = useState(1)
  const [count, setCount] = useState(10)
  const [countInput, setCountInput] = useState('10')
  const [characterFilter, setCharacterFilter] = useState('all') // 'all', 'single', 'multi'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [randomlyDisabledCount, setRandomlyDisabledCount] = useState(0)

  useEffect(() => {
    updateRandomlyDisabledCount()
  }, [category, level])

  const updateRandomlyDisabledCount = () => {
    const type = getCategoryType(category)
    const levelToUse = category === 'sentence' ? null : level
    const disabled = getRandomlyDisabledIds(type, levelToUse)
    setRandomlyDisabledCount(disabled.length)
  }

  const getCategoryType = (cat) => {
    switch (cat) {
      case 'hsk': return 'HSK'
      case 'tocfl': return 'TOCFL'
      case 'kanji': return 'KANJI'
      case 'sentence': return 'SENTENCES'
      default: return 'HSK'
    }
  }

  const handleRandomDisable = async () => {
    setLoading(true)
    setMessage('')
    try {
      let allItems = []
      const type = getCategoryType(category)

      switch (category) {
        case 'hsk':
          allItems = await loadHSKData(level)
          break
        case 'tocfl':
          allItems = await loadTOCFLData(level)
          break
        case 'kanji':
          allItems = await loadKanjiData(level)
          break
        case 'sentence':
          allItems = await loadSentenceData()
          break
        default:
          break
      }

      const levelToUse = category === 'sentence' ? null : level
      const result = randomlyDisableItems(type, allItems, count, levelToUse, characterFilter)
      setMessage(result.message)
      updateRandomlyDisabledCount()
    } catch (error) {
      console.error('Error disabling items:', error)
      setMessage('Error disabling items')
    } finally {
      setLoading(false)
    }
  }

  const handleReenable = () => {
    setLoading(true)
    setMessage('')
    try {
      const type = getCategoryType(category)
      const levelToUse = category === 'sentence' ? null : level
      const result = reenableRandomlyDisabled(type, levelToUse)
      setMessage(result.message)
      updateRandomlyDisabledCount()
    } catch (error) {
      console.error('Error re-enabling items:', error)
      setMessage('Error re-enabling items')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)
    const available = AVAILABLE_LEVELS[newCategory]
    if (available.length > 0) {
      setLevel(available[0])
    }
    setMessage('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Bulk Management</h1>
      <p className="text-gray-600 mb-6">
        Randomly disable a specified number of characters or re-enable previously randomly disabled items for each test.
      </p>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="hsk">HSK Vocabulary</option>
              <option value="tocfl">TOCFL Vocabulary</option>
              <option value="kanji">Kanji</option>
              <option value="sentence">Sentence</option>
            </select>
          </div>

          {(category === 'hsk' || category === 'tocfl' || category === 'kanji') && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {category === 'kanji' ? 'Grade' : 'Level'}
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {AVAILABLE_LEVELS[category].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {category === 'kanji' ? `Grade ${lvl}` : `Level ${lvl}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(category === 'hsk' || category === 'tocfl' || category === 'sentence') && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Character Type
              </label>
              <select
                value={characterFilter}
                onChange={(e) => setCharacterFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All</option>
                <option value="single">Single Character</option>
                <option value="multi">Multi Character</option>
              </select>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Items to Randomly Disable
            </label>
            <input
              type="number"
              min="1"
              value={countInput}
              onChange={(e) => {
                const value = e.target.value
                setCountInput(value)
                const numValue = Number(value)
                if (value !== '' && !isNaN(numValue) && numValue >= 1) {
                  setCount(numValue)
                }
              }}
              onBlur={(e) => {
                const numValue = Number(e.target.value)
                if (e.target.value === '' || isNaN(numValue) || numValue < 1) {
                  setCountInput('1')
                  setCount(1)
                } else {
                  setCountInput(String(numValue))
                  setCount(numValue)
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              This will randomly select and disable the specified number of enabled items.
            </p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-md ${
              message.includes('Error') 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleRandomDisable}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Randomly Disable'}
            </button>

            {randomlyDisabledCount > 0 && (
              <button
                onClick={handleReenable}
                disabled={loading}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Processing...' : `Re-enable ${randomlyDisabledCount} Items`}
              </button>
            )}
          </div>

          {randomlyDisabledCount > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>{randomlyDisabledCount}</strong> items are currently randomly disabled for this category and level.
                Click "Re-enable" to restore them.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">How it works</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Select a category and level/grade</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Specify how many items you want to randomly disable</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>The system will randomly select and disable that many enabled items</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>You can re-enable all randomly disabled items at any time</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Each category and level combination is tracked separately</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BulkManagement

