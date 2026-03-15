import { loadAutorData } from '../utils/loadAutorData.js';

export function cautaDupaTitlu(autor, titlu) {
    const data = loadAutorData(autor);
    if (!data) return null;

    const toate = [...data.poezii, ...data.proza];
    const titluLower = titlu.toLowerCase();

    return toate.filter(item => {
        if (!item.titlu) return false; // protecție
        return item.titlu.toLowerCase().includes(titluLower);
    });
}
