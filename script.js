//PLAYER
const player = {
    equipped: "none",
    gold: 0,
    level: 1,
    chapter: 1
};
const inventory = {
    weapons: {
        
    },
    materials: {

    }
};

loadLocal()

// API
document.addEventListener("DOMContentLoaded", function () {
    
    const APIKEY = "698efea6bf4bccdbda53e4f4";
    let accountData = {
        accountId: [],
        username: [],
        password: [],
        savedata: []
    };
    
    let accountsLoaded = false;
    getAccounts();

    // LOGIN
    document.getElementById("submit-login").addEventListener("click", function (e) {
        e.preventDefault();

        if (!accountsLoaded) {
            alert("Still loading accounts, please try again in a moment.");
            return;
        }

        let usernameLogin = document.getElementById("username-login").value;
        let passwordLogin = document.getElementById("password-login").value;

        if (usernameLogin === "" || passwordLogin === "") {
            alert('Please fill in the required fields!');
            return;
        }

        if (accountData.username.includes(usernameLogin)) {
            let index = accountData.username.indexOf(usernameLogin);

            if (passwordLogin === accountData.password[index]) {
                Object.assign(player, accountData.savedata[index].player);
                inventory.weapons = accountData.savedata[index].inventory.weapons || {};
                inventory.materials = accountData.savedata[index].inventory.materials || {};
                currentChapter = player.chapter;

                localStorage.setItem("accountId", accountData.accountId[index]);
                localStorage.removeItem("gloryGearsSave");
                localStorage.setItem("gloryGearsSave", JSON.stringify(buildSaveData()));
                saveLocal();
                setActiveMainTab('home');
            } else {
                alert('Username or Password is incorrect!');
                document.getElementById("login-form").reset();
            }
        } else {
            alert("Account not found!");
        }
    });

    // SIGNUP
    document.getElementById("submit-signup").addEventListener("click", function (e) {
        e.preventDefault();

        let usernameSignup = document.getElementById("username-signup").value;
        let passwordSignup = document.getElementById("password-signup").value;

        if (usernameSignup === "" || passwordSignup === "") {
            alert('Please fill in the required fields!');
            return;
        }
        if (usernameSignup.length < 3) {
            alert("Username must be at least 3 characters.");
            return;
        }

        if (accountData.username.includes(usernameSignup)) {
            alert("Username already exists. Please choose another one.");
            return;
        }

        let jsondata = {
            username: usernameSignup,
            password: passwordSignup,
            savedata: {
                player: {
                    equipped: "none",
                    gold: 0,
                    level: 1,
                    chapter: 1
                },
                inventory: {
                    weapons: {},
                    materials: {}
                },
                lastSave: Date.now()
            }
        };

        document.getElementById("submit-signup").disabled = true;  
        fetch("https://glorygears-4a39.restdb.io/rest/accounts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache"
            },
            body: JSON.stringify(jsondata),
        })
        .then(res => res.json())
        .then(data => {
            console.log("Account created:", data);
            localStorage.removeItem("gloryGearsSave");
            localStorage.setItem("accountId", data._id);
            localStorage.setItem("gloryGearsSave", JSON.stringify(jsondata.savedata));
            currentChapter = player.chapter;
            Object.assign(player, jsondata.savedata.player);
            inventory.weapons = {};
            inventory.materials = {};
            saveLocal();

            setActiveMainTab('home');
            
        })
        .finally(() => {
            document.getElementById("submit-signup").disabled = false;
        });
    });

    // FETCH ACCOUNTS
    function getAccounts() {
        fetch("https://glorygears-4a39.restdb.io/rest/accounts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache"
            }
        })
        .then(res => res.json())
        .then(response => {
            accountData.accountId = [];
            accountData.username = [];
            accountData.password = [];
            accountData.savedata = [];

            for (let i = 0; i < response.length; i++) {
                accountData.accountId.push(response[i]._id);
                accountData.username.push(response[i].username);
                accountData.password.push(response[i].password);
                accountData.savedata.push(response[i].savedata);
            }

            console.log("Accounts loaded:", accountData);
            accountsLoaded = true;
        });
    }
});

function saveToApi() {
    saveLocal();

    const accountId = localStorage.getItem("accountId");
    if (!accountId || accountId === "Guest") {
        alert('No account signed in');
        saveBtn.disabled = false;
        return;
    };
    const saveData = buildSaveData();

    fetch(`https://glorygears-4a39.restdb.io/rest/accounts/${accountId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": "698efea6bf4bccdbda53e4f4"
        },
        body: JSON.stringify({
            savedata: saveData
        })
    })
    .then(res => {
        saveBtn.disabled = false;
        if (!res.ok) {
            throw new Error("HTTP " + res.status);
        }
        return res.json();
    })
    .then(data => {
        console.log("Cloud save success:", data);
        alert("Saved to cloud!");
    })
    .catch(err => {
        console.error("Cloud save failed:", err);
        alert("Cloud save failed. Local save kept.");
    });
}

window.addEventListener("beforeunload", () => {
    saveToApi();
});

let guestLogin = document.querySelectorAll('.guest-login');
guestLogin.forEach(btn => {
    btn.addEventListener('click', () => {
        localStorage.setItem("accountId", "Guest");
        setActiveMainTab('home');
    });
});

const saveBtn = document.querySelector('#save-btn');
saveBtn.addEventListener('click', () => {
    saveBtn.disabled = true;
    saveToApi();
});

document.addEventListener("keydown", function(event) {
    let targetId = '';
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
        case '9':
            addInventory({ type: "weapon", key: "crystalPiercer", item: weapons.crystalPiercer});
            addInventory({ type: "weapon", key: "infernalCleaver", item: weapons.infernalCleaver});
            addInventory({ type: "weapon", key: "tempestArcs", item: weapons.tempestArcs});
        case '0':
            console.log(inventory);
            console.log(player);
            break;
        default:
            break;
    }
    setActiveMainTab(targetId);
    window.scrollTo({top: 0});
});



document.addEventListener('click', () => {
    new Audio('audio/click.wav').play();
});

let cpRecharge = 0;
let icRecharge = 0;
let taRecharge = 0;

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

// --- FUNCTION TO SWITCH MAIN TAB MANUALLY ---
function setActiveMainTab(tabId) {
    currentAudio?.pause();
    const tab = document.getElementById(tabId);
    const link = document.querySelector(`.tab-link[href="#${tabId}"]`);

    if (!tab) return;
    if (inventory.weapons[player.equipped]?.uses === 0 && player.equipped != "none") {   
        alert(`Your ${weapons[player.equipped].name} needs to recover its energy. You unequipped it.`);
        player.equipped = "none"
    }
    if (cpRecharge > 4 && inventory.weapons?.crystalPiercer && inventory.weapons?.crystalPiercer?.uses != 3) {
        cpRecharge = 0;
        inventory.weapons.crystalPiercer.uses++;
    }
    if (icRecharge > 4 && inventory.weapons?.infernalCleaver && inventory.weapons?.infernalCleaver?.uses != 3) {
        icRecharge = 0;
        inventory.weapons.infernalCleaver.uses++;
    }
    if (taRecharge > 4 && inventory.weapons?.tempestArcs && inventory.weapons?.tempestArcs?.uses != 3) {
        taRecharge = 0;
        inventory.weapons.tempestArcs.uses++;
    }

    // Deactivate all main tabs
    contents.forEach(c => c.classList.remove('active'));
    links.forEach(l => l.classList.remove('active'));

    // Activate selected main tab
    tab.classList.add('active');
    if (link) link.classList.add('active');
    
    // Reset sub-tabs inside this main tab
    tab.querySelectorAll('.sub-tab-content').forEach(c => c.classList.remove('active'));
    tab.querySelectorAll('.sub-tab-link').forEach(l => l.classList.remove('active'));

    // Activate default sub-tab
    const firstSubContent = tab.querySelector('.sub-tab-content');
    const firstSubLink = tab.querySelector('.sub-tab-link');
    firstSubContent?.classList.add('active');
    firstSubLink?.classList.add('active');

    saveLocal();
    window.scrollTo({ top: 0 });
}

// --- MAIN TAB CLICK ---
links.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        setActiveMainTab(targetId);
    });
});

// --- SUB-TAB CLICK ---
const sublinks = document.querySelectorAll('.sub-tab-link');

sublinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const parentTab = link.closest('.tab-content');
        if (!parentTab) return;

        // Deactivate all sub-tabs in this section
        parentTab.querySelectorAll('.sub-tab-content').forEach(c => c.classList.remove('active'));
        parentTab.querySelectorAll('.sub-tab-link').forEach(l => l.classList.remove('active'));

        // Activate clicked sub-tab
        parentTab.querySelector(`#${targetId}`)?.classList.add('active');
        link.classList.add('active');
    });
});

//---------------GAME LOGIC----------------
//STORY
const story = {
    chapter1_1: {
        title: "A Strange Sword",
        text: [
        "Guard: Ok, you're free to go.",
        "It's been a long time since you have experienced freedom, ever since being caught and put into jail as an accomplice for a crime, cleaning up the crime scene. You are determined to start anew.",
        "You: First things first, I must find a way to sustain myself. I need money."
        ],
        image: "images/backgrounds/jail.jpeg",
        audio: "audio/walk.wav",
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
        audio: "audio/grassland.wav",
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
        audio: "audio/bell.wav",
        choices: [
        { text: "Sure, tell me about it.", next: "chapter1_3_1" },
        { text: "It's fine. Just tell me what to do next.", next: "chapter1_3_2" }
        ]
    },

    chapter1_3_1: {
        title: "",
        text: [
        "It is said that the heroes of the past who wielded the five legendary weapons united to fight the calamity and its ruler, Peruere. Due to unforeseen circumstances, during the final moments of Peruere, he decomposed his physical form to amplify his spiritual body and fused together with the legendary weapons.",
        "The heroes celebrated the fall of the calamity and set out on their own paths. Over the days, there were rumors of sightings of Peruere roaming the wilderness. Reports came in of adventurers noticing Peruere feeding on animals and monsters, growing stronger and releasing more chaotic aura each time. By the time the heroes caught wind of the incident, it was already too late. The clones had grown incredibly strong.",
        "During clashes with each hero, they noticed that the clones only went after their weapons. Each time the clones were killed, they came back after a few days. In one clash between a hero and a clone, the hero was pulled down along with the clone into a bottomless chasm. However, once they fell to the bottom, their weapons started losing their vitality, and so did the clone.",
        "The hero concluded that the clones were manifesting from the weapons and that Peruere's soul was merged into them. The only way to stop the clones was to drain the weapons' power by covering them from sunlight.",
        "Having suspicion, the hero set out to warn the other heroes, only to find there were more clones after the other heroes' swords. The heroes suspected the clones were trying to bring the legendary weapons together to fuse Peruere's soul back together and revive him.",
        "They came up with a plan to bring the weapons together and shatter them all at once to finally defeat Peruere. But terror struck when they heard one hero had fallen with one legendary weapon now in the calamity's possession. They also noticed the clones becoming stronger day by day.",
        "Facing this, they decided not to risk losing their weapons to the calamity, with no guarantee they could break all the weapons at the same time to end it. Instead, they buried their weapons in different regions around the world, preventing the calamity from locating them.",
        "With their weapons' power drained, the clones' numbers were also reduced to one. In a final hope, they launched an all-out attack on the final clone to steal the weapon and prevent the calamity from recurring again. The heroes fell one after another, with the final hero throwing the last weapon into a deep cave, perishing after being impaled at the last second.",
        "Little did they know, some light was still reachable inside the cave. Though not enough energy to climb out, the final clone lay dormant there for eternity. All the heroes could hope for was that no one would ever find the legendary weapons and expose them to sunlight, powering the weapons and bringing the clones back.",
        "In the event that it does happen, may Peruere's power have withered enough over the years for a brave new soul to finish what they set out to do that fateful day."
        ],
        image: "images/backgrounds/grasslands.png",
        audio: "audio/grassland.wav",
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
        title: "Race to the Fire Scythe",
        text: [
        "The passerby gives you some money to buy heat-resistant equipment and requests that you head to the desert to retrieve the Fire Scythe. You travel long distances until you reach a forgotten temple filled with monsters."
        ],
        image: "images/backgrounds/desert.png",
        audio: "audio/desert.wav",
        choices: [
        { text: "Kill the monsters", next: "fight_chapter2_1_1" },
        { text: "Sneak past them", next: "chapter2_1_2" }
        ]
    },

    fight_chapter2_1_1: {
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
        audio: "audio/desert.wav",
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
        { text: "Fight", next: "fight_chapter2_2" }
        ]
    },

    fight_chapter2_2: {
        title: "",
        text: [
        "You overpower the clone and beat him to a pulp. In desperation, he dashes toward the spear and yanks it from the pedestal in a split second.",
        "Thinking it's over, you watch as a sharp blade grows from the spear, slicing the clone's head in half. Taking this opportunity, you grab the newly transformed scythe and flee the scene.",
        "Looking back, you spot two clones this time, not chasing."
        ],
        image: "images/backgrounds/desert.png",
        audio: "audio/desert.wav",
        choices: [
        { text: "Continue", next: "end" }
        ]
    },

    chapter3_1: {
        title: "The Bow in The Sky",
        text: [
        "You reach the temple, and it transports you into the sky through a rising platform. You see the bow right in the middle of the room."
        ],
        image: "images/backgrounds/grasslands.png",
        audio: "audio/grassland.wav",
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
        { text: "Fight", next: "fight_chapter3_1_3" }
        ]
    },

    fight_chapter3_1_3: {
        title: "",
        text: [
        "You finally see the bow again and begin to approach it. As you pick up the bow, you notice something moving in the shadows. Upon closer inspection, you realize it is one of the clones.",
        "You make a run for it, and both clones chase after you. Looking forward, you see a third clone flanking you and manage to parry it just in time.",
        "You: Aren't only two legendary weapons activated so far?"
        ],
        image: "images/backgrounds/grasslands.png",
        audio: "audio/grassland.wav",
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
        price: "Cannot be bought or sold"
    },

    infernalCleaver: {
        name: "Infernal Cleaver",
        description: "A legendary mystical scythe once weilded by the hero of flame. It is known for emitting scorching heat and its dual forms. Can be obtained from Chapter 2.",
        element: "Fire",
        range: "Long",
        damage: 40,
        passive: "Damage against non-boss enemies +50%",
        image: "images/weapons/infernalCleaver.png",
        price: "Cannot be bought or sold"
    },

    tempestArcs: {
        name: "Tempest Arcs",
        description: "A legendary mystical bow once weilded by the hero of electric. It is known for its accuracy and its ability to transform into a phoenix. Can be obtained from Chapter 3.",
        element: "Electric",
        range: "Very Long",
        damage: 35,
        passive: "Winning Chance +20%",
        image: "images/weapons/tempestArcs.png",
        price: "Cannot be bought or sold"
    },

    sturdyBroadsword: {
        name: "Sturdy Broadsword",
        description: "An ordinary broadsword that every novice adventurer can use. There's nothing special about it but it gets the job done. Can be obtained from the shop or by exploring.",
        element: "None",
        range: "Short",
        damage: 10,
        passive: "None",
        image: "images/weapons/sword.jpeg",
        price: 20
    },

    sturdySpear: {
        name: "Sturdy Spear",
        description: "An ordinary spear that every novice adventurer can use. There's nothing special about it but it gets the job done. Can be obtained from the shop or by exploring.",
        element: "None",
        range: "Long",
        damage: 10,
        passive: "None",
        image: "images/weapons/spear.jpeg",
        price: 25
    },

    sturdyBow: {
        name: "Sturdy Bow",
        description: "An ordinary bow that every novice adventurer can use. There's nothing special about it but it gets the job done. Can be obtained from the shop or by exploring.",
        element: "None",
        range: "Very Long",
        damage: 8,
        passive: "None",
        image: "images/weapons/bow.jpeg",
        price: 15
    },

    frostSpear: {
        name: "Frost Spear",
        description: "A long spear that is imbued with ice elemental powers, forged from a Frost Gem. It is capable of emitting ice elemental attacks to a reasonable extent. Can be obtained from exploring.",
        element: "Ice",
        range: "Long",
        damage: 16,
        passive: "Damage against small enemies +10%",
        image: "images/weapons/frostSpear.jpeg",
        price: 80
    },

    frostSword: {
        name: "Frost Sword",
        description: "A sleek sword that is imbued with ice elemental powers, forged from a Frost Gem. It is capable of emitting ice elemental attacks to a reasonable extent. Can be obtained from shop.",
        element: "Ice",
        range: "Short",
        damage: 17,
        passive: "Elemental damage x1.5",
        image: "images/weapons/frostSword.jpeg",
        price: 85
    },

    flameSpear: {
        name: "Flame Spear",
        description: "A long spear that is imbued with fire elemental powers, forged from a Flame Gem. It is capable of emitting fire elemental attacks to a reasonable extent. Can be obtained from exploring.",
        element: "Fire",
        range: "Long",
        damage: 17,
        passive: "Damage against large enemies + 10%",
        image: "images/weapons/flameSpear.jpeg",
        price: 85
    },

    flameSword: {
        name: "Flame Sword",
        description: "A sleek sword that is imbued with fire elemental powers, forged from a Flame Gem. It is capable of emitting fire elemental attacks to a reasonable extent. Can be obtained from shop.",
        element: "Fire",
        range: "Short",
        damage: 18,
        passive: "cleanliness damage bonus +10%",
        image: "images/weapons/flameSword.jpeg",
        price: 80
    },
};

const materials = {
    sponge: {
        name: "Sponge",
        key: "sponge",
        description: "A versatile cleaning equipment usable in many situations. Required to clean weapons and restore them to their peak condition. Can be obtained from shop and exploring.",
        image: "images/materials/sponge.jpeg",
        price: 2
    },

    soap: {
        name: "Soap",
        key: "soap",
        description: "A versatile cleaning equipment usable in many situations. Required to clean weapons and restore them to their peak condition. Can be obtained from shop and exploring.",
        image: "images/materials/soap.jpeg",
        price: 2
    },

    crystal: {
        name: "Crystal",
        key: "crystal",
        description: "An enhancement material known for being highly unpredictable in its effects produced. Can be used to enhance weapons to get passive effects. Can be obtained from shop and exploring.",
        image: "images/materials/crystal.jpeg",
        price: 30
    },

    flameGem: {
        name: "Flame Gem",
        key: "flameGem",
        description: "A precious gem imbued with fire elemental energy, known for producing effects that increase attack power of a weapon. Can be used to enhance weapons to get passive effects. Can be obtained from exploring and story.",
        image: "images/materials/flameGem.jpeg",
        price: 60
    },

    frostGem: {
        name: "Frost Gem",
        key: "frostGem",
        description: "A precious gem imbued with ice elemental energy, known for producing effects that increase efficiency against certain enemy sizes. Can be used to enhance weapons to get passive effects. Can be obtained from exploring and story.",
        image: "images/materials/frostGem.jpeg",
        price: 60
    },

    shockGem: {
        name: "Shock Gem",
        key: "shockGem",
        description: "A precious gem imbued with electric elemental energy, known for producing effects that multiplies attack power of a weapon. Can be used to enhance weapons to get passive effects. Can be obtained from exploring and story.",
        image: "images/materials/shockGem.jpeg",
        price: 60
    },

    energyGem: {
        name: "Energy Gem",
        key: "energyGem",
        description: "A precious gem imbued with energy elemental energy, known for producing effects that increases rewards found. Can be used to enhance weapons to get passive effects. Can be obtained from exploring and story.",
        image: "images/materials/energyGem.jpeg",
        price: 60
    },

    ring: {
        name: "Golden ring",
        key: "ring",
        description: "A gold ring that would fetch a high price by many. It is said to be worn by wealthy people only in the past. It does not really do much but it looks good. Can be obtained from exploring and story.",
        image: "images/materials/goldRing.jpeg",
        price: 50
    },

    bracelet: {
        name: "Jade Bracelet",
        key: "bracelet",
        description: "A jade bracelet that would fetch a high price by many. It is said to be worn by wealthy people only in the past. It does not really do much but it looks good. Can be obtained from exploring and story.",
        image: "images/materials/bracelet.jpeg",
        price: 40
    },

    magicOrb: {
        name: "Magic Orb",
        key: "magicOrb",
        description: "A powerful magic orb imbued with potent elemental energy, known for producing multiple effects that increases or multiplies the attack power, efficiency against certain enemy sizes and rewards found. Can be used to enhance weapons to get passive effects. Can be obtained from exploring and story.",
        image: "images/materials/magicOrb.jpeg",
        price: 100
    },
};

//REWARD DROPS
const rewardPool = [
    { type: "weapon", key: "sturdyBroadsword", item: weapons.sturdyBroadsword },
    { type: "weapon", key: "sturdySpear", item: weapons.sturdySpear },
    { type: "weapon", key: "sturdyBow", item: weapons.sturdyBow },
    { type: "weapon", key: "frostSpear", item: weapons.frostSpear },
    { type: "weapon", key: "flameSpear", item: weapons.flameSpear },

    { type: "material", key: "sponge", item: materials.sponge },
    { type: "material", key: "soap", item: materials.soap },
    { type: "material", key: "crystal", item: materials.crystal },
    { type: "material", key: "flameGem", item: materials.flameGem },
    { type: "material", key: "frostGem", item: materials.frostGem },
    { type: "material", key: "shockGem", item: materials.shockGem },
    { type: "material", key: "energyGem", item: materials.energyGem },
    { type: "material", key: "ring", item: materials.ring },
    { type: "material", key: "bracelet", item: materials.bracelet },
    { type: "material", key: "magicOrb", item: materials.magicOrb }
];

const shopPool = [
    { key: "sturdyBroadsword", category: "weapons", object: weapons.sturdyBroadsword },
    { key: "sturdySpear", category: "weapons", object: weapons.sturdySpear },
    { key: "sturdyBow", category: "weapons", object: weapons.sturdyBow },
    { key: "frostSword", category: "weapons", object: weapons.frostSword },
    { key: "flameSword", category: "weapons", object: weapons.flameSword },
    { key: "sponge", category: "materials", object: materials.sponge },
    { key: "soap", category: "materials", object: materials.soap },
    { key: "crystal", category: "materials", object: materials.crystal },
];


function getReward() {
    const weights = rewardPool.map(r => 1 / r.item.price);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let roll = Math.random() * totalWeight;

    for (let i = 0; i < rewardPool.length; i++) {
        roll -= weights[i];
        if (roll <= 0) {
            return rewardPool[i];
        }
    }
}
//PASSIVES
const passives = {
    flameGem: {
        "1": "Damage increases by 5%",
        "2": "Damage increases by 10%",
        "3": "Damage increases by 15%",
        "4": "Damage increases by 20%",
        "5": "Elemental damage increases by 5%",
        "6": "Elemental damage increases by 10%",
        "7": "Elemental damage increases by 15%",
        "8": "Elemental damage increases by 20%",
        "9": "Bow damage increases by 10%",
        "10": "Sword damage increases by 10%",
        "11": "Spear damage increases by 10%"
    },
    frostGem: {
        "1": "Efficiency against small enemies increases by 5%",
        "2": "Efficiency against small enemies increases by 10%",
        "3": "Efficiency against small enemies increases by 15%",
        "4": "Efficiency against small enemies increases by 20%",
        "5": "Efficiency against large enemies increases by 5%",
        "6": "Efficiency against large enemies increases by 10%",
        "7": "Efficiency against large enemies increases by 15%",
        "8": "Efficiency against large enemies increases by 20%",
        "9": "Bow damage against large increases by 10%",
        "10": "Sword damage against small increases by 10%",
        "11": "Spear damage against small increases by 10%"
    },
    shockGem: {
        "1": "Damage multiplier x1.1",
        "2": "Damage multiplier x1.2",
        "3": "Damage multiplier x1.4",
        "4": "Damage multiplier x1.5",
        "5": "Elemental damage multiplier x1.1",
        "6": "Elemental damage multiplier x1.2",
        "7": "Elemental damage multiplier x1.4",
        "8": "Elemental damage multiplier x1.5",
        "9": "Bow damage multiplier x1.3%",
        "10": "Sword damage multiplier x1.3",
        "11": "Spear damage multiplier x1.3"
    },
    energyGem: {
        "1": "Reward drops +1",
        "2": "Reward drops +2",
        "3": "Reward drops +3",
        "4": "High value reward drop chance +20%",
        "5": "High value reward drop chance +30%",
        "6": "High value reward drop chance +40%",
        "7": "High value reward drop chance +50%",
        "8": "Reward drops x2",
        "9": "Reward drops x3",
        "10": "Soap drop x3",
        "11": "Sponge drop x2"
    },
};

//DAMAGE CALCULATION
function getDamage(enemyElement, enemyRange) {
    let baseDmg = 0;
    let range = "";
    let element = "";
    let cleanliness = "";
    if (player.equipped == 'none') {
        baseDmg = 3;
        range = "Short"
        element = "None"
        cleanliness = "Dirty"
    } else {
        baseDmg = weapons[player.equipped].damage;
        range = weapons[player.equipped].range;
        element = weapons[player.equipped].element;
        cleanliness = inventory.weapons[player.equipped].cleanliness;
    }
    if (cleanliness == "Mild Dirty") {
        baseDmg += 15
    } else if (cleanliness == "Clean") {
        baseDmg += 30
    }
    if ((element == "Light" && enemyElement == "Dark") || (element == "Ice" && enemyElement == "Fire") || (element == "Fire" && enemyElement == "Ice") || (element == "Electric" && enemyElement == "Energy") || (element == "Ice" && enemyElement == "Water") || (element == "Fire" && enemyElement == "Electric")) {
        baseDmg *= Math.min(1.2, 1.6*Math.random());
    };
    if ((range === "Very Long" && (enemyRange === "Long" || enemyRange === "Short")) || (range === "Long" && enemyRange === "Short")) {
        baseDmg += 10*Math.random();
    }
    baseDmg += Math.round(player.level*0.3);
    //Passive not being coded into damage calculation due to complexity
    return baseDmg
}

function determineWin(enemyDamage, enemyElement, enemyRange) {
    let totalDmg = getDamage(enemyElement, enemyRange);
    let prob = totalDmg / enemyDamage + (player.level*0.15)
    if (Math.random() <= Math.min(prob, 0.95)) {
        return "Win";
    } else {
        return "Lose";
    }
}

//EXPLORE GENERATION
const encounters = {
    grasslands: {
        traderGold: {
            text: [
            "You come accross a wandering trader.",
            "Trader: Hello fellow adventurer, do I have anything that interests you? Feel free to take a look around. Business has been hard these days... I just want to surprise my wife with a gift. Ya know she likes gold. Who does'nt anyways haha.",
            "I've got a special offer for you. If you have an energy gem, i'll trade it for 3 crystals."
            ],
            choices: ["Buy/Sell", "Trade"]
        },
        traderGem1: {
            text: [
            "You come accross a wandering trader.",
            "Trader: Hello fellow adventurer, do I have anything that interests you? Feel free to take a look around. The other day I came accross some mages, they were carryng those staffs. They look so cool!! Especially the gems sitting on the top of the staffs.",
            "I've got a special offer for you. If you have a gold ring, i'll trade it for 30 soap."
            ],
            choices: ["Buy/Sell", "Trade"]
        },
        enemySlime: {
            text: [
            "You encountered a slime.",
            "Element: Water",
            "Reach: Short"
            ],
            damage: 15,
            choices: ["Fight", "Flee"]
        },
        enemyRouge: {
            text: [
            "You encountered a bandit rouge.",
            "Element: None",
            "Reach: Short"
            ],
            damage: 25,
            choices: ["Fight", "Flee"]
        },
        enemyMage: {
            text: [
            "You encountered a bandit mage.",
            "Element: Fire",
            "Reach: Very Long"
            ],
            damage: 27,
            choices: ["Fight", "Flee"]
        },
        find: {
            text: [
            "You scavenge the grasslands for anything valuable.",
            ],
            choices: ["Continue"]
        },
        text: "You can travel to the grasslands where there are tall grasses, bright atmosphere and an open area, the perfect place for travellers.",
        textOption: "Continue in the grasslands",
        audio: "audio/grassland.wav",
        image: "images/backgrounds/grasslands.png"
    },

    desert: {
        traderGem2: {
            text: [
            "You come accross a wandering trader.",
            "Trader: Hello fellow adventurer, do I have anything that interests you? Feel free to take a look around. It's really hot in the desert isn't it. I could really use something to cool me down.",
            "I've got a special offer for you. If you have a shock gem, i'll trade it for a flame gem."
            ],
            choices: ["Buy/Sell", "Trade"]
        },
        enemyScorpion: {
            text: [
            "You encountered a scorpion.",
            "Element: None",
            "Reach: Short"
            ],
            damage: 18,
            choices: ["Fight", "Flee"]
        },
        enemyDemon: {
            text: [
            "You encountered a demon.",
            "Element: Dark",
            "Reach: Short"
            ],
            damage: 35,
            choices: ["Fight", "Flee"]
        },
        enemyWorm: {
            text: [
            "You encountered a giant sand worm.",
            "Element: Fire",
            "Reach: Long"
            ],
            damage: 30,
            choices: ["Fight", "Flee"]
        },
        find: {
            text: [
            "You scavenge the desert for anything valuable.",
            ],
            choices: ["Continue"]
        },
        text: "You can travel to the desert where there may be creatures lurking within the sands. Despite the blazing and freezing temperatures, people still travel here to get from region to region.",
        textOption: "Explore the desert",
        audio: "audio/desert.wav",
        image: "images/backgrounds/desert.png"
    },

    snow: {
        traderWeapon: {
            text: [
            "You come accross a wandering trader.",
            "Trader: Hello fellow adventurer, do I have anything that interests you? Feel free to take a look around. None of my weapons do much in this weather conditions man...",
            "I've got a special offer for you. If you have a magic orb, i'll trade it for a frost gem and a flame gem."
            ],
            choices: ["Buy/Sell", "Trade"]
        },
        enemySpirit: {
            text: [
            "You encountered an ice spirit.",
            "Element: Ice",
            "Reach: Long"
            ],
            damage: 19,
            choices: ["Fight", "Flee"]
        },
        enemyYeti: {
            text: [
            "You encountered a Yeti.",
            "Element: Ice",
            "Reach: Short"
            ],
            damage: 29,
            choices: ["Fight", "Flee"]
        },
        enemyTheif: {
            text: [
            "You encountered a theif.",
            "Element: Electric",
            "Reach: Short"
            ],
            damage: 23,
            choices: ["Fight", "Flee"]
        },
        find: {
            text: [
            "You scavenge the snowy plains for anything valuable.",
            ],
            choices: ["Continue"]
        },
        text: "You can travel to the snow plains. People rarely travel here due to unpredictable temperature drops, leaving this region mostly unknown to people.",
        textOption: "Brave the snow",
        audio: "audio/snow.wav",
        image: "images/backgrounds/snow.png"
    },

    forest: {
        enemyMimic: {
            text: [
            "You encountered an chest mimic.",
            "Element: Water",
            "Reach: Short"
            ],
            damage: 17,
            choices: ["Fight", "Flee"]
        },
        enemyElf: {
            text: [
            "You encountered an elf.",
            "Element: Light",
            "Reach: Very Long"
            ],
            damage: 25,
            choices: ["Fight", "Flee"]
        },
        enemyDemon: {
            text: [
            "You encountered a Demon.",
            "Element: Dark",
            "Reach: Long"
            ],
            damage: 37,
            choices: ["Fight", "Flee"]
        },
        enemyGoblin: {
            text: [
            "You encountered a goblin.",
            "Element: None",
            "Reach: Long"
            ],
            damage: 20,
            choices: ["Fight", "Flee"]
        },
        find: {
            text: [
            "You scavenge the forest for anything valuable.",
            ],
            choices: ["Continue"]
        },
        text: "You can travel to the forest. It is best to be careful as you never know what might lurk in the trees. It may bring you fortune, or be your worst nightmare.",
        textOption: "Try your luck in the forest",
        audio: "audio/walk.wav",
        image: "images/backgrounds/forest.png"
    },
    
    cave: {
        enemyOgre: {
            text: [
            "You encountered a cave ogre.",
            "Element: None",
            "Reach: Short"
            ],
            damage: 28,
            choices: ["Fight", "Flee"]
        },
        enemyDragon: {
            text: [
            "You encountered a baby dragon.",
            "Element: Fire",
            "Reach: Long"
            ],
            damage: 30,
            choices: ["Fight", "Flee"]
        },
        enemyShaman: {
            text: [
            "You encountered a Shaman.",
            "Element: Electric",
            "Reach: Very Long"
            ],
            damage: 31,
            choices: ["Fight", "Flee"]
        },
        enemyGoblin: {
            text: [
            "You encountered a goblin.",
            "Element: None",
            "Reach: Short"
            ],
            damage: 16,
            choices: ["Fight", "Flee"]
        },
        find: {
            text: [
            "You scavenge the cave for anything valuable.",
            ],
            choices: ["Continue"]
        },
        text: "You can travel to the caves. It is relatively dark inside with creepy sounds coming from within periodically.",
        textOption: "Enter the cave",
        audio: "audio/cave.wav",
        image: "images/backgrounds/cave.png"
    }
};

function getRandomKeyFromObj(object) {
    let keys = Object.keys(object);
    let randomKey = keys[Math.floor(Math.random() * keys.length)];

    return randomKey;
};

//MAIN INTERACTION
const invBtn = document.querySelector('#inv-btn');
const archiveBtn = document.querySelector('#archive-btn');
const storyBtn = document.querySelector('#story-btn');
const exploreBtn = document.querySelector('#explore-btn');
const storyOptionBtns = document.querySelector('#explore-btn');
const exploreOptionBtns = document.querySelectorAll('.explore-option');
const shopBtn = document.querySelector('#shop-btn');
const exploreText = document.querySelector('#explore-text');
const exploreBackground = document.querySelectorAll('.bg-explore');
const storyText = document.querySelector('#story-text');
var energy = 5;

let currentAudio;

function playAudio(src) {
    currentAudio?.pause();
    currentAudio = new Audio(src);
    currentAudio.play();
}

function setExploreButtons(texts = [], active = [true, true, true]) {
    exploreOptionBtns.forEach((btn, i) => {
        btn.textContent = texts[i] || "";
        btn.classList.toggle('active', !!active[i]);
    });
}

function getRandomEncounterKey(location) {
    const keys = Object.keys(encounters[location]).filter(
        k => !["text", "textOption", "audio", "image"].includes(k)
    );
    return keys[Math.floor(Math.random() * keys.length)];
}
//HOME BUTTONS
exploreBtn.addEventListener('click', () => {
    setActiveMainTab('explore');
    energy = 5;
    if (player.equipped != "crystalPiercer") {
        cpRecharge++;
    }
    if (player.equipped != "infernalCleaver") {
        icRecharge++;
    }
    if (player.equipped != "tempestArcs") {
        taRecharge++;
    }
    if (player.equipped == "crystalPiercer" || player.equipped == "infernalCleaver" || player.equipped == "tempestArcs") {
        inventory.weapons[player.equipped].uses--;
        
    }
    getExploreFork()
});
shopBtn.addEventListener('click', () => {
    openShop('home');
});
invBtn.addEventListener('click', () => {
    openInventory();
    previousTab = 'home'
});
archiveBtn.addEventListener('click', () => {
    currentChapter = player.chapter;
    previousTab = 'home'
});
storyBtn.addEventListener('click', () => {
    startStory();
});

//INVENTORY
const invWeaponTab = document.querySelector('#inventorymaterial .sub-tab-link:nth-child(1)');
const invMaterialTab = document.querySelector('#inventoryweapon .sub-tab-link:nth-child(2)');

var inventoryMode = "weapons";

invWeaponTab.addEventListener('click', () => {
    inventoryMode = "weapons";
    resetInventoryWeapons();
    selectFirstInventoryItem();
});

invMaterialTab.addEventListener('click', () => {
    inventoryMode = "materials";
    resetInventoryMaterials();
    selectFirstInventoryItem();
});

function openInventory() {
    setActiveMainTab('inventory');

    inventoryMode = "weapons";
    resetInventoryWeapons();
    resetInventoryMaterials();
    selectFirstInventoryItem();
    playAudio('audio/materials.wav');
}

function selectFirstInventoryItem() {
    if (inventoryMode === "weapons") {
        currentInventoryEntry = inventoryWeaponEntries[0];
        resetItemPreview(currentInventoryEntry.object, currentInventoryEntry.owned);
    }

    if (inventoryMode === "materials") {
        currentInventoryEntry = inventoryMaterialEntries[0];
        resetItemPreview(currentInventoryEntry.object, currentInventoryEntry.owned);
    }
    updateInventoryButtons();
}

const weaponContainer = document.querySelector('#inventoryweapon .scrollable-section');
var inventoryWeaponEntries = [];
var currentInventoryEntry = {};

function resetInventoryWeapons() {
    weaponContainer.innerHTML = '';
    inventoryWeaponEntries = [];

    const ownedKeys = Object.keys(inventory.weapons);
    const allKeys = Object.keys(weapons);

    // Owned first
    const orderedKeys = [
        ...ownedKeys,
        ...allKeys.filter(k => !ownedKeys.includes(k)) //Everything else then ... to spread it into one array.
    ];

    orderedKeys.forEach(key => {
        const weapon = weapons[key];
        const owned = !!inventory.weapons[key];

        const div = document.createElement('div');
        div.className = 'weapon-img';

        if (owned) {
            div.style.background = `url(${weapon.image}) center / contain no-repeat`;
        } else {
            div.style.background = `url("images/icons/locked.png") center / contain no-repeat`;
            div.classList.add('locked'); // optional CSS styling
        }

        const entry = { key, category: "weapons", object: weapon, owned };
        inventoryWeaponEntries.push(entry);

        div.addEventListener('click', () => {
            currentInventoryEntry = entry;
            resetItemPreview(weapon, owned);
            updateInventoryButtons();
        });

        weaponContainer.appendChild(div);
    });
}

const materialContainer = document.querySelector('#inventorymaterial .scrollable-section');
let inventoryMaterialEntries = [];

function resetInventoryMaterials() {
    materialContainer.innerHTML = '';
    inventoryMaterialEntries = [];

    const ownedKeys = Object.keys(inventory.materials);
    const allKeys = Object.keys(materials);

    const orderedKeys = [
        ...ownedKeys,
        ...allKeys.filter(k => !ownedKeys.includes(k))
    ];

    orderedKeys.forEach(key => {
        const mat = materials[key];
        const owned = !!inventory.materials[key];

        const div = document.createElement('div');
        div.className = 'material-img';

        if (owned) {
            div.style.background = `url(${mat.image}) center / contain no-repeat`;
        } else {
            div.style.background = `url("images/icons/locked.png") center / contain no-repeat`;
            div.classList.add('locked');
        }

        const entry = { key, category: "materials", object: mat, owned };
        inventoryMaterialEntries.push(entry);

        div.addEventListener('click', () => {
            currentInventoryEntry = entry;
            resetItemPreview(mat, owned);
            updateInventoryButtons();
        });

        materialContainer.appendChild(div);
    });
}


const invWeaponBtns = document.querySelectorAll('.inv-weapon-btn');
const [equipBtn, enchantBtn, cleanBtn] = invWeaponBtns;

function updateInventoryButtons() {
    const isWeaponTab = inventoryMode === "weapons";

    invWeaponBtns.forEach(btn => {
        btn.style.display = isWeaponTab ? 'inline-block' : 'none';
    });

    if (!currentInventoryEntry || currentInventoryEntry.category !== "weapons") {
        invWeaponBtns.forEach(btn => btn.disabled = true);
        return;
    }

    const owned = currentInventoryEntry.owned;

    equipBtn.disabled = !owned;
    enchantBtn.disabled = !owned;
    cleanBtn.disabled = !owned;
}


equipBtn.addEventListener('click', () => {
    if (!currentInventoryEntry?.owned) return;
    if (inventory.weapons[currentInventoryEntry.key]?.uses == 0) {
        alert(`Your ${currentInventoryEntry.object.name} needs to recover its energy.`);
        return;
    }
    player.equipped = currentInventoryEntry.key;
    alert(`You equipped ${currentInventoryEntry.object.name}.`);
});

enchantBtn.addEventListener('click', () => {
    if (!currentInventoryEntry?.owned) return;

    const enchantOptions = `
        Enchanting the same item again would not stack the passive effects.<br>
        Enchanting effects stack with the weapons' base passive effect.<br><br>
        <b>Select a gem to enchant the weapon with:</b><br>
        <button class="enchant-opt">Crystal</button>
        <button class="enchant-opt">Flame Gem</button>
        <button class="enchant-opt">Frost Gem</button>
        <button class="enchant-opt">Shock Gem</button>
        <button class="enchant-opt">Energy Gem</button>
    `;

    previewText.forEach(div => div.innerHTML = enchantOptions);

    document.querySelectorAll('.enchant-opt').forEach((btn, i) => {
        let gemKey = "";
        switch (i) {
            case 0:
                gemKey = "crystal";
                break;
            case 1:
                gemKey = "flameGem";
                break;
            case 2:
                gemKey = "frostGem";
                break;
            case 3:
                gemKey = "shockGem";
                break;
            case 4:
                gemKey = "energyGem";
                break;
            default:
                break;
        }

        if (!inventory.materials[gemKey]) {
            btn.disabled = true;
            btn.style.opacity = 0.4;
        }

        btn.addEventListener('click', () => {
            inventory.materials[gemKey]--;
            if (inventory.materials[gemKey] <= 0) {
                delete inventory.materials[gemKey];
            }
            let passiveAdded = "";
            if (gemKey == "crystal") {
                let category = getRandomKeyFromObj(passives);
                passiveAdded = passives[category][getRandomKeyFromObj(category)];
            } else {
                passiveAdded = passives[gemKey][getRandomKeyFromObj(passives[gemKey])];
            }
            playAudio('audio/enchant.wav');
            alert(`You enchant the weapon with a ${materials[gemKey].name} and gained the passive effect: ${passiveAdded}`);
            inventory.weapons[currentInventoryEntry.key].passive = passiveAdded;
            if (!inventory.materials[gemKey]) {
                btn.disabled = true;
                btn.style.opacity = 0.4;
            }
        });
    });
});

cleanBtn.addEventListener('click', () => {
    if (!currentInventoryEntry?.owned) return;

    const key = currentInventoryEntry.key;
    const weaponState = inventory.weapons[key];

    let soapCost = 0;
    const spongeCost = 5;

    if (weaponState.cleanliness === "Dirty") soapCost = 10;
    else if (weaponState.cleanliness === "Mild Dirty") soapCost = 5;
    else {
        alert("Weapon is already clean.");
        return;
    }

    if ((inventory.materials.sponge || 0) < spongeCost) {
        alert(`Not enough sponge! You need ${spongeCost} sponge.`);
        return;
    }

    if ((inventory.materials.soap || 0) < soapCost) {
        alert(`Not enough soap! You need ${soapCost} soap.`);
        return;
    }

    inventory.materials.sponge -= spongeCost;
    inventory.materials.soap -= soapCost;
    playAudio('audio/clean.wav');
    if (inventory.materials.sponge <= 0) delete inventory.materials.sponge;
    if (inventory.materials.soap <= 0) delete inventory.materials.soap;

    if (weaponState.cleanliness === "Dirty") weaponState.cleanliness = "Mild Dirty";
    else if (weaponState.cleanliness === "Mild Dirty") weaponState.cleanliness = "Clean";

    resetInventoryMaterials(); 
    resetInventoryWeapons();

    resetItemPreview(currentInventoryEntry.object, true);
});

//EXPLORE
let exploreContext = {};

function getExploreFork() {
    if (energy === 0) {
        exploreText.innerHTML = "You are way too tired to continue on. You head back to town and rest up."
        setExploreButtons(["Continue", "", ""], [true, false, false]);
        exploreContext = {type: "tired"}
    } else {
        currentAudio?.pause();
        playAudio("audio/walk.wav");
        exploreOptionBtns.forEach(i => {i.classList.add('active')});
        let loc1 = getRandomKeyFromObj(encounters);
        let loc2 = getRandomKeyFromObj(encounters);
        while (loc1 === loc2) {
            loc2 = getRandomKeyFromObj(encounters);
        }

        exploreContext = {
            type: "fork",
            options: [loc1, loc2]
        };

        let finalText = `You travel for a while and come across a fork in the pathway. You can travel to two locations. <br>${encounters[loc1].text}<br>${encounters[loc2].text}`;
        exploreText.innerHTML = finalText;
        exploreBackground[0].style.width = `50vw`;
        exploreBackground[1].style.width = `50vw`;
        exploreBackground[0].style.background = `url(${encounters[loc1].image}) center / cover no-repeat`;
        exploreBackground[1].style.background = `url(${encounters[loc2].image}) center / cover no-repeat`;
        setExploreButtons([encounters[loc1].textOption, encounters[loc2].textOption, "Go back to town"], [true, true, true]);
    }
};


function resetTextExplore(location) {
    const sceneKey = getRandomEncounterKey(location)
    const exploreScene = encounters[location][sceneKey];
    let encounterType = '';
    let enemyDmg = 0;
    let enemyElement = "";
    let enemyRange = "";
    if (sceneKey.includes('enemy')) {
        encounterType = 'fight';
        enemyDmg = exploreScene.damage;
        enemyElement = exploreScene.text[1].substring(9);
        enemyRange = exploreScene.text[2].substring(7);
    } else if (sceneKey.includes('trader')) {
        encounterType = 'trade';
    } else {
        encounterType = 'find';
    }
    exploreContext = {
        type: encounterType,
        loc: location,
        scene: sceneKey,
        dmg: enemyDmg,
        element: enemyElement,
        range: enemyRange
    };

    let finalText = '';
    exploreScene.text.forEach(string => {
        finalText += string + "<br>";
    });
    if (encounterType == 'fight') {
        finalText += `Estimated chance of victory: ${(Math.min(getDamage(enemyElement, enemyRange)/enemyDmg, 0.95)*100).toFixed(2)}%`;
    }
    exploreText.innerHTML = finalText;
    if (encounterType == "trade") {
        setExploreButtons([exploreScene.choices[0], exploreScene.choices[1], "Leave"], [true, true, true]);
    } else if (encounterType == "find") {
        setExploreButtons([exploreScene.choices[0], exploreScene.choices[1], "Leave"], [true, false, false]);
    } else {
        setExploreButtons([exploreScene.choices[0], exploreScene.choices[1], ""], [true, true, false]);
    }
    
    playAudio(encounters[location].audio);
};

exploreOptionBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        if (!btn.classList.contains('active')) return;
        if (exploreContext.type === 'fork') {
            if (i == 2) {
                setActiveMainTab('home');
                return;
            }
            resetTextExplore(exploreContext.options[i]);
            exploreBackground[0].style.background = `url(${encounters[exploreContext.loc].image}) center / cover no-repeat`;
            exploreBackground[0].style.width = `100vw`;
            exploreBackground[1].style.width = `0vw`;
        } else if (exploreContext.type === 'fight') {
            if (i == 0) {
                playAudio('audio/sword.wav');
                if (determineWin(exploreContext.dmg, exploreContext.element, exploreContext.range) === "Win") {
                    exploreText.innerHTML = addInventory(getReward());
                    player.level++;
                    exploreContext = {type: "continue"}
                } else {
                    inventory.materials = {};
                    exploreText.innerHTML = "Your enemy was too strong and ended up overwhelming you and eventually you fall unconcious. You wake up losing all your materials.";
                    exploreContext = {type: "lose"}
                }
                setExploreButtons(["Continue", "", ""], [true, false, false]);
            } else if (i == 1) {
                energy -= 1;
                getExploreFork()
            }
        } else if (exploreContext.type === "continue") {
            energy -= 1;
            getExploreFork()
        } else if (exploreContext.type === "lose") {
            setActiveMainTab('home')
        } else if (exploreContext.type === "tired") {
            setActiveMainTab('home')
        } else if (exploreContext.type === "find") {
            exploreText.innerHTML = addInventory(getReward());
            setExploreButtons(["Continue", "", ""], [true, false, false]);
            exploreContext = {type: "continue"};
        } else if (exploreContext.type === "trade") {
            if (i == 0) {
                openShop('explore');
            } else if (i == 1) {
                if (exploreContext.scene.includes("Gold")) {
                    if (inventory.materials.energyGem) {
                        inventory.materials.energyGem--;
                        if (inventory.materials.energyGem == 0) {delete inventory.materials.energyGem}
                        addInventory({ type: "material", key: "crystal", item: materials.crystal });
                        addInventory({ type: "material", key: "crystal", item: materials.crystal });
                        addInventory({ type: "material", key: "crystal", item: materials.crystal });
                        alert(`Thank you for your patronage!`);
                    } else {
                        alert(`You do not have enough materials.`);
                    }
                } else if (exploreContext.scene.includes("Gem1")) {
                    if (inventory.materials.ring) {
                        inventory.materials.ring--;
                        if (inventory.materials.ring == 0) {delete inventory.materials.ring}
                        addInventory({ type: "material", key: "soap", item: materials.soap });
                        inventory.materials.soap += 29;
                        alert(`Thank you for your patronage!`);
                    } else {
                        alert(`You do not have enough materials.`);
                    }
                } else if (exploreContext.scene.includes("Gem2")) {
                    if (inventory.materials.shockGem) {
                        inventory.materials.shockGem--;
                        if (inventory.materials.shockGem == 0) {delete inventory.materials.shockGem}
                        addInventory({ type: "material", key: "flameGem", item: materials.flameGem });
                        alert(`Thank you for your patronage!`);
                    } else {
                        alert(`You do not have enough materials.`);
                    }
                } else if (exploreContext.scene.includes("Weapon")) {
                    if (inventory.materials.magicOrb) {
                        inventory.materials.magicOrb--;
                        if (inventory.materials.magicOrb == 0) {delete inventory.materials.magicOrb}
                        addInventory({ type: "material", key: "frostGem", item: materials.frostGem });
                        addInventory({ type: "material", key: "flameGem", item: materials.flameGem });
                        alert(`Thank you for your patronage!`);
                    } else {
                        alert(`You do not have enough materials.`);
                    }
                }
            } else if (i == 2) {
                energy -= 1;
                getExploreFork();
            }
        }
    });
});

function addInventory(reward) {
    if (typeof reward == "number") {
        player.gold += reward;
    } else if (reward.type === "weapon") {
        if (reward.key == "crystalPiercer" || reward.key == "infernalCleaver" || reward.key == "tempestArcs") {
            inventory.weapons[reward.key] = { cleanliness: "Dirty", passive: "None", uses: 3};
        } else {
            inventory.weapons[reward.key] = { cleanliness: "Dirty", passive: "None" };
        }
        return `You picked up a ${reward.item.name}`;
    } else {
        if (Object.keys(inventory.materials).length < 5) {
            if (!inventory.materials[reward.key]) {
                inventory.materials[reward.key] = 1;
            } else {
                inventory.materials[reward.key] += 1;
            }
            return `You picked up a ${reward.item.name}`;
        } else {
            return `Your inventory is full so you could not pick up the ${reward.item.name}.`;
        }
    }
}

//SHOP
const buyItems = document.querySelectorAll('#shopbuy .buy-item');
const previewText = document.querySelectorAll('.item-details');
const previewImg = document.querySelectorAll(".item-img");
const sellContainer = document.querySelector('#shopsell .scrollable-section');
const goldPreview = document.querySelector("#gold-preview");
var currentGold = null;
function updateGoldPreview() {
    goldPreview.innerHTML = `<img src="images/materials/coin.jpeg" style="width: 20px; height: auto;"alt="Image of a coin"> ${player.gold}`;
    currentGold = player.gold;
}


function resetItemPreview(itemObject, owned = true) {
    previewText.forEach(div => {
        let finalText = '';
        if (!itemObject.element) {
            let currentQty = 0;
            if (!!inventory.materials[itemObject.key]) {
                currentQty = inventory.materials[itemObject.key];
            }
            finalText += `Item Name: ${itemObject.name}<br>Description: ${itemObject.description}<br>Price: ${itemObject.price}<br>Owned: ${currentQty}`
        } else {
            finalText += `Item Name: ${itemObject.name}<br>Description: ${itemObject.description}<br>Element: ${itemObject.element}<br>Range: ${itemObject.range}<br>Damage: ${itemObject.damage}<br>Passive: ${itemObject.passive}`
            let itemKey = currentInventoryEntry.key;
            if (inventoryMode === "weapons" && inventory.weapons[itemKey]) {
                finalText += `<br>Enchantment Passive: ${inventory.weapons[itemKey].passive}<br>Cleanliness: ${inventory.weapons[itemKey].cleanliness}`
                if (itemKey == "crystalPiercer" || itemKey == "infernalCleaver" || itemKey == "tempestArcs") {
                    finalText += `<br>Current uses left ( One use every 5 exploration ): ${inventory.weapons[itemKey].uses}`
                }
            }
            finalText += `<br>Price: ${itemObject.price}`
        }
        div.innerHTML = finalText;
        
    });
    previewImg.forEach(div => {
        if (itemObject.name == "Crystal Piercer") {
            if (inventory.weapons.crystalPiercer?.cleanliness == "Clean") {
                div.innerHTML = '<iframe title="Azurelight Model" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/7475b57704c44e66a31ab516b9f558a8/embed"> </iframe>'
            } else if (inventory.weapons.crystalPiercer?.cleanliness == "Mild Dirty") {
                div.innerHTML = `<iframe title="Azurelight Model (Mild Dirty)" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/ddb5e3673e20472eba6a0e828d80594d/embed"> </iframe>`
            } else {
                div.innerHTML = `<iframe title="Azurelight Model (Dirty)" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/ad48a3034b294fd79b9afdf854797948/embed"> </iframe>`
            }
        } else if (itemObject.name == "Infernal Cleaver") {
            div.innerHTML = `<iframe title="Crimson Moon Semblance" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/0820d321c00a4e51b10d914a44c4fae9/embed"> </iframe>`;
        } else if (itemObject.name == "Tempest Arcs") {
            div.innerHTML = `<iframe title="Mitternachts Waltz" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/3d18c762bc4b4a5791f82e17224e5c8c/embed"> </iframe>`;
        } else {
            div.innerHTML = '';
            div.style.background = `url(${itemObject.image}) center / contain no-repeat`;
        }
        let previewInfo = document.querySelectorAll('.preview-info');
        previewInfo.forEach(div => {div.style.background = '#f7f7f7'})
        if (!owned) {
            div.innerHTML = '';
            div.style.background = `url(${'images/icons/locked.png'}) center / contain no-repeat`;
            previewInfo.forEach(div => {div.style.background = '#808080'});
            return;
        }
    });
}

buyItems.forEach((div, i) => {
    const entry = shopPool[i];

    div.style.background = `url(${entry.object.image}) center / contain no-repeat`;

    div.addEventListener('click', () => {
        currentPreviewEntry = entry;
        resetItemPreview(entry.object);
        updateShopButtons();
    });
});


var sellEntries = [];
var currentPreviewEntry = {};
var shopMode = "buy";

function resetSellItems() {
    sellContainer.innerHTML = '';
    sellEntries = [];

    ['weapons', 'materials'].forEach(category => {
        Object.keys(inventory[category]).forEach(key => {
            const object = category === "weapons" ? weapons[key] : materials[key];

            if (object.price === "Cannot be bought or sold") return;

            const entry = { key, category, object };
            sellEntries.push(entry);

            const div = document.createElement("div");
            div.className = "sell-item";
            div.style.background = `url(${object.image}) center / contain no-repeat`;

            div.addEventListener('click', () => {
                currentPreviewEntry = entry;
                resetItemPreview(object);
                updateShopButtons();
            });

            sellContainer.appendChild(div);
        });
    });
}

const shopBuyTab = document.querySelector('#shopsell .sub-tab-link[href="#shopbuy"]');
const shopSellTab = document.querySelector('#shopbuy .sub-tab-link[href="#shopsell"]');
const shopActionBtns = document.querySelectorAll('.shop-buy-sell');

function updateShopButtons() {
    if (shopMode === "buy") {
        shopActionBtns[0].textContent = "Buy 1";
        shopActionBtns[1].style.display = "none";
    } 
    else if (shopMode === "sell") {
        shopActionBtns[0].textContent = "Sell 1";
        shopActionBtns[1].textContent = "Sell All";
        shopActionBtns[1].style.display = "inline-block";
    }

    const disabled = !currentPreviewEntry;
    shopActionBtns.forEach(btn => {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? 0.4 : 1;
    });
}


shopActionBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        if (!currentPreviewEntry) return;

        if (shopMode === "buy") {
            const { key, category, object } = currentPreviewEntry;
            buyItem(key, category, object);
        }


        if (shopMode === "sell") {
            const { key, category, object } = currentPreviewEntry;

            if (i === 0) {
                sellItem(key, category, object, "one");
            } else {
                sellItem(key, category, object, "all");
            }

            resetSellItems();

            if (sellEntries.length > 0) {
                currentPreviewEntry = sellEntries[0];
                resetItemPreview(currentPreviewEntry.object);
            } else {
                currentPreviewEntry = null;
            }
        }
    });
});

function buyItem(key, category, object) {
    if (player.gold < object.price) {
        alert("Not enough gold!");
        return;
    } else if (Object.keys(inventory.materials).length > 4) {
        alert("You cannot carry anymore new materials.");
        return;
    }


    player.gold -= object.price;

    if (category === "materials") {
        if (!inventory.materials[key]) {
            inventory.materials[key] = 1;
        } else {
            inventory.materials[key] += 1;
        }
    } else {
        inventory.weapons[key] = {cleanliness: "Dirty", passive: "None"};
    }
    resetItemPreview(object)
    resetSellItems();
    updateGoldPreview(); // shop sell page updates after buying
    playAudio('audio/gold.wav');
}

function sellItem(key, cat, obj, oneOrAll) {
    if (cat === "weapons" && player.equipped === key) {
        player.equipped = "none";
    }

    if (oneOrAll === "one") {
        if (cat === "materials") {
            inventory.materials[key]--;
            player.gold += obj.price;

            if (inventory.materials[key] <= 0) {
                delete inventory.materials[key];
            }
        } else {
            player.gold += obj.price;
            delete inventory.weapons[key];
        }
    }

    if (oneOrAll === "all") {
        if (cat === "materials") {
            const quantity = inventory.materials[key];
            player.gold += obj.price * quantity;
            delete inventory.materials[key];
        } else {
            player.gold += obj.price;
            delete inventory.weapons[key];
        }
    }

    resetSellItems();

    if (sellEntries.length > 0) {
        currentPreviewEntry = sellEntries[0];
        resetItemPreview(currentPreviewEntry.object);
    } else {
        currentPreviewEntry = null;
    }

    updateShopButtons();
    updateGoldPreview();
    playAudio('audio/gold.wav');
}


shopBuyTab.addEventListener('click', (e) => {
    e.preventDefault();
    shopMode = "buy";

    currentPreviewEntry = shopPool[0];
    resetItemPreview(shopPool[0].object);

    updateShopButtons();
});

shopSellTab.addEventListener('click', (e) => {
    e.preventDefault();
    shopMode = "sell";
    resetSellItems();

    if (sellEntries.length > 0) {
        currentPreviewEntry = sellEntries[0];
        resetItemPreview(currentPreviewEntry.object);
    } else {
        currentPreviewEntry = null;

        previewText.forEach(div => div.innerHTML = "No items to sell.");
        previewImg.forEach(div => {
            div.innerHTML = '';
            div.style.background = '';
        });
    }

    updateShopButtons();
});

const backBtn = document.querySelectorAll('.back-btn');
var previousTab = '';

function openShop(lastTab) {
    previousTab = lastTab;
    setActiveMainTab('shop');

    shopMode = "buy";
    currentPreviewEntry = shopPool[0];

    resetItemPreview(shopPool[0].object);
    updateShopButtons();
    resetSellItems();
    updateGoldPreview();
    playAudio('audio/bell.wav');
}

backBtn.forEach(but => {
    but.addEventListener('click', () => {
        setActiveMainTab(previousTab);
    });
});

//ARCHIVE
const archiveContent = document.querySelector('#archive-content');
const archiveBtns = document.querySelectorAll('.archivebutton button');

const archiveText = [
    "After being released from jail, you resolve to start a new life and find a way to earn money. Whether by asking around for work or heading straight to the adventurer's guild, you eventually take on a low-rank herb-collecting quest. <br>During the journey, you witness bandits discarding a rusted, cloth-wrapped sword they deem worthless. Drawn to it, you take the sword and feel a strange power emanating from its handle. You attempt to sell the sword, but traders dismiss it as dirty. Using your past experience as a cleaner, you successfully remove the grime and return, only to be warned by a mysterious cloaked passerby not to trade it away. <br>Keeping the sword, you accept a slime-hunting quest, during which you are ambushed by a demon. In a moment of desperation, the sword reacts to the demon's power, unleashing crystal shards that kill the demon and fuse into the weapon, transforming it. <br>Shaken, you return to town where traders suddenly show intense interest in your sword, offering large sums of gold. Just as you are about to sell it, the cloaked passerby intervenes again and reveals that the sword is a legendary weapon. He warns you that dangerous forces are still seeking these weapons and that selling it could put you in grave danger. Advising you to keep the sword and continue the path left unfinished by others, he urges you to stay cautious and prepare for what lies ahead.",
    "The passerby funds your journey and sends you to the desert to retrieve the Fire Scythe. After reaching a forgotten temple filled with monsters, you either fight through them or sneak past, but both paths lead to an encounter with the clone. <br>Depending on your choices and luck, the clone briefly overpowers or confronts you, revealing its growing strength and obsession with the weapon. <br>In the temple's central chamber, a spear embedded in a pedestal becomes the focus. As the clone attempts to claim it, the spear transforms into a scythe, killing the clone instantly. <br>Seizing the moment, you escape with the newly awakened Fire Scythe and your crystal sword. As you flee, you realize the danger is far from over when two more clones appear, watching from a distance.",
    "You enter the temple and are carried into the sky, where the legendary bow awaits. Whether you take a safer route or a faster, trap-filled path, you encounter multiple clones attempting to claim the weapon. <br>Taking advantage of the chaos, you manage to reach the bow, but activating it draws even more clones into the fight. Using a combination of the crystal sword and Fire Scythe, you unleash a powerful attack, but the clones reveal a new weapon—a sceptre capable of absorbing and redirecting energy. <br>Overpowered, you are knocked down as the clones escape with the bow. Returning to town, you inform the passerby, who realizes the enemy has obtained another legendary weapon. With only one remaining—the Water Staff hidden deep beneath the sea—he decides to accompany you, and together you prepare for the next journey.",
    "You have not played this chapter",
    "You have not played this chapter",
    "You have not played this chapter",
    `It is said that the heroes of the past who wielded the five legendary weapons united to fight the calamity and its ruler, Peruere. Due to unforeseen circumstances, during the final moments of Peruere, he decomposed his physical form to amplify his spiritual body and fused together with the legendary weapons. 
    <br>The heroes celebrated the fall of the calamity and set out on their own paths. Over the days, there were rumors of sightings of Peruere roaming the wilderness. Reports came in of adventurers noticing Peruere feeding on animals and monsters, growing stronger and releasing more chaotic aura each time. By the time the heroes caught wind of the incident, it was already too late. The clones had grown incredibly strong. <br>During clashes with each hero, they noticed that the clones only went after their weapons. Each time the clones were killed, they came back after a few days. In one clash between a hero and a clone, the hero was pulled down along with the clone into a bottomless chasm. However, once they fell to the bottom, their weapons started losing their vitality, and so did the clone. 
    <br>The hero concluded that the clones were manifesting from the weapons and that Peruere's soul was merged into them. The only way to stop the clones was to drain the weapons' power by covering them from sunlight.
    <br>Having suspicion, the hero set out to warn the other heroes, only to find there were more clones after the other heroes' swords. The heroes suspected the clones were trying to bring the legendary weapons together to fuse Peruere's soul back together and revive him.
    <br>They came up with a plan to bring the weapons together and shatter them all at once to finally defeat Peruere. But terror struck when they heard one hero had fallen with one legendary weapon now in the calamity's possession. They also noticed the clones becoming stronger day by day.
    <br>Facing this, they decided not to risk losing their weapons to the calamity, with no guarantee they could break all the weapons at the same time to end it. Instead, they buried their weapons in different regions around the world, preventing the calamity from locating them.
    <br>With their weapons' power drained, the clones' numbers were also reduced to one. In a final hope, they launched an all-out attack on the final clone to steal the weapon and prevent the calamity from recurring again. The heroes fell one after another, with the final hero throwing the last weapon into a deep cave, perishing after being impaled at the last second.
    <br>Little did they know, some light was still reachable inside the cave. Though not enough energy to climb out, the final clone lay dormant there for eternity. All the heroes could hope for was that no one would ever find the legendary weapons and expose them to sunlight, powering the weapons and bringing the clones back.
    <br>In the event that it does happen, may Peruere's power have withered enough over the years for a brave new soul to finish what they set out to do that fateful day.
    `
]

var currentChapter = player.chapter;

if (currentChapter == 1) {
    archiveContent.innerHTML = "You have not played this chapter";
} else {
    archiveContent.innerHTML = archiveText[0];
}

archiveBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        let text = archiveText[i]
        if ((!(currentChapter > 1) && (i == 0 || i== 6)) || (!(currentChapter > 2) && i == 1) || (!(currentChapter > 3) && i == 2)) {
            text = "You have not played this chapter";
        }
        archiveContent.innerHTML = text;
    });
});

//STORY
const storyBg = document.querySelector('#story-bg');
const btn1 = document.querySelector('#story-btn-1');
const btn2 = document.querySelector('#story-btn-2');
var pendingChapterRewards = [];

function startStory() {
    if (currentChapter > 3) {
        alert('Stay tuned for more future content!')
        setActiveMainTab('home');
        return;
    }    
    playLoadingScreen()
}

function showStoryNode(sceneKey) {
    if (sceneKey === "chapter1_1_1") {
        queueChapterReward(5);
    } else if (sceneKey === "chapter1_2_1") {
        queueChapterReward(15);
    } else if (sceneKey === "chapter3_1_1") {
        queueChapterReward({ type: "material", key: "bracelet", item: materials.bracelet});
        queueChapterReward({ type: "material", key: "frostGem", item: materials.frostGem});
        queueChapterReward({ type: "material", key: "shockGem", item: materials.shockGem});
    } 
    const key = story[sceneKey];
    if (key.audio) {
        playAudio(key.audio);
    }

    storyBg.style.background = `url(${key.image}) center / cover no-repeat`;

    storyText.innerHTML = key.text.map(line => `<br>${line}<br>`).join("") + "<br>";

    const choices = key.choices;

    if (choices.length === 1) {
        btn1.style.display = "inline-block";
        btn2.style.display = "none";
        btn1.textContent = choices[0].text;
        btn1.onclick = () => handleStoryChoice(choices[0].next);
    } 
    else if (choices.length === 2) {
        btn1.style.display = "inline-block";
        btn2.style.display = "inline-block";
        btn1.textContent = choices[0].text;
        btn2.textContent = choices[1].text;
        btn1.onclick = () => handleStoryChoice(choices[0].next);
        btn2.onclick = () => handleStoryChoice(choices[1].next);
    } 
    else {
        btn1.style.display = "none";
        btn2.style.display = "none";
    }
}

function handleStoryChoice(nextKey) {

    if (nextKey.startsWith("fight_")) {
        startFight(nextKey);
        return;
    }

    if (nextKey === "end") {
        completeChapter();
        return;
    }

    currentStoryNode = nextKey;
    showStoryNode(currentStoryNode);
}

function startFight(fightKey) {
    openCombat(fightKey, {
        onWin: () => {
            showStoryNode(fightKey);
        },
        onLose: () => {
            restartChapter();
        }
    });
}

function openCombat(key, object) {
    let [enemyDmg, enemyElement, enemyRange] = [0, 0, 0];
    if (key == "fight_chapter2_1_1") {
        enemyDmg = 125;
        enemyElement = "Fire";
        enemyRange = "Long";
        storyText.innerHTML = `You encountered a gang of mummies. <br>Element: Fire<br>Reach: Long <br>Estimated chance of victory: ${(Math.min(getDamage(enemyElement, enemyRange)/ enemyDmg, 0.95)*100).toFixed(2)}%`;
    } else if (key == "fight_chapter2_2") {
        enemyDmg = 200;
        enemyElement = "Dark";
        enemyRange = "Long";
        storyText.innerHTML = `You encountered one of Peruere's clone. <br>Element: Dark<br>Reach: Long <br>Estimated chance of victory: ${(Math.min(getDamage(enemyElement, enemyRange)/ enemyDmg, 0.95)*100).toFixed(2)}%`;
    } else if (key == "fight_chapter3_1_3") {
        enemyDmg = 300;
        enemyElement = "Electric";
        enemyRange = "Long";
        storyText.innerHTML = `You encountered a group of electric spirits. <br>Element: Electric<br>Reach: Long <br>Estimated chance of victory: ${(Math.min(getDamage(enemyElement, enemyRange)/ enemyDmg, 0.95)*100).toFixed(2)}%`;
    }
    btn1.style.display = "inline-block";
    btn2.style.display = "none";
    btn1.textContent = "Fight";
    btn1.onclick = () => {
        playAudio('audio/sword.wav');
        if (determineWin(enemyDmg, enemyElement, enemyRange) === "Win") {
            queueChapterReward(getReward());
            queueChapterReward(getReward());
            queueChapterReward(getReward());
            queueChapterReward(getReward());
            queueChapterReward(getReward());
            object.onWin();
        } else {
            object.onLose();
        }
    };
}

function completeChapter() {
    chapterInProgress = false;

    pendingChapterRewards.forEach(reward => addInventory(reward));
    pendingChapterRewards = [];
    if (currentChapter == 1) {addInventory({ type: "weapon", key: "crystalPiercer", item: weapons.crystalPiercer})};
    if (currentChapter == 2) {addInventory({ type: "weapon", key: "infernalCleaver", item: weapons.infernalCleaver})};
    if (currentChapter == 3) {addInventory({ type: "weapon", key: "tempestArcs", item: weapons.tempestArcs})};
    currentChapter++;
    player.chapter++;
    if (player.equipped == "crystalPiercer" || player.equipped == "infernalCleaver" || player.equipped == "tempestArcs") {
        inventory.weapons[player.equipped].uses--;
    }

    setActiveMainTab('home');
}

function restartChapter() {
    storyText.innerHTML = "Your enemy was too strong and ended up overwhelming you and eventually you fall unconcious."
    btn1.style.display = "inline-block";
    btn2.style.display = "none";
    btn1.textContent = "Continue";
    btn1.onclick = () => {
        pendingChapterRewards = [];
        currentStoryNode = `chapter${currentChapter}_1`;
        setActiveMainTab('home');
        chapterInProgress = false;
    };
}

function queueChapterReward(item) {
    pendingChapterRewards.push(item);
}

let loadingScreen = document.querySelector('#loadingscreen');
let chapterNo = document.querySelector('#chapter-no');
let chapterName = document.querySelector('#chapter-name');

function playLoadingScreen() {
    setActiveMainTab('loadingscreen')
    if (currentChapter == 1) {
        loadingScreen.style.background = 'linear-gradient( #ACD1DE, #64CFF6)';
    } else if (currentChapter == 2) {
        loadingScreen.style.background = 'linear-gradient( #E4915A, #DE691B)';
    } else if (currentChapter == 3) {
        loadingScreen.style.background = 'linear-gradient( #B687D3, #9C1AEC)';
    }
    currentStoryNode = `chapter${currentChapter}_1`;
    chapterNo.innerHTML = `<u>Chapter ${currentChapter}</u>`
    chapterName.innerHTML = `<b>${story[currentStoryNode].title}</b>`;
    setTimeout(() => {
        setActiveMainTab('story');
        chapterInProgress = true;
        showStoryNode(currentStoryNode);
    }, 8000);
}

function buildSaveData() {
  return {
    player: {
      equipped: player.equipped,
      gold: player.gold,
      level: player.level,
      chapter: player.chapter
    },
    inventory: {
      weapons: inventory.weapons,
      materials: inventory.materials
    },
    lastSave: Date.now()
  };
}

function saveLocal() {
  const saveData = buildSaveData();
  localStorage.setItem('gloryGearsSave', JSON.stringify(saveData));
}

function loadLocal() {
  const data = localStorage.getItem('gloryGearsSave');
  if (!data) return false;

  const save = JSON.parse(data);

  Object.assign(player, save.player);
  inventory.weapons = save.inventory.weapons || {};
  inventory.materials = save.inventory.materials || {};

  console.log("Loaded local save:", save);
  return true;
}
