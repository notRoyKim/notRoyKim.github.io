document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('music-buff-app');
    if (!appContainer) return;

    // 1. UI 및 스타일 템플릿 정의 (JS가 UI를 그립니다)
    const uiTemplate = `
        <style>
            .mbc-container {
                display: flex;
                gap: 20px;
                flex-wrap: wrap;
                margin-top: 20px;
                font-family: system-ui, sans-serif;
                color: #000;
            }
            .mbc-left { flex: 2; min-width: 300px; display: flex; flex-direction: column; gap: 20px; }
            .mbc-right { flex: 1; min-width: 280px; }

            /* 패널 기본 스타일 */
            .mbc-column {
                background: #ebecf0;
                border-radius: 8px;
                padding: 16px;
            }
            .mbc-column h3 {
                position: relative;
                margin: 0 0 16px 0;
                font-size: 16px;
                font-weight: 600;
                padding-left: 12px;
            }
            /* 제목 옆 포인트 바 */
            .mbc-column h3::before {
                content: '';
                position: absolute;
                width: 6px;
                height: 100%;
                top: 0;
                left: 0;
                background: #1b1f77;
                border-radius: 4px;
            }

            /* 입력 폼(카드) 스타일 */
            .mbc-input-group {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                gap: 10px;
            }
            .mbc-card {
                background: white;
                border-radius: 6px;
                padding: 10px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .mbc-card label { font-size: 13px; font-weight: 600; color: #555; }
            .mbc-card select, .mbc-card input[type="number"] {
                width: 100%;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 6px;
                font-size: 13px;
                outline: none;
            }
            
            /* 버튼 스타일 */
            .mbc-btn-group { display: flex; gap: 10px; margin-bottom: 20px; }
            .mbc-btn {
                border-radius: 10px;
                border: 1px solid #f2b8b5;
                background: #fff5f5;
                color: #d32f2f;
                font-size: 14px;
                padding: 6px 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .mbc-btn:hover { background: #ffe3e3; border-color: #e57373; }
            .mbc-btn:active { transform: scale(0.96); }
            
            /* 결과창 스타일 */
            .mbc-result-board {
                background: #ffffff;
                border-radius: 12px;
                padding: 16px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                position: sticky;
                top: 90px;
            }
            .mbc-result-board h3 { font-size: 16px; font-weight: 600; margin: 0 0 16px 0; }
            .mbc-result-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #ebecf0;
                border-radius: 8px;
                margin-bottom: 8px;
                padding: 10px 12px;
                font-size: 13px;
                font-weight: 600;
            }
            .mbc-result-row span { transition: transform .15s ease; }
            
            /* 결과창 포인트 컬러 */
            .val-normal { color: #72a1d8; } 
            .val-great { color: #6dc6a6; }  
            .val-godly { color: #a5986f; }  
        </style>

        <div class="mbc-container">
            <div class="mbc-left">
                <form id="mbc-form">
                    <div class="mbc-column">
                        <h3>기본 설정</h3>
                        <div class="mbc-input-group">
                            <div class="mbc-card">
                                <label>악기 연주 랭크</label>
                                <select id="mbc-play-rank">
                                    <option value="1">1랭크</option>
                                    <option value="2">2랭크</option>
                                </select>
                            </div>
                            <div class="mbc-card">
                                <label>노래 랭크</label>
                                <select id="mbc-song-rank">
                                    <option value="1">1랭크</option>
                                    <option value="2">2랭크</option>
                                </select>
                            </div>
                            <div class="mbc-card" style="flex-direction: row; justify-content: space-between; align-items: center;">
                                <label for="mbc-gm-bard" style="cursor: pointer;">그랜드마스터</label>
                                <input type="checkbox" id="mbc-gm-bard" checked style="width:16px; height:16px; cursor: pointer;">
                            </div>
                            <div class="mbc-card">
                                <label>세인트바드 링크</label>
                                <select id="mbc-saint-link">
                                    <option value="10">10 링크</option>
                                    <option value="0">미적용</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="mbc-column" style="margin-top: 20px;">
                        <h3 style="background: none;"><span style="background: #9fbea0; width: 6px; height: 100%; position: absolute; left: 0; top: 0; border-radius: 4px;"></span>장비 및 세공</h3>
                        <div class="mbc-input-group">
                            <div class="mbc-card">
                                <label>악기 버프 효과</label>
                                <input type="number" id="mbc-equip-buff" value="0" min="0" placeholder="수치 입력">
                            </div>
                            <div class="mbc-card">
                                <label>세공 (전장의 서곡)</label>
                                <input type="number" id="mbc-reforge-bmo" value="0" min="0" placeholder="레벨 입력">
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="mbc-right">
                <div class="mbc-btn-group">
                    <button type="button" class="mbc-btn" id="mbc-btn-save">저장</button>
                    <button type="button" class="mbc-btn" id="mbc-btn-reset">초기화</button>
                </div>

                <div class="mbc-result-board">
                    <h3>최종 버프 수치 (전장의 서곡)</h3>
                    <div class="mbc-result-row">
                        <div>보통 연주</div>
                        <div class="val-normal"><span id="res-normal">0.00</span>%</div>
                    </div>
                    <div class="mbc-result-row">
                        <div>훌륭한 연주</div>
                        <div class="val-great"><span id="res-great">0.00</span>%</div>
                    </div>
                    <div class="mbc-result-row">
                        <div>신들린 연주</div>
                        <div class="val-godly"><span id="res-godly">0.00</span>%</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 2. DOM에 UI 그리기 (Inject)
    appContainer.innerHTML = uiTemplate;

    // 3. 렌더링된 이후에 DOM 요소 찾기
    const form = document.getElementById('mbc-form');
    const elements = {
        playRank: document.getElementById('mbc-play-rank'),
        gmBard: document.getElementById('mbc-gm-bard'),
        equipBuff: document.getElementById('mbc-equip-buff'),
        reforgeBmo: document.getElementById('mbc-reforge-bmo'),
        resNormal: document.getElementById('res-normal'),
        resGreat: document.getElementById('res-great'),
        resGodly: document.getElementById('res-godly'),
        btnReset: document.getElementById('mbc-btn-reset'),
        btnSave: document.getElementById('mbc-btn-save')
    };

    // 4. 버프 연산 로직
    const calculateBuffs = () => {
        let baseBuff = 20; // 임시: 1랭크 기본

        if (elements.gmBard.checked) baseBuff += 5;
        baseBuff += (Number(elements.equipBuff.value) || 0);
        baseBuff += (Number(elements.reforgeBmo.value) || 0);

        // 결과 업데이트 애니메이션 용도
        [elements.resNormal, elements.resGreat, elements.resGodly].forEach(el => {
            el.classList.remove('updated');
            void el.offsetWidth;
            el.classList.add('updated');
        });

        // 수치 입력
        elements.resNormal.textContent = baseBuff.toFixed(2);
        elements.resGreat.textContent = (baseBuff * 1.1).toFixed(2);
        elements.resGodly.textContent = (baseBuff * 1.3).toFixed(2);
    };

    // 5. 이벤트 리스너 등록
    form.addEventListener('input', calculateBuffs);

    elements.btnReset.addEventListener('click', () => {
        form.reset();
        calculateBuffs();
        if (typeof showToast === 'function') showToast("초기화 되었습니다.");
    });

    elements.btnSave.addEventListener('click', () => {
        if (typeof showToast === 'function') showToast("세팅이 저장되었습니다.");
    });

    // 6. 초기 실행
    calculateBuffs();
});