

<?php $__env->startSection('custom-css'); ?>
<link rel="stylesheet" href="../node_modules/sweetalert2/dist/sweetalert2.min.css">
<link rel="stylesheet" href="../node_modules/@sweetalert2/theme-dark/dark.css">
<link rel="stylesheet" href="../node_modules/select2/dist/css/select2.min.css">
<link rel="stylesheet" href="../node_modules/datatables.net/css/jquery.dataTables.min.css">
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content-page'); ?>

<div class="main-content-inner">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 mt-5">
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <h4 class="header-title"><i class="ti-harddrives"> </i> ACTIVITY LOGS </h4><br>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="single-table">
                                    <div class="table-responsive">
                                        <table class="table text-center table-bordered" id="tbl_activity_log_data" style="text-align:justify;">
                                            <thead class="text-uppercase bg-dark">
                                                <tr class="text-white">
                                                    <th> NUMBER </th>
                                                    <th> SUBJECT </th>
                                                    <th> URL </th>
                                                    <th> METHOD </th>
                                                    <th> I.P </th>
                                                    <th> BROWSER </th>
                                                    <th> EMPLOYEE ID </th>
                                                    <th> UPDATED AT </th>
                                                    <th> CREATED AT </th>
                                                 </tr>
                                            </thead>
                                            <tbody id="tbody_tbl_activity_log_data"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php $__env->stopSection(); ?>
<?php $__env->startSection('custom-script'); ?>
<script src="../node_modules/sweetalert2/dist/sweetalert2.min.js"></script>
<script src="../node_modules/select2/dist/js/select2.min.js"></script>
<script src="../node_modules/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="<?php echo e(asset('scripts/Management/activity_log.js')); ?>"></script>

<script>
    // swal
    const swal_options = {
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        allowOutsideClick: false,
        customClass: 'swal-wide',
    };

     // select2
     let select2 = $('.select2').select2();      
</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('Template.template', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\xampp\htdocs\TIS\resources\views/Management/activity_log.blade.php ENDPATH**/ ?>