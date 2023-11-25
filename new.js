drawBoard = () => {
  const canvas = this.canvasRef;
  const ctx = canvas.getContext("2d");
  const boardContainer = document.querySelector(".board-container");
  const padding = 20;

  const availableWidth = boardContainer.clientWidth - 2 * padding;
  const availableHeight = boardContainer.clientHeight - 2 * padding;

  canvas.width = availableWidth;
  canvas.height = availableHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (this.backgroundImage) {
    ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
  }

  const rows = 8;
  const cols = 12;
  const tileWidth = canvas.width / cols;
  const tileHeight = canvas.height / rows;

  ctx.strokeStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  
 for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const x = col * tileWidth;
    const y = row * tileHeight;
    const tileNumber = col + row * cols + 1;

    // Check if the tile is occupied and needs to be colored
    const tile = this.tilePositions[tileNumber];
    if (tile && tile.isOccupied) {
      const player = this.props.players.find(player => player.id === tile.playerID);
      
      // Set the opacity (alpha) for the tile color
      ctx.globalAlpha = 0.5; // Change this value to control the opacity

      // Fill the tile with the player's color
      ctx.fillStyle = player.color;
      ctx.fillRect(x, y, tileWidth, tileHeight);

      // Reset the globalAlpha to 1 for other drawings (important!)
      ctx.globalAlpha = 1;

      // Display the payFee value in the center
      ctx.fillStyle = "white"; // You can adjust the color
      ctx.fillText(tile.payFee.toString(), x + tileWidth / 2, y + tileHeight / 2);
    }
  }
}
};

