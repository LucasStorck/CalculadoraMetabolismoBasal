const form = document.getElementById('form');
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;

    let tmb;

    if (gender === 'male') {
        tmb = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        tmb = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const description = `Sua TMB é: ${tmb.toFixed(1)} calorias por dia.`;
    document.getElementById('description').textContent = description;
    document.getElementById('infos').classList.remove('hidden');
});

form.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        document.getElementById('calculate').click();
    }
});