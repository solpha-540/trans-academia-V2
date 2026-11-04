# Trans-Academia — Back-office frontend

Application React + Vite + TypeScript, exclusivement côté client. Aucun backend, aucune base de données, aucun véritable service OTP ou de paiement. Le logo officiel est public/assets/images/brand-logos/1.png. Le thème principal est bleu et blanc, avec une navigation bleu nuit issue du template et un mode sombre.

## Démarrage

- npm install
- npm run dev
- npm run build : vérification TypeScript et bundle de production dans dist.
- npm run preview : servir localement le bundle compilé.
- npm test : tests de validation, permissions et scénarios HTTP MSW.
- npm run test:e2e : tests Playwright, après npm run build. Les projets utilisent Chrome local ; adaptez le canal dans playwright.config.ts si nécessaire.

MSW utilise un service worker. Ouvrir l’application via localhost ou HTTPS, jamais en ouvrant index.html directement. Pour un hébergement statique, configurer le fallback des routes React Router vers index.html et conserver public/mockServiceWorker.js dans le build. La portée du worker suit BASE_URL.

## Comptes de démonstration

Mot de passe commun : Demo@2026. Code OTP fictif : 123456. Aucun e-mail ni SMS envoyé.

| Profil | E-mail | Accès |
| --- | --- | --- |
| Administrateur | admin@trans-academia.demo | Ensemble de l’interface |
| Finance | finance@trans-academia.demo | Consultation, opérations et finance |
| Opérateur | agent@trans-academia.demo | Gestion des bénéficiaires et opérations |
| Support | support@trans-academia.demo | Gestion opérationnelle et incidents |
| Observateur | lecture@trans-academia.demo | Consultation, sans modification ni finance |

La session fictive expire après une heure. Le challenge OTP expire après cinq minutes ; cinq tentatives maximum, renvoi après trente secondes. Les profils de connexion sont des fixtures ; le référentiel de rôles prépare l’administration future et ne crée pas de comptes d’authentification réels.

## Interfaces disponibles

- Connexion e-mail / mot de passe et vérification OTP.
- Tableau de bord, statistiques, graphiques et navigation par module TAC-Inter Urbain, TAC-Kelasi, TAC-Étudiant.
- Administration : entités, provinces, établissements, facultés, départements, options, utilisateurs, rôles, affectations, restrictions IP, tarifs et devises.
- Étudiants, inscriptions, cartes et abonnements.
- Inscription en ligne et paiement de carte entièrement fictif, scénarios de réussite et d’échec, reçu CSV.
- Transactions par carte, paiements et rapprochements financiers.
- Monitoring simulé, actualisé toutes les quinze secondes, tickets d’incidents et paramètres utilisateur.

Les tableaux proposent recherche sans accents, statut, module, plage de dates, tri, pagination, actualisation et export CSV des résultats filtrés. Les formulaires ont une validation Zod et des notifications Sonner. Les détails s’ouvrent dans un panneau latéral ; les modifications et suppressions utilisent des modales accessibles. Transactions, paiements et événements de monitoring sont consultables ; les paiements sont créés par le parcours de simulation.

## Architecture

- src/main.tsx : activation MSW avant le rendu React.
- src/frontend/App.tsx : routes chargées à la demande, protections, expiration de session et erreurs d’affichage.
- src/frontend/components : layout, formulaires, adaptateurs SPK et composants accessibles basés sur Radix, CVA et Tailwind.
- src/frontend/pages : authentification, dashboard, administration, tableaux métier, inscription/paiement, paramètres.
- src/frontend/config/resources.ts : configuration typée des 21 référentiels et écrans métier.
- src/frontend/services : couche Axios distincte pour l’administration, la scolarité, la finance et les opérations.
- src/frontend/services/modules : services distincts pour chacun des trois modules TAC.
- src/frontend/stores : Zustand pour la session et les préférences d’interface.
- src/frontend/mocks : données, filtrage et handlers MSW ; aucune requête vers un véritable service métier.
- src/frontend/tests et tests/e2e : tests de domaine/HTTP et parcours navigateur.

Les anciens dossiers, types, contextes et services du dépôt sont conservés. Le nouveau point d’entrée importe uniquement le frontend modulaire ci-dessus. Le projet conserve l’historique des modifications précédentes.

## Simulation et données

Toutes les routes /__demo/api/* sont des conventions locales propres à MSW, pas un contrat d’API backend. Les données initiales couvrent une période fictive de référence au 3 novembre 2026. Les opérations sont conservées dans localStorage avec la clé tac-demo-data-v1 ; elles ne sont partagées ni entre navigateurs ni entre postes. Les clés tac-demo-session et tac-demo-ui conservent la session et les préférences. En cas de stockage indisponible, les données métier restent utilisables en mémoire.

L’administrateur peut restaurer les fixtures depuis Paramètres utilisateur. Les exports et reçus sont des fichiers locaux. Un paiement échoué ne crée aucune carte. Un paiement réussi crée un paiement, une transaction et une carte fictifs. Un rapprochement avec écart reste explicitement en écart.

Les écrans montrent les états de chargement, erreur, liste vide et refus d’accès. Les gardes de permission et les réponses 401/403 du simulateur organisent la démonstration ; aucune de ces protections ne remplace une autorisation serveur. Les restrictions IP, les préférences de notification et la langue sont enregistrées comme préférences de démonstration ; aucun filtrage réseau, envoi ou service de traduction réel n’est activé.

## Intégration future

Conserver VITE_DEMO_MODE=true pour la démonstration. Lorsque les API réelles auront un contrat documenté : adapter les services et leurs DTO, configurer VITE_FRONTEND_API_URL, puis désactiver MSW avec VITE_DEMO_MODE=false. Aucun endpoint réel n’est supposé disponible. Revoir notamment l’authentification et le stockage de session selon le contrat et les exigences de sécurité du backend.

Les contrôles réels des rôles, OTP, restrictions IP, paiements, réconciliations et événements de monitoring devront être assurés ultérieurement par les services backend autorisés, en dehors de ce projet frontend.


## Ressources du template utilisées

Le design réutilise les ressources Ynex / SPK déjà présentes dans le dépôt :

- src/frontend/template.scss charge les variables, cartes, boutons, formulaires, tableaux, avatars, breadcrumbs, pagination, navigation et en-tête SCSS du template.
- frontend.tailwind.cjs reprend le thème Tailwind du template et ses couleurs ; les adaptations Trans-Academia sont centralisées dans src/frontend/template-adapter.css.
- src/@spk/dashboards/spk-hrmcards.tsx affiche les indicateurs du tableau de bord.
- src/@spk/tables/spk-tables.tsx affiche les tableaux TanStack et les transactions récentes.
- src/@spk/uielements/spk-button.tsx et spk-badge.tsx sont utilisés par les boutons et badges de l’interface.
- src/components/common/page-header/pageheader.tsx fournit les titres et fils d’Ariane des pages.
- Les icônes Tabler du template sont utilisées dans les fils d’Ariane et son image loader.svg dans les états de chargement.

Les composants partagés ont été étendus en conservant leurs anciens noms de propriétés. Le fonctionnement React, les protections de routes et les simulations MSW sont conservés.


## Connexion de démonstration et service worker

La connexion réactive automatiquement MSW puis réessaie une seule fois si le simulateur ne répond plus (erreur réseau ou 404). Les données locales sont conservées. Les erreurs d’identifiants et de validation ne provoquent pas de nouvelle tentative. Le service worker est chargé sans réutiliser une ancienne version en cache. Après une mise à jour du frontend, un rechargement Ctrl+F5 permet de charger la version corrigée.
#   t r a n s - a c a d e m i q u e  
 