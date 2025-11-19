# Random Hanzi - Chinese Learning App

A comprehensive React application for learning Chinese vocabulary (HSK, TOCFL), Japanese Kanji, and practicing Chinese sentences with tone guides.

## Features

### 1. HSK Vocabulary Practice
- Practice HSK (Hanyu Shuiping Kaoshi) vocabulary levels 1-2
- View both Simplified and Traditional Chinese characters
- Learn Pinyin and Jyutping (Cantonese pronunciation)
- See Vietnamese and English translations
- Includes Han Viet readings (Sino-Vietnamese pronunciations)
- Filter by character type (single/multi-character words)
- Enable/disable words to customize your study list

### 2. TOCFL Vocabulary Practice
- Practice TOCFL (Test of Chinese as a Foreign Language) vocabulary
- Taiwanese Mandarin focus
- Same features as HSK practice
- Traditional Chinese characters

### 3. Kanji Practice
- Learn Japanese kanji characters (grades 1-6)
- On'yomi and Kun'yomi readings
- Vietnamese and English translations
- Han Viet readings for Japanese kanji
- Grade-based filtering

### 4. Sentence Practice
- Practice complete Chinese sentences
- View Simplified and Traditional Chinese versions
- Pinyin and Jyutping pronunciations
- Written Cantonese translations
- Vietnamese and English translations
- Han Viet readings

### 5. Character List
- Browse all characters from all modes in one place
- Advanced search functionality
- Filter by type, level, character count, and status
- Enable/disable items to customize study lists
- All features from individual practice modes

### 6. Tone Guide
- Learn Mandarin Chinese tones (4 main tones + neutral tone)
- Learn Cantonese tones (6 tones with audio playback)
- Learn Vietnamese tones (6 tones)
- Interactive audio examples for Cantonese tones
- Detailed descriptions and examples for each tone
- Tone marks and pronunciation guides

## Setup

1. Install dependencies:
```bash
npm install
```

2. Ensure your data and audio folders are in the `public` directory:
   - `public/data/` - Contains all JSON data files
   - `public/audio/` - Contains Cantonese tone guide audio files (si1.mp3 through si6.mp3)

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Data Structure

The app expects the following JSON files in `public/data/`:
- `hsk_level1.json`
- `hsk_level2.json`
- `tocfl_level1.json`
- `kanji_grade1.json`
- `kanji_grade2.json`
- `sentances.json` (note: typo in filename is preserved)

Audio files should be in `public/audio/`:
- `si1.mp3` through `si6.mp3` (Cantonese tone guide)

## Technologies Used

- React 18
- React Router DOM
- Vite
- Tailwind CSS
- LocalStorage for user preferences

## Browser Support

Modern browsers that support ES6+ and LocalStorage.

