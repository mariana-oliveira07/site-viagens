document.addEventListener('DOMContentLoaded', function() {

    //======================================
    // 1. FUNÇÕES DE UTILIDADE (HELPER FUNCTIONS)
    //=====================================

    /**
     * Formata um valor numérico para o padrão de moeda brasileira (R$ X.XXX,XX).
     * @param {number} valor - O valor a ser formatado.
     * @returns {string} O valor formatado como moeda.
     */
    function formatarMoeda(valor) {
        // Garante que o valor é um número
        const num = parseFloat(valor) || 0; 
        return 'R$ ' + num.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    /**
     * Formata uma string de data (AAAA-MM-DD) para o padrão brasileiro (DD/MM/AAAA).
     * @param {string} dataString - A string de data ISO (e.g., '2025-12-31').
     * @returns {string} A data formatada.
     */
    function formatarData(dataString) {
        const data = new Date(dataString);
        // Garante que a data é válida antes de formatar
        return isNaN(data) ? '' : data.toLocaleDateString('pt-BR'); 
    }

    //=====================================
    // 2. CONTROLE DE DATAS
    //=====================================

    /**
     * Configura as datas mínimas e a interdependência entre dataInicio e dataFim.
     */
    function initDatePicker() {
        const dataInicioInput = document.getElementById('dataInicio');
        const dataFimInput = document.getElementById('dataFim');

        if (!dataInicioInput || !dataFimInput) return;

        // Configurar data mínima para hoje nos inputs de data
        const hoje = new Date().toISOString().split('T')[0];
        dataInicioInput.min = hoje;
        dataFimInput.min = hoje; // A mínima inicial é hoje

        /**
         * Atualiza a data mínima de término (dataFim) com base na data de início (dataInicio).
         */
        dataInicioInput.addEventListener('change', function() {
            const dataInicio = new Date(this.value);
            
            // Verifica se a data é válida
            if (isNaN(dataInicio.getTime())) return; 

            // Configurar dataFim para ser, no mínimo, a dataInicio + 7 dias (exemplo de regra)
            const dataFimMin = new Date(dataInicio);
            dataFimMin.setDate(dataFimMin.getDate() + 7); 
            
            dataFimInput.min = dataFimMin.toISOString().split('T')[0];
            
            // Se a dataFim atual for anterior à nova dataFim mínima, atualiza o valor
            if (new Date(dataFimInput.value) < dataFimMin) {
                dataFimInput.value = dataFimMin.toISOString().split('T')[0];
            }
        });
    }

    //=====================================
    // 3. CONTROLE DE MODAL E FORMULÁRIO DE GRUPO
    //=====================================

    /**
     * Centraliza a abertura e fechamento do modal.
     */
    function initModalControl() {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalContent = document.querySelector('.modal-content'); // Para evitar fechar ao clicar no conteúdo
        
        // Se o modal não existir, encerra
        if (!modalOverlay) return;

        // Botões que abrem o modal (agora usando uma classe genérica para simplificar)
        document.querySelectorAll('.btn-abrir-modal-grupo').forEach(btn => {
            btn.addEventListener('click', () => modalOverlay.style.display = 'flex');
        });

        // Botões que fecham o modal (close X e Cancelar)
        document.querySelectorAll('#modalClose, #cancelarGrupo').forEach(btn => {
            btn.addEventListener('click', () => modalOverlay.style.display = 'none');
        });
        
        // Fechar modal ao clicar fora (no overlay)
        modalOverlay.addEventListener('click', function(e) {
             // Garante que o clique foi exatamente no overlay, não em um filho
            if (e.target === modalOverlay) { 
                modalOverlay.style.display = 'none';
            }
        });
    }

    /**
     * Lógica de submissão do formulário de criação de grupo.
     */
    function initFormGrupoViagem() {
        const formGrupoViagem = document.getElementById('formGrupoViagem');
        const modalOverlay = document.getElementById('modalOverlay');

        if (!formGrupoViagem) return;

        formGrupoViagem.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Captura de valores (usando optional chaining para segurança)
            const nomeGrupo = document.getElementById('nomeGrupo')?.value || '';
            const qtdPessoas = document.getElementById('qtdPessoas')?.value || '0';
            const dataInicio = document.getElementById('dataInicio')?.value || '';
            const dataFim = document.getElementById('dataFim')?.value || '';
            
            // Validação de intervalo de datas
            if (new Date(dataFim) <= new Date(dataInicio)) {
                alert('A data de término deve ser posterior à data de início!');
                return;
            }
            
            // Simulação de criação do grupo
            alert(`Grupo "${nomeGrupo}" criado com sucesso!\n\nDetalhes:\n- ${qtdPessoas} pessoas\n- De ${formatarData(dataInicio)} até ${formatarData(dataFim)}\n\nUm link de convite será enviado para você compartilhar com seus amigos!`);
            
            // Resetar formulário e fechar modal
            formGrupoViagem.reset();
            if (modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        });
    }
    
    //=====================================
    // 4. BOTÕES DE PERSONALIZAÇÃO DE PACOTE
    //=====================================
    
    /**
     * Lógica para os botões de personalização de pacote.
     */
    function initPacoteButtons() {
        document.querySelectorAll('.btn-pacote').forEach(button => {
            button.addEventListener('click', function() {
                const tipoPacote = this.getAttribute('data-pacote');
                let titulo = 'Pacote Personalizado';
                
                // Mapeamento de pacotes para títulos
                const pacotesMap = {
                    'amigos': 'Pacote para Amigos',
                    'familia': 'Pacote para Família',
                    'casais': 'Pacote para Casais'
                };

                titulo = pacotesMap[tipoPacote] || titulo;

                alert(`Você selecionou o ${titulo}!\n\nEm breve nossa equipe entrará em contato para personalizar este pacote de acordo com as necessidades do seu grupo.`);
            });
        });
    }

    //=====================================
    // 5. CALCULADORA DE CUSTOS
    //=====================================

    /**
     * Executa o cálculo da divisão de custos.
     */
    function calcularDivisaoCustos() {
        // Usamos parseFloat/parseInt com || 0 ou || 1 para garantir valores numéricos válidos
        const totalCustos = parseFloat(document.getElementById('totalCustos')?.value) || 0;
        const numPessoas = parseInt(document.getElementById('numPessoas')?.value) || 1;
        const despesasExtras = parseFloat(document.getElementById('despesasExtras')?.value) || 0;
        
        if (numPessoas < 1) {
            // Não é necessário um 'alert' aqui, mas podemos garantir que o valor mínimo seja 1
            if(document.getElementById('numPessoas')) document.getElementById('numPessoas').value = 1;
            return;
        }
        
        // Fórmulas
        const valorPorPessoa = totalCustos / numPessoas;
        const totalPorPessoaComExtras = valorPorPessoa + despesasExtras;
        const totalGrupo = totalPorPessoaComExtras * numPessoas;
        
        // Atualização dos elementos de exibição
        if (document.getElementById('valorPorPessoa')) {
            document.getElementById('valorPorPessoa').textContent = formatarMoeda(valorPorPessoa);
        }
        if (document.getElementById('totalComExtras')) {
            document.getElementById('totalComExtras').textContent = formatarMoeda(totalPorPessoaComExtras);
        }
        if (document.getElementById('valorTotalGrupo')) {
            document.getElementById('valorTotalGrupo').textContent = formatarMoeda(totalGrupo);
        }
    }

    /**
     * Inicializa os listeners para a calculadora de custos e executa o cálculo inicial.
     */
    function initCalculadoraCustos() {
        const totalCustosInput = document.getElementById('totalCustos');
        const numPessoasInput = document.getElementById('numPessoas');
        const despesasExtrasInput = document.getElementById('despesasExtras');
        
        // Listener para o botão (redundante, mas mantém a estrutura)
        const calcularCustosBtn = document.getElementById('calcularCustos');
        if (calcularCustosBtn) {
            calcularCustosBtn.addEventListener('click', calcularDivisaoCustos);
        }
        
        // Listeners para calcular automaticamente ao alterar valores
        if (totalCustosInput) totalCustosInput.addEventListener('input', calcularDivisaoCustos);
        if (numPessoasInput) numPessoasInput.addEventListener('input', calcularDivisaoCustos);
        if (despesasExtrasInput) despesasExtrasInput.addEventListener('input', calcularDivisaoCustos);

        // Calcular automaticamente ao carregar a página
        calcularDivisaoCustos();
    }

    //=====================================
    // 6. ANIMAÇÃO DE PROGRESSO
    //=====================================

    /**
     * Executa a animação de barras de progresso (uso de CSS Transition).
     */
    function animarBarrasProgresso() {
        const barras = document.querySelectorAll('.progresso-fill');
        
        barras.forEach(barra => {
            const largura = barra.style.width; // Salva o valor final (e.g., '75%')
            barra.style.width = '0%'; // Reseta a largura para o ponto inicial da animação
            
            // Usa setTimeout para garantir que a largura '0%' foi aplicada antes da transição
            setTimeout(() => {
                barra.style.transition = 'width 1.5s ease-in-out'; // Define a transição
                barra.style.width = largura; // Aplica a largura final, disparando a transição
            }, 300); // Pequeno atraso para garantir o repaint
        });
    }

    //=====================================
    // 7. BOTÃO 'VER DETALHES' (SIMULAÇÃO)
    //=====================================

    /**
     * Lógica para os botões "Ver Detalhes" dos cards de grupo.
     * Estes botões geralmente possuem a classe .btn-detalhes.
     */
    function initVerDetalhesBtn() {
        // Altere '.btn-detalhes' para a classe correta do seu botão, se for diferente.
        document.querySelectorAll('.btn-detalhes, .btn.btn-primary').forEach(button => {
            
            // Vamos usar o texto do título do card para identificar o grupo
            const card = button.closest('.card');
            let titulo = 'Este Grupo de Viagem';
            if (card) {
                const tituloElement = card.querySelector('h2, h3, h4'); 
                titulo = tituloElement ? tituloElement.textContent.trim() : titulo;
            }

            button.addEventListener('click', function(e) {
                e.preventDefault();
                // Simulação: Aqui você faria o redirecionamento ou abriria um modal de detalhes
                alert(`Redirecionando para a página de detalhes do grupo: "${titulo}".\n\n(Simulação: Em um projeto real, você usaria o ID do grupo para carregar as informações completas)`);
                
                // Exemplo de redirecionamento real (comentar ou remover em produção se for usar um modal):
                // window.location.href = `/detalhes-grupo?nome=${encodeURIComponent(titulo)}`;
            });
        });
    }


    //=====================================
    // INICIALIZAÇÃO GERAL
    //=====================================

    initDatePicker();
    initModalControl();
    initFormGrupoViagem();
    initPacoteButtons();
    initCalculadoraCustos();
    // 🎯 NOVO: Inicializa o listener do botão "Ver Detalhes"
    initVerDetalhesBtn(); 
    
    // Executar animação após um breve carregamento
    setTimeout(animarBarrasProgresso, 500); 
});

// --- CÓDIGO DA CALCULADORA (SEGUNDO BLOCO) ---

// Certifique-se de que as funções formatar e gerarRelatorio estão acessíveis ou dentro do primeiro bloco.
// Para fins de correção, vamos remover o segundo bloco para evitar a redefinição de 'calcularCustos', 
// mantendo apenas a implementação que está dentro de 'initCalculadoraCustos' no bloco principal. 
// A única função necessária que estava fora do escopo principal é 'formatar' (que já existe como 'formatarMoeda').
// O código abaixo será ignorado/removido para evitar conflitos no seu arquivo final.

// document.getElementById("calcularCustos").addEventListener("click", function () { ...