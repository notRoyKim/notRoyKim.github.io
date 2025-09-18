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

document.addEventListener('buttonsInserted', async () => {
    const buttons = document.querySelectorAll('.drop-btn');
    const itemnames = [];

    buttons.forEach(btn => {
        const index = parseInt(btn.value);
        btn.dataset.itemname = tech[index].itemname;
        btn.dataset.price = tech[index].price;

        const img = document.createElement('img');
        img.className = 'drop-btn-image';
        img.src = tech[index].imgUrl;
        btn.appendChild(img);

        const div = document.createElement('div');
        div.className = 'drop-btn-itemname';
        div.textContent = tech[index].itemname;
        btn.appendChild(div);

        itemnames.push(tech[index].itemname);

        //void loadGetAvgPrice(tech[index].itemname, btn);


        btn.addEventListener('click', () => {

            if (!btn.classList.contains('btn-active')) {
                // 기존 active 제거
                buttons.forEach(b => b.classList.remove('btn-active'));
                // 클릭한 버튼에 active 추가
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


    const results = await loadPostAvgPrices(itemnames);

    buttons.forEach(btn => {
        const itemData = results.find(r => r.item_name === btn.dataset.itemname);
        if (itemData) {
            const div2 = document.createElement("div");
            div2.className = "drop-btn-itemprice";

            if (itemData.avg_price) {
                if (btn.dataset.price * 1.05 >= itemData.avg_price) {
                    div2.textContent = btn.dataset.price + " 🪙";
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
});

function showToast(message, duration = 1500) {
    // 기존 toast 있으면 제거
    const existing = document.getElementById('toast-msg');
    if (existing) existing.remove();

    // toast div 생성
    const toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.textContent = message;

    // 스타일
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

    // 잠깐 fade-in
    requestAnimationFrame(() => {
        toast.style.opacity = 1;
    });

    // 일정 시간 후 제거
    setTimeout(() => {
        toast.style.opacity = 0;
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

async function loadGetAvgPrice(itemName, btn) {
    try {
        const res = await fetch(
            `https://shrill-union-acd2.sinant7616.workers.dev/?item_name=${encodeURIComponent(itemName)}`
        );
        if (!res.ok) throw new Error("API 호출 실패");

        const data = await res.json();
        console.log("API 응답:", data);

        const div2 = document.createElement("div");
        div2.className = "drop-btn-itemname";

        // 데이터 구조에 따라 수정
        if (Array.isArray(data) && data.length > 0 && data[0].avg_price) {
            div2.textContent = "⚖️ : " + data[0].avg_price;
        } else if (data.avg_price) {
            div2.textContent = "⚖️ : " + data.avg_price;
        } else {
            div2.textContent = "가격 정보 없음";
        }

        btn.appendChild(div2);

    } catch (err) {
        console.error(err);
    }
}