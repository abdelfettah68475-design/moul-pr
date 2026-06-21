const factProducts = [
  [1,'Créatine Monohydrate','creatine','Force, puissance et efforts courts répétés.','product-01.png'],
  [2,'Dymatize Super Mass Gainer','protein','Apport calorique élevé pour faciliter la prise de masse.','product-02.png'],
  [3,'Amino Energy Drink','energy','Énergie, vigilance et format prêt à boire.','product-03.png'],
  [4,'Lean Mass Gainer 580 DH','protein','Calories et protéines pour une prise de masse maîtrisée.','product-04.png'],
  [5,'Applied Creatine','creatine','Soutien de la force et de la performance intense.','product-05.png'],
  [6,'Dymatize ISO100','protein','Isolate hydrolysée à digestion rapide pour la récupération.','product-06.png'],
  [7,'Super Mass Gainer 950 DH','protein','Grand format pour les besoins caloriques élevés.','product-07.png'],
  [8,'Energy & Hydration Duo','energy','Hydratation et électrolytes pendant les efforts longs.','product-08.png'],
  [9,'Gold Standard Whey','protein','Whey polyvalente pour compléter les protéines quotidiennes.','product-09.png'],
  [10,'ISO Whey Zero','protein','Isolate concentrée adaptée au contrôle des apports.','product-10.png'],
  [11,'Joyfuel','energy','Boisson énergisante individuelle pour la vigilance.','product-11.png'],
  [12,'Lean Mass Gainer 990 DH','protein','Grand format pour une phase structurée de prise de masse.','product-12.png'],
  [13,'Multivitamines','wellness','Complète les apports en vitamines et minéraux.','product-13.png'],
  [14,'Omega Balance','wellness','Source complémentaire d’acides gras essentiels.','product-14.png'],
  [15,'Opti-Men','wellness','Complexe quotidien de vitamines et minéraux.','product-15.png'],
  [16,'ON Energy & Hydration','energy','Hydratation, électrolytes et énergie autour de la séance.','product-16.png'],
  [17,'Pre-Workout Drink','energy','Énergie et focus avant l’entraînement.','product-17.png'],
  [18,'R1 Whey Blend','protein','Mélange protéique polyvalent pour la récupération.','product-18.png'],
  [19,'Serious Mass','protein','Très haut apport calorique pour les hard gainers.','product-19.png']
];

const factsGrid = document.querySelector('#all-facts-grid');
factsGrid.innerHTML = factProducts.map(product => `<article class="mini-fact" data-category="${product[2]}"><img src="assets/products/${product[4]}" alt="${product[1]}" loading="lazy"><div class="mini-fact-content"><small>FACT #${String(product[0]).padStart(2,'0')}</small><h3>${product[1]}</h3><p>${product[3]}</p><a href="product.html?id=${product[0]}">Voir tous les détails →</a></div></article>`).join('');

document.querySelectorAll('[data-fact-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-fact-filter]').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.factFilter;
  document.querySelectorAll('.mini-fact').forEach(card => card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter));
}));

const recommendations = {
  massHard:{id:19,name:'Serious Mass',price:'1050 DH',image:'product-19.png',why:'Ton objectif est la prise de masse et tu as du mal à manger suffisamment. Ce gainer très calorique facilite la création d’un surplus énergétique.',reasons:['Haute calorie','Prise de masse','Grand format']},
  massLean:{id:4,name:'Lean Mass Gainer',price:'580 DH',image:'product-04.png',why:'Tu veux augmenter les calories avec une approche plus progressive. Ce gainer combine protéines et énergie dans un format facile à doser.',reasons:['Masse maîtrisée','Protéines','Portion adaptable']},
  whey:{id:9,name:'Gold Standard Whey',price:'1150 DH',image:'product-09.png',why:'Ton alimentation est globalement suffisante, mais tu veux compléter tes protéines et mieux soutenir la récupération musculaire.',reasons:['Protéines','Récupération','Polyvalente']},
  isolate:{id:6,name:'Dymatize ISO100',price:'980 DH',image:'product-06.png',why:'Tu contrôles tes apports et recherches une protéine isolate rapide et concentrée pour compléter ta récupération.',reasons:['Isolate','Digestion rapide','Récupération']},
  creatine:{id:5,name:'Applied Nutrition Creatine',price:'520 DH',image:'product-05.png',why:'Ton objectif principal est la force et la performance sur les efforts courts et intenses. La régularité quotidienne sera essentielle.',reasons:['Force','Puissance','Performance']},
  energy:{id:3,name:'Amino Energy Drink',price:'25 DH',image:'product-03.png',why:'Tu recherches de l’énergie et tu tolères les stimulants. Ce format prêt à boire est pratique avant une séance ou une journée active.',reasons:['Énergie','Focus','Prêt à boire']},
  hydration:{id:8,name:'Energy & Hydration',price:'400 DH',image:'product-08.png',why:'Tu veux soutenir l’effort sans miser sur les stimulants. L’hydratation et les électrolytes sont prioritaires.',reasons:['Hydratation','Électrolytes','Endurance']},
  wellness:{id:15,name:'Opti-Men Multivitamines',price:'420 DH',image:'product-15.png',why:'Ton objectif est une routine de bien-être quotidienne pour compléter tes apports en vitamines et minéraux.',reasons:['Vitamines','Minéraux','Routine']}
};

document.querySelector('#sim-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const goal = data.get('goal');
  const food = data.get('food');
  const stimulants = data.get('stimulants');
  let key = 'whey';
  if (goal === 'mass') key = food === 'hard' ? 'massHard' : 'massLean';
  else if (goal === 'muscle') key = food === 'lean' ? 'isolate' : 'whey';
  else if (goal === 'strength') key = 'creatine';
  else if (goal === 'energy') key = stimulants === 'yes' ? 'energy' : 'hydration';
  else if (goal === 'wellness') key = 'wellness';
  const result = recommendations[key];
  const resultBox = document.querySelector('#sim-result');
  resultBox.innerHTML = `<div class="result-image"><img src="assets/products/${result.image}" alt="${result.name}"></div><div class="result-copy"><small>NOTRE RECOMMANDATION</small><h3>${result.name}</h3><p>${result.why}</p><div class="result-reasons">${result.reasons.map(reason => `<span>${reason}</span>`).join('')}</div><div class="result-actions"><a href="product.html?id=${result.id}">Voir la fiche · ${result.price}</a><a href="https://wa.me/212774145588?text=${encodeURIComponent(`Bonjour, le simulateur me recommande ${result.name}. Je souhaite un conseil.`)}" target="_blank" rel="noreferrer">Demander conseil</a></div></div>`;
  resultBox.classList.add('show');
  resultBox.scrollIntoView({behavior:'smooth',block:'center'});
});
