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
    const container = document.querySelector('.drop-placeholder');
    const dName = container.dataset.dungeon;
    const itemnames = [];
    let results = [];
    let apiRes = [];
    const cache = loadCache();
    const now = Date.now();

    const items = await loadItems(dName);

    buttons.forEach(btn => {
        const index = parseInt(btn.value) - 1;
        const itemname = items[index].itemname;
        btn.dataset.itemname = itemname;
        btn.dataset.price = items[index].price;

        if (cache[itemname] && now < cache[itemname].expires) {
            results.push({"item_name" : itemname, "avg_price" : cache[itemname].value, "flag_al" : cache[itemname].flag_al});
        } else {
            itemnames.push(itemname);
        }

        const img = document.createElement('img');
        img.className = 'drop-btn-image';
        img.src = items[index].imgUrl;
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
                    div2.textContent = "🏠 " + btn.dataset.price + " 🪙";
                } else if (itemData.flag_al === "l") {
                    btn.classList.add('btn-style2');
                    div2.textContent = itemData.avg_price + " 🪙";
                } else {
                    btn.classList.add('btn-style1');
                    div2.textContent = itemData.avg_price + " 🪙";
                }
            } else if (btn.dataset.price > 0) {
                div2.textContent = "🏠 " + btn.dataset.price + " 🪙";
            }
            else {
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

async function loadItems(dName) {
    const response = await fetch("/assets/json/" + dName + ".json");
    const data = await response.json();
    return data.items;
}

function addDropDiv(el) {
    const div = document.createElement('div');
    div.className = 'button-grid';
    div.id = 'btn-grid1'

    const dName = el.dataset.dungeon;
    if(dName) {
        if(["seven", "abyssal", "illusion", "feth"].includes(dName)) {
            div.classList.add('tech-grid');
            el.appendChild(div);
        } else if(["alby", "ciar", "rundal"].includes(dName)) {
            div.classList.add('uladh-grid');
            el.appendChild(div);
        }  else {
            console.log("error");
            return;
        }

        fetch("/assets/json/drop.json")
            .then(response => response.json()) // JSON 파싱
            .then(data => {
                const len = data[dName]; // 14
                for (let i = 1; i <= len; i++) {
                    const t_btn = document.createElement("button");
                    t_btn.classList.add("drop-btn");
                    t_btn.value = i.toString();
                    div.appendChild(t_btn);
                }
                addLoadingDiv(el)
                document.dispatchEvent(new Event('buttonsInserted'));
            })
            .catch(error => console.error("JSON 불러오기 오류:", error));
    }
}
function f_initDrp(el) {
    addDropDiv(el);
}