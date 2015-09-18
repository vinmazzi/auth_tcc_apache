$(document).ready(function () {
    popularPerguntaSecreta();
    $("#btnSignup").click(function () { cadastrar(); });
    $("#btnLogin").click(function () { fazerLogin(); });
    $("#btnVerificarEmail").click(function () { obterPerguntaSecreta(); });
    $("#btnAlterarSenha").click(function () { alterarSenha(); });
    $("#txtLogin").on("keydown", function (e) { if ((e.keyCode ? e.keyCode : e.which) == '13') fazerLogin(); });
    $("#txtPassword").on("keydown", function (e) { if ((e.keyCode ? e.keyCode : e.which) == '13') fazerLogin(); });
});

function popularPerguntaSecreta() {
    $.ajax({
        url: "http://spotanywhere.azurewebsites.net/api/PerguntaSecretaApi/GetAll",
        type: "GET",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            var hasItens = false;

            $('#ulPerguntaSecreta li').empty();

            $(data.Array).each(function () {
                hasItens = true;
                $('#ulPerguntaSecreta').append("<li id='" + this.Id + "'><a href='javascript:void(0);'>" + this.DsPerguntaSecreta + "</a></li>");
            });

            if (hasItens)
                $("#ulPerguntaSecreta li a").click(function () { $('#txtPerguntaSecreta').val($(this).text()); $('#txtRespostaSecreta').focus(); });
        },
        error: function (xmlHttpRequest) {
            var erro = eval("(" + xmlHttpRequest.responseText + ")");
            mostrarMsgErro(ParseIsNullOrEmpty(erro) ? 'Erro!' : erro.Message);
        }
    });
}

function limparCadastro() {
    $('#txtNome').val('');
    $('#txtCpf').val('');
    $('#txtEmail').val('');
    $('#txtConfirmarEmail').val('');
    $('#txtSenha1').val('');
    $('#txtSenha2').val('');
    $('#txtPerguntaSecreta').val('');
    $('#txtRespostaSecreta').val('');
    $('#btnSignup').focus();
}

function validarCadastro() {
    var formularioValido = true;

    if ($('#txtNome').val().trim() == '') {
        formularioValido = false;
        $('#txtNome').parent().parent().addClass('has-warning');
        $('#txtNome').focus();
    } else
        $('#txtNome').parent().parent().removeClass('has-warning');

    if ($('#txtCpf').val().trim() == '' || !validarCpf($('#txtCpf').val().trim())) {
        $('#txtCpf').parent().parent().addClass('has-warning');
        if (formularioValido)
            $('#txtCpf').focus();
        formularioValido = false;

        if ($('#txtCpf').val().trim() != '')
            mostrarMsgAlerta('Cpf inválido!');
    } else
        $('#txtCpf').parent().parent().removeClass('has-warning');

    if ($('#txtEmail').val() != $('#txtConfirmarEmail').val()) {
        $('#txtEmail').parent().parent().addClass('has-warning');
        $('#txtConfirmarEmail').parent().parent().addClass('has-warning');
        if (formularioValido)
            $('#txtEmail').focus();
        formularioValido = false;
        mostrarMsgAlerta('Emails não conferem!');
    } else {
        if ($('#txtEmail').val().trim() == '' || !IsValidEmail($('#txtEmail').val().trim())) {
            $('#txtEmail').parent().parent().addClass('has-warning');
            if (formularioValido)
                $('#txtEmail').focus();
            formularioValido = false;
            
            if ($('#txtEmail').val().trim() != '')
                mostrarMsgAlerta('Email inválido!');
        } else
            $('#txtEmail').parent().parent().removeClass('has-warning');

        if ($('#txtConfirmarEmail').val().trim() == '' || !IsValidEmail($('#txtConfirmarEmail').val().trim())) {
            $('#txtConfirmarEmail').parent().parent().addClass('has-warning');
            if (formularioValido)
                $('#txtConfirmarEmail').focus();
            formularioValido = false;
            
            if ($('#txtEmail').val().trim() != '')
                mostrarMsgAlerta('Email inválido!');
        } else
            $('#txtConfirmarEmail').parent().parent().removeClass('has-warning');
    }

    if ($('#txtSenha1').val() != $('#txtSenha2').val()) {
        $('#txtSenha1').parent().parent().addClass('has-warning');
        $('#txtSenha2').parent().parent().addClass('has-warning');
        if (formularioValido)
            $('#txtSenha1').focus();
        formularioValido = false;
        mostrarMsgAlerta('Senhas não conferem!');
    } else {
        if ($('#txtSenha1').val().trim() == '') {
            $('#txtSenha1').parent().parent().addClass('has-warning');
            if (formularioValido)
                $('#txtSenha1').focus();
            formularioValido = false;
        } else
            $('#txtSenha1').parent().parent().removeClass('has-warning');

        if ($('#txtSenha2').val().trim() == '') {
            $('#txtSenha2').parent().parent().addClass('has-warning');
            if (formularioValido)
                $('#txtSenha2').focus();
            formularioValido = false;
        } else
            $('#txtSenha2').parent().parent().removeClass('has-warning');
    }

    if ($('#txtPerguntaSecreta').val().trim() == '') {
        $('#txtPerguntaSecreta').parent().parent().parent().addClass('has-warning');
        if (formularioValido)
            $('#txtPerguntaSecreta').focus();
        formularioValido = false;
    } else
        $('#txtPerguntaSecreta').parent().parent().parent().removeClass('has-warning');

    if ($('#txtRespostaSecreta').val().trim() == '') {
        $('#txtRespostaSecreta').parent().parent().addClass('has-warning');
        if (formularioValido)
            $('#txtRespostaSecreta').focus();
        formularioValido = false;
    } else
        $('#txtRespostaSecreta').parent().parent().removeClass('has-warning');

    return formularioValido;
}

function cadastrar() {
    if (!validarCadastro())
        return;

    $.ajax({
        url: "http://spotanywhere.azurewebsites.net/api/UsuarioApi/Cadastrar",
        type: "POST",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        crossDomain: true,
        data: {
            DsNome: $('#txtNome').val(),
            NrCpf: ParseRemoveFormatRgCpf($('#txtCpf').val()),
            DsEmail: $('#txtEmail').val(),
            DsSenha: $('#txtSenha1').val(),
            DsPerguntaSecreta: $('#txtPerguntaSecreta').val(),
            DsRespostaSecreta: $('#txtRespostaSecreta').val(),
            DsToken: "A2477428889E9DBABCB8C2B5E6FBE3EC",
            TpTransacao: 1
        },
        dataType: "json",
        success: function (data) {
            if (data.TpOutput == 1) {
                limparCadastro();
                $('#changepasswordbox').hide();
                $('#signupbox').hide();
                $('#loginbox').show();
                mostrarMsgSucesso(data.DsOutput);
                $('#txtLogin').focus();
            } else
                mostrarMsgAlerta(data.DsOutput, data.DsMessage);
        },
        error: function (xmlHttpRequest) {
            var erro = eval("(" + xmlHttpRequest.responseText + ")");
            mostrarMsgErro(ParseIsNullOrEmpty(erro) ? 'Erro!' : erro.Message);
        }
    });
}

function validarLogin() {
    var formularioValido = true;

    if ($('#txtLogin').val().trim() == '') {
        formularioValido = false;
        $('#txtLogin').parent().parent().addClass('has-warning');
        $('#txtLogin').focus();
    } else
        $('#txtLogin').parent().parent().removeClass('has-warning');

    if ($('#txtPassword').val().trim() == '') {
        $('#txtPassword').parent().parent().addClass('has-warning');
        if (formularioValido)
            $('#txtPassword').focus();
        formularioValido = false;
    } else
        $('#txtPassword').parent().parent().removeClass('has-warning');

    return formularioValido;
}

function fazerLogin() {
    if (!validarLogin())
        return;

    $.ajax({
        url: "http://spotanywhere.azurewebsites.net/api/UsuarioApi/Autenticar",
        type: "POST",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        crossDomain: true,
        data: {
            DsEmail: $('#txtLogin').val(),
            DsSenha: $('#txtPassword').val(),
            DsToken: "A2477428889E9DBABCB8C2B5E6FBE3EC",
            TpTransacao: 4,
            MantenhaMeConectado: $('#chkMantenhaMeConectado').is(":checked")
        },
        dataType: "json",
        success: function (data) {
            if (data.TpOutput == 10)
		$(location).attr('href', 'http://192.158.1.1:3000/logins/libera');
            else
                mostrarMsgAlerta(data.DsOutput, data.DsMessage);
        },
        error: function (xmlHttpRequest) {
            var erro = eval("(" + xmlHttpRequest.responseText + ")");
            mostrarMsgErro(ParseIsNullOrEmpty(erro) ? 'Erro!' : erro.Message);
        }
    });
}

function validarEmailAVerificar() {
    var formularioValido = true;

    if ($('#txtEmailAVerificar').val().trim() == '') {
        formularioValido = false;
        $('#txtEmailAVerificar').parent().parent().addClass('has-warning');
        $('#txtEmailAVerificar').focus();
    } else
        $('#txtEmailAVerificar').parent().parent().removeClass('has-warning');

    return formularioValido;
}

function obterPerguntaSecreta() {
    if ($('#txtEmailAVerificar').is('[readonly]')) {
        $('#txtEmailAVerificar').prop("readonly", false);
        $('#lblPerguntaSecretaAVerificar').text('');
        $('#txtEmailAVerificar').focus();
        return;
    }

    if (!validarEmailAVerificar())
        return;

    $.ajax({
        url: "http://spotanywhere.azurewebsites.net/api/UsuarioApi/ObterPerguntaSecreta",
        type: "POST",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        crossDomain: true,
        data: {
            DsEmail: $('#txtEmailAVerificar').val(),
            DsToken: "A2477428889E9DBABCB8C2B5E6FBE3EC",
            TpTransacao: 3
        },
        dataType: "json",
        success: function (data) {
            if (data.TpOutput == 8) {
                $('#txtEmailAVerificar').prop("readonly", true);
                $('#lblPerguntaSecretaAVerificar').text(data.DsMessage);
                $('#txtRespostaSecretaAVerificar').focus();
            } else {
                $('#lblPerguntaSecretaAVerificar').text('');
                mostrarMsgAlerta(data.DsOutput, data.DsMessage);
                $('#txtEmailAVerificar').focus();
            }
        },
        error: function (xmlHttpRequest) {
            $('#lblPerguntaSecretaAVerificar').text('');
            var erro = eval("(" + xmlHttpRequest.responseText + ")");
            mostrarMsgErro(ParseIsNullOrEmpty(erro) ? 'Erro!' : erro.Message);
        }
    });
}

function limparAlterarSenha() {
    $('#txtEmailAVerificar').val('');
    $('#txtEmailAVerificar').prop("readonly", false);
    $('#lblPerguntaSecretaAVerificar').text('');
    $('#txtRespostaSecretaAVerificar').val('');
    $('#txtSenha1AVerificar').val('');
    $('#txtSenha2AVerificar').val('');
    $('#btnAlterarSenha').focus();
}

function validarAlterarSenha() {
    var formularioValido = true;

    if (!$('#txtEmailAVerificar').is('[readonly]')) {
        formularioValido = false;
        $('#txtEmailAVerificar').parent().parent().parent().addClass('has-warning');
        $('#txtEmailAVerificar').focus();
    } else
        $('#txtEmailAVerificar').parent().parent().parent().removeClass('has-warning');

    if ($('#txtRespostaSecretaAVerificar').val().trim() == '') {
        $('#txtRespostaSecretaAVerificar').parent().parent().addClass('has-warning');
        if (formularioValido)
            $('#txtRespostaSecretaAVerificar').focus();
        formularioValido = false;
    } else
        $('#txtRespostaSecretaAVerificar').parent().parent().removeClass('has-warning');

    if ($('#txtSenha1AVerificar').val() != $('#txtSenha2AVerificar').val()) {
        $('#txtSenha1AVerificar').parent().parent().addClass('has-warning');
        $('#txtSenha2AVerificar').parent().parent().addClass('has-warning');
        if (formularioValido)
            $('#txtSenha1AVerificar').focus();
        formularioValido = false;
    } else {
        if ($('#txtSenha1AVerificar').val().trim() == '') {
            $('#txtSenha1AVerificar').parent().parent().addClass('has-warning');
            if (formularioValido)
                $('#txtSenha1AVerificar').focus();
            formularioValido = false;
        } else
            $('#txtSenha1AVerificar').parent().parent().removeClass('has-warning');

        if ($('#txtSenha2AVerificar').val().trim() == '') {
            $('#txtSenha2AVerificar').parent().parent().addClass('has-warning');
            if (formularioValido)
                $('#txtSenha2AVerificar').focus();
            formularioValido = false;
        } else
            $('#txtSenha2AVerificar').parent().parent().removeClass('has-warning');
    }

    return formularioValido;
}

function alterarSenha() {
    if (!validarAlterarSenha())
        return;

    $.ajax({
        url: "http://spotanywhere.azurewebsites.net/api/UsuarioApi/AlterarSenha",
        type: "POST",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        crossDomain: true,
        data: {
            DsEmail: $('#txtEmailAVerificar').val(),
            DsRespostaSecreta: $('#txtRespostaSecretaAVerificar').val(),
            DsSenha: $('#txtSenha1AVerificar').val(),
            DsToken: "A2477428889E9DBABCB8C2B5E6FBE3EC",
            TpTransacao: 2
        },
        dataType: "json",
        success: function (data) {
            if (data.TpOutput == 7) {
                limparAlterarSenha();
                $('#changepasswordbox').hide();
                $('#signupbox').hide();
                $('#loginbox').show();
                mostrarMsgSucesso(data.DsOutput);
                $('#txtLogin').focus();
            } else
                mostrarMsgAlerta(data.DsOutput, data.DsMessage);
        },
        error: function (xmlHttpRequest) {
            var erro = eval("(" + xmlHttpRequest.responseText + ")");
            mostrarMsgErro(ParseIsNullOrEmpty(erro) ? 'Erro!' : erro.Message);
        }
    });
}

function mostrarMsgAlerta(p, q) {
    $('#erro-page-alert').removeClass('alert-success alert-info alert-danger').addClass('alert-warning').show().html('<p>' + p + '</p>' + (!$(q).ParseIsNullOrEmpty() ? ('<p>' + q) + '</p>' : ''));
    fecharMsg();
}

function mostrarMsgErro(p) {
    $('#erro-page-alert').removeClass('alert-success alert-info alert-warning').addClass('alert-danger').show().text(p);
    fecharMsg();
}

function mostrarMsgSucesso(p) {
    $('#erro-page-alert').removeClass('alert-warning alert-info alert-danger').addClass('alert-success').show().html('<p>' + p + '</p>');
    fecharMsg();
}

function fecharMsg() {
    setTimeout(function () { $('#erro-page-alert').hide(); }, 3000);
    $('html, body').animate({ scrollTop: 0 }, 'slow');
}
