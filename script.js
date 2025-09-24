document.addEventListener('DOMContentLoaded', () => {

  // --- CONFIG & SÉCURITÉ ---
  const BANNED_WORDS = [
    'sexe', 'sexual', 'viol', 'porn', 'pénis', 'vagin', 'suicide', 'tuer',
    'drogue', 'pédophil', 'mineur', 'nazi', 'raciste', 'hitler'
  ];
  // MODIFICATION ICI : On passe à 50 questions par partie
  const QUESTIONS_PER_GAME = 50;
  let BACKEND_BASE = localStorage.getItem('BACKEND_BASE') || '';

  // --- LISTES DE DILEMMES (50 NORMALS / 50 HARD) ---
  const normalDilemmas = [
    { id: 'n_1', a: "Avoir des spaghettis à la place des cheveux", b: "Éternuer du fromage en poudre", category: 'Corporel' },
    { id: 'n_2', a: "Ne pouvoir communiquer qu'en chantant de l'opéra", b: "Avoir une narration de ta vie par Morgan Freeman que toi seul entends", category: 'Social' },
    { id: 'n_3', a: "À chaque fois que tu mens, un canard en plastique apparaît", b: "À chaque fois que tu dis la vérité, il pleut du lait sur toi", category: 'WTF' },
    { id: 'n_4', a: "Te battre contre un poulet à chaque fois que tu montes dans une voiture", b: "Te battre contre 10 poulets une fois par an", category: 'Logique Absurde' },
    { id: 'n_5', a: "Remplacer tes dents par des touches de piano", b: "Avoir des doigts qui se rétractent comme des objectifs d'appareil photo", category: 'Corporel' },
    { id: 'n_6', a: "Que ta sueur soit de la mayonnaise", b: "Que tes larmes sentent l'essence", category: 'Corporel' },
    { id: 'n_7', a: "Vivre dans une maison en pain d'épice dans un climat tropical", b: "Vivre dans un sous-marin en verre dans la fosse des Mariannes", category: 'WTF' },
    { id: 'n_8', a: "Ne pouvoir te déplacer qu'en faisant la roue", b: "Ne pouvoir parler qu'en rimes", category: 'Social' },
    { id: 'n_9', a: "Avoir un rire de méchant de dessin animé incontrôlable", b: "Pleurer des confettis à chaque fois que tu es triste", category: 'WTF' },
    { id: 'n_10', a: "Savoir la date exacte de ta mort", b: "Savoir la cause exacte de ta mort", category: 'Logique Absurde' },
    { id: 'n_11', a: "Que tes cheveux changent de couleur selon ton humeur", b: "Que des bulles de savon sortent de ta bouche quand tu parles", category: 'Corporel' },
    { id: 'n_12', a: "Ton seul moyen de transport est un monocycle", b: "Ton seul vêtement est une toge romaine", category: 'Social' },
    { id: 'n_13', a: "Tous les animaux te font confiance, mais les appareils électroniques te détestent", b: "Tous les appareils électroniques fonctionnent parfaitement pour toi, mais les animaux te méprisent", category: 'WTF' },
    { id: 'n_14', a: "Être le meilleur du monde à un jeu que personne ne connaît", b: "Être médiocre à un jeu extrêmement populaire", category: 'Logique Absurde' },
    { id: 'n_15', a: "Transpirer du Nutella", b: "Uriner du sirop d'érable", category: 'Corporel' },
    { id: 'n_16', a: "Être suivi en permanence par un groupe de mimes qui imitent tes moindres gestes", b: "Être suivi par un barde qui chante (faux) tes exploits quotidiens", category: 'Social' },
    { id: 'n_17', a: "Chaque livre que tu lis se transforme en film de Michael Bay", b: "Chaque film que tu regardes est rejoué par les Muppets", category: 'WTF' },
    { id: 'n_18', a: "Ton nez s'allonge comme Pinocchio quand tu es heureux", b: "Tes oreilles grandissent comme Dumbo quand tu es en colère", category: 'Corporel' },
    { id: 'n_19', a: "Les pigeons t'obéissent mais te jugent constamment", b: "Les chats peuvent te parler mais ils sont tous sarcastiques", category: 'WTF' },
    { id: 'n_20', a: "Avoir la capacité de parler aux plantes, mais elles se plaignent tout le temps", b: "Pouvoir comprendre les animaux, mais ils ne parlent que de nourriture", category: 'Logique Absurde' },
    { id: 'n_21', a: "Avoir une peau qui peut faire la photosynthèse, mais elle devient verte", b: "Avoir des poils qui scintillent dans le noir", category: 'Corporel' },
    { id: 'n_22', a: "Avoir un klaxon de clown à la place du nez", b: "Avoir des chaussures qui couinent à chaque pas", category: 'Social' },
    { id: 'n_23', a: "Ton ombre a sa propre personnalité et te contredit souvent", b: "Ton reflet dans le miroir te donne de très mauvais conseils", category: 'WTF' },
    { id: 'n_24', a: "Manger une pizza ananas-anchois une fois par semaine", b: "Boire un verre de lait périmé (sans danger) une fois par semaine", category: 'Logique Absurde' },
    { id: 'n_25', a: "Tes doigts sont des frites", b: "Tes yeux sont des olives", category: 'Corporel' },
    { id: 'n_26', a: "Devoir saluer chaque chien que tu croises avec une révérence", b: "Devoir parler aux plantes dans les lieux publics", category: 'Social' },
    { id: 'n_27', a: "Tu peux voler, mais seulement à 5 cm du sol", b: "Le temps s'arrête pendant une heure chaque jour, mais tu es endormi", category: 'WTF' },
    { id: 'n_28', a: "Ne plus jamais pouvoir utiliser de majuscules", b: "DEVOIR TOUJOURS ÉCRIRE EN MAJUSCULES", category: 'Logique Absurde' },
    { id: 'n_29', a: "Avoir une troisième narine au milieu du front", b: "Avoir une langue de serpent", category: 'Corporel' },
    { id: 'n_30', a: "Devoir porter un costume de hot-dog tous les mardis", b: "Devoir te coiffer comme Polnareff tous les jours", category: 'Social' },
    { id: 'n_31', a: "Les objets inanimés crient quand tu les touches", b: "Les nuages ressemblent tous à des visages déçus", category: 'WTF' },
    { id: 'n_32', a: "Abandonner le café pour toujours", b: "Abandonner le fromage pour toujours", category: 'Logique Absurde' },
    { id: 'n_33', a: "Avoir des bras en mousse", b: "Avoir des jambes en ressort", category: 'Corporel' },
    { id: 'n_34', a: "À chaque fois que tu entres dans une pièce, l'alarme incendie se déclenche brièvement", b: "À chaque fois que tu sors d'une pièce, quelqu'un applaudit", category: 'Social' },
    { id: 'n_35', a: "Tu peux te téléporter, mais à un endroit aléatoire dans un rayon de 10 mètres", b: "Tu peux lire dans les pensées, mais uniquement celles des insectes", category: 'WTF' },
    { id: 'n_36', a: "Passer le reste de ta vie sans Internet", b: "Passer le reste de ta vie sans contact humain direct", category: 'Logique Absurde' },
    { id: 'n_37', a: "Ta voix est en permanence modifiée par l'auto-tune", b: "Une musique d'ascenseur joue en permanence autour de toi", category: 'Corporel' },
    { id: 'n_38', a: "Ton meilleur ami est un caillou (il ne parle pas)", b: "Ton pire ennemi est une oie particulièrement agressive", category: 'Social' },
    { id: 'n_39', a: "La gravité s'inverse pour toi 10 secondes par jour, à un moment aléatoire", b: "Tu perds la notion des couleurs pendant une heure chaque jour", category: 'WTF' },
    { id: 'n_40', a: "Porter des chaussettes mouillées pour le reste de ta vie", b: "Avoir en permanence un petit caillou dans ta chaussure", category: 'Logique Absurde' },
    { id: 'n_41', a: "Avoir une mémoire photographique mais ne pouvoir retenir que les publicités", b: "Pouvoir oublier n'importe quoi sur commande, mais ça ne marche qu'une fois sur deux", category: 'WTF' },
    { id: 'n_42', a: "Devoir danser la Macarena avant chaque repas", b: "Devoir faire le moonwalk pour te déplacer à reculons", category: 'Social' },
    { id: 'n_43', a: "Avoir des pouces non préhensiles", b: "Avoir des genoux qui se plient dans l'autre sens", category: 'Corporel' },
    { id: 'n_44', a: "Pouvoir parler à la Tour Eiffel, mais elle est très snob", b: "Pouvoir commander aux rats, mais ils négocient chaque ordre", category: 'WTF' },
    { id: 'n_45', a: "Revivre en boucle la même journée de lundi ennuyeuse", b: "Sauter tous les lundis, mais perdre tous les souvenirs du dimanche", category: 'Logique Absurde' },
    { id: 'n_46', a: "Toutes les portes que tu ouvres grincent de manière effrayante", b: "Tous les sols que tu foules craquent bruyamment", category: 'Social' },
    { id: 'n_47', a: "Avoir une barbe de chewing-gum", b: "Avoir une chevelure de barbe à papa", category: 'Corporel' },
    { id: 'n_48', a: "Ne pouvoir manger que de la nourriture mixée", b: "Ne pouvoir boire que des boissons gazeuses", category: 'Logique Absurde' },
    { id: 'n_49', a: "Chaque fois que tu éternues, tu changes de langue pour une heure", b: "Chaque fois que tu rotes, tu lévites de 30cm", category: 'WTF' },
    { id: 'n_50', a: "Être allergique au Wi-Fi", b: "Devoir payer 1€ pour chaque recherche Google", category: 'Social' },
  ];
  const hardDilemmas = [
    { id: 'h_1', a: "Boire un verre de sueur (stérilisée) d'un athlète pro", b: "Lécher la vitre d'une cabine téléphonique publique", category: 'Dégoûtant' },
    { id: 'h_2', a: "Devoir annoncer à tes parents que tu les as surpris en plein acte, avec tous les détails", b: "Devoir regarder tes grands-parents refaire leur nuit de noces", category: 'Malaise' },
    { id: 'h_3', a: "Appuyer sur un bouton qui te donne 10 millions d'euros, mais qui tue une personne innocente au hasard dans le monde", b: "Ne pas appuyer sur le bouton", category: 'Moral' },
    { id: 'h_4', a: "À chaque fois que tu croises quelqu'un, devoir lui renifler les cheveux", b: "Devoir finir toutes tes phrases par '... n'est-ce pas, mon petit coquin ?'", category: 'Malaise' },
    { id: 'h_5', a: "Te rincer la bouche avec la pisse d'un membre de ta famille (il est en parfaite santé)", b: "Manger les croûtes de ton propre corps collectionnées pendant 1 an", category: 'Dégoûtant' },
    { id: 'h_6', a: "Que ton historique internet soit lu à voix haute lors de ton enterrement", b: "Que tes messages privés soient projetés lors du mariage de ton/ta meilleur(e) ami(e)", category: 'Malaise' },
    { id: 'h_7', a: "Sacrifier ton animal de compagnie adoré pour sauver un inconnu", b: "Laisser l'inconnu mourir", category: 'Moral' },
    { id: 'h_8', a: "Appeler le patron de ton/ta partenaire pour lui demander s'il/elle est 'bon(ne) au lit'", b: "Demander à tes beaux-parents de noter tes performances intimes sur 10", category: 'Malaise' },
    { id: 'h_9', a: "Boire le jus au fond de la poubelle de cuisine", b: "Manger un Big Mac qui a passé une semaine entre les coussins du canapé", category: 'Dégoûtant' },
    { id: 'h_10', a: "Devoir personnellement abattre et dépecer chaque animal que tu manges", b: "Devenir végétalien pour le reste de ta vie", category: 'Moral' },
    { id: 'h_11', a: "Assister à l'accouchement de ta propre mère (en vidéo)", b: "Assister à la conception de ton propre enfant (en vidéo)", category: 'Malaise' },
    { id: 'h_12', a: "Changer la couche pleine d'un bébé et te mettre un peu de caca sur le front", b: "Nettoyer le vomi de quelqu'un avec tes mains nues", category: 'Dégoûtant' },
    { id: 'h_13', a: "Savoir tout ce que les gens pensent de toi en mal, en temps réel", b: "Ne jamais savoir ce que les gens pensent vraiment de toi", category: 'Moral' },
    { id: 'h_14', a: "Te faire surprendre en train de fouiller dans la poubelle de tes voisins par ces mêmes voisins", b: "Que ton/ta partenaire te surprenne en train d'essayer ses sous-vêtements", category: 'Malaise' },
    { id: 'h_15', a: "Manger une assiette de poils pubiens (propres)", b: "Boire un verre de sang de porc", category: 'Dégoûtant' },
    { id: 'h_16', a: "Devoir expliquer en détail le concept de 'furry' à ta grand-mère de 90 ans", b: "Faire un exposé sur tes 5 sites pour adultes préférés devant tes collègues", category: 'Malaise' },
    { id: 'h_17', a: "Dénoncer ton meilleur ami pour un crime qu'il a commis, ce qui l'enverra en prison à vie", b: "Garder le secret et vivre avec la culpabilité", category: 'Moral' },
    { id: 'h_18', a: "Que la personne pour qui tu as un crush découvre ton journal intime d'adolescent(e)", b: "Que tes parents découvrent ton compte 'OnlyFans' secret", category: 'Malaise' },
    { id: 'h_19', a: "Finir un pot de mayonnaise tiède à la cuillère", b: "Manger une bougie parfumée à la vanille", category: 'Dégoûtant' },
    { id: 'h_20', a: "Avoir une conversation de 30 minutes avec quelqu'un qui a un gros bout de salade coincé entre les dents, sans rien dire", b: "Être celui qui a le bout de salade, et que personne ne te le dise pendant 30 minutes", category: 'Malaise' },
    { id: 'h_21', a: "Effacer le plus beau souvenir de ta vie pour 1 million d'euros", b: "Garder le souvenir et refuser l'argent", category: 'Moral' },
    { id: 'h_22', a: "Envoyer 'Je t'aime' par erreur à ton patron", b: "Recevoir 'Je t'aime' par erreur de la part d'un de tes parents", category: 'Malaise' },
    { id: 'h_23', a: "Manger une pizza dont la garniture est un mélange de tous les restes du frigo", b: "Boire un 'smoothie' fait avec tous les condiments de la porte du frigo", category: 'Dégoûtant' },
    { id: 'h_24', a: "Te rendre compte à la fin d'un entretien d'embauche que ta braguette était ouverte tout le long", b: "Être le recruteur et ne pas oser le dire au candidat", category: 'Malaise' },
    { id: 'h_25', a: "Avoir une vie de bonheur et de succès, mais être la cause indirecte du malheur de ton entourage", b: "Avoir une vie difficile, mais apporter le bonheur à ceux que tu aimes", category: 'Moral' },
    { id: 'h_26', a: "Ton corps produit en permanence une légère odeur de poisson pas frais", b: "Tes pieds sentent si fort que les gens s'évanouissent si tu enlèves tes chaussures", category: 'Malaise' },
    { id: 'h_27', a: "Trier les poubelles d'un hôpital à mains nues", b: "Nettoyer les toilettes d'un festival de musique le dernier jour", category: 'Dégoûtant' },
    { id: 'h_28', a: "Devoir réconforter ton/ta meilleur(e) ami(e) après qu'il/elle ait couché avec un de tes parents", b: "Être celui/celle qui a couché avec le parent de ton/ta meilleur(e) ami(e)", category: 'Malaise' },
    { id: 'h_29', a: "Manger un bol d'ongles coupés (nettoyés)", b: "Mâcher un morceau de cérumen", category: 'Dégoûtant' },
    { id: 'h_30', a: "Ton pet le plus bruyant et odorant se produit toujours dans un silence total (ascenseur, bibliothèque...)", b: "Tu éternues systématiquement sur le visage de la personne à qui tu parles", category: 'Malaise' },
    { id: 'h_31', a: "Retourner dans le passé et tuer Hitler bébé", b: "Le laisser vivre, car tuer un bébé est un meurtre, peu importe qui il deviendra", category: 'Moral' },
    { id: 'h_32', a: "Participer à une thérapie de couple entre tes parents", b: "Devoir choisir lequel de tes parents tu 'aimes le plus' devant eux", category: 'Malaise' },
    { id: 'h_33', a: "Avoir la langue recouverte en permanence d'une fine couche de fourrure", b: "Tes dents sont toujours un peu gluantes", category: 'Dégoûtant' },
    { id: 'h_34', a: "Tenter de séduire un membre de ta propre famille par accident sur une app de rencontre", b: "Découvrir que tes parents ont un profil sur un site échangiste", category: 'Malaise' },
    { id: 'h_35', a: "Avoir le pouvoir de guérir n'importe qui, mais chaque guérison te retire un an de vie", b: "Vivre une longue vie en pleine santé, mais sans ce pouvoir", category: 'Moral' },
    { id: 'h_36', a: "Devoir porter les vêtements de ton père/ta mère de quand il/elle avait ton âge, tous les jours", b: "Devoir adopter la même coupe de cheveux que ton parent du même genre", category: 'Malaise' },
    { id: 'h_37', a: "Faire un bain de bouche avec du vinaigre blanc chaud", b: "Mettre du piment dans tes yeux", category: 'Dégoûtant' },
    { id: 'h_38', a: "Être la seule personne à rire à une blague très déplacée lors d'un enterrement", b: "Faire une demande en mariage et recevoir un 'non' catégorique en public", category: 'Malaise' },
    { id: 'h_39', a: "Remplacer ton shampoing par de l'huile de friture usagée", b: "Remplacer ton déodorant par du fromage crémeux", category: 'Dégoûtant' },
    { id: 'h_40', a: "Vivre dans un monde parfaitement juste et équitable, mais sans aucune forme d'art ou de créativité", b: "Vivre dans notre monde actuel", category: 'Moral' },
    { id: 'h_41', a: "Recoudre une plaie ouverte sur toi-même sans anesthésie", b: "Arracher une de tes propres dents avec une pince", category: 'Dégoûtant' },
    { id: 'h_42', a: "Ton ordinateur lit à voix haute tout ce que tu tapes dans la barre de recherche", b: "Ton téléphone diffuse sur haut-parleur tous tes appels", category: 'Malaise' },
    { id: 'h_43', a: "Boire un grand verre de ton propre vomi (filtré des morceaux)", b: "Manger une crotte de nez d'un inconnu", category: 'Dégoûtant' },
    { id: 'h_44', a: "Devoir dire à ton enfant que tu ne l'aimes pas (même si c'est un mensonge)", b: "Entendre tes parents dire qu'ils sont déçus de toi (et qu'ils le pensent)", category: 'Malaise' },
    { id: 'h_45', a: "Devenir incroyablement riche en exploitant des travailleurs dans des pays pauvres", b: "Rester modeste mais avoir une éthique irréprochable", category: 'Moral' },
    { id: 'h_46', a: "Sacrifier une personne que tu n'aimes pas pour sauver 5 inconnus", b: "Ne rien faire et laisser mourir 5 inconnus", category: 'Moral' },
    { id: 'h_47', a: "Lécher la semelle de la chaussure d'un sans-abri", b: "Ouvrir une fosse septique et y plonger la tête pendant 3 secondes", category: 'Dégoûtant' },
    { id: 'h_48', a: "Savoir que tes amis parlent de toi dans ton dos", b: "Ne jamais savoir ce que les gens pensent vraiment de toi", category: 'Malaise' },
    { id: 'h_49', a: "Avoir un anus à la place du nombril", b: "Avoir un nez à la place d'un téton", category: 'Dégoûtant' },
    { id: 'h_50', a: "Recevoir tout le mérite pour le travail de quelqu'un d'autre et devenir célèbre", b: "Travailler dur toute ta vie et ne jamais être reconnu", category: 'Moral' },
  ];
  
  // --- NOUVEAUX PROFILS PSYCHOLOGIQUES DÉTAILLÉS ---
  const profiles = {
    'Corporel': { desc: "Votre rapport au corps est... unique. Vous n'êtes pas contraint par les limites biologiques conventionnelles et voyez le corps humain comme une matière première pour des expériences surréalistes. Vous êtes un véritable artiste de la chair." },
    'Social': { desc: "Les conventions sociales sont pour vous un terrain de jeu. Là où d'autres voient des règles, vous voyez des suggestions à joyeusement transgresser. Votre audace sociale est une source de fascination... et parfois d'effroi pour votre entourage." },
    'WTF': { desc: "Vous avez un esprit qui carbure à l'imprévisible. La logique est une cage et vous en avez jeté la clé depuis longtemps. Vous trouvez de la poésie dans le chaos et de la sagesse dans l'absurde. Vous êtes un agent du surréalisme." },
    'Logique Absurde': { desc: "Vous êtes un penseur paradoxal. Vous appliquez une rationalité de fer à des prémisses complètement folles. Cet esprit d'analyse dans des situations impossibles fait de vous un stratège hors pair dans un monde qui n'a aucun sens." },
    'Dégoûtant': { desc: "Vous avez une tolérance à la révulsion qui dépasse l'entendement. Ce qui ferait fuir le commun des mortels ne fait qu'éveiller votre curiosité. Vous êtes biologiquement et mentalement préparé à l'apocalypse." },
    'Malaise': { desc: "Vous êtes un explorateur des abysses de la gêne. Vous n'avez pas peur de naviguer dans les eaux troubles de l'embarras social, que ce soit le vôtre ou celui des autres. Votre courage face au 'cringe' est légendaire." },
    'Moral': { desc: "Votre esprit est un champ de bataille éthique. Chaque décision est pesée sur la balance du bien et du mal, vous confrontant à des choix cornéliens. Vous êtes un philosophe en action, constamment tourmenté par les conséquences de vos actes." }
  };

  const profileTitles = {
      'Moral-Dégoûtant': 'Le Survivant Pragmatique',
      'Social-WTF': 'Le Trublion Cosmique',
      'Corporel-Logique Absurde': "L'Ingénieur du Bizarre",
      'Malaise-Social': "L'Anthropologue de l'Embarras",
      'Moral-Social': "Le Justicier Incompris",
      'Dégoûtant-Corporel': "Le Mutagéniste Impavide",
  };

  // --- ÉLÉMENTS DU DOM ---
  const elems = {
    modeToggle: document.getElementById('mode-toggle'),
    gameScreen: document.getElementById('game-screen'),
    endScreen: document.getElementById('end-screen'),
    choiceA: document.getElementById('choice-a'),
    choiceB: document.getElementById('choice-b'),
    choiceAText: document.getElementById('choice-a-text'),
    choiceBText: document.getElementById('choice-b-text'),
    choiceAPerc: document.getElementById('choice-a-perc'),
    choiceBPerc: document.getElementById('choice-b-perc'),
    resultBarA: document.getElementById('result-bar-a'),
    resultBarB: document.getElementById('result-bar-b'),
    currentNum: document.getElementById('current-num'),
    totalNum: document.getElementById('total-num'),
    reportBtn: document.getElementById('report-btn'),
    reportMsg: document.getElementById('report-msg'),
    nextBtn: document.getElementById('next-btn'),
    addForm: document.getElementById('add-form'),
    inputA: document.getElementById('input-a'),
    inputB: document.getElementById('input-b'),
    inputAuthor: document.getElementById('input-author'),
    addMsg: document.getElementById('add-msg'),
    backendUrlInput: document.getElementById('backend-url'),
    saveBackendBtn: document.getElementById('save-backend'),
    restartBtn: document.getElementById('restart-btn'),
    shareBtn: document.getElementById('share-btn'),
    profileTitle: document.getElementById('profile-title'),
    profilePrimaryTendency: document.getElementById('profile-primary-tendency'),
    profilePrimaryDesc: document.getElementById('profile-primary-desc'),
    profileSecondaryBlock: document.getElementById('profile-secondary-block'),
    profileSecondaryTendency: document.getElementById('profile-secondary-tendency'),
    profileSecondaryDesc: document.getElementById('profile-secondary-desc'),
    profileSynthesis: document.getElementById('profile-synthesis'),
    statsBreakdown: document.getElementById('stats-breakdown'),
    clickSound: document.getElementById('click-sound'),
    hoverSound: document.getElementById('hover-sound')
  };

  let currentIndex = 0;
  let userProfile = {};
  let currentMode = 'normal';
  let dilemmas = [];

  // --- LOGIQUE DE JEU ---
  // ... (toutes les fonctions jusqu'à showEndScreen restent identiques)

  function setMode(mode) {
    currentMode = mode;
    document.body.classList.toggle('hard-mode', mode === 'hard');
    const sourceDilemmas = (mode === 'hard') ? hardDilemmas : normalDilemmas;
    dilemmas = [...sourceDilemmas].sort(() => 0.5 - Math.random());
    startGame();
  }

  function startGame() {
    currentIndex = 0;
    userProfile = {}; 
    elems.gameScreen.classList.remove('hidden');
    elems.endScreen.classList.add('hidden');
    renderDilemma();
  }

  function renderDilemma() {
    // S'assure qu'on ne dépasse pas le nombre de questions par partie
    const questionsToShow = Math.min(QUESTIONS_PER_GAME, dilemmas.length);
    if (currentIndex >= questionsToShow) {
      showEndScreen();
      return;
    }
    const d = dilemmas[currentIndex];
    elems.currentNum.textContent = currentIndex + 1;
    elems.totalNum.textContent = questionsToShow;
    elems.choiceAText.textContent = d.a;
    elems.choiceBText.textContent = d.b;
    resetChoiceStyles();
  }
  
  function resetChoiceStyles() {
    [elems.choiceA, elems.choiceB].forEach(panel => {
      panel.classList.remove('voted', 'chosen');
      panel.querySelector('.percentage-display').classList.remove('visible');
      panel.querySelector('.result-bar').style.width = '0%';
      panel.setAttribute('tabindex', '0');
    });
    elems.reportMsg.textContent = '';
    elems.nextBtn.classList.add('hidden');
  }

  async function handleChoice(choiceKey) {
    const d = dilemmas[currentIndex];
    if (!d || elems.choiceA.classList.contains('voted')) return;

    elems.clickSound.play();
    [elems.choiceA, elems.choiceB].forEach(p => {
        p.classList.add('voted');
        p.setAttribute('tabindex', '-1');
    });

    const chosenPanel = choiceKey === 'a' ? elems.choiceA : elems.choiceB;
    chosenPanel.classList.add('chosen');

    if (!userProfile[d.category]) userProfile[d.category] = 0;
    userProfile[d.category]++;

    sendVoteToServer(d.id, choiceKey);
    await showPercentages(d.id);

    elems.nextBtn.classList.remove('hidden');
  }
  
  // --- NOUVELLE FONCTION showEndScreen ---
  function showEndScreen() {
    elems.gameScreen.classList.add('hidden');
    elems.endScreen.classList.remove('hidden');

    const sortedCategories = Object.entries(userProfile).sort(([, a], [, b]) => b - a);
    
    if (sortedCategories.length === 0) {
        elems.profileTitle.textContent = "Le Fantôme";
        elems.profilePrimaryTendency.textContent = "Indéfini";
        elems.profilePrimaryDesc.textContent = "Vous avez traversé les dilemmes sans faire de choix, tel un esprit observant le monde sans y prendre part. Votre nature est un mystère.";
        elems.profileSecondaryBlock.classList.add('hidden');
        elems.profileSynthesis.textContent = "Qui êtes-vous vraiment ?";
        elems.statsBreakdown.innerHTML = "Aucune donnée à analyser.";
        return;
    }

    const [primaryCat, primaryScore] = sortedCategories[0];
    const primaryProfile = profiles[primaryCat];
    
    elems.profilePrimaryTendency.textContent = primaryCat;
    elems.profilePrimaryDesc.textContent = primaryProfile.desc;

    let title = `L'Architecte de son Destin`; // Titre par défaut
    
    if (sortedCategories.length > 1) {
        const [secondaryCat, secondaryScore] = sortedCategories[1];
        const secondaryProfile = profiles[secondaryCat];

        elems.profileSecondaryBlock.classList.remove('hidden');
        elems.profileSecondaryTendency.textContent = secondaryCat;
        elems.profileSecondaryDesc.textContent = secondaryProfile.desc;
        
        // Création du titre et de la synthèse
        const comboKey = [primaryCat, secondaryCat].sort().join('-');
        title = profileTitles[comboKey] || `Le ${primaryCat} Énigmatique`;
        elems.profileSynthesis.textContent = `Votre tendance dominante pour le ${primaryCat}, combinée à un penchant notable pour le ${secondaryCat}, révèle une personnalité complexe. Vous alliez une approche ${primaryCat.toLowerCase()} des problèmes avec une sensibilité ${secondaryCat.toLowerCase()}, créant un profil psychologique rare et fascinant.`;

    } else {
        elems.profileSecondaryBlock.classList.add('hidden');
        title = `Le Puriste ${primaryCat}`;
        elems.profileSynthesis.textContent = `Votre concentration quasi totale sur les dilemmes de type ${primaryCat} montre une personnalité aux convictions fortes et bien définies. Vous êtes un spécialiste dans votre domaine de pensée.`;
    }

    elems.profileTitle.textContent = title;

    const totalScore = Object.values(userProfile).reduce((sum, score) => sum + score, 0);
    elems.statsBreakdown.innerHTML = sortedCategories
      .map(([cat, score]) => `
        <div class="stat-item">
          <strong>${cat}:</strong> ${totalScore > 0 ? ((score / totalScore) * 100).toFixed(0) : 0}%
        </div>`)
      .join('');
  }

  // --- INTERACTIONS BACKEND ET AUTRES (inchangées) ---

  async function sendVoteToServer(id, choice) {
    if (!BACKEND_BASE) {
      const key = `votes_${id}_${choice}`;
      localStorage.setItem(key, (parseInt(localStorage.getItem(key)) || 0) + 1);
      return;
    }
    try {
      await fetch(`${BACKEND_BASE}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, choice })
      });
    } catch (e) {
      console.error('Vote failed', e);
    }
  }

  async function fetchGlobalStats(id) {
    if (!BACKEND_BASE) {
      const a = parseInt(localStorage.getItem(`votes_${id}_a`) || 0);
      const b = parseInt(localStorage.getItem(`votes_${id}_b`) || 0);
      return { a: a + 1, b: b + 1 };
    }
    try {
      const res = await fetch(`${BACKEND_BASE}/stats?id=${id}`);
      if (!res.ok) return { a: 1, b: 1 };
      return await res.json();
    } catch (e) {
      console.error('Fetch stats failed', e);
      return { a: 1, b: 1 };
    }
  }

  async function showPercentages(id) {
    const stats = await fetchGlobalStats(id);
    const total = (stats.a || 0) + (stats.b || 0);
    const percA = total > 0 ? Math.round((stats.a / total) * 100) : 50;
    const percB = 100 - percA;

    elems.choiceAPerc.textContent = `${percA}%`;
    elems.choiceBPerc.textContent = `${percB}%`;
    elems.resultBarA.style.width = `${percA}%`;
    elems.resultBarB.style.width = `${percB}%`;

    setTimeout(() => {
        elems.choiceAPerc.classList.add('visible');
        elems.choiceBPerc.classList.add('visible');
    }, 200);
  }
  
  function containsBanned(text) {
    if (!text) return false;
    const s = text.toLowerCase();
    return BANNED_WORDS.some(w => s.includes(w));
  }
  
  elems.addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const a = elems.inputA.value;
    const b = elems.inputB.value;
    elems.addMsg.style.color = 'var(--accent-hard)';

    if (containsBanned(a) || containsBanned(b)) {
      elems.addMsg.textContent = "Contient des mots interdits. Proposition bloquée.";
    } else {
      elems.addMsg.style.color = 'var(--success)';
      elems.addMsg.textContent = "Merci ! Ta proposition sera examinée.";
       setTimeout(() => {
        elems.addForm.reset();
        elems.addMsg.textContent = "";
      }, 3000);
    }
  });

  function handleShare() {
      const title = elems.profileTitle.textContent;
      const primaryTendency = elems.profilePrimaryTendency.textContent;
      const synthesis = elems.profileSynthesis.textContent;
      const text = `Mon profil psychologique "Tu Préfères ?":\n\n**${title} (Tendance: ${primaryTendency})**\n\n"${synthesis}"\n\nEt toi, quel est ton profil ? Fais le test !`;
      navigator.clipboard.writeText(text).then(() => {
          alert('Profil copié dans le presse-papiers !');
      });
  }

  // --- ÉCOUTEURS D'ÉVÉNEMENTS ---
  elems.modeToggle.addEventListener('change', (e) => setMode(e.target.checked ? 'hard' : 'normal'));
  
  elems.choiceA.addEventListener('click', () => handleChoice('a'));
  elems.choiceB.addEventListener('click', () => handleChoice('b'));

  document.addEventListener('keydown', (e) => {
      if (elems.choiceA.classList.contains('voted')) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); elems.choiceA.focus(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); elems.choiceB.focus(); }
      if (e.key === 'Enter' || e.key === ' ') {
          if (document.activeElement === elems.choiceA) handleChoice('a');
          if (document.activeElement === elems.choiceB) handleChoice('b');
      }
  });
  
  [elems.choiceA, elems.choiceB].forEach(p => {
      p.addEventListener('mouseenter', () => {
        if (elems.hoverSound && elems.hoverSound.readyState >= 2) elems.hoverSound.play();
      });
  });

  elems.nextBtn.addEventListener('click', () => {
      currentIndex++;
      renderDilemma();
  });
  
  elems.restartBtn.addEventListener('click', startGame);
  elems.shareBtn.addEventListener('click', handleShare);

  elems.saveBackendBtn.addEventListener('click', () => {
    BACKEND_BASE = elems.backendUrlInput.value.trim();
    localStorage.setItem('BACKEND_BASE', BACKEND_BASE);
    alert(`Backend enregistré : ${BACKEND_BASE || 'Test Local (localStorage)'}`);
  });

  elems.reportBtn.addEventListener('click', () => {
      elems.reportMsg.textContent = "Signalement envoyé pour analyse.";
  });

  // --- DÉMARRAGE ---
  elems.backendUrlInput.value = BACKEND_BASE;
  setMode(elems.modeToggle.checked ? 'hard' : 'normal');
});