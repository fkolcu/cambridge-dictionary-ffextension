document.body.addEventListener('mouseup', function (e) {
    const selectedText = document.getSelection().toString();
    document.cookie = "fk_cd_ext_st=" + selectedText + ";path=/";
});
