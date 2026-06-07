import { useState, ChangeEvent } from 'react';
import { ChevronRight, ChevronDown, Sun, Moon } from 'lucide-react';
import { WORKS } from './data';

export default function App() {
  const [selectedWorkId, setSelectedWorkId] = useState<string>(WORKS[0].id);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedGlobalSituation, setSelectedGlobalSituation] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // 현재 선택된 작품 가져오기
  const work = WORKS.find((w) => w.id === selectedWorkId) || WORKS[0];

  // 드롭다운 변경 핸들러
  const handleWorkChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedWorkId(e.target.value);
    setSelectedCharacter(null); // 작품이 바뀌면 선택된 캐릭터 초기화
    setSelectedGlobalSituation(null); // 작품이 바뀌면 글로벌 상황도 초기화
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-neutral-950 text-neutral-200' : 'bg-[#fdfdfd] text-[#1a1a1a]'}`}>
      {/* 상단 네비게이션 헤더 */}
      <header className={`h-16 flex items-center justify-between px-8 border-b sticky top-0 z-10 transition-colors duration-300 ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-tight">메이플 이미지 미리보기</h1>
          <div className={`h-6 w-px transition-colors duration-300 ${isDarkMode ? 'bg-neutral-700' : 'bg-gray-200'}`}></div>
          <div className="relative">
            <select
              value={selectedWorkId}
              onChange={handleWorkChange}
              className={`appearance-none border rounded-md px-4 py-1.5 pr-10 text-sm focus:outline-none focus:ring-1 cursor-pointer md:w-64 transition-colors duration-300 ${isDarkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-200 focus:ring-neutral-500' : 'bg-gray-50 border-gray-200 focus:ring-black'}`}
            >
              {WORKS.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-neutral-400' : 'text-gray-400'}`} />
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-colors duration-300 ${isDarkMode ? 'hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100' : 'hover:bg-gray-100 text-gray-500 hover:text-black'}`}
            title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-8 flex flex-col">
        {!selectedCharacter ? (
          // 1. 선택된 작품의 전체 캐릭터 목록 뷰
          <section className="flex-1 flex flex-col animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <nav className="flex items-center gap-2 text-sm">
                <span className="font-semibold">{work.name}</span>
              </nav>
              <div className="flex items-center gap-4">
                <span className={`text-xs hidden sm:block ${isDarkMode ? 'text-neutral-400' : 'text-gray-400'}`}>상황을 선택해 띄울 수 있습니다.</span>
                <div className="relative">
                  <select
                    value={selectedGlobalSituation || work.defaultSituation}
                    onChange={(e) => setSelectedGlobalSituation(e.target.value)}
                    className={`appearance-none border rounded-md px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-1 cursor-pointer transition-colors duration-300 ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-200 focus:ring-neutral-500' : 'bg-white border-gray-200 focus:ring-black'
                    }`}
                  >
                    {work.situations.map((sit) => (
                      <option key={sit.code} value={sit.code}>
                        {sit.name} ({sit.code})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-neutral-400' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* 1줄에 3장씩 띄우는 그리드 레이아웃 (모바일은 1줄 2장, PC는 3~4장) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {work.characters.map((char) => (
                <div
                  key={char.code}
                  className="group cursor-pointer"
                  onClick={() => setSelectedCharacter(char.code)}
                >
                  {/* 이미지 영역 */}
                  <div className={`rounded border overflow-hidden transition-colors ${isDarkMode ? 'bg-neutral-900 border-neutral-800 group-hover:border-neutral-600' : 'bg-[#f0f0f0] border-gray-100 group-hover:border-gray-200'}`}>
                    <img
                      src={`${work.baseUrl}${char.code}_${selectedGlobalSituation || work.defaultSituation}.webp?v=0`}
                      alt={char.name}
                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105 block"
                      loading="lazy"
                      onError={(e) => {
                        // 이미지가 없을 경우 Fallback 엑박 처리
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs font-medium">{char.name} ({char.code})</p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          // 2. 단일 캐릭터 선택 시, 전체 상황 나열 뷰
          <section className="flex-1 flex flex-col animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
              <nav className="flex items-center gap-2 text-sm">
                <span
                  onClick={() => setSelectedCharacter(null)}
                  className={`cursor-pointer transition-colors ${isDarkMode ? 'text-neutral-400 hover:text-neutral-100' : 'text-gray-400 hover:text-black'}`}
                >
                  Characters
                </span>
                <ChevronRight className={`w-3 h-3 ${isDarkMode ? 'text-neutral-600' : 'text-gray-300'}`} />
                <span className="font-semibold">
                  {work.characters.find((c) => c.code === selectedCharacter)?.name} ({selectedCharacter})
                </span>
              </nav>
              <span className={`text-xs hidden sm:block ${isDarkMode ? 'text-neutral-400' : 'text-gray-400'}`}>Showing variations for character '{selectedCharacter}'</span>
            </div>

            {/* 1줄에 3장씩 띄우는 그리드 레이아웃 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {work.situations.map((sit) => (
                <div key={sit.code} className="group cursor-pointer">
                  <div className={`rounded border overflow-hidden transition-colors ${isDarkMode ? 'bg-neutral-900 border-neutral-800 group-hover:border-neutral-600' : 'bg-[#f0f0f0] border-gray-100 group-hover:border-gray-200'}`}>
                    <img
                      src={`${work.baseUrl}${selectedCharacter}_${sit.code}.webp?v=0`}
                      alt={sit.name}
                      className="w-full h-auto object-contain transition-opacity duration-300 group-hover:opacity-90 block"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs font-medium">{sit.name}</p>
                  <p className={`text-[10px] font-mono mt-0.5 ${isDarkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                    {selectedCharacter}_{sit.code}.webp
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
