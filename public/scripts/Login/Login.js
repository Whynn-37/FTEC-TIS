$(document).ready(function () {

});

const LOGIN = (() => {

    let this_login = {};

    this_login.SignIn = () => {
        let id = $('#txt_employee_id').val();
        let password = $('#txt_employee_password').val();

        if (id === '' || password === '') {
            $('#span_error').remove();
            $('#div_password').after(`<span id="span_error" class="text-danger">Incomplete credentials</span>`)
        } else{
            $('#span_error').remove();
            LOGIN.ProceedSignIn(id,password);
        }
    };

    this_login.ProceedSignIn = (id,password) => {
        $('#btn_sign_in').LoadingOverlay('show');
        $.ajax({
            url: `login-authentication`,
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {
                txt_employee_id: id,
                txt_employee_password: password,
                _token: _TOKEN,
            },
            success: result => {

                if (parseInt(result.value.access_level) === 2) 
                {
                    if (result.response === 'success') 
                    {
                        $('#span_error').remove();
                        if (result.value.position === 'SECTION LEADER' || result.value.position === 'LEADER' || result.value.position === 'QC ASSISTANT') 
                        {
                            location.href = 'http://localhost/tis/public/evaluation';
                        } 
                        else if (result.value.position === 'MANAGER' || result.value.position === 'DIRECTOR') 
                        {
                            location.href = 'http://localhost/tis/public/approval';
                        } 
                        else 
                        {
                            location.href = 'http://localhost/tis/public/trial-checksheet';
                        }
                    } 
                    else if (result.response === 'fail') 
                    {
                        $('#span_error').remove();
                        $('#div_password').after(`<span id="span_error" class="text-danger">${result.value}</span>`)
                    } 
                    else 
                    {
                        $('#span_error').remove();
                        $('#div_password').after(`<span id="span_error" class="text-danger">An error occured. Please contact the administrator</span>`);
                    }
                } 
                else 
                {
                    if(result.response === 'success')
                    {
                        location.href = 'http://localhost/tis/public/trial-checksheet';
                    } 
                    else 
                    {
                        $('#span_error').remove();
                        $('#div_password').after(`<span id="span_error" class="text-danger">${result.value}</span>`)
                    }
                }
                $('#btn_sign_in').LoadingOverlay('hide');
                
            }
        });
    };

    return this_login;
})();
$(document).bind('keypress', function (e) {
    if (e.keyCode == 13) {
        $('#btn_sign_in').trigger('click');
    }
});