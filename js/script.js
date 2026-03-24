document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const infosContainer = document.getElementById("infos");

  const elTmb = document.getElementById("tmb-value");
  const elTdee = document.getElementById("tdee-value");
  const elAiTips = document.getElementById("ai-tips");
  const elCarbs = document.getElementById("macro-carbs");
  const elProteins = document.getElementById("macro-proteins");
  const elFats = document.getElementById("macro-fats");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);
    const age = parseInt(document.getElementById("age").value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const activityMultiplier = parseFloat(
      document.getElementById("activity").value,
    );
    const goal = document.getElementById("goal").value;

    // 1. Cálculo do Metabolismo Basal (Mifflin-St Jeor)
    let tmb;
    if (gender === "male") {
      tmb = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      tmb = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // 2. Cálculo do TDEE (Gasto Energético Diário Total)
    let tdee = tmb * activityMultiplier;

    // 3. Aplicação do Modificador de Objetivo
    let targetCalories = tdee;
    let goalText = "";

    switch (goal) {
      case "lose_fast":
        targetCalories -= 500;
        goalText = "déficit agressivo para perda rápida";
        break;
      case "lose":
        targetCalories -= 300;
        goalText = "déficit saudável para queima de gordura";
        break;
      case "maintain":
        targetCalories = tdee;
        goalText = "manutenção do peso atual";
        break;
      case "gain":
        targetCalories += 300;
        goalText = "superávit calórico focado em massa magra";
        break;
      case "gain_fast":
        targetCalories += 500;
        goalText = "ganho rápido de volume muscular";
        break;
    }

    // 4. Cálculo de Macros
    let proteinGrams = weight * 2.1;
    let fatGrams = weight * 1;

    let proteinCals = proteinGrams * 4;
    let fatCals = fatGrams * 9;

    let remainingCals = targetCalories - (proteinCals + fatCals);
    let carbGrams = remainingCals > 0 ? remainingCals / 4 : 0;

    if (remainingCals < 0) {
      carbGrams = 30; // Minimo tolerável
      fatGrams = ((targetCalories - carbGrams * 4) * 0.3) / 9;
      proteinGrams = (targetCalories - carbGrams * 4 - fatGrams * 9) / 4;
    }

    // 5. Atualização de Interface com Animações
    infosContainer.classList.remove("hidden");

    animateValue(elTmb, 0, Math.round(tmb), 1000);
    animateValue(elTdee, 0, Math.round(targetCalories), 1200);

    // Atualização de Macros
    elProteins.textContent = `${Math.round(proteinGrams)}g`;
    elFats.textContent = `${Math.round(fatGrams)}g`;
    elCarbs.textContent = `${Math.round(carbGrams)}g`;

    // 6. Geração Dinâmica de Dicas da 'IA COACH'
    generateAiMessage(targetCalories, goalText, gender, age);

    setTimeout(() => {
      infosContainer.style.position = "relative";
      infosContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  });

  form.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      document.getElementById("calculate").click();
    }
  });

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  function generateAiMessage(calories, goalText, gender, age) {
    const tipsOptions = [
      `Para o seu perfil (<strong>_${age} anos_</strong>), com o alvo de ${goalText}, a meta ideal é de <strong>${Math.round(calories)} kcal</strong>/dia.`,
      `Lembre-se: beber no mínimo 2L de água otimiza o metabolismo. O foco em proteína ajudará na saciedade.`,
      `Você pode dividir essas calorias em 4 a 5 refeições menores ou adotar jejum intermitente dependendo da sua preferência.`,
    ];

    elAiTips.innerHTML = "";
    let fullText = tipsOptions.join(" ");
    let i = 0;

    function typeWriter() {
      if (i < fullText.length) {
        // Manter strong e emphasis tags
        if (fullText.substring(i, i + 8) === "<strong>") {
          elAiTips.innerHTML += "<strong>";
          i += 8;
        } else if (fullText.substring(i, i + 9) === "</strong>") {
          elAiTips.innerHTML += "</strong>";
          i += 9;
        } else {
          elAiTips.innerHTML += fullText.charAt(i);
          i++;
        }
        setTimeout(typeWriter, 12);
      }
    }
    typeWriter();
  }
});
