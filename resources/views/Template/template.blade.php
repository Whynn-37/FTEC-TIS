<!doctype html>
<html lang="en">

@include('Template.header')

<body class="body-bg">
    <div id="preloader">
        <div class="loader"></div>
    </div>
    <div class="horizontal-main-wrapper">
        @include('Template.navbar')
        <!-- main content area start -->

        @yield('content-page')
        <!-- main content area end -->
        @include('Template.footer')
    </div>
</body>

</html>
