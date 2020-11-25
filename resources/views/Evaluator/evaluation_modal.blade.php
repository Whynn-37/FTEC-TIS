<div id="modal_view_inspection_data" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
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
                                        <div class="col-md-4">
                                            <label>PART NO:</label>&nbsp;
                                            <span id="span_part_no" class="span-error form_trial_checksheet_field_error"></span>
                                            <input class="form-control mb-3" type="text" placeholder="Part No"
                                                id="txt_part_no" disabled>
                                            <label>PART NAME:</label>
                                            <input class="form-control mb-3" type="text" placeholder="Part Name"
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
                    <div id="accordion_igm" class="according accordion-s2 gradiant-bg-dark mb-2">
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
                                                                    <button type="button" id="btn_item_no_1_hinsei" type="button" class="btn btn-primary btn-block" onclick="EVALUATE.Hinsei(1,'test1','test2','test3',15,10);"><strong class="strong-font"><i class="ti-pencil-alt"></i> HINSEI</strong></button>
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
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary btn-block" onclick="EVALUATE.ApproveData();"><strong class="strong-font"><i class="ti-check"></i> APPROVE</strong></button>
                <button type="button" class="btn btn-secondary btn-block" data-dismiss="modal"><strong class="strong-font"><i class="ti-na"></i> CANCEL</strong></button>
            </div>
        </div>
    </div>
</div>


