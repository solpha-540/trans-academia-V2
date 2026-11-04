// ============================================================================
// SIMPLE ACCESS CONTROL CONFIGURATION
// ============================================================================
export const ACCESS_CONFIGS = {
  CARDS: {
    'card-1': ['Chef personnel','super user','admin'],
    'card-2': ['Chef suivi carriere'],
    'card-3': ['Chef formation'],
    'card-4': ['Chef suivi carriere'],
    'card-5': ['Chef suivi carriere'],  
    'card-6': ['Chef formation'],
    'card-7': ['Chef personnel'],
    'card-8': [ 'Chef suivi carriere'],
    'card-9': ['DRH'],
    'card-10': ['DRH','super user'],
    'card-11': ['DG','super user'],
    'card-12': [ 'Chef suivi carriere'],
  },
  
  NAVIGATION: {
    'dashboard': ['Chef personnel', 'Agent'],
    'personnel-management': ['Chef personnel'],
    'reports': ['Chef personnel'],
    'settings': ['Chef personnel'],
    'profile': ['Chef personnel', 'Agent'],
  },
  
  FEATURES: {
    'create-user': [''],
    'edit-user': ['Chef personnel'],
    'delete-user': ['Chef personnel'],
    'view-reports': ['Chef personnel'],
    'export-data': ['Chef personnel'],
    'view-profile': ['Chef personnel', 'Agent'],
    'edit-profile': ['Chef personnel', 'Agent'],
  },

  // Dropdown menu access configuration
  DROPDOWN_ACCESS: {
    dossierProfessionnel: ['Chef suivi carriere', 'super user', 'admin'],
    conjoint: ['super user', 'Chef suivi carriere', 'admin'],
    enfant:     ['Chef suivi carriere','super user','admin' ],
    cursus: ['Chef suivi carriere', 'super user', 'admin'],
    aptitudes: ['Chef suivi carriere', 'super user', 'admin'],
    formation: ['Chef suivi carriere', 'super user','Chef location'],
    details: ['Chef personnel', 'Chef suivi carriere', 'super user', 'Chef formation', 'Chef bureau paie', 'admin', 'DRH','DO','Chef location','Chef voirie', 'DG','chef reseaux connexe'],
    salaire: ['Chef bureau paie', 'super user'],
    securiteSocial: ['Chef bureau paie', 'super user'],
    ajouterDemandeFormation: ['Chef formation', 'admin'],
    ajouterCursusAcademique: ['Chef suivi carriere', 'Chef formation', 'admin'],
    confirmerAgentDrh: ['DRH'],
    confirmerAgentDg: ['DG'],
    deleteAgent: ['super user', 'admin'],
    appliquerReduction: ['DG', 'admin'],
  },

  // Detail form cards access configuration
  DETAIL_CARDS: {
    'dossierProfessionnel': ['Chef suivi carriere', 'Chef personnel', 'super user', 'admin','DG','DRH'],
    'conjoint': ['Chef suivi carriere', 'super user', 'admin','Chef personnel', 'DG','DRH' ],
    'enfants': ['Chef suivi carriere', 'super user', 'admin', 'DG','DRH'],
    'aptitudes': ['Chef suivi carriere', 'super user', 'admin', 'DG','DRH'],
    'cursus': ['Chef formation','Chef suivi carriere', 'super user', 'admin', 'DG','DRH'],
    'formation': ['Chef formation','Chef suivi carriere', 'super user', 'admin', 'DG','DRH'],
    'securiteSocial': ['Chef bureau paie', 'super user', 'admin', 'DG','DRH'],
    'compteBancaire': ['Chef bureau paie', 'super user', 'admin', 'DG','DRH'],
    'remuneration': ['Chef bureau paie', 'Chef personnel', 'super user', 'admin','DG','DRH'],
    'primes': ['Chef bureau paie', 'Chef personnel', 'super user', 'admin','DG','DRH'],
    'reclamations': ['Chef personnel', 'super user', 'admin', 'DRH', 'DG']
  },
  STATISTICS: {
    'effectif-total-agents': ['DG', 'DRH', 'Chef personnel', 'Chef suivi carriere', 'Chef formation', 'Chef bureau paie', 'DO', 'Chef location', 'Chef voirie', 'super user', 'admin','chef reseaux connexe'],
    'effectif-agents-par-service': ['DG', 'DRH', 'Chef personnel', 'Chef suivi carriere', 'Chef formation', 'Chef bureau paie', 'DO', 'Chef location', 'Chef voirie', 'super user', 'admin','chef reseaux connexe'],
    'effectif-agents-par-direction': ['DG', 'DRH', 'Chef personnel', 'Chef suivi carriere', 'Chef formation', 'Chef bureau paie', 'DO', 'Chef location', 'Chef voirie', 'super user', 'admin','chef reseaux connexe'],
    'dashboard-statistiques': ['DG', 'DRH', 'Chef personnel', 'Chef suivi carriere', 'Chef formation', 'Chef bureau paie', 'DO', 'Chef location', 'Chef voirie', 'super user', 'admin','chef reseaux connexe'],
    'rapport-effectifs': ['DG', 'DRH', 'Chef personnel', 'Chef suivi carriere', 'Chef formation', 'Chef bureau paie', 'DO', 'Chef location', 'Chef voirie', 'super user', 'admin','chef reseaux connexe'],
    'effectif-agent-deja-confirmer': ['DG', 'DRH', 'Chef personnel', 'Chef suivi carriere', 'Chef formation', 'Chef bureau paie', 'DO', 'Chef location', 'Chef voirie', 'super user', 'admin','chef reseaux connexe'],
    'effectif-agent-a-confirmer-drh': ['DRH', 'DG', 'super user', 'admin'],
    'effectif-agent-deja-confirmer-drh': ['DRH', 'DG', 'super user', 'admin'],
    'effectif-agent-a-confirmer-bp': ['Chef bureau paie', 'DG', 'super user', 'admin'],
      'effectif-agents-formable': ['chef formation', 'admin', 'super user'],
    'nombre-de-reparation-a-valider': ['Directeur Technique', 'DG', 'super user', 'admin'],
    'nombre-de-reparation-deja-valider': ['Directeur Technique', 'DG', 'super user', 'admin'],
    'nombre-reservation-confirmer': ['Chef location', 'admin', 'DG', 'super user'],
    'nombre-reservation-en-attente': ['Chef location', 'admin', 'DG', 'super user'],
    'nombre-reservation-en-traitement': ['Chef location', 'admin', 'DG', 'super user'],
    'nombre-reservation-annuler': ['Chef location', 'admin', 'DG', 'super user'],



    // Bus location statistics
    'nombre-total-bus': ['Chef location','admin'],
    'capacite-totale': ['Chef location','admin'],
    'bus-disponibles': ['Chef location','admin'],
    'bus-premium': ['Chef location','admin'],
  },
  
  // Page access configuration
  PAGES: {
    'admin-panel': ['Chef personnel'],
    'user-management': ['Chef personnel'],
    'analytics': ['Chef personnel'],
    'dashboard': ['Chef personnel', 'Agent'],
    'profile': ['Chef personnel', 'Agent'],
  },
  COMPONENTS: {
    'user-list': ['Chef personnel'],
    'edit-form': ['Chef personnel'],
    'delete-button': ['Chef personnel'],
    'export-button': ['Chef personnel'],
    'profile-view': ['Chef personnel', 'Agent'],
  },

  BUTTON:{
    buttonUpdateConjoint:['Chef suivi carriere'],
    buttonUpdateEnfant:['Chef suivi carriere'],
    buttonUpdateAptitudePhysique:['Chef suivi carriere'],
   
    

  },
  SIDEBAR: {
    // Main menu sections (exact titles from nav.tsx)
   'Accueil': ['super user','Chef personnel'],
     'Gestion RH': ['admin','super user', 'DG'],
     'Accueil DO': ['DO'],
     'Accueil DRH': ['DRH'],
     'Accueil ADMIN': ['admin'],
     'Accueil DG': ['DG'],
    'Accueil Chef Personnel': ['Chef personnel'],
     'Accueil Chef Formation': ['Chef formation'],
     'Accueil Chef Bureau Paie': ['Chef bureau paie'],
     'Accueil Chef Carriere': ['Chef suivi carriere'],
     'Accueil Imprimeur': ['Imprimeur'],
     'Accueil Superviseur': ['Superviseur'],
     'Accueil Caisse': ['Caissier'],
    
    
    // Permission management (exact case from ntsx)
   'gestion permission': ['super user','admin'],
    
    // Agent management (exact case from nav.tsx)
    'Gestion agent': ['super user', 'admin','Chef personnel','Chef suivi carriere','Chef formation','Chef bureau paie','admin','DRH' ,'DG','Imprimeur'],
    'Liste des agents': ['super user', 'Chef personnel', 'Chef suivi carriere', 'Chef formation', 'Agent','Chef bureau paie','admin','DRH','DG','Imprimeur' ],
    'Liste carte agent': ['super user', 'admin','Imprimeur','Chef personnel'],
    // affectation management
   'Affectations des agents': ['super user', 'admin','Chef personnel'],
   'Gestion abscence': ['admin', 'super user', 'Chef suivi carriere'],
    'Liste d\'abscences': ['admin', 'super user', 'Chef suivi carriere'],
    'Agent': ['super user', 'admin','Chef personnel'],
    'chef de direction': ['super user', 'admin','Chef personnel'],
    // end affectation management
    'Ajouter agent': ['admin','super user', 'Chef personnel' ],
    'Autorisation De Modifier' : ['DRH'],
    'Historique' : ['DRH'],
    'Prime': ['super user', 'Chef bureau paie','admin'],
    'Rémunération': ['super user', 'admin','Chef bureau paie','admin'],

  
    // Organization (exact case from nav.tsx - lowercase 'organisation')
    'organisation': ['super user','admin','Chef personnel','DO'],
    'Direction': ['super user', 'admin','Chef personnel'],
    'Service': ['super user','admin','Chef personnel','DO','DRH','DG','Directeur Technique'],
    'Grade': ['super user','admin','Chef personnel' ],
    'Role': ['super user', 'admin','Chef personnel' ],
    'Fonction': ['super user','admin','Chef personnel' ],
   

    // Demande (exact titles from nav.tsx)
    'Demande': ['super user','admin','DRH','Chef personnel','Chef suivi carriere','Chef formation','Chef bureau paie' ],
    'Faire-une-demande': ['admin','super user' ,'Chef personnel','Chef suivi carriere','Chef formation','Chef bureau paie' ],
    'Liste-des-demandes': ['DRH' ],



    // Cargo location 

    'Gestion cargo': ['Superviseur','Caissier'],
     'Demande cargoO':['Superviseur,admin'],
     'Demande cargo': ['Superviseur','admin'],
     'Liste des demandes cargo': ['Superviseur','admin','Caissier'],
     'Rapport location cargo':['Superviseur','admin'],

     "Bon d'entrer": ['Caissier'],
     "Bon de sortie": ['Caissier'],
     "historique": ['Caissier'],
    
    // Presence (exact case from nav.tsx)
    'Presence': ['super user','admin'],
    'Pointage': ['super user','admin'],
  
    // Check-point (exact case from nav.tsx)
    'Lignes': ['super user','admin' , 'Directeur Technique'],
    'Reseaux': ['super user','admin' , 'Directeur Technique'],
    'Bus': ['super user','admin' , 'Directeur Technique','Chef voirie','chef reseaux connexe'],
    'Tous les bus': ['super user','admin' , 'Directeur Technique'],
    'Bus location': ['admin' , 'Directeur Technique','Chef voirie','DO','chef reseaux connexe'],
    'Bus signalement': ['Chef voirie','Directeur Technique','DO','chef reseaux connexe'],
    'Lier bus': ['super user','admin' ,'Directeur Technique'],
    

    'Signalement': ['super user','admin' , 'DO',],
    'Signalement par session': ['super user','admin' , 'DO'],
    'Statistiques': ['super user','admin' , 'DO'],
    'Check-point': ['super user','admin' , 'DO','Chef voirie','Directeur Technique','chef reseaux connexe'],
    'Ajouter-point': ['super user','admin' , 'Directeur Technique'],

  'Réparations': ['super user','admin' , 'Directeur Technique'],
    'Réparations à valider': ['super user','admin' , 'Directeur Technique'],
    'Réparations déjà validées': ['super user','admin' , 'Directeur Technique'],
    
    
    // Gestion-de-données (exact case from nav.tsx)
    'Gestion-de-données': ['super user','admin' ,'DO'],
    'Liste-des-categories': ['super user','admin' , 'Directeur Technique'],
    'Liste-des-sous-categories': ['super user','admin' , 'Directeur Technique'],
    'Liste-des-sous-sous-categories': ['super user','admin' , 'Directeur Technique'],
    'Liste-des-options': ['super user','admin' , 'Directeur Technique'],

    

    // ENTITES

    'Entites':['super user','admin'],
    'Province':['super user','admin'],
    'Commune': ['super user','admin' ],
    'Ville':['super user','admin'],
   
    // Account management
    'Gestion-comptes': ['super user','admin'],
    'Ajouter-un-compte': ['super user','admin'],
    'Liste-des-comptes': ['super user','admin'],
    'Carnet d\'adresse': ['super user','admin','Chef personnel','Chef suivi carriere'],


// Reservation
    'Gestion-reservation': ['Chef location','admin','Chef voirie','DG','chef reseaux connexe'],
    'Ajouter-reservation': ['Chef location','admin'],
    'Liste-des-reservations': ['Chef location','admin','Chef voirie','DG'],
    'Gestion-bus': ['admin','DO','Directeur Technique'],
    'Gestion Bus Location': ['admin','DO','Directeur Technique','DO','chef reseaux connexe'],
    'Ajouter-bus': ['admin'],
    'Liste-des-bus': ['Chef location','admin','DO','Directeur Technique'],
    'historique d\'affectation': ['Chef location','admin','DO','Directeur Technique'],
    
    'Organisation': ['admin','Chef voirie','chef reseaux connexe'],
    'Destination': ['admin','Chef voirie','chef reseaux connexe'],
    'Tarifs': ['admin','Chef voirie','chef reseaux connexe'],

    'Liste-demande-formation': ['Chef formation','admin'],
    
    
  }
};

// Helper function to get specific config
export const getAccessConfig = (configType: keyof typeof ACCESS_CONFIGS) => {
  return ACCESS_CONFIGS[configType];
};
