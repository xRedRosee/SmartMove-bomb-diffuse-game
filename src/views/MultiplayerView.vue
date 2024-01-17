<template>
  <Map :locations="locations" style="width: 100%; height: 100%"></Map>
  <Header headerTitle="Bomb Diffuser" headerIntro="Diffuse the bomb in time."></Header>
  <div class="page">
    <div class="room-sheet" :class="{ 'small-sheet': !expanded, 'expanded-sheet': expanded }" @touchmove="onSwipe">
      <div class="room-sheet-content" style="width: 100%;">
        <div class="center-item">
          <div class="top-shape"></div>
        </div>
        <h1 class="page-title">Choose a room</h1>
        <div class="align-item-left" style="margin-top: 30px;">
          <p class="room-username">Username</p>
          <input v-model="username" class="room-username-input" />
          <p class="required-label">* Required</p>
        </div>
        <p class="select-room">Select a room</p>
        <div class="room-container">
          <div v-for="index in 4" class="room-button-row">
            <button @click="showLobby(true, username, index)" class="btn-style">Room {{ index }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="lobby-sheet" :class="{ 'small-sheet': !expanded, 'expanded-sheet': expanded }" @touchmove="onSwipe">
      <div class="top-shape"></div>
      <div class="lobby-sheet-content">
        <div class="lobby-sheet-userList">
          <p class="page-title">Room {{ this.roomNumber }} </p>
          <span v-for="user in usersInMyRoom" class="user-list">
            <img v-if="user.isReady" src="./../../public/check_circle.svg" />
            <img v-else src="./../../public/cross_circle.svg" />
            <span v-if="user.username == username">
              <span class="lobby-username">{{ user.username }}</span>
              <span class="lobby-username" style="color: red">(You) </span>
            </span>
            <span v-else>
              <p class="lobby-username">{{ user.username }}</p>
            </span>
          </span>
        </div>
        <div class="lobby-sheet-buttons">
          <span v-if="!usersInMyRoom.find((user) => user.username == username)?.isReady
            " @click="changeUserStatus()" class="btn-style">Ready</span>
          <span v-else @click="changeUserStatus()" style="background-color: red" class="btn-style">Not Ready</span>
          <span v-if="!usersInMyRoom.every((user) => user.isReady)" @click="startGame()" style="background-color: grey"
            class="btn-style">Start game</span>
          <span v-else @click="startGame()" class="btn-style">Start game</span>
        </div>
      </div>
    </div>
    <div class="sheet" :class="{ 'small-sheet': !expanded, 'expanded-sheet': expanded }" @touchmove="onSwipe">
      <div class="sheet-content">
        <div class="top-shape"></div>
        <section class="resources-section">
          <div class="top-section">
            <h2 class="resources-title">Resources map</h2>
            <p class="timer-text">{{ formatTime }}</p>
          </div>
          <div class="resource-map-container">
            <div class="resource-map">
              <div class="bingo-row" v-for="(row, rowIndex) in 3" :key="rowIndex" :data-row-number="rowIndex">
                <ResourceBlock v-for="(task, taskIndex) in randomTasks.slice(
                  rowIndex * 3,
                  (rowIndex + 1) * 3
                )" :key="taskIndex" :blockText="task.taskName" :idText="task.smartMoveID"
                  :status="elementStatus[task.smartMoveID] || false" :resource="task.resources"
                  :resources="task.resources" :data-column-number="taskIndex % 3" />
              </div>
            </div>
          </div>
          <article class="your-items-section-home">
            <h2 class="your-items-title">Your items:</h2>
            <ul class="your-items-list">
              <li class="your-items-item" v-for="item in this.yourItems">
                <p class="your-items-count">{{ item.count }}</p>
                <img :src="item.image" class="your-items-image" />
              </li>
            </ul>
          </article>
          <div class="btn-divider">
            <button class="visit-button" @click="showBombExample(true)">
              Diffuse
            </button>
            <button class="visit-button" @click="showCraftExample(true)">
              Recipes
            </button>
          </div>
        </section>
      </div>
    </div>
    <div class="bomb-sheet" :class="{ 'small-sheet': expanded, 'expanded-sheet': !expanded }" @touchmove="swipeDown">
      <div class="bomb-sheet-content">
        <div class="top-shape"></div>
        <section class="bomb-section">
          <div class="top-section">
            <h2 class="resources-title">Bomb</h2>
          </div>
          <div class="bomb-container">
            <div class="bomb-layout">
              <img src="../assets/time-bomb.png" class="bomb-img" alt="bomb image" />
              <p class="timer-on-bomb">{{ formatTime }}</p>
            </div>
            <article class="diffuse-bomb-section">
              <h2 class="diffuse-title">Diffuse bomb with:</h2>
              <div class="item-list">
                <div v-for="(item, index) in itemCounts" :key="index" class="item-image-section-bomb">
                  <span v-if="item.count > 0" class="item-count">{{ item.count }}x</span>
                  <img :src="getItemImage(item.item)" :alt="item.item" class="item-image" />
                </div>
              </div>
            </article>
            <article class="your-items-section">
              <h2 class="your-items-title">Your items:</h2>
              <ul class="your-items-list">
                <li class="your-items-item" v-for="item in this.yourItems">
                  <p class="your-items-count">{{ item.count }}</p>
                  <img :src="item.image" class="your-items-image" />
                </li>
              </ul>
            </article>
            <button class="diffuse-btn" @click="diffuseBomb">
              Diffuse bomb!
            </button>
          </div>
        </section>
      </div>
    </div>
    <div class="craft-sheet" :class="{ 'small-sheet': expanded, 'expanded-sheet': !expanded }" @touchmove="swipeDown">
      <div class="craft-sheet-content">
        <div class="top-shape"></div>
        <section class="craft-section">
          <div class="top-section">
            <h2 class="resources-title">Craft recipes</h2>
            <p class="timer-text">{{ formatTime }}</p>
          </div>
          <div class="craft-container">
            <article class="craft-recipes-section">
              <h2 class="craft-title">You can craft:</h2>
              <div class="item-list">
                <div v-for="item in this.craftingList" class="item-image-section">
                  <img :src="item.itemImage" :alt="item.itemName" class="item-image" />
                  <div v-if="item.water > 0" class="needed-craft-item">
                    <p class="needed-item-name">{{ item.water }}x</p>
                    <img src="/water.svg" />
                  </div>
                  <div v-if="item.stone > 0" class="needed-craft-item">
                    <p class="needed-item-name">{{ item.stone }}x</p>
                    <img src="/stone.svg" />
                  </div>
                  <div v-if="item.wood > 0" class="needed-craft-item">
                    <p class="needed-item-name">{{ item.wood }}x</p>
                    <img src="/wood.svg" />
                  </div>
                  <button class="craft-btn" @click="
                    craftSelectedItem(
                      item.itemName,
                      item.wood,
                      item.water,
                      item.stone
                    )
                    ">
                    Craft
                  </button>
                </div>
              </div>
            </article>
          </div>
          <article class="your-items-section">
            <h2 class="your-items-title">Your items:</h2>
            <ul class="your-items-list">
              <li class="your-items-item" v-for="item in this.yourItems">
                <p class="your-items-count">{{ item.count }}</p>
                <img :src="item.image" class="your-items-image" />
              </li>
            </ul>
          </article>
        </section>
      </div>
    </div>
    <div class="bomb-sheet-example" :class="{ 'small-sheet': expanded, 'expanded-sheet': !expanded }"
      @touchmove="swipeDown">
      <div class="example-sheet-content">
        <div class="top-shape"></div>
        <section class="bomb-section">
          <div class="top-section-example">
            <h2 class="resources-title-example">How to diffuse</h2>
          </div>
          <div class="bomb-container">
            <div class="bomb-layout">
              <img src="../assets/time-bomb.png" class="bomb-img" alt="bomb image" />
              <p class="timer-on-bomb">{{ formatTime }}</p>
            </div>
            <article class="diffuse-bomb-section">
              <h2 class="diffuse-title">Diffuse bomb with:</h2>
              <div class="item-list">
                <div v-for="(item, index) in itemCounts" :key="index" class="item-image-section-bomb">
                  <span v-if="item.count > 0" class="item-count">{{ item.count }}x</span>
                  <img :src="getItemImage(item.item)" :alt="item.item" class="item-image" />
                </div>
              </div>
            </article>
            <article class="your-items-section">
              <h2 class="your-items-title">Your items:</h2>
              <ul class="your-items-list">
                <li class="your-items-item" v-for="item in this.yourItems">
                  <p class="your-items-count">{{ item.count }}</p>
                  <img :src="item.image" class="your-items-image" />
                </li>
              </ul>
            </article>
            <h3 class="smartmove-text">
              You can diffuse at <strong class="bold"> SmartMove 10 </strong>
            </h3>

            <button class="diffuse-btn" @click="showBombExample(false)">
              Go back
            </button>
          </div>
        </section>
      </div>
    </div>
    <div class="craft-sheet-example" :class="{ 'small-sheet': expanded, 'expanded-sheet': !expanded }"
      @touchmove="swipeDown">
      <div class="example-sheet-content">
        <div class="top-shape"></div>
        <section class="craft-section">
          <div class="top-section-example">
            <h2 class="resources-title-example">Items to craft</h2>
          </div>
          <div class="craft-container">
            <article class="craft-recipes-section">
              <div class="item-list">
                <div v-for="item in this.craftingList" class="item-image-section-craft-example">
                  <img :src="item.itemImage" :alt="item.itemName" class="item-image" />
                  <div v-if="item.water > 0" class="needed-craft-item">
                    <p class="needed-item-name">{{ item.water }}x</p>
                    <img src="/water.svg" />
                  </div>
                  <div v-if="item.stone > 0" class="needed-craft-item">
                    <p class="needed-item-name">{{ item.stone }}x</p>
                    <img src="/stone.svg" />
                  </div>
                  <div v-if="item.wood > 0" class="needed-craft-item">
                    <p class="needed-item-name">{{ item.wood }}x</p>
                    <img src="/wood.svg" />
                  </div>
                </div>
              </div>
            </article>
          </div>
          <article class="your-items-section">
            <h2 class="your-items-title">Your items:</h2>
            <ul class="your-items-list">
              <li class="your-items-item" v-for="item in this.yourItems">
                <p class="your-items-count">{{ item.count }}</p>
                <img :src="item.image" class="your-items-image" />
              </li>
            </ul>
          </article>
          <h3 class="smartmove-text">
            You can craft at <strong class="bold"> SmartMove 7 </strong>
          </h3>
          <button class="diffuse-btn" @click="showCraftExample(false)">
            Go back
          </button>
        </section>
      </div>
    </div>
    <div v-if="this.gameEnded == true">
      <div v-if="this.someoneDiffusedInTime == true">
        <EndScreen endscreenTitle="To slow!" :endscreenText="this.winnerUsername + ' has succesfully difussed the bomb in time!'
          " :diffuseTime="formatTime" endScreenImg="./toSlow.png" :diffusedInTime="true" />
      </div>
      <div v-else>
        <div v-if="this.diffusedInTime == true">
          <EndScreen endscreenTitle="Congrats!" endscreenText="You have succesfully difussed the bomb in time!"
            :diffuseTime="formatTime" endScreenImg="./confetti.png" :diffusedInTime="true" />
        </div>
        <div v-else>
          <EndScreen endscreenTitle="Oh no!" endscreenText="You have not difussed the bomb in time!"
            endScreenImg="./explosion.png" />
        </div>
      </div>
    </div>
    <CraftAlert :craftedItemImg="this.craftedItemImage"></CraftAlert>
    <CollectAlert :collectedItemImg="this.collectedItemImage"></CollectAlert>
    <ErrorAlert :errorText="this.errorText"></ErrorAlert>
  </div>
</template>
<script>
import ResourceBlock from "@/components/ResourceBlock.vue"
import Map from "@/components/map.vue";
import Header from "@/components/Header.vue";
import EndScreen from "@/components/EndScreen.vue";
import CraftAlert from "@/components/CraftAlert.vue";
import CollectAlert from "@/components/CollectAlert.vue";
import ErrorAlert from "@/components/ErrorAlert.vue";
import { io } from "socket.io-client";

export default {
  name: "SingleplayerView",
  components: {
    ResourceBlock,
    Map,
    Header,
    EndScreen,
    CraftAlert,
    CollectAlert,
    ErrorAlert,
  },
  data() {
    return {
      receivedUuid: "",
      taskList: [],
      randomTasks: [],
      tasks: [],
      taskName: "",
      taskDes: "",
      resources: [],
      resource: "",

      woodCount: 0,
      waterCount: 0,
      pliersCount: 0,
      scissorsCount: 0,
      pickaxeCount: 0,
      stoneCount: 0,

      itemName: [],
      craftingList: [],
      locations: [],

      expanded: true,
      startY: 0,
      endY: 0,

      timeLeft: 60 * 30,
      timer: null,

      bombData: [],
      diffuseItems: [],
      yourItems: "",
      initalItemsNeeded: [],
      itemImages: {
        pliers: "./pliers.svg",
        scissors: "./scissors.svg",
        pickaxe: "./pickaxe.svg",
      },
      elementStatus: {},

      possibleItems: ["pliers", "scissors", "pickaxe"],
      diffuseItemCounts: {},

      gameEnded: false,
      diffusedInTime: false,
      someoneDiffusedInTime: false,

      craftedItemImage: "",
      collectedItemImage: "",
      errorText: "",

      socket: io(`https://smart-move-server.onrender.com`), //https://smart-move-server.onrender.com
      usersInMyRoom: [],
      username: "",
      winnerUsername: "",
      roomNumber: 0,
    };
  },
  beforeMount() {
    this.getTasks();
    this.getNeededItems();
    this.getCraftingItems();

    // Call getYourItems to update yourItems data
    this.getYourItems();
  },
  beforeCreate() {
    localStorage.setItem("wood", 0);
    localStorage.setItem("water", 0);
    localStorage.setItem("pickaxe", 0);
    localStorage.setItem("scissors", 0);
    localStorage.setItem("pliers", 0);
    localStorage.setItem("stone", 0);
  },
  mounted() {
    const Game = {
      initialize: (
        locationName,
        color,
        groupNr,
        modules,
        data,
        beaconRadius,
        gameData
      ) => {
        // Logic for storing this data here...
        modules.forEach((module) => {
          // this.location = module.latitude;
          this.locations.push({
            latitude: module.latitude,
            longitude: module.longitude,
            id: module.id,
          });
        });
      },
      receiveBeaconResponse: (uuid) => {
        this.receivedUuid = uuid;
        this.checkIfSameId(this.receivedUuid, false);
        this.checkReceivedUuid(this.receivedUuid);
      },
    };

    // Assign the Game object to the window
    window.Game = Game;

    // Socket management
    this.socket.on("connect", () => {
      console.log("Socket connected !");
    });
    // Get the new user array.
    // Received when a user connect or disconneect to the room
    this.socket.on("update-user-room", (connectedUsers) => {
      this.usersInMyRoom = connectedUsers.connectedUsers[this.roomNumber];
    });
    this.socket.on("userReady-from-server", (data) => {
      if (data.roomNumber == this.roomNumber) {
        this.usersInMyRoom.find((user) => user.id == data.userId).isReady =
          data.isReady;
      }
    });
    // When someone do a task
    this.socket.on("start-game-from-server", (data) => {
      // Get the new user array
      if (data.roomNumber == this.roomNumber) {
        this.showSheet(true);
        this.startTimer();
      }
    });
    // When someone do a task
    this.socket.on("someone-did-a-task-from-server", (data) => {
      if (data.roomNumber == this.roomNumber) {
        this.checkIfSameId(data.smartMoveId, true);
      }
    });
    this.socket.on("someone-won-from-server", (data) => {
      if (data.roomNumber == this.roomNumber) {
        this.someoneDiffusedInTime = true;
        this.gameEnded = true;
        this.winnerUsername = data.username;
        clearInterval(this.timer);
      }
    });
  },
  beforeDestroy() {
    // Clear timer
    clearInterval(this.timer);
  },
  computed: {
    formatTime() {
      // Formats time with minutes : seconds
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${this.padTime(minutes)}:${this.padTime(seconds)}`;
    },
    itemsNeeded() {
      // Array with items to diffuse
      return this.bombData.itemsNeeded;
    },
    itemCounts() {
      const counts = {};
      this.itemsNeeded.forEach((item) => {
        counts[item] = (counts[item] || 0) + 1;
      });

      // Convert the counts object into an array of objects for easier iteration in the template
      return Object.keys(counts).map((item) => ({ item, count: counts[item] }));
    },
  },
  watch: {
    waterCount: "getYourItems",
    pliersCount: "getYourItems",
    scissorsCount: "getYourItems",
    pickaxeCount: "getYourItems",
    stoneCount: "getYourItems",
    woodCount: "getYourItems",
  },
  methods: {
    getYourItems() {
      this.woodCount = localStorage.getItem("wood") || 0;
      this.waterCount = localStorage.getItem("water") || 0;
      this.pliersCount = localStorage.getItem("pliers") || 0;
      this.scissorsCount = localStorage.getItem("scissors") || 0;
      this.pickaxeCount = localStorage.getItem("pickaxe") || 0;
      this.stoneCount = localStorage.getItem("stone") || 0;

      this.yourItems = {
        wood: { count: this.woodCount, image: "./wood.svg" },
        water: { count: this.waterCount, image: "./water.svg" },
        stone: { count: this.stoneCount, image: "./stone.svg" },
        pliers: { count: this.pliersCount, image: "./pliers.svg" },
        scissors: { count: this.scissorsCount, image: "./scissors.svg" },
        pickaxe: { count: this.pickaxeCount, image: "./pickaxe.svg" },
      };
    },
    getNeededItems() {
      // Array with possible items to diffuse
      const randomItems = [];

      // Generate 4 random items needed to diffuse
      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(
          Math.random() * this.possibleItems.length
        );
        randomItems.push(this.possibleItems[randomIndex]);
      }

      // Set itemsNeeded to the array of generated items
      this.bombData = {
        itemsNeeded: randomItems,
      };

      // Initialize counts for each item in diffuseItemCounts
      this.diffuseItemCounts = {};
      randomItems.forEach((item) => {
        this.diffuseItemCounts[item] = (this.diffuseItemCounts[item] || 0) + 1;
      });

      this.diffuseItems = this.bombData.itemsNeeded;
    },
    getItemImage(item) {
      // Return right image from the item
      return this.itemImages[item];
    },
    onSwipe(event) {
      // Swipe up event
      this.endY = event.touches[0].clientY;
      if (this.startY > this.endY && !this.expanded) {
        // Swipe up
        this.expanded = true;
      } else if (this.startY < this.endY && this.expanded) {
        // Swipe down
        this.expanded = false;
      }
      this.startY = this.endY;
    },
    swipeDown(event) {
      // Swipe down event
      this.endY = event.touches[0].clientY;

      if (this.startY < this.endY && !this.expanded) {
        // Swipe down
        this.expanded = true;
      } else if (this.startY > this.endY && this.expanded) {
        // Swipe up
        this.expanded = false;
      }

      this.startY = this.endY;
    },
    checkIfSameId(checkedUuid, isTaskFromOtherUser) {
      const elementsWithId = document.querySelectorAll("[id]");
      elementsWithId.forEach((element) => {
        if (
          element.id == checkedUuid &&
          !this.elementStatus[checkedUuid] &&
          checkedUuid !== "A20041E23F42"
        ) {
          element.classList.add("grey");
          this.elementStatus[checkedUuid] = true;

          if (!isTaskFromOtherUser) {
            this.getRandomResource(checkedUuid);
            this.socket.emit("someone-did-a-task-from-client", {
              roomNumber: this.roomNumber,
              userId: this.socket.id,
              smartMoveId: checkedUuid,
              newItem: "metal",
              quantity: 1,
            });
          }

          // Reset status after 1 minute
          setTimeout(() => {
            this.elementStatus[checkedUuid] = false;
            element.classList.remove("grey");
          }, 1 * 5 * 1000);
        }
      });
    },
    checkReceivedUuid(receivedUuid) {
      // Check if interacted with the bomb or crafting table
      if (receivedUuid == "A20041D7A6F1") {
        // change sheet to bomb sheet
        document.querySelector(".sheet").style.display = "none";
        document.querySelector(".craft-sheet").style.display = "none";
        document.querySelector(".bomb-sheet").style.display = "flex";
        document.querySelector(".craft-sheet-example").style.display = "none";
        document.querySelector(".bomb-sheet-example").style.display = "none";
      } else if (receivedUuid == "A20041E23F42") {
        // change sheet to craft sheet
        document.querySelector(".sheet").style.display = "none";
        document.querySelector(".bomb-sheet").style.display = "none";
        document.querySelector(".craft-sheet").style.display = "flex";
        document.querySelector(".craft-sheet-example").style.display = "none";
        document.querySelector(".bomb-sheet-example").style.display = "none";
      } else {
        // change sheet to collector map
        document.querySelector(".sheet").style.display = "flex";
        document.querySelector(".bomb-sheet").style.display = "none";
        document.querySelector(".craft-sheet").style.display = "none";
        document.querySelector(".craft-sheet-example").style.display = "none";
        document.querySelector(".bomb-sheet-example").style.display = "none";
      }
    },
    padTime(time) {
      return (time < 10 ? "0" : "") + time;
    },
    startTimer() {
      // start 30 min timer
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          clearInterval(this.timer);
          // Timer reached 0, so bomb explodes!
          this.gameEnded = true;
          this.diffusedInTime = false;
          this.socket.emit("bomb-exploded", {
            roomNumber: this.roomNumber,
          });
        }
      }, 1000);
    },
    getTasks() {
      fetch("./tasks.json")
        .then((res) => res.json())
        .then((data) => {
          this.taskList = data.tasks;

          const shuffledArray = this.shuffleTaskList(this.taskList.slice());
          console.log(shuffledArray);

          this.randomTasks = shuffledArray.slice(0, 9);
          console.log(this.randomTasks);
        })
        .catch((error) => console.error("Error fetching tasks:", error));
    },
    getCraftingItems() {
      fetch("./tasks.json")
        .then((res) => res.json())
        .then((data) => {
          this.craftingList = data.craftingItems;

          this.craftingList.forEach((craftItem) => {
            this.itemName.push(craftItem.itemName);
          });
          console.log(this.itemName);
        })
        .catch((error) => console.error("Error fetching tasks:", error));

      return this.itemName;
    },
    shuffleTaskList(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    getRandomResource(id) {
      fetch("./tasks.json")
        .then((res) => res.json())
        .then((data) => {
          this.tasks = data.tasks;
          this.tasks.forEach((task) => {
            if (task.smartMoveID == id) {
              this.resources = task.resources;
              const randomIndex = Math.floor(
                Math.random() * this.resources.length
              );
              this.resource = this.resources[randomIndex];

              this.collectedItemImage = `./${this.resource}.svg`;
              document.querySelector(".collect-alert-container").style.display =
                "flex";

              this.updateResourceCount(this.resource);
            }
          });
        });
    },
    updateResourceCount(receivedResource) {
      switch (receivedResource) {
        case "wood":
          this.woodCount++;
          localStorage.setItem("wood", this.woodCount);
          break;
        case "water":
          this.waterCount++;
          localStorage.setItem("water", this.waterCount);
          break;
        case "stone":
          this.stoneCount++;
          localStorage.setItem("stone", this.stoneCount);
          break;
        case "pliers":
          this.pliersCount++;
          localStorage.setItem("pliers", this.pliersCount);
          break;
        case "scissors":
          this.scissorsCount++;
          localStorage.setItem("scissors", this.scissorsCount);
          break;
        case "pickaxe":
          this.pickaxeCount++;
          localStorage.setItem("pickaxe", this.pickaxeCount);
          break;
      }
      if (this.possibleItems.includes(receivedResource)) {
        this.diffuseItemCounts[receivedResource] =
          (this.diffuseItemCounts[receivedResource] || 0) + 1;
      }
    },
    diffuseBomb() {
      // Check if there are items needed for diffusion
      if (this.diffuseItems.length === 0) {
        this.errorText = "no items to diffuse";
        document.querySelector(".error-alert-container").style.display = "flex";
        return;
      }

      // Check if all needed items are present in the right quantities
      const correctItems = this.diffuseItems.every((item) => {
        const itemCount = this.yourItems[item]?.count || 0;
        const neededCount = this.diffuseItemCounts[item] || 0;

        return itemCount >= neededCount;
      });

      if (correctItems && this.timer > 0) {
        // Code to diffuse the bomb
        this.winnerUsername = this.username;
        this.socket.emit("someone-won-from-client", {
          roomNumber: this.roomNumber,
          username: this.username,
        });
        this.gameEnded = true;
        this.diffusedInTime = true;
        clearInterval(this.timer);
      } else {
        this.errorText = "the right items";
        document.querySelector(".error-alert-container").style.display = "flex";
      }
    },
    craftSelectedItem(selectedItem, wood, water, stone) {
      if (
        wood <= this.woodCount &&
        water <= this.waterCount &&
        stone <= this.stoneCount
      ) {
        switch (selectedItem) {
          case "pliers":
            this.pliersCount++;
            localStorage.setItem("pliers", this.pliersCount);
            this.craftedItemImage = "./pliers.svg";
            document.querySelector(".alert-container").style.display = "flex";
            break;
          case "scissors":
            this.scissorsCount++;
            localStorage.setItem("scissors", this.scissorsCount);
            this.craftedItemImage = "./scissors.svg";
            document.querySelector(".alert-container").style.display = "flex";
            break;
          case "pickaxe":
            this.pickaxeCount++;
            localStorage.setItem("pickaxe", this.pickaxeCount);
            this.craftedItemImage = "./pickaxe.svg";
            document.querySelector(".alert-container").style.display = "flex";
            break;
        }
        localStorage.setItem("wood", this.woodCount - wood);
        localStorage.setItem("water", this.waterCount - water);
        localStorage.setItem("stone", this.stoneCount - stone);

        return;
      } else {
        this.errorText = "enough resources";
        document.querySelector(".error-alert-container").style.display = "flex";
      }
    },
    showLobby(openSheet, username, roomNumber) {
      if (this.username != "") {
        this.roomNumber = roomNumber;
        this.socket.emit("user-join-room", {
          username: username,
          roomNumber: roomNumber,
        });
        if (openSheet) {
          document.querySelector(".room-sheet").style.display = "none";
          document.querySelector(".lobby-sheet").style.display = "flex";
          document.querySelector(".sheet").style.display = "node";
          document.querySelector(".craft-sheet").style.display = "none";
          document.querySelector(".bomb-sheet").style.display = "none";
          document.querySelector(".bomb-sheet-example").style.display = "none";
          document.querySelector(".craft-sheet-example").style.display = "none";
        } else {
          document.querySelector(".room-sheet").style.display = "flex";
          document.querySelector(".lobby-sheet").style.display = "none";
          document.querySelector(".sheet").style.display = "node";
          document.querySelector(".craft-sheet").style.display = "none";
          document.querySelector(".bomb-sheet").style.display = "none";
          document.querySelector(".bomb-sheet-example").style.display = "none";
          document.querySelector(".craft-sheet-example").style.display = "none";
        }
      }
    },
    showSheet(openSheet) {
      if (openSheet) {
        document.querySelector(".room-sheet").style.display = "none";
        document.querySelector(".lobby-sheet").style.display = "none";
        document.querySelector(".sheet").style.display = "flex";
        document.querySelector(".craft-sheet").style.display = "none";
        document.querySelector(".bomb-sheet").style.display = "none";
        document.querySelector(".bomb-sheet-example").style.display = "none";
        document.querySelector(".craft-sheet-example").style.display = "none";
      } else {
        document.querySelector(".room-sheet").style.display = "none";
        document.querySelector(".lobby-sheet").style.display = "flex";
        document.querySelector(".sheet").style.display = "node";
        document.querySelector(".craft-sheet").style.display = "none";
        document.querySelector(".bomb-sheet").style.display = "none";
        document.querySelector(".bomb-sheet-example").style.display = "none";
        document.querySelector(".craft-sheet-example").style.display = "none";
      }
    },
    showCraftExample(openSheet) {
      if (openSheet) {
        document.querySelector(".sheet").style.display = "none";
        document.querySelector(".craft-sheet").style.display = "none";
        document.querySelector(".bomb-sheet").style.display = "none";
        document.querySelector(".bomb-sheet-example").style.display = "none";
        document.querySelector(".craft-sheet-example").style.display = "flex";
      } else {
        document.querySelector(".sheet").style.display = "flex";
        document.querySelector(".craft-sheet").style.display = "none";
        document.querySelector(".bomb-sheet").style.display = "none";
        document.querySelector(".bomb-sheet-example").style.display = "none";
        document.querySelector(".craft-sheet-example").style.display = "none";
      }
    },
    showBombExample(openSheet) {
      if (openSheet) {
        document.querySelector(".sheet").style.display = "none";
        document.querySelector(".craft-sheet").style.display = "none";
        document.querySelector(".bomb-sheet").style.display = "none";
        document.querySelector(".bomb-sheet-example").style.display = "flex";
        document.querySelector(".craft-sheet-example").style.display = "none";
      } else {
        document.querySelector(".sheet").style.display = "flex";
        document.querySelector(".craft-sheet").style.display = "none";
        document.querySelector(".bomb-sheet").style.display = "none";
        document.querySelector(".bomb-sheet-example").style.display = "none";
        document.querySelector(".craft-sheet-example").style.display = "none";
      }
    },
    changeUserStatus() {
      var actualUser = this.usersInMyRoom.find((x) => x.id == this.socket.id);
      actualUser.isReady = !actualUser.isReady;
      this.socket.emit("userReady-from-client", {
        isReady: actualUser.isReady,
        userId: this.socket.id,
        roomNumber: this.roomNumber,
      });
    },
    startGame() {
      this.socket.emit("start-game-from-client", {
        roomNumber: this.roomNumber,
      });
    },
  },
};
</script>
<style scoped>
.page {
  width: 100%;
  margin-top: 20px;
  color: black;
}

.page-title {
  font-weight: bold;
  font-size: 30px;
}

.room-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: height 0.3s ease-in-out;
  background-color: #faf8f4;
  overflow: hidden;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  -webkit-box-shadow: 0px 2px 32px -3px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 32px -3px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lobby-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: height 0.3s ease-in-out;
  background-color: #faf8f4;
  overflow: hidden;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  -webkit-box-shadow: 0px 2px 32px -3px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 32px -3px rgba(0, 0, 0, 0.3);
  display: none;
  flex-direction: column;
  align-items: center;
}

.sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: height 0.3s ease-in-out;
  background-color: #faf8f4;
  overflow: hidden;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  -webkit-box-shadow: 0px 2px 32px -3px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 32px -3px rgba(0, 0, 0, 0.3);
  display: none;
  flex-direction: column;
  align-items: center;
}

.bomb-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: height 0.3s ease-in-out;
  background-color: #faf8f4;
  overflow: hidden;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  -webkit-box-shadow: 0px 2px 32px -3px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 32px -3px rgba(0, 0, 0, 0.3);
  display: none;
  flex-direction: column;
  align-items: center;
}

.craft-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: height 0.3s ease-in-out;
  background-color: #faf8f4;
  overflow: hidden;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  -webkit-box-shadow: 0px 2px 32px -3px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 32px -3px rgba(0, 0, 0, 0.3);
  display: none;
  flex-direction: column;
  align-items: center;
}

.craft-sheet-example {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: height 0.3s ease-in-out;
  background-color: #faf8f4;
  overflow: hidden;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  -webkit-box-shadow: 0px 2px 32px -3px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 32px -3px rgba(0, 0, 0, 0.3);
  display: none;
  flex-direction: column;
  align-items: center;
}

.bomb-sheet-example {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: height 0.3s ease-in-out;
  background-color: #faf8f4;
  overflow: hidden;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  -webkit-box-shadow: 0px 2px 32px -3px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 32px -3px rgba(0, 0, 0, 0.3);
  display: none;
  flex-direction: column;
  align-items: center;
}

.small-sheet {
  height: 10vh;
}

.expanded-sheet {
  height: 85vh;
}

.room-sheet-content {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-top: 0px;
}

.lobby-sheet-content {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-top: 0px;
  height: 100%;
  justify-content: space-between;
  width: 80%;
}

.lobby-sheet-buttons {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  margin-bottom: 20px;
}

.lobby-sheet-userList {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
}

.sheet-content {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0px;
}

.bomb-sheet-content {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0px;
  width: 100%;
}

.craft-sheet-content {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0px;
  width: 100%;
}

.craft-section {
  margin-top: 10px;
  width: 90%;
}

.example-sheet-content {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0px;
  width: 90%;
}

.btn-style {
  outline: none;
  border: none;
  background-color: #64a70a;
  color: white;
  font-size: 20px;
  border-radius: 20px;
  padding: 8px;
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-style:active {
  background-color: white;
  border: #64a70a 3px solid;
  color: #64a70a;
}

.lobby-username {
  font-size: 24px;
  margin-left: 5px;
  margin-bottom: 8px;
}

.room-username-input {
  width: 98%;
  border-radius: 20px;
  padding: 12px;
}

.room-username {
  font-size: 20px;
}

.select-room {
  margin-top: 50px;
  font-size: 20px;
}

.required-label {
  color: red;
  font-size: x-small;
}

.user-list {
  display: flex;
  align-items: center;
}

.resource-map-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.top-shape {
  background-color: #a8a6a4;
  width: 16%;
  height: 6px;
  border-radius: 25px;
  margin-top: 15px;
}

.resources-section {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bomb-section {
  margin-top: 10px;
  width: 80%;
}

.your-items-section-home {
  width: 80%;
}

.craft-section {
  margin-top: 10px;
  width: 90%;
}

.room-button-row {
  width: 40%;
  margin: auto;
}

.room-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px 20px
}

.top-section {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  width: 80%;
}

.resources-title {
  font-weight: bold;
  font-size: 24px;
  color: black;
}

.top-section-example {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  width: 90%;
}

.resources-title-example {
  font-weight: bold;
  font-size: 22px;
  color: black;
}

.diffuse-title {
  font-weight: bold;
  font-size: 18px;
  color: black;
}

.craft-title {
  font-weight: bold;
  font-size: 18px;
  color: black;
}

.your-items-title {
  font-weight: bold;
  font-size: 18px;
  color: black;
}

.timer-text {
  font-size: 20px;
  color: black;
}

.resource-map {
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
}

.bingo-row {
  display: flex;
  width: 100%;
  height: 100%;
}

.bomb-container {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.bomb-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: -30px;
  margin-bottom: -20px;
}

.bomb-img {
  height: 150px;
}

.timer-on-bomb {
  position: absolute;
  color: red;
  font-size: 25px;
}

.diffuse-btn {
  outline: none;
  border: none;
  background-color: #64a70a;
  color: white;
  font-size: 20px;
  border-radius: 20px;
  padding: 8px;
  width: 100%;
  margin-top: 10px;
}

.diffuse-btn:active {
  background-color: white;
  border: #64a70a 3px solid;
  color: #64a70a;
}

.item-list {
  margin-bottom: 20px;
}

.item-image-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
  justify-content: space-between;
  gap: 27px;
  width: 100%;
}


.item-image-section-bomb {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
  justify-content: start;
  gap: 27px;
  width: 100%;
}


.item-image-section-craft-example {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
  justify-content: space-between;
  width: 80%;
}

.item-image {
  height: 30px;
}

.item-count {
  font-size: 20px;
  color: black;
}

.craft-container {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.craft-btn {
  background-color: #64a70a;
  color: white;
  outline: none;
  border: none;
  font-size: 16px;
  border-radius: 20px;
  padding-block: 14px;
  padding-inline: 21px;
  -webkit-box-shadow: 0px 6px 8px -3px rgba(0, 0, 0, 0.44);
  box-shadow: 0px 6px 8px -3px rgba(0, 0, 0, 0.44);
}

.your-items-section {
  margin-top: -10px;
}

.your-items-list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px 45px;
  margin: 0;
  padding: 0;
}

.your-items-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0 5px;
  width: 15%;
}

.your-items-count {
  font-size: 20px;
  color: black;
}

.your-items-image {
  height: 25px;
}

.visit-button {
  outline: none;
  border: none;
  background-color: #64a70a;
  color: white;
  font-size: 20px;
  border-radius: 20px;
  padding: 8px;
  width: 30vw;
}

.btn-divider {
  width: 80%;
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.needed-craft-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.needed-item-name {
  color: black;
}

.craft-btn {
  background-color: #64a70a;
  color: white;
  outline: none;
  border: none;
  font-size: 16px;
  border-radius: 20px;
  padding-block: 14px;
  padding-inline: 21px;
  -webkit-box-shadow: 0px 6px 8px -3px rgba(0, 0, 0, 0.44);
  box-shadow: 0px 6px 8px -3px rgba(0, 0, 0, 0.44);
}

.smartmove-text {
  color: black;
  text-align: center;
  margin-block: 15px;
  font-size: 18px;
  margin-bottom: 0;
}

.bold {
  font-weight: bold;
}

.center-item {
  display: flex;
  justify-content: center;
}

.align-item-left {
  display: flex;
  align-items: start;
  flex-direction: column;
}
</style>
