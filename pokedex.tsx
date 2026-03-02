import React, { useState, useEffect, useCallback } from "react";

const TYPE_COLORS: Record<string, string> = {normal:"#A8A878",fire:"#F08030",water:"#6890F0",electric:"#F8D030",grass:"#78C850",ice:"#98D8D8",fighting:"#C03028",poison:"#A040A0",ground:"#E0C068",flying:"#A890F0",psychic:"#F85888",bug:"#A8B820",rock:"#B8A038",ghost:"#705898",dragon:"#7038F8",dark:"#705848",steel:"#B8B8D0",fairy:"#EE99AC"};
const STAT_COLORS: Record<string, string> = {hp:"#FF5959",atk:"#F5AC78",def:"#FAE078",spa:"#9DB7F5",spd:"#A7DB8D",spe:"#FA92B2"};

const SPRITE = (id: number | string, shiny: boolean = false): string =>
  `https://img.pokemondb.net/sprites/${shiny ? "sword-shield/normal-shiny" : "sword-shield/normal"}/${BY_NAME[id] || "bulbasaur"}.png`;
const SPRITE_ICON = (id: number | string): string =>
  `https://img.pokemondb.net/sprites/sword-shield/icon/${BY_NAME[id] || "bulbasaur"}.png`;
const DREAM = (id: number | string): string => SPRITE(id);

const RAW = [
  [1,"Bulbasaur",["grass","poison"],45,49,49,65,65,45,7,69,["overgrow"],1,"A strange seed was planted on its back at birth."],
  [2,"Ivysaur",["grass","poison"],60,62,63,80,80,60,10,130,["overgrow"],1,"When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs."],
  [3,"Venusaur",["grass","poison"],80,82,83,100,100,80,20,1000,["overgrow"],1,"The plant blooms when it is absorbing solar energy."],
  [4,"Charmander",["fire"],39,52,43,60,50,65,6,85,["blaze"],2,"Obviously prefers hot places. Steam is said to spout from its tail in rain."],
  [5,"Charmeleon",["fire"],58,64,58,80,65,80,11,190,["blaze"],2,"When it swings its burning tail, it elevates the air temperature to unbearably high levels."],
  [6,"Charizard",["fire","flying"],78,84,78,109,85,100,17,905,["blaze"],2,"It spits fire hot enough to melt boulders. Known to cause forest fires unintentionally."],
  [7,"Squirtle",["water"],44,48,65,50,64,43,5,90,["torrent"],3,"After birth, its back swells and hardens into a shell. It sprays a powerful stream from its mouth."],
  [8,"Wartortle",["water"],59,63,80,65,80,58,10,225,["torrent"],3,"Recognized as a symbol of longevity. Algae on its shell means the Wartortle is very old."],
  [9,"Blastoise",["water"],79,83,100,85,105,78,16,855,["torrent"],3,"It crushes its foe under its heavy body. In a pinch, it withdraws inside its shell."],
  [10,"Caterpie",["bug"],45,30,35,20,20,45,3,29,["shield-dust"],4,"Its short feet are tipped with suction pads that enable it to tirelessly climb slopes and walls."],
  [11,"Metapod",["bug"],50,20,55,25,25,30,7,99,["shed-skin"],4,"It is vulnerable while its shell is soft, exposing its weak and tender body."],
  [12,"Butterfree",["bug","flying"],60,45,50,90,80,70,11,320,["compound-eyes"],4,"In battle, it flaps its wings to release highly toxic dust into the air."],
  [13,"Weedle",["bug","poison"],40,35,30,20,20,50,3,32,["shield-dust"],5,"Often found in forests eating leaves. It has a sharp venomous stinger on its head."],
  [14,"Kakuna",["bug","poison"],45,25,50,25,25,35,6,100,["shed-skin"],5,"Almost incapable of moving, this Pokémon can only harden its shell to protect itself."],
  [15,"Beedrill",["bug","poison"],65,90,40,45,80,75,10,295,["swarm"],5,"It has three poisonous stingers on its forelegs and tail used to jab its enemy repeatedly."],
  [16,"Pidgey",["normal","flying"],40,45,40,35,35,56,3,18,["keen-eye"],6,"A common sight in forests. It flaps its wings at ground level to kick up blinding sand."],
  [17,"Pidgeotto",["normal","flying"],63,60,55,50,50,71,11,300,["keen-eye"],6,"Very protective of its sprawling territory, it will fiercely peck any intruder."],
  [18,"Pidgeot",["normal","flying"],83,80,75,70,70,101,15,395,["keen-eye"],6,"This Pokémon flies at Mach 2 speed seeking prey. Its large talons are wicked weapons."],
  [19,"Rattata",["normal"],30,56,35,25,35,72,3,35,["run-away"],7,"Gnaws on anything with its fangs. If you see one, many more are surely nearby."],
  [20,"Raticate",["normal"],55,81,60,50,70,97,7,185,["run-away"],7,"It uses its whiskers to maintain balance. It slows down if they are cut off."],
  [21,"Spearow",["normal","flying"],40,60,30,31,31,70,3,20,["keen-eye"],8,"Eats bugs in grassy areas. It flaps its short wings at high speed to stay airborne."],
  [22,"Fearow",["normal","flying"],65,90,65,61,61,100,12,380,["keen-eye"],8,"It expertly wields its long beak to grab prey. It can fly continuously for a whole day."],
  [23,"Ekans",["poison"],35,60,44,40,54,55,20,69,["intimidate"],9,"The older it gets, the longer it grows. At night it wraps its body around tree branches to rest."],
  [24,"Arbok",["poison"],60,95,69,65,79,80,35,650,["intimidate"],9,"It can knock out even powerful foes with one squeeze of its constricting body."],
  [25,"Pikachu",["electric"],35,55,40,50,50,90,4,60,["static"],10,"When several gather, their electricity could build and cause lightning storms."],
  [26,"Raichu",["electric"],60,90,55,90,80,110,8,300,["static"],10,"Its long tail serves as a ground to protect itself from its own high-voltage power."],
  [27,"Sandshrew",["ground"],50,75,85,20,30,40,6,120,["sand-veil"],11,"Curls up into a ball when attacked. It lives in arid areas."],
  [28,"Sandslash",["ground"],75,100,110,45,55,65,10,295,["sand-veil"],11,"It uses its hard, spiny back to protect itself, then retaliates with sharp claws."],
  [29,"Nidoran-f",["poison"],55,47,52,40,40,41,4,70,["poison-point"],12,"It scans surroundings by raising its ears out of the grass. Its toxic horn is for protection."],
  [30,"Nidorina",["poison"],70,62,67,55,55,56,8,200,["poison-point"],12,"The female's horn develops slowly. Prefers physical attacks such as clawing and biting."],
  [31,"Nidoqueen",["poison","ground"],90,92,87,75,85,76,13,600,["poison-point"],12,"Its hard scales provide strong protection. It smashes foes with its powerful tail."],
  [32,"Nidoran-m",["poison"],46,57,40,40,40,50,5,90,["poison-point"],13,"Stiffens its ears to sense danger. The larger its horns, the more powerful its venom."],
  [33,"Nidorino",["poison"],61,72,57,55,55,65,9,195,["poison-point"],13,"An aggressive Pokémon quick to attack. The horn on its head secretes a powerful venom."],
  [34,"Nidoking",["poison","ground"],81,102,77,85,75,85,14,620,["poison-point"],13,"It uses its powerful tail in battle to smash, constrict, then break the prey's bones."],
  [35,"Clefairy",["normal"],70,45,48,60,65,35,6,75,["cute-charm"],14,"Adored for its cute nature. Found in the mountains, it is rarely seen."],
  [36,"Clefable",["normal"],95,70,73,95,90,60,13,400,["cute-charm"],14,"A timid fairy Pokémon rarely seen. It runs and hides the moment it senses people."],
  [37,"Vulpix",["fire"],38,41,40,50,65,65,6,99,["flash-fire"],15,"At birth it has just one tail. The tail splits from its tip as it grows older."],
  [38,"Ninetales",["fire"],73,76,75,81,100,100,11,199,["flash-fire"],15,"Very smart and very vengeful. Grabbing one of its tails could result in a 1000-year curse."],
  [39,"Jigglypuff",["normal","fairy"],115,45,20,45,25,20,5,55,["cute-charm"],16,"Its voice is said to be very beautiful. It can lull people to sleep by singing a lullaby."],
  [40,"Wigglytuff",["normal","fairy"],140,70,45,85,50,45,10,120,["cute-charm"],16,"A Pokémon that can sing mesmerizing songs. It can inhale and inflate its round body."],
  [41,"Zubat",["poison","flying"],40,45,35,30,40,55,8,75,["inner-focus"],17,"Emits ultrasonic cries while it flies to check for objects ahead."],
  [42,"Golbat",["poison","flying"],75,80,70,65,75,90,16,550,["inner-focus"],17,"Once it bites, it will not stop draining energy from the victim even if it has had its fill."],
  [43,"Oddish",["grass","poison"],45,50,55,75,65,30,5,54,["chlorophyll"],18,"It may be mistaken for a plant. It absorbs moonlight and uses it for photosynthesis."],
  [44,"Gloom",["grass","poison"],60,65,70,85,75,40,8,87,["chlorophyll"],18,"It likes moist, nutrient-rich soil. It emits a horrific stench as a defense mechanism."],
  [45,"Vileplume",["grass","poison"],75,80,85,110,90,50,12,186,["chlorophyll"],18,"The larger its petals, the more toxic pollen it contains."],
  [46,"Paras",["bug","grass"],35,70,55,45,55,25,3,54,["effect-spore"],19,"Burrows to suck tree roots. The mushrooms on its back grow from spores attached at birth."],
  [47,"Parasect",["bug","grass"],60,95,80,60,80,30,10,295,["effect-spore"],19,"A host-parasite pair in which the parasite mushroom has taken over the host bug."],
  [48,"Venonat",["bug","poison"],60,55,50,40,55,45,10,300,["compound-eyes"],20,"Lives in shadows of tall trees where it eats insects. It is attracted by light at night."],
  [49,"Venomoth",["bug","poison"],70,65,60,90,75,90,15,125,["shield-dust"],20,"The dustlike scales on its wings are color-coded to indicate the kinds of poison it has."],
  [50,"Diglett",["ground"],10,55,25,35,45,95,2,8,["sand-veil"],21,"Lives underground where it feeds on plant roots. It sometimes appears above ground."],
  [51,"Dugtrio",["ground"],35,100,50,50,70,120,7,33,["sand-veil"],21,"A team of three Diglett. It triggers huge earthquakes by burrowing 100 km underground."],
  [52,"Meowth",["normal"],40,45,35,40,40,90,4,42,["pickup"],22,"All it does is sleep during the daytime. At night it patrols its territory with eyes aglow."],
  [53,"Persian",["normal"],65,70,60,65,65,115,10,320,["limber"],22,"Although its fur has many admirers, it is tough to raise as a pet because of its fickle meanness."],
  [54,"Psyduck",["water"],50,52,48,65,50,55,8,196,["damp"],23,"Always tormented by headaches. If the pain becomes too severe it unleashes psychic power."],
  [55,"Golduck",["water"],80,82,78,95,80,85,17,766,["damp"],23,"Said to be capable of swimming backwards. It dives to the bottom of lakes to meditate."],
  [56,"Mankey",["fighting"],40,80,35,35,45,70,5,280,["vital-spirit"],24,"An agile Pokémon that lives in treetops. Becomes furious if you look into its eyes."],
  [57,"Primeape",["fighting"],65,105,60,60,70,95,10,320,["vital-spirit"],24,"It has been known to become so angry that it dies as a result. Its face looks peaceful in death."],
  [58,"Growlithe",["fire"],55,70,45,70,50,60,7,190,["intimidate"],25,"Very protective of its territory. It will bark and bite to repel intruders from its space."],
  [59,"Arcanine",["fire"],90,110,80,100,80,95,19,1550,["intimidate"],25,"A legendary Pokémon in China. Many are charmed by its grace and beauty while running."],
  [60,"Poliwag",["water"],40,50,40,40,40,90,6,124,["water-absorb"],26,"Its newly grown legs prevent it from running. It appears to prefer swimming over everything."],
  [61,"Poliwhirl",["water"],65,65,65,50,50,90,10,200,["water-absorb"],26,"The spiral pattern on its belly is a belly button visible through its thin skin."],
  [62,"Poliwrath",["water","fighting"],90,95,95,70,90,70,13,540,["water-absorb"],26,"An adept swimmer at both the front crawl and breaststroke. Easily overtakes the best human swimmers."],
  [63,"Abra",["psychic"],25,20,15,105,55,90,9,195,["synchronize"],27,"Using its ability to read minds, it identifies impending danger and teleports to safety."],
  [64,"Kadabra",["psychic"],40,35,30,120,70,105,13,565,["synchronize"],27,"It emits special alpha waves from its body that induce headaches just by being close by."],
  [65,"Alakazam",["psychic"],55,50,45,135,95,120,15,480,["synchronize"],27,"Its brain can outperform a supercomputer. Its IQ is said to be 5000."],
  [66,"Machop",["fighting"],70,80,50,35,35,35,8,195,["guts"],28,"Its muscles are special — they never get sore no matter how much it trains."],
  [67,"Machoke",["fighting"],80,100,70,50,60,45,15,705,["guts"],28,"Its muscular body is so powerful it must wear a power-save belt to regulate its motions."],
  [68,"Machamp",["fighting"],90,130,80,65,85,55,16,1300,["guts"],28,"Using its four arms, it fires off awesome punches and grabs foes in a power hold."],
  [69,"Bellsprout",["grass","poison"],50,75,35,70,30,40,7,40,["chlorophyll"],29,"Its stem is so flexible it can bend without breaking even if hit hard."],
  [70,"Weepinbell",["grass","poison"],65,90,50,85,45,55,10,64,["chlorophyll"],29,"It scans surroundings by emitting supersonic waves from its mouth."],
  [71,"Victreebel",["grass","poison"],80,105,65,100,70,70,17,155,["chlorophyll"],29,"It is said that Victreebel live in huge colonies deep in jungles, though no one has returned."],
  [72,"Tentacool",["water","poison"],40,40,35,50,100,70,9,455,["clear-body"],30,"Largely composed of water, it is easily affected by bright sunlight."],
  [73,"Tentacruel",["water","poison"],80,70,65,80,120,100,16,550,["clear-body"],30,"It has 80 tentacles that are all capable of stinging and paralyzing prey."],
  [74,"Geodude",["rock","ground"],40,80,100,30,30,20,4,200,["rock-head"],31,"Found in fields and mountains. Mistaken for boulders, they are often stepped on."],
  [75,"Graveler",["rock","ground"],55,95,115,45,45,35,10,1050,["rock-head"],31,"Found on rocky mountain paths. It rolls around on mountain paths to move."],
  [76,"Golem",["rock","ground"],80,120,130,55,65,45,14,3000,["rock-head"],31,"Its boulder-like body is extremely hard. It can withstand dynamite blasts without a scratch."],
  [77,"Ponyta",["fire"],50,85,55,65,65,90,10,300,["run-away"],32,"Its hooves are 10 times harder than diamonds. It can trample anything flat in moments."],
  [78,"Rapidash",["fire"],65,100,70,80,80,105,17,950,["run-away"],32,"Capable of running 150 mph at top speed, it can circle the globe in 16 days."],
  [79,"Slowpoke",["water","psychic"],90,65,65,40,40,15,12,360,["oblivious"],33,"Incredibly slow and dopey. It takes 5 seconds for it to feel pain when under attack."],
  [80,"Slowbro",["water","psychic"],95,75,110,100,80,30,16,785,["oblivious"],33,"An attached Shellder won't let go because of the tasty flavor that oozes out of its tail."],
  [81,"Magnemite",["electric","steel"],25,35,70,95,55,45,3,60,["magnet-pull"],34,"Uses anti-gravity to stay suspended. Appears without warning and uses electric attacks."],
  [82,"Magneton",["electric","steel"],50,60,95,120,70,70,10,600,["magnet-pull"],34,"Formed by three linked Magnemite. The trio generate powerful magnetic fields."],
  [83,"Farfetchd",["normal","flying"],52,90,55,58,62,60,8,150,["keen-eye"],35,"The stalk it carries is used to make its nest. It defends the stalk with its life."],
  [84,"Doduo",["normal","flying"],35,85,45,35,35,75,14,392,["run-away"],36,"A bird that makes up for poor flying with fast foot speed. Leaves giant footprints."],
  [85,"Dodrio",["normal","flying"],60,110,70,60,60,110,18,852,["run-away"],36,"One of its three heads sleeps while the others keep watch. It never lets its guard down."],
  [86,"Seel",["water"],65,45,55,45,70,45,11,900,["thick-fat"],37,"Uses its horn to dig holes in ice floes, making a den. The cold climate is no problem."],
  [87,"Dewgong",["water","ice"],90,70,80,70,95,70,17,1200,["thick-fat"],37,"Loves the cold sea. Stores thermal energy in its body to swim in icy cold water."],
  [88,"Grimer",["poison"],80,80,50,40,50,25,9,300,["stench"],38,"Appears in filthy areas. Thrives by sucking up polluted sludge from factories."],
  [89,"Muk",["poison"],105,105,75,65,100,50,12,300,["stench"],38,"Thickly covered with a foul, oozing sludge. The fluid has a terribly strong stench."],
  [90,"Shellder",["water"],30,65,100,45,25,40,3,40,["shell-armor"],39,"Its shell is harder than diamond. Despite this, it is still preyed upon by some Pokémon."],
  [91,"Cloyster",["water","ice"],50,95,180,85,45,70,15,1325,["shell-armor"],39,"When attacked, it quickly withdraws into its shell and seals it shut."],
  [92,"Gastly",["ghost","poison"],30,35,30,100,35,80,13,1,["levitate"],40,"Born from gases, anyone who approaches it will faint. Its yellowish hue is a sign of danger."],
  [93,"Haunter",["ghost","poison"],45,50,45,115,55,95,16,1,["levitate"],40,"Because of its ability to slip through block walls, it is said to be from another dimension."],
  [94,"Gengar",["ghost","poison"],60,65,60,130,75,110,15,405,["cursed-body"],40,"Under a full moon, it likes to mimic the shadows of people and laugh at their fright."],
  [95,"Onix",["rock","ground"],35,45,160,30,45,70,88,2100,["rock-head"],41,"As it grows, the stone portions of its body harden to become similar to black diamonds."],
  [96,"Drowzee",["psychic"],60,48,45,43,90,42,10,324,["insomnia"],42,"If your nose becomes itchy while you sleep, a Drowzee may be standing above your pillow."],
  [97,"Hypno",["psychic"],85,73,70,73,115,67,16,756,["insomnia"],42,"It carries a pendulum-like device. There was an incident in which it hypnotized a child."],
  [98,"Krabby",["water"],30,105,90,25,25,50,4,65,["hyper-cutter"],43,"Its pincers are not only powerful weapons, they are used for balance when walking sideways."],
  [99,"Kingler",["water"],55,130,115,50,50,75,13,600,["hyper-cutter"],43,"The larger pincer has 10,000-horsepower strength. However, it is so heavy it is hard to aim."],
  [100,"Voltorb",["electric"],40,30,50,55,55,100,5,104,["soundproof"],44,"Usually found in power plants. Easily mistaken for a Poké Ball, it has zapped many people."],
  [101,"Electrode",["electric"],60,50,70,80,80,150,12,666,["soundproof"],44,"It stores electric energy under very high pressure. It often explodes with little provocation."],
  [102,"Exeggcute",["grass","psychic"],60,40,80,60,45,40,4,25,["chlorophyll"],45,"Often mistaken for eggs. When disturbed, they quickly gather and attack in swarms."],
  [103,"Exeggutor",["grass","psychic"],95,95,85,125,75,55,20,1200,["chlorophyll"],45,"Each of its heads has its own brain. Even if a head is separated, it will keep on eating."],
  [104,"Cubone",["ground"],50,50,95,40,50,35,4,65,["rock-head"],46,"It pines for the mother it will never see again. Seeing a likeness of its mother in the full moon, it cries."],
  [105,"Marowak",["ground"],60,80,110,50,80,45,10,450,["rock-head"],46,"The bone it holds is its key weapon. It throws the bone skillfully like a boomerang to KO targets."],
  [106,"Hitmonlee",["fighting"],50,120,53,35,110,87,15,498,["limber"],47,"When in a hurry, its legs lengthen progressively. It runs with extra long, loping strides."],
  [107,"Hitmonchan",["fighting"],50,105,79,35,110,76,14,502,["keen-eye"],47,"While its punches are powerful, they are also very elegant and can mesmerize the opponent."],
  [108,"Lickitung",["normal"],90,55,75,60,75,30,12,655,["own-tempo"],49,"Its tongue can be extended like a whip. Its licks leave a tingling sensation."],
  [109,"Koffing",["poison"],40,65,95,60,45,35,6,10,["levitate"],50,"It stores several kinds of toxic gases and is prone to explosions if handled carelessly."],
  [110,"Weezing",["poison"],65,90,120,85,70,60,12,95,["levitate"],50,"Two Koffing joined together. Known to live near garbage dumps emitting toxic gases."],
  [111,"Rhyhorn",["ground","rock"],80,85,95,30,30,25,10,1150,["lightning-rod"],51,"Its brain is tiny. It is not very bright, but its body is well armored."],
  [112,"Rhydon",["ground","rock"],105,130,120,45,45,40,19,1200,["lightning-rod"],51,"Protected by armor-like hide, it is capable of living in molten lava of 3,600 degrees."],
  [113,"Chansey",["normal"],250,5,5,35,105,50,11,346,["natural-cure"],52,"A rare Pokémon whose eggs are so delicious they are instantly gobbled up."],
  [114,"Tangela",["grass"],65,55,115,100,40,60,10,350,["chlorophyll"],53,"The whole body is swathed with wide vines similar to seaweed. It walks slowly."],
  [115,"Kangaskhan",["normal"],105,95,80,40,80,90,22,800,["early-bird"],54,"The baby inside the mother's pouch is rarely seen. It is protected by its strong mother."],
  [116,"Horsea",["water"],30,40,70,70,25,60,4,80,["swift-swim"],55,"Known to shoot down flying bugs with precision using a water gun from its mouth."],
  [117,"Seadra",["water"],55,65,95,95,45,85,12,250,["poison-point"],55,"Capable of swimming backwards by rapidly flapping its wing-like pectoral fins and stout tail."],
  [118,"Goldeen",["water"],45,67,60,35,50,63,6,150,["swift-swim"],56,"Its tail fin billows like an elegant ballgown, giving it the nickname the Water Queen."],
  [119,"Seaking",["water"],80,92,65,65,80,68,13,390,["swift-swim"],56,"In autumn its body becomes more fatty in preparation for finding a mate."],
  [120,"Staryu",["water"],30,45,55,70,55,85,8,345,["illuminate"],57,"Even if its body is torn, it can regenerate as long as the red core remains."],
  [121,"Starmie",["water","psychic"],60,75,85,100,85,115,11,800,["illuminate"],57,"Its central core glows with seven colors of the rainbow. Some people value the core as a gem."],
  [122,"MrMime",["psychic","fairy"],40,45,65,100,120,90,13,545,["soundproof"],58,"If interrupted while miming, it will slap around the offender with its broad hands."],
  [123,"Scyther",["bug","flying"],70,110,80,55,80,105,15,560,["swarm"],59,"With ninja-like agility and speed, it can create the illusion that there is more than one."],
  [124,"Jynx",["ice","psychic"],65,50,35,115,95,95,14,406,["oblivious"],60,"It seductively wiggles its hips as it walks. It can cause people to dance in unison with it."],
  [125,"Electabuzz",["electric"],65,83,57,95,85,105,11,300,["static"],61,"Normally found near power plants, they can wander and cause major blackouts in cities."],
  [126,"Magmar",["fire"],65,95,57,100,85,93,13,445,["flame-body"],62,"Its body always burns with an orange glow that enables it to hide perfectly among flames."],
  [127,"Pinsir",["bug"],65,125,100,55,70,85,15,550,["hyper-cutter"],63,"If it fails to crush the victim in its pincers, it will swing it around and toss it hard."],
  [128,"Tauros",["normal"],75,100,95,40,70,110,14,884,["intimidate"],64,"When whipping itself with its three tails, its body fills with energy and it becomes uncontrollable."],
  [129,"Magikarp",["water"],20,10,55,15,20,80,9,100,["swift-swim"],65,"An underpowered, pathetic Pokémon. It may jump high on rare occasions but usually just flops."],
  [130,"Gyarados",["water","flying"],95,125,79,60,100,81,65,2350,["intimidate"],65,"Once it begins to rampage, a Gyarados will burn everything down, even in a harsh storm."],
  [131,"Lapras",["water","ice"],130,85,80,85,95,60,25,2200,["water-absorb"],66,"A gentle soul that can understand human speech. It can ferry people across the sea."],
  [132,"Ditto",["normal"],48,48,48,48,48,48,3,40,["limber"],67,"It can transform into anything. When it sleeps, it changes into a stone to avoid attack."],
  [133,"Eevee",["normal"],55,55,50,45,65,55,3,65,["run-away"],68,"Its genetic code is irregular. It may mutate if exposed to radiation from element Stones."],
  [134,"Vaporeon",["water"],130,65,60,110,95,65,10,290,["water-absorb"],68,"Its cell composition is similar to water molecules. As a result, it can melt away into water."],
  [135,"Jolteon",["electric"],65,65,60,110,95,130,8,245,["volt-absorb"],68,"It accumulates negative ions in the atmosphere to blast out 10000-volt lightning bolts."],
  [136,"Flareon",["fire"],65,130,60,95,110,65,9,250,["flash-fire"],68,"When storing thermal energy, its temperature could soar to over 1500 degrees."],
  [137,"Porygon",["normal"],65,60,70,85,75,40,8,365,["trace"],69,"A Pokémon that consists entirely of programming code. It is capable of moving in cyberspace."],
  [138,"Omanyte",["rock","water"],35,40,100,90,55,35,4,75,["swift-swim"],70,"This Pokémon lived in ancient seas, swimming by drawing water into its shell."],
  [139,"Omastar",["rock","water"],70,60,125,115,70,55,10,350,["swift-swim"],70,"It used to be predominant, but lost in the survival competition and became a rare species."],
  [140,"Kabuto",["rock","water"],30,80,90,55,45,55,5,115,["swift-swim"],71,"A Pokémon resurrected from a fossil found in what was once the ocean floor eons ago."],
  [141,"Kabutops",["rock","water"],60,115,105,65,70,80,13,405,["swift-swim"],71,"Its sleek shape is perfect for swimming. It slashes prey with its sharp scythes."],
  [142,"Aerodactyl",["rock","flying"],80,105,65,60,75,130,18,590,["rock-head"],72,"A ferocious, prehistoric Pokémon that goes for the throat with its serrated, saw-like fangs."],
  [143,"Snorlax",["normal"],160,110,65,65,110,30,21,4600,["immunity"],73,"Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful."],
  [144,"Articuno",["ice","flying"],90,85,100,95,125,85,17,554,["pressure"],74,"A legendary bird said to appear to doomed people who are lost in icy mountains."],
  [145,"Zapdos",["electric","flying"],90,90,85,125,90,100,16,526,["pressure"],75,"A legendary bird said to appear when the sky turns dark and lightning showers down."],
  [146,"Moltres",["fire","flying"],90,100,90,125,85,90,20,600,["pressure"],76,"Known as the legendary bird of fire. Every flap of its wings creates a dazzling flash of flames."],
  [147,"Dratini",["dragon"],41,64,45,50,50,50,18,33,["shed-skin"],77,"Long considered mythical until recently when a small colony was found living underwater."],
  [148,"Dragonair",["dragon"],61,84,65,70,70,70,40,165,["shed-skin"],77,"A mystical Pokémon that exudes a gentle aura. Has the ability to change climate conditions."],
  [149,"Dragonite",["dragon","flying"],91,134,95,100,100,80,22,2100,["inner-focus"],77,"An extremely rare marine Pokémon. Its intelligence is humanlike and it roams the world's oceans."],
  [150,"Mewtwo",["psychic"],106,110,90,154,90,130,20,1220,["pressure"],78,"It was created by a scientist after years of horrific gene splicing and DNA engineering."],
  [151,"Mew",["psychic"],100,100,100,100,100,100,4,40,["synchronize"],79,"So rare that it is still said to be a mirage by many experts. Only a few people have seen it."],
  [152,"Chikorita",["grass"],45,49,65,49,65,45,9,64,["overgrow"],80,"A sweet aroma gently wafts from the leaf on its head. It is docile and loves to soak up sun."],
  [153,"Bayleef",["grass"],60,62,80,63,80,60,12,158,["overgrow"],80,"It loves to bask in the sun. It is often found sunning itself in open fields."],
  [154,"Meganium",["grass"],80,82,100,83,100,80,18,1005,["overgrow"],80,"The aroma that rises from its petals contains a substance that calms aggressive feelings."],
  [155,"Cyndaquil",["fire"],39,52,43,60,50,65,5,79,["blaze"],81,"It is timid and always curls itself up in a ball. If attacked, it flares up its back."],
  [156,"Quilava",["fire"],58,64,58,80,65,80,9,190,["blaze"],81,"It can attack with intense flames while jumping nimbly around its opponent."],
  [157,"Typhlosion",["fire"],78,84,78,109,85,100,17,795,["blaze"],81,"It obscures itself behind a shimmering heat haze created using its intense flames."],
  [158,"Totodile",["water"],50,65,64,44,48,43,6,95,["torrent"],82,"Despite the smallness of its body, it is powerful enough to grab and throw an adult human."],
  [159,"Croconaw",["water"],65,80,80,59,63,58,11,255,["torrent"],82,"It has a large, gaping maw. Once it clamps down on an enemy, it won't let go until its fangs fall out."],
  [160,"Feraligatr",["water"],85,105,100,79,83,78,23,888,["torrent"],82,"When it bites with its massive and powerful jaws, it shakes its head and savagely tears its victim up."],
  [161,"Sentret",["normal"],35,46,34,35,45,20,8,60,["run-away"],83,"When acting as a lookout, it warns others of danger by screeching and stands up to look around."],
  [162,"Furret",["normal"],85,76,64,45,55,90,18,325,["run-away"],83,"It makes a nest to suit its long and skinny body. The nest is impossible for other Pokémon to enter."],
  [163,"Hoothoot",["normal","flying"],60,30,30,36,56,50,7,212,["insomnia"],84,"It always stands on one leg. It changes legs so fast the movement can rarely be seen."],
  [164,"Noctowl",["normal","flying"],100,50,50,86,96,70,16,408,["insomnia"],84,"When it needs to think, it rotates its head 180 degrees to sharpen its intellectual power."],
  [165,"Ledyba",["bug","flying"],40,20,30,40,80,55,10,108,["swarm"],85,"It is timid and clusters with others. The fluid secreted by its feet indicates its emotions."],
  [166,"Ledian",["bug","flying"],55,35,50,55,110,85,14,356,["swarm"],85,"When the stars flicker in the night sky, it flutters about scattering a glowing powder."],
  [167,"Spinarak",["bug","poison"],40,60,40,40,40,30,5,85,["swarm"],86,"It lies still in the same pose for days in its web, waiting for prey to come to it."],
  [168,"Ariados",["bug","poison"],70,90,70,60,70,40,11,335,["swarm"],86,"It spins a strand of a special string and sets it loose to roam the forest in search of prey."],
  [169,"Crobat",["poison","flying"],85,90,80,70,80,130,18,750,["inner-focus"],17,"It flies so silently through the dark on its four wings that it may not be noticed even when nearby."],
  [170,"Chinchou",["water","electric"],75,38,38,56,56,67,5,120,["volt-absorb"],87,"It shoots electricity between the two antennae on its head to make it flash."],
  [171,"Lanturn",["water","electric"],125,58,58,76,76,67,12,225,["volt-absorb"],87,"The light it emits is so bright it can illuminate the sea's surface from a depth of three miles."],
  [172,"Pichu",["electric"],20,40,15,35,35,60,3,20,["static"],10,"Despite being small, it can zap adult humans. It is not yet able to control its electric power."],
  [173,"Cleffa",["normal","fairy"],50,25,28,45,55,15,3,30,["cute-charm"],14,"It is often seen in meteor showers. It looks up at the starry sky with its large, shining eyes."],
  [174,"Igglybuff",["normal","fairy"],90,30,15,40,20,15,3,10,["cute-charm"],16,"The skin on its body is so elastic and smooth that when it bounces, it becomes hard to stop."],
  [175,"Togepi",["fairy"],35,20,65,40,65,20,3,15,["hustle"],88,"The shell seems to be filled with joy. It is said that it will share good luck when treated kindly."],
  [176,"Togetic",["fairy","flying"],55,40,85,80,105,40,6,32,["hustle"],88,"It grows exponentially stronger when it is with a trainer who is kind and caring."],
  [177,"Natu",["psychic","flying"],40,50,45,70,45,70,2,20,["synchronize"],89,"It has a habit of staring at something. Once it begins, it won't move until the object moves."],
  [178,"Xatu",["psychic","flying"],65,75,70,95,70,95,15,150,["synchronize"],89,"It stands rooted and motionless for long periods. Its stature has led to it being revered as a deity."],
  [179,"Mareep",["electric"],55,40,40,65,45,35,6,78,["static"],90,"If static electricity builds in its body, its fleece doubles in volume. Touching it will shock you."],
  [180,"Flaaffy",["electric"],70,55,55,80,60,45,8,133,["static"],90,"As a result of storing too much electricity, it developed patches where even electricity won't spark."],
  [181,"Ampharos",["electric"],90,75,85,115,90,55,14,615,["static"],90,"The tip of its tail shines brightly and can be seen from far away. It has been used as a beacon."],
  [182,"Bellossom",["grass"],75,80,95,90,100,50,4,58,["chlorophyll"],18,"Bellossom gather at times and dance. They say the dance is a ritual to summon the sun."],
  [183,"Marill",["water","fairy"],70,20,50,20,50,40,4,85,["thick-fat"],91,"The tip of its tail, which contains oil lighter than water, works as a float."],
  [184,"Azumarill",["water","fairy"],100,50,80,60,80,50,8,285,["thick-fat"],91,"By keeping still and listening intently, it can tell what is in even wild, fast-moving rivers."],
  [185,"Sudowoodo",["rock"],70,100,115,30,65,30,12,380,["sturdy"],92,"Despite looking like a tree, it is actually a Pokémon. It hates water and lives far from it."],
  [186,"Politoed",["water"],90,75,75,90,100,70,11,339,["water-absorb"],26,"Pokémon that hear its echoing cry feel an overwhelming compulsion to obey."],
  [187,"Hoppip",["grass","flying"],35,35,40,35,55,50,4,5,["chlorophyll"],93,"It drifts on winds. It can only be seen where it's sunny and breezy."],
  [188,"Skiploom",["grass","flying"],55,45,50,45,65,80,6,10,["chlorophyll"],93,"The flower on its head opens and closes as the temperature fluctuates up and down."],
  [189,"Jumpluff",["grass","flying"],75,55,70,55,85,110,8,30,["chlorophyll"],93,"Once it catches the wind, it drifts over the ocean and across mountains to distant lands."],
  [190,"Aipom",["normal"],55,70,55,40,55,85,8,115,["run-away"],94,"It lives in trees and is very skilled at using its tail. Its tail is so dexterous it grabs food."],
  [191,"Sunkern",["grass"],30,30,30,30,30,30,3,18,["chlorophyll"],95,"It suddenly falls out of the sky in the morning. Knowing it is weak, it feeds until evolution."],
  [192,"Sunflora",["grass"],75,75,55,105,85,30,8,85,["chlorophyll"],95,"It converts the energy of sunlight into nutrition. It moves around actively in the daytime."],
  [193,"Yanma",["bug","flying"],65,65,45,75,45,95,12,38,["speed-boost"],96,"If it flaps its wings fast, it can generate shock waves that will shatter windows."],
  [194,"Wooper",["water","ground"],55,45,45,25,25,15,4,85,["damp"],97,"It lives in cold water. It comes out onto land during cold weather, which dries out its skin."],
  [195,"Quagsire",["water","ground"],95,85,85,65,65,35,14,750,["damp"],97,"A dimwitted Pokémon with a happy-go-lucky attitude. Blunders into things while swimming."],
  [196,"Espeon",["psychic"],65,65,60,130,95,110,9,265,["synchronize"],68,"By reading air currents, it can predict things such as the weather or its foe's next move."],
  [197,"Umbreon",["dark"],95,65,110,60,130,65,10,270,["synchronize"],68,"When exposed to the moon's aura, the rings on its body glow faintly and it gains mysterious power."],
  [198,"Murkrow",["dark","flying"],60,85,42,85,42,91,5,21,["insomnia"],98,"Feared and loathed by many, it is believed to bring misfortune to all who see it at night."],
  [199,"Slowking",["water","psychic"],95,75,80,100,110,30,20,795,["oblivious"],33,"It has incredible intellect and intuition. Whatever the situation, it remains calm and collected."],
  [200,"Misdreavus",["ghost"],60,60,60,85,85,85,7,10,["levitate"],99,"A Pokémon that frightens people by emitting a bloodcurdling shriek. Loves to bite in the dark."],
  [201,"Unown",["psychic"],48,72,48,72,48,48,5,50,["levitate"],100,"Its shape appears to have some meaning. It moves in swarms, attracted by legend."],
  [202,"Wobbuffet",["psychic"],190,33,58,33,58,33,13,285,["shadow-tag"],101,"It keeps its real face hidden by always keeping its back turned. Its tail is its true form."],
  [203,"Girafarig",["normal","psychic"],70,80,65,90,65,85,15,415,["inner-focus"],102,"The head on its tail contains a tiny brain. Beware—it may bite if you approach from behind."],
  [204,"Pineco",["bug"],50,65,90,35,35,15,6,72,["sturdy"],103,"It makes itself appear to be a pinecone. However, if it is disturbed, it blows itself up."],
  [205,"Forretress",["bug","steel"],75,90,140,60,60,40,12,1258,["sturdy"],103,"Forretress conceals itself inside its hard shell. It opens its shell to catch prey."],
  [206,"Dunsparce",["normal"],100,70,70,65,65,45,15,140,["serene-grace"],104,"It digs into the ground backward. It looks for food while its twinkling eyes rotate."],
  [207,"Gligar",["ground","flying"],65,75,105,35,65,85,11,648,["hyper-cutter"],105,"It flies straight at its target's face then clamps down to inject poison."],
  [208,"Steelix",["steel","ground"],75,85,200,55,65,30,93,4000,["rock-head"],41,"It is said that if an Onix lives for 100 years, its body crystallizes into a Steelix."],
  [209,"Snubbull",["fairy"],60,80,50,40,40,30,6,78,["intimidate"],106,"Many women are attracted to it. It can scare other Pokémon with just one glance."],
  [210,"Granbull",["fairy"],90,120,75,60,60,45,14,487,["intimidate"],106,"It is actually more timid than Snubbull. It growls to hide the fact that it has a timid nature."],
  [211,"Qwilfish",["water","poison"],65,95,85,55,55,85,5,39,["poison-point"],107,"It swallows as much water as possible to expand its body, then fires poison spikes."],
  [212,"Scizor",["bug","steel"],70,130,100,55,80,65,18,1180,["swarm"],59,"Its pincers contain steel and can crush any hard object. It walks on just its hind legs."],
  [213,"Shuckle",["bug","rock"],20,10,230,10,230,5,6,205,["sturdy"],108,"It stores food in its shell. When it does so, the food transforms into a thick, sour juice."],
  [214,"Heracross",["bug","fighting"],80,125,75,40,95,85,15,540,["swarm"],109,"It loves the sweet honey of flowers. It can carry heavy things by using its large, powerful horn."],
  [215,"Sneasel",["dark","ice"],55,95,55,35,75,115,9,280,["inner-focus"],110,"A smart and sneaky Pokémon. It hides under the cover of darkness and waits to attack."],
  [216,"Teddiursa",["normal"],60,80,50,50,50,40,6,88,["pickup"],111,"Before finding food, it always licks its paws. Its adorable behavior makes it a popular Pokémon."],
  [217,"Ursaring",["normal"],90,130,75,75,75,55,18,1258,["guts"],111,"In forests inhabited by Ursaring, there are many berries and mushrooms that grow in abundance."],
  [218,"Slugma",["fire"],40,40,40,70,40,20,7,350,["magma-armor"],112,"It never stops moving because if it stopped, its magma body would cool and harden."],
  [219,"Magcargo",["fire","rock"],60,50,120,90,80,30,8,550,["magma-armor"],112,"Its shell is made of hardened magma. It slowly makes its way down mountain paths."],
  [220,"Swinub",["ice","ground"],50,50,40,30,30,50,4,65,["oblivious"],113,"It rubs its snout on the ground to find and dig up food. It sometimes discovers hot springs."],
  [221,"Piloswine",["ice","ground"],100,100,80,60,60,50,11,558,["oblivious"],113,"It is covered with a thick coat of long hair that enables it to endure the freezing cold."],
  [222,"Corsola",["water","rock"],55,55,85,65,85,35,6,50,["hustle"],114,"Clusters of Corsola live in warm waters. If its horns are broken, new ones grow back quickly."],
  [223,"Remoraid",["water"],35,65,35,65,35,65,6,120,["hustle"],115,"Using water shot from its mouth like a pistol, it can accurately hit targets from great distances."],
  [224,"Octillery",["water"],75,105,75,105,75,45,9,285,["suction-cups"],115,"It instinctively sneaks into rocky holes. When attacked, it squirts black ink to escape."],
  [225,"Delibird",["ice","flying"],45,55,45,65,45,75,9,160,["vital-spirit"],116,"It carries food all day long. There are tales about lost people who were saved by the food it had."],
  [226,"Mantine",["water","flying"],65,40,70,80,140,70,21,2200,["swift-swim"],117,"It swims elegantly using the two long fins on its back to glide through the water."],
  [227,"Skarmory",["steel","flying"],65,80,140,40,70,70,17,505,["keen-eye"],118,"Its sharp claws and the giant blades on its wings can slash rivals to pieces."],
  [228,"Houndour",["dark","fire"],45,60,30,80,50,65,6,108,["early-bird"],119,"It uses different kinds of cries for communicating with others and for pursuing prey."],
  [229,"Houndoom",["dark","fire"],75,90,50,110,80,95,14,350,["early-bird"],119,"Long ago, people imagined its eerie howls to be the call of the Grim Reaper."],
  [230,"Kingdra",["water","dragon"],75,95,95,95,95,85,18,1520,["swift-swim"],55,"It lives at extreme ocean depths. The yawning of this Pokémon causes sea tornadoes."],
  [231,"Phanpy",["ground"],90,60,60,40,40,40,5,335,["pickup"],120,"A mountain-dwelling Pokémon. It sprays water through its long nose vigorously."],
  [232,"Donphan",["ground"],90,120,120,60,60,50,11,1200,["sturdy"],120,"The larger and longer its tusks, the higher its rank in its herd. It can knock down trees."],
  [233,"Porygon2",["normal"],85,80,90,105,95,60,6,325,["trace"],69,"A man-made Pokémon improved by programmers so that it could be used in space exploration."],
  [234,"Stantler",["normal"],73,95,62,85,65,85,14,712,["intimidate"],121,"The shape of its antlers creates a visual distortion. Looking at them too long causes headaches."],
  [235,"Smeargle",["normal"],55,20,35,20,45,75,12,580,["own-tempo"],122,"It marks the boundaries of its territory using a fluid that leaks from the tip of its tail."],
  [236,"Tyrogue",["fighting"],35,35,35,35,35,35,7,210,["guts"],47,"It is always bursting with energy. To get stronger, it keeps on fighting even if it loses."],
  [237,"Hitmontop",["fighting"],50,95,95,35,110,70,14,480,["intimidate"],47,"It fights while spinning like a top. The centrifugal force makes its kicks extra strong."],
  [238,"Smoochum",["ice","psychic"],45,30,15,85,65,65,4,60,["oblivious"],60,"Its lips are the most sensitive part of its body. It always uses its lips first to examine things."],
  [239,"Elekid",["electric"],45,63,37,65,55,95,6,235,["static"],61,"It generates electricity by spinning its arms in circles. It is considered very mischievous."],
  [240,"Magby",["fire"],45,75,37,70,55,83,7,214,["flame-body"],62,"Found in volcanic areas, it is a sign of impending eruption if its hiccups increase."],
  [241,"Miltank",["normal"],95,80,105,40,70,100,12,755,["thick-fat"],123,"The milk it produces is packed with nutrition, making it the ultimate food."],
  [242,"Blissey",["normal"],255,10,10,75,135,55,15,468,["natural-cure"],52,"The happiest of all Pokémon. It rolls its large, round egg filled with high nutrition."],
  [243,"Raikou",["electric"],90,85,75,115,100,115,19,1780,["pressure"],124,"This Pokémon is said to have fallen with lightning. It races across the land with a sharp thunderclap."],
  [244,"Entei",["fire"],115,115,85,90,75,100,21,1980,["pressure"],125,"A Pokémon that races across the land. It is said that one is born every time a new volcano appears."],
  [245,"Suicune",["water"],100,75,115,90,115,85,20,1870,["pressure"],126,"This Pokémon races across the water. It is said to be the reincarnation of north winds."],
  [246,"Larvitar",["rock","ground"],50,64,50,45,50,41,6,72,["guts"],127,"It feeds on soil. After it has eaten a large mountain, it will fall asleep so it can grow."],
  [247,"Pupitar",["rock","ground"],70,84,70,65,70,51,12,152,["shed-skin"],127,"As the pupa continues to absorb nutrients from its shell, it becomes large enough to burst."],
  [248,"Tyranitar",["rock","dark"],100,134,110,95,100,61,20,2020,["sand-stream"],127,"Its body can't be harmed by any sort of attack, so it is very eager to challenge enemies."],
  [249,"Lugia",["psychic","flying"],106,90,130,90,154,110,52,2160,["pressure"],128,"It is said to be the guardian of the seas. It is rumored to appear on the night of a storm."],
  [250,"Ho-Oh",["fire","flying"],106,130,90,110,154,90,38,1990,["pressure"],129,"Its brilliant rainbow-colored wings span miles. It is said to bring good luck to all who see it."],
  [251,"Celebi",["psychic","grass"],100,100,100,100,100,100,6,50,["natural-cure"],130,"This Pokémon came from the future by crossing over time. It is thought to bring a bright future."],
  [252,"Treecko",["grass"],40,45,35,65,55,70,5,50,["overgrow"],131,"It quickly scales even vertical walls. It senses humidity with its tail to predict the weather."],
  [253,"Grovyle",["grass"],50,65,45,85,65,95,9,216,["overgrow"],131,"The leaves growing out of its arms can slice through thick logs in a single stroke."],
  [254,"Sceptile",["grass"],70,85,65,105,85,120,17,522,["overgrow"],131,"The leaves on its arms are as sharp as swords. It is very agile."],
  [255,"Torchic",["fire"],45,60,40,70,50,45,4,25,["blaze"],132,"It bounces around on one leg, firing off flamethrowers. Its fluffy coat grows into a mane."],
  [256,"Combusken",["fire","fighting"],60,85,60,85,60,55,9,195,["blaze"],132,"Its kicking mastery lets it deliver 10 kicks per second. It toughens its spirit through harsh training."],
  [257,"Blaziken",["fire","fighting"],80,120,70,110,70,80,19,520,["blaze"],132,"In battle, Blaziken blows out intense flames from its wrists and attacks foes courageously."],
  [258,"Mudkip",["water"],50,70,50,50,50,40,4,76,["torrent"],133,"Its large tail fin propels it through water with powerful acceleration. It can also walk on land."],
  [259,"Marshtomp",["water","ground"],70,85,70,60,70,50,7,280,["torrent"],133,"Its body is enveloped in a mysterious gooey substance that enables it to live on land."],
  [260,"Swampert",["water","ground"],100,110,90,85,90,60,15,819,["torrent"],133,"It has enough power to toss boulders weighing more than a ton with ease."],
  [261,"Poochyena",["dark"],35,55,35,30,30,35,5,136,["run-away"],134,"At first sight, Poochyena takes a bite at anything that moves. It chases prey until exhaustion."],
  [262,"Mightyena",["dark"],70,90,70,60,60,70,10,370,["intimidate"],134,"Mightyena gives obvious signals when preparing to attack. It bares its fangs and flattens its body."],
  [263,"Zigzagoon",["normal"],38,30,41,30,41,60,4,175,["pickup"],135,"The hair on Zigzagoon's back is bristly and stiff. It rubs it against trees to forage for food."],
  [264,"Linoone",["normal"],78,70,61,50,61,100,5,325,["pickup"],135,"Linoone always runs full speed and only in straight lines. If it wants to change direction, it stops."],
  [265,"Wurmple",["bug"],45,45,35,20,30,20,3,36,["shield-dust"],136,"Using the spikes on its rear end, Wurmple peels off bark and feeds on the sap that oozes out."],
  [266,"Silcoon",["bug"],50,35,55,25,25,15,6,100,["shed-skin"],136,"Silcoon tethers itself to a tree branch using silk threads to keep from falling."],
  [267,"Beautifly",["bug","flying"],60,70,50,100,50,65,10,284,["swarm"],136,"Beautifly has a long mouth like a coiled needle, convenient for collecting pollen from flowers."],
  [268,"Cascoon",["bug"],50,35,55,25,25,15,7,115,["shed-skin"],137,"Cascoon assumes an immobile defensive posture, blending with tree bark or rocks."],
  [269,"Dustox",["bug","poison"],60,50,70,50,90,65,12,316,["shield-dust"],137,"When Dustox flaps its wings, a fine dust is scattered around. This dust is a powerful poison."],
  [270,"Lotad",["water","grass"],40,30,30,40,50,20,5,26,["swift-swim"],138,"Lotad lives in ponds and lakes, floating on the surface. It grows weak if its broad leaf dies."],
  [271,"Lombre",["water","grass"],60,50,50,60,70,50,12,325,["swift-swim"],138,"Lombre is hardworking and diligent. It earned a role as the guardian of small Pokémon."],
  [272,"Ludicolo",["water","grass"],80,70,70,90,100,70,15,535,["swift-swim"],138,"When Ludicolo hears festive music, all its cells become stimulated and it becomes full of energy."],
  [273,"Seedot",["grass"],40,40,50,30,30,30,5,40,["chlorophyll"],139,"Seedot attaches itself to a tree branch using the top of its head. It sucks moisture from the tree."],
  [274,"Nuzleaf",["grass","dark"],60,70,40,60,40,60,10,280,["chlorophyll"],139,"Nuzleaf lives in densely overgrown forests. It occasionally ventures out to startle people."],
  [275,"Shiftry",["grass","dark"],90,100,60,90,60,80,13,596,["chlorophyll"],139,"Shiftry is a mysterious Pokémon said to live atop towering trees dating back millennia."],
  [276,"Taillow",["normal","flying"],40,55,30,30,30,85,3,23,["guts"],140,"Taillow courageously stands its ground against foes however strong they may be."],
  [277,"Swellow",["normal","flying"],60,85,60,50,50,125,7,198,["guts"],140,"Swellow is very conscientious about the upkeep of its glossy wings."],
  [278,"Wingull",["water","flying"],40,30,30,55,30,85,6,95,["keen-eye"],141,"Wingull has the habit of carrying food and valuables in its beak and hiding them."],
  [279,"Pelipper",["water","flying"],60,50,100,95,70,65,12,280,["keen-eye"],141,"Pelipper is a flying transporter that carries small Pokémon and eggs inside its massive bill."],
  [280,"Ralts",["psychic","fairy"],28,25,25,45,35,40,4,66,["synchronize"],142,"Ralts senses the emotions of people using the horns on its head. It rarely appears before people."],
  [281,"Kirlia",["psychic","fairy"],38,35,35,65,55,50,8,202,["synchronize"],142,"Kirlia uses the horns on its head to amplify its psychokinetic power."],
  [282,"Gardevoir",["psychic","fairy"],68,65,65,125,115,80,16,484,["synchronize"],142,"Gardevoir can distort the dimensions and create a small black hole to protect its Trainer."],
  [283,"Surskit",["bug","water"],40,30,32,50,52,65,5,17,["swift-swim"],143,"From the tips of its feet, Surskit secretes an oil that enables it to walk on water."],
  [284,"Masquerain",["bug","flying"],70,60,62,80,82,60,8,36,["intimidate"],143,"Masquerain intimidates enemies with the large eyelike patterns on its antennas."],
  [285,"Shroomish",["grass"],60,40,60,40,60,35,4,45,["effect-spore"],144,"Shroomish live in damp soil in the dark depths of forests. Often found under fallen leaves."],
  [286,"Breloom",["grass","fighting"],60,130,80,60,60,70,12,392,["effect-spore"],144,"Breloom closes in on its foe with light footwork, then throws punches with its stretchy arms."],
  [287,"Slakoth",["normal"],60,60,60,35,35,30,8,240,["truant"],145,"Slakoth lolls around and sleeps for more than 20 hours a day."],
  [288,"Vigoroth",["normal"],80,80,80,55,55,90,14,465,["vital-spirit"],145,"Vigoroth is always itching and agitated to go on a wild rampage. It can't contain its burning energy."],
  [289,"Slaking",["normal"],150,160,100,95,65,100,20,1305,["truant"],145,"Slaking spends all day lying down and lolling about. It eats grass growing within its reach."],
  [290,"Nincada",["bug","ground"],31,45,90,30,30,40,5,55,["compound-eyes"],146,"Nincada lives underground for many years in complete darkness, absorbing nutrients from tree roots."],
  [291,"Ninjask",["bug","flying"],61,90,45,50,50,160,8,120,["speed-boost"],146,"Ninjask is so agile and fast that it is very difficult to follow its movements with the naked eye."],
  [292,"Shedinja",["bug","ghost"],1,90,45,30,30,40,8,12,["wonder-guard"],146,"Shedinja's body is merely a hollow shell. There is no life inside the body."],
  [293,"Whismur",["normal"],64,51,23,51,23,28,6,165,["soundproof"],147,"Whismur is very timid. If it starts to cry loudly, it becomes startled by its own crying."],
  [294,"Loudred",["normal"],84,71,43,71,43,48,10,305,["soundproof"],147,"Loudred shouts with enough power to blow away a wood-framed house."],
  [295,"Exploud",["normal"],104,91,63,91,73,68,15,840,["soundproof"],147,"Exploud triggers earthquakes with the tremors it creates by bellowing. It never cries out unless in battle."],
  [296,"Makuhita",["fighting"],72,60,30,20,30,25,10,864,["thick-fat"],148,"Makuhita is tenacious — it will keep getting up and attacking however many times it is knocked down."],
  [297,"Hariyama",["fighting"],144,120,60,40,60,50,23,2538,["thick-fat"],148,"Hariyama's powerful hits can snap a telephone pole in two."],
  [298,"Azurill",["normal","fairy"],50,20,40,20,40,20,2,20,["thick-fat"],91,"Azurill can be seen bouncing on its large, rubbery tail. It can fling itself up to 10 meters away."],
  [299,"Nosepass",["rock"],30,45,135,45,90,30,10,970,["sturdy"],149,"Nosepass's large and pointed nose is a compass that always points north."],
  [300,"Skitty",["normal"],50,45,45,35,35,50,6,110,["cute-charm"],150,"Skitty has the habit of chasing its own tail and spinning in circles."],
  [301,"Delcatty",["normal"],70,65,65,55,55,90,11,326,["cute-charm"],150,"Delcatty prefers to live an unfettered existence doing as it pleases at its own pace."],
  [302,"Sableye",["dark","ghost"],50,75,75,65,65,50,5,110,["keen-eye"],151,"Sableye lead solitary lives deep inside caverns. They feed on crystals that make their eyes sparkly."],
  [303,"Mawile",["steel","fairy"],50,85,85,55,55,50,6,115,["hyper-cutter"],152,"Mawile's huge jaws are actually transformed steel horns. Its docile face lulls foes into letting down their guard."],
  [304,"Aron",["steel","rock"],50,70,100,40,40,30,4,600,["sturdy"],153,"Aron has a body of steel. With one all-out charge it can demolish even a heavy dump truck."],
  [305,"Lairon",["steel","rock"],60,90,140,50,50,40,9,1200,["sturdy"],153,"Lairon tempers its steel body by drinking highly nutritious mineral springwater until bloated."],
  [306,"Aggron",["steel","rock"],70,110,180,60,60,50,21,3600,["sturdy"],153,"Aggron claims an entire mountain as its territory. It mercilessly beats up anything that violates its environment."],
  [307,"Meditite",["fighting","psychic"],30,40,55,40,55,60,6,112,["pure-power"],154,"Meditite undertakes rigorous mental training deep in the mountains. However, it always gets hungry."],
  [308,"Medicham",["fighting","psychic"],60,60,75,60,75,80,13,315,["pure-power"],154,"Through yoga training, it gained the psychic power to predict its foe's next move."],
  [309,"Electrike",["electric"],40,45,40,65,40,65,6,152,["static"],155,"Electrike stores electricity in its long body hair and stimulates its leg muscles with electric charges."],
  [310,"Manectric",["electric"],70,75,60,105,60,105,15,402,["static"],155,"Manectric is constantly discharging electricity from its mane. The sparks sometimes ignite forest fires."],
  [311,"Plusle",["electric"],60,50,40,85,75,95,4,44,["plus"],156,"Plusle always acts as a cheerleader for its partners. It strikes its pom-poms together and cheers."],
  [312,"Minun",["electric"],60,40,50,75,85,95,4,42,["minus"],157,"Minun loves to cheer on its partners in battle. It gives off sparks from its body while doing so."],
  [313,"Volbeat",["bug"],65,73,55,47,75,85,7,177,["illuminate"],158,"Volbeat emits light from its tail to communicate with its peers and can adjust the flicker rate."],
  [314,"Illumise",["bug"],65,47,55,73,75,85,6,177,["oblivious"],159,"Illumise leads a flight of illuminated Volbeat to draw geometric designs in the night sky."],
  [315,"Roselia",["grass","poison"],50,60,45,100,80,65,3,20,["natural-cure"],160,"Roselia shoots sharp thorns as projectiles at the enemies that try to steal its flowers."],
  [316,"Gulpin",["poison"],70,43,53,43,53,40,4,103,["liquid-ooze"],161,"Most of Gulpin's body is made up of its stomach — its heart and brain are very small."],
  [317,"Swalot",["poison"],100,73,83,73,83,55,17,800,["liquid-ooze"],161,"Swalot has no teeth, so what it eats, it swallows whole. Its cavernous gullet can swallow a tire."],
  [318,"Carvanha",["water","dark"],45,90,20,65,20,65,8,208,["rough-skin"],162,"Carvanha's strongly developed jaw and razor-sharp teeth can tear apart the steel hulls of fishing boats."],
  [319,"Sharpedo",["water","dark"],70,120,40,95,40,95,18,888,["rough-skin"],162,"Nicknamed 'the bully of the sea', Sharpedo is widely feared. Its fangs grow back immediately if they fall out."],
  [320,"Wailmer",["water"],130,70,35,70,35,60,20,1300,["water-veil"],163,"Wailmer can store sea water inside its body to transform itself into a ball for bouncing around."],
  [321,"Wailord",["water"],170,90,45,90,45,60,145,3980,["water-veil"],163,"Wailord is the largest Pokémon. It can dive over a kilometer in the sea and surface without warning."],
  [322,"Numel",["fire","ground"],60,60,40,65,45,35,7,240,["oblivious"],164,"Numel is extremely dull witted — it doesn't notice being hit. However, it can't stand hunger."],
  [323,"Camerupt",["fire","ground"],70,100,70,105,75,40,19,2200,["magma-armor"],164,"The humps on Camerupt's back occasionally blast out molten magma."],
  [324,"Torkoal",["fire"],70,85,140,85,70,20,5,804,["white-smoke"],165,"Torkoal digs through mountains in search of coal. If it finds some, it fills hollow spaces in its shell."],
  [325,"Spoink",["psychic"],60,25,35,70,80,60,7,306,["thick-fat"],166,"Spoink bounces around on its tail. The shock of its bouncing is used to pump its heart."],
  [326,"Grumpig",["psychic"],80,45,65,90,110,80,9,716,["thick-fat"],166,"Grumpig uses the black pearls on its body to amplify its psychic power waves."],
  [327,"Spinda",["normal"],60,60,60,60,60,60,11,50,["own-tempo"],167,"Every Spinda's spot pattern is different. Using its dizzying movements, it confuses its enemies."],
  [328,"Trapinch",["ground"],45,100,45,45,45,10,7,150,["hyper-cutter"],168,"Trapinch's nest is a sloped, bowl-like pit dug in sand. It patiently waits for prey to tumble in."],
  [329,"Vibrava",["ground","dragon"],50,70,50,50,50,70,11,153,["levitate"],168,"To make prey faint, Vibrava generates ultrasonic waves by vigorously flapping its two pairs of wings."],
  [330,"Flygon",["ground","dragon"],80,100,80,80,80,100,20,820,["levitate"],168,"Flygon is nicknamed 'the mystic of the desert.' Sandstorms happen wherever it flies."],
  [331,"Cacnea",["grass"],50,85,40,85,40,35,4,513,["sand-veil"],169,"Cacnea lives in arid locations. The more arid and harsh the environment, the more it thrives."],
  [332,"Cacturne",["grass","dark"],70,115,60,115,60,55,13,774,["sand-veil"],169,"During the daytime Cacturne remains motionless in the blazing heat of the desert to conserve moisture."],
  [333,"Swablu",["normal","flying"],45,40,60,40,75,50,4,12,["natural-cure"],170,"Swablu has light and fluffy wings like cottony clouds. This Pokémon is not frightened of people."],
  [334,"Altaria",["dragon","flying"],75,70,90,70,105,80,11,206,["natural-cure"],170,"Altaria sings in a gorgeous soprano. Its wings are like a puff of cloud and it dances with grace."],
  [335,"Zangoose",["normal"],73,115,60,60,60,90,13,403,["immunity"],171,"Memories of battling its archrival Seviper are etched into every cell of Zangoose's body."],
  [336,"Seviper",["poison"],73,100,60,100,60,65,27,525,["shed-skin"],172,"Seviper shares a generations-long feud with Zangoose. Its scythe tail leaves a horrible poison."],
  [337,"Lunatone",["rock","psychic"],70,55,65,95,85,70,10,1680,["levitate"],173,"Lunatone was discovered where a meteorite fell. It will not move when stared in the eyes."],
  [338,"Solrock",["rock","psychic"],70,95,85,55,65,70,12,1540,["levitate"],173,"Solrock is a new species said to have fallen from space. It floats in silence and does not move."],
  [339,"Barboach",["water","ground"],50,48,43,46,41,60,4,19,["oblivious"],174,"Barboach's sensitive whiskers serve as a superb radar system. It hides in the mud."],
  [340,"Whiscash",["water","ground"],110,78,73,76,71,60,9,352,["oblivious"],174,"Whiscash is extremely territorial. Just one will claim a large pond as its exclusive territory."],
  [341,"Corphish",["water"],43,80,65,50,35,35,6,115,["hyper-cutter"],175,"Corphish catches prey with its sharp claws. It is not picky about food and will eat anything."],
  [342,"Crawdaunt",["water","dark"],63,120,85,90,55,55,11,327,["hyper-cutter"],175,"Crawdaunt has an aggressive nature that compels it to challenge other living things to battle."],
  [343,"Baltoy",["ground","psychic"],40,40,55,40,70,55,5,215,["levitate"],176,"Baltoy moves by spinning on its one leg. This Pokémon tends to be found in dry, desolate places."],
  [344,"Claydol",["ground","psychic"],60,70,105,70,120,75,15,1080,["levitate"],176,"Claydol is an enigmatic Pokémon said to have come to life after an ancient clay figure was exposed to a mysterious ray."],
  [345,"Lileep",["rock","grass"],66,41,77,61,87,23,10,238,["storm-drain"],177,"Lileep clings to rocks by attaching the base of its body and catches prey with its tentacles."],
  [346,"Cradily",["rock","grass"],86,81,97,81,107,43,15,604,["storm-drain"],177,"Cradily's tentacles are tipped with tiny suction cups to grab prey."],
  [347,"Anorith",["rock","bug"],45,95,50,40,50,75,7,128,["battle-armor"],178,"This primitive Pokémon was resurrected using genetic material from amber. It swims by flapping large fins."],
  [348,"Armaldo",["rock","bug"],75,125,100,70,80,45,15,682,["battle-armor"],178,"Armaldo is a Pokémon species that became extinct in prehistoric times. It is said to have walked on its hind legs."],
  [349,"Feebas",["water"],20,15,20,10,55,80,6,74,["swift-swim"],179,"Feebas is highly unattractive and unpopular. However, it is very hardy and has outstanding vitality."],
  [350,"Milotic",["water"],95,60,79,100,125,81,62,1620,["marvel-scale"],179,"Milotic has provided inspiration to many artists. It is often called the most beautiful Pokémon of all."],
  [351,"Castform",["normal"],70,70,70,70,70,70,3,8,["forecast"],180,"Castform changes its appearance with the weather. In clear weather, it has its normal form."],
  [352,"Kecleon",["normal"],60,90,70,60,120,40,10,220,["color-change"],181,"Kecleon changes its body coloration to blend in with its surroundings, stalking prey undetected."],
  [353,"Shuppet",["ghost"],44,75,35,63,33,45,6,63,["insomnia"],182,"Shuppet is attracted by feelings of jealousy and malice. It feeds on such dark emotions."],
  [354,"Banette",["ghost"],64,115,65,83,63,65,11,125,["insomnia"],182,"A doll that became a Pokémon over its grudge from being thrown away. It seeks the child that threw it away."],
  [355,"Duskull",["ghost"],20,40,90,30,90,25,8,150,["levitate"],183,"Duskull can pass through any wall no matter how thick. It pursues prey until the break of dawn."],
  [356,"Dusclops",["ghost"],40,70,130,60,130,25,16,306,["pressure"],183,"Dusclops's body is completely hollow. It is said that its hollow body is like a black hole."],
  [357,"Tropius",["grass","flying"],99,68,83,72,87,51,20,1000,["chlorophyll"],184,"Tropius lives in tropical jungles. The fruit growing around its neck is very popular with children."],
  [358,"Chimecho",["psychic"],65,50,70,95,80,65,6,10,["levitate"],185,"Chimecho makes its cries echo inside its hollow body. When enraged, its cries are incredibly strident."],
  [359,"Absol",["dark"],65,130,60,75,60,75,12,470,["pressure"],186,"Every time Absol appears before people, it is followed by a disaster such as an earthquake."],
  [360,"Wynaut",["psychic"],95,23,48,23,48,23,6,140,["shadow-tag"],101,"Wynaut can always be seen with a big smile on its face. It hides its sly nature behind a perpetual grin."],
  [361,"Snorunt",["ice"],50,50,50,50,50,50,7,168,["inner-focus"],187,"Snorunt can withstand cold of minus 150 degrees F. A home visited by this Pokémon will prosper."],
  [362,"Glalie",["ice"],80,80,80,80,80,80,15,2565,["inner-focus"],187,"Glalie has a body made of rock, which it hardens with an amazingly cold air."],
  [363,"Spheal",["ice","water"],70,40,50,55,50,25,8,395,["thick-fat"],188,"Spheal rolls across the ice, which makes it very efficient at traveling."],
  [364,"Sealeo",["ice","water"],90,60,70,75,70,45,11,876,["thick-fat"],188,"Sealeo has the habit of always juggling things on the tip of its nose while it sniffs their smell."],
  [365,"Walrein",["ice","water"],110,80,90,95,90,65,14,1506,["thick-fat"],188,"Walrein's two massively developed tusks can totally shatter blocks of ice weighing 10 tons."],
  [366,"Clamperl",["water"],35,64,85,74,55,32,4,525,["shell-armor"],189,"Clamperl spends its entire life in its shell without ever coming out. Its shell is extremely tough."],
  [367,"Huntail",["water"],55,104,105,94,75,52,17,270,["swift-swim"],189,"Huntail lives deep in the sea, surviving off of the fish it catches."],
  [368,"Gorebyss",["water"],55,84,105,114,75,52,18,226,["swift-swim"],189,"Although Gorebyss is the very picture of elegance while swimming, it is also cruel in battle."],
  [369,"Relicanth",["water","rock"],100,90,130,45,65,55,10,234,["swift-swim"],190,"Relicanth is a Pokémon species that lived for a hundred million years without ever changing its form."],
  [370,"Luvdisc",["water"],43,30,55,40,65,97,6,87,["swift-swim"],191,"Luvdisc makes its home in tropical seas. It earned its name by swimming after loving couples."],
  [371,"Bagon",["dragon"],45,75,60,40,30,50,6,421,["rock-head"],192,"Bagon has a dream of one day soaring in the sky. In doomed efforts to fly, it hurls itself off cliffs."],
  [372,"Shelgon",["dragon"],65,95,100,60,50,50,11,1105,["rock-head"],192,"Shelgon's body is encased in a tough shell of bone. It builds up tremendous energy inside."],
  [373,"Salamence",["dragon","flying"],95,135,80,110,80,100,15,1026,["intimidate"],192,"Salamence came into being by way of a strong, long-held dream of growing wings."],
  [374,"Beldum",["steel","psychic"],40,55,80,35,60,30,6,952,["clear-body"],193,"Beldum communicates by sending signals from its magnetic brain. It can float in the air."],
  [375,"Metang",["steel","psychic"],60,75,100,55,80,50,12,2025,["clear-body"],193,"Metang has the strength to tow a jet and the power to bend two Beldum magnets at once."],
  [376,"Metagross",["steel","psychic"],80,135,130,95,90,70,16,5500,["clear-body"],193,"Metagross has four brains in total. Combined, the four brains can breeze through difficult calculations."],
  [377,"Regirock",["rock"],80,100,200,50,100,50,17,2300,["clear-body"],194,"Regirock's body is made entirely of rocks, all unearthed from different locations."],
  [378,"Regice",["ice"],80,50,100,100,200,50,18,1750,["clear-body"],195,"Regice's body is made of ice from the ice age. No matter how much the temperature rises, it remains frozen."],
  [379,"Registeel",["steel"],80,75,150,75,150,50,19,2050,["clear-body"],196,"Registeel's body is made of a strange material that is not metal, yet clearly is not stone."],
  [380,"Latias",["dragon","psychic"],80,80,90,110,130,110,14,400,["levitate"],197,"Latias is highly intelligent and can understand human speech. It is covered with glass-like down."],
  [381,"Latios",["dragon","psychic"],80,90,80,130,110,110,20,600,["levitate"],198,"Latios can make itself invisible while flying, and understands human speech. It is highly intelligent."],
  [382,"Kyogre",["water"],100,100,90,150,140,90,45,3520,["drizzle"],199,"Kyogre is said to be the personification of the sea itself. It prays for rain and fills the world with water."],
  [383,"Groudon",["ground"],100,150,140,100,90,90,35,9500,["drought"],200,"Groudon is said to be the personification of the land itself. It widened the lands by evaporating water."],
  [384,"Rayquaza",["dragon","flying"],105,150,90,150,90,95,70,2065,["air-lock"],201,"Rayquaza is said to have lived for hundreds of millions of years, putting to rest the clash of Kyogre and Groudon."],
  [385,"Jirachi",["steel","psychic"],100,100,100,100,100,100,3,11,["serene-grace"],202,"Jirachi is said to grant any wish for just seven days every thousand years when it awakens."],
  [386,"Deoxys",["psychic"],50,150,50,150,50,150,17,608,["pressure"],203,"Deoxys emerged from a virus that came from space. The crystalline organ on its chest appears to be its brain."],
];

const POKEMON: Record<string | number, any> = {};
const BY_ID: any[] = [];
const BY_NAME: Record<string | number, string> = {}; // id -> url-safe name
RAW.forEach(r => {
  const p = {id:r[0],name:r[1],types:r[2],hp:r[3],atk:r[4],def:r[5],spa:r[6],spd:r[7],spe:r[8],height:r[9],weight:r[10],abilities:r[11],chain:r[12],flavor:r[13]};
  POKEMON[r[0] as string] = p;
  BY_ID.push(p);
  // pokemondb uses lowercase, hyphens, strips special chars
  BY_NAME[r[0] as string] = typeof r[1] === "string" ? r[1].toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-$/,"") : "";
});

const CHAINS: Record<string | number, any[]> = {};
BY_ID.forEach((p: any) => {
  if (!CHAINS[p.chain]) CHAINS[p.chain] = [];
  CHAINS[p.chain].push(p.id);
});

function useStorage<T>(key: string, def: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) as T : def; } catch { return def; }
  });
  const save = useCallback((v: T) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key]);
  return [val, save];
}

interface WelcomeScreenProps {
  onDone: (name: string) => void;
}
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const msgs = [
    "Hello there! Welcome to the world of POKéMON!",
    "My name is OAK! People call me the POKéMON PROF!",
    "This world is inhabited by creatures called POKéMON!",
    "But first — what is your name, Trainer?"
  ];
  useEffect(() => {
    if (step < msgs.length - 1) {
      const t = setTimeout(() => setStep((s: number) => s + 1), 1800);
      return () => clearTimeout(t);
    }
  }, [step]);
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#e53935,#b71c1c)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{background:"#fff",borderRadius:20,padding:"36px 44px",maxWidth:420,width:"90%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,.2)"}}>
        <img src={SPRITE(25)} style={{width:80,imageRendering:"pixelated",marginBottom:8}} />
        <div style={{fontSize:13,minHeight:90,marginBottom:20,lineHeight:1.8,color:"#333"}}>
          {msgs.slice(0, step+1).map((m,i) => <p key={i} style={{margin:"2px 0"}}>{m}</p>)}
        </div>
        {step === msgs.length-1 && (
          <div>
            <input autoFocus value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value.toUpperCase())}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && name.trim() && onDone(name.trim())}
              placeholder="YOUR NAME" maxLength={12}
              style={{border:"2px solid #e53935",color:"#333",fontSize:16,padding:"10px 16px",textAlign:"center",borderRadius:10,fontFamily:"inherit",width:"100%",boxSizing:"border-box",marginBottom:12,outline:"none"}} />
            <button onClick={() => name.trim() && onDone(name.trim())} disabled={!name.trim()}
              style={{background:name.trim()?"#e53935":"#ccc",border:"none",color:"#fff",padding:"12px",fontSize:14,fontFamily:"inherit",borderRadius:10,cursor:name.trim()?"pointer":"default",fontWeight:"bold",width:"100%"}}>
              START →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface TypeBadgeProps {
  type: string;
}
const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  return (
    <span style={{background:TYPE_COLORS[type]||"#aaa",color:"#fff",fontSize:11,fontWeight:"bold",padding:"4px 12px",borderRadius:20,letterSpacing:1,textTransform:"uppercase"}}>
      {type}
    </span>
  );
}

interface StatChipProps {
  label: string;
  value: number | string;
  color: string;
}
const StatChip: React.FC<StatChipProps> = ({ label, value, color }) => {
  return (
    <div style={{textAlign:"center",background:"#f8f8f8",borderRadius:12,padding:"8px 10px",minWidth:52,border:`2px solid ${color}`}}>
      <div style={{fontSize:10,fontWeight:"bold",color:"#888",letterSpacing:1}}>{label}</div>
      <div style={{fontSize:18,fontWeight:"bold",color:"#222",lineHeight:1.2}}>{value}</div>
    </div>
  );
}

interface DreamSpriteProps {
  id: number | string;
  shiny?: boolean;
}
const DreamSprite: React.FC<DreamSpriteProps> = ({ id, shiny = false }) => {
  const [useFallback, setUseFallback] = useState(false);
  useEffect(() => setUseFallback(false), [id, shiny]);
  if (shiny || useFallback) {
    return <img src={SPRITE(id, shiny)} style={{width:128,height:128,objectFit:"contain",imageRendering:"pixelated"}} />;
  }
  return <img src={DREAM(id)} onError={() => setUseFallback(true)} style={{width:128,height:128,objectFit:"contain"}} />;
}

interface PokedexProps {
  userName: string;
  onRename: () => void;
}
const Pokedex: React.FC<PokedexProps> = ({ userName, onRename }) => {
  const [id, setId] = useState(1);
  const [shiny, setShiny] = useState(false);
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false);
  const [listSearch, setListSearch] = useState("");

  const p = POKEMON[id];
  const chainIds = CHAINS[p.chain] || [];

  const go = (dir: number) => {
    const nid = Math.min(386, Math.max(1, id + dir));
    setId(nid);
    setShiny(false);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = search.trim().toLowerCase();
    if (!q) return;
    const n = parseInt(q);
    if (!isNaN(n) && POKEMON[n]) { setId(n); setSearch(""); return; }
    const found = BY_ID.find(x => x.name.toLowerCase() === q || x.name.toLowerCase().startsWith(q));
    if (found) { setId(found.id); setSearch(""); }
  };

  const filtered = BY_ID.filter(x =>
    !listSearch || x.name.includes(listSearch.toLowerCase()) || String(x.id).includes(listSearch)
  );

  const bgColor = TYPE_COLORS[p.types[0]] || "#e53935";

  return (
    <div style={{minHeight:"100vh",background:"#f2f2f2",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      {/* Header */}
      <div style={{background:`linear-gradient(90deg,${bgColor},${bgColor}cc)`,padding:"12px 20px",display:"flex",alignItems:"center",gap:12,transition:"background .4s",boxShadow:"0 2px 12px rgba(0,0,0,.15)"}}>
        <span style={{color:"#fff",fontWeight:"bold",fontSize:20,letterSpacing:2,flex:1}}>POKéDEX</span>
        <span style={{color:"rgba(255,255,255,.85)",fontSize:12}}>TRAINER: <strong style={{color:"#fff"}}>{userName}</strong></span>
        <button onClick={onRename} style={{background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.4)",color:"#fff",fontSize:11,padding:"4px 10px",borderRadius:20,cursor:"pointer"}}>Rename</button>
      </div>

      <div style={{maxWidth:520,margin:"0 auto",padding:"20px 16px"}}>
        {/* Search */}
        <form onSubmit={handleSearch} style={{display:"flex",gap:8,marginBottom:14}}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID or Name"
            style={{flex:1,border:"2px solid #e0e0e0",borderRadius:30,padding:"10px 18px",fontSize:13,outline:"none",fontFamily:"inherit",background:"#fff"}}
            onFocus={e => e.target.style.borderColor = bgColor}
            onBlur={e => e.target.style.borderColor = "#e0e0e0"} />
          <button type="submit" style={{background:bgColor,border:"none",color:"#fff",padding:"10px 20px",borderRadius:30,cursor:"pointer",fontWeight:"bold",fontSize:13,transition:"background .4s"}}>Go</button>
          <button type="button" onClick={() => setShowList(s => !s)} style={{background:"#fff",border:"2px solid #e0e0e0",color:"#555",padding:"10px 14px",borderRadius:30,cursor:"pointer",fontSize:16}}>☰</button>
        </form>

        {/* Browse list */}
        {showList && (
          <div style={{background:"#fff",borderRadius:16,padding:14,marginBottom:14,boxShadow:"0 4px 20px rgba(0,0,0,.1)",maxHeight:260,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <input value={listSearch} onChange={e => setListSearch(e.target.value)} placeholder="Filter..." autoFocus
                style={{flex:1,border:"1px solid #e0e0e0",borderRadius:20,padding:"6px 14px",fontSize:12,outline:"none"}} />
              <button onClick={() => { setShowList(false); setListSearch(""); }} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#999"}}>✕</button>
            </div>
            <div style={{overflowY:"auto",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
              {filtered.map(x => (
                <div key={x.id} onClick={() => { setId(x.id); setShowList(false); setListSearch(""); setShiny(false); }}
                  style={{padding:"4px 6px",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:4,
                    background:id===x.id?"#fff3f3":"transparent",border:`1px solid ${id===x.id?bgColor:"transparent"}`}}>
                  <img src={`https://img.pokemondb.net/sprites/sword-shield/icon/${BY_NAME[x.id]||"bulbasaur"}.png`} style={{width:28}} loading="lazy" />
                  <div>
                    <div style={{color:"#bbb",fontSize:9}}>#{String(x.id).padStart(3,"0")}</div>
                    <div style={{color:"#333",textTransform:"capitalize",fontSize:10}}>{x.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card */}
        <div style={{background:"#fff",borderRadius:24,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,.08)"}}>
          <div style={{background:`linear-gradient(135deg,${bgColor}33,${bgColor}11)`,padding:"24px 24px 16px",textAlign:"center",position:"relative"}}>
            <button onClick={() => go(-1)} disabled={id===1}
              style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,.8)",border:"none",borderRadius:"50%",width:38,height:38,fontSize:20,cursor:id===1?"not-allowed":"pointer",color:id===1?"#ddd":"#555",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
            <button onClick={() => go(1)} disabled={id===386}
              style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,.8)",border:"none",borderRadius:"50%",width:38,height:38,fontSize:20,cursor:id===386?"not-allowed":"pointer",color:id===386?"#ddd":"#555",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>

            <div style={{fontSize:11,color:"#999",fontWeight:"bold",letterSpacing:1}}>#{String(p.id).padStart(3,"0")}</div>
            <h2 style={{margin:"2px 0 6px",fontSize:24,fontWeight:"bold",color:"#1a1a1a",textTransform:"capitalize",letterSpacing:.5}}>{p.name}</h2>
            <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:16}}>
              {p.types.map((t: string) => <TypeBadge key={t} type={t} />)}
            </div>
            <div style={{display:"inline-block",background:"rgba(255,255,255,.6)",borderRadius:"50%",padding:16,width:156,height:156,boxSizing:"border-box",boxShadow:"0 4px 16px rgba(0,0,0,.1)"}}>
              <DreamSprite id={p.id} shiny={shiny} />
            </div>
            <div style={{marginTop:10}}>
              <button onClick={() => setShiny(s => !s)}
                style={{background:shiny?"#f1c40f":"rgba(255,255,255,.7)",border:`2px solid ${shiny?"#e6ac00":"#e0e0e0"}`,borderRadius:20,padding:"4px 14px",fontSize:11,cursor:"pointer",fontWeight:"bold",color:shiny?"#333":"#777"}}>
                ✨ {shiny ? "Shiny ON" : "Shiny OFF"}
              </button>
            </div>
          </div>

          <div style={{padding:"16px 20px 20px"}}>
            <p style={{textAlign:"center",fontSize:12,color:"#777",lineHeight:1.7,margin:"0 0 16px",minHeight:36}}>{p.flavor}</p>

            <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap",marginBottom:14}}>
              <StatChip label="HP"  value={p.hp}  color={STAT_COLORS.hp} />
              <StatChip label="ATK" value={p.atk} color={STAT_COLORS.atk} />
              <StatChip label="DEF" value={p.def} color={STAT_COLORS.def} />
              <StatChip label="SpA" value={p.spa} color={STAT_COLORS.spa} />
              <StatChip label="SpD" value={p.spd} color={STAT_COLORS.spd} />
              <StatChip label="SPD" value={p.spe} color={STAT_COLORS.spe} />
            </div>

            <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap",marginBottom:14}}>
              <div style={{background:"#f8f8f8",borderRadius:12,padding:"8px 16px",textAlign:"center"}}>
                <div style={{fontSize:10,color:"#aaa",fontWeight:"bold",letterSpacing:1}}>HEIGHT</div>
                <div style={{fontSize:14,fontWeight:"bold",color:"#444"}}>{(p.height*.1).toFixed(1)} m</div>
              </div>
              <div style={{background:"#f8f8f8",borderRadius:12,padding:"8px 16px",textAlign:"center"}}>
                <div style={{fontSize:10,color:"#aaa",fontWeight:"bold",letterSpacing:1}}>WEIGHT</div>
                <div style={{fontSize:14,fontWeight:"bold",color:"#444"}}>{(p.weight*.1).toFixed(1)} kg</div>
              </div>
              <div style={{background:"#f8f8f8",borderRadius:12,padding:"8px 16px",textAlign:"center"}}>
                <div style={{fontSize:10,color:"#aaa",fontWeight:"bold",letterSpacing:1}}>ABILITIES</div>
                {p.abilities.map((a: string) => <div key={a} style={{fontSize:11,fontWeight:"bold",color:"#444",textTransform:"capitalize"}}>{a}</div>)}
              </div>
            </div>

            {chainIds.length > 1 && (
              <div>
                <div style={{fontSize:10,fontWeight:"bold",color:"#bbb",letterSpacing:1,textTransform:"uppercase",marginBottom:8,textAlign:"center"}}>Evolution</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
                  {chainIds.map((cid, i) => (
                    <div key={cid} style={{display:"flex",alignItems:"center",gap:8}}>
                      {i > 0 && <span style={{color:"#ddd",fontSize:18}}>→</span>}
                      <div onClick={() => { setId(cid); setShiny(false); }}
                        style={{cursor:"pointer",textAlign:"center",padding:"6px 8px",borderRadius:12,
                          background:id===cid?"#fff3f3":"#f8f8f8",border:`2px solid ${id===cid?bgColor:"#eee"}`,transition:"all .15s"}}>
                        <img src={`https://img.pokemondb.net/sprites/sword-shield/icon/${BY_NAME[cid]||"bulbasaur"}.png`} style={{width:44,display:"block"}} loading="lazy" />
                        <div style={{fontSize:9,color:"#999",textTransform:"capitalize",marginTop:2}}>{POKEMON[cid]?.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button onClick={() => { setId(Math.ceil(Math.random()*386)); setShiny(false); }}
          style={{width:"100%",marginTop:12,background:`linear-gradient(90deg,${bgColor},${bgColor}bb)`,border:"none",
            color:"#fff",padding:"14px",borderRadius:16,fontSize:14,fontWeight:"bold",cursor:"pointer",
            letterSpacing:1,boxShadow:`0 4px 12px ${bgColor}55`,transition:"background .4s"}}>
          🎲 Pick for me
        </button>
        <div style={{textAlign:"center",marginTop:12,fontSize:10,color:"#ccc"}}>Gen 1–3 · 386 Pokémon · All data bundled offline</div>
      </div>
    </div>
  );
}

export default function App() {
  const [userName, setUserName] = useStorage<string | null>("pokedex_v4", null);
  const [renaming, setRenaming] = useState(false);
  if (!userName || renaming) {
    return <WelcomeScreen onDone={n => { setUserName(n); setRenaming(false); }} />;
  }
  return <Pokedex userName={userName} onRename={() => setRenaming(true)} />;
}
