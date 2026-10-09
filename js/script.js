"use strict";

function mostrarMensagem(texto, erro) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = texto;
  toast.className = "toast visivel";
  if (erro) toast.classList.add("toast-erro");

  setTimeout(function () {
    toast.classList.remove("visivel");
  }, 4000);
}

function colocarMascara(campo, tipo) {
  campo.addEventListener("input", function () {
    let valor = campo.value.replace(/\D/g, "");

    if (tipo === "cpf") {
      valor = valor.slice(0, 11);
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    if (tipo === "telefone") {
      valor = valor.slice(0, 11);
      valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
      if (valor.length > 14) {
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
      } else {
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
      }
    }

    if (tipo === "cep") {
      valor = valor.slice(0, 8);
      valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    }

    campo.value = valor;
  });
}

function configurarMenu() {
  const menu = document.getElementById("menu-principal");
  const botaoMenu = document.querySelector("[data-menu-toggle]");
  const botaoSubmenu = document.querySelector("[data-submenu-toggle]");
  const submenu = document.getElementById("submenu");

  if (!menu || !botaoMenu || !botaoSubmenu || !submenu) return;

  botaoMenu.addEventListener("click", function () {
    const aberto = botaoMenu.getAttribute("aria-expanded") === "true";
    botaoMenu.setAttribute("aria-expanded", !aberto);
    menu.classList.toggle("aberto");
  });

  botaoSubmenu.addEventListener("click", function () {
    const aberto = botaoSubmenu.getAttribute("aria-expanded") === "true";
    botaoSubmenu.setAttribute("aria-expanded", !aberto);
    submenu.hidden = aberto;
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      botaoSubmenu.setAttribute("aria-expanded", "false");
      submenu.hidden = true;
    }
  });
}

function configurarCadastro() {
  const formulario = document.getElementById("form-cadastro");
  if (!formulario) return;

  colocarMascara(document.getElementById("cpf"), "cpf");
  colocarMascara(document.getElementById("telefone"), "telefone");
  colocarMascara(document.getElementById("cep"), "cep");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    const nome = document.getElementById("nome").value;
    const mensagem = document.getElementById("mensagem-cadastro");
    mensagem.textContent = "Obrigada, " + nome + "! Este cadastro é uma simulação acadêmica. Os dados não foram enviados nem salvos.";
    mensagem.hidden = false;
    formulario.reset();
  });
}

function configurarNewsletter() {
  const formulario = document.getElementById("form-newsletter");
  if (!formulario) return;

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    mostrarMensagem("Confirmação demonstrativa: nenhuma inscrição real foi realizada.");
    formulario.reset();
  });
}

function configurarDoacao() {
  const formulario = document.getElementById("form-doacao");
  if (!formulario) return;

  const valores = document.getElementsByName("valor");
  const outroValor = document.getElementById("outro-valor");

  for (let i = 0; i < valores.length; i++) {
    valores[i].addEventListener("change", function () {
      outroValor.value = "";
    });
  }

  outroValor.addEventListener("input", function () {
    for (let i = 0; i < valores.length; i++) {
      valores[i].checked = false;
    }
  });

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const frequencia = document.querySelector("[name='frequencia']:checked");
    let valorTexto = outroValor.value;
    let projeto = document.getElementById("projeto-doacao");
    let valor;

    if (valorTexto === "") {
      for (let i = 0; i < valores.length; i++) {
        if (valores[i].checked) valorTexto = valores[i].value;
      }
    }

    valor = Number(valorTexto);

    if (!frequencia || isNaN(valor) || valor < 5 || projeto.value === "") {
      mostrarMensagem("Escolha a frequência, o projeto e um valor mínimo de R$ 5,00.", true);
      return;
    }

    let resumo = "Projeto: " + projeto.options[projeto.selectedIndex].text;
    resumo += ". Frequência: " + frequencia.value;
    resumo += ". Valor: R$ " + valor.toFixed(2).replace(".", ",") + ".";

    if (frequencia.value === "mensal") {
      resumo += " Estimativa em 12 meses: R$ " + (valor * 12).toFixed(2).replace(".", ",") + ".";
    }

    document.getElementById("resumo-doacao").textContent = resumo;
    document.getElementById("modal-doacao").hidden = false;
  });

  document.getElementById("cancelar-doacao").addEventListener("click", function () {
    document.getElementById("modal-doacao").hidden = true;
  });

  document.getElementById("confirmar-doacao").addEventListener("click", function () {
    document.getElementById("modal-doacao").hidden = true;
    formulario.reset();
    mostrarMensagem("Simulação concluída. Nenhum pagamento foi efetuado.");
  });
}

configurarMenu();
configurarCadastro();
configurarNewsletter();
configurarDoacao();
