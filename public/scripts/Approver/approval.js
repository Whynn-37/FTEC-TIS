$(document).ready(function () {
    APPROVE.LoadFinishedInspectionData();
    APPROVE.LoadDisapprovedInspectionData();
});

const APPROVE = (() => {

    let this_approve = {};

    let array_type                  = [];
    let array_item_number           = [];
   
    this_approve.LoadFinishedInspectionData = () => {

        $('#tbl_finished_inspection_data').LoadingOverlay('show');
        $.ajax({
            url     : `load-inspection-finished`,
            type    : 'get',
            dataType: 'json',
            data    : 
            {
                decision : 2
            },
            cache   : false,
            success: data => 
            {
                $('#tbl_finished_inspection_data').DataTable().destroy();
                $('#tbody_tbl_finished_inspection_data').empty();

                let tbody = '';

                if (data.status === 'Success')
                {
                    data.data.forEach((value) => {
                        if (value.judgment === 'GOOD')
                        {
                            judgement = '<span class="badge badge-success subitem-visual-judgement">GOOD</span>';
                        }
                        else
                        {
                            judgement = '<span class="badge badge-danger subitem-visual-judgement">NG</span>';
                        }
    
                        tbody +=
                            `<tr>
                            <td>${value.part_number}</td>
                            <td>${value.revision_number}</td>
                            <td>${value.trial_number}</td>
                            <td>${value.inspection_reason}</td>
                            <td>${value.inspect_by}</td>
                            <td>${value.inspect_datetime}</td>
                            <td>${value.evaluated_by}</td>
                            <td>${value.evaluated_datetime}</td>
                            <td>${value.date_finished}</td>
                            <td>${judgement}</td>
                            <td>
                                <button class="btn btn-primary btn-block" onclick="APPROVE.ViewFinishedInspectionData(${value.id});"><strong class="strong-font"><i class="ti-eye"></i> VIEW DATA</strong></button>
                            </td>
                        </tr>`;
                        // <button class="btn btn-primary btn-block" onclick="APPROVE.ViewFinishedInspectionData(${value.trial_checksheet_id},'finished');"><strong class="strong-font"><i class="ti-eye"></i> VIEW DATA</strong></button>
                    });
    
    
                    $('#tbody_tbl_finished_inspection_data').html(tbody);
                }

                $('#tbl_finished_inspection_data').DataTable({
                    "paging"        : true,
                    "lengthChange"  : true,
                    "searching"     : true,
                    "ordering"      : true,
                    "info"          : true,
                    "autoWidth"     : true,
                });
                
                $('#tbl_finished_inspection_data').LoadingOverlay('hide');
            }
        });
    };

    this_approve.LoadDisapprovedInspectionData = () => {

        $('#tbl_disapproved_inspection_data').LoadingOverlay('show');

        $.ajax({
            url     : `load-inspection-finished`,
            type    : 'get',
            dataType: 'json',
            data    : 
            {
                decision : 3
            },
            cache   : false,
            success : data => 
            {
                $('#tbl_disapproved_inspection_data').DataTable().destroy();
                $('#tbody_tbl_disapproved_inspection_data').empty();

                let tbody = '';

                if (data.status === 'Success')
                {
                    data.data.forEach((value) => {
                        tbody += 
                        `<tr>
                            <td>${value.part_number}</td>
                            <td>${value.revision_number}</td>
                            <td>${value.trial_number}</td>
                            <td>${value.inspection_reason}</td>
                            <td>${value.inspect_by}</td>
                            <td>${value.inspect_datetime}</td>
                            <td>${value.evaluated_by}</td>
                            <td>${value.evaluated_datetime}</td>
                            <td>${value.disapproved_by}</td>
                            <td>${value.disapproved_datetime}</td>
                            <td>${value.reason}</td>
                        </tr>`;
                    });
    
                    $('#tbody_tbl_disapproved_inspection_data').html(tbody);
                }

                $('#tbl_disapproved_inspection_data').DataTable({
                    "paging"        : true,
                    "lengthChange"  : true,
                    "searching"     : true,
                    "ordering"      : true,
                    "info"          : true,
                    "autoWidth"     : true,
                });
                $('#tbl_disapproved_inspection_data').LoadingOverlay('hide');
            }
        });
    };

    this_approve.ViewFinishedInspectionData = (id, approval_button = '') => {

        $('#modal_view_inspection_data').modal('show');

        $('#div_modal_content').LoadingOverlay('show');

        console.log(approval_button);

        $.ajax({
            url     : `load-inspection-data`,
            type    : 'get',
            dataType: 'json',
            cache   : false,
            data    : 
            {
                _token  : _TOKEN,
                id      : id
            },
            success: data => 
            {
                if (data.status === 'Success')
                {
                    //checksheet details
                    $('#btn_for_inspection').attr(`onclick`,`HISTORY.editDataInspection(${id},5);`);
                    $('#btn_for_evaluator').attr(`onclick`,`HISTORY.editDataInspection(${id},1);`);

                    $('#txt_part_number').val(data.data.checksheet_details.part_number);
                    $('#txt_revision').val(data.data.checksheet_details.revision_number);
                    $('#txt_trial_number').val(data.data.checksheet_details.trial_number);
                    $('#txt_part_name').val(data.data.checksheet_details.part_name);
                    $('#txt_model_name').val(data.data.checksheet_details.model_name);//hindi pa kasama sa returned data
                    $('#txt_supplier_code').val(data.data.checksheet_details.supplier_code);
                    $('#txt_supplier_name').val(data.data.checksheet_details.supplier_name);//hindi pa kasama sa returned data
                    $('#txt_application_date').val(data.data.checksheet_details.application_date);//hindi pa kasama sa returned data
                    $('#txt_inspection_completion_date').val(data.data.checksheet_details.date_finished);
                    $('#txt_actual_inspection_time').val(data.data.takt_time);//hindi pa kasama sa returned data
                    $('#txt_total_down_time').val(data.data.down_time);//hindi pa kasama sa returned data // papalit nalang ako ng application date
                    $('#txt_inspection_reason').val(data.data.checksheet_details.inspection_reason);
                    $('#txt_die_kind').val(data.data.checksheet_details.die_class);
                    $('#txt_inspector').val(data.data.checksheet_details.inspect_by); //hindi pa kasama sa returned data

                    //attachments
                    let files = `
                    <div class="vertical-rectangle">
                        <img id="img_attachment_1" src="${base_url}/template/assets/images/icon/file.png" class="file-image">
                        <div class="file-options">
                            <button type="button" class="btn btn-green mb-3" onclick="APPROVE.OpenFile('merged','${data.data.attachment.file_folder}','${data.data.attachment.file_name_merge}.pdf');"><i class="ti-eye"></i> VIEW FILE</button>
                        </div>
                        
                        <center style="margin-top: 195px;">
                            <span>Merged Attachments</span>
                        </center>
                    </div>
                    <div class="vertical-rectangle">
                        <img id="img_attachment_1" src="${base_url}/template/assets/images/icon/file.png" class="file-image">
                        <div class="file-options">
                            <button type="button" class="btn btn-green mb-3" onclick="APPROVE.OpenFile('evaluation_result','${data.data.attachment.file_folder}','${data.data.attachment.file_name_merge}.xlsx');"><i class="ti-eye"></i> VIEW FILE</button>
                        </div>
                        
                        <center style="margin-top: 195px;">
                            <span>Evaluation Result</span>
                        </center>
                    </div>`;

                    $('#div_attachments').html(files);

                    //pagkuha ng checksheet item tapos checksheet data
                    APPROVE.GetChecksheetItem(data);

                    if (approval_button === 1) 
                    {
                        $(".btn-app").remove();
                    }
                    else
                    {
                        $(".btn-history").remove();
                    }
                    
                }
                else
                {
                    Swal.fire({
                        icon    : 'error',
                        title   : data.status,
                        text    : data.message,
                    })
                }

                $('#div_modal_content').LoadingOverlay('hide');
            }
        });
    };

    this_approve.OpenFile = (file_type,file_folder,file_name) => {
    
        if (file_type === 'merged')
        {
            window.open(`../../../tis/storage/app/public/${file_folder}/${file_name}`, "_blank", "width=1200,height=600, left = 2300,top = 200");
        }
        else
        {
           let popout =  window.open(`../../../tis/storage/app/public/${file_folder}/${file_name}`);

            window.setTimeout(function(){
                popout.close();
            }, 500);
        }
    };
    
    this_approve.GetChecksheetItem = (data) => {

        let tr_checksheet           = '';
        let item_count              = 0;

        data.data.checksheet_items.forEach((value) => 
        {
            $('#trial_checksheet_id').val(value.trial_checksheet_id); 

            (value.specification    === null) ? specs       = '-': specs        = value.specification;
            (value.upper_limit      === null) ? upper_limit = '-': upper_limit  = value.upper_limit;
            (value.lower_limit      === null) ? lower_limit = '-': lower_limit  = value.lower_limit;

            if (value.judgment === null || value.judgment === 'N/A')
            {
                var judgement = '<span>N/A</span>';
            } 
            else if (value.judgment === 'GOOD')
            {
                judgement = '<span class="badge badge-success subitem-visual-judgement">GOOD</span>';
            }
            else
            {
                judgement = '<span class="badge badge-danger subitem-visual-judgement">NG</span>';
            }
            
            tr_checksheet += `<tr class="text-white bg-dark" id="tr_item_no_${value.item_number}_column">
                <th width="5%">ITEM NO</th>
                <th width="5%">TOOLS</th>
                <th width="10%">TYPE</th>
                <th width="10%">SPECIFICATION</th>
                <th width="10%">UPPER LIMIT</th>
                <th width="10%">LOWER LIMIT</th>
                <th width="10%">JUDGEMENT</th>
                <th width="10%">REMARKS</th>
                <th colspan="2"></th>
            </tr>
            <tr id="tr_item_no_${value.item_number}">
                <td>
                    <input type="text" id="txt_hidden_item_no_${value.item_number}_id"  value="${value.id}" hidden>
                    <input type="text" id="txt_hidden_item_no_${value.item_number}_sub_no_count"  value="${data.data.checksheet_data[item_count].length}" hidden>
                    <input type="text" id="txt_hidden_item_no_${value.item_number}_item_type"  value="${value.item_type}" hidden>
                    <span id="span_item_no_${value.item_number}_label" >${value.item_number}</span>
                </td> 
                <td id="td_item_no_${value.item_number}_tools">${value.tools}</td>
                <td id="td_item_no_${value.item_number}_type">${value.type}</td>
                <td id="td_item_no_${value.item_number}_specs">${specs}</td>
                <td id="td_item_no_${value.item_number}_upper_limit">${upper_limit}</td>
                <td id="td_item_no_${value.item_number}_lower_limit">${lower_limit}</td>
                <td id="td_item_no_${value.item_number}_judgement" class="input_text_center">${judgement}</td>
                <td id="td_item_no_${value.item_number}_remarks" class="input_text_center">${(value.remarks == null || value.remarks == '') ? '-' : value.remarks}</td>
            </tr>`;

            array_type.push(value.type);
            array_item_number.push(value.item_number);

            item_count++;
        });

        //pag lalagay ng tr sa table
        $('#tbody_tbl_igm').html(tr_checksheet);
        
        //pagkuha ng checksheet data
        APPROVE.GetChecksheetData(data);
    };

    this_approve.GetChecksheetData = (data) => {

        let array_hidden_checksheet_data_id = [];
        let array_data                      = [];
        let array_judgement                 = [];
        let array_coordinates               = [];
        let array_remarks               = [];
        let existing_sub_no_count           = -1;//naka -1 para pag increment nya naka 0 para pag pasok sa add igm sub no function sa zero sya papasok 
        
        //pagkuha ng data id
        for (let a_index = 0; a_index < data.data.checksheet_data.length; a_index++) 
        {
            data.data.checksheet_data[a_index].forEach((value) => 
            {
                array_hidden_checksheet_data_id.push(value.id);
                array_judgement.push(value.judgment);
                array_coordinates.push(value.coordinates);
                array_remarks.push(value.remarks);
    
                array_split_value = [];
                if (value.data !== null)
                {
                    split_data = value.data.split(',');
                    split_data.forEach((split_value) => {
                        array_split_value.push(split_value);
                    });
                }
                array_data.push(array_split_value);
            });

            for (let b_index = 0; b_index < array_hidden_checksheet_data_id.length; b_index++) 
            {
                existing_sub_no_count++;

                //naka select item type to para lang magamit ko lang ulit yung process na ginamit ko sa select item type ng checksheet item
                APPROVE.AddIgmSubNo(array_type[a_index], array_item_number[a_index], existing_sub_no_count,array_hidden_checksheet_data_id[b_index],array_data[b_index],array_judgement[b_index],array_coordinates[b_index],array_remarks[b_index]);
    
                $(`#th_igm_item_no_${array_item_number[a_index]}_extra_column`).prop('hidden', false);
                
            }

            array_hidden_checksheet_data_id = [];
            array_data                      = [];
            array_judgement                 = [];
            array_coordinates               = [];
            array_remarks               = [];
            existing_sub_no_count           = -1;
        }
    };

    this_approve.AddIgmSubNoHeader = (item_no_count, rowspan_count) => {
        let tr_sub_no_column = `
		<tr id="tr_item_no_${item_no_count}_sub_no_column">
			<th id="th_tr_item_no_${item_no_count}_sub_no_column_rowspan" rowspan="${rowspan_count}"></th>
			<th width="5%" class="text-white bg-dark">SUB NO</th>
			<th width="18%" class="text-white bg-dark">COORDINATES</th>
			<th width="30%" class="text-white bg-dark" colspan="5">DATA</th>
			<th width="10%" class="text-white bg-dark">JUDGEMENT</th>
			<th width="15%" class="text-white bg-dark">REMARKS</th>
		</tr>`;
        return tr_sub_no_column;
    };

    this_approve.AddIgmSubNo = (type, item_no_count, existing_sub_no_count, checksheet_data_id,array_data,judgement,coordinates,remarks) => {

        let tr_sub_no_inputs = '';
        let tr_sub_no_column = '';
        let rowspan          = $(`#th_tr_item_no_${item_no_count}_sub_no_column_rowspan`).attr('rowspan');

        if (existing_sub_no_count === 0) 
        {
            existing_sub_no_count_per_item = 0;
            existing_sub_no_count_per_item = existing_sub_no_count;
            existing_sub_no_count_per_item++;

            if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
            {
                var rowspan_count = 3;
            } 
            else 
            {
                rowspan_count = 2;
            }

            tr_sub_no_column += APPROVE.AddIgmSubNoHeader(item_no_count, rowspan_count);

            tr_sub_no_inputs += APPROVE.AddIgmSubNoInputs(type, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, checksheet_data_id,array_data,judgement,coordinates,remarks);

            $(`#tr_item_no_${item_no_count}`).after(tr_sub_no_inputs);

            //para sa pag papalit ng kulay ng visuals data
            IGM.ChecksheetDataVisualsChangeColor(item_no_count,existing_sub_no_count_per_item,array_data);
        } 
        else 
        {
            existing_sub_no_count_per_item = 0;
            //pag increment ng existing_sub_no_count
            existing_sub_no_count_per_item = existing_sub_no_count;
            existing_sub_no_count_per_item++;

            $(`#th_igm_item_no_${item_no_count}_extra_column`).prop('hidden', false);

            //pag lalagay lang ng row sa table, walang pag add sa DB
            tr_sub_no_inputs += APPROVE.AddIgmSubNoInputs(type, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, checksheet_data_id,array_data,judgement,coordinates,remarks);
            
            if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
            {
                $(`#tr_item_no_${item_no_count}_sub_no_max_${existing_sub_no_count_per_item - 1}`).after(tr_sub_no_inputs);
                $(`#th_tr_item_no_${item_no_count}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) + 2);
            } 
            else 
            {
                $(`#tr_item_no_${item_no_count}_sub_no_${existing_sub_no_count_per_item - 1}`).after(tr_sub_no_inputs);
                $(`#th_tr_item_no_${item_no_count}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) + 1);
            }

            //para sa pag papalit ng kulay ng visuals data
            IGM.ChecksheetDataVisualsChangeColor(item_no_count,existing_sub_no_count_per_item,array_data);
        }
    };

    this_approve.AddIgmSubNoInputs = (type, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, checksheet_data_id,array_data,judgement,coordinates,remarks) => {

        let tr                      = '';
        let new_sub_no              = existing_sub_no_count_per_item;

        if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
        {
            tr += `${tr_sub_no_column}
            <tr id="tr_item_no_${item_no_count}_sub_no_min_${new_sub_no}" >
                <td style="vertical-align: middle;" rowspan="2">
                    <input type="text" id="txt_hidden_item_no_${item_no_count}_sub_no_${new_sub_no}" value="${checksheet_data_id}" hidden>
                    <span id="span_item_no_${item_no_count}_sub_no_${new_sub_no}_label">${new_sub_no}</span>
                </td>
				<td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_coordinates" style="vertical-align: middle;" rowspan="2" >${coordinates}</td>
				<td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_min_1">${IGM.ChecksheetDataInputData(type,array_data,0)}</td>
				<td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_min_2">${IGM.ChecksheetDataInputData(type,array_data,2)}</td>
				<td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_min_3">${IGM.ChecksheetDataInputData(type,array_data,4)}</td>
				<td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_min_4">${IGM.ChecksheetDataInputData(type,array_data,6)}</td>
				<td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_min_5">${IGM.ChecksheetDataInputData(type,array_data,8)}</td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_judgement" style="vertical-align: middle;" rowspan="2" class="td_sub_no_input">
                    ${IGM.ChecksheetDataInputJudgement(judgement)}
                </td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_remarks" style="vertical-align: middle;" rowspan="2" class="td_sub_no_input">${(remarks == null || remarks === '') ? '-' : remarks}</td>
			</tr>
			<tr id="tr_item_no_${item_no_count}_sub_no_max_${new_sub_no}">
				<td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_max_1">${IGM.ChecksheetDataInputData(type,array_data,1)}</td>
				<td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_max_2">${IGM.ChecksheetDataInputData(type,array_data,3)}</td>
				<td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_max_3">${IGM.ChecksheetDataInputData(type,array_data,5)}</td>
				<td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_max_4">${IGM.ChecksheetDataInputData(type,array_data,7)}</td>
				<td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_max_5">${IGM.ChecksheetDataInputData(type,array_data,9)}</td>
			</tr>`;
        } 
        else if (type === 'Actual' || type === 'Material Thickness')
        {
            tr += `${tr_sub_no_column}
            <tr id="tr_item_no_${item_no_count}_sub_no_${new_sub_no}">
                <td>
                    <input type="text" id="txt_hidden_item_no_${item_no_count}_sub_no_${new_sub_no}" value="${checksheet_data_id}" hidden>
                    <span id="span_item_no_${item_no_count}_sub_no_${new_sub_no}_label">${new_sub_no}</span>
                </td>
                <td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_coordinates">${coordinates}</td>
                <td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_amt_1">${IGM.ChecksheetDataInputData(type,array_data,0)}</td>
                <td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_amt_2">${IGM.ChecksheetDataInputData(type,array_data,1)}</td>
                <td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_amt_3">${IGM.ChecksheetDataInputData(type,array_data,2)}</td>
                <td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_amt_4">${IGM.ChecksheetDataInputData(type,array_data,3)}</td>
                <td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_amt_5">${IGM.ChecksheetDataInputData(type,array_data,4)}</td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_judgement" style="vertical-align:middle;" >${IGM.ChecksheetDataInputJudgement(judgement)}</td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_remarks" style="vertical-align:middle;" >${(remarks == null || remarks === '') ? '-' : remarks}</td>
            </tr`;
        }
        else 
        {
            tr += `${tr_sub_no_column}
            <tr id="tr_item_no_${item_no_count}_sub_no_${new_sub_no}">
                <td>
                    <input type="text" id="txt_hidden_item_no_${item_no_count}_sub_no_${new_sub_no}" value="${checksheet_data_id}" hidden>
                    <span id="span_item_no_${item_no_count}_sub_no_${new_sub_no}_label" >${new_sub_no}</span>
                </td>
                <td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_coordinates">${coordinates}</td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_1" type="text" class="form-control input_text_center" placeholder="Click visual" disabled value="${IGM.ChecksheetDataInputData(type,array_data,0)}" >
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_2" type="text" class="form-control input_text_center" placeholder="Click visual" disabled value="${IGM.ChecksheetDataInputData(type,array_data,1)}" >
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_3" type="text" class="form-control input_text_center" placeholder="Click visual" disabled value="${IGM.ChecksheetDataInputData(type,array_data,2)}" >
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_4" type="text" class="form-control input_text_center" placeholder="Click visual" disabled value="${IGM.ChecksheetDataInputData(type,array_data,3)}" >
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_5" type="text" class="form-control input_text_center" placeholder="Click visual" disabled value="${IGM.ChecksheetDataInputData(type,array_data,4)}" >
                </td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_judgement" style="vertical-align:middle;" >
                    ${IGM.ChecksheetDataInputJudgement(judgement)}
                </td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_judgement" style="vertical-align:middle;" >${(remarks == null || remarks === '') ? '-' : remarks}</td>
            </tr`;
            //alamin kung paano magagawa na iisang button lang edit tapos save cancel
        }

        return tr;
    };

    this_approve.ApproveData = () => {
        
        Swal.fire($.extend(swal_options, {
            title: 'Are you sure you want to approve?',
        })).then((result) => 
        {
            if (result.value) 
            {
                $('#div_modal_content').LoadingOverlay('show');

                let trial_checksheet_id = $('#trial_checksheet_id').val();

                $.ajax({
                    url     : `approved`,
                    type    : 'post',
                    dataType: 'json',
                    data    : 
                    {
                        _token              : _TOKEN,
                        trial_checksheet_id : trial_checksheet_id,
                        decision            : 2,
                        action              : 1,
                    },
                    cache   : false,
                    success: result => 
                    {
                        if (result.status === 'Success')
                        {
                            
                            $('#modal_view_inspection_data').modal('hide');
                            APPROVE.LoadFinishedInspectionData();
                            APPROVE.LoadDisapprovedInspectionData();
    
                            Swal.fire({
                                icon    : 'success',
                                title   : 'Success',
                                text    : 'Approve successful',
                            })
                        }
                        else
                        {
                            Swal.fire({
                                icon    : 'error',
                                title   : result.status,
                                text    : result.message,
                            })
                        }
                        $('#div_modal_content').LoadingOverlay('hide');
                    }
                });
            }
        })
    };

    this_approve.DisapproveData = () => {

        $('#btn_approve').prop('hidden',true);
        $('#btn_cancel').prop('hidden',true);
        $('#btn_disapprove').prop('hidden',true);
        $('#btn_submit_disapprove').prop('hidden',false);
        $('#btn_cancel_disapprove').prop('hidden',false);
        $('#accordion_disapprove_reason').prop('hidden',false);
        $('#txt_disapprove_reason').focus();
    };

    this_approve.CancelDisapproveData = () => {

        $('#btn_approve').prop('hidden',false);
        $('#btn_cancel').prop('hidden',false);
        $('#btn_disapprove').prop('hidden',false);
        $('#btn_submit_disapprove').prop('hidden',true);
        $('#btn_cancel_disapprove').prop('hidden',true);
        $('#accordion_disapprove_reason').prop('hidden',true);
        $('#span_error_reason').remove();
    };

    this_approve.ProceedDisapproveData = () => {

        let trial_checksheet_id = $('#trial_checksheet_id').val();
        let reason              = $('#txt_disapprove_reason').val();

        if (reason === '')
        {
            $('#span_error_reason').remove();
            $('#txt_disapprove_reason').after(`<span id="span_error_reason" class="span-error">Required</span>`);
        }
        else
        {
            $('#span_error_reason').remove();

            Swal.fire($.extend(swal_options, {
                title: 'Are you sure you want to disapprove?',
            })).then((result) => 
            {
                if (result.value) 
                {
                    $('#div_modal_content').LoadingOverlay('show');

                    $.ajax({
                        url     : `approved`,
                        type    : 'post',
                        dataType: 'json',
                        data    : 
                        {
                            _token              : _TOKEN,
                            trial_checksheet_id : trial_checksheet_id,
                            decision            : 2,
                            action              : 2,
                            reason              : reason,
                        },
                        cache   : false,
                        success: result => 
                        {
                            if (result.status === 'Success')
                            {
                                
                                $('#modal_view_inspection_data').modal('hide');
                                APPROVE.LoadFinishedInspectionData();
                                APPROVE.LoadDisapprovedInspectionData();
    
                                Swal.fire({
                                    icon    : 'success',
                                    title   : 'Success',
                                    text    : 'Disapprove successful',
                                })
                            }
                            else
                            {
                                Swal.fire({
                                    icon    : 'error',
                                    title   : 'Error',
                                    text    : 'Not successful',
                                })
                            }
                            $('#div_modal_content').LoadingOverlay('hide');
                        }
                    });
                }
            })
        }
    };

    return this_approve;
})();
