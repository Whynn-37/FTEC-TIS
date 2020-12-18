@extends('Template.template')

@section('custom-css')
<link rel="stylesheet" href="../node_modules/sweetalert2/dist/sweetalert2.min.css">
<link rel="stylesheet" href="../node_modules/@sweetalert2/theme-dark/dark.css">
<link rel="stylesheet" href="../node_modules/datatables.net/css/jquery.dataTables.min.css">
<link rel="stylesheet" href="../node_modules/select2/dist/css/select2.min.css">
@endsection

@section('content-page')

    <div class="main-content-inner">
        <div class="container">
            {{-- FINISHED --}}
            <div class="row">
                <div class="col-lg-12 mt-5">
                    <div class="card shadow mb-4">
                        <div class="card-body">
                            <h4 class="header-title"><i class="ti-clipboard"></i> FINISHED INSPECTION DATA</h4><br>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="single-table">
                                        <div class="table-responsive">
                                            <table class="table text-center table-bordered" id="tbl_finished_inspection_data">
                                                <thead class="text-uppercase bg-dark">
                                                    <tr class="text-white">
                                                       <th>PART NO</th>
                                                       <th>REVISION</th>
                                                       <th>TRIAL STAGE</th>
                                                       <th>DATE FINISHED</th>
                                                       <th>JUDGEMENT</th>
                                                       <th>ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="tbody_tbl_finished_inspection_data"></tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {{-- DISAPPROVED --}}
            <div class="row">
                <div class="col-lg-12 mt-5">
                    <div class="card shadow mb-4">
                        <div class="card-body">
                            <h4 class="header-title"><i class="ti-clipboard"></i> DISAPPROVED INSPECTION DATA</h4><br>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="single-table">
                                        <div class="table-responsive">
                                            <table class="table text-center table-bordered" id="tbl_disapproved_inspection_data">
                                                <thead class="text-uppercase bg-dark">
                                                    <tr class="text-white">
                                                       <th>PART NO</th>
                                                       <th>REVISION</th>
                                                       <th>TRIAL NO</th>
                                                       <th>DISAPPROVED BY</th>
                                                       <th>DISAPPROVED DATE/TIME</th>
                                                       <th>REASON</th>
                                                       <th>ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="tbody_tbl_disapproved_inspection_data"></tbody>
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

        @include('Evaluator.evaluation_modal')
    </div>

@endsection

@section('custom-script')
<script src="../node_modules/sweetalert2/dist/sweetalert2.min.js"></script>
<script src="../node_modules/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="../node_modules/select2/dist/js/select2.min.js"></script>
<script src="{{ asset('scripts/Evaluator/evaluation.js') }}"></script>
<script src="{{ asset('scripts/Checksheet/trial_checksheet_igm.js') }}"></script>
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
</script>
@endsection
