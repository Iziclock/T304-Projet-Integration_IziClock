# T304 Projet Integration : Reveil Intelligent
T304 - Gestion intégrée des technologies  
Réveil Intelligent  

**Membres du groupe :**

* BRUGGER Alexandre *(Aleex8)*
* HUYBRECHTS Louis *(Nini1551)*
* NOPPE Hugo *(NoppeHugo)*
* NEUT Hugo *(hneut202216)*
* TROONBEECKX Hugo *(hugotnbx)*
* VERBIEST Mateo *(Correba)*
* VERVAEREN Lucien *(Insanytil)*
* ZHENG Weili *(0ropo)*
  
**Mode d'emploi Graphite pour le format des commits :**

Format : ```<type>(<scope>): <description>```

Types de commits :

* **feat:** Introduces a new feature.
* **fix:** Patches a bug.
* **docs:** Documentation-only changes.
* **style:** Changes that do not affect the meaning of the code (white-space, formatting, etc).
* **refactor:** A code change that neither fixes a bug nor adds a feature.
* **perf:** Improves performance.
* **test:** Adds missing tests or corrects existing tests.
* **chore:** Changes to the build process or auxiliary tools and libraries such as documentation generation.

**Mode d'emploi d'utilisation d'Ionic :**

* Installer NodeJS : [NodeJS](https://nodejs.org/fr/)
* Installer Ionic : ```npm install -g @ionic/cli```
* Installer les dépendances du projet : ```npm install```
* Créer un nouveau component : ```ionic generate component components/<componentName>```
* Créer une nouvelle page : ```ionic generate page <pageName>```
* Créer un nouveau service : ```ionic generate service services/<serviceName>```
* Créer un nouveau pipe : ```ionic generate pipe pipes/<pipeName>```
* Démarrer l'application : ```ionic serve```
  
**Application** : http://localhost:8100 
  
**Mode d'emploi d'utilisation go :**

* Il faut créer un fichier .env dans le dossier server avec les clés suivante :

```
POSTGRES_USER=root
POSTGRES_PASSWORD=password
POSTGRES_DB=alarm-clock
POSTGRES_PORT=5432
POSTGRES_HOST=postgres
PROFILE=dev
```

* Installer go : [Go](https://go.dev/)
* Installer les dépendances du projet : ```go mod tidy```
* Installer Swag (générateur automatique de documentation) : ```go install github.com/swaggo/swag/cmd/swag@latest```
* Créer un nouveau fichier de migration : ```migrate create -ext sql -dir db/migrations <fileName>```
* Démarrer l'application : ```go run main.go```
* Raccourci Make :
    * Démarrer le conteneur postgres : ```make postgresinit```
    * Etteindre le conteneur postgres : ```make postgresdown```
    * CLI postgres : ```make postgres```
    * Ajouté les migrations : ```make migrateup```
    * Supprimé les migrations : ```make migratedown```
* Mettre à jour la documentation ```swag init```
  
**API** : http://localhost:8080  
**Documentation de l'API** : http://localhost:8080/swagger/index.html 