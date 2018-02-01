# airtable-updater

**1/** Récupérer les sources

```
$ git clone git@github.com:pix-fr/airtable-updater.git
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

**5/** Exécuter les scripts

  a) Alimentation de la table "Acquis"

```
$ node index.js create-skills 
```

  b) Mise à jour de la table "Epreuves" avec les acquis venant de la table "Acquis"

```
$ node index.js update-challenges 
```

  c) Import des "Indices" dans la table "Acquis", depuis la base Tutos vers la base Pix 
  
```
$ node index.js import-skill-clues 
```

