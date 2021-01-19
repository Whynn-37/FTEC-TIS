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
        {{-- <div class="row">
            <div class="col-lg-12 mt-5">
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <h4 class="header-title"><i class="ti-shopping-cart-full"></i> SUPPLIER </h4><br>
                        <!-- Custom file input start -->
                            <div class="row">
                                <div class="col-6">
                                    <label> UPLOAD FILE </label>
                                    <div class="input-group mb-3">
                                        <input type="file"  class="form-control mb-2 form_upload_supplier" id="txt_upload_file">
                                    </div>
                                </div>
                                <div class="col-2">
                                    <label>&nbsp;</label>
                                    <div class="input-group-append">
                                        <button class="btn btn-primary"><b> <i class="ti-upload"> </i> UPLOAD </b></button>
                                        <div class="col-2">
                                            <button class="btn btn-success"><b> <i class="ti-download"> </i> DOWNLOAD </b></button>
                                        </div>    
                                    </div>
                                </div>
                            </div>   
                        <!-- Custom file input end -->
                    </div>
                </div>
            </div>
        </div> --}}
        {{-- DISAPPROVED --}}
        <div class="row">
            <div class="col-lg-12 mt-5">
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-8">
                                <h4 class="header-title"><i class="ti-shopping-cart-full"> </i> SUPPLIER LIST </h4><br>
                            </div>
                            <div class="col-2">
                                <button class="btn btn-primary" style="float:right;" data-toggle="modal" data-target=".upload-supplier-modal" onclick=""><b> <i class="ti-cloud-up"> </i> UPLOAD FILE </b></button>
                            </div>
                            <div class="col-2">
                                <button class="btn btn-success" style="float:right;" data-toggle="modal" onclick="SUPPLIER.clearData();"><b><i class="ti-plus"></i> ADD SUPPLIER </b></button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="single-table">
                                    <div class="table-responsive">
                                        <table class="table text-center table-bordered" id="tbl_supplier_data" style="text-align:justify;">
                                            <thead class="text-uppercase bg-dark">
                                                <tr class="text-white">
                                                    <th> NUMBER </th>
                                                    <th> SUPPLIER CODE </th>
                                                    <th> SUPPLIER NAME </th>
                                                    <th> ACTION </th>
                                                 </tr>
                                            </thead>
                                            <tbody id="tbody_tbl_supplier_data"></tbody>
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

    @include('Management.supplier_modal')
</div>

@endsection
@section('custom-script')
<script src="../node_modules/sweetalert2/dist/sweetalert2.min.js"></script>
<script src="../node_modules/select2/dist/js/select2.min.js"></script>
<script src="../node_modules/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="{{ asset('scripts/Management/supplier.js') }}"></script>

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
