inicializarPagina();

const perfilAtual = JSON.parse(localStorage.getItem('usuario'))?.perfil;

let setores    = [];
let editandoId = null;
let modalConfirmacaoId = null;

async function carregarSetores() {
  try {
    const response = await fetch('http://localhost:3000/api/setores', {
      headers: getHeaders(),
    });
    setores = await response.json();
    filtrar();
  } catch (err) {
    console.error('Erro ao carregar setores:', err);
  }
}

function renderTabela(lista) {
  const tbody = document.getElementById('setoresBody');
  const empty = document.getElementById('tableEmpty');

  if (lista.length === 0) {
    tbody.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  tbody.innerHTML = lista.map(s => `
    <tr>
      <td><strong>${s.nome}</strong></td>
      <td>${s.responsavel || '—'}</td>
      <td>${s.descricao  || '—'}</td>
      <td><span class="badge badge-in">Vinculado</span></td>
      <td class="actions-cell">
        <button class="btn-edit"   onclick="abrirEdicao(${s.id})">Editar</button>
        <button class="btn-delete" onclick="excluirSetor(${s.id})">Excluir</button>
      </td>
    </tr>
  `).join('');
}

function filtrar() {
  const termo = document.getElementById('searchInput').value.toLowerCase();
  renderTabela(setores.filter(s => s.nome.toLowerCase().includes(termo)));
}

document.getElementById('searchInput').addEventListener('input', filtrar);

// MODAL DE CADASTRO/EDIÇÃO
const overlay = document.getElementById('modalOverlay');

function fecharModal() {
  overlay.hidden = true;
  editandoId = null;
  document.getElementById('nomeSetor').value      = '';
  document.getElementById('responsavel').value    = '';
  document.getElementById('descricaoSetor').value = '';
}

document.getElementById('btnNovoSetor').addEventListener('click', () => {
  document.getElementById('modalTitle').textContent = 'Novo Setor';
  overlay.hidden = false;
});
document.getElementById('modalClose').addEventListener('click', fecharModal);
document.getElementById('btnCancelar').addEventListener('click', fecharModal);
overlay.addEventListener('click', e => { if (e.target === overlay) fecharModal(); });

document.getElementById('btnSalvar').addEventListener('click', async () => {
  const dados = {
    nome:        document.getElementById('nomeSetor').value.trim(),
    responsavel: document.getElementById('responsavel').value.trim(),
    descricao:   document.getElementById('descricaoSetor').value.trim(),
  };

  if (!dados.nome) {
    await mostrarErro('Informe o nome do setor.');
    return;
  }

  try {
    const url    = editandoId
      ? `http://localhost:3000/api/setores/${editandoId}`
      : 'http://localhost:3000/api/setores';
    const method = editandoId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method, headers: getHeaders(), body: JSON.stringify(dados),
    });

    if (!response.ok) {
      if (response.status === 403) {
        await mostrarAlerta('Você não tem permissão para realizar esta ação.', 'Acesso negado', '🔒');
        fecharModal();
        return;
      }
      mostrarToast('Erro ao salvar setor.', 'error');
      return;
    }

    mostrarToast(editandoId ? 'Setor atualizado!' : 'Setor cadastrado!');
    fecharModal();
    await carregarSetores();
  } catch (err) {
    mostrarToast('Erro ao salvar setor.', 'error');
  }
});

function abrirEdicao(id) {
  const s = setores.find(s => s.id === id);
  if (!s) return;

  editandoId = id;
  document.getElementById('modalTitle').textContent = 'Editar Setor';
  document.getElementById('nomeSetor').value        = s.nome;
  document.getElementById('responsavel').value      = s.responsavel || '';
  document.getElementById('descricaoSetor').value   = s.descricao   || '';
  overlay.hidden = false;
}

// MODAL DE CONFIRMAÇÃO DE EXCLUSÃO
const modalConfirmacao  = document.getElementById('modalConfirmacao');
const confirmacaoNomeEl = document.getElementById('confirmacaoNome');

async function excluirSetor(id) {
  if (perfilAtual !== 'gestor') {
    await mostrarAlerta(
      'Você não tem permissão para excluir setores.',
      'Acesso negado',
      '🔒'
    );
    return;
  }

  modalConfirmacaoId = id;
  const setor = setores.find(s => s.id === id);
  confirmacaoNomeEl.textContent = setor?.nome || 'este setor';
  modalConfirmacao.hidden = false;
}

function fecharConfirmacao() {
  modalConfirmacao.hidden = true;
  modalConfirmacaoId = null;
}

document.getElementById('confirmacaoClose').addEventListener('click', fecharConfirmacao);
document.getElementById('confirmacaoCancelar').addEventListener('click', fecharConfirmacao);
modalConfirmacao.addEventListener('click', e => {
  if (e.target === modalConfirmacao) fecharConfirmacao();
});

document.getElementById('confirmacaoConfirmar').addEventListener('click', async () => {
  if (!modalConfirmacaoId) return;

  try {
    const response = await fetch(`http://localhost:3000/api/setores/${modalConfirmacaoId}`, {
      method: 'DELETE', headers: getHeaders(),
    });

    if (!response.ok) {
      const data = await response.json();
      mostrarToast(data.message || 'Erro ao excluir setor.', 'error');
      fecharConfirmacao();
      return;
    }

    mostrarToast('Setor excluído com sucesso!');
    fecharConfirmacao();
    await carregarSetores();
  } catch (err) {
    mostrarToast('Erro ao excluir setor.', 'error');
    fecharConfirmacao();
  }
});

// INICIALIZAÇÃO
carregarSetores();