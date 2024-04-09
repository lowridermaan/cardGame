{
  const parentEl = document.querySelector(".playfield");
  const btn = document.querySelector(".btn");
  const timerRes = document.querySelector(".timer-restart");
  let compareArr = [];
  let pairArr = [];
  let cardsArr;
  let timer;

  // shuffled arr
  const generateAndShuffleArr = function (num) {
    let arr = [];
    let j, temp;
    for (let i = 1; i <= num; ++i) {
      arr.push(i), arr.push(i);
    }

    for (let i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }

    return arr;
  };

  // html markup
  const cardMarkup = function (num) {
    return `
    <li class = "card-container">
      <div class="card" data-number="${num}">
        <div class ="front"></div>
        <div class ="back"><h2 class="number">${num}</h2></div>
      </div>
    </li>
    `;
  };

  // cards render
  const renderCards = function (arr) {
    parentEl.innerHTML = "";
    arr.forEach((el) =>
      parentEl.insertAdjacentHTML("afterbegin", cardMarkup(el))
    );
  };

  //timer
  const timeOut = function (arr) {
    const tick = function () {
      const sec = String(time).padStart(2, 0);
      timerRes.textContent = `${sec}`;
      if (time === 0) {
        clearInterval(timer);
        arr.forEach((el) => el.classList.remove("flipped"));
        setTimeout(() => {
          parentEl.innerHTML = "";
          btn.classList.remove("hidden");
        }, 600);
      }
      time--;
    };

    let time = 60;
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
  };

  //restart
  const restart = function () {
    pairArr = [];
    btn.classList.add("hidden");
    arr = generateAndShuffleArr(8);
    renderCards(arr);
    cardsArr = [...document.querySelectorAll(".card")];
    timer = timeOut(cardsArr);
  };

  const pairGame = function () {
    const arr = generateAndShuffleArr(8);
    renderCards(arr);

    cardsArr = [...document.querySelectorAll(".card")];
    timer = timeOut(cardsArr);

    parentEl.addEventListener("click", (e) => {
      const currentEl = e.target.closest(".card");
      if (!currentEl || currentEl.dataset.pair) return;
      currentEl.classList.add("flipped");
      compareArr.push(currentEl);

      if (currentEl === compareArr[0] && currentEl === compareArr[1]) {
        compareArr = [compareArr[0]];
      } else if (
        compareArr.length === 2 &&
        compareArr[0].dataset.number !== compareArr[1].dataset.number
      ) {
        setTimeout(() => {
          compareArr.forEach((el) => {
            el.classList.remove("flipped");
            compareArr = [];
          });
        }, 600);
      } else if (
        compareArr.length === 2 &&
        compareArr[0].dataset.number === compareArr[1].dataset.number
      ) {
        compareArr.forEach((el) => {
          pairArr.push(el.dataset.number);
          el.dataset.pair = true;
        });
        compareArr = [];
      }

      //restart-btn render
      if (pairArr.length === arr.length) {
        clearInterval(timer);
        btn.classList.remove("hidden");
        setTimeout(() => {
          cardsArr.forEach((el) => el.classList.remove("flipped"));
        }, 600);
      }
    });

    btn.addEventListener("click", (e) => {
      restart();
    });
  };

  pairGame();
}
