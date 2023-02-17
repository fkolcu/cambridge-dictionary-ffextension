document.body.addEventListener('mouseup', function (e) {
    const selectedText = document.getSelection().toString();
    document.cookie = "fk_cd_ext_st=" + selectedText + ";domain=." +
        location.hostname.split('.').reverse()[1] + "." +
        location.hostname.split('.').reverse()[0] + ";path=/;SameSite=None;Secure=true;";
});
