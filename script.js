// Banco de dados simulado contendo os principais itens representados na sua logo
const produtos = [
    { id: 1, nome: "Sacola Kraft Reforçada (C/ 50 un)", preco: 45.00, imagem: "https://unsplash.com" },
    { id: 2, nome: "Copo Plástico Bolha Premium 400ml (C/ 100 un)", preco: 38.90, imagem: "https://unsplash.com" },
    { id: 3, nome: "Pote de Isopor para Delivery 500ml (C/ 50 un)", preco: 29.90, imagem: "https://unsplash.com" },
    { id: 4, nome: "Bobina Filme Stretch Manual 50cm x 200m", preco: 55.00, imagem: "https://unsplash.com" }
];

let carrinho = [];

// Renderiza o Catálogo de Produtos na Tela
function carregarProdutos() {
    const container = document.getElementById('produtos-container');
    container.innerHTML = '';
    
    produtos.forEach(prod => {
        container.innerHTML += `
            <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col justify-between">
                <img src="${prod.imagem}" alt="${prod.nome}" class="w-full h-48 object-cover">
                <div class="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <h4 class="font-bold text-gray-900 text-base mb-2">${prod.nome}</h4>
                        <p class="text-xl font-black text-[#0B0F19] mb-4">R$ ${prod.preco.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button onclick="adicionarAoCarrinho(${prod.id})" class="w-full bg-[#0B0F19] hover:bg-[#00D2FF] hover:text-[#0B0F19] text-white font-bold py-2 rounded-lg transition cursor-pointer text-sm">
                        <i class="fa-solid fa-cart-plus mr-2"></i>Adicionar
                    </button>
                </div>
            </div>
        `;
    });
}

function toggleCarrinho() {
    const modal = document.getElementById('carrinho-modal');
    modal.classList.toggle('hidden');
}

function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    const itemNoCarrinho = carrinho.find(item => item.id === id);

    if (itemNoCarrinho) {
        itemNoCarrinho.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const countSpan = document.getElementById('cart-count');
    const itensContainer = document.getElementById('itens-carrinho');
    const totalSpan = document.getElementById('total-carrinho');
    
    let totalItens = 0;
    let totalValor = 0;
    itensContainer.innerHTML = '';

    carrinho.forEach(item => {
        totalItens += item.quantidade;
        totalValor += (item.preco * item.quantidade);
        
        itensContainer.innerHTML += `
            <div class="flex justify-between items-center border-b pb-2">
                <div>
                    <h5 class="font-bold text-sm text-gray-800">${item.nome}</h5>
                    <p class="text-xs text-gray-500">Qtd: ${item.quantidade} x R$ ${item.preco.toFixed(2)}</p>
                </div>
                <button onclick="removerDoCarrinho(${item.id})" class="text-red-500 hover:text-red-700 font-bold text-sm cursor-pointer">Remover</button>
            </div>
        `;
    });

    countSpan.innerText = totalItens;
    totalSpan.innerText = `R$ ${totalValor.toFixed(2).replace('.', ',')}`;
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarCarrinho();
}

// Fluxo 1: Link para o ambiente de Pagamento Online Direto
function checkoutOnline() {
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");
    alert("Redirecionando de forma segura para o Checkout de Pagamento (Mercado Pago / Asaas)...");
    // Aqui você integrará a URL de pagamento da sua API geradora de cobranças
}

// Fluxo 2: Transbordo de Atacado para o WhatsApp fornecido
function enviarWhatsApp() {
    if (carrinho.length === 0) return alert("Adicione itens para negociar!");
    let mensagem = "Olá Elite Embalagens! Gostaria de um orçamento para o seguinte pedido corporativo:\n\n";
    carrinho.forEach(item => {
        mensagem += `• ${item.nome} (Qtd: ${item.quantidade})\n`;
    });
    const url = `https://wa.me{encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Inicializa ao carregar a página
window.onload = carregarProdutos;
