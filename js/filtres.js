// Tout le JavaScript lie aux menus de filtres (Ingredients / Appareils / Ustensiles).
// "recipes" vient de recipes.js ; "majuscule" et "nettoyer" viennent de utils.js.

// recupere les ingredients d'une liste de recettes
function ingredientsDe(recettes) {
    const liste = [];
    recettes.forEach(recette => {
        recette.ingredients.forEach(item => liste.push(item.ingredient));
    });
    return liste;
}

// recupere les appareils d'une liste de recettes
function appareilsDe(recettes) {
    return recettes.map(recette => recette.appliance);
}

// recupere les ustensiles d'une liste de recettes
function ustensilesDe(recettes) {
    const liste = [];
    recettes.forEach(recette => {
        recette.ustensils.forEach(ustensile => liste.push(ustensile));
    });
    return liste;
}

// Liste des menus configures, pour pouvoir mettre a jour leurs listes apres un filtrage.
const menusConfigures = [];

// Met a jour les 3 menus : ils ne proposent que les elements presents dans les recettes donnees.
function mettreAJourMenus(recettes) {
    menusConfigures.forEach(menu => {
        if (menu.type === 'ingredients') {
            menu.mettreAJour(nettoyer(ingredientsDe(recettes)));
        } else if (menu.type === 'appareils') {
            menu.mettreAJour(nettoyer(appareilsDe(recettes)));
        } else {
            menu.mettreAJour(nettoyer(ustensilesDe(recettes)));
        }
    });
}

// Configure un menu : affiche les mots, gere la selection au clic et le filtrage par texte.
function configurerMenu(idListe, mots, type) {
    const ul = document.getElementById(idListe);
    const dropdown = ul.closest('.dropdown');
    const form = dropdown.querySelector('.dropdown__search');
    const champ = dropdown.querySelector('.dropdown__input');
    const boutonClear = dropdown.querySelector('.dropdown__clear');

    const selection = []; // les mots choisis, dans l'ordre du clic
    const tagsAffiches = {}; // pour retrouver le tag d'un mot et pouvoir l'enlever
    let motsDisponibles = mots; // la liste affichee (se reduit apres un filtrage)

    // cree un <li> pour un mot (selectionne = jaune + gras + une croix pour le retirer)
    function creerItem(mot, estChoisi) {
        const li = document.createElement('li');
        li.textContent = mot;

        if (estChoisi) {
            li.classList.add('is-selected');
            const croix = document.createElement('button');
            croix.type = 'button';
            croix.className = 'dropdown__remove';
            croix.setAttribute('aria-label', 'Retirer ' + mot);
            croix.textContent = '×'; // le signe ×
            croix.addEventListener('click', () => retirer(mot));
            li.appendChild(croix);
        } else {
            li.addEventListener('click', () => ajouter(mot));
        }
        return li;
    }

    // (re)dessine la liste : les items choisis en haut, puis ceux qui correspondent a la recherche
    function afficher() {
        ul.innerHTML = '';
        const recherche = champ.value.toLowerCase();

        selection.forEach(mot => ul.appendChild(creerItem(mot, true)));

        motsDisponibles.forEach(mot => {
            if (!selection.includes(mot) && mot.toLowerCase().includes(recherche)) {
                ul.appendChild(creerItem(mot, false));
            }
        });
    }

    function ajouter(mot) {
        if (!selection.includes(mot)) {
            selection.push(mot);
            etatRecherche[type].push(mot); // on memorise le tag pour le filtrage
            // on cree aussi le tag jaune sous la barre de recherche
            tagsAffiches[mot] = creerTag(mot, () => retirer(mot));
            appliquerFiltres(); // on met a jour les recettes affichees
        }
        afficher();
    }

    function retirer(mot) {
        const i = selection.indexOf(mot);
        if (i !== -1) {
            selection.splice(i, 1);
        }
        // on enleve le mot de l'etat de recherche
        const j = etatRecherche[type].indexOf(mot);
        if (j !== -1) {
            etatRecherche[type].splice(j, 1);
        }
        // on enleve le tag correspondant
        if (tagsAffiches[mot]) {
            tagsAffiches[mot].remove();
            delete tagsAffiches[mot];
        }
        appliquerFiltres();
        afficher();
    }

    // Entree ou clic sur la loupe : on choisit le 1er mot-cle de la liste qui correspond a la frappe
    function choisirPremier() {
        const recherche = champ.value.toLowerCase().trim();
        if (recherche === '') {
            return;
        }
        const premier = motsDisponibles.find(mot =>
            !selection.includes(mot) && mot.toLowerCase().includes(recherche)
        );
        if (premier) {
            ajouter(premier);
        }
    }

    // on filtre la liste a chaque lettre tapee
    champ.addEventListener('input', afficher);

    // la croix grise vide le champ et reaffiche toute la liste
    boutonClear.addEventListener('click', () => {
        champ.value = '';
        afficher();
    });

    // Entree dans le champ ou clic sur la loupe : on ajoute le 1er mot-cle qui correspond
    form.addEventListener('submit', event => {
        event.preventDefault();
        choisirPremier();
    });

    // on enregistre ce menu pour pouvoir mettre a jour sa liste apres un filtrage
    menusConfigures.push({
        type: type,
        mettreAJour: function (nouveauxMots) {
            motsDisponibles = nouveauxMots;
            afficher();
        }
    });

    afficher(); // premier affichage
}

// Un seul menu ouvert a la fois : quand on en ouvre un, on ferme les autres.
function activerUnSeulMenuOuvert() {
    const menus = document.querySelectorAll('.dropdown');
    menus.forEach(menu => {
        menu.addEventListener('toggle', () => {
            if (menu.open) {
                menus.forEach(autre => {
                    if (autre !== menu) {
                        autre.open = false;
                    }
                });
            }
        });
    });
}
