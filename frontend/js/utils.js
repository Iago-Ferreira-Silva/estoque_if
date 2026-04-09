 // UTILS.JS — Funções compartilhadas
// Esse arquivo é importado em todas
// as páginas para evitar repetição


// Pega o usuário salvo no localStorage
// Se não existir, manda para o login
function getUsuarioLogado() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario) {
    window.location.href = './login.html';
    return null;
  }
  return usuario;
}

// Gera as iniciais do nome (ex: "Iago Ferreira" → "IF")
function iniciais(nome) {
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

// Monta os headers de autenticação para as chamadas à API
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  };
}

// Preenche o cabeçalho e sidebar com os dados do usuário logado
function inicializarPagina() {
  const usuario = getUsuarioLogado();
  if (!usuario) return;

  // Preenche avatar, nome e perfil na sidebar
  const avatarEl   = document.querySelector('.user-avatar');
  const nomeEl     = document.querySelector('.user-name');
  const roleEl     = document.querySelector('.user-role');

  if (avatarEl) avatarEl.textContent = iniciais(usuario.nome);
  if (nomeEl)   nomeEl.textContent   = usuario.nome;
  if (roleEl)   roleEl.textContent   = usuario.perfil;

  // Preenche a data na topbar
  const dateEl = document.getElementById('currentDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    });
  }

  // Toggle da sidebar no mobile
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
  });

  // Fecha a sidebar ao clicar fora (mobile)
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const toggle  = document.getElementById('sidebarToggle');
    if (
      sidebar &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      e.target !== toggle
    ) {
      sidebar.classList.remove('open');
    }
  });

  // Logout
  document.getElementById('btnLogout')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = './login.html';
  });
}

// Exibe um skeleton (esqueleto de carregamento) dentro de um elemento
// Isso evita que a tela fique em branco enquanto os dados carregam
function mostrarLoading(elementoId, colunas = 5) {
  const el = document.getElementById(elementoId);
  if (!el) return;

  const linhas = Array(4).fill('').map(() => `
    <tr>
      ${Array(colunas).fill('<td><span class="skeleton"></span></td>').join('')}
    </tr>
  `).join('');

  el.innerHTML = linhas;
}

// Formata data ISO do banco para DD/MM/AAAA legível
function formatarData(dataISO) {
  if (!dataISO) return '—';
  return new Date(dataISO).toLocaleDateString('pt-BR');
}

// Exibe uma mensagem flutuante no canto da tela
// tipo: 'success' (verde) ou 'error' (vermelho)
function mostrarToast(msg, tipo = 'success') {
  const t = document.createElement('div');
  t.className = `toast toast-${tipo}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// Exibe mensagem de erro dentro de uma tabela
function mostrarErroTabela(tbodyId, colunas) {
  const el = document.getElementById(tbodyId);
  if (!el) return;
  el.innerHTML = `
    <tr>
      <td colspan="${colunas}" style="text-align:center; color:var(--color-danger); padding:24px;">
        Erro ao carregar dados. Verifique se o servidor está rodando.
      </td>
    </tr>`;
}