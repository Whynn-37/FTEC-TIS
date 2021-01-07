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
        <div class="row" id="div_main_content">
            <div class="col-lg-12 mt-5">
                <div class="card shadow mb-4">
                    <div class="card-body" id="div_trial_checksheet">
                        <h4 class="header-title"><i class="ti-clipboard"></i> TRIAL CHECKSHEET</h4>
                        <form id="form_trial_checksheet" method="post" enctype="multipart/form-data">
                            {{-- CHECKSHEET --}}
                            @csrf
                            <div id="accordion4" class="according accordion-s2 gradiant-bg mb-3">
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
                                            <input type="text" id="trial_checksheet_id" name="trial_checksheet_id">
                                            <input type="text" id="trial_checksheet_application_date" name="application_date">
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <label>PART NUMBER:</label>&nbsp;
                                                    <span id="span_part_no" class="span-error form_trial_checksheet_field_error"></span>
                                                    <select class="form-control mb-3 select2 form_trial_checksheet_field" name="part_number" id="slc_part_number" onchange="CHECKSHEET.LoadInspectionReason(this.value)"></select>
                                                </div>
                                                <div class="col-md-4">
                                                    <label>REVISION:</label>
                                                    <select class="form-control mb-3 form_trial_checksheet_field" name="revision_number" id="slc_revision_number" onchange="CHECKSHEET.LoadTrialNumber(this.value)"></select>
                                                </div>
                                                <div class="col-md-4 mb-3">
                                                    <label>TRIAL NUMBER:</label>
                                                    <select id="slc_trial_number" class="form-control mb-3" onchange="CHECKSHEET.LoadApplicationDate()"></select>
                                                </div>
                                                {{-- <div class="col-md-4">
                                                    <label>PART NUMBER:</label>&nbsp;
                                                    <span id="span_part_no" class="span-error form_trial_checksheet_field_error"></span>
                                                    <select class="form-control mb-3 select2 form_trial_checksheet_field" name="part_number" id="slc_part_number" onchange="CHECKSHEET.LoadRevision(this.value)"></select>
                                                </div>
                                                <div class="col-md-4">
                                                    <label>REVISION:</label>
                                                    <select class="form-control mb-3 form_trial_checksheet_field" name="revision_number" id="slc_revision_number" onchange="CHECKSHEET.LoadTrialNumber()"></select>
                                                </div>
                                                <div class="col-md-4 mb-3">
                                                    <label>TRIAL NUMBER:</label>
                                                    <select id="slc_trial_number" class="form-control mb-3"></select>
                                                </div> --}}
                                            </div>
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <label>PART NAME:</label>
                                                    <input class="form-control mb-3" type="text" placeholder="Part name" id="txt_part_name" readonly>
                                                </div>
                                                <div class="col-md-4 mb-3">
                                                    <label>MODEL NAME:</label>
                                                    <input class="form-control mb-3" type="text" placeholder="Model name" id="txt_model_name" readonly>
                                                </div>
                                                <div class="col-md-4 mb-3">
                                                    <label>SUPPLIER CODE / SUPPLIER NAME:</label>
                                                    <div class="input-group">
                                                        <input type="text" class="form-control" id="txt_supplier_code" placeholder="Supplier code" readonly>
                                                        <input type="text" class="form-control" id="txt_supplier_name" placeholder="Supplier name" readonly>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <label>RECEIVED DATE:</label>
                                                    <input class="form-control mb-3" type="text" placeholder="Received date" id="txt_received_date" readonly>
                                                </div>
                                                <div class="col-md-4">
                                                    <label>INSPECTION COMPLETION DATE:</label>
                                                    <input class="form-control mb-3" type="text" placeholder="Inspection completion date" id="txt_inspection_completion_date" readonly>
                                                </div>
                                                <div class="col-md-4 mb-3">
                                                    <label>ACTUAL INSPECTION TIME:</label>
                                                    <input class="form-control mb-3" type="text" placeholder="Actual inspection time" id="txt_actual_inspection_time" readonly>
                                                </div>
                                            </div>
                                            <div class="row">
                                                {{-- <div class="col-md-4">
                                                    <label>TRIAL INSPECTION REASON (INSPECTION TYPE):</label>
                                                    <input class="form-control mb-3" type="text" placeholder="Trial inspection reason" id="txt_inspection_reason" readonly>
                                                </div> --}}
                                                <div class="col-md-4">
                                                    <label>TRIAL INSPECTION REASON (INSPECTION TYPE):</label>&nbsp;
                                                    <span id="span_insp_reason" class="span-error form_trial_checksheet_field_error"></span>
                                                    <select class="form-control mb-3 select2 form_trial_checksheet_field" name="inspection_reason" id="slc_inspection_reason" onchange="CHECKSHEET.LoadRevision(this.value)"></select>
                                                </div>
                                                <div class="col-md-4">
                                                    <label>KIND OF DIE:</label>
                                                    <input class="form-control mb-3" type="text" placeholder="Kind of die" id="txt_die_kind" readonly>
                                                </div>
                                                <div class="col-md-4">
                                                    <label for="">INSPECTOR:</label>
                                                    <input class="form-control mb-3" type="text" placeholder="Inspector" id="txt_inspector" readonly>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <button type="button" class="btn btn-primary btn-block" onclick="CHECKSHEET.ValidateLoadDetails();"><strong
                                                        style="font-size: 20px;"><i class="ti-search"></i> SEARCH</strong></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {{-- CYCLE TIME --}}
                            <div class="according accordion-s2 gradiant-bg mb-3">
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
                                                        <div class="card-body" id="div_card_takt_time">
                                                            <div class="row">
                                                                <div class="col-md-12" align="center">
                                                                    <div class="alert alert-info" id="div_takt_time">
                                                                        <h5 class="header-title"><i class="ti-timer"></i> TARGET
                                                                            TAKT TIME</h5>
                                                                        <div id="div_target_takt_time_timer"  style="width: 450px;"
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
                                                                        <div id="div_actual_time_timer"
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
                                                                                id="tbl_takt_time">
                                                                                <thead class="text-uppercase bg-dark">
                                                                                    <tr class="text-white">
                                                                                        <th>DATE START</th>
                                                                                        <th>START TIME</th>
                                                                                        <th>END TIME</th>
                                                                                        <th>TOTAL TAKT TIME</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody id="tbody_tbl_takt_time"></tbody>
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
                                                                        id="btn_start_time" disabled>
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
                                                        <div class="card-body" id="div_downtime">
                                                            <div class="row">
                                                                <div class="col-md-12">
                                                                    <h5 class="header-title"><i class="ti-timer"></i>
                                                                        DOWNTIME</h5>
                                                                    <span id="txt_downtime_running_time" hidden></span>
                                                                    <label>TYPE:</label>&nbsp;
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
                                                                            <table class="table text-center table-sm table-bordered"
                                                                                id="tbl_downtime">
                                                                                <thead class="text-uppercase bg-dark">
                                                                                    <tr class="text-white">
                                                                                        <th scope="col">DOWNTIME TYPE
                                                                                        </th>
                                                                                        <th scope="col">START TIME</th>
                                                                                        <th scope="col">END TIME</th>
                                                                                        <th scope="col">DOWNTIME</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody id="tbody_tbl_downtime">
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
                            {{-- IGM --}}
                            <div class="according accordion-s2 gradiant-bg mb-5" id="div_accordion_igm" hidden>
                                <div class="card">
                                    <div class="card-header">
                                        <a class="card-link" data-toggle="collapse" href="#accordion_igm"><strong
                                                style="font-size: 20px;"><i class="ti-layout-grid2"></i>
                                                CHECKSHEET</strong></a>
                                    </div>
                                    <div id="accordion_igm" class="collapse show" data-parent="#accordion4">
                                        <div class="card-body">
                                            <button id="btn_validate_load_igm" type="button" class="btn btn-primary btn-block" onclick="IGM.ValidateLoadIGM();" hidden><strong
                                                style="font-size: 20px;"><i class="ti-reload"></i> CLICK TO LOAD IGM</strong></button>
                                            {{-- existing --}}
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="single-table">
                                                        <div class="table-responsive">
                                                            <table class="table text-center table-sm table-bordered" id="tbl_igm" hidden>
                                                                <tbody id="tbody_tbl_igm" hidden></tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <br>
                                            {{-- manual adding --}}
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
                            <div class="row" id="div_row_numbering_drawing" hidden>
                                <div class="col-md-3">
                                    <label>ATTACH FILE (NUMBERING DRAWING):</label>&nbsp;
                                    <span id="span_attach_file_numbering_drawing" class="span-error form_trial_checksheet_field_error"></span>
                                    <input type="file"  class="form-control mb-2 form_trial_checksheet_field" name="numbering_drawing" id="txt_attachment_numbering_drawing" accept="application/pdf,image/*" onchange="CHECKSHEET.ValidateAttachment(this.value,'numbering_drawing');">
                                </div>
                                <div class="col-md-3">
                                    <label>ATTACH FILE (MATERIAL CERTIFICATION):</label>&nbsp;
                                    <span id="span_attach_file_material_certification" class="span-error  form_trial_checksheet_field_error"></span>
                                    <input type="file"  class="form-control mb-2 form_trial_checksheet_field" name="material_certification" id="txt_attachment_material_certification" accept="application/pdf,image/*" onchange="CHECKSHEET.ValidateAttachment(this.value,'material_certification');">
                                </div>
                                <div class="col-md-6">
                                    <label>DATE INSPECTED:</label>&nbsp;
                                    <span id="span_date_inspected" class="span-error"></span>
                                    <input class="form-control mb-3" type="text" placeholder="Date Inspected" id="txt_date_inspected" name="date_inspected" readonly>
                                </div>
                                
                            </div>
                            <div class="row" id="div_row_special_tool_data" hidden>
                                <div class="col-md-3">
                                    <label>ATTACH FILE (SPECIAL TOOL DATA):</label>&nbsp;
                                    <span id="span_attach_file_special_tool_data" class="span-error  form_trial_checksheet_field_error"></span>
                                    <input type="file"  class="form-control mb-2 form_trial_checksheet_field" name="special_tool_data" id="txt_attachment_special_tool_data" accept="application/pdf,image/*" onchange="CHECKSHEET.ValidateAttachment(this.value,'special_tool_data');">
                                </div>
                                <div class="col-md-3">
                                    <label>ATTACH FILE (OTHERS 1):</label>&nbsp;
                                    <span id="span_attach_file_others_1" class="span-error"></span>
                                    <input type="file"  class="form-control mb-2" name="others_1" id="txt_attachment_others_1" accept="application/pdf,image/*" onchange="CHECKSHEET.ValidateAttachment(this.value,'others_1');">
                                </div>
                                <div class="col-md-6">
                                    <label id="lbl_temperature">TEMPERATURE:</label>&nbsp;
                                    <span id="span_temperature" class="span-error form_trial_checksheet_field_error"></span>
                                    <input class="form-control mb-3 form_trial_checksheet_field" type="text" name="temperature" placeholder="Temperature" id="txt_temperature" onkeypress='return event.charCode >= 46 && event.charCode <= 57'>
                                </div>
                            </div>
                            <div class="row" id="div_row_others_2" hidden>
                                <div class="col-md-6">
                                    <label>ATTACH FILE (OTHERS 2):</label>&nbsp;
                                    <span id="span_attach_file_others_2" class="span-error"></span>
                                    <input type="file"  class="form-control mb-2" name="others_2" id="txt_attachment_others_2" accept="application/pdf,image/*" onchange="CHECKSHEET.ValidateAttachment(this.value,'others_2');">
                                </div>
                                <div class="col-md-6">
                                    <label>HUMIDITY:</label>&nbsp;
                                    <span id="span_humidity" class="span-error form_trial_checksheet_field_error"></span>
                                    <input class="form-control mb-3 form_trial_checksheet_field" type="text"
                                        placeholder="Humidity" id="txt_humidity" name="humidity" onkeypress='return event.charCode >= 46 && event.charCode <= 57'>
                                </div>
                            </div><br>
                            <div class="row" id="div_row_save_inspection" hidden>
                                <div class="col-md-12">
                                    <button type="button" class="btn btn-primary btn-block" onclick="CHECKSHEET.ValidateSaveTrialChecksheet();">
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
            cancelButtonText: 'No',
            allowOutsideClick: false,
            customClass: 'swal-wide',
        };
        const swal_options_refresh = {
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'REFRESH',
            allowOutsideClick: false,
            customClass: 'swal-wide',
        };
        // select2
        let select2 = $('.select2').select2();
        select2.data('select2').$selection.css('height', '45px');
        select2.data('select2').$selection.css('margin-bottom', '15px');
        
    </script>
    @endsection
