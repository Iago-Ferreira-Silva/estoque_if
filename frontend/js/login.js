const form      = document.getElementById('loginForm');
const emailEl   = document.getElementById('email');
const senhaEl   = document.getElementById('senha');
const btnLogin  = document.getElementById('btnLogin');
const toggleBtn = document.getElementById('toggleSenha');

// TOGGLE MOSTRAR/OCULTAR SENHA
toggleBtn.addEventListener('click', () => {
  const isPassword = senhaEl.type === 'password';
  senhaEl.type = isPassword ? 'text' : 'password';
  toggleBtn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
});

// VALIDAÇÃO 
function validate() {
  let ok = true;
  const emailGroup = document.getElementById('group-email');
  const senhaGroup = document.getElementById('group-senha');

  emailGroup.classList.remove('has-error');
  senhaGroup.classList.remove('has-error');

  if (!emailEl.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
    emailGroup.classList.add('has-error');
    ok = false;
  }

  if (!senhaEl.value || senhaEl.value.length < 4) {
    senhaGroup.classList.add('has-error');
    ok = false;
  }

  return ok;
}

// SUBMIT
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validate()) return;

  btnLogin.classList.add('loading');
  btnLogin.disabled = true;

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailEl.value,
        senha: senhaEl.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Credenciais inválidas.');

    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    window.location.href = './dashboard.html';

  } catch (err) {
    document.getElementById('group-email').classList.add('has-error');
    document.getElementById('group-senha').classList.add('has-error');
  } finally {
    btnLogin.classList.remove('loading');
    btnLogin.disabled = false;
  }
});