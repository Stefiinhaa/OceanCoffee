document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS DOS PRODUTOS ---
    const allProducts = [
        { id: 1, title: 'Trator New Holland T6.130', description: 'Ano 2021 | 130cv | Seminovo', price: 'R$ 350.000', image: 'IMG/Produto.png', alt: 'Trator New Holland T6.130 azul', category: 'Tratores' },
        { id: 2, title: 'Trator Valtra A750', description: 'Ano 2003 | 75cv | 4x4', price: 'R$ 110.000', image: 'IMG/tratorr.png', alt: 'Trator Valtra vermelho', category: 'Tratores' },
        { id: 3, title: 'Rolo Faca para Café', description: '1.8 Metros | RIG Implementos', price: 'R$ 33.250', image: 'IMG/tator.png', alt: 'Implemento agrícola rolo faca', category: 'Implementos' },
        { id: 4, title: 'Colheitadeira TC 5090', description: 'Ano 2023 | New Holland', price: 'R$ 1.250.000', image: 'IMG/colheitadeira.png', alt: 'Colheitadeira de grãos amarela', category: 'Colheitadeiras' },
        { id: 5, title: 'Pulverizador Jacto 2000L', description: 'Modelo Condor | Usado', price: 'R$ 180.000', image: 'IMG/pulverizador.png', alt: 'Pulverizador agrícola branco', category: 'Pulverizadores' },
        { id: 6, title: 'Trator John Deere 6110J', description: 'Ano 2018 | 110cv | Completo', price: 'R$ 280.000', image: 'IMG/Produto.png', alt: 'Trator John Deere verde', category: 'Tratores' },
    ];

    // --- ELEMENTOS DO DOM ---
    const productGrid = document.getElementById('productGrid');
    const categoryFiltersContainer = document.getElementById('categoryFilters');

    // --- FUNÇÕES DE RENDERIZAÇÃO ---

    // MUDANÇA: A função agora também recebe o "index" (a posição do produto na lista)
    const createProductCard = (product, index) => {
        const card = document.createElement('div');
        card.className = 'oc-product-card';

        // ============================================================================
        // NOVO: LÓGICA DE DIRECIONAMENTO ESPECIAL
        // Verificamos se o índice do produto é 1 (o que corresponde ao segundo item).
        const isSecondProduct = (index === 1); 
        
        // Se for o segundo produto, a URL será 'marketplace.html'.
        // Caso contrário, será a URL normal com o ID do produto.
        const productUrl = isSecondProduct 
            ? 'marketplace.html' 
            : `product-detail.html?id=${product.id}`;
        // ============================================================================

        // Agora, usamos a variável "productUrl" em todos os links do card.
        card.innerHTML = `
            <a href="${productUrl}" class="oc-product-card__image-container" aria-label="Ver detalhes de ${product.title}">
                <img class="oc-product-card__image" src="${product.image}" alt="${product.alt}" loading="lazy" decoding="async">
            </a>
            <div class="oc-product-card__content">
                <h3 class="oc-product-card__title">
                    <a href="${productUrl}" style="text-decoration: none; color: inherit;">${product.title}</a>
                </h3>
                <p class="oc-product-card__description">${product.description}</p>
                <div class="oc-product-card__footer">
                    <span class="oc-product-card__price">${product.price}</span>
                    <a href="${productUrl}" class="oc-product-card__button">Ver Mais</a>
                </div>
            </div>`;
        return card;
    };

    const renderProducts = (products) => {
        if (!productGrid) return;
        productGrid.innerHTML = ''; 

        if (products.length === 0) {
            productGrid.innerHTML = '<p>Nenhum produto encontrado nesta categoria.</p>';
            return;
        }

        products.forEach((product, index) => {
            // MUDANÇA: Passamos tanto o "produto" quanto o seu "index" para a função que cria o card.
            const card = createProductCard(product, index);
            card.style.animationDelay = `${index * 80}ms`;
            productGrid.appendChild(card);
        });
    };

    // --- LÓGICA DE FILTRAGEM ---

    const renderFilterButtons = () => {
        if (!categoryFiltersContainer) return;

        const categories = ['Todos', ...new Set(allProducts.map(p => p.category))];

        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'oc-filter-button';
            button.textContent = category;
            button.dataset.category = category;
            if (category === 'Todos') {
                button.classList.add('active');
            }
            categoryFiltersContainer.appendChild(button);
        });
    };

    const handleFilterClick = (event) => {
        const clickedButton = event.target.closest('.oc-filter-button');
        if (!clickedButton) return;

        document.querySelectorAll('.oc-filter-button').forEach(btn => btn.classList.remove('active'));
        clickedButton.classList.add('active');

        const selectedCategory = clickedButton.dataset.category;

        const filteredProducts = selectedCategory === 'Todos'
            ? allProducts
            : allProducts.filter(product => product.category === selectedCategory);
        
        // Renderiza os produtos filtrados (a lógica de link especial vai funcionar aqui também)
        renderProducts(filteredProducts);
    };

    // --- INICIALIZAÇÃO ---
    const init = () => {
        if (!productGrid || !categoryFiltersContainer) {
            console.error('Elementos essenciais (grid ou filtros) não encontrados.');
            return;
        }
        renderFilterButtons();
        renderProducts(allProducts); 
        categoryFiltersContainer.addEventListener('click', handleFilterClick);
    };

    init();
});