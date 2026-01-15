if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js");
    });
}

async function loadHTML(id, file) {
  const res = await fetch(file);
  document.getElementById(id).innerHTML = await res.text();
}

async function initPage() {
    await loadHTML("header-placeholder", "/header.html");
    await loadHTML("footer-placeholder", "/footer.html");

    const drpHolder = document.querySelector(".drop-placeholder");
    if (drpHolder) {
      f_initDrp(drpHolder);
    }
    const ascHolder = document.querySelector(".asc-placeholder");
    if (ascHolder) {
      f_initAsc(ascHolder);
    }
    const talFarmHolder = document.querySelector(".talFarm-placeholder");
    if (talFarmHolder) {
        f_initTal(talFarmHolder);
    }
    const plnHolder = document.querySelector(".pln-placeholder");
    if (plnHolder) {
        f_initPln(plnHolder);
    }

  const holywater = document.querySelector(".holywater-placeholder");
  if(holywater) {
    await loadHTML("holywater-placeholder", "/holywatersim.html");

    const waterScript = document.createElement("script");
    waterScript.src = "/js/holywatersim.js";
    document.body.appendChild(waterScript);
  }
    const menuBtn = document.querySelector(".menu-container");

    if(menuBtn) {
        const menuBtnSpans = document.querySelectorAll(".menu-container span");
        const lnb = document.getElementById("lnb");
        const lnb_back = document.getElementById("lnb-background");
        const contents = document.getElementById("contents");

        menuBtn.addEventListener("click", () => {
            menuBtnSpans.forEach(span => {
                span.classList.toggle("active");
            });
            lnb.classList.toggle("active");
            lnb_back.classList.toggle("active");
            if(contents) contents.classList.toggle("shrink");
        });
    }

  const h1 = document.querySelector("h1");
  if(h1) {
      const menuName = h1.id;
      document.querySelector("#"+menuName.substring(0,menuName.length- 3)).classList.toggle("active");
  }

    registerPush();
}

document.addEventListener("DOMContentLoaded", initPage);


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