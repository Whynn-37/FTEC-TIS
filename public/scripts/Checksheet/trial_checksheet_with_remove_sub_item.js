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
						<button type="button" class="btn btn-success btn-block" onclick="IGM.AddIgmItemNo('',${parseInt(item_no_count) + 1},0,0);"><strong class="strong-font"><i class="ti-plus"></i> ADD ITEM</strong></button>
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
                        if (count === data.data.items.length) {
                            item_no_count += value.item_number;
                        }
                        count++;
                    });
                    // add item button , {{--IGM.AddIgmItemNo(type, current_item_no + 1, sub item count, added item no in between count)--}}
                    var tfoot_tbl_igm = `
                    <tfoot id="tfoot_add_igm_item">
                        <td colspan="9"> 
                            <button type="button" class="btn btn-success btn-block" onclick="IGM.AddIgmItemNo('',${parseInt(item_no_count) + 1},0,0);"><strong class="strong-font"><i class="ti-plus"></i> ADD ITEM</strong></button>
                        </td>
                    </tfoot>
                    `;
                } else {
                    item_no_count += 0;
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
        data.data.items.forEach((value) => {
            tr_new_item += `${IGM.AddIgmItemNoHeader(value.id - 1,'th_new_igm_sub_column_dark')}
			<tr id="tr_item_no_${value.id}">
			<input type="text" id="item_id_${value.id}" >
				<td>
					<div class="dropright">
						<span id="span_item_no_${value.id}_label">${value.item_number}</span>
						<button id="btn_validate_sub_no_count_${value.id}" class="dropdown-toggle button_dropdown" type="button" data-toggle="dropdown" style="margin-left: 20%;"  onclick="IGM.ValidateSubNoCount(1,${value.id});"></button>
						<div class="dropdown-menu">
							<a id="a_add_igm_item_no_${value.id}" class="dropdown-item" onclick="IGM.AddIgmItemNo('${value.type}',${value.id},1,0);" style="cursor: pointer"><i class="ti-plus"></i> ADD ITEM</a>
							<a id="a_add_igm_item_no_${value.id}_sub_no" class="dropdown-item" onclick="IGM.AddIgmSubNo('${value.type}',${value.id},1,0);" style="cursor: pointer" hidden><i class="ti-plus"></i> ADD SUB ITEM</a>
							<a id="a_remove_igm_item_no_${value.id}" class="dropdown-item" onclick="IGM.RemoveIgmItemNo(${value.id});"><i class="ti-close"></i> REMOVE</a>
						</div>
					</div>
				</td> 
				<td>
					<input list="item_tools_list" id="slc_item_no_${value.id}_tools" type="text" class="form-control input_text_center" placeholder="Select tools">
					<datalist id="item_tools_list">
						${array_item_tools_options}
					</datalist>
				<td>
					<select id="slc_item_no_${value.id}_type" class="form-control" onchange="IGM.SelectItemType(${value.id},1);">
						<option value=""selected disabled>Select type</option>
						${array_item_type_options}
					</select>
				</td>
				<td>
					<input id="txt_item_no_${value.id}_specs" type="text" class="form-control input_text_center" placeholder="Enter specs" disabled>
				</td>
				<td>
					<input id="txt_item_no_${value.id}_upper_limit" type="number" class="form-control input_text_center" placeholder="Enter upper limit" disabled onkeyup="IGM.ValidateItemNoUpperAndLowerLimit(${value.id});">
				</td>
				<td>
					<input id="txt_item_no_${value.id}_lower_limit" type="number" class="form-control input_text_center" placeholder="Enter lower limit" disabled onkeyup="IGM.ValidateItemNoUpperAndLowerLimit(${value.id});">
				</td>
				<td id="td_item_no_${value.id}_judgement" class="input_text_center" style="vertical-align: middle;">N/A</td>
            </tr>`;
        });

        //pag didisplay ng datatable
        $('#tbody_tbl_igm').html(tr_new_item);

        //pag fill ng data sa inputs
        data.data.items.forEach((value) => {
            $(`#slc_item_no_${value.id}_tools`).val(value.tools);
            $(`#slc_item_no_${value.id}_type`).val(value.type);

            if (value.type === 'Min and Max' || value.type === 'Min and Max and Form Tolerance') {
                $(`#txt_item_no_${value.id}_specs`).prop('disabled', false);
                $(`#txt_item_no_${value.id}_upper_limit`).prop('disabled', false);
                $(`#txt_item_no_${value.id}_lower_limit`).prop('disabled', false);

            } else {
                $(`#txt_item_no_${value.id}_specs`).prop('disabled', true);
                $(`#txt_item_no_${value.id}_upper_limit`).prop('disabled', true);
                $(`#txt_item_no_${value.id}_lower_limit`).prop('disabled', true);
            }
        });

        //pagkuha ng checksheet datas
        data.data.datas.forEach((value) => {
            IGM.GetChecksheetDatas(value.checksheet_item_id, 1, 'th_new_igm_sub_column_dark');
        });
    };

    this_igm.GetChecksheetDatas = (item_no, existing_sub_no_count, bg_header = "th_new_igm_sub_column") => {

        let type = $(`#slc_item_no_${item_no}_type`).val();

        IGM.AddIgmSubNo(`${type}`, item_no, 0, 0, bg_header);
        $(`#a_add_igm_item_no_${item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${item_no},1,0);`)
        $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${item_no},1,0);`)
        $(`#slc_item_no_${item_no}_type`).attr('onchange', `IGM.SelectItemType(${item_no},1);`);
        $(`#a_add_igm_item_no_${item_no}_sub_no`).prop('hidden', false);

    };

    // PARA SA MANUAL NA PAG AADD
    this_igm.AddIgmItemNo = (type, previous_item_no, existing_sub_no_count, added_item_no_between_count) => {

        if ($('#tbl_new_igm').is(':hidden')) {

            item_no_count++;
            new_item_no_count++;
            $('#tbl_new_igm').prop('hidden', false);
            $('#tr_item_no_main_column').prop('hidden', false);
            tr_new_item = IGM.AddIgmItemNoInputs(type, '', previous_item_no, item_no_count, existing_sub_no_count);
            $('#tbody_tbl_new_igm').html(tr_new_item);
            $('#tfoot_add_igm_item').prop('hidden', true);
            $('#th_new_igm_item_no_extra_column').attr('id', `th_igm_item_no_${item_no_count}_extra_column`);
        } else {
            if (existing_sub_no_count === 0) {
                // kung yung aaddan ng item ay yung last item no
                if (previous_item_no === parseInt(item_no_count)) {

                    item_no_count++;

                    tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no, item_no_count, existing_sub_no_count);
                    $(`#tr_item_no_${previous_item_no}`).after(tr_new_item);
                    new_item_no_count++;

                } else {

                    item_no_count++;

                    IGM.AddIgmItemNoInputsBetweenChangeId(type, previous_item_no, existing_sub_no_count, added_item_no_between_count);

                    tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no, new_item_no_count, existing_sub_no_count);
                    $(`#tr_item_no_${previous_item_no}`).after(tr_new_item);
                    new_item_no_count++;
                }

            } else {
                if (previous_item_no === item_no_count) {
                    item_no_count++;

                    if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') {
                        tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no, item_no_count, existing_sub_no_count);
                        $(`#tr_item_no_${previous_item_no}_sub_no_max_${existing_sub_no_count}`).after(tr_new_item);
                    } else {
                        tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no, item_no_count, existing_sub_no_count);
                        $(`#tr_item_no_${previous_item_no}_sub_no_${existing_sub_no_count}`).after(tr_new_item);
                    }

                    new_item_no_count++;
                } else {

                    item_no_count++;

                    IGM.AddIgmItemNoInputsBetweenChangeId(type, previous_item_no, existing_sub_no_count, added_item_no_between_count);

                    if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') {
                        tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no, item_no_count, existing_sub_no_count);
                        $(`#tr_item_no_${previous_item_no}_sub_no_max_${existing_sub_no_count}`).after(tr_new_item);
                    } else {
                        tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no, item_no_count, existing_sub_no_count);
                        $(`#tr_item_no_${previous_item_no}_sub_no_${existing_sub_no_count}`).after(tr_new_item);
                    }

                    new_item_no_count++;
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
			<th width="10%" class="${bg_header}">SPECS</th>
			<th width="10%" class="${bg_header}">UPPER LIMIT</th>
			<th width="10%" class="${bg_header}">LOWER LIMIT</th>
			<th width="10%" class="${bg_header}">JUDGEMENT</th>
			<th width="10%" class="${bg_header}" id="th_igm_item_no_${item_no_holder}_extra_column" colspan="7" hidden></th>
		</tr>`;
        return tr_new_item_header;
    };

    this_igm.AddIgmItemNoInputs = (type, tr_new_item_header, previous_item_no) => {
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
							<a id="a_add_igm_item_no_${item_no_holder}" class="dropdown-item" onclick="IGM.AddIgmItemNo('${type}',${item_no_holder},${existing_sub_no_count_holder},0);" style="cursor: pointer"><i class="ti-plus"></i> ADD ITEM</a>
							<a id="a_add_igm_item_no_${item_no_holder}_sub_no" class="dropdown-item" onclick="IGM.AddIgmSubNo('${type}',${item_no_holder},${existing_sub_no_count_holder},0);" style="cursor: pointer" hidden><i class="ti-plus"></i> ADD SUB ITEM</a>
							<a id="a_remove_igm_item_no_${item_no_holder}" class="dropdown-item" onclick="IGM.RemoveIgmItemNo(${item_no_holder});"><i class="ti-close"></i> REMOVE</a>
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
					<input id="txt_item_no_${item_no_holder}_specs" type="text" class="form-control input_text_center" placeholder="Enter specs" disabled>
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

        let tools = $(`#slc_item_no_${item_no}_tools`).val();
        $(`#slc_item_no_${item_no}_tools`).attr('onchange', `IGM.SelectItemTools(${item_no},'${tools}');`)
        let type = $(`#slc_item_no_${item_no}_type`).val();

        //check if nasa array yung piniling tools
        if (array_item_tools.indexOf(tools) === -1) {
            $(`#span_error_item_no_${item_no}_tools`).remove();
            $(`#slc_item_no_${item_no}_tools`).after(`<span id="span_error_item_no_${item_no}_tools" class="span-error">Invalid tools</span>`);
        } else {
            if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') {
                alert('ara ara')
            } else {
                if (type === null) {
                    $(`#span_error_item_no_${item_no}_type`).remove();
                    $(`#slc_item_no_${item_no}_type`).after(`<span id="span_error_item_no_${item_no}_type" class="span-error">Required</span>`);
                } else {
                    $(`#span_error_item_no_${item_no}_tools`).remove();
                    IGM.ProceedAddIgmItemNo(item_no, tools, type, null, null, null, 'th_new_igm_sub_column');
                }
            }
        }
    };

    this_igm.SelectItemType = (item_no, existing_sub_no_count, bg_header = "th_new_igm_sub_column") => {

        let tools = $(`#slc_item_no_${item_no}_tools`).val();
        let type = $(`#slc_item_no_${item_no}_type`).val();

        $(`#span_error_item_no_${item_no}_type`).remove();

        if (tools !== '') {
            if (array_item_tools.indexOf(tools) === -1) {
                $(`#span_error_item_no_${item_no}_tools`).remove();
                $(`#slc_item_no_${item_no}_tools`).after(`<span id="span_error_item_no_${item_no}_tools" class="span-error">Invalid tools</span>`);
            } else {
                if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') {
                    $(`#txt_item_no_${item_no}_specs`).prop('disabled', false);
                    $(`#txt_item_no_${item_no}_upper_limit`).prop('disabled', false);
                    $(`#txt_item_no_${item_no}_lower_limit`).prop('disabled', false);

                } else {
                    $(`#txt_item_no_${item_no}_specs`).prop('disabled', true);
                    $(`#txt_item_no_${item_no}_upper_limit`).prop('disabled', true);
                    $(`#txt_item_no_${item_no}_lower_limit`).prop('disabled', true);
                }

                if (existing_sub_no_count === 1) {
                    if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') {
                        $(`#tr_item_no_${item_no}_sub_no_column`).remove();
                        $(`#tr_item_no_${item_no}_sub_no_1`).remove();
                        $(`#tr_item_no_${item_no}_sub_no_1`).remove();
                        $(`#tr_item_no_${item_no}_sub_no_max_1`).remove();
                    } else {
                        $(`#tr_item_no_${item_no}_sub_no_column`).remove();
                        $(`#tr_item_no_${item_no}_sub_no_1`).remove();
                        $(`#tr_item_no_${item_no}_sub_no_max_1`).remove();
                    }

                    // $(`#slc_item_no_${item_no}_type`).attr('onchange', `IGM.SelectItemType(${item_no},0);`)
                    $(`#span_error_item_no_${item_no}_tools`).remove();
                    $(`#span_error_item_no_${item_no}_type`).remove();

                    IGM.ProceedAddIgmItemNo(item_no, tools, type, null, null, null, bg_header);
                } else {
                    $(`#span_error_item_no_${item_no}_tools`).remove();
                    $(`#span_error_item_no_${item_no}_type`).remove();

                    IGM.ProceedAddIgmItemNo(item_no, tools, type, null, null, null, bg_header);
                }
            }
        } else {
            $(`#span_error_item_no_${item_no}_tools`).remove();
            $(`#slc_item_no_${item_no}_tools`).after(`<span id="span_error_item_no_${item_no}_tools" class="span-error">Required</span>`);
        }

    };
    // pag insert ng item sa DB, dito narin gumagawa ng hidden checksheet_item_id
    this_igm.ProceedAddIgmItemNo = (item_no, tools, type, specification, upper_limit, lower_limit, bg_header) => {
        $(`#accordion_igm`).LoadingOverlay('show');

        let trial_checksheet_id = $('#trial_checksheet_id').val();

        $.ajax({
            url: `store-items`,
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {
                _token: _TOKEN,
                trial_checksheet_id: trial_checksheet_id,
                item_number: item_no,
                tools: tools,
                type: type,
                specification: specification,
                upper_limit: upper_limit,
                lower_limit: lower_limit,
            },
            success: data => {
                //paglalagay ng hidden id sa checksheet item
                $(`#txt_hidden_item_no_${item_no}`).val(data.data.checksheet_item_id)
                //paglalagay ng sub item row
                IGM.AddIgmSubNo(`${type}`, item_no, 0, 0, bg_header, data.data.checksheet_data_id);
                // adjustment ng onclick methods
                $(`#a_add_igm_item_no_${item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${item_no},1,0);`)
                $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${item_no},1,0);`)
                $(`#slc_item_no_${item_no}_type`).attr('onchange', `IGM.SelectItemType(${item_no},1);`);

                $(`#a_add_igm_item_no_${item_no}_sub_no`).prop('hidden', false);

                //DITO function ng store-items para sa pg uupdate ng data
                if (item_no < parseInt(item_no_count)) {
                    IGM.UpdateNextIgmItemNo(item_no, 'add');
                }

                $(`#accordion_igm`).LoadingOverlay('hide');
            }
        });
    };

    this_igm.AddIgmItemNoInputsBetweenChangeId = (type, previous_item_no, existing_sub_no_count, added_item_no_between_count) => {

        var added_item_no_between_count_holder = added_item_no_between_count;
        var added_item_no_between_count_increment = parseInt(added_item_no_between_count) + 1;
        added_item_no_between_count_holder++;

        // PAG AADJUST NG added_item_no_between_count IDEBUG BAKA MALI MALI ANG PAG CCHANGE
        let item_no_counter = parseInt(item_no_count) - 1;

        for (let count = previous_item_no; count < item_no_counter; count++) {
            if (count === previous_item_no) {
                var next_item_no_holder = parseInt(previous_item_no) + 2;
                var previous_item_no_holder = parseInt(previous_item_no) + 1;

                IGM.AddIgmItemNoInputsBetweenChangeIdIfStatement(type, existing_sub_no_count, previous_item_no_holder, next_item_no_holder);
                $(`#a_add_igm_item_no_${previous_item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${previous_item_no},${existing_sub_no_count},${added_item_no_between_count_increment});`);

                $(`#a_add_igm_item_no_${previous_item_no}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${previous_item_no},${existing_sub_no_count},${added_item_no_between_count_increment});`);

                $(`#slc_item_no_${previous_item_no}_type`).attr('onchange', `IGM.SelectItemType(${previous_item_no},${existing_sub_no_count});`);

            } else {
                next_item_no_holder = parseInt(count) + 2;
                previous_item_no_holder = parseInt(count) + 1;
                IGM.AddIgmItemNoInputsBetweenChangeIdIfStatement(type, existing_sub_no_count, previous_item_no_holder, next_item_no_holder);
                $(`#a_add_igm_item_no_${previous_item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${previous_item_no},${existing_sub_no_count},${added_item_no_between_count_increment});`);

                $(`#a_add_igm_item_no_${previous_item_no}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${previous_item_no},${existing_sub_no_count},${added_item_no_between_count_increment});`);

                $(`#slc_item_no_${previous_item_no}_type`).attr('onchange', `IGM.SelectItemType(${previous_item_no},${existing_sub_no_count});`);

            }
            if (count === item_no_counter - 1) {
                IGM.AddIgmItemNoInputsBetweenChangeTemporaryIdToOriginalId(type, previous_item_no, existing_sub_no_count, added_item_no_between_count);
                IGM.AddIgmItemNoInputsBetweenChangeSubNoTemporaryIdToOriginalId(type, previous_item_no);
            }
        }
    };

    this_igm.AddIgmItemNoInputsBetweenChangeIdIfStatement = (type, existing_sub_no_count, previous_item_no_holder, next_item_no_holder) => {

        let add_igm_item_no_onclick_value = $(`#a_add_igm_item_no_${previous_item_no_holder}`).attr('onclick');
        let add_igm_sub_no_onclick_value = $(`#a_add_igm_item_no_${previous_item_no_holder}_sub_no`).attr('onclick');
        let validate_sub_no_count_onclick_value = $(`#btn_validate_sub_no_count_${previous_item_no_holder}`).attr('onclick');

        let split_add_igm_item_no_onclick_value = add_igm_item_no_onclick_value.split(',');
        let split_add_igm_sub_no_onclick_value = add_igm_sub_no_onclick_value.split(',');

        let split_validate_sub_no_count_onclick_value = validate_sub_no_count_onclick_value.split(',');
        let validate_sub_no_count_existing_sub_count_value = split_validate_sub_no_count_onclick_value[0].split('(');

        let new_add_igm_item_no_onclick_value = `${split_add_igm_item_no_onclick_value[0]},${next_item_no_holder},${split_add_igm_item_no_onclick_value[2]},${split_add_igm_item_no_onclick_value[3]}`;
        let new_add_igm_sub_no_onclick_value = `${split_add_igm_sub_no_onclick_value[0]},${next_item_no_holder},${split_add_igm_sub_no_onclick_value[2]},${split_add_igm_sub_no_onclick_value[3]}`;

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

        //item no inputs
        $(`#slc_item_no_${previous_item_no_holder}_tools`).attr('id', `slc_item_no_${next_item_no_holder}_1_tools`);
        $(`#slc_item_no_${previous_item_no_holder}_type`).attr('id', `slc_item_no_${next_item_no_holder}_1_type`);
        $(`#txt_item_no_${previous_item_no_holder}_specs`).attr('id', `txt_item_no_${next_item_no_holder}_1_specs`);
        $(`#txt_item_no_${previous_item_no_holder}_upper_limit`).attr('id', `txt_item_no_${next_item_no_holder}_1_upper_limit`);
        $(`#txt_item_no_${previous_item_no_holder}_lower_limit`).attr('id', `txt_item_no_${next_item_no_holder}_1_lower_limit`);
        $(`#td_item_no_${previous_item_no_holder}_judgement`).attr('id', `td_item_no_${next_item_no_holder}_1_judgement`);

        //remove item
        $(`#a_remove_igm_item_no_${previous_item_no_holder}`).attr('id', `a_remove_igm_item_no_${next_item_no_holder}_1`);
        $(`#a_remove_igm_item_no_${next_item_no_holder}_1`).attr('onclick', `IGM.RemoveIgmItemNo(${next_item_no_holder});`);

        $(`#btn_validate_sub_no_count_${previous_item_no_holder}`).attr('id', `btn_validate_sub_no_count_${next_item_no_holder}_1`);
        $(`#btn_validate_sub_no_count_${next_item_no_holder}_1`).attr('onclick', `${new_validate_sub_no_count_onclick_value}`);

        IGM.AddIgmItemNoInputsBetweenChangeSubNoIdToTemporaryId(type, split_add_igm_item_no_onclick_value, previous_item_no_holder, next_item_no_holder);

    };

    //PAG UPDATE NG SUNOD NA CHECKSHEET ITEM PAGKA NAG ADD IN BETWEEN NG CHECKSHEET ITEM
    this_igm.UpdateNextIgmItemNo = (item_no) => {

        let trial_checksheet_id = $('#trial_checksheet_id').val();
        let new_item_no = item_no + 1;


        for (let index = new_item_no; index <= item_no_count; index++) {
            let tools = $(`#slc_item_no_${index}_tools`).val();
            let type = $(`#slc_item_no_${index}_type`).val();
            let specification = $(`#txt_item_no_${index}_specs`).val();
            let upper_limit = $(`#txt_item_no_${index}_upper_limit`).val();
            let lower_limit = $(`#txt_item_no_${index}_lower_limit`).val();

            $.ajax({
                url: `store-items`,
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {
                    _token: _TOKEN,
                    trial_checksheet_id: trial_checksheet_id,
                    item_number: index,
                    tools: tools,
                    type: type,
                    specification: specification,
                    upper_limit: upper_limit,
                    lower_limit: lower_limit,
                },
                success: data => {

                    $(`#txt_hidden_item_no_${index}`).val(data.data.checksheet_item_id);
                    $(`#accordion_igm`).LoadingOverlay('hide');
                }
            });
        }
    };

    this_igm.AddIgmItemNoInputsBetweenChangeTemporaryIdToOriginalId = (type, previous_item_no, existing_sub_no_count, added_item_no_between_count) => {

        next_item_no_holder = parseInt(previous_item_no) + 2;
        added_item_no_between_count_holder = added_item_no_between_count + new_item_no_count;

        for (let count = 1; count <= added_item_no_between_count_holder; count++) {

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

        if (item_no_existing_sub_no_count > 0) {

            for (let remove_sub_no_count = 1; remove_sub_no_count <= item_no_existing_sub_no_count; remove_sub_no_count++) {

                let remove_sub_no_onclick_value = $(`#a_remove_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}`).attr('onclick')

                let split_remove_sub_no_onclick_value = remove_sub_no_onclick_value.split(',');

                let new_remove_sub_no_onclick_value = `${split_remove_sub_no_onclick_value[0]},${split_remove_sub_no_onclick_value[1]},${next_item_no_holder},${split_remove_sub_no_onclick_value[3]},${split_remove_sub_no_onclick_value[4]}`;

                $(`#a_remove_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}`).attr('id', `a_remove_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_1`);
                $(`#a_remove_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_1`).attr('onclick', `${new_remove_sub_no_onclick_value}`);
                $(`#tr_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}`).attr('id', `tr_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_1`);

                $(`#th_tr_item_no_${previous_item_no_holder}_sub_no_column_rowspan`).attr('id', `th_tr_item_no_${next_item_no_holder}_sub_no_column_rowspan_1`);

                $(`#span_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_label`).text(`${remove_sub_no_count}`);
                $(`#span_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_label`).attr('id', `span_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_label_1`);

                if (item_no_existing_sub_no_type === 'Min and Max' || type === 'Min and Max and Form Tolerance') {

                    $(`#tr_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}`).attr('id', `tr_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_1`);
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

                } else {

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

    this_igm.AddIgmItemNoInputsBetweenChangeSubNoTemporaryIdToOriginalId = (type, previous_item_no) => {
        let count_value = parseInt(previous_item_no) + 2;

        for (let a_count = count_value; a_count <= item_no_count; a_count++) {
            let add_igm_tem_no_onclick_value = $(`#a_add_igm_item_no_${a_count}`).attr('onclick');
            let split_add_igm_tem_no_onclick_value = add_igm_tem_no_onclick_value.split(',');

            let existing_sub_no_count_value = split_add_igm_tem_no_onclick_value[2];
            let split_item_no_existing_sub_no_type = split_add_igm_tem_no_onclick_value[0].split('(');
            let item_no_existing_sub_no_type = split_item_no_existing_sub_no_type[1].replace(/"|'/g, '');

            if (existing_sub_no_count_value > 0) {
                for (let b_count = 1; b_count <= existing_sub_no_count_value; b_count++) {

                    $(`#a_remove_item_no_${a_count}_sub_no_${b_count}_1`).attr('id', `a_remove_item_no_${a_count}_sub_no_${b_count}`);
                    $(`#tr_item_no_${a_count}_sub_no_${b_count}_1`).attr('id', `tr_item_no_${a_count}_sub_no_${b_count}`)

                    $(`#th_tr_item_no_${a_count}_sub_no_column_rowspan_1`).attr('id', `th_tr_item_no_${a_count}_sub_no_column_rowspan`)

                    $(`#span_item_no_${a_count}_sub_no_${b_count}_label_1`).attr('id', `span_item_no_${a_count}_sub_no_${b_count}_label`);

                    if (item_no_existing_sub_no_type === 'Min and Max' || item_no_existing_sub_no_type === 'Min and Max and Form Tolerance') {
                        $(`#tr_item_no_${a_count}_sub_no_${b_count}_1`).attr('id', `tr_item_no_${a_count}_sub_no_${b_count}`);
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
                        for (let c_count = 1; c_count <= 5; c_count++) {
                            $(`#txt_item_no_${a_count}_sub_no_${b_count}_min_${c_count}`).attr('onkeyup', `IGM.SubItemGetMinMax(${a_count},${b_count},${c_count},'min');`);
                            $(`#txt_item_no_${a_count}_sub_no_${b_count}_max_${c_count}`).attr('onkeyup', `IGM.SubItemGetMinMax(${a_count},${b_count},${c_count},'max');`);
                        }

                    } else {
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
                        for (let c_count = 1; c_count <= 5; c_count++) {
                            $(`#txt_item_no_${a_count}_sub_no_${b_count}_visual_${c_count}`).attr('onclick', `IGM.SubItemSelectVisual(${a_count},${b_count}, ${c_count});`);
                        }

                    }
                }
            }
        }
    };

    this_igm.ValidateSubNoCount = (existing_sub_no_count, item_no_holder) => {
        if (existing_sub_no_count === 0) {
            $(`#a_remove_igm_item_no_${item_no_holder}`).removeClass('disabled');
            $(`#a_remove_igm_item_no_${item_no_holder}`).css('color', ' black');
            $(`#a_remove_igm_item_no_${item_no_holder}`).css('cursor', ' pointer');
            $(`#a_remove_igm_item_no_${item_no_holder}`).attr('onclick', `IGM.RemoveIgmItemNo(${item_no_holder});`);
        } else {
            $(`#a_remove_igm_item_no_${item_no_holder}`).addClass('disabled');
            $(`#a_remove_igm_item_no_${item_no_holder}`).removeAttr('onclick');
            $(`#a_remove_igm_item_no_${item_no_holder}`).css('cursor', ' context-menu');
            $(`#a_remove_igm_item_no_${item_no_holder}`).css('color', ' #c9cbcd');
            $(`#a_remove_igm_item_no_${item_no_holder}`).removeAttr('onclick');
        }
    };

    this_igm.RemoveIgmItemNo = (item_no) => {

        Swal.fire(
            $.extend(swal_options, {
                confirmButtonText: 'Yes',
                title: `Are you sure you want to remove the item?`,
            })
        ).then((result) => {
            if (result.value) {
                $(`#accordion_igm`).LoadingOverlay('show');

                let id = $(`#txt_hidden_item_no_${item_no}`).val();
                let trial_checksheet_id = $('#trial_checksheet_id').val();
                let item_number = $(`#span_item_no_${item_no}_label`).text();

                if (id.length === 0) {
                    IGM.ProceedRemoveIgmItemNo(item_no);
                    $(`#accordion_igm`).LoadingOverlay('hide');
                } else {
                    $.ajax({
                        url: `delete-item`,
                        type: 'delete',
                        dataType: 'json',
                        cache: false,
                        data: {
                            _token: _TOKEN,
                            id: id,
                            trial_checksheet_id:trial_checksheet_id,
                            item_number:item_number
                        },
                        success: data => {
                            IGM.ProceedRemoveIgmItemNo(item_no);
                            $(`#accordion_igm`).LoadingOverlay('hide');
                        }
                    });
                }
            }
        });
    };

    this_igm.ProceedRemoveIgmItemNo = (item_no) => {

        if (new_item_no_count === 1) {
            $(`#tr_item_no_${item_no}`).remove();
            $('#tfoot_add_igm_item').prop('hidden', false);
            $('#tbl_new_igm').prop('hidden', true);
        } else {
            if (item_no === 1) {
                $('#tr_item_no_main_column').prop('hidden', true);
                $(`#tr_item_no_${item_no}_column`).remove();
            } else {
                $(`#tr_item_no_${item_no}_column`).remove();
            }
            $(`#tr_item_no_${item_no}`).remove();

            if (item_no !== item_no_count) {
                // PARA SA MGA NEXT MAIN ITEM NG NIREMOVE NA MAIN ITEM
                for (let count = item_no; count < new_item_no_count; count++) {
                    
                    if (count === item_no) {
                        var item_no_holder = item_no;
                        var next_item_no_holder = item_no + 1;

                        //VALIDATE SUB NO COUNT
                        var btn_validate_sub_no_count_onclick_value = $(`#btn_validate_sub_no_count_${next_item_no_holder}`).attr('onclick');
                        var split_btn_validate_sub_no_count_onclick_value = btn_validate_sub_no_count_onclick_value.split('(');
                        var split_split_btn_validate_sub_no_count_onclick_value = split_btn_validate_sub_no_count_onclick_value[1].split(',');
                        var existing_sub_no_count_value = split_split_btn_validate_sub_no_count_onclick_value[0];
                        //ADD IGM ITEM NO
                        var a_add_igm_item_no_onclick_value = $(`#a_add_igm_item_no_${next_item_no_holder}`).attr('onclick');
                        var split_a_add_igm_item_no_onclick_value = a_add_igm_item_no_onclick_value.split('(');
                        var split_split_a_add_igm_item_no_onclick_value = split_a_add_igm_item_no_onclick_value[1].split(',');
                        var type_value = split_split_a_add_igm_item_no_onclick_value[0];
                        var split_split_split_a_add_igm_item_no_onclick_value = split_split_a_add_igm_item_no_onclick_value[3].split(')');
                        var added_item_in_between_value = split_split_split_a_add_igm_item_no_onclick_value[0];

                    } else {
                        item_no_holder = count;
                        next_item_no_holder = count + 1;

                        btn_validate_sub_no_count_onclick_value = $(`#btn_validate_sub_no_count_${next_item_no_holder}`).attr('onclick');
                        split_btn_validate_sub_no_count_onclick_value = btn_validate_sub_no_count_onclick_value.split('(');
                        split_split_btn_validate_sub_no_count_onclick_value = split_btn_validate_sub_no_count_onclick_value[1].split(',');
                        existing_sub_no_count_value = split_split_btn_validate_sub_no_count_onclick_value[0];

                        a_add_igm_item_no_onclick_value = $(`#a_add_igm_item_no_${next_item_no_holder}`).attr('onclick');
                        split_a_add_igm_item_no_onclick_value = a_add_igm_item_no_onclick_value.split('(');
                        split_split_a_add_igm_item_no_onclick_value = split_a_add_igm_item_no_onclick_value[1].split(',');
                        type_value = split_split_a_add_igm_item_no_onclick_value[0];
                        split_split_split_a_add_igm_item_no_onclick_value = split_split_a_add_igm_item_no_onclick_value[3].split(')');
                        added_item_in_between_value = split_split_split_a_add_igm_item_no_onclick_value[0];
                    }

                    $(`#tr_item_no_${next_item_no_holder}_column`).attr('id', `tr_item_no_${item_no_holder}_column`);
                    $(`#th_igm_item_no_${next_item_no_holder}_extra_column`).attr('id', `th_igm_item_no_${item_no_holder}_extra_column`);
                    $(`#tr_item_no_${next_item_no_holder}_sub_no_column`).attr('id', `tr_item_no_${item_no_holder}_sub_no_column`);

                    $(`#tr_item_no_${next_item_no_holder}`).attr('id', `tr_item_no_${item_no_holder}`);
                    $(`#span_item_no_${next_item_no_holder}_label`).text(item_no_holder);
                    $(`#span_item_no_${next_item_no_holder}_label`).attr('id', `span_item_no_${item_no_holder}_label`);

                    $(`#txt_hidden_item_no_${next_item_no_holder}`).attr('id', `txt_hidden_item_no_${item_no_holder}`);
                    
                    //validate sub no count
                    $(`#btn_validate_sub_no_count_${next_item_no_holder}`).attr('onclick', `IGM.ValidateSubNoCount(${existing_sub_no_count_value},${item_no_holder});`);
                    $(`#btn_validate_sub_no_count_${next_item_no_holder}`).attr('id', `btn_validate_sub_no_count_${item_no_holder}`);
                    //add igm item no
                    $(`#a_add_igm_item_no_${next_item_no_holder}`).attr('onclick', `IGM.AddIgmItemNo(${type_value},${item_no_holder},${existing_sub_no_count_value},${added_item_in_between_value});`)
                    $(`#a_add_igm_item_no_${next_item_no_holder}`).attr('id', `a_add_igm_item_no_${item_no_holder}`)
                    // add igm sub no
                    $(`#a_add_igm_item_no_${next_item_no_holder}_sub_no`).attr('onclick', `IGM.AddIgmSubNo(${type_value},${item_no_holder},${existing_sub_no_count_value},${added_item_in_between_value});`)
                    $(`#a_add_igm_item_no_${next_item_no_holder}_sub_no`).attr('id', `a_add_igm_item_no_${item_no_holder}_sub_no`)
                    //remove igm item no
                    $(`#a_remove_igm_item_no_${next_item_no_holder}`).attr('onclick', `IGM.RemoveIgmItemNo(${item_no_holder});`)
                    $(`#a_remove_igm_item_no_${next_item_no_holder}`).attr('id', `a_remove_igm_item_no_${item_no_holder}`)
                    //inputs
                    $(`#slc_item_no_${next_item_no_holder}_tools`).attr('id', `slc_item_no_${item_no_holder}_tools`);

                    $(`#slc_item_no_${next_item_no_holder}_type`).attr('id', `slc_item_no_${item_no_holder}_type`);
                    $(`#slc_item_no_${item_no_holder}_type`).attr('onchange', `IGM.SelectItemType(3,${existing_sub_no_count_value})`);

                    $(`#txt_item_no_${next_item_no_holder}_specs`).attr('id', `txt_item_no_${item_no_holder}_specs`);
                    $(`#txt_item_no_${next_item_no_holder}_upper_limit`).attr('id', `txt_item_no_${item_no_holder}_upper_limit`);
                    $(`#txt_item_no_${next_item_no_holder}_lower_limit`).attr('id', `txt_item_no_${item_no_holder}_lower_limit`);
                    $(`#td_item_no_${next_item_no_holder}_judgement`).attr('id', `td_item_no_${item_no_holder}_judgement`);


                    new_item_no_count--;
                    item_no_count--;

                    if (existing_sub_no_count_value > 0) {
                        IGM.AddIgmItemNoInputsBetweenChangeSubNoIdToTemporaryId(type_value, a_add_igm_item_no_onclick_value.split(','), next_item_no_holder, item_no_holder);
                        if (count === new_item_no_count) {
                            IGM.AddIgmItemNoInputsBetweenChangeSubNoTemporaryIdToOriginalId(type_value, item_no_holder - 2);
                        }
                    }
                }
            } else{
                new_item_no_count--;
                item_no_count--;
            }
        }
    };

    // SUB ITEM METHODS NA DITO
    this_igm.AddIgmSubNo = (type, item_no_count, existing_sub_no_count, added_item_no_between_count, bg_header, checksheet_data_id) => {

        let tr = '';
        let tr_sub_no_column = '';
        let rowspan = $(`#th_tr_item_no_${item_no_count}_sub_no_column_rowspan`).attr('rowspan');

        if (existing_sub_no_count === 0) {
            // AYUSIN ANG PAG SESET NG existing_sub_no_count_per_item NA MAKUKUHA PARIN SYA GLOBALLY
            existing_sub_no_count_per_item = 0;
            existing_sub_no_count_per_item = existing_sub_no_count;
            existing_sub_no_count_per_item++;

            $(`#a_add_igm_item_no_${item_no_count}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${item_no_count},${existing_sub_no_count_per_item},${added_item_no_between_count});`);
            $(`#a_add_igm_item_no_${item_no_count}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${item_no_count},${existing_sub_no_count_per_item},${added_item_no_between_count});`);
            $(`#btn_validate_sub_no_count_${item_no_count}`).attr('onclick', `IGM.ValidateSubNoCount(${existing_sub_no_count_per_item},${item_no_count})`);

            let next_number = parseInt(sub_no_count) + 1;

            if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') {
                var rowspan_count = 3;

            } else {
                rowspan_count = 2;
            }

            tr_sub_no_column += IGM.AddIgmSubNoHeader(item_no_count, rowspan_count, bg_header);

            tr += IGM.AddIgmSubNoInputs(type, next_number, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, added_item_no_between_count, checksheet_data_id);

            $(`#th_igm_item_no_${item_no_count}_extra_column`).prop('hidden', false);
            $(`#tr_item_no_${item_no_count}`).after(tr);

            sub_no_count++;

        } else {

            existing_sub_no_count_per_item = 0;
            existing_sub_no_count_per_item = existing_sub_no_count;
            existing_sub_no_count_per_item++;

            $(`#a_add_igm_item_no_${item_no_count}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${item_no_count},${existing_sub_no_count_per_item},${added_item_no_between_count});`);
            $(`#a_add_igm_item_no_${item_no_count}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${item_no_count},${existing_sub_no_count_per_item},${added_item_no_between_count});`);
            $(`#btn_validate_sub_no_count_${item_no_count}`).attr('onclick', `IGM.ValidateSubNoCount(${existing_sub_no_count_per_item},${item_no_count})`);

            let next_number = parseInt(sub_no_count) + 1;

            $(`#th_igm_item_no_${item_no_count}_extra_column`).prop('hidden', false);

            tr += IGM.AddIgmSubNoInputs(type, next_number, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, added_item_no_between_count, checksheet_data_id);
            sub_no_count++;

            let previous_sub_no = parseInt(existing_sub_no_count_per_item) - 1
            //CHECK KUNG BAKIT MALI YUNG NALALAGYAN NG ROW 10/22/2020
            if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') {
                $(`#tr_item_no_${item_no_count}_sub_no_max_${previous_sub_no}`).after(tr);
                $(`#th_tr_item_no_${item_no_count}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) + 2);
            } else {
                $(`#tr_item_no_${item_no_count}_sub_no_${previous_sub_no}`).after(tr);
                $(`#th_tr_item_no_${item_no_count}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) + 1);
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

    this_igm.AddIgmSubNoInputs = (type, next_number, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, added_item_no_between_count, checksheet_data_id) => {
        let tr = '';
        let new_sub_no = existing_sub_no_count_per_item;

        if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') {
            tr += `${tr_sub_no_column}
            <tr id="tr_item_no_${item_no_count}_sub_no_${new_sub_no}" >
				<td style="vertical-align: middle;" rowspan="2">
					<div class="dropright">
                    <span id="span_item_no_${item_no_count}_sub_no_${new_sub_no}_label">${new_sub_no}
                        <input type="text" id="txt_hidden_item_no_${item_no_count}_sub_no_${new_sub_no}" value="${checksheet_data_id}" hidden>
                    </span>
					<button style="margin-left: 20%;" class="dropdown-toggle button_dropdown" type="button" data-toggle="dropdown"></button>
						<div class="dropdown-menu">
							<a id="a_remove_item_no_${item_no_count}_sub_no_${new_sub_no}" class="dropdown-item" onclick="IGM.RemoveSubNo('${type}',${new_sub_no},${item_no_count},${added_item_no_between_count},${existing_sub_no_count_per_item});" style="cursor: pointer;text-align:center;"><i class="ti-close"></i> REMOVE</a>
						</div>
					</div>
				</td>
				<td style="vertical-align: middle;" rowspan="2">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_coordinates" type="text" class="form-control input_text_center" placeholder="Enter Coordinates" autocomplete="off">
				</td>
				<td class="td_sub_no_input">
					<input  id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_min_1" type="number" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},1,'min')">
				</td>
				<td class="td_sub_no_input">
					<input  id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_min_2" type="number" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},2,'min')">
				</td>
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_min_3" type="number" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},3,'min')">
				</td>
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_min_4" type="number" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},4,'min')">
				</td>
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_min_5" type="number" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},5,'min')">
				</td>
				<td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_judgement" style="vertical-align: middle;" rowspan="2" class="td_sub_no_input">N/A</td>
			</tr>
			<tr id="tr_item_no_${item_no_count}_sub_no_max_${new_sub_no}">
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_max_1" type="number" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},1,'max')">
				</td>
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_max_2" type="number" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},2,'max')">
				</td>
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_max_3" type="number" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},3,'max')">
				</td>
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_max_4" type="number" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},4,'max')">
				</td>
				<td class="td_sub_no_input">
					<input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_max_5" type="number" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count},${new_sub_no},5,'max')">
				</td>
			</tr>`;
        } else {
            tr += `${tr_sub_no_column}
            <tr id="tr_item_no_${item_no_count}_sub_no_${new_sub_no}" >
                <td>
                    <div class="dropright">
                        <span id="span_item_no_${item_no_count}_sub_no_${new_sub_no}_label">${new_sub_no}
                            <input type="text" id="txt_hidden_item_no_${item_no_count}_sub_no_${new_sub_no}" value="${checksheet_data_id}" hidden>
                        </span>
                        <button style="margin-left: 20%;" class="dropdown-toggle button_dropdown" type="button" data-toggle="dropdown"></button>
                        <div class="dropdown-menu">
                            <a id="a_remove_item_no_${item_no_count}_sub_no_${new_sub_no}" class="dropdown-item" onclick="IGM.RemoveSubNo('${type}',${new_sub_no},${item_no_count},${added_item_no_between_count},${existing_sub_no_count_per_item});" style="cursor: pointer"><i class="ti-close"></i> REMOVE</a>
                        </div>
                    </div>
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_coordinates" type="text" class="form-control input_text_center" placeholder="Enter Coordinates" autocomplete="off">
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_1" type="text" class="form-control input_text_center input-pointer" placeholder="Click visual" onclick="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no},1);" readonly>
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_2" type="text" class="form-control input_text_center input-pointer" placeholder="Click visual" onclick="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no},2);" readonly>
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_3" type="text" class="form-control input_text_center input-pointer" placeholder="Click visual" onclick="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no},3);" readonly>
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_4" type="text" class="form-control input_text_center input-pointer" placeholder="Click visual" onclick="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no},4);" readonly>
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_5" type="text" class="form-control input_text_center input-pointer" placeholder="Click visual" onclick="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no},5);" readonly>
                </td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_judgement" style="vertical-align:middle;" >N/A</td>
			</tr`;
        }
        return tr;
    };

    this_igm.AddSubNoChangeRemoveSubNoOnClick = (type, item_no_count, added_item_no_between_count, existing_sub_no_count_per_item) => {

        for (let sub_no = 1; sub_no < existing_sub_no_count_per_item; sub_no++) {
            $(`#a_remove_item_no_${item_no_count}_sub_no_${sub_no}`).attr('onclick', `IGM.RemoveSubNo('${type}',${sub_no},${item_no_count},${added_item_no_between_count},${existing_sub_no_count_per_item});`)
        }
    }

    this_igm.RemoveSubNo = (type, sub_no, item_no, added_item_no_between_count, existing_sub_no_count_per_item) => {

        let rowspan = $(`#th_tr_item_no_${item_no}_sub_no_column_rowspan`).attr('rowspan');
        let existing_sub_no_count_per_item_holder = existing_sub_no_count_per_item - 1;

        $(`#a_add_igm_item_no_${item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${item_no},${existing_sub_no_count_per_item_holder},${added_item_no_between_count});`);
        $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${item_no},${existing_sub_no_count_per_item_holder},${added_item_no_between_count});`);
        $(`#btn_validate_sub_no_count_${item_no}`).attr('onclick', `IGM.ValidateSubNoCount(${existing_sub_no_count_per_item_holder},${item_no})`);

        //if isa lang ang sub item sa item
        if (existing_sub_no_count_per_item === 1) {

            $(`#td_item_no_${item_no}_judgement`).html('N/A');

            $(`#tr_item_no_${item_no}_sub_no_column`).remove();
            if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') {
                $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
                $(`#tr_item_no_${item_no}_sub_no_max_${sub_no}`).remove();
            } else {
                $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
            }
            $(`#th_igm_item_no_${item_no}_extra_column`).prop('hidden', true);

            sub_no_count--;

        } else {
            if (existing_sub_no_count_per_item === sub_no) {
                if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') {
                    $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
                    $(`#tr_item_no_${item_no}_sub_no_max_${sub_no}`).remove();
                    $(`#th_tr_item_no_${item_no}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) - 2);
                } else {
                    $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
                    $(`#th_tr_item_no_${item_no}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) - 1);
                }

                sub_no_count--;
                // existing_sub_no_count_per_item--;

                for (let sub_no = 1; sub_no <= existing_sub_no_count_per_item_holder; sub_no++) {
                    $(`#a_remove_item_no_${item_no}_sub_no_${sub_no}`).attr('onclick', `IGM.RemoveSubNo('${type}',${sub_no},${item_no},${added_item_no_between_count},${existing_sub_no_count_per_item_holder});`)
                }
            } else {
                if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') {
                    $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
                    $(`#tr_item_no_${item_no}_sub_no_max_${sub_no}`).remove();
                    $(`#th_tr_item_no_${item_no}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) - 2);
                } else {
                    $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
                    $(`#th_tr_item_no_${item_no}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) - 1);
                }
                sub_no_count--;
                // existing_sub_no_count_per_item--;

                let next_sub_no = parseInt(sub_no) + 1;

                // PARA SA MGA NEXT SUB ITEM NG NIREMOVE NA SUB ITEM
                for (let count = sub_no; count <= existing_sub_no_count_per_item; count++) {
                    if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance') {
                        IGM.RemoveSubNoChangeIdMMAndMMF(item_no, sub_no, count, type, next_sub_no, added_item_no_between_count, existing_sub_no_count_per_item_holder);
                    } else {
                        IGM.RemoveSubNoChangeIdMC(item_no, sub_no, count, type, next_sub_no, added_item_no_between_count, existing_sub_no_count_per_item_holder);
                    }
                }
                //PARA SA MGA PREVIOUS SUB ITEM NG NIREMOVE NA SUB ITEM
                if (sub_no > 1) {
                    var remaining_previous_sub_item = sub_no - 1;
                    for (let count = 1; count <= remaining_previous_sub_item; count++) {
                        $(`#a_remove_item_no_${item_no}_sub_no_${count}`).attr('onclick', `IGM.RemoveSubNo('${type}',${count},${item_no},${added_item_no_between_count},${existing_sub_no_count_per_item_holder});`);
                    }
                }
            }

        }
        IGM.SubitemCalculateOverallJudgement(item_no);
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

        $(`#tr_item_no_${item_no}_sub_no_${next_sub_no_holder}`).attr('id', `tr_item_no_${item_no}_sub_no_${sub_no_holder}`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_judgement`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_judgement`);
        $(`#span_item_no_${item_no}_sub_no_${next_sub_no_holder}_label`).text(sub_no_holder);
        $(`#span_item_no_${item_no}_sub_no_${next_sub_no_holder}_label`).attr('id', `span_item_no_${item_no}_sub_no_${sub_no_holder}_label`);

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

        let visual_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val();

        if (visual_no === 1) {
            $(`#span_visual_error_${visual_no}`).remove();
            if (visual_value === '') {
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('OK');
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#27b968');
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('color', 'white');

            } else if (visual_value === 'OK') {
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('NG');
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#d43333');
            } else if (visual_value === 'NA') {
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('OK');
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#27b968');
            } else {
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('NA');
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#676767');
            }

        } else {

            for (let visual_count = visual_no - 1; visual_count < visual_no; visual_count++) {
                if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_count}`).val() === '') {
                    for (let error_count = 1; error_count < visual_no; error_count++) {
                        if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${error_count}`).val() === '') {

                            $(`#span_visual_error_${error_count}`).remove();
                            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${error_count}`).after(`<span id="span_visual_error_${error_count}" class="span-error">Required</span>`);
                        }
                    }
                } else {
                    $(`#span_visual_error_${visual_no}`).remove();
                    if (visual_value === '') {
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('OK');
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#27b968');
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('color', 'white');

                    } else if (visual_value === 'OK') {
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('NG');
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#d43333');
                    } else if (visual_value === 'NA') {
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('OK');
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#27b968');
                    } else {
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).val('NA');
                        $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${visual_no}`).css('background-color', '#676767');
                    }
                }
            }
        }
        IGM.SubitemCalculateVisualJudgement(item_no, sub_no);
    };

    this_igm.SubitemCalculateVisualJudgement = (item_no, sub_no) => {

        let visual_no_5 = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_5`).val();
        let array_visuals = [];
        let visuals_NG_count = 0;

        //array_overall_judgement ay  naska global

        //data ng visuals
        for (let index = 1; index <= 5; index++) {
            array_visuals.push($(`#txt_item_no_${item_no}_sub_no_${sub_no}_visual_${index}`).val());
        }

        if (visual_no_5 !== '') {
            for (let index = 0; index < array_visuals.length; index++) {
                if (array_visuals[index] === 'NG') {
                    visuals_NG_count++;
                }
            }

            if (visuals_NG_count > 0) {
                $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html('<span class="badge badge-danger subitem-visual-judgement">NG</span>');
            } else {
                $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html('<span class="badge badge-success subitem-visual-judgement">OK</span>');
            }

            IGM.SubitemCalculateOverallJudgement(item_no);
        }
    }

    this_igm.ValidateItemNoUpperAndLowerLimit = (item_no) => {
        let upper_limit = $(`#txt_item_no_${item_no}_upper_limit`).val();
        let lower_limit = $(`#txt_item_no_${item_no}_lower_limit`).val();

        if (upper_limit !== '') {
            $(`#span_upper_limit_error_${item_no}`).remove();
            if (upper_limit > 0) {
                let new_upper_limit = upper_limit.replace(/^0+/, '');
                $(`#txt_item_no_${item_no}_upper_limit`).val(new_upper_limit);
            }
        }

        if (lower_limit !== '') {
            $(`#span_lower_limit_error_${item_no}`).remove();
            if (lower_limit > 0) {
                let new_lower_limit = lower_limit.replace(/^0+/, '');
                $(`#txt_item_no_${item_no}_lower_limit`).val(new_lower_limit);
            }
        }

        if (upper_limit !== '' && lower_limit !== '') {
            if (parseInt(lower_limit) > parseInt(upper_limit)) {
                $(`#span_lower_limit_error_${item_no}`).remove();
                $(`#txt_item_no_${item_no}_lower_limit`).after(`<span id="span_lower_limit_error_${item_no}" class="span-error">Lower limit cannot be higher than upper limit</span>`);
                $(`#txt_item_no_${item_no}_lower_limit`).val('');
            } else {
                $(`#span_lower_limit_error_${item_no}`).remove();
            }
        }

    };

    this_igm.SubItemGetMinMax = (item_no, sub_no, min_max_no, min_max_type) => {
        if ($(`#txt_item_no_${item_no}_upper_limit`).val() === '' || $(`#txt_item_no_${item_no}_lower_limit`).val() === '') {
            $(`#span_upper_limit_error_${item_no}`).remove();
            $(`#span_lower_limit_error_${item_no}`).remove();
            $(`#txt_item_no_${item_no}_upper_limit`).after(`<span id="span_upper_limit_error_${item_no}" class="span-error">Required</span>`);
            $(`#txt_item_no_${item_no}_lower_limit`).after(`<span id="span_lower_limit_error_${item_no}" class="span-error">Required</span>`);
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_${min_max_type}_${min_max_no}`).val('');
        } else {
            if ($(`#txt_item_no_${item_no}_upper_limit`).val() !== '' && $(`#txt_item_no_${item_no}_lower_limit`).val() !== '') {
                IGM.ValidateSubItemGetMinMax(item_no, sub_no, min_max_no, min_max_type);
            } else {
                $(`#txt_item_no_${item_no}_sub_no_${sub_no}_${min_max_type}_${min_max_no}`).val('');
            }

        }
    };

    this_igm.ValidateSubItemGetMinMax = (item_no, sub_no, min_max_no, min_max_type) => {
        if (min_max_type === 'min') {
            if (min_max_no === 1) {
                if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).val() === '') {
                    $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                } else {
                    $(`#span_min_error_${min_max_no}`).remove();
                    IGM.ValidateSubItemGetMinMaxWithUpperAndLowerLimit(item_no, sub_no, min_max_no, min_max_type);
                }

            } else {
                if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).val() === '') {
                    $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                } else {
                    for (let min_max_count = min_max_no - 1; min_max_count < min_max_no; min_max_count++) {
                        if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_count}`).val() === '') {


                            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).val('');

                            IGM.ValidateSubItemGetMinMaxPreviousUpperAndLowerLimit(item_no, sub_no, min_max_no);

                        } else {
                            if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no - 1}`).val() !== '') {
                                $(`#span_min_error_${min_max_no}`).remove();
                                IGM.ValidateSubItemGetMinMaxWithUpperAndLowerLimit(item_no, sub_no, min_max_no, min_max_type);
                            }
                        }
                    }
                }
            }
        } else {
            if (min_max_no === 1) {
                if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).val() === '') {
                    $(`#span_min_error_${min_max_no}`).remove();
                    $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).after(`<span id="span_min_error_${min_max_no}" class="span-error">Required</span>`);
                    $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no}`).val('');
                    $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                } else {
                    if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no}`).val() === '') {
                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                        $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    } else {
                        $(`#span_min_error_${min_max_no}`).remove();
                        IGM.ValidateSubItemGetMinMaxWithUpperAndLowerLimit(item_no, sub_no, min_max_no, min_max_type);
                    }
                }

            } else {
                if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no}`).val() === '') {
                    $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                    $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                } else {
                    for (let min_max_count = min_max_no - 1; min_max_count < min_max_no; min_max_count++) {
                        if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_count}`).val() === '') {

                            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no}`).val('');

                            IGM.ValidateSubItemGetMinMaxPreviousUpperAndLowerLimit(item_no, sub_no, min_max_no);

                        } else {
                            if ($(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no - 1}`).val() !== '') {
                                $(`#span_max_error_${min_max_no}`).remove();
                                IGM.ValidateSubItemGetMinMaxWithUpperAndLowerLimit(item_no, sub_no, min_max_no, min_max_type);
                            }
                        }
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

        let upper_limit = $(`#txt_item_no_${item_no}_upper_limit`).val();
        let lower_limit = $(`#txt_item_no_${item_no}_lower_limit`).val();
        let min_max_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_${min_max_type}_${min_max_no}`).val();
        let min_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).val();
        let max_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${min_max_no}`).val();
        let last_max_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_5`).val();
        let array_min_max_judgement_per_sub_item = [];
        let array_min_max_judgement_per_sub_item_overall_NG_count = 0;


        if (parseInt(min_value) > parseInt(max_value)) {

            $(`#span_min_error_${min_max_no}`).remove();
            $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${min_max_no}`).after(`<span id="span_min_error_${min_max_no}" class="span-error">Invalid min and max</span>`);
        } else {
            $(`#span_min_error_${min_max_no}`).remove();

            if (last_max_value !== '') {
                for (let a_count = 1; a_count <= 5; a_count++) {
                    let min_value_loop = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${a_count}`).val();
                    let max_value_loop = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${a_count}`).val();

                    // checking ng min
                    if (min_value !== '') {
                        if (parseInt(min_value_loop) > parseInt(upper_limit)) {
                            array_min_max_judgement_per_sub_item.push('NG');
                        } else {
                            if (parseInt(min_value_loop) < parseInt(lower_limit)) {
                                array_min_max_judgement_per_sub_item.push('NG');
                            } else {
                                array_min_max_judgement_per_sub_item.push('OK');
                            }
                        }
                    }

                    // checking ng max
                    if (max_value !== '') {
                        if (parseInt(max_value_loop) > parseInt(upper_limit)) {
                            array_min_max_judgement_per_sub_item.push('NG');
                        } else {
                            if (parseInt(max_value_loop) < parseInt(lower_limit)) {
                                array_min_max_judgement_per_sub_item.push('NG');
                            } else {
                                array_min_max_judgement_per_sub_item.push('OK');
                            }
                        }
                    }

                    if (a_count === 5) {

                        if (array_min_max_judgement_per_sub_item.length !== 10) {

                            $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                            $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                        } else {
                            // counting ng NG
                            for (let b_count = 0; b_count < array_min_max_judgement_per_sub_item.length; b_count++) {
                                if (array_min_max_judgement_per_sub_item[b_count] === 'NG') {
                                    array_min_max_judgement_per_sub_item_overall_NG_count++;
                                }
                            }
                            array_min_max_judgement_per_sub_item = [];
                        }

                        for (let c_count = 1; c_count <= 5; c_count++) {
                            let min_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_min_${c_count}`).val();
                            let max_value = $(`#txt_item_no_${item_no}_sub_no_${sub_no}_max_${c_count}`).val();

                            //pagka nagbura sa gitna na may last value
                            if (min_value === '') {
                                $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                                $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                            } else {
                                //pagka nagbura sa gitna na may last value
                                if (max_value === '') {
                                    $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                                    $(`#td_item_no_${item_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
                                } else {
                                    //pag lalagay ng sub item judgement
                                    if (array_min_max_judgement_per_sub_item_overall_NG_count > 0) {
                                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="badge badge-danger subitem-visual-judgement">NG</span>`);
                                    } else {
                                        $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="badge badge-success subitem-visual-judgement">OK</span>`);
                                    }

                                    if (c_count === 5) {
                                        IGM.SubitemCalculateOverallJudgement(item_no);
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement`).html(`<span class="input_text_center">N/A</span>`);
            }
        }
    };

    this_igm.SubitemCalculateOverallJudgement = (item_no) => {
        //pag lalagay ng item overall judgement based sa kung ilan ang sub item sa item no na to
        let sub_no_count = $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick');
        let split_total_sub_no_count = sub_no_count.split(',');
        let total_sub_no_count = split_total_sub_no_count[2];
        let overall_NG_count = 0;

        for (let index = 1; index <= total_sub_no_count; index++) {
            array_overall_judgement.push($(`#td_item_no_${item_no}_sub_no_${index}_judgement span`).text());
        }

        for (let index = 0; index < array_overall_judgement.length; index++) {
            if (array_overall_judgement[index] === 'NG') {
                overall_NG_count++;
            }
        }

        if (array_overall_judgement.length === 0) {
            $(`#td_item_no_${item_no}_judgement`).html('N/A');
        } else {
            if (array_overall_judgement.length === 1) {
                if (array_overall_judgement[0] === '') {
                    $(`#td_item_no_${item_no}_judgement`).html('N/A');
                } else {
                    if (overall_NG_count > 0) {
                        $(`#td_item_no_${item_no}_judgement`).html('<span class="badge badge-danger subitem-visual-judgement">NG</span>');
                        array_overall_judgement = [];
                    } else {
                        $(`#td_item_no_${item_no}_judgement`).html('<span class="badge badge-success subitem-visual-judgement">OK</span>');
                        array_overall_judgement = [];
                    }
                }
            } else {
                if (overall_NG_count > 0) {
                    $(`#td_item_no_${item_no}_judgement`).html('<span class="badge badge-danger subitem-visual-judgement">NG</span>');
                    array_overall_judgement = [];
                } else {
                    $(`#td_item_no_${item_no}_judgement`).html('<span class="badge badge-success subitem-visual-judgement">OK</span>');
                    array_overall_judgement = [];
                }
            }
        }
    };

    return this_igm;
})();