import { test,expect,type Page } from '@playwright/test';
async function login(page:Page,role='Administrateur'){
 await page.goto('/login');
 await page.getByRole('button',{name:role,exact:true}).click();
 await page.getByRole('button',{name:'Se connecter',exact:true}).click();
 await expect(page.getByLabel('Code de vérification')).toBeVisible();
 await page.getByLabel('Code de vérification').fill('123456');
 await page.getByRole('button',{name:'Vérifier et accéder'}).click();
 await expect(page.getByRole('heading',{name:'Tableau de bord',exact:true})).toBeVisible();
}
test('login, invalid OTP, dashboard, modules, dark mode and responsive layout',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/students');await expect(page).toHaveURL(/login/);
 await page.screenshot({path:'test-results/login-'+testInfo.project.name+'.png',fullPage:true});
 await page.getByRole('button',{name:'Se connecter',exact:true}).click();
 await page.getByLabel('Code de vérification').fill('000000');await page.getByRole('button',{name:'Vérifier et accéder'}).click();
 await expect(page.getByText(/Code incorrect/)).toBeVisible();
 await page.getByLabel('Code de vérification').fill('123456');await page.getByRole('button',{name:'Vérifier et accéder'}).click();
 await expect(page.getByRole('heading',{name:'Étudiants',exact:true})).toBeVisible();
 await page.goto('/');await expect(page.getByRole('heading',{name:'Tableau de bord',exact:true})).toBeVisible();
 await page.screenshot({path:'test-results/dashboard-'+testInfo.project.name+'.png',fullPage:true});
 if(testInfo.project.name==='desktop'){
  await page.getByRole('button',{name:'Réduire la navigation'}).click();await expect(page.locator('.app-shell')).toHaveClass(/is-collapsed/);await expect(page.locator('.sidebar')).toHaveCSS('width','76px');
  await page.getByRole('button',{name:'Déployer la navigation'}).click();await expect(page.locator('.app-shell')).not.toHaveClass(/is-collapsed/);
 }else{
  await page.getByRole('button',{name:'Ouvrir le menu'}).click();await expect(page.locator('.sidebar')).toHaveClass(/sidebar-open/);await expect(page.locator('.sidebar .brand-logo')).toBeVisible();
  await page.screenshot({path:'test-results/navigation-mobile.png'});await page.getByRole('button',{name:'Fermer le menu'}).click();await expect(page.locator('.sidebar')).not.toHaveClass(/sidebar-open/);
 }
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Activer le mode sombre'}).click();await expect(page.locator('html')).toHaveClass(/dark/);
 await page.getByRole('button',{name:'Activer le mode clair'}).click();
 for(const slug of ['interurbain','kelasi','etudiant']){await page.goto('/modules/'+slug);await expect(page.locator('h1')).toContainText('TAC-');}
 await page.goto('/statistics');await expect(page.getByRole('heading',{name:'Statistiques & rapports'})).toBeVisible();
 expect(errors).toEqual([]);
});
test('administrative CRUD, search, empty state, export and pagination',async({page})=>{
 await login(page);await page.goto('/provinces');
 await page.getByRole('button',{name:'Ajouter une province'}).click();
 await page.getByLabel('Nom de la province').fill('Province E2E');await page.getByLabel('Code').fill('E2E');await page.getByLabel('Chef-lieu').fill('Ville test');
 await page.getByRole('button',{name:'Enregistrer',exact:true}).click();await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.getByLabel('Rechercher dans le tableau').fill('Province E2E');await expect(page.locator('tbody tr')).toHaveCount(1);
 await page.getByRole('button',{name:'Actions pour Province E2E'}).click();await page.getByRole('menuitem',{name:'Modifier'}).click();
 await page.getByLabel('Nom de la province').fill('Province E2E modifiée');await page.getByRole('button',{name:'Enregistrer',exact:true}).click();
 await expect(page.getByRole('dialog')).not.toBeVisible();await expect(page.locator('tbody')).toContainText('Province E2E modifiée');
 await page.getByRole('button',{name:'Actions pour Province E2E modifiée'}).click();await page.getByRole('menuitem',{name:'Supprimer'}).click();await page.getByRole('dialog').getByRole('button',{name:'Supprimer',exact:true}).click();
 await expect(page.getByText('Aucune donnée à afficher')).toBeVisible();
 await page.goto('/students');await expect(page.locator('tbody tr')).toHaveCount(10);await page.getByRole('button',{name:'Page suivante'}).click();await expect(page.getByText('11–20 sur 38 résultats')).toBeVisible();
 const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:'Exporter',exact:true}).click();expect((await downloaded).suggestedFilename()).toBe('students-demo.csv');
});
test('online registration, failed payment, successful retry and card issuance',async({page})=>{
 await login(page);await page.goto('/online-registration');
 await page.getByLabel('Nom complet').fill('Bénéficiaire E2E');await page.getByLabel('Adresse e-mail').fill('e2e@exemple.demo');await page.getByLabel('Matricule étudiant').fill('ETU-E2E');
 await page.getByRole('button',{name:'Continuer vers le paiement'}).click();await expect(page.getByText('Paiement de votre carte',{exact:true})).toBeVisible();
 await page.getByLabel('Scénario de simulation').selectOption('failure');await page.getByLabel('Je comprends que cette opération est une simulation.').check();
 await page.getByRole('button',{name:/Simuler le paiement/}).click();await expect(page.getByRole('heading',{name:'Le paiement fictif a échoué'})).toBeVisible();
 await page.getByRole('button',{name:'Réessayer la simulation'}).click();await page.getByRole('button',{name:/Simuler le paiement/}).click();
 await expect(page.getByRole('heading',{name:'Votre carte est prête !'})).toBeVisible();await page.getByRole('link',{name:'Consulter les cartes'}).click();
 await page.getByLabel('Rechercher dans le tableau').fill('Bénéficiaire E2E');await expect(page.locator('tbody')).toContainText('Bénéficiaire E2E');await expect(page.locator('tbody')).toContainText('Active');
});
test('all management screens load and forms validate',async({page})=>{
 await login(page);
 for(const resource of ['entities','provinces','establishments','faculties','departments','options','users','roles','assignments','ip-rules','pricing','currencies','students','registrations','cards','subscriptions','transactions','payments','reconciliation','monitoring','tickets']){
  await page.goto('/'+resource);await expect(page.locator('tbody tr').first()).toBeVisible();await expect(page.getByRole('heading',{name:'Impossible de charger les données'})).not.toBeVisible();
 }
 await page.goto('/settings');await expect(page.getByRole('heading',{name:'Paramètres utilisateur'})).toBeVisible();await page.getByLabel('Nom complet').fill('Aline Test');await page.getByRole('button',{name:'Enregistrer les modifications'}).click();await expect(page.getByText('Préférences de démonstration enregistrées.')).toBeVisible();
});
test('read-only role cannot access administration, finance or checkout',async({page})=>{
 await login(page,'Observateur');
 for(const url of ['/administration','/users','/transactions','/online-registration']){await page.goto(url);await expect(page.getByRole('heading',{name:'Accès réservé'})).toBeVisible();}
 await page.goto('/students');await expect(page.getByRole('button',{name:'Ajouter un étudiant'})).not.toBeVisible();
 await page.getByRole('button',{name:/Actions pour/}).first().click();await expect(page.getByRole('menuitem',{name:'Modifier'})).not.toBeVisible();
});


test('login recovery after the demo service worker becomes inactive',async({page})=>{
 await page.goto('/login');
 await page.getByRole('button',{name:'Se connecter',exact:true}).waitFor();
 await page.evaluate(()=>{navigator.serviceWorker.controller!.postMessage('CLIENT_CLOSED');});
 await expect.poll(()=>page.evaluate(async()=>!(await navigator.serviceWorker.getRegistration()))).toBe(true);
 await page.getByRole('button',{name:'Se connecter',exact:true}).click();
 await expect(page.getByLabel('Code de vérification')).toBeVisible();
 await page.getByLabel('Code de vérification').fill('123456');
 await page.getByRole('button',{name:'Vérifier et accéder'}).click();
 await expect(page.getByRole('heading',{name:'Tableau de bord',exact:true})).toBeVisible();
});

test('invalid credentials stay an authentication error without automatic retry',async({page})=>{
 let attempts=0;
 page.on('response',response=>{if(response.url().endsWith('/__demo/api/auth/login'))attempts++;});
 await page.goto('/login');
 await page.getByLabel('Mot de passe',{exact:true}).fill('Incorrect@2026');
 await page.getByRole('button',{name:'Se connecter',exact:true}).click();
 await expect(page.getByText('Identifiants de démonstration incorrects.')).toBeVisible();
 await expect(page.getByRole('button',{name:'Se connecter',exact:true})).toBeEnabled();
 expect(attempts).toBe(1);
 await expect(page).toHaveURL(/login/);
});
