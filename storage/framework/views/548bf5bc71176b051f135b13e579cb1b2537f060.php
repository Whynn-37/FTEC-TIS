<!doctype html>
<html lang="en">

<?php echo $__env->make('Template.header', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<body class="body-bg">
    <div id="preloader">
        <div class="loader"></div>
    </div>
    <div class="horizontal-main-wrapper">
        <?php echo $__env->make('Template.navbar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
        <!-- main content area start -->

        <?php echo $__env->yieldContent('content-page'); ?>
        <!-- main content area end -->
        <?php echo $__env->make('Template.footer', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    </div>
</body>

</html>
<?php /**PATH C:\xampp\htdocs\TIS\resources\views/Template/template.blade.php ENDPATH**/ ?>