// Recherche principale : filtre les recettes sur le titre, les ingredients et la description.
// Toute la logique de recherche est dans rechercherPrincipal() : c'est la SEULE fonction
// qui changera entre la branche "boucles" et la branche "fonctionnel".

// Version programmation fonctionnelle (filter / some / includes).
// Renvoie les recettes qui contiennent le texte cherche.
function rechercherPrincipal(recettes, texte) {
    const recherche = texte.toLowerCase();

    return recettes.filter(recette => {
        const dansTitre = recette.name.toLowerCase().includes(recherche);
        const dansDescription = recette.description.toLowerCase().includes(recherche);
        const dansIngredients = recette.ingredients.some(item =>
            item.ingredient.toLowerCase().includes(recherche)
        );
        return dansTitre || dansDescription || dansIngredients;
    });
}

// Etat courant de la recherche : le texte tape + les tags choisis dans chaque menu.
const etatRecherche = {
    texte: '',
    ingredients: [],
    appareils: [],
    ustensiles: []
};

// Une petite fonction par categorie : un tag n'est cherche QUE dans sa categorie.
// (avant, "Saladier" choisi dans Appareils remontait aussi les recettes ou c'est un ustensile)
function aIngredient(recette, tag) {
    const t = tag.toLowerCase();
    return recette.ingredients.some(item => item.ingredient.toLowerCase() === t);
}

function aAppareil(recette, tag) {
    return recette.appliance.toLowerCase() === tag.toLowerCase();
}

function aUstensile(recette, tag) {
    const t = tag.toLowerCase();
    return recette.ustensils.some(u => u.toLowerCase() === t);
}

// Garde les recettes qui ont TOUS les tags choisis (intersection).
// every() sur une liste vide renvoie true : sans tag, toutes les recettes passent.
function filtrerParTags(recettes) {
    return recettes.filter(recette =>
        etatRecherche.ingredients.every(tag => aIngredient(recette, tag))
        && etatRecherche.appareils.every(tag => aAppareil(recette, tag))
        && etatRecherche.ustensiles.every(tag => aUstensile(recette, tag))
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
