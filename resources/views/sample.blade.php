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
        <div class="row">
            <div class="col-lg-12 mt-5">
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <h4 class="header-title"><i class="ti-clipboard"></i> TRIAL CHECKSHEET</h4>
                        <div class="card-inner shadow mb-4">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-4">
                                        <select class="form-control select2" name="state">
                                            <option value="AL">Alabama</option>
                                            <option value="WY">Wyoming</option>
                                            <option value="WY">Wyoming</option>
                                            <option value="WY">Wyoming</option>
                                            <option value="WY">Wyoming</option>
                                            <option value="WY">Wyoming</option>
                                            <option value="WY">Wyoming</option>
                                            <option value="WY">Wyoming</option>
                                        </select>
                                    </div>
                                </div>
                                <br><br>
                                <div class="single-table">
                                    <div class="table-responsive">
                                        <table class="table text-center" id="tbl_checksheet">
                                            <thead class="text-uppercase bg-dark">
                                                <tr class="text-white">
                                                    <th scope="col">ID</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">date</th>
                                                    <th scope="col">price</th>
                                                    <th scope="col">action</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tbody_tbl_checksheet">
                                                <tr>
                                                    <th scope="row">1</th>
                                                    <td>Mark</td>
                                                    <td>09 / 07 / 2018</td>
                                                    <td>$120</td>
                                                    <td><i class="ti-trash"></i></td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">1</th>
                                                    <td>jone</td>
                                                    <td>09 / 07 / 2018</td>
                                                    <td>$150</td>
                                                    <td><i class="ti-trash"></i></td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">1</th>
                                                    <td>Mark</td>
                                                    <td>09 / 07 / 2018</td>
                                                    <td>$120</td>
                                                    <td><i class="ti-trash"></i></td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">1</th>
                                                    <td>jone</td>
                                                    <td>09 / 07 / 2018</td>
                                                    <td>$150</td>
                                                    <td><i class="ti-trash"></i></td>
                                                </tr>
                                            </tbody>
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

@endsection
@section('custom-script')
<script src="../node_modules/sweetalert2/dist/sweetalert2.min.js"></script>
<script src="../node_modules/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="../node_modules/select2/dist/js/select2.min.js"></script>
<script src="{{ asset('scripts/Checksheet/trial_checksheet.js') }}"></script>
<script>
    const swal_options = {
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        allowOutsideClick: false,
        customClass: 'swal-wide',
    };
    $('.select2').select2();

</script>
@endsection
