// Point d'entree de l'application. Ce fichier est charge en DERNIER (voir index.html) :
// toutes les fonctions des autres fichiers existent deja, il ne fait que les appeler.

// 1. au chargement, on affiche les 50 recettes
afficherRecettes(recipes);

// 2. on remplit les 3 menus avec les elements de toutes les recettes (sans doublon, tries).
//    Le 3e parametre dit dans quelle liste de etatRecherche ranger les tags choisis.
configurerMenu('list-ingredients', nettoyer(ingredientsDe(recipes)), 'ingredients');
configurerMenu('list-appliances', nettoyer(appareilsDe(recipes)), 'appareils');
configurerMenu('list-ustensils', nettoyer(ustensilesDe(recipes)), 'ustensiles');

// 3. un seul menu ouvert a la fois
activerUnSeulMenuOuvert();

// 4. on branche la barre de recherche principale
activerRecherchePrincipale();
