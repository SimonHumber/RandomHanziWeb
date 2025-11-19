import { useState, useEffect } from 'react'
import { loadKanjiData } from '../utils/dataLoader'
import { getDisabledIds, toggleItem, isItemEnabled } from '../utils/storage'

function KanjiPractice() {
  const [grade, setGrade] = useState(1)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'enabled', 'disabled'
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [grade])

  useEffect(() => {
    filterData()
  }, [data, statusFilter, searchTerm])

  const loadData = async () => {
    setLoading(true)
    const loaded = await loadKanjiData(grade)
    setData(loaded)
    setLoading(false)
  }

  const filterData = () => {
    let filtered = [...data]

    // Filter by status
    if (statusFilter === 'enabled') {
      filtered = filtered.filter((item) => isItemEnabled('KANJI', item.kanji))
    } else if (statusFilter === 'disabled') {
      filtered = filtered.filter((item) => !isItemEnabled('KANJI', item.kanji))
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter((item) => {
        return (
          item.kanji?.toLowerCase().includes(term) ||
          item.onyomi?.toLowerCase().includes(term) ||
          item.kunyomi?.toLowerCase().includes(term) ||
          item.english?.toLowerCase().includes(term) ||
          item.viet?.toLowerCase().includes(term) ||
          item.hanviet?.toLowerCase().includes(term)
        )
      })
    }

    setFilteredData(filtered)
  }

  const handleToggle = (kanji) => {
    toggleItem('KANJI', kanji)
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Kanji Practice</h2>

      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value={1}>Grade 1</option>
              <option value={2}>Grade 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
            placeholder="Search by kanji, on'yomi, kun'yomi, english, vietnamese..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((item, index) => (
          <KanjiCard
            key={`${item.kanji}-${index}`}
            item={item}
            enabled={isItemEnabled('KANJI', item.kanji)}
            onToggle={() => handleToggle(item.kanji)}
          />
        ))}
      </div>
    </div>
  )
}

function KanjiCard({ item, enabled, onToggle }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-2 ${
        enabled ? 'border-gray-200' : 'border-gray-400 opacity-60'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="text-4xl font-bold text-gray-800">{item.kanji}</div>
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
          <span className="font-semibold text-gray-700">On'yomi:</span>{' '}
          <span className="text-gray-600">{item.onyomi || 'N/A'}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Kun'yomi:</span>{' '}
          <span className="text-gray-600">{item.kunyomi || 'N/A'}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">English:</span>{' '}
          <span className="text-gray-600">{item.english}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Vietnamese:</span>{' '}
          <span className="text-gray-600">{item.viet}</span>
        </div>
        {item.hanviet && (
          <div>
            <span className="font-semibold text-gray-700">Han Viet:</span>{' '}
            <span className="text-gray-600">{item.hanviet}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default KanjiPractice

