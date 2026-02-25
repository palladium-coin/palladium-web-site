/* Donate page specific JavaScript */

function copy(text, btn) {
    navigator.clipboard.writeText(text);
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
    btn.classList.add('copied');
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 2000);
}
