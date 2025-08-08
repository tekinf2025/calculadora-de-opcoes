// <stdin>
import React, { useState, useEffect } from "https://esm.sh/react@18.2.0";
var CalculadoraOpcoes = () => {
  const [codigoCall, setCodigoCall] = useState("");
  const [premio, setPremio] = useState("");
  const [strike, setStrike] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [codigoPut, setCodigoPut] = useState("");
  const [putQuantidade, setPutQuantidade] = useState("");
  const [putPremio, setPutPremio] = useState("");
  const [putStrike, setPutStrike] = useState("");
  const [putDataVencimento, setPutDataVencimento] = useState("");
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
      const hoje = /* @__PURE__ */ new Date();
      const vencimento = new Date(dataVenc);
      if (isNaN(vencimento.getTime())) {
        return { dias: 30, meses: 1 };
      }
      const diffTime = vencimento - hoje;
      const dias = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      const meses = dias / 30.44;
      return {
        dias: Math.max(1, dias),
        meses: Math.max(0.1, meses)
      };
    } catch (error) {
      return { dias: 30, meses: 1 };
    }
  };
  useEffect(() => {
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
    const premioTotal = parseFloat(premio) * parseFloat(quantidade);
    const strikeTotal = parseFloat(strike) * parseFloat(quantidade);
    const valorInvestido = strikeTotal - premioTotal;
    let putPremioTotal = 0;
    if (putPremio && putQuantidade) {
      putPremioTotal = parseFloat(putPremio) * parseFloat(putQuantidade);
    }
    const valorTotalInvestido = valorInvestido + putPremioTotal;
    const lucroLiquido = premioTotal - putPremioTotal;
    const percentualTotal = valorTotalInvestido > 0 ? lucroLiquido / valorTotalInvestido * 100 : 0;
    const percentualMensal = meses > 0 ? percentualTotal / meses : 0;
    const retornoMensal = valorTotalInvestido * percentualMensal / 100;
    const retornoTotal = lucroLiquido;
    const rentabilidadeLiquida = percentualTotal;
    const rentabilidadeMensalLiquida = percentualMensal;
    const retornoMensalLiquido = retornoMensal;
    setResultado({
      percentualTotal,
      diasRestantes: dias,
      mesesRestantes: meses,
      percentualMensal,
      retornoMensal,
      retornoTotal,
      premioTotal,
      strikeTotal,
      valorInvestido,
      valorTotalInvestido,
      putPremioTotal,
      custoProtecao: putPremioTotal,
      lucroLiquido,
      rentabilidadeLiquida,
      rentabilidadeMensalLiquida,
      retornoMensalLiquido
    });
  }, [premio, strike, quantidade, dataVencimento, putPremio, putQuantidade, putStrike, putDataVencimento]);
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
    const csvHeader = "Codigo_CALL,Quantidade_CALL,Premio_CALL,Strike_CALL,Data_Vencimento_CALL,Codigo_PUT,Quantidade_PUT,Premio_PUT,Strike_PUT,Data_Vencimento_PUT\n";
    const csvRow = `${dados.codigoCall || ""},${dados.quantidade || ""},${dados.premio || ""},${dados.strike || ""},${dados.dataVencimento || ""},${dados.codigoPut || ""},${dados.putQuantidade || ""},${dados.putPremio || ""},${dados.putStrike || ""},${dados.putDataVencimento || ""}
`;
    const csvContent = csvHeader + csvRow;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `opcoes_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const importarCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split("\n");
        if (lines.length >= 2) {
          const data = lines[1].split(",");
          if (data.length >= 10) {
            setCodigoCall(data[0] || "");
            setQuantidade(data[1] || "");
            setPremio(data[2] || "");
            setStrike(data[3] || "");
            setDataVencimento(data[4] || "");
            setCodigoPut(data[5] || "");
            setPutQuantidade(data[6] || "");
            setPutPremio(data[7] || "");
            setPutStrike(data[8] || "");
            setPutDataVencimento(data[9] || "");
          }
        }
      } catch (error) {
        alert("Erro ao importar CSV. Verifique o formato do arquivo.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };
  return /* @__PURE__ */ React.createElement("div", { className: "w-full h-full bg-gray-900 text-white p-6 overflow-auto" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mx-auto" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold text-center mb-8 text-purple-400" }, "Calculadora de Op\xE7\xF5es (Tekinform\xE1tica)"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-4 justify-center mb-6" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: exportarCSV,
      className: "flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
    },
    "\u{1F4E4} Salvar Dados"
  ), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer transition-colors" }, "\u{1F4E5} Puxar Dados", /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "file",
      accept: ".csv",
      onChange: importarCSV,
      className: "hidden"
    }
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        if (window.confirm("Tem certeza que deseja limpar todos os campos?")) {
          setCodigoCall("");
          setQuantidade("");
          setPremio("");
          setStrike("");
          setDataVencimento("");
          setCodigoPut("");
          setPutQuantidade("");
          setPutPremio("");
          setPutStrike("");
          setPutDataVencimento("");
        }
      },
      className: "flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
    },
    "\u{1F5D1}\uFE0F Limpar Dados"
  )), /* @__PURE__ */ React.createElement("div", { className: "grid lg:grid-cols-3 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-gray-800 rounded-lg p-6 border border-gray-700" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-semibold mb-4 text-green-300" }, "\u{1F4C8} CALL (Venda)"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-2 text-gray-300" }, "C\xF3digo da CALL"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: codigoCall,
      onChange: (e) => setCodigoCall(e.target.value),
      placeholder: "Ex: PETRK240",
      className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-2 text-gray-300" }, "Quantidade"), /* @__PURE__ */ React.createElement(
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
  )))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-800 rounded-lg p-6 border border-gray-700" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-semibold mb-4 text-red-300" }, "\u{1F4C9} PUT (Compra - Prote\xE7\xE3o)"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-2 text-gray-300" }, "C\xF3digo da PUT"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: codigoPut,
      onChange: (e) => setCodigoPut(e.target.value),
      placeholder: "Ex: PETRO200",
      className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-2 text-gray-300" }, "Quantidade"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      value: putQuantidade,
      onChange: (e) => setPutQuantidade(e.target.value),
      placeholder: "Digite a quantidade",
      className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-2 text-gray-300" }, "Compra do Pr\xEAmio (R$)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      step: "0.01",
      value: putPremio,
      onChange: (e) => setPutPremio(e.target.value),
      placeholder: "Ex: 2.50",
      className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-2 text-gray-300" }, "Strike (R$)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      step: "0.01",
      value: putStrike,
      onChange: (e) => setPutStrike(e.target.value),
      placeholder: "Ex: 15.00",
      className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium mb-2 text-gray-300" }, "Data de Vencimento"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      value: putDataVencimento,
      onChange: (e) => setPutDataVencimento(e.target.value),
      className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
    }
  )))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-800 rounded-lg p-6 border border-gray-700" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-semibold mb-4 text-green-300" }, "Resultados"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Pr\xEAmio Total"), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-red-400" }, formatCurrency(resultado.premioTotal))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Strike Total"), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-blue-400" }, formatCurrency(resultado.strikeTotal))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Valor Investido (s\xF3 CALL)"), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-yellow-400" }, formatCurrency(resultado.valorInvestido))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md border-2 border-orange-500" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Valor Total Investido"), /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-orange-400" }, formatCurrency(resultado.valorTotalInvestido))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Rentabilidade Total"), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-green-400" }, formatPercent(resultado.percentualTotal))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Dias Restantes"), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-orange-400" }, resultado.diasRestantes, " dias")), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Meses (Decimal)"), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-blue-400" }, resultado.mesesRestantes.toFixed(2), " meses")), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md border-2 border-purple-500" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Rentabilidade Mensal"), /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-purple-400" }, formatPercent(resultado.percentualMensal))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md border-2 border-green-500" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Retorno Mensal"), /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-green-400" }, formatCurrency(resultado.retornoMensal))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Custo da Prote\xE7\xE3o (PUT)"), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-red-400" }, "-", formatCurrency(resultado.custoProtecao))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-700 p-4 rounded-md border-2 border-cyan-500" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "Lucro L\xEDquido"), /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-cyan-400" }, formatCurrency(resultado.lucroLiquido)))))), /* @__PURE__ */ React.createElement("div", { className: "mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-3 text-purple-300" }, "F\xF3rmula Utilizada"), /* @__PURE__ */ React.createElement("div", { className: "text-gray-300 space-y-2" }, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "CALL (Venda):")), /* @__PURE__ */ React.createElement("p", null, "1. ", /* @__PURE__ */ React.createElement("strong", null, "Pr\xEAmio Total CALL:"), " Pr\xEAmio \xD7 Quantidade"), /* @__PURE__ */ React.createElement("p", null, "2. ", /* @__PURE__ */ React.createElement("strong", null, "Strike Total:"), " Strike \xD7 Quantidade"), /* @__PURE__ */ React.createElement("p", null, "3. ", /* @__PURE__ */ React.createElement("strong", null, "Valor Investido:"), " Strike Total - Pr\xEAmio Total CALL"), /* @__PURE__ */ React.createElement("p", { className: "mt-4" }, /* @__PURE__ */ React.createElement("strong", null, "PUT (Prote\xE7\xE3o):")), /* @__PURE__ */ React.createElement("p", null, "4. ", /* @__PURE__ */ React.createElement("strong", null, "Custo da Prote\xE7\xE3o:"), " Pr\xEAmio PUT \xD7 Quantidade PUT"), /* @__PURE__ */ React.createElement("p", null, "5. ", /* @__PURE__ */ React.createElement("strong", null, "Valor Total Investido:"), " Valor Investido CALL + Custo PUT"), /* @__PURE__ */ React.createElement("p", null, "6. ", /* @__PURE__ */ React.createElement("strong", null, "Lucro L\xEDquido:"), " Pr\xEAmio CALL - Custo PUT"), /* @__PURE__ */ React.createElement("p", null, "7. ", /* @__PURE__ */ React.createElement("strong", null, "Rentabilidade Total:"), " (Lucro L\xEDquido \xF7 Valor Total Investido) \xD7 100"), /* @__PURE__ */ React.createElement("p", null, "8. ", /* @__PURE__ */ React.createElement("strong", null, "Rentabilidade Mensal:"), " Rentabilidade Total \xF7 Meses"), /* @__PURE__ */ React.createElement("p", null, "9. ", /* @__PURE__ */ React.createElement("strong", null, "Retorno Mensal:"), " Valor Total Investido \xD7 Rentabilidade Mensal"))), /* @__PURE__ */ React.createElement("div", { className: "mt-6 bg-blue-900 rounded-lg p-4 border border-blue-700" }, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-blue-300 mb-2" }, "C\xE1lculo Atual:"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-blue-100 space-y-1" }, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "C\xE1lculo:"), " Lucro L\xEDquido (R$ ", resultado.lucroLiquido ? resultado.lucroLiquido.toFixed(2) : "0,00", ") \xF7 Valor Total Investido (R$ ", resultado.valorTotalInvestido ? resultado.valorTotalInvestido.toFixed(2) : "0,00", ") = ", formatPercent(resultado.percentualTotal)), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Rentabilidade Mensal:"), " ", formatPercent(resultado.percentualTotal), " \xF7 ", resultado.mesesRestantes.toFixed(2), " meses = ", formatPercent(resultado.percentualMensal)), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Per\xEDodo:"), " ", resultado.diasRestantes, " dias (", resultado.mesesRestantes.toFixed(2), " meses)"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Retorno em R$:"), " R$ ", resultado.retornoMensal ? resultado.retornoMensal.toFixed(2) : "0,00", " por m\xEAs")))));
};
var stdin_default = CalculadoraOpcoes;
export {
  stdin_default as default
};
