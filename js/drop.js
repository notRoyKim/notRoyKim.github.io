const tech = [
    {itemname:'패러시우스 위스퍼링 애로우', price:0, imgUrl: '/assets/images/1420005.png'},
    {itemname:'빛나는 구슬', price:0, imgUrl: '/assets/images/00002.png'},
    {itemname:'각성된 힘의 결정', price:100000, imgUrl: '/assets/images/64644.png'},
    {itemname:'미지의 파편', price:20000, imgUrl: '/assets/images/64108.png'},
    {itemname:'오묘한 파편', price:20000, imgUrl: '/assets/images/64112.png'},
    {itemname:'빛 바랜 파편', price:10000, imgUrl: '/assets/images/64102.png'},
    {itemname:'원혼이 깃든 연금술 결정', price:0, imgUrl: '/assets/images/64124.png'},
    {itemname:'원혼이 깃든 칼날', price:0, imgUrl: '/assets/images/64125.png'},
    {itemname:'원혼이 깃든 고목 조각', price:0, imgUrl: '/assets/images/64126.png'},
    {itemname:'단단하게 결정화된 광물 조각', price:30000, imgUrl: '/assets/images/64105.png'},
    {itemname:'날카롭게 결정화된 광물 조각', price:30000, imgUrl: '/assets/images/64109.png'},
    {itemname:'기아스 데버스테이션이 깃든 결정', price:10000, imgUrl: '/assets/images/64104.png'},
    {itemname:'기아스 크러스티가 깃든 결정', price:10000, imgUrl: '/assets/images/64103.png'},
    {itemname:'기아스 코어', price:7000, imgUrl: '/assets/images/64113.png'},
]

const CACHE_TTL = 1000 * 60 * 5;

function loadCache() {
    const raw = localStorage.getItem('auctionCache');
    return raw ? JSON.parse(raw) : {};
}

function saveCache(cache) {
    localStorage.setItem('auctionCache', JSON.stringify(cache));
}

function addLoadingDiv(el) {
    const l1 = document.createElement('div');
    const l2 = document.createElement('div');
    const l3 = document.createElement('div');
    l1.className = 'spinner-placeholder';
    l2.className = 'spinner-box';
    l3.className = 'spinner';
    el.appendChild(l1);
    l1.appendChild(l2);
    l2.appendChild(l3);
    for (let i = 0; i < 12; i++) {
        const l4 = document.createElement('div');
        l3.appendChild(l4);
    }
}

function hideLoadingDiv(el) {
    el.classList.add("hidden")
}

document.addEventListener('buttonsInserted', async () => {
    const buttons = document.querySelectorAll('.drop-btn');
    const itemnames = [];
    let results = [];
    let apiRes = [];
    const cache = loadCache();
    const now = Date.now();


    buttons.forEach(btn => {
        const index = parseInt(btn.value);
        const itemname = tech[index].itemname;
        btn.dataset.itemname = itemname;
        btn.dataset.price = tech[index].price;

        if (cache[itemname] && now < cache[itemname].expires) {
            results.push({"item_name" : itemname, "avg_price" : cache[itemname].value, "flag_al" : cache[itemname].flag_al});
        } else {
            itemnames.push(itemname);
        }

        const img = document.createElement('img');
        img.className = 'drop-btn-image';
        img.src = tech[index].imgUrl;
        btn.appendChild(img);

        const div = document.createElement('div');
        div.className = 'drop-btn-itemname';
        div.textContent = itemname;
        btn.appendChild(div);

        btn.addEventListener('click', async () => {

            if (!btn.classList.contains('btn-active')) {
                buttons.forEach(b => b.classList.remove('btn-active'));
                btn.classList.add('btn-active');
            }

            const secondChild = btn.children[1];
            if (secondChild) {
                 navigator.clipboard.writeText(secondChild.textContent)
                    .then(() => showToast('🥴 클립보드에 복사되었습니다!'))
                    .catch(err => showToast('복사 실패 😢'));
            }
        });

    });

    if (itemnames.length > 0 ) {
        apiRes = await loadPostAvgPrices(itemnames);
    }
    results = results.concat(apiRes);

    apiRes.forEach(item => {
        cache[item.item_name] = {
            value: item.avg_price,
            flag_al: item.flag_al,
            expires: now + CACHE_TTL
        };
    });

    saveCache(cache);

    buttons.forEach(btn => {
        const itemData = results.find(r => r.item_name === btn.dataset.itemname);
        if (itemData) {
            const div2 = document.createElement("div");
            div2.className = "drop-btn-itemprice";

            if (itemData.avg_price) {

                if (btn.dataset.price * 1.05 >= itemData.avg_price) {
                    div2.textContent = btn.dataset.price + " 🪙";
                }
                else if (itemData.flag_al === "l") {
                    btn.classList.add('btn-style2');
                    div2.textContent = itemData.avg_price + " 🪙";
                }
                else {
                    btn.classList.add('btn-style1');
                    div2.textContent = itemData.avg_price + " 🪙";
                }
            } else {
                div2.textContent = "가격 정보 없음";
            }
            btn.appendChild(div2);
        }
    });
    const ldivEl = document.querySelector("#tech-placeholder>.spinner-placeholder");
    hideLoadingDiv(ldivEl)
});

function showToast(message, duration = 1500) {
    const existing = document.getElementById('toast-msg');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.textContent = message;

    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '20px',
        fontSize: '14px',
        zIndex: 9999,
        opacity: 0,
        transition: 'opacity 0.3s ease'
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}

async function loadPostAvgPrices(itemNames) {
    try {
        const response = await fetch("https://shrill-union-acd2.sinant7616.workers.dev/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ items: itemNames })  // 배열 그대로 보내기
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        return await response.json(); // 변수 없이 바로 반환
    } catch (error) {
        console.error("Failed to load prices:", error);
    }
}