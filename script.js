const etapas = [
  "Novo lead",
  "Em atendimento",
  "Orçamento enviado",
  "Negociação",
  "Pedido fechado",
  "Perdido",
  "Pós-venda"
];

let vendedores = JSON.parse(localStorage.getItem("vendedoresCRM")) || [
  "Ricolly Zamorano",
  "Consultor 2",
  "Consultor 3"
];

let clientes = JSON.parse(localStorage.getItem("clientesCRM")) || [];

function moeda(v){
  return Number(v || 0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

function save(){
  localStorage.setItem("clientesCRM", JSON.stringify(clientes));
  localStorage.setItem("vendedoresCRM", JSON.stringify(vendedores));
  renderAll();
}

function login(){
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();
  if(user === "admin" && pass === "1234"){
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    renderAll();
  } else {
    alert("Usuário ou senha inválidos");
  }
}

function logout(){
  document.getElementById("app").classList.add("hidden");
  document.getElementById("loginScreen").classList.remove("hidden");
}

function showPage(page){
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");
  renderAll();
}

function carregarSelectVendedores(){
  const select = document.getElementById("vendedor");
  select.innerHTML = vendedores.map(v => `<option>${v}</option>`).join("");
}

function salvarCliente(){
  const cliente = {
    id: Date.now(),
    nome: document.getElementById("nome").value.trim(),
    telefone: document.getElementById("telefone").value.replace(/\D/g,""),
    origem: document.getElementById("origem").value.trim(),
    produto: document.getElementById("produto").value.trim(),
    valor: Number(document.getElementById("valor").value || 0),
    vendedor: document.getElementById("vendedor").value,
    status: document.getElementById("status").value,
    obs: document.getElementById("obs").value.trim(),
    criadoEm: new Date().toLocaleString("pt-BR")
  };

  if(!cliente.nome || !cliente.telefone){
    alert("Preencha nome e WhatsApp do cliente.");
    return;
  }

  clientes.push(cliente);
  limparForm();
  save();
}

function limparForm(){
  ["nome","telefone","origem","produto","valor","obs"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("status").value = "Novo lead";
}

function listaClientes(){
  const div = document.getElementById("listaClientes");
  if(clientes.length === 0){
    div.innerHTML = "<p>Nenhum cliente cadastrado ainda.</p>";
    return;
  }

  div.innerHTML = clientes.map(c => `
    <div class="client-card">
      <strong>${c.nome}</strong><br/>
      WhatsApp: ${c.telefone}<br/>
      Produto: ${c.produto || "-"}<br/>
      Valor: ${moeda(c.valor)}<br/>
      Vendedor: ${c.vendedor}<br/>
      Status: <b>${c.status}</b><br/>
      Origem: ${c.origem || "-"}<br/>
      Obs: ${c.obs || "-"}<br/>
      <small>Criado em: ${c.criadoEm}</small>
      <div class="client-actions">
        <button class="whatsapp" onclick="abrirWhatsApp('${c.telefone}','${c.nome}')">WhatsApp</button>
        <button class="edit" onclick="mudarStatus(${c.id})">Alterar status</button>
        <button class="delete" onclick="excluirCliente(${c.id})">Excluir</button>
      </div>
    </div>
  `).join("");
}

function abrirWhatsApp(tel,nome){
  const msg = encodeURIComponent(`Olá, ${nome}! Aqui é da Dellapiani. Podemos continuar seu atendimento?`);
  window.open(`https://wa.me/55${tel}?text=${msg}`, "_blank");
}

function mudarStatus(id){
  const c = clientes.find(x => x.id === id);
  const atual = etapas.indexOf(c.status);
  c.status = etapas[(atual + 1) % etapas.length];
  save();
}

function alterarStatusDireto(id, status){
  const c = clientes.find(x => x.id === id);
  c.status = status;
  save();
}

function excluirCliente(id){
  if(confirm("Deseja excluir este cliente?")){
    clientes = clientes.filter(c => c.id !== id);
    save();
  }
}

function renderKanban(){
  const kanban = document.getElementById("kanban");
  kanban.innerHTML = etapas.map(etapa => {
    const leads = clientes.filter(c => c.status === etapa);
    return `
      <div class="column">
        <h3>${etapa} (${leads.length})</h3>
        ${leads.map(c => `
          <div class="lead">
            <strong>${c.nome}</strong>
            <small>${c.vendedor}</small><br/>
            <small>${moeda(c.valor)}</small>
            <select class="compact" onchange="alterarStatusDireto(${c.id}, this.value)">
              ${etapas.map(e => `<option ${e===c.status?"selected":""}>${e}</option>`).join("")}
            </select>
            <button class="whatsapp" onclick="abrirWhatsApp('${c.telefone}','${c.nome}')">WhatsApp</button>
          </div>
        `).join("")}
      </div>
    `;
  }).join("");
}

function renderDashboard(){
  document.getElementById("totalClientes").innerText = clientes.length;
  document.getElementById("totalOrcamentos").innerText = moeda(clientes.reduce((s,c) => s + Number(c.valor || 0), 0));
  document.getElementById("totalFechados").innerText = clientes.filter(c => c.status === "Pedido fechado").length;
  document.getElementById("totalPerdidos").innerText = clientes.filter(c => c.status === "Perdido").length;

  const ranking = vendedores.map(v => {
    const meus = clientes.filter(c => c.vendedor === v);
    const valor = meus.reduce((s,c) => s + Number(c.valor || 0), 0);
    const fechados = meus.filter(c => c.status === "Pedido fechado").length;
    return {v, total: meus.length, valor, fechados};
  }).sort((a,b) => b.valor - a.valor);

  document.getElementById("ranking").innerHTML = ranking.map(r => `
    <div class="rank-card">
      <strong>${r.v}</strong><br/>
      Clientes: ${r.total} | Fechados: ${r.fechados} | Carteira: ${moeda(r.valor)}
    </div>
  `).join("");
}

function adicionarVendedor(){
  const nome = document.getElementById("novoVendedor").value.trim();
  if(!nome) return alert("Digite o nome do vendedor.");
  vendedores.push(nome);
  document.getElementById("novoVendedor").value = "";
  save();
}

function renderVendedores(){
  const div = document.getElementById("listaVendedores");
  div.innerHTML = vendedores.map((v,i) => `
    <div class="seller-card">
      ${v}
      <button class="delete" onclick="removerVendedor(${i})">Remover</button>
    </div>
  `).join("");
}

function removerVendedor(i){
  if(confirm("Remover vendedor?")){
    vendedores.splice(i,1);
    save();
  }
}

function renderAll(){
  carregarSelectVendedores();
  listaClientes();
  renderKanban();
  renderDashboard();
  renderVendedores();
}

renderAll();
