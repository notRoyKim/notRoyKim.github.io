const CACHE_TTL = 1000 * 60 * 5;

// 1. 캐시 관리 모듈
const CacheManager = {
    load: () => JSON.parse(localStorage.getItem('auctionCache') || '{}'),
    save: (data) => localStorage.setItem('auctionCache', JSON.stringify(data)),

    getValid: (key) => {
        const cache = CacheManager.load();
        if (cache[key] && Date.now() < cache[key].expires) {
            return cache[key];
        }
        return null;
    },

    setMultiple: (items) => {
        const cache = CacheManager.load();
        const now = Date.now();
        items.forEach(item => {
            cache[item.item_name] = {
                value: item.avg_price,
                flag_al: item.flag_al,
                expires: now + CACHE_TTL
            };
        });
        CacheManager.save(cache);
    }
};

// 2. API 호출 모듈
async function fetchDropCounts() {
    const res = await fetch("/assets/json/drop.json");
    if (!res.ok) throw new Error("Failed to load drop counts");
    return res.json();
}

async function fetchDungeonItems(dName) {
    const res = await fetch(`/assets/json/${dName}.json`);
    if (!res.ok) throw new Error("Failed to load dungeon items");
    const data = await res.json();
    return data.items;
}

async function fetchAvgPrices(itemNames) {
    if (!itemNames || itemNames.length === 0) return [];

    try {
        const response = await fetch("https://shrill-union-acd2.sinant7616.workers.dev/drop", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: itemNames })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to load prices:", error);
        return []; // 에러 시 빈 배열 반환하여 후속 로직(concat 등) 붕괴 방지
    }
}

// 3. UI 생성 모듈
function getGridClass(dName) {
    const tech = ["seven", "abyssal", "illusion", "feth"];
    const uladh = ["alby", "ciar", "rundal"];

    if (tech.includes(dName)) return 'tech-grid';
    if (uladh.includes(dName)) return 'uladh-grid';
    return '';
}

function createItemButton(itemData) {
    const btn = document.createElement("button");
    btn.className = "drop-btn";
    btn.dataset.itemname = itemData.itemname;

    const img = document.createElement('img');
    img.className = 'drop-btn-image';
    img.src = itemData.imgUrl;

    const nameDiv = document.createElement('div');
    nameDiv.className = 'drop-btn-itemname';
    nameDiv.textContent = itemData.itemname;

    btn.append(img, nameDiv);

    // 버튼 클릭 이벤트 (활성화 및 클립보드 복사)
    btn.addEventListener('click', () => {
        const siblings = btn.parentElement.querySelectorAll('.drop-btn');
        siblings.forEach(b => b.classList.remove('btn-active'));
        btn.classList.add('btn-active');

        navigator.clipboard.writeText(itemData.itemname)
            .then(() => showToast('🥴 클립보드에 복사되었습니다!'))
            .catch(() => showToast('복사 실패 😢'));
    });

    return btn;
}

function appendPriceUI(btn, npcPrice, priceData) {
    const priceDiv = document.createElement("div");
    priceDiv.className = "drop-btn-itemprice";
    const numericNpcPrice = Number(npcPrice) || 0;

    if (priceData && priceData.avg_price) {
        const avgPrice = Number(priceData.avg_price);
        // 상점가가 더 이득인 경우
        if (numericNpcPrice * 1.05 >= avgPrice) {
            priceDiv.textContent = `🏠 ${numericNpcPrice} 🪙`;
        } else {
            // 경매장이 이득인 경우
            btn.classList.add(priceData.flag_al === "l" ? 'btn-style2' : 'btn-style1');
            priceDiv.textContent = `${avgPrice} 🪙`;
        }
    } else if (numericNpcPrice > 0) {
        priceDiv.textContent = `🏠 ${numericNpcPrice} 🪙`;
    } else {
        priceDiv.textContent = "가격 정보 없음";
    }

    btn.appendChild(priceDiv);
}

// 4. 메인 실행 컨트롤러
async function initDropBoard(container) {
    const dName = container.dataset.dungeon;
    if (!dName) return;

    const gridClass = getGridClass(dName);
    if (!gridClass) {
        console.error("Unknown dungeon type");
        return;
    }

    // 그리드 생성 및 로딩 UI 추가
    const gridDiv = document.createElement('div');
    gridDiv.className = `button-grid ${gridClass}`;
    gridDiv.id = 'btn-grid1';
    container.appendChild(gridDiv);

    if (typeof addLoadingDiv === 'function') addLoadingDiv(container);

    try {
        // 데이터 병렬 로드 (드랍 정보 + 던전 아이템 리스트)
        const [dropData, items] = await Promise.all([
            fetchDropCounts(),
            fetchDungeonItems(dName)
        ]);

        const totalItemsCount = dropData[dName] || 0;
        const fragment = document.createDocumentFragment();
        const buttonsConfig = [];
        const itemsToFetch = [];
        const finalPrices = [];

        // 1차 렌더링: 버튼 기본 형태 생성 및 캐시 확인
        for (let i = 0; i < totalItemsCount; i++) {
            const itemData = items[i];
            if (!itemData) continue;

            const btn = createItemButton(itemData);
            buttonsConfig.push({ btn, itemData });
            fragment.appendChild(btn);

            const cached = CacheManager.getValid(itemData.itemname);
            if (cached) {
                finalPrices.push({
                    item_name: itemData.itemname,
                    avg_price: cached.value,
                    flag_al: cached.flag_al
                });
            } else {
                itemsToFetch.push(itemData.itemname);
            }
        }

        // 완성된 버튼들을 한 번에 DOM에 삽입 (리플로우 최소화)
        gridDiv.appendChild(fragment);

        // 캐시에 없는 아이템들 API 호출 및 캐시 업데이트
        if (itemsToFetch.length > 0) {
            const fetchedPrices = await fetchAvgPrices(itemsToFetch);
            finalPrices.push(...fetchedPrices);
            CacheManager.setMultiple(fetchedPrices);
        }

        // 2차 렌더링: 확보된 가격 정보를 버튼에 업데이트
        buttonsConfig.forEach(({ btn, itemData }) => {
            const priceData = finalPrices.find(p => p.item_name === itemData.itemname);
            appendPriceUI(btn, itemData.price, priceData);
        });

    } catch (error) {
        console.error("Failed to initialize drop board:", error);
    } finally {
        // 하드코딩된 셀렉터 대신 현재 컨테이너 기준으로 로딩바 제거
        const loadingSpinner = container.querySelector(".spinner-placeholder");
        if (loadingSpinner && typeof hideLoadingDiv === 'function') {
            hideLoadingDiv(loadingSpinner);
        }
    }
}

// 5. 초기화 진입점
function f_initDrp(el) {
    initDropBoard(el);
}