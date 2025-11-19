import { useState, useEffect } from 'react'
import { loadHSKData } from '../utils/dataLoader'
import { getDisabledIds, toggleItem, isItemEnabled } from '../utils/storage'

function HSKPractice() {
  const [level, setLevel] = useState(1)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [characterFilter, setCharacterFilter] = useState('all') // 'all', 'single', 'multi'
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'enabled', 'disabled'
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [level])

  useEffect(() => {
    filterData()
  }, [data, characterFilter, statusFilter, searchTerm])

  const loadData = async () => {
    setLoading(true)
    const loaded = await loadHSKData(level)
    setData(loaded)
    setLoading(false)
  }

  const filterData = () => {
    let filtered = [...data]

    // Filter by character count
    if (characterFilter === 'single') {
      filtered = filtered.filter((item) => item.characterCount === 1)
    } else if (characterFilter === 'multi') {
      filtered = filtered.filter((item) => item.characterCount > 1)
    }

    // Filter by status
    if (statusFilter === 'enabled') {
      filtered = filtered.filter((item) => isItemEnabled('HSK', item.id))
    } else if (statusFilter === 'disabled') {
      filtered = filtered.filter((item) => !isItemEnabled('HSK', item.id))
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter((item) => {
        return (
          item.traditionalChinese?.toLowerCase().includes(term) ||
          item.simplifiedChinese?.toLowerCase().includes(term) ||
          item.pinyin?.toLowerCase().includes(term) ||
          item.jyutping?.toLowerCase().includes(term) ||
          item.english?.toLowerCase().includes(term) ||
          item.vietnamese?.toLowerCase().includes(term) ||
          item.hanviet?.toLowerCase().includes(term)
        )
      })
    }

    setFilteredData(filtered)
  }

  const handleToggle = (id) => {
    toggleItem('HSK', id)
    filterData()
  }

  if (loading) {
    return (
      <div>
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">HSK Vocabulary Practice</h2>

      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>Level 1</option>
              <option value={2}>Level 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Character Type
            </label>
            <select
              value={characterFilter}
              onChange={(e) => setCharacterFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="single">Single Character</option>
              <option value="multi">Multi Character</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-gray-600">
            Showing {filteredData.length} of {data.length} items
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by character, pinyin, jyutping, english, vietnamese..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((item) => (
          <VocabularyCard
            key={item.id}
            item={item}
            enabled={isItemEnabled('HSK', item.id)}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </div>
    </div>
  )
}

function VocabularyCard({ item, enabled, onToggle }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-2 ${
        enabled ? 'border-gray-200' : 'border-gray-400 opacity-60'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="text-3xl font-bold mb-2 text-gray-800">
            {item.simplifiedChinese}
          </div>
          {item.traditionalChinese !== item.simplifiedChinese && (
            <div className="text-2xl text-gray-600 mb-2">
              {item.traditionalChinese}
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className={`px-3 py-1 rounded text-sm font-medium ${
            enabled
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {enabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <span className="font-semibold text-gray-700">Pinyin:</span>{' '}
          <span className="text-gray-600">{item.pinyin}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Jyutping:</span>{' '}
          <span className="text-gray-600">{item.jyutping}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">English:</span>{' '}
          <span className="text-gray-600">{item.english}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Vietnamese:</span>{' '}
          <span className="text-gray-600">{item.vietnamese}</span>
        </div>
        {item.hanviet && (
          <div>
            <span className="font-semibold text-gray-700">Han Viet:</span>{' '}
            <span className="text-gray-600">{item.hanviet}</span>
          </div>
        )}
        <div className="pt-2 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            {item.characterCount} character{item.characterCount > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}

export default HSKPractice

