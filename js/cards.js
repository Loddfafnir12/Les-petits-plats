// Tout le JavaScript lie aux cartes de recettes.
// "recipes" vient de recipes.js ; "couper" vient de utils.js.

// transforme la liste d'ingredients d'une recette en HTML (nom + quantite)
function ingredientsEnHtml(ingredients) {
    return ingredients.map(item => {
        // on colle la quantite et l'unite si elles existent
        let quantite = '';
        if (item.quantity) {
            quantite = item.quantity + (item.unit ? ' ' + item.unit : '');
        }
        return `<li>
                    <span class="card__ing-name">${item.ingredient}</span>
                    <span class="card__ing-qty">${quantite}</span>
                </li>`;
    }).join('');
}

// cree la carte (un <article>) d'une recette
function creerCarte(recette) {
    const article = document.createElement('article');
    article.className = 'card';
    article.innerHTML = `
        <div class="card__image">
            <img class="card__photo" src="JSON%20recipes/${recette.image}" alt="${recette.name}" loading="lazy">
            <span class="card__time">${recette.time}min</span>
        </div>
        <div class="card__body">
            <h2 class="card__title">${recette.name}</h2>
            <p class="card__label">Recette</p>
            <p class="card__description">${couper(recette.description, 200)}</p>
            <p class="card__label">Ingrédients</p>
            <ul class="card__ingredients">${ingredientsEnHtml(recette.ingredients)}</ul>
        </div>`;
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
