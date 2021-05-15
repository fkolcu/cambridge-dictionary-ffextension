document.body.addEventListener('mouseup', function (e) {
    const selectedText = document.getSelection().toString();
    document.cookie = "cd_ext_st=" + selectedText + ";path=/";
});
