function loadCache() {
    const raw = localStorage.getItem('ascCache');
    return raw ? JSON.parse(raw) : {};
}

function saveCache(cache) {
    localStorage.setItem('ascCache', JSON.stringify(cache));
}


let draggedCard = null;

let activeCard = null;

const t = ['타이론', '폴라', '목표'];

const tl = [{name: "브리흐네 잉어", qty: 10, class: "A", idx: "1", avgPrice: 0, totalPrice: 0},
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
    {name: "베이스 허브", qty: 30, class: "C", idx: "24", avgPrice: 0, totalPrice: 0}];

const pl = [{name: "숏 보우", qty: 1, class: "A", idx: "25", avgPrice: 0, totalPrice: 0},
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
    {name: "저가형 가죽끈", qty: 50, class: "C", idx: "48", avgPrice: 0, totalPrice: 0}];

let cl = [];

document.addEventListener('dragstart', e => {
    if (e.target.textContent === "⋮⋮") return;
    if (!e.target.classList.contains('asc-card')) return;
    draggedCard = e.target;
    draggedCard.classList.add('dragging');
});

document.addEventListener('dragend', e => {
    if (!draggedCard) return;
    draggedCard.classList.remove('dragging');
    draggedCard.removeAttribute('draggable');
    draggedCard = null;
    document.querySelectorAll('.asc-column').forEach(c => c.classList.remove('drag-over'));
});

function addAscDiv(el) {
    const cache = loadCache();

    const btndiv = document.createElement('div');
    btndiv.classList.add('asc-btn-div');
    el.appendChild(btndiv);

    const clrbtn = document.createElement('div');
    clrbtn.classList.add('asc-btn');
    clrbtn.classList.add('asc-btn-delete');
    clrbtn.textContent = '초기화';
    clrbtn.addEventListener('click', onResetClick)
    btndiv.appendChild(clrbtn);

    for (let i = 0; i < 3; i++) {
        const div = document.createElement('div');
        div.className = 'asc-board';
        el.appendChild(div);

        const div2 = document.createElement('div');
        if (i === 0) {
            div2.className = 'asc-column drag-to drag-t';
        } else if (i === 1) {
            div2.className = 'asc-column drag-to drag-p';
        } else {
            div2.className = 'asc-column drag-result';
        }
        div2.setAttribute('data-column', '');

        div2.addEventListener('dragover', e => {
            e.preventDefault();
            div2.classList.add('drag-over');
        });

        div2.addEventListener('dragleave', () => {
            div2.classList.remove('drag-over');
        });

        div2.addEventListener('drop', e => {
            e.preventDefault();
            div2.classList.remove('drag-over');
            if(!draggedCard) return;

            if (div2.classList.contains('drag-to')) {
                if (draggedCard.classList.contains('drag-before')) return;
                if (draggedCard.classList.contains('drag-tCard') && div2.classList.contains('drag-p')) return;
                if (draggedCard.classList.contains('drag-pCard') && div2.classList.contains('drag-t')) return;
                draggedCard.classList.remove('drag-done');
                draggedCard.classList.add('drag-before');

                cl = cl.filter(item => item.name !== draggedCard.dataset.name);
                document.querySelector('.asc-span-gold').textContent = sumTotalPrices(cl).toLocaleString('ko-KR');

                const idx = draggedCard.dataset.idx;
                delete cache[idx];
                saveCache(cache);

                draggedCard.removeEventListener('click', onCardClick);
            } else if (div2.classList.contains('drag-result')) {
                if (draggedCard.classList.contains('drag-done')) return;
                if (document.querySelector('.asc-span-count').textContent === '20') {
                    showToast('🥴 매주 20회까지만 납품할 수 있습니다.')
                    return;
                }
                const idx = draggedCard.dataset.idx;
                cache[idx] = 1;
                saveCache(cache);

                const tempcard = {name: draggedCard.dataset.name,
                    qty: parseInt(draggedCard.dataset.qty),
                    class: draggedCard.dataset.class,
                    idx: draggedCard.dataset.idx,
                    avgPrice: parseInt(draggedCard.dataset.avgPrice),
                    totalPrice: parseInt(draggedCard.dataset.totalPrice)};

                cl = [...cl,tempcard];
                if(tempcard.avgPrice === 0) {
                    document.querySelector('.asc-span-gold').textContent = document.querySelector('.asc-span-gold').textContent + " + @"
                }
                else {
                    document.querySelector('.asc-span-gold').textContent = sumTotalPrices(cl).toLocaleString('ko-KR');
                }

                draggedCard.classList.remove('drag-before');
                draggedCard.classList.add('drag-done');

                draggedCard.addEventListener('click', onCardClick);
            }

            dropResult(e);

            const list = div2.querySelector('.asc-list');
            if (draggedCard) list.appendChild(draggedCard);
        });
        div.appendChild(div2);

        const h3 = document.createElement('h3');
        h3.textContent = t[i];
        div2.appendChild(h3);

        const h3div = document.createElement('div');
        if(i === 0) {
            h3div.className = 'asc-tyron';
        } else if (i === 1) {
            h3div.className = 'asc-polar';
        }
        h3.appendChild(h3div);

        const div3 = document.createElement('div');
        div3.className = 'asc-list';
        div2.appendChild(div3);

        if (i === 2) {
            const divResult = document.createElement('div');
            divResult.className = 'asc-result';
            div2.appendChild(divResult);

            const h3Result = document.createElement('h3');
            h3Result.textContent = '결과';
            divResult.appendChild(h3Result);

            const divExp = document.createElement('div');
            divExp.className = 'asc-exp';
            divExp.textContent = '협회 경험치 : '
            divResult.appendChild(divExp);

            const spanExp = document.createElement('span');
            spanExp.textContent = '0';
            spanExp.classList.add('asc-span-exp');
            divExp.appendChild(spanExp);

            const divCount = document.createElement('div');
            divCount.className = 'asc-count';
            divCount.textContent = '수주한 의뢰 수 : '
            divResult.appendChild(divCount);

            const spanCount = document.createElement('span');
            spanCount.textContent = '0';
            spanCount.classList.add('asc-span-count');
            divCount.appendChild(spanCount);

            const spanMax = document.createElement('span');
            spanMax.textContent = ' / 20';
            divCount.appendChild(spanMax);

            const divGold = document.createElement('div');
            divGold.className = 'asc-gold';
            divGold.textContent = '납품 원가 : '
            divResult.appendChild(divGold);

            const spanGold = document.createElement('span');
            spanGold.textContent = '0';
            spanGold.classList.add('asc-span-gold');
            divGold.appendChild(spanGold);

            const btnGold = document.createElement('div');
            btnGold.classList.add('asc-btn');
            btnGold.classList.add('asc-btn-cal');
            btnGold.textContent = '산정';
            btnGold.addEventListener('click', onCalClick)
            divGold.appendChild(btnGold);

            const divCoin = document.createElement('div');
            divCoin.className = 'asc-coin';
            divCoin.textContent = '협회 코인 : '
            divResult.appendChild(divCoin);

            const spanCoin = document.createElement('span');
            spanCoin.textContent = '0';
            spanCoin.classList.add('asc-span-coin');
            divCoin.appendChild(spanCoin);
        }

        let curList;
        if (i === 0) {
            curList = tl;
        } else if (i === 1) {
            curList = pl;
        } else {
            curList = cl;
        }

        for (let j = 0; j < curList.length; j++) {
            if (i < 2) {
                if (cache[curList[j].idx]) {
                    if(!cl) cl = curList[j];
                    else cl = [...cl,curList[j]];
                    continue;
                }
            } else if (i === 2) {
                if (cache[cl[j]]) continue;

                if (cl[j].class === 'A') {
                    changeResult(150);
                } else if (cl[j].class === 'B') {
                    changeResult(100);
                } else if (cl[j].class === 'C') {
                    changeResult(50);
                }
            }

            const div4 = document.createElement('div');
            if (i === 0) {
                div4.className = 'asc-card drag-before drag-tCard';
            } else if (i === 1) {
                div4.className = 'asc-card drag-before drag-pCard';
            } else if (i === 2) {
                div4.className = 'asc-card drag-done';
                div4.addEventListener('click', onCardClick);
            }
            div4.dataset.name = curList[j].name;
            div4.dataset.qty = curList[j].qty;
            div4.dataset.class = curList[j].class;
            div4.dataset.idx = curList[j].idx;
            div4.dataset.avgPrice = curList[j].avgPrice;
            div4.dataset.totalPrice = curList[j].totalPrice;
            div3.appendChild(div4);

            const span = document.createElement('span');
            span.className = 'asc-handle';
            span.innerText = "⋮⋮";

            span.addEventListener('mousedown', e => {
                const card = span.closest('.asc-card');
                card.setAttribute('draggable', 'true');
            });

            span.addEventListener('mouseup', e => {
                const card = span.closest('.asc-card');
                card.removeAttribute('draggable');
            });
            div4.appendChild(span);

            const div5 = document.createElement('div');
            div5.className = 'asc-content';
            div5.innerHTML = curList[j].name + " " + curList[j].qty + "개";
            div4.appendChild(div5);

            const divClass = document.createElement('div');
            divClass.className = 'asc-class tooltip-wrap asc-class-' + curList[j].class.toLowerCase();
            divClass.dataset.tooltip = curList[j].class + "등급";
            if (curList[j].class === 'A') {
                divClass.innerHTML = '😻';
            } else if (curList[j].class === 'B') {
                divClass.innerHTML = '😼';
            } else if (curList[j].class === 'C') {
                divClass.innerHTML = '😹';
            }
            div4.appendChild(divClass);
        }
    }

}

function onCardClick(e) {
    if (!activeCard) activeCard = e.currentTarget;
    else activeCard.classList.remove('card-active');
    activeCard = e.currentTarget;
    activeCard.classList.add('card-active');

    const item = e.currentTarget.dataset.name;
    if (item) {
        navigator.clipboard.writeText(item)
            .then(() => {
                showToast('🥴 클립보드에 복사되었습니다!');
                activeCard.lastChild.classList.add('animate');
            })
            .catch(() => showToast('복사 실패 😢'));
    }
}

async function onResetClick(e) {
    console.log(e.currentTarget.classList);
    if (!e.currentTarget.classList.contains('active')) {
        e.currentTarget.classList.add('active');
        showToast('👀 한번 더 누르면 초기화 됩니다.');
        return;
    }
    localStorage.removeItem('ascCache');
    showToast('🫠 초기화 되었습니다.');

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    await sleep(1000); // 1초 대기
    location.replace(location.href);
}

async function onCalClick(e) {
    const targetAncestor = e.currentTarget.closest('.asc-result');
    const Gold = document.querySelector('.asc-span-gold');
    const itemNames = cl.map(item => item.name);
    addLoadingDiv(targetAncestor);
    const aucResult = await loadPostAvgPrices(itemNames);
    cl = calculateTotalPrices(cl, aucResult);
    Gold.textContent = sumTotalPrices(cl).toLocaleString('ko-KR');
    updateCardPrices(cl)
    const ldivEl = document.querySelector(".spinner-placeholder");
    deleteLoadingDiv(ldivEl)
}

async function loadPostAvgPrices(itemNames) {
    try {
        const response = await fetch("https://shrill-union-acd2.sinant7616.workers.dev/drop", {
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

function calculateTotalPrices(cl, aucResult) {
    return cl.map(item => {
        const matchedItem = aucResult.find(auc => auc.item_name === item.name);
        const avgPrice = matchedItem ? Number(matchedItem.avg_price) : 0;
        return {
            ...item, // 기존 name, qty, class, idx 유지
            avgPrice: avgPrice, // 참고용 단가
            totalPrice: item.qty * avgPrice // 수량 * 단가
        };
    });
}

function updateCardPrices(cl) {
    const cards = document.querySelectorAll('.asc-card');
    cl.forEach(item => {
        const targetCard = Array.from(cards).find(card => card.dataset.name === item.name);
        if (targetCard) {
            targetCard.dataset.avgPrice = item.avgPrice;
            targetCard.dataset.totalPrice = item.totalPrice;
            // targetCard.querySelector('.price-display').textContent = item.totalPrice;
            console.log(`${item.name} 카드의 데이터가 업데이트되었습니다.`);
        }
    });
}

function sumTotalPrices(arr) {
    // acc(누적값)에 계속해서 현재 요소(curr)의 totalPrice를 더함, 초기값은 0
    return arr.reduce((acc, curr) => acc + curr.totalPrice, 0);
}

function changeResult(v) {
    const exp = document.querySelector('.asc-span-exp');
    const Count = document.querySelector('.asc-span-count');
    //const Gold = document.querySelector('.asc-span-gold');
    const coin = document.querySelector('.asc-span-coin');

    let sign = Math.sign(v);

    if (v % 50 === 0) {
        exp.textContent = (parseInt(exp.textContent) + v).toString();

        if(v === 150) {
            coin.textContent = (parseInt(coin.textContent) + 1300).toString();
        }
        else if(v === 100) {
            coin.textContent = (parseInt(coin.textContent) + 900).toString();
        }
        else if(v === 50) {
            coin.textContent = (parseInt(coin.textContent) + 600).toString();
        }
    } else {
        exp.textContent = '에러, 아래 메일로 문의해주세요.';
    }
    Count.textContent = (parseInt(Count.textContent) + sign).toString();
}

function dropResult(e) {
    const exp = document.querySelector('.asc-span-exp');
    const Count = document.querySelector('.asc-span-count');
    const Gold = document.querySelector('.asc-span-gold');
    const coin = document.querySelector('.asc-span-coin');
    let sign = 1;

    if (e.currentTarget.classList.contains('drag-to')) {
        sign = -1;
    }

    if (draggedCard.dataset.class === 'A') {
        exp.textContent = (parseInt(exp.textContent) + sign * 150).toString();
        coin.textContent = (parseInt(coin.textContent) + sign * 1300).toString();
    } else if (draggedCard.dataset.class === 'B') {
        exp.textContent = (parseInt(exp.textContent) + sign * 100).toString();
        coin.textContent = (parseInt(coin.textContent) + sign * 900).toString();
    } else if (draggedCard.dataset.class === 'C') {
        exp.textContent = (parseInt(exp.textContent) + sign * 50).toString();
        coin.textContent = (parseInt(coin.textContent) + coin * 600).toString();
    } else {
        exp.textContent = '에러, 아래 메일로 문의해주세요.';
    }
    Count.textContent = (parseInt(Count.textContent) + sign).toString();
}

function f_initAsc(el) {
    addAscDiv(el);
}