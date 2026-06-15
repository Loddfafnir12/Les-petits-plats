// La variable "recipes" vient du fichier recipes.js, charge juste avant celui-ci.

// met la premiere lettre d'un mot en majuscule
function majuscule(mot) {
    return mot.charAt(0).toUpperCase() + mot.slice(1);
}

// recupere tous les ingredients de toutes les recettes
function tousLesIngredients() {
    const liste = [];
    recipes.forEach(recette => {
        recette.ingredients.forEach(item => liste.push(item.ingredient));
    });
    return liste;
}

// recupere tous les appareils
function tousLesAppareils() {
    return recipes.map(recette => recette.appliance);
}

// recupere tous les ustensiles
function tousLesUstensiles() {
    const liste = [];
    recipes.forEach(recette => {
        recette.ustensils.forEach(ustensile => liste.push(ustensile));
    });
    return liste;
}

// enleve les doublons (sans tenir compte de la casse) puis trie par ordre alphabetique
function nettoyer(liste) {
    const dejaVus = [];
    const resultat = [];
    liste.forEach(mot => {
        const cle = mot.toLowerCase();
        if (!dejaVus.includes(cle)) {
            dejaVus.push(cle);
            resultat.push(majuscule(mot));
        }
    });
    return resultat.sort((a, b) => a.localeCompare(b));
}

// cree un <li> par mot et l'ajoute dans le <ul> donne
function remplirMenu(ul, mots) {
    mots.forEach(mot => {
        const li = document.createElement('li');
        li.textContent = mot;
        ul.appendChild(li);
    });
}

// on remplit les trois menus au chargement de la page
remplirMenu(document.getElementById('list-ingredients'), nettoyer(tousLesIngredients()));
remplirMenu(document.getElementById('list-appliances'), nettoyer(tousLesAppareils()));
remplirMenu(document.getElementById('list-ustensils'), nettoyer(tousLesUstensiles()));
