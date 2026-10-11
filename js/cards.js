// Affichage des recettes : creation des cartes et mise a jour de la grille.
// Utilise "couper" et "creerElement" (utils.js).

// Cree la liste des ingredients d'une recette : le nom, et en dessous la quantite + l'unite.
function creerListeIngredients(ingredients) {
    const ul = creerElement('ul', 'card__ingredients'); // mise en 2 colonnes par le CSS

    ingredients.forEach(item => {
        const li = document.createElement('li');
        li.appendChild(creerElement('span', 'card__ing-name', item.ingredient));

        // quantite et unite sont facultatives dans les donnees (ex : les glacons n'en ont pas)
        let quantite = '';
        if (item.quantity) {
            quantite = item.quantity + (item.unit ? ' ' + item.unit : '');
        }
        li.appendChild(creerElement('span', 'card__ing-qty', quantite));

        ul.appendChild(li);
    });

    return ul;
}

// Cree la carte (<article>) d'une recette, element par element.
// Securite : jamais d'innerHTML avec les donnees -> aucune injection possible.
function creerCarte(recette) {
    const article = creerElement('article', 'card');

    // image + badge du temps de preparation
    const zoneImage = creerElement('div', 'card__image');
    const photo = creerElement('img', 'card__photo');
    photo.src = 'JSON%20recipes/' + recette.image; // %20 = l'espace du nom de dossier, encode
    photo.alt = recette.name;                       // texte alternatif (accessibilite)
    photo.loading = 'lazy';                         // la photo ne charge que quand on s'en approche
    zoneImage.appendChild(photo);
    zoneImage.appendChild(creerElement('span', 'card__time', recette.time + 'min'));
    article.appendChild(zoneImage);

    // corps : titre, description coupee a 200 caracteres, puis les ingredients
    const corps = creerElement('div', 'card__body');
    corps.appendChild(creerElement('h2', 'card__title', recette.name));
    corps.appendChild(creerElement('p', 'card__label', 'Recette'));
    corps.appendChild(creerElement('p', 'card__description', couper(recette.description, 200)));
    corps.appendChild(creerElement('p', 'card__label', 'Ingrédients'));
    corps.appendChild(creerListeIngredients(recette.ingredients));
    article.appendChild(corps);

    return article;
}

// Affiche une liste de recettes : vide la grille, cree une carte par recette,
// puis met a jour le compteur "X recettes". Appelee a chaque recherche.
function afficherRecettes(liste) {
    const grille = document.getElementById('recettes');
    grille.innerHTML = ''; // on vide la grille (chaine vide : aucun risque)
    liste.forEach(recette => grille.appendChild(creerCarte(recette)));

    const compteur = document.querySelector('.filters__count');
    compteur.textContent = liste.length + (liste.length > 1 ? ' recettes' : ' recette');
}
