<!-- footer area start-->
<footer>
    <p>© Copyright 2020 MIT. All right reserved.
    </p>
</footer>
<!-- footer area end-->

<script src="{{ asset('template/assets/js/vendor/jquery-2.2.4.min.js') }}"></script>
<script src="{{ asset('template/assets/js/popper.min.js') }}"></script>
<script src="{{ asset('template/assets/js/bootstrap.min.js') }}"></script>
<script src="{{ asset('template/assets/js/owl.carousel.min.js') }}"></script>
<script src="{{ asset('template/assets/js/metisMenu.min.js') }}"></script>
<script src="{{ asset('template/assets/js/jquery.slimscroll.min.js') }}"></script>
<script src="{{ asset('template/assets/js/jquery.slicknav.min.js') }}"></script>
<script src="{{ asset('template/assets/js/jquery.slicknav.min.js') }}"></script>
<script src="{{ asset('../node_modules/gasparesganga-jquery-loading-overlay/dist/loadingoverlay.min.js') }}"></script>
<script src="{{ asset('template/assets/js/plugins.js') }}"></script>
<script src="{{ asset('template/assets/js/scripts.js') }}"></script>
<script src="{{ asset('scripts/Template/footer.js') }}"></script>
<script>
    const _TOKEN = $('#csrf-token').attr('content');
</script>
<script>
        var base_url = "{{ url('/') }}";
</script>
@yield('custom-script')
