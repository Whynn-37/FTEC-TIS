<div id="modal_view_inspection_data" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content" id="div_modal_content">
            <div class="modal-header" id="modal_header">
                <h3 class="modal-title" id="modal_title"></h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="form_trial_checksheet" method="post" enctype="multipart/form-data">
                    <div id="accordion4" class="according accordion-s2 gradiant-bg-dark mb-3">
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
                                        {{-- HIDDEN ID REQUEST NI JED --}}
                                        <input type="text" id="trial_checksheet_id" hidden>
                                        <div class="col-md-4">
                                            <label>PART NUMBER:</label>&nbsp;
                                            <span id="span_part_no" class="span-error form_trial_checksheet_field_error"></span>
                                            <input type="text" class="form-control" id="txt_part_number" placeholder="Part number" readonly>
                                        </div>
                                        <div class="col-md-4">
                                            <label>REVISION:</label>
                                            <input type="text" class="form-control" id="txt_revision" placeholder="Revision" readonly>
                                        </div>
                                        <div class="col-md-4 mb-3">
                                            <label>TRIAL NUMBER:</label>
                                            <input type="text" class="form-control" id="txt_trial_number" placeholder="Trial number" readonly>
                                        </div>
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
                                        <div class="col-md-4">
                                            <label>TRIAL INSPECTION REASON (INSPECTION TYPE):</label>
                                            <input class="form-control mb-3" type="text" placeholder="Trial inspection reason" id="txt_inspection_reason" readonly>
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
                                </div>
                            </div>
                        </div>
                    </div>
                    {{-- ATTACHMENTS --}}
                    <div id="accordion_attachment" class="according accordion-s2 gradiant-bg-dark mb-3">
                        <div class="card">
                            <div class="card-header">
                                <a class="card-link" data-toggle="collapse" href="#accordion_attach_files"><strong
                                        style="font-size: 20px;"><i
                                            class="ti-files"></i>&nbsp;ATTACHMENTS</strong></a>
                            </div>
                            <div id="accordion_attach_files" class="collapse show" data-parent="#accordion_attachment">
                                <div class="card-body"><br>
                                    <div class="row" id="div_attachments"></div><br>
                                </div>
                            </div>
                        </div>
                    </div>
                    {{-- CHECKSHEET --}}
                    <div id="accordion_checksheet" class="according accordion-s2 gradiant-bg-dark mb-2">
                        <div class="card">
                            <div class="card-header">
                                <a class="card-link" data-toggle="collapse" href="#accordion_checksheet_details"><strong
                                        style="font-size: 20px;"><i class="ti-layout-grid2"></i>
                                        CHECKSHEET</strong></a>
                            </div>
                            <div id="accordion_igm" class="collapse show" data-parent="#accordion_checksheet">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="alert alert-info">
                                                <strong><i class="ti-info-alt"></i> IF YOU HAVE NOTHING TO ENTER, PUT A DASH IN THE TEXTBOX.</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="single-table">
                                                <div class="table-responsive">
                                                    <table class="table text-center table-sm table-bordered" id="tbl_igm">
                                                        <tbody id="tbody_tbl_igm"></tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button id="btn_approve_data" type="button" class="btn btn-primary btn-block" onclick="EVALUATE.ApproveData();"><strong class="strong-font"><i class="ti-check"></i> APPROVE</strong></button>
                <button type="button" class="btn btn-outline-secondary btn-block" data-dismiss="modal"><strong class="strong-font"><i class="ti-na"></i> CANCEL</strong></button>
            </div>
        </div>
    </div>
</div>


