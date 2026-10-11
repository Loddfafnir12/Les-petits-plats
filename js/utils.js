// Fonctions utilitaires reutilisees par les autres fichiers (Green Code : ecrites une seule fois).

// Met la 1re lettre en majuscule ("verres" -> "Verres") pour avoir des listes homogenes.
function majuscule(mot) {
    return mot.charAt(0).toUpperCase() + mot.slice(1);
}

// Prepare une liste pour un menu : enleve les doublons puis trie de A a Z.
// On compare en minuscules : "Sucre" et "sucre" ne comptent qu'une seule fois.
function nettoyer(liste) {
    const dejaVus = [];   // mots deja rencontres (en minuscules)
    const resultat = [];  // liste finale sans doublon
    liste.forEach(mot => {
        const cle = mot.toLowerCase();
        if (!dejaVus.includes(cle)) {
            dejaVus.push(cle);
            resultat.push(majuscule(mot));
        }
    });
    // localeCompare trie dans l'ordre alphabetique francais (gere les accents)
    return resultat.sort((a, b) => a.localeCompare(b));
}

// Coupe un texte au-dela de "max" caracteres et ajoute "…" (descriptions des cartes).
function couper(texte, max) {
    if (texte.length <= max) {
        return texte;
    }
    return texte.slice(0, max).trim() + '…';
}

// Cree un element HTML avec une classe et, si besoin, du texte.
// Securite : le texte passe par textContent, donc une balise comme <script> est
// affichee comme du simple texte et jamais executee (pas d'injection HTML).
function creerElement(balise, classe, texte) {
    const element = document.createElement(balise);
    if (classe) {
        element.className = classe;
    }
    if (texte !== undefined) { // le texte est facultatif
        element.textContent = texte;
    }
    return element;
}
