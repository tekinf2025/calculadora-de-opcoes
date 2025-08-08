import React, { useState, useEffect } from 'react';

const CalculadoraOpcoes = () => {
  // Estados para CALL (venda)
  const [codigoCall, setCodigoCall] = useState('');
  const [premio, setPremio] = useState('');
  const [strike, setStrike] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  
  // Estados para PUT (compra - proteção)
  const [codigoPut, setCodigoPut] = useState('');
  const [putQuantidade, setPutQuantidade] = useState('');
  const [putPremio, setPutPremio] = useState('');
  const [putStrike, setPutStrike] = useState('');
  const [putDataVencimento, setPutDataVencimento] = useState('');
  
  const [resultado, setResultado] = useState({
    percentualTotal: 0,
    diasRestantes: 0,
    mesesRestantes: 0,
    percentualMensal: 0,
    retornoMensal: 0,
    retornoTotal: 0
  });

  const calcularDiasEMeses = (dataVenc) => {
    try {
      const hoje = new Date();
      const vencimento = new Date(dataVenc);
      
      if (isNaN(vencimento.getTime())) {
        return { dias: 30, meses: 1 }; // valor padrão
      }
      
      const diffTime = vencimento - hoje;
      const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const meses = dias / 30.44; // conversão mais precisa para meses
      
      return { 
        dias: Math.max(1, dias), 
        meses: Math.max(0.1, meses) 
      };
    } catch (error) {
      return { dias: 30, meses: 1 }; // valor padrão em caso de erro
    }
  };

  useEffect(() => {
    // Só calcula se pelo menos os campos da CALL estiverem preenchidos
    if (!premio || !strike || !quantidade || !dataVencimento) {
      setResultado({
        percentualTotal: 0,
        diasRestantes: 0,
        mesesRestantes: 0,
        percentualMensal: 0,
        retornoMensal: 0,
        retornoTotal: 0,
        premioTotal: 0,
        strikeTotal: 0,
        valorInvestido: 0,
        valorTotalInvestido: 0,
        putPremioTotal: 0,
        custoProtecao: 0,
        lucroLiquido: 0,
        rentabilidadeLiquida: 0,
        retornoMensalLiquido: 0
      });
      return;
    }
    
    const { dias, meses } = calcularDiasEMeses(dataVencimento);
    
    // Cálculos da CALL (venda)
    const premioTotal = parseFloat(premio) * parseFloat(quantidade);
    const strikeTotal = parseFloat(strike) * parseFloat(quantidade);
    const valorInvestido = strikeTotal - premioTotal;
    
    // Cálculos da PUT (compra - proteção)
    let putPremioTotal = 0;
    if (putPremio && putQuantidade) {
      putPremioTotal = parseFloat(putPremio) * parseFloat(putQuantidade);
    }
    
    // Cálculos finais
    const valorTotalInvestido = valorInvestido + putPremioTotal; // Valor investido + custo da proteção
    const lucroLiquido = premioTotal - putPremioTotal; // Receita da CALL menos custo da PUT
    
    // CORREÇÃO: Rentabilidade baseada no lucro líquido sobre o valor total investido
    const percentualTotal = valorTotalInvestido > 0 ? (lucroLiquido / valorTotalInvestido) * 100 : 0;
    const percentualMensal = meses > 0 ? percentualTotal / meses : 0;
    const retornoMensal = (valorTotalInvestido * percentualMensal) / 100;
    const retornoTotal = lucroLiquido; // O retorno total é o próprio lucro líquido
    
    // Para compatibilidade, mantemos os valores líquidos iguais aos principais
    const rentabilidadeLiquida = percentualTotal;
    const rentabilidadeMensalLiquida = percentualMensal;
    const retornoMensalLiquido = retornoMensal;
    
    setResultado({
      percentualTotal: percentualTotal,
      diasRestantes: dias,
      mesesRestantes: meses,
      percentualMensal: percentualMensal,
      retornoMensal: retornoMensal,
      retornoTotal: retornoTotal,
      premioTotal: premioTotal,
      strikeTotal: strikeTotal,
      valorInvestido: valorInvestido,
      valorTotalInvestido: valorTotalInvestido,
      putPremioTotal: putPremioTotal,
      custoProtecao: putPremioTotal,
      lucroLiquido: lucroLiquido,
      rentabilidadeLiquida: rentabilidadeLiquida,
      rentabilidadeMensalLiquida: rentabilidadeMensalLiquida,
      retornoMensalLiquido: retornoMensalLiquido
    });
  }, [premio, strike, quantidade, dataVencimento, putPremio, putQuantidade, putStrike, putDataVencimento]);

  const formatCurrency = (value) => {
    try {
      if (isNaN(value) || value === null || value === undefined) {
        return 'R$ 0,00';
      }
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    } catch (error) {
      return `R$ ${value.toFixed(2)}`;
    }
  };

  const formatPercent = (value) => {
    try {
      if (isNaN(value) || value === null || value === undefined) {
        return '0,00%';
      }
      return `${value.toFixed(2)}%`;
    } catch (error) {
      return '0,00%';
    }
  };

  // Função para exportar dados para CSV
  const exportarCSV = () => {
    const dados = {
      codigoCall,
      quantidade,
      premio,
      strike,
      dataVencimento,
      codigoPut,
      putQuantidade,
      putPremio,
      putStrike,
      putDataVencimento
    };
    
    const csvHeader = 'Codigo_CALL,Quantidade_CALL,Premio_CALL,Strike_CALL,Data_Vencimento_CALL,Codigo_PUT,Quantidade_PUT,Premio_PUT,Strike_PUT,Data_Vencimento_PUT\n';
    const csvRow = `${dados.codigoCall || ''},${dados.quantidade || ''},${dados.premio || ''},${dados.strike || ''},${dados.dataVencimento || ''},${dados.codigoPut || ''},${dados.putQuantidade || ''},${dados.putPremio || ''},${dados.putStrike || ''},${dados.putDataVencimento || ''}\n`;
    
    const csvContent = csvHeader + csvRow;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `opcoes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para importar dados do CSV
  const importarCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n');
        
        if (lines.length >= 2) {
          const data = lines[1].split(',');
          
          // Mapeia os dados do CSV para os estados
          if (data.length >= 10) {
            setCodigoCall(data[0] || '');
            setQuantidade(data[1] || '');
            setPremio(data[2] || '');
            setStrike(data[3] || '');
            setDataVencimento(data[4] || '');
            setCodigoPut(data[5] || '');
            setPutQuantidade(data[6] || '');
            setPutPremio(data[7] || '');
            setPutStrike(data[8] || '');
            setPutDataVencimento(data[9] || '');
          }
        }
      } catch (error) {
        alert('Erro ao importar CSV. Verifique o formato do arquivo.');
      }
    };
    
    reader.readAsText(file);
    
    // Limpa o input para permitir reimportar o mesmo arquivo
    event.target.value = '';
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-400">
          Calculadora de Opções (Tekinformática)
        </h1>
        
        {/* Botões de Import/Export */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <button
            onClick={exportarCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            📤 Salvar Dados
          </button>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer transition-colors">
            📥 Puxar Dados
            <input
              type="file"
              accept=".csv"
              onChange={importarCSV}
              className="hidden"
            />
          </label>
          
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja limpar todos os campos?')) {
                setCodigoCall('');
                setQuantidade('');
                setPremio('');
                setStrike('');
                setDataVencimento('');
                setCodigoPut('');
                setPutQuantidade('');
                setPutPremio('');
                setPutStrike('');
                setPutDataVencimento('');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            🗑️ Limpar Dados
          </button>
        </div>
        
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {/* Inputs CALL */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-green-300">📈 CALL (Venda)</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Código da CALL
                </label>
                <input
                  type="text"
                  value={codigoCall}
                  onChange={(e) => setCodigoCall(e.target.value)}
                  placeholder="Ex: PETRK240"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Quantidade
                </label>
                <input
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  placeholder="Digite a quantidade"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Valor do Prêmio (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={premio}
                  onChange={(e) => setPremio(e.target.value)}
                  placeholder="Ex: 4.12"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Strike (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={strike}
                  onChange={(e) => setStrike(e.target.value)}
                  placeholder="Ex: 19.61"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  value={dataVencimento}
                  onChange={(e) => setDataVencimento(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
          
          {/* Inputs PUT */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-red-300">📉 PUT (Compra - Proteção)</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Código da PUT
                </label>
                <input
                  type="text"
                  value={codigoPut}
                  onChange={(e) => setCodigoPut(e.target.value)}
                  placeholder="Ex: PETRO200"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Quantidade
                </label>
                <input
                  type="number"
                  value={putQuantidade}
                  onChange={(e) => setPutQuantidade(e.target.value)}
                  placeholder="Digite a quantidade"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Compra do Prêmio (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={putPremio}
                  onChange={(e) => setPutPremio(e.target.value)}
                  placeholder="Ex: 2.50"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Strike (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={putStrike}
                  onChange={(e) => setPutStrike(e.target.value)}
                  placeholder="Ex: 15.00"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  value={putDataVencimento}
                  onChange={(e) => setPutDataVencimento(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
          
          {/* Resultados */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-green-300">Resultados</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-md">
                <div className="text-sm text-gray-300">Prêmio Total</div>
                <div className="text-xl font-bold text-red-400">
                  {formatCurrency(resultado.premioTotal)}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-md">
                <div className="text-sm text-gray-300">Strike Total</div>
                <div className="text-xl font-bold text-blue-400">
                  {formatCurrency(resultado.strikeTotal)}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-md">
                <div className="text-sm text-gray-300">Valor Investido (só CALL)</div>
                <div className="text-xl font-bold text-yellow-400">
                  {formatCurrency(resultado.valorInvestido)}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-md border-2 border-orange-500">
                <div className="text-sm text-gray-300">Valor Total Investido</div>
                <div className="text-2xl font-bold text-orange-400">
                  {formatCurrency(resultado.valorTotalInvestido)}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-md">
                <div className="text-sm text-gray-300">Rentabilidade Total</div>
                <div className="text-xl font-bold text-green-400">
                  {formatPercent(resultado.percentualTotal)}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-md">
                <div className="text-sm text-gray-300">Dias Restantes</div>
                <div className="text-xl font-bold text-orange-400">
                  {resultado.diasRestantes} dias
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-md">
                <div className="text-sm text-gray-300">Meses (Decimal)</div>
                <div className="text-xl font-bold text-blue-400">
                  {resultado.mesesRestantes.toFixed(2)} meses
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-md border-2 border-purple-500">
                <div className="text-sm text-gray-300">Rentabilidade Mensal</div>
                <div className="text-2xl font-bold text-purple-400">
                  {formatPercent(resultado.percentualMensal)}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-md border-2 border-green-500">
                <div className="text-sm text-gray-300">Retorno Mensal</div>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(resultado.retornoMensal)}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-md">
                <div className="text-sm text-gray-300">Custo da Proteção (PUT)</div>
                <div className="text-xl font-bold text-red-400">
                  -{formatCurrency(resultado.custoProtecao)}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-md border-2 border-cyan-500">
                <div className="text-sm text-gray-300">Lucro Líquido</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {formatCurrency(resultado.lucroLiquido)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fórmula */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-purple-300">Fórmula Utilizada</h3>
          <div className="text-gray-300 space-y-2">
            <p><strong>CALL (Venda):</strong></p>
            <p>1. <strong>Prêmio Total CALL:</strong> Prêmio × Quantidade</p>
            <p>2. <strong>Strike Total:</strong> Strike × Quantidade</p>
            <p>3. <strong>Valor Investido:</strong> Strike Total - Prêmio Total CALL</p>
            <p className="mt-4"><strong>PUT (Proteção):</strong></p>
            <p>4. <strong>Custo da Proteção:</strong> Prêmio PUT × Quantidade PUT</p>
            <p>5. <strong>Valor Total Investido:</strong> Valor Investido CALL + Custo PUT</p>
            <p>6. <strong>Lucro Líquido:</strong> Prêmio CALL - Custo PUT</p>
            <p>7. <strong>Rentabilidade Total:</strong> (Lucro Líquido ÷ Valor Total Investido) × 100</p>
            <p>8. <strong>Rentabilidade Mensal:</strong> Rentabilidade Total ÷ Meses</p>
            <p>9. <strong>Retorno Mensal:</strong> Valor Total Investido × Rentabilidade Mensal</p>
          </div>
        </div>
        
        {/* Exemplo atual */}
        <div className="mt-6 bg-blue-900 rounded-lg p-4 border border-blue-700">
          <h4 className="font-semibold text-blue-300 mb-2">Cálculo Atual:</h4>
          <div className="text-sm text-blue-100 space-y-1">
            <p><strong>Cálculo:</strong> Lucro Líquido (R$ {resultado.lucroLiquido ? resultado.lucroLiquido.toFixed(2) : '0,00'}) ÷ Valor Total Investido (R$ {resultado.valorTotalInvestido ? resultado.valorTotalInvestido.toFixed(2) : '0,00'}) = {formatPercent(resultado.percentualTotal)}</p>
            <p><strong>Rentabilidade Mensal:</strong> {formatPercent(resultado.percentualTotal)} ÷ {resultado.mesesRestantes.toFixed(2)} meses = {formatPercent(resultado.percentualMensal)}</p>
            <p><strong>Período:</strong> {resultado.diasRestantes} dias ({resultado.mesesRestantes.toFixed(2)} meses)</p>
            <p><strong>Retorno em R$:</strong> R$ {resultado.retornoMensal ? resultado.retornoMensal.toFixed(2) : '0,00'} por mês</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculadoraOpcoes;
