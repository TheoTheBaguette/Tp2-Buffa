#TP2 Buffa

##Ce qui est fait

- Au début du jeu les cookies sont générés de façon à ce qu'il y ai pas d'alignement possible
- lorsque drag and drop ou alors lorsqu'on click sur deux cookies , la fonction permettant de regarder les alignements se lance et ajoute des points, plus l'alignement est grand plus on gagne de points
- apres les alignements, on appelle la fonction permettant de faire descendre les cookies.
- La fonction se repete tant qu'il existe des alignement (####Remarque : pour une raison que j'ignore le booléen ne marchait pas correctement, j'ai alors fait une boucle for de 20 itérations pour compenser...), a chaque fois que la fonction est appeller dans la boucle les points obtenus seront doublé , puis triplé,.... sur les alignements obtenus.
  
##En bonus

j'ai ajouter des niveaux au jeu, à chaque niveau il faut un nombre de point recquis pour passer au suivant, il y a en tous 5 niveaux lorsu'on termine le 5ième on a un message pour nous féliciter qui apparait et relance le jeu. Chaque niveau demande de plus en plus de points. tout au long du jeu il y a un timer qui défile si le timer arrive à 0, on a un message qui apparait nous disant qu'on a perdu et le jeu se relance, on gagne du temps supplementaire à chaque niveau passé.
