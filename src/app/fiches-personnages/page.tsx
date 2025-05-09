'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import { Card3D } from "@/components/ui/card-3d";

interface Personnage {
  id: string;
  name: string;
  image: string;
  age: string;
  likes: string[];
  dislikes: string[];
  fullDescription: string;
  summary: string;
  anecdotes: string[];
}

const personnages: Personnage[] = [
  {
    id: "juju",
    name: "Juju Justinien Waffeulz",
    image: "/images/persos/Juju.webp",
    age: "21 ans",
    likes: ["Dessiner", "Faire des vidéos avec ses copains", "Les jeux vidéos", "Remonter le morale des gens"],
    dislikes: ["Les gens trop sérieux", "Une partie de sa \"famille\"", "Exploser en public", "Ceux qui utilisent des bloqueurs de pub (bien qu'il le fasse lui-même)"],
    fullDescription: "Banni du royaume de Saint Oreillard pour avoir caricaturé son père le roi, Juju est arrivé à Tortueville avec l'espoir de devenir influenceur. Gentil et hyperactif, cette chauve-souris aime faire rire ses amis et organiser des activités.\n\nDéconnecté de la réalité, il prend rarement les choses au sérieux, ce qui l'aide à surmonter les péripéties de sa vie. Cependant, il a du mal à contrôler ses émotions, un trait dû à son éducation royaliste stricte.\n\nAujourd'hui, il partage une colocation avec ses meilleurs potes, George et Patric, et espère améliorer sa situation pour devenir une star d'Internet, tout en évitant de penser à un futur où il serait séparé d'eux. Juju préfère vivre au jour le jour.",
    summary: "Banni du royaume de Saint Oreillard, Juju est une chauve-souris hyperactive cherchant à devenir influenceur à Tortueville, jonglant entre humour et émotions.",
    anecdotes: [
      "Les prénoms des chauves-souris sont composés en deux parties : la première syllabe du second prénom forme le premier nom, d'où \"Juju\" pour \"Justinien\".",
      "Élevé dans une noblesse très stricte, Juju conserve des manières moyenâgeuses qu'il essaie de cacher et de perdre.",
      "Le dessin a sauvé Juju du stress de devenir roi, lui apportant le bonheur même si cela lui a coûté le trône."
    ]
  },
  {
    id: "george",
    name: "George Brown",
    image: "/images/persos/George.webp",
    age: "25 ans",
    likes: ["La justice sociale", "L'équité pour tous et l'égalité en droit", "La musculation", "Les barbecues"],
    dislikes: ["L'injustice", "Les propos intolérants", "Les réseaux sociaux", "Les chaînes publiques"],
    fullDescription: "George vient d'une famille de criminels de père en fils, bien qu'il l'ignore. Toujours trop gentil pour reprendre le business familial, son père, Jack'Oala Brown, lui a fait croire qu'ils étaient des justiciers combattant l'injustice des privilégiés. Inspiré par cette idée, George a voulu suivre les traces de sa famille en devenant professeur d'éthique et de morale. Cependant, bien qu'il n'ait jamais participé à aucun braquage, il a eu des problèmes avec la justice belge, le forçant à s'exiler en France, où il a rencontré un artiste de rue devenu son meilleur ami.\n\nAujourd'hui, George est professeur au collège-lycée de Tortueville. Ce koala fait de son mieux pour s'intégrer, rendant service même quand on ne lui demande pas. Bien qu'il ne soit pas toujours apprécié pour sa grande bouche, il est utile pour les tâches physiques.",
    summary: "George, un koala professeur d'éthique, ignore son héritage criminel et s'efforce de faire le bien à Tortueville après un exil forcé de Belgique.",
    anecdotes: [
      "George a fait un an de prison ferme injustement et a dû s'échapper car le procureur a oublié de le prévenir de son innocence.",
      "Très influencé par la bien-pensance, George suit toujours le progrès, parfois au détriment de ses opinions réelles.",
      "Sous son hoodie, George est très musclé, ce qui ne se voit pas à cause de ses vêtements amples."
    ]
  },
  {
    id: "patric",
    name: "Patric Vermeil",
    image: "/images/persos/Patric.webp",
    age: "17 ans",
    likes: ["L'écologie", "La botanique", "Méditer", "Les paysages asiatiques et sud-américains", "L'UFC", "Les endroits calmes", "Le tofu"],
    dislikes: ["La violence", "Les gros mots", "Devoir hurler pour se faire entendre", "Les amateurs de viande sur Internet"],
    fullDescription: "Né dans une famille de bouchers, Patric adorait chasser quand il était petit et était un fervent mangeur de viande. Cependant, il a compris qu'il faisait cela pour s'intégrer dans une famille qui le maltraitait à cause de sa petite taille, ce qui lui a causé un profond dégoût pour ces activités et son alimentation.\n\nFâché avec son père, il a quitté sa ville natale de Lyon pour s'installer le plus loin possible, à Tortueville. Là-bas, il a entrepris des études pour devenir vétérinaire, obtenant son diplôme avec mention très bien. Il a trouvé un petit emploi de caissier dans une supérette bio et s'est mis en couple avec une personne ayant des valeurs très différentes des siennes, mais qui l'aime pour ce qu'il est. Il est même devenu vegan.",
    summary: "Patric, un jeune vétérinaire vegan, a fui une famille de bouchers et trouvé sa voie à Tortueville, prônant l'écologie et la non-violence.",
    anecdotes: [
      "Patric s'écrit sans \"K\", contrairement à sa famille dont les noms ont une consonance en \"K\" (Yannic, Warwic).",
      "Il porte des lentilles et réserve ses lunettes pour les longues études afin de ne pas les abîmer.",
      "Patric appelle sa mère tous les soirs, la seule personne de sa famille avec qui il a gardé contact."
    ]
  },
  {
    id: "lauren",
    name: "Lauren \"Tremblay\" Nozaru",
    image: "/images/persos/Lauren.webp",
    age: "23 ans",
    likes: ["Les templiers", "Les sorciers", "Les reconstitutions historiques", "Les mythologies", "Les pancakes", "Fouiller les poubelles", "Voler des objets", "Couper la parole pour parler de ses passions", "Ramener tout sujet à elle"],
    dislikes: ["Qu'on insulte son handicap", "Les rires moqueurs", "Qu'on change ses habitudes", "La poutine sans fromage, lardons ou sauce barbecue (mais elle aime les frites)"],
    fullDescription: "Née au Québec, Lauren vit dans son monde avec peu d'amis en raison de son handicap (TSA). Petite-fille d'Akira Nozaru, le plus vieux templier de \"l'ancienne école\", elle est passionnée par les histoires de son grand-père et aspire à devenir historienne. Le seul endroit où elle peut suivre un master en histoire des templiers est à Tortueville, une ville située dans un autre pays.\n\nInstallée à Tortueville chez Papy Tortue, un vieil ami de son grand-père, elle ne participe pas beaucoup aux activités de Juju et ses amis. Cependant, grâce à sa connaissance approfondie des sorciers, elle parvient à les sauver des pièges et des dangers.",
    summary: "Lauren, une Québécoise avec TSA passionnée par l'histoire des Templiers, étudie à Tortueville et utilise ses connaissances sur les sorciers pour aider ses amis.",
    anecdotes: [
      "Bien qu'issue d'une famille de templiers, Lauren ne déteste pas les sorciers, ayant eu une amie sorcière dans son enfance.",
      "Lauren est kleptomane à cause de sa nature de raton laveur, nécessitant la surveillance de ses amis pendant les courses.",
      "Elle porte deux noms, \"Tremblay\" (mère) et \"Nozaru\" (père), ce dernier d'un clan japonais conservateur qui la déprécie."
    ]
  },
  {
    id: "amaya",
    name: "Amaya",
    image: "/images/persos/Amaya.webp",
    age: "21 ans",
    likes: ["La mode emo", "Le gothique lolita", "La Jpop et la Kpop", "Les jeux de danse et de rythme", "Les films français adaptés de bandes dessinées (qu'elle considère comme de l'art)"],
    dislikes: ["Dormir", "Les hurlements", "Le stress", "Qu'on la drague au comptoir", "Qu'on insulte sa coupe de cheveux"],
    fullDescription: "On ne sait pas grand-chose de la vie d'Amaya. Mise à part qu'elle était mariée très jeune et que son mari l'a vendue au sorcier Tsuku'Yomi pour éponger ses dettes de jeu. Amaya aurait dû passer l'éternité dans un cauchemar sans fin, servant de carburant à l'empereur de la nuit. Cependant, le destin en a décidé autrement et elle fut sauver par Monsieur Lemaire\n\nNaturellement anxieuse, Amaya travaille désormais en France dans un bar nommé \"Les Trois Petits Chats\", où elle observe les citoyens de Tortueville. Épaulé par deux collègues japonaises, Hanako et Azuki, sous la supervision d'un majordome poulpe nommé Lawrence. Amaya semble avoir retrouvé un semblant de bonheur dans sa vie autrefois si triste. Elle est devenue bonne amie avec Juju, avec qui elle partage sa passion pour les jeux de combat. Et Caroline, sa \"bestie\" avec qui elle fait les quatre cents coups.\n\nBien que techniquement toujours esclave d'un autre sorcier, Amaya garde un grand sourire pour son entourage et aime remonter le moral des autres. Elle est également très douée pour la coordination de groupe et pour faire en sorte que les gens s'entendent bien.",
    summary: "Amaya, sauvée d'un sorcier, travaille dans un bar à Tortueville. Anxieuse mais souriante, elle est amie avec Juju et Caroline, et douée pour l'harmonie de groupe.",
    anecdotes: [
      "Amaya a fait promettre à Monsieur Lemaire de ne pas éliminer Juju.",
      "Ses souvenirs ont été partiellement détruits par Lemaire pour éviter des crises d'angoisse mortelles; \"Amaya\" est un nom donné par Lemaire.",
      "Amaya refuse de tuer et cherche toujours des solutions pacifiques."
    ]
  },
  {
    id: "caroline",
    name: "Caroline Magret",
    image: "/images/persos/Caroline.webp",
    age: "19 ans",
    likes: ["Le piano", "Le chant", "Les mangas et animés", "Les visual novels d'amour", "Les petits pois"],
    dislikes: ["Qu'on se moque de son strabisme", "Qu'on l'infantilise", "Qu'on l'ignore", "Qu'on se moque de son bec anormalement long", "Se faire des films", "Les petits pois avec du brocoli"],
    fullDescription: "Fille de la haute bourgeoisie de Tortueville, Caroline Magret a été surprotégée par ses parents en raison de son handicap. Leur réputation étant primordiale, ils ont refusé qu'elle fréquente une école pour éviter d'apporter la honte à la famille Magret. Cela a rendu Caroline très peu sociable et sujette à des crises d'angoisse.\n\nCependant, une fois qu'on la connaît bien, on découvre une fille charmante, joviale, active, et adepte de l'humour absurde. Depuis sa majorité, elle a enfin le droit de se promener seule et a pu se faire des amis, notamment Juju, dont elle est secrètement amoureuse (un secret de Polichinelle), et Amaya, sa meilleure amie. Elle a enfin pu se sociabiliser et partager ses passions, bien que son père la surveille toujours de près.",
    summary: "Caroline, issue de la haute bourgeoisie et surprotégée, s'épanouit à Tortueville grâce à ses amis Juju (dont elle est amoureuse) et Amaya.",
    anecdotes: [
      "Caroline est sous couvre-feu et surveillée par Fiona Deborah, la maîtresse de son père, qui la perd souvent de vue.",
      "Juju semble apprécier Caroline mais craint de s'engager.",
      "Ses cheveux et son bec anormalement gros s'équilibrent, lui évitant de vivre la tête penchée."
    ]
  },
  {
    id: "alice",
    name: "Alice Deschamp",
    image: "/images/persos/Alice.webp",
    age: "25 ans",
    likes: ["La poésie", "La musique classique", "Le bon café", "Les oiseaux qui chantent au printemps", "Le metal symphonique", "L'airsoft", "Les armes à feu"],
    dislikes: ["La vulgarité", "Être sous anxiolytiques", "\"G.E.O.R.G.E\"", "Le rap", "Le ségrégationnisme", "Perdre son béret"],
    fullDescription: "Née au Vietnam avec sa sœur jumelle, Alice (de son vrai nom Linh) a eu une enfance difficile dans un orphelinat, où elle devait travailler dès son plus jeune âge. À l'âge de 9 ans, elle a été adoptée par M. Deschamp, PDG de la franchise de commerce Deschamp, qui les a ramenées en France.\n\nAlice et sa sœur Adrienne, fraîchement renommée, ont entrepris de grandes études pour devenir professeurs. Cependant, le destin d'Alice a été bouleversé quand son \"copain\" de l'époque, un certain George Brown, a modifié ses notes pour l'empêcher de poursuivre de grandes études à l'étranger. Cet acte a été la goutte de trop pour Alice, qui a découvert une certaine passion pour la violence, et mit le feu au batiment scolaire...\n\nAujourd'hui, Alice est professeur multifonction à Tortueville, une école bien en dessous de son niveau. Malgré des conditions de travail pénibles, elle trouve une grande satisfaction à enseigner et à redonner espoir aux enfants en difficulté.",
    summary: "Alice, professeure à Tortueville, a surmonté une enfance difficile et une trahison pour trouver sa voie dans l'enseignement et aider les jeunes.",
    anecdotes: [
      "Alice n'est plus l'héritière de la franchise Deschamp suite à une arnaque envers son père adoptif.",
      "Sa relation avec George l'a aidée à comprendre son orientation sexuelle.",
      "Malgré son apparence de lapin mignon, Alice a une passion pour les armes à feu."
    ]
  },
  {
    id: "adrienne",
    name: "Adrienne Deschamp",
    image: "/images/persos/Adrienne.webp",
    age: "25 ans",
    likes: ["Jouer de ses charmes", "Les réseaux sociaux", "Les soirées américaines", "La danse", "Les cours de fitness et de yoga", "L'argent facile", "Sa sœur Alice"],
    dislikes: ["Prendre des responsabilités", "Trouver un \"véritable travail\"", "Être traitée de parasite", "Qu'on la discrédite", "Se lever du canapé", "Prendre des kilos"],
    fullDescription: "Monsieur Deschamp a toujours appris à Alice qu'il fallait travailler dur et ne jamais céder à la facilité. Pour Adrienne (de son vrai nom \"May\"), ce fut plus compliqué. Une fois arrivée en France, elle apprécia la culture occidentale et devint rapidement la fille la plus populaire de leur établissement scolaire. Après le tragique incident où Alice a brûlé l'endroit à cause de George, Adrienne s'est faite passer pour la coupable, sachant qu'elle aurait plus de facilité à trouver un travail, permettant ainsi à sa sœur de poursuivre son rêve de devenir professeur.\n\nLes années qui suivirent furent difficiles pour les deux sœurs, mais grâce à l'intervention de Fiona Deborah (la fille de l'escroc qui avait arnaqué leur père), Adrienne réussit à percer sur les réseaux sociaux, devenant une influenceuse multimédia. Voyageant partout dans le monde pour des publicités ou des petits films, Adrienne préfère vivre chez sa sœur qu'elle aime plus que tout et ne se voit pas vivre sans elle.",
    summary: "Adrienne, sœur jumelle d'Alice, est une influenceuse qui a sacrifié son parcours pour sa sœur et vit avec elle, malgré leurs différences.",
    anecdotes: [
      "Le comportement d'Adrienne exaspère Alice, mais elles coopèrent bien ensemble.",
      "Adrienne est une influenceuse multifonction (chanteuse, mannequin, championne MMA) mais a refusé le cinéma par crainte d'exigences dégradantes.",
      "Elle a une relation libre avec Freufreux, leurs mondes étant trop différents pour une histoire sérieuse."
    ]
  },
  {
    id: "lisa",
    name: "Lisa Da Vinci",
    image: "/images/persos/Lisa.webp",
    age: "21 ans",
    likes: ["Les bananes", "La physique quantique", "Les mathématiques", "Le monde de l'informatique", "Les gros robots", "Les armures de combat", "L'évolution scientifique", "Cocher toutes les cases du cliché italien", "Jouer la méchante"],
    dislikes: ["Avoir à faire du mal aux gens", "Qu'on la sous-estime", "Les effusions de sang", "Montrer ses faiblesses", "Qu'on pense qu'elle a une idéologie suprémaciste (mais bon sang, qui a osé vous faire croire ça ?!)"],
    fullDescription: "Ah, Lisa Da Vinci…\n\nÀ 4 ans, elle avait déchiffré le Da Vinci Code.\nÀ 6 ans, elle l'avait complexifié, le trouvant trop facile.\nÀ 9 ans, elle était diplômée d'Oxford.\nÀ 13 ans, elle savait envoyer des satellites dans l'espace avec un lance-pierre et un élastique.\nÀ 16 ans, elle créa sa propre cryptomonnaie et devint riche, bien qu'elle en fût la seule actionnaire.\nÀ 18 ans, elle obtint son permis de conduire des avions de chasse.\nÀ 21 ans… elle n'arrive pas à raser une petite ville de la carte ?!\n\nComme vous pouvez le comprendre, Lisa, depuis petite, a montré une intelligence et un sens de la créativité hors du commun, héritière du grand Léonard. On lui a fait croire petite que sa famille avait été tuée par les Templiers pour avoir fait un pacte avec un sorcier. Depuis, elle ne pense qu'à venger son héritage en servant les desseins de la Tower of Babel. Bien qu'elle se rende compte que ces derniers ne sont pas très nets, mais si sa tantine d'amour Mona lui sert, c'est forcément pour une bonne raison, n'est-ce pas ?... Dans tous les cas, un problème à la fois, elle s'est portée volontaire pour détruire Tortueville. Cependant, toutes ses actions ont mené à une série d'événements laissant penser aux habitants de la ville qu'il s'agissait là d'une héroïne prête à sauver le monde plutôt qu'une véritable superbe méchante ! Peut-être que c'est dû au fait qu'au fond, elle a un cœur en or, et qu'une part d'elle sabote ses plans…",
    summary: "Lisa Da Vinci, un génie scientifique, tente de détruire Tortueville pour venger sa famille, mais ses plans échouent souvent, révélant un cœur d'or.",
    anecdotes: [
      "Lisa a démasqué un hacker en lisant \"Le piratage informatique pour les nuls\" en 10 secondes.",
      "Elle ignore qu'Elmess Werewolf, qu'elle voit comme un bienfaiteur, est responsable de la disparition de sa famille.",
      "Malgré son objectif de les éliminer, Lisa passe du temps avec Juju et ses amis pour \"étudier l'adversaire\", mais cherche en réalité des amis.",
      "Anecdote bonus : Lisa est une araignée banane (Phoneutria nigriventer), d'où son amour pour les bananes et une morsure aux effets... particuliers ( ͡° ͜ʖ ͡°)."
    ]
  }
];

const itemVariants = {
  hidden: { y: 50, opacity: 0, rotateX: 15, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 85,
      damping: 12,
    },
  },
};

export default function FichesPersonnagesPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4,
      }
    }
  };

  return (
    <div className="py-20 md:py-24 lg:py-28">
      <div className="container px-4 md:px-6">
        <AnimateOnScroll animation="slide-down" delay={0.1}>
          <div className="flex flex-col items-center text-center mb-16 md:mb-24">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
              Fiches des Personnages
            </h1>
            <p className="text-muted-foreground md:text-xl max-w-[800px]">
              Découvrez les personnages qui peuplent l'univers de La Grotte de Juju. Cliquez sur une carte pour en savoir plus sur chacun d'entre eux.
            </p>
          </div>
        </AnimateOnScroll>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 px-8 py-8"
          variants={container}
          initial="hidden"
          animate="show"
          style={{ position: 'relative' }}
        >
          {personnages.map((personnage, index) => (
            <div key={personnage.id} className="relative" style={{ margin: '40px 0' }}>
              <AnimateOnScroll
                animation="fancy-card"
                delay={0.1 * (index + 1)}
              >
              <Dialog>
                <DialogTrigger asChild>
                  <div className="w-full cursor-pointer">
                    <Card3D
                      className="bg-card w-full rounded-xl overflow-visible"
                      intensity={12}
                      metallicEffect={true}
                      glowColor="rgba(255, 255, 255, 0.9)"
                    >
                      <div className="aspect-[3/4] relative">
                        <Image
                          src={personnage.image}
                          alt={personnage.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                          <div className="p-4 w-full">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                              {personnage.name}
                            </h3>
                            <p className="text-white/80 text-sm line-clamp-2">
                              {personnage.summary}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card3D>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl w-[90vw] max-h-[85vh] flex flex-col">
                  <motion.div
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="flex flex-col flex-grow"
                  >
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold flex items-center">
                        <span className="mr-3">{personnage.name}</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid md:grid-cols-3 gap-6 mt-2 overflow-y-auto pr-2 max-h-[calc(85vh-150px)]">
                      <div className="relative">
                        <div className="aspect-[3/4] rounded-lg overflow-hidden relative">
                          <Image
                            src={personnage.image}
                            alt={personnage.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="bg-primary text-primary-foreground text-center py-1 px-2 rounded-md mt-3 font-medium text-sm inline-block">
                          {personnage.age}
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <div className="prose prose-sm dark:prose-invert">
                          {personnage.fullDescription.split('\n\n').map((paragraph, i) => (
                            <p key={i} className="italic">{paragraph}</p>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <h4 className="font-semibold text-primary mb-2 border-b pb-1">Aime</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {personnage.likes.map((like, i) => (
                                <li key={i}>{like}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <h4 className="font-semibold text-primary mb-2 border-b pb-1">N'aime pas</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {personnage.dislikes.map((dislike, i) => (
                                <li key={i}>{dislike}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-4 bg-muted/30 p-3 rounded-lg">
                          <h4 className="font-semibold text-primary mb-2 border-b pb-1">Anecdotes</h4>
                          <ul className="list-disc pl-5 space-y-2 text-sm">
                            {personnage.anecdotes.map((anecdote, i) => (
                              <li key={i}>{anecdote}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="mt-4 pb-1">
                      <DialogClose asChild>
                        <Button variant="outline">Fermer</Button>
                      </DialogClose>
                    </DialogFooter>
                  </motion.div>
                </DialogContent>
              </Dialog>
            </AnimateOnScroll>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
