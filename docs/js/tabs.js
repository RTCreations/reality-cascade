const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelector(".tab.active")?.classList.remove("active");
        tab.classList.add("active");
        document.querySelector(".tab-content.active")?.classList.remove("active");
        const page = document.getElementById(tab.dataset.tab);
        page.classList.add("active");
    });
});
