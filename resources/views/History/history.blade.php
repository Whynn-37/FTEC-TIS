@extends('Template.template')

@section('custom-css')
<link rel="stylesheet" href="../node_modules/sweetalert2/dist/sweetalert2.min.css">
<link rel="stylesheet" href="../node_modules/@sweetalert2/theme-dark/dark.css">
<link rel="stylesheet" href="../node_modules/select2/dist/css/select2.min.css">
<link rel="stylesheet" href="../node_modules/datatables.net/css/jquery.dataTables.min.css">
@endsection

@section('content-page')

<div class="main-content-inner">
    <div class="container">
        {{-- FINISHED --}}
        <div class="row">
            <div class="col-lg-12 mt-5">
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <h4 class="header-title"><i class="ti-clipboard"></i> HISTORY </h4><br>
                        <div class="row">
                            <div class="col-md-5">
                                <label>STATUS:</label>
                                <select class="form-control mb-3" name="state" id="slc_status">
                                    <option value="null" disabled selected>SELECT</option>
                                    <option value="For Inspection">FOR INSPECTION</option>
                                    <option value="For Evaluation">FOR EVALUATION</option>
                                    <option value="For Approval">FOR APPROVAL</option>
                                    <option value="Approved">APPROVED</option>
                                    <option value="Disapproved">DISAPPROVED</option>
                                </select>
                            </div>
                            <div class="col-md-2 float-right">
                                <button class="btn btn-success" id="btn_search" style="margin-top:28px;margin-left:50px;" onclick="HISTORY.LoadPartNumber();"><span class="fa fa-search"></span> SEARCH </button>
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
                        <h4 class="header-title"><i class="ti-clipboard"></i> HISTORY DATA</h4><br>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="single-table">
                                    <div class="table-responsive">
                                        <table class="table text-center table-bordered" id="tbl_history_data" style="text-align:justify;">
                                            <thead class="text-uppercase bg-dark">
                                                <tr class="text-white">
                                                    <th>ACTION</th>
                                                    <th>PART NUMBER</th>
                                                    <th>PART NAME</th>
                                                    <th>SUPPLIER NAME</th>
                                                    <th>REVISION</th>
                                                    <th>TRIAL NUMBER</th>
                                                    <th>JUDGMENT</th>
                                                    <th>INSPECTED BY</th>
                                                    <th>INSPECTOR DATE</th>
                                                    <th>EVALUATED BY</th>
                                                    <th>EVALUATED DATE</th>
                                                    <th>APPROVED BY</th>
                                                    <th>APPROVED DATE</th>
                                                    <th>MERGE PDF</th>
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
    </div>

    @include('Approver.approval_modal')
</div>

@endsection
@section('custom-script')
<script src="../node_modules/sweetalert2/dist/sweetalert2.min.js"></script>
<script src="../node_modules/select2/dist/js/select2.min.js"></script>
<script src="../node_modules/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="{{ asset('scripts/History/history.js') }}"></script>
 <script src="{{ asset('scripts/Approver/approval.js') }}"></script>
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

     // select2
     let select2 = $('.select2').select2();      
</script>
@endsection
