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
      document.dispatchEvent(new Event('buttonsInserted'));
  }
  
  const holywater = document.querySelector("#holywater-placeholder");
  if(holywater) {
    await loadHTML("holywater-placeholder", "/holywatersim.html");

    const waterScript = document.createElement("script");
    waterScript.src = "/js/holywatersim.js";
    document.body.appendChild(waterScript);
  }
  const menuBtn = document.getElementById("menuBtn");
  const lnb = document.getElementById("lnb");
  const contents = document.getElementById("contents");

  if(menuBtn) {
    menuBtn.addEventListener("click", () => {
      lnb.classList.toggle("active");
      if(contents) contents.classList.toggle("shrink");
    });
  }
}

document.addEventListener("DOMContentLoaded", initPage);

