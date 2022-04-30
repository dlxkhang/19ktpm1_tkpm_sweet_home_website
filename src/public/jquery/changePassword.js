$(window).on('load', () => {
    $('#newPassword, #repeatNewPassword').on('keyup', function () {
      if ($('#newPassword').val() == $('#repeatNewPassword').val()) {
        $('#message').html('Matching').css('color', 'green');
        $('#passwordSubmit').removeAttr("disabled");
      } else {
        $('#message').html('Password does not match').css('color', 'red');
      }
    });
});