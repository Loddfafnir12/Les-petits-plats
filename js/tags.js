// Gestion des tags (les badges jaunes sous la barre de recherche).

// Cree un tag avec une croix et l'ajoute dans la zone des tags.
// onRetirer est appele quand on clique sur la croix.
function creerTag(valeur, onRetirer) {
    const conteneur = document.getElementById('tags');

    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = valeur;

    const croix = document.createElement('button');
    croix.type = 'button';
    croix.className = 'tag__remove';
    croix.setAttribute('aria-label', 'Retirer ' + valeur);
    croix.textContent = '×';
    croix.addEventListener('click', onRetirer);

    tag.appendChild(croix);
    conteneur.appendChild(tag);

    return tag; // on le renvoie pour pouvoir le retirer plus tard
}
