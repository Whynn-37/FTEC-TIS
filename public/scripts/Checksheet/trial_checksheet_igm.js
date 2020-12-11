$(document).ready(function () {

});


var sub_no_count = 0; // count kung ilan ang sub no
var item_no_count = ''; // count kung ilan ang item no
var new_item_no_count = 0; // count kung ilan ang new_item_no_count
var existing_sub_no_count_per_item;

const IGM = (() => {
    let this_igm = {};

    let array_item_tools = ['BF', 'BG', 'BM', 'CM', 'CMM', 'CS', 'DC', 'DG', 'DI', 'DM', 'DPG', 'DSM', 'EG', 'GB', 'GM', 'GT', 'HG', 'HS', 'HT', 'IR', 'JIG', 'K', 'LS', 'MJ', 'MM', 'MP', 'PG', 'PJ', 'PLG', 'PM', 'PPS', 'PR', 'PS', 'RG', 'RHT', 'RT', 'RW', 'SDC', 'SF', 'SG', 'SR', 'ST', 'TD', 'TG', 'TI', 'TM', 'VAM', 'VHT', 'VSL'];
    let array_item_type = ['Actual', 'Belt Fit', 'Gauge', 'Material Check', 'Min and Max', 'Min and Max and Form Tolerance', 'Material Thickness', 'Press Fit', 'Rivet A'];
    let array_overall_judgement = [];
    let array_load_igm_type = [];
    let array_load_igm_item_number = [];

    this_igm.ValidateLoadIGM = () => {

        Swal.fire(
            $.extend(swal_options, {
                title: `Do you want to load IGM?`,
            })
        ).then((result) => {
            if (result.value) {
                //if yes
                IGM.StoreIGM();
            } else {
                //if no
                $('#accordion_igm').LoadingOverlay('show');

                $('#btn_validate_load_igm').prop('hidden', true);
                $('#tbl_igm').prop('hidden', false);
                $('#tbody_tbl_igm').prop('hidden', false);

                item_no_count += 0;
                let tfoot_tbl_igm = `
				<tfoot id="tfoot_add_igm_item">
					<td colspan="9"> 
						<button id="btn_add_new_igm_item_no" type="button" class="btn btn-success btn-block" onclick="IGM.AddIgmItemNo('',${parseInt(item_no_count) + 1},0,0);"><strong class="strong-font"><i class="ti-plus"></i> ADD ITEM</strong></button>
					</td>
				</tfoot>
				`;
                $('#tbody_tbl_igm').after(tfoot_tbl_igm);
                $('#accordion_igm').LoadingOverlay('hide');
            }
        });
    };

    this_igm.StoreIGM = () => {
        $('#accordion_igm').LoadingOverlay('show');

        let trial_checksheet_id = $('#trial_checksheet_id').val();
        let part_number = $('#slc_part_number').val();
        let revision_number = $('#slc_revision_number').val();

        $.ajax({
            url: `store-igm`,
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {
                _token: _TOKEN,
                part_number: part_number,
                revision_number: revision_number,
                trial_checksheet_id: trial_checksheet_id,
            },
            success: data => {
                IGM.LoadIGM(trial_checksheet_id);
            }
        });
    };

    this_igm.LoadIGM = (trial_checksheet_id) => {
        $.ajax({
            url: `load-igm`,
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {
                trial_checksheet_id: trial_checksheet_id,
            },
            success: data => {
                $('#btn_validate_load_igm').prop('hidden', true);
                $('#tbl_igm').prop('hidden', false);
                $('#tbody_tbl_igm').prop('hidden', false);

                //pagkuha ng checksheet items
                IGM.GetChecksheetItems(data);

                //pagkuha ng max item number
                if (data.data.items.length > 0) {
                    let count = 1;
                    data.data.items.forEach((value) => {
                        //paglalagay ng item count
                        if (count === data.data.items.length) {
                            item_no_count += value.item_number;
                        }
                        count++;
                    });
                    // add item button , {{--IGM.AddIgmItemNo(type, current_item_no + 1, sub item count, added item no in between count)--}}
                    var tfoot_tbl_igm = `
                    <tfoot id="tfoot_add_igm_item">
                        <td colspan="9"> 
                            <button id="btn_add_new_igm_item_no" type="button" class="btn btn-success btn-block" onclick="IGM.AddIgmItemNo('',${parseInt(item_no_count) + 1},0,0,'new');"><strong class="strong-font"><i class="ti-plus"></i> ADD ITEM</strong></button>
                        </td>
                    </tfoot>
                    `;
                } else {
                    $('#btn_validate_load_igm').prop('hidden', false);
                    tfoot_tbl_igm = '';
                }

                $('#tbody_tbl_igm').after(tfoot_tbl_igm);
                $('#accordion_igm').LoadingOverlay('hide');
            }
        });
    };

    this_igm.GetChecksheetItems = (data) => {

        let array_item_tools_options = '';
        let array_item_type_options = '';
        let tr_new_item = '';

        for (let index = 0; index < array_item_tools.length; index++) {
            array_item_tools_options += `<option value="${array_item_tools[index]}"></option>`;
        }

        for (let index = 0; index < array_item_type.length; index++) {
            array_item_type_options += `<option value="${array_item_type[index]}">${array_item_type[index]}</option>`;
        }

        //pagkuha ng items
        // <a id="a_add_igm_item_no_${value.item_number}" class="dropdown-item" onclick="IGM.AddIgmItemNo('${value.type}',${value.item_number},1,0);" style="cursor: pointer"><i class="ti-plus"></i> ADD ITEM</a> add item to inalis muna kase baka hindi need
        data.data.items.forEach((value) => {
                
            (value.specification    === null) ? specs       = '-': specs        = value.specification;
            (value.upper_limit      === null) ? upper_limit = '-': upper_limit  = value.upper_limit;
            (value.lower_limit      === null) ? lower_limit = '-': lower_limit  = value.lower_limit;

            if (value.judgment === null || value.judgment === 'N/A')
            {
                var judgement = '<span>N/A</span>';
            } 
            else if (value.judgment === 'OK')
            {
                judgement = '<span class="badge badge-success subitem-visual-judgement">OK</span>';
            }
            else
            {
                judgement = '<span class="badge badge-danger subitem-visual-judgement">NG</span>';
            }
       
            tr_new_item += `${IGM.AddIgmItemNoHeader(value.item_number - 1,'th_new_igm_sub_column_dark')}
			<tr id="tr_item_no_${value.item_number}">
                <td>
			        <input type="text" id="txt_hidden_item_no_${value.item_number}" value="${value.id}" hidden>
					<div class="dropright">
						<span id="span_item_no_${value.item_number}_label">${value.item_number}</span>
						<button id="btn_validate_sub_no_count_${value.item_number}" class="dropdown-toggle button_dropdown" type="button" data-toggle="dropdown" style="margin-left: 20%;"  onclick="IGM.ValidateSubNoCount(1,${value.item_number});"></button>
						<div class="dropdown-menu">
							<a id="a_add_igm_item_no_${value.item_number}_sub_no" class="dropdown-item" onclick="IGM.AddIgmSubNo('${value.type}',${value.item_number},1,0);" style="cursor: pointer" hidden><i class="ti-plus"></i> ADD SUB ITEM</a>
							<a id="a_remove_igm_item_no_${value.item_number}" class="dropdown-item" onclick="IGM.RemoveIgmItemNo(${value.item_number},'existing');"><i class="ti-close"></i> REMOVE</a>
						</div>
					</div>
				</td> 
				<td>
					<input list="item_tools_list" id="slc_item_no_${value.item_number}_tools" type="text" class="form-control input_text_center" placeholder="Select tools" disabled>
					<datalist id="item_tools_list">
						${array_item_tools_options}
					</datalist>
				<td>
					<select id="slc_item_no_${value.item_number}_type" class="form-control" onchange="IGM.SelectItemType(${value.item_number},1);" disabled>
						<option value=""selected disabled>Select type</option>
						${array_item_type_options}
					</select>
				</td>
				<td>
					<input id="txt_item_no_${value.item_number}_specs" value="${specs}" type="text" class="form-control input_text_center" placeholder="Enter specification" disabled>
				</td>
				<td>
					<input id="txt_item_no_${value.item_number}_upper_limit" value="${upper_limit}" type="text" class="form-control input_text_center" placeholder="Enter upper limit" disabled onkeyup="IGM.ValidateItemNoUpperAndLowerLimit(${value.item_number});">
				</td>
				<td>
					<input id="txt_item_no_${value.item_number}_lower_limit" value="${lower_limit}" type="text" class="form-control input_text_center" placeholder="Enter lower limit" disabled onkeyup="IGM.ValidateItemNoUpperAndLowerLimit(${value.item_number});">
				</td>
				<td id="td_item_no_${value.item_number}_judgement" class="input_text_center" style="vertical-align: middle;">${judgement}</td>
            </tr>`;
        });

        //pag didisplay ng datatable
        $('#tbody_tbl_igm').html(tr_new_item);

        //pag fill ng data sa inputs
        data.data.items.forEach((value) => 
        {
            $(`#slc_item_no_${value.item_number}_tools`).val(value.tools);
            $(`#slc_item_no_${value.item_number}_type`).val(value.type);

            $(`#slc_item_no_${value.item_number}_tools`).attr('onchange',`IGM.SelectItemTools(${value.item_number},'${value.tools}');`);
            // if (value.type === 'Min and Max' || value.type === 'Min and Max and Form Tolerance') { INALIS KO MUNA PARA NAKA DISABLE LANG LAHAT PARA HINDI MABAGO
            //     $(`#txt_item_no_${value.item_number}_specs`).prop('disabled', false);
            //     $(`#txt_item_no_${value.item_number}_upper_limit`).prop('disabled', false);
            //     $(`#txt_item_no_${value.item_number}_lower_limit`).prop('disabled', false);

            // } else {
            //     $(`#txt_item_no_${value.item_number}_specs`).prop('disabled', true);
            //     $(`#txt_item_no_${value.item_number}_upper_limit`).prop('disabled', true);
            //     $(`#txt_item_no_${value.item_number}_lower_limit`).prop('disabled', true);
            // }
            //nilagay ko sa array para magamit sa paglalagay naman ng sub items nila 
            array_load_igm_type.push(value.type)
            array_load_igm_item_number.push(value.item_number)
        });

        //pagkuha ng checksheet datas
        IGM.GetChecksheetDatas('th_new_igm_sub_column_dark',data);

    };

    this_igm.GetChecksheetDatas = (bg_header = "th_new_igm_sub_column",data) => {

        let array_hidden_checksheet_data_id = [];
        let array_data                      = [];
        let array_judgement                 = [];
        let array_coordinates               = [];
        let existing_sub_no_count           = -1;//naka -1 para pag increment nya naka 0 para pag pasok sa add igm sub no function sa zero sya papasok 
        
        //pagkuha ng data id
        for (let a_index = 0; a_index < data.data.datas.length; a_index++) 
        {
            data.data.datas[a_index].forEach((value) => 
            {
                array_hidden_checksheet_data_id.push(value.id);
                array_judgement.push(value.judgment);
                array_coordinates.push(value.coordinates);
    
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
                IGM.AddIgmSubNo(array_load_igm_type[a_index], array_load_igm_item_number[a_index], existing_sub_no_count, 0, bg_header,array_hidden_checksheet_data_id[b_index],'select_item_type',array_data[b_index],array_judgement[a_index],array_coordinates[a_index]);
    
                // $(`#a_add_igm_item_no_${array_load_igm_item_number[a_index]}`).attr('onclick', `IGM.AddIgmItemNo('${array_load_igm_type[a_index]}',${array_load_igm_item_number[a_index]},1,0);`)
                // $(`#a_add_igm_item_no_${array_load_igm_item_number[a_index]}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${array_load_igm_type[a_index]}',${array_load_igm_item_number[a_index]},1,0);`)
                // $(`#slc_item_no_${array_load_igm_item_number[a_index]}_type`).attr('onchange', `IGM.SelectItemType(${array_load_igm_item_number[a_index]},1);`);
    
                $(`#a_add_igm_item_no_${array_load_igm_item_number[a_index]}_sub_no`).prop('hidden', false);
                $(`#th_igm_item_no_${array_load_igm_item_number[a_index]}_extra_column`).prop('hidden', false);
                //pag increment
                //nasa load igm yung paglalagay ng item count
            }

            array_hidden_checksheet_data_id = [];
            array_data                      = [];
            array_judgement                 = [];
            array_coordinates               = [];
            existing_sub_no_count           = -1;
        }
    };

    // PARA SA MANUAL NA PAG AADD
    this_igm.AddIgmItemNo = (type, previous_item_no, existing_sub_no_count, added_item_no_between_count, remove_status="existing") => {

        if ($('#tbl_new_igm').is(':hidden')) 
        {
            item_no_count++;
            // new_item_no_count++;
            if (remove_status === 'new')
            {
                new_item_no_count++;
            }
            $('#tbl_new_igm').prop('hidden', false);
            $('#tr_item_no_main_column').prop('hidden', false);
            tr_new_item = IGM.AddIgmItemNoInputs(type, '', previous_item_no,remove_status);
            $('#tbody_tbl_new_igm').html(tr_new_item);
            $('#tfoot_add_igm_item').prop('hidden', true);
            $('#th_new_igm_item_no_extra_column').attr('id', `th_igm_item_no_${item_no_count}_extra_column`);

        } 
        else 
        {
            if (existing_sub_no_count === 0) 
            {
                // kung yung aaddan ng item ay yung last item no
                if (previous_item_no === parseInt(item_no_count)) 
                {

                    item_no_count++;

                    tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no,remove_status);
                    $(`#tr_item_no_${previous_item_no}`).after(tr_new_item);
                    // new_item_no_count++;
                    if (remove_status === 'new')
                    {
                        new_item_no_count++;
                    }

                } 
                else 
                {

                    item_no_count++;

                    IGM.AddIgmItemNoInputsBetweenChangeId(type, previous_item_no, existing_sub_no_count, added_item_no_between_count,remove_status);

                    tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no, remove_status);
                    $(`#tr_item_no_${previous_item_no}`).after(tr_new_item);
                    // new_item_no_count++;
                    if (remove_status === 'new')
                    {
                        new_item_no_count++;
                    }
                }

            } 
            else 
            {
                if (previous_item_no === item_no_count) 
                {
                    item_no_count++;

                    if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
                    {
                        tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no,remove_status);
                        $(`#tr_item_no_${previous_item_no}_sub_no_max_${existing_sub_no_count}`).after(tr_new_item);
                    } 
                    else 
                    {
                        tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no,remove_status);
                        $(`#tr_item_no_${previous_item_no}_sub_no_${existing_sub_no_count}`).after(tr_new_item);
                    }

                    // new_item_no_count++;
                    if (remove_status === 'new')
                    {
                        new_item_no_count++;
                    }
                } 
                else 
                {
                    item_no_count++;

                    IGM.AddIgmItemNoInputsBetweenChangeId(type, previous_item_no, existing_sub_no_count, added_item_no_between_count,remove_status);

                    if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
                    {
                        tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no, remove_status);
                        $(`#tr_item_no_${previous_item_no}_sub_no_max_${existing_sub_no_count}`).after(tr_new_item);
                    } 
                    else 
                    {
                        tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no, remove_status);
                        $(`#tr_item_no_${previous_item_no}_sub_no_${existing_sub_no_count}`).after(tr_new_item);
                    }

                    // new_item_no_count++;
                    if (remove_status === 'new')
                    {
                        new_item_no_count++;
                    }
                }
            }
        }
    };

    this_igm.AddIgmItemNoHeader = (previous_item_no, bg_header = "th_new_igm_sub_column") => {
        let item_no_holder = parseInt(previous_item_no) + 1;

        let tr_new_item_header = `
		<tr class="text-white" id="tr_item_no_${item_no_holder}_column">
			<th width="8%" class="${bg_header}">ITEM NO</th>
			<th width="15%" class="${bg_header}">TOOLS</th>
			<th width="18%" class="${bg_header}">TYPE</th>
			<th width="10%" class="${bg_header}">SPECIFICATION</th>
			<th width="10%" class="${bg_header}">UPPER LIMIT</th>
			<th width="10%" class="${bg_header}">LOWER LIMIT</th>
			<th width="10%" class="${bg_header}">JUDGEMENT</th>
			<th width="10%" class="${bg_header}" id="th_igm_item_no_${item_no_holder}_extra_column" colspan="7" hidden></th>
		</tr>`;
        return tr_new_item_header;
    };

    this_igm.AddIgmItemNoInputs = (type, tr_new_item_header, previous_item_no,remove_status) => {

        // NOTE IGM.AddIgmItemNo('MC',${item_no_holder},0,0);
        //(type, current_item_no, sub item count, added item no in between count)
        let array_item_tools_options = '';
        let array_item_type_options = '';

        if (previous_item_no === item_no_count) {
            var item_no_holder = item_no_count;

        } else {
            item_no_holder = parseInt(previous_item_no) + 1;
        }

        let existing_sub_no_count_holder = 0;

        for (let index = 0; index < array_item_tools.length; index++) {
            array_item_tools_options += `<option value="${array_item_tools[index]}"></option>`;
        }

        for (let index = 0; index < array_item_type.length; index++) {
            array_item_type_options += `<option value="${array_item_type[index]}">${array_item_type[index]}</option>`;
        }

        let tr_new_item = `${tr_new_item_header}
            <tr id="tr_item_no_${item_no_holder}">
                <td>
                    <input type="text" id="txt_hidden_item_no_${item_no_holder}" hidden>
					<div class="dropright">
						<span id="span_item_no_${item_no_holder}_label">${item_no_holder}</span>
						<button id="btn_validate_sub_no_count_${item_no_holder}" class="dropdown-toggle button_dropdown" type="button" data-toggle="dropdown" style="margin-left: 20%;"  onclick="IGM.ValidateSubNoCount(${existing_sub_no_count_holder},${item_no_holder});"></button>
						<div class="dropdown-menu">
							<a id="a_add_igm_item_no_${item_no_holder}" class="dropdown-item" onclick="IGM.AddIgmItemNo('${type}',${item_no_holder},${existing_sub_no_count_holder},0,'${remove_status}');" style="cursor: pointer"><i class="ti-plus"></i> ADD ITEM</a>
							<a id="a_add_igm_item_no_${item_no_holder}_sub_no" class="dropdown-item" onclick="IGM.AddIgmSubNo('${type}',${item_no_holder},${existing_sub_no_count_holder},0);" style="cursor: pointer" hidden><i class="ti-plus"></i> ADD SUB ITEM</a>
							<a id="a_remove_igm_item_no_${item_no_holder}" class="dropdown-item" onclick="IGM.RemoveIgmItemNo(${item_no_holder},'${remove_status}');"><i class="ti-close"></i> REMOVE</a>
						</div>
					</div>
				</td> 
				<td>
					<input list="item_tools_list" id="slc_item_no_${item_no_holder}_tools" type="text" class="form-control input_text_center" placeholder="Select tools" onchange="IGM.SelectItemTools(${item_no_holder},'');">
					<datalist id="item_tools_list">
						${array_item_tools_options}
					</datalist>
				<td>
					<select id="slc_item_no_${item_no_holder}_type" class="form-control" onchange="IGM.SelectItemType(${item_no_holder},${existing_sub_no_count_holder});">
						<option value=""selected disabled>Select type</option>
						${array_item_type_options}
					</select>
				</td>
				<td>
					<input id="txt_item_no_${item_no_holder}_specs" type="number" class="form-control input_text_center" placeholder="Enter specs" disabled onkeyup="IGM.ValidateAddIgmItemNo(${item_no_holder});">
				</td>
				<td>
					<input id="txt_item_no_${item_no_holder}_upper_limit" type="number" class="form-control input_text_center" placeholder="Enter upper limit" disabled onkeyup="IGM.ValidateItemNoUpperAndLowerLimit(${item_no_holder});">
				</td>
				<td>
					<input id="txt_item_no_${item_no_holder}_lower_limit" type="number" class="form-control input_text_center" placeholder="Enter lower limit" disabled onkeyup="IGM.ValidateItemNoUpperAndLowerLimit(${item_no_holder});">
				</td>
				<td id="td_item_no_${item_no_holder}_judgement" class="input_text_center" style="vertical-align: middle;">N/A</td>
			</tr>`;

        return tr_new_item;

    };

    this_igm.SelectItemTools = (item_no) => {

        let tools                       = $(`#slc_item_no_${item_no}_tools`).val();
        let type                        = $(`#slc_item_no_${item_no}_type`).val();
        let hidden_item_no_id           = $(`#txt_hidden_item_no_${item_no}`).val();
        let split_type_onchange_value   = $(`#slc_item_no_${item_no}_type`).attr('onchange').split(',');
        let split_existing_sub_item     = split_type_onchange_value[1].split(')');
        let existing_sub_item_count     = split_existing_sub_item[0];

        $(`#slc_item_no_${item_no}_tools`).attr('onchange', `IGM.SelectItemTools(${item_no},'${tools}');`);

        //check if nasa array yung piniling tools
        if (array_item_tools.indexOf(tools) === -1) 
        {
            $(`#span_error_item_no_${item_no}_tools`).remove();
            $(`#slc_item_no_${item_no}_tools`).after(`<span id="span_error_item_no_${item_no}_tools" class="span-error">Invalid tools</span>`);

            //pag remove ng existing rows
            $(`#tr_item_no_${item_no}_sub_no_column`).remove();
            for (let index = 1; index <= existing_sub_item_count; index++) 
            {
                $(`#tr_item_no_${item_no}_sub_no_${index}`).remove();
            }
        } 
        else 
        {
            if (type === null) 
            {
                $(`#span_error_item_no_${item_no}_type`).remove();
                $(`#slc_item_no_${item_no}_type`).after(`<span id="span_error_item_no_${item_no}_type" class="span-error">Required</span>`);
            } 
            else 
            {
                if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
                {
                    $(`#span_error_item_no_${item_no}_tools`).remove();
                    
                    let specs       = $(`#txt_item_no_${item_no}_specs`).val();
                    let upper_limit = $(`#txt_item_no_${item_no}_upper_limit`).val();
                    let lower_limit = $(`#txt_item_no_${item_no}_lower_limit`).val();
   
                    //pag remove ng existing rows
                    // $(`#tr_item_no_${item_no}_sub_no_column`).remove();
                    // for (let index = 1; index <= existing_sub_item_count; index++) 
                    // {
                    //     $(`#tr_item_no_${item_no}_sub_no_${index}`).remove();
                    //     $(`#tr_item_no_${item_no}_sub_no_max_${index}`).remove();
                    // }
                    //pag insert sa DB ng item at data
                    IGM.ValidateAddIgmItemNo(item_no, 'th_new_igm_sub_column');
                } 
                else {
                    $(`#span_error_item_no_${item_no}_tools`).remove();
                    
                    //pag remove ng existing rows
                    // $(`#tr_item_no_${item_no}_sub_no_column`).remove();
                    // for (let index = 1; index <= existing_sub_item_count; index++) 
                    // {
                    //     $(`#tr_item_no_${item_no}_sub_no_${index}`).remove();
                    // }
                    //pag insert sa DB ng item at data
                    IGM.ValidateAddIgmItemNo(item_no, 'th_new_igm_sub_column');
                }
            }
        }
    };

    this_igm.SelectItemType = (item_no, existing_sub_no_count, bg_header = "th_new_igm_sub_column") => {

        let tools = $(`#slc_item_no_${item_no}_tools`).val();
        let type = $(`#slc_item_no_${item_no}_type`).val();

        $(`#span_error_item_no_${item_no}_type`).remove();

        if (tools !== '') 
        {
            if (array_item_tools.indexOf(tools) === -1) 
            {
                $(`#span_error_item_no_${item_no}_tools`).remove();
                $(`#slc_item_no_${item_no}_tools`).after(`<span id="span_error_item_no_${item_no}_tools" class="span-error">Invalid tools</span>`);
            } 
            else 
            {
                if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
                {
                    $(`#txt_item_no_${item_no}_specs`).prop('disabled', false);
                    $(`#txt_item_no_${item_no}_upper_limit`).prop('disabled', false);
                    $(`#txt_item_no_${item_no}_lower_limit`).prop('disabled', false);
                } 
                else 
                {
                    $(`#txt_item_no_${item_no}_specs`).prop('disabled', true);
                    $(`#txt_item_no_${item_no}_upper_limit`).prop('disabled', true);
                    $(`#txt_item_no_${item_no}_lower_limit`).prop('disabled', true);
                    $(`#txt_item_no_${item_no}_specs`).val('');
                    $(`#txt_item_no_${item_no}_upper_limit`).val('');
                    $(`#txt_item_no_${item_no}_lower_limit`).val('');
                }

                if (existing_sub_no_count === 1) 
                {
                    // if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
                    // {
                    //     // $(`#tr_item_no_${item_no}_sub_no_column`).remove();
                    //     // $(`#tr_item_no_${item_no}_sub_no_1`).remove();
                    //     //pag insert sa DB ng item at data
                    //     IGM.ValidateAddIgmItemNo(item_no, bg_header,'select_item_type');
                    // } 
                    // else 
                    // {
                    //     // $(`#tr_item_no_${item_no}_sub_no_column`).remove();
                    //     // $(`#tr_item_no_${item_no}_sub_no_min_1`).remove();
                    //     // $(`#tr_item_no_${item_no}_sub_no_max_1`).remove();
                    //     //pag insert sa DB ng item at data
                    //     IGM.ValidateAddIgmItemNo(item_no, bg_header,'select_item_type');

                    // }
                    IGM.ValidateAddIgmItemNo(item_no, bg_header,'select_item_type');

                    $(`#span_error_item_no_${item_no}_tools`).remove();
                    $(`#span_error_item_no_${item_no}_type`).remove();
                } 
                else 
                {
                    $(`#span_error_item_no_${item_no}_tools`).remove();
                    $(`#span_error_item_no_${item_no}_type`).remove();

                    //pag insert sa DB ng item at data
                    IGM.ValidateAddIgmItemNo(item_no, bg_header,'select_item_type');
                }
            }
        } 
        else 
        {
            $(`#span_error_item_no_${item_no}_tools`).remove();
            $(`#slc_item_no_${item_no}_tools`).after(`<span id="span_error_item_no_${item_no}_tools" class="span-error">Required</span>`);
        }

    };
    // pag insert ng item sa DB, dito narin gumagawa ng hidden checksheet_item_id
    this_igm.ValidateAddIgmItemNo = (item_no, bg_header,action) => {

        let trial_checksheet_id = $('#trial_checksheet_id').val();
        let id                  = $(`#txt_hidden_item_no_${item_no}`).val();
        let tools               = $(`#slc_item_no_${item_no}_tools`).val();
        let type                = $(`#slc_item_no_${item_no}_type`).val();
        let specification       = $(`#txt_item_no_${item_no}_specs`).val();
        let upper_limit         = $(`#txt_item_no_${item_no}_upper_limit`).val();
        let lower_limit         = $(`#txt_item_no_${item_no}_lower_limit`).val();
        
        if (action === 'select_item_type')
        {   
            //pag update or create ng checksheet item
            IGM.ProceedAddIgmItemNo(id,trial_checksheet_id,item_no,tools,type,specification,upper_limit,lower_limit,bg_header,action);
        }
        else
        {
            if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance')
            {
                if (specification !== '' && upper_limit !== '' && lower_limit !== '')
                {
                    let new_upper_limit = parseFloat(upper_limit);
                    let new_lower_limit = parseFloat(lower_limit);

                    //nilagyan ko ng ganto dahil pag ka "+0.6" ang nilagay na input, kusang inaalis yung positive sign kaso sa data nila galing trial ledger kasama yung "+" sign sa number kaya ayan
                    if (parseFloat(upper_limit) > 0)
                    {
                        new_upper_limit =  `+${parseFloat(upper_limit)}`;
                    }
                    
                    if (parseFloat(lower_limit) > 0)
                    {
                        new_lower_limit =  `+${parseFloat(lower_limit)}`;
                    }

                    $(`#accordion_igm`).LoadingOverlay('hide');
                    //pag update or create ng checksheet item
                    IGM.ProceedAddIgmItemNo(id,trial_checksheet_id,item_no,tools,type,specification,new_upper_limit,new_lower_limit,bg_header,action);
                }
            }
            else
            {
                IGM.ProceedAddIgmItemNo(id,trial_checksheet_id,item_no,tools,type,specification,upper_limit,lower_limit,bg_header,'select_item_type');
            }
        }
    };

    this_igm.ProceedAddIgmItemNo = (id,trial_checksheet_id,item_no,tools,type,specification,upper_limit,lower_limit,bg_header,action) =>{

        let split_existing_sub_no_count = $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick').split(',');
        let existing_sub_no_count = split_existing_sub_no_count[2];
        
        let split_add_igm_item_no = $(`#a_add_igm_item_no_${item_no}`).attr('onclick').split(',');
        let split_remove_status = split_add_igm_item_no[4].split(')');
        let remove_status = split_remove_status[0];

        $(`#accordion_igm`).LoadingOverlay('show');

        $.ajax({
            url     : `store-items`,
            type    : 'post',
            dataType: 'json',
            cache   : false,
            data    : {
                _token              : _TOKEN,
                id                  : id,
                trial_checksheet_id : trial_checksheet_id,
                item_number         : item_no,
                tools               : tools,
                type                : type,
                specification       : specification,
                upper_limit         : upper_limit,
                lower_limit         : lower_limit,
            },
            success: data => {
                //meron nito para malaman kung sa select type ang function. ginagamit din kase tong ProceedAddIgmItemNo() function para sa pag uupdate ng specs , upper and lower limit. kaya nilagyan ko ng action para hindi gagawin ang ang mga process na nasa baba. 
                if (action === 'select_item_type')
                {   
                    //para malaman kung may existing ng unang insert ng item at data
                    if (id === '')
                    {
                        //paglalagay ng hidden id sa checksheet item
                        $(`#txt_hidden_item_no_${item_no}`).val(data.data.checksheet_item_id)
                        //paglalagay ng sub item row
                        IGM.AddIgmSubNo(`${type}`, item_no, 0, 0, bg_header, data.data.checksheet_data_id,action,'','','',remove_status);
                        // adjustment ng onclick methods
                        

                        $(`#a_add_igm_item_no_${item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${item_no},1,0,${remove_status});`)
                        $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${item_no},1,0);`)
                        $(`#slc_item_no_${item_no}_type`).attr('onchange', `IGM.SelectItemType(${item_no},1);`);

                        $(`#a_add_igm_item_no_${item_no}_sub_no`).prop('hidden', false);
                    } 
                    else
                    {
                        if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance')
                        {
                            $(`#accordion_igm`).LoadingOverlay('show');

                            //pag remove ng mga sub item based sa kung ilan
                            if ($(`#tr_item_no_${item_no}_sub_no_1`).length > 0)
                            {
                                $(`#tr_item_no_${item_no}_sub_no_column`).remove();

                                for (let index = 1; index <= existing_sub_no_count; index++) 
                                {
                                    //remove muna yung checksheet data sa DB
                                    IGM.ProceedRemoveSubNo(item_no, index);
                                    //pag remove ng tr
                                    $(`#tr_item_no_${item_no}_sub_no_${index}`).remove();
                                }
                            }

                            if ($(`#tr_item_no_${item_no}_sub_no_min_1`).length === 0 && $(`#tr_item_no_${item_no}_sub_no_max_1`).length === 0)
                            {
                                IGM.AddIgmSubNo(`${type}`, item_no, 0, 0, bg_header, data.data.checksheet_data_id,'','','','',remove_status);
                                // // adjustment ng onclick methods
                                // $(`#a_add_igm_item_no_${item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${item_no},1,0);`)
                                // $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${item_no},1,0);`)
                                // $(`#slc_item_no_${item_no}_type`).attr('onchange', `IGM.SelectItemType(${item_no},1);`);
                            }
                            $(`#accordion_igm`).LoadingOverlay('hide');
                        }
                        else
                        {
                            $(`#accordion_igm`).LoadingOverlay('show');

                            //pag remove ng mga sub item based sa kung ilan
                            if ($(`#tr_item_no_${item_no}_sub_no_min_1`).length > 0 && $(`#tr_item_no_${item_no}_sub_no_max_1`).length > 0)
                            {   
                                $(`#tr_item_no_${item_no}_sub_no_column`).remove();

                                for (let index = 1; index <= existing_sub_no_count; index++) 
                                {
                                    //remove muna yung checksheet data sa DB
                                    IGM.ProceedRemoveSubNo(item_no, index);
                                    //pag remove ng tr
                                    $(`#tr_item_no_${item_no}_sub_no_min_${index}`).remove();
                                    $(`#tr_item_no_${item_no}_sub_no_max_${index}`).remove();
                                } 
                            }

                            if ($(`#tr_item_no_${item_no}_sub_no_1`).length === 0)
                            {
                                IGM.AddIgmSubNo(`${type}`, item_no, 0, 0, bg_header, data.data.checksheet_data_id);
                                // adjustment ng onclick methods
                                $(`#a_add_igm_item_no_${item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${item_no},1,0);`)
                                $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${item_no},1,0);`)
                                $(`#slc_item_no_${item_no}_type`).attr('onchange', `IGM.SelectItemType(${item_no},1);`);
                            }

                            $(`#accordion_igm`).LoadingOverlay('hide');
                        }
                    }
                }
                $(`#accordion_igm`).LoadingOverlay('hide');
            }
        });
    };

    this_igm.AddIgmItemNoInputsBetweenChangeId = (type, previous_item_no, existing_sub_no_count, added_item_no_between_count,remove_status) => {

        var added_item_no_between_count_holder = added_item_no_between_count;
        var added_item_no_between_count_increment = parseInt(added_item_no_between_count) + 1;
        added_item_no_between_count_holder++;

        // PAG AADJUST NG added_item_no_between_count IDEBUG BAKA MALI MALI ANG PAG CCHANGE
        let item_no_counter = parseInt(item_no_count) - 1;

        for (let count = previous_item_no; count < item_no_counter; count++) {
            if (count === previous_item_no) {
                var next_item_no_holder = parseInt(previous_item_no) + 2;
                var previous_item_no_holder = parseInt(previous_item_no) + 1;

                IGM.AddIgmItemNoInputsBetweenChangeIdIfStatement(type, existing_sub_no_count, previous_item_no_holder, next_item_no_holder,remove_status);
                $(`#a_add_igm_item_no_${previous_item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${previous_item_no},${existing_sub_no_count},${added_item_no_between_count_increment},'${remove_status}');`);

                $(`#a_add_igm_item_no_${previous_item_no}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${previous_item_no},${existing_sub_no_count},${added_item_no_between_count_increment});`);

                $(`#slc_item_no_${previous_item_no}_type`).attr('onchange', `IGM.SelectItemType(${previous_item_no},${existing_sub_no_count});`);

            } else {
                next_item_no_holder = parseInt(count) + 2;
                previous_item_no_holder = parseInt(count) + 1;
                
                IGM.AddIgmItemNoInputsBetweenChangeIdIfStatement(type, existing_sub_no_count, previous_item_no_holder, next_item_no_holder,remove_status);
                $(`#a_add_igm_item_no_${previous_item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${previous_item_no},${existing_sub_no_count},${added_item_no_between_count_increment},'${remove_status}');`);

                $(`#a_add_igm_item_no_${previous_item_no}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${previous_item_no},${existing_sub_no_count},${added_item_no_between_count_increment});`);

                $(`#slc_item_no_${previous_item_no}_type`).attr('onchange', `IGM.SelectItemType(${previous_item_no},${existing_sub_no_count});`);

            }
            if (count === item_no_counter - 1) {
                IGM.AddIgmItemNoInputsBetweenChangeTemporaryIdToOriginalId(type, previous_item_no, existing_sub_no_count, added_item_no_between_count);
                IGM.AddIgmItemNoInputsBetweenChangeSubNoTemporaryIdToOriginalId(type, previous_item_no, 'add');
            }
        }
    };

    this_igm.AddIgmItemNoInputsBetweenChangeIdIfStatement = (type, existing_sub_no_count, previous_item_no_holder, next_item_no_holder,remove_status) => {

        let add_igm_item_no_onclick_value       = $(`#a_add_igm_item_no_${previous_item_no_holder}`).attr('onclick');
        let add_igm_sub_no_onclick_value        = $(`#a_add_igm_item_no_${previous_item_no_holder}_sub_no`).attr('onclick');
        let validate_sub_no_count_onclick_value = $(`#btn_validate_sub_no_count_${previous_item_no_holder}`).attr('onclick');

        let split_add_igm_item_no_onclick_value = add_igm_item_no_onclick_value.split(',');
        let added_item_no_in_between_count      = split_add_igm_item_no_onclick_value[3].split(')');
        let split_add_igm_sub_no_onclick_value  = add_igm_sub_no_onclick_value.split(',');

        let split_validate_sub_no_count_onclick_value       = validate_sub_no_count_onclick_value.split(',');
        let validate_sub_no_count_existing_sub_count_value  = split_validate_sub_no_count_onclick_value[0].split('(');

        let new_add_igm_item_no_onclick_value   = `${split_add_igm_item_no_onclick_value[0]},${next_item_no_holder},${split_add_igm_item_no_onclick_value[2]},${added_item_no_in_between_count[0]},${split_add_igm_item_no_onclick_value[4]}`;

        let new_add_igm_sub_no_onclick_value    = `${split_add_igm_sub_no_onclick_value[0]},${next_item_no_holder},${split_add_igm_sub_no_onclick_value[2]},${split_add_igm_sub_no_onclick_value[3]}`;

        let new_validate_sub_no_count_onclick_value = `${validate_sub_no_count_existing_sub_count_value[0]}(${validate_sub_no_count_existing_sub_count_value[1]},${next_item_no_holder})`;

        $(`#th_igm_item_no_${previous_item_no_holder}_extra_column`).attr('id', `th_igm_item_no_${next_item_no_holder}_1_extra_column`);

        $(`#tr_item_no_${previous_item_no_holder}_column`).attr('id', `tr_item_no_${next_item_no_holder}_1_column`);
        
        $(`#tr_item_no_${previous_item_no_holder}_sub_no_column`).attr('id', `tr_item_no_${next_item_no_holder}_1_sub_no_column`);
        
        //item no label
        $(`#span_item_no_${previous_item_no_holder}_label`).text(`${next_item_no_holder}`);
        $(`#span_item_no_${previous_item_no_holder}_label`).attr('id', `span_item_no_${next_item_no_holder}_1_label`);

        //hidden item no checksheet_id
        $(`#txt_hidden_item_no_${previous_item_no_holder}`).attr('id', `txt_hidden_item_no_${next_item_no_holder}_1`);

        $(`#tr_item_no_${previous_item_no_holder}`).attr('id', `tr_item_no_${next_item_no_holder}_1`);
  
        //add item no
        $(`#a_add_igm_item_no_${previous_item_no_holder}`).attr('id', `a_add_igm_item_no_${next_item_no_holder}_1`);
        $(`#a_add_igm_item_no_${next_item_no_holder}_1`).attr('onclick', `${new_add_igm_item_no_onclick_value}`);

        //add sub no
        $(`#a_add_igm_item_no_${previous_item_no_holder}_sub_no`).attr('id', `a_add_igm_item_no_${next_item_no_holder}_1_sub_no`);
        $(`#a_add_igm_item_no_${next_item_no_holder}_1_sub_no`).attr('onclick', `${new_add_igm_sub_no_onclick_value}`);

        //select item type
        $(`#slc_item_no_${previous_item_no_holder}_type`).attr('id', `slc_item_no_${next_item_no_holder}_1_type`);
        $(`#slc_item_no_${next_item_no_holder}_1_type`).attr('onchange', `IGM.SelectItemType(${next_item_no_holder},${split_add_igm_item_no_onclick_value[2]});`);

        //select item tools
        let split_item_no_tools         = $(`#slc_item_no_${previous_item_no_holder}_tools`).attr('onchange').split(',');
        let split_split_item_no_tools   = split_item_no_tools[1].split(')');
        let item_tools = split_split_item_no_tools[0];
        $(`#slc_item_no_${previous_item_no_holder}_tools`).attr('id', `slc_item_no_${next_item_no_holder}_1_tools`);
        $(`#slc_item_no_${next_item_no_holder}_1_tools`).attr('onchange', `IGM.SelectItemTools(${next_item_no_holder},${item_tools});`);

        //item no inputs
        $(`#txt_item_no_${previous_item_no_holder}_specs`).attr('id', `txt_item_no_${next_item_no_holder}_1_specs`);
        //ValidateAddIgmItemNo
        $(`#txt_item_no_${next_item_no_holder}_1_specs`).attr('onkeyup', `IGM.ValidateAddIgmItemNo(${next_item_no_holder});`);

        $(`#txt_item_no_${previous_item_no_holder}_upper_limit`).attr('id', `txt_item_no_${next_item_no_holder}_1_upper_limit`);
        $(`#txt_item_no_${previous_item_no_holder}_lower_limit`).attr('id', `txt_item_no_${next_item_no_holder}_1_lower_limit`);
        $(`#td_item_no_${previous_item_no_holder}_judgement`).attr('id', `td_item_no_${next_item_no_holder}_1_judgement`);

        //remove item
        $(`#a_remove_igm_item_no_${previous_item_no_holder}`).attr('id', `a_remove_igm_item_no_${next_item_no_holder}_1`);

        let split_remove_item   = $(`#a_remove_igm_item_no_${next_item_no_holder}_1`).attr('onclick').split(',');
        let split_remove_status = split_remove_item[1].split(')')
        let new_remove_status   = split_remove_status[0]; 

        $(`#a_remove_igm_item_no_${next_item_no_holder}_1`).attr('onclick', `IGM.RemoveIgmItemNo(${next_item_no_holder},${new_remove_status});`);

        $(`#btn_validate_sub_no_count_${previous_item_no_holder}`).attr('id', `btn_validate_sub_no_count_${next_item_no_holder}_1`);
        $(`#btn_validate_sub_no_count_${next_item_no_holder}_1`).attr('onclick', `${new_validate_sub_no_count_onclick_value}`);

        IGM.AddIgmItemNoInputsBetweenChangeSubNoIdToTemporaryId(type, split_add_igm_item_no_onclick_value, previous_item_no_holder, next_item_no_holder);

    };

    this_igm.AddIgmItemNoInputsBetweenChangeTemporaryIdToOriginalId = (type, previous_item_no, existing_sub_no_count, added_item_no_between_count) => {

        next_item_no_holder = parseInt(previous_item_no) + 2;
        // added_item_no_between_count_holder = added_item_no_between_count + new_item_no_count;
        added_item_no_between_count_holder = parseInt(item_no_count) + new_item_no_count;// zero ang new item no count pagka hindi 'new' ang remove status, yung remove status ay ginagamit pagka nag yes sa kung gusto iload ang igm kaya merong 'existing' at 'new' na remove status para malaman kung itemnocount or newitemnocount ang babawasan

        for (let count = 1; count <= added_item_no_between_count_holder; count++) 
        {
            $(`#th_igm_item_no_${next_item_no_holder}_1_extra_column`).attr('id', `th_igm_item_no_${next_item_no_holder}_extra_column`);

            $(`#tr_item_no_${next_item_no_holder}_1_column`).attr('id', `tr_item_no_${next_item_no_holder}_column`);
            $(`#tr_item_no_${next_item_no_holder}_1_sub_no_column`).attr('id', `tr_item_no_${next_item_no_holder}_sub_no_column`);

            $(`#span_item_no_${next_item_no_holder}_1_label`).attr('id', `span_item_no_${next_item_no_holder}_label`);

            //hidden checksheet id
            $(`#txt_hidden_item_no_${next_item_no_holder}_1`).attr('id', `txt_hidden_item_no_${next_item_no_holder}`);

            $(`#tr_item_no_${next_item_no_holder}_1`).attr('id', `tr_item_no_${next_item_no_holder}`);

            $(`#a_add_igm_item_no_${next_item_no_holder}_1`).attr('id', `a_add_igm_item_no_${next_item_no_holder}`);
            // $(`#a_add_igm_item_no_${next_item_no_holder}_1_1`).attr('onclick', `IGM.AddIgmItemNo('${type}',${next_item_no_holder},0);`);

            $(`#a_add_igm_item_no_${next_item_no_holder}_1_sub_no`).attr('id', `a_add_igm_item_no_${next_item_no_holder}_sub_no`);
            // $(`#a_add_igm_item_no_${next_item_no_holder}_1_1_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${next_item_no_holder},${existing_sub_no_count},${added_item_no_between_count});`);
            $(`#slc_item_no_${next_item_no_holder}_1_type`).attr('id', `slc_item_no_${next_item_no_holder}_type`);

            // inputs
            $(`#slc_item_no_${next_item_no_holder}_1_tools`).attr('id', `slc_item_no_${next_item_no_holder}_tools`);
            $(`#slc_item_no_${next_item_no_holder}_1_type`).attr('id', `slc_item_no_${next_item_no_holder}_type`);
            $(`#txt_item_no_${next_item_no_holder}_1_specs`).attr('id', `txt_item_no_${next_item_no_holder}_specs`);
            $(`#txt_item_no_${next_item_no_holder}_1_upper_limit`).attr('id', `txt_item_no_${next_item_no_holder}_upper_limit`);
            $(`#txt_item_no_${next_item_no_holder}_1_lower_limit`).attr('id', `txt_item_no_${next_item_no_holder}_lower_limit`);
            $(`#td_item_no_${next_item_no_holder}_1_judgement`).attr('id', `td_item_no_${next_item_no_holder}_judgement`);

            //remove item
            $(`#a_remove_igm_item_no_${next_item_no_holder}_1`).attr('id', `a_remove_igm_item_no_${next_item_no_holder}`);
            // $(`#a_remove_igm_item_no_${next_item_no_holder}`).attr('onclick', `IGM.RemoveIgmItemNo(${next_item_no_holder});`);
            //validate sub no count
            $(`#btn_validate_sub_no_count_${next_item_no_holder}_1`).attr('id', `btn_validate_sub_no_count_${next_item_no_holder}`);

            next_item_no_holder++;
        }
    };

    this_igm.AddIgmItemNoInputsBetweenChangeSubNoIdToTemporaryId = (type, split_add_igm_item_no_onclick_value, previous_item_no_holder, next_item_no_holder) => {

        // PAG RERENAME NG REMOVE SUB NO ID BASED SA BAGONG ITEM NO
        let item_no_existing_sub_no_count = split_add_igm_item_no_onclick_value[2];
        let split_item_no_existing_sub_no_type = split_add_igm_item_no_onclick_value[0].split('(');

        let item_no_existing_sub_no_type = split_item_no_existing_sub_no_type[1].replace(/"|'/g, '');

        if (item_no_existing_sub_no_count > 0) 
        {

            if (item_no_existing_sub_no_count > 1) 
            {

                for (let remove_sub_no_count = 2; remove_sub_no_count <= item_no_existing_sub_no_count; remove_sub_no_count++) 
                {

                    let remove_sub_no_onclick_value = $(`#a_remove_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}`).attr('onclick')

                    let split_remove_sub_no_onclick_value = remove_sub_no_onclick_value.split(',');

                    let new_remove_sub_no_onclick_value = `${split_remove_sub_no_onclick_value[0]},${split_remove_sub_no_onclick_value[1]},${next_item_no_holder},${split_remove_sub_no_onclick_value[3]},${split_remove_sub_no_onclick_value[4]}`;
                    $(`#a_remove_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_1`).attr('onclick', `${new_remove_sub_no_onclick_value}`);

                    $(`#a_remove_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}`).attr('id', `a_remove_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_1`);

                }
            }

            for (let remove_sub_no_count = 1; remove_sub_no_count <= item_no_existing_sub_no_count; remove_sub_no_count++) 
            {

                // $(`#tr_item_no_${previous_item_no_holder}_sub_no_min_${remove_sub_no_count}`).attr('id', `tr_item_no_${next_item_no_holder}_sub_no_min_${remove_sub_no_count}_1`);
                
                $(`#th_tr_item_no_${previous_item_no_holder}_sub_no_column_rowspan`).attr('id', `th_tr_item_no_${next_item_no_holder}_sub_no_column_rowspan_1`);

                $(`#span_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_label`).text(`${remove_sub_no_count}`);
                $(`#span_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_label`).attr('id', `span_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_label_1`);

                $(`#txt_hidden_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}`).attr('id', `txt_hidden_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_1`);


                if (item_no_existing_sub_no_type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
                {

                    $(`#tr_item_no_${previous_item_no_holder}_sub_no_min_${remove_sub_no_count}`).attr('id', `tr_item_no_${next_item_no_holder}_sub_no_min_${remove_sub_no_count}_1`);
                    //coordinates
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_coordinates`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_coordinates_1`);

                    //min
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_min_1`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_min_1_1`);

                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_min_2`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_min_2_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_min_3`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_min_3_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_min_4`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_min_4_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_min_5`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_min_5_1`);
                    //judgement
                    $(`#td_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_judgement`).attr('id', `td_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_judgement_1`);
                    //max
                    $(`#tr_item_no_${previous_item_no_holder}_sub_no_max_${remove_sub_no_count}`).attr('id', `tr_item_no_${next_item_no_holder}_sub_no_max_${remove_sub_no_count}_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_max_1`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_max_1_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_max_2`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_max_2_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_max_3`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_max_3_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_max_4`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_max_4_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_max_5`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_max_5_1`);

                } 
                else 
                {

                    $(`#tr_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}`).attr('id', `tr_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_1`);
                    //coordinates
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_coordinates`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_coordinates_1`);
                    //data
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_visual_1`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_visual_1_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_visual_2`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_visual_2_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_visual_3`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_visual_3_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_visual_4`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_visual_4_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_visual_5`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_visual_5_1`);
                    $(`#td_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_judgement`).attr('id', `td_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_judgement_1`);
                }
            }
        }
    };

    this_igm.AddIgmItemNoInputsBetweenChangeSubNoTemporaryIdToOriginalId = (type, previous_item_no, action) => {
        if (action === 'add') {
            var new_item_no_counter = item_no_count;
            var count_value = parseInt(previous_item_no) + 2;
        } else {
            if (previous_item_no === 1) {
                new_item_no_counter = parseInt(item_no_count) - 1;
            } else {
                new_item_no_counter = parseInt(item_no_count);
            }
            count_value = parseInt(previous_item_no);
        }


        for (let a_count = count_value; a_count <= new_item_no_counter; a_count++) {

            if ($(`#a_add_igm_item_no_${a_count}`).length === 0)
            {
                // type, item_no_count, existing_sub_no_count, added_item_no_between_count
                //para sa pag niload ang igm from trial_ledger file. wala kase tayong add item no dito
                var split_add_igm_tem_no_onclick_value  = $(`#a_add_igm_item_no_${a_count}_sub_no`).attr('onclick').split(',');
            }
            else
            {
                let add_igm_tem_no_onclick_value        = $(`#a_add_igm_item_no_${a_count}`).attr('onclick');
                split_add_igm_tem_no_onclick_value      = add_igm_tem_no_onclick_value.split(',');
            }

            let existing_sub_no_count_value             = split_add_igm_tem_no_onclick_value[2];
            let split_item_no_existing_sub_no_type      = split_add_igm_tem_no_onclick_value[0].split('(');
            let item_no_existing_sub_no_type            = split_item_no_existing_sub_no_type[1].replace(/"|'/g, '');

            if (existing_sub_no_count_value > 0) 
            {
                for (let b_count = 1; b_count <= existing_sub_no_count_value; b_count++) 
                {
                    if (b_count > 1) 
                    {
                        $(`#a_remove_item_no_${a_count}_sub_no_${b_count}_1`).attr('id', `a_remove_item_no_${a_count}_sub_no_${b_count}`);
                    }

                    // $(`#tr_item_no_${a_count}_sub_no_${b_count}_1`).attr('id', `tr_item_no_${a_count}_sub_no_${b_count}`)

                    $(`#th_tr_item_no_${a_count}_sub_no_column_rowspan_1`).attr('id', `th_tr_item_no_${a_count}_sub_no_column_rowspan`)

                    $(`#span_item_no_${a_count}_sub_no_${b_count}_label_1`).attr('id', `span_item_no_${a_count}_sub_no_${b_count}_label`);

                    $(`#txt_hidden_item_no_${a_count}_sub_no_${b_count}_1`).attr('id', `txt_hidden_item_no_${a_count}_sub_no_${b_count}`);

                    if (item_no_existing_sub_no_type === 'Min and Max' || item_no_existing_sub_no_type === 'Min and Max and Form Tolerance') 
                    {
                        $(`#tr_item_no_${a_count}_sub_no_min_${b_count}_1`).attr('id', `tr_item_no_${a_count}_sub_no_min_${b_count}`);
                        //coordinates
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_coordinates_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_coordinates`);
                        //min
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_min_1_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_min_1`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_min_2_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_min_2`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_min_3_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_min_3`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_min_4_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_min_4`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_min_5_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_min_5`);
                        //judgement
                        $(`#td_item_no_${a_count}_sub_no_${b_count}_judgement_1`).attr('id', `td_item_no_${a_count}_sub_no_${b_count}_judgement`);
                        //max
                        $(`#tr_item_no_${a_count}_sub_no_max_${b_count}_1`).attr('id', `tr_item_no_${a_count}_sub_no_max_${b_count}`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_max_1_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_max_1`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_max_2_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_max_2`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_max_3_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_max_3`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_max_4_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_max_4`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_max_5_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_max_5`);

                        //pag adjust ng subitemselectvisual na function pag nag add item in between tapos may existing sub item sa sunod na item
                        for (let c_count = 1; c_count <= 5; c_count++) 
                        {
                            $(`#txt_item_no_${a_count}_sub_no_${b_count}_min_${c_count}`).attr('onkeyup', `IGM.SubItemGetMinMax(${a_count},${b_count},${c_count},'min');`);
                            $(`#txt_item_no_${a_count}_sub_no_${b_count}_max_${c_count}`).attr('onkeyup', `IGM.SubItemGetMinMax(${a_count},${b_count},${c_count},'max');`);
                        }

                    } 
                    else 
                    {
                        $(`#tr_item_no_${a_count}_sub_no_${b_count}_1`).attr('id', `tr_item_no_${a_count}_sub_no_${b_count}`);
                        //coordinates
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_coordinates_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_coordinates`);
                        //data
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_visual_1_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_visual_1`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_visual_2_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_visual_2`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_visual_3_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_visual_3`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_visual_4_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_visual_4`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_visual_5_1`).attr('id', `txt_item_no_${a_count}_sub_no_${b_count}_visual_5`);
                        $(`#td_item_no_${a_count}_sub_no_${b_count}_judgement_1`).attr('id', `td_item_no_${a_count}_sub_no_${b_count}_judgement`);

                        //pag adjust ng subitemselectvisual na function pag nag add item in between tapos may existing sub item sa sunod na item
                        for (let c_count = 1; c_count <= 5; c_count++) 
                        {
                            $(`#txt_item_no_${a_count}_sub_no_${b_count}_visual_${c_count}`).attr('onclick', `IGM.SubItemSelectVisual(${a_count},${b_count}, ${c_count});`);
                        }
                    }
                }
            }

        }
    };

    this_igm.ValidateSubNoCount = (existing_sub_no_count, item_no_holder) => {
        // naka comment muna baka biglang kailanganin ko
        // if (existing_sub_no_count === 0) {
        //     $(`#a_remove_igm_item_no_${item_no_holder}`).removeClass('disabled');
        //     $(`#a_remove_igm_item_no_${item_no_holder}`).css('color', ' black');
        //     $(`#a_remove_igm_item_no_${item_no_holder}`).css('cursor', ' pointer');
        //     $(`#a_remove_igm_item_no_${item_no_holder}`).attr('onclick', `IGM.RemoveIgmItemNo(${item_no_holder});`);
        // } else {
        //     $(`#a_remove_igm_item_no_${item_no_holder}`).addClass('disabled');
        //     $(`#a_remove_igm_item_no_${item_no_holder}`).removeAttr('onclick');
        //     $(`#a_remove_igm_item_no_${item_no_holder}`).css('cursor', ' context-menu');
        //     $(`#a_remove_igm_item_no_${item_no_holder}`).css('color', ' #c9cbcd');
        //     $(`#a_remove_igm_item_no_${item_no_holder}`).removeAttr('onclick');
        // }

        $(`#a_remove_igm_item_no_${item_no_holder}`).removeClass('disabled');
        $(`#a_remove_igm_item_no_${item_no_holder}`).css('color', ' black');
        $(`#a_remove_igm_item_no_${item_no_holder}`).css('cursor', ' pointer');
        // $(`#a_remove_igm_item_no_${item_no_holder}`).attr('onclick', `IGM.RemoveIgmItemNo(${item_no_holder});`);
    };

    this_igm.RemoveIgmItemNo = (item_no,remove_status) => {

        Swal.fire(
            $.extend(swal_options, {
                confirmButtonText: 'Yes',
                title: `Are you sure you want to remove the item?`,
            })
        ).then((result) => {
            if (result.value) {

                let id = $(`#txt_hidden_item_no_${item_no}`).val();
                let trial_checksheet_id = $('#trial_checksheet_id').val();
                let item_number = $(`#span_item_no_${item_no}_label`).text();

                if (id.length === 0) {
                    IGM.ProceedRemoveIgmItemNo(item_no,remove_status);
                    $(`#accordion_igm`).LoadingOverlay('hide');
                } else {
                    $(`#accordion_igm`).LoadingOverlay('show');

                    $.ajax({
                        url: `delete-item`,
                        type: 'delete',
                        dataType: 'json',
                        cache: false,
                        data: {
                            _token: _TOKEN,
                            id: id,
                            trial_checksheet_id: trial_checksheet_id,
                            item_number: item_number
                        },
                        success: data => {

                            IGM.ProceedRemoveIgmItemNo(item_no,remove_status);

                            $(`#accordion_igm`).LoadingOverlay('hide');
                        }
                    });
                }
            }
        });
    };

    this_igm.ProceedRemoveIgmItemNo = (item_no,remove_status) => {
        
        //para sa pag alis ng mga sub items
        if ($(`#a_add_igm_item_no_${item_no}`).length === 0)
        {
            //para sa pag niload ang igm from trial_ledger file. wala kase tayong add item no dito
            let split_add_item_no_onlick    = $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick').split(',');
            var existing_sub_no_count       = split_add_item_no_onlick[2]; 
        }
        else
        {
            //para sa hindi niload ang igm from trial_ledger file. may add item dito.
            let split_add_item_no_onlick    = $(`#a_add_igm_item_no_${item_no}`).attr('onclick').split(',');
            existing_sub_no_count           = split_add_item_no_onlick[2]; 
        }
        
        // pag remove ng sub item ng niremove na item
        $(`#tr_item_no_${item_no}_sub_no_column`).remove();
        for (let a_count = 1; a_count <= existing_sub_no_count; a_count++) 
        {
            $(`#tr_item_no_${item_no}_sub_no_${a_count}`).remove();
            $(`#tr_item_no_${item_no}_sub_no_min_${a_count}`).remove();
            $(`#tr_item_no_${item_no}_sub_no_max_${a_count}`).remove();
        }
       
        // if (new_item_no_count === 1) 
        if (item_no_count === 1) 
        {
            $(`#tr_item_no_${item_no}`).remove();
            $(`#tr_item_no_${item_no}_column`).remove();
            //para kung walang added na new item (kulay green na column)
            if (remove_status === 'existing')
            {
                $('#tfoot_add_igm_item').prop('hidden', false);
                $('#tbl_new_igm').prop('hidden', true);
            }
            else
            {
                $('#tr_item_no_main_column').prop('hidden', true);
                $('#tfoot_add_igm_item').prop('hidden', false);
                $('#tbl_new_igm').prop('hidden', true);
            }
            // new_item_no_count--;
            // item_no_count--;
            if (remove_status === 'existing')
            {
                item_no_count--;
            }
            else
            {
                new_item_no_count--;
                item_no_count--;
            }
        } 
        else 
        {
            //yung item_no === parseInt(item_no_count) + 1 ay para sa niload na igm tapos nag click ako sa add item button. sa mismong table walang add item.
            if (item_no === 1) 
            {
                if (remove_status === 'new')
                {
                    $(`#tr_item_no_${item_no}`).remove();
                    $('#tr_item_no_main_column').prop('hidden', true);

                    if (new_item_no_count === 0)
                    {
                        $('#tfoot_add_igm_item').prop('hidden', false);
                    }
                }
                else
                {
                    if (new_item_no_count === 0)
                    {
                        $('#tr_item_no_main_column').prop('hidden', true);
                    }
                }
                
                $(`#tr_item_no_${item_no}_column`).remove();
            } 
            else 
            {
                if (item_no === parseInt(item_no_count) + 1 || item_no === (parseInt(item_no_count) - new_item_no_count) + 1)
                {
                    $('#tr_item_no_main_column').prop('hidden', true);
                } 

                $(`#tr_item_no_${item_no}_column`).remove();
            }
            
            $(`#tr_item_no_${item_no}`).remove();

            //para sa pagpapalit ng id
            if (remove_status === 'existing')
            {
                IGM.ProceedRemoveIgmItemNoChangeId(item_no,remove_status);
            }
            else
            {
                if (new_item_no_count === 1)
                {
                    $(`#tr_item_no_${item_no}`).remove();
                    $('#tfoot_add_igm_item').prop('hidden', false);
                    $('#tbl_new_igm').prop('hidden', true);
                    // new_item_no_count--;
                    // item_no_count--;
                    if (remove_status === 'existing')
                    {
                        item_no_count--;
                    }
                    else
                    {
                        new_item_no_count--;
                        item_no_count--;
                    }
                }
                else
                {
                    if (item_no === item_no_count)
                    {
                        if (remove_status === 'existing')
                        {
                            item_no_count--;
                        }
                        else
                        {
                            new_item_no_count--;
                            item_no_count--;
                        }//check kung ok na pag remove sa huli ng inadd na new item no
                    }
                    else
                    {
                        IGM.ProceedRemoveIgmItemNoChangeId(item_no,remove_status);
                    }
                }
            }
        }
        //para kung wala ng bagong add na items (yung kulay green ang column) lalabas na yung add item button
        if (new_item_no_count === 0)
        {
            $('#btn_add_new_igm_item_no').attr('onclick', `IGM.AddIgmItemNo('',${parseInt(item_no_count) + 1},0,0,'new');`);
        }
    };

    this_igm.ProceedRemoveIgmItemNoChangeId = (item_no,remove_status) => {

        let if_has_sub_no_count = 0;

        if (item_no !== item_no_count) 
        {
            // PARA SA MGA NEXT MAIN ITEM NG NIREMOVE NA MAIN ITEM
            // for (let count = item_no; count < new_item_no_count; count++) 
            for (let count = item_no; count < item_no_count; count++) 
            {
                if (count === item_no) 
                {
                    var item_no_holder      = item_no;
                    var next_item_no_holder = item_no + 1;

                    //VALIDATE SUB NO COUNT
                    var btn_validate_sub_no_count_onclick_value             = $(`#btn_validate_sub_no_count_${next_item_no_holder}`).attr('onclick');
                    var split_btn_validate_sub_no_count_onclick_value       = btn_validate_sub_no_count_onclick_value.split('(');
                    var split_split_btn_validate_sub_no_count_onclick_value = split_btn_validate_sub_no_count_onclick_value[1].split(',');
                    var existing_sub_no_count_value                         = split_split_btn_validate_sub_no_count_onclick_value[0];
                    //ADD IGM ITEM NO
                    
                    // var a_add_igm_item_no_onclick_value = $(`#a_add_igm_item_no_${next_item_no_holder}`).attr('onclick');
                    // var split_a_add_igm_item_no_onclick_value = a_add_igm_item_no_onclick_value.split('(');
                    // var split_split_a_add_igm_item_no_onclick_value = split_a_add_igm_item_no_onclick_value[1].split(',');
                    // var type_value = split_split_a_add_igm_item_no_onclick_value[0];
                    // var split_split_split_a_add_igm_item_no_onclick_value = split_split_a_add_igm_item_no_onclick_value[3].split(')');
                    // var added_item_in_between_value = split_split_split_a_add_igm_item_no_onclick_value[0];
                    if ($(`#a_add_igm_item_no_${item_no}`).length === 0)
                    {
                        // type, item_no_count, existing_sub_no_count, added_item_no_between_count
                        //para sa pag niload ang igm from trial_ledger file. wala kase tayong add item no dito
                        var split_add_item_no_onlick            = $(`#a_add_igm_item_no_${next_item_no_holder}_sub_no`).attr('onclick').split(',');
                        var split_type_value                    = split_add_item_no_onlick[0].split('(');
                        var type_value                          = split_type_value[1];
                        var split_added_item_in_between_value   = split_add_item_no_onlick[3].split(')'); 
                        var added_item_in_between_value         = split_added_item_in_between_value[0]; 
                    }
                    else
                    {
                        //para sa hindi niload ang igm from trial_ledger file. may add item dito.
                        var a_add_igm_item_no_onclick_value                     = $(`#a_add_igm_item_no_${next_item_no_holder}`).attr('onclick');
                        split_add_item_no_onlick                                = $(`#a_add_igm_item_no_${next_item_no_holder}`).attr('onclick').split(',');
                        var split_a_add_igm_item_no_onclick_value               = a_add_igm_item_no_onclick_value.split('(');
                        var split_split_a_add_igm_item_no_onclick_value         = split_a_add_igm_item_no_onclick_value[1].split(',');
                        type_value                                              = split_split_a_add_igm_item_no_onclick_value[0];
                        
                        var split_split_split_a_add_igm_item_no_onclick_value   = split_split_a_add_igm_item_no_onclick_value[3].split(')');
                        added_item_in_between_value                             = split_split_split_a_add_igm_item_no_onclick_value[0];
                    }
                } 
                else 
                {
                    item_no_holder = count;
                    next_item_no_holder = count + 1;

                    btn_validate_sub_no_count_onclick_value             = $(`#btn_validate_sub_no_count_${next_item_no_holder}`).attr('onclick');
                    split_btn_validate_sub_no_count_onclick_value       = btn_validate_sub_no_count_onclick_value.split('(');
                    split_split_btn_validate_sub_no_count_onclick_value = split_btn_validate_sub_no_count_onclick_value[1].split(',');
                    existing_sub_no_count_value                         = split_split_btn_validate_sub_no_count_onclick_value[0];

                    // a_add_igm_item_no_onclick_value = $(`#a_add_igm_item_no_${next_item_no_holder}`).attr('onclick');
                    // split_a_add_igm_item_no_onclick_value = a_add_igm_item_no_onclick_value.split('(');
                    // split_split_a_add_igm_item_no_onclick_value = split_a_add_igm_item_no_onclick_value[1].split(',');
                    // type_value = split_split_a_add_igm_item_no_onclick_value[0];
                    // split_split_split_a_add_igm_item_no_onclick_value = split_split_a_add_igm_item_no_onclick_value[3].split(')');
                    // added_item_in_between_value = split_split_split_a_add_igm_item_no_onclick_value[0];

                    if ($(`#a_add_igm_item_no_${item_no}`).length === 0)
                    {
                        // type, item_no_count, existing_sub_no_count, added_item_no_between_count
                        //para sa pag niload ang igm from trial_ledger file. wala kase tayong add item no dito
                        var split_add_item_no_onlick            = $(`#a_add_igm_item_no_${next_item_no_holder}_sub_no`).attr('onclick').split(',');
                        var split_type_value                    = split_add_item_no_onlick[0].split('(');
                        var type_value                          = split_type_value[1];
                        var split_added_item_in_between_value   = split_add_item_no_onlick[3].split(')'); 
                        var added_item_in_between_value         = split_added_item_in_between_value[0];          
                    }
                    else
                    {
                        //para sa hindi niload ang igm from trial_ledger file. may add item dito.
                        var a_add_igm_item_no_onclick_value                     = $(`#a_add_igm_item_no_${next_item_no_holder}`).attr('onclick');
                        split_add_item_no_onlick                                = $(`#a_add_igm_item_no_${next_item_no_holder}`).attr('onclick').split(',');
                        var split_a_add_igm_item_no_onclick_value               = a_add_igm_item_no_onclick_value.split('(');
                        var split_split_a_add_igm_item_no_onclick_value         = split_a_add_igm_item_no_onclick_value[1].split(',');
                        type_value                                              = split_split_a_add_igm_item_no_onclick_value[0];
                        
                        var split_split_split_a_add_igm_item_no_onclick_value   = split_split_a_add_igm_item_no_onclick_value[3].split(')');
                        added_item_in_between_value                             = split_split_split_a_add_igm_item_no_onclick_value[0];
                    }
                }

                let split_remove_item   = $(`#a_remove_igm_item_no_${next_item_no_holder}`).attr('onclick').split(',');
                let split_remove_status = split_remove_item[1].split(')')
                let new_remove_status   = split_remove_status[0]; 

                //pagpapalit ng id
                $(`#tr_item_no_${next_item_no_holder}_column`).attr('id', `tr_item_no_${item_no_holder}_column`);
                $(`#th_igm_item_no_${next_item_no_holder}_extra_column`).attr('id', `th_igm_item_no_${item_no_holder}_extra_column`);
                $(`#tr_item_no_${next_item_no_holder}_sub_no_column`).attr('id', `tr_item_no_${item_no_holder}_sub_no_column`);

                $(`#tr_item_no_${next_item_no_holder}`).attr('id', `tr_item_no_${item_no_holder}`);
                //paglalagay ng bagong numbering sa label
                $(`#span_item_no_${next_item_no_holder}_label`).text(item_no_holder);
                $(`#span_item_no_${next_item_no_holder}_label`).attr('id', `span_item_no_${item_no_holder}_label`);

                $(`#txt_hidden_item_no_${next_item_no_holder}`).attr('id', `txt_hidden_item_no_${item_no_holder}`);
            
                //validate sub no count
                $(`#btn_validate_sub_no_count_${next_item_no_holder}`).attr('onclick', `IGM.ValidateSubNoCount(${existing_sub_no_count_value},${item_no_holder});`);
                $(`#btn_validate_sub_no_count_${next_item_no_holder}`).attr('id', `btn_validate_sub_no_count_${item_no_holder}`);
               
                //add igm item no
                $(`#a_add_igm_item_no_${next_item_no_holder}`).attr('onclick', `IGM.AddIgmItemNo(${type_value},${item_no_holder},${existing_sub_no_count_value},${added_item_in_between_value},${new_remove_status});`)
                $(`#a_add_igm_item_no_${next_item_no_holder}`).attr('id', `a_add_igm_item_no_${item_no_holder}`)
                
                // add igm sub no
                $(`#a_add_igm_item_no_${next_item_no_holder}_sub_no`).attr('onclick', `IGM.AddIgmSubNo(${type_value},${item_no_holder},${existing_sub_no_count_value},${added_item_in_between_value});`)
                $(`#a_add_igm_item_no_${next_item_no_holder}_sub_no`).attr('id', `a_add_igm_item_no_${item_no_holder}_sub_no`)

                //remove igm item no
                $(`#a_remove_igm_item_no_${next_item_no_holder}`).attr('onclick', `IGM.RemoveIgmItemNo(${item_no_holder},${new_remove_status});`)
                $(`#a_remove_igm_item_no_${next_item_no_holder}`).attr('id', `a_remove_igm_item_no_${item_no_holder}`)

                //inputs
                $(`#slc_item_no_${next_item_no_holder}_tools`).attr('id', `slc_item_no_${item_no_holder}_tools`);

                //select type
                $(`#slc_item_no_${next_item_no_holder}_type`).attr('id', `slc_item_no_${item_no_holder}_type`);
                $(`#slc_item_no_${item_no_holder}_type`).attr('onchange', `IGM.SelectItemType(${item_no_holder},${existing_sub_no_count_value})`);
                
                //select tools
                $(`#slc_item_no_${next_item_no_holder}_tools`).attr('id', `slc_item_no_${item_no_holder}_tools`);
              
                let split_select_tools = $(`#slc_item_no_${item_no_holder}_tools`).attr('onchange').split(',');
                let split_tools_value = split_select_tools[1].split(')');
                let tools_value = split_tools_value[0];
                $(`#slc_item_no_${item_no_holder}_tools`).attr('onchange', `IGM.SelectItemTools(${item_no_holder}, ${tools_value});`);
                
                //other inputs
                $(`#txt_item_no_${next_item_no_holder}_specs`).attr('id', `txt_item_no_${item_no_holder}_specs`);
                $(`#txt_item_no_${next_item_no_holder}_upper_limit`).attr('id', `txt_item_no_${item_no_holder}_upper_limit`);
                $(`#txt_item_no_${next_item_no_holder}_lower_limit`).attr('id', `txt_item_no_${item_no_holder}_lower_limit`);
                $(`#td_item_no_${next_item_no_holder}_judgement`).attr('id', `td_item_no_${item_no_holder}_judgement`);

                if (existing_sub_no_count_value > 0) 
                {
                    // IGM.AddIgmItemNoInputsBetweenChangeSubNoIdToTemporaryId(type_value, a_add_igm_item_no_onclick_value.split(','), next_item_no_holder, item_no_holder);
                    
                    IGM.AddIgmItemNoInputsBetweenChangeSubNoIdToTemporaryId(type_value, split_add_item_no_onlick, next_item_no_holder, item_no_holder);
                    // if (count === new_item_no_count - 1) 
                    // if (count === item_no_count - 1) 
                    // {
                    //     // IGM.AddIgmItemNoInputsBetweenChangeSubNoTemporaryIdToOriginalId(type_value, new_item_no_count - item_no_holder, 'remove');
                    //     IGM.AddIgmItemNoInputsBetweenChangeSubNoTemporaryIdToOriginalId(type_value, item_no_count - item_no_holder, 'remove');
                    // }

                    if_has_sub_no_count++;
                }
            }

            if (if_has_sub_no_count > 0)
            {
                // IGM.AddIgmItemNoInputsBetweenChangeSubNoTemporaryIdToOriginalId(type_value, new_item_no_count - item_no_holder, 'remove');
                IGM.AddIgmItemNoInputsBetweenChangeSubNoTemporaryIdToOriginalId(type_value, item_no_count - item_no_holder, 'remove');
            }

            if (remove_status === 'existing')
            {
                item_no_count--;
            }
            else
            {
                new_item_no_count--;
                item_no_count--;
            }
        } 
        else 
        {
            if (remove_status === 'existing')
            {
                item_no_count--;
            }
            else
            {
                new_item_no_count--;
                item_no_count--;
            }
        }
    };

    // SUB ITEM METHODS NA DITO
    this_igm.AddIgmSubNo = (type, item_no_count, existing_sub_no_count, added_item_no_between_count, bg_header, checksheet_data_id,action,array_data,judgement,coordinates,remove_status) => {

        let tr_sub_no_inputs = '';
        let tr_sub_no_column = '';
        let rowspan = $(`#th_tr_item_no_${item_no_count}_sub_no_column_rowspan`).attr('rowspan');

        if (existing_sub_no_count === 0) 
        {
            // AYUSIN ANG PAG SESET NG existing_sub_no_count_per_item NA MAKUKUHA PARIN SYA GLOBALLY
            existing_sub_no_count_per_item = 0;
            existing_sub_no_count_per_item = existing_sub_no_count;
            existing_sub_no_count_per_item++;

            $(`#a_add_igm_item_no_${item_no_count}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${item_no_count},${existing_sub_no_count_per_item},${added_item_no_between_count},${remove_status});`);
            $(`#a_add_igm_item_no_${item_no_count}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${item_no_count},${existing_sub_no_count_per_item},${added_item_no_between_count});`);
            $(`#btn_validate_sub_no_count_${item_no_count}`).attr('onclick', `IGM.ValidateSubNoCount(${existing_sub_no_count_per_item},${item_no_count})`);

            let next_number = parseInt(sub_no_count) + 1;

            if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
            {
                var rowspan_count = 3;
            } 
            else 
            {
                rowspan_count = 2;
            }

            tr_sub_no_column += IGM.AddIgmSubNoHeader(item_no_count, rowspan_count, bg_header);

            sub_no_count++;

            //meron nito para sa pagpapalit palit ng type if mm or mc para mag babago din ang sub item
            if (action !== 'select_item_type')
            {   
                // pag store ng data sa DB
                IGM.ProceedAddIgmSubNo(type, next_number, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, added_item_no_between_count, 3);
            }
            else
            {
                tr_sub_no_inputs += IGM.AddIgmSubNoInputs(type, next_number, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, added_item_no_between_count, checksheet_data_id,array_data,judgement,coordinates);

                $(`#th_igm_item_no_${item_no_count}_extra_column`).prop('hidden', false);
                $(`#tr_item_no_${item_no_count}`).after(tr_sub_no_inputs);

                // //para sa pag papalit ng kulay ng visuals data
                IGM.ChecksheetDataVisualsChangeColor(item_no_count,existing_sub_no_count_per_item,array_data);
            }
        } 
        else 
        {
            existing_sub_no_count_per_item = 0;
            //pag increment ng existing_sub_no_count
            existing_sub_no_count_per_item = existing_sub_no_count;
            existing_sub_no_count_per_item++;

            //pag uupdate ng onclick method values
            $(`#a_add_igm_item_no_${item_no_count}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${item_no_count},${existing_sub_no_count_per_item},${added_item_no_between_count},${remove_status});`);

            $(`#a_add_igm_item_no_${item_no_count}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${item_no_count},${existing_sub_no_count_per_item},${added_item_no_between_count});`);
            $(`#btn_validate_sub_no_count_${item_no_count}`).attr('onclick', `IGM.ValidateSubNoCount(${existing_sub_no_count_per_item},${item_no_count})`);

            let next_number = parseInt(sub_no_count) + 1;

            $(`#th_igm_item_no_${item_no_count}_extra_column`).prop('hidden', false);

            // naka global na sub_no_count;
            sub_no_count++;

            //meron nito para malaman kung mag didisplay ng new row sa table sabay add sa DB or mag didisplay lang ng row sa table
            if (action !== 'select_item_type')
            {   
                // pag store ng data sa DB, nandito nadin yung addigmsubnoinputs
                IGM.ProceedAddIgmSubNo(type, next_number, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, added_item_no_between_count, rowspan,array_data,judgement,coordinates);
            }
            else
            {
                //pag lalagay lang ng row sa table, walang pag add sa DB
                tr_sub_no_inputs += IGM.AddIgmSubNoInputs(type, next_number, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, added_item_no_between_count, checksheet_data_id,array_data,judgement,coordinates);
   
                $(`#tr_item_no_${item_no_count}_sub_no_${existing_sub_no_count_per_item - 1}`).after(tr_sub_no_inputs);
                $(`#th_tr_item_no_${item_no_count}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) + 1);

                //para sa pag papalit ng kulay ng visuals data
                IGM.ChecksheetDataVisualsChangeColor(item_no_count,existing_sub_no_count_per_item,array_data);
            }

            IGM.AddSubNoChangeRemoveSubNoOnClick(type, item_no_count, added_item_no_between_count, existing_sub_no_count_per_item);
        }
    };

    this_igm.AddIgmSubNoHeader = (item_no_count, rowspan_count, bg_header) => {
        let tr_sub_no_column = `
		<tr id="tr_item_no_${item_no_count}_sub_no_column">
			<th id="th_tr_item_no_${item_no_count}_sub_no_column_rowspan" rowspan="${rowspan_count}"></th>
			<th width="15%" class="${bg_header}">SUB NO</th>
			<th width="18%" class="${bg_header}">COORDINATES</th>
			<th width="30%" class="${bg_header}" colspan="5">DATA</th>
			<th width="10%" class="${bg_header}">JUDGEMENT</th>
		</tr>`;
        return tr_sub_no_column;
    };

    this_igm.AddIgmSubNoInputs = (type, next_number, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, added_item_no_between_count, checksheet_data_id,array_data,judgement,coordinates) => {
       
        let tr = '';
        let new_sub_no = existing_sub_no_count_per_item;
        let td_remove_sub_no_button = '';
        let margin_left = '';

        if (new_sub_no !== 1) {
            td_remove_sub_no_button += `<button class="dropdown-toggle button_dropdown" type="button" data-toggle="dropdown"></button>
            <div class="dropdown-menu">
                <a id="a_remove_item_no_${item_no_count}_sub_no_${new_sub_no}" class="dropdown-item" onclick="IGM.RemoveSubNo('${type}',${new_sub_no},${item_no_count},${added_item_no_between_count},${existing_sub_no_count_per_item});" style="cursor: pointer"><i class="ti-close"></i> REMOVE</a>
            </div>`;

            margin_left += 'margin-left:5%;';
        }
        //para coordinates if ganto mga values
        (coordinates == undefined || coordinates === null) ? new_coordinates = '' : new_coordinates = coordinates;

        if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') {
 
            tr += `${tr_sub_no_column}
            <tr id="tr_item_no_${item_no_count}_sub_no_min_${new_sub_no}" >
                <td style="vertical-align: middle;" rowspan="2">
                    <input type="text" id="txt_hidden_item_no_${item_no_count}_sub_no_${new_sub_no}" value="${checksheet_data_id}" hidden>
                    <div class="dropright">
                        <span id="span_item_no_${item_no_count}_sub_no_${new_sub_no}_label" style="margin-right: 20%; ${margin_left}">${new_sub_no}</span>
                        ${td_remove_sub_no_button}
                    </div>
                </td>
				<td style="vertical-align: middle;" rowspan="2">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_coordinates" type="text" class="form-control input_text_center" placeholder="Enter Coordinates" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},'','')" value="${new_coordinates}">
				</td>
				<td class="td_sub_no_input">
					<input  id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_min_1" type="number" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},1,'min')" title='min' value="${IGM.ChecksheetDataInputData(array_data,0)}">
				</td>
				<td class="td_sub_no_input">
					<input  id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_min_2" type="number" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},2,'min')" title='min' value="${IGM.ChecksheetDataInputData(array_data,2)}">
				</td>
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_min_3" type="number" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},3,'min')" title='min' value="${IGM.ChecksheetDataInputData(array_data,4)}">
				</td>
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_min_4" type="number" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},4,'min')" title='min' value="${IGM.ChecksheetDataInputData(array_data,6)}">
				</td>
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_min_5" type="number" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},5,'min')" title='min' value="${IGM.ChecksheetDataInputData(array_data,8)}">
				</td>
				<td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_judgement" style="vertical-align: middle;" rowspan="2" class="td_sub_no_input">${IGM.ChecksheetDataInputJudgement(judgement)}</td>
			</tr>
			<tr id="tr_item_no_${item_no_count}_sub_no_max_${new_sub_no}">
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_max_1" type="number" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},1,'max')" title='max' value="${IGM.ChecksheetDataInputData(array_data,1)}">
				</td>
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_max_2" type="number" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},2,'max')" title='max' value="${IGM.ChecksheetDataInputData(array_data,3)}">
				</td>
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_max_3" type="number" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},3,'max')" title='max' value="${IGM.ChecksheetDataInputData(array_data,5)}">
				</td>
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_max_4" type="number" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},4,'max')" title='max' value="${IGM.ChecksheetDataInputData(array_data,7)}">
				</td>
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_max_5" type="number" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},5,'max')" title='max' value="${IGM.ChecksheetDataInputData(array_data,9)}">
				</td>
			</tr>`;
        } 
        else 
        {
            tr += `${tr_sub_no_column}
            <tr id="tr_item_no_${item_no_count}_sub_no_${new_sub_no}">
                <td>
                    <input type="text" id="txt_hidden_item_no_${item_no_count}_sub_no_${new_sub_no}" value="${checksheet_data_id}" hidden>
                    <div class="dropright">
                        <span id="span_item_no_${item_no_count}_sub_no_${new_sub_no}_label"  style="margin-right: 20%; ${margin_left}">${new_sub_no}</span>
                        ${td_remove_sub_no_button}
                    </div>
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_coordinates" type="text" class="form-control input_text_center" placeholder="Enter Coordinates" autocomplete="off" value="${new_coordinates}" onkeyup="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no});">
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_1" type="text" class="form-control input_text_center input-pointer" placeholder="Click visual" onclick="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no},1);" readonly value="${IGM.ChecksheetDataInputData(array_data,0)}">
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_2" type="text" class="form-control input_text_center input-pointer" placeholder="Click visual" onclick="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no},2);" readonly value="${IGM.ChecksheetDataInputData(array_data,1)}">
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_3" type="text" class="form-control input_text_center input-pointer" placeholder="Click visual" onclick="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no},3);" readonly value="${IGM.ChecksheetDataInputData(array_data,2)}">
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_4" type="text" class="form-control input_text_center input-pointer" placeholder="Click visual" onclick="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no},4);" readonly value="${IGM.ChecksheetDataInputData(array_data,3)}">
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_5" type="text" class="form-control input_text_center input-pointer" placeholder="Click visual" onclick="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no},5);" readonly value="${IGM.ChecksheetDataInputData(array_data,4)}">
                </td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_judgement" style="vertical-align:middle;" >${IGM.ChecksheetDataInputJudgement(judgement)}</td>
            </tr`;
        }

        return tr;
    };

    this_igm.ProceedAddIgmSubNo = (type, next_number, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, added_item_no_between_count, rowspan,array_data,judgement,coordinates) => {

        let checksheet_item_id = $(`#txt_hidden_item_no_${item_no_count}`).val();
        let tr_sub_no_inputs = '';
        $(`#accordion_igm`).LoadingOverlay('show');

        $.ajax({
            url: `store-datas`,
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {
                _token: _TOKEN,
                checksheet_item_id: checksheet_item_id,
                sub_number: existing_sub_no_count_per_item
            },
            success: data => {

                let checksheet_data_id = data.data;
                //dito na pinasa yung bagong checksheet id
                tr_sub_no_inputs += IGM.AddIgmSubNoInputs(type, next_number, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, added_item_no_between_count, checksheet_data_id,array_data,judgement,coordinates);

                //para sa previous sub no
                let previous_sub_no = parseInt(existing_sub_no_count_per_item) - 1

                if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
                {
                    //may condtion na length para malaman kung may existing na row or wala
                    if ($(`#tr_item_no_${item_no_count}_sub_no_max_1`).length > 0)
                    {
                        $(`#tr_item_no_${item_no_count}_sub_no_max_${previous_sub_no}`).after(tr_sub_no_inputs);
                        $(`#th_tr_item_no_${item_no_count}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) + 2);
                    }
                    else
                    {
                        $(`#tr_item_no_${item_no_count}`).after(tr_sub_no_inputs);
                    }
                } 
                else 
                {
                    //may condtion na length para malaman kung may existing na row or wala
                    if ($(`#tr_item_no_${item_no_count}_sub_no_1`).length > 0)
                    {
                        $(`#tr_item_no_${item_no_count}_sub_no_${previous_sub_no}`).after(tr_sub_no_inputs);
                        $(`#th_tr_item_no_${item_no_count}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) + 1);
                    }
                    else
                    {
                        $(`#tr_item_no_${item_no_count}`).after(tr_sub_no_inputs);
                    }
                }
                // //para sa pag papalit ng kulay ng visuals data
                IGM.ChecksheetDataVisualsChangeColor(item_no_count,existing_sub_no_count_per_item,array_data);
                $(`#accordion_igm`).LoadingOverlay('hide');
            }
        });
    };

    this_igm.AddSubNoChangeRemoveSubNoOnClick = (type, item_no_count, added_item_no_between_count, existing_sub_no_count_per_item) => {

        for (let sub_no = 2; sub_no <= existing_sub_no_count_per_item; sub_no++) {
            $(`#a_remove_item_no_${item_no_count}_sub_no_${sub_no}`).attr('onclick', `IGM.RemoveSubNo('${type}',${sub_no},${item_no_count},${added_item_no_between_count},${existing_sub_no_count_per_item});`)
        }
    }

    this_igm.RemoveSubNo = (type, sub_no, item_no, added_item_no_between_count, existing_sub_no_count_per_item) => {

        $(`#accordion_igm`).LoadingOverlay('show');

        let rowspan                               = $(`#th_tr_item_no_${item_no}_sub_no_column_rowspan`).attr('rowspan');
        let existing_sub_no_count_per_item_holder = existing_sub_no_count_per_item - 1;
        let sub_no_hidden_id                      = $(`#txt_hidden_item_no_${item_no}_sub_no_${sub_no}`).val();
        let item_no_hidden_id                     = $(`#txt_hidden_item_no_${item_no}`).val();

        $(`#a_add_igm_item_no_${item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${item_no},${existing_sub_no_count_per_item_holder},${added_item_no_between_count});`);
        $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${item_no},${existing_sub_no_count_per_item_holder},${added_item_no_between_count});`);
        $(`#btn_validate_sub_no_count_${item_no}`).attr('onclick', `IGM.ValidateSubNoCount(${existing_sub_no_count_per_item_holder},${item_no})`);

        //if isa lang ang sub item sa item
        if (existing_sub_no_count_per_item === 1) 
        {
            $(`#td_item_no_${item_no}_judgement`).html('N/A');
            

            $(`#tr_item_no_${item_no}_sub_no_column`).remove();
            if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') {
                $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
                $(`#tr_item_no_${item_no}_sub_no_max_${sub_no}`).remove();
            } else {
                $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
            }
            $(`#th_igm_item_no_${item_no}_extra_column`).prop('hidden', true);

            //dito function
            // let new_item_judgement = IGM.RejudgementAfterRemoveSubNo(item_no);
            // IGM.ProceedRemoveSubNo(item_no_hidden_id,sub_no_hidden_id, sub_no,new_item_judgement);

            sub_no_count--;
        } 
        else 
        {
            if (existing_sub_no_count_per_item === sub_no) 
            {
                if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
                {
                    $(`#tr_item_no_${item_no}_sub_no_min_${sub_no}`).remove();
                    $(`#tr_item_no_${item_no}_sub_no_max_${sub_no}`).remove();
                    $(`#th_tr_item_no_${item_no}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) - 2);
                } 
                else 
                {
                    $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
                    $(`#th_tr_item_no_${item_no}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) - 1);
                }

                //dito function
                // let new_item_judgement = IGM.RejudgementAfterRemoveSubNo(item_no);
                // IGM.ProceedRemoveSubNo(item_no_hidden_id,sub_no_hidden_id, sub_no,new_item_judgement);

                sub_no_count--;
                // existing_sub_no_count_per_item--;

                // for (let sub_no = 1; sub_no <= existing_sub_no_count_per_item_holder; sub_no++) 
                // {
                //     $(`#a_remove_item_no_${item_no}_sub_no_${sub_no}`).attr('onclick', `IGM.RemoveSubNo('${type}',${sub_no},${item_no},${added_item_no_between_count},${existing_sub_no_count_per_item_holder});`)
                // } wala na to kase wala namang remove sa first sub item
            } 
            else 
            {
                if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
                {
                    $(`#tr_item_no_${item_no}_sub_no_min_${sub_no}`).remove();
                    $(`#tr_item_no_${item_no}_sub_no_max_${sub_no}`).remove();
                    $(`#th_tr_item_no_${item_no}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) - 2);
                } 
                else 
                {
                    $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
                    $(`#th_tr_item_no_${item_no}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) - 1);
                }

                //dito function
                // let new_item_judgement = IGM.RejudgementAfterRemoveSubNo(item_no);
                // IGM.ProceedRemoveSubNo(item_no_hidden_id,sub_no_hidden_id, sub_no,new_item_judgement);

                sub_no_count--; 
                // existing_sub_no_count_per_item--;

                let next_sub_no = parseInt(sub_no) + 1;

                // PARA SA MGA NEXT SUB ITEM NG NIREMOVE NA SUB ITEM
                for (let count = sub_no; count <= existing_sub_no_count_per_item; count++) 
                {
                    if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') 
                    {
                        IGM.RemoveSubNoChangeIdMMAndMMF(item_no, sub_no, count, type, next_sub_no, added_item_no_between_count, existing_sub_no_count_per_item_holder);
                    } 
                    else 
                    {
                        IGM.RemoveSubNoChangeIdMC(item_no, sub_no, count, type, next_sub_no, added_item_no_between_count, existing_sub_no_count_per_item_holder);
                    }
                }
                //PARA SA MGA PREVIOUS SUB ITEM NG NIREMOVE NA SUB ITEM
                if (sub_no > 1) 
                {
                    var remaining_previous_sub_item = sub_no - 1;
                    for (let count = 1; count <= remaining_previous_sub_item; count++) 
                    {
                        $(`#a_remove_item_no_${item_no}_sub_no_${count}`).attr('onclick', `IGM.RemoveSubNo('${type}',${count},${item_no},${added_item_no_between_count},${existing_sub_no_count_per_item_holder});`);
                    }
                }
            }
        }
        let new_item_judgement = IGM.RejudgementAfterRemoveSubNo(item_no);
        IGM.ProceedRemoveSubNo(item_no_hidden_id,sub_no_hidden_id, sub_no,new_item_judgement);
    };

    this_igm.ProceedRemoveSubNo = (item_no_hidden_id,sub_no_hidden_id, sub_no, new_item_judgement) => {

        $.ajax({    
            url         : `delete-data`,
            type        : 'delete',
            dataType    : 'json',
            cache       : false,
            data        : {
                _token              : _TOKEN,
                id                  : sub_no_hidden_id,
                checksheet_item_id  : item_no_hidden_id,
                sub_number          : sub_no,
                judgment            : new_item_judgement
            },
            success: result => 
            {
                $(`#accordion_igm`).LoadingOverlay('hide');
            }
        });
    };

    this_igm.RemoveSubNoChangeIdMC = (item_no, sub_no, count, type, next_sub_no, added_item_no_between_count, existing_sub_no_count_per_item) => {

        if (count === sub_no) {
            var sub_no_holder = sub_no;
            var next_sub_no_holder = next_sub_no;
        } else {
            sub_no_holder = count;
            next_sub_no_holder = parseInt(count) + 1;
        }

        $(`#tr_item_no_${item_no}_sub_no_${next_sub_no_holder}`).attr('id', `tr_item_no_${item_no}_sub_no_${sub_no_holder}`);
        $(`#span_item_no_${item_no}_sub_no_${next_sub_no_holder}_label`).text(sub_no_holder);
        $(`#span_item_no_${item_no}_sub_no_${next_sub_no_holder}_label`).attr('id', `span_item_no_${item_no}_sub_no_${sub_no_holder}_label`);
        //hidden sub item id
        $(`#txt_hidden_item_no_${item_no}_sub_no_${next_sub_no_holder}`).attr('id', `txt_hidden_item_no_${item_no}_sub_no_${sub_no_holder}`);

        //button
        $(`#a_remove_item_no_${item_no}_sub_no_${next_sub_no_holder}`).attr('onclick', `IGM.RemoveSubNo('${type}',${sub_no_holder},${item_no},${added_item_no_between_count},${existing_sub_no_count_per_item});`);
        $(`#a_remove_item_no_${item_no}_sub_no_${next_sub_no_holder}`).attr('id', `a_remove_item_no_${item_no}_sub_no_${sub_no_holder}`);
        //visuals
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_coordinates`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_coordinates`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_visual_1`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_visual_1`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_visual_2`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_visual_2`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_visual_3`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_visual_3`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_visual_4`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_visual_4`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_visual_5`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_visual_5`);
        //judgement
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_judgement`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_judgement`);

        for (let c_count = 1; c_count <= 5; c_count++) {
            $(`#txt_item_no_${item_no}_sub_no_${sub_no_holder}_visual_${c_count}`).attr('onclick', `IGM.SubItemSelectVisual(${item_no},${sub_no_holder},${c_count});`);
        }

    };

    this_igm.RemoveSubNoChangeIdMMAndMMF = (item_no, sub_no, count, type, next_sub_no, added_item_no_between_count, existing_sub_no_count_per_item) => {
        if (count === sub_no) {
            var sub_no_holder = sub_no;
            var next_sub_no_holder = next_sub_no;
        } else {
            var sub_no_holder = count;
            var next_sub_no_holder = parseInt(count) + 1;
        }

        $(`#tr_item_no_${item_no}_sub_no_min_${next_sub_no_holder}`).attr('id', `tr_item_no_${item_no}_sub_no_min_${sub_no_holder}`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_judgement`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_judgement`);
        $(`#span_item_no_${item_no}_sub_no_${next_sub_no_holder}_label`).text(sub_no_holder);
        $(`#span_item_no_${item_no}_sub_no_${next_sub_no_holder}_label`).attr('id', `span_item_no_${item_no}_sub_no_${sub_no_holder}_label`);
      
        //hidden sub item id
        $(`#txt_hidden_item_no_${item_no}_sub_no_${next_sub_no_holder}`).attr('id', `txt_hidden_item_no_${item_no}_sub_no_${sub_no_holder}`);

        //button
        $(`#a_remove_item_no_${item_no}_sub_no_${next_sub_no_holder}`).attr('onclick', `IGM.RemoveSubNo('${type}',${sub_no_holder},${item_no},${added_item_no_between_count},${existing_sub_no_count_per_item});`);
        $(`#a_remove_item_no_${item_no}_sub_no_${next_sub_no_holder}`).attr('id', `a_remove_item_no_${item_no}_sub_no_${sub_no_holder}`);
        //details
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_coordinates`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_coordinates`);

        //min
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_min_1`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_min_1`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_min_2`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_min_2`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_min_3`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_min_3`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_min_4`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_min_4`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_min_5`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_min_5`);
        //max
        $(`#tr_item_no_${item_no}_sub_no_max_${next_sub_no_holder}`).attr('id', `tr_item_no_${item_no}_sub_no_max_${sub_no_holder}`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_max_1`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_max_1`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_max_2`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_max_2`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_max_3`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_max_3`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_max_4`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_max_4`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_max_5`).attr('id', `txt_item_no_${item_no}_sub_no_${sub_no_holder}_max_5`);

        for (let c_count = 1; c_count <= 5; c_count++) {
            $(`#txt_item_no_${item_no}_sub_no_${sub_no_holder}_min_${c_count}`).attr('onkeyup', `IGM.SubItemGetMinMax(${item_no},${sub_no_holder},${c_count},'min');`);
            $(`#txt_item_no_${item_no}_sub_no_${sub_no_holder}_max_${c_count}`).attr('onkeyup', `IGM.SubItemGetMinMax(${item_no},${sub_no_holder},${c_count},'max');`);
        }
    };

    this_igm.SubItemSelectVisual = (item_no, sub_no, visual_no) => {
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
            IGM.SubitemCalculateVisualJudgement(item_no, sub_no);
        }
        else
        {
            $(`#span_error_coordinates_item_no_${item_no}_sub_no_${sub_no}`).remove();
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_coordinates`).after(`<span id="span_error_coordinates_item_no_${item_no}_sub_no_${sub_no}" class="span-error">Required</span>`);
        }
    };

    this_igm.SubitemCalculateVisualJudgement = (item_no, sub_no) => {

        let visual_no_5 = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_5`).val();
        let array_visuals = [];
        let visuals_NG_count = 0;

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
                $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html('<span class="badge badge-success subitem-visual-judgement">OK</span>');
            }

            IGM.SubitemCalculateOverallJudgement(item_no, sub_no, array_visuals);
        }
    }

    this_igm.ValidateItemNoUpperAndLowerLimit = (item_no) => {

        let upper_limit = $(`#txt_item_no_${item_no}_upper_limit`).val();
        let lower_limit = $(`#txt_item_no_${item_no}_lower_limit`).val();
        let specs = $(`#txt_item_no_${item_no}_specs`).val();

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
                if (parseFloat(lower_limit) > parseFloat(upper_limit)) {
                    $(`#span_lower_limit_error_${item_no}`).remove();
                    $(`#txt_item_no_${item_no}_lower_limit`).after(`<span id="span_lower_limit_error_${item_no}" class="span-error">Lower limit cannot be higher than upper limit</span>`);
                    $(`#txt_item_no_${item_no}_lower_limit`).val('');
                } else {
                    $(`#span_lower_limit_error_${item_no}`).remove();
                    //para sa pag update ng upper or lower limit
                    IGM.ValidateAddIgmItemNo(item_no);
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

    this_igm.SubItemGetMinMax = (item_no, sub_no, min_max_no, min_max_type) => {

        let upper_limit   =   $(`#txt_item_no_${item_no}_upper_limit`).val();
        let lower_limit   =   $(`#txt_item_no_${item_no}_lower_limit`).val();
        let specs         =   $(`#txt_item_no_${item_no}_specs`).val();
        let coordinates   =   $(`#txt_item_no_${item_no}_sub_no_${sub_no}_coordinates`).val();
        //upper limit
        if (upper_limit === '') 
        {
            $(`#span_upper_limit_error_${item_no}`).remove();
            $(`#txt_item_no_${item_no}_upper_limit`).after(`<span id="span_upper_limit_error_${item_no}" class="span-error">Required</span>`);
            IGM.ValidateMinMaxType(item_no, sub_no,min_max_type,min_max_no);
           
        } 
        else
        {
            $(`#span_upper_limit_error_${item_no}`).remove();
        }
        //lower limit
        if (lower_limit === '')
        {
            $(`#span_lower_limit_error_${item_no}`).remove();
            $(`#txt_item_no_${item_no}_lower_limit`).after(`<span id="span_lower_limit_error_${item_no}" class="span-error">Required</span>`);
            IGM.ValidateMinMaxType(item_no, sub_no,min_max_type,min_max_no);
        }
        else
        {
            $(`#span_lower_limit_error_${item_no}`).remove();
        }
        //specs
        if (specs === '')
        {
            $(`#span_specs_error_${item_no}`).remove();
            $(`#txt_item_no_${item_no}_specs`).after(`<span id="span_specs_error_${item_no}" class="span-error">Required</span>`);
            IGM.ValidateMinMaxType(item_no, sub_no,min_max_type,min_max_no);
        }
        else
        {
            $(`#span_specs_error_${item_no}`).remove();
        }
        
        if (upper_limit !== '' && lower_limit !== '' && specs !== '')
        {
            if (coordinates !== '')
            {
                $(`#span_coordinates_error_${item_no}`).remove();
                IGM.ValidateSubItemGetMinMax(item_no, sub_no, min_max_no, min_max_type);
            }
            else
            {
                IGM.ValidateMinMaxType(item_no, sub_no,min_max_type,min_max_no);
            }
        }
    };

    this_igm.ValidateMinMaxType = (item_no, sub_no,min_max_type,min_max_no) => {

        let coordinates         = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_coordinates`).val();

        if (min_max_type === '')
        {
            if (coordinates === '')
            {
                $(`#span_coordinates_error_${item_no}`).remove();
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_coordinates`).after(`<span id="span_coordinates_error_${item_no}" class="span-error">Required</span>`);
            }
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_coordinates`).val('');
        }
        else 
        {
            $(`#span_coordinates_error_${item_no}`).remove();
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_coordinates`).after(`<span id="span_coordinates_error_${item_no}" class="span-error">Required</span>`);
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_${min_max_type}_${min_max_no}`).val('');
        }
    };

    this_igm.ValidateSubItemGetMinMax = (item_no, sub_no, min_max_no, min_max_type) => {
        
        if (min_max_type === 'min') 
        {
            if (min_max_no === 1) 
            {
                if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).val() === '') 
                {
                    $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                } 
                else 
                {
                    $(`#span_min_error_${min_max_no}`).remove();
                    IGM.ValidateSubItemGetMinMaxWithUpperAndLowerLimit(item_no, sub_no, min_max_no, min_max_type);
                }
            } 
            else 
            {
                if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).val() === '') 
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
                            IGM.ValidateSubItemGetMinMaxPreviousUpperAndLowerLimit(item_no, sub_no, min_max_no);
                        } 
                        else 
                        {
                            if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no - 1}`).val() !== '') 
                            {
                                $(`#span_min_error_${min_max_no}`).remove();
                                IGM.ValidateSubItemGetMinMaxWithUpperAndLowerLimit(item_no, sub_no, min_max_no, min_max_type);
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
                if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).val() === '') 
                {
                    $(`#span_min_error_${min_max_no}`).remove();
                    $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).after(`<span id="span_min_error_${min_max_no}" class="span-error">Required</span>`);
                    $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no}`).val('');
                    $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                } 
                else 
                {
                    if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no}`).val() === '') 
                    {
                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                        $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    } 
                    else {
                        $(`#span_min_error_${min_max_no}`).remove();
                        IGM.ValidateSubItemGetMinMaxWithUpperAndLowerLimit(item_no, sub_no, min_max_no, min_max_type);
                    }
                }
            } 
            else 
            {
                IGM.ValidateSubItemGetMinMax5(item_no, sub_no, min_max_no, min_max_type);
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
                        if (parseFloat(min_value) > 0)
                        {
                            new_min_value =  `+${parseFloat(min_value)}`;
                        }
                        
                        if (parseFloat(max_value) > 0)
                        {
                            new_max_value =  `+${parseFloat(max_value)}`;
                        }
                        //pagpush ng min and max data
                        array_min_max_value.push(new_min_value);
                        array_min_max_value.push(new_max_value);

                        if (c_count === 5) 
                        {
                            //pagkuha ng overall judgement para sa checksheet item 
                            IGM.SubitemCalculateOverallJudgement(item_no,sub_no,array_min_max_value);
                            array_min_max_value = [];
                        }
                    }
                }
            }
        }
    };

    this_igm.ValidateSubItemGetMinMax5 = (item_no, sub_no, min_max_no, min_max_type) => {

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
                        IGM.ValidateSubItemGetMinMaxWithUpperAndLowerLimit(item_no, sub_no, min_max_no, min_max_type);
                    }
                }
            }
        }
    };

    this_igm.ValidateSubItemGetMinMaxPreviousUpperAndLowerLimit = (item_no, sub_no, min_max_no) => {
        for (let error_count = 1; error_count <= min_max_no; error_count++) {
            if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${error_count}`).val() === '') {
                $(`#span_min_error_${error_count}`).remove();
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${error_count}`).after(`<span id="span_min_error_${error_count}" class="span-error">Required</span>`);

            } else {
                $(`#span_min_error_${error_count}`).remove();
            }

            if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${error_count}`).val() === '') {
                $(`#span_max_error_${error_count}`).remove();
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${error_count}`).after(`<span id="span_max_error_${error_count}" class="span-error">Required</span>`);

            } else {
                $(`#span_max_error_${error_count}`).remove();
            }
        }
    };

    this_igm.ValidateSubItemGetMinMaxWithUpperAndLowerLimit = (item_no, sub_no, min_max_no, min_max_type) => {

        let upper_limit                                             = $(`#txt_item_no_${item_no}_upper_limit`).val();
        let lower_limit                                             = $(`#txt_item_no_${item_no}_lower_limit`).val();
        let min_value                                               = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).val();
        let max_value                                               = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no}`).val();
        let last_max_value                                          = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_5`).val();
        let array_min_max_judgement_per_sub_item                    = [];
        let array_min_max_value                                     = [];
        let array_min_max_judgement_per_sub_item_overall_NG_count   = 0;


        if (parseFloat(min_value) > parseFloat(max_value)) 
        {

            $(`#span_min_error_${min_max_no}`).remove();
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).after(`<span id="span_min_error_${min_max_no}" class="span-error">Invalid min and max</span>`);
        } 
        else 
        {
            $(`#span_min_error_${min_max_no}`).remove();

            if (last_max_value !== '') 
            {
                for (let a_count = 1; a_count <= 5; a_count++) 
                {

                    let min_value_loop = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${a_count}`).val();
                    let max_value_loop = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${a_count}`).val();
                   
                    // checking ng min
                    if (min_value !== '') 
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
                    }

                    // checking ng max
                    if (max_value !== '') 
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
                            // counting ng NG
                            for (let b_count = 0; b_count < array_min_max_judgement_per_sub_item.length; b_count++) 
                            {
                                if (array_min_max_judgement_per_sub_item[b_count] === 'NG') 
                                {
                                    array_min_max_judgement_per_sub_item_overall_NG_count++;
                                }
                            }

                        }

                        for (let c_count = 1; c_count <= 5; c_count++) 
                        {
                            let min_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${c_count}`).val();
                            let max_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${c_count}`).val();

                            //pagka nagbura sa gitna na may last value
                            if (min_value === '') 
                            {
                                $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                                $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                            } 
                            else
                            {
                                //pagka nagbura sa gitna na may last value
                                if (max_value === '') 
                                {
                                    $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                                    $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                                } 
                                else 
                                {
                                    //pag lalagay ng sub item judgement
                                    if (array_min_max_judgement_per_sub_item_overall_NG_count > 0) 
                                    {
                                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="badge badge-danger subitem-visual-judgement">NG</span>`);
                                    } 
                                    else 
                                    {
                                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="badge badge-success subitem-visual-judgement">OK</span>`);
                                    }

                                    //pagkuha ng min and max data
                                    let min_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${c_count}`).val();
                                    let max_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${c_count}`).val();
                                    //pagpush ng min and max data
                                    array_min_max_value.push(parseFloat(min_value));
                                    array_min_max_value.push(parseFloat(max_value));

                                    if (c_count === 5) 
                                    {
                                        //pagkuha ng overall judgement para sa checksheet item 
                                        IGM.SubitemCalculateOverallJudgement(item_no,sub_no,array_min_max_value);
                                        array_min_max_judgement_per_sub_item = [];
                                        array_min_max_value = [];
                                    }
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

    this_igm.SubitemCalculateOverallJudgement = (item_no, sub_no, array_data) => {

        //pag lalagay ng item overall judgement based sa kung ilan ang sub item sa item no na to
        let sub_no_count = $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick');
        let split_total_sub_no_count = sub_no_count.split(',');
        let total_sub_no_count = split_total_sub_no_count[2];

        let id = $(`#txt_hidden_item_no_${item_no}`).val();
        let coordinates = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_coordinates`).val();
        let judgment_datas = $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement span`).text()

        let overall_NG_count = 0;

        for (let index = 1; index <= total_sub_no_count; index++) 
        {
            array_overall_judgement.push($(`#td_item_no_${item_no}_sub_no_${index}_judgement span`).text());
        }

        for (let index = 0; index < array_overall_judgement.length; index++) 
        {
            if (array_overall_judgement[index] === 'NG') 
            {
                overall_NG_count++;
            }
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
                else {
                    if (overall_NG_count > 0) 
                    {
                        $(`#td_item_no_${item_no}_judgement`).html('<span class="badge badge-danger subitem-visual-judgement">NG</span>');
                        //auto judgement papunta sa DB
                        IGM.ProceedSubitemCalculateOverallJudgement(id, sub_no, 'NG', coordinates, array_data, judgment_datas)
                        array_overall_judgement = [];
                    } 
                    else 
                    {
                        $(`#td_item_no_${item_no}_judgement`).html('<span class="badge badge-success subitem-visual-judgement">OK</span>');
                        //auto judgement papunta sa DB
                        IGM.ProceedSubitemCalculateOverallJudgement(id, sub_no, 'OK', coordinates, array_data, judgment_datas)
                        array_overall_judgement = [];
                    }
                }
            } 
            else 
            {
                if (overall_NG_count > 0) 
                {
                    $(`#td_item_no_${item_no}_judgement`).html('<span class="badge badge-danger subitem-visual-judgement">NG</span>');
                    //auto judgement papunta sa DB
                    IGM.ProceedSubitemCalculateOverallJudgement(id, sub_no, 'NG', coordinates, array_data, judgment_datas)
                    array_overall_judgement = [];
                } 
                else 
                {
                    $(`#td_item_no_${item_no}_judgement`).html('<span class="badge badge-success subitem-visual-judgement">OK</span>');
                    //auto judgement papunta sa DB
                    IGM.ProceedSubitemCalculateOverallJudgement(id, sub_no, 'OK', coordinates, array_data, judgment_datas)
                    array_overall_judgement = [];
                }
            }
        }
    };

    this_igm.ProceedSubitemCalculateOverallJudgement = (id, sub_no, judgment_items, coordinates, data, judgment_datas) => {

        $(`#accordion_igm`).LoadingOverlay('show');
     
        $.ajax({
            url         : `update-judgment`,
            type        : 'patch',
            dataType    : 'json',
            cache       : false,
            data        : {
                _token: _TOKEN,
                id              : id,
                sub_number      : sub_no,
                judgment_items  : judgment_items,
                coordinates     : coordinates,
                data            : data.toString(),
                judgment_datas  : judgment_datas,
            },
            success: result => 
            {
                $(`#accordion_igm`).LoadingOverlay('hide');
            }
        });
    };

    this_igm.RejudgementAfterRemoveSubNo = (item_no) => {

        let judgement = '';
        //pagkuha ng existing sub count
        let split_total_sub_no_count    = $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick').split(',');
        let total_sub_no_count          = parseInt(split_total_sub_no_count[2]);
        let array_overall_judgement     = [];

        for (let index = 1; index <= total_sub_no_count; index++) 
        {
            array_overall_judgement.push($(`#td_item_no_${item_no}_sub_no_${index}_judgement span`).text());
        }

        if ($.inArray('N/A',array_overall_judgement) === -1)
        {
            if ($.inArray('NG', array_overall_judgement) === - 1)
            {
                $(`#td_item_no_${item_no}_judgement`).html('<span class="badge badge-success subitem-visual-judgement">OK</span>');
                judgement += 'OK';
            }
            else
            {
                $(`#td_item_no_${item_no}_judgement`).html('<span class="badge badge-danger subitem-visual-judgement">NG</span>');
                judgement += 'NG';
            }
        }
        else
        {
            $(`#td_item_no_${item_no}_judgement`).html('<span class="input_text_center">N/A</span>');
            judgement += 'N/A';
        }

        return judgement;
        
    };

    this_igm.ChecksheetDataInputData = (array_data,number) => {
        let data = '';

        if (array_data != undefined)
        {
           if (array_data.length !== 0)
            {
                data = (array_data[number] == "undefined") ? '': array_data[number];
            } 
        }
        else
        {
            data = '';
        }
        
        return data;
    };

    this_igm.ChecksheetDataInputJudgement = (judgement) => {
  
        if (judgement === null || judgement === 'N/A' || judgement === undefined || judgement === '')
        {
            var data = '<span class="input_text_center">N/A</span>';
        } 
        else if (judgement === 'OK')
        {
            data = '<span class="badge badge-success subitem-visual-judgement input_text_center">OK</span>';
        }
        else
        {
            data = '<span class="badge badge-danger subitem-visual-judgement input_text_center">NG</span>';
        }
        return data;
    };

    this_igm.ChecksheetDataVisualsChangeColor = (item_no_count,existing_sub_no_count_per_item,array_data) => {

        let visual_no = 1;
        let sub_no = existing_sub_no_count_per_item;

        if (array_data != undefined) 
        { 
            for (let b_index = 0; b_index < array_data.length; b_index++) 
            {
                if (array_data[b_index] === 'OK')
                {
                    $(`#txt_item_no_${item_no_count}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#27b968');
                    $(`#txt_item_no_${item_no_count}_sub_no_${sub_no}_visual_${visual_no}`).css('color', 'white');
                }
                else if (array_data[b_index] === 'NG')
                {
                    $(`#txt_item_no_${item_no_count}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#d43333');
                    $(`#txt_item_no_${item_no_count}_sub_no_${sub_no}_visual_${visual_no}`).css('color', 'white');
                }
                else
                {
                    $(`#txt_item_no_${item_no_count}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#676767');
                }
                visual_no++;
            }
        }
    };

    return this_igm;
})();
