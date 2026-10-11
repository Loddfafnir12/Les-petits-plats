// Menus de filtres avances : Ingredients / Appareils / Ustensiles.
// Utilise "nettoyer" (utils.js), "creerTag" (tags.js), "etatRecherche" et "appliquerFiltres" (recherche.js).

// --- Extraction des elements d'une liste de recettes ---
// Ces 3 fonctions recoivent une liste de recettes (toutes, ou seulement celles affichees)
// et renvoient tous les elements trouves, doublons compris (nettoyer() s'occupe du reste).

function ingredientsDe(recettes) {
    const liste = [];
    recettes.forEach(recette => {
        recette.ingredients.forEach(item => liste.push(item.ingredient));
    });
    return liste;
}

function appareilsDe(recettes) {
    return recettes.map(recette => recette.appliance); // un seul appareil par recette
}

function ustensilesDe(recettes) {
    const liste = [];
    recettes.forEach(recette => {
        recette.ustensils.forEach(ustensile => liste.push(ustensile));
    });
    return liste;
}

// --- Mise a jour des menus apres une recherche (regle 5 du cas d'utilisation) ---

// Chaque menu s'enregistre ici quand il est configure, pour qu'on puisse changer sa liste.
const menusConfigures = [];

// Les menus ne proposent plus que les elements presents dans les recettes affichees.
// Appelee par appliquerFiltres() apres chaque recherche.
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

// --- Configuration d'un menu ---
// Une seule fonction pour les 3 menus (Green Code) : on lui donne l'id de la liste,
// les mots a afficher et le type ("ingredients", "appareils" ou "ustensiles").
// Les fonctions declarees a l'interieur gardent acces aux variables du menu (closure) :
// chaque menu a donc SA propre selection, sans se melanger avec les autres.
function configurerMenu(idListe, mots, type) {
    // les elements HTML du menu, retrouves a partir de sa liste <ul>
    const ul = document.getElementById(idListe);
    const dropdown = ul.closest('.dropdown');
    const form = dropdown.querySelector('.dropdown__search');
    const champ = dropdown.querySelector('.dropdown__input');
    const boutonClear = dropdown.querySelector('.dropdown__clear');

    const selection = [];       // les mots choisis, dans l'ordre des clics
    const tagsAffiches = {};    // mot -> son tag jaune, pour pouvoir le supprimer
    let motsDisponibles = mots; // les mots proposes (la liste se reduit apres une recherche)

    // Cree un <li> : soit un mot normal (clic = on l'ajoute),
    // soit un mot choisi (fond jaune, gras, et une croix pour le retirer).
    function creerItem(mot, estChoisi) {
        const li = document.createElement('li');
        li.textContent = mot;

        if (estChoisi) {
            li.classList.add('is-selected');
            const croix = document.createElement('button');
            croix.type = 'button';
            croix.className = 'dropdown__remove';
            croix.setAttribute('aria-label', 'Retirer ' + mot);
            croix.textContent = '×';
            croix.addEventListener('click', () => retirer(mot));
            li.appendChild(croix);
        } else {
            li.addEventListener('click', () => ajouter(mot));
        }
        return li;
    }

    // Redessine la liste : d'abord les mots choisis (en haut), puis les mots
    // disponibles qui contiennent le texte tape dans le champ du menu.
    function afficher() {
        ul.innerHTML = ''; // on vide la liste (chaine vide : aucun risque)
        const recherche = champ.value.toLowerCase();

        selection.forEach(mot => ul.appendChild(creerItem(mot, true)));

        motsDisponibles.forEach(mot => {
            // pas de doublon avec les mots choisis + filtre sur la frappe (ex : "coco")
            if (!selection.includes(mot) && mot.toLowerCase().includes(recherche)) {
                ul.appendChild(creerItem(mot, false));
            }
        });
    }

    // Ajoute un mot : dans la selection du menu, dans l'etat de la recherche, en tag jaune,
    // puis on relance le filtrage des recettes.
    function ajouter(mot) {
        if (!selection.includes(mot)) {
            selection.push(mot);
            etatRecherche[type].push(mot);
            tagsAffiches[mot] = creerTag(mot, () => retirer(mot)); // la croix du tag appelle retirer()
            appliquerFiltres();
        }
        afficher();
    }

    // Retire un mot : l'inverse exact d'ajouter(). Appelee par la croix du menu OU
    // par celle du tag, c'est ce qui garde les deux synchronises.
    function retirer(mot) {
        const i = selection.indexOf(mot);
        if (i !== -1) {
            selection.splice(i, 1);
        }
        const j = etatRecherche[type].indexOf(mot);
        if (j !== -1) {
            etatRecherche[type].splice(j, 1);
        }
        if (tagsAffiches[mot]) {
            tagsAffiches[mot].remove();
            delete tagsAffiches[mot];
        }
        appliquerFiltres();
        afficher();
    }

    // Entree ou loupe : ajoute le 1er mot de la liste qui correspond a la frappe
    // (ex : "coco" + Entree -> "Crème de coco").
    function choisirPremier() {
        const recherche = champ.value.toLowerCase().trim();
        if (recherche === '') {
            return; // champ vide : rien a ajouter
        }
        const premier = motsDisponibles.find(mot =>
            !selection.includes(mot) && mot.toLowerCase().includes(recherche)
        );
        if (premier) {
            ajouter(premier);
        }
    }

    // --- Evenements du menu ---

    // filtre la liste a chaque lettre tapee (etape 6 du cas d'utilisation)
    champ.addEventListener('input', afficher);

    // la croix grise vide le champ et reaffiche toute la liste
    boutonClear.addEventListener('click', () => {
        champ.value = '';
        afficher();
    });

    // Entree ou clic sur la loupe (bouton submit) : preventDefault() empeche
    // le rechargement de la page, puis on ajoute le 1er mot qui correspond.
    form.addEventListener('submit', event => {
        event.preventDefault();
        choisirPremier();
    });

    // on enregistre ce menu : mettreAJourMenus() pourra remplacer sa liste de mots
    menusConfigures.push({
        type: type,
        mettreAJour: function (nouveauxMots) {
            motsDisponibles = nouveauxMots;
            afficher();
        }
    });

    afficher(); // premier affichage de la liste
}

// Un seul menu ouvert a la fois. Les menus sont des <details> : l'evenement "toggle"
// se declenche a chaque ouverture/fermeture ; si un menu s'ouvre, on ferme les autres.
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
