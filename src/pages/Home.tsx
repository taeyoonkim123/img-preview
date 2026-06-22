import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Maximize2 } from 'lucide-react';
import { WORKS } from '../data';

export default function Home() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('isDarkMode') === 'true';
  });
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const handleWorkClick = (workId: string) => {
    localStorage.setItem('selectedWork', workId);
    navigate(`/smt?work=${workId}`);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-neutral-950 text-neutral-200' : 'bg-[#fdfdfd] text-[#1a1a1a]'}`}>
      <header className={`min-h-16 py-3 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 border-b sticky top-0 z-10 transition-colors duration-300 gap-3 ${isDarkMode ? 'bg-neutral-900 border-neutral-800 shadow-xl/10' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 w-full md:w-auto">
          <div 
            onClick={() => navigate('/')}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight whitespace-nowrap text-center">
              메이플 이미지 미리보기
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-colors duration-300 ${isDarkMode ? 'hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100' : 'hover:bg-gray-100 text-gray-500 hover:text-black'}`}
            title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-8 flex flex-col animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <nav className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-base sm:text-lg">작품 목록</span>
          </nav>
          <span className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-gray-400'}`}>
            원하는 작품을 선택하시면 해당 작품의 모든 캐릭터 갤러리로 이동합니다.
          </span>
        </div>

        {/* 1줄에 3~4장씩 띄우는 그리드 레이아웃 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {WORKS.map((work) => {
            const coverImageUrl = work.baseUrl ? `${work.baseUrl}AA/A1.jpg` : '';
            const isFailed = coverImageUrl ? failedUrls[coverImageUrl] : true;

            return (
              <div
                key={work.id}
                className="group cursor-pointer flex flex-col"
                onClick={() => handleWorkClick(work.id)}
              >
                <div className={`relative rounded-xl border overflow-hidden transition-all duration-300 shadow-sm ${isDarkMode ? 'bg-neutral-900 border-neutral-800 group-hover:border-neutral-600 group-hover:shadow-md' : 'bg-[#f4f4f4] border-gray-100 group-hover:border-gray-200 group-hover:shadow-md'}`}>
                  {!isFailed ? (
                    <img
                      src={coverImageUrl}
                      alt={`${work.name} 표지`}
                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105 block mx-auto"
                      loading="lazy"
                      onError={() => {
                        if (coverImageUrl) {
                          setFailedUrls(prev => ({ ...prev, [coverImageUrl]: true }));
                        }
                      }}
                    />
                  ) : (
                    <div className={`w-full aspect-[4/3] flex items-center justify-center ${isDarkMode ? 'bg-neutral-800' : 'bg-[#eaeaea]'}`}>
                      <span className={`text-xs ${isDarkMode ? 'text-neutral-500' : 'text-gray-400'}`}>이미지 없음</span>
                    </div>
                  )}
                  {/* 돋보기 오버레이 효과 */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-5 h-5 text-white drop-shadow-md" />
                  </div>
                </div>
                <p className="mt-3 text-sm sm:text-base font-bold tracking-tight truncate px-1">{work.name}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
