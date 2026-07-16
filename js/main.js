// ==========================================
// 1. 초기화 및 설정 (Init & Config)
// ==========================================
function initServiceWorker() {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("/sw.js").catch(console.error);
        });
    }
    window.addEventListener("beforeinstallprompt", (e) => e.preventDefault()); // 설치 배너 차단
}

async function loadHTML(id, file) {
    try {
        const el = document.getElementById(id);
        if (!el) return;

        const res = await fetch(file);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        el.innerHTML = await res.text();
    } catch (error) {
        console.error(`[LoadHTML Error] Failed to load ${file}:`, error);
    }
}

// ==========================================
// 2. 모듈 및 컴포넌트 로더
// ==========================================
async function loadPartials() {
    // 헤더와 푸터를 병렬로 동시에 가져와서 렌더링 속도 최적화
    await Promise.all([
        loadHTML("header-placeholder", "/header.html"),
        loadHTML("footer-placeholder", "/footer.html")
    ]);
}

async function initComponents() {
    // 플레이스홀더와 초기화 함수 매핑
    const componentMap = [
        { selector: ".drop-placeholder", initFn: typeof f_initDrp !== 'undefined' ? f_initDrp : null },
        { selector: ".asc-placeholder", initFn: typeof f_initAsc !== 'undefined' ? f_initAsc : null },
        { selector: ".talFarm-placeholder", initFn: typeof f_initTal !== 'undefined' ? f_initTal : null },
        { selector: ".pln-placeholder", initFn: typeof f_initPln !== 'undefined' ? f_initPln : null }
    ];

    componentMap.forEach(({ selector, initFn }) => {
        const el = document.querySelector(selector);
        if (el && initFn) initFn(el);
    });

    // Holywater 특별 처리 (동적 스크립트 추가)
    const holywaterHolder = document.querySelector(".holywater-placeholder");
    if (holywaterHolder) {
        await loadHTML("holywater-placeholder", "/holywatersim.html");
        const waterScript = document.createElement("script");
        waterScript.src = "/js/holywatersim.js";
        document.body.appendChild(waterScript);
    }
}

// ==========================================
// 3. 네비게이션 (LNB) 로직
// ==========================================
function initNavigation() {
    // (1) 햄버거 버튼 클릭 시 LNB 사이드바 토글
    const menuBtn = document.querySelector(".menu-container");
    if (menuBtn) {
        const menuBtnSpans = menuBtn.querySelectorAll("span");
        const lnb = document.getElementById("lnb");
        const lnbBack = document.getElementById("lnb-background");
        const contents = document.getElementById("contents");

        menuBtn.addEventListener("click", () => {
            menuBtnSpans.forEach(span => span.classList.toggle("active"));
            lnb?.classList.toggle("active");
            lnbBack?.classList.toggle("active");
            contents?.classList.toggle("shrink");
        });
    }

    // (2) 3-Depth 아코디언 메뉴 토글
    document.querySelectorAll('.lnb-has-children > .lnb-menu-title').forEach(title => {
        title.addEventListener('click', function () {
            this.parentElement.classList.toggle('lnb-open');
        });
    });

    // (3) 현재 페이지 메뉴 활성화 및 부모 메뉴 자동 펼침
    const h1 = document.querySelector("h1");
    if (h1 && h1.id) {
        // 기존 로직 유지: id 끝에서 3글자 자르기
        // (참고: 만약 h1 id가 "xxxMenu"이고 이를 자르려는 의도였다면 -4 로 수정하셔야 합니다)
        const targetMenuId = `#${h1.id.slice(0, -3)}`;
        const activeMenuElement = document.querySelector(targetMenuId);

        if (activeMenuElement) {
            activeMenuElement.classList.add("active");

            // 부모 요소를 거슬러 올라가며 아코디언 열기
            let parentElement = activeMenuElement.closest('.lnb-has-children');
            while (parentElement) {
                parentElement.classList.add('lnb-open');
                parentElement = parentElement.parentElement.closest('.lnb-has-children');
            }
        }
    }
}

// ==========================================
// 4. 메인 실행 컨트롤러
// ==========================================
async function initPage() {
    initServiceWorker();      // 1. 서비스워커 등록
    await loadPartials();     // 2. 공통 HTML (헤더, 푸터) 로드 완료 대기
    initNavigation();         // 3. 헤더가 로드된 후 LNB 이벤트 연결
    await initComponents();   // 4. 각 페이지별 컴포넌트 스크립트 실행
}

document.addEventListener("DOMContentLoaded", initPage);


// ==========================================
// 5. 공통 유틸리티 함수 모음
// ==========================================
function showToast(message, duration = 1500) {
    document.getElementById('toast-msg')?.remove();

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

    // 다음 프레임에 opacity를 변경하여 트랜지션 발동
    requestAnimationFrame(() => {
        toast.style.opacity = "1";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}

function addLoadingDiv(el) {
    if (!el) return;
    const placeholder = document.createElement('div');
    placeholder.className = 'spinner-placeholder';

    placeholder.innerHTML = `
        <div class="spinner-box">
            <div class="spinner">
                ${'<div></div>'.repeat(12)}
            </div>
        </div>
    `;
    el.appendChild(placeholder);
}

function hideLoadingDiv(el) {
    el?.classList.add("hidden");
}

function deleteLoadingDiv(el) {
    el?.remove();
}