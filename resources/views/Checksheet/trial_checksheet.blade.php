@extends('Template.template')

@section('custom-css')
<link rel="stylesheet" href="../node_modules/sweetalert2/dist/sweetalert2.min.css">
<link rel="stylesheet" href="../node_modules/@sweetalert2/theme-dark/dark.css">
<link rel="stylesheet" href="../node_modules/datatables.net/css/jquery.dataTables.min.css">
<link rel="stylesheet" href="../node_modules/select2/dist/css/select2.min.css">
<link rel="stylesheet" href="{{ asset('template/assets/timer/inc/TimeCircles.css') }}">
@endsection

@section('content-page')

<div class="main-content-inner">

    <div class="container">
        <div class="row">
            <div class="col-lg-12 mt-5">
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <h4 class="header-title"><i class="ti-clipboard"></i> TRIAL CHECKSHEET</h4>
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
                                            {{-- HIDDEN ID REQUEST NI JED --}}
                                            <span id="span_checksheet_details_id" hidden></span>
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <label>PART NO:</label>&nbsp;
                                                    <span id="span_part_no" class="span-error form_trial_checksheet_field_error"></span>
                                                    <select class="form-control mb-3 select2 form_trial_checksheet_field" name="slc_part_no" id="slc_part_no">
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
                            <div class="according accordion-s3 gradiant-bg mb-3">
                                <div class="card">
                                    <div class="card-header">
                                        <a class="card-link" data-toggle="collapse" href="#accordion_cycle_time"><strong
                                                style="font-size: 20px;"><i class="ti-time"></i>&nbsp; CYCLE
                                                TIME</strong></a>
                                    </div>
                                    <div id="accordion_cycle_time" class="collapse show" data-parent="#accordion4">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-7">
                                                    <div class="card shadow mb-4">
                                                        <div class="card-body">
                                                            <div class="row">
                                                                <div class="col-md-12" align="center">
                                                                    <div class="alert alert-info">
                                                                        <h5 class="header-title"><i
                                                                                class="ti-timer"></i>
                                                                            TARGET
                                                                            TAKT TIME</h5>
                                                                        <div id="div_target_takt_time_timer"
                                                                            data-timer="9000" style="width: 450px;"
                                                                            align="center">
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-md-6">
                                                                    <div class="alert alert-success">
                                                                        <h5 class="header-title"><i
                                                                                class="ti-timer"></i>
                                                                            ACTUAL TIME</h5>
                                                                        <div id="div_actual_time_timer" data-timer="0"
                                                                            style="width: 390px;" align="center">
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div class="col-md-6">
                                                                    <div class="alert alert-warning">
                                                                        <h5 class="header-title"><i
                                                                                class="ti-timer"></i>
                                                                            TAKT TIME</h5>
                                                                        <div id="div_takt_time_timer" data-timer="0"
                                                                            style="width: 390px;" align="center">
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row mb-3">
                                                                <div class="col-md-12">
                                                                    <div class="single-table">
                                                                        <div class="table-responsive">
                                                                            <table
                                                                                class="table text-center table-sm table-bordered"
                                                                                id="tbl_downtime">
                                                                                <thead class="text-uppercase bg-dark">
                                                                                    <tr class="text-white">
                                                                                        <th>DATE START</th>
                                                                                        <th>DATE FINISH</th>
                                                                                        <th>START TIME</th>
                                                                                        <th>END TIME</th>
                                                                                        <th>TOTAL TAKT TIME</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody id="tbody_tbl_downtime">
                                                                                    <tr>
                                                                                        <td id="td_date_start_takt_time"></td>
                                                                                        <td id="td_date_finish_takt_time"></td>
                                                                                        <td id="td_start_time_takt_time"></td>
                                                                                        <td id="td_end_time_takt_time"></td>
                                                                                        <td id="td_total_takt_time"></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-md-12">
                                                                    <button type="button"
                                                                        class="btn btn-success btn-block"
                                                                        id="btn_start_time"
                                                                        onclick="CHECKSHEET.TaktTimeTimerAction('start_takt_time');"
                                                                        id="btn_start_time">
                                                                        <strong class="strong-font">
                                                                            <i class="ti-control-play"></i> START
                                                                        </strong>
                                                                    </button>
                                                                    <button type="button"
                                                                        class="btn btn-danger btn-block"
                                                                        id="btn_stop_time"
                                                                        onclick="CHECKSHEET.TaktTimeTimerAction('stop_takt_time');"
                                                                        id="btn_stop_time">
                                                                        <strong class="strong-font">
                                                                            <i class="ti-control-stop"></i> STOP
                                                                        </strong>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-5">
                                                    <div class="card shadow mb-4">
                                                        <div class="card-body">
                                                            <div class="row">
                                                                <div class="col-md-12">
                                                                    <h5 class="header-title"><i class="ti-timer"></i>
                                                                        DOWNTIME</h5>
                                                                    <span id="txt_downtime_running_time" hidden></span>
                                                                    <label>TYPE:</label>&nbsp;
                                                                    <span id="span_error_downtime_type"
                                                                        class="span-error"></span>
                                                                    <select class="form-control mb-3" name=""
                                                                        id="slc_downtime_type">
                                                                        <option value="" selected disabled>Select type
                                                                        </option>
                                                                        <option value="Type 1">Type 1</option>
                                                                        <option value="Type 2">Type 2</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div class="row mb-3">
                                                                <div class="col-md-12" align="center">
                                                                    <div id="div_downtime_timer" data-timer="0"
                                                                        style="width: 500px;">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row mb-3">
                                                                <div class="col-md-12">
                                                                    <div class="single-table">
                                                                        <div class="table-responsive">
                                                                            <table
                                                                                class="table text-center table-sm table-bordered"
                                                                                id="tbl_downtime_code">
                                                                                <thead class="text-uppercase bg-dark">
                                                                                    <tr class="text-white">
                                                                                        <th scope="col">DOWNTIME TYPE
                                                                                        </th>
                                                                                        <th scope="col">START TIME</th>
                                                                                        <th scope="col">END TIME</th>
                                                                                        <th scope="col">DOWNTIME</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody id="tbody_tbl_downtime_code">
                                                                                </tbody>
                                                                                <tfoot>
                                                                                    <tr class="bg-info text-white">
                                                                                        <th colspan="3">TOTAL DOWNTIME
                                                                                        </th>
                                                                                        <td id="td_total_downtime"></td>
                                                                                    </tr>
                                                                                </tfoot>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-md-6">
                                                                    <button type="button" id="btn_start_downtime"
                                                                        class="btn btn-success btn-block"
                                                                        onclick="CHECKSHEET.DowntimeTimerAction('start_downtime')">
                                                                        <strong class="strong-font">
                                                                            <i class="ti-control-play"></i>
                                                                        </strong> START
                                                                    </button>
                                                                </div>
                                                                <div class="col-md-6">
                                                                    <button type="button" id="btn_finish_downtime"
                                                                        class="btn btn-danger btn-block"
                                                                        onclick="CHECKSHEET.DowntimeTimerAction('finish_down_time')">
                                                                        <strong class="strong-font">
                                                                            <i class="ti-control-stop"></i>
                                                                        </strong> FINISH
                                                                    </button>
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
                            <div class="according accordion-s3 gradiant-bg mb-5">
                                <div class="card">
                                    <div class="card-header">
                                        <a class="card-link" data-toggle="collapse" href="#accordion_igm"><strong
                                                style="font-size: 20px;"><i class="ti-layout-grid2"></i>
                                                IGM</strong></a>
                                    </div>
                                    <div id="accordion_igm" class="collapse show" data-parent="#accordion4">
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
                                                                        <td hidden><span id="span_item_no_1_type">MC</span></td>
                                                                        <td hidden><span id="span_item_no_1_sub_item_count">1</span></td>
                                                                        <td>1</td> 
                                                                        <td id="td_item_no_1_tools">test1</td>
                                                                        <td id="td_item_no_1_type">test2</td>
                                                                        <td id="td_item_no_1_specs">test3</td>
                                                                        <td id="td_item_no_1_upper_limit">test4</td>
                                                                        <td id="td_item_no_1_lower_limit">test5</td>
                                                                        <td id="td_item_no_1_judgement">test6</td>
                                                                    </tr>
                                                                    <tr id="tr_item_no_1_sub_no_column" >
                                                                        <th id="th_tr_item_no_1_sub_no_column_rowspan" rowspan="3"></th>
                                                                        <th class="th_igm_sub_column">SUB NO</th>
                                                                        <th class="th_igm_sub_column">COORDINATES</th>
                                                                        <th class="th_igm_sub_column" colspan="5">DATA</th>
                                                                        <th class="th_igm_sub_column">JUDGEMENT</th>
                                                                    </tr>
                                                                    <tr id="tr_item_no_1_sub_no_1" >
                                                                        <td>1</td>
                                                                        <td id="td_item_no_1_sub_no_1_coordinates">test</td>
                                                                        <td id="td_item_no_1_sub_no_1_visual_1">test</td>
                                                                        <td id="td_item_no_1_sub_no_1_visual_2">test</td>
                                                                        <td id="td_item_no_1_sub_no_1_visual_3">test</td>
                                                                        <td id="td_item_no_1_sub_no_1_visual_4">test</td>
                                                                        <td id="td_item_no_1_sub_no_1_visual_5">test</td>
                                                                        <td id="td_item_no_1_sub_no_1_judgement">GOOD/NG</td>
                                                                    </tr>
                                                                </tbody>
                                                                <tfoot id="tfoot_add_igm_item">
                                                                   <td colspan="9"> {{--  type, current_item_no + 1, sub item count, added item no in between count--}}
                                                                        <button type="button" class="btn btn-success btn-block" onclick="IGM.AddIgmItemNo('',2,0,0);"><strong class="strong-font"><i class="ti-plus"></i> ADD ITEM</strong></button>
                                                                    </td>
                                                                </tfoot>
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
                                                                    <tr class="text-white"  id="tr_item_no_main_column">
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
                                    <label>ATTACH FILE:</label>&nbsp;
                                    <span id="span_attach_file" class="span-error form_trial_checksheet_field_error"></span>
                                    <input type="file" class="form-control mb-2 form_trial_checksheet_field"
                                        name="attachment" id="txt_attachment"
                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                                    <label>DATE INSPECTED:</label>&nbsp;
                                    <span id="span_date_inspected" class="span-error"></span>
                                    <input class="form-control mb-3" type="text"
                                        placeholder="Date Inspected" id="txt_date_inspected" disabled>
                                </div>
                                <div class="col-md-6">
                                    <label>TEMPERATURE:</label>&nbsp;
                                    <span id="span_temperature" class="span-error form_trial_checksheet_field_error"></span>
                                    <input class="form-control mb-3 form_trial_checksheet_field" type="text"
                                        placeholder="Temperature" id="txt_temperature" onkeypress='return event.charCode >= 48 && event.charCode <= 57'>
                                    <label>HUMIDITY:</label>&nbsp;
                                    <span id="span_humidity" class="span-error form_trial_checksheet_field_error"></span>
                                    <input class="form-control mb-3 form_trial_checksheet_field" type="text"
                                        placeholder="Humidity" id="txt_humidity" onkeypress='return event.charCode >= 48 && event.charCode <= 57'>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <button type="button" class="btn btn-primary btn-block"
                                        onclick="CHECKSHEET.SaveTrialChecksheet();">
                                        <h4><i class="ti-save"></i> SAVE</h4>
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
    <script src="{{ asset('template/assets/timer/inc/TimeCircles.js') }}"></script>
    <script src="{{ asset('scripts/Checksheet/trial_checksheet.js') }}"></script>
    <script src="{{ asset('scripts/Checksheet/trial_checksheet_time_functions.js') }}"></script>
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
        select2.data('select2').$selection.css('height', '45px');
        select2.data('select2').$selection.css('margin-bottom', '15px');
        
    </script>
    @endsection
