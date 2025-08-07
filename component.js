// <stdin>
import React, { useState, useEffect } from "https://esm.sh/react@18.2.0";
var CalculadoraOpcoes = () => {
  const [premio, setPremio] = useState("");
  const [strike, setStrike] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [resultado, setResultado] = useState({
    percentualTotal: 0,
    mesesRestantes: 0,
    percentualMensal: 0,
    retornoMensal: 0,
    retornoTotal: 0
  });
  const calcularMesesRestantes = (dataVenc) => {
    try {
      const hoje = /* @__PURE__ */ new Date();
      const vencimento = new Date(dataVenc);
      if (isNaN(vencimento.getTime())) {
        return 14;
      }
      const diffTime = vencimento - hoje;
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      const meses = Math.ceil(diffDays / 30.44);
      return Math.max(1, meses);
    } catch (error) {
      return 14;
    }
  };
  useEffect(() => {
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
    const percentualTotal = strikeTotal > 0 ? premioTotal / strikeTotal * 100 : 0;
    const percentualMensal = meses > 0 ? percentualTotal / meses : 0;
    const retornoMensal = valorInvestido * percentualMensal / 100;
    const retornoTotal = valorInvestido * (percentualTotal / 100);
    setResultado({
      percentualTotal,
      mesesRestantes: meses,
      percentualMensal,
      retornoMensal,
      retornoTotal,
      premioTotal,
      strikeTotal,
      valorInvestido
    });
  }, [premio, strike, quantidade, dataVencimento]);
  const formatCurrency = (value) => {
    try {
      if (isNaN(value) || value === null || value === void 0) {
        return "R$ 0,00";
      }
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(value);
    } catch (error) {
      return `R$ ${value.toFixed(2)}`;
    }
  };
  const formatPercent = (value) => {
    try {
      if (isNaN(value) || value === null || value === void 0) {
        return "0,00%";
      }
      return `${value.toFixed(2)}%`;
    } catch (error) {
      return "0,00%";
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "w-full h-full bg-gray-900 text-white p-6 overflow-auto" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mx-auto" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold text-center mb-8 text-purple-400" }, "Calculadora de Op\xE7\xF5es (Tekinform\xE1tica)"), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-gray-800 rounded-lg p-6 border border-gray-700" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-semibold mb-4 text-purple-300" }, "Dados da Op\xE7\xE3o"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-2 text-gray-300" }, "Quantidade"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      value: quantidade,
      onChange: (e) => setQuantidade(e.target.value),
      placeholder: "Digite a quantidade",
      className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-2 text-gray-300" }, "Valor do Pr\xEAmio (R$)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      step: "0.01",
      value: premio,
      onChange: (e) => setPremio(e.target.value),
      placeholder: "Ex: 4.12",
      className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-2 text-gray-300" }, "Strike (R$)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      step: "0.01",
      value: strike,
      onChange: (e) => setStrike(e.target.value),
      placeholder: "Ex: 19.61",
      className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-2 text-gray-300" }, "Data de Vencimento"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      value: dataVencimento,
      onChange: (e) => setDataVencimento(e.target.value),
      className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
    }
  )))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-800 rounded-lg p-6 border border-gray-700" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-semibold mb-4 text-green-300" }, "Resultados"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Pr\xEAmio Total"), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-red-400" }, formatCurrency(resultado.premioTotal))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Strike Total"), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-blue-400" }, formatCurrency(resultado.strikeTotal))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md border-2 border-yellow-500" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Valor Investido"), /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-yellow-400" }, formatCurrency(resultado.valorInvestido))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Percentual Total"), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-green-400" }, formatPercent(resultado.percentualTotal))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Meses Restantes"), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-blue-400" }, resultado.mesesRestantes, " meses")), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Rentabilidade Mensal"), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-purple-400" }, formatPercent(resultado.percentualMensal))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Retorno Mensal"), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-green-400" }, formatCurrency(resultado.retornoMensal))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md border-2 border-green-500" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Retorno Total Esperado"), /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-green-400" }, formatCurrency(resultado.retornoTotal)))))), /* @__PURE__ */ React.createElement("div", { className: "mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-3 text-purple-300" }, "F\xF3rmula Utilizada"), /* @__PURE__ */ React.createElement("div", { className: "text-gray-300 space-y-2" }, /* @__PURE__ */ React.createElement("p", null, "1. ", /* @__PURE__ */ React.createElement("strong", null, "Pr\xEAmio Total:"), " Pr\xEAmio \xD7 Quantidade"), /* @__PURE__ */ React.createElement("p", null, "2. ", /* @__PURE__ */ React.createElement("strong", null, "Strike Total:"), " Strike \xD7 Quantidade"), /* @__PURE__ */ React.createElement("p", null, "3. ", /* @__PURE__ */ React.createElement("strong", null, "Valor Investido:"), " Strike Total - Pr\xEAmio Total"), /* @__PURE__ */ React.createElement("p", null, "4. ", /* @__PURE__ */ React.createElement("strong", null, "Percentual Total:"), " (Pr\xEAmio Total \xF7 Strike Total) \xD7 100"), /* @__PURE__ */ React.createElement("p", null, "5. ", /* @__PURE__ */ React.createElement("strong", null, "Rentabilidade Mensal:"), " Percentual Total \xF7 Meses Restantes"), /* @__PURE__ */ React.createElement("p", null, "6. ", /* @__PURE__ */ React.createElement("strong", null, "Retorno em R$:"), " Valor Investido \xD7 Percentual"))), /* @__PURE__ */ React.createElement("div", { className: "mt-6 bg-blue-900 rounded-lg p-4 border border-blue-700" }, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-blue-300 mb-2" }, "C\xE1lculo Atual:"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-blue-100" }, "Investido: ", formatCurrency(resultado.strikeTotal), " - ", formatCurrency(resultado.premioTotal), " = ", formatCurrency(resultado.valorInvestido), " | Rentabilidade: ", formatPercent(resultado.percentualTotal), " \xF7 ", resultado.mesesRestantes, " meses = ", formatPercent(resultado.percentualMensal), " ao m\xEAs"))));
};
var stdin_default = CalculadoraOpcoes;
export {
  stdin_default as default
};
