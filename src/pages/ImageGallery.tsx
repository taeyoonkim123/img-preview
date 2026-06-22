import { useState, ChangeEvent, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Sun, Moon, X, Maximize2 } from 'lucide-react';
import { WORKS } from '../data';

export default function ImageGallery() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const workQueryParam = searchParams.get('work');

  const [selectedWorkId, setSelectedWorkId] = useState<string>(() => {
    return workQueryParam || localStorage.getItem('selectedWork') || WORKS[0].id;
  });
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedGlobalSituation, setSelectedGlobalSituation] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('isDarkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('selectedWork', selectedWorkId);
  }, [selectedWorkId]);

  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode.toString());
  }, [isDarkMode]);
  
  // 이미지 로드 실패한 URL들을 기록하는 상태
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  
  // 원본 이미지 미리보기 모달 상태
  const [modalImage, setModalImage] = useState<{ src: string; title: string } | null>(null);

  // 현재 선택된 작품 가져오기
  const work = WORKS.find((w) => w.id === selectedWorkId) || WORKS[0];

  // 드롭다운 변경 핸들러
  const handleWorkChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedWorkId(e.target.value);
    setSelectedCharacter(null); // 작품이 바뀌면 선택된 캐릭터 초기화
    setSelectedGlobalSituation(null); // 작품이 바뀌면 글로벌 상황도 초기화
    setFailedUrls({}); // 작품이 바뀌면 실패 기록도 초기화
  };

  // 글로벌 상황 변경 시 실패 기록 리셋 (새로운 상황의 경우 이미지가 존재할 수 있으므로 다시 시도하도록 함)
  const handleGlobalSituationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedGlobalSituation(e.target.value);
    setFailedUrls({});
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-neutral-950 text-neutral-200' : 'bg-[#fdfdfd] text-[#1a1a1a]'}`}>
      {/* 상단 네비게이션 헤더 - 모바일에서도 깨지지 않도록 반응형 구조 마련 */}
      <header className={`min-h-16 py-3 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 border-b sticky top-0 z-10 transition-colors duration-300 gap-3 ${isDarkMode ? 'bg-neutral-900 border-neutral-800 shadow-xl/10' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 w-full md:w-auto">
          <div 
            onClick={() => navigate('/')}
            className="cursor-pointer"
          >
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight whitespace-nowrap text-center">
              메이플 이미지 미리보기
            </h1>
          </div>
          <div className={`h-4 w-px hidden sm:block transition-colors duration-300 ${isDarkMode ? 'bg-neutral-700' : 'bg-gray-200'}`}></div>
          <div className="relative w-full sm:w-auto min-w-[200px]">
            <select
              value={selectedWorkId}
              onChange={handleWorkChange}
              className={`appearance-none border rounded-md px-3 py-1.5 pr-10 text-xs sm:text-sm focus:outline-none focus:ring-1 cursor-pointer w-full md:w-64 transition-colors duration-300 ${isDarkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-200 focus:ring-neutral-500' : 'bg-gray-50 border-gray-200 focus:ring-black'}`}
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

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-8 flex flex-col">
        {!selectedCharacter ? (
          // 1. 선택된 작품의 전체 캐릭터 목록 뷰
          <section className="flex-1 flex flex-col animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <nav className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-base sm:text-lg">{work.name}</span>
              </nav>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <span className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-gray-400'} hidden md:block`}>상황을 선택해 띄울 수 있습니다.</span>
                <div className="relative w-full sm:w-auto min-w-[164px]">
                  <select
                    value={selectedGlobalSituation || work.defaultSituation}
                    onChange={handleGlobalSituationChange}
                    className={`appearance-none border rounded-md px-3 py-1.5 pr-8 text-xs sm:text-sm focus:outline-none focus:ring-1 cursor-pointer w-full transition-colors duration-300 ${
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
            
            {/* 1줄에 3장씩 띄우는 그리드 레이아웃 (모바일은 1줄 2장, 태블릿 3장, PC 4장) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {work.characters
                .map((char) => {
                  const imgUrl = `${work.baseUrl}${char.code}/${selectedGlobalSituation || work.defaultSituation}.jpg?v=1`;
                  const isFailed = failedUrls[imgUrl];
                  
                  if (isFailed) return null;

                  return (
                    <div
                      key={char.code}
                      className="group cursor-pointer flex flex-col"
                      onClick={() => setSelectedCharacter(char.code)}
                    >
                      {/* 이미지 영역 */}
                      <div className={`relative rounded-xl border overflow-hidden transition-all duration-300 shadow-sm ${isDarkMode ? 'bg-neutral-900 border-neutral-800 group-hover:border-neutral-600 group-hover:shadow-md' : 'bg-[#f4f4f4] border-gray-100 group-hover:border-gray-200 group-hover:shadow-md'}`}>
                        <img
                          src={imgUrl}
                          alt={char.name}
                          className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105 block mx-auto"
                          loading="lazy"
                          onError={() => {
                            // 로드 실패 시 상태 딕셔너리에 추가하여 목록에서 자동으로 제외되게 함
                            setFailedUrls(prev => ({ ...prev, [imgUrl]: true }));
                          }}
                        />
                        {/* 돋보기 오버레이 효과 */}
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      </div>
                      <p className="mt-3 text-sm sm:text-base font-bold tracking-tight truncate px-1">{char.name}</p>
                      <p className="text-[10px] sm:text-xs text-neutral-400 font-mono px-1">{char.code}</p>
                    </div>
                  );
                })
                .filter(Boolean) // null 값 필터링
              }
            </div>

            {/* 모든 캐릭터 이미지가 가려져서 아무것도 없을 때 예외 안내 처리 */}
            {work.characters.length > 0 && work.characters.every(char => failedUrls[`${work.baseUrl}${char.code}/${selectedGlobalSituation || work.defaultSituation}.jpg?v=1`]) && (
              <div className="text-center py-24">
                <p className={`text-sm ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  선택하신 상황({work.situations.find(s => s.code === (selectedGlobalSituation || work.defaultSituation))?.name || (selectedGlobalSituation || work.defaultSituation)})에 등록된 이미지가 존재하지 않거나 무비 상태입니다.
                </p>
                <button
                  onClick={() => {
                    setSelectedGlobalSituation(work.defaultSituation);
                    setFailedUrls({});
                  }}
                  className="mt-4 px-4 py-2 bg-black text-white hover:bg-neutral-800 text-xs font-bold rounded tracking-wider uppercase transition-colors"
                >
                  기본 상황으로 리셋
                </button>
              </div>
            )}
          </section>
        ) : (
          // 2. 단일 캐릭터 선택 시, 전체 상황 나열 뷰
          <section className="flex-1 flex flex-col animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <nav className="flex items-center gap-2 text-xs sm:text-sm">
                <span
                  onClick={() => {
                    setSelectedCharacter(null);
                    setFailedUrls({}); // 상황 뷰에서 나갈 때도 혹시 모르니 리셋
                  }}
                  className={`cursor-pointer transition-colors ${isDarkMode ? 'text-neutral-400 hover:text-neutral-100' : 'text-gray-400 hover:text-black'}`}
                >
                  캐릭터 전체 목록 (Characters)
                </span>
                <ChevronRight className={`w-3 h-3 ${isDarkMode ? 'text-neutral-600' : 'text-gray-300'}`} />
                <span className="font-semibold text-sm sm:text-base">
                  {work.characters.find((c) => c.code === selectedCharacter)?.name} ({selectedCharacter})
                </span>
              </nav>
              <span className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-gray-400'}`}>
                '{work.characters.find((c) => c.code === selectedCharacter)?.name}'의 상황별 전체 목록입니다.
              </span>
            </div>

            {/* 1줄에 3~4장씩 띄우는 그리드 레이아웃 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {work.situations
                .map((sit) => {
                  const imgUrl = `${work.baseUrl}${selectedCharacter}/${sit.code}.jpg?v=1`;
                  const isFailed = failedUrls[imgUrl];

                  if (isFailed) return null;

                  return (
                    <div
                      key={sit.code}
                      className="group cursor-pointer flex flex-col"
                      onClick={() => setModalImage({ src: imgUrl, title: `${work.characters.find((c) => c.code === selectedCharacter)?.name} - ${sit.name}` })}
                    >
                      <div className={`relative rounded-xl border overflow-hidden transition-all duration-300 shadow-sm ${isDarkMode ? 'bg-neutral-900 border-neutral-800 group-hover:border-neutral-600 group-hover:shadow-md' : 'bg-[#f4f4f4] border-gray-100 group-hover:border-gray-200 group-hover:shadow-md'}`}>
                        <img
                          src={imgUrl}
                          alt={sit.name}
                          className="w-full h-auto object-contain transition-opacity duration-300 group-hover:opacity-95 block mx-auto"
                          loading="lazy"
                          onError={() => {
                            setFailedUrls(prev => ({ ...prev, [imgUrl]: true }));
                          }}
                        />
                        {/* 돋보기 오버레이 효과 */}
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      </div>
                      <p className="mt-3 text-sm sm:text-base font-bold tracking-tight px-1">{sit.name}</p>
                      <p className={`text-[10px] sm:text-xs font-mono px-1 truncate ${isDarkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                        {selectedCharacter}/{sit.code}
                      </p>
                    </div>
                  );
                })
                .filter(Boolean)
              }
            </div>

            {/* 해당 캐릭터에 등록된 모든 상황 이미지의 로드가 실패해서 아무것도 나오지 않을 때 */}
            {work.situations.length > 0 && work.situations.every(sit => failedUrls[`${work.baseUrl}${selectedCharacter}/${sit.code}.jpg?v=1`]) && (
              <div className="text-center py-24">
                <p className={`text-sm ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  이 캐릭터에 등록된 이미지가 전혀 없습니다.
                </p>
                <button
                  onClick={() => setSelectedCharacter(null)}
                  className="mt-4 px-4 py-2 bg-black text-white hover:bg-neutral-800 text-xs font-bold rounded tracking-wider uppercase transition-colors"
                >
                  목록으로 가기
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* 이미지 상세 모달 (원본 보기 기능) */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setModalImage(null)}
        >
          <div
            className={`relative max-w-full max-h-full flex flex-col items-center rounded-xl p-4 sm:p-6 transition-all duration-300 shadow-2xl cursor-default ${
              isDarkMode ? 'bg-neutral-900 border border-neutral-800 text-neutral-100' : 'bg-white text-gray-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setModalImage(null)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${
                isDarkMode ? 'bg-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* 타이틀 */}
            <h3 className="text-lg font-bold mb-4 pr-12 w-full text-left tracking-tight border-b pb-2">
              {modalImage.title}
            </h3>

            {/* 이미지 */}
            <div className="flex-1 overflow-auto flex items-center justify-center max-h-[75vh] w-full bg-[#eaeaea] dark:bg-neutral-950 rounded-lg p-2 sm:p-4">
              <img
                src={modalImage.src}
                alt={modalImage.title}
                className="max-w-full max-h-[70vh] object-contain block mx-auto select-none"
              />
            </div>

            {/* 설명 및 유틸리티 버튼 */}
            <div className="mt-4 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <span className={isDarkMode ? 'text-neutral-400 font-mono' : 'text-gray-500 font-mono'}>
                원본 URL: <a href={modalImage.src} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline break-all">{modalImage.src}</a>
              </span>
              <button
                onClick={() => window.open(modalImage.src, '_blank')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition-colors cursor-pointer self-start sm:self-auto"
              >
                새 창으로 열기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
