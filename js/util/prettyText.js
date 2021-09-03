import { RemoveAllChildNodes } from "../common.js";

const CODE_REGEX = /(\[{2}[^\[\]]*\]{2}|\n)/;

/**
 * Takes escaped symbols and converts them into their custom element form
 * @param {string} sourceText A string containing icons escaped in [[]]
 * @param {HTMLElement} container the container the text will go in
 */
export function ConvertSymbols(sourceText, container) {
    RemoveAllChildNodes(container);

    const segments = sourceText.split(CODE_REGEX);

    segLoop: for (const seg of segments) {
        let tag = "";
        switch (seg) {
            case "[[boost]]": tag = 'die-boost'; break;
            case "[[ability]]": tag = 'die-ability'; break;
            case "[[proficiency]]": tag = 'die-proficiency'; break;
            case "[[setback]]": tag = 'die-setback'; break;
            case "[[difficulty]]": tag = 'die-difficulty'; break;
            case "[[challenge]]": tag = 'die-challenge'; break;
            case "[[advantage]]": tag = 'icon-advantage'; break;
            case "[[success]]": tag = 'icon-success'; break;
            case "[[triumph]]": tag = 'icon-triumph'; break;
            case "[[threat]]": tag = 'icon-threat'; break;
            case "[[failure]]": tag = 'icon-failure'; break;
            case "[[despair]]": tag = 'icon-despair'; break;
            case "\n": tag = "br"; break;
            default: 
                container.appendChild(document.createTextNode(seg));
                continue segLoop;
        }

        container.appendChild(document.createElement(tag));

    }
}