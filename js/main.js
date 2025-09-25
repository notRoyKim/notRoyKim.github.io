async function loadHTML(id, file) {
  const res = await fetch(file);
  document.getElementById(id).innerHTML = await res.text();
}

async function initPage() {
  await loadHTML("header-placeholder", "/header.html");
  await loadHTML("footer-placeholder", "/footer.html");
  
  const uladh = document.querySelector("#uladh-placeholder");
  if(uladh) await loadHTML("uladh-placeholder", "/uladh.html");

  const tech = document.querySelector("#tech-placeholder");
  if(tech) {
      await loadHTML("tech-placeholder", "/tech.html");
      await addLoadingDiv(tech)
      document.dispatchEvent(new Event('buttonsInserted'));
  }
  
  const holywater = document.querySelector("#holywater-placeholder");
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
}

document.addEventListener("DOMContentLoaded", initPage);

