const API_URL = 'http://localhost:3000/funcionarios';
const form = document.getElementById('funcionarioForm');
const tabela = document.querySelector('#tabelaFuncionarios tbody');

// Toast System
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44336';
  toast.classList.remove('toast-hidden');
  toast.classList.add('toast-show');
  
  setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hidden');
  }, 3000);
}

// Variável para armazenar todos os funcionários
let todosFuncionarios = [];

// Função para verificar se nome já existe
async function nomeJaExistente(nome, idAtual = null) {
  const response = await fetch(API_URL);
  const { data } = await response.json();
  return data.some(func => 
    func.nome.toLowerCase() === nome.toLowerCase() && 
    func.id !== idAtual
  );
}

// Carrega funcionários
async function carregarFuncionarios() {
  try {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    
    // Armazena todos os funcionários para filtragem
    todosFuncionarios = data;
    
    // Exibe todos inicialmente
    exibirFuncionarios(data);
  } catch (err) {
    showToast('Erro ao carregar funcionários', false);
    console.error(err);
  }
}

// Exibe funcionários na tabela (com possibilidade de filtro)
function exibirFuncionarios(funcionarios) {
  tabela.innerHTML = funcionarios.map(func => `
    <tr>
      <td>${func.id}</td>
      <td>${func.nome}</td>
      <td>${func.cargo}</td>
      <td>R$ ${func.salario.toFixed(2)}</td>
      <td>
        <button class="action-btn" data-tooltip="Editar" onclick="editarFuncionario(${func.id})">✏️</button>
        <button class="action-btn" data-tooltip="Excluir" onclick="excluirFuncionario(${func.id})">🗑️</button>
      </td>
    </tr>
  `).join('');
}

// Função para filtrar funcionários
function filtrarFuncionarios() {
  const termo = document.getElementById('searchInput').value.toLowerCase();
  
  if (!termo) {
    exibirFuncionarios(todosFuncionarios);
    return;
  }
  
  const filtrados = todosFuncionarios.filter(func => 
    func.id.toString().includes(termo) || 
    func.nome.toLowerCase().includes(termo)
  );
  
  exibirFuncionarios(filtrados);
}

// Formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const funcionario = {
    nome: document.getElementById('nome').value.trim(),
    cargo: document.getElementById('cargo').value.trim(),
    salario: parseFloat(document.getElementById('salario').value)
  };

  // Validação de nome duplicado 
  const id = document.getElementById('id')?.value;
  if (await nomeJaExistente(funcionario.nome, id)) {
    showToast('Já existe um funcionário com este nome!', false);
    return;
  }

  const metodo = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const response = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(funcionario)
    });

    if (!response.ok) throw new Error(await response.text());
    
    showToast(id ? 'Funcionário atualizado com sucesso!' : 'Funcionário adicionado com sucesso!');
    await carregarFuncionarios();
    form.reset();
    
    // Remove o campo hidden do ID se existir
    const idInput = document.getElementById('id');
    if (idInput) idInput.remove();
    
  } catch (err) {
    showToast(`Erro: ${err.message}`, false);
  }
});

// Funções de ação
window.editarFuncionario = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  const funcionario = await response.json();
  
  document.getElementById('nome').value = funcionario.nome;
  document.getElementById('cargo').value = funcionario.cargo;
  document.getElementById('salario').value = funcionario.salario;
  
  // Adiciona um campo hidden para o ID
  let idInput = document.getElementById('id');
  if (!idInput) {
    idInput = document.createElement('input');
    idInput.type = 'hidden';
    idInput.id = 'id';
    form.appendChild(idInput);
  }
  idInput.value = id;
};

window.excluirFuncionario = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este funcionário?')) return;
  
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    showToast('Funcionário excluído com sucesso!');
    await carregarFuncionarios();
  } catch (err) {
    showToast(`Erro ao excluir: ${err.message}`, false);
  }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Adiciona o campo de pesquisa ao carregar a página
  const searchHTML = `
    <div style="margin: 10px 0;">
      <input type="text" id="searchInput" placeholder="Pesquisar por ID ou Nome" 
             style="padding: 8px; width: 300px; border: 1px solid #ddd; border-radius: 4px;">
    </div>
  `;
  
  // Insere o campo de pesquisa acima da tabela
  document.querySelector('#tabelaFuncionarios').insertAdjacentHTML('beforebegin', searchHTML);
  
  // Adiciona o evento de pesquisa
  document.getElementById('searchInput').addEventListener('input', filtrarFuncionarios);
  
  // Carrega os funcionários
  carregarFuncionarios();
});