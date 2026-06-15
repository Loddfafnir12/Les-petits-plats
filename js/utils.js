// Petites fonctions utilitaires, reutilisables un peu partout.

// met la premiere lettre d'un mot en majuscule
function majuscule(mot) {
    return mot.charAt(0).toUpperCase() + mot.slice(1);
}

// enleve les doublons (sans tenir compte de la casse) puis trie par ordre alphabetique
function nettoyer(liste) {
    const dejaVus = [];
    const resultat = [];
    liste.forEach(mot => {
        const cle = mot.toLowerCase();
        if (!dejaVus.includes(cle)) {
            dejaVus.push(cle);
            resultat.push(majuscule(mot));
        }
    });
    return resultat.sort((a, b) => a.localeCompare(b));
}

// coupe un texte trop long et ajoute des points de suspension
function couper(texte, max) {
    if (texte.length <= max) {
        return texte;
    }
    return texte.slice(0, max).trim() + '…';
}
