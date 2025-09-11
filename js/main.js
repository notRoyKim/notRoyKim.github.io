async function loadHTML(id, file) {
  const res = await fetch(file);
  document.getElementById(id).innerHTML = await res.text();
}

async function initPage() {
  await loadHTML("header-placeholder", "/header.html");
  await loadHTML("footer-placeholder", "/footer.html");
  
  const uladh = document.querySelector(".uladh-placeholder");
  if(uladh) await loadHTML("uladh-placeholder", "/uladh.html");
  
  const holywater = document.querySelector(".holywater-placeholder");
  if(holywater) await loadHTML("holywater-placeholder", "/holywater.html");

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
