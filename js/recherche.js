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
        const texte = champ.value.trim();
        cacherMessage(); // on repart toujours d'un etat sans message

        // la recherche se lance seulement a partir de 3 caracteres
        if (texte.length >= 3) {
            const resultats = rechercherPrincipal(recipes, texte);
            afficherRecettes(resultats);

            // on affiche le message seulement si vraiment rien ne correspond
            if (resultats.length === 0) {
                afficherMessageAucun(texte);
            }
        } else {
            // en dessous de 3 caracteres on remontre toutes les recettes
            afficherRecettes(recipes);
        }
    });

    // la croix vide le champ et remontre toutes les recettes
    boutonClear.addEventListener('click', () => {
        champ.value = '';
        cacherMessage();
        afficherRecettes(recipes);
    });

    // on empeche le rechargement de la page quand on appuie sur Entree
    form.addEventListener('submit', event => event.preventDefault());
}
