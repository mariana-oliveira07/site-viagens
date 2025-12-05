//=====================================
// VARIÁVEIS GLOBAIS
//=====================================
let currentSlide = 0;
let slideInterval;
const AUTO_SLIDE_TIME = 5000; // Tempo em milissegundos

// Elementos DOM (inicializados no DOMContentLoaded)
let slides;
let dots;
let totalSlides = 0;

//=====================================
// 1. FUNCIONALIDADES DO SLIDER
//=====================================

/**
 * Inicializa o slider: captura elementos, configura botões, dots e autoplay.
 */
function initSlider() {
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.slider-dot');
    totalSlides = slides.length;

    if (totalSlides === 0) return;

    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const sliderContainer = document.querySelector('.slider-container');

    // Navegação por botões (next/prev)
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Navegação por dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // Pausar o slider no hover para melhor UX
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        sliderContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Iniciar o ciclo de autoplay
    startAutoPlay();
}

/**
 * Inicia o ciclo de autoplay do slider.
 */
function startAutoPlay() {
    clearInterval(slideInterval); // Garante que apenas um intervalo está rodando
    slideInterval = setInterval(nextSlide, AUTO_SLIDE_TIME);
}

/**
 * Move para o próximo slide.
 */
function nextSlide() {
    // Usando as variáveis globais 'slides' e 'totalSlides'
    if (totalSlides === 0) return;
    
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

/**
 * Move para o slide anterior.
 */
function prevSlide() {
    if (totalSlides === 0) return;
    
    // (A + N - 1) % N evita números negativos no módulo
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

/**
 * Move para um slide específico pelo índice.
 * @param {number} index - O índice do slide de destino.
 */
function goToSlide(index) {
    if (totalSlides === 0) return;
    
    currentSlide = index;
    updateSlider();
}

/**
 * Aplica a classe 'active' ao slide e dot atual e reinicia o autoplay.
 */
function updateSlider() {
    if (totalSlides === 0) return;

    // Remove 'active' de todos os slides e dots de forma eficiente
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Adiciona 'active' ao slide e dot atual
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }
    
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
    
    // Reinicia o intervalo após qualquer interação manual
    startAutoPlay();
}

//=====================================
// 2. MENU RESPONSIVO
//=====================================

/**
 * Inicializa o menu mobile, gerenciando a abertura/fechamento e o ícone.
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (!mobileMenuBtn || !navMenu) return;
    
    const toggleMenu = () => {
        const isActive = navMenu.classList.toggle('active');
        
        // Alterna o ícone (Hamburger <-> X)
        mobileMenuBtn.innerHTML = isActive 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
        
        // Configura o atributo ARIA para acessibilidade
        mobileMenuBtn.setAttribute('aria-expanded', isActive);
    };
    
    mobileMenuBtn.addEventListener('click', toggleMenu);
    
    // Fechar menu ao clicar em um link (navegação)
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu(); // Chama a função toggle para fechar e reverter o ícone
            }
        });
    });
}

//=====================================
// 3. FILTRO DE DESTINOS
//=====================================

/**
 * Inicializa a funcionalidade de filtragem de destinos.
 */
function initDestinosFilter() {
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const destinoCards = document.querySelectorAll('.destino-card');
    
    if (filtroBtns.length === 0 || destinoCards.length === 0) return;
    
    filtroBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove a classe 'active' de todos e adiciona ao botão clicado
            filtroBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active'); // 'this' refere-se ao botão que foi clicado
            
            const filter = this.getAttribute('data-filter');
            
            // Filtrar destinos
            destinoCards.forEach(card => {
                const categoria = card.getAttribute('data-categoria');
                
                // Usa 'includes' para filtros mais complexos, mas '==' para exatidão
                const shouldShow = filter === 'todos' || categoria === filter;
                
                // Melhor usar classes CSS para transições de exibição
                card.style.display = shouldShow ? 'block' : 'none';
            });
        });
    });
}

//=====================================
// 4. FORMULÁRIO DE CONTATO
//=====================================

/**
 * Inicializa a lógica de validação e simulação de envio do formulário de contato.
 */
function initContactForm() {
    // Usando o ID 'contactForm' que geralmente é adicionado em formulários
    const contactForm = document.getElementById('contactForm'); 
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validação de e-mail mais robusta
        const emailInput = document.getElementById('email');
        if (emailInput && !emailInput.value.includes('@')) {
             alert('Por favor, insira um endereço de e-mail válido.');
             emailInput.focus();
             return;
        }

        // Validação simples de campos obrigatórios
        const nome = document.getElementById('nome')?.value;
        const mensagem = document.getElementById('mensagem')?.value;
        
        if (!nome || !emailInput?.value || !mensagem) {
             alert('Por favor, preencha todos os campos obrigatórios (*).');
             return;
        }
        
        // Simulação de envio
        const destinatario = nome.split(' ')[0]; // Pega o primeiro nome
        alert(`Sucesso! Obrigado, ${destinatario}.\nSua solicitação foi enviada.\nEntraremos em contato em breve.`);
        
        // Resetar formulário
        contactForm.reset();
    });
}


//=====================================
// 5. SETUP INICIAL E ATIVAÇÃO DE LINK
//=====================================

/**
 * Função principal que é executada após o carregamento completo do DOM.
 */
document.addEventListener('DOMContentLoaded', function() {
    initSlider();
    initMobileMenu();
    initDestinosFilter();
    initContactForm();
    
    // Adicionar classe active ao link do menu atual
    setActiveNavLink();
});

/**
 * Define o link de navegação ativo com base na URL atual.
 */
function setActiveNavLink() {
    const path = window.location.pathname;
    // Pega o nome do arquivo (ex: 'contato.html') ou 'index.html' se for a raiz
    const currentPage = path.split('/').pop() || 'index.html'; 
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        // Pega o nome do arquivo do link
        const linkHref = link.getAttribute('href').split('/').pop();

        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}