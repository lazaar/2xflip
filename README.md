# Applicaton mobile Airbus Rotor In

Les plateformes de l'application Rotor In sont ANDROID version 4.1 minimun, IOS version 7 et WINDOWS PHONE 8.1 . La documentation suivante permet d'installer la plateforme de développement et de construire l'application en version release.

## Développement :

### Prérequis
Les éléments suivants doivent être présent sur la machine du développeur.
1. Android SDK et ANDROID_HOME
2. Node.js et npm
3. Ruby >v2.0.0

### Installation

##### Cordova, ionic et gulp :

```sh
$ npm install -g cordova ionic gulp
```

Validation en controllant la version :

```sh
$ cordova -v
```
```sh
$ ionic -v
```
```sh
$ gulp -v
```

##### Saas et compass :

Vérifier que ruby est bien installé 

```sh
$ ruby -v
```
Pour l'installation de Saas et de Compass, suivre la documentation suivante : [Documentation](http://compass-style.org/install/)


##### Cloner le repository git
Se positionner dans le dossier ou vous souhaitez cloner le repository
Accès ssh :

```sh
$  git clone git@gitlab-lyon.dmz.lyon.sqli.com:airbus-rotor-in/rotor-in-mobile.git
```
Accès https :

```sh
$  git clone https://gitlab-lyon.sqli.com/airbus-rotor-in/rotor-in-mobile.git
```

Aller dans le dossier cloner :
```sh
$  cd rotor-in-mobile
```

##### Installer les dépendances node.js et bower.js

Dépendances node.js
```sh
$  npm install && bower install
```

##### Plateformes et plugins
Avec cordova, il est nécessaire d'installer les platforms et les plugins utilisés pour l'application afin de pouvoir déployer sur les devices. 
Ionic offre des fonctionnalités supplémentaires à cordova afin de rendre cela plus aisé avec moins de ligne de commande. Ionic, en version 1.6.4, permet lors d'un ajout de plugin ou d'une platform de sauvegarder l'état de la plateforme et des plugins cordova dans le package.json. Il est donc aussi possible de remettre les plateformes et plugins à partir de ce fichier.  [documentation](https://github.com/driftyco/ionic-cli#ionic-state)

Mettre à jour votre plateforme et vos plugins
```sh
$  ionic state reset
```

##### Configuration de l'environnment

L'application peut être construite pour plusieurs environnements :
* dev : Configuration pour le développement
* prod : Configuration pour la production

IL  est nécessaire de construire l'application pour un environnment.

```sh
$  gulp config --env=prod
```

Par défaut, l'environnement de développement est priviligié.

```sh
$  gulp config
```

##### 

##### Développer dans le navigateur web

Pour lancer le serveur web avec livereload

```sh
$  gulp serve
```

Pour lancer le serveur web avec livereload avec les fichiers optilisés comme lors du build
```sh
$  gulp serve:dist
```

##### Déployer sur les devices

Il faut tout d'abord générer le build du site web dans le dossier www

```sh
$  gulp build
```

Déploiement : 
```sh
$  cordova run android
```

## Release :

TODO : Scripter la procédure de release et la documenter

Suivre la documentation suivante :
[Publier son application](http://ionicframework.com/docs/guide/publishing.html)








