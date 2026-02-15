# Glory Gears Website
Glory Gears, from ImbalancedSkillset Studios, is a fusion of interactive fiction and RPG mechanics. Players shape the story through narrative choices while managing inventory, upgrading equipment through cleaning, and battling through combat. With a rich story mode and an exploration mode to grow stronger, Glory Gears offers both immersive storytelling and strategic progression.

Glory Gears contains its own origninal storyline which can be discovered by progressing in the story. Exploration has many different pathways ranging from scavenging materials, fighting enemies or trading with wandering traders. There is strategic depth in the game where weapon cleanliness, passive, enchantment passive, element, range and enemy sizes can determine the chances of victory. 

Website Link: [https://zhihng.github.io/Glory-Gears/](https://zhihng.github.io/Glory-Gears/)
## Design Process
When Designing this website, we wanted to keep the general art style the same. Since we wanted to 3D model weapons from Genshin Impact, we took most of the assets from it. We also used illustrator to image trace all our 2D assets to give it a painting kind of texture and also keep other assets not from Genshin Impact look similar. Since this is a text based game, we wanted to have a font that would be like a story book. Hence, we used the font Itim.

This website is for people ages 12+ (due to some violent content in the story) who wants to play a text based game where their descisions determine the outcome of their story. It is also for people who likes to discover stories and a chill RPG game without actual hard combat.

- As an Achiever, I would want to collect and max out all the possible collectibles, so that I can be proud of my progression and show off to others.
    - We targeted these players by making not yet unlocked weapons and materials in inventory not show the image, but still shows the text so that they know where to find and collect these items and motivates them. Seeing the weapons go from dirty to mild dirty and to clean will also show the progression and motivate them.
- As a Free Spirit, I would want to explore more about the game mechanics and discover new things in my own pace, so that they can learn new things.
    - We targeted these players by having a story mode where they can discover new things. The login system also allows them to save their progress and progress whenever they like at their own pace.
- As an Exploiter, I would want to have the medium to complete tasks and progress at the most efficient way, so that I can feel rewarded by using strategy.
    - We targeted these players by having weapon elements, range, passive, enchantment passive in which will have different damage outcomes based on the enemy. The faster they can clear enemies and not die, the faster they can get rewards, improve their equipement and progress in the game.
### Wireframe
[Website Wireframe](https://www.figma.com/design/CDpWFmS9PjIX57gw7NC70A/IP-Website-Wireframe?node-id=0-1&t=1apYYrgEXNuZRr6l-1)
## Features
### Existing Features
1. Login and Sign Up page allows users to create a new account or sign up for a new account by inputing up their details. Logging in can recover previous progress made.
2. Story Mode allows users to discover the lore of the game by progressing in the story.
3. Explore Mode allows players to get stronger by collecting materials, trading, leveling up, and using materials collected to clean, enchant or buy new equipment.
4. The Shop allows players to purchase items like weapons or gems with gold they collected. Players can also sell items they have collected for gold.
5. The Inventory allows players to view their collected weapons and materials. Through the inventory, players can also equip weapons, clean weapons and enchant weapons which will make them stronger.
6. The Archive will allow players to view the previous story chapters that they have completed, so that they can still go back to understand what happended.

### Features Left to Implement
1. Enchantment Passive Effects currently does not count to calculation of damage. This could be implemented.
2. Enemy sizes currently does not count in calculation of damage. This could be implemented.
3. Continuation of story. Currently there are only 3 chapters with full storyboarding because we only have 3 3D Models to display for the legendary weapons.
4. More exploration scenes. This will make the exploration less dull as after a while, the scenes feel too repetitive.
5. More weapons and materials. Not only will this add more depth and strategy into the game, it also increases the reward pool of loot drops making it feel less repetitive.
6. A proper fight system which is not just one button click and actually needs player input to have more control over the outcome.
7. Selling items to trader having bonuses to certain items sold.
8. Cleaning weapons could use more player inputs to determine how well it is cleaned for more effectiveness in combat. This can reference how real live weapon restoration is conducted.
9. Cleanliness of weapons shown with different images for all weapons. (Currently only Crystal Piercer has)

### Technologies Used
- [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML)
    - Used to structure the content of the website.

- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
    - Used to style the website, adding interactivity and make it visually appealing.

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
    - Used for game logic of the game, changing the HTML text and structure and API for account logins and signups.

- [GitHub](https://github.com/)
    - Used as the remote hosting platform for the project’s Git repository, enabling collaboration, version control, and project management.

- [RestDB](https://restdb.io/)
    - Used to host API for login, sign up and game save data saving.

## Testing
- Login Page / Sign Up Page:
    1. Click on the sign up button. See if it brings you to the sign up page.
    2. Enter a username and password in the sign up page and sign up. See if it brings you into the game with a fresh account with no weapons or materials.
    3. Progress in the game and click save on the home page. See if website alerts Cloud save successful.
    4. Relaunch the website and create another account by signing up with a different username and password. See if it brings you into the game with a fresh account with no weapons or materials.
    5. Progress in the new account but get different weapons and materials from the previous account. Save in the home page. See if website alerts Cloud save successful.
    6. Relaunch the website and login with the first account username and password. See if inventory is the same as the first account and progress is the same.
    7. Progress more in the game and relauch the website without saving. See if wesbsite alerts save successful or not successful (more likely due to API calls when closing website being more unreliable).
    8. If not successful. See if website alerts, saved data locally.
    9. Relaunch website and click continue as guest. See if progress remains the same.
    10. See if mouse clicks plays audio of a click sound.
- Story
    1. Click on the story button in the home page. See if it brings you to the loading screen.
    2. Progress the story by clicking on the buttons for descisions. See if the audio, background and text change.
    3. Click on the inventory after the story ends. See if you have unlocked Crystal Piercer.
    4. Continue on with the story. See if the other legendary weapons are unlocked after completing the chapter.
- Explore
    1. Click on the explore button in the home page. See if it brings you to a scene with 2 different backgrounds and audio plays.
    2. Click on a choice. see if it brings you to a scene with the background of the place you chose and audio plays based on the location.
    3. Click on go back to town to see if it brings you back to the home screen.
    4. Click on explore again and try to click until you come accross a trader. (Snow Plains, Desert and Grasslands has traders).
    5. Click on Buy/Sell. See if it brings you to the shop menu.
    6. Sell or Buy items, see if gold or inventory updates with the item.
    7. Get the necessary materials and find a trader and click trade. See if your inventory gets the traded item and website alerts.
    8. Find a Fight Scene and click fight. See if audio of swords clashing plays. See if die, return to home screen and all materials in inventory gone, or if win, see if inventory has a new item picked up.
    9. Find a Fight Scene and click flee. See if it bring you to another screen with 2 backgrounds.
    10. Find a scene where player scavenges. See if inventory has the item gained.
    11. Explore through 5 scenes, see if you become tired and return to home screen automatically.
    12. Scavenge or get materials from fights when you have 5 different materials. See if you are not able to pick them up.
- Shop
    1. Click on the shop button in the home page. See if it opens the shop menu and audio plays.
    2. Click on the sell and buy buttons. See if it changes between buy and sell.
    3. Click on an item in the buy menu. See if the item preview changes based on the item.
    4. Click on the buy button. See if website alerts you not enough gold.
    5. Get an item from explore and go to the sell menu. Click on sell 1 or sell all. See if gold count goes up and audio playes.
    6. Buy an item and see if it shows in the inventory or the sell menu.
    7. Buy an item when you have 5 different materials already. See if website does not allow you to buy.
- Inventory 
    1. Click on the inventory button in the home page. See if it opens the inventory menu and audio plays.
    2. Click on the weapons and materials buttons. See if it changes between weapons and materials.
    3. Click on an unowned weapon. See if the preview does not show the weapon but the text updates.
    4. Click on an owned weapon. See if the preview shows the image and the text updates.
    5. Click on equip on an owned weapon. See if website alerts.
    6. Click on clean on an owned weapon. See if website alerts the missing material.
    7. Click on clean on an owned weapon when enough cleaning materials. See if the text preview changed for cleanliness from Dirty to Mild Dirty and to Clean if done again. See if audio plays.
    8. Click on enchant on an owned weapon. See if text preview changes from text to text and buttons asking for the type of gem used to enchant.
    9. Get a gem and click the enchant button with that gem. See if website alerts the passive gained and the text preview of the weapon includes the enchant passive. See if audio plays.
    10. Click on materials menu and on a random material. See if the preview text changes and if owned, show the image of it. See if there is no buttons.
    11. Equip a legendary weapon (Obtained from story only) and explore 3 times (Full explore until tired, died or return to town) or progress story and complete the chapter. See if website alerts weapon needs to recharge and unequipped.
    12. Try to equip the legendary weapon again. See if website alerts and not let you equip it.
    13. Explore 5 times and go to the legendary weapon again in inventory. See if from the preview text, usage increased from 0 to 1 and able to equip it again. 
- Archive
    1. Click on the archive button in the home page. See if it open the archive menu.
    2. Click on all the chapters. See if the text shows 'You have not played this chapter'
    3. Progress in the story and return to the archive and click on the chapters you have completed. See if the text shows a summary of the chapter you have completed.


### Assistive AI
1. [Main Features](https://chatgpt.com/share/698ae37c-bda0-8009-8b28-8258af89ff4b): ChatGPT used to help in development of the main features of the website
    - Inventory Weapon Clean, Enchant and Equip System
    - Shop System
    - Story System
    - Combat System
    - Explore System
2. [Fixing Legendary Weapons Usage](https://chatgpt.com/share/698ae53b-8b00-8009-8071-42b5808a727c): ChatGPT used to help debug hidden errors in the limited weapon usage. mechanic
    - Legendary Weapons usage limit and replenishment
3. [Setting Up Objects](https://chatgpt.com/share/698ae55c-a1c4-8009-afcd-fa550922d488): ChatGPT used to complete monotonous easy tasks and development of tab changing
    - Story Object Generation, using our already made story board to convert it into code without needing to copy paste a lot of times
4. [Setting Up Tab Change](https://chatgpt.com/share/698ae673-79e0-8009-b054-f89c84fe2225): ChatGPT was used to help set up the tab changing of the website so that we only need one script.js file and makes the tab changing speed very fast so it will not ruin the gaming experience
    - Sub tab changing of Shop and Inventory
5. [Many Minor Clarifications](https://copilot.microsoft.com/shares/E9cd1NtVmhJtX55WGtib7): Copilot was used for minor clarifications during coding as it does not have a usage limit
    - Questions about JavaScript syntax
    - Questions about JavaScript built in functions
6. [API](https://chatgpt.com/share/698ae853-f780-8009-afcc-3542fa6cb4a1): ChatGPT to help with API setup
    - Local Storage
    - Save Data stored on API

## Credits
### Content
References of Genshin Impact character Arlecchino's real name, Peruere in the storyboard of the game.

### Images
The photos used in this site were obtained from ...
- In-game items from [Genshin Impact](https://genshin.hoyoverse.com/en/)
- In-game scenery from [Genshin Impact](https://genshin.hoyoverse.com/en/)
- https://www.dreamstime.com/royalty-free-stock-images-bubbles-image5024929
- https://www.istockphoto.com/photo/simple-plain-bar-of-soap-gm537488461-58249696
- https://hardwarecity.com.sg/prod/river-premium-car-wash-sponge-super-absorbent?srsltid=AfmBOoo9Yim-rJZVlpiFEZdcSA7oGU2A8MAt4vczX3dJ7j07Nhu18zyC
- https://www.amazon.sg/Natural-Bangle-Bracelet-Genuine-Certificate/dp/B09FM4YL7J
- https://jumpichiban.com/products/frieren-beyond-journeys-end-fan-fun-market-mirror-lotus-ring-silver-ring?srsltid=AfmBOoqgucgbx3sUNAmen-HC4gFfJGmnQ6AGD26axA3AbhUjOdNE-TJX

### Audio
- https://freesound.org/s/623789/
- https://freesound.org/s/107134/
- https://freesound.org/s/427401/
- https://freesound.org/s/752461/
- https://freesound.org/s/662584/
- https://freesound.org/s/615081/
- https://freesound.org/s/488423/
- https://freesound.org/s/826131/
- https://freesound.org/people/BeezleFM/sounds/512131/
- https://freesound.org/s/420875/
- https://freesound.org/people/ethanchase7744/sounds/441666/
- https://freesound.org/people/775noise/sounds/494565/

### Acknowledgements
Inspiration for this project has been recieved from [A Dark Room](https://adarkroom.doublespeakgames.com/)