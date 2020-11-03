<!doctype html>
<html class="no-js" lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>TIS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/png" href="{{ asset('template/assets/images/logo/tis.ico')}}">
    <link rel="stylesheet" href="{{ asset('template/assets/css/bootstrap.min.css')}}">
    <link rel="stylesheet" href="{{ asset('template/assets/css/font-awesome.min.css')}}">
    <link rel="stylesheet" href="{{ asset('template/assets/css/themify-icons.css')}}">
    <link rel="stylesheet" href="{{ asset('template/assets/css/metisMenu.css')}}">
    <link rel="stylesheet" href="{{ asset('template/assets/css/owl.carousel.min.css')}}">
    <link rel="stylesheet" href="{{ asset('template/assets/css/slicknav.min.css')}}">
    <!-- others css -->
    <link rel="stylesheet" href="{{ asset('template/assets/css/typography.css')}}">
    <link rel="stylesheet" href="{{ asset('template/assets/css/default-css.css')}}">
    <link rel="stylesheet" href="{{ asset('template/assets/css/styles.css')}}">
    <link rel="stylesheet" href="{{ asset('template/assets/css/responsive.css')}}">
    <!-- modernizr css -->
    <script src="{{ asset('template/assets/js/vendor/modernizr-2.8.3.min.js')}}"></script>
</head>

<body>
    <div id="preloader">
        <div class="loader"></div>
    </div>
    <!-- preloader area end -->
    <!-- login area start -->
    <div class="login-area login-s2">
        <div class="container">
            <div class="login-box ptb--100">
                <form action="#" method="POST" enctype="multipart/form-data">
                    <div class="logo" align="center">
                        <img src="{{ asset('template/assets/images/logo/tis_login.png') }}" alt="TIS" style="width: 65%;height:40%">
                    </div>
                    <div class="login-form-head">
                        <h4>Log In</h4>
                        <p>Sign in and start managing your trial checksheet</p>
                    </div>
                    <div class="login-form-body">
                        <div class="form-gp">
                            <label for="exampleInputEmail1">Employee Id</label>
                            <input type="text" id="txt_employee_id">
                            <i class="ti-user"></i>
                            <div class="text-danger"></div>
                        </div>
                        <div class="form-gp">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" id="exampleInputPassword1">
                            <i class="ti-lock"></i>
                            <div class="text-danger"></div>
                        </div>
                        <div class="row mb-4 rmber-area">
                            <div class="col-12 text-right">
                                <a href="#" style="color:#333">Forgot Password?</a>
                            </div>
                        </div>
                        <div class="submit-btn-area">
                            <button id="form_submit" type="submit">Submit <i class="ti-arrow-right"></i></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- login area end -->

    <!-- jquery latest version -->
    <script src="{{ asset('template/assets/js/vendor/jquery-2.2.4.min.js') }}"></script>
    <!-- bootstrap 4 js -->
    <script src="{{ asset('template/assets/js/popper.min.js') }}"></script>
    <script src="{{ asset('template/assets/js/bootstrap.min.js') }}"></script>
    <script src="{{ asset('template/assets/js/owl.carousel.min.js') }}"></script>
    <script src="{{ asset('template/assets/js/metisMenu.min.js') }}"></script>
    <script src="{{ asset('template/assets/js/jquery.slimscroll.min.js') }}"></script>
    <script src="{{ asset('template/assets/js/jquery.slicknav.min.js') }}"></script>

    <!-- others plugins -->
    <script src="{{ asset('template/assets/js/plugins.js') }}"></script>
    <script src="{{ asset('template/assets/js/scripts.js') }}"></script>
</body>

</html>
