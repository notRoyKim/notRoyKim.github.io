// ==========================================
// 1. 상수 및 초기 데이터 설정
// ==========================================
const CACHE_KEY = 'ascCache';

const tl = [
    {name: "브리흐네 잉어", qty: 10, class: "A", idx: "1", avgPrice: 0, totalPrice: 0},
    {name: "개암버섯", qty: 50, class: "A", idx: "2", avgPrice: 0, totalPrice: 0},
    {name: "힐웬 광석 조각", qty: 100, class: "A", idx: "3", avgPrice: 0, totalPrice: 0},
    {name: "실리엔 결정", qty: 100, class: "A", idx: "4", avgPrice: 0, totalPrice: 0},
    {name: "발화석", qty: 40, class: "A", idx: "5", avgPrice: 0, totalPrice: 0},
    {name: "유황", qty: 60, class: "A", idx: "6", avgPrice: 0, totalPrice: 0},
    {name: "철광석", qty: 60, class: "A", idx: "7", avgPrice: 0, totalPrice: 0},
    {name: "동광석", qty: 20, class: "A", idx: "8", avgPrice: 0, totalPrice: 0},
    {name: "은붕어", qty: 40, class: "B", idx: "9", avgPrice: 0, totalPrice: 0},
    {name: "무른 힐웬 광석 조각", qty: 40, class: "B", idx: "10", avgPrice: 0, totalPrice: 0},
    {name: "얼룩진 실리엔 결정", qty: 40, class: "B", idx: "11", avgPrice: 0, totalPrice: 0},
    {name: "물이 든 병", qty: 15, class: "B", idx: "12", avgPrice: 0, totalPrice: 0},
    {name: "우유", qty: 10, class: "B", idx: "13", avgPrice: 0, totalPrice: 0},
    {name: "양털", qty: 100, class: "B", idx: "14", avgPrice: 0, totalPrice: 0},
    {name: "동광석 조각", qty: 35, class: "B", idx: "15", avgPrice: 0, totalPrice: 0},
    {name: "철광석 조각", qty: 80, class: "B", idx: "16", avgPrice: 0, totalPrice: 0},
    {name: "감자", qty: 25, class: "C", idx: "17", avgPrice: 0, totalPrice: 0},
    {name: "옥수수", qty: 25, class: "C", idx: "18", avgPrice: 0, totalPrice: 0},
    {name: "밀", qty: 30, class: "C", idx: "19", avgPrice: 0, totalPrice: 0},
    {name: "보리", qty: 30, class: "C", idx: "20", avgPrice: 0, totalPrice: 0},
    {name: "나무장작", qty: 30, class: "C", idx: "21", avgPrice: 0, totalPrice: 0},
    {name: "마나 허브", qty: 30, class: "C", idx: "22", avgPrice: 0, totalPrice: 0},
    {name: "블러디 허브", qty: 30, class: "C", idx: "23", avgPrice: 0, totalPrice: 0},
    {name: "베이스 허브", qty: 30, class: "C", idx: "24", avgPrice: 0, totalPrice: 0}
];

const pl = [
    {name: "숏 보우", qty: 1, class: "A", idx: "25", avgPrice: 0, totalPrice: 0},
    {name: "호미", qty: 1, class: "A", idx: "26", avgPrice: 0, totalPrice: 0},
    {name: "폴라리스 결정", qty: 5, class: "A", idx: "27", avgPrice: 0, totalPrice: 0},
    {name: "하다르 결정", qty: 5, class: "A", idx: "28", avgPrice: 0, totalPrice: 0},
    {name: "철괴", qty: 50, class: "A", idx: "29", avgPrice: 0, totalPrice: 0},
    {name: "동괴", qty: 50, class: "A", idx: "30", avgPrice: 0, totalPrice: 0},
    {name: "스핀 기어", qty: 10, class: "A", idx: "31", avgPrice: 0, totalPrice: 0},
    {name: "뮤턴트", qty: 10, class: "A", idx: "32", avgPrice: 0, totalPrice: 0},
    {name: "중급 나무장작", qty: 30, class: "B", idx: "33", avgPrice: 0, totalPrice: 0},
    {name: "생명력 300 포션", qty: 30, class: "B", idx: "34", avgPrice: 0, totalPrice: 0},
    {name: "마나 300 포션", qty: 30, class: "B", idx: "35", avgPrice: 0, totalPrice: 0},
    {name: "고급 나무장작", qty: 20, class: "B", idx: "36", avgPrice: 0, totalPrice: 0},
    {name: "스패너", qty: 1, class: "B", idx: "37", avgPrice: 0, totalPrice: 0},
    {name: "스태미나 300 포션", qty: 30, class: "B", idx: "38", avgPrice: 0, totalPrice: 0},
    {name: "신비한 허브 가루", qty: 20, class: "B", idx: "39", avgPrice: 0, totalPrice: 0},
    {name: "코레스 힐러 글러브", qty: 1, class: "B", idx: "40", avgPrice: 0, totalPrice: 0},
    {name: "힐웬", qty: 50, class: "C", idx: "41", avgPrice: 0, totalPrice: 0},
    {name: "실리엔", qty: 50, class: "C", idx: "42", avgPrice: 0, totalPrice: 0},
    {name: "일반 옷감", qty: 50, class: "C", idx: "43", avgPrice: 0, totalPrice: 0},
    {name: "저가형 옷감", qty: 50, class: "C", idx: "44", avgPrice: 0, totalPrice: 0},
    {name: "일반 실크", qty: 50, class: "C", idx: "45", avgPrice: 0, totalPrice: 0},
    {name: "저가형 실크", qty: 50, class: "C", idx: "46", avgPrice: 0, totalPrice: 0},
    {name: "일반 가죽끈", qty: 50, class: "C", idx: "47", avgPrice: 0, totalPrice: 0},
    {name: "저가형 가죽끈", qty: 50, class: "C", idx: "48", avgPrice: 0, totalPrice: 0}
];

const BOARD_TYPES = [
    { title: '타이론', className: 'drag-to drag-t', dataList: tl, pointClass: 'asc-tyron' },
    { title: '폴라', className: 'drag-to drag-p', dataList: pl, pointClass: 'asc-polar' },
    { title: '결과', className: 'drag-result', dataList: null, pointClass: '' }
];

// 등급별 점수 매핑
const REWARD_POINTS = {
    'A': { exp: 150, coin: 1300 },
    'B': { exp: 100, coin: 900 },
    'C': { exp: 50, coin: 600 }
};

// 전역 상태
const state = {
    selectedItems: [], // 결과창에 담긴 아이템 목록
    draggedCard: null,
    activeCard: null
};

// ==========================================
// 2. 캐시 및 데이터 관리 모듈
// ==========================================
const AscCache = {
    load: () => JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'),
    save: (data) => localStorage.setItem(CACHE_KEY, JSON.stringify(data)),
    add: (idx) => {
        const cache = AscCache.load();
        cache[idx] = 1;
        AscCache.save(cache);
    },
    remove: (idx) => {
        const cache = AscCache.load();
        delete cache[idx];
        AscCache.save(cache);
    }
};

async function fetchAuctionPrices(itemNames) {
    if (!itemNames || itemNames.length === 0) return [];
    try {
        const res = await fetch("https://shrill-union-acd2.sinant7616.workers.dev/drop", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: itemNames })
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Failed to load prices:", error);
        return [];
    }
}

// ==========================================
// 3. UI 렌더링 모듈 (템플릿 기반)
// ==========================================
function createCardHTML(item, isResultBoard = false) {
    const classEmoji = item.class === 'A' ? '😻' : item.class === 'B' ? '😼' : '😹';
    const cardStateClass = isResultBoard ? 'drag-done' : (item.class === 'A' || item.class === 'B' ? 'drag-before drag-tCard' : 'drag-before drag-pCard');

    return `
        <div class="asc-card ${cardStateClass}" 
             data-name="${item.name}" 
             data-qty="${item.qty}" 
             data-class="${item.class}" 
             data-idx="${item.idx}" 
             data-avg-price="${item.avgPrice || 0}" 
             data-total-price="${item.totalPrice || 0}">
            
            <span class="asc-handle" title="드래그 앤 드롭">⋮⋮</span>
            <div class="asc-content">${item.name} ${item.qty}개</div>
            
            <div class="asc-class tooltip-wrap asc-class-${item.class.toLowerCase()}" data-tooltip="${item.class}등급">
                ${classEmoji}
            </div>
        </div>
    `;
}

function renderResultBoardUI() {
    return `
        <div class="asc-result">
            <h3>결과 요약</h3>
            <div class="asc-exp">협회 경험치 : <span class="asc-span-exp">0</span></div>
            <div class="asc-count">수주한 의뢰 수 : <span class="asc-span-count">0</span><span> / 20</span></div>
            
            <div class="asc-gold">
                납품 원가 : <span class="asc-span-gold">0</span>
                <div class="asc-btn asc-btn-cal" id="btn-calculate-prices">산정</div>
            </div>
            
            <div class="asc-coin">협회 코인 : <span class="asc-span-coin">0</span></div>
        </div>
    `;
}

function addAscDiv(container) {
    const cache = AscCache.load();
    let initialSelectedItems = [];

    // 최상단 버튼 영역
    const btnContainer = document.createElement('div');
    btnContainer.className = 'asc-btn-div';
    btnContainer.innerHTML = `<div class="asc-btn asc-btn-delete" id="btn-reset-asc">초기화</div>`;
    container.appendChild(btnContainer);

    // 3개의 컬럼 영역 생성
    BOARD_TYPES.forEach((board, i) => {
        const boardDiv = document.createElement('div');
        boardDiv.className = 'asc-board';

        let listHTML = '';
        const currentList = board.dataList || initialSelectedItems;

        // 결과창 초기 로딩용 데이터 분리
        if (i < 2) {
            currentList.forEach(item => {
                if (cache[item.idx]) {
                    initialSelectedItems.push(item);
                } else {
                    listHTML += createCardHTML(item, false);
                }
            });
        } else {
            // 3번째 결과 컬럼
            currentList.forEach(item => {
                listHTML += createCardHTML(item, true);
            });
        }

        const columnHTML = `
            <div class="asc-column ${board.className}" data-column>
                <h3>
                    <div class="${board.pointClass}"></div>
                    ${board.title}
                </h3>
                <div class="asc-list">${listHTML}</div>
                ${i === 2 ? renderResultBoardUI() : ''}
            </div>
        `;

        boardDiv.innerHTML = columnHTML;
        container.appendChild(boardDiv);
    });

    state.selectedItems = initialSelectedItems;

    // 초기 렌더링 시 결과창 수치 업데이트
    initialSelectedItems.forEach(item => updateRewards(item.class, 1));
    updateTotalPriceUI();

    bindEvents(container);
}

// ==========================================
// 4. 이벤트 핸들러 및 위임
// ==========================================
function bindEvents(container) {
    // 버튼 이벤트
    document.getElementById('btn-reset-asc')?.addEventListener('click', handleResetClick);
    document.getElementById('btn-calculate-prices')?.addEventListener('click', handleCalculateClick);

    // 카드 클릭 이벤트 (위임)
    container.addEventListener('click', (e) => {
        const card = e.target.closest('.asc-card.drag-done');
        if (!card) return;

        if (state.activeCard) state.activeCard.classList.remove('card-active');
        state.activeCard = card;
        card.classList.add('card-active');

        const itemName = card.dataset.name;
        if (itemName) {
            navigator.clipboard.writeText(itemName)
                .then(() => {
                    showToast('🥴 클립보드에 복사되었습니다!');
                    card.querySelector('.asc-class')?.classList.add('animate');
                })
                .catch(() => showToast('복사 실패 😢'));
        }
    });

    // 드래그 핸들 마우스 이벤트
    container.addEventListener('mousedown', e => {
        if (e.target.classList.contains('asc-handle')) {
            e.target.closest('.asc-card').setAttribute('draggable', 'true');
        }
    });

    container.addEventListener('mouseup', e => {
        if (e.target.classList.contains('asc-handle')) {
            e.target.closest('.asc-card').removeAttribute('draggable');
        }
    });

    // 드래그 앤 드롭 이벤트
    setupDragAndDrop(container);
}

function setupDragAndDrop(container) {
    document.addEventListener('dragstart', e => {
        if (!e.target.classList?.contains('asc-card')) return;
        state.draggedCard = e.target;
        state.draggedCard.classList.add('dragging');
    });

    document.addEventListener('dragend', () => {
        if (!state.draggedCard) return;
        state.draggedCard.classList.remove('dragging');
        state.draggedCard.removeAttribute('draggable');
        state.draggedCard = null;
        document.querySelectorAll('.asc-column').forEach(c => c.classList.remove('drag-over'));
    });

    document.querySelectorAll('.asc-column').forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
            column.classList.add('drag-over');
        });

        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });

        column.addEventListener('drop', e => {
            e.preventDefault();
            column.classList.remove('drag-over');
            if (!state.draggedCard) return;

            handleDrop(column);
        });
    });
}

function handleDrop(targetColumn) {
    const card = state.draggedCard;
    const isToResult = targetColumn.classList.contains('drag-result');
    const isFromOrigin = targetColumn.classList.contains('drag-to');

    // 교차 이동 방지 로직 (타이론 <-> 폴라 간의 이동 금지)
    if (isFromOrigin) {
        if (card.classList.contains('drag-before')) return;
        if (card.classList.contains('drag-tCard') && targetColumn.classList.contains('drag-p')) return;
        if (card.classList.contains('drag-pCard') && targetColumn.classList.contains('drag-t')) return;

        // 원상복구 처리
        card.classList.replace('drag-done', 'drag-before');
        state.selectedItems = state.selectedItems.filter(item => item.name !== card.dataset.name);
        AscCache.remove(card.dataset.idx);
        updateRewards(card.dataset.class, -1);
        updateTotalPriceUI();

    } else if (isToResult) {
        if (card.classList.contains('drag-done')) return;

        const currentCount = parseInt(document.querySelector('.asc-span-count').textContent) || 0;
        if (currentCount >= 20) {
            showToast('🥴 매주 20회까지만 납품할 수 있습니다.');
            return;
        }

        // 결과창으로 이동 처리
        AscCache.add(card.dataset.idx);

        const newItem = {
            name: card.dataset.name,
            qty: parseInt(card.dataset.qty),
            class: card.dataset.class,
            idx: card.dataset.idx,
            avgPrice: parseInt(card.dataset.avgPrice) || 0,
            totalPrice: parseInt(card.dataset.totalPrice) || 0
        };

        state.selectedItems.push(newItem);
        card.classList.replace('drag-before', 'drag-done');

        updateRewards(card.dataset.class, 1);
        updateTotalPriceUI();
    }

    // 카드 이동
    const list = targetColumn.querySelector('.asc-list');
    if (list) list.appendChild(card);
}

// ==========================================
// 5. 상태 계산 및 업데이트
// ==========================================
function updateRewards(itemClass, multiplier) {
    const points = REWARD_POINTS[itemClass];
    if (!points) return;

    const els = {
        exp: document.querySelector('.asc-span-exp'),
        coin: document.querySelector('.asc-span-coin'),
        count: document.querySelector('.asc-span-count')
    };

    if (els.exp) els.exp.textContent = (parseInt(els.exp.textContent || 0) + (points.exp * multiplier)).toString();
    if (els.coin) els.coin.textContent = (parseInt(els.coin.textContent || 0) + (points.coin * multiplier)).toString();
    if (els.count) els.count.textContent = (parseInt(els.count.textContent || 0) + multiplier).toString();
}

function updateTotalPriceUI() {
    const goldSpan = document.querySelector('.asc-span-gold');
    if (!goldSpan) return;

    const hasUnknownPrice = state.selectedItems.some(item => item.avgPrice === 0);
    const total = state.selectedItems.reduce((acc, curr) => acc + curr.totalPrice, 0);

    goldSpan.textContent = hasUnknownPrice && total === 0 ? "0 + @"
        : hasUnknownPrice ? `${total.toLocaleString('ko-KR')} + @`
            : total.toLocaleString('ko-KR');
}

async function handleCalculateClick(e) {
    if (state.selectedItems.length === 0) {
        showToast("산정할 아이템이 없습니다.");
        return;
    }

    const targetAncestor = e.currentTarget.closest('.asc-result');
    if (typeof addLoadingDiv === 'function') addLoadingDiv(targetAncestor);

    const itemNames = state.selectedItems.map(item => item.name);
    const aucResult = await fetchAuctionPrices(itemNames);

    // 가격 재계산 로직
    state.selectedItems = state.selectedItems.map(item => {
        const matched = aucResult.find(auc => auc.item_name === item.name);
        const avgPrice = matched ? Number(matched.avg_price) : 0;
        return { ...item, avgPrice, totalPrice: item.qty * avgPrice };
    });

    // DOM 업데이트
    document.querySelectorAll('.asc-card').forEach(card => {
        const matchedData = state.selectedItems.find(item => item.name === card.dataset.name);
        if (matchedData) {
            card.dataset.avgPrice = matchedData.avgPrice;
            card.dataset.totalPrice = matchedData.totalPrice;
        }
    });

    updateTotalPriceUI();

    if (typeof deleteLoadingDiv === 'function') {
        deleteLoadingDiv(document.querySelector(".spinner-placeholder"));
    }
}

async function handleResetClick(e) {
    const btn = e.currentTarget;
    if (!btn.classList.contains('active')) {
        btn.classList.add('active');
        showToast('👀 한번 더 누르면 초기화 됩니다.');
        return;
    }

    localStorage.removeItem(CACHE_KEY);
    showToast('🫠 초기화 되었습니다.');

    setTimeout(() => location.replace(location.href), 1000);
}

// 초기화 진입점
function f_initAsc(el) {
    addAscDiv(el);
}