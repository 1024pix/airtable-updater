# airtable-updater

**1.** Créer et configurer les tables et colonnes dans Airtable

**2.** Alimenter la table "Acquis" depuis les acquis attachés aux épreuves (table "Epreuves")

```
$ AIRTABLE_API_KEY=<xxx> AIRTABLE_BASE=<yyy> node scripts/create_skills.js [--dry-run] 
```

**3.** Mettre à jour toutes les épreuves pour les linker vers les acquis référencés fraîchement créées 

```
$ AIRTABLE_API_KEY=<xxx> AIRTABLE_BASE=<yyy> node scripts/update_challenges.js [--dry-run] 
```


