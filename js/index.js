// Point d'entree : on appelle ici les fonctions definies dans les autres fichiers.

// remplit les trois menus de filtres avec les donnees des recettes
configurerMenu('list-ingredients', nettoyer(tousLesIngredients()));
configurerMenu('list-appliances', nettoyer(tousLesAppareils()));
configurerMenu('list-ustensils', nettoyer(tousLesUstensiles()));

// un seul menu ouvert a la fois
activerUnSeulMenuOuvert();
