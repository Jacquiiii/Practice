// from https://catalin.red/simple-and-effective-dropdown-login-box/

$(document).ready(function () {

  $('.login-button').on('click', function() {

    $(this).next('.login-content').slideToggle();
    $(this).toggleClass('active');

  })

  $('.signup-button').on('click', function() {

    $(this).next('.signup-content').slideToggle();
    $(this).toggleClass('active');

  })

});
