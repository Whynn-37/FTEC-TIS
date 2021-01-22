<!-- main header area start -->
<div class="mainheader-area">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-md-6">
                <div class="logo">
                    <h2 style="color: white;">TOUCHSCREEN INSPECTION SYSTEM</h2>
                </div>
            </div>
            <!-- profile info & task notification -->
            <div class="col-md-6 clearfix text-right">
                <div class="d-md-inline-block d-block mr-md-4">
                    <h5 id="txt_date_time" style=" color: white;" class="sidebar-brand-text mx-3"></h5>
                </div>
                <div class="clearfix d-md-inline-block d-block">
                    <div class="user-profile m-0">
                        <img class="avatar user-thumb"
                            src="{{ asset('template/assets/images/author/avatar.png') }}"
                            alt="avatar">
                        <h4 class="user-name dropdown-toggle" data-toggle="dropdown">{{ Session::get('fullname')}} <i
                                class="fa fa-angle-down"></i></h4>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="{{ url('logout') }}">Log Out</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- main header area end -->
    <!-- header area start -->
    <div class="header-area header-bottom">
        @if (Session::get('access_level') === '1')
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-9  d-none d-lg-block">
                        <div class="horizontal-menu">
                        
                            <nav>
                                <ul id="nav_menu">
                                    <li>
                                        <a href="{{ url('trial-checksheet') }}"><i class="ti-clipboard" style="font-size:1.2em"></i><span
                                                style="font-size:1.2em">TRIAL CHECKSHEET</span></a>
                                    </li>
                                    <li>
                                        <a href="{{ url('evaluation') }}"><i class="ti-check-box" style="font-size:1.2em"></i><span style="font-size:1.2em">EVALUATOR</span></a>
                                    </li>
                                    <li>
                                        <a href="{{ url('approval') }}"><i class="ti-check-box" style="font-size:1.2em"></i><span
                                                style="font-size:1.2em">APPROVER</span></a>
                                    </li>
                                    <li>
                                        <a href="{{ url('history') }}"><i class="ti-time" style="font-size:1.2em"></i><span
                                                style="font-size:1.2em">HISTORY</span></a>
                                    </li>
                                    <li>
                                        <a><i class="ti-agenda" style="font-size:1.2em"></i><span
                                            style="font-size:1.2em;">MANAGEMENT</span></a>
                                        <ul class="submenu" style="border-top: 4px solid #01C293;">
                                            <li><a href="{{ url('supplier') }}"><i class="ti-shopping-cart-full"></i><span> SUPPLIER </span></a></li>
                                            <li><a href="{{ url('activity-logs') }}"><i class="ti-harddrives"></i><span> ACTIVITY LOGS </span></a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <!-- mobile_menu -->
                    <div class="col-12 d-block d-lg-none">
                        <div id="mobile_menu"></div>
                    </div>
                </div>
            </div>
        @endif
    </div>
    <!-- header area end -->                      

