// Gestion des tags : les badges jaunes qui affichent les filtres choisis sous la barre de recherche.

// Cree un tag (texte + croix) et l'ajoute dans la zone #tags.
// onRetirer = la fonction lancee au clic sur la croix. Elle est fournie par le menu
// qui a cree le tag : c'est ce qui garde le menu et le tag synchronises.
// On renvoie le tag pour que le menu puisse le supprimer plus tard.
function creerTag(valeur, onRetirer) {
    const conteneur = document.getElementById('tags');

    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = valeur; // textContent : pas d'injection HTML

    // la croix est un vrai <button> : utilisable au clavier et lue par les lecteurs d'ecran
    const croix = document.createElement('button');
    croix.type = 'button'; // "button" et pas "submit" : ne declenche aucun formulaire
    croix.className = 'tag__remove';
    croix.setAttribute('aria-label', 'Retirer ' + valeur);
    croix.textContent = '×';
    croix.addEventListener('click', onRetirer);

    tag.appendChild(croix);
    conteneur.appendChild(tag);

    return tag;
}
