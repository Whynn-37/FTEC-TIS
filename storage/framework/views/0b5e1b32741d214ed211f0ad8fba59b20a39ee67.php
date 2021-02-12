<!-- Large modal start -->
<div class="modal fade history-file-name-modal">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"> ADD SUPPLIER </h5>
                <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="card-body"><br>
                        <div class="row" id="div_attachments">
                        </div><br><br>
                        <div class="row" id="div_attachments_1">
                        </div><br>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<!-- Large modal modal end -->


<!-- Large modal start -->
<div class="modal fade history-trial_checksheet_modal">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"> INSPECTION DATA </h5>
                <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
            </div>
            <div class="modal-body">
                <div id="accordion_details" class="collapse show" data-parent="#accordion4">
                    <div class="card-body">
                        
                        <div class="row">
                            <div class="col-md-3">
                                <label>PART NUMBER:</label>&nbsp;
                                <input class="form-control mb-3" type="text" placeholder="Part number" id="txt_part_number" readonly>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label>INSPECTION REASON (INSPECTION TYPE):</label>&nbsp;
                                <input class="form-control mb-3" type="text" placeholder="Part Inspection Reason" id="txt_inspection_reason" readonly>
                            </div>
                            <div class="col-md-3">
                                <label>REVISION:</label>
                                <input class="form-control mb-3" type="text" placeholder="Revision" id="txt_revision" readonly>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label>TRIAL NUMBER:</label>
                                <input class="form-control mb-3" type="text" placeholder="Trial Number" id="txt_trial_number" readonly>
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
                                <label>PLAN START DATE:</label>
                                <input class="form-control mb-3" type="text" placeholder="Plan start date" id="txt_plan_start_date" readonly>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label>INSPECTION REQUIRED TIME:</label>
                                <input class="form-control mb-3" type="text" placeholder="Inspection required time" id="txt_inspection_required_time" readonly>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <label>KIND OF DIE:</label>
                                <input class="form-control mb-3" type="text" placeholder="Kind of die" id="txt_die_kind" readonly>
                            </div>
                            <div class="col-md-6">
                                <label for="">INSPECTOR:</label>
                                <input class="form-control mb-3" type="text" placeholder="Inspector" id="txt_inspector" readonly>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<!-- Large modal modal end -->






<?php /**PATH C:\xampp\htdocs\TIS\resources\views/History/history_modal.blade.php ENDPATH**/ ?>