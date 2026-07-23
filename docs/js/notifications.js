let toastContainer = null;

const MAX_VISIBLE_TOASTS = 3;

function getContainer() {
    if (!toastContainer) {
        toastContainer = document.getElementById("toast-container");
    }
    return toastContainer;
}

function dismiss(toast) {
    if (toast.dataset.dismissed) return;
    toast.dataset.dismissed = "true";

    toast.classList.remove("visible");
    toast.classList.add("leaving");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
}

/**
 * Show a smoothly animated popup notification.
 * @param {Object} options
 * @param {string} options.title - Bold header text (e.g. "Fun Fact", "Achievement Unlocked!")
 * @param {string} options.message - Body text
 * @param {"fact"|"achievement"|"milestone"|"trivia"} [options.variant] - Controls accent color
 * @param {number} [options.duration] - Milliseconds before auto-dismiss
 */
export function showToast({ title, message, variant = "fact", duration = 6000 }) {
    const container = getContainer();
    if (!container) return;

    // Keep the stack from growing unbounded if several things fire close together -
    // drop the oldest (first in DOM order) once we're at the cap.
    const active = Array.from(container.children).filter((el) => !el.dataset.dismissed);
    if (active.length >= MAX_VISIBLE_TOASTS) {
        dismiss(active[0]);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${variant}`;
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    // Double rAF so the browser registers the starting state before we transition,
    // otherwise the transition can get skipped and the toast just snaps into view.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add("visible");
        });
    });

    const timer = setTimeout(() => dismiss(toast), duration);

    toast.addEventListener("click", () => {
        clearTimeout(timer);
        dismiss(toast);
    });
}
