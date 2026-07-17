const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

function activateTab(targetTab) {
    if (!targetTab) return;

    tabs.forEach((tab) => {
        tab.classList.toggle('active', tab === targetTab);
    });

    const targetId = targetTab.dataset.tab;

    tabContents.forEach((content) => {
        const shouldShow = content.id === targetId;
        content.classList.toggle('active', shouldShow);
        content.style.display = shouldShow ? 'flex' : 'none';
    });
}

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        activateTab(tab);
    });
});

const initialActiveTab = document.querySelector('.tab.active') || tabs[0];

if (initialActiveTab) {
    activateTab(initialActiveTab);
}
