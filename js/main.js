async function loadHTML(id, file) {
  const res = await fetch(file);
  document.getElementById(id).innerHTML = await res.text();
}

async function initPage() {
  await loadHTML("header-placeholder", "https://notroykim.github.io/header.html");
  await loadHTML("footer-placeholder", "https://notroykim.github.io/footer.html");

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
