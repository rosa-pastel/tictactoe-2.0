const box = function (boxNode) {
  const getBoxNode = () => boxNode;
  let value = "";
  const getValue = () => value;
  const isEmpty = () => getValue() === "";
  function makePassive() {
    value = "p";
  }
  function fill(image, val) {
    const img = document.createElement("img");
    img.src = image;
    getBoxNode().appendChild(img);
    value = val;
  }
  function clean() {
    if (getBoxNode().firstElementChild) {
      getBoxNode().removeChild(getBoxNode().firstElementChild);
    }
    value = "";
  }
  return { getValue, fill, isEmpty, clean, makePassive };
};

const player = function (name, source) {
  const img = source;
  const getName = () => name;
  const getImg = () => img;
  return { name, getName, getImg };
};

const game = (function () {
  const page = document.querySelector(".game-page");
  const player1 = player("x", "./icons/x.png");
  const player2 = player("o", "./icons/o.png");
  let currentPlayer = player1;
  let boxes = [];

  const playButton = document.querySelector(".play-button");
  const newGameButtons = Array.prototype.slice.call(
    document.querySelectorAll(".new-game")
  );
  const welcomePage = document.querySelector(".welcome-page");
  const closeModal = document.querySelector(".close");
  const modal = document.querySelector(".game-end");
  const boxObjs = [];

  const winnerWindow = document.querySelector(".game-end");
  const winnerIcon = document.querySelector(".game-end .winner-icon");
  const winnerMessage = document.querySelector(".winner-message");

  const turnImg = document.querySelector("div.turn>img");
  turnImg.src = currentPlayer.getImg();
  function changeCurrentPlayer() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    turnImg.src = currentPlayer.getImg();
  }

  function endGame(winner) {
    boxObjs.filter((obj) => obj.isEmpty()).map((obj) => obj.makePassive());
    winnerWindow.style.display = "flex";
    if (winner === "tie") {
      winnerMessage.textContent = "IT'S A TIE!";
      winnerIcon.style["background-image"] = 'url("./icons/banner.png")';
    } else {
      winnerMessage.textContent = "YOU WON!";
      if (winner === "x") {
        winnerIcon.style["background-image"] = `url("${player1.getImg()}")`;
      } else {
        winnerIcon.style["background-image"] = `url("${player2.getImg()}")`;
      }
    }
  }

  function isBoardFull() {
    return !boxObjs.some((obj) => obj.isEmpty());
  }

  function didPlayerWin() {
    const values = boxObjs.map((boxObj) => boxObj.getValue());
    console.log(boxObjs[0].getValue());
    const rows = [values.slice(0, 3), values.slice(3, 6), values.slice(6, 9)];
    const columns = [
      [values[0], values[3], values[6]],
      [values[1], values[4], values[7]],
      [values[2], values[5], values[8]],
    ];
    const cross = [
      [values[0], values[4], values[8]],
      [values[2], values[4], values[6]],
    ];
    if (
      rows.some(
        (row) =>
          row.every((value) => value === "x") ||
          row.every((value) => value === "o")
      ) ||
      columns.some(
        (column) =>
          column.every((value) => value === "x") ||
          column.every((value) => value === "o")
      ) ||
      cross.some(
        (line) =>
          line.every((value) => value === "x") ||
          line.every((value) => value === "o")
      )
    ) {
      return 1;
    }
    console.log(values);
    return 0;
  }
  function checkGameOver() {
    if (didPlayerWin()) {
      endGame(currentPlayer.getName());
    } else if (isBoardFull()) {
      endGame("tie");
    } else {
      changeCurrentPlayer();
    }
  }

  function createBoard() {
    boxes = Array.prototype.slice.call(document.getElementsByClassName("box"));
    boxes.forEach((node) => {
      const boxObj = box(node);
      boxObjs.push(boxObj);
      node.addEventListener("click", () => {
        if (boxObj.isEmpty()) {
          boxObj.fill(currentPlayer.getImg(), currentPlayer.getName());
          checkGameOver();
        }
      });
    });
  }

  function displayBoard() {
    createBoard();
    page.style.display = "flex";
  }

  function resetGame() {
    boxObjs.forEach((obj) => {
      obj.clean();
    });
  }

  function hide(item) {
    item.style.display = "none";
  }
  playButton.addEventListener("click", () => {
    displayBoard();
    hide(welcomePage);
  });
  newGameButtons.map((button) =>
    button.addEventListener("click", () => {
      hide(modal);
      resetGame();
    })
  );
  closeModal.addEventListener("click", () => {
    hide(modal);
  });
  return {};
})();
