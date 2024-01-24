import React, { useState } from "react";
import Modal from "react-modal";
import "./PlayerForm.css"; // Import your CSS file for styling

const PlayerForm = ({ onStartGame }) => {
  const [isNewGame, setIsNewGame] = useState(false);

  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState([]);
  const [tiles, setTiles] = useState({});
  const [nextPlayerId, setNextPlayerId] = useState(1);
  const [error, setError] = useState("");
  const [availableColors, setAvailableColors] = useState({
    red: true,
    blue: true,
    green: true,
    yellow: true,
  });
  let limousineAvailable = false;

  const tilesP = {
    96: {
      row: 7,
      col: 11,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 96,
    },
    95: {
      row: 7,
      col: 10,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 95,
    },
    94: {
      row: 7,
      col: 9,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 94,
    },
    93: {
      row: 7,
      col: 8,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 93,
    },
    92: {
      row: 7,
      col: 7,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 92,
    },
    91: {
      row: 7,
      col: 6,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 91,
    },
    90: {
      row: 7,
      col: 5,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 90,
    },
    78: {
      row: 6,
      col: 5,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 78,
    },
    66: {
      row: 5,
      col: 5,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 66,
    },
    54: {
      row: 4,
      col: 5,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 54,
    },
    55: {
      row: 4,
      col: 6,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 55,
    },
    56: {
      row: 4,
      col: 7,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 56,
    },
    57: {
      row: 4,
      col: 8,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 57,
    },
    58: {
      row: 4,
      col: 9,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 58,
    },
    59: {
      row: 4,
      col: 10,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 59,
    },
    60: {
      row: 4,
      col: 11,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 60,
    },
    72: {
      row: 5,
      col: 11,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 72,
    },
    84: {
      row: 6,
      col: 11,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 84,
    },
    //world2
    47: {
      row: 3,
      col: 10,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 47,
    },
    46: {
      row: 3,
      col: 9,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 46,
    },
    45: {
      row: 3,
      col: 8,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 45,
    },
    44: {
      row: 3,
      col: 7,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 44,
    },
    43: {
      row: 3,
      col: 6,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 43,
    },
    42: {
      row: 3,
      col: 5,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 42,
    },
    30: {
      row: 2,
      col: 5,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 30,
    },
    18: {
      row: 1,
      col: 5,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 18,
    },
    6: {
      row: 0,
      col: 5,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 6,
    },
    7: {
      row: 0,
      col: 6,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 7,
    },
    8: {
      row: 0,
      col: 7,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 8,
    },
    9: {
      row: 0,
      col: 8,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 9,
    },
    10: {
      row: 0,
      col: 9,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 10,
    },
    11: {
      row: 0,
      col: 10,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 11,
    },
    12: {
      row: 0,
      col: 11,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 12,
    },
    24: {
      row: 1,
      col: 11,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 24,
    },
    36: {
      row: 2,
      col: 11,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 36,
    },
    48: {
      row: 3,
      col: 11,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 48,
    },
    //world3
    17: {
      row: 1,
      col: 4,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 17,
    },
    29: {
      row: 2,
      col: 4,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 29,
    },
    28: {
      row: 2,
      col: 3,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 28,
    },
    27: {
      row: 2,
      col: 2,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 27,
    },
    26: {
      row: 2,
      col: 1,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 26,
    },
    25: {
      row: 2,
      col: 0,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 25,
    },
    13: {
      row: 1,
      col: 0,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 13,
    },
    1: {
      row: 0,
      col: 0,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 1,
    },
    2: {
      row: 0,
      col: 1,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 2,
    },
    3: {
      row: 0,
      col: 2,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 3,
    },
    4: {
      row: 0,
      col: 3,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 4,
    },
    5: {
      row: 0,
      col: 4,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 5,
    },
    //island
    51: {
      row: 4,
      col: 2,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 51,
    },
    52: {
      row: 4,
      col: 3,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 52,
    },
    64: {
      row: 5,
      col: 3,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 64,
    },
    76: {
      row: 6,
      col: 3,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 76,
    },
    75: {
      row: 6,
      col: 2,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 75,
    },
    74: {
      row: 6,
      col: 1,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 74,
    },
    62: {
      row: 5,
      col: 1,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 62,
    },
    50: {
      row: 4,
      col: 1,
      isOccupied: false,
      payFee: null,
      playerID: null,
      ID: 50,
    },
  };

  const actionCards = {
    1: {
      id: 1,
      name: "איסוף רווחים",
      description:
        "קבל את איסוף הרווחים הכי גבוהה מבין המשתתפים",
    },
    2: {
      id: 2,
      name: "התחמקות מתשלום",
      description: "אינך צריך לשלם שכירות לעסק שעליו אתה עומד",
    },
    3: {
      id: 3,
      name: "אופציות",
      description: "קנה עד 2 מניות בחצי ממחיר השוק",
    },
    4: {
      id: 4,
      name: "שכירות מתנה",
      description: "קבל את השכירות מהעסק הכי רווחי שלך",
    },
    5: {
      id: 5,
      name: "היתר בנייה חריגה",
      description: "אתה יכול להקים עסק על כל משבצת פנויה",
    },
    6: {
      id: 6,
      name: "הבורסה",
      description: "אתה יכול לקנות או למכור עד 3 מניות בשער הנוכחי",
    },
    7: {
      id: 7,
      name: "מימוש נכסים",
      description:
        "מכור את אחד העסקים שלך לקופה, קבל עבורו את מחיר העלות + 500,000₪",
    },
    8: {
      id: 8,
      name: "פתור מכותרת אדומה",
      description: "אינך צריך לשלם במשבצת אדומה",
    },
    9: {
      id: 9,
      name: "מעבר מוזל",
      description: "קבל הנחה של 2,000,000₪ על מעבר לעיר אחרת",
    },
    10: {
      id: 10,
      name: "לימוזינה",
      description:
        "עבור לכל משבצת על הלוח מלבד האי, אינך פטור מתשלום דמי מעבר",
    },
    12: {
      id: 12,
      name: "גיפט קארד",
      description: "קבל 1,000,000₪ מהבנק",
    },
    13: {
      id: 13,
      name: "סטארט אפ",
      description: "העסק שהקמת פרסם דוחות מעל המצופה, קבל 3,000,000₪ מהבנק",
    },
    14: {
      id: 14,
      name: "איסוף רווחים",
      description:
        "קבל את איסוף הרווחים הכי גבוהה מבין המשתתפים",
    },
    15: {
      id: 15,
      name: "איסוף רווחים",
      description:
        "קבל את איסוף הרווחים הכי גבוהה מבין המשתתפים",
    },
    16: {
      id: 16,
      name: "איסוף רווחים",
      description:
        "קבל את איסוף הרווחים הכי גבוהה מבין המשתתפים",
    },
    17: {
      id: 17,
      name: "התחמקות מתשלום",
      description: "אינך צריך לשלם שכירות לעסק שעליו אתה עומד",
    },
    18: {
      id: 18,
      name: "התחמקות מתשלום",
      description: "אינך צריך לשלם שכירות לעסק שעליו אתה עומד",
    },
    19: {
      id: 19,
      name: "התחמקות מתשלום",
      description: "אינך צריך לשלם שכירות לעסק שעליו אתה עומד",
    },
    20: {
      id: 20,
      name: "אופציות",
      description: "קנה עד 2 מניות בחצי ממחיר השוק",
    },
    21: {
      id: 21,
      name: "שכירות מתנה",
      description: "קבל את השכירות מהעסק הכי רווחי שלך",
    },
    22: {
      id: 22,
      name: "שכירות מתנה",
      description: "קבל את השכירות מהעסק הכי רווחי שלך",
    },
    23: {
      id: 23,
      name: "היתר בנייה חריגה",
      description: "אתה יכול להקים עסק על כל משבצת פנויה",
    },
    24: {
      id: 24,
      name: "היתר בנייה חריגה",
      description: "אתה יכול להקים עסק על כל משבצת פנויה",
    },
    25: {
      id: 25,
      name: "שכירות מתנה",
      description: "קבל את השכירות מהעסק הכי רווחי שלך",
    },
    26: {
      id: 26,
      name: "הבורסה",
      description: "אתה יכול לקנות או למכור עד 3 מניות בשער הנוכחי",
    },
    27: {
      id: 27,
      name: "מימוש נכסים",
      description:
        "מכור עסק שבבעלותך קבל מהבנק +500,000₪ ממחיר העלות",
    },
    28: {
      id: 28,
      name: "מימוש נכסים",
      description:
        "מכור עסק שבבעלותך קבל מהבנק +500,000₪ ממחיר העלות",
    },
    29: {
      id: 29,
      name: "פתור מכותרת אדומה",
      description: "אינך צריך לשלם במשבצת אדומה",
    },
    31: {
      id: 31,
      name: "גיפט קארד",
      description: "קבל 1,000,000₪ מהבנק",
    },
    32: {
      id: 32,
      name: "גיפט קארד",
      description: "קבל 1,000,000₪ מהבנק",
    },
    33: {
      id: 33,
      name: "גיפט קארד",
      description: "קבל 1,000,000₪ מהבנק",
    },
    34: {
      id: 34,
      name: "סטארט אפ",
      description: "העסק שהקמת פרסם דוחות מעל המצופה, קבל 3,000,000₪ מהבנק",
    },
  };

  const marketState = {
    1: {
      name: "DoubleExpanse",
      stockPrice: 400000,
      description: "תשלום בכותרת אדומה הוא כפול",
    },
    2: {
      name: "1.5ProfitOnCollect",
      stockPrice: 1800000,
      description: "קבל 150% על איסוף רווחים",
    },
    3: {
      name: "0.5CostAndProfit",
      stockPrice: 600000,
      description: "עלות הקמת עסקים והשכירות הם חצי מחיר",
    },
    4: {
      name: "ClosedGates",
      stockPrice: 1200000,
      description: "לא ניתן לעבור מעיר לעיר, מלבד קלף לימוזינה",
    },
    5: {
      name: "OverMillionBussinessX2",
      stockPrice: 1400000,
      description: "עסקים שעלות הקמתם היא 1,000,000₪ ומעלה מקבלים שכירות כפולה",
    },
    6: {
      name: "PassingX2",
      stockPrice: 2000000,
      description: "דמי המעבר בין עיר לעיר כפולים",
    },
    7: {
      name: "CheapGate-1M",
      stockPrice: 1000000,
      description: "דמי המעבר כעת זולים ב1,000,000₪",
    },
  };

  const openNewGame = () => {
    setIsNewGame(true);
  };

  const closeNewGame = () => {
    setIsNewGame(false);
  };

  const storeIfLimousine = (limousineAvailable) => {
    localStorage.setItem("IfLimousine", JSON.stringify(limousineAvailable));
  };

  const saveCurrentMarketStateToLocalStorage = (currentMarketState) => {
    localStorage.setItem(
      "currentMarketState",
      JSON.stringify(currentMarketState)
    );
  };

  const storePlayerIndexInLocalStorage = (pla) => {
    localStorage.setItem("playerIndex", JSON.stringify(pla));
  };

  const storePlayerDataInLocalStorage = (players) => {
    const playerDataToStore = JSON.stringify(players);
    localStorage.setItem("playerData", playerDataToStore);
  };

  const storeMarketStateInLocalStorage = () => {
    const marketStateToStore = JSON.stringify(marketState);
    localStorage.setItem("marketState", marketStateToStore);
  };

  const storeTilesDataInLocalStorage = () => {
    const tilesDataToStore = JSON.stringify(tilesP);
    localStorage.setItem("tilePositions", tilesDataToStore);
  };

  const storeActionCards = (actionCards) => {
    localStorage.setItem("actionCards", JSON.stringify(actionCards));
  };

  const storeAnotherTurnInLocalStorage = (anotherTurn) => {
    localStorage.setItem("anotherTurn", JSON.stringify(anotherTurn));
  };

  const getPlayerData = () => {
    return JSON.parse(localStorage.getItem("playerData"));
  };

  const getRandomCard = () => {
    const keys = Object.keys(actionCards);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    if (
      actionCards[randomKey].name === "Limousine" &&
      limousineAvailable !== true
    ) {
      limousineAvailable = true;
      storeIfLimousine(limousineAvailable);
      return actionCards[randomKey];
    } else if (
      actionCards[randomKey].name === "Limousine" &&
      limousineAvailable === true
    ) {
      return getRandomCard();
    } else {
      return actionCards[randomKey];
    }
  };

  const addCardsToArray = (numCardsToAdd) => {
    const card = [];
    for (let i = 1; i < numCardsToAdd; i++) {
      const newCard = getRandomCard();
      card.push(newCard);
    }
    return card;
  };


  const handleNumPlayersChange = (event) => {
    let num_of_players = parseInt(event.target.value);
    setNumPlayers(num_of_players);
    setPlayers([]);
    availableColors["red"] = true;
    availableColors["blue"] = true;
    availableColors["green"] = true;
    availableColors["yellow"] = true;
  };

  const handlePlayerNameChange = (event, index) => {
    const updatedPlayers = [...players];
    let newName = event.target.value;
    newName = newName.charAt(0).toUpperCase() + newName.slice(1);

    const isDuplicate = updatedPlayers.some(
      (player, i) => i !== index && player?.name === newName
    );

    if (isDuplicate) {
      setError("שמות השחקנים צריכים להיות שונים");
    } else {
      setError("");
      // Use the nextPlayerId as the player's ID
      updatedPlayers[index] = {
        ...updatedPlayers[index],
        id: nextPlayerId,
        name: newName,
        location: 96,
        ifPayedToWorld2: false,
        ifPayedToWorld3: false,
        ifPayedIsland: false,
        level1Business: 0,
        level2Business: 0,
        level3Business: 0,
        level4Business: 0,
        stocks: 0,
        loans: 0,
      };

      // Increment the player ID counter for the next player
      setNextPlayerId(nextPlayerId + 1);

      setPlayers(updatedPlayers);
    }
  };

  const handleColorChange = (color, index) => {
    if (availableColors[color]) {
      const updatedPlayers = [...players];

      if (updatedPlayers[index]?.color) {
        setAvailableColors((prevColors) => ({
          ...prevColors,
          [updatedPlayers[index].color]: true,
        }));
      }

      updatedPlayers[index] = { ...updatedPlayers[index], color };
      setPlayers(updatedPlayers);

      setAvailableColors((prevColors) => ({
        ...prevColors,
        [color]: false,
      }));
    }
  };

  const determineInitialPlayerOrder = () => {
    const initialDiceRolls = [];

    const rollUniqueDiceResult = (usedResults) => {
      let diceRollResult;
      let duplicateResult;

      do {
        diceRollResult = Math.floor(Math.random() * 6) + 1;
        duplicateResult = usedResults.includes(diceRollResult);
      } while (duplicateResult);

      return diceRollResult;
    };

    players.forEach((player) => {
      const diceRollResult = rollUniqueDiceResult(
        initialDiceRolls.map((item) => item.diceRollResult)
      );

      let currentMoney = 0;
      let card = [];

      if (diceRollResult === 1) {
        currentMoney = 1000000;
        card = addCardsToArray(6);
      } else if (diceRollResult === 2) {
        currentMoney = 2000000;
        card = addCardsToArray(5);
      } else if (diceRollResult === 3) {
        currentMoney = 3000000;
        card = addCardsToArray(4);
      } else if (diceRollResult === 4) {
        currentMoney = 4000000;
        card = addCardsToArray(3);
      } else if (diceRollResult === 5) {
        currentMoney = 5000000;
        card = addCardsToArray(2);
      } else if (diceRollResult === 6) {
        currentMoney = 6000000;
        card = addCardsToArray(2);
      }

      player.diceResult = diceRollResult;
      player.currentMoney = currentMoney;
      player.card = card;

      initialDiceRolls.push({ player, diceRollResult });
    });

    initialDiceRolls.sort((a, b) => b.diceRollResult - a.diceRollResult);

    const initialPlayerOrder = initialDiceRolls.map((item) => item.player.id);

    initialDiceRolls.forEach((item) => {
      console.log(
        `${item.player.color}: ${item.player.name} - Score: ${item.diceRollResult} - Money: ${item.player.currentMoney} - Card: ${item.player.card}`
      );
    });

    return initialPlayerOrder;
  };

  const getRandomMarketState = () => {
    const keys = Object.keys(marketState);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    console.log(marketState[randomKey]);
    return marketState[randomKey];
  };

  const handleStartGame = () => {
    if (validateInput() === false) {
      return;
    }
    closeNewGame();
    const initialPlayerOrder = determineInitialPlayerOrder();

    // Map the initialPlayerOrder to the corresponding players in the players dictionary
    const orderedPlayers = initialPlayerOrder.map((playerId) =>
      players.find((player) => player.id === playerId)
    );
    console.log(orderedPlayers);
    const currentMarketState = getRandomMarketState();
    // Store player data in local storage before starting the game
    saveCurrentMarketStateToLocalStorage(currentMarketState);
    storePlayerDataInLocalStorage(orderedPlayers);
    storeActionCards(actionCards);
    storeTilesDataInLocalStorage();
    storeMarketStateInLocalStorage();
    onStartGame(orderedPlayers, initialPlayerOrder, tiles);
    storePlayerIndexInLocalStorage(0);
    storeAnotherTurnInLocalStorage(false);
  };

  const handleResumeGame = () => {
    const savedTilePositions = localStorage.getItem("tilePositions");
    const savedPlayerData = localStorage.getItem("playerData");

    if (savedTilePositions && savedPlayerData) {
      const loadedTiles = JSON.parse(savedTilePositions);
      const loadedPlayers = JSON.parse(savedPlayerData);

      setTiles(loadedTiles);
      setPlayers(loadedPlayers);
    }

    onStartGame(players, tiles);
  };

  const validateInput = () => {
    let ret = true;
    if (players.length !== numPlayers) {
      return false;
    }
    players.forEach((player) => {
      if (player.color === undefined) {
        ret = false;
        setError("אנא בחר צבע");
      }
      if (player.name === undefined) {
        ret = false;
        setError("אנא בחר שם");
      }
    });
    return ret;
  };

  const renderPlayerInputs = () => {
    const playerInputs = [];

    for (let i = 0; i < numPlayers; i++) {
      const playerColor = players[i]?.color;

      playerInputs.push(
        <div className="player-input" key={i}>
          <input
            type="text"
            placeholder={`הכנס שם ${i + 1} `}
            value={players[i] ? players[i].name : ""}
            onChange={(e) => handlePlayerNameChange(e, i)}
          />
          <div className="color-selection">
            {Object.keys(availableColors).map((availColor) => (
              <div
                key={availColor}
                className={`color-option ${
                  playerColor === availColor ? "selected" : ""
                } ${
                  !availableColors[availColor] && playerColor !== availColor
                    ? "unavailable"
                    : ""
                } ${availColor}`}
                onClick={() => handleColorChange(availColor, i)}
              ></div>
            ))}
          </div>
          <div className="color-message">{error}</div>
        </div>
      );
    }

    return playerInputs;
  };

  return (
    <div className="start-game-button">
      <button onClick={openNewGame} className="confirm-button">
        משחק חדש
      </button>
      <>
      {getPlayerData() ? (
        <button onClick={handleResumeGame} className="confirm-button">
          המשך משחק
        </button>
      ) : (
        null // or render an alternative UI
      )}
    </>
      <Modal
        isOpen={isNewGame}
        onRequestClose={closeNewGame}
        contentLabel="How Many Players"
      >
        <div className="modal-content">
          <h1>אנא בחר כמות משתתפים</h1>
          <div className="number-selector">
            <select value={numPlayers} onChange={handleNumPlayersChange}>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>
          {renderPlayerInputs()}
          <button onClick={handleStartGame} className="confirm-button">
            אישור
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PlayerForm;
