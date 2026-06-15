// Point d'entree : on appelle ici les fonctions definies dans les autres fichiers.

// affiche toutes les recettes au chargement de la page
afficherRecettes(recipes);

// remplit les trois menus de filtres avec les donnees des recettes
configurerMenu('list-ingredients', nettoyer(tousLesIngredients()), 'ingredients');
configurerMenu('list-appliances', nettoyer(tousLesAppareils()), 'appareils');
configurerMenu('list-ustensils', nettoyer(tousLesUstensiles()), 'ustensiles');

// un seul menu ouvert a la fois
activerUnSeulMenuOuvert();

// la barre de recherche principale du header
activerRecherchePrincipale();
