// Moteur de recherche : la barre principale + le filtrage croise avec les tags.
// rechercherPrincipal() est la SEULE fonction qui change entre les 2 branches Git
// (fonctionnel / boucles) : c'est elle qu'on a comparee avec Jsben.ch.

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

// Etat de la recherche : le texte tape + les tags choisis, classes par categorie.
// Les menus (filtres.js) le remplissent, appliquerFiltres() le lit.
const etatRecherche = {
    texte: '',
    ingredients: [],
    appareils: [],
    ustensiles: []
};

// Une fonction par categorie : un tag n'est cherche QUE dans sa categorie
// ("Saladier" existe a la fois comme appareil et comme ustensile dans les donnees).
// Comparaison exacte (===) : un tag vient d'une liste, il doit correspondre a un element entier.
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

// Garde les recettes qui ont TOUS les tags choisis (regle 6 : intersection).
// every() = "tous" ; avec some() ("au moins un") on obtiendrait une union.
// every() sur une liste vide renvoie true : sans tag, toutes les recettes passent.
function filtrerParTags(recettes) {
    return recettes.filter(recette =>
        etatRecherche.ingredients.every(tag => aIngredient(recette, tag))
        && etatRecherche.appareils.every(tag => aAppareil(recette, tag))
        && etatRecherche.ustensiles.every(tag => aUstensile(recette, tag))
    );
}

// Le coeur du moteur, appele a chaque frappe et a chaque ajout/retrait de tag :
// 1) recherche principale, 2) tags, 3) cartes, 4) menus, 5) message si aucun resultat.
function appliquerFiltres() {
    cacherMessage(); // on repart d'un etat propre a chaque fois

    let resultats = recipes;

    // regle 2 : la recherche principale ne demarre qu'a partir de 3 caracteres
    if (etatRecherche.texte.length >= 3) {
        resultats = rechercherPrincipal(resultats, etatRecherche.texte);
    }

    // on filtre ensuite par les tags : on garde ce qui respecte la recherche ET les tags
    resultats = filtrerParTags(resultats);

    afficherRecettes(resultats);

    // regle 5 : les menus ne proposent que les elements des recettes affichees
    mettreAJourMenus(resultats);

    if (resultats.length === 0) {
        afficherMessageAucun(etatRecherche.texte);
    }
}

// Affiche le message du scenario A1 en reprenant le texte tape.
// Securite : textContent, donc si on tape une balise HTML elle s'affiche comme du texte.
function afficherMessageAucun(texte) {
    const message = document.getElementById('aucun-resultat');
    message.textContent = 'Aucune recette ne contient « ' + texte + ' », vous pouvez chercher « tarte aux pommes », « poisson », etc.';
    message.hidden = false;
}

// Cache le message (attribut HTML hidden).
function cacherMessage() {
    document.getElementById('aucun-resultat').hidden = true;
}

// Branche la barre de recherche du header.
function activerRecherchePrincipale() {
    const form = document.querySelector('.search');
    const champ = document.querySelector('.search__input');
    const boutonClear = document.querySelector('.search__clear');

    // regle 3 : l'evenement "input" se declenche a chaque caractere tape ou efface.
    // trim() enleve les espaces au debut et a la fin ("  co" ne compte pas pour 3 caracteres).
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

    // Entree : la recherche se fait deja en direct, on empeche juste le rechargement de la page
    form.addEventListener('submit', event => event.preventDefault());
}
