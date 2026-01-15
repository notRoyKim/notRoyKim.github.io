function loadCache() {
    const raw = localStorage.getItem('planCache');
    return raw ? JSON.parse(raw) : {};
}

function saveCache(cache) {
    localStorage.setItem('planCache', JSON.stringify(cache));
}

window.APP = window.APP || {};

const CELL_SIZE = 60; // 50px(width) + 10px(gap)

let draggedItem = null;
let cl = [];

// 날짜 계산 함수 (days 추가)
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// 충돌 감지 함수
function checkCollision(targetItem, newCol, newRow) {
    const w = parseInt(targetItem.dataset.w);
    const h = parseInt(targetItem.dataset.h);
    const items = document.querySelectorAll('.item');

    for (let item of items) {
        if (item === targetItem) continue;

        // 각 아이템의 현재 위치 파악
        const gc = item.style.gridColumn.split(' / ');
        const gr = item.style.gridRow.split(' / ');
        const itemCol = parseInt(gc[0]);
        const itemRow = parseInt(gr[0]);
        const itemW = parseInt(item.dataset.w);
        const itemH = parseInt(item.dataset.h);

        // 사각형 충돌 판정 로직
        if (
            newCol < itemCol + itemW &&
            newCol + w > itemCol &&
            newRow < itemRow + itemH &&
            newRow + h > itemRow
        ) {
            return true; // 충돌 발생
        }
    }
    return false; // 통과
}

// 상태 체크 함수
function checkActive() {
    const btn = document.getElementById('timeBtn');
    const savedTime = cl?.[0]?.savedTime ?? null;
    const days = Number(btn.dataset.days); // data-days

    if (savedTime) {
        const expireTime = addDays(savedTime, days);
        const now = new Date();
        if (expireTime < now) {
            btn.classList.add('active');
        }
    } else {
        btn.classList.remove('active');
    }
}

function addPlnDiv(el) {
// 페이지 로드 시 자동 체크
    cl = loadCache();
    const btn = document.getElementById('timeBtn');

    console.log(cl);

    // 클릭 시 현재 시간 저장
    btn.addEventListener('click', () => {
        const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' });
        let cache = [{'savedTime':now}]
        saveCache(cache);
        checkActive();
    });
}

function f_initPln(el) {
    addPlnDiv(el);
}

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('gridContainer');
    const addBtn = document.getElementById('addBtn');
    const contextMenu = document.getElementById('contextMenu');
    const matrixGrid = document.getElementById('matrixGrid');
    const matrixLabel = document.getElementById('matrixLabel');// 상태 관리
    const COLUMNS = 5;
    const ROW_HEIGHT = 100; // CSS grid-auto-rows와 일치
    const GAP = 10;

    // 아이템 데이터 저장소 [{id, x, y, w, h}, ...]
    let items = [];
    let draggingItem = null;
    let dragStartPos = { x: 0, y: 0 };
    let initialItemState = null;

    // --- 1. 컨텍스트 메뉴 로직 ---

    // 5x5 매트릭스 생성
    for (let r = 1; r <= 5; r++) {
        for (let c = 1; c <= 5; c++) {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            cell.dataset.w = c;
            cell.dataset.h = r;
            cell.addEventListener('mouseenter', () => highlightMatrix(c, r));
            cell.addEventListener('click', () => createItem(c, r));
            matrixGrid.appendChild(cell);
        }
    }

    addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        contextMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target) && e.target !== addBtn) {
            contextMenu.classList.add('hidden');
        }
    });

    function highlightMatrix(w, h) {
        matrixLabel.textContent = `${w} x ${h}`;
        const cells = matrixGrid.children;
        for (let cell of cells) {
            const cw = parseInt(cell.dataset.w);
            const ch = parseInt(cell.dataset.h);
            if (cw <= w && ch <= h) {
                cell.classList.add('active');
            } else {
                cell.classList.remove('active');
            }
        }
    }

    // --- 2. 아이템 생성 및 렌더링 ---

    function createItem(w, h) {
        // 빈 공간 찾기 (단순화를 위해 가장 아래에 추가하거나 0,0부터 검색)
        let pos = findEmptySpace(w, h);

        const newItem = {
            id: Date.now(),
            x: pos.x,
            y: pos.y,
            w: w,
            h: h
        };
        items.push(newItem);
        renderGrid();
        contextMenu.classList.add('hidden');
    }

    function findEmptySpace(w, h) {
        // (0,0) 부터 순회하며 빈 공간 탐색
        let y = 0;
        while (true) {
            for (let x = 0; x <= COLUMNS - w; x++) {
                if (!checkCollision(x, y, w, h)) {
                    return { x, y };
                }
            }
            y++;
        }
    }

    function checkCollision(x, y, w, h, excludeId = null) {
        // 경계 체크
        if (x < 0 || y < 0 || x + w > COLUMNS) return true;

        // 다른 아이템과 겹치는지 체크
        for (let item of items) {
            if (item.id === excludeId) continue;
            // AABB 충돌 감지 알고리즘
            if (x < item.x + item.w &&
                x + w > item.x &&
                y < item.y + item.h &&
                y + h > item.y) {
                return true;
            }
        }
        return false;
    }

    function renderGrid() {
        gridContainer.innerHTML = ''; // 초기화 (성능 최적화 시 diff 알고리즘 필요)

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'grid-item';
            el.style.gridColumnStart = item.x + 1;
            el.style.gridColumnEnd = item.x + 1 + item.w;
            el.style.gridRowStart = item.y + 1;
            el.style.gridRowEnd = item.y + 1 + item.h;
            el.id = `item-${item.id}`;

            // 내용
            el.innerHTML = `
                <span>${item.w}x${item.h}</span>
                <div class="drag-handle" data-id="${item.id}">
                    <div class="handle-icon"></div>
                </div>
            `;

            // 우클릭 삭제
            el.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (confirm('삭제하시겠습니까?')) {
                    items = items.filter(i => i.id !== item.id);
                    renderGrid();
                }
            });

            // 핸들 드래그 이벤트 연결
            const handle = el.querySelector('.drag-handle');
            handle.addEventListener('mousedown', (e) => startDrag(e, item, el));

            gridContainer.appendChild(el);
        });
    }

    // --- 3. 드래그 앤 드롭 로직 (수정됨) ---

    let ghostElement = null;
    let placeholder = null;

    // 드래그 상태 변수
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 }; // 마우스와 아이템 좌상단 사이 거리
    let currentMousePos = { x: 0, y: 0 };
    let animationFrameId = null;

    function startDrag(e, item, originalEl) {
        e.preventDefault(); // 텍스트 선택 등 방지

        isDragging = true;
        draggingItem = item;
        initialItemState = { ...item };

        const rect = originalEl.getBoundingClientRect();

        // 중요: 마우스 클릭 위치와 아이템 좌상단(0,0) 사이의 거리(Offset) 계산
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        currentMousePos = { x: e.clientX, y: e.clientY };

        // 고스트 엘리먼트 생성
        ghostElement = originalEl.cloneNode(true);
        ghostElement.classList.add('dragging');

        // 고스트 초기 위치 및 크기 설정
        ghostElement.style.width = rect.width + 'px';
        ghostElement.style.height = rect.height + 'px';
        // 초기 위치는 transform으로 제어하기 위해 top/left는 0으로 두거나 고정
        ghostElement.style.left = '0px';
        ghostElement.style.top = '0px';
        // 즉시 마우스 위치로 이동 (깜빡임 방지)
        ghostElement.style.transform = `translate(${rect.left}px, ${rect.top}px)`;

        document.body.appendChild(ghostElement);

        // 원래 요소 흐리게
        originalEl.style.opacity = '0.2';

        // Placeholder 생성
        placeholder = document.createElement('div');
        placeholder.className = 'grid-placeholder';
        setGridPosition(placeholder, item.x, item.y, item.w, item.h);
        gridContainer.appendChild(placeholder);

        // 이벤트 리스너 및 애니메이션 루프 시작
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', endDrag);

        // 스터터링 방지를 위한 렌더링 루프 시작
        animationFrameId = requestAnimationFrame(updateDragFrame);
    }

    // 마우스 움직임은 좌표만 업데이트 (연산 최소화)
    function onMouseMove(e) {
        currentMousePos.x = e.clientX;
        currentMousePos.y = e.clientY;
    }

    // 실제 화면 렌더링 (60fps 목표)
    function updateDragFrame() {
        if (!isDragging || !ghostElement) return;

        // 1. 고스트 이동 (마우스 위치 - 오프셋 = 아이템 좌상단 위치)
        const ghostX = currentMousePos.x - dragOffset.x;
        const ghostY = currentMousePos.y - dragOffset.y;

        ghostElement.style.transform = `translate(${ghostX}px, ${ghostY}px)`;

        // 2. 그리드 좌표 계산
        const gridRect = gridContainer.getBoundingClientRect();

        // 그리드 내부에서의 상대 좌표 (패딩 10px 고려)
        const relativeX = ghostX - gridRect.left - 10;
        const relativeY = ghostY - gridRect.top - 10;

        // 컬럼 너비 계산 (컨테이너 크기 기준 동적 계산)
        // (컨테이너너비 - 패딩20 - 갭*(5-1)) / 5
        const colWidth = (gridContainer.offsetWidth - 20 - (GAP * (COLUMNS - 1))) / COLUMNS;

        // 좌표를 인덱스로 변환 (Math.round로 가장 가까운 칸 자석 효과)
        let targetX = Math.round(relativeX / (colWidth + GAP));
        let targetY = Math.round(relativeY / (ROW_HEIGHT + GAP));

        // 범위 제한 (아이템 크기 고려)
        // targetX는 0보다 커야 하고, (targetX + itemWidth)는 5를 넘으면 안 됨
        targetX = Math.max(0, Math.min(targetX, COLUMNS - draggingItem.w));
        targetY = Math.max(0, targetY); // 상단만 제한, 하단은 무한

        // 3. 충돌 검사 및 Placeholder 이동
        // 자기 자신(draggingItem.id)은 충돌 체크에서 제외해야 원래 자리 근처도 유효한 곳으로 인식됨
        if (!checkCollision(targetX, targetY, draggingItem.w, draggingItem.h, draggingItem.id)) {
            setGridPosition(placeholder, targetX, targetY, draggingItem.w, draggingItem.h);
            placeholder.dataset.validX = targetX;
            placeholder.dataset.validY = targetY;
            placeholder.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
            placeholder.style.borderColor = '#007bff';
        } else {
            // 충돌 시 시각적 피드백 (빨간색)
            // 충돌난 위치에도 placeholder를 보여줄지 말지는 선택사항.
            // 여기서는 사용자가 어디에 놓으려는지 알 수 있게 빨간색으로 위치 표시
            setGridPosition(placeholder, targetX, targetY, draggingItem.w, draggingItem.h);
            placeholder.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            placeholder.style.borderColor = '#ff4d4d';
            delete placeholder.dataset.validX; // 유효하지 않음 표시
        }

        animationFrameId = requestAnimationFrame(updateDragFrame);
    }

    function endDrag(e) {
        isDragging = false;
        cancelAnimationFrame(animationFrameId);

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', endDrag);

        const validX = placeholder.dataset.validX;
        const validY = placeholder.dataset.validY;

        if (validX !== undefined && validY !== undefined) {
            // 이동 성공
            draggingItem.x = parseInt(validX);
            draggingItem.y = parseInt(validY);
            cleanupDrag();
            renderGrid();
        } else {
            // 이동 실패 (원위치 복귀)
            revertAnimation();
        }
    }

    // 헬퍼: 스타일 설정 단순화
    function setGridPosition(el, x, y, w, h) {
        el.style.gridColumnStart = x + 1;
        el.style.gridColumnEnd = x + 1 + w;
        el.style.gridRowStart = y + 1;
        el.style.gridRowEnd = y + 1 + h;
    }

    function revertAnimation() {
        if (!ghostElement) return;

        const originalEl = document.getElementById(`item-${draggingItem.id}`);
        // 원래 위치 좌표
        const originalRect = originalEl.getBoundingClientRect();

        ghostElement.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
        ghostElement.style.transform = `translate(${originalRect.left}px, ${originalRect.top}px)`;

        ghostElement.addEventListener('transitionend', () => {
            cleanupDrag();
            if(originalEl) originalEl.style.opacity = '1';
        }, { once: true });
    }

    function cleanupDrag() {
        if (ghostElement) ghostElement.remove();
        if (placeholder) placeholder.remove();
        ghostElement = null;
        placeholder = null;
        draggingItem = null;

        document.querySelectorAll('.grid-item').forEach(el => el.style.opacity = '1');
    }
});