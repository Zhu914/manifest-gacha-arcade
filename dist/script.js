"use strict";

(() => {
  const blessings = [
    {
      name: "温柔进度条",
      meaning: "你不是必须一下子抵达哪里。此刻的小小推进，已经让事情悄悄改变了形状。",
      action: "把眼前一件觉得繁琐的事，只做最开始的五分钟。",
      quote: "慢慢来的人，也会稳稳地到达。"
    },
    {
      name: "清朗的呼吸",
      meaning: "忙碌偶尔会把你围住，但你依然有能力给自己腾出一小片安静。",
      action: "起身开窗，认真做三次慢慢呼气的深呼吸。",
      quote: "呼吸一顺，心里就多出一条路。"
    },
    {
      name: "小好运掉落",
      meaning: "一些轻盈的契机正在路上，它们不需要你绷紧神经去追赶。",
      action: "主动发一条简短消息，告诉一个人你在想起对方。",
      quote: "微微靠近世界，惊喜就有机会看见你。"
    },
    {
      name: "恢复元气键",
      meaning: "疲惫不是失败的证据，它只是提醒你：接下来要更温柔地对待自己。",
      action: "喝一杯温水，然后把肩膀向上提起再轻轻放下。",
      quote: "先照顾好自己，运气会更愿意停留。"
    },
    {
      name: "柔软勇气",
      meaning: "你想面对的事里，其实藏着一点期待。不用变得很强，也可以试着向前一小步。",
      action: "写下你犹豫的那句话，然后念给自己听一遍。",
      quote: "勇气可以是软的，也能走得很远。"
    },
    {
      name: "光斑与笑声",
      meaning: "快乐常藏在很小的瞬间里。今天也许会有一束光、一句玩笑，把你轻轻照亮。",
      action: "留意三个让你觉得舒服的瞬间，不用拍照也可以记住。",
      quote: "把目光放宽，笑声就会冒出来。"
    },
    {
      name: "重启内心系统",
      meaning: "卡住不代表坏掉了。适当放一放，反而能给新的想法留出空间。",
      action: "把手边任务重新排序，只保留今天真正重要的一件。",
      quote: "暂停一下，也是继续的一部分。"
    },
    {
      name: "被理解的可能",
      meaning: "世界上一定有人能接住你的感受，你可以不必独自翻译所有心事。",
      action: "选择一位让你安心的人，分享今天的一个想法。",
      quote: "说出来，理解就开始生长。"
    },
    {
      name: "轻盈的幸运感",
      meaning: "不必宏大，也不必立刻证明什么。只要保持轻巧，你就能更容易转弯。",
      action: "给自己安排一个五分钟的小奖励，哪怕只是喜欢的一首歌。",
      quote: "轻一点，好事情更容易附身。"
    },
    {
      name: "内在小灯塔",
      meaning: "你的直觉一直在低声工作，它可能比你以为的更了解此刻需要的方向。",
      action: "安静写下第一直觉，再温和地问自己：它想保护什么？",
      quote: "心里有光，路径不必立刻清晰。"
    },
    {
      name: "甜味补给",
      meaning: "生活需要一点不必要的可爱。它会像糖一样，把普通的下午变得亮一点。",
      action: "给自己选一样喜欢的小东西，或者想象已经拥有它。",
      quote: "可爱是认真生活的证据。"
    },
    {
      name: "缓慢显化场",
      meaning: "愿望像胶囊一样需要滚动一会儿。别催它，它正在你看得见或看不见的地方成型。",
      action: "把愿望缩成一句具体的话，放在今天能看见的地方。",
      quote: "慢慢显化，也很好。"
    }
  ];

  const capsulePalette = [
    ["#e84856", "#fff7dc"],
    ["#ffb459", "#fff3cd"],
    ["#8be3c1", "#fff7dc"],
    ["#ff7d9c", "#fff3cd"],
    ["#5fb8d9", "#fff7dc"],
    ["#ffca4f", "#fff7dc"],
    ["#b48be0", "#fff7dc"]
  ];

  const coinButton = document.getElementById("coinButton");
  const knobButton = document.getElementById("knobButton");
  const capsuleField = document.getElementById("capsuleField");
  const deliveryPath = document.getElementById("deliveryPath");
  const screenText = document.getElementById("screenText");
  const statusText = document.getElementById("statusText");
  const slot = document.querySelector(".slot");
  const cardStage = document.getElementById("cardStage");
  const wishName = document.getElementById("wishName");
  const wishMeaning = document.getElementById("wishMeaning");
  const wishAction = document.getElementById("wishAction");
  const wishQuote = document.getElementById("wishQuote");
  const copyButton = document.getElementById("copyButton");
  const againButton = document.getElementById("againButton");

  let phase = "idle";
  let activeCapsule = null;
  let lastBlessing = null;
  let remainingBlessings = [];
  let openTimer = null;

  function createCapsules() {
    capsuleField.innerHTML = "";
    const positions = [
      [18,10],[46,4],[72,14],[9,44],[34,52],[61,47],[83,35],[22,78],[49,83],[73,74]
    ];
    positions.forEach(([left, bottom], index) => {
      const capsule = document.createElement("div");
      const palette = capsulePalette[index % capsulePalette.length];
      capsule.className = "capsule";
      capsule.style.left = `${left}%`;
      capsule.style.bottom = `${bottom}%`;
      capsule.style.setProperty("--cap-a", palette[0]);
      capsule.dataset.index = String(index);
      capsuleField.append(capsule);
    });
  }

  function setScreen(message) {
    screenText.textContent = message;
    statusText.textContent = message;
  }

  function setPhase(nextPhase) {
    phase = nextPhase;
    coinButton.disabled = phase !== "idle";
    knobButton.disabled = phase !== "ready";
    if (phase === "ready") {
      knobButton.setAttribute("aria-describedby", "screenText");
    }
  }

  function pickBlessing() {
    if (!remainingBlessings.length) {
      remainingBlessings = [...blessings.keys()].filter(item => item !== lastBlessing);
    }
    const pool = remainingBlessings.length ? remainingBlessings : [...blessings.keys()];
    const position = Math.floor(Math.random() * pool.length);
    const index = pool[position];
    remainingBlessings.splice(position, 1);
    lastBlessing = index;
    return blessings[index];
  }

  function showCard(blessing) {
    wishName.textContent = blessing.name;
    wishMeaning.textContent = blessing.meaning;
    wishAction.textContent = blessing.action;
    wishQuote.textContent = blessing.quote;
    cardStage.setAttribute("aria-hidden", "false");
    cardStage.classList.add("visible");
    setScreen(`抽中了「${blessing.name}」`);
    setPhase("result");
  }

  function openSelectedCapsule() {
    const selected = capsuleField.querySelector(".capsule.selected");
    if (selected) selected.classList.remove("selected");
    const palette = capsulePalette[Math.floor(Math.random() * capsulePalette.length)];
    const flyingCapsule = document.createElement("div");
    flyingCapsule.className = "flying-capsule";
    flyingCapsule.style.setProperty("--cap-a", palette[0]);
    deliveryPath.append(flyingCapsule);

    setScreen("胶囊滚动落地中……");

    window.setTimeout(() => {
      flyingCapsule.classList.add("opening");
    }, 680);

    openTimer = window.setTimeout(() => {
      flyingCapsule.remove();
      showCard(pickBlessing());
    }, 1180);
  }

  function startDraw() {
    if (phase !== "ready") return;
    setPhase("drawing");
    cardStage.classList.remove("visible");
    cardStage.setAttribute("aria-hidden", "true");
    window.clearTimeout(openTimer);
    knobButton.classList.add("turning");
    capsuleField.classList.add("spin");
    setScreen("正在抽取显化胶囊……");

    window.setTimeout(() => {
      capsuleField.classList.remove("spin");
      knobButton.classList.remove("turning");
      const capsules = [...capsuleField.querySelectorAll(".capsule")];
      const target = capsules[Math.floor(Math.random() * capsules.length)];
      if (target) target.classList.add("selected");
      setScreen("一颗胶囊亮起来了！");
      window.setTimeout(openSelectedCapsule, 720);
    }, 900);
  }

  function insertCoin() {
    if (phase !== "idle") return;
    coinButton.classList.add("inserted");
    slot.classList.add("glow");
    setScreen("心愿币投入成功，请转动旋钮");
    setPhase("paying");

    window.setTimeout(() => {
      coinButton.classList.remove("inserted");
      slot.classList.remove("glow");
      setPhase("ready");
    }, 780);
  }

  async function copyBlessing() {
    if (!lastBlessing) return;
    const blessing = blessings[lastBlessing];
    const text = [
      `【${blessing.name}】`,
      blessing.meaning,
      `今天的小行动：${blessing.action}`,
      `留存短句：${blessing.quote}`,
      "——来自霓虹游戏厅显化扭蛋机"
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      const original = copyButton.textContent;
      copyButton.textContent = "已复制 ✓";
      window.setTimeout(() => { copyButton.textContent = original; }, 1200);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      copyButton.textContent = "已复制 ✓";
      window.setTimeout(() => { copyButton.textContent = "复制祝福"; }, 1200);
    }
  }

  function drawAgain() {
    cardStage.classList.remove("visible");
    cardStage.setAttribute("aria-hidden", "true");
    setScreen("可以再投一枚心愿币");
    setPhase("idle");
  }

  coinButton.addEventListener("click", insertCoin);
  knobButton.addEventListener("click", startDraw);
  copyButton.addEventListener("click", copyBlessing);
  againButton.addEventListener("click", drawAgain);

  createCapsules();
  setPhase("idle");
  setScreen("欢迎进来 · 请投入一枚心愿币");
})();
