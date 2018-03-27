# airtable-updater

**1/** Récupérer les sources

```
$ git clone git@github.com:1024pix/airtable-updater.git
```

**2/** Télécharger les dépendances NPM

```
$ npm install
```

**3/** Configurer les variables d'environnement (dans le fichier .env)

Créer le fichier `.env` à la racine du projet, en renseignant les variables d'environnement ci-dessous :

```
# ===== Pix =====
AIRTABLE_API_KEY_PIX=<api_key_for_pix>
AIRTABLE_BASE_PIX=<base_for_pix>

# ===== Tutos =====
AIRTABLE_API_KEY_TUTOS=<api_key_for_tutos>
AIRTABLE_BASE_TUTOS=<base_for_tutos>
```

**4/** Préparer les bases Airtable en conséquence (cf. section plus loin)

**5/** Préciser l'environnement où les scripts sont joués

Il faut préciser en second argument de la commande l'environnement sur lequel les scripts sont joués.

Pour :
* La base Airtable de Production : --prod
* La base Airtable d'intégration : --inte
* La base Airtable Aval : --aval
* La Base Airtable Pix Maths : --math

**6/** Exécuter les scripts

  a) Alimentation de la table "Acquis" en intégration

```
$ node index.js create-skills --inte
```

  b) Mise à jour de la table "Epreuves" avec les acquis venant de la table "Acquis"

```
$ node index.js update-challenges 
```

  c) Import des "Indices" dans la table "Acquis", depuis la base Tutos vers la base Pix 
  
```
$ node index.js import-skill-clues 
```

  d) Import des "Tutoriels" dans le champs "Réponse à" de la table "Acquis"  

```
$ node index.js import-tutorials-in-skills 
```
  e) Import des "Tags" dans le champs "Tags" de la table "Acquis"  

```
$ node index.js import-tags-in-skills 
```

  f) Import des "Tutoriels" dans le champs "En Savoir Plus" de la table "Acquis"  

```
$ node index.js import-additional-tutorials-in-skills 
```

