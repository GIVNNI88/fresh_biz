import React, { Component } from "react";
import Modal from "react-modal";

import "./Board.css";
//last
class Board extends Component {
  constructor(props) {
    super(props);

    this.world1Tiles = [
      96, 95, 94, 93, 92, 91, 90, 78, 66, 54, 55, 56, 57, 58, 59, 60, 72, 84,
    ];
    this.world2Tiles = [
      47, 46, 45, 44, 43, 42, 30, 18, 6, 7, 8, 9, 10, 11, 12, 24, 36, 48,
    ];
    this.world3Tiles = [17, 29, 28, 27, 26, 25, 13, 1, 2, 3, 4, 5];

    this.island = [51, 52, 64, 76, 75, 74, 62, 50];

    this.players = this.getPlayerData();

    this.currentMarketState = this.getCurrentMarketStateToLocalStorage();

    this.marketState = this.getMarketState();

    this.players.forEach((player) => {
      player.diceResult = null;
      player.hasLanded = false;
    });
    this.actionCards = this.getActionCards();

    this.state = {
      playerIndex: this.players.length - 1,
      firstTurn: true,
      showModal: false,
      showBuyBusinessModal: false,
      showBuyStocksModal: false,
      showSellStocksModal: false,
      showTakeLoanModal: false,
      showReturnLoanModal: false,
      showPlayerCardsModal: false,
      showBuyBusinessModalWhereAvailable: false,
      playerChoseToUseFreePass: false,
      showSellBusinessModal: false,
      showPlayerFreePassModal: false,
      showPlayerLimousineModal: false,
      showPlayerRedHeadedModal: false,
      showPlayerVictoryModal: false,
      showStockCardModal: false,
      selectedBusinessOption: "business1",
      currentTileToBuyBusiness: "",
      selectedTile: "",
      usedCardName: "",
      selectedStocks: 0,
      cardId: 0,
      logs: [],
      availableTiles: [],
    };

    this.logsRef = React.createRef();
    this.originalLog = console.log;
  }

  // store and get data from local storage

  storePlayerIndexInLocalStorage = (pla) => {
    localStorage.setItem("playerIndex", JSON.stringify(pla));
  };

  getPlayerIndex = () => {
    let playerIndex = JSON.parse(localStorage.getItem("playerIndex"));
    if (playerIndex === null) {
      playerIndex = 0;
    }
    return playerIndex;
  };

  saveTilePositionsToLocalStorage = (tilePositions) => {
    localStorage.setItem("tilePositions", JSON.stringify(tilePositions));
  };

  getTilePositions = () => {
    return JSON.parse(localStorage.getItem("tilePositions"));
  };

  storeIfLimousine = (limousineAvailable) => {
    localStorage.setItem("IfLimousine", JSON.stringify(limousineAvailable));
  };

  savePlayerDataToLocalStorage = (playerData) => {
    localStorage.setItem("playerData", JSON.stringify(playerData));
  };

  getPlayerData = () => {
    return JSON.parse(localStorage.getItem("playerData"));
  };

  getActionCards = () => {
    return JSON.parse(localStorage.getItem("actionCards"));
  };

  saveCurrentMarketStateToLocalStorage = (currentMarketState) => {
    localStorage.setItem(
      "currentMarketState",
      JSON.stringify(currentMarketState)
    );
  };

  getCurrentMarketStateToLocalStorage = () => {
    return JSON.parse(localStorage.getItem("currentMarketState"));
  };

  getMarketState = () => {
    return JSON.parse(localStorage.getItem("marketState"));
  };

  getIfLimousine = () => {
    return JSON.parse(localStorage.getItem("limousineAvailable"));
  };

  ///////////////////////////////////////////////////////////////////////
  //component

  componentDidMount() {
    this.resizeCanvas();
    this.loadBackgroundImage(); // Load the image once
    window.addEventListener("resize", this.resizeCanvas);
    // Load tile positions from local storage and set them in the state
    this.setState({ tilePositions: this.getPlayerIndex() });

    // Load player data from local storage and set them in the state
    this.setState({ playerData: this.getPlayerData() });

    this.overrideConsoleLog();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.logs.length !== this.state.logs.length) {
      this.scrollToBottom();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeCanvas);
    window.removeEventListener("resize", this.drawBoard);
    this.resetConsoleLog();
  }

  //////////////////Logs section////////////////////////////
  //

  overrideConsoleLog = () => {
    const originalLog = console.log;
    console.log = (...args) => {
      const logEntry = `${new Date().toLocaleTimeString()}: ${args.join(" ")}`;
      originalLog(...args);
      this.setState((prevState) => ({
        logs: [...prevState.logs, logEntry],
      }));
    };
  };

  resetConsoleLog = () => {
    console.log = this.originalLog;
  };

  scrollToBottom = () => {
    const logsContainer = this.logsRef.current;
    logsContainer.scrollTop =
      logsContainer.scrollHeight - logsContainer.clientHeight;
  };

  /////////////////////////////////////////////////////////////

  loadBackgroundImage = () => {
    const backgroundImage = new Image();
    backgroundImage.src = "/img/board.png";
    backgroundImage.onload = () => {
      this.backgroundImage = backgroundImage; // Store the image in the component
      this.drawBoard();
    };
  };

  resizeCanvas = () => {
    const canvas = this.canvasRef; // Use the canvas reference
    if (!canvas) {
      return;
    }

    const canvasContainer = canvas.parentElement;
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
    this.drawBoard();
  };

  drawTilesWithOwnershipAndFees(ctx) {
    // Define the size of the rectangle (width and height)
    const rectangleWidth = 60; // Change this value to adjust the width
    const rectangleHeight = 40; // Change this value to adjust the height
    const tilePositions = this.getTilePositions();
    // Offset to lower the rectangle (adjust this value as needed)
    const yOffset = 10; // Change this value to adjust the vertical offset

    // Loop through the tile positions and draw tiles with ownership and fees
    for (const tileID in tilePositions) {
      const tile = tilePositions[tileID];

      // Check if the tile is occupied by a player
      if (tile.isOccupied) {
        const playerColor = this.players.find(
          (player) => player.id === tile.playerID
        ).color;

        // Calculate the center of the tile
        const centerX =
          (tile.col * ctx.canvas.width) / 12 + ctx.canvas.width / 22;
        const centerY =
          (tile.row * ctx.canvas.height) / 8 + ctx.canvas.height / 16;

        const rectWidth = (ctx.canvas.width / 12) * (rectangleWidth / 110);
        const rectHeight = (ctx.canvas.height / 8) * (rectangleHeight / 120);

        const rectX = centerX - rectWidth / 2;
        const rectY = centerY - rectHeight / 2 + yOffset;

        // Draw a rounded rectangle with the player's color and stroke
        const cornerRadius = 10; // Set the corner radius for the rounded rectangle
        const strokeColor = "black"; // Set the color for the stroke
        const strokeWidth = 1; // Adjust the width of the stroke

        ctx.fillStyle = playerColor;
        ctx.strokeStyle = strokeColor; // Set the stroke color
        ctx.lineWidth = strokeWidth; // Set the stroke width

        ctx.beginPath();
        ctx.moveTo(rectX + cornerRadius, rectY);
        ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
        ctx.quadraticCurveTo(
          rectX + rectWidth,
          rectY,
          rectX + rectWidth,
          rectY + cornerRadius
        );
        ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
        ctx.quadraticCurveTo(
          rectX + rectWidth,
          rectY + rectHeight,
          rectX + rectWidth - cornerRadius,
          rectY + rectHeight
        );
        ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
        ctx.quadraticCurveTo(
          rectX,
          rectY + rectHeight,
          rectX,
          rectY + rectHeight - cornerRadius
        );
        ctx.lineTo(rectX, rectY + cornerRadius);
        ctx.quadraticCurveTo(rectX, rectY, rectX + cornerRadius, rectY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke(); // Draw the stroke for the rounded rectangle

        // Draw the fee text
        ctx.fillStyle = "black";
        ctx.font = "bold 1vw Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tile.payFee, centerX, centerY + yOffset); // Apply the same vertical offset
      }
    }
  }

  drawBoard = (playerMove = true) => {
    const canvas = this.canvasRef;
    const ctx = canvas.getContext("2d");
    const boardContainer = document.querySelector(".board-container");
    const padding = -5; // Adjust the padding value as needed

    // Calculate the available width and height for the canvas
    const availableWidth = boardContainer.clientWidth - 2 * padding;
    const availableHeight = boardContainer.clientHeight - 2 * padding;

    // Adjust the canvas dimensions
    canvas.width = availableWidth;
    canvas.height = availableHeight;

    // Clear the canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background image to fit the canvas size
    if (this.backgroundImage) {
      ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    this.drawTilesWithOwnershipAndFees(ctx);

    const playerData = this.getPlayerData();
    if (playerMove) {
      this.playerMovement(playerData);
    }
    this.drawPlayer(playerData);
    // Your tile drawing logic
    // const rows = 8;
    // const cols = 12;
    // const tileWidth = canvas.width / cols;
    // const tileHeight = canvas.height / rows;

    // ctx.strokeStyle = "black";
    // ctx.font = "16px Arial";
    // ctx.textAlign = "center";
    // ctx.textBaseline = "middle";

    // for (let row = 0; row < rows; row++) {
    //   for (let col = 0; col < cols; col++) {
    //     const x = col * tileWidth;
    //     const y = row * tileHeight;
    //     const tileNumber = col + row * cols + 1;
    //     //לבחור איזה משבצות אני רוצה שיצייר

    //     ctx.strokeRect(x, y, tileWidth, tileHeight);
    //     ctx.fillText(
    //       tileNumber.toString(),
    //       x + tileWidth / 2,
    //       y + tileHeight / 2
    //     );
    //   }
    // }
  };

  ///////////////////game function///////////////////////

  handleRollDice = () => {
    const playerIndexLS = this.getPlayerIndex();
    let pla = 0;
    if (playerIndexLS === 0 && this.state.firstTurn) {
      this.setState({ playerIndex: pla });
    } else {
      pla = (playerIndexLS + 1) % this.players.length;
    }
    const tilePositions = this.getTilePositions();
    this.storePlayerIndexInLocalStorage(pla);

    const playerData = this.getPlayerData();
    const currentPlayer = playerData[pla];

    const diceRollResult = Math.floor(Math.random() * 6) + 1;

    // Set the diceResult for the current player
    playerData[pla].diceResult = diceRollResult;

    // Now, you can update the component's state to re-render with the new diceResult
    this.setState({ diceResult: diceRollResult });
    const currentLocation = playerData[pla].location;

    // Calculate the new location index based on allowedTiles, world2Tiles, or world3Tiles
    let newLocationIndex;

    this.checkPlayerPermission(
      playerData,
      pla,
      currentPlayer,
      diceRollResult,
      newLocationIndex,
      currentLocation
    );
    this.setState({ firstTurn: false });
    const currentTile = tilePositions[playerData[pla].location];

    this.playerMovement(playerData);
    this.checkIfWantToUseFreePass(currentTile, playerData, pla, currentPlayer);
    this.checkIfWantToUseRedHeaded(currentTile, playerData, pla, currentPlayer);
  };

  drawPlayer = (playerData) => {
    const playerIndexLS = this.getPlayerIndex();
    let pla = 0;
    if (playerIndexLS === null) {
      pla = (this.state.playerIndex + 1) % this.players.length;
    } else {
      pla = playerIndexLS;
    }
    this.setState({ playerIndex: pla });
    const tilePositions = this.getTilePositions();

    const playerSpacing = 35; // Adjust the spacing between players
    const playersPerSide = 2; // Number of players on each side of the square
    const canvas = this.canvasRef; // Use this.canvasRef
    const ctx = canvas.getContext("2d");
    const rows = 8; // Define the number of rows
    const cols = 12; // Define the number of columns

    // Create a dictionary to store the count of players on each tile
    const tilePlayerCounts = {};

    // Count the number of players on each tile
    playerData.forEach((player) => {
      tilePlayerCounts[player.location] =
        (tilePlayerCounts[player.location] || 0) + 1;
    });

    // Clear the canvas before updating player positions
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background image from the stored instance
    // if (this.backgroundImage) {
    //   ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
    // }

    // this.drawTilesWithOwnershipAndFees(ctx);

    // Update player positions and location in local storage
    playerData.forEach((player, index) => {
      const centerX =
        ((tilePositions[player.location].col + 0.5) * canvas.width) / cols;
      const centerY =
        ((tilePositions[player.location].row + 0.5) * canvas.height) / rows;
      const sideIndex = Math.floor(index / playersPerSide);
      const positionInSide = index % playersPerSide;
      const xOffset =
        (positionInSide - playersPerSide / 2 + 0.5) * playerSpacing;
      const yOffset = (sideIndex - playersPerSide / 2 + 0.5) * playerSpacing;
      const playerSize = 60; // Twice the size

      // Calculate player position
      const playerX =
        tilePlayerCounts[player.location] === 1
          ? centerX - playerSize / 2
          : centerX + xOffset - playerSize / 2;
      const playerY =
        tilePlayerCounts[player.location] === 1
          ? centerY - playerSize / 2
          : centerY + yOffset - playerSize / 2;

      // Draw the "Z"
      ctx.fillStyle = player.color;
      ctx.strokeStyle = "black"; // Set the stroke color to black
      ctx.font = "3.5vw david bold"; // Larger font size
      ctx.lineWidth = 1; // Increased line thickness
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      // Draw the outlined text
      ctx.fillText(
        "Z",
        playerX + playerSize / 2,
        playerY + playerSize / 2 + 12
      );
      ctx.strokeText(
        "Z",
        playerX + playerSize / 2,
        playerY + playerSize / 2 + 12
      );

      // Update currentPlayer's location in local storage
      if (player.id === playerData[pla].id) {
        playerData[pla].location = tilePositions[player.location].ID; // Assuming tilePositions contains ID information
        // const savedPlayerData = JSON.parse(localStorage.getItem("playerData"));
        // if (Array.isArray(savedPlayerData)) {
        //   savedPlayerData[pla].location = playerData[pla].location;
        //   this.savePlayerDataToLocalStorage(savedPlayerData);
        // }
      }
    });
  };

  playerMovement = (playerData) => {
    const playerIndexLS = this.getPlayerIndex();
    let pla = 0;
    if (playerIndexLS === null) {
      pla = (this.state.playerIndex + 1) % this.players.length;
    } else {
      pla = playerIndexLS;
    }
    this.setState({ playerIndex: pla });
    // const tilePositions = this.getTilePositions();

    // const playerSpacing = 35; // Adjust the spacing between players
    // const playersPerSide = 2; // Number of players on each side of the square
    const canvas = this.canvasRef; // Use this.canvasRef
    const ctx = canvas.getContext("2d");
    // const rows = 8; // Define the number of rows
    // const cols = 12; // Define the number of columns

    // Create a dictionary to store the count of players on each tile
    const tilePlayerCounts = {};

    // Count the number of players on each tile
    playerData.forEach((player) => {
      tilePlayerCounts[player.location] =
        (tilePlayerCounts[player.location] || 0) + 1;
    });

    // Clear the canvas before updating player positions
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background image from the stored instance
    if (this.backgroundImage) {
      ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    this.drawTilesWithOwnershipAndFees(ctx);
    this.drawPlayer(playerData);
    // Update player positions and location in local storage
    // playerData.forEach((player, index) => {
    //   const centerX =
    //     ((tilePositions[player.location].col + 0.5) * canvas.width) / cols;
    //   const centerY =
    //     ((tilePositions[player.location].row + 0.5) * canvas.height) / rows;
    //   const sideIndex = Math.floor(index / playersPerSide);
    //   const positionInSide = index % playersPerSide;
    //   const xOffset =
    //     (positionInSide - playersPerSide / 2 + 0.5) * playerSpacing;
    //   const yOffset = (sideIndex - playersPerSide / 2 + 0.5) * playerSpacing;
    //   const playerSize = 60; // Twice the size

    //   // Calculate player position
    //   const playerX =
    //     tilePlayerCounts[player.location] === 1
    //       ? centerX - playerSize / 2
    //       : centerX + xOffset - playerSize / 2;
    //   const playerY =
    //     tilePlayerCounts[player.location] === 1
    //       ? centerY - playerSize / 2
    //       : centerY + yOffset - playerSize / 2;

    //   // Draw the "Z"
    //   ctx.fillStyle = player.color;
    //   ctx.strokeStyle = "black"; // Set the stroke color to black
    //   ctx.font = "3.5vw david bold"; // Larger font size
    //   ctx.lineWidth = 1; // Increased line thickness
    //   ctx.textBaseline = "middle";
    //   ctx.textAlign = "center";

    //   // Draw the outlined text
    //   ctx.fillText(
    //     "Z",
    //     playerX + playerSize / 2,
    //     playerY + playerSize / 2 + 12
    //   );
    //   ctx.strokeText(
    //     "Z",
    //     playerX + playerSize / 2,
    //     playerY + playerSize / 2 + 12
    //   );

    //   // Update currentPlayer's location in local storage
    //   if (player.id === playerData[pla].id) {
    //     playerData[pla].location = tilePositions[player.location].ID; // Assuming tilePositions contains ID information
    //     // const savedPlayerData = JSON.parse(localStorage.getItem("playerData"));
    //     // if (Array.isArray(savedPlayerData)) {
    //     //   savedPlayerData[pla].location = playerData[pla].location;
    //     //   this.savePlayerDataToLocalStorage(savedPlayerData);
    //     // }
    //   }
    // });

    this.savePlayerDataToLocalStorage(playerData);
  };

  findLocation = (object) => {
    for (let i = 0; i < this.world1Tiles.length; i++) {
      if (this.world1Tiles[i] === object) {
        return i; // Found the object, return its index
      }
    }
    return -1; // Object not found, return -1 or another appropriate default value
  };

  checkTile = (currentTile, playerData, pla, tilePositions) => {
    let DoubleExpanse = 1;
    let Fee;
    let Profit = 1;
    let cardDid = false;

    if (this.state.playerChoseToUseFreePass) {
      cardDid = true;
      this.removeCardAfterUse(playerData, pla, this.state.cardId, cardDid);
    }

    if (this.currentMarketState.name === "DoubleExpanse") {
      DoubleExpanse = 2;
    }
    if (this.currentMarketState.name === "1.5ProfitOnCollect") {
      Profit = 1.5;
    }

    if (
      currentTile.ID === 91 ||
      currentTile.ID === 36 ||
      currentTile.ID === 76
    ) {
      playerData[pla].currentMoney += 1000000;
      console.log(playerData[pla].name, "Received 1000000$ from the bank");
    } else if (currentTile.ID === 50) {
      playerData[pla].currentMoney += 2000000;
      console.log(playerData[pla].name, "Received 2000000$ to the bank");
    } else if (
      currentTile.ID === 55 ||
      currentTile.ID === 18 ||
      currentTile.ID === 95
    ) {
      //function does not paint
      this.drawAvailableTiles(tilePositions);
    } else if (
      currentTile.ID === 57 ||
      currentTile.ID === 26 ||
      currentTile.ID === 75
    ) {
      playerData[pla].card.push(this.getRandomCard(playerData[pla]));
    } else if (currentTile.ID === 46) {
      playerData[pla].card.push(this.getRandomCard(playerData[pla]));
      playerData[pla].card.push(this.getRandomCard(playerData[pla]));
      playerData[pla].card.push(this.getRandomCard(playerData[pla]));
    } else if (currentTile.ID === 43 || currentTile.ID === 92) {
      playerData[pla].card = this.removeRandomCard(playerData[pla]);
    } else if (
      currentTile.ID === 2 ||
      currentTile.ID === 27 ||
      currentTile.ID === 24 ||
      currentTile.ID === 74
    ) {
      this.drawAvailableTileToSell(tilePositions, playerData, pla);
    } else if (
      currentTile.ID === 72 ||
      currentTile.ID === 66 ||
      currentTile.ID === 44 ||
      currentTile.ID === 9 ||
      currentTile.ID === 17
    ) {
      let totalFees = 0;
      Object.values(tilePositions).forEach((tile) => {
        if (tile.playerID === playerData[pla].id) {
          totalFees += this.checkIfX2(tile);
        }
      });
      playerData[pla].currentMoney += totalFees * Profit;
      if (totalFees * Profit === 0) {
        console.log(
          playerData[pla].name,
          "you dont have any businesses so you dont get any money"
        );
      } else {
        console.log(
          playerData[pla].name,
          " Received ",
          totalFees * Profit,
          "$"
        );
      }
    } else if (
      currentTile.ID === 94 ||
      currentTile.ID === 84 ||
      currentTile.ID === 47 ||
      currentTile.ID === 10 ||
      currentTile.ID === 3
    ) {
      this.getRandomMarketState();
    } else if (currentTile.ID === 62) {
      if (playerData[pla].loans === 0) {
        this.setState({
          showPlayerVictoryModal: true,
        });
      } else if (
        playerData[pla].currentMoney - playerData[pla].loans * 1000000 >=
        0
      ) {
        playerData[pla].loans = 0;
        this.setState({
          showPlayerVictoryModal: true,
        });
      }
    }

    /////////////////Red Headed Tile//////////////////////////
    else if (
      (currentTile.ID === 56 && !this.state.playerChoseToUseFreePass) ||
      (currentTile.ID === 30 && !this.state.playerChoseToUseFreePass)
    ) {
      Fee = 1000000 * DoubleExpanse;
      playerData[pla].currentMoney -= Fee;
      console.log(playerData[pla].name, "Payed", Fee, "$ to the bank");
    } else if (currentTile.ID === 13 && !this.state.playerChoseToUseFreePass) {
      Fee = 2000000 * DoubleExpanse;
      playerData[pla].currentMoney -= Fee;
      console.log(playerData[pla].name, "Payed", Fee, "$ to the bank");
    } else if (
      (currentTile.ID === 78 && !this.state.playerChoseToUseFreePass) ||
      (currentTile.ID === 8 && !this.state.playerChoseToUseFreePass)
    ) {
      let totalFees = 0;

      Object.values(tilePositions).forEach((tile) => {
        if (tile.playerID === playerData[pla].id) {
          totalFees += this.checkIfX2(tile);
        }
      });
      totalFees = totalFees * DoubleExpanse;

      playerData[pla].currentMoney -= totalFees;
      if (totalFees === 0) {
        console.log(
          playerData[pla].name,
          "you dont have any businesses so you dont pay any money"
        );
      } else {
        console.log(playerData[pla].name, " payed ", totalFees, "$");
      }
    }
    this.savePlayerDataToLocalStorage(playerData);
    this.setState({ playerChoseToUseFreePass: false });
  };

  checkPlayerPermission = (
    playerData,
    pla,
    currentPlayer,
    diceRollResult,
    newLocationIndex,
    currentLocation
  ) => {
    if (playerData[pla].ifPayedIsland) {
      // Player has paid for island, move forward using island tiles
      const currentIslandIndex = this.island.findIndex(
        (tile) => tile === playerData[pla].location
      );
      newLocationIndex =
        (currentIslandIndex + diceRollResult) % this.island.length;
      playerData[pla].location = this.island[newLocationIndex];

      // Save the updated playerData back to local storage
    } else if (
      currentPlayer.ifPayedToWorld2 &&
      !currentPlayer.ifPayedToWorld3
    ) {
      // Player has paid for World 2, move forward using World 2 tiles
      const currentWorld2Index = this.world2Tiles.findIndex(
        (tile) => tile === currentPlayer.location
      );
      newLocationIndex =
        (currentWorld2Index + diceRollResult) % this.world2Tiles.length;
      playerData[pla].location = this.world2Tiles[newLocationIndex];
      if (
        currentPlayer.location === 18 &&
        !currentPlayer.ifPayedToWorld3 &&
        this.currentMarketState.name !== "ClosedGates"
      ) {
        this.setState({
          showWorld3Modal: true,
          currentPlayerToPay: playerData[pla],
        });
      }
      // Save the updated playerData back to local storage
    } else if (
      playerData[pla].ifPayedToWorld3 &&
      !currentPlayer.ifPayedIsland
    ) {
      // Player has paid for World 3, move forward using World 3 tiles
      const currentWorld3Index = this.world3Tiles.findIndex(
        (tile) => tile === playerData[pla].location
      );
      newLocationIndex =
        (currentWorld3Index + diceRollResult) % this.world3Tiles.length;
      playerData[pla].location = this.world3Tiles[newLocationIndex];

      if (
        currentPlayer.location === 27 &&
        this.currentMarketState.name !== "ClosedGates"
      ) {
        this.setState({
          showIslandModal: true,
          currentPlayerToPay: playerData[pla],
        });
      }
    } else {
      // Player hasn't paid for World 2 or 3, move forward using allowedTiles
      const newAllowedTilesIndex =
        (this.findLocation(currentLocation) + diceRollResult) %
        this.world1Tiles.length;
      playerData[pla].location = this.world1Tiles[newAllowedTilesIndex];
      if (
        playerData[pla].location === 59 &&
        this.currentMarketState.name !== "ClosedGates"
      ) {
        this.setState({
          showModal: true,
          currentPlayerToPay: playerData[pla],
        });
      }
      // Save the updated playerData back to local storage
    }
    this.savePlayerDataToLocalStorage(playerData);
  };

  checkRentPayment = (currentTile, playerData, pla, currentPlayer) => {
    if (this.state.playerChoseToUseFreePass) {
      let cardDid = true;
      this.removeCardAfterUse(playerData, pla, this.state.cardId, cardDid);
    } else {
      if (currentTile.isOccupied) {
        let rent = this.checkIfX2(currentTile);
        const owner = playerData.find(
          (player) => player.id === currentTile.playerID
        );

        if (
          this.currentMarketState.name === "OverMillionBussinessX2" &&
          currentTile.payFee >= 400000
        ) {
          rent = rent * 2;
        } else if (this.currentMarketState.name === "0.5CostAndProfit") {
          rent = 0.5 * rent;
        }

        if (owner && owner.id !== playerData[pla].id) {
          if (playerData[pla].currentMoney >= rent) {
            // Deduct rent from the current player's money
            playerData[pla].currentMoney -= rent;

            // Add rent to the owner's money
            owner.currentMoney += rent;

            // Update both players in the playerData array
            const currentPlayerIndex = playerData.findIndex(
              (player) => player.id === currentPlayer.id
            );
            if (currentPlayerIndex !== -1) {
              playerData[currentPlayerIndex] = currentPlayer;
            }

            const ownerIndex = playerData.findIndex(
              (player) => player.id === owner.id
            );
            if (ownerIndex !== -1) {
              playerData[ownerIndex] = owner;
            }
            console.log(currentPlayer.name, "paid", rent, "$ to", owner.name);
          } else {
            // Handle the case where the player can't afford to pay the rent
            // You can implement custom logic, such as the player going bankrupt
            // or selling properties, as needed.
          }
        } else if (owner && owner.id === playerData[pla].id) {
          // If the owner and the current player are the same player,
          // add the rent to the current player's money
          playerData[pla].currentMoney += rent;
          // Update the current player in the playerData array
          const currentPlayerIndex = playerData.findIndex(
            (player) => player.id === currentPlayer.id
          );
          if (currentPlayerIndex !== -1) {
            playerData[currentPlayerIndex] = playerData[pla];
          }
          console.log(currentPlayer.name, "received", rent, "$ from rent");
        }
        this.savePlayerDataToLocalStorage(playerData);
      }
    }
    this.setState({ playerChoseToUseFreePass: false });
  };

  getRandomMarketState = () => {
    let randomKey;
    do {
      const keys = Object.keys(this.marketState);
      randomKey = keys[Math.floor(Math.random() * keys.length)];
    } while (this.currentMarketState === this.marketState[randomKey]); // Check if it's the same as the current state

    this.currentMarketState = this.marketState[randomKey];
    this.saveCurrentMarketStateToLocalStorage(this.marketState[randomKey]);
  };

  //////////////////CARDS//////////////////

  checkCard = (cardName, playerDataLS, playerIndexLS, cardIdFromClick) => {
    this.setState({ cardId: cardIdFromClick });

    const tilePositions = this.getTilePositions();
    const currentPlayer = playerDataLS[playerIndexLS];
    let cardDid = false;
    if (cardName === "Gift Card") {
      playerDataLS[playerIndexLS].currentMoney += 1000000;
      console.log(
        currentPlayer.name,
        "used",
        cardName,
        "card and got 1,000,000$ from the bank"
      );
      cardDid = true;
      this.removeCardAfterUse(
        playerDataLS,
        playerIndexLS,
        cardIdFromClick,
        cardDid
      );
    } else if (cardName === "Discounted pass") {
    } else if (cardName === "Limousine") {
      this.drawAvailableTiles(tilePositions, true);
    } else if (cardName === "Real Estate Profit") {
      playerDataLS[playerIndexLS].currentMoney += 3000000;
      console.log(
        currentPlayer.name,
        "usrd",
        cardName,
        "card and got 3,000,000$ from the bank"
      );
      cardDid = true;
      this.removeCardAfterUse(
        playerDataLS,
        playerIndexLS,
        cardIdFromClick,
        cardDid
      );
    } else if (cardName === "Unusual Building Permit") {
      this.drawAvailableTiles(tilePositions);
      console.log(
        currentPlayer.name,
        "usrd",
        cardName,
        "card and built a business"
      );
    } else if (cardName === "Realization of assets") {
      this.drawAvailableTileToSell(tilePositions, playerDataLS, playerIndexLS);
      playerDataLS[playerIndexLS].currentMoney += 500000;
      console.log(
        currentPlayer.name,
        "used",
        cardName,
        "card and sold a business"
      );
    } else if (cardName === "Collecting Profits") {
      let highestProfit = this.collectionProfitsCard(
        playerDataLS,
        playerIndexLS
      );
      playerDataLS[playerIndexLS].currentMoney += highestProfit;
      console.log(
        currentPlayer.name,
        "used",
        cardName,
        "to collect",
        highestProfit,
        "$"
      );
      cardDid = true;
      this.removeCardAfterUse(
        playerDataLS,
        playerIndexLS,
        cardIdFromClick,
        cardDid
      );
    } else if (cardName === "Bonus") {
      let highestProfit = this.calculateHighestProfit(
        playerDataLS,
        playerIndexLS
      );
      if (highestProfit > 0) {
        playerDataLS[playerIndexLS].currentMoney += highestProfit;
        console.log(
          currentPlayer.name,
          "used",
          cardName,
          "to collect",
          highestProfit,
          "$"
        );
        cardDid = true;
        this.removeCardAfterUse(
          playerDataLS,
          playerIndexLS,
          cardIdFromClick,
          cardDid
        );
      } else {
        console.log(
          currentPlayer.name,
          "you dont have any business to collect profit from"
        );
      }
    } else if (cardName === "Stock Options") {
      this.setState({ usedCardName: cardName });
      this.setState({ showBuyStocksModal: true });
    } else if (cardName === "Stock Market") {
      this.setState({ usedCardName: cardName });
      this.setState({ showStockCardModal: true });
    } else if (cardName === "Red header exemption") {
    }

    this.setState({ showPlayerCardsModal: false });
    this.savePlayerDataToLocalStorage(playerDataLS);
  };

  removeCardAfterUse = (playerDataLS, playerIndexLS, cardId, cardDid) => {
    const cardIndex = playerDataLS[playerIndexLS].card.findIndex(
      (card) => card.id === cardId
    );
    if (cardDid) {
      if (cardIndex !== -1) {
        playerDataLS[playerIndexLS].card.splice(cardIndex, 1);
        console.log("Card removed from the player's deck.");
      }
    }
    this.savePlayerDataToLocalStorage(playerDataLS);
  };

  ///////////////////Free Pass Card/////////////////////////

  checkIfWantToUseFreePass = (currentTile, playerData, pla, currentPlayer) => {
    if (currentTile.isOccupied) {
      const owner = playerData.find(
        (player) => player.id === currentTile.playerID
      );
      if (owner && owner.id !== playerData[pla].id) {
        const hasFreePass = currentPlayer.card.some(
          (card) => card.name === "Free Pass"
        );
        const cardIdFrom = currentPlayer.card.find(
          (card) => card.name === "Free Pass"
        );
        if (hasFreePass) {
          this.setState({ showPlayerFreePassModal: true });
          this.setState({ cardId: cardIdFrom.id });
        } else {
          this.checkRentPayment(currentTile, playerData, pla, currentPlayer);
        }
      } else {
        this.checkRentPayment(currentTile, playerData, pla, currentPlayer);
      }
    }
  };

  handleFreePass = () => {
    const pla = this.getPlayerIndex();
    const tilePositions = this.getTilePositions();
    const playerData = this.getPlayerData();
    const currentPlayer = playerData[pla];
    const currentTile = tilePositions[playerData[pla].location];
    this.setState({ playerChoseToUseFreePass: true }, () => {
      // Callback function: This will be executed once the state is updated
      this.checkRentPayment(currentTile, playerData, pla, currentPlayer);
    });
    this.setState({ showPlayerFreePassModal: false });
  };

  handleNotFreePass = () => {
    const pla = this.getPlayerIndex();
    const tilePositions = this.getTilePositions();
    const playerData = this.getPlayerData();
    const currentPlayer = playerData[pla];
    const currentTile = tilePositions[playerData[pla].location];
    this.setState({ playerChoseToUseFreePass: false }, () => {
      // Callback function: This will be executed once the state is updated
      this.checkRentPayment(currentTile, playerData, pla, currentPlayer);
    });
    this.setState({ showPlayerFreePassModal: false });
  };

  ///////////////////Red Headed Card/////////////////////////

  checkIfWantToUseRedHeaded = (currentTile, playerData) => {
    const desiredTileIDs = [56, 30, 13, 78, 8];
    const pla = this.getPlayerIndex();
    const tilePositions = this.getTilePositions();

    if (desiredTileIDs.includes(currentTile.ID)) {
      // Check if the player has the "Red header exemption" card
      const hasFreePass = playerData[pla].card.some(
        (card) => card.name === "Red header exemption"
      );
      if (hasFreePass) {
        const cardIdFrom = playerData[pla].card.find(
          (card) => card.name === "Red header exemption"
        ).id;
        this.setState({ showPlayerRedHeadedModal: true, cardId: cardIdFrom });
      } else {
        // Perform other actions when the player doesn't have the card
        // For example:
        this.checkTile(currentTile, playerData, pla, tilePositions);
      }
    } else {
      this.checkTile(currentTile, playerData, pla, tilePositions);
    }
  };

  handleRedHeaded = () => {
    const pla = this.getPlayerIndex();
    const tilePositions = this.getTilePositions();
    const playerData = this.getPlayerData();
    const currentTile = tilePositions[playerData[pla].location];
    this.setState({ playerChoseToUseFreePass: true }, () => {
      // Callback function: This will be executed once the state is updated
      this.checkTile(currentTile, playerData, pla, tilePositions);
    });
    this.setState({ showPlayerRedHeadedModal: false });
  };

  handleNotRedHeaded = () => {
    const pla = this.getPlayerIndex();
    const tilePositions = this.getTilePositions();
    const playerData = this.getPlayerData();
    const currentTile = tilePositions[playerData[pla].location];
    this.setState({ playerChoseToUseFreePass: false }, () => {
      // Callback function: This will be executed once the state is updated
      this.checkTile(currentTile, playerData, pla, tilePositions);
    });
    this.setState({ showPlayerRedHeadedModal: false });
  };

  ///////////////////////////////////////////////////////////////////////

  togglePlayerCardsModal = () => {
    this.setState((prevState) => ({
      showPlayerCardsModal: !prevState.showPlayerCardsModal,
    }));
  };

  getRandomCard = (currentPlayer) => {
    let limousineAvailable = this.getIfLimousine();

    // Get available card IDs based on the highest card ID (35 in this case)
    const availableCardIds = Object.keys(this.actionCards).filter(
      (key) => parseInt(key) >= 1 && parseInt(key) <= 35
    );

    const randomKey =
      availableCardIds[Math.floor(Math.random() * availableCardIds.length)];

    if (
      this.actionCards[randomKey].name === "Limousine" &&
      limousineAvailable !== true
    ) {
      limousineAvailable = true;
      this.storeIfLimousine(limousineAvailable);
      console.log(currentPlayer.name, "received a card.");
      return this.actionCards[randomKey];
    } else if (
      this.actionCards[randomKey].name === "Limousine" &&
      limousineAvailable === true
    ) {
      return this.getRandomCard();
    } else {
      console.log(currentPlayer.name, "received a card.");
      return this.actionCards[randomKey];
    }
  };

  limousineCard = () => {
    const playerIndexLS = this.getPlayerIndex();
    const playerDataLS = this.getPlayerData();
    const currentPlayer = playerDataLS[playerIndexLS];
    let tileNumber = this.state.selectedTile;
    let cardDid = false;
    if (this.world1Tiles.includes(tileNumber)) {
      currentPlayer.location = tileNumber;
      cardDid = true;
    } else if (
      this.world2Tiles.includes(tileNumber) &&
      currentPlayer.ifPayedToWorld2
    ) {
      currentPlayer.location = tileNumber;
      cardDid = true;
    } else if (
      this.world2Tiles.includes(tileNumber) &&
      !currentPlayer.ifPayedToWorld2 &&
      currentPlayer.currentMoney - 2000000 >= 0
    ) {
      currentPlayer.location = tileNumber;
      currentPlayer.currentMoney -= 2000000;
      currentPlayer.ifPayedToWorld2 = true;
      cardDid = true;
    } else if (
      this.world3Tiles.includes(tileNumber) &&
      currentPlayer.ifPayedToWorld3 &&
      currentPlayer.ifPayedToWorld2
    ) {
      currentPlayer.location = tileNumber;
      cardDid = true;
    } else if (
      this.world3Tiles.includes(tileNumber) &&
      !currentPlayer.ifPayedToWorld3 &&
      !currentPlayer.ifPayedToWorld2 &&
      currentPlayer.currentMoney - 5000000 >= 0
    ) {
      currentPlayer.currentMoney -= 5000000;
      currentPlayer.location = tileNumber;
      currentPlayer.ifPayedToWorld2 = true;
      currentPlayer.ifPayedToWorld3 = true;
      cardDid = true;
    } else {
      console.log(
        "You cant go to this tile without pay the transport Fee, You dont have enough money to pay"
      );
    }

    this.removeCardAfterUse(
      playerDataLS,
      playerIndexLS,
      this.state.cardId,
      cardDid
    );
    if (cardDid) {
      let limousineAvailable = false;
      this.storeIfLimousine(limousineAvailable);
      if (currentPlayer.location === 27) {
        this.setState({
          showIslandModal: true,
          currentPlayerToPay: playerDataLS[playerIndexLS],
        });
      }
    }
    this.savePlayerDataToLocalStorage(playerDataLS);
    this.setState({ showPlayerLimousineModal: false });
  };

  removeRandomCard = (currentPlayer) => {
    const playerCards = currentPlayer.card;
    if (playerCards.length === 0) {
      console.log(currentPlayer.name, "has no cards to throw.");
      return playerCards;
    } else {
      const randomIndex = Math.floor(Math.random() * playerCards.length);
      playerCards.splice(randomIndex, 1);
      console.log(currentPlayer.name, "thrown a card.");
      return playerCards;
    }
  };

  collectionProfitsCard = (playerDataLS, playerIndexLS) => {
    let highestProfit = 0;
    playerDataLS.forEach((player, index) => {
      if (index !== playerIndexLS) {
        const totalProfit = this.calculateTotalProfit(player);

        if (totalProfit > highestProfit) {
          highestProfit = totalProfit;
        }
      }
    });
    return highestProfit;
  };

  calculateHighestProfit = (playerDataLS, playerIndexLS) => {
    const tilePositions = this.getTilePositions();
    let highestProfit = 0;

    Object.values(tilePositions).forEach((tile) => {
      if (tile.playerID === playerDataLS[playerIndexLS].id) {
        if (highestProfit <= this.checkIfX2(tile)) {
          highestProfit = this.checkIfX2(tile);
        }
      }
    });
    if (highestProfit === 0) {
      console.log(
        playerDataLS[playerIndexLS].name,
        "you dont have any businesses"
      );
    }
    return highestProfit;
  };

  calculateTotalProfit = (playerData) => {
    const tilePositions = this.getTilePositions();
    let totalProfit = 0;

    Object.values(tilePositions).forEach((tile) => {
      if (tile.playerID === playerData.id) {
        totalProfit += this.checkIfX2(tile);
      }
    });

    return totalProfit;
  };
  ////////////////////Handle The Gates Payment///////////////////////

  handlePay = () => {
    const playerDataLS = this.getPlayerData();
    const playerIndexLS = this.getPlayerIndex();
    const currentPlayer = playerDataLS[playerIndexLS];
    // Define the payment amounts for different tiles
    let paymentAmount = 0;

    if (
      currentPlayer.location === 59 &&
      this.currentMarketState.name !== "ClosedGates"
    ) {
      if (this.currentMarketState.name === "PassingX2") {
        paymentAmount = 2000000 * 2;
      } else if (this.currentMarketState.name === "CheapGate-1M") {
        paymentAmount = 2000000 - 1000000;
      } else {
        paymentAmount = 2000000;
      }
      const cardIndex = playerDataLS[playerIndexLS].card.findIndex(
        (card) => card.name === "Discounted pass"
      );
      if (cardIndex != -1) {
        paymentAmount -= 2000000;
        this.removeCardAfterUse(
          playerDataLS,
          playerIndexLS,
          playerDataLS[playerIndexLS].card[cardIndex].id,
          true
        );
      }
    }
    if (paymentAmount < 0) {
      paymentAmount = 0;
    }
    if (currentPlayer.currentMoney >= paymentAmount) {
      currentPlayer.currentMoney -= paymentAmount;
      currentPlayer.ifPayedToWorld2 = true;
      const updatedPlayers = playerDataLS.map((player) =>
        player.id === currentPlayer.id ? currentPlayer : player
      );
      console.log(
        playerDataLS[playerIndexLS].name,
        "payed",
        paymentAmount,
        "to move to the next world"
      );
      this.savePlayerDataToLocalStorage(updatedPlayers);

      // Close the modal
      this.setState({ showModal: false });
    } else {
      this.setState({ showModal: false });
    }
  };

  handleNotPay = () => {
    // Close the modal
    this.setState({ showModal: false });

    this.props.players.forEach((player) => {
      player.hasLanded = false;
    });
  };

  handlePayWorld3 = () => {
    const playerDataLS = this.getPlayerData();
    const playerIndexLS = this.getPlayerIndex();
    const currentPlayer = playerDataLS[playerIndexLS];

    // Define the payment amounts for different tiles
    let paymentAmount = 0;

    // Check the player's location and set the payment amount accordingly
    if (
      currentPlayer.location === 18 &&
      this.currentMarketState.name !== "ClosedGates"
    ) {
      if (this.currentMarketState.name === "PassingX2") {
        paymentAmount = 3000000 * 2;
      } else if (this.currentMarketState.name === "CheapGate-1M") {
        paymentAmount = 3000000 - 1000000;
      } else {
        paymentAmount = 3000000;
      }
    }

    if (paymentAmount > 0 && currentPlayer.currentMoney >= paymentAmount) {
      playerDataLS[playerIndexLS].currentMoney -= paymentAmount;
      playerDataLS[playerIndexLS].ifPayedToWorld3 = true; // Update this based on the world logic
      console.log(
        playerDataLS[playerIndexLS].name,
        "payed",
        paymentAmount,
        "to move to next world"
      );
      this.savePlayerDataToLocalStorage(playerDataLS);
      // Close the modal
      this.setState({ showWorld3Modal: false });
    } else {
      this.setState({ showWorld3Modal: false });
    }
  };

  handleNotPayWorld3 = () => {
    // Close the modal
    this.setState({ showWorld3Modal: false });

    this.props.players.forEach((player) => {
      player.hasLanded = false;
    });
  };

  handlePayIsland = () => {
    const playerDataLS = this.getPlayerData();
    const playerIndexLS = this.getPlayerIndex();
    const currentPlayer = playerDataLS[playerIndexLS];

    // Define the payment amounts for different tiles
    let paymentAmount = 0;

    // Check the player's location and set the payment amount accordingly
    if (
      currentPlayer.location === 27 &&
      this.currentMarketState.name !== "ClosedGates"
    ) {
      if (this.currentMarketState.name === "PassingX2") {
        paymentAmount = 5000000 * 2;
      } else if (this.currentMarketState.name === "CheapGate-1M") {
        paymentAmount = 5000000 - 1000000;
      } else {
        paymentAmount = 5000000;
      }
    }

    if (paymentAmount > 0 && currentPlayer.currentMoney >= paymentAmount) {
      playerDataLS[playerIndexLS].currentMoney -= paymentAmount;
      playerDataLS[playerIndexLS].ifPayedIsland = true;
      console.log(
        playerDataLS[playerIndexLS].name,
        "payed",
        paymentAmount,
        "to move to next world"
      );
      this.savePlayerDataToLocalStorage(playerDataLS);
      // Close the modal
      this.setState({ showIslandModal: false });
    } else {
      this.setState({ showIslandModal: false });
    }
  };

  handleNotPayIsland = () => {
    // Close the modal
    this.setState({ showIslandModal: false });

    this.props.players.forEach((player) => {
      player.hasLanded = false;
    });
  };

  //////////////////Sell Business on speacial tile//////////////////////////////

  drawAvailableTileToSell = (tilePositions, playerDataLS, playerIndexLS) => {
    const canvas = this.canvasRef;
    const rows = 8;
    const cols = 12;
    const tileWidth = canvas.width / cols;
    const tileHeight = canvas.height / rows;
    const ctx = canvas.getContext("2d");
    const currentPlayer = playerDataLS[playerIndexLS];
    const availableTiles = [];

    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.font = "25px Arial black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * tileWidth;
        const y = row * tileHeight;
        const tileNumber = col + row * cols + 1;

        Object.values(tilePositions).forEach((tile) => {
          if (tile.ID === tileNumber && tile.playerID === currentPlayer.id) {
            if (
              tile.ID !== 96 &&
              tile.ID !== 59 &&
              tile.ID !== 18 &&
              tile.ID !== 27 &&
              tile.ID !== 51 &&
              tile.ID !== 52 &&
              tile.ID !== 64 &&
              tile.ID !== 76 &&
              tile.ID !== 75 &&
              tile.ID !== 74 &&
              tile.ID !== 62 &&
              tile.ID !== 50
            ) {
              availableTiles.push(tileNumber);
              ctx.fillText(
                tileNumber.toString(),
                x + tileWidth / 2,
                y + tileHeight / 2
              );
            }
          }
        });
      }
    }
    if (!availableTiles) {
      this.setState({
        showSellBusinessModal: true,
        availableTiles: availableTiles,
      });
    } else {
      console.log("You dont have any business to sell");
    }
    this.drawBoard(false);
  };

  handleSellBusiness = () => {
    const playerIndexLS = this.getPlayerIndex();
    const playerDataLS = this.getPlayerData();
    let tilePositions = this.getTilePositions();
    let selectedTile = this.state.selectedTile;
    let price = 0;
    let cardDid = false;
    if (tilePositions[selectedTile].payFee === 200000) {
      price = 400000;
      playerDataLS[playerIndexLS].level1Business -= 1;
    } else if (tilePositions[selectedTile].payFee === 400000) {
      price = 1000000;
      playerDataLS[playerIndexLS].level2Business -= 1;
    } else if (tilePositions[selectedTile].payFee === 600000) {
      price = 2000000;
      playerDataLS[playerIndexLS].level3Business -= 1;
    } else if (tilePositions[selectedTile].payFee === 800000) {
      price = 3000000;
      playerDataLS[playerIndexLS].level4Business -= 1;
    }
    playerDataLS[playerIndexLS].currentMoney += price;
    tilePositions[selectedTile].isOccupied = false;
    tilePositions[selectedTile].playerID = null;
    tilePositions[selectedTile].payFee = null;
    cardDid = true;
    // Save the updated tile positions and player data back to local storage
    this.removeCardAfterUse(
      playerDataLS,
      playerIndexLS,
      this.state.cardId,
      cardDid
    );
    this.saveTilePositionsToLocalStorage(tilePositions);
    this.savePlayerDataToLocalStorage(playerDataLS);

    // Close the modal after buying
    this.setState({ showSellBusinessModal: false });

    console.log(playerDataLS[playerIndexLS].name, "sold a business for", price);

    this.players.forEach((player) => {
      player.hasLanded = false;
    });
    this.setState({ selectedTile: "" });
  };

  //////////////////Buy Business on speacial tile//////////////////////////////

  drawAvailableTiles = (tilePositions, drawAll = false) => {
    const canvas = this.canvasRef;
    const rows = 8;
    const cols = 12;
    const tileWidth = canvas.width / cols;
    const tileHeight = canvas.height / rows;
    const ctx = canvas.getContext("2d");
    const currentPlayer = this.getPlayerData()[this.getPlayerIndex()];
    const availableTiles = [];

    ctx.lineWidth = 2;
    ctx.strokeStyle = "green";
    ctx.font = "18px Arial green";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "green";

    const paidWorlds = {
      world1: true, // Assuming world1 is accessible to all
      world2: currentPlayer.ifPayedToWorld2,
      world3: currentPlayer.ifPayedToWorld3,
    };

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * tileWidth;
        const y = row * tileHeight;
        const tileNumber = col + row * cols + 1;

        Object.values(tilePositions).forEach((tile) => {
          if (
            tile.ID === tileNumber &&
            (((this.world1Tiles.includes(tileNumber) ||
              this.world2Tiles.includes(tileNumber) ||
              this.world3Tiles.includes(tileNumber)) &&
              drawAll) ||
              (!tile.isOccupied &&
                tile.ID !== 96 &&
                tile.ID !== 59 &&
                tile.ID !== 18 &&
                tile.ID !== 27 &&
                tile.ID !== 51 &&
                tile.ID !== 52 &&
                tile.ID !== 64 &&
                tile.ID !== 76 &&
                tile.ID !== 75 &&
                tile.ID !== 74 &&
                tile.ID !== 62 &&
                tile.ID !== 50 &&
                ((paidWorlds.world1 && this.world1Tiles.includes(tileNumber)) ||
                  (paidWorlds.world2 &&
                    this.world2Tiles.includes(tileNumber)) ||
                  (paidWorlds.world3 &&
                    this.world3Tiles.includes(tileNumber)))))
          ) {
            availableTiles.push(tileNumber);
            ctx.fillText(
              tileNumber.toString(),
              x + tileWidth / 2,
              y + tileHeight / 2
            );
          }
        });
      }
    }
    if (!drawAll) {
      this.setState({
        showBuyBusinessModalWhereAvailble: true,
        availableTiles: availableTiles,
      });
    } else {
      this.setState({
        showPlayerLimousineModal: true,
        availableTiles: availableTiles,
      });
    }
  };

  handleTileSelectChange = (event) => {
    this.setState({ selectedTile: parseInt(event.target.value, 10) });
  };

  handleBuyBusinessSpecialTile = () => {
    const playerIndexLS = this.getPlayerIndex();
    const playerDataLS = this.getPlayerData();
    const currentPlayer = playerDataLS[playerIndexLS];
    const tilePositions = this.getTilePositions();

    let cost,
      whenLanded,
      canBuy,
      cardDid = false;
    const selectedTile = this.state.selectedTile; // Retrieve the selected tile from the state
    // Parse tilePositions into an object
    const currentTile = tilePositions[selectedTile];
    const selectedBusiness = this.state.selectedBusinessOption;

    // Check the selected business option and set the cost and fee accordingly
    if (selectedBusiness === "business1" && currentPlayer.level1Business < 2) {
      cost = 400000;
      whenLanded = 200000;
      canBuy = true;
      playerDataLS[playerIndexLS].level1Business += 1;
    } else if (
      selectedBusiness === "business2" &&
      currentPlayer.level2Business < 2
    ) {
      cost = 1000000;
      whenLanded = 400000;
      canBuy = true;
      playerDataLS[playerIndexLS].level2Business += 1;
    } else if (
      selectedBusiness === "business3" &&
      currentPlayer.level3Business < 2
    ) {
      cost = 2000000;
      whenLanded = 600000;
      canBuy = true;
      playerDataLS[playerIndexLS].level3Business += 1;
    } else if (
      selectedBusiness === "business4" &&
      currentPlayer.level4Business < 2
    ) {
      cost = 3000000;
      whenLanded = 800000;
      canBuy = true;
      playerDataLS[playerIndexLS].level4Business += 1;
    }

    if (this.currentMarketState.name === "0.5CostAndProfit") {
      cost = cost * 0.5;
    }

    // Check if the player has enough money to buy the business and the selected tile is valid
    if (currentPlayer.currentMoney >= cost && canBuy === true && currentTile) {
      playerDataLS[playerIndexLS].currentMoney -= cost;
      tilePositions[selectedTile].isOccupied = true;
      tilePositions[selectedTile].playerID = currentPlayer.id;
      tilePositions[selectedTile].payFee = whenLanded;

      cardDid = true;
      this.removeCardAfterUse(
        playerDataLS,
        playerIndexLS,
        this.state.cardId,
        cardDid
      );
      // Log the purchase details
      console.log(
        playerDataLS[playerIndexLS].name,
        "bought",
        selectedBusiness,
        "in",
        cost,
        "The Pay Fee is:",
        currentTile.payFee
      );

      // Reset selected business option to "business1"
      this.setState({
        selectedBusinessOption: "business1",
      });

      // Save the updated tile positions and player data back to local storage
      this.saveTilePositionsToLocalStorage(tilePositions);
      this.savePlayerDataToLocalStorage(playerDataLS);

      // Close the modal after buying
      this.setState({ showBuyBusinessModalWhereAvailble: false });
    } else {
      console.log(
        playerDataLS[playerIndexLS].name,
        "you can't buy this business; you don't have enough money or the selected tile is invalid."
      );
    }

    this.players.forEach((player) => {
      player.hasLanded = false;
    });
    this.drawBoard(false);
  };

  /////////////////////////Buy Business /////////////////////////////////

  checkIfX2 = (currentTile) => {
    if (currentTile.ID === 58 || currentTile.ID === 45) {
      const amount = currentTile.payFee * 2;
      return amount;
    } else {
      return currentTile.payFee;
    }
  };

  handleBuyBusiness = () => {
    const playerIndexLS = this.getPlayerIndex();
    const playerDataLS = this.getPlayerData();
    const currentPlayer = playerDataLS[playerIndexLS];
    const tilePositions = this.getTilePositions();
    // Parse tilePositions into an object
    const currentTile = tilePositions[this.state.currentTileToBuyBusiness];
    const selectedBusiness = this.state.selectedBusinessOption;

    // Check the selected business option and set the cost and fee accordingly
    let cost, whenLanded, canBuy;
    if (selectedBusiness === "business1" && currentPlayer.level1Business < 2) {
      cost = 400000;
      whenLanded = 200000;
      canBuy = true;
      playerDataLS[playerIndexLS].level1Business += 1;
    } else if (
      selectedBusiness === "business2" &&
      currentPlayer.level2Business < 2
    ) {
      cost = 1000000;
      whenLanded = 400000;
      canBuy = true;
      playerDataLS[playerIndexLS].level2Business += 1;
    } else if (
      selectedBusiness === "business3" &&
      currentPlayer.level3Business < 2
    ) {
      cost = 2000000;
      whenLanded = 600000;
      canBuy = true;
      playerDataLS[playerIndexLS].level3Business += 1;
    } else if (
      selectedBusiness === "business4" &&
      currentPlayer.level4Business < 2
    ) {
      cost = 3000000;
      whenLanded = 800000;
      canBuy = true;
      playerDataLS[playerIndexLS].level4Business += 1;
    }
    if (this.currentMarketState.name === "0.5CostAndProfit") {
      cost = cost * 0.5;
    }
    // Check if the player has enough money to buy the business
    if (currentPlayer.currentMoney >= cost && canBuy === true) {
      playerDataLS[playerIndexLS].currentMoney -= cost;
      tilePositions[currentPlayer.location].isOccupied = true;
      tilePositions[currentPlayer.location].playerID = currentPlayer.id;
      tilePositions[currentPlayer.location].payFee = whenLanded;
      console.log(
        playerDataLS[playerIndexLS].name,
        "bought",
        selectedBusiness,
        "in",
        cost,
        "The Pay Fee is:",
        currentTile.payFee
      );
      canBuy = false;
      this.setState({
        selectedBusinessOption: "business1",
      });

      // Save the updated tile positions and player data back to local storage
      this.saveTilePositionsToLocalStorage(tilePositions);
      this.savePlayerDataToLocalStorage(playerDataLS);

      // Close the modal after buying
      this.setState({ showBuyBusinessModal: false });
    } else {
      console.log(
        playerDataLS[playerIndexLS].name,
        "you cant buy this buissness dont have enough money"
      );
    }

    this.players.forEach((player) => {
      player.hasLanded = false;
    });
    this.drawBoard(false);
  };

  handleNotBuyBusiness = () => {
    this.setState({ showBuyBusinessModal: false });
    this.props.players.forEach((player) => {
      player.hasLanded = false;
    });
  };

  handleBusinessOptionChange = (event) => {
    this.setState({
      selectedBusinessOption: event.target.value,
    });
  };

  togglePlayerBuyModal = () => {
    const tilePositions = this.getTilePositions();
    const playerIndexLS = this.getPlayerIndex();
    const playerDataLS = this.getPlayerData();
    const currentPlayer = playerDataLS[playerIndexLS];
    const currentTile = tilePositions[currentPlayer.location];

    if (
      !currentTile.isOccupied && // Check if the tile is not already occupied
      currentPlayer.location !== 18 &&
      currentPlayer.location !== 59 &&
      currentPlayer.location !== 27 &&
      currentPlayer.location !== 96 &&
      currentTile.playerID === null
    ) {
      this.setState((prevState) => ({
        showBuyBusinessModal: !prevState.showBuyBusinessModal,
        currentTileToBuyBusiness: currentPlayer.location,
      }));
    }
  };

  ////////////////////Buy stocks///////////////////////
  togglePlayerBuyStockModal = () => {
    const playerIndexLS = this.getPlayerIndex();
    const playerDataLS = this.getPlayerData();
    const currentPlayer = playerDataLS[playerIndexLS];
    if ([93, 59, 11, 7, 28, 51].includes(currentPlayer.location)) {
      this.setState((prevState) => ({
        showBuyStocksModal: !prevState.showBuyStocksModal,
        selectedStocks: 1,
      }));
    }
  };

  handleStockSelection = (count) => {
    const selectedStocks = this.state.selectedStocks + count;
    if (selectedStocks >= 1 && selectedStocks <= 2) {
      this.setState({ selectedStocks });
    }
  };

  handleStockSelectionForCard = (count) => {
    const selectedStocks = this.state.selectedStocks + count;
    if (selectedStocks >= 1 && selectedStocks <= 3) {
      this.setState({ selectedStocks });
    }
  };

  handleBuyStock = () => {
    const selectedStocks = this.state.selectedStocks;
    const playerIndexLS = this.getPlayerIndex();
    const playerDataLS = this.getPlayerData();
    const currentPlayer = playerDataLS[playerIndexLS];
    let cardDid = false;
    let specialPrice = 1;
    if (this.state.usedCardName === "Stock Options") {
      specialPrice = 0.5;
    }
    if (selectedStocks > 0) {
      if (
        currentPlayer.currentMoney -
          selectedStocks * this.currentMarketState.stockPrice >=
        0
      ) {
        playerDataLS[playerIndexLS].currentMoney -=
          selectedStocks * this.currentMarketState.stockPrice * specialPrice;
        playerDataLS[playerIndexLS].stocks += selectedStocks;
        cardDid = true;
        this.removeCardAfterUse(
          playerDataLS,
          playerIndexLS,
          this.state.cardId,
          cardDid
        );
        this.savePlayerDataToLocalStorage(playerDataLS);
        this.setState({
          showBuyStocksModal: false,
          showStockCardModal: false,
        });
        console.log(currentPlayer.name, "bought", selectedStocks, "Stocks");
      } else {
        console.log(currentPlayer.name, "you dont have enough money");
      }
    } else {
      // Provide feedback or prevent the user from attempting to purchase more than 2 stocks
      console.log("Please select between 1 to 2 stocks.");
    }
  };

  ////////////////////Sell stocks///////////////////////
  handleSellStock = () => {
    const selectedStocks = this.state.selectedStocks;
    const playerIndexLS = this.getPlayerIndex();
    const playerDataLS = this.getPlayerData();
    const currentPlayer = playerDataLS[playerIndexLS];
    let cardDid;
    if (selectedStocks > 0) {
      if (playerDataLS[playerIndexLS].stocks < selectedStocks) {
        console.log("You cant sell more stocks then you have");
      } else {
        playerDataLS[playerIndexLS].currentMoney +=
          selectedStocks * this.currentMarketState.stockPrice;
        playerDataLS[playerIndexLS].stocks -= selectedStocks;
        cardDid = true;
        this.removeCardAfterUse(
          playerDataLS,
          playerIndexLS,
          this.state.cardId,
          cardDid
        );
        this.savePlayerDataToLocalStorage(playerDataLS);
        this.setState({
          showSellStocksModal: false,
          showStockCardModal: false,
        });
        console.log(currentPlayer.name, "sold", selectedStocks, "Stocks");
      }
    } else {
      // Provide feedback or prevent the user from attempting to purchase more than 2 stocks
      console.log("Please select between 1 to 2 stocks.");
    }
  };

  togglePlayerSellStockModal = () => {
    const playerIndexLS = this.getPlayerIndex();
    const playerDataLS = this.getPlayerData();
    const currentPlayer = playerDataLS[playerIndexLS];
    if ([93, 59, 11, 7, 28, 51].includes(currentPlayer.location)) {
      this.setState((prevState) => ({
        showSellStocksModal: !prevState.showSellStocksModal,
        selectedStocks: 1,
      }));
    }
  };

  ///////////////////////Taking a Loan////////////////////////////
  togglePlayerTakeLoanModal = () => {
    this.setState((prevState) => ({
      showTakeLoanModal: !prevState.showTakeLoanModal,
    }));
  };

  handleTakeLoan = () => {
    const playerIndexLS = this.getPlayerIndex();
    const playerDataLS = this.getPlayerData();
    if (
      playerDataLS[playerIndexLS].currentMoney >= 100000 &&
      playerDataLS[playerIndexLS].loans <= 3 &&
      playerDataLS[playerIndexLS].ifPayedToWorld3
    ) {
      playerDataLS[playerIndexLS].currentMoney += 900000;
      playerDataLS[playerIndexLS].loans += 1;
      console.log(playerDataLS[playerIndexLS].name, "took a loan");
    } else if (
      playerDataLS[playerIndexLS].currentMoney >= 100000 &&
      playerDataLS[playerIndexLS].loans <= 2 &&
      playerDataLS[playerIndexLS].ifPayedToWorld2
    ) {
      playerDataLS[playerIndexLS].currentMoney += 900000;
      playerDataLS[playerIndexLS].loans += 1;
      console.log(playerDataLS[playerIndexLS].name, "took a loan");
    } else if (
      playerDataLS[playerIndexLS].currentMoney >= 100000 &&
      playerDataLS[playerIndexLS].loans <= 1
    ) {
      playerDataLS[playerIndexLS].currentMoney += 900000;
      playerDataLS[playerIndexLS].loans += 1;

      console.log(playerDataLS[playerIndexLS].name, "took a loan");
    } else {
      console.log(
        playerDataLS[playerIndexLS].name,
        "you cant take anymore loans"
      );
    }
    this.setState({
      showTakeLoanModal: false,
    });

    this.savePlayerDataToLocalStorage(playerDataLS);
  };
  ////////////////////////Returning a Loan//////////////////////////////
  togglePlayerReturnLoanModal = () => {
    this.setState((prevState) => ({
      showReturnLoanModal: !prevState.showReturnLoanModal,
    }));
  };

  handleReturnLoan = () => {
    const playerIndexLS = this.getPlayerIndex();
    const playerDataLS = this.getPlayerData();
    if (
      playerDataLS[playerIndexLS].currentMoney >= 1000000 &&
      playerDataLS[playerIndexLS].loans !== 0
    ) {
      playerDataLS[playerIndexLS].currentMoney -= 1000000;
      playerDataLS[playerIndexLS].loans -= 1;
      console.log(playerDataLS[playerIndexLS].name, "returned a loan");
      this.setState({
        showReturnLoanModal: false,
      });
      this.savePlayerDataToLocalStorage(playerDataLS);
    } else {
      console.log(
        playerDataLS[playerIndexLS].name,
        "you dont have loans or enough money to return the loan"
      );
    }
  };

  //////////////////////Information///////////////////////////////
  togglePlayerInfoModal = () => {
    this.setState((prevState) => ({
      showPlayerInfoModal: !prevState.showPlayerInfoModal,
    }));
  };

  render() {
    const playerIndexLS = this.getPlayerIndex();
    const playerDataLS = this.getPlayerData();
    const currentPlayer = playerDataLS[playerIndexLS];
    const currentMarketState = this.getCurrentMarketStateToLocalStorage();

    return (
      <div className="board-container">
        <canvas ref={(canvas) => (this.canvasRef = canvas)} />
        <div className="dice-container">
          <button className="dice-button" onClick={this.handleRollDice}>
            <div className="dice">
              {this.state.firstTurn === true ? (
                <img
                  src="/img/dice.png"
                  style={{ width: "50px", height: "50px" }}
                  alt="Dice"
                />
              ) : (
                <div className={`dice-number`}>{currentPlayer.diceResult}</div>
              )}
            </div>
          </button>
        </div>

        <div className="button-board-container">
          {/* Button to open the player information modal */}
          <button className="info-button" onClick={this.togglePlayerInfoModal}>
            Information
          </button>

          {/* Button to open the player Buy modal */}
          <button className="buy-button" onClick={this.togglePlayerBuyModal}>
            Buy Buissness
          </button>

          {/* Button to open the player Buy Stock modal */}
          <button
            className="buy-stock-button"
            onClick={this.togglePlayerBuyStockModal}
          >
            Buy Stock
          </button>

          {/* Button to open the player Buy Stock modal */}
          <button
            className="sell-stock-button"
            onClick={this.togglePlayerSellStockModal}
          >
            Sell Stock
          </button>

          {/* Button to open the player Return Loan modal */}
          <button
            className="take-loan-button"
            onClick={this.togglePlayerReturnLoanModal}
          >
            Return Loan
          </button>

          {/* Button to open the player Take Loan modal */}
          <button
            className="take-loan-button"
            onClick={this.togglePlayerTakeLoanModal}
          >
            Take Loan
          </button>

          {/* Button to open the player Return Loan modal */}
          <button className="info-button" onClick={this.togglePlayerCardsModal}>
            Cards
          </button>
        </div>
        <div className="marketState">
          <div style={{ textDecoration: "underline" }}>Market State:</div>
          <div>{currentMarketState.description}</div>
          <div style={{ textDecoration: "underline" }}>Stock Price:</div>
          <div>{currentMarketState.stockPrice}</div>
        </div>
        <div className="gameInformation">
          <div className="playerStats">
            <h1>Stats</h1>
            <p>Player Name : {currentPlayer.name}</p>
            <p>Current Money : {currentPlayer.currentMoney}$</p>
            <p>Loans : {currentPlayer.loans}</p>
            <p>Stocks : {currentPlayer.stocks}</p>
            <p>Cards: {currentPlayer.card.length}</p>
          </div>
          <div className="logs">
            <h1>Logs</h1>
            <div
              ref={this.logsRef}
              style={{ overflow: "auto", maxHeight: "200px" }}
            >
              {this.state.logs.map((log, index) => (
                <p key={index}>{log}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Player Information Modal */}
        <Modal
          isOpen={this.state.showPlayerInfoModal}
          onRequestClose={this.togglePlayerInfoModal}
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modal-content">
            <h1>Player Information</h1>
            <br />
            {this.state.showPlayerInfoModal && (
              <div>
                {JSON.parse(localStorage.getItem("playerData")).map(
                  (player, index) => (
                    <div key={index}>
                      <p>
                        <span className={"name" + player.color}>
                          {player.name}
                        </span>
                        <br />
                        <br />
                        Current Money: {player.currentMoney}$
                        <br />
                        Cards: {player.card.length}
                        <br />
                        <br />
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </Modal>

        {/* Payment Required Modal */}
        <Modal
          isOpen={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modal-content">
            <h1>Payment Required</h1>
            <p>Would you like to go to the next world,</p>
            <p>You Will have to pay 2,000,000$</p>
            <p>Do you want to pay?</p>
            <p>{this.props.modalMessage}</p>{" "}
            {/* Add this line to display the modal message */}
            <div className="button-container">
              <button className="payButton" onClick={() => this.handlePay()}>
                Pay
              </button>
              <button className="dontPayButton" onClick={this.handleNotPay}>
                Don't Pay
              </button>
            </div>
          </div>
        </Modal>

        {/* Payment Required for World 3 Modal */}
        <Modal
          isOpen={this.state.showWorld3Modal}
          onRequestClose={() => this.setState({ showWorld3Modal: false })}
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modal-content">
            <h1>Payment Required for World 3</h1>
            <p>Would you like to go to World 3,</p>
            <p>You Will have to pay 3,000,000$</p>
            <p>Do you want to pay?</p>
            <div className="button-container">
              <button
                className="payButton"
                onClick={() => this.handlePayWorld3()}
              >
                Pay
              </button>
              <button
                className="dontPayButton"
                onClick={this.handleNotPayWorld3}
              >
                Don't Pay
              </button>
            </div>
          </div>
        </Modal>

        {/* Payment Required for island Modal */}
        <Modal
          isOpen={this.state.showIslandModal}
          onRequestClose={() => this.setState({ showIslandModal: false })}
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modal-content">
            <h1>Payment Required for Island</h1>
            <p>Would you like to go to Island,</p>
            <p>You Will have to pay 5,000,000$</p>
            <p>Do you want to pay?</p>
            <div className="button-container">
              <button
                className="payButton"
                onClick={() => this.handlePayIsland()}
              >
                Pay
              </button>
              <button
                className="dontPayButton"
                onClick={this.handleNotPayIsland}
              >
                Don't Pay
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal for buying a business */}
        <Modal
          isOpen={this.state.showBuyBusinessModal}
          onRequestClose={() => this.setState({ showBuyBusinessModal: false })}
          className="modal"
          overlayClassName="overlay"
        >
          {this.state.showBuyBusinessModal && (
            <div className="modal-content">
              <h1>Open A Business!</h1>
              <p>Choose a business to buy:</p>

              <label>
                <input
                  type="radio"
                  name="businessOption"
                  value="business1"
                  onChange={this.handleBusinessOptionChange}
                  checked={this.state.selectedBusinessOption === "business1"} // Check if this option is selected
                />
                Business 1 - Cost: $400,000, When Landed: $200,000
              </label>

              <label>
                <input
                  type="radio"
                  name="businessOption"
                  value="business2"
                  onChange={this.handleBusinessOptionChange}
                  checked={this.state.selectedBusinessOption === "business2"} // Check if this option is selected
                />
                Business 2 - Cost: $1,000,000, When Landed: $400,000
              </label>

              <label>
                <input
                  type="radio"
                  name="businessOption"
                  value="business3"
                  onChange={this.handleBusinessOptionChange}
                  checked={this.state.selectedBusinessOption === "business3"} // Check if this option is selected
                />
                Business 3 - Cost: $2,000,000, When Landed: $600,000
              </label>

              <label>
                <input
                  type="radio"
                  name="businessOption"
                  value="business4"
                  onChange={this.handleBusinessOptionChange}
                  checked={this.state.selectedBusinessOption === "business4"} // Check if this option is selected
                />
                Business 4 - Cost: $3,000,000, When Landed: $800,000
              </label>

              <div className="button-container">
                <button className="payButton" onClick={this.handleBuyBusiness}>
                  Buy Business
                </button>
                <button
                  className="dontPayButton"
                  onClick={this.handleNotBuyBusiness}
                >
                  Don't Buy
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal for Selling a business speacial tile */}
        <Modal
          isOpen={this.state.showSellBusinessModal}
          onRequestClose={() => this.setState({ showSellBusinessModal: false })}
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modal-content">
            <h1>Sell A Business!</h1>
            <p>Choose a business you want to sell:</p>

            <select
              value={this.state.selectedTile}
              onChange={this.handleTileSelectChange}
            >
              <option value="">Select a Tile</option>
              {this.state.availableTiles.map((tile) => (
                <option key={tile} value={tile}>
                  Tile {tile}
                </option>
              ))}
            </select>

            <div className="button-container">
              <button className="payButton" onClick={this.handleSellBusiness}>
                Sell
              </button>
              <button
                className="dontPayButton"
                onClick={() => this.setState({ showSellBusinessModal: false })}
              >
                Don't Sell
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal for buying a business speacial tile */}
        <Modal
          isOpen={this.state.showBuyBusinessModalWhereAvailble}
          onRequestClose={() =>
            this.setState({ showBuyBusinessModalWhereAvailble: false })
          }
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modal-content">
            <h1>Open A Business!</h1>

            <p>Choose a tile to buy business:</p>

            <select
              value={this.state.selectedTile}
              onChange={this.handleTileSelectChange}
            >
              <option value="">Select a Tile</option>
              {this.state.availableTiles.map((tile) => (
                <option key={tile} value={tile}>
                  Tile {tile}
                </option>
              ))}
            </select>

            <p>Choose a business to buy:</p>

            <label>
              <input
                type="radio"
                name="businessOption"
                value="business1"
                onChange={this.handleBusinessOptionChange}
                checked={this.state.selectedBusinessOption === "business1"} // Check if this option is selected
              />
              Business 1 - Cost: $400,000, When Landed: $200,000
            </label>

            <label>
              <input
                type="radio"
                name="businessOption"
                value="business2"
                onChange={this.handleBusinessOptionChange}
                checked={this.state.selectedBusinessOption === "business2"} // Check if this option is selected
              />
              Business 2 - Cost: $1,000,000, When Landed: $400,000
            </label>

            <label>
              <input
                type="radio"
                name="businessOption"
                value="business3"
                onChange={this.handleBusinessOptionChange}
                checked={this.state.selectedBusinessOption === "business3"} // Check if this option is selected
              />
              Business 3 - Cost: $2,000,000, When Landed: $600,000
            </label>

            <label>
              <input
                type="radio"
                name="businessOption"
                value="business4"
                onChange={this.handleBusinessOptionChange}
                checked={this.state.selectedBusinessOption === "business4"} // Check if this option is selected
              />
              Business 4 - Cost: $3,000,000, When Landed: $800,000
            </label>

            <div className="button-container">
              <button
                className="payButton"
                onClick={this.handleBuyBusinessSpecialTile}
              >
                Buy Business
              </button>
              <button
                className="dontPayButton"
                onClick={() =>
                  this.setState({ showBuyBusinessModalWhereAvailble: false })
                }
              >
                Don't Buy
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal for buying a stock */}
        <Modal
          isOpen={this.state.showBuyStocksModal}
          onRequestClose={() => this.setState({ showBuyStocksModal: false })}
          className="modal"
          overlayClassName="overlay"
        >
          {this.state.showBuyStocksModal && (
            <div className="modal-content">
              <h1>Buy Stocks</h1>
              <p>How many stocks would you like to buy?</p>
              <div className="stockContainer">
                <button
                  className="plusMinusButton"
                  onClick={() => this.handleStockSelection(-1)}
                >
                  -
                </button>
                <div className="stockNumber">{this.state.selectedStocks}</div>
                <button
                  className="plusMinusButton"
                  onClick={() => this.handleStockSelection(1)}
                >
                  +
                </button>
              </div>

              <div className="button-container">
                <button className="payButton" onClick={this.handleBuyStock}>
                  Buy Stocks
                </button>
                <button
                  className="dontPayButton"
                  onClick={() => this.setState({ showBuyStocksModal: false })}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal for selling a stock */}
        <Modal
          isOpen={this.state.showSellStocksModal}
          onRequestClose={() => this.setState({ showSellStocksModal: false })}
          className="modal"
          overlayClassName="overlay"
        >
          {this.state.showSellStocksModal && (
            <div className="modal-content">
              <h1>Buy Stocks</h1>
              <p>How many stocks would you like to sell?</p>
              <div className="stockContainer">
                <button
                  className="plusMinusButton"
                  onClick={() => this.handleStockSelection(-1)}
                >
                  -
                </button>
                <div className="stockNumber">{this.state.selectedStocks}</div>
                <button
                  className="plusMinusButton"
                  onClick={() => this.handleStockSelection(1)}
                >
                  +
                </button>
              </div>

              <div className="button-container">
                <button className="payButton" onClick={this.handleSellStock}>
                  Sell Stocks
                </button>
                <button
                  className="dontPayButton"
                  onClick={() => this.setState({ showSellStocksModal: false })}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal for Taking a Loan */}
        <Modal
          isOpen={this.state.showTakeLoanModal}
          onRequestClose={() => this.setState({ showTakeLoanModal: false })}
          className="modal"
          overlayClassName="overlay"
        >
          {this.state.showTakeLoanModal && (
            <div className="modal-content">
              <h1>Take A Loan</h1>
              <p>Would you like to take a loan?</p>
              <p>You Will have to pay 100,000$</p>
              <p>And get a 1,000,000$ Loan</p>
              <p>Do you agree?</p>
              <p>{this.props.modalMessage}</p>{" "}
              {/* Add this line to display the modal message */}
              <div className="button-container">
                <button
                  className="payButton"
                  onClick={() => this.handleTakeLoan()}
                >
                  Take
                </button>
                <button
                  className="dontPayButton"
                  onClick={() => this.setState({ showTakeLoanModal: false })}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal for Return a Loan */}
        <Modal
          isOpen={this.state.showReturnLoanModal}
          onRequestClose={() => this.setState({ showReturnLoanModal: false })}
          className="modal"
          overlayClassName="overlay"
        >
          {this.state.showReturnLoanModal && (
            <div className="modal-content">
              <h1>Return A Loan</h1>
              <p>Would you like to return a loan?</p>
              <p>You Will have to pay 1,000,000$</p>
              <p>Do you agree?</p>
              <p>{this.props.modalMessage}</p>{" "}
              {/* Add this line to display the modal message */}
              <div className="button-container">
                <button
                  className="payButton"
                  onClick={() => this.handleReturnLoan()}
                >
                  Yes
                </button>
                <button
                  className="dontPayButton"
                  onClick={() => this.setState({ showReturnLoanModal: false })}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal for showing the player cards */}
        <Modal
          isOpen={this.state.showPlayerCardsModal}
          onRequestClose={() => this.setState({ showPlayerCardsModal: false })}
          className="modal"
          overlayClassName="overlay"
        >
          {this.state.showPlayerCardsModal && (
            <div className="modal-content">
              {currentPlayer.card.length > 0 ? (
                currentPlayer.card.map((card, index) => (
                  <button
                    className="card-button"
                    key={index}
                    onClick={() =>
                      this.checkCard(
                        card.name,
                        playerDataLS,
                        playerIndexLS,
                        card.id
                      )
                    }
                  >
                    <div style={{ textDecoration: "underline" }}>
                      {card.name}
                    </div>
                    <div>{card.description}</div>
                  </button>
                ))
              ) : (
                <div>
                  <p>You don't have any cards.</p>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Modal for using the free pass card */}
        <Modal
          isOpen={this.state.showPlayerFreePassModal}
          onRequestClose={() =>
            this.setState({ showPlayerFreePassModal: false })
          }
          className="modal"
          overlayClassName="overlay"
        >
          {this.state.showPlayerFreePassModal && (
            <div className="modal-content">
              <h1>FREE PASS</h1>
              <p>Would you like to use this card</p>
              <div className="button-container">
                <button
                  className="payButton"
                  onClick={() => this.handleFreePass()}
                >
                  Yes
                </button>
                <button
                  className="dontPayButton"
                  onClick={() => this.handleNotFreePass()}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal for using the Red Head card */}
        <Modal
          isOpen={this.state.showPlayerRedHeadedModal}
          onRequestClose={() =>
            this.setState({ showPlayerRedHeadedModal: false })
          }
          className="modal"
          overlayClassName="overlay"
        >
          {this.state.showPlayerRedHeadedModal && (
            <div className="modal-content">
              <h1>Red header exemption</h1>
              <p>Would you like to use this card</p>
              <div className="button-container">
                <button
                  className="payButton"
                  onClick={() => this.handleRedHeaded()}
                >
                  Yes
                </button>
                <button
                  className="dontPayButton"
                  onClick={() => this.handleNotRedHeaded()}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal for using the stock card */}
        <Modal
          isOpen={this.state.showStockCardModal}
          onRequestClose={() => this.setState({ showStockCardModal: false })}
          className="modal"
          overlayClassName="overlay"
        >
          {this.state.showStockCardModal && (
            <div className="modal-content">
              <h1>Buy Stocks</h1>
              <p>How many stocks would you like to sell?</p>
              <div className="stockContainer">
                <button
                  className="plusMinusButton"
                  onClick={() => this.handleStockSelectionForCard(-1)}
                >
                  -
                </button>
                <div className="stockNumber">{this.state.selectedStocks}</div>
                <button
                  className="plusMinusButton"
                  onClick={() => this.handleStockSelectionForCard(1)}
                >
                  +
                </button>
              </div>

              <div className="button-container">
                <button className="payButton" onClick={this.handleBuyStock}>
                  Buy Stocks
                </button>
                <button className="payButton" onClick={this.handleSellStock}>
                  Sell Stocks
                </button>
                <button
                  className="dontPayButton"
                  onClick={() => this.setState({ showStockCardModal: false })}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal for Using Limousine card*/}
        <Modal
          isOpen={this.state.showPlayerLimousineModal}
          onRequestClose={() =>
            this.setState({ showPlayerLimousineModal: false })
          }
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modal-content">
            <h1>Limousine</h1>
            <p>Choose where you want to go!:</p>

            <select
              value={this.state.selectedTile}
              onChange={this.handleTileSelectChange}
            >
              <option value="">Select a Tile</option>
              {this.state.availableTiles.map((tile) => (
                <option key={tile} value={tile}>
                  Tile {tile}
                </option>
              ))}
            </select>

            <div className="button-container">
              <button className="payButton" onClick={this.limousineCard}>
                GO!
              </button>
              <button
                className="dontPayButton"
                onClick={() =>
                  this.setState({ showPlayerLimousineModal: false })
                }
              >
                Cencel
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal for VICTORY*/}
        <Modal
          isOpen={this.state.showPlayerVictoryModal}
          onRequestClose={() =>
            this.setState({ showPlayerVictoryModal: false })
          }
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modal-content">
            <h1>CONGRATULATION</h1>
            <p>YOU ARE THE WINNER!</p>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Board;
