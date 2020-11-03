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
                        <h4 class="header-title"><i class="ti-clipboard"></i> EVALUATION</h4>
                        <form id="form_trial_checksheet" method="post" enctype="multipart/form-data">
                            <div id="accordion4" class="according accordion-s3 gradiant-bg mb-3">
                                <div class="card">
                                    <div class="card-header">
                                        <a class="card-link" data-toggle="collapse" href="#accordion_details"><strong
                                                style="font-size: 20px;"><i
                                                    class="ti-view-list-alt"></i>&nbsp;CHECKSHEET
                                                DETAILS</strong></a>
                                    </div>
                                    <div id="accordion_details" class="collapse show" data-parent="#accordion4">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <label>PART NO:</label>&nbsp;
                                                    <span id="span_part_no" class="span-error form_trial_checksheet_field_error"></span>
                                                    <select
                                                        class="form-control mb-3 select2 form_trial_checksheet_field"
                                                        name="slc_part_no" id="slc_part_no">
                                                        <option value="" selected disabled>Select part no.</option>
                                                        <option value="Part no 1">Part no 1</option>
                                                        <option value="Part no 2">Part no 2</option>
                                                    </select>
                                                    <label>PART NAME:</label>
                                                    <input class="form-control mb-2" type="text" placeholder="Part Name"
                                                        id="txt_part_name" disabled>
                                                    <label>SUPPLIER:</label>
                                                    <input class="form-control mb-3" type="text" placeholder="Supplier"
                                                        id="txt_supplier" disabled>
                                                </div>
                                                <div class="col-md-4">
                                                    <label>REVISION:</label>
                                                    <input class="form-control mb-3" type="text" placeholder="Revision"
                                                        disabled>
                                                    <label>TRIAL APPLICATION:</label>
                                                    <input class="form-control mb-3" type="text"
                                                        placeholder="Trial Application" id="txt_trial_application"
                                                        disabled>
                                                    <label>KIND OF DIE:</label>
                                                    <input class="form-control mb-3" type="text"
                                                        placeholder="Kind of Die" id="txt_kind_of_die" disabled>
                                                </div>
                                                <div class="col-md-4">
                                                    <label>MODEL NAME:</label>
                                                    <input class="form-control mb-3" type="text"
                                                        placeholder="Model Name" id="txt_model_name" disabled>
                                                    <label>TRIAL STAGE:</label>
                                                    <input class="form-control mb-3" type="text"
                                                        placeholder="Trial Stage" id="txt_trial_stage" disabled>
                                                    <label>JUDGEMENT:</label>
                                                    <input class="form-control mb-3" type="text" placeholder="Judgement"
                                                        id="txt_judgement" disabled>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="accordion_attachment" class="according accordion-s3 gradiant-bg mb-3">
                                <div class="card">
                                    <div class="card-header">
                                        <a class="card-link" data-toggle="collapse" href="#accordion_attach_files"><strong
                                                style="font-size: 20px;"><i
                                                    class="ti-files"></i>&nbsp;ATTACHMENTS</strong></a>
                                    </div>
                                    <div id="accordion_attach_files" class="collapse show" data-parent="#accordion_attachment">
                                        <div class="card-body"><br>
                                            <div class="row">
                                                <div class="vertical-rectangle">
                                                    <img src="{{ asset('template/assets/images/icon/file.png') }}" alt="Avatar" class="file-image" style="width:100%">
                                                    <div class="file-options">
                                                        <button type="button" class="btn btn-green"><i class="ti-eye"></i> VIEW FILE</button>
                                                    </div>
                                                </div>
                                                <div class="vertical-rectangle">
                                                    <img src="{{ asset('template/assets/images/icon/file.png') }}" alt="Avatar" class="file-image" style="width:100%">
                                                    <div class="file-options">
                                                        <button type="button" class="btn btn-green"><i class="ti-eye"></i> VIEW FILE</button>
                                                    </div>
                                                </div>
                                                <div class="vertical-rectangle">
                                                    <img src="{{ asset('template/assets/images/icon/file.png') }}" alt="Avatar" class="file-image" style="width:100%">
                                                    <div class="file-options">
                                                        <button type="button" class="btn btn-green"><i class="ti-eye"></i> VIEW FILE</button>
                                                    </div>
                                                </div>
                                                <div class="vertical-rectangle">
                                                    <img src="{{ asset('template/assets/images/icon/file.png') }}" alt="Avatar" class="file-image" style="width:100%">
                                                    <div class="file-options">
                                                        <button type="button" class="btn btn-green"><i class="ti-eye"></i> VIEW FILE</button>
                                                    </div>
                                                </div>
                                                <div class="vertical-rectangle">
                                                    <img src="{{ asset('template/assets/images/icon/file.png') }}" alt="Avatar" class="file-image" style="width:100%">
                                                    <div class="file-options">
                                                        <button type="button" class="btn btn-green"><i class="ti-eye"></i> VIEW FILE</button>
                                                    </div>
                                                </div>
                                            </div><br>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="accordion_igm" class="according accordion-s3 gradiant-bg mb-5">
                                <div class="card">
                                    <div class="card-header">
                                        <a class="card-link" data-toggle="collapse" href="#accordion_igm_details"><strong
                                                style="font-size: 20px;"><i class="ti-layout-grid2"></i>
                                                IGM</strong></a>
                                    </div>
                                    <div id="accordion_igm_details" class="collapse show" data-parent="#accordion_igm">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="single-table">
                                                        <div class="table-responsive">
                                                            <table class="table text-center table-sm table-bordered" id="tbl_igm">
                                                                <thead class="text-uppercase bg-dark">
                                                                    <tr class="text-white">
                                                                        <th>ITEM NO</th>
                                                                        <th>TOOLS</th>
                                                                        <th>TYPE</th>
                                                                        <th>SPECS</th>
                                                                        <th>UPPER LIMIT</th>
                                                                        <th>LOWER LIMIT</th>
                                                                        <th>JUDGEMENT</th>
                                                                        <th id="th_igm_item_no_extra_column" colspan="7"></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody id="tbody_tbl_igm">
                                                                    <tr id="tr_item_no_1">
                                                                        <td>1</td> 
                                                                        <td id="td_item_no_1_tools">test1</td> 
                                                                        <td id="td_item_no_1_type">test2</td>
                                                                        <td id="td_item_no_1_specs">test3</td>
                                                                        <td id="td_item_no_1_upper_limit">test4</td>
                                                                        <td id="td_item_no_1_lower_limit">test5</td>
                                                                        <td id="td_item_no_1_judgement">test</td>
                                                                        <td colspan="3" id="td_item_no_1_hinsei">  {{--onclick="EVALUATE.Hinsei(item no,TOOLS,TYPE,SPECS,UPPERLIMIT,LOWERLIMIT);" --}}
                                                                            <button type="button" id="btn_item_no_1_hinsei" type="button" class="btn btn-primary btn-block" onclick="EVALUATE.Hinsei(1,'test1','test2','test3',15,10);"><strong class="strong-font"><i class="ti-notepad"></i> HINSEI</strong></button>
                                                                        </td>
                                                                    </tr>
                                                                    <tr id="tr_item_no_1_sub_no_column" >
                                                                        <th id="th_tr_item_no_1_sub_no_column_rowspan" rowspan="2"></th>
                                                                        <th class="th_igm_sub_column">SUB NO</th>
                                                                        <th class="th_igm_sub_column">COORDINATES</th>
                                                                        <th class="th_igm_sub_column" colspan="5">DATA</th>
                                                                        <th class="th_igm_sub_column">JUDGEMENT</th>
                                                                        <th class="th_igm_sub_column"></th>
                                                                    </tr>
                                                                    <tr id="tr_item_no_1_sub_no_1" >
                                                                        <td>1</td>
                                                                        <td id="td_sub_no_1_coordinates">test1</td> 
                                                                        <td id="td_sub_no_1_data1">33</td>
                                                                        <td id="td_sub_no_1_data2">22</td>
                                                                        <td id="td_sub_no_1_data3">11</td>
                                                                        <td id="td_sub_no_1_data4">55</td>
                                                                        <td id="td_sub_no_1_data5">99</td>
                                                                        <td id="td_sub_no_1_judgement">GOOD/NG</td>
                                                                        <td id="td_sub_no_1_edit">{{--onclick="EVALUATE.EditSubItem(sub no.,coordinates,data(x5));" --}}
                                                                            <button type="button" id="btn_edit_sub_no_1" type="button" class="btn btn-success btn-block" onclick="EVALUATE.EditSubItem(1,33,22,11,55,22,99);"><strong class="strong-font"><i class="ti-pencil-alt"></i> EDIT</strong></button>
                                                                        </td>
                                                                    </tr>
                                                                    <tr class="text-white">
                                                                        <th class="th_igm_sub_column">ITEM NO</th>
                                                                        <th class="th_igm_sub_column">TOOLS</th>
                                                                        <th class="th_igm_sub_column">TYPE</th>
                                                                        <th class="th_igm_sub_column">SPECS</th>
                                                                        <th class="th_igm_sub_column">UPPER LIMIT</th>
                                                                        <th class="th_igm_sub_column">LOWER LIMIT</th>
                                                                        <th class="th_igm_sub_column">JUDGEMENT</th>
                                                                        <th class="th_igm_sub_column" id="th_igm_item_no_extra_column" colspan="7"></th>
                                                                    </tr>
                                                                    <tr id="tr_item_no_1">
                                                                        <td>2</td> 
                                                                        <td>test</td>
                                                                        <td>test</td>
                                                                        <td>test</td>
                                                                        <td>test</td>
                                                                        <td>test</td>
                                                                        <td>test</td>
                                                                        <td colspan="3" id="td_item_no_2_hinsei">
                                                                            <button id="btn_item_no_2_hinsei" type="button" class="btn btn-primary btn-block" onclick="EVALUATE.Hinsei(2);"><strong class="strong-font"><i class="ti-notepad"></i> HINSEI</strong></button>
                                                                        </td>
                                                                    </tr>
                                                                    <tr id="tr_item_no_1_sub_no_column" >
                                                                        <th id="th_tr_item_no_1_sub_no_column_rowspan" rowspan="3"></th>
                                                                        <th class="th_igm_sub_column">SUB NO</th>
                                                                        <th class="th_igm_sub_column">COORDINATES</th>
                                                                        <th class="th_igm_sub_column" colspan="5">DATA</th>
                                                                        <th class="th_igm_sub_column">JUDGEMENT</th>
                                                                        <th class="th_igm_sub_column"></th>
                                                                    </tr>
                                                                    <tr id="tr_item_no_1_sub_no_1" >
                                                                        <td>1</td>
                                                                        <td>test</td>
                                                                        <td>test</td>
                                                                        <td>test</td>
                                                                        <td>test</td>
                                                                        <td>test</td>
                                                                        <td>test</td>
                                                                        <td>GOOD/NG</td>
                                                                        <td>
                                                                            <button type="button" class="btn btn-success btn-block"><strong class="strong-font"><i class="ti-pencil-alt"></i> EDIT</strong></button>
                                                                        </td>
                                                                    </tr>
                                                                    <tr id="tr_item_no_1_sub_no_1" >
                                                                        <td>2</td>
                                                                        <td>test</td>
                                                                        <td>test</td>
                                                                        <td>test</td>
                                                                        <td>test</td>
                                                                        <td>test</td>
                                                                        <td>test</td>
                                                                        <td>GOOD/NG</td>
                                                                        <td>
                                                                            <button type="button" class="btn btn-success btn-block" onclick="EVALUATE.EditSubItems();"><strong class="strong-font"><i class="ti-pencil-alt"></i> EDIT</strong></button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <br>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="single-table">
                                                        <div class="table-responsive">
                                                            <table class="table text-center table-sm table-bordered" id="tbl_new_igm" hidden>
                                                                <thead class="text-uppercase bg-success">
                                                                    <tr class="text-white">
                                                                        <th>ITEM NO</th>
                                                                        <th>TOOLS</th>
                                                                        <th>TYPE</th>
                                                                        <th>SPECS</th>
                                                                        <th>UPPER LIMIT</th>
                                                                        <th>LOWER LIMIT</th>
                                                                        <th>JUDGEMENT</th>
                                                                        <th id="th_new_igm_item_no_extra_column" colspan="7" hidden></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody id="tbody_tbl_new_igm">
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
                            <div class="row">
                                <div class="col-md-6">
                                    <button type="button" class="btn btn-primary btn-block"
                                        onclick="EVALUATE.ApproveData();">
                                        <h4><i class="ti-check"></i> APPROVE</h4>
                                    </button>
                                </div>
                                <div class="col-md-6">
                                    <button type="button" class="btn btn-danger btn-block"
                                        onclick="EVALUATE.DisapproveData();">
                                        <h4><i class="ti-close"></i> DISAPPROVE</h4>
                                    </button>
                                </div>
                            </div>
                        </form>
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
    <script src="{{ asset('scripts/Evaluator/evaluation.js') }}"></script>
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
        select2.data('select2').$selection.css('height', '45px');
        select2.data('select2').$selection.css('margin-bottom', '15px');

    </script>
    @endsection
