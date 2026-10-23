"use strict";

let toastTimer;

function mostrarMensagem(texto, erro) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  window.clearTimeout(toastTimer);
  toast.textContent = texto;
  toast.className = "toast visivel" + (erro ? " toast-erro" : "");
  toastTimer = window.setTimeout(function () {
    toast.classList.remove("visivel");
  }, 4500);
}

function colocarMascara(campo, tipo) {
  if (!campo) return;

  campo.addEventListener("input", function () {
    let valor = campo.value.replace(/\D/g, "");

    if (tipo === "cpf") {
      valor = valor.slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    if (tipo === "telefone") {
      valor = valor.slice(0, 11).replace(/(\d{2})(\d)/, "($1) $2");
      valor = valor.length > 14
        ? valor.replace(/(\d{5})(\d)/, "$1-$2")
        : valor.replace(/(\d{4})(\d)/, "$1-$2");
    }
    if (tipo === "cep") {
      valor = valor.slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
    }
    campo.value = valor;
  });
}

function configurarMenu() {
  const menu = document.getElementById("menu-principal");
  const botaoMenu = document.querySelector("[data-menu-toggle]");
  const botaoSubmenu = document.querySelector("[data-submenu-toggle]");
  const submenu = document.getElementById("submenu");
  if (!menu || !botaoMenu) return;

  function fecharSubmenu() {
    if (!botaoSubmenu || !submenu) return;
    botaoSubmenu.setAttribute("aria-expanded", "false");
    submenu.hidden = true;
  }

  botaoMenu.addEventListener("click", function () {
    const aberto = botaoMenu.getAttribute("aria-expanded") === "true";
    botaoMenu.setAttribute("aria-expanded", String(!aberto));
    botaoMenu.setAttribute("aria-label", aberto ? "Abrir menu" : "Fechar menu");
    menu.classList.toggle("aberto", !aberto);
    if (aberto) fecharSubmenu();
  });

  if (botaoSubmenu && submenu) {
    botaoSubmenu.addEventListener("click", function () {
      const aberto = botaoSubmenu.getAttribute("aria-expanded") === "true";
      botaoSubmenu.setAttribute("aria-expanded", String(!aberto));
      submenu.hidden = aberto;
    });
  }

  document.addEventListener("click", function (evento) {
    if (!menu.contains(evento.target) && !botaoMenu.contains(evento.target)) fecharSubmenu();
  });
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      fecharSubmenu();
      menu.classList.remove("aberto");
      botaoMenu.setAttribute("aria-expanded", "false");
      botaoMenu.setAttribute("aria-label", "Abrir menu");
    }
  });
}

function validarFormulario(formulario) {
  const camposInvalidos = Array.from(formulario.querySelectorAll(":invalid"));
  formulario.querySelectorAll(".campo-invalido").forEach(function (campo) {
    campo.classList.remove("campo-invalido");
  });
  camposInvalidos.forEach(function (campo) {
    campo.classList.add("campo-invalido");
  });
  if (camposInvalidos.length) {
    camposInvalidos[0].focus();
    formulario.reportValidity();
    return false;
  }
  return true;
}

function configurarCadastro() {
  const formulario = document.getElementById("form-cadastro");
  if (!formulario) return;
  colocarMascara(document.getElementById("cpf"), "cpf");
  colocarMascara(document.getElementById("telefone"), "telefone");
  colocarMascara(document.getElementById("cep"), "cep");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (!validarFormulario(formulario)) return;
    const nome = document.getElementById("nome").value.trim();
    const mensagem = document.getElementById("mensagem-cadastro");
    mensagem.textContent = "Obrigada, " + nome + "! Este cadastro é uma simulação acadêmica. Os dados não foram enviados nem salvos.";
    mensagem.hidden = false;
    formulario.reset();
    mensagem.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function configurarNewsletter() {
  const formulario = document.getElementById("form-newsletter");
  if (!formulario) return;
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (!validarFormulario(formulario)) return;
    mostrarMensagem("Confirmação demonstrativa: nenhuma inscrição real foi realizada.");
    formulario.reset();
  });
}

function configurarDoacao() {
  const formulario = document.getElementById("form-doacao");
  if (!formulario) return;

  const valores = Array.from(document.getElementsByName("valor"));
  const outroValor = document.getElementById("outro-valor");
  const modal = document.getElementById("modal-doacao");
  const botaoCancelar = document.getElementById("cancelar-doacao");
  const botaoConfirmar = document.getElementById("confirmar-doacao");
  let ultimoFoco;

  valores.forEach(function (valor) {
    valor.addEventListener("change", function () {
      outroValor.value = "";
      outroValor.classList.remove("campo-invalido");
    });
  });
  outroValor.addEventListener("input", function () {
    valores.forEach(function (valor) { valor.checked = false; });
  });

  function fecharModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-aberto");
    if (ultimoFoco) ultimoFoco.focus();
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const frequencia = document.querySelector("[name='frequencia']:checked");
    const projeto = document.getElementById("projeto-doacao");
    let valorTexto = outroValor.value;
    if (!valorTexto) {
      const selecionado = valores.find(function (valor) { return valor.checked; });
      if (selecionado) valorTexto = selecionado.value;
    }
    const valor = Number(valorTexto);
    if (!frequencia || !Number.isFinite(valor) || valor < 5 || !projeto.value) {
      mostrarMensagem("Escolha a frequência, o projeto e um valor mínimo de R$ 5,00.", true);
      return;
    }

    let resumo = "Projeto: " + projeto.options[projeto.selectedIndex].text + ". Frequência: " + frequencia.value + ". Valor: R$ " + valor.toFixed(2).replace(".", ",") + ".";
    if (frequencia.value === "mensal") resumo += " Estimativa em 12 meses: R$ " + (valor * 12).toFixed(2).replace(".", ",") + ".";
    document.getElementById("resumo-doacao").textContent = resumo;
    ultimoFoco = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-aberto");
    botaoConfirmar.focus();
  });
  botaoCancelar.addEventListener("click", fecharModal);
  botaoConfirmar.addEventListener("click", function () {
    fecharModal();
    formulario.reset();
    mostrarMensagem("Simulação concluída. Nenhum pagamento foi efetuado.");
  });
  modal.addEventListener("click", function (evento) {
    if (evento.target === modal) fecharModal();
  });
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && !modal.hidden) fecharModal();
  });
}

configurarMenu();
configurarCadastro();
configurarNewsletter();
configurarDoacao();
