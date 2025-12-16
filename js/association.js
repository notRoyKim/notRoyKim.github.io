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

const tl = [{name: "브리흐네 잉어", qty: 10, class: "A"},
    {name: "힐웬 광석 조각", qty: 100, class: "A", idx: "1"},
    {name: "실리엔 결정", qty: 100, class: "A", idx: "2"},
    {name: "발화석", qty: 40, class: "A", idx: "3"},
    {name: "유황", qty: 60, class: "A", idx: "4"},
    {name: "철광석", qty: 60, class: "A", idx: "5"},
    {name: "동광석", qty: 20, class: "A", idx: "6"},
    {name: "은붕어", qty: 40, class: "B", idx: "7"},
    {name: "무른 힐웬 광석 조각", qty: 40, class: "B", idx: "8"},
    {name: "얼룩진 실리엔 결정", qty: 40, class: "B", idx: "9"},
    {name: "물이 든 병", qty: 15, class: "B", idx: "10"},
    {name: "우유", qty: 10, class: "B", idx: "11"},
    {name: "양털", qty: 100, class: "B", idx: "12"},
    {name: "동광석 조각", qty: 35, class: "B", idx: "13"},
    {name: "철광석 조각", qty: 80, class: "B", idx: "14"},
    {name: "감자", qty: 25, class: "C", idx: "15"},
    {name: "옥수수", qty: 25, class: "C", idx: "16"},
    {name: "밀", qty: 30, class: "C", idx: "17"},
    {name: "보리", qty: 30, class: "C", idx: "18"},
    {name: "나무장작", qty: 30, class: "C", idx: "19"},
    {name: "마나 허브", qty: 30, class: "C", idx: "20"},
    {name: "블러디 허브", qty: 30, class: "C", idx: "21"},
    {name: "베이스 허브", qty: 30, class: "C", idx: "22"}];

const pl = [{name: "숏보우", qty: 1, class: "A", idx: "23"},
    {name: "호미", qty: 1, class: "A", idx: "24"},
    {name: "폴라리스 결정", qty: 5, class: "A", idx: "25"},
    {name: "하다르 결정", qty: 5, class: "A", idx: "26"},
    {name: "철괴", qty: 50, class: "A", idx: "27"},
    {name: "동괴", qty: 50, class: "A", idx: "28"},
    {name: "스핀기어", qty: 10, class: "A", idx: "29"},
    {name: "뮤턴트", qty: 10, class: "A", idx: "30"},
    {name: "중급 나무장작", qty: 30, class: "B", idx: "31"},
    {name: "생명력 300 포션", qty: 30, class: "B", idx: "32"},
    {name: "마나 300 포션", qty: 30, class: "B", idx: "33"},
    {name: "고급 나무장작", qty: 20, class: "B", idx: "34"},
    {name: "스패너", qty: 1, class: "B", idx: "35"},
    {name: "스태미나 300 포션", qty: 30, class: "B", idx: "36"},
    {name: "신비한 허브 가루", qty: 20, class: "B", idx: "37"},
    {name: "코레스 힐러 글러브", qty: 1, class: "B", idx: "38"},
    {name: "힐웬", qty: 50, class: "C", idx: "39"},
    {name: "실리엔", qty: 50, class: "C", idx: "40"},
    {name: "일반 옷감", qty: 50, class: "C", idx: "41"},
    {name: "저가형 옷감", qty: 50, class: "C", idx: "42"},
    {name: "일반 실크", qty: 50, class: "C", idx: "43"},
    {name: "저가형 실크", qty: 50, class: "C", idx: "44"},
    {name: "일반 가죽끈", qty: 50, class: "C", idx: "45"},
    {name: "저가형 가죽끈", qty: 50, class: "C", idx: "46"}];

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

function changeResult(v) {
    const exp = document.querySelector('.asc-span-exp');
    const Count = document.querySelector('.asc-span-count');
    const Gold = document.querySelector('.asc-span-gold');

    let sign = Math.sign(v);

    if (v % 50 === 0) {
        exp.textContent = (parseInt(exp.textContent) + v).toString();
    } else {
        exp.textContent = '에러, 아래 메일로 문의해주세요.';
    }
    Count.textContent = (parseInt(Count.textContent) + sign).toString();
}

function dropResult(e) {
    const exp = document.querySelector('.asc-span-exp');
    const Count = document.querySelector('.asc-span-count');
    const Gold = document.querySelector('.asc-span-gold');
    let sign = 1;

    if (e.currentTarget.classList.contains('drag-to')) {
        sign = -1;
    }

    if (draggedCard.dataset.class === 'A') {
        exp.textContent = (parseInt(exp.textContent) + sign * 150).toString();
    } else if (draggedCard.dataset.class === 'B') {
        exp.textContent = (parseInt(exp.textContent) + sign * 100).toString();
    } else if (draggedCard.dataset.class === 'C') {
        exp.textContent = (parseInt(exp.textContent) + sign * 50).toString();
    } else {
        exp.textContent = '에러, 아래 메일로 문의해주세요.';
    }
    Count.textContent = (parseInt(Count.textContent) + sign).toString();
}

function f_initAsc(el) {
    addAscDiv(el);
}