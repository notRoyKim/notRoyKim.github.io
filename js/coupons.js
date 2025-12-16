
document.addEventListener('buttonsInserted', async () => {
    const buttons = document.querySelectorAll('.drop-btn');
    const now = Date.now();

    buttons.forEach(btn => {
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