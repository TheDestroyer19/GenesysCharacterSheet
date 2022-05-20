/**
 * Call this method when updating an input with code so that it resizes
 * @param {HTMLElement} target 
 */
export function SendRecalcSize(target) {
    var event = new CustomEvent('recalc-size', {});
    target.dispatchEvent(event);
};

export function attachResize(target) {
    target.addEventListener('input', e => resize(e.target));
    target.addEventListener('recalc-size', e => resize(e.target));
    resize(target);
}

function resize(target) {
    let height = target.style['height'];
    if (!height) {
        height = "0px";
    }
    target.style['min-height'] = height;
    let scrollheight = target.scrollHeight;
    target.style['min-height'] = scrollheight + "px";
}

document.querySelectorAll('.growable')
    .forEach(attachResize);