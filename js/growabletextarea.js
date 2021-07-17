/**
 * Call this method when updating an input with code so that it resizes
 * @param {HTMLElement} target 
 */
export function SendRecalcSize(target) {
    var event = new CustomEvent('recalc-size', {});
    target.dispatchEvent(event);
};

function resize(target) {
    let scrollheight = target.scrollHeight;
    target.style['min-height'] = "0px";
    target.style['min-height'] = scrollheight + "px";
}

document.querySelectorAll('.growable')
    .forEach(e => {
        e.addEventListener('input', e => resize(e.target));
        e.addEventListener('recalc-size', e => resize(e.target));
    });