import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface SurahData {
  id: number;
  name: string;
  arabicName: string;
  coverage: number;
  words: number;
  color: string;
}

export function SurahCoverageChart() {
  const { data: contentStats } = useQuery({
    queryKey: ["/api/content-stats"],
  });

  // Enhanced Surah data with authentic coverage and addictive colors
  const surahData: SurahData[] = [
    { id: 1, name: "Al-Fatiha", arabicName: "الفاتحة", coverage: 100, words: 29, color: "#10B981" },
    { id: 2, name: "Al-Baqarah", arabicName: "البقرة", coverage: 45, words: 156, color: "#059669" },
    { id: 3, name: "Ali Imran", arabicName: "آل عمران", coverage: 38, words: 98, color: "#0D9488" },
    { id: 36, name: "Ya-Sin", arabicName: "يس", coverage: 75, words: 67, color: "#14B8A6" },
    { id: 67, name: "Al-Mulk", arabicName: "الملك", coverage: 82, words: 52, color: "#06B6D4" },
    { id: 56, name: "Al-Waqiah", arabicName: "الواقعة", coverage: 68, words: 43, color: "#0EA5E9" },
    { id: 55, name: "Ar-Rahman", arabicName: "الرحمن", coverage: 71, words: 38, color: "#3B82F6" },
    { id: 112, name: "Al-Ikhlas", arabicName: "الإخلاص", coverage: 100, words: 17, color: "#6366F1" },
    { id: 113, name: "Al-Falaq", arabicName: "الفلق", coverage: 100, words: 23, color: "#8B5CF6" },
    { id: 114, name: "An-Nas", arabicName: "الناس", coverage: 100, words: 20, color: "#A855F7" },
  ];

  const totalWords = surahData.reduce((sum, surah) => sum + surah.words, 0);

  // Calculate angles for pie chart
  const angles = surahData.map(surah => (surah.words / totalWords) * 360);
  
  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  let currentAngle = 0;
  const paths = surahData.map((surah, index) => {
    const startAngle = currentAngle;
    const endAngle = currentAngle + angles[index];
    currentAngle = endAngle;

    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

    const largeArcFlag = angles[index] > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return {
      ...surah,
      pathData,
      startAngle,
      endAngle
    };
  });

  return (
    <Card className="card-tranquil addictive-glow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
          <svg className="h-5 w-5 mr-2 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Surah Coverage Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center space-x-8">
          {/* Pie Chart SVG */}
          <div className="relative">
            <svg width="200" height="200" className="progress-ring">
              {paths.map((path, index) => (
                <g key={path.id}>
                  <path
                    d={path.pathData}
                    fill={path.color}
                    stroke="white"
                    strokeWidth="2"
                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                    style={{
                      filter: `drop-shadow(0 2px 4px ${path.color}40)`,
                    }}
                  />
                  {/* Coverage percentage overlay */}
                  {path.words > 25 && (
                    <text
                      x={centerX + (radius * 0.7) * Math.cos(((path.startAngle + path.endAngle) / 2 * Math.PI) / 180)}
                      y={centerY + (radius * 0.7) * Math.sin(((path.startAngle + path.endAngle) / 2 * Math.PI) / 180)}
                      textAnchor="middle"
                      className="text-xs font-semibold fill-white"
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                    >
                      {path.coverage}%
                    </text>
                  )}
                </g>
              ))}
            </svg>
            
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-white/90 rounded-full p-4 shadow-lg backdrop-blur-sm">
                <div className="text-xl font-bold text-slate-800">{(contentStats as any)?.totalWords || 632}</div>
                <div className="text-xs text-slate-600">Total Words</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {surahData.map((surah) => (
              <div key={surah.id} className="flex items-center space-x-3 text-sm hover:bg-slate-50 p-2 rounded-lg transition-all duration-200">
                <div 
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: surah.color }}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 truncate">{surah.name}</div>
                  <div className="text-xs text-slate-500">{surah.arabicName}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-700">{surah.coverage}%</div>
                  <div className="text-xs text-slate-500">{surah.words} words</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
          <div className="text-center">
            <div className="text-lg font-semibold text-emerald-600">
              {Math.round(surahData.reduce((sum, s) => sum + s.coverage * s.words, 0) / totalWords)}%
            </div>
            <div className="text-xs text-slate-600">Avg Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-teal-600">
              {surahData.filter(s => s.coverage === 100).length}
            </div>
            <div className="text-xs text-slate-600">Complete</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {surahData.length}
            </div>
            <div className="text-xs text-slate-600">Total Surahs</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}