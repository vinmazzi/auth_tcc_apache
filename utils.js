$(document).ready(function () {
    $.fn.extend({
        ParseIsNullOrEmpty: function () {
            if (this.val() == null || this.val() == undefined || this.val().trim() == '') {
                return this.selector == null || this.selector == undefined || this.selector.trim() == '';
            } else
                return false;
        }
    });
});

function IsValidEmail(eAddress) { return new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/).test(eAddress); };
function Trim(string, c) { if (!c) c = ' '; c = c.replace(/([()[{*+.$^\\|?])/g, '\\$1'); return string.replace(new RegExp("^" + c + "+", "g"), '').replace(new RegExp(c + "+$", "g"), ''); }
function ParseIsNullOrEmpty(p) { return p == null || Trim(p) == ''; }
function ParseRemoveFormatRgCpf(p) { return ParseIsNullOrEmpty(p) ? '' : Trim(replaceAll(p, '-._', '')); }

function escapeRegExp(string) { return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"); }
function replaceAll(string, find, replace) {
    var ret = '';

    for (var i = 0; i < find.length; i++)
        if (ParseIsNullOrEmpty(ret))
            ret = string.replace(new RegExp(escapeRegExp(find[i]), 'g'), replace);
        else
            ret = ret.replace(new RegExp(escapeRegExp(find[i]), 'g'), replace);

    return ret;
}

function removeBadCharCpf(str, sub) {
    var i = str.indexOf(sub);
    if (i == -1)
        return str;

    return str.substring(0, i) + removeBadCharCpf(str.substring(i + sub.length), sub);
}

function validarCpf(cpf) {
    var filtro = /^\d{3}.\d{3}.\d{3}-\d{2}$/i;

    if (!filtro.test(cpf))
        return false;

    cpf = removeBadCharCpf(cpf, ".");
    cpf = removeBadCharCpf(cpf, "-");

    if (cpf.length != 11
        || ParseIsNullOrEmpty(Trim(cpf, '0'))
        || ParseIsNullOrEmpty(Trim(cpf, '1'))
        || ParseIsNullOrEmpty(Trim(cpf, '2'))
        || ParseIsNullOrEmpty(Trim(cpf, '3'))
        || ParseIsNullOrEmpty(Trim(cpf, '4'))
        || ParseIsNullOrEmpty(Trim(cpf, '5'))
        || ParseIsNullOrEmpty(Trim(cpf, '6'))
        || ParseIsNullOrEmpty(Trim(cpf, '7'))
        || ParseIsNullOrEmpty(Trim(cpf, '8'))
        || ParseIsNullOrEmpty(Trim(cpf, '9')))
        return false;

    var soma = 0;
    for (var i = 0; i < 9; i++)
        soma += parseInt(cpf.charAt(i)) * (10 - i);

    var resto = 11 - (soma % 11);
    if (resto == 10 || resto == 11)
        resto = 0;

    if (resto != parseInt(cpf.charAt(9)))
        return false;

    for (soma = i = 0; i < 10; i++)
        soma += parseInt(cpf.charAt(i)) * (11 - i);

    resto = 11 - (soma % 11);
    if (resto == 10 || resto == 11)
        resto = 0;

    if (resto != parseInt(cpf.charAt(10)))
        return false;

    return true;
}

function cpfMask(v) { return v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1-$2"); }

function validarData() {
    var aAr = typeof (arguments[0]) == "string" ? arguments[0].split("/") : arguments,
            lDay = parseInt(aAr[0]),
            lMon = parseInt(aAr[1]),
            lYear = parseInt(aAr[2]),
            biY = (lYear % 4 == 0 && lYear % 100 != 0) || lYear % 400 == 0,
            mt = [1, biY ? -1 : -2, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1];
    return lYear >= 1900 && lMon <= 12 && lMon > 0 && lDay <= mt[lMon - 1] + 30 && lDay > 0;
}