import Cookie from "./cookie.js";
import { create2DArray } from "./utils.js";

/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */

let scoreAlignement = 0;
//ajout con
const jeuScore = document.getElementById('score');
const timer = document.getElementById('temps');
const NiveauSuivant = document.getElementById('niveau');

///////////////////////////////////MODE DE JEU////////////////////////////////////////
let niveau1=true;
let niveau2=true;
let niveau3=true;
let niveau4=true;
let niveau5=true;
let temps = 100;
let niveau=2;
let interval = setInterval(function() {
  timer.innerHTML = 'Temps : '+temps;
  temps--;
  if (temps < 0) {
    clearInterval(interval);
    alert("Vous avez perdu !");
    location.reload();
  }
  //si le score est de 1000 points, on arrête ressete le timer et on affiche un message de victoire
  if (scoreAlignement >= 10 && niveau1) {
    alert("Niveau 2");
    //on rajoute 100 secondes
    temps = temps + 100;
    //on affiche le niveau suivant
    NiveauSuivant.innerHTML = 'niveau : '+niveau;
    niveau++;
    niveau1=false;
  }
  if (scoreAlignement >= 50 && niveau2) {
            alert("Niveau 3");
            temps = temps + 100;
            //on affiche le niveau suivant
            NiveauSuivant.innerHTML = 'niveau : '+niveau;
            niveau++;
            niveau2=false;
        }
  if (scoreAlignement >= 200 && niveau3) {
            alert("Niveau 4");
            //on affiche le niveau suivant
            temps = temps + 100;
            NiveauSuivant.innerHTML = 'niveau : '+niveau;
            niveau++;
            niveau3=false;
      }
  if (scoreAlignement >= 500 && niveau4) {
            alert("Dernier Niveau 5");
            temps = temps + 100;
      //on affiche le niveau suivant
            NiveauSuivant.innerHTML = 'niveau : '+niveau;
            niveau++;
            niveau4=false;
    }
  if (scoreAlignement >= 1000 && niveau5) {
    clearInterval(interval);
    alert("Vous avez gagné !");
    location.reload();


  }


}, 1000);

///////////////////////////////////////////////////////////////////////////
export default class Grille {
  cookiesSelectionnees = [];


  constructor(l, c) {
    this.colonnes = c;
    this.lignes = l;
    // le tableau des cookies
    this.cookies = create2DArray(l);
    //on remplie le tableau de cookies
    this.remplirTableauDeCookies(6);
    //tant qu'il y a des alignements on remplit le tableau de cookies de nouveau
    while (this.GoAlignement()) {
      this.remplirTableauDeCookies(6);
    }
    //on reset le score
    scoreAlignement = 0;
    //on affiche le score
    jeuScore.innerHTML = 'Score : ' + scoreAlignement;
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */

  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index / this.lignes);
      let colonne = index % this.colonnes;

      let cookie = this.cookies[ligne][colonne];
      let img = cookie.htmlImage;

      // On met un écouteur de click sur l'image
      img.onclick = (event) => {
        let cookieClickee = this.getCookieFromImage(event.target);

        // on regarde combien on a de cookies selectionnées
        if (this.cookiesSelectionnees.length === 0) {
          cookieClickee.selectionnee();
          this.cookiesSelectionnees.push(cookieClickee);
        } else if (this.cookiesSelectionnees.length === 1) {
          cookieClickee.selectionnee();
          console.log("On essaie de swapper !")
          this.cookiesSelectionnees.push(cookieClickee);
          // on essaie de swapper
          Cookie.swapCookies(this.cookiesSelectionnees[0],
              this.cookiesSelectionnees[1]);

          // on remet le tableau des cookies selectionnées à 0
          this.cookiesSelectionnees = [];

        } else {
          console.log("Deux cookies sont déjà sélectionnées...")
        }
        //on appelle la fonction GoAlignement pour verifier si il y a des alignements
        let existeAlignement = this.GoAlignement();
        console.log("Existe Alignement : " + existeAlignement);
      }

      // On met un écouteur de drag'n'drop sur l'image
      img.ondragstart = (event) => {
        let cookieDragguee = this.getCookieFromImage(event.target);
        cookieDragguee.selectionnee();

        // on remet à zero le tableau des cookies selectionnees
        this.cookiesSelectionnees = [];
        this.cookiesSelectionnees.push(cookieDragguee);
      }

      img.ondragover = (event) => {
        return false;
      }

      img.ondragenter = (event) => {
        const i = event.target;
        i.classList.add("imgDragOver");
      }

      img.ondragleave = (event) => {
        const i = event.target;
        i.classList.remove("imgDragOver");
      }

      img.ondrop = (event) => {
        let cookieDragguee = this.getCookieFromImage(event.target);
        cookieDragguee.selectionnee();

        // on ajoute au tableau la deuxième cookie
        this.cookiesSelectionnees.push(cookieDragguee);

        // et on regarde si on peut les swapper
        Cookie.swapCookies(this.cookiesSelectionnees[0], this.cookiesSelectionnees[1]);

        // on remet le tableau des cookies selectionnées à 0
        this.cookiesSelectionnees = [];
        cookieDragguee.htmlImage.classList.remove("imgDragOver");
        //on appelle la fonction GoAlignement pour verifier si il y a des alignements
        let existeAlignement = this.GoAlignement();
        console.log("Existe Alignement : " + existeAlignement);
      }

      div.appendChild(img);
    });

  }

  getCookieFromImage(i) {
    let ligneCookie = i.dataset.ligne;
    let colonneCookie = i.dataset.colonne;
    return this.cookies[ligneCookie][colonneCookie];
  }

  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    for (let l = 0; l < this.lignes; l++) {
      for (let c = 0; c < this.colonnes; c++) {
        //console.log("ligne = " + l + " colonne = " + c);
        const type = Math.round(Math.random() * (nbDeCookiesDifferents - 1))
        this.cookies[l][c] = new Cookie(type, l, c);
      }
    }
  }


  // Test des alignements de 3 cookies ou plus, horizontalement et verticalement

  //on fait des alignements tant que des alignements existent
  GoAlignement() {
    let multi = 1;
    let Align = this.testAlignementDansTouteLaGrille(multi);
    let compt = 1;
    for (let i = 0; i < 20; i++) {
      multi++;
      compt++;
      console.log('ALIGNEMENT : ' + compt);
      Align = this.testAlignementDansTouteLaGrille(multi);
    }
    return Align;
  }

  testAlignementDansTouteLaGrille(multi) {
    let alignementExisteLignes = false;
    let alignementExisteColonnes = false;

    alignementExisteLignes = this.testAlignementToutesLesLignes(multi);
    alignementExisteColonnes = this.testAlignementToutesLesColonnes(multi);
    //si alignement existe dans les lignes ou dans les colonnes on renvoit true;
    return alignementExisteLignes || alignementExisteColonnes;

  }

  testAlignementToutesLesLignes(multi) {
    let alignementLignes = false;

    for (let i = 0; i < this.lignes; i++) {
      alignementLignes = this.testAlignementLigne(i, multi);
    }

    return alignementLignes;
  }

  testAlignementLigne(ligne, multi) {
    let alignement = false;

    // on récupère le tableau qui correspond à la ligne
    let tabLigne = this.cookies[ligne];

    //on parcours les colonnes de la ligne courante
    for (let c = 0; c <= this.lignes - 3; c++) {
      let cookie1 = tabLigne[c];
      let cookie2 = tabLigne[c + 1];
      let cookie3 = tabLigne[c + 2];

      if ((cookie1.type === cookie2.type) && (cookie2.type === cookie3.type)) {
        cookie1.cachee();
        cookie2.cachee();
        cookie3.cachee();
        alignement = true;
        ////point////////////////////////
        //ajout d'un point pour chaque alignement
        console.log('point gagne a la ligne ' + ligne + ' et la colonne ' + c);
        scoreAlignement = scoreAlignement + multi;
        //affichage du score
        jeuScore.innerHTML = 'Score : ' + scoreAlignement;



      }
    }
    return alignement;
  }


  testAlignementToutesLesColonnes(multi) {
    let alignementColonnes = false;
    for (let i = 0; i < this.colonnes; i++) {
      alignementColonnes = this.testAlignementColonne(i, multi);
    }
    return alignementColonnes;
  }


  testAlignementColonne(colonne, multi) {
    let alignement = false;

    // on parcourt les lignes de la colonne courante
    for (let l = 0; l <= this.colonnes - 3; l++) {
      let cookie1 = this.cookies[l][colonne];
      let cookie2 = this.cookies[l + 1][colonne];
      let cookie3 = this.cookies[l + 2][colonne];

      if ((cookie1.type === cookie2.type) && (cookie2.type === cookie3.type)) {
        cookie1.cachee();
        cookie2.cachee();
        cookie3.cachee();
        alignement = true;
        console.log('point gagne a la colonne ' + colonne + ' et la ligne ' + l);
        scoreAlignement = scoreAlignement + multi;
        //affichage du score
        jeuScore.innerHTML = 'Score : ' + scoreAlignement;


      }
    }

    //fonction faire tomber les cookies pour les colonnes

    this.faireTomberCookiesToutesColonnes(colonne);
    return alignement;

  }

  faireTomberCookiesToutesColonnes(colonne) {
    //on parcoure les lignes de la grille
    for (let l = this.lignes - 1; l >= 0; l--) {
      //on recupere le cookie de la ligne et de la colonne courante
      let cookie = this.cookies[l][colonne];
      //on verifie si le cookie est vide
      if (cookie.htmlImage.classList.contains("cookieCachee")) {
        //on le remplace par le cookie du dessus si il n'est pas à la ligne 0
        if (l > 0) {
          //on verifie que le cookie du dessus est vide pour le remplace
          let newl = l;
          let cookieDessus = this.cookies[newl - 1][colonne];
          while (cookieDessus.htmlImage.classList.contains("cookieCachee") && newl - 1 >= 0) {
            cookieDessus = this.cookies[newl - 1][colonne];
            newl--;
          }
          console.log('newl=' + newl);
          //si newl est inferieur a 0 on remplit la case vide par un nouveau cookie
          if (newl <= 0) {
            //on verifie d'abord si le cookie du dessus est vide
            if (cookieDessus.htmlImage.classList.contains("cookieCachee")) {
              //on remplit la case vide par un nouveau cookie
              cookie.type = Math.round(Math.random() * (6 - 1));
              cookie.htmlImage.src = Cookie.urlsImagesNormales[cookie.type];
              console.log('il n y a pas de cookies au dessus de la colonne ');
            }
            //sinon on met le cookie du dessus à la place du cookie vide
            else {
              cookie.htmlImage.src = cookieDessus.htmlImage.src;
              cookie.type = cookieDessus.type;
              //on cache le cookie au dessus
              cookieDessus.htmlImage.classList.add("cookieCachee");
              console.log('le cookies de la colonne ' + colonne + ' à prit le cookie de la colonne' + newl)
            }
          }
          //sinon on remplace l'ancien cookie par le nouveau
          else {
            cookie.htmlImage.src = cookieDessus.htmlImage.src;
            cookie.type = cookieDessus.type;
            //on cache le cookie au dessus
            cookieDessus.htmlImage.classList.add("cookieCachee");
            console.log('le cookies de la ligne ' + l + ' à prit le cookie de la ligne' + newl)
          }
        }
        //sinon on remplit la case vide par un nouveau cookie aleatoire
        else {
          cookie.type = Math.round(Math.random() * (6 - 1));
          cookie.htmlImage.src = Cookie.urlsImagesNormales[cookie.type];
        }

        cookie.htmlImage.classList.remove("cookieCachee");
        // console.log("le cookies est tombé a la ligne " + l + " et la colonne " + colonne);


      }
    }
  }

}








