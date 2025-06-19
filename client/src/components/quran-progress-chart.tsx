import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Eye, RotateCcw } from 'lucide-react';

// Quran chapter data with authentic names and verses
const QURAN_CHAPTERS = [
  { number: 1, name: "Al-Fatiha", arabicName: "الفاتحة", verses: 7, juz: 1 },
  { number: 2, name: "Al-Baqarah", arabicName: "البقرة", verses: 286, juz: 1 },
  { number: 3, name: "Ali 'Imran", arabicName: "آل عمران", verses: 200, juz: 3 },
  { number: 4, name: "An-Nisa", arabicName: "النساء", verses: 176, juz: 4 },
  { number: 5, name: "Al-Ma'idah", arabicName: "المائدة", verses: 120, juz: 6 },
  { number: 6, name: "Al-An'am", arabicName: "الأنعام", verses: 165, juz: 7 },
  { number: 7, name: "Al-A'raf", arabicName: "الأعراف", verses: 206, juz: 8 },
  { number: 8, name: "Al-Anfal", arabicName: "الأنفال", verses: 75, juz: 9 },
  { number: 9, name: "At-Tawbah", arabicName: "التوبة", verses: 129, juz: 10 },
  { number: 10, name: "Yunus", arabicName: "يونس", verses: 109, juz: 11 },
  { number: 11, name: "Hud", arabicName: "هود", verses: 123, juz: 11 },
  { number: 12, name: "Yusuf", arabicName: "يوسف", verses: 111, juz: 12 },
  { number: 13, name: "Ar-Ra'd", arabicName: "الرعد", verses: 43, juz: 13 },
  { number: 14, name: "Ibrahim", arabicName: "إبراهيم", verses: 52, juz: 13 },
  { number: 15, name: "Al-Hijr", arabicName: "الحجر", verses: 99, juz: 14 },
  { number: 16, name: "An-Nahl", arabicName: "النحل", verses: 128, juz: 14 },
  { number: 17, name: "Al-Isra", arabicName: "الإسراء", verses: 111, juz: 15 },
  { number: 18, name: "Al-Kahf", arabicName: "الكهف", verses: 110, juz: 15 },
  { number: 19, name: "Maryam", arabicName: "مريم", verses: 98, juz: 16 },
  { number: 20, name: "Taha", arabicName: "طه", verses: 135, juz: 16 },
  { number: 21, name: "Al-Anbya", arabicName: "الأنبياء", verses: 112, juz: 17 },
  { number: 22, name: "Al-Hajj", arabicName: "الحج", verses: 78, juz: 17 },
  { number: 23, name: "Al-Mu'minun", arabicName: "المؤمنون", verses: 118, juz: 18 },
  { number: 24, name: "An-Nur", arabicName: "النور", verses: 64, juz: 18 },
  { number: 25, name: "Al-Furqan", arabicName: "الفرقان", verses: 77, juz: 18 },
  { number: 26, name: "Ash-Shu'ara", arabicName: "الشعراء", verses: 227, juz: 19 },
  { number: 27, name: "An-Naml", arabicName: "النمل", verses: 93, juz: 19 },
  { number: 28, name: "Al-Qasas", arabicName: "القصص", verses: 88, juz: 20 },
  { number: 29, name: "Al-'Ankabut", arabicName: "العنكبوت", verses: 69, juz: 20 },
  { number: 30, name: "Ar-Rum", arabicName: "الروم", verses: 60, juz: 21 },
  { number: 31, name: "Luqman", arabicName: "لقمان", verses: 34, juz: 21 },
  { number: 32, name: "As-Sajdah", arabicName: "السجدة", verses: 30, juz: 21 },
  { number: 33, name: "Al-Ahzab", arabicName: "الأحزاب", verses: 73, juz: 21 },
  { number: 34, name: "Saba", arabicName: "سبأ", verses: 54, juz: 22 },
  { number: 35, name: "Fatir", arabicName: "فاطر", verses: 45, juz: 22 },
  { number: 36, name: "Ya-Sin", arabicName: "يس", verses: 83, juz: 22 },
  { number: 37, name: "As-Saffat", arabicName: "الصافات", verses: 182, juz: 23 },
  { number: 38, name: "Sad", arabicName: "ص", verses: 88, juz: 23 },
  { number: 39, name: "Az-Zumar", arabicName: "الزمر", verses: 75, juz: 23 },
  { number: 40, name: "Ghafir", arabicName: "غافر", verses: 85, juz: 24 },
  { number: 41, name: "Fussilat", arabicName: "فصلت", verses: 54, juz: 24 },
  { number: 42, name: "Ash-Shuraa", arabicName: "الشورى", verses: 53, juz: 25 },
  { number: 43, name: "Az-Zukhruf", arabicName: "الزخرف", verses: 89, juz: 25 },
  { number: 44, name: "Ad-Dukhan", arabicName: "الدخان", verses: 59, juz: 25 },
  { number: 45, name: "Al-Jathiyah", arabicName: "الجاثية", verses: 37, juz: 25 },
  { number: 46, name: "Al-Ahqaf", arabicName: "الأحقاف", verses: 35, juz: 26 },
  { number: 47, name: "Muhammad", arabicName: "محمد", verses: 38, juz: 26 },
  { number: 48, name: "Al-Fath", arabicName: "الفتح", verses: 29, juz: 26 },
  { number: 49, name: "Al-Hujurat", arabicName: "الحجرات", verses: 18, juz: 26 },
  { number: 50, name: "Qaf", arabicName: "ق", verses: 45, juz: 26 },
  { number: 51, name: "Adh-Dhariyat", arabicName: "الذاريات", verses: 60, juz: 26 },
  { number: 52, name: "At-Tur", arabicName: "الطور", verses: 49, juz: 27 },
  { number: 53, name: "An-Najm", arabicName: "النجم", verses: 62, juz: 27 },
  { number: 54, name: "Al-Qamar", arabicName: "القمر", verses: 55, juz: 27 },
  { number: 55, name: "Ar-Rahman", arabicName: "الرحمن", verses: 78, juz: 27 },
  { number: 56, name: "Al-Waqi'ah", arabicName: "الواقعة", verses: 96, juz: 27 },
  { number: 57, name: "Al-Hadid", arabicName: "الحديد", verses: 29, juz: 27 },
  { number: 58, name: "Al-Mujadila", arabicName: "المجادلة", verses: 22, juz: 28 },
  { number: 59, name: "Al-Hashr", arabicName: "الحشر", verses: 24, juz: 28 },
  { number: 60, name: "Al-Mumtahanah", arabicName: "الممتحنة", verses: 13, juz: 28 },
  { number: 61, name: "As-Saff", arabicName: "الصف", verses: 14, juz: 28 },
  { number: 62, name: "Al-Jumu'ah", arabicName: "الجمعة", verses: 11, juz: 28 },
  { number: 63, name: "Al-Munafiqun", arabicName: "المنافقون", verses: 11, juz: 28 },
  { number: 64, name: "At-Taghabun", arabicName: "التغابن", verses: 18, juz: 28 },
  { number: 65, name: "At-Talaq", arabicName: "الطلاق", verses: 12, juz: 28 },
  { number: 66, name: "At-Tahrim", arabicName: "التحريم", verses: 12, juz: 28 },
  { number: 67, name: "Al-Mulk", arabicName: "الملك", verses: 30, juz: 29 },
  { number: 68, name: "Al-Qalam", arabicName: "القلم", verses: 52, juz: 29 },
  { number: 69, name: "Al-Haqqah", arabicName: "الحاقة", verses: 52, juz: 29 },
  { number: 70, name: "Al-Ma'arij", arabicName: "المعارج", verses: 44, juz: 29 },
  { number: 71, name: "Nuh", arabicName: "نوح", verses: 28, juz: 29 },
  { number: 72, name: "Al-Jinn", arabicName: "الجن", verses: 28, juz: 29 },
  { number: 73, name: "Al-Muzzammil", arabicName: "المزمل", verses: 20, juz: 29 },
  { number: 74, name: "Al-Muddaththir", arabicName: "المدثر", verses: 56, juz: 29 },
  { number: 75, name: "Al-Qiyamah", arabicName: "القيامة", verses: 40, juz: 29 },
  { number: 76, name: "Al-Insan", arabicName: "الإنسان", verses: 31, juz: 29 },
  { number: 77, name: "Al-Mursalat", arabicName: "المرسلات", verses: 50, juz: 29 },
  { number: 78, name: "An-Naba", arabicName: "النبأ", verses: 40, juz: 30 },
  { number: 79, name: "An-Nazi'at", arabicName: "النازعات", verses: 46, juz: 30 },
  { number: 80, name: "Abasa", arabicName: "عبس", verses: 42, juz: 30 },
  { number: 81, name: "At-Takwir", arabicName: "التكوير", verses: 29, juz: 30 },
  { number: 82, name: "Al-Infitar", arabicName: "الانفطار", verses: 19, juz: 30 },
  { number: 83, name: "Al-Mutaffifin", arabicName: "المطففين", verses: 36, juz: 30 },
  { number: 84, name: "Al-Inshiqaq", arabicName: "الانشقاق", verses: 25, juz: 30 },
  { number: 85, name: "Al-Buruj", arabicName: "البروج", verses: 22, juz: 30 },
  { number: 86, name: "At-Tariq", arabicName: "الطارق", verses: 17, juz: 30 },
  { number: 87, name: "Al-A'la", arabicName: "الأعلى", verses: 19, juz: 30 },
  { number: 88, name: "Al-Ghashiyah", arabicName: "الغاشية", verses: 26, juz: 30 },
  { number: 89, name: "Al-Fajr", arabicName: "الفجر", verses: 30, juz: 30 },
  { number: 90, name: "Al-Balad", arabicName: "البلد", verses: 20, juz: 30 },
  { number: 91, name: "Ash-Shams", arabicName: "الشمس", verses: 15, juz: 30 },
  { number: 92, name: "Al-Layl", arabicName: "الليل", verses: 21, juz: 30 },
  { number: 93, name: "Ad-Duha", arabicName: "الضحى", verses: 11, juz: 30 },
  { number: 94, name: "Ash-Sharh", arabicName: "الشرح", verses: 8, juz: 30 },
  { number: 95, name: "At-Tin", arabicName: "التين", verses: 8, juz: 30 },
  { number: 96, name: "Al-'Alaq", arabicName: "العلق", verses: 19, juz: 30 },
  { number: 97, name: "Al-Qadr", arabicName: "القدر", verses: 5, juz: 30 },
  { number: 98, name: "Al-Bayyinah", arabicName: "البينة", verses: 8, juz: 30 },
  { number: 99, name: "Az-Zalzalah", arabicName: "الزلزلة", verses: 8, juz: 30 },
  { number: 100, name: "Al-'Adiyat", arabicName: "العاديات", verses: 11, juz: 30 },
  { number: 101, name: "Al-Qari'ah", arabicName: "القارعة", verses: 11, juz: 30 },
  { number: 102, name: "At-Takathur", arabicName: "التكاثر", verses: 8, juz: 30 },
  { number: 103, name: "Al-'Asr", arabicName: "العصر", verses: 3, juz: 30 },
  { number: 104, name: "Al-Humazah", arabicName: "الهمزة", verses: 9, juz: 30 },
  { number: 105, name: "Al-Fil", arabicName: "الفيل", verses: 5, juz: 30 },
  { number: 106, name: "Quraysh", arabicName: "قريش", verses: 4, juz: 30 },
  { number: 107, name: "Al-Ma'un", arabicName: "الماعون", verses: 7, juz: 30 },
  { number: 108, name: "Al-Kawthar", arabicName: "الكوثر", verses: 3, juz: 30 },
  { number: 109, name: "Al-Kafirun", arabicName: "الكافرون", verses: 6, juz: 30 },
  { number: 110, name: "An-Nasr", arabicName: "النصر", verses: 3, juz: 30 },
  { number: 111, name: "Al-Masad", arabicName: "المسد", verses: 5, juz: 30 },
  { number: 112, name: "Al-Ikhlas", arabicName: "الإخلاص", verses: 4, juz: 30 },
  { number: 113, name: "Al-Falaq", arabicName: "الفلق", verses: 5, juz: 30 },
  { number: 114, name: "An-Nas", arabicName: "الناس", verses: 6, juz: 30 }
];

interface QuranProgressChartProps {
  userProgress?: { [chapterNumber: number]: number }; // percentage completed for each chapter
  onChapterSelect?: (chapterNumber: number) => void;
}

export function QuranProgressChart({ userProgress = {}, onChapterSelect }: QuranProgressChartProps) {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [zoomedSection, setZoomedSection] = useState<number | null>(null);

  const handleChapterClick = (chapterNumber: number) => {
    setSelectedChapter(chapterNumber);
  };

  const handleZoomSection = (juz: number) => {
    setZoomedSection(juz);
  };

  const resetView = () => {
    setZoomedSection(null);
    setSelectedChapter(null);
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-200';
    if (progress < 25) return 'bg-red-400';
    if (progress < 50) return 'bg-orange-400';
    if (progress < 75) return 'bg-yellow-400';
    if (progress < 100) return 'bg-blue-400';
    return 'bg-green-500';
  };

  const getProgressSize = (chapterNumber: number) => {
    const chapter = QURAN_CHAPTERS.find(c => c.number === chapterNumber);
    if (!chapter) return 'w-2 h-2';
    
    // Size based on chapter length
    if (chapter.verses > 200) return 'w-4 h-4';
    if (chapter.verses > 100) return 'w-3 h-3';
    if (chapter.verses > 50) return 'w-2.5 h-2.5';
    return 'w-2 h-2';
  };

  const renderCircularChart = () => {
    const centerX = 200;
    const centerY = 200;
    const radius = 150;
    
    const visibleChapters = zoomedSection 
      ? QURAN_CHAPTERS.filter(c => c.juz === zoomedSection)
      : QURAN_CHAPTERS;

    return (
      <div className="relative w-96 h-96 mx-auto">
        <svg width="400" height="400" className="absolute inset-0">
          {/* Juz circles for context */}
          {!zoomedSection && Array.from({length: 30}, (_, i) => i + 1).map(juz => {
            const angle = (juz - 1) * (360 / 30);
            const x = centerX + (radius - 20) * Math.cos((angle - 90) * Math.PI / 180);
            const y = centerY + (radius - 20) * Math.sin((angle - 90) * Math.PI / 180);
            
            return (
              <circle
                key={juz}
                cx={x}
                cy={y}
                r="8"
                fill="rgba(59, 130, 246, 0.1)"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="1"
                className="cursor-pointer hover:fill-blue-200"
                onClick={() => handleZoomSection(juz)}
              />
            );
          })}
          
          {/* Chapter dots */}
          {visibleChapters.map((chapter, index) => {
            const progress = userProgress[chapter.number] || 0;
            const totalChapters = visibleChapters.length;
            const angle = (index / totalChapters) * 360;
            const chapterRadius = zoomedSection ? radius - 40 : radius - 60;
            const x = centerX + chapterRadius * Math.cos((angle - 90) * Math.PI / 180);
            const y = centerY + chapterRadius * Math.sin((angle - 90) * Math.PI / 180);
            
            return (
              <g key={chapter.number}>
                <circle
                  cx={x}
                  cy={y}
                  r={zoomedSection ? "6" : "4"}
                  fill={progress > 0 ? 'rgb(34, 197, 94)' : 'rgb(156, 163, 175)'}
                  stroke={selectedChapter === chapter.number ? 'rgb(59, 130, 246)' : 'white'}
                  strokeWidth={selectedChapter === chapter.number ? "3" : "1"}
                  className="cursor-pointer hover:stroke-blue-400 transition-all"
                  onClick={() => handleChapterClick(chapter.number)}
                />
                {progress > 0 && progress < 100 && (
                  <circle
                    cx={x}
                    cy={y}
                    r={zoomedSection ? "3" : "2"}
                    fill="white"
                  />
                )}
                {(zoomedSection || selectedChapter === chapter.number) && (
                  <text
                    x={x}
                    y={y - (zoomedSection ? 12 : 8)}
                    textAnchor="middle"
                    fontSize={zoomedSection ? "10" : "8"}
                    fill="rgb(75, 85, 99)"
                    className="font-medium pointer-events-none"
                  >
                    {chapter.number}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Center text */}
          <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            fontSize="16"
            fill="rgb(75, 85, 99)"
            className="font-bold"
          >
            {zoomedSection ? `Juz ${zoomedSection}` : 'Quran Progress'}
          </text>
          <text
            x={centerX}
            y={centerY + 10}
            textAnchor="middle"
            fontSize="12"
            fill="rgb(107, 114, 128)"
          >
            {Object.keys(userProgress).length} / 114 chapters
          </text>
        </svg>
      </div>
    );
  };

  const selectedChapterData = selectedChapter 
    ? QURAN_CHAPTERS.find(c => c.number === selectedChapter)
    : null;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Quran Learning Progress
          </CardTitle>
          {(zoomedSection || selectedChapter) && (
            <Button variant="outline" size="sm" onClick={resetView}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset View
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Legend */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              <span>Not Started</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-100 border-2 border-blue-500"></div>
              <span>Selected</span>
            </div>
          </div>

          {/* Circular Chart */}
          {renderCircularChart()}

          {/* Selected Chapter Details */}
          {selectedChapterData && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">
                    {selectedChapterData.number}. {selectedChapterData.name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-1">{selectedChapterData.arabicName}</p>
                  <p className="text-sm text-gray-500">
                    {selectedChapterData.verses} verses • Juz {selectedChapterData.juz}
                  </p>
                </div>
                <Badge variant="secondary">
                  {userProgress[selectedChapterData.number] || 0}% Complete
                </Badge>
              </div>
              
              {onChapterSelect && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => onChapterSelect(selectedChapterData.number)}
                    className="flex-1"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learn from this Chapter
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleZoomSection(selectedChapterData.juz)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Juz {selectedChapterData.juz}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Juz Overview when zoomed */}
          {zoomedSection && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-2">Juz {zoomedSection} Chapters</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {QURAN_CHAPTERS.filter(c => c.juz === zoomedSection).map(chapter => (
                  <div 
                    key={chapter.number}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      selectedChapter === chapter.number 
                        ? 'bg-blue-100 border border-blue-300' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleChapterClick(chapter.number)}
                  >
                    <div className="font-medium">{chapter.number}. {chapter.name}</div>
                    <div className="text-xs text-gray-500">{chapter.verses} verses</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}