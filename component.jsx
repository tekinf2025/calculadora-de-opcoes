import React, { useState, useEffect } from 'react';

const CalculadoraOpcoes = () => {
  const [premio, setPremio] = useState('');
  const [strike, setStrike] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  
  const [resultado, setResultado] = useState({
    percentualTotal: 0,
    mesesRestantes: 0,
    percentualMensal: 0,
    retornoMensal: 0,
    retornoTotal: 0
  });

  const calcularMesesRestantes = (dataVenc) => {
    try {
      const hoje = new Date();
      const vencimento = new Date(dataVenc);
      
      if (isNaN(vencimento.getTime())) {
        return 14; // valor padrão
      }
      
      const diffTime = vencimento - hoje;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const meses = Math.ceil(diffDays / 30.44);
      
      return Math.max(1, meses); // mínimo 1 mês
    } catch (error) {
      return 14; // valor padrão em caso de erro
    }
  };

  useEffect(() => {
    // Só calcula se todos os campos estiverem preenchidos
    if (!premio || !strike || !quantidade || !dataVencimento) {
      setResultado({
        percentualTotal: 0,
        mesesRestantes: 0,
        percentualMensal: 0,
        retornoMensal: 0,
        retornoTotal: 0,
        premioTotal: 0,
        strikeTotal: 0,
        valorInvestido: 0
      });
      return;
    }
    
    const meses = calcularMesesRestantes(dataVencimento);
    const premioTotal = parseFloat(premio) * parseFloat(quantidade);
    const strikeTotal = parseFloat(strike) * parseFloat(quantidade);
    const valorInvestido = strikeTotal - premioTotal;
    
    const percentualTotal = strikeTotal > 0 ? (premioTotal / strikeTotal) * 100 : 0;
    const percentualMensal = meses > 0 ? percentualTotal / meses : 0;
    const retornoMensal = (valorInvestido * percentualMensal) / 100;
    const retornoTotal = valorInvestido * (percentualTotal / 100);
    
    setResultado({
      percentualTotal: percentualTotal,
      mesesRestantes: meses,
      percentualMensal: percentualMensal,
      retornoMensal: retornoMensal,
      retornoTotal: retornoTotal,
      premioTotal: premioTotal,
      strikeTotal: strikeTotal,
      valorInvestido: valorInvestido
    });
  }, [premio, strike, quantidade, dataVencimento]);

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

  return (
    <div className="w-full h-full bg-gray-900 text-white p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-400">
          Calculadora de Opções (Tekinformática)
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Dados da Opção</h2>
            
            <div className="space-y-4">
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
              
              <div className="bg-gray-700 p-4 rounded-md border-2 border-yellow-500">
                <div className="text-sm text-gray-300">Valor Investido</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {formatCurrency(resultado.valorInvestido)}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-md">
                <div className="text-sm text-gray-300">Percentual Total</div>
                <div className="text-xl font-bold text-green-400">
                  {formatPercent(resultado.percentualTotal)}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-md">
                <div className="text-sm text-gray-300">Meses Restantes</div>
                <div className="text-xl font-bold text-blue-400">
                  {resultado.mesesRestantes} meses
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-md">
                <div className="text-sm text-gray-300">Rentabilidade Mensal</div>
                <div className="text-xl font-bold text-purple-400">
                  {formatPercent(resultado.percentualMensal)}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-md">
                <div className="text-sm text-gray-300">Retorno Mensal</div>
                <div className="text-xl font-bold text-green-400">
                  {formatCurrency(resultado.retornoMensal)}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-md border-2 border-green-500">
                <div className="text-sm text-gray-300">Retorno Total Esperado</div>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(resultado.retornoTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fórmula */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-purple-300">Fórmula Utilizada</h3>
          <div className="text-gray-300 space-y-2">
            <p>1. <strong>Prêmio Total:</strong> Prêmio × Quantidade</p>
            <p>2. <strong>Strike Total:</strong> Strike × Quantidade</p>
            <p>3. <strong>Valor Investido:</strong> Strike Total - Prêmio Total</p>
            <p>4. <strong>Percentual Total:</strong> (Prêmio Total ÷ Strike Total) × 100</p>
            <p>5. <strong>Rentabilidade Mensal:</strong> Percentual Total ÷ Meses Restantes</p>
            <p>6. <strong>Retorno em R$:</strong> Valor Investido × Percentual</p>
          </div>
        </div>
        
        {/* Exemplo atual */}
        <div className="mt-6 bg-blue-900 rounded-lg p-4 border border-blue-700">
          <h4 className="font-semibold text-blue-300 mb-2">Cálculo Atual:</h4>
          <p className="text-sm text-blue-100">
            Investido: {formatCurrency(resultado.strikeTotal)} - {formatCurrency(resultado.premioTotal)} = {formatCurrency(resultado.valorInvestido)} | 
            Rentabilidade: {formatPercent(resultado.percentualTotal)} ÷ {resultado.mesesRestantes} meses = {formatPercent(resultado.percentualMensal)} ao mês
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalculadoraOpcoes;