import * as bootstrap from 'bootstrap';

export function getJwtTokenFromLocalStorage() {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData).token : "";
}

export function closeBsOffcanvas() {
    const offcanvas = document.querySelector('[id*="offcanvas"]');
    const backdrop = document.querySelector('.offcanvas-backdrop') as HTMLElement | null;
    if (offcanvas) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
        if (bsOffcanvas) {
            bsOffcanvas.hide();
        }
        if (backdrop && backdrop.parentElement) {
            backdrop.parentElement.removeChild(backdrop);
        }
    }
}