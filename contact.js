document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = `Bonjour Moul Proteines,

Je m'appelle ${data.get('name')}.
Mon objectif : ${data.get('goal')}.

${data.get('message')}`;
  window.open(`https://wa.me/212774145588?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});
