// Recherche principale : filtre les recettes sur le titre, les ingredients et la description.
// Toute la logique de recherche est dans rechercherPrincipal() : c'est la SEULE fonction
// qui changera entre la branche "boucles" et la branche "fonctionnel".

// Version boucles natives (for).
// Renvoie les recettes qui contiennent le texte cherche.
function rechercherPrincipal(recettes, texte) {
    const recherche = texte.toLowerCase();
    const resultats = [];

    for (let i = 0; i < recettes.length; i++) {
        const recette = recettes[i];
        let trouve = false;

        // dans le titre ou la description
        if (recette.name.toLowerCase().includes(recherche)
            || recette.description.toLowerCase().includes(recherche)) {
            trouve = true;
        }

        // sinon, dans la liste des ingredients
        if (!trouve) {
            for (let j = 0; j < recette.ingredients.length; j++) {
                if (recette.ingredients[j].ingredient.toLowerCase().includes(recherche)) {
                    trouve = true;
                    break;
                }
            }
        }

        if (trouve) {
            resultats.push(recette);
        }
    }

    return resultats;
}

// Etat courant de la recherche : le texte tape + les tags choisis dans chaque menu.
const etatRecherche = {
    texte: '',
    ingredients: [],
    appareils: [],
    ustensiles: []
};

// Renvoie true si la recette contient le mot-cle (dans ses ingredients, son appareil ou ses ustensiles).
function recetteContientTag(recette, tag) {
    const t = tag.toLowerCase();
    return recette.ingredients.some(item => item.ingredient.toLowerCase() === t)
        || recette.appliance.toLowerCase() === t
        || recette.ustensils.some(u => u.toLowerCase() === t);
}

// Rassemble tous les tags choisis dans les trois menus.
function tousLesTagsChoisis() {
    return etatRecherche.ingredients
        .concat(etatRecherche.appareils)
        .concat(etatRecherche.ustensiles);
}

// Garde les recettes qui correspondent aux tags choisis.
function filtrerParTags(recettes) {
    const tags = tousLesTagsChoisis();
    if (tags.length === 0) {
        return recettes;
    }
    return recettes.filter(recette =>
        tags.every(tag => recetteContientTag(recette, tag))
    );
}

// Applique la recherche principale ET les tags, puis rafraichit l'affichage.
function appliquerFiltres() {
    cacherMessage();

    let resultats = recipes;

    // recherche principale : seulement a partir de 3 caracteres
    if (etatRecherche.texte.length >= 3) {
        resultats = rechercherPrincipal(resultats, etatRecherche.texte);
    }

    // filtrage par les tags choisis
    resultats = filtrerParTags(resultats);

    afficherRecettes(resultats);

    // les menus ne proposent que les elements des recettes affichees
    mettreAJourMenus(resultats);

    if (resultats.length === 0) {
        afficherMessageAucun(etatRecherche.texte);
    }
}

// Affiche le message "aucune recette" en reprenant le texte cherche.
function afficherMessageAucun(texte) {
    const message = document.getElementById('aucun-resultat');
    // le texte tape est insere via textContent : aucune balise HTML ne peut etre injectee
    message.textContent = 'Aucune recette ne contient « ' + texte + ' », vous pouvez chercher « tarte aux pommes », « poisson », etc.';
    message.hidden = false;
}

// Cache le message.
function cacherMessage() {
    document.getElementById('aucun-resultat').hidden = true;
}

// Branche la barre de recherche du header.
function activerRecherchePrincipale() {
    const form = document.querySelector('.search');
    const champ = document.querySelector('.search__input');
    const boutonClear = document.querySelector('.search__clear');

    champ.addEventListener('input', () => {
        etatRecherche.texte = champ.value.trim();
        appliquerFiltres();
    });

    // la croix vide le champ et relance le filtrage
    boutonClear.addEventListener('click', () => {
        champ.value = '';
        etatRecherche.texte = '';
        appliquerFiltres();
    });

    // on empeche le rechargement de la page quand on appuie sur Entree
    form.addEventListener('submit', event => event.preventDefault());
}
