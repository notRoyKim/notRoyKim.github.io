const CACHE_NAME = "nRK-git-v1";
const ASSETS = [
    "/",
    "/Association.html",
    "/Coupons.html",
    "/escape.html",
    "/water.html",
    "/dungeons/Abyssal.html",
    "/dungeons/Alby.html",
    "/dungeons/Feth.html",
    "/dungeons/Illusion.html",
    "/dungeons/Seven.html",
//css
    "/css/main.css",
    "/css/drop.css",
    "/css/holywatersim.css",
    "/css/taltaine.css",
    "/css/planner.css",
//js
    "/js/association.js",
    "/js/coupons.js",
    "/js/holywatersim.js",
    "/js/drop.js",
    "/js/holywatersim.js",
];
// sw.js
const OFFLINE_PAGE = "./offline.html";


self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(c => c.add(OFFLINE_PAGE))
            .catch(err => console.error("offline cache 실패", err))
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.headers.get("accept")?.includes("text/html")) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(OFFLINE_PAGE);
            })
        );
    }
});
