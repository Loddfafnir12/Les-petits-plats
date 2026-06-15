// Tout le JavaScript lie aux cartes de recettes.
// "recipes" vient de recipes.js ; "couper" et "creerElement" viennent de utils.js.

// cree la liste des ingredients d'une recette (nom + quantite), sur 2 colonnes
function creerListeIngredients(ingredients) {
    const ul = creerElement('ul', 'card__ingredients');

    ingredients.forEach(item => {
        const li = document.createElement('li');
        li.appendChild(creerElement('span', 'card__ing-name', item.ingredient));

        // on colle la quantite et l'unite si elles existent
        let quantite = '';
        if (item.quantity) {
            quantite = item.quantity + (item.unit ? ' ' + item.unit : '');
        }
        li.appendChild(creerElement('span', 'card__ing-qty', quantite));

        ul.appendChild(li);
    });

    return ul;
}

// cree la carte (un <article>) d'une recette.
// Tout est insere via textContent / des proprietes : aucune balise HTML ne peut etre injectee.
function creerCarte(recette) {
    const article = creerElement('article', 'card');

    // zone de l'image + badge du temps
    const zoneImage = creerElement('div', 'card__image');
    const photo = creerElement('img', 'card__photo');
    photo.src = 'JSON%20recipes/' + recette.image;
    photo.alt = recette.name;
    photo.loading = 'lazy';
    zoneImage.appendChild(photo);
    zoneImage.appendChild(creerElement('span', 'card__time', recette.time + 'min'));
    article.appendChild(zoneImage);

    // corps de la carte
    const corps = creerElement('div', 'card__body');
    corps.appendChild(creerElement('h2', 'card__title', recette.name));
    corps.appendChild(creerElement('p', 'card__label', 'Recette'));
    corps.appendChild(creerElement('p', 'card__description', couper(recette.description, 200)));
    corps.appendChild(creerElement('p', 'card__label', 'Ingrédients'));
    corps.appendChild(creerListeIngredients(recette.ingredients));
    article.appendChild(corps);

    return article;
}

// affiche une liste de recettes dans la grille
function afficherRecettes(liste) {
    const grille = document.getElementById('recettes');
    grille.innerHTML = '';
    liste.forEach(recette => grille.appendChild(creerCarte(recette)));

    // on met a jour le compteur a cote des filtres
    const compteur = document.querySelector('.filters__count');
    compteur.textContent = liste.length + (liste.length > 1 ? ' recettes' : ' recette');
}
