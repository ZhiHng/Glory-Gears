// --- MAIN TABS ---
const links = document.querySelectorAll('.tab-link');
const contents = document.querySelectorAll('.tab-content');

// Set default main tab (first one active)
contents.forEach((c, i) => i === 0 && c.classList.add('active'));
links[0]?.classList.add('active');

// --- Sub-tabs: initialize default inside each main tab ---
document.querySelectorAll('.tab-content').forEach(tab => {
    const firstSubContent = tab.querySelector('.sub-tab-content');
    const firstSubLink = tab.querySelector('.sub-tab-link');

    firstSubContent?.classList.add('active');
    firstSubLink?.classList.add('active');
});

// --- MAIN TAB CLICK ---
links.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const tab = document.getElementById(targetId);
        if (!tab) {
            return;  
        };

    // Deactivate all main tabs
        contents.forEach(c => c.classList.remove('active'));
        links.forEach(l => l.classList.remove('active'));

    // Activate clicked main tab
        tab.classList.add('active');
        link.classList.add('active');

    // Reset sub-tabs inside this main tab
        tab.querySelectorAll('.sub-tab-content').forEach(c => c.classList.remove('active'));
        tab.querySelectorAll('.sub-tab-link').forEach(l => l.classList.remove('active'));

    // Activate default sub-tab (first one)
        const firstSubContent = tab.querySelector('.sub-tab-content');
        const firstSubLink = tab.querySelector('.sub-tab-link');
        firstSubContent?.classList.add('active');
        firstSubLink?.classList.add('active');

        window.scrollTo({ top: 0 });
    });
});

// --- SUB-TAB CLICK ---
const sublinks = document.querySelectorAll('.sub-tab-link');

sublinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const parentTab = link.closest('.tab-content');
        if (!parentTab) {
            return;
        };

    // Deactivate all sub-tabs in this section
        parentTab.querySelectorAll('.sub-tab-content').forEach(c => c.classList.remove('active'));
        parentTab.querySelectorAll('.sub-tab-link').forEach(l => l.classList.remove('active'));

    // Activate clicked sub-tab
        parentTab.querySelector(`#${targetId}`)?.classList.add('active');
        link.classList.add('active');
    });
});


document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case '1':
            targetId = 'login';
            break;
        case '2':
            targetId = 'signup';
            break;
        case '3':
            targetId = 'home';
            break;
        case '4':
            targetId = 'shop';
            break;
        case '5':
            targetId = 'story';
            break;
        case '6':
            targetId = 'explore';
            break;
        case '7':
            targetId = 'inventory';
            break;
        case '8':
            targetId = 'archive';
            break;
        default:
            break;
    }
    contents.forEach(content => content.classList.remove('active'));2
    links.forEach(l => l.classList.remove('active'));
    document.getElementById(targetId).classList.add('active'); //activate clicked tab elements
    window.scrollTo({top: 0});
});

//---------------GAME LOGIC----------------
//STORY
const story = {
    chapter1_1: {
        title: "Chapter 1 - A Strange Sword",
        text: [
        "Guard: Ok, you're free to go.",
        "It's been a long time since you have experienced freedom, ever since being caught and put into jail as an accomplice for a crime, cleaning up the crime scene. You are determined to start anew.",
        "You: First things first, I must find a way to sustain myself. I need money."
        ],
        image: "images/backgrounds/jail.jpeg",
        choices: [
        { text: "Ask around houses for a job", next: "chapter1_1_1" },
        { text: "Head to the adventurer's guild", next: "chapter1_1_2" }
        ]
    },

    chapter1_1_1: {
        title: "",
        text: [
        "Everyone rejects you, leaving you with no choice but to go to the adventurer's guild. A kind soul gives you some gold to help support your journey."
        ],
        image: "images/backgrounds/town.png",
        choices: [
        { text: "Continue", next: "chapter1_2" }
        ]
    },

    chapter1_1_2: {
        title: "",
        text: [
        "You sign up as an adventurer. Having just started out, you cannot accept high-rank quests."
        ],
        image: "images/backgrounds/town.png",
        choices: [
        { text: "Continue", next: "chapter1_2" }
        ]
    },

    chapter1_2: {
        title: "",
        text: [
        "You pick the lowest-rank quest, which is collecting herbs, and set out on your journey.",
        "After collecting the necessary herbs, you come across a group of bandits raiding a wandering traveller. The traveller flees the location. You stay hidden, watching from the shadows.",
        "Bandit 1: There's a bunch of useless loot, especially this dirty, rusted sword wrapped in cloth.",
        "Bandit 2: Just throw that out. I doubt we can even sell that.",
        "The bandits leave, and you approach the sword wrapped in cloth. Upon unwrapping the sword and coming into contact with it, you feel a strange force around its handle.",
        "You bring it back to town to try to sell it to traders. The traders say it's too dirty but might consider buying it if it were cleaner. Being a cleaner in the past, cleaning blood stains from crime scenes, this is up your alley.",
        "You set out to find specific kinds of soap, as not all soaps can remove the dirt material covering the sword. After cleaning it enough, you bring it back to the trader.",
        "A shady passerby wearing a cloak notices and advises you not to trade it and to hold onto it for now.",
        "Having a sword, you decide to take on a quest to fight slimes at the adventurer's guild. After fighting slimes, you encounter a demon while heading back to town. The demon corners you and closes the gap.",
        "You hold the sword out desperately, not knowing what to do, accepting death.",
        "The sword reacts to the demonic power, and the force around the handle starts to build up. In that instant, crystal shards start flying toward the demon, piercing through its abdomen and killing it, gathering around the sword's handle.",
        "After the bizarre incident, you stand there, shocked and bewildered, wondering what is even happening. Your once-rejected sword doesn't seem the same anymore. It looks as if it has been upgraded.",
        "You: How did it… do that? Is this what that passerby meant? That was insane."
        ],
        image: "images/backgrounds/forest.png",
        choices: [
        { text: "Head back to the adventurer's guild", next: "chapter1_2_1" },
        { text: "Swiftly exit the area and ask locals about the sword's value", next: "chapter1_2_2" }
        ]
    },

    chapter1_2_1: {
        title: "",
        text: [
        "You head back to the adventurer's guild and claim your reward for the quest you completed. While wandering around town, some traders catch sight of your sword. They crowd around you and start offering large sums of money for it."
        ],
        image: "images/backgrounds/town.png",
        choices: [
        { text: "Continue", next: "chapter1_3" }
        ]
    },

    chapter1_2_2: {
        title: "",
        text: [
        "You run back to town, breathless, asking the nearest trader for their opinion. Their eyes widen and their jaw drops. They offer you a large sum of gold. Other traders crowd around you, and you take the chance to slip out of the commotion.",
        "You return to the trader who initially had zero interest in the sword. His facial expression changes drastically from dispassionate to excited. He hurriedly offers you a lump sum of gold, telling you it's a good deal for both of you. You stand there, clueless and stunned.",
        "You: Wasn't this sword worth nothing?"
        ],
        image: "images/backgrounds/town.png",
        choices: [
        { text: "Continue", next: "chapter1_3" }
        ]
    },

    chapter1_3: {
        title: "",
        text: [
        "Just as you are about to accept the offer, a familiar voice calls out.",
        "Passerby: Don't do it!",
        "You turn your head and see the same passerby who advised you earlier.",
        "Passerby: Come with me. I need to tell you something.",
        "You agree to follow him, running to a trader's shop.",
        "Passerby: I'm sorry for all of this. It must be overwhelming. The sword you're holding right now… is one of the few legendary weapons in history. I know… crazy, right?",
        "What's even crazier is that I once wielded a similar weapon. It felt amazing just holding it, and even better using it to slay enemies. I felt like I was on top of the world.",
        "But one evening, I met a mysterious person. The atmosphere became heavy unsettling. I tried to ignore it, but it never went away. My sword suddenly felt more powerful.",
        "The person stood there menacingly, staring straight into my soul. I was confused; I had never seen or met him before. Then he attacked me. Fortunately, I was already warmed up from a quest earlier, so I managed to block it.",
        "We exchanged blows, but overall, he was the stronger warrior. I managed to escape, but I was gravely injured. During our battle, he talked about how he wanted my weapon and that he wouldn't stop until he got all of them.",
        "You: Wow… that's a lot to take in. Is he still out there?",
        "Passerby: Do you want to hear the story of the legendary heroes' battle?"
        ],
        image: "images/backgrounds/shop.png",
        choices: [
        { text: "Sure, tell me about it.", next: "chapter1_3_1" },
        { text: "It's fine. Just tell me what to do next.", next: "chapter1_3_2" }
        ]
    },

    chapter1_3_1: {
        title: "",
        text: [
        "It is said that the heroes of the past who wielded the five legendary weapons united to fight the calamity and its ruler, Peruare. Due to unforeseen circumstances, during the final moments of Peruare, he decomposed his physical form to amplify his spiritual body and fused together with the legendary weapons.",
        "The heroes celebrated the fall of the calamity and set out on their own paths. Over the days, there were rumors of sightings of Peruare roaming the wilderness. Reports came in of adventurers noticing Peruare feeding on animals and monsters, growing stronger and releasing more chaotic aura each time. By the time the heroes caught wind of the incident, it was already too late. The clones had grown incredibly strong.",
        "During clashes with each hero, they noticed that the clones only went after their weapons. Each time the clones were killed, they came back after a few days. In one clash between a hero and a clone, the hero was pulled down along with the clone into a bottomless chasm. However, once they fell to the bottom, their weapons started losing their vitality, and so did the clone.",
        "The hero concluded that the clones were manifesting from the weapons and that Peruare's soul was merged into them. The only way to stop the clones was to drain the weapons' power by covering them from sunlight.",
        "Having suspicion, the hero set out to warn the other heroes, only to find there were more clones after the other heroes' swords. The heroes suspected the clones were trying to bring the legendary weapons together to fuse Peruare's soul back together and revive him.",
        "They came up with a plan to bring the weapons together and shatter them all at once to finally defeat Peruare. But terror struck when they heard one hero had fallen with one legendary weapon now in the calamity's possession. They also noticed the clones becoming stronger day by day.",
        "Facing this, they decided not to risk losing their weapons to the calamity, with no guarantee they could break all the weapons at the same time to end it. Instead, they buried their weapons in different regions around the world, preventing the calamity from locating them.",
        "With their weapons' power drained, the clones' numbers were also reduced to one. In a final hope, they launched an all-out attack on the final clone to steal the weapon and prevent the calamity from recurring again. The heroes fell one after another, with the final hero throwing the last weapon into a deep cave, perishing after being impaled at the last second.",
        "Little did they know, some light was still reachable inside the cave. Though not enough energy to climb out, the final clone lay dormant there for eternity. All the heroes could hope for was that no one would ever find the legendary weapons and expose them to sunlight, powering the weapons and bringing the clones back.",
        "In the event that it does happen, may Peruare's power have withered enough over the years for a brave new soul to finish what they set out to do that fateful day."
        ],
        image: "images/backgrounds/grasslands.png",
        choices: [
        { text: "Continue", next: "chapter1_3_2" }
        ]
    },

    chapter1_3_2: {
        title: "",
        text: [
        "Passerby: I'm unsure if he's still out there, but always be on your feet. I've heard rumors of him still hunting down the weapons, most likely going after the Fire Scythe next.",
        "For now, do not sell your sword to anyone. The clone could be disguised as one of the traders. Oh, and the sword reacts strongly with you, so keep it safe and finish the job the heroes left undone by retrieving the weapons.",
        "You: Alright, I got you.",
        "You prepare to set out the next day."
        ],
        image: "images/backgrounds/shop.png",
        choices: [
        { text: "Continue", next: "end" }
        ]
    },

    chapter2_1: {
        title: "Chapter 2 - Race to the Fire Scythe",
        text: [
        "The passerby gives you some money to buy heat-resistant equipment and requests that you head to the desert to retrieve the Fire Scythe. You travel long distances until you reach a forgotten temple filled with monsters."
        ],
        image: "images/backgrounds/desert.png",
        choices: [
        { text: "Kill the monsters", next: "chapter2_1_1" },
        { text: "Sneak past them", next: "chapter2_1_2" }
        ]
    },

    chapter2_1_1: {
        title: "",
        text: [
        "You make sure to kill every monster you see and pick up their loot. While resting, the sword begins to glow brighter and feel more intense.",
        "You look up and see the clone running toward you. You clash with the clone, but due to being fatigued from earlier fights, you slip and fall. The clone rams into you, knocking you several meters back.",
        "He does not approach you. Instead, he grabs the crystal sword, stares you down coldly, and disappears into the shadows.",
        "You continue your journey in hopes of finding the Fire Scythe before the clone. Without the sword guiding you and helping you defeat monsters, the journey slows significantly.",
        "Finally, you spot a long spear in the middle of a massive room. Doubt starts to creep in. The clone suddenly jumps toward it. Seeing him eye the spear, you suspect it is what he's after.",
        "You race the clone to reach the spear first, but due to exhaustion, the clone reaches it before you. You watch as he pulls the spear from the pedestal.",
        "Thinking it's over, you are stunned when, as the dirt is removed, a sharp blade grows from the spear, slicing the clone's head in half.",
        "Taking this opportunity, you grab the newly transformed scythe and the crystal sword and flee the scene. Looking back, you spot two clones this time, not chasing."
        ],
        image: "images/backgrounds/desert.png",
        choices: [
        { text: "Continue", next: "end" }
        ]
    },

    chapter2_1_2: {
        title: "",
        text: [
        "You sneak past the monsters, carefully searching for the Fire Scythe. After wandering for a while, you notice the number of monsters dwindling. A sense of unease settles in as your sword steadily glows brighter.",
        "Eventually, you find a massive room with a spear embedded in a pedestal at its center. You stop in front of it and attempt to yank it out, but all your efforts are in vain.",
        "The clone appears from the shadows, saying nothing, staring you down. You can clearly feel it's aura at an exponentially larger scale since the last meeting. It spits out a monster head from its mouth and draws its sword, inviting you to a battle you cannot decline.",
        ],
        image: "images/backgrounds/desert.png",
        choices: [
        { text: "Fight", next: "chapter2_2" }
        ]
    },

    chapter2_2: {
        title: "",
        text: [
        "You overpower the clone and beat him to a pulp. In desperation, he dashes toward the spear and yanks it from the pedestal in a split second.",
        "Thinking it's over, you watch as a sharp blade grows from the spear, slicing the clone's head in half. Taking this opportunity, you grab the newly transformed scythe and flee the scene.",
        "Looking back, you spot two clones this time, not chasing."
        ],
        image: "images/backgrounds/desert.png",
        choices: [
        { text: "Continue", next: "end" }
        ]
    },

    chapter3_1: {
        title: "Chapter 3 - The Bow in The Sky",
        text: [
        "You reach the temple, and it transports you into the sky through a rising platform. You see the bow right in the middle of the room."
        ],
        image: "images/backgrounds/grasslands.png",
        choices: [
        { text: "Take the long, safer-looking way.", next: "chapter3_1_1" },
        { text: "Take the faster, booby-trapped-looking path.", next: "chapter3_1_2" }
        ]
    },

    chapter3_1_1: {
        title: "",
        text: [
        "You find a treasure chest along the way containing jewellery and precious gems. Nearing the bow, you spot the clones. This time, there are three of them.",
        "You: Aren't only two legendary weapons activated so far?",
        "When the clones approach the bow, they trigger a trap, spawning monsters around it. Taking this opportunity while the clones are busy, you sweep in, take them out swiftly, grab the bow, and flee."
        ],
        image: "images/backgrounds/grasslands.png",
        choices: [
        { text: "Continue", next: "chapter3_2" }
        ]
    },

    chapter3_1_2: {
        title: "",
        text: [
        "You trigger a trap and monsters spawn"
        ],
        image: "images/backgrounds/grasslands.png",
        choices: [
        { text: "Fight", next: "chapter3_1_3" }
        ]
    },

    chapter3_1_3: {
        title: "",
        text: [
        "You finally see the bow again and begin to approach it. As you pick up the bow, you notice something moving in the shadows. Upon closer inspection, you realize it is one of the clones.",
        "You make a run for it, and both clones chase after you. Looking forward, you see a third clone flanking you and manage to parry it just in time.",
        "You: Aren't only two legendary weapons activated so far?"
        ],
        image: "images/backgrounds/grasslands.png",
        choices: [
        { text: "Continue", next: "chapter3_2" }
        ]
    },

    chapter3_2: {
        title: "",
        text: [
        "The clones continue their chase, and through all the action, you accidentally rub the bow, revealing it beneath all the dust and dirt. The bow powers up, and unfortunately, so does another clone, appearing in front of you out of thin air.",
        "You barely dodge his attack as they push you into a corner. You think of a brilliant idea and raise the sword behind the scythe into the air. The sword's crystals power up the scythe using refraction to focus light onto it.",
        "You unleash a huge slash of flame, flying straight toward the clone. Unexpectedly, one of them pulls out a sceptre to absorb the energy. The sheer amount of heat causes his cloak to burn slightly. He gathers all the energy and shoots it back at you, knocking you down.",
        "Wasting no time, they take the bow and fly away with the weapon on their makeshift flying contraption.",
        "You return to town and meet the passerby at the usual place. This time, you notice his clothes and cloak are slightly darker. You tell him about the fourth clone and the sceptre that ruined your plans.",
        "Passerby: That means they've found the energy spectre, one of the legendary weapons. As of now, only one weapon remains before all the legendary weapons are reclaimed. The last weapon is the water staff, deep underground in the sea. I think it would be best if I accompanied you on this trip. After all, the extra clone makes things harder, and I think you could use some help.",
        "You take a well-needed rest and plan to set out the next day"
        ],
        image: "images/backgrounds/town.png",
        choices: [
        { text: "Continue", next: "end" }
        ]
    }
};

//INDEX
const weapons = {
    crystalPiercer: {
        name: "Crystal Piercer",
        description: "A legendary mystical sword once weilded by the hero of light. It is known for its lightweight build and razor sharp blade. Can be obtained from Chapter 1.",
        element: "Light",
        range: "Short",
        damage: 50,
        passive: "Damage against demonic enemies +50%",
        image: "images/weapons/crystalPiercer.png",
        price: 0
    },

    infernalCleaver: {
        name: "Infernal Cleaver",
        description: "A legendary mystical scythe once weilded by the hero of flame. It is known for emmiting scorching heat and its dual forms. Can be obtained from Chapter 2.",
        element: "Fire",
        range: "Long",
        damage: 40,
        passive: "Damage against non-boss enemies +50%",
        image: "images/weapons/infernalCleaver.png",
        price: 0
    },

    tempestArcs: {
        name: "Tempest Arcs",
        description: "A legendary mystical bow once weilded by the hero of electric. It is known for its accuracy and its ability to transform into a phoenix. Can be obtained from Chapter 3.",
        element: "Fire",
        range: "Very Long",
        damage: 35,
        passive: "Winning Chance +20%",
        image: "images/weapons/tempestArcs.png",
        price: 0
    },

    sturdyBroadsword: {
        name: "Sturdy Broadsword",
        description: "An ordinary broadsword that every novice adventurer can use. There's nothing special about it but it gets the job done. Can be obtained from the shop or by exploring.",
        element: "None",
        range: "Short",
        damage: 10,
        passive: "None",
        price: 20
    },

    sturdySpear: {
        name: "Sturdy Spear",
        description: "An ordinary spear that every novice adventurer can use. There's nothing special about it but it gets the job done. Can be obtained from the shop or by exploring.",
        element: "None",
        range: "Long",
        damage: 10,
        passive: "None",
        price: 25
    },

    sturdyBow: {
        name: "Sturdy Bow",
        description: "An ordinary bow that every novice adventurer can use. There's nothing special about it but it gets the job done. Can be obtained from the shop or by exploring.",
        element: "None",
        range: "Very Long",
        damage: 8,
        passive: "None",
        price: 15
    },

    frostSpear: {
        name: "Frost Spear",
        description: "A long spear that is imbued with ice elemental powers, forged from a Frost Gem. It is capable of emmiting ice elemental attacks to a reasonable extent. Can be obtained from exploring.",
        element: "Ice",
        range: "Long",
        passive: "Damage against small enemies +10%",
        price: 80
    },

    frostSword: {
        name: "Frost Sword",
        description: "A sleek sword that is imbued with ice elemental powers, forged from a Frost Gem. It is capable of emmiting ice elemental attacks to a reasonable extent. Can be obtained from shop.",
        element: "Ice",
        range: "Short",
        passive: "Elemental damage x1.5",
        price: 85
    },

    flameSpear: {
        name: "Flame Spear",
        description: "A long spear that is imbued with fire elemental powers, forged from a Flame Gem. It is capable of emmiting fire elemental attacks to a reasonable extent. Can be obtained from exploring.",
        element: "Fire",
        range: "Long",
        passive: "Damage against large enemies + 10%",
        price: 85
    },

    flameSword: {
        name: "Flame Sword",
        description: "A sleek sword that is imbued with fire elemental powers, forged from a Flame Gem. It is capable of emmiting fire elemental attacks to a reasonable extent. Can be obtained from shop.",
        element: "Fire",
        range: "Short",
        passive: "Cleaniness damage bonus +10%",
        price: 80
    },
};

const materials = {
    sponge: {
        name: "Sponge",
        description: "A versatile cleaning equipment usable in many situations. Required to clean weapons and restore them to their peak condition. Can be obtained from shop and exploring.",
        image: "",
        price: 2
    },

    soap: {
        name: "Soap",
        description: "A versatile cleaning equipment usable in many situations. Required to clean weapons and restore them to their peak condition. Can be obtained from shop and exploring.",
        price: 2
    },

    crystal: {
        name: "Crystal",
        description: "An enhancement material known for being highly unpredictable in its effects produced. Can be used to enhance weapons to get passive effects. Can be obtained from shop and exploring.",
        price: 30
    },

    flameGem: {
        name: "Flame Gem",
        description: "A precious gem imbued with fire elemental energy, known for producing effects that increase attack power of a weapon. Can be used to enhance weapons to get passive effects. Can be obtained from exploring and story.",
        price: 60
    },

    frostGem: {
        name: "Frost Gem",
        description: "A precious gem imbued with ice elemental energy, known for producing effects that increase efficiency against certain enemy sizes. Can be used to enhance weapons to get passive effects. Can be obtained from exploring and story.",
        price: 60
    },

    shockGem: {
        name: "Shock Gem",
        description: "A precious gem imbued with electric elemental energy, known for producing effects that multiplies attack power of a weapon. Can be used to enhance weapons to get passive effects. Can be obtained from exploring and story.",
        price: 60
    },

    energyGem: {
        name: "Energy Gem",
        description: "A precious gem imbued with energy elemental energy, known for producing effects that increases rewards found. Can be used to enhance weapons to get passive effects. Can be obtained from exploring and story.",
        price: 60
    },

    ring: {
        name: "Golden ring",
        description: "A gold ring that would fetch a high price by many. It is said to be worn by wealthy people only in the past. It does not really do much but it looks good. Can be obtained from exploring and story.",
        price: 50
    },

    bracelet: {
        name: "Jade Bracelet",
        description: "A jade bracelet that would fetch a high price by many. It is said to be worn by wealthy people only in the past. It does not really do much but it looks good. Can be obtained from exploring and story.",
        price: 40
    },

    magicOrb: {
        name: "Magic Orb",
        description: "A powerful magic orb imbued with potent elemental energy, known for producing multiple effects that increases or multiplies the attack power, efficiency against certain enemy sizes and rewards found. Can be used to enhance weapons to get passive effects. Can be obtained from exploring and story.",
        price: 100
    },
};

//REWARD DROPS
const rewardPool = [
    weapons.sturdyBroadsword, 
    weapons.sturdySpear, 
    weapons.sturdyBow, 
    weapons.frostSpear, 
    weapons.flameSpear, 
    materials.sponge, 
    materials.soap, 
    materials.crystal, 
    materials.flameGem, 
    materials.frostGem, 
    materials.shockGem, 
    materials.energyGem, 
    materials.ring, 
    materials.bracelet, 
    materials.magicOrb
]

function getReward() {
    
}
//PASSIVES

//DAMAGE CALCULATION

//EXPLORE GENERATION