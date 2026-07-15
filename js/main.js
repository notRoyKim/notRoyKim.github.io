if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js");
    });
}

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // 설치 배너 차단
});

async function loadHTML(id, file) {
    const res = await fetch(file);
    document.getElementById(id).innerHTML = await res.text();
}

async function initPage() {
    // 1. 헤더/푸터 등 공통 HTML 로드 (이때 LNB 요소들도 DOM에 삽입됨)
    await loadHTML("header-placeholder", "/header.html");
    await loadHTML("footer-placeholder", "/footer.html");

    // 2. 각종 플레이스홀더 초기화
    const drpHolder = document.querySelector(".drop-placeholder");
    if (drpHolder) f_initDrp(drpHolder);

    const ascHolder = document.querySelector(".asc-placeholder");
    if (ascHolder) f_initAsc(ascHolder);

    const talFarmHolder = document.querySelector(".talFarm-placeholder");
    if (talFarmHolder) f_initTal(talFarmHolder);

    const plnHolder = document.querySelector(".pln-placeholder");
    if (plnHolder) f_initPln(plnHolder);

    const holywater = document.querySelector(".holywater-placeholder");
    if(holywater) {
        await loadHTML("holywater-placeholder", "/holywatersim.html");
        const waterScript = document.createElement("script");
        waterScript.src = "/js/holywatersim.js";
        document.body.appendChild(waterScript);
    }

    // ==========================================
    // 3. LNB (네비게이션 바) 동작 로직
    // ==========================================

    // (1) 햄버거 버튼 클릭 시 LNB 사이드바 열기/닫기
    const menuBtn = document.querySelector(".menu-container");
    if(menuBtn) {
        const menuBtnSpans = document.querySelectorAll(".menu-container span");
        const lnb = document.getElementById("lnb");
        const lnb_back = document.getElementById("lnb-background");
        const contents = document.getElementById("contents");

        menuBtn.addEventListener("click", () => {
            menuBtnSpans.forEach(span => span.classList.toggle("active"));
            if(lnb) lnb.classList.toggle("active");
            if(lnb_back) lnb_back.classList.toggle("active");
            if(contents) contents.classList.toggle("shrink");
        });
    }

    // (2) 3-Depth 아코디언 메뉴 열기/닫기 로직 (클래스명 충돌 방지 적용)
    const lnbMenuTitles = document.querySelectorAll('.lnb-has-children > .lnb-menu-title');
    lnbMenuTitles.forEach(title => {
        title.addEventListener('click', function(e) {
            // 클릭된 타이틀의 부모 li(.lnb-has-children) 요소에 lnb-open 클래스 토글
            const parentLi = this.parentElement;
            parentLi.classList.toggle('lnb-open');
        });
    });

    // (3) 현재 페이지 메뉴 활성화 및 부모 메뉴 자동 펼침
    const h1 = document.querySelector("h1");
    if(h1) {
        const menuName = h1.id;
        const activeMenuId = "#" + menuName.substring(0, menuName.length - 3);
        const activeMenuElement = document.querySelector(activeMenuId);

        if (activeMenuElement) {
            activeMenuElement.classList.add("active"); // 기존 로직 유지 (a태그 활성화)

            // 활성화된 메뉴의 부모 중에 .lnb-has-children이 있다면 자동으로 펼쳐주기 (lnb-open 추가)
            let parentElement = activeMenuElement.closest('.lnb-has-children');
            while (parentElement) {
                parentElement.classList.add('lnb-open');
                // 더 상위의 대분류가 있다면 계속 찾아서 열어줌 (3-Depth 대응)
                parentElement = parentElement.parentElement.closest('.lnb-has-children');
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", initPage);


// ==========================================
// 공통 유틸리티 함수들
// ==========================================
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
    if(el) el.classList.add("hidden");
}

function deleteLoadingDiv(el) {
    if(el){
        el.remove();
    }
}