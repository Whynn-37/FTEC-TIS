

<?php $__env->startSection('custom-css'); ?>
<link rel="stylesheet" href="../node_modules/sweetalert2/dist/sweetalert2.min.css">
<link rel="stylesheet" href="../node_modules/@sweetalert2/theme-dark/dark.css">
<link rel="stylesheet" href="../node_modules/select2/dist/css/select2.min.css">
<link rel="stylesheet" href="../node_modules/datatables.net/css/jquery.dataTables.min.css">
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content-page'); ?>

<div class="main-content-inner">
    <div class="container">
<<<<<<< HEAD
        
=======
>>>>>>> b052ab44bdb7e843ce67ee2309a1101511a9ea16
        <div class="row">
            <div class="col-lg-12 mt-5">
                <div class="card shadow mb-4">
                    <div class="card-body">
<<<<<<< HEAD
                        <div class="row">
                            <div class="col-md-7">
                                <h4 class="header-title"><i class="fa fa-history"></i> HISTORY DATA</h4>
                            </div>
                            <div class="col-md-2">
                                <h5 style="text-align: center;padding-top:10px;"> SEARCH STATUS: </h5>
                            </div>
                            <div class="col-md-3">
=======
                        <h4 class="header-title"><i class="fa fa-search"></i> SEARCH HISTORY </h4>
                        <div class="row">
                            <div class="col-md-6">
                                <label>STATUS:</label>
>>>>>>> b052ab44bdb7e843ce67ee2309a1101511a9ea16
                                <select class="form-control mb-3" name="state" id="slc_status" onchange="HISTORY.loadHistoryList();">
                                    <option value="null" disabled selected>SELECT</option>
                                    <option value="FOR INSPECTION">FOR INSPECTION</option>
                                    <option value="REINSPECTION">REINSPECTION</option>
                                    <option value="ON-GOING INSPECTION">ON-GOING INSPECTION</option>
                                    <option value="FOR EVALUATION">FOR EVALUATION</option>
                                    <option value="FOR APPROVAL">FOR APPROVAL</option>
                                    <option value="APPROVED">APPROVED</option>
                                    <option value="DISAPPROVED">DISAPPROVED</option>
                                </select>
                            </div>
<<<<<<< HEAD
=======
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12 mt-5">
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <h4 class="header-title"><i class="fa fa-history"></i> HISTORY DATA</h4>
                        <div class="row">
>>>>>>> b052ab44bdb7e843ce67ee2309a1101511a9ea16
                            <div class="col-md-12">
                                <div class="single-table">
                                    <table class="table table-responsive text-center table-bordered" id="tbl_history_data" style="text-align:justify;">
                                        <thead class="text-uppercase bg-dark">
                                            <tr class="text-white">
                                                <th>ACTION</th>
<<<<<<< HEAD
                                                <th>FILE</th>
=======
>>>>>>> b052ab44bdb7e843ce67ee2309a1101511a9ea16
                                                <th>PART NUMBER</th>
                                                <th>REVISION NUMBER</th>
                                                <th>TRIAL NUMBER</th>
                                                <th>INSPECTION REASON</th>
                                                <th>JUDGMENT</th>
                                                <th>INSPECTED BY</th>
                                                <th>INSPECTOR DATE</th>
                                                <th>EVALUATED BY</th>
                                                <th>EVALUATED DATE</th>
                                                <th>APPROVED BY</th>
                                                <th>APPROVED DATE</th>
                                                <th>DISAPPROVED BY</th>
                                                <th>DISAPPROVED DATE</th>
<<<<<<< HEAD
=======
                                                <th>FILE</th>
>>>>>>> b052ab44bdb7e843ce67ee2309a1101511a9ea16
                                                </tr>
                                        </thead>
                                        <tbody id="tbody_tbl_history_data"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php echo $__env->make('Approver.approval_modal', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <?php echo $__env->make('History.history_modal', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
</div>

<?php $__env->stopSection(); ?>
<?php $__env->startSection('custom-script'); ?>
<script src="../node_modules/sweetalert2/dist/sweetalert2.min.js"></script>
<script src="../node_modules/select2/dist/js/select2.min.js"></script>
<script src="../node_modules/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="<?php echo e(asset('scripts/History/history.js')); ?>"></script>
 <script src="<?php echo e(asset('scripts/Approver/approval.js')); ?>"></script>
<script src="<?php echo e(asset('scripts/Checksheet/trial_checksheet_igm.js')); ?>"></script>

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

<?php echo $__env->make('Template.template', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\xampp\htdocs\TIS\resources\views/History/history.blade.php ENDPATH**/ ?>