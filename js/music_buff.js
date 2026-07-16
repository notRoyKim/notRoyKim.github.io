document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('music-buff-app');
    if (!appContainer) return;

    // 캐시 키 설정
    const CACHE_KEY = 'musicBuffCache';

    // 랭크 옵션 자동 생성 (연습~1랭크)
    const renderRankOptions = () => {
        const ranks = ['연습', 'F', 'E', 'D', 'C', 'B', 'A', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
        return ranks.map((r, i) => `<option value="${i}" ${i === 15 ? 'selected' : ''}>${r === '연습' ? '연습' : r + '랭크'}</option>`).join('');
    };

    // 토글 스위치 컴포넌트
    const renderSwitch = (id, label, value = 0, checked = false, className = "calc-check") => `
        <div class="mbc-box flex justify-between items-center py-3">
            <label class="text-sm font-medium text-slate-700 cursor-pointer" for="${id}">${label}</label>
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="${id}" class="sr-only peer ${className}" value="${value}" ${checked ? 'checked' : ''}>
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-800"></div>
            </label>
        </div>
    `;

    // 세공 입력 컴포넌트
    const renderReforge = (isEcho = false) => `
        <div class="grid grid-cols-[1fr_80px] gap-2 ${isEcho ? 'reforge-echo' : 'reforge-equip'}">
            <select class="mbc-input reforge-opt text-slate-600">
                <option value="">세공 옵션</option>
                <option value="p">악기 연주 효과</option>
                <option value="np">보통 연주 효과</option>
                <option value="ep">훌륭한 연주 효과</option>
                <option value="gp">신들린 연주 효과</option>
                <option value="vm">비바체 마법 시전 속도</option>
                <option value="vmg">비바체 마법 공격력</option>
                <option value="vs">비바체 공격 속도</option>
                <option value="vy">비바체 연금술 시전 속도</option>
                <option value="rs">풍년가 채집 속도</option>
                <option value="mm">행진곡 도보 이동 속도</option>
            </select>
            <input type="number" class="mbc-input reforge-lvl" placeholder="레벨" min="0">
        </div>
    `;

    // ==========================================
    // 1. UI 템플릿 렌더링
    // ==========================================
    const uiTemplate = `
        <style>
            .mbc-input { width: 100%; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 10px; font-size: 13px; outline: none; transition: border 0.2s; background: #fff; height: 36px; }
            .mbc-input:focus { border-color: #72a1d8; }
            .mbc-label { font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 6px; display: block; }
            .mbc-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; background: #fff; }
            .mbc-box-title { font-size: 14px; font-weight: 700; color: #333; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
            .mbc-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.02); padding: 24px; margin-bottom: 20px; }
            .mbc-card-title { font-size: 16px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;}
            .mbc-btn { border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; color: #333; font-size: 13px; padding: 8px 16px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 6px; flex: 1; }
            .mbc-btn:hover { background: #f8fafc; color: #ef4444; border-color: #fca5a5; }
            .mbc-table th { padding: 10px 8px; font-size: 12px; color: #333; border-bottom: 1px solid #e2e8f0; font-weight: 700;}
            .mbc-table td { padding: 10px 8px; font-size: 12px; color: #64748b; border-bottom: 1px solid #f1f5f9; }
            .mbc-checkbox { width: 16px; height: 16px; cursor: pointer; accent-color: #1b1f77; }
        </style>

        <div class="flex flex-col xl:flex-row gap-6 mt-4 font-sans text-slate-900">
            <div class="flex-1 min-w-0">
                <form id="mbc-form">
                    <div class="mbc-card">
                        <h2 class="mbc-card-title">기본 설정</h2>
                        <div class="space-y-6">
                            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div><label class="mbc-label">악기 연주</label><select class="mbc-input">${renderRankOptions()}</select></div>
                                <div><label class="mbc-label">노래</label><select class="mbc-input">${renderRankOptions()}</select></div>
                                <div><label class="mbc-label">음악적 지식</label><select class="mbc-input">${renderRankOptions()}</select></div>
                                <div><label class="mbc-label">전장의 서곡</label><select class="mbc-input">${renderRankOptions()}</select></div>
                                <div><label class="mbc-label">비바체</label><select class="mbc-input">${renderRankOptions()}</select></div>
                                <div><label class="mbc-label">인내의 노래</label><select class="mbc-input">${renderRankOptions()}</select></div>
                                <div><label class="mbc-label">행진곡</label><select class="mbc-input">${renderRankOptions()}</select></div>
                                <div><label class="mbc-label">풍년가</label><select class="mbc-input">${renderRankOptions()}</select></div>
                            </div>
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                ${renderSwitch('opt-gm1', '그랜드마스터 음유시인 달성', 0, true)}
                                ${renderSwitch('opt-gm2', '그랜드마스터 음유시인 활성화', 5, true, 'calc-base')}
                                ${renderSwitch('opt-saint1', '세인트바드 아르카나 활성화', 3, true, 'calc-base')}
                                <div class="mbc-box py-3 flex flex-col justify-center">
                                    <label class="mbc-label">세인트바드 링크</label>
                                    <select class="mbc-input border-none px-0 h-auto font-medium text-sm bg-transparent"><option value="10">10 링크</option><option value="0">미적용</option></select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mbc-card bg-slate-50/50">
                        <h2 class="mbc-card-title">장비 설정</h2>
                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div class="mbc-box space-y-3 shadow-sm border-slate-300">
                                    <h3 class="mbc-box-title">악기</h3>
                                    <div>
                                        <label class="mbc-label">악기 선택</label>
                                        <select class="mbc-input calc-base" id="inst-type">
                                            <option value="0">악기 선택</option>
                                            <option value="10">메모리얼 플라워 류트 (+10)</option>
                                            <option value="11">리라 / 바이올린 (+11)</option>
                                            <option value="14">소울 리버레이트 리라 (+14)</option>
                                            <option value="16" selected>글루미 선데이 (+16)</option>
                                        </select>
                                    </div>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div><label class="mbc-label">개조 수치</label><input type="number" class="mbc-input calc-base" value="0" min="0" placeholder="개조 증가 수치"></div>
                                        <div>
                                            <label class="mbc-label">특별 개조</label>
                                            <select class="mbc-input calc-mult" id="inst-special-up">
                                                <option value="0">특별 개조 단계</option>
                                                <option value="0.5">1단계 (0.5%)</option><option value="1.0">2단계 (1.0%)</option><option value="1.5">3단계 (1.5%)</option>
                                                <option value="2.3">4단계 (2.3%)</option><option value="3.0">5단계 (3.0%)</option><option value="3.8">6단계 (3.8%)</option>
                                                <option value="4.5">7단계 (4.5%)</option><option value="5.5" selected>8단계 (5.5%)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div>
                                            <label class="mbc-label">인챈트(접두)</label>
                                            <select class="mbc-input calc-base"><option value="0">없음</option><option value="1">안단테(+1)</option><option value="2">모데라토(+2)</option><option value="3">알레그로(+3)</option><option value="4">폴리포니(4옵)</option><option value="5">앙상블/폴리포니(5옵)</option><option value="6">폴리포니(6옵)</option><option value="7">폴리포니(7옵)</option></select>
                                        </div>
                                        <div>
                                            <label class="mbc-label">인챈트(접미)</label>
                                            <select class="mbc-input calc-base"><option value="0">없음</option><option value="1">코드(+1)</option><option value="2">템포(2옵)</option><option value="3">템포(3옵)</option></select>
                                        </div>
                                    </div>
                                    <div class="space-y-2 pt-2 border-t border-slate-100">
                                        ${renderReforge()}${renderReforge()}${renderReforge()}
                                    </div>
                                    <div class="pt-2">
                                        <label class="mbc-label">마스터 피어싱 (배율%)</label>
                                        <input type="number" class="mbc-input calc-mult" value="0" step="0.01" placeholder="마스터 피어싱 수치 입력 (예: 3.5)">
                                    </div>
                                </div>
                                <div class="mbc-box space-y-3 shadow-sm border-slate-300">
                                    <h3 class="mbc-box-title">블루 에코스톤</h3>
                                    ${renderReforge(true)}
                                </div>
                                <div class="mbc-box space-y-3 shadow-sm border-slate-300">
                                    <h3 class="mbc-box-title">옷</h3>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div><select class="mbc-input calc-base"><option value="0">인챈트(접두)</option><option value="3">앙코르(+3)</option><option value="4">소나타(4옵)/안락의</option><option value="5">소나타(5옵)</option><option value="6">소나타(6옵)</option></select></div>
                                        <div><select class="mbc-input" disabled><option>인챈트(접미)</option></select></div>
                                    </div>
                                    <div class="space-y-2 pt-2 border-t border-slate-100">${renderReforge()}${renderReforge()}${renderReforge()}</div>
                                </div>
                                <div class="mbc-box space-y-3 shadow-sm border-slate-300">
                                    <h3 class="mbc-box-title">악세서리 2</h3>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div><select class="mbc-input calc-base"><option value="0">인챈트(접두)</option><option value="1">안단테/소복한/활발한(1옵)</option><option value="2">활발한(2옵)</option></select></div>
                                        <div><select class="mbc-input calc-base"><option value="0">인챈트(접미)</option><option value="1">카덴차(+1)</option></select></div>
                                    </div>
                                    <div class="space-y-2 pt-2 border-t border-slate-100">${renderReforge()}${renderReforge()}${renderReforge()}</div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div class="mbc-box space-y-3 shadow-sm border-slate-300">
                                    <h3 class="mbc-box-title">머리</h3>
                                    <div><label class="mbc-label">장비 기본옵션</label><select class="mbc-input calc-base"><option value="0">선택 안함</option><option value="2">플루아 풀잎 관 (2옵)</option><option value="3">플루아 풀잎 관 (3옵)</option><option value="4">플루아 풀잎 관 (4옵)</option></select></div>
                                    <div><label class="mbc-label">인챈트(접미)</label><select class="mbc-input calc-base"><option value="0">없음</option><option value="2">코러스(2옵)</option><option value="3">코러스(3옵)</option></select></div>
                                    <div class="space-y-2 pt-2 border-t border-slate-100">${renderReforge()}</div>
                                </div>
                                <div class="mbc-box space-y-3 shadow-sm border-slate-300">
                                    <h3 class="mbc-box-title">장갑</h3>
                                    <div><select class="mbc-input calc-base"><option value="0">인챈트(접두)</option><option value="2">솔리스트(+2)</option></select></div>
                                    <div class="space-y-2 pt-2 border-t border-slate-100">${renderReforge()}</div>
                                </div>
                                <div class="mbc-box space-y-3 shadow-sm border-slate-300">
                                    <h3 class="mbc-box-title">신발</h3>
                                    <div><select class="mbc-input calc-base"><option value="0">인챈트(접두)</option><option value="2">솔리스트(+2)</option></select></div>
                                    <div class="space-y-2 pt-2 border-t border-slate-100">${renderReforge()}${renderReforge()}</div>
                                </div>
                                <div class="mbc-box space-y-3 shadow-sm border-slate-300">
                                    <h3 class="mbc-box-title">악세서리 1</h3>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div><select class="mbc-input calc-base"><option value="0">인챈트(접두)</option><option value="1">안단테/소복한/활발한(1옵)</option><option value="2">활발한(2옵)</option></select></div>
                                        <div><select class="mbc-input calc-base"><option value="0">인챈트(접미)</option><option value="1">카덴차(+1)</option></select></div>
                                    </div>
                                    <div class="space-y-2 pt-2 border-t border-slate-100">${renderReforge()}${renderReforge()}${renderReforge()}</div>
                                </div>
                                <div class="mbc-box space-y-3 shadow-sm border-slate-300 bg-blue-50/30">
                                    <h3 class="mbc-box-title">타이틀</h3>
                                    <div><label class="mbc-label">1차 타이틀</label>
                                        <select class="mbc-input calc-base">
                                            <option value="0">없음</option><option value="5">마에스트로 (+5)</option>
                                            <option value="8" selected>전장의 서곡/비바체/행진곡 마스터 (+8)</option>
                                            <option value="10">풍년가/인내의 노래 마스터 (+10)</option>
                                        </select>
                                    </div>
                                    <div><label class="mbc-label">2차 타이틀</label>
                                        <select class="mbc-input calc-base">
                                            <option value="0">없음</option>
                                            <option value="2">무지개빛 오로라 / 일라 / 하멜른 / 에피 (+2)</option>
                                            <option value="3">푸른/붉은 오로라 / 카가미네 / 하츠네 / 카이토 (+3)</option>
                                            <option value="4">판타스틱 하모니 / 만렙 (+4)</option>
                                            <option value="5">어둠의 기운 (+5)</option><option value="7">피아니시모 (+7)</option>
                                            <option value="8">포르테 / 스페셜 어둠 / 디바 / 이보나 (+8)</option>
                                            <option value="9">포르티시모 / 로열 펭귄 (+9)</option>
                                            <option value="10">레넨의 미이르: 회한 (+10)</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mbc-box space-y-3 shadow-sm border-slate-300">
                                    <h3 class="mbc-box-title">인형 가방</h3>
                                    <div><select class="mbc-input calc-group-bag"><option value="0">가방 선택 없음</option><option value="1">타라 왕성 무도회 (+1)</option><option value="2">아르카나 불꽃 (+2)</option></select></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mbc-card">
                        <h2 class="mbc-card-title">기타 설정</h2>
                        <div class="space-y-4">
                            <div>
                                <label class="mbc-label mb-2">미니어처</label>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select class="mbc-input calc-group-mini-gen"><option value="0">일반 미니어처 없음</option><option value="1">골든 트로피 등 (+1)</option><option value="2">베인 / 데이르블라 (+2)</option><option value="3">스페셜 나오 잔망루피 (+3)</option></select>
                                    <select class="mbc-input calc-group-mini-ex"><option value="0">엑스트라 미니어처 없음</option><option value="1">여름 방학 세트 (+1)</option><option value="2">시유 등 (+2)</option><option value="3">사이브 엑스트라 (+3)</option><option value="3">스프링 가든 분수 (+3)</option></select>
                                </div>
                            </div>
                            <div>
                                <label class="mbc-label mb-2">펫 (페어리 드래곤)</label>
                                <div class="space-y-2 text-sm text-slate-700 font-medium pl-2">
                                    <label class="flex items-center gap-2"><input type="checkbox" id="pet-red" class="mbc-checkbox calc-group-pet" value="3"> 붉은빛/별빛 (전장의 서곡 효과 +2%p)</label>
                                    <label class="flex items-center gap-2"><input type="checkbox" id="pet-blue" class="mbc-checkbox calc-group-pet" value="3"> 푸른빛 (비바체 효과 +2%p)</label>
                                    <label class="flex items-center gap-2"><input type="checkbox" id="pet-green" class="mbc-checkbox calc-group-pet" value="3"> 초록빛 (풍년가 효과 +2%p)</label>
                                </div>
                            </div>
                            <div>
                                <label class="mbc-label mb-2">소모품 / 농장 설치물</label>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    ${renderSwitch('item-boost', '음악 부스트 포션 (+2)', 2, false, 'calc-base')}
                                    ${renderSwitch('item-cloud', '펫하우스 구름방석 (+1)', 1, false, 'calc-base')}
                                    ${renderSwitch('item-oracle', '카드 오라클(연인)', 0, false)}
                                    ${renderSwitch('item-bracelet', '로즈 커플 팔찌 (+1)', 1, false, 'calc-base')}
                                </div>
                            </div>
                            <div>
                                <label class="mbc-label mb-2">추가 설정</label>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="mbc-box py-3 flex justify-between items-center"><label class="text-sm font-medium">나팔</label><select class="mbc-input border-none px-0 w-auto bg-transparent calc-group-horn text-right"><option value="0">미사용</option><option value="3">일반 코르플레 (+3)</option><option value="5">스위트 로즈 코르플레 (+5)</option></select></div>
                                    <div class="mbc-box py-3 flex justify-between items-center"><label class="text-sm font-medium">무리아스 성수 (합산)</label><select class="mbc-input border-none px-0 w-auto bg-transparent calc-base text-right"><option value="0">+0</option><option value="1">+1</option><option value="2">+2</option><option value="3">+3</option><option value="4">+4</option><option value="5">+5</option><option value="6">+6</option><option value="7">+7</option><option value="8">+8</option></select></div>
                                    <div class="mbc-box py-3 flex justify-between items-center"><label class="text-sm font-medium">유물 접미(선물) / 주화 (곱연산)</label><select class="mbc-input border-none px-0 w-auto bg-transparent calc-mult text-right"><option value="0">0%</option><option value="0.3">0.3%</option><option value="0.6">0.6%</option><option value="0.9">0.9%</option><option value="1.0">1.0%</option><option value="1.5">1.5%</option><option value="1.9">1.9%</option></select></div>
                                    <div class="mbc-box py-3 flex justify-between items-center"><label class="text-sm font-medium">풍년가 파티 인원</label><select id="party-count" class="mbc-input border-none px-0 w-auto bg-transparent text-right"><option value="0">0명</option><option value="1">1명</option><option value="2">2명</option><option value="3">3명</option><option value="4">4명</option></select></div>
                                    <div class="mbc-box py-3 flex justify-between items-center md:col-span-2"><label class="text-sm font-medium">임의 버프 수치 추가</label><input type="number" class="mbc-input border-none w-24 text-right calc-base" value="0" step="0.01"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="w-full xl:w-[400px]">
                <div class="mbc-result-board">
                    <div class="flex gap-2 mb-6">
                        <button type="button" id="mbc-btn-reset" class="mbc-btn w-full">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg> 전체 초기화
                        </button>
                    </div>

                    <div class="mb-4">
                        <h3 class="text-sm font-semibold text-slate-800 mb-2 border-none pb-0">연주 비율</h3>
                        <div class="grid grid-cols-3 gap-2">
                            <div class="border border-slate-200 rounded-md p-2 text-center bg-slate-50"><p class="text-[11px] text-slate-500">보통</p><p class="text-xs font-bold text-slate-700">80.00%</p></div>
                            <div class="border border-slate-200 rounded-md p-2 text-center bg-slate-50"><p class="text-[11px] text-slate-500">훌륭한</p><p class="text-xs font-bold text-slate-700">16.67%</p></div>
                            <div class="border border-slate-200 rounded-md p-2 text-center bg-slate-50"><p class="text-[11px] text-slate-500">신들린</p><p class="text-xs font-bold text-slate-700">3.33%</p></div>
                        </div>
                        <p class="text-[11px] text-slate-500 mt-3 text-center bg-blue-50 py-2 rounded-md font-medium" id="res-summary">음악 버프 효과 총합 +0 / 배율 1.00</p>
                    </div>

                    <table class="w-full mbc-table text-right mt-4">
                        <thead>
                            <tr>
                                <th class="text-left">버프 항목</th>
                                <th class="text-blue-500">보통</th>
                                <th class="text-emerald-500">훌륭</th>
                                <th class="text-amber-500">신들</th>
                            </tr>
                        </thead>
                        <tbody id="result-tbody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    appContainer.innerHTML = uiTemplate;

    // ==========================================
    // 2. 캐시 관리 로직 (자동 저장 및 로드)
    // ==========================================
    const form = document.getElementById('mbc-form');
    const inputElements = Array.from(form.elements).filter(el => el.tagName !== 'BUTTON');

    const saveCache = () => {
        const cacheData = inputElements.map(el => ({
            type: el.type,
            value: el.type === 'checkbox' ? el.checked : el.value
        }));
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    };

    const loadCache = () => {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return;
        try {
            const cacheData = JSON.parse(raw);
            cacheData.forEach((data, index) => {
                const el = inputElements[index];
                if (el) {
                    if (el.type === 'checkbox') el.checked = data.value;
                    else el.value = data.value;
                }
            });
        } catch (e) {
            console.error("캐시 로드 실패", e);
        }
    };

    // ==========================================
    // 3. 마비노기 버프 계산 로직
    // ==========================================
    const tbody = document.getElementById('result-tbody');
    const resSummary = document.getElementById('res-summary');

    const skills = [
        { id: 'battle_max', label: '최대 대미지', base: 20, type: 'percent', petBonusId: 'pet-red', isMult: true },
        { id: 'battle_min', label: '최소 대미지', base: 20, type: 'percent', petBonusId: 'pet-red', isMult: true },
        { id: 'battle_cri', label: '크리티컬', base: 11, type: 'percent', petBonusId: null, isMult: false },
        { id: 'viva_matk', label: '마법 공격력', base: 20, type: 'percent', petBonusId: 'pet-blue', isMult: true },
        { id: 'viva_mspd', label: '마법 시전속도', base: 11, type: 'percent', petBonusId: 'pet-blue', isMult: false },
        { id: 'viva_alspd', label: '연금술 시전속도', base: 11, type: 'percent', petBonusId: 'pet-blue', isMult: false },
        { id: 'viva_aspd', label: '공격 속도', base: 11, type: 'percent', petBonusId: 'pet-blue', isMult: false },
        { id: 'endur_def', label: '방어/마법방어', base: 11, type: 'flat', petBonusId: null, isMult: false },
        { id: 'endur_prot', label: '보호/마법보호', base: 5, type: 'flat', petBonusId: null, isMult: false },
        { id: 'endur_recov', label: '마나/스태 회복', base: 410, type: 'percent', petBonusId: null, isMult: false },
        { id: 'march_spd', label: '이동속도', base: 12, type: 'percent', petBonusId: null, isMult: false },
        { id: 'rich_succ', label: '채집/생산 성공률', base: 5, type: 'rich_succ', petBonusId: null, isMult: false },
        { id: 'rich_spd', label: '채집 속도', base: 25, type: 'rich_spd', petBonusId: 'pet-green', isMult: false }
    ];

    const getSum = (selector) => {
        let sum = 0;
        document.querySelectorAll(selector).forEach(el => {
            if (el.type === 'checkbox' && !el.checked) return;
            sum += (Number(el.value) || 0);
        });
        return sum;
    };

    const getMax = (selector) => {
        let max = 0;
        document.querySelectorAll(selector).forEach(el => {
            if (el.type === 'checkbox' && !el.checked) return;
            const val = Number(el.value) || 0;
            if (val > max) max = val;
        });
        return max;
    };

    const calculateAll = () => {
        let baseEffect = getSum('.calc-base') + getMax('.calc-group-mini-gen') + getMax('.calc-group-mini-ex') + getMax('.calc-group-horn') + getMax('.calc-group-bag') + getMax('.calc-group-pet');

        let equipReforge = { p:0, np:0, ep:0, gp:0, vm:0, vmg:0, vs:0, vy:0, rs:0, mm:0 };
        let echoReforge = { p:0, np:0, ep:0, gp:0, vm:0, vmg:0, vs:0, vy:0, rs:0, mm:0 };

        document.querySelectorAll('.reforge-equip').forEach(row => {
            const opt = row.querySelector('.reforge-opt').value;
            const lvl = Number(row.querySelector('.reforge-lvl').value) || 0;
            if(opt) equipReforge[opt] += lvl;
        });
        document.querySelectorAll('.reforge-echo').forEach(row => {
            const opt = row.querySelector('.reforge-opt').value;
            const lvl = Number(row.querySelector('.reforge-lvl').value) || 0;
            if(opt) echoReforge[opt] = lvl;
        });

        const finalReforge = {};
        for(let key in equipReforge) finalReforge[key] = Math.max(equipReforge[key], echoReforge[key]);

        baseEffect += finalReforge['p'];

        const totalMultBonus = getSum('.calc-mult');
        const multiplier = 1 + (totalMultBonus / 100);

        const qNormal = finalReforge['np'];
        const qGreat = finalReforge['ep'] + 10;
        const qGodly = finalReforge['gp'] + 30;

        const petCheck = (id) => document.getElementById(id)?.checked;
        const partyCount = Number(document.getElementById('party-count').value) || 0;

        let html = '';
        skills.forEach(skill => {
            const calcFormula = (qVal) => {
                if (skill.type === 'rich_succ') return skill.base.toFixed(2) + "%";

                let addWeight = 0;
                if (skill.id === 'viva_matk') addWeight = finalReforge['vmg'];
                else if (skill.id === 'viva_mspd') addWeight = finalReforge['vm'];
                else if (skill.id === 'viva_alspd') addWeight = finalReforge['vy'];
                else if (skill.id === 'viva_aspd') addWeight = finalReforge['vs'];
                else if (skill.id === 'rich_spd') addWeight = finalReforge['rs'];
                else if (skill.id === 'march_spd') addWeight = finalReforge['mm'];

                const petAddWeight = (skill.petBonusId && petCheck(skill.petBonusId)) ? (skill.base / 100 * 2) : 0;

                let result = (skill.base + addWeight) * (1 + (qVal / 100)) * ((100 + baseEffect) / 100);
                result = Math.round(result * 100) / 100;
                result += petAddWeight;

                if (skill.type === 'rich_spd') result += (partyCount * 3 > 10 ? 10 : partyCount * 3);
                else if (skill.isMult) result *= multiplier;

                if (skill.type === 'flat') return Math.floor(result);
                return result.toFixed(2) + "%";
            };

            html += `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="text-left font-medium text-slate-600">${skill.label}</td>
                    <td class="val-normal font-semibold">${calcFormula(qNormal)}</td>
                    <td class="val-great font-semibold">${calcFormula(qGreat)}</td>
                    <td class="val-godly font-semibold">${calcFormula(qGodly)}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        resSummary.innerHTML = `버프 합산 <strong>+${baseEffect.toFixed(2)}</strong> &nbsp;|&nbsp; 곱연산 배율 <strong>${multiplier.toFixed(4)}</strong>`;

        saveCache();
    };

    // ==========================================
    // 4. 이벤트 바인딩
    // ==========================================
    form.addEventListener('input', calculateAll);

    document.getElementById('mbc-btn-reset').addEventListener('click', () => {
        localStorage.removeItem(CACHE_KEY);
        form.reset();
        calculateAll();
        if (typeof showToast === 'function') showToast("데이터가 초기화 되었습니다.");
    });

    // 5. 초기 실행
    loadCache();
    calculateAll();
});