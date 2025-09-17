const tech = [
    {itemname:'패러시우스 위스퍼링 애로우', price:0, imgUrl: ''},
    {itemname:'빛나는 구슬', price:0, imgUrl: ''},
    {itemname:'각성된 힘의 결정', price:0, imgUrl: ''},
    {itemname:'원혼이 깃든 연금술 결정', price:0, imgUrl: ''},
    {itemname:'단단하게 결정화된 광물 조각', price:0, imgUrl: ''},
]

document.addEventListener('buttonsInserted', () => {
    const buttons = document.querySelectorAll('.drop-btn');
    buttons.forEach(btn => {
        const index = parseInt(btn.value);
        const div = document.createElement('div');
        div.className = 'drop-btn-itemname';
        div.textContent = tech[index].itemname;
        btn.appendChild(div);

        btn.addEventListener('click', () => {

            if (!btn.classList.contains('btn-active')) {
                // 기존 active 제거
                buttons.forEach(b => b.classList.remove('btn-active'));
                // 클릭한 버튼에 active 추가
                btn.classList.add('btn-active');
            }

            const firstChild = btn.firstElementChild;
            if (firstChild) {
                navigator.clipboard.writeText(firstChild.textContent)
                    .then(() =>  showToast('🥴 클립보드에 복사되었습니다!'))
                    .catch(err =>  showToast('복사 실패 😢'));
            }
        });

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