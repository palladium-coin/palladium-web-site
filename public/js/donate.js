/* Donate page specific JavaScript */

async function copy(text, btn) {
    const orig = btn.innerHTML;
    let ok = true;
    try {
        await navigator.clipboard.writeText(text);
    } catch (e) {
        ok = false; // insecure context or permission denied
    }
    btn.setAttribute('aria-live', 'polite');
    btn.innerHTML = ok
        ? '<i class="fas fa-check"></i><span>Copied!</span>'
        : '<i class="fas fa-exclamation"></i><span>Press Ctrl+C</span>';
    btn.classList.toggle('copied', ok);
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 2000);
}
