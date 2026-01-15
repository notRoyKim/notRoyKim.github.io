
const tl = [{name: "블랙베리", ferTime: 2, wasTime: 4},
    {name: "오크라", ferTime: 4, wasTime: 10},
    {name: "재스민", ferTime: 10, wasTime: 16},
    {name: "붉은 배", ferTime: 1, wasTime: 18},
    {name: "고무", ferTime: 1, wasTime: 32},
    {name: "마법 거미줄", ferTime: 1, wasTime: 1},
    {name: "석영", ferTime: 1, wasTime: 1}];

const il = ["씨앗","일반","고급","최고급"];

function addTalDiv(el) {

    for (let i = 0; i < 7; i++) {
        const div = document.createElement('div');
        div.className = 'talFarm-card';
        el.appendChild(div);

        const div2 = document.createElement('div');
        div2.className = 'talFarm-content';
        div.appendChild(div2);

        for (let j = 0; j < 4; j++) {
            const div3 = document.createElement('div');
            div3.className = 'talFarm-items';
            div2.appendChild(div3);

            const div4 = document.createElement('div');
            div4.className = 'talFarm-icon';
            div3.appendChild(div4);

            const div5 = document.createElement('div');
            div5.className = 'talFarm-text';
            const span = document.createElement('span');
            if(j === 0) {
                div5.textContent = tl[i].name + " " + il[j];
                span.className = 'material-symbols-outlined';
                span.textContent = 'fertile'
            } else if (j < 4) {
                div5.textContent = il[j] + " " + tl[i].name;
            }
            div4.appendChild(span);
            div3.appendChild(div5);

            const div6 = document.createElement('div');
            div6.className = 'talFarm-price';
            div6.textContent = "placeholder";
            div3.appendChild(div6);
        }
    }

}

function f_initTal(el) {
    addTalDiv(el);
}