$(document).ready(function () {
    EVALUATE.LoadFinishedInspectionData();
    EVALUATE.LoadDisapprovedInspectionData();
});

const EVALUATE = (() => {
    let this_evaluate = {};

    let array_add_to_pdf            = [];
    let add_to_pdf_count            = 1;
    let attachment_count            = '';
    let array_type                  = [];
    let array_item_number           = [];
    let final_array_min_max_datas   = [];
    let checksheet_item_count       = '';

    this_evaluate.LoadFinishedInspectionData = () => {

        $('#tbl_finished_inspection_data').LoadingOverlay('show');
        $.ajax({
            url     : `load-inspection-finished`,
            type    : 'get',
            dataType: 'json',
            data    : 
            {
                decision : 1
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
                            <td>${value.date_finished}</td>
                            <td>${judgement}</td>
                            <td>
                                <button class="btn btn-primary btn-block" onclick="EVALUATE.ViewFinishedInspectionData(${value.id},'finished');"><strong class="strong-font"><i class="ti-eye"></i> VIEW DATA</strong></button>
                            </td>
                        </tr>`;
                    });
    
                    $('#tbody_tbl_finished_inspection_data').html(tbody);
                }
                
                $('#tbl_finished_inspection_data').DataTable({
                    "paging": true,
                    "lengthChange": true,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": true,
                });
                $('#tbl_finished_inspection_data').LoadingOverlay('hide');
            }
        });
    };

    this_evaluate.LoadDisapprovedInspectionData = () => {

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
                            <td>${value.disapproved_by}</td>
                            <td>${value.disapproved_datetime}</td>
                            <td>${value.reason}</td>
                            <td>
                            <button class="btn btn-primary btn-block" onclick="EVALUATE.ViewFinishedInspectionData(${value.id},'disapproved');"><strong class="strong-font"><i class="ti-eye"></i> VIEW DATA</strong></button>
                            </td>
                        </tr>`;
                    });
                }

                $('#tbody_tbl_disapproved_inspection_data').html(tbody);
                $('#tbl_disapproved_inspection_data').DataTable({
                    "paging": true,
                    "lengthChange": true,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": true,
                });

                $('#tbl_disapproved_inspection_data').LoadingOverlay('hide');
            }
        });
    };

    this_evaluate.ViewFinishedInspectionData = (id, status) => {

        $('#modal_view_inspection_data').modal('show');
        checksheet_item_count   = '';
        array_add_to_pdf        = [];
        add_to_pdf_count        = 1;

        if (status === 'finished') 
        {
            $('#modal_header').css('background-image', '-webkit-linear-gradient(top left, #009670, #01c293)');
            $('#modal_header').css('background-image', 'linear-gradient(to bottom right, #009670, #01c293)');
            $('#modal_title').html('EVALUATION (FINISHED INSPECTION DATA)');
        } 
        else 
        {
            $('#modal_header').css('background-image', '-webkit-linear-gradient(top left, #c20131, #d81c4b)');
            $('#modal_header').css('background-image', 'linear-gradient(to bottom right, #c20131, #d81c4b)');
            $('#modal_title').html('EVALUATION (DISAPPROVED INSPECTION DATA)');
        }

        $('#div_modal_content').LoadingOverlay('show');

        $.ajax({
            url     : `load-inspection-data`,
            type    : 'get',
            dataType: 'json',
            cache   : false,
            data    : {
                _token  : _TOKEN,
                id      : id
            },
            success: data => 
            {
                if (data.status === 'Success')
                {
                    //checksheet details
                    $('#txt_part_number').val(data.data.checksheet_details.part_number);
                    $('#txt_revision').val(data.data.checksheet_details.revision_number);
                    $('#txt_trial_number').val(data.data.checksheet_details.trial_number);
                    $('#txt_part_name').val(data.data.checksheet_details.part_name);
                    $('#txt_model_name').val(data.data.checksheet_details.model_name);//hindi pa kasama sa returned data
                    $('#txt_supplier_code').val(data.data.checksheet_details.supplier_code);
                    $('#txt_supplier_name').val(data.data.checksheet_details.supplier_name);//hindi pa kasama sa returned data
                    $('#txt_application_date').val(data.data.checksheet_details.application_date);//hindi pa kasama sa returned data
                    $('#txt_inspection_completion_date').val(data.data.checksheet_details.date_finished);
                    $('#txt_actual_inspection_time').val(data.data.takt_time);//hindi pa kasama sa returned data // papalit nalang ako ng application date
                    $('#txt_inspection_reason').val(data.data.checksheet_details.takt_time);
                    $('#txt_die_kind').val(data.data.checksheet_details.die_class);
                    $('#txt_inspector').val(data.data.checksheet_details.inspect_by); //hindi pa kasama sa returned data

                    //attachments
                    let files = '';
                    let count = 1;

                    //attachment count
                    attachment_count += data.data.attachment.file_name.length;

                    for (let index = 0; index < data.data.attachment.file_name.length; index++) 
                    {
                        let add_to_pdf_button = '';

                        if (status === 'finished')
                        {
                            add_to_pdf_button += `<button id="btn_add_to_pdf_${count}" type="button" class="btn btn-green"  onclick="EVALUATE.AddToPdf(${count},'','${data.data.attachment.file_name[index]}','unchecked');"><i class="ti-plus"></i> ADD TO PDF</button>`;
                        }
                        

                        files += `
                        <div class="vertical-rectangle">
                            <img id="img_attachment_${count}" src="${base_url}/template/assets/images/icon/file.png" class="file-image">
                            <div class="file-options">
                                <button type="button" class="btn btn-green mb-3" onclick="EVALUATE.OpenFile('${data.data.attachment.file_folder}','${data.data.attachment.file_name[index]}');"><i class="ti-eye"></i> VIEW FILE</button>
                                ${add_to_pdf_button}
                            </div>
                            
                            <center style="margin-top: 195px;">
                                <span>${data.data.attachment.file_name[index].split('.')[0]}</span>
                            </center>
                        </div>`;

                        count++;
                    }
                    $('#div_attachments').html(files);

                    //pagkuha ng checksheet item tapos checksheet data
                    EVALUATE.GetChecksheetItem(data);

                    $('#btn_approve_data').attr('onclick',`EVALUATE.ApproveData('${status}');`)
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

    this_evaluate.AddIgmSubNoHeader = (item_no_count, rowspan_count) => {
        let tr_sub_no_column = `
		<tr id="tr_item_no_${item_no_count}_sub_no_column">
			<th id="th_tr_item_no_${item_no_count}_sub_no_column_rowspan" rowspan="${rowspan_count}"></th>
			<th width="5%" class="text-white bg-dark">SUB NO</th>
			<th class="text-white bg-dark">COORDINATES</th>
			<th class="text-white bg-dark" colspan="5">DATA</th>
			<th class="text-white bg-dark">JUDGEMENT</th>
            <th class="text-white bg-dark">REMARKS
        </th>
			<th class="text-white bg-dark"></th>
		</tr>`;
        return tr_sub_no_column;
    };

    this_evaluate.GetChecksheetItem = (data) => {

        let tr_checksheet           = '';
        let item_count              = 0;
        array_type                  = [];//pang clear ng array types

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
            
            $('#tbody_tbl_igm').empty();

            tr_checksheet += `<tr class="text-white bg-dark" id="tr_item_no_${value.item_number}_column">
                <th width="5%">ITEM NO</th>
                <th>TOOLS</th>
                <th>TYPE</th>
                <th>SPECIFICATION</th>
                <th>UPPER LIMIT</th>
                <th>LOWER LIMIT</th>
                <th>JUDGEMENT</th>
                <th>REMARKS</th>
                <th id="th_igm_item_no_${value.item_number}_extra_column" colspan="7"></th>
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
                <td id="td_item_no_${value.item_number}_remarks" class="input_text_center">${(value.remarks == null) ? '-' : value.remarks}</td>
                <td colspan="3" id="td_item_no_${value.item_number}_hinsei">
                    <button type="button" id="btn_item_no_${value.item_number}_hinsei" type="button" class="btn btn-primary btn-block" onclick="EVALUATE.Hinsei(${value.item_number},'${value.tools}','${value.type}','${specs}','${upper_limit}','${lower_limit}','${(value.remarks == null) ? '' : value.remarks}');"><strong class="strong-font"><i class="ti-pencil-alt"></i> HINSEI</strong></button>
                </td>
            </tr>`;

            array_type.push(value.type);
            array_item_number.push(value.item_number);

            item_count++;
        });

        checksheet_item_count += item_count;

        //pag lalagay ng tr sa table
        $('#tbody_tbl_igm').html(tr_checksheet);
        
        //pagkuha ng checksheet data
        EVALUATE.GetChecksheetData(data);
    };

    this_evaluate.GetChecksheetData = (data) => {

        let array_hidden_checksheet_data_id = [];
        let array_data                      = [];
        let array_judgement                 = [];
        let array_coordinates               = [];
        let array_remarks                   = [];
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
                EVALUATE.AddIgmSubNo(array_type[a_index], array_item_number[a_index], existing_sub_no_count,array_hidden_checksheet_data_id[b_index],array_data[b_index],array_judgement[b_index],array_coordinates[b_index],array_remarks[b_index]);
    
                $(`#th_igm_item_no_${array_item_number[a_index]}_extra_column`).prop('hidden', false);
                
            }

            array_hidden_checksheet_data_id = [];
            array_data                      = [];
            array_judgement                 = [];
            array_coordinates               = [];
            existing_sub_no_count           = -1;
        }
    };

    this_evaluate.AddIgmSubNo = (type, item_no_count, existing_sub_no_count, checksheet_data_id,array_data,judgement,coordinates,remarks) => {

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

            tr_sub_no_column += EVALUATE.AddIgmSubNoHeader(item_no_count, rowspan_count);

            tr_sub_no_inputs += EVALUATE.AddIgmSubNoInputs(type, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, checksheet_data_id,array_data,judgement,coordinates,remarks);

            $(`#tr_item_no_${item_no_count}`).after(tr_sub_no_inputs);

            if (type !== 'Min and Max' || type !== 'Min and Max and Form Tolerance') 
            {
                //para sa pag papalit ng kulay ng visuals data
                IGM.ChecksheetDataVisualsChangeColor(item_no_count,existing_sub_no_count_per_item,array_data);
            } 
        } 
        else 
        {
            existing_sub_no_count_per_item = 0;
            //pag increment ng existing_sub_no_count
            existing_sub_no_count_per_item = existing_sub_no_count;
            existing_sub_no_count_per_item++;

            $(`#th_igm_item_no_${item_no_count}_extra_column`).prop('hidden', false);

            //pag lalagay lang ng row sa table, walang pag add sa DB
            tr_sub_no_inputs += EVALUATE.AddIgmSubNoInputs(type, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, checksheet_data_id,array_data,judgement,coordinates,remarks);
            
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

            if (type !== 'Min and Max' || type !== 'Min and Max and Form Tolerance') 
            {
                //para sa pag papalit ng kulay ng visuals data
                IGM.ChecksheetDataVisualsChangeColor(item_no_count,existing_sub_no_count_per_item,array_data);
            } 
        }
    };

    this_evaluate.AddIgmSubNoInputs = (type, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, checksheet_data_id,array_data,judgement,coordinates,remarks) => {

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
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_remarks" style="vertical-align: middle;" rowspan="2" class="td_sub_no_input">${(remarks == null) ? '-' : remarks}</td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_edit"  style="vertical-align: middle;" rowspan="2">
                    <button type="button" id="btn_edit_item_no_${item_no_count}_sub_no_${new_sub_no}" type="button" class="btn btn-success btn-block" onclick="EVALUATE.EditSubItem('${type}',${item_no_count},${new_sub_no},'${coordinates}','${array_data}','${(remarks == null) ? '' : remarks}');"><strong class="strong-font"><i class="ti-pencil-alt"></i> EDIT</strong></button>
                </td>
			</tr>
			<tr id="tr_item_no_${item_no_count}_sub_no_max_${new_sub_no}">
				<td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_max_1">${IGM.ChecksheetDataInputData(type,array_data,1)}</td>
				<td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_max_2">${IGM.ChecksheetDataInputData(type,array_data,3)}</td>
				<td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_max_3">${IGM.ChecksheetDataInputData(type,array_data,5)}</td>
				<td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_max_4">${IGM.ChecksheetDataInputData(type,array_data,7)}</td>
				<td class="td_sub_no_input" id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_max_5">${IGM.ChecksheetDataInputData(type,array_data,9)}</td>
			</tr>`;
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
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_1" type="text" class="form-control input_text_center" placeholder="Click visual" onclick="EVALUATE.SubItemSelectVisual(${item_no_count},${new_sub_no},1);" disabled value="${IGM.ChecksheetDataInputData(type,array_data,0)}" >
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_2" type="text" class="form-control input_text_center" placeholder="Click visual" onclick="EVALUATE.SubItemSelectVisual(${item_no_count},${new_sub_no},2);" disabled value="${IGM.ChecksheetDataInputData(type,array_data,1)}" >
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_3" type="text" class="form-control input_text_center" placeholder="Click visual" onclick="EVALUATE.SubItemSelectVisual(${item_no_count},${new_sub_no},3);" disabled value="${IGM.ChecksheetDataInputData(type,array_data,2)}" >
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_4" type="text" class="form-control input_text_center" placeholder="Click visual" onclick="EVALUATE.SubItemSelectVisual(${item_no_count},${new_sub_no},4);" disabled value="${IGM.ChecksheetDataInputData(type,array_data,3)}" >
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_5" type="text" class="form-control input_text_center" placeholder="Click visual" onclick="EVALUATE.SubItemSelectVisual(${item_no_count},${new_sub_no},5);" disabled value="${IGM.ChecksheetDataInputData(type,array_data,4)}" >
                </td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_judgement" style="vertical-align:middle;" >
                    ${IGM.ChecksheetDataInputJudgement(judgement)}
                </td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_remarks" style="vertical-align:middle;" >${(remarks == null) ? '-' : remarks}</td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_edit">
                    <button type="button" id="btn_edit_item_no_${item_no_count}_sub_no_${new_sub_no}" type="button" class="btn btn-success btn-block" onclick="EVALUATE.EditSubItem('${type}',${item_no_count},${new_sub_no},'${coordinates}','${array_data}','${(remarks == null) ? '' : remarks}');"><strong class="strong-font"><i class="ti-pencil-alt"></i> EDIT</strong></button>
                </td>
            </tr`;
            //alamin kung paano magagawa na iisang button lang edit tapos save cancel
        }

        return tr;
    };

    this_evaluate.SubItemSelectVisual = (item_no, sub_no, visual_no) => {
        //para to sa coordinates since wala namang pinapasa na visual_no
        if (visual_no !== 'undefined')
        {
            var visual_value    = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val();
        }
        let coordinates     = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_coordinates`).val();

        if (coordinates !== '')
        {
            $(`#span_error_coordinates_item_no_${item_no}_sub_no_${sub_no}`).remove();

            if (visual_no !== 'undefined')
            {
                if (visual_no === 1) 
                {
                    $(`#span_visual_item_no_${item_no}_error_${visual_no}`).remove();

                    if (visual_value === '') 
                    {
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('OK');
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#27b968');
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('color', 'white');

                    } 
                    else if (visual_value === 'OK') 
                    {
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('NG');
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#d43333');
                    } 
                    else if (visual_value === 'NA') 
                    {
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('OK');
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#27b968');
                    } 
                    else 
                    {
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('NA');
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#676767');
                    }
                } 
                else 
                {
                    for (let visual_count = visual_no - 1; visual_count < visual_no; visual_count++) 
                    {
                        if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_count}`).val() === '') 
                        {
                            for (let error_count = 1; error_count < visual_no; error_count++) 
                            {
                                if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${error_count}`).val() === '') 
                                {
                                    $(`#span_visual_item_no_${item_no}_error_${error_count}`).remove();
                                    $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${error_count}`).after(`<span id="span_visual_item_no_${item_no}_error_${error_count}" class="span-error">Required</span>`);
                                }
                            }
                        } 
                        else 
                        {
                            $(`#span_visual_item_no_${item_no}_error_${visual_no}`).remove();

                            if (visual_value === '') 
                            {
                                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('OK');
                                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#27b968');
                                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('color', 'white');

                            } 
                            else if (visual_value === 'OK') 
                            {
                                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('NG');
                                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#d43333');
                            } 
                            else if (visual_value === 'NA') 
                            {
                                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('OK');
                                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#27b968');
                            } 
                            else 
                            {
                                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('NA');
                                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#676767');
                            }
                        }
                    }
                }
            }
            
            //proceed sa pag kuha ng visuals then deretso sa ajax
            EVALUATE.SubitemRecalculateVisualJudgement(item_no, sub_no);
        }
        else
        {
            $(`#span_error_coordinates_item_no_${item_no}_sub_no_${sub_no}`).remove();
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_coordinates`).after(`<span id="span_error_coordinates_item_no_${item_no}_sub_no_${sub_no}" class="span-error">Required</span>`);
        }
    };

    this_evaluate.SubitemRecalculateVisualJudgement = (item_no, sub_no) => {

        let visual_no_5         = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_5`).val();
        let array_visuals       = [];
        let visuals_NG_count    = 0;

        //array_overall_judgement ay  naska global

        //data ng visuals
        for (let index = 1; index <= 5; index++) 
        {
            array_visuals.push($(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${index}`).val());
        }

        if (visual_no_5 !== '') 
        {
            for (let index = 0; index < array_visuals.length; index++) 
            {
                if (array_visuals[index] === 'NG') {
                    visuals_NG_count++;
                }
            }

            if (visuals_NG_count > 0) 
            {
                $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html('<span class="badge badge-danger subitem-visual-judgement">NG</span>');
            } 
            else 
            {
                $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html('<span class="badge badge-success subitem-visual-judgement">GOOD</span>');
            }

            EVALUATE.SubitemCalculateOverallJudgement(item_no, sub_no, array_visuals);
        }
    }

    this_evaluate.OpenFile = (file_folder,file_name) => {
        window.open(`../../../tis/storage/app/public/${file_folder}/${file_name}`, "_blank", "width=1200,height=600, left = 2300,top = 200");
    };

    this_evaluate.AddToPdf = (file_no, check_file_no, file_name, status) => {

        if (status === 'unchecked') {

            $(`#img_attachment_${file_no}`).attr('src', `${EVALUATE.AddToPdfCheckedImage(add_to_pdf_count)}`);
            $(`#btn_add_to_pdf_${file_no}`).attr('onclick', `EVALUATE.AddToPdf(${file_no},${add_to_pdf_count},'${file_name}','checked');`);
            $(`#btn_add_to_pdf_${file_no}`).html('<i class="ti-close"></i> REMOVE')
            array_add_to_pdf.push(file_name);
            add_to_pdf_count++;

        } else {
            let onclick_value = $(`#btn_add_to_pdf_${file_no}`).attr('onclick');
            let split_onclick_value = onclick_value.split(',');
            let check_file_no_value = split_onclick_value[1];

            if (parseInt(check_file_no_value) === add_to_pdf_count - 1) {
                $(`#img_attachment_${file_no}`).attr('src', `${base_url}/template/assets/images/icon/file.png`);
                $(`#btn_add_to_pdf_${file_no}`).attr('onclick', `EVALUATE.AddToPdf(${file_no},'','${file_name}','unchecked');`)
                $(`#btn_add_to_pdf_${file_no}`).html('<i class="ti-plus"></i> ADD TO PDF')
            } else {

                $(`#img_attachment_${file_no}`).attr('src', `${base_url}/template/assets/images/icon/file.png`);
                $(`#btn_add_to_pdf_${file_no}`).attr('onclick', `EVALUATE.AddToPdf(${file_no},'','${file_name}','unchecked');`)
                $(`#btn_add_to_pdf_${file_no}`).html('<i class="ti-plus"></i> ADD TO PDF')

                if (array_add_to_pdf.length > 1) {

                    for (let index = 1; index <= parseInt(attachment_count); index++) {

                        let onclick_value = $(`#btn_add_to_pdf_${index}`).attr('onclick');
                        let split_onclick_value = onclick_value.split(',');
                        let check_file_no_value = split_onclick_value[1];
                        let check_file_name_value = split_onclick_value[2];

                        if (check_file_no_value !== '') {
                            if (parseInt(check_file_no_value) > check_file_no) {
                                $(`#img_attachment_${index}`).attr('src', `${EVALUATE.AddToPdfCheckedImage(parseInt(check_file_no_value) - 1)}`);
                                $(`#btn_add_to_pdf_${index}`).attr('onclick', `EVALUATE.AddToPdf(${index},${parseInt(check_file_no_value) - 1},${check_file_name_value},'checked');`);
                            }
                        }
                    }
                }
            }

            array_add_to_pdf = $.grep(array_add_to_pdf, function (value) {
                return value != file_name;
            });
            add_to_pdf_count--;
        }
    };

    this_evaluate.AddToPdfCheckedImage = (count) => {
        return `${base_url}/template/assets/images/icon/check_file_${count}.png`;
    };

    this_evaluate.Hinsei = (item_no, tools, type, specs, upper_limit, lower_limit, remarks) => {

        let sub_no_count        = $(`#txt_hidden_item_no_${item_no}_sub_no_count`).val();
        let edit_count          = 0;

        for (let index = 1; index <= sub_no_count; index++) 
        {
            if ($(`#btn_edit_item_no_${item_no}_sub_no_${index}`).length === 0)
            {
                edit_count++;
            }
        }
        
        if (edit_count > 0)
        {
            Swal.fire({
                icon: 'warning',
                title: 'Unsaved data',
                text: 'Please save/cancel the checksheet data before making a hinsei.',
            })
        }
        else
        {
            $(`#btn_item_no_${item_no}_hinsei`).prop('hidden', true);
            EVALUATE.RemarksInputs(item_no, tools, type, specs, upper_limit, lower_limit,remarks);
            EVALUATE.ItemDataInputs(item_no, tools, type, specs, upper_limit, lower_limit);
        }
    };

    this_evaluate.HinseiButton = (item_no, tools, type, specs, upper_limit, lower_limit,remarks) => {
        let button = `<button id="btn_item_no_${item_no}_hinsei" type="button" class="btn btn-primary btn-block" onclick="EVALUATE.Hinsei(${item_no},'${tools}', '${type}', '${specs}', '${upper_limit}', '${lower_limit}','${remarks}');"><strong class="strong-font"><i class="ti-pencil-alt"></i> HINSEI</strong></button>`;

        $(`#td_item_no_${item_no}_hinsei`).html(button);

        $(`#txt_item_no_${item_no}_hinsei_remarks`).text(remarks);
    }

    this_evaluate.ItemDataInputs = (item_no, tools, type, specs, upper_limit, lower_limit) => {

        let td_specs        = `<input id="txt_item_no_${item_no}_specs"  value="${specs}" type="text" class="form-control input_text_center" placeholder="Enter specification" onkeypress='return event.charCode >= 43 && event.charCode <= 57'>`;

        let td_upper_limit  = `<input id="txt_item_no_${item_no}_upper_limit"  value="${upper_limit}" type="text" class="form-control input_text_center" placeholder="Enter upper limit" onkeyup="EVALUATE.ValidateItemNoUpperAndLowerLimit(${item_no});" onkeypress="return event.charCode >= 43 && event.charCode <= 57">`;

        let td_lower_limit  = `<input id="txt_item_no_${item_no}_lower_limit"  value="${lower_limit}" type="text" class="form-control input_text_center" placeholder="Enter lower limit" onkeyup="EVALUATE.ValidateItemNoUpperAndLowerLimit(${item_no});" onkeypress="return event.charCode >= 43 && event.charCode <= 57">`;

        $(`#td_item_no_${item_no}_specs`).html(td_specs);
        $(`#td_item_no_${item_no}_upper_limit`).html(td_upper_limit);
        $(`#td_item_no_${item_no}_lower_limit`).html(td_lower_limit);

    }

    this_evaluate.RemarksInputs = (item_no, tools, type, specs, upper_limit, lower_limit,remarks) => {
        let td_remarks = `
        <textarea class="form-control textarea_hinsei" id="txt_item_no_${item_no}_hinsei_remarks" placeholder="Enter remarks"></textarea>
        <br>
        <div class="row">
            <div class="col-md-6"><button type="button" class="btn btn-success btn-block btn-sm" onclick="EVALUATE.SaveHinsei(${item_no}, '${specs}', '${upper_limit}', '${lower_limit}');"><i class="ti-check"></i> SAVE</button></div>
            <div class="col-md-6"><button type="button" class="btn btn-secondary btn-block btn-sm" onclick="EVALUATE.CancelHinsei(${item_no},'${tools}', '${type}', '${specs}', '${upper_limit}', '${lower_limit}','${remarks}');"><i class="ti-na"></i> CANCEL</button></div>
        </div>`;

        $(`#td_item_no_${item_no}_hinsei`).html(td_remarks);
        $(`#txt_item_no_${item_no}_hinsei_remarks`).text(remarks);

        $(`#txt_item_no_${item_no}_specs`).prop('disabled', false);
        $(`#txt_item_no_${item_no}_upper_limit`).prop('disabled', false);
        $(`#txt_item_no_${item_no}_lower_limit`).prop('disabled', false);
    }

    this_evaluate.ValidateItemNoUpperAndLowerLimit = (item_no) => {

        let upper_limit = $(`#txt_item_no_${item_no}_upper_limit`).val();
        let lower_limit = $(`#txt_item_no_${item_no}_lower_limit`).val();
        let specs       = $(`#txt_item_no_${item_no}_specs`).val();

        if (specs !== '')
        {   
            $(`span_specs_error_${item_no}`).remove();

            if (upper_limit !== '') 
            {
                $(`#span_upper_limit_error_${item_no}`).remove();
                if (upper_limit > 0) {
                    let new_upper_limit = upper_limit.replace(/^0+/, '');
                    $(`#txt_item_no_${item_no}_upper_limit`).val(new_upper_limit);
                }
            }

            if (lower_limit !== '') 
            {
                $(`#span_lower_limit_error_${item_no}`).remove();
                if (lower_limit > 0) {
                    let new_lower_limit = lower_limit.replace(/^0+/, '');
                    $(`#txt_item_no_${item_no}_lower_limit`).val(new_lower_limit);
                }
            }

            if (upper_limit !== '' && lower_limit !== '') 
            {
                if (parseFloat(lower_limit) > parseFloat(upper_limit)) 
                {
                    $(`#span_lower_limit_error_${item_no}`).remove();
                    $(`#txt_item_no_${item_no}_lower_limit`).after(`<span id="span_lower_limit_error_${item_no}" class="span-error">Lower limit cannot be higher than upper limit</span>`);
                    $(`#txt_item_no_${item_no}_lower_limit`).val('');
                } 
                else 
                {
                    $(`#span_lower_limit_error_${item_no}`).remove();
                }
            }
        } 
        else
        {
            $(`#span_specs_error_${item_no}`).remove();
            $(`#txt_item_no_${item_no}_specs`).after(`<span id="span_specs_error_${item_no}" class="span-error">Required</span>`);
            $(`#txt_item_no_${item_no}_upper_limit`).val('');
            $(`#txt_item_no_${item_no}_lower_limit`).val('');
        }
    };

    this_evaluate.SaveHinsei = (item_no,existing_specs, existing_upper_limit, existing_lower_limit) => {

        let trial_checksheet_id     = $(`#trial_checksheet_id`).val();
        let item_no_id              = $(`#txt_hidden_item_no_${item_no}_id`).val();
        let item_no_sub_no_count    = $(`#txt_hidden_item_no_${item_no}_sub_no_count`).val();
        let tools                   = $(`#td_item_no_${item_no}_tools`).html();
        let type                    = $(`#td_item_no_${item_no}_type`).html();
        let specs                   = $(`#txt_item_no_${item_no}_specs`).val();
        let upper_limit             = $(`#txt_item_no_${item_no}_upper_limit`).val();
        let lower_limit             = $(`#txt_item_no_${item_no}_lower_limit`).val();
        let judgement               = $(`#td_item_no_${item_no}_judgement span`).text();
        let item_type               = $(`#txt_hidden_item_no_${item_no}_item_type`).val();
        let remarks                 = $(`#txt_item_no_${item_no}_hinsei_remarks`).val();
      
        let new_upper_limit     = parseFloat(upper_limit);
        let new_lower_limit     = parseFloat(lower_limit);

        
        //nilagyan ko ng ganto dahil pag ka "+0.6" ang nilagay na input, kusang inaalis yung positive sign kaso sa data nila galing trial ledger kasama yung "+" sign sa number kaya ayan
        
        if (upper_limit === '-')
        {
            new_upper_limit =  `-`;
        }
        else if (upper_limit === '-')
        {
            new_upper_limit =  '';
        }
        else
        {
            if (parseFloat(upper_limit) > 0)
            {
                new_upper_limit =  `+${parseFloat(upper_limit)}`;
            }
        }
        
        if (lower_limit === '-')
        {
            new_lower_limit =  `-`;
        }
        else if (lower_limit === '')
        {
            new_lower_limit =  '';
        }
        else
        {
            if (parseFloat(lower_limit) > 0)
            {
                new_lower_limit =  `+${parseFloat(lower_limit)}`;
            }
        }
        
         if (specs === '')
        {
            $(`#span_specs_error_${item_no}`).remove();
        
            $(`#txt_item_no_${item_no}_specs`).after(`<span id="span_specs_error_${item_no}" class="span-error">Required</span>`);
        }
        else if (upper_limit === '')
        {
            $(`#span_upper_limit_error_${item_no}`).remove();
            $(`#txt_item_no_${item_no}_upper_limit`).after(`<span id="span_upper_limit_error_${item_no}" class="span-error">Required</span>`);
        }
        else if (lower_limit === '')
        {
        
            $(`#span_lower_limit_error_${item_no}`).remove();
            $(`#txt_item_no_${item_no}_lower_limit`).after(`<span id="span_lower_limit_error_${item_no}" class="span-error">Required</span>`);
        }
        else if (remarks === '')
        {
            $(`#span_remarks_error_${item_no}`).remove();
            $(`#txt_item_no_${item_no}_hinsei_remarks`).after(`<span id="span_remarks_error_${item_no}" class="span-error">Required</span>`);
        }

        if (specs !== '' && upper_limit !== '' && lower_limit !== '' && remarks !== '')
        { 
            if (existing_specs !== specs || existing_upper_limit !== upper_limit || existing_lower_limit !== lower_limit)
            {
                Swal.fire($.extend(swal_options, {
                    title: 'Are you sure you want to save?',
                })).then((result) => 
                {
                    if (result.value) 
                    {
                        $(`#accordion_igm`).LoadingOverlay('show');
                        
                        $(`#span_specs_error_${item_no}`).remove();
                        $(`#span_upper_limit_error_${item_no}`).remove();
                        $(`#span_lower_limit_error_${item_no}`).remove();
                        $(`#span_remarks_error_${item_no}`).remove();

                        if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
                        {
                            let sub_no_count = $(`#txt_hidden_item_no_${item_no}_sub_no_count`).val();

                            for (let sub_no = 1; sub_no <= sub_no_count; sub_no++) 
                            {
                                EVALUATE.RejudgementMinMax(item_no, sub_no, sub_no_count,trial_checksheet_id,tools,type,specs,new_upper_limit,new_lower_limit,item_type,remarks);

                                if (sub_no == sub_no_count)
                                {
                                    //para malaman kung may remarks o wala
                                    (remarks == null) ? new_remarks = '' : new_remarks = remarks;
                                    EVALUATE.TrialChecksheetRejudgement(trial_checksheet_id,item_no,tools,type,specs,new_upper_limit,new_lower_limit,item_type,new_remarks,'hinsei');
                                }
                            }
                        }
                        else 
                        {
                            let final_judgment = judgement;//ginanto ko lang para alam na final judgement

                            EVALUATE.ProceedOverallRejudgement(trial_checksheet_id,item_no,tools,type,specs,new_upper_limit,new_lower_limit,judgement,item_type,remarks,final_judgment,'hinsei');// ito ay Actual type. mga hindi nagbabago item judgement pagka naghinsei kaya same lang yung judgement para sa final judgement

                            for (let sub_no = 1; sub_no <= item_no_sub_no_count; sub_no++) 
                            {
                                let coordinates     = $(`#td_item_no_${item_no}_sub_no_${sub_no}_coordinates`).html();
                                let judgment_datas  = $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement span`).text();

                                let split_sub_item_remarks          = $(`#btn_edit_item_no_${item_no}_sub_no_${sub_no}`).attr('onclick').split(',');
                                let split_split_sub_item_remarks    = split_sub_item_remarks[14].split(')');
                                var sub_item_remarks                = split_split_sub_item_remarks[0].replace(/"|'/g, '');

                                let array_visuals   = [];

                                //data ng visuals
                                for (let visual_no = 1; visual_no <= 5; visual_no++) 
                                {
                                    array_visuals.push($(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val());
                                }
                                
                                $(`#td_item_no_${item_no}_remarks`).html(new_remarks);

                                // para sa pag update ng checksheet data
                                EVALUATE.ProceedEditData(item_no_id, sub_no, coordinates,array_visuals,judgment_datas,sub_item_remarks,judgement,final_judgment,type,item_no,'hinsei');
                            }
                        }
                    }
                })
            }
            else
            {
                Swal.fire({
                    icon: 'warning',
                    title: 'Hinsei Cancelled',
                    text: 'There is no changes with the specification, upper limit, lower limit. Hinsei is cancelled.',
                })
                let td_item_remarks = $(`#td_item_no_${item_no}_remarks`).html();

                EVALUATE.CancelHinsei(item_no, tools, type, existing_specs, existing_upper_limit, existing_lower_limit,(td_item_remarks === '-') ? '' : td_item_remarks);
            }
        }

    }

    this_evaluate.RejudgementMinMax = (item_no, sub_no, sub_no_count,trial_checksheet_id,tools,type,specs,new_upper_limit,new_lower_limit,item_type,remarks) => {

        let upper_limit                          = $(`#txt_item_no_${item_no}_upper_limit`).val();
        let lower_limit                          = $(`#txt_item_no_${item_no}_lower_limit`).val();
        let min_max_range                        = (parseFloat(upper_limit) - parseFloat(lower_limit)) / 2;

        let array_min_max_judgement_per_sub_item = [];
        let array_min_max_value                  = [];

        for (let a_count = 1; a_count <= 5; a_count++) 
        {
            let min_value_loop = $(`#td_item_no_${item_no}_sub_no_${sub_no}_min_${a_count}`).html();
            let max_value_loop = $(`#td_item_no_${item_no}_sub_no_${sub_no}_max_${a_count}`).html();
     
            // checking ng min
            if (min_value_loop !== '') 
            {   
                if (min_value_loop === '-')
                {
                    array_min_max_judgement_per_sub_item.push('NA');
                    array_min_max_value.push('-');
                }
                else
                {
                    //para sa iba pang condition para sa MMF may range na kasama
                    if (type === 'Min and Max and Form Tolerance')
                    {
                        let min_max_difference = parseFloat(max_value_loop) - parseFloat(min_value_loop);

                        if (min_max_difference <= min_max_range)
                        {
                            array_min_max_judgement_per_sub_item.push('OK');
                        }
                        else if (min_max_difference > min_max_range)
                        {
                            array_min_max_judgement_per_sub_item.push('NG');
                        }
                        else
                        {
                            array_min_max_judgement_per_sub_item.push('OK');
                        }
                    }
                    else
                    {
                        if (parseFloat(min_value_loop) > parseFloat(upper_limit)) 
                        {
                            array_min_max_judgement_per_sub_item.push('NG');
                        } 
                        else 
                        {
                            if (parseFloat(min_value_loop) < parseFloat(lower_limit)) 
                            {
                                array_min_max_judgement_per_sub_item.push('NG');
                            } 
                            else 
                            {
                                array_min_max_judgement_per_sub_item.push('OK');
                            }
                        }
                    }

                    array_min_max_value.push((parseFloat(min_value_loop) > 0) ? `+${parseFloat(min_value_loop)}`: parseFloat(min_value_loop));
                }
             }
             else
             {
                array_min_max_judgement_per_sub_item.push('NA');
                array_min_max_value.push('-');
             }

            // checking ng max
            if (max_value_loop !== '') 
            {
                if (max_value_loop === '-')
                {
                    array_min_max_judgement_per_sub_item.push('NA');
                    array_min_max_value.push('-');
                }
                else
                {
                    //para sa iba pang condition para sa MMF may range na kasama
                    if (type === 'Min and Max and Form Tolerance')
                    {
                        let min_max_difference = parseFloat(max_value_loop) - parseFloat(min_value_loop);

                        if (min_max_difference <= min_max_range)
                        {
                            array_min_max_judgement_per_sub_item.push('OK');
                        }
                        else if (min_max_difference > min_max_range)
                        {
                            array_min_max_judgement_per_sub_item.push('NG');
                        }
                        else
                        {
                            array_min_max_judgement_per_sub_item.push('OK');
                        }
                    }
                    else
                    {
                        if (parseFloat(max_value_loop) > parseFloat(upper_limit)) 
                        {
                            array_min_max_judgement_per_sub_item.push('NG');
                        } 
                        else 
                        {
                            if (parseFloat(max_value_loop) < parseFloat(lower_limit)) 
                            {
                                array_min_max_judgement_per_sub_item.push('NG');
                            } 
                            else 
                            {
                                array_min_max_judgement_per_sub_item.push('OK');
                            }
                        }
                    }

                    array_min_max_value.push((parseFloat(max_value_loop) > 0) ? `+${parseFloat(max_value_loop)}`: parseFloat(max_value_loop));
                }
            }
            else
            {
                array_min_max_judgement_per_sub_item.push('NA');
                array_min_max_value.push('-');
            }

            if (a_count === 5) 
            {
                if (array_min_max_judgement_per_sub_item.length !== 10) 
                {
                    $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                } 
                else 
                {
                    //pag lalagay ng sub item judgement
                    if ($.inArray('NG', array_min_max_judgement_per_sub_item) === - 1)
                    {
                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="badge badge-success subitem-visual-judgement">GOOD</span>`);
                    }
                    else
                    {
                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="badge badge-danger subitem-visual-judgement">NG</span>`);
                    }
                  
                    //pagkuha ng overall judgement para sa checksheet item 
                    EVALUATE.OverallRejudgement(item_no,sub_no,array_min_max_value, sub_no_count,trial_checksheet_id,tools,type,specs,new_upper_limit,new_lower_limit,item_type,remarks,'hinsei');
                    array_min_max_judgement_per_sub_item = [];
                    array_min_max_value = [];
                }
            }
        }   
    };

    this_evaluate.OverallRejudgement = (item_no, sub_no, array_data, sub_no_count,trial_checksheet_id,tools,type,specs,new_upper_limit,new_lower_limit,item_type,remarks, action,new_coordinates) => {

        //pagkuha ng existing sub count
        let total_sub_no_count              = sub_no_count;
        let id                              = $(`#txt_hidden_item_no_${item_no}_id`).val();
        let judgment_datas                  = $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement span`).text();
        
        if (action === 'hinsei')
        {
            let split_sub_item_remarks          = $(`#btn_edit_item_no_${item_no}_sub_no_${sub_no}`).attr('onclick').split(',');
            let split_split_sub_item_remarks    = split_sub_item_remarks[14].split(')');
            var sub_item_remarks                = split_split_sub_item_remarks[0].replace(/"|'/g, '');
        }
        else
        {
            sub_item_remarks                    = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_edit_remarks`).val();
        }

        (action === 'hinsei') ? coordinates = $(`#td_item_no_${item_no}_sub_no_${sub_no}_coordinates`).html() : coordinates = new_coordinates;

        let array_overall_judgement                     = [];
        let array_trial_checksheet_overall_judgement    = [];

        for (let index = 1; index <= total_sub_no_count; index++) 
        {
            array_overall_judgement.push($(`#td_item_no_${item_no}_sub_no_${index}_judgement span`).text());
        }

        //para malaman ang checksheet item judgement
        ($.inArray('NG', array_overall_judgement) === - 1) ? judgment_item     = 'GOOD'    : judgment_item     = 'NG';
        ($.inArray('NG', array_overall_judgement) === - 1) ? judgement_status  = 'success' : judgement_status  = 'danger';

        //para malaman kung may remarks o wala
        (remarks == null) ? new_remarks = '' : new_remarks = remarks;
        
        $(`#td_item_no_${item_no}_judgement`).html(`<span class="badge badge-${judgement_status} subitem-visual-judgement">${judgment_item}</span>`);
        $(`#td_item_no_${item_no}_remarks`).html(new_remarks);// remarks ng checksheet item

        //para malaman ang trial checksheet judgement
        for (let index = 1; index <= parseInt(checksheet_item_count); index++) 
        {
            array_trial_checksheet_overall_judgement.push($(`#td_item_no_${index}_judgement span`).text());
        }  
        
        //para malaman ang trial checksheet judgement
        ($.inArray('NG', array_trial_checksheet_overall_judgement) === - 1) ? final_judgment    = 'GOOD'    : final_judgment = 'NG';
        
        if ($.inArray('N/A',array_overall_judgement) === -1)
        {
            if (type !== 'Min and Max' || type !== 'Min and Max and Form Tolerance') 
            {
                EVALUATE.ProceedOverallRejudgement(trial_checksheet_id,item_no,tools,type,specs,new_upper_limit,new_lower_limit,judgment_item,item_type,new_remarks,final_judgment,action);
                array_overall_judgement     = [];
            }

            // para sa pag update ng checksheet data
            EVALUATE.ProceedEditData(id, sub_no, coordinates,array_data,judgment_datas,sub_item_remarks,judgment_item,final_judgment,type,item_no,action);
            array_overall_judgement     = [];
        }
        else
        {
            $(`#td_item_no_${item_no}_judgement`).html('<span class="input_text_center">N/A</span>');
            array_overall_judgement     = [];
        }
    };
    
    this_evaluate.ProceedOverallRejudgement = (trial_checksheet_id,item_no,tools,type,specs,new_upper_limit,new_lower_limit,judgement,item_type,remarks,final_judgment,action) => {
      
        $.ajax({
            url         : `edit-hinsei`,
            type        : 'patch',
            dataType    : 'json',
            cache       : false,
            data        : 
            {
                _token: _TOKEN,
                trial_checksheet_id : trial_checksheet_id,
                item_number         : item_no,
                tools               : tools,
                type                : type,
                specification       : specs,
                upper_limit         : new_upper_limit,
                lower_limit         : new_lower_limit,
                judgment            : judgement,
                item_type           : item_type,
                remarks             : remarks,
                judgment_checksheet : final_judgment,
            },
            success: result => 
            {
                if(result.status === 'Success')
                {
                    if (action === 'hinsei')
                    {
                        EVALUATE.HinseiButton(item_no, tools, type, specs, new_upper_limit, new_lower_limit,remarks);

                        $(`#td_item_no_${item_no}_specs`).html(specs);
                        $(`#td_item_no_${item_no}_upper_limit`).html(new_upper_limit);
                        $(`#td_item_no_${item_no}_lower_limit`).html(new_lower_limit);
        
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Hinsei successful',
                        })
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

                $(`#accordion_igm`).LoadingOverlay('hide');
            }
        });

    };

    this_evaluate.TrialChecksheetRejudgement = (trial_checksheet_id,item_no,tools,type,specs,new_upper_limit,new_lower_limit,item_type,new_remarks,action) => {

        let judgment_item                                = $(`#td_item_no_${item_no}_judgement span`).text();
        let array_item_judgment                         = [];

        //pagkuha ng item judgements para sa buong judgment ng trial
        for (let index = 1; index <= parseInt(checksheet_item_count); index++) 
        {
            let item_judgment = $(`#td_item_no_${index}_judgement span`).text();

            array_item_judgment.push(item_judgment);

            if (index === parseInt(checksheet_item_count))
            {
                if ($.inArray('NA', array_item_judgment) === - 1)
                {
                    if ($.inArray('NG', array_item_judgment) === - 1)
                    {
                        EVALUATE.ProceedOverallRejudgement(trial_checksheet_id,item_no,tools,type,specs,new_upper_limit,new_lower_limit,judgment_item,item_type,new_remarks,'GOOD',action);
                    }
                    else
                    {
                        EVALUATE.ProceedOverallRejudgement(trial_checksheet_id,item_no,tools,type,specs,new_upper_limit,new_lower_limit,judgment_item,item_type,new_remarks,'NG',action);
                    }
                }
                else
                {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Item with no judgement has been found',
                        text: 'Please check your checksheet item/s.',
                    })
                }
            }
        }
    };

    this_evaluate.CancelHinsei = (item_no, tools, type, specs, upper_limit, lower_limit, remarks) => {
        EVALUATE.HinseiButton(item_no, tools, type, specs, upper_limit, lower_limit,remarks);

        $(`#td_item_no_${item_no}_tools`).html(tools);
        $(`#td_item_no_${item_no}_type`).html(type);
        $(`#td_item_no_${item_no}_specs`).html(specs);
        $(`#td_item_no_${item_no}_upper_limit`).html(upper_limit);
        $(`#td_item_no_${item_no}_lower_limit`).html(lower_limit);
    };

    this_evaluate.EditSubItem = (type,item_no, sub_no, coordinates, array_data,remarks) => {

        let  hinsei_button = $(`#btn_item_no_${item_no}_hinsei`).length;
        let  item_judgment = $(`#td_item_no_1_judgement span`).text();

        if (hinsei_button === 0)
        {
            Swal.fire({
                icon: 'warning',
                title: 'Unsaved hinsei',
                text: 'Please save/cancel the hinsei before editing the checksheet data',
            })
        }
        else
        {
            $(`#btn_edit_sub_no_${sub_no}`).prop('hidden', true);

            let array_min_max_data          = [];

            split_data = array_data.split(',');
            split_data.forEach((split_value) => {
                array_min_max_data.push(split_value);
            });
            
            let td_coordinates = `<input id="txt_item_no_${item_no}_sub_no_${sub_no}_coordinates" type="text" class="form-control input_text_center" placeholder="Enter Coordinates" autocomplete="off" value="${coordinates}">`;

            if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance')
            {
                td_coordinates = `<input id="txt_item_no_${item_no}_sub_no_${sub_no}_coordinates" type="text" class="form-control input_text_center" placeholder="Enter Coordinates" autocomplete="off" value="${coordinates}" onkeyup="EVALUATE.SubItemGetMinMax(${item_no},${sub_no},'','')">`;

                let min_count = 0;
                let max_count = 1;

                for (let index = 1; index <= 5; index++) 
                {
                    let data_min = `<input  id="txt_item_no_${item_no}_sub_no_${sub_no}_min_${index}" type="text" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onchange="EVALUATE.SubItemGetMinMax(${item_no},${sub_no},${index},'min')" title='min' value="${IGM.ChecksheetDataInputData(type,array_min_max_data,min_count)}"  onkeypress="return event.charCode >= 43 && event.charCode <= 57" onclick="IGM.CheckIfDashValue('${IGM.ChecksheetDataInputData(type,array_min_max_data,min_count)}',${item_no},${sub_no},'min_${index}');">`;

                    let data_max = `<input id="txt_item_no_${item_no}_sub_no_${sub_no}_max_${index}" type="text" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onchange="EVALUATE.SubItemGetMinMax(${item_no},${sub_no},${index},'max')" title='max' value="${IGM.ChecksheetDataInputData(type,array_min_max_data,max_count)}" onkeypress="return event.charCode >= 43 && event.charCode <= 57" onclick="IGM.CheckIfDashValue('${IGM.ChecksheetDataInputData(type,array_min_max_data,max_count)}',${item_no},${sub_no},'max_${index}');">`;

                    $(`#td_item_no_${item_no}_sub_no_${sub_no}_min_${index}`).html(data_min);
                    $(`#td_item_no_${item_no}_sub_no_${sub_no}_max_${index}`).html(data_max);
                    
                    min_count += 2;
                    max_count += 2;
                }

                var sub_item_judgement = $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement span`).text();
            }
            else
            {
                for (let visual_no = 1; visual_no <= 5; visual_no++) 
                {
                    $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).prop('disabled',false);
                    $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).prop('readonly',true);
                    $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).addClass('input-pointer');
                }

                sub_item_judgement = $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement span`).text();
            }
            
            let td_edit_button = `
            <textarea class="form-control textarea_hinsei" id="txt_item_no_${item_no}_sub_no_${sub_no}_edit_remarks" placeholder="Enter remarks"></textarea>
            <br>
            <div class="row">
                <div class="col-md-6">
                    <button type="button" class="btn btn-success btn-block" onclick="EVALUATE.SaveSubItem('${type}',${item_no},${sub_no},'${coordinates}','${array_data}')"><strong class="strong-font"><i class="ti-check"></i> SAVE</strong></button>
                </div>
                <div class="col-md-6">
                    <button type="button" class="btn btn-secondary btn-block" onclick="EVALUATE.CancelSubItem('${type}',${item_no},${sub_no},'${coordinates}','${array_data}','${sub_item_judgement}','${remarks}','${item_judgment}')"><strong class="strong-font"><i class="ti-na"></i> CANCEL</strong></button>
                </div>
            </div>`;

            $(`#td_item_no_${item_no}_sub_no_${sub_no}_coordinates`).html(td_coordinates);
            $(`#td_item_no_${item_no}_sub_no_${sub_no}_edit`).html(td_edit_button);

            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_edit_remarks`).val(remarks);
        }
    };

    this_evaluate.SubItemSelectVisual = (item_no,sub_no,visual_no) => {
            
        let visual_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val();

        if (visual_value === 'OK') 
        {
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('NG');
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).attr('value','NG');
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#d43333');
        } 
        else if (visual_value === 'NA') 
        {
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('OK');
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).attr('value','OK');
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#27b968');
        } 
        else 
        {
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('NA');
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).attr('value','NA');
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#676767');
        }

        let array_visuals       = [];
        //data ng visuals
        for (let index = 1; index <= 5; index++) 
        {
            array_visuals.push($(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${index}`).val());
        }

        if (array_visuals.every( (value, i, array) => value === 'NA') == true)
        {
            $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html('<span class="input_text_center">N/A</span>');
        }
        else
        {
            if ($.inArray('NG', array_visuals) === - 1)
            {
                $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html('<span class="badge badge-success subitem-visual-judgement">GOOD</span>');
            }
            else
            {
                $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html('<span class="badge badge-danger subitem-visual-judgement">NG</span>');
            }
        }
    };

    this_evaluate.SubItemGetMinMax = (item_no, sub_no, min_max_no, min_max_type) => {

        let coordinates     =   $(`#txt_item_no_${item_no}_sub_no_${sub_no}_coordinates`).val();
        let min_max_value   =   $(`#txt_item_no_${item_no}_sub_no_${sub_no}_${min_max_type}_${min_max_no}`).val();

        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_${min_max_type}_${min_max_no}`).attr('onclick',`IGM.CheckIfDashValue('${min_max_value}',${item_no},${sub_no},'${min_max_type}_${min_max_no}')`);
        
        if (coordinates !== '')
        {
            $(`#span_coordinates_error_${item_no}`).remove();

            EVALUATE.ValidateSubItemGetMinMax(item_no, sub_no, min_max_no, min_max_type);
        }
        else
        {
            IGM.ValidateMinMaxType(item_no, sub_no,min_max_type,min_max_no);
        }
    };

    this_evaluate.ValidateSubItemGetMinMax = (item_no, sub_no, min_max_no, min_max_type) => {

        let type            = $(`#td_item_no_${item_no}_type`).html();
        let min_max_value   = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_${min_max_type}_${min_max_no}`).val();

        if (min_max_type === 'min') 
        {
            if (min_max_no === 1) 
            {
                if (min_max_value === '-')
                {
                    $(`#span_min_error_${min_max_no}`).remove();

                    if (type === 'Min and Max and Form Tolerance')
                    {
                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                        $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    }
                    else
                    {
                        EVALUATE.ValidateSubItemGetMinMaxWithUpperAndLowerLimit(item_no, sub_no, min_max_no, min_max_type);
                    }
                }
                else
                {
                    if (isNaN(parseFloat(min_max_value))) 
                    {
                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                        $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    } 
                    else 
                    {
                        $(`#span_min_error_${min_max_no}`).remove();
                        EVALUATE.ValidateSubItemGetMinMaxWithUpperAndLowerLimit(item_no, sub_no, min_max_no, min_max_type);
                    }
                }
            } 
            else 
            {
                if (min_max_value === '-')
                {
                    if (type === 'Min and Max and Form Tolerance')
                    {
                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                        $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    }
                    else
                    {
                        for (let min_max_count = min_max_no - 1; min_max_count < min_max_no; min_max_count++) 
                        {
                            if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_count}`).val() === '') 
                            {
                                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).val('');
                                EVALUATE.ValidateSubItemGetMinMaxPreviousUpperAndLowerLimit(item_no, sub_no, min_max_no);
                            } 
                            else 
                            {
                                if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no - 1}`).val() !== '') 
                                {
                                    $(`#span_min_error_${min_max_no}`).remove();
                                    EVALUATE.ValidateSubItemGetMinMaxWithUpperAndLowerLimit(item_no, sub_no, min_max_no, min_max_type);
                                }
                            }
                        } 
                    }
                }
                else
                {
                    if (isNaN(parseFloat(min_max_value))) 
                    {
                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                        $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    } 
                    else 
                    {
                        for (let min_max_count = min_max_no - 1; min_max_count < min_max_no; min_max_count++) 
                        {
                            if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_count}`).val() === '') 
                            {
                                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).val('');
                                EVALUATE.ValidateSubItemGetMinMaxPreviousUpperAndLowerLimit(item_no, sub_no, min_max_no);
                            } 
                            else 
                            {
                                if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no - 1}`).val() !== '') 
                                {
                                    $(`#span_min_error_${min_max_no}`).remove();
                                    EVALUATE.ValidateSubItemGetMinMaxWithUpperAndLowerLimit(item_no, sub_no, min_max_no, min_max_type);
                                }
                            }
                        }  
                    }
                }
                
            }
        } 
        else if (min_max_type === 'max') 
        {
            if (min_max_no === 1) 
            {
                if (min_max_value === '-')
                {
                    $(`#span_min_error_${min_max_no}`).remove();

                    if (type === 'Min and Max and Form Tolerance')
                    {
                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                        $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    }
                    else
                    {
                        EVALUATE.ValidateSubItemGetMinMaxWithUpperAndLowerLimit(item_no, sub_no, min_max_no, min_max_type); 
                    }
                }
                else
                {
                    if (isNaN(parseFloat(min_max_value))) 
                    {
                        $(`#span_min_error_${min_max_no}`).remove();
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).after(`<span id="span_min_error_${min_max_no}" class="span-error">Required</span>`);
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no}`).val('');
                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                        $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    } 
                    else 
                    {
                        $(`#span_min_error_${min_max_no}`).remove();
                        EVALUATE.ValidateSubItemGetMinMaxWithUpperAndLowerLimit(item_no, sub_no, min_max_no, min_max_type); 
                    }
                }
                
            } 
            else 
            {
                if (min_max_value === '-')
                {
                    if (type === 'Min and Max and Form Tolerance')
                    {
                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                        $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    }
                    else
                    {
                        EVALUATE.ValidateSubItemGetMinMax5(item_no, sub_no, min_max_no, min_max_type);
                    }
                }
                else
                {
                    if (isNaN(parseFloat(min_max_value))) 
                    {
                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                        $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    } 
                    else 
                    {
                        EVALUATE.ValidateSubItemGetMinMax5(item_no, sub_no, min_max_no, min_max_type);
                    }
                }
            }
        }
        else
        {
            //itong else para pagka pinalitan ng value ang coordinates, dapat complete ma lahat ng min max value
            let last_max_value              = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_5`).val();
            let array_min_max_value         = [];
            let empty_min_max_inputs_count  = 0 ; 

            if (last_max_value !== '')
            {
                for (let c_count = 1; c_count <= 5; c_count++) 
                {
                    //pagkuha ng min and max data
                    let min_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${c_count}`).val();
                    let max_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${c_count}`).val();
                    
                    //para malaman kung may empty na inputs para hindi poproceed sa function
                    if (min_value === '' || max_value === '')
                    {
                        empty_min_max_inputs_count++;
                    }
                    
                    if (empty_min_max_inputs_count === 0)
                    {
                        let new_min_value = parseFloat(min_value);
                        let new_max_value = parseFloat(max_value);

                        //nilagyan ko ng ganto dahil pag ka "+0.6" ang nilagay na input, kusang inaalis yung positive sign kaso sa data nila galing trial ledger kasama yung "+" sign sa number kaya ayan
                        if (!isNaN(parseFloat(min_value)))
                        {
                            if (parseFloat(min_value) > 0)
                            {
                                new_min_value =  `+${parseFloat(min_value)}`;
                            }
                        }
                        
                        if (!isNaN(parseFloat(max_value)))
                        {
                            if (parseFloat(max_value) > 0)
                            {
                                new_max_value =  `+${parseFloat(max_value)}`;
                            }
                        }

                        if (!isNaN(parseFloat(min_value)))
                        {
                            if (!isNaN(parseFloat(max_value)))
                            {
                                //pagpush ng min and max data
                                if (min_value === '-')
                                {
                                    if (type === 'Min and Max and Form Tolerance')
                                    {
                                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                                        $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                                    }
                                    else
                                    {
                                        array_min_max_value.push(min_value);
                                    }
                                }
                                else
                                {
                                    array_min_max_value.push((parseFloat(min_value) > 0) ? `+${parseFloat(min_value)}`: parseFloat(min_value));
                                }

                                if (max_value === '-')
                                {
                                    if (type === 'Min and Max and Form Tolerance')
                                    {
                                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                                        $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                                    }
                                    else
                                    {
                                        array_min_max_value.push(max_value);
                                    }
                                }
                                else
                                {
                                    array_min_max_value.push((parseFloat(max_value) > 0) ? `+${parseFloat(max_value)}`: parseFloat(max_value));
                                }

                                if (c_count === 5) 
                                {
                                    //pagkuha ng overall judgement para sa checksheet item
                                    EVALUATE.SubitemCalculateOverallJudgement(item_no,sub_no,array_min_max_value,type);
                                    array_min_max_value = [];
                                }
                            }
                            else
                            {
                                $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                                $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                            }
                        }
                        else
                        {
                            $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                            $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                        }
                    }
                }
            }
        }
    };

    this_evaluate.ValidateSubItemGetMinMax5 = (item_no, sub_no, min_max_no, min_max_type) => {

        if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no}`).val() === '') 
        {
            $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
            $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
        } 
        else 
        {
            for (let min_max_count = min_max_no - 1; min_max_count < min_max_no; min_max_count++) 
            {
                if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_count}`).val() === '') 
                {
                    $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no}`).val('');
                    IGM.ValidateSubItemGetMinMaxPreviousUpperAndLowerLimit(item_no, sub_no, min_max_no);
                } 
                else 
                {
                    if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no - 1}`).val() !== '') 
                    {
                        $(`#span_max_error_${min_max_no}`).remove();
                        EVALUATE.ValidateSubItemGetMinMaxWithUpperAndLowerLimit(item_no, sub_no, min_max_no, min_max_type);
                    }
                }
            }
        }
    };

    this_evaluate.ValidateSubItemGetMinMaxWithUpperAndLowerLimit = (item_no, sub_no, min_max_no, min_max_type) => {
        
        let type      = $(`#td_item_no_${item_no}_type`).html();
        let min_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).val();
        let max_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no}`).val();

        let upper_limit                          = $(`#td_item_no_${item_no}_upper_limit`).html();
        let lower_limit                          = $(`#td_item_no_${item_no}_lower_limit`).html();
        let min_max_range                        = (parseFloat(upper_limit) - parseFloat(lower_limit)) / 2;
        let last_max_value                       = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_5`).val();
        let total_sub_no_count                   = $(`#txt_hidden_item_no_${item_no}_sub_no_count`).val();
        let array_min_max_judgement_per_sub_item = [];
        let array_min_max_value                  = [];

        if (parseFloat(min_value) > parseFloat(max_value)) 
        {
            $(`#span_min_error_${min_max_no}`).remove();
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).after(`<span id="span_min_error_${min_max_no}" class="span-error">Invalid min and max</span>`);
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_${min_max_type}_${min_max_no}`).val('');

            $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
        } 
        else 
        {
            $(`#span_min_error_${min_max_no}`).remove();

            if (last_max_value !== '') 
            {
                final_array_min_max_datas   = [];
                dash_count                  = 0;

                for (let a_count = 1; a_count <= 5; a_count++) 
                {
                    let min_value_loop = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${a_count}`).val();
                    let max_value_loop = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${a_count}`).val();
               
                    // checking ng min
                    if (min_value_loop !== '') 
                    {   
                        if (min_value_loop === '-')
                        {
                            if (type === 'Min and Max and Form Tolerance')
                            {
                                if (max_value_loop !== '')
                                {
                                    if (max_value_loop !== '-')
                                    {
                                        dash_count++;
                                    }
                                }
                                else
                                {
                                    dash_count++;
                                }
                            }
                            final_array_min_max_datas.push('-');// nakaglobal to, kailangan para sa SaveSubItem ng 'Min and Max' type
                            array_min_max_judgement_per_sub_item.push('NA');
                        }
                        else
                        {
                            if (type === 'Min and Max and Form Tolerance')
                            {
                                if (max_value_loop === '')
                                {
                                    if (max_value_loop === '-')
                                    {
                                        dash_count++;
                                        final_array_min_max_datas.push('-');// nakaglobal to, kailangan para sa SaveSubItem ng 'Min and Max' type
                                        array_min_max_judgement_per_sub_item.push('NA');
                                    }
                                    else
                                    {
                                        let min_max_difference = parseFloat(max_value_loop) - parseFloat(min_value_loop);

                                        if (min_max_difference <= min_max_range)
                                        {
                                            array_min_max_judgement_per_sub_item.push('OK');
                                        }
                                        else if (min_max_difference > min_max_range)
                                        {
                                            array_min_max_judgement_per_sub_item.push('NG');
                                        }
                                        else
                                        {
                                            array_min_max_judgement_per_sub_item.push('OK');
                                        }

                                        final_array_min_max_datas.push((parseFloat(min_value_loop) > 0) ? `+${parseFloat(min_value_loop)}`: parseFloat(min_value_loop));// nakaglobal to, kailangan para sa SaveSubItem ng 'Min and Max' type
                                        //para sa iba pang condition para sa MMF may range na kasama
                                    }
                                }
                                else
                                {
                                    final_array_min_max_datas.push((parseFloat(min_value_loop) > 0) ? `+${parseFloat(min_value_loop)}`: parseFloat(min_value_loop));//

                                    let min_max_difference = parseFloat(max_value_loop) - parseFloat(min_value_loop);

                                    if (min_max_difference <= min_max_range)
                                    {
                                        array_min_max_judgement_per_sub_item.push('OK');
                                    }
                                    else if (min_max_difference > min_max_range)
                                    {
                                        array_min_max_judgement_per_sub_item.push('NG');
                                    }
                                    else
                                    {
                                        array_min_max_judgement_per_sub_item.push('OK');
                                    }
                                }
                            }
                            else
                            {
                                if (parseFloat(min_value_loop) > upper_limit) 
                                {
                                    array_min_max_judgement_per_sub_item.push('NG');
                                } 
                                else 
                                {
                                    if (parseFloat(min_value_loop) < lower_limit) 
                                    {
                                        array_min_max_judgement_per_sub_item.push('NG');
                                    } 
                                    else 
                                    {
                                        array_min_max_judgement_per_sub_item.push('OK');
                                    }
                                }

                                final_array_min_max_datas.push((parseFloat(min_value_loop) > 0) ? `+${parseFloat(min_value_loop)}`: parseFloat(min_value_loop));// nakaglobal to, kailangan para sa SaveSubItem ng 'Min and Max' type
                                //para sa iba pang condition para sa MMF may range na kasama
                            }
                        }
                    }
                    else
                    {
                        if (type === 'Min and Max and Form Tolerance')
                        {
                            dash_count++;
                        }
                        final_array_min_max_datas.push('-');// nakaglobal to, kailangan para sa SaveSubItem ng 'Min and Max' type
                        array_min_max_judgement_per_sub_item.push('NA');
                    }

                    // checking ng max
                    if (max_value_loop !== '') 
                    {
                        if (max_value_loop === '-')
                        {
                            if (type === 'Min and Max and Form Tolerance')
                            {
                                if (min_value_loop !== '')
                                {
                                    if (min_value_loop !== '-')
                                    {
                                        dash_count++;
                                    }
                                }
                                else
                                {
                                    dash_count++;
                                }
                            }

                            final_array_min_max_datas.push('-');// nakaglobal to, kailangan para sa SaveSubItem ng 'Min and Max' type
                            array_min_max_judgement_per_sub_item.push('NA');
                        }
                        else
                        {
                            //para sa iba pang condition para sa MMF may range na kasama
                            if (type === 'Min and Max and Form Tolerance')
                            {
                                if (min_value_loop === '')
                                {
                                    if (min_value_loop === '-')
                                    {
                                        dash_count++;
                                        final_array_min_max_datas.push('-');// nakaglobal to, kailangan para sa SaveSubItem ng 'Min and Max' type
                                        array_min_max_judgement_per_sub_item.push('NA');
                                    }
                                    else
                                    {
                                        let min_max_difference = parseFloat(max_value_loop) - parseFloat(min_value_loop);

                                        if (min_max_difference <= min_max_range)
                                        {
                                            array_min_max_judgement_per_sub_item.push('OK');
                                        }
                                        else if (min_max_difference > min_max_range)
                                        {
                                            array_min_max_judgement_per_sub_item.push('NG');
                                        }
                                        else
                                        {
                                            array_min_max_judgement_per_sub_item.push('OK');
                                        }
                                    }
                                }
                                else
                                {
                                    final_array_min_max_datas.push((parseFloat(min_value_loop) > 0) ? `+${parseFloat(min_value_loop)}`: parseFloat(min_value_loop));//

                                    let min_max_difference = parseFloat(max_value_loop) - parseFloat(min_value_loop);

                                    if (min_max_difference <= min_max_range)
                                    {
                                        array_min_max_judgement_per_sub_item.push('OK');
                                    }
                                    else if (min_max_difference > min_max_range)
                                    {
                                        array_min_max_judgement_per_sub_item.push('NG');
                                    }
                                    else
                                    {
                                        array_min_max_judgement_per_sub_item.push('OK');
                                    }
                                }
                            }
                            else
                            {
                                if (parseFloat(max_value_loop) > upper_limit) 
                                {
                                    array_min_max_judgement_per_sub_item.push('NG');
                                } 
                                else 
                                {
                                    if (parseFloat(max_value_loop) < lower_limit) 
                                    {
                                        array_min_max_judgement_per_sub_item.push('NG');
                                    } 
                                    else 
                                    {
                                        array_min_max_judgement_per_sub_item.push('OK');
                                    }
                                }
                                final_array_min_max_datas.push((parseFloat(max_value_loop) > 0) ? `+${parseFloat(max_value_loop)}`: parseFloat(max_value_loop));// nakaglobal to, kailangan para sa SaveSubItem ng 'Min and Max' type
                            }
                        }
                    }
                    else
                    {
                        if (type === 'Min and Max and Form Tolerance')
                        {
                            dash_count++;
                        }

                        final_array_min_max_datas.push('-');// nakaglobal to, kailangan para sa SaveSubItem ng 'Min and Max' type
                        array_min_max_judgement_per_sub_item.push('NA');
                    }

                    if (a_count === 5) 
                    {
                        if (array_min_max_judgement_per_sub_item.length !== 10) 
                        {
                            $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                            $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                        } 
                        else 
                        {   
                            //para sa MMF, para malaman kung ang isa sa min and max sa data ay naka dash or empty
                            if (dash_count > 0)
                            {
                                $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                                $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                            }
                            else
                            {
                                //pag lalagay ng sub item judgement
                                if ($.inArray('NG', array_min_max_judgement_per_sub_item) === - 1) 
                                {
                                    $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="badge badge-success subitem-visual-judgement">GOOD</span>`);
                                }
                                else
                                {
                                    $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="badge badge-danger subitem-visual-judgement">NG</span>`);
                                }

                                //para malaman ang checksheet item judgement
                                let array_overall_judgement = [];

                                for (let index = 1; index <= total_sub_no_count; index++) 
                                {
                                    array_overall_judgement.push($(`#td_item_no_${item_no}_sub_no_${index}_judgement span`).text());
                                }

                                if ($.inArray('NG', array_overall_judgement) === - 1) 
                                {
                                    $(`#td_item_no_${item_no}_judgement`).html('<span class="badge badge-success subitem-visual-judgement">GOOD</span>');
                                }
                                else
                                {
                                    $(`#td_item_no_${item_no}_judgement`).html('<span class="badge badge-danger subitem-visual-judgement">NG</span>');
                                }
                            }
                        }
                    }
                }
            } 
            else 
            {
                $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
            }
        }
    };

    this_evaluate.SaveSubItem = (type, item_no, sub_no, coordinates,visuals_min_max_datas) => {

        let sub_item_judgement  = $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement span`).text();
        let remarks             = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_edit_remarks`).val();
        let new_coordinates     = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_coordinates`).val();

        let split_item_remarks          = $(`#btn_item_no_${item_no}_hinsei`).attr('onclick').split(',');
        let split_split_item_remarks    = split_item_remarks[6].split(')');
        let item_remarks                = split_split_item_remarks[0].replace(/"|'/g, '');

        if (remarks !== '')
        {
            $(`#span_remarks_error_item_no_${item_no}_sub_no_${sub_no}`).remove();

            if (new_coordinates !== '') 
            {
                if (type === 'Min and Max and Form Tolerance')
                {
                    if (sub_item_judgement === 'N/A')
                    {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Item with no judgement has been found',
                            text: 'Please check your checksheet items or your checksheet data.',
                        })
                    }
                    else
                    {
                        EVALUATE.ValidateSaveSubItemMinMax(type, item_no, sub_no, coordinates,visuals_min_max_datas,sub_item_judgement,remarks,new_coordinates);
                    }
                }
                else if  (type === 'Min and Max')
                {
                    EVALUATE.ValidateSaveSubItemMinMax(type, item_no, sub_no, coordinates,visuals_min_max_datas,sub_item_judgement,remarks,new_coordinates);
                }
                else
                {
                    let visual_no       = 1;
                    let changes_count   = 0;

                    split_data = visuals_min_max_datas.split(',');
                    split_data.forEach((split_value) => 
                    {
                        let new_visual_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val();

                        (split_value != new_visual_value) ? changes_count++ : '';

                        if (visual_no === 5)
                        {
                            if (changes_count > 0)
                            {
                                EVALUATE.ProceedSaveSubItem(item_no, sub_no,new_coordinates,final_array_min_max_datas,type,item_remarks);
                            }
                            else
                            {
                                let td_sub_item_remarks = $(`#td_item_no_${item_no}_sub_no_${sub_no}_remarks`).html();

                                EVALUATE.CancelSubItem(type, item_no, sub_no, coordinates, visuals_min_max_datas,sub_item_judgement,(td_sub_item_remarks === '-') ? '' : td_sub_item_remarks);
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Edit Cancelled',
                                    text: 'There is no changes with the coordinates and visuals. Edit is cancelled.',
                                })
                            }
                        }

                        visual_no++;
                    });
                }
            }
        }
        else
        {
            $(`#span_remarks_error_${item_no}`).remove();
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_edit_remarks`).after(`<span id="span_remarks_error_item_no_${item_no}_sub_no_${sub_no}" class="span-error">Required</span>`)
        }
    };

    this_evaluate.ValidateSaveSubItemMinMax = (type, item_no, sub_no, coordinates,visuals_min_max_datas,sub_item_judgement,remarks,new_coordinates) => {

        let array_min_max_data  = [];
        let split_data          = visuals_min_max_datas.split(',');

        split_data.forEach((split_value) => {
            array_min_max_data.push(split_value);
        });

        let min_count       = 0;
        let max_count       = 1;
        let changes_count   = 0;
        
        //nilagyan ko nito gawa nung onclick na function na kapag naka dash ay buburahin yung dash sa textbox. kaso hindi gumagana yung onchange na function pagka ganon unless manual na burahin yung dash. nilagay ko to para pagka savesubitem lalgyan nalang ulit ng dash
        for (let a_count = 1; a_count <= 5; a_count++) 
        {
            let min_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${a_count}`).val();
            let max_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${a_count}`).val();

            if (min_value === '')
            {
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${a_count}`).val('-');
            }

            if (max_value === '')
            {
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${a_count}`).val('-');
            }

            //para malaman kung may changes ba sa coordinates or visuals
            if (min_value !== array_min_max_data[min_count])
            {
                changes_count++;
            }

            if (max_value !== array_min_max_data[max_count])
            {
                changes_count++;
            }

            min_count += 2;
            max_count += 2;

            if (a_count === 5)
            {
                if (changes_count > 0)
                {
                    //final_array_min_max_datas naka global to
                    EVALUATE.ProceedSaveSubItem(item_no, sub_no,new_coordinates,final_array_min_max_datas,type,remarks);
                }
                else
                {
                    EVALUATE.CancelSubItem(type, item_no, sub_no, coordinates, visuals_min_max_datas,sub_item_judgement,remarks);
                    Swal.fire({
                        icon: 'warning',
                        title: 'Edit Cancelled',
                        text: 'There is no changes with the coordinates and min max data. Edit is cancelled.',
                    })
                }
            }
        }
    };

    this_evaluate.ProceedSaveSubItem = (item_no, sub_no,new_coordinates,final_array_min_max_datas,type,remarks) => {

        Swal.fire($.extend(swal_options, {
            title: 'Are you sure you want to save?',
        })).then((result) => {
            if (result.value) 
            {
                $(`#accordion_igm`).LoadingOverlay('show');
                
                if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance')
                {
                    EVALUATE.SubitemCalculateOverallJudgement(item_no, sub_no,final_array_min_max_datas,type,remarks);
                }
                else
                {
                    EVALUATE.SubitemCalculateVisualJudgement(item_no, sub_no,new_coordinates,remarks);
                }
                
                $(`#accordion_igm`).LoadingOverlay('hide');
            }
        })
    }

    this_evaluate.CancelSubItem = (type, item_no, sub_no, coordinates, visual_min_max_datas, sub_item_judgement,remarks,item_judgment) => {

        let button = `<button type="button" id ="btn_edit_item_no_${item_no}_sub_no_${sub_no}" type ="button" class ="btn btn-success btn-block" onclick ="EVALUATE.EditSubItem('${type}',${item_no},${sub_no},'${coordinates}','${visual_min_max_datas}','${remarks}');"> <strong class ="strong-font"> <i class="ti-pencil-alt"></i> EDIT</strong></button>`;
        let visual_no = 1;

        let array_visual_min_max_data          = [];

        split_data = visual_min_max_datas.split(',');
        split_data.forEach((split_value) => {
            array_visual_min_max_data.push(split_value);
        });

        if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance')
        {
            let min_count = 0;
            let max_count = 1;

            for (let index = 1; index <= 5; index++) 
            {
                $(`#td_item_no_${item_no}_sub_no_${sub_no}_min_${index}`).html(IGM.ChecksheetDataInputData(type,array_visual_min_max_data,min_count));
                $(`#td_item_no_${item_no}_sub_no_${sub_no}_max_${index}`).html(IGM.ChecksheetDataInputData(type,array_visual_min_max_data,max_count));
                
                min_count += 2;
                max_count += 2;
            }
        }
        else
        {
            for (let index = 0; index < array_visual_min_max_data.length; index++) 
            {
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).prop('disabled',true);
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).removeAttr('readonly');
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).removeClass('input-pointer');

                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val(array_visual_min_max_data[index]);
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).attr('value',array_visual_min_max_data[index]);

                if (array_visual_min_max_data[index] === 'OK') 
                {
                    $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#27b968');
                } 
                else if (array_visual_min_max_data[index] === 'NG') 
                {
                    $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#d43333');
                } 
                else 
                {
                    $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#676767');
                }

                visual_no++;
            }
        }

        if (sub_item_judgement === 'NG')
        {
            $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html('<span class="badge badge-danger subitem-visual-judgement input_text_center">NG</span>');
        }
        else
        {
            $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html('<span class="badge badge-success subitem-visual-judgement input_text_center">GOOD</span>');
        }

        $(`#td_item_no_${item_no}_sub_no_${sub_no}_coordinates`).html(coordinates);
       
        $(`#td_item_no_${item_no}_sub_no_${sub_no}_edit`).html(button);

        $(`#td_item_no_1_judgement`).html((item_judgment === 'NG') ? '<span class="badge badge-danger subitem-visual-judgement">NG</span>' : '<span class="badge badge-success subitem-visual-judgement">GOOD</span>');
    };

    this_evaluate.SubitemCalculateOverallJudgement = (item_no, sub_no, array_data, type,remarks) => {

        //yung type sa (item_no, sub_no, array_data, type) ay gamit para sa pagsesave ng min max/minmax tolerenace na type
        // yung nasa trial_checksheet_igm.js na SubitemCalculateOverallJudgement ay iba dahil iba ang way nila ng pagkuha ng total_sub_no_count
        //pag lalagay ng item overall judgement based sa kung ilan ang sub item sa item no na to
        let trial_checksheet_id          = $(`#trial_checksheet_id`).val();
        let id                           = $(`#txt_hidden_item_no_${item_no}_id`).val();
        let coordinates                  = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_coordinates`).val();
        let tools                        = $(`#td_item_no_${item_no}_tools`).html();
        let specs                        = $(`#td_item_no_${item_no}_specs`).html();
        let upper_limit                  = $(`#td_item_no_${item_no}_upper_limit`).html();
        let lower_limit                  = $(`#td_item_no_${item_no}_lower_limit`).html();
        let item_type                    = $(`#txt_hidden_item_no_${item_no}_item_type`).val();
        let split_btn_hinsei_value       = $(`#btn_item_no_${item_no}_hinsei`).attr('onclick').split(',');
        let split_split_btn_hinsei_value = split_btn_hinsei_value[6].split(')');
        let item_remarks                 = split_split_btn_hinsei_value[0].replace(/"|'/g, '');
      
        let judgment_datas              = $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement span`).text()
        let total_sub_no_count          = $(`#txt_hidden_item_no_${item_no}_sub_no_count`).val();

        (remarks == null) ? new_remarks = '' : new_remarks = remarks;
        (specs !== '-') ? new_specs = specs : new_specs = '';

        if (upper_limit !== '-')
        {
            new_upper_limit     = parseFloat(upper_limit);
            //nilagyan ko ng ganto dahil pag ka "+0.6" ang nilagay na input, kusang inaalis yung positive sign kaso sa data nila galing trial ledger kasama yung "+" sign sa number kaya ayan
            (new_upper_limit > 0) ? new_upper_limit =  `+${new_upper_limit}` : '';
        }

        if (lower_limit !== '-')
        {
            new_lower_limit     = parseFloat(lower_limit);
            //nilagyan ko ng ganto dahil pag ka "+0.6" ang nilagay na input, kusang inaalis yung positive sign kaso sa data nila galing trial ledger kasama yung "+" sign sa number kaya ayan
            (new_lower_limit > 0) ? new_lower_limit =  `+${new_lower_limit}` : '';
        }


        let array_overall_judgement = [];

        //para malaman ang checksheet item judgement
        for (let index = 1; index <= total_sub_no_count; index++) 
        {
            array_overall_judgement.push($(`#td_item_no_${item_no}_sub_no_${index}_judgement span`).text());
        }

        if (array_overall_judgement.length === 0) 
        {
            $(`#td_item_no_${item_no}_judgement`).html('<span class="input_text_center">N/A</span>');
        } 
        else 
        {
            if (array_overall_judgement.length === 1) 
            {
                if (array_overall_judgement[0] === '') 
                {
                    $(`#td_item_no_${item_no}_judgement`).html('<span class="input_text_center">N/A</span>');
                } 
                else 
                {
                    if ($.inArray('NG', array_overall_judgement) === - 1) 
                    {
                        trial_checksheet_judgement = EVALUATE.GetTrialChecksheetJudgement();

                        if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
                        {
                            //auto judgement papunta sa DB para sa checksheet item
                            EVALUATE.ProceedOverallRejudgement(trial_checksheet_id,item_no,tools,type,specs,new_upper_limit,new_lower_limit,'GOOD',item_type,item_remarks,trial_checksheet_judgement,'edit');
                        }

                        //auto judgement papunta sa DB para sa checksheet data
                        EVALUATE.ProceedEditData(id, sub_no, coordinates,array_data,judgment_datas,new_remarks,'GOOD',trial_checksheet_judgement,type,item_no,'edit')
                        array_overall_judgement     = [];
                        final_array_min_max_datas   = [];

                    }
                    else
                    {
                        trial_checksheet_judgement = EVALUATE.GetTrialChecksheetJudgement();

                        if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
                        {
                            //auto judgement papunta sa DB para sa checksheet item
                            EVALUATE.ProceedOverallRejudgement(trial_checksheet_id,item_no,tools,type,specs,new_upper_limit,new_lower_limit,'NG',item_type,item_remarks,trial_checksheet_judgement,'edit');
                        }

                        //auto judgement papunta sa DB
                        EVALUATE.ProceedEditData(id, sub_no, coordinates,array_data,judgment_datas,new_remarks,'NG',trial_checksheet_judgement,type,item_no,'edit')
                        array_overall_judgement     = [];
                        final_array_min_max_datas   = [];
                    }
                }
            } 
            else 
            {
                if ($.inArray('NG', array_overall_judgement) === - 1) 
                {
                    trial_checksheet_judgement = EVALUATE.GetTrialChecksheetJudgement();

                    if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
                    {
                        //auto judgement papunta sa DB para sa checksheet item
                        EVALUATE.ProceedOverallRejudgement(trial_checksheet_id,item_no,tools,type,specs,new_upper_limit,new_lower_limit,'GOOD',item_type,item_remarks,trial_checksheet_judgement,'edit');
                    }

                    //auto judgement papunta sa DB
                    EVALUATE.ProceedEditData(id, sub_no, coordinates,array_data,judgment_datas,new_remarks,'GOOD',trial_checksheet_judgement,type,item_no,'edit')
                    array_overall_judgement     = [];
                    final_array_min_max_datas   = [];

                }
                else
                {
                    trial_checksheet_judgement = EVALUATE.GetTrialChecksheetJudgement();

                    if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
                    {
                        //auto judgement papunta sa DB para sa checksheet item
                        EVALUATE.ProceedOverallRejudgement(trial_checksheet_id,item_no,tools,type,specs,new_upper_limit,new_lower_limit,'NG',item_type,item_remarks,trial_checksheet_judgement,'edit');
                    }

                    //auto judgement papunta sa DB
                    EVALUATE.ProceedEditData(id, sub_no, coordinates,array_data,judgment_datas,new_remarks,'NG',trial_checksheet_judgement,type,item_no,'edit')
                    array_overall_judgement     = [];
                    final_array_min_max_datas   = [];
                }
            }
        }
    };

    this_evaluate.SubitemCalculateVisualJudgement = (item_no, sub_no,new_coordinates,remarks) => {

        let trial_checksheet_id = $(`#trial_checksheet_id`).val();
        let sub_no_count        = $(`#txt_hidden_item_no_${item_no}_sub_no_count`).val();
        let tools               = $(`#td_item_no_${item_no}_tools`).html();
        let type                = $(`#td_item_no_${item_no}_type`).html();
        let specs               = $(`#td_item_no_${item_no}_specs`).html();
        let upper_limit         = $(`#td_item_no_${item_no}_upper_limit`).html();
        let lower_limit         = $(`#td_item_no_${item_no}_lower_limit`).html();
        let item_type           = $(`#txt_hidden_item_no_${item_no}_item_type`).val();
        let sub_item_remarks    = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_edit_remarks`).val();
        let array_visuals       = [];

        let new_upper_limit     = null;
        let new_lower_limit     = null;
        let new_specs           = null;

        (specs !== '-') ? new_specs = specs : new_specs = '';

        if (upper_limit !== '-')
        {
            new_upper_limit     = parseFloat(upper_limit);
            //nilagyan ko ng ganto dahil pag ka "+0.6" ang nilagay na input, kusang inaalis yung positive sign kaso sa data nila galing trial ledger kasama yung "+" sign sa number kaya ayan
            (new_upper_limit > 0) ? new_upper_limit =  `+${new_upper_limit}` : '';
        }

        if (lower_limit !== '-')
        {
            new_lower_limit     = parseFloat(lower_limit);
            //nilagyan ko ng ganto dahil pag ka "+0.6" ang nilagay na input, kusang inaalis yung positive sign kaso sa data nila galing trial ledger kasama yung "+" sign sa number kaya ayan
            (new_lower_limit > 0) ? new_lower_limit =  `+${new_lower_limit}` : '';
        }

        //data ng visuals
        for (let index = 1; index <= 5; index++) 
        {
            array_visuals.push($(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${index}`).val());
        }

        $(`#td_item_no_${item_no}_sub_no_${sub_no}_remarks`).html(sub_item_remarks);//textarea to html

        EVALUATE.OverallRejudgement(item_no, sub_no, array_visuals, sub_no_count,trial_checksheet_id,tools,type,new_specs,new_upper_limit,new_lower_limit,item_type,remarks,'edit',new_coordinates)
    }

    this_evaluate.ProceedEditData = (checksheet_item_id,sub_number,coordinates,data,judgment_datas,remarks,judgment_items,judgment_checksheet,type,item_no,action) => {
        
        let trial_checksheet_id = $('#trial_checksheet_id').val();

        $.ajax({
            url         : `edit-data`,
            type        : 'patch',
            dataType    : 'json',
            cache       : false,
            data        : 
            {
                _token: _TOKEN,
                trial_checksheet_id : trial_checksheet_id,
                checksheet_item_id  : checksheet_item_id,
                sub_number          : sub_number,
                coordinates         : coordinates,
                data                : data.toString(),
                judgment_datas      : judgment_datas,
                remarks             : remarks,
                judgment_items      : judgment_items,
                judgment_checksheet : judgment_checksheet,
            },
            success: result => 
            {
                if (result.status === 'Success')
                {
                    if (action === 'edit')
                    {
                        let button = `<button type="button" id ="btn_edit_item_no_${item_no}_sub_no_${sub_number}" type ="button" class ="btn btn-success btn-block" onclick ="EVALUATE.EditSubItem('${type}',${item_no},${sub_number},'${coordinates}','${data}','${remarks}');"> <strong class ="strong-font"> <i class="ti-pencil-alt"></i> EDIT</strong></button>`;

                        if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance')
                        {
                            let min_count = 0;
                            let max_count = 1;

                            for (let index = 1; index <= 5; index++) 
                            {
                                $(`#td_item_no_${item_no}_sub_no_${sub_number}_min_${index}`).html(IGM.ChecksheetDataInputData(type,data,min_count));
                                $(`#td_item_no_${item_no}_sub_no_${sub_number}_max_${index}`).html(IGM.ChecksheetDataInputData(type,data ,max_count));
                                
                                min_count += 2;
                                max_count += 2;
                            }
                        }
                        else
                        {
                            let visual_no = 1;

                            for (let index = 0; index < data.length; index++) 
                            {
                                $(`#txt_item_no_${item_no}_sub_no_${sub_number}_visual_${visual_no}`).prop('disabled',true);
                                $(`#txt_item_no_${item_no}_sub_no_${sub_number}_visual_${visual_no}`).removeAttr('readonly');
                                $(`#txt_item_no_${item_no}_sub_no_${sub_number}_visual_${visual_no}`).removeClass('input-pointer');

                                visual_no++;
                            }
                        }

                        $(`#td_item_no_${item_no}_sub_no_${sub_number}_coordinates`).html(coordinates)
                        $(`#td_item_no_${item_no}_sub_no_${sub_number}_edit`).html(button);

                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Edit successful',
                        })
                    }

                    EVALUATE.LoadFinishedInspectionData();
                }
                else
                {
                    Swal.fire({
                        icon    : 'error',
                        title   : data.status,
                        text    : data.message,
                    })
                }

                $(`#accordion_igm`).LoadingOverlay('hide');
            }
        });
    };

    this_evaluate.GetTrialChecksheetJudgement = () => {

        let array_trial_checksheet_overall_judgement = [];

        for (let index = 1; index <= parseInt(checksheet_item_count); index++) 
        {
            array_trial_checksheet_overall_judgement.push($(`#td_item_no_${index}_judgement span`).text());
        } 
        //para malaman ang trial checksheet judgement
        ($.inArray('NG', array_trial_checksheet_overall_judgement) === - 1) ? final_judgment = 'GOOD' : final_judgment = 'NG';

        return final_judgment;
    }

    this_evaluate.ApproveData = (status) => {

        let item_no_count   = parseInt(checksheet_item_count);
        let decision        = 3;//naka default na 3 para to sa pag approve ulit ng disapproved inspection data
        
        if (status === 'finished')
        {
            //para malaman kung may pinili na attachment
            if (array_add_to_pdf.length === 0)
            {
                Swal.fire({
                    icon: 'warning',
                    title: 'No selected attachment',
                    text: 'Please select the attachment that you want to include in this inspection data',
                })
            }
            else
            {
                decision = 1;// para sa pag approve ng finished inspection data
                EVALUATE.ValidateApproval(item_no_count,decision)
            }
        }
        else
        {
            EVALUATE.ValidateApproval(item_no_count,decision)

        }
    };

    this_evaluate.ValidateApproval = (item_no_count,decision) => {

        let hinsei_count    = 0;
        let edit_count      = 0;

        //para malaman kung may unsaved na hinsei
        for (let index = 1; index <= item_no_count; index++) 
        {
            let hinsei_button   = $(`#btn_item_no_${index}_hinsei`).length;
            let sub_no_count    = $(`#txt_hidden_item_no_${index}_sub_no_count`).val();

            if (hinsei_button === 0)
            {
                hinsei_count++;
            }
            else
            {
                //para malaman kung may unsaved na inedit na data
                for (let b_index = 1; b_index <= sub_no_count; b_index++) 
                {
                    let edit_button = $(`#btn_edit_item_no_${index}_sub_no_${b_index}`).length;
    
                    if (edit_button === 0)
                    {
                        edit_count++;
                    }
                }
            }

            if (index === item_no_count)
            {
                //para malaman kung may unsaved na hinsei
                if (hinsei_count > 0)
                {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Unsaved hinsei',
                        text: 'Please save/cancel the hinsei before approving this inspection data.',
                    })
                }
                else
                {
                    //para malaman kung may unsaved na inedit na data
                    if (edit_count > 0)
                    {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Unsaved data',
                            text: 'Please save/cancel the checksheet data before approving this inspection data.',
                        })
                    }
                    else
                    {
                        EVALUATE.ProceedApproveData(decision);
                    }
                }
            }
            
        }
    };

    this_evaluate.ProceedApproveData = (decision) => {

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
                        decision            : decision,
                        action              : 1,
                        selected_file       : array_add_to_pdf.toString() // naka global to
                    },
                    cache   : false,
                    success: result => 
                    {
                        if (result.status === 'Success')
                        {
                            array_add_to_pdf            = [];
                            add_to_pdf_count            = 1;
                            attachment_count            = '';
                            array_type                  = [];
                            array_item_number           = [];
                            final_array_min_max_datas   = [];
                            checksheet_item_count       = '';
    
                            $('#modal_view_inspection_data').modal('hide');
    
                            EVALUATE.LoadFinishedInspectionData();
                            EVALUATE.LoadDisapprovedInspectionData();
    
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Approve successful',
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

    return this_evaluate;
})();

//SAVE HINSEI WALA PA PARA SA MMF