# SmartMove bomb diffuse game
This is a game we made as a group for Embedded Fitness. 

## Features
### What can be done with this product?
Choose singleplayer or multiplayer. In singleplayer, play against time; in multiplayer, compete with friends. Set your nickname, join a lobby, and start when ready.
All players start with 0 resources. Use a resource map to gather water, wood, and stone at SmartMove locations, avoiding revisiting within a minute.
Craft items at SmartMove 7 to defuse the bomb at SmartMove 10 within 30 minutes. Bomb-defusing items are randomized, ensuring a unique experience. Pop-ups notify you of resources, crafted items, or lacking requirements.
Successfully defuse the bomb in time to win. In multiplayer, compete against others for the win; it's not a team game.

### What works well?
Our product seamlessly integrates with SmartMoves using code from Embedded Fitness. User interaction triggers app responses. Bomb items and resource maps randomize in each game round, creating a 50/50 chance for collected resources. A 30-minute timer challenges users; running out of time results in a game over. Crafting the right items and defusing the bomb within the time limit leads to victory, with the end screen displaying the time taken. Pop-ups provide clear responses for resource collection, item crafting, and insufficient resources or items. Effective checks, using if-statements, ensure the user has the necessary resources and items. The 'my items' count updates instantly as users collect resources or craft items.

### What needs improvement?
Firstly, randomize the resources available at poles and the required resources for crafting to introduce variability. Currently, these are hardcoded, leading to a repetitive experience.

Secondly, make the bomb and crafting table locations dynamic by implementing logic to randomize their SmartMove assignments. Currently, these locations are fixed in the JSON file.

Introduce different difficulty levels to offer a more customizable experience. Adjust time limits and resource requirements to make the game easier or more challenging, providing diverse gameplay options.

Increase adaptability by allowing the game to adjust to SmartMoves in different locations. Currently hardcoded for Breda, enabling users to play in other locations with SmartMoves will broaden the game's accessibility and appeal.

## Installation
### Compatibility
- Safari iOS 11.3 or higher
- Android 4.4 or higher

### Startup on desktop
- You can clone our Git repository by running this command at the location you want to have the code:
- `$ git clone https://git.fhict.nl/I487918/smartmove-group2-bombdiffuser `

- You have to make sure you’re now in the bomb diffuse folder, if not then go into this folder with 
- `$ cd smartmove-group2-bombdiffuser`

- Then, you need run the following npm command at the root of the project and in the backend folder. 
- `$ npm install`
- By running this command, you will install all of the dependencies that are listed in the projects’ package.json.

- To start the application for development, you’ll need to run this npm command at the location: 
- `$ npm run dev`
- This will start up the Vite server. 

- If you want to run the server locally, you will need to open another terminal. Enter first this to make sure you’re in the right map:
- `$ cd .\backend\`
- And then to start the server:
- `$ node .\server.js.`

- To put your application in production, run the following npm command at the root of the project:
- `$ npm run build`
- This creates a build directory with a production build of the application, located at the dist folder.
- Then, you will find all the generated production files and assets in the dist folder. You will need that to deploy and run your application.

## Future plans
We have some plans (can also be found in the advisory report, found in the repo) for the app and things that can still be improved. A short list can be found below:

- Adding more/different resources
- Randomize bomb and crafting location
- Hardcoding SmartMove ID’s
- Making the craft recipes random
- Create room and trading functionality

### Contributors
- Iris Roemermann
- Niels Lazaroms
- Hugo Boulouard
- Gabin Fily
