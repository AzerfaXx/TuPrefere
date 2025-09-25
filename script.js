document.addEventListener('DOMContentLoaded', () => {

  // --- CONFIG & SÉCURITÉ ---
  const BANNED_WORDS = [
    'sexe', 'sexual', 'viol', 'porn', 'pénis', 'vagin', 'suicide', 'tuer',
    'drogue', 'pédophil', 'mineur', 'nazi', 'raciste', 'hitler'
  ];
  // MODIFICATION ICI : On passe à 50 questions par partie
  const QUESTIONS_PER_GAME = 50;
  const BACKEND_BASE = 'https://tuprefere.onrender.com';

  // NOUVEAUX ÉLÉMENTS POUR LE FORMULAIRE D'AJOUT
  const formAdd = document.getElementById('add-form');  
  const addMsg = document.getElementById('add-msg');
  const inputA = document.getElementById('input-a');
  const inputB = document.getElementById('input-b');
  const inputCategory = document.getElementById('input-category');
  const inputAuthor = document.getElementById('input-author');
  const recaptchaInput = document.getElementById('g-recaptcha-response-input');
  
  // Fonction utilitaire pour afficher les messages du formulaire d'ajout
  function setAddMsg(msg, type = 'info') {
    addMsg.textContent = msg;
    // Assurez-vous d'avoir des styles pour .add-msg.error/success/info dans style.css
    addMsg.className = `add-msg ${type}`; 
  }

  // --- LISTES DE DILEMMES (50 NORMALS / 50 HARD) ---
  const normalDilemmas = [
    // Les 50 originaux
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
    
    // Nouveaux dilemmes (150)
    { id: 'n_51', a: "Avoir des sourcils qui rampent sur ton visage comme des chenilles", b: "Avoir une moustache qui sert de troisième bras", category: 'Corporel' },
    { id: 'n_52', a: "Devoir commencer chaque conversation par une mauvaise blague de 'papa'", b: "Devoir terminer chaque conversation par 'et c'est mon dernier mot !'", category: 'Social' },
    { id: 'n_53', a: "Ton rire sonne comme une chèvre qui s'étouffe", b: "Tes pleurs sonnent comme un klaxon de voiture", category: 'Corporel' },
    { id: 'n_54', a: "Pouvoir parler n'importe quelle langue, mais avec un accent très cliché", b: "Comprendre n'importe quelle langue, mais ne pouvoir répondre qu'en haussant les épaules", category: 'Logique Absurde' },
    { id: 'n_55', a: "La seule musique que tu peux entendre est du Despacito en boucle", b: "Tu ne peux entendre aucune musique, seulement les bruits de mastication amplifiés", category: 'WTF' },
    { id: 'n_56', a: "Devoir porter des palmes en permanence", b: "Devoir porter un casque de chevalier en permanence", category: 'Social' },
    { id: 'n_57', a: "Avoir la peau recouverte d'écailles de poisson (inodores)", b: "Avoir la langue d'un fourmilier", category: 'Corporel' },
    { id: 'n_58', a: "Être invisible, mais seulement quand personne ne te regarde", b: "Avoir une super-force, mais uniquement pour soulever des salières", category: 'WTF' },
    { id: 'n_59', a: "Les écureuils te déclarent la guerre", b: "Les canards te prennent pour leur dieu et te suivent partout", category: 'WTF' },
    { id: 'n_60', a: "Tes mains sont remplacées par des pieds", b: "Tes pieds sont remplacés par des mains", category: 'Corporel' },
    { id: 'n_61', a: "Manger une araignée vivante (non venimeuse) une fois par an", b: "Avoir une araignée de la taille d'une main comme animal de compagnie", category: 'Logique Absurde' },
    { id: 'n_62', a: "Ton ordinateur te fait des compliments gênants à voix haute", b: "Ton téléphone se moque de tes choix musicaux", category: 'Social' },
    { id: 'n_63', a: "Le papier toilette se transforme en papier de verre dès que tu le touches", b: "Ton savon sent le poisson pourri", category: 'WTF' },
    { id: 'n_64', a: "Ne pouvoir porter que des vêtements 3 tailles trop grandes", b: "Ne pouvoir porter que des vêtements 3 tailles trop petites", category: 'Social' },
    { id: 'n_65', a: "Tes rots sentent la rose", b: "Tes pets créent des arcs-en-ciel miniatures", category: 'Corporel' },
    { id: 'n_66', a: "Pouvoir voyager dans le temps, mais seulement 10 secondes dans le passé", b: "Pouvoir prédire l'avenir, mais seulement pour savoir ce que quelqu'un va manger à son prochain repas", category: 'WTF' },
    { id: 'n_67', a: "Pouvoir contrôler la météo, mais seulement avec tes émotions", b: "Pouvoir parler aux fantômes, mais ils sont tous incroyablement ennuyeux", category: 'WTF' },
    { id: 'n_68', a: "Avoir le pouce constamment en l'air (hitchhiker's thumb)", b: "Ne pouvoir marcher qu'à cloche-pied", category: 'Corporel' },
    { id: 'n_69', a: "Devoir payer 10 centimes à chaque fois que tu clignes des yeux", b: "Recevoir 10 centimes à chaque fois que tu te cognes l'orteil", category: 'Logique Absurde' },
    { id: 'n_70', a: "Tout ce que tu manges a le goût de chou de Bruxelles", b: "Tout ce que tu bois a la consistance du yaourt", category: 'WTF' },
    { id: 'n_71', a: "Ta voiture est une citrouille géante tirée par des souris", b: "Ton appartement est une chaussure géante", category: 'Social' },
    { id: 'n_72', a: "Avoir une vision à rayons X, mais qui ne voit qu'à travers les vêtements et la peau, te montrant uniquement les squelettes", b: "Pouvoir parler aux animaux, mais sans comprendre leurs réponses", category: 'WTF' },
    { id: 'n_73', a: "Tes ongles poussent à la vitesse de bambous", b: "Tes cheveux ne poussent plus du tout", category: 'Corporel' },
    { id: 'n_74', a: "Chaque fois que quelqu'un dit ton nom, tu dois faire un 'dab'", b: "Chaque fois que tu entends de la musique, tu dois te figer sur place", category: 'Social' },
    { id: 'n_75', a: "Ta sonnerie de téléphone est le cri de Wilhelm", b: "Ton fond d'écran est obligatoirement une photo de Nicolas Cage", category: 'WTF' },
    //... (et ainsi de suite jusqu'à 200)
    { id: 'n_76', a: "Avoir des coudes qui se plient dans les deux sens", b: "Avoir un cou de hibou (rotation à 270°)", category: 'Corporel' },
    { id: 'n_77', a: "Avoir le pouvoir de te régénérer, mais seulement pour les coupures de papier", b: "Être indestructible, mais uniquement les mardis de 14h à 15h", category: 'WTF' },
    { id: 'n_78', a: "Vivre sans genoux", b: "Vivre sans coudes", category: 'Corporel' },
    { id: 'n_79', a: "Être coincé dans un ascenseur avec la personne que tu détestes le plus", b: "Être coincé dans un ascenseur avec 5 personnes qui mâchent bruyamment du chewing-gum", category: 'Social' },
    { id: 'n_80', a: "Lancer des boules de feu, mais de la taille d'une bille et aussi chaudes qu'une allumette", b: "Contrôler la météo, mais seulement dans un bocal en verre", category: 'WTF' },
    { id: 'n_81', a: "Avoir des cheveux préhensiles", b: "Avoir une langue collante comme une grenouille", category: 'Corporel' },
    { id: 'n_82', a: "Ne plus jamais pouvoir manger de chocolat", b: "Ne plus jamais pouvoir écouter de musique", category: 'Logique Absurde' },
    { id: 'n_83', a: "Ta vie est une comédie musicale", b: "Ta vie est un film muet en noir et blanc", category: 'WTF' },
    { id: 'n_84', a: "Avoir une petite trompette qui sort de ta tête et joue à chaque fois que tu as une idée", b: "Devoir porter une cape et un masque en permanence", category: 'Social' },
    { id: 'n_85', a: "Avoir le goût de tout ce que tu touches avec tes mains", b: "Avoir une peau qui change de texture selon le sol sur lequel tu marches", category: 'Corporel' },
    { id: 'n_86', a: "Savoir lire dans les pensées des pigeons", b: "Les pigeons peuvent lire dans tes pensées", category: 'WTF' },
    { id: 'n_87', a: "Devoir porter des gants de boxe toute la journée", b: "Devoir porter des chaussures de ski toute la journée", category: 'Social' },
    { id: 'n_88', a: "Courir à la vitesse du son, mais sans pouvoir t'arrêter instantanément (tu trébuches beaucoup)", b: "Respirer sous l'eau, mais avoir une peur panique des poissons", category: 'WTF' },
    { id: 'n_89', a: "Transpirer de la peinture bleue", b: "Tes cheveux sont de l'herbe et tu dois les tondre", category: 'Corporel' },
    { id: 'n_90', a: "Tu peux parler aux meubles, mais ils sont très déprimés", b: "Tu peux donner vie aux dessins, mais ils t'en veulent de les avoir créés", category: 'WTF' },
    { id: 'n_91', a: "Pouvoir contrôler les plantes, mais uniquement les pissenlits", b: "Avoir un cri sonique qui ne peut être entendu que par les limaces", category: 'WTF' },
    { id: 'n_92', a: "Avoir une alarme de voiture comme rire", b: "Devoir crier 'BINGO !' avant de t'endormir", category: 'Social' },
    { id: 'n_93', a: "Tes oreilles sont des petites ailes de chauve-souris", b: "Ton nez est une truffe de chien", category: 'Corporel' },
    { id: 'n_94', a: "Pouvoir te cloner, mais ton clone est paresseux et refuse de faire quoi que ce soit", b: "Devenir minuscule à volonté, mais tes vêtements ne rétrécissent pas avec toi", category: 'WTF' },
    { id: 'n_95', a: "Ne plus jamais être coincé dans les bouchons", b: "Ne plus jamais avoir à faire la queue", category: 'Logique Absurde' },
    { id: 'n_96', a: "Avoir une queue de singe", b: "Avoir des bois de cerf", category: 'Corporel' },
    { id: 'n_97', a: "Tes appareils électroniques ne fonctionnent que si tu leur chantes une berceuse", b: "Ta voiture ne démarre que si tu lui racontes une blague", category: 'Social' },
    { id: 'n_98', a: "Tu te dissous sous la pluie comme un sucre", b: "Tu flottes dans l'eau comme du bois", category: 'WTF' },
    { id: 'n_99', a: "Avoir un seul sourcil géant", b: "Ne pas avoir de sourcils du tout", category: 'Corporel' },
    { id: 'n_100', a: "Savoir toutes les réponses du Trivial Pursuit", b: "Être imbattable au Monopoly", category: 'Logique Absurde' },
    { id: 'n_101', a: 'Devoir parler comme Yoda en permanence', b: 'Devoir finir tes phrases par "... en théorie"', category: 'Social' },
    { id: 'n_102', a: 'Avoir des dents de requin (qui repoussent)', b: 'Avoir une vision de caméléon (yeux indépendants)', category: 'Corporel' },
    { id: 'n_103', a: 'Tu peux créer des portails, mais tu ne sais jamais où ils mènent', b: 'Tu peux voyager dans le temps, mais seulement de 5 secondes vers le futur', category: 'WTF' },
    { id: 'n_104', a: 'Ne manger que des insectes (bien cuisinés)', b: 'Ne manger que des aliments pour bébé', category: 'Logique Absurde' },
    { id: 'n_105', a: 'Tes mains sont en permanence collantes', b: 'Ta peau est en permanence glissante', category: 'Corporel' },
    { id: 'n_106', a: 'Être accompagné par un narrateur invisible qui commente tes actions à tout le monde', b: 'Avoir des sous-titres de tes pensées flottant au-dessus de ta tête', category: 'Social' },
    { id: 'n_107', a: 'Tout ce que tu touches se transforme en or, y compris la nourriture', b: 'Tout ce que tu touches se transforme en pain', category: 'Logique Absurde' },
    { id: 'n_108', a: 'Pouvoir respirer sous l\'eau mais ne plus pouvoir marcher sur terre', b: 'Pouvoir voler mais être terrifié par les hauteurs', category: 'WTF' },
    { id: 'n_109', a: 'Tes cheveux sont des tentacules de poulpe', b: 'Ta langue est un serpent miniature (non venimeux)', category: 'Corporel' },
    { id: 'n_110', a: 'Devoir porter un chapeau en aluminium en permanence pour "bloquer les ondes"', b: 'Devoir saluer le soleil chaque matin avec une danse complexe', category: 'Social' },
    { id: 'n_111', a: 'Ton corps est en 2D comme dans un vieux dessin animé', b: 'Ton corps est en pixels comme dans un vieux jeu vidéo', category: 'WTF' },
    { id: 'n_112', a: 'Avoir une mémoire qui s\'efface toutes les 24 heures', b: 'Te souvenir de tout, absolument tout, pour toujours', category: 'Logique Absurde' },
    { id: 'n_113', a: 'Avoir des plumes au lieu de poils', b: 'Avoir une carapace de tortue sur le dos', category: 'Corporel' },
    { id: 'n_114', a: 'Chaque film que tu regardes a une fin heureuse obligatoire', b: 'Chaque livre que tu lis a une fin triste obligatoire', category: 'WTF' },
    { id: 'n_115', a: 'Devoir te battre en duel (à l\'épée en mousse) pour obtenir la dernière part de pizza', b: 'Devoir résoudre une énigme pour pouvoir aller aux toilettes', category: 'Social' },
    { id: 'n_116', a: 'Tes larmes sont du sable', b: 'Ta salive est de l\'encre', category: 'Corporel' },
    { id: 'n_117', a: 'Ne plus jamais avoir besoin de dormir', b: 'Ne plus jamais avoir besoin de manger', category: 'Logique Absurde' },
    { id: 'n_118', a: 'Tu peux voir 5 minutes dans le futur, mais personne ne te croit jamais', b: 'Tu peux entendre les pensées des animaux, mais ils ne pensent qu\'à des choses stupides', category: 'WTF' },
    { id: 'n_119', a: 'Devoir porter des patins à roulettes partout où tu vas', b: 'Devoir te déplacer sur un pogo stick', category: 'Social' },
    { id: 'n_120', a: 'Ton nombril est un port USB fonctionnel', b: 'Tes oreilles sont des haut-parleurs Bluetooth', category: 'Corporel' },
    { id: 'n_121', a: 'Être un personnage secondaire dans la vie de quelqu\'un d\'autre', b: 'Être le personnage principal d\'une vie très ennuyeuse', category: 'Logique Absurde' },
    { id: 'n_122', a: 'Une musique de suspense se joue à chaque fois que tu ouvres une porte', b: 'Des rires enregistrés se font entendre à chaque fois que tu fais une blague', category: 'Social' },
    { id: 'n_123', a: 'Avoir un nuage de pluie personnel qui te suit quand tu es triste', b: 'Avoir un petit soleil personnel qui te suit quand tu es heureux', category: 'WTF' },
    { id: 'n_124', a: 'Ta peau est phosphorescente dans le noir', b: 'Tes yeux brillent comme ceux d\'un chat', category: 'Corporel' },
    { id: 'n_125', a: 'Passer un an sur une île déserte avec ton pire ennemi', b: 'Passer un an sur une île déserte complètement seul', category: 'Logique Absurde' },
    { id: 'n_126', a: 'Devoir parler à la troisième personne', b: 'Ne pouvoir s\'exprimer que par des questions', category: 'Social' },
    { id: 'n_127', a: 'Tes doigts s\'allongent à volonté', b: 'Tes jambes s\'allongent à volonté', category: 'Corporel' },
    { id: 'n_128', a: 'Le monde devient un jeu vidéo, mais tu es un PNJ (Personnage Non-Joueur)', b: 'Le monde devient un film, mais tu es juste un figurant', category: 'WTF' },
    { id: 'n_129', a: 'Avoir un rire si communicatif que tout le monde se met à rire avec toi', b: 'Avoir un bâillement si communicatif que tout le monde s\'endort', category: 'Social' },
    { id: 'n_130', a: 'Ne plus jamais avoir froid', b: 'Ne plus jamais avoir chaud', category: 'Logique Absurde' },
    { id: 'n_131', a: 'Avoir des ventouses de poulpe sur le bout des doigts', b: 'Avoir une crête de coq sur la tête', category: 'Corporel' },
    { id: 'n_132', a: 'Tu peux comprendre ce que disent les bébés, et ils sont très méchants', b: 'Tu peux comprendre ce que disent les statues, et elles se plaignent de leurs poses', category: 'WTF' },
    { id: 'n_133', a: 'Devoir porter un nez de clown rouge tous les jours', b: 'Devoir porter des chaussures de clown géantes tous les jours', category: 'Social' },
    { id: 'n_134', a: 'Ton corps est fait de caoutchouc comme Luffy', b: 'Tu peux te régénérer comme Wolverine, mais ça fait très mal', category: 'Corporel' },
    { id: 'n_135', a: 'Être forcé de dire la vérité la plus brutale à tout le monde', b: 'Être forcé de faire le compliment le plus absurde à tout le monde', category: 'Logique Absurde' },
    { id: 'n_136', a: 'Chaque fois que tu mens, tes cheveux poussent d\'un centimètre', b: 'Chaque fois que tu dis la vérité, un de tes cheveux tombe', category: 'WTF' },
    { id: 'n_137', a: 'Devoir te présenter à tout le monde avec un nom et une profession inventés', b: 'Devoir demander la permission à ta mère (même si elle n\'est pas là) avant chaque décision', category: 'Social' },
    { id: 'n_138', a: 'Avoir une peau qui change de couleur comme un caméléon, mais sans le contrôler', b: 'Avoir la capacité de te dégonfler comme un ballon de baudruche', category: 'Corporel' },
    { id: 'n_139', a: 'Ton seul ami est ton reflet dans le miroir', b: 'Tous les mannequins de vitrine te suivent du regard', category: 'WTF' },
    { id: 'n_140', a: 'Ne plus jamais pouvoir utiliser Google', b: 'Ne plus jamais pouvoir utiliser de GPS', category: 'Logique Absurde' },
    { id: 'n_141', a: 'Avoir une fermeture éclair sur le ventre qui ouvre un espace de rangement', b: 'Avoir des poches de kangourou', category: 'Corporel' },
    { id: 'n_142', a: 'À chaque fois que tu dis "s\'il vous plaît", la personne en face de toi se met à danser', b: 'À chaque fois que tu dis "merci", la personne en face de toi se met à chanter', category: 'Social' },
    { id: 'n_143', a: 'Les lois de la physique ne s\'appliquent à toi qu\'un jour sur deux', b: 'Tu vis dans un monde sans friction', category: 'WTF' },
    { id: 'n_144', a: 'Avoir un corps entièrement tatoué de mèmes', b: 'Avoir une coiffure en forme de votre plat préféré', category: 'Corporel' },
    { id: 'n_145', a: 'Gagner 1 million d\'euros mais ne plus jamais pouvoir manger ton plat préféré', b: 'Pouvoir manger ton plat préféré à volonté mais rester pauvre', category: 'Logique Absurde' },
    { id: 'n_146', a: 'Ton ombre est en avance de 3 secondes sur tes mouvements', b: 'Ton écho te répond avec sarcasme', category: 'WTF' },
    { id: 'n_147', a: 'Devoir faire tous tes achats en chantant tes besoins au vendeur', b: 'Devoir négocier le prix de chaque article, même au supermarché', category: 'Social' },
    { id: 'n_148', a: 'Avoir des ressorts sous les pieds', b: 'Avoir des ailes qui ne sont pas assez grandes pour voler', category: 'Corporel' },
    { id: 'n_149', a: 'Chaque jour, tu te réveilles dans le corps d\'une personne différente, mais dans ta propre maison', b: 'Chaque jour, tu te réveilles dans ton propre corps, mais dans la maison d\'une personne aléatoire', category: 'WTF' },
    { id: 'n_150', a: 'Ne pouvoir boire que du vinaigre', b: 'Ne pouvoir manger que des citrons', category: 'Logique Absurde' },
    { id: 'n_151', a: 'Tes mains applaudissent involontairement quand tu es nerveux', b: 'Tes pieds tapent la claquette quand tu es excité', category: 'Corporel' },
    { id: 'n_152', a: 'Devoir porter un kilt en hiver dans le nord', b: 'Devoir porter une doudoune en été dans le sud', category: 'Social' },
    { id: 'n_153', a: 'Tu peux stopper le temps, mais tu vieillis deux fois plus vite pendant ce temps', b: 'Tu peux remonter le temps, mais seulement pour revivre tes moments les plus embarrassants', category: 'WTF' },
    { id: 'n_154', a: 'Avoir une boussole interne qui pointe toujours vers le fast-food le plus proche', b: 'Avoir un détecteur qui sonne quand quelqu\'un ment', category: 'Logique Absurde' },
    { id: 'n_155', a: 'Avoir des oreilles d\'elfe très pointues', b: 'Avoir un nez de cochon', category: 'Corporel' },
    { id: 'n_156', a: 'Devoir payer les gens pour qu\'ils écoutent tes problèmes', b: 'Devoir écouter les problèmes de tout le monde gratuitement', category: 'Social' },
    { id: 'n_157', a: 'Tu peux marcher sur les murs et les plafonds', b: 'Tu peux traverser les murs, mais il y a une chance sur deux que tu restes coincé', category: 'WTF' },
    { id: 'n_158', a: 'Ne jamais pouvoir couper tes ongles', b: 'Ne jamais pouvoir couper tes cheveux', category: 'Logique Absurde' },
    { id: 'n_159', a: 'Ta voix est toujours un murmure', b: 'Ta voix est toujours un cri', category: 'Corporel' },
    { id: 'n_160', a: 'Être suivi par un canard qui te donne des conseils financiers (et il a raison)', b: 'Être suivi par un lama qui te juge moralement (et il a raison)', category: 'Social' },
    { id: 'n_161', a: 'Tout ce que tu dessines devient réel, mais en version miniature', b: 'Tu peux rétrécir à volonté, mais tu ne peux pas retrouver ta taille normale avant 24h', category: 'WTF' },
    { id: 'n_162', a: 'Avoir des yeux sur le dos de tes mains', b: 'Avoir une bouche sur ton ventre', category: 'Corporel' },
    { id: 'n_163', a: 'Savoir la fin de tous les films avant de les voir', b: 'Oublier la fin de tous les films dès que tu les as vus', category: 'Logique Absurde' },
    { id: 'n_164', a: 'Ton corps est magnétique et attire les couverts en métal', b: 'Ton corps génère une électricité statique extrême', category: 'Corporel' },
    { id: 'n_165', a: 'Devoir porter une bouée canard autour de la taille en permanence', b: 'Devoir porter un monocle et un chapeau haut-de-forme', category: 'Social' },
    { id: 'n_166', a: 'Tu peux faire pousser des plantes instantanément, mais elles chantent toutes du rap', b: 'Tu peux contrôler les insectes, mais ils sont très paresseux', category: 'WTF' },
    { id: 'n_167', a: 'Avoir une peau transparente', b: 'Avoir des os en caoutchouc', category: 'Corporel' },
    { id: 'n_168', a: 'Vivre sans musique', b: 'Vivre sans histoires (livres, films, séries)', category: 'Logique Absurde' },
    { id: 'n_169', a: 'Les animaux en peluche te parlent quand personne ne regarde', b: 'Les nains de jardin se déplacent quand tu as le dos tourné', category: 'WTF' },
    { id: 'n_170', a: 'Devoir applaudir à chaque atterrissage d\'avion, même si tu n\'es pas dedans', b: 'Devoir crier "Santé !" à chaque fois que quelqu\'un éternue, où que tu sois', category: 'Social' },
    { id: 'n_171', a: 'Tes cheveux sont des nouilles ramen (cuites)', b: 'Tes doigts sont des saucisses cocktail', category: 'Corporel' },
    { id: 'n_172', a: 'Ne plus jamais avoir besoin de recharger ton téléphone', b: 'Avoir une connexion internet ultra-rapide partout, tout le temps', category: 'Logique Absurde' },
    { id: 'n_173', a: 'Tu peux sauter aussi haut qu\'un immeuble, mais tu ne contrôles pas l\'atterrissage', b: 'Tu peux courir aussi vite qu\'une voiture, mais tu ne peux pas tourner', category: 'WTF' },
    { id: 'n_174', a: 'Devoir communiquer uniquement avec des mèmes', b: 'Devoir communiquer uniquement avec des émojis', category: 'Social' },
    { id: 'n_175', a: 'Avoir une peau qui pèle comme un serpent une fois par mois', b: 'Avoir une langue qui se divise en deux comme un serpent', category: 'Corporel' },
    { id: 'n_176', a: 'Ne plus jamais pouvoir manger de plats chauds', b: 'Ne plus jamais pouvoir boire de boissons fraîches', category: 'Logique Absurde' },
    { id: 'n_177', a: 'Tu peux créer de la nourriture à partir de rien, mais elle n\'a aucun goût', b: 'Tu peux rendre n\'importe quel plat délicieux, mais tu ne peux pas le manger', category: 'WTF' },
    { id: 'n_178', a: 'Avoir une tête de taille normale mais un corps minuscule', b: 'Avoir un corps de taille normale mais une tête minuscule', category: 'Corporel' },
    { id: 'n_179', a: 'Devoir porter des lunettes qui te montrent tout le monde en sous-vêtements', b: 'Devoir porter des écouteurs qui te font entendre les pensées des gens sur toi', category: 'Social' },
    { id: 'n_180', a: 'Le bouton "snooze" de ton réveil n\'existe plus', b: 'Ton lit te catapulte au réveil', category: 'WTF' },
    { id: 'n_181', a: 'Tes oreilles peuvent bouger indépendamment comme celles d\'un chien', b: 'Ton nez peut remuer comme celui d\'un lapin', category: 'Corporel' },
    { id: 'n_182', a: 'Avoir un jingle publicitaire personnel qui se joue quand tu entres dans une pièce', b: 'Avoir un slogan personnel que tu dois dire en partant', category: 'Social' },
    { id: 'n_183', a: 'Être un super-héros dont le seul pouvoir est de trouver des places de parking', b: 'Être un super-vilain dont le seul crime est de voler la chaussette gauche de tout le monde', category: 'Logique Absurde' },
    { id: 'n_184', a: 'Ton corps est toujours à une température de 10°C', b: 'Ton corps est toujours à une température de 40°C (sans que ce soit dangereux)', category: 'Corporel' },
    { id: 'n_185', a: 'Les portes automatiques ne s\'ouvrent jamais pour toi', b: 'Les escalators s\'arrêtent toujours quand tu montes dessus', category: 'WTF' },
    { id: 'n_186', a: 'Devoir dire "lol" à voix haute au lieu de rire', b: 'Devoir faire un bruit de "notification" avant de prendre la parole', category: 'Social' },
    { id: 'n_187', a: 'Avoir un troisième oeil qui ne voit que les choses embarrassantes', b: 'Avoir une deuxième bouche qui ne dit que des vérités dérangeantes', category: 'Corporel' },
    { id: 'n_188', a: 'Tu peux parler aux ordinateurs, mais ils sont tous passifs-agressifs', b: 'Tu peux réparer n\'importe quoi en le tapant, mais ça casse autre chose au hasard', category: 'WTF' },
    { id: 'n_189', a: 'Vivre ta vie à l\'envers, de la vieillesse à la naissance', b: 'Revivre ta vie en boucle, en gardant tes souvenirs', category: 'Logique Absurde' },
    { id: 'n_190', a: 'Avoir une chevelure faite de fibres optiques lumineuses', b: 'Avoir une peau qui affiche des motifs comme un écran de veille', category: 'Corporel' },
    { id: 'n_191', a: 'Devoir porter un costume de sumo gonflable en public', b: 'Devoir te déplacer uniquement en "marchant comme un crabe"', category: 'Social' },
    { id: 'n_192', a: 'Tu peux respirer du feu, mais tu es aussi très inflammable', b: 'Tu peux lancer des éclairs, mais tu attires la foudre', category: 'WTF' },
    { id: 'n_193', a: 'Avoir des mains parfaitement symétriques (deux mains gauches ou deux mains droites)', b: 'Avoir deux pieds gauches', category: 'Corporel' },
    { id: 'n_194', a: 'Ne plus jamais pouvoir fermer les portes', b: 'Ne plus jamais pouvoir fermer les tiroirs', category: 'Logique Absurde' },
    { id: 'n_195', a: 'Avoir un rire qui fait pleurer les gens', b: 'Avoir des larmes qui font rire les gens', category: 'Social' },
    { id: 'n_196', a: 'Les nuages te suivent et commentent tes actions', b: 'Le vent te chuchote des secrets inutiles', category: 'WTF' },
    { id: 'n_197', a: 'Ton corps est creux et fait un bruit de xylophone quand on le tape', b: 'Tes articulations grincent comme une porte rouillée', category: 'Corporel' },
    { id: 'n_198', a: 'Devoir résoudre une équation mathématique complexe pour démarrer ta voiture chaque matin', b: 'Devoir gagner une partie de pierre-feuille-ciseaux contre ton grille-pain pour avoir des toasts', category: 'Logique Absurde' },
    { id: 'n_199', a: 'Tu peux manger n\'importe quoi (métal, bois, etc.) sans danger', b: 'Tu peux survivre à n\'importe quelle chute, mais tu ressens toute la douleur', category: 'WTF' },
    { id: 'n_200', a: 'Ne pouvoir s\'asseoir que sur des chaises pour enfants', b: 'Ne pouvoir manger qu\'avec des couverts pour géants', category: 'Social' },
];
  const hardDilemmas = [
    // Les 50 originaux
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
    
    // Nouveaux dilemmes (150)
    { id: 'h_51', a: "Manger une barre de savon entière", b: "Boire une bouteille de parfum", category: 'Dégoûtant' },
    { id: 'h_52', a: "Ton/ta partenaire avoue avoir une liaison avec ton sosie", b: "Ton sosie avoue avoir une liaison avec ton/ta partenaire", category: 'Malaise' },
    { id: 'h_53', a: "Tu peux sauver 5 personnes en poussant une personne très obèse sur des rails pour arrêter un train", b: "Ne rien faire et laisser les 5 personnes mourir (problème du tramway)", category: 'Moral' },
    { id: 'h_54', a: "Te réveiller avec la langue collée à un poteau gelé", b: "Te réveiller avec les mains collées à du papier tue-mouches", category: 'Dégoûtant' },
    { id: 'h_55', a: "Devoir faire le son de l'animal que tu manges avant chaque bouchée", b: "Devoir t'excuser auprès de chaque légume que tu coupes", category: 'Malaise' },
    { id: 'h_56', a: "Sacrifier 10 ans de ta vie pour garantir le bonheur éternel à ton/ta meilleur(e) ami(e)", b: "Vivre ta vie normalement", category: 'Moral' },
    { id: 'h_57', a: "Lécher la transpiration du dos de quelqu'un à la salle de sport", b: "Boire l'eau d'un bain après que quelqu'un s'y soit lavé", category: 'Dégoûtant' },
    { id: 'h_58', a: "Tomber amoureux d'une intelligence artificielle très avancée", b: "Que ton grille-pain tombe amoureux de toi et devienne très jaloux", category: 'Malaise' },
    { id: 'h_59', a: "Avoir la capacité de lire dans les pensées, mais tu ne peux pas la désactiver", b: "Que tout le monde puisse lire dans tes pensées, mais seulement le jeudi", category: 'Moral' },
    { id: 'h_60', a: "Manger une poignée de fourmis vivantes", b: "Mâcher un nid de guêpes vide", category: 'Dégoûtant' },
    //... (et ainsi de suite jusqu'à 200)
    { id: 'h_61', a: 'Tu peux sauver ta famille en condamnant la famille de ton voisin', b: 'Tu ne fais rien, et une des deux familles est condamnée au hasard', category: 'Moral' },
    { id: 'h_62', a: 'Devoir porter en permanence des vêtements couverts de fausses taches de vomi', b: 'Devoir porter des chaussures qui laissent des traces de pas marron et suspectes', category: 'Malaise' },
    { id: 'h_63', a: 'Te nourrir exclusivement de la nourriture que tu trouves dans les poubelles des restaurants', b: 'Te nourrir exclusivement des restes des plateaux des autres au restaurant universitaire', category: 'Dégoûtant' },
    { id: 'h_64', a: 'Ton premier baiser est accidentellement avec un membre de ta famille éloigné', b: 'Ton/ta partenaire avoue que son premier baiser était avec son propre cousin/sa propre cousine', category: 'Malaise' },
    { id: 'h_65', a: 'Vivre une vie de luxe en sachant que c\'est grâce à l\'argent d\'un cartel', b: 'Vivre une vie modeste mais honnête', category: 'Moral' },
    { id: 'h_66', a: 'Boire l\'eau de la cuvette des toilettes (propres, juste après la chasse)', b: 'Manger une cuillère de litière pour chat (non utilisée)', category: 'Dégoûtant' },
    { id: 'h_67', a: 'Passer pour le héros d\'une situation que tu as secrètement provoquée', b: 'Être accusé d\'avoir provoqué une catastrophe que tu as en réalité empêchée', category: 'Moral' },
    { id: 'h_68', a: 'Ton corps se décompose lentement mais tu ne peux pas mourir', b: 'Tu es immortel mais tu ne peux plus rien ressentir, ni douleur ni plaisir', category: 'Malaise' },
    { id: 'h_69', a: 'Arracher tous tes ongles avec une pince', b: 'Arracher tous tes cils un par un', category: 'Dégoûtant' },
    { id: 'h_70', a: 'Mentir à ton/ta partenaire pour le/la protéger d\'une vérité qui le/la détruirait', b: 'Lui dire la vérité, même si ça brise votre couple et sa vie', category: 'Moral' },
    { id: 'h_71', a: 'Découvrir que tes parents ne sont pas tes vrais parents', b: 'Découvrir que tu as un enfant dont tu ignorais l\'existence', category: 'Malaise' },
    { id: 'h_72', a: 'Manger une cuillère de beurre rance', b: 'Boire un verre de lait qui a tourné', category: 'Dégoûtant' },
    { id: 'h_73', a: 'Avoir le pouvoir de réaliser un vœu, mais il se réalisera de la pire façon possible ("patte de singe")', b: 'Ne jamais avoir de vœu exaucé', category: 'Moral' },
    { id: 'h_74', a: 'Devoir chanter à tue-tête la chanson que tu détestes le plus en public', b: 'Devoir porter un t-shirt avec "Je suis stupide" écrit dessus', category: 'Malaise' },
    { id: 'h_75', a: 'Utiliser du papier de verre comme papier toilette une seule fois', b: 'Utiliser du Tabasco comme collyre une seule fois', category: 'Dégoûtant' },
    { id: 'h_76', a: 'Tu peux effacer la mémoire d\'une personne d\'un événement traumatisant, mais tu en hérites à sa place', b: 'Laisser cette personne vivre avec son traumatisme', category: 'Moral' },
    { id: 'h_77', a: 'Ton date Tinder se révèle être ton prof de fac', b: 'Ton nouveau patron se révèle être ton ex que tu as largué par texto', category: 'Malaise' },
    { id: 'h_78', a: 'Passer un week-end entier dans une porcherie', b: 'Passer un week-end entier dans une décharge publique', category: 'Dégoûtant' },
    { id: 'h_79', a: 'Être obligé de trahir ton pays pour sauver ta famille', b: 'Rester loyal et laisser ta famille être condamnée', category: 'Moral' },
    { id: 'h_80', a: 'Ton corps sue de la colle en permanence', b: 'Ton corps sécrète une fine couche de graisse', category: 'Dégoûtant' },
    { id: 'h_81', a: 'Devoir lire à voix haute la conversation de groupe de tes ami(e)s où ils/elles parlent de toi', b: 'Devoir lire à voix haute tes messages privés les plus honteux', category: 'Malaise' },
    { id: 'h_82', a: 'Tu peux sauver 1000 personnes en sacrifiant une personne que tu aimes profondément', b: 'Laisser les 1000 personnes mourir', category: 'Moral' },
    { id: 'h_83', a: 'Te faire un piercing à la langue avec une agrafeuse', b: 'Te faire tatouer par un ami ivre', category: 'Dégoûtant' },
    { id: 'h_84', a: 'Avoir une discussion sérieuse avec quelqu\'un qui a un filet de bave au coin de la bouche', b: 'Être celui qui a le filet de bave', category: 'Malaise' },
    { id: 'h_85', a: 'Être le seul survivant d\'une catastrophe, avec le poids de la culpabilité', b: 'Mourir avec tout le monde', category: 'Moral' },
    { id: 'h_86', a: 'Manger la peau morte de tes pieds', b: 'Mâcher tes propres cheveux', category: 'Dégoûtant' },
    { id: 'h_87', a: 'Devoir t\'excuser pour quelque chose que tu n\'as pas fait et aller en prison pour un an', b: 'Laisser une personne innocente aller en prison pour un an à ta place', category: 'Moral' },
    { id: 'h_88', a: 'Ton psy est le parent de ton/ta pire ennemi(e)', b: 'Ton gynécologue/urologue est ton ex', category: 'Malaise' },
    { id: 'h_89', a: 'Dormir sur un oreiller trempé de bave d\'inconnu', b: 'Utiliser la brosse à dents de quelqu\'un que tu ne connais pas', category: 'Dégoûtant' },
    { id: 'h_90', a: 'Avoir la certitude qu\'il y a une vie après la mort mais ne pas savoir si c\'est le paradis ou l\'enfer', b: 'Avoir la certitude qu\'il n\'y a absolument rien après la mort', category: 'Moral' },
    { id: 'h_91', a: 'Devoir faire une présentation importante avec une grosse tache de transpiration sous les bras', b: 'Devoir faire une présentation importante en réalisant que tu as mis ton t-shirt à l\'envers', category: 'Malaise' },
    { id: 'h_92', a: 'Boire l\'eau de cuisson des saucisses', b: 'Manger la gélatine d\'une boîte de conserve de viande', category: 'Dégoûtant' },
    { id: 'h_93', a: 'Vivre heureux dans une simulation parfaite (comme dans Matrix) en le sachant', b: 'Vivre dans le monde réel avec toutes ses imperfections', category: 'Moral' },
    { id: 'h_94', a: 'Te tromper de prénom en appelant ton/ta partenaire pendant un moment intime', b: 'Que ton/ta partenaire se trompe de prénom en t\'appelant pendant un moment intime', category: 'Malaise' },
    { id: 'h_95', a: 'Se curer le nez et manger ce que tu y trouves', b: 'Lécher l\'intérieur d\'une poubelle propre', category: 'Dégoûtant' },
    { id: 'h_96', a: 'Accepter de torturer une personne (un criminel) pour obtenir des informations qui sauveraient des centaines de vies', b: 'Refuser la torture et laisser les centaines de vies être menacées', category: 'Moral' },
    { id: 'h_97', a: 'Ta mère te donne des conseils sexuels très détaillés et illustrés', b: 'Tes grands-parents t\'offrent des sextoys pour ton anniversaire', category: 'Malaise' },
    { id: 'h_98', a: 'Manger un cafard grillé', b: 'Boire le lait d\'un rat', category: 'Dégoûtant' },
    { id: 'h_99', a: 'Sauver ton propre enfant ou sauver deux enfants inconnus', b: 'Laisser le sort décider', category: 'Moral' },
    { id: 'h_100', a: 'Le silence est total lorsque tu arrives dans une pièce où tout le monde parlait', b: 'Tout le monde éclate de rire quand tu entres dans une pièce', category: 'Malaise' },
    { id: 'h_101', a: 'Tu peux obtenir la réponse à une seule question sur l\'univers, mais cette réponse te rendra fou', b: 'Rester ignorant mais sain d\'esprit', category: 'Moral' },
    { id: 'h_102', a: 'Lécher une rampe de métro', b: 'Manger un chewing-gum trouvé par terre', category: 'Dégoûtant' },
    { id: 'h_103', a: 'Devoir avouer ton secret le plus honteux à tes parents', b: 'Devoir écouter le secret le plus honteux de tes parents', category: 'Malaise' },
    { id: 'h_104', a: 'Vivre éternellement mais voir tous tes proches mourir', b: 'Mourir à 30 ans mais en sachant que tes proches vivront heureux pour toujours', category: 'Moral' },
    { id: 'h_105', a: 'Tes oreilles produisent du cérumen en quantité industrielle', b: 'Ta bouche produit une salive épaisse et filandreuse', category: 'Dégoûtant' },
    { id: 'h_106', a: 'Ton/ta partenaire veut que vous portiez des couches et parliez comme des bébés', b: 'Ton/ta partenaire veut que vous vous déguisiez en vos parents respectifs', category: 'Malaise' },
    { id: 'h_107', a: 'Sacrifier ton bonheur personnel pour le bien de l\'humanité', b: 'Être heureux dans un monde qui s\'effondre', category: 'Moral' },
    { id: 'h_108', a: 'Manger une soupe faite avec l\'eau de vaisselle sale', b: 'Boire l\'eau d\'un vase qui a contenu des fleurs fanées pendant un mois', category: 'Dégoûtant' },
    { id: 'h_109', a: 'Tu es la seule personne à te souvenir d\'un ami proche qui a été effacé de l\'existence', b: 'Être effacé de l\'existence et personne ne se souvient de toi', category: 'Malaise' },
    { id: 'h_110', a: 'Savoir qu\'une personne sur dix que tu croises est un imposteur (extraterrestre, robot...) mais ne pas savoir qui', b: 'Vivre dans l\'ignorance bienheureuse', category: 'Moral' },
    { id: 'h_111', a: 'Nettoyer des toilettes publiques avec ta propre chemise', b: 'Marcher pieds nus dans une ruelle pleine de détritus', category: 'Dégoûtant' },
    { id: 'h_112', a: 'Devoir écouter un enregistrement de tes propres ronflements et pets pendant 8 heures', b: 'Devoir regarder un enregistrement de toi en train de dormir, filmé par un inconnu', category: 'Malaise' },
    { id: 'h_113', a: 'Tu peux guérir n\'importe quelle maladie, mais pour ce faire, tu dois la contracter d\'abord', b: 'Laisser les gens malades', category: 'Moral' },
    { id: 'h_114', a: 'Avoir en permanence des miettes de nourriture dans ton lit', b: 'Avoir en permanence un cheveu dans ta bouche', category: 'Dégoûtant' },
    { id: 'h_115', a: 'Ton patron te demande de lui faire un massage des pieds', b: 'Un de tes collègues te demande de lui renifler l\'aisselle pour savoir s\'il sent mauvais', category: 'Malaise' },
    { id: 'h_116', a: 'Être forcé de détruire une œuvre d\'art inestimable pour sauver 10 personnes', b: 'Sauver l\'œuvre d\'art et laisser les 10 personnes mourir', category: 'Moral' },
    { id: 'h_117', a: 'Te faire vomir dessus par un inconnu ivre', b: 'Marcher dans une énorme flaque de vomi', category: 'Dégoûtant' },
    { id: 'h_118', a: 'Ton corps ne guérit plus jamais. La moindre coupure reste à vie.', b: 'Ton corps guérit instantanément mais tu ne gardes aucune cicatrice, aucun souvenir de la douleur.', category: 'Malaise' },
    { id: 'h_119', a: 'Choisir un étranger au hasard pour qu\'il meure et ainsi éradiquer la faim dans le monde', b: 'Ne pas faire ce choix', category: 'Moral' },
    { id: 'h_120', a: 'Dormir dans des draps qui ont une légère odeur de moisissure', b: 'Porter des sous-vêtements qui ont une légère odeur d\'urine', category: 'Dégoûtant' },
    { id: 'h_121', a: 'Ton crush te surprend en train de te curer le nez profondément', b: 'Ton crush te surprend en train de parler tout seul à une plante', category: 'Malaise' },
    { id: 'h_122', a: 'Tu peux devenir la personne la plus intelligente du monde, mais tu perdras toute capacité d\'empathie', b: 'Rester comme tu es', category: 'Moral' },
    { id: 'h_123', a: 'Manger un œuf fécondé avec l\'embryon visible', b: 'Boire un verre de bile', category: 'Dégoûtant' },
    { id: 'h_124', a: 'Découvrir que toute ta vie n\'est qu\'une émission de télé-réalité', b: 'Découvrir que tu es le seul être humain réel et que tous les autres sont des robots', category: 'Malaise' },
    { id: 'h_125', a: 'Avoir le pouvoir de ramener quelqu\'un à la vie, mais quelqu\'un d\'autre doit mourir à sa place', b: 'Laisser les morts en paix', category: 'Moral' },
    { id: 'h_126', a: 'Avoir un bouton dans le dos que tu ne peux pas atteindre et qui te démange en permanence', b: 'Avoir en permanence la sensation d\'avoir un cheveu sur la langue', category: 'Dégoûtant' },
    { id: 'h_127', a: 'Tu te réveilles un matin et tu es du sexe opposé, définitivement.', b: 'Tu te réveilles un matin et tu as 20 ans de plus.', category: 'Malaise' },
    { id: 'h_128', a: 'Tu peux donner une vie parfaite à ton enfant, mais il ne t\'aimera jamais', b: 'Avoir une relation aimante avec ton enfant qui aura une vie difficile', category: 'Moral' },
    { id: 'h_129', a: 'Manger une boîte de nourriture pour chien', b: 'Boire l\'eau d\'un aquarium', category: 'Dégoûtant' },
    { id: 'h_130', a: 'Être célèbre pour quelque chose de terriblement embarrassant', b: 'Être complètement anonyme et oublié de tous', category: 'Malaise' },
    { id: 'h_131', a: 'Tu dois choisir quel membre de ta famille sacrifier pour sauver les autres', b: 'Refuser de choisir, ce qui les condamne tous', category: 'Moral' },
    { id: 'h_132', a: 'Avoir des ongles qui poussent vers l\'intérieur', b: 'Avoir des dents qui poussent continuellement comme un rongeur', category: 'Dégoûtant' },
    { id: 'h_133', a: 'Ton rencard te demande si tu peux payer car il/elle a "oublié son portefeuille"', b: 'Ton rencard passe toute la soirée à parler de son ex', category: 'Malaise' },
    { id: 'h_134', a: 'Vivre dans un monde sans mensonges, où tout le monde dit la vérité brute', b: 'Vivre dans un monde où tout le monde ment pour ne pas blesser les autres', category: 'Moral' },
    { id: 'h_135', a: 'Fouiller dans une benne à ordures pleine de couches usagées', b: 'Nettoyer une scène de crime', category: 'Dégoûtant' },
    { id: 'h_136', a: 'Tu es le seul à savoir que la fin du monde est dans 24 heures', b: 'Tout le monde sait que la fin du monde est dans 24 heures, sauf toi', category: 'Malaise' },
    { id: 'h_137', a: 'Être un génie incompris et solitaire', b: 'Être un imbécile heureux et très populaire', category: 'Moral' },
    { id: 'h_138', a: 'Boire le liquide qui s\'est accumulé dans un vieux pneu', b: 'Manger un champignon qui a poussé entre tes orteils', category: 'Dégoûtant' },
    { id: 'h_139', a: 'Devoir accoucher d\'un enfant qui n\'est pas le tien devant le vrai père/la vraie mère', b: 'Devoir assister à l\'autopsie d\'un de tes proches', category: 'Malaise' },
    { id: 'h_140', a: 'Tu peux mettre fin à toutes les guerres, mais pour cela, l\'humanité perdra le libre arbitre', b: 'Laisser l\'humanité telle qu\'elle est', category: 'Moral' },
    { id: 'h_141', a: 'Avoir une sueur qui dissout les vêtements en fibres synthétiques', b: 'Avoir des larmes acides qui brûlent légèrement la peau', category: 'Dégoûtant' },
    { id: 'h_142', a: 'Ton corps est contrôlé par un joueur de jeu vidéo maladroit', b: 'Tu peux entendre les pensées du développeur qui a codé ta réalité, et il est dépressif', category: 'Malaise' },
    { id: 'h_143', a: 'Sauver 10 personnes innocentes ou ton animal de compagnie qui est comme ton enfant', b: 'Laisser le destin choisir', category: 'Moral' },
    { id: 'h_144', a: 'Manger un plat qui a été mâché et recraché par quelqu\'un d\'autre', b: 'Boire l\'eau dans laquelle quelqu\'un a lavé ses pieds', category: 'Dégoûtant' },
    { id: 'h_145', a: 'Tu peux choisir le moment exact de ta mort', b: 'Vivre sans jamais savoir quand tu vas mourir', category: 'Malaise' },
    { id: 'h_146', a: 'Être un dieu tout-puissant mais être totalement indifférent au sort de l\'univers', b: 'Être un simple mortel qui se soucie profondément des autres mais qui est impuissant', category: 'Moral' },
    { id: 'h_147', a: 'Avoir une colonie de fourmis vivant sous ta peau', b: 'Avoir un ver solitaire comme seul ami et confident', category: 'Dégoûtant' },
    { id: 'h_148', a: 'Devoir revivre en boucle ta journée la plus humiliante', b: 'Devoir oublier complètement ton souvenir le plus heureux', category: 'Malaise' },
    { id: 'h_149', a: 'Découvrir le remède contre le cancer, mais il est fabriqué à partir de bébés orphelins', b: 'Laisser le cancer sans remède', category: 'Moral' },
    { id: 'h_150', a: 'Ouvrir une boîte de conserve et y trouver un rat mort', b: 'Boire dans une brique de jus de fruits et sentir un gros morceau non identifié', category: 'Dégoûtant' },
    { id: 'h_151', a: 'Tu peux savoir ce que ressentent les autres en les touchant, y compris leur douleur physique et émotionnelle', b: 'Ne jamais pouvoir comprendre ce que les autres ressentent', category: 'Moral' },
    { id: 'h_152', a: 'Passer une IRM et découvrir qu\'il y a une araignée vivante dans ton cerveau (elle ne te fait aucun mal)', b: 'Devoir avaler une pilule contenant les œufs d\'un parasite pour un traitement médical', category: 'Dégoûtant' },
    { id: 'h_153', a: 'Tu es dans un coma et tu entends ta famille décider de te débrancher', b: 'Tu es un fantôme et tu vois ta famille refaire sa vie et t\'oublier peu à peu', category: 'Malaise' },
    { id: 'h_154', a: 'Vivre dans un monde où personne ne peut mourir, menant à une surpopulation et une misère extrêmes', b: 'Appuyer sur un bouton qui tue la moitié de la population au hasard pour restaurer l\'équilibre', category: 'Moral' },
    { id: 'h_155', a: 'Avoir une haleine qui sent les égouts en permanence', b: 'Avoir des rots qui sentent le cadavre en décomposition', category: 'Dégoûtant' },
    { id: 'h_156', a: 'Être obligé de rire à toutes les blagues, même les plus racistes ou offensantes', b: 'Ne plus jamais pouvoir rire, même à la chose la plus drôle du monde', category: 'Malaise' },
    { id: 'h_157', a: 'Avoir la connaissance absolue de l\'univers, mais être incapable de la communiquer à qui que ce soit', b: 'Être capable de convaincre n\'importe qui de n\'importe quoi, même de choses fausses', category: 'Moral' },
    { id: 'h_158', a: 'Manger la croûte d\'une vieille plaie', b: 'Boire le pus d\'un bouton infecté', category: 'Dégoûtant' },
    { id: 'h_159', a: 'Ton corps vieillit normalement, mais ton esprit régresse mentalement jusqu\'à redevenir un bébé', b: 'Ton esprit vieillit normalement, mais ton corps rajeunit jusqu\'à redevenir un bébé', category: 'Malaise' },
    { id: 'h_160', a: 'Tu peux garantir la paix mondiale, mais pour cela tu dois effacer toute l\'histoire de l\'humanité', b: 'Conserver l\'histoire avec tous ses conflits', category: 'Moral' },
    { id: 'h_161', a: 'Devoir porter des chaussettes déjà portées par un inconnu pendant une semaine', b: 'Devoir dormir sur un oreiller utilisé par 100 inconnus différents', category: 'Dégoûtant' },
    { id: 'h_162', a: 'Tu es un personnage de jeu vidéo et tu vois le joueur sauvegarder juste avant de tenter quelque chose de très dangereux avec toi', b: 'Tu es un personnage de jeu vidéo et le joueur décide d\'arrêter de jouer pour toujours, te laissant dans le vide', category: 'Malaise' },
    { id: 'h_163', a: 'Savoir que tes parents ont conçu un "bébé médicament" pour te sauver, et qu\'ils l\'aiment plus que toi', b: 'Apprendre que tu as été adopté et que tes parents biologiques sont des criminels notoires', category: 'Malaise' },
    { id: 'h_164', a: 'Recevoir une transfusion sanguine d\'une personne que tu méprises', b: 'Devoir donner ton sang pour sauver la vie d\'une personne que tu méprises', category: 'Moral' },
    { id: 'h_165', a: 'Avoir une langue de chat (râpeuse)', b: 'Avoir des dents de castor (qui ne cessent de pousser)', category: 'Dégoûtant' },
    { id: 'h_166', a: 'Vivre dans une société où ton statut social est déterminé par une note sur 5, comme dans Black Mirror', b: 'Vivre dans une société sans loi, où seule la force compte', category: 'Moral' },
    { id: 'h_167', a: 'Ton ombre te murmure constamment tes plus grandes peurs', b: 'Ton reflet dans le miroir te montre ce que tu serais devenu si tu avais fait de meilleurs choix', category: 'Malaise' },
    { id: 'h_168', a: 'Se faire retirer toutes les dents sans anesthésie', b: 'Se faire amputer un doigt sans anesthésie', category: 'Dégoûtant' },
    { id: 'h_169', a: 'Tu peux choisir une personne qui mourra dans d\'atroces souffrances pour sauver le reste de l\'humanité de la douleur éternelle', b: 'Condamner l\'humanité à la douleur éternelle', category: 'Moral' },
    { id: 'h_170', a: 'Ton partenaire avoue qu\'il/elle est un(e) tueur/tueuse en série, mais qu\'il/elle ne te fera jamais de mal', b: 'Découvrir que ton voisin est un(e) tueur/tueuse en série et qu\'il/elle t\'observe', category: 'Malaise' },
    { id: 'h_171', a: 'Boire l\'eau stagnante d\'un marécage', b: 'Manger de la terre d\'un cimetière', category: 'Dégoûtant' },
    { id: 'h_172', a: 'Devoir vivre avec quelqu\'un qui te ressemble trait pour trait et qui imite tout ce que tu fais, 24h/24', b: 'Devoir vivre dans une maison entièrement faite de miroirs', category: 'Malaise' },
    { id: 'h_173', a: 'Accepter que ton enfant soit moins intelligent que la moyenne mais incroyablement gentil', b: 'Accepter que ton enfant soit un génie mais complètement dépourvu de gentillesse', category: 'Moral' },
    { id: 'h_174', a: 'Tes larmes sont de la mayonnaise', b: 'Tes crottes de nez sont des cornichons miniatures', category: 'Dégoûtant' },
    { id: 'h_175', a: 'Devoir assister à une réunion très importante avec le bruit d\'une chasse d\'eau qui n\'arrête pas de se remplir en fond sonore', b: 'Devoir faire un discours émouvant pendant que quelqu\'un passe l\'aspirateur juste à côté', category: 'Malaise' },
    { id: 'h_176', a: 'Tu peux avoir un corps parfait, mais tu dois tuer un chiot mignon chaque année pour le maintenir', b: 'Garder ton corps actuel', category: 'Moral' },
    { id: 'h_177', a: 'Avoir une écharde sous l\'ongle que tu ne peux pas enlever', b: 'Avoir un aphte sur la langue en permanence', category: 'Dégoûtant' },
    { id: 'h_178', a: 'Tu es un extraterrestre qui doit disséquer un humain pour sauver ta planète, et ta cible est ton meilleur ami humain', b: 'Laisser ta planète mourir', category: 'Moral' },
    { id: 'h_179', a: 'Tes pets sont visibles, comme des petits nuages colorés', b: 'Tes rots sont silencieux mais mortellement toxiques pour les plantes d\'intérieur', category: 'Malaise' },
    { id: 'h_180', a: 'Manger une omelette faite avec des œufs pourris', b: 'Boire un verre de jus d\'orange mélangé avec de l\'huile de vidange', category: 'Dégoûtant' },
    { id: 'h_181', a: 'Devoir choisir lequel de tes deux enfants tu sauves d\'un incendie', b: 'Mourir en essayant de les sauver tous les deux, sans garantie de succès', category: 'Moral' },
    { id: 'h_182', a: 'Te réveiller au milieu de ta propre opération chirurgicale, paralysé mais pouvant tout sentir', b: 'Te réveiller dans un cercueil, enterré vivant', category: 'Malaise' },
    { id: 'h_183', a: 'Avoir un acouphène permanent qui est le son d\'une personne mâchant la bouche ouverte', b: 'Avoir une vision périphérique qui te montre constamment des araignées qui n\'existent pas', category: 'Dégoûtant' },
    { id: 'h_184', a: 'Être un vampire qui doit se nourrir de ses proches pour survivre', b: 'Se laisser mourir de faim', category: 'Moral' },
    { id: 'h_185', a: 'Avoir une conversation de cœur à cœur avec quelqu\'un qui a un énorme morceau de morve séchée sur le visage', b: 'Être la personne avec le morceau de morve', category: 'Malaise' },
    { id: 'h_186', a: 'Vivre une vie incroyable mais savoir qu\'à ta mort, tous tes souvenirs et ton impact sur le monde seront effacés', b: 'Vivre une vie médiocre mais laisser une trace indélébile dans l\'histoire', category: 'Moral' },
    { id: 'h_187', a: 'Lécher le sol des toilettes d\'une aire d\'autoroute', b: 'Manger la nourriture moisie au fond du bac à légumes du frigo', category: 'Dégoûtant' },
    { id: 'h_188', a: 'Tu peux lire l\'avenir, mais chaque fois que tu le fais, tu perds un souvenir précieux', b: 'Vivre dans l\'incertitude mais garder tes souvenirs', category: 'Moral' },
    { id: 'h_189', a: 'Tes genoux sont à l\'envers', b: 'Tes bras sont attachés à l\'envers (paumes vers l\'avant)', category: 'Dégoûtant' },
    { id: 'h_190', a: 'Ton âme sœur est une personne que tu détestes au plus haut point', b: 'Tu n\'as pas d\'âme sœur', category: 'Malaise' },
    { id: 'h_191', a: 'Devoir abandonner ton chien dans un refuge pour avoir l\'appartement de tes rêves', b: 'Rester dans un logement insalubre avec ton chien', category: 'Moral' },
    { id: 'h_192', a: 'Ton corps est couvert de bouches miniatures qui murmurent des choses incohérentes', b: 'Ton corps est couvert d\'yeux miniatures qui clignent tous en même temps', category: 'Dégoûtant' },
    { id: 'h_193', a: 'Tu peux devenir le dictateur bienveillant du monde, apportant paix et prospérité mais en supprimant toute liberté individuelle', b: 'Laisser le monde dans son état chaotique actuel', category: 'Moral' },
    { id: 'h_194', a: 'Tu es interviewé à la télévision et tu réalises que tu as une énorme tache de nourriture sur ta chemise', b: 'Tu es l\'intervieweur et tu ne sais pas si tu dois le dire à ton invité', category: 'Malaise' },
    { id: 'h_195', a: 'Être forcé de manger une personne décédée pour survivre (comme dans l\'accident d\'avion des Andes)', b: 'Mourir de faim', category: 'Dégoûtant' },
    { id: 'h_196', a: 'Savoir la date de la mort de tous les gens que tu rencontres', b: 'Savoir que tout le monde connaît la date de ta mort, sauf toi', category: 'Malaise' },
    { id: 'h_197', a: 'Appuyer sur un bouton qui efface la pire erreur de ta vie, mais qui efface aussi la personne que tu aimes le plus', b: 'Vivre avec ton erreur', category: 'Moral' },
    { id: 'h_198', a: 'Te faire greffer la main d\'un meurtrier', b: 'Recevoir le cœur d\'un saint', category: 'Malaise' },
    { id: 'h_199', a: 'Chaque jour, tu dois choisir une espèce animale qui disparaîtra à jamais', b: 'Chaque jour, un humain aléatoire meurt, et ça pourrait être toi', category: 'Moral' },
    { id: 'h_200', a: 'Passer le reste de ta vie dans une prison de luxe, avec tout le confort mais sans liberté', b: 'Être libre mais sans abri et sans ressources', category: 'Moral' },
];

// --- AJOUT : DILEMMES DE LA COMMUNAUTÉ ---
  // C'est ici que tu ajouteras les dilemmes que tu as validés !

  //category : Corporel / Social / WTF / Logique Absurde / Dégoûtant / Malaise / Moral
  let communityDilemmas = []; // On initialise un tableau vide

async function loadCommunityDilemmas() {
  try {
    const response = await fetch(`${BACKEND_BASE}/community-dilemmas`);
    if (!response.ok) {
      console.error('Impossible de charger les dilemmes de la communauté.');
      return; // On ne fait rien en cas d'erreur
    }
    const data = await response.json();
    communityDilemmas = data; // On remplace le tableau vide par les données du serveur
    console.log(`${communityDilemmas.length} dilemmes communautaires chargés !`);
  } catch (error) {
    console.error('Erreur lors du chargement des dilemmes:', error);
  }
}
  
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

  const elems = {
    modeToggle: document.getElementById('mode-toggle'),
    communityModeBtn: document.getElementById('community-mode-btn'), // Ajout du bouton
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
    addBtn: document.getElementById('add-btn'),
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
    installBanner: document.getElementById('install-banner'),
    installBtn: document.getElementById('install-btn'),
    installCloseBtn: document.getElementById('install-close-btn'),
    authorDisplay: document.getElementById('author-display')
  };

  let currentIndex = 0;
  let userProfile = {};
  let currentMode = 'normal';
  let dilemmas = [];
  let deferredInstallPrompt = null;

   // --- LOGIQUE D'INSTALLATION PWA ---
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    elems.installBanner.classList.remove('hidden');
  });

  elems.installBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    deferredInstallPrompt = null;
    elems.installBanner.classList.add('hidden');
  });

  elems.installCloseBtn.addEventListener('click', () => {
    elems.installBanner.classList.add('hidden');
  });

  loadCommunityDilemmas(); 


  // --- LOGIQUE DE JEU (mise à jour) ---

  function setMode(mode) {
    currentMode = mode;

    // 1. Mettre à jour le style du body
    document.body.classList.remove('hard-mode', 'community-mode');
    if (mode === 'hard') document.body.classList.add('hard-mode');
    if (mode === 'community') document.body.classList.add('community-mode');
    
    // 2. Mettre à jour l'état visuel du switch et du bouton
    if (mode === 'community') {
        elems.modeToggle.disabled = true; // Grise le switch
    } else {
        elems.modeToggle.disabled = false; // Réactive le switch
        elems.modeToggle.checked = (mode === 'hard');
    }

    // 3. Sélectionner la source des dilemmes
    let sourceDilemmas;
    switch(mode) {
      case 'hard':
        sourceDilemmas = hardDilemmas;
        break;
      case 'community':
        sourceDilemmas = communityDilemmas;
        break;
      default: // 'normal'
        sourceDilemmas = normalDilemmas;
        break;
    }
    
    // 4. Mélanger et démarrer le jeu
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
    const questionsToShow = Math.min(QUESTIONS_PER_GAME, dilemmas.length);
    if (currentIndex >= questionsToShow || dilemmas.length === 0) {
      showEndScreen();
      return;
    }
    const d = dilemmas[currentIndex];
    elems.currentNum.textContent = currentIndex + 1;
    elems.totalNum.textContent = questionsToShow;
    elems.choiceAText.textContent = d.a;
    elems.choiceBText.textContent = d.b;

    if (d.author) {
      elems.authorDisplay.textContent = `Proposé par : ${d.author}`;
      elems.authorDisplay.classList.remove('hidden');
    } else {
      elems.authorDisplay.classList.add('hidden');
    }
    
    resetChoiceStyles();
  }

  
  function resetChoiceStyles() {
    [elems.choiceA, elems.choiceB].forEach(panel => {
      // On retire toutes les classes de vote et d'animation
      panel.classList.remove('voted', 'chosen', 'not-chosen');
      panel.querySelector('.percentage-display').classList.remove('visible');
      panel.querySelector('.result-bar').style.width = '0%';
      panel.setAttribute('tabindex', '0');
    });
    elems.reportMsg.textContent = '';
    // On cache bien le bouton pour la nouvelle question
    elems.nextBtn.classList.add('hidden');
  }

  async function handleChoice(choiceKey) {
    const d = dilemmas[currentIndex];
    // Empêche de voter plusieurs fois
    if (!d || elems.choiceA.classList.contains('voted')) return;

    elems.clickSound.play();
    [elems.choiceA, elems.choiceB].forEach(p => {
        p.classList.add('voted');
        p.setAttribute('tabindex', '-1');
    });

    // Application des nouvelles classes d'animation
    const chosenPanel = choiceKey === 'a' ? elems.choiceA : elems.choiceB;
    const unchosenPanel = choiceKey === 'a' ? elems.choiceB : elems.choiceA;
    
    chosenPanel.classList.add('chosen');
    unchosenPanel.classList.add('not-chosen');

    // Mise à jour du profil
    if (!userProfile[d.category]) userProfile[d.category] = 0;
    userProfile[d.category]++;

    // Envoi du vote et affichage des stats
    sendVoteToServer(d.id, choiceKey);
    await showPercentages(d.id);

    // Fait apparaître le bouton "Question Suivante"
    elems.nextBtn.classList.remove('hidden');
    elems.nextBtn.focus(); // Pour l'accessibilité
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
  
  elems.communityModeBtn.addEventListener('click', () => {
    // Si on est déjà en mode communauté, on revient au mode du switch. Sinon, on active le mode communauté.
    if (currentMode === 'community') {
      setMode(elems.modeToggle.checked ? 'hard' : 'normal');
    } else {
      setMode('community');
    }
  });
  
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
  
  elems.restartBtn.addEventListener('click', () => setMode(currentMode));
  elems.shareBtn.addEventListener('click', handleShare);

  elems.reportBtn.addEventListener('click', () => {
      elems.reportMsg.textContent = "Signalement envoyé pour analyse.";
  });

  elems.backendUrlInput.value = BACKEND_BASE;
  setMode(elems.modeToggle.checked ? 'hard' : 'normal'); // Démarrage initial


// AJOUT DU GESTIONNAIRE DE FORMULAIRE POUR L'AJOUT DE DILEMMES

  if (formAdd) {
    formAdd.addEventListener('submit', async (e) => {
      e.preventDefault();

      // 1. VÉRIFICATION RECAPTCHA FRONT-END
      if (typeof grecaptcha === 'undefined') {
          setAddMsg("Erreur de chargement reCAPTCHA. Veuillez rafraîchir la page.", 'error');
          return;
      }
      
      const recaptchaToken = grecaptcha.getResponse();

      if (!recaptchaToken) {
          setAddMsg("Veuillez cocher la case \"Je ne suis pas un robot\".", 'error');
          return;
      }

      // Mettre le token dans l'input caché
      if (recaptchaInput) recaptchaInput.value = recaptchaToken; 

      // 2. Validation des champs obligatoires
      if (inputA.value.trim() === '' || inputB.value.trim() === '' || inputCategory.value === '') {
          setAddMsg("Veuillez remplir les champs A, B et choisir une catégorie.", 'error');
          return;
      }

      // 3. CONSTRUCTION DE L'OBJET
      const dilemma = {
          a: inputA.value.trim(),
          b: inputB.value.trim(),
          category: inputCategory.value,
          author: inputAuthor.value.trim() || null,
          'g-recaptcha-response': recaptchaToken // Ajout du token
      };

      setAddMsg("Envoi en cours...", 'info');
      elems.addBtn.disabled = true;

      try {
          const response = await fetch(`${BACKEND_BASE}/add`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(dilemma)
          });

          // 4. Vider le reCAPTCHA immédiatement après l'envoi
          grecaptcha.reset(); 

          if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error || 'Erreur serveur inconnue');
          }

          setAddMsg("Dilemme envoyé avec succès. Il sera modéré avant publication !", 'success');
          formAdd.reset(); // Réinitialise le formulaire

          await loadCommunityDilemmas();
          
      } catch (error) {
          setAddMsg("Erreur lors de l'envoi : " + error.message, 'error');
      } finally {
          elems.addBtn.disabled = false;
      }
    });
  }
  
}); // FIN DE document.addEventListener('DOMContentLoaded', ...