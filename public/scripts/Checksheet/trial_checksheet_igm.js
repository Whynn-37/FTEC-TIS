$(document).ready(function () {

});

var sub_no_count = 0; // count kung ilan ang sub no
var item_no_count = 1; // count kung ilan ang item no
var new_item_no_count = 0; // count kung ilan ang new_item_no_count
var existing_sub_no_count_per_item;

const IGM = (() => {
    let this_igm = {};

    let array_item_tools = ['BF', 'BG', 'BM', 'CM', 'CMM', 'CS', 'DC', 'DG', 'DI', 'DM', 'DPG', 'DSM', 'EG', 'GB', 'GM', 'GT', 'HG', 'HS', 'HT', 'IR', 'JIG', 'K', 'LS', 'MJ', 'MM', 'MP', 'PG', 'PJ', 'PLG', 'PM', 'PPS', 'PR', 'PS', 'RG', 'RHT', 'RT', 'RW', 'SDC', 'SF', 'SG', 'SR', 'ST', 'TD', 'TG', 'TI', 'TM', 'VAM', 'VHT', 'VSL'];
    let array_item_type = ['A', 'BF', 'G', 'MC', 'MM', 'MMF', 'MT', 'PF', 'RA'];
    let array_overall_judgement = [];


    this_igm.ViewIgmSubNo = (action) => {

        let get_class = $(`#icon_item_no_${action}`).prop('class');

        if (get_class === 'ti-angle-right') {
            $(`#icon_item_no_${action}`).removeClass('ti-angle-right');
            $(`#icon_item_no_${action}`).addClass('ti-angle-down');
            $(`#tr_sub_no_${action}`).prop('hidden', false);
            $(`#tr_sub_no_column_${action}`).prop('hidden', false);
            $(`#th_igm_item_no_extra_column_${action}`).prop('hidden', false);
        } else {
            $(`#icon_item_no_${action}`).removeClass('ti-angle-down');
            $(`#icon_item_no_${action}`).addClass('ti-angle-right');
            $(`#tr_sub_no_${action}`).prop('hidden', true);
            $(`#tr_sub_no_column_${action}`).prop('hidden', true);
            $(`#th_igm_item_no_extra_column_${action}`).prop('hidden', true);
        }
    };

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
                if (previous_item_no === item_no_count) {
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
                // PAGKA MAY EXISTING SUB ITEM, HINDI PA TAPOS TO.
                if (previous_item_no === item_no_count) {
                    item_no_count++;
                    if (type === 'MM' || type === 'MMF') {
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
                    if (type === 'MM' || type === 'MMF') {
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

    this_igm.AddIgmItemNoHeader = (previous_item_no) => {
        let item_no_holder = parseInt(previous_item_no) + 1;

        let tr_new_item_header = `
        <tr class="text-white" id="tr_item_no_${item_no_holder}_column">
            <th class="th_new_igm_sub_column">ITEM NO</th>
            <th class="th_new_igm_sub_column">TOOLS</th>
            <th class="th_new_igm_sub_column">TYPE</th>
            <th class="th_new_igm_sub_column">SPECS</th>
            <th class="th_new_igm_sub_column">UPPER LIMIT</th>
            <th class="th_new_igm_sub_column">LOWER LIMIT</th>
            <th class="th_new_igm_sub_column">JUDGEMENT</th>
            <th class="th_new_igm_sub_column" id="th_igm_item_no_${item_no_holder}_extra_column" colspan="7" hidden></th>
        </tr>`;
        return tr_new_item_header;
    };

    this_igm.AddIgmItemNoInputs = (type, tr_new_item_header, previous_item_no, new_item_no_count_holder, existing_sub_no_count) => {
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
                    <input list="item_tools_list" id="slc_item_no_${item_no_holder}_tools" type="text" class="form-control input_text_center" placeholder="Select tools">
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

    this_igm.SelectItemType = (item_no, existing_sub_no_count) => {
        let type = $(`#slc_item_no_${item_no}_type`).val();

        if (type === 'MM' || type === 'MMF') {
            $(`#txt_item_no_${item_no}_specs`).prop('disabled', false);
            $(`#txt_item_no_${item_no}_upper_limit`).prop('disabled', false);
            $(`#txt_item_no_${item_no}_lower_limit`).prop('disabled', false);
        } else {
            $(`#txt_item_no_${item_no}_specs`).prop('disabled', true);
            $(`#txt_item_no_${item_no}_upper_limit`).prop('disabled', true);
            $(`#txt_item_no_${item_no}_lower_limit`).prop('disabled', true);
        }

        if (existing_sub_no_count === 1) {
            if (type === 'MM' || type === 'MMF') {
                $(`#tr_item_no_${item_no}_sub_no_column`).remove();
                $(`#tr_item_no_${item_no}_sub_no_1`).remove();
                $(`#tr_item_no_${item_no}_sub_no_1`).remove();
                $(`#tr_item_no_${item_no}_sub_no_max_1`).remove();
            } else {
                $(`#tr_item_no_${item_no}_sub_no_column`).remove();
                $(`#tr_item_no_${item_no}_sub_no_1`).remove();
                $(`#tr_item_no_${item_no}_sub_no_max_1`).remove();
            }

            $(`#slc_item_no_${item_no}_type`).attr('onchange', `IGM.SelectItemType(${item_no},0);`)

            IGM.AddIgmSubNo(`${type}`, item_no, 0, 0);
            $(`#a_add_igm_item_no_${item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${item_no},1,0);`)
            $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${item_no},1,0);`)
            $(`#slc_item_no_${item_no}_type`).attr('onchange', `IGM.SelectItemType(${item_no},1);`);
            $(`#a_add_igm_item_no_${item_no}_sub_no`).prop('hidden', false);
        } else {
            IGM.AddIgmSubNo(`${type}`, item_no, 0, 0);
            $(`#a_add_igm_item_no_${item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${item_no},1,0);`)
            $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${item_no},1,0);`)
            $(`#slc_item_no_${item_no}_type`).attr('onchange', `IGM.SelectItemType(${item_no},1);`);
            $(`#a_add_igm_item_no_${item_no}_sub_no`).prop('hidden', false);
        }
    };

    this_igm.AddIgmItemNoInputsBetweenChangeId = (type, previous_item_no, existing_sub_no_count, added_item_no_between_count) => {
        var added_item_no_between_count_holder = added_item_no_between_count;
        var added_item_no_between_count_increment = parseInt(added_item_no_between_count) + 1;
        added_item_no_between_count_holder++;
        // PAG AADJUST NG added_item_no_between_count IDEBUG BAKA MALI MALI ANG PAG CCHANGE
        for (let count = previous_item_no; count <= new_item_no_count; count++) {

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
            if (count === new_item_no_count) {
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

        $(`#span_item_no_${previous_item_no_holder}_label`).text(`${next_item_no_holder}`);
        $(`#span_item_no_${previous_item_no_holder}_label`).attr('id', `span_item_no_${next_item_no_holder}_1_label`);
        $(`#tr_item_no_${previous_item_no_holder}`).attr('id', `tr_item_no_${next_item_no_holder}_1`);

        $(`#a_add_igm_item_no_${previous_item_no_holder}`).attr('id', `a_add_igm_item_no_${next_item_no_holder}_1`);
        $(`#a_add_igm_item_no_${next_item_no_holder}_1`).attr('onclick', `${new_add_igm_item_no_onclick_value}`);

        $(`#a_add_igm_item_no_${previous_item_no_holder}_sub_no`).attr('id', `a_add_igm_item_no_${next_item_no_holder}_1_sub_no`);
        $(`#a_add_igm_item_no_${next_item_no_holder}_1_sub_no`).attr('onclick', `${new_add_igm_sub_no_onclick_value}`);

        $(`#slc_item_no_${previous_item_no_holder}_type`).attr('id', `slc_item_no_${next_item_no_holder}_1_type`);
        $(`#slc_item_no_${next_item_no_holder}_1_type`).attr('onchange', `IGM.SelectItemType(${next_item_no_holder},${split_add_igm_item_no_onclick_value[2]});`);


        $(`#slc_item_no_${previous_item_no_holder}_tools`).attr('id', `slc_item_no_${next_item_no_holder}_1_tools`);
        $(`#slc_item_no_${previous_item_no_holder}_type`).attr('id', `slc_item_no_${next_item_no_holder}_1_type`);
        $(`#txt_item_no_${previous_item_no_holder}_specs`).attr('id', `txt_item_no_${next_item_no_holder}_1_specs`);
        $(`#txt_item_no_${previous_item_no_holder}_upper_limit`).attr('id', `txt_item_no_${next_item_no_holder}_1_upper_limit`);
        $(`#txt_item_no_${previous_item_no_holder}_lower_limit`).attr('id', `txt_item_no_${next_item_no_holder}_1_lower_limit`);
        $(`#td_item_no_${previous_item_no_holder}_judgement`).attr('id', `td_item_no_${next_item_no_holder}_1_judgement`);

        $(`#a_remove_igm_item_no_${previous_item_no_holder}`).attr('id', `a_remove_igm_item_no_${next_item_no_holder}_1`);
        $(`#a_remove_igm_item_no_${previous_item_no_holder}_1`).attr('onclick', `IGM.RemoveIgmItemNo(${next_item_no_holder});`);

        $(`#btn_validate_sub_no_count_${previous_item_no_holder}`).attr('id', `btn_validate_sub_no_count_${next_item_no_holder}_1`);
        $(`#btn_validate_sub_no_count_${next_item_no_holder}_1`).attr('onclick', `${new_validate_sub_no_count_onclick_value}`);

        IGM.AddIgmItemNoInputsBetweenChangeSubNoIdToTemporaryId(type, split_add_igm_item_no_onclick_value, previous_item_no_holder, next_item_no_holder);
    };

    this_igm.AddIgmItemNoInputsBetweenChangeTemporaryIdToOriginalId = (type, previous_item_no, existing_sub_no_count, added_item_no_between_count) => {
        next_item_no_holder = parseInt(previous_item_no) + 2;
        added_item_no_between_count_holder = added_item_no_between_count + new_item_no_count;

        for (let count = 1; count <= added_item_no_between_count_holder; count++) {

            $(`#th_igm_item_no_${next_item_no_holder}_1_extra_column`).attr('id', `th_igm_item_no_${next_item_no_holder}_extra_column`);

            $(`#tr_item_no_${next_item_no_holder}_1_column`).attr('id', `tr_item_no_${next_item_no_holder}_column`);
            $(`#tr_item_no_${next_item_no_holder}_1_sub_no_column`).attr('id', `tr_item_no_${next_item_no_holder}_sub_no_column`);

            $(`#span_item_no_${next_item_no_holder}_1_label`).attr('id', `span_item_no_${next_item_no_holder}_label`);
            $(`#tr_item_no_${next_item_no_holder}_1`).attr('id', `tr_item_no_${next_item_no_holder}`);

            $(`#a_add_igm_item_no_${next_item_no_holder}_1`).attr('id', `a_add_igm_item_no_${next_item_no_holder}`);
            // $(`#a_add_igm_item_no_${next_item_no_holder}_1_1`).attr('onclick', `IGM.AddIgmItemNo('${type}',${next_item_no_holder},0);`);

            $(`#a_add_igm_item_no_${next_item_no_holder}_1_sub_no`).attr('id', `a_add_igm_item_no_${next_item_no_holder}_sub_no`);
            // $(`#a_add_igm_item_no_${next_item_no_holder}_1_1_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${next_item_no_holder},${existing_sub_no_count},${added_item_no_between_count});`);
            $(`#slc_item_no_${next_item_no_holder}_1_type`).attr('id', `slc_item_no_${next_item_no_holder}_type`);


            $(`#slc_item_no_${next_item_no_holder}_1_tools`).attr('id', `slc_item_no_${next_item_no_holder}_tools`);
            $(`#slc_item_no_${next_item_no_holder}_1_type`).attr('id', `slc_item_no_${next_item_no_holder}_type`);
            $(`#txt_item_no_${next_item_no_holder}_1_specs`).attr('id', `txt_item_no_${next_item_no_holder}_specs`);
            $(`#txt_item_no_${next_item_no_holder}_1_upper_limit`).attr('id', `txt_item_no_${next_item_no_holder}_upper_limit`);
            $(`#txt_item_no_${next_item_no_holder}_1_lower_limit`).attr('id', `txt_item_no_${next_item_no_holder}_lower_limit`);
            $(`#td_item_no_${next_item_no_holder}_1_judgement`).attr('id', `td_item_no_${next_item_no_holder}_judgement`);

            $(`#a_remove_igm_item_no_${next_item_no_holder}_1`).attr('id', `a_remove_igm_item_no_${next_item_no_holder}`);
            // $(`#a_remove_igm_item_no_${next_item_no_holder}`).attr('onclick', `IGM.RemoveIgmItemNo(${next_item_no_holder});`);
            $(`#btn_validate_sub_no_count_${next_item_no_holder}_1`).attr('id', `btn_validate_sub_no_count_${next_item_no_holder}`);

            next_item_no_holder++;
        }
    };

    this_igm.AddIgmItemNoInputsBetweenChangeSubNoIdToTemporaryId = (type, split_add_igm_item_no_onclick_value, previous_item_no_holder, next_item_no_holder) => {

        // PAG RERENAME NG REMOVE SUB NO ID BASED SA BAGONG ITEM NO
        let item_no_existing_sub_no_count = split_add_igm_item_no_onclick_value[2];
        if (item_no_existing_sub_no_count > 0) {
            for (let remove_sub_no_count = 1; remove_sub_no_count <= item_no_existing_sub_no_count; remove_sub_no_count++) {

                let remove_sub_no_onclick_value = $(`#a_remove_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}`).attr('onclick')
                let split_remove_sub_no_onclick_value = remove_sub_no_onclick_value.split(',');

                let new_remove_sub_no_onclick_value = `${split_remove_sub_no_onclick_value[0]},${split_remove_sub_no_onclick_value[1]},${next_item_no_holder},${split_remove_sub_no_onclick_value[3]},${split_remove_sub_no_onclick_value[4]}`;

                $(`#a_remove_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}`).attr('id', `a_remove_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_1`)
                $(`#a_remove_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_1`).attr('onclick', `${new_remove_sub_no_onclick_value}`)
                $(`#tr_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}`).attr('id', `tr_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_1`)

                $(`#th_tr_item_no_${previous_item_no_holder}_sub_no_column_rowspan`).attr('id', `th_tr_item_no_${next_item_no_holder}_sub_no_column_rowspan_1`)

                if (type === 'MM' || type === 'MMF') {
                    $(`#tr_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}`).attr('id', `tr_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_1`);
                    //coordinates
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_coordinates`).attr('id', `txt_item_no_${next_item_no_holder}_sub_no_${sub_no_holder}_coordinates_1`);
                    //min
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_min_1`).attr('id', `td_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_min_1_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_min_2`).attr('id', `td_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_min_2_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_min_3`).attr('id', `td_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_min_3_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_min_4`).attr('id', `td_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_min_4_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_min_5`).attr('id', `td_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_min_5_1`);
                    //judgement
                    $(`#td_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_judgement`).attr('id', `td_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_judgement_1`);
                    //max
                    $(`#tr_item_no_${previous_item_no_holder}_sub_no_max_${remove_sub_no_count}`).attr('id', `tr_item_no_${next_item_no_holder}_sub_no_max_${remove_sub_no_count}_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_max_1`).attr('id', `td_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_max_1_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_max_2`).attr('id', `td_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_max_2_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_max_3`).attr('id', `td_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_max_3_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_max_4`).attr('id', `td_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_max_4_1`);
                    $(`#txt_item_no_${previous_item_no_holder}_sub_no_${remove_sub_no_count}_max_5`).attr('id', `td_item_no_${next_item_no_holder}_sub_no_${remove_sub_no_count}_max_5_1`);

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

            if (existing_sub_no_count_value > 0) {
                for (let b_count = 1; b_count <= existing_sub_no_count_value; b_count++) {

                    $(`#a_remove_item_no_${a_count}_sub_no_${b_count}_1`).attr('id', `a_remove_item_no_${a_count}_sub_no_${b_count}`);
                    $(`#tr_item_no_${a_count}_sub_no_${b_count}_1`).attr('id', `tr_item_no_${a_count}_sub_no_${b_count}`)

                    $(`#th_tr_item_no_${a_count}_sub_no_column_rowspan_1`).attr('id', `th_tr_item_no_${a_count}_sub_no_column_rowspan`)

                    if (type === 'MM' || type === 'MMF') {
                        $(`#tr_item_no_${a_count}_sub_no_${b_count}_1`).attr('id', `tr_item_no_${a_count}_sub_no_${remove_sub_no_count}`);
                        //coordinates
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_coordinates_1`).attr('id', `txt_item_no_${a_count}_sub_no_${sub_no_holder}_coordinates`);
                        //min
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_min_1_1`).attr('id', `td_item_no_${a_count}_sub_no_${b_count}_min_1`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_min_2_1`).attr('id', `td_item_no_${a_count}_sub_no_${b_count}_min_2`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_min_3_1`).attr('id', `td_item_no_${a_count}_sub_no_${b_count}_min_3`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_min_4_1`).attr('id', `td_item_no_${a_count}_sub_no_${b_count}_min_4`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_min_5_1`).attr('id', `td_item_no_${a_count}_sub_no_${b_count}_min_5`);
                        //judgement
                        $(`#td_item_no_${a_count}_sub_no_${b_count}_judgement_1`).attr('id', `td_item_no_${a_count}_sub_no_${b_count}_judgement`);
                        //max
                        $(`#tr_item_no_${a_count}_sub_no_max_${b_count}_1`).attr('id', `tr_item_no_${a_count}_sub_no_max_${b_count}`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_max_1_1`).attr('id', `td_item_no_${a_count}_sub_no_${b_count}_max_1`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_max_2_1`).attr('id', `td_item_no_${a_count}_sub_no_${b_count}_max_2`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_max_3_1`).attr('id', `td_item_no_${a_count}_sub_no_${b_count}_max_3`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_max_4_1`).attr('id', `td_item_no_${a_count}_sub_no_${b_count}_max_4`);
                        $(`#txt_item_no_${a_count}_sub_no_${b_count}_max_5_1`).attr('id', `td_item_no_${a_count}_sub_no_${b_count}_max_5`);
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
                            $(`#txt_item_no_${a_count}_sub_no_${b_count}_visual_${c_count}`).attr('onclick', `IGM.SubItemSelectVisual(${a_count}, ${b_count}, ${c_count});`);
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
        if (new_item_no_count === 1) {
            $(`#tr_item_no_${item_no}`).remove();
            $('#tfoot_add_igm_item').prop('hidden', false);
            $('#tbl_new_igm').prop('hidden', true);
        } else {
            //VALIDATE SUB NO COUNT
            var btn_validate_sub_no_count_onclick_value = $(`#btn_validate_sub_no_count_${item_no}`).attr('onclick');
            var split_btn_validate_sub_no_count_onclick_value = btn_validate_sub_no_count_onclick_value.split('(');
            var split_split_btn_validate_sub_no_count_onclick_value = split_btn_validate_sub_no_count_onclick_value[1].split(',');
            var existing_sub_no_count_value = split_split_btn_validate_sub_no_count_onclick_value[0];
            //ADD IGM ITEM NO
            var a_add_igm_item_no_onclick_value = $(`#a_add_igm_item_no_${item_no}`).attr('onclick');
            var split_a_add_igm_item_no_onclick_value = a_add_igm_item_no_onclick_value.split('(');
            var split_split_a_add_igm_item_no_onclick_value = split_a_add_igm_item_no_onclick_value[1].split(',');
            var type_value = split_split_a_add_igm_item_no_onclick_value[0];
            var split_split_split_a_add_igm_item_no_onclick_value = split_split_a_add_igm_item_no_onclick_value[3].split(')');
            var added_item_in_between_value = split_split_split_a_add_igm_item_no_onclick_value[0];

            if (item_no - 1 === 1) {
                $('#tr_item_no_main_column').prop('hidden', true);
                $(`#tr_item_no_${item_no}_column`).remove();
            } else {
                $(`#tr_item_no_${item_no}_column`).remove();
            }
            $(`#tr_item_no_${item_no}`).remove();

            if (item_no !== item_no_count) {
                // PARA SA MGA NEXT MAIN ITEM NG NIREMOVE NA MAIN ITEM
                for (let count = item_no; count <= new_item_no_count; count++) {

                    if (count === item_no) {
                        var item_no_holder = item_no;
                        var next_item_no_holder = item_no + 1;
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

                    $(`#tr_item_no_${next_item_no_holder}`).attr('id', `tr_item_no_${item_no_holder}`);
                    $(`#span_item_no_${next_item_no_holder}_label`).text(item_no_holder);
                    $(`#span_item_no_${next_item_no_holder}_label`).attr('id', `span_item_no_${item_no_holder}_label`);
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
                    $(`#txt_item_no_${next_item_no_holder}_specs`).attr('id', `txt_item_no_${item_no_holder}_specs`);
                    $(`#txt_item_no_${next_item_no_holder}_upper_limit`).attr('id', `txt_item_no_${item_no_holder}_upper_limit`);
                    $(`#txt_item_no_${next_item_no_holder}_lower_limit`).attr('id', `txt_item_no_${item_no_holder}_lower_limit`);
                    $(`#td_item_no_${next_item_no_holder}_judgement`).attr('id', `td_item_no_${item_no_holder}_judgement`);

                }
            }
        }
        item_no_count--;
        new_item_no_count--;
    };

    this_igm.AddIgmSubNo = (type, item_no_count, existing_sub_no_count, added_item_no_between_count) => {
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

            if (type === 'MM' || type === 'MMF') {
                var rowspan_count = 3;

            } else {
                rowspan_count = 2;
            }

            tr_sub_no_column += `
            <tr id="tr_item_no_${item_no_count}_sub_no_column" >
                <th id="th_tr_item_no_${item_no_count}_sub_no_column_rowspan" rowspan="${rowspan_count}"></th>
                <th class="th_new_igm_sub_column">SUB NO</th>
                <th class="th_new_igm_sub_column">COORDINATES</th>
                <th class="th_new_igm_sub_column" colspan="5">DATA</th>
                <th class="th_new_igm_sub_column">JUDGEMENT</th>
            </tr>`;

            tr += IGM.AddIgmSubNoInputs(type, next_number, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, added_item_no_between_count);
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
            $('#th_igm_item_no_extra_column').prop('hidden', false);
            tr += IGM.AddIgmSubNoInputs(type, next_number, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, added_item_no_between_count);
            sub_no_count++;

            let previous_sub_no = parseInt(existing_sub_no_count_per_item) - 1
            //CHECK KUNG BAKIT MALI YUNG NALALAGYAN NG ROW 10/22/2020
            if (type === 'MM' || type === 'MMF') {
                $(`#tr_item_no_${item_no_count}_sub_no_max_${previous_sub_no}`).after(tr);
                $(`#th_tr_item_no_${item_no_count}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) + 2);
            } else {
                $(`#tr_item_no_${item_no_count}_sub_no_${previous_sub_no}`).after(tr);
                $(`#th_tr_item_no_${item_no_count}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) + 1);
            }

            IGM.AddSubNoChangeRemoveSubNoOnClick(type, item_no_count, added_item_no_between_count, existing_sub_no_count_per_item);
        }
    };

    this_igm.AddIgmSubNoInputs = (type, next_number, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, added_item_no_between_count) => {
        let tr = '';
        let new_sub_no = existing_sub_no_count_per_item;

        if (type === 'MM' || type === 'MMF') {
            tr += `${tr_sub_no_column}
            <tr id="tr_item_no_${item_no_count}_sub_no_${new_sub_no}" >
                <td style="vertical-align: middle;" rowspan="2">
                    <div class="dropright">
                    <span id="span_item_no_${item_no_count}_sub_no_${new_sub_no}_label">${new_sub_no}</span>
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
                    <input  id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_min_1" type="number" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count}, ${new_sub_no},1,'min')">
                </td>
                <td class="td_sub_no_input">
                    <input  id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_min_2" type="number" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count}, ${new_sub_no},2,'min')">
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_min_3" type="number" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count}, ${new_sub_no},3,'min')">
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_min_4" type="number" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count}, ${new_sub_no},4,'min')">
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_min_5" type="number" class="form-control input_text_center" placeholder="Enter Min" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count}, ${new_sub_no},5,'min')">
                </td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_judgement" style="vertical-align: middle;" rowspan="2" class="td_sub_no_input">N/A</td>
            </tr>
            <tr id="tr_item_no_${item_no_count}_sub_no_max_${new_sub_no}">
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_max_1" type="number" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count}, ${new_sub_no},1,'max')">
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_max_2" type="number" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count}, ${new_sub_no},2,'max')">
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_max_3" type="number" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count}, ${new_sub_no},3,'max')">
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_max_4" type="number" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count}, ${new_sub_no},4,'max')">
                </td>
                <td class="td_sub_no_input">
                    <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_max_5" type="number" class="form-control input_text_center" placeholder="Enter Max" autocomplete="off" onkeyup="IGM.SubItemGetMinMax(${item_no_count}, ${new_sub_no},5,'max')">
                </td>
            </tr>`;
        } else {
            tr += `${tr_sub_no_column}<tr id="tr_item_no_${item_no_count}_sub_no_${new_sub_no}" >
            <td>
                <div class="dropright">
                    <span id="span_item_no_${item_no_count}_sub_no_${new_sub_no}_label">${new_sub_no}</span>
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
                <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_1" type="text" class="form-control input_text_center input-pointer" placeholder="Enter Visual" onclick="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no},1);" readonly>
            </td>
            <td class="td_sub_no_input">
                <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_2" type="text" class="form-control input_text_center input-pointer" placeholder="Enter Visual" onclick="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no},2);" readonly>
            </td>
            <td class="td_sub_no_input">
                <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_3" type="text" class="form-control input_text_center input-pointer" placeholder="Enter Visual" onclick="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no},3);" readonly>
            </td>
            <td class="td_sub_no_input">
                <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_4" type="text" class="form-control input_text_center input-pointer" placeholder="Enter Visual" onclick="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no},4);" readonly>
            </td>
            <td class="td_sub_no_input">
                <input id="txt_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_5" type="text" class="form-control input_text_center input-pointer" placeholder="Enter Visual" onclick="IGM.SubItemSelectVisual(${item_no_count},${new_sub_no},5);" readonly>
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

        if (existing_sub_no_count_per_item === 1) {

            $(`#tr_item_no_${item_no}_sub_no_column`).remove();
            if (type === 'MM' || type === 'MMF') {
                $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
                $(`#tr_item_no_${item_no}_sub_no_max_${sub_no}`).remove();
            } else {
                $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
            }
            $(`#th_igm_item_no_${item_no}_extra_column`).prop('hidden', true);

            sub_no_count--;

        } else {
            if (existing_sub_no_count_per_item === sub_no) {
                if (type === 'MM' || type === 'MMF') {
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
                if (type === 'MM' || type === 'MMF') {
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
                    if (type === 'MM' || type === 'MMF') {
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
        IGM.SubitemCalculateVisualOverallJudgement(item_no, sub_no);
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
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_coordinates`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_coordinates`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_visual_1`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_visual_1`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_visual_2`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_visual_2`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_visual_3`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_visual_3`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_visual_4`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_visual_4`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_visual_5`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_visual_5`);
        //judgement
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_judgement`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_judgement`);

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
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_min_1`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_min_1`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_min_2`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_min_2`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_min_3`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_min_3`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_min_4`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_min_4`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_min_5`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_min_5`);
        //max
        $(`#tr_item_no_${item_no}_sub_no_max_${next_sub_no_holder}`).attr('id', `tr_item_no_${item_no}_sub_no_max_${sub_no_holder}`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_max_1`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_max_1`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_max_2`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_max_2`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_max_3`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_max_3`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_max_4`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_max_4`);
        $(`#txt_item_no_${item_no}_sub_no_${next_sub_no_holder}_max_5`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_max_5`);

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

            IGM.SubitemCalculateVisualOverallJudgement(item_no, sub_no);
        }
    }

    this_igm.SubitemCalculateVisualOverallJudgement = (item_no, sub_no) => {

        let overall_NG_count = 0;
        let sub_no_count = $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick');
        let split_total_sub_no_count = sub_no_count.split(',');
        let total_sub_no_count = split_total_sub_no_count[2];

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
            if (overall_NG_count > 0) {
                $(`#td_item_no_${item_no}_judgement`).html('<span class="badge badge-danger subitem-visual-judgement">NG</span>');
                array_overall_judgement = [];
            } else {
                $(`#td_item_no_${item_no}_judgement`).html('<span class="badge badge-success subitem-visual-judgement">OK</span>');
                array_overall_judgement = [];
            }
        }
    };

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
        let overall_NG_count = 0;


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

                                    //pag lalagay ng item overall judgement based sa kung ilan ang sub item sa item no na to
                                    let sub_no_count = $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick');
                                    let split_total_sub_no_count = sub_no_count.split(',');
                                    let total_sub_no_count = split_total_sub_no_count[2];

                                    for (let d_count = 1; d_count <= total_sub_no_count; d_count++) {

                                        let judgement_per_sub_item = $(`#td_item_no_${item_no}_sub_no_${sub_no}_judgement span`).text();

                                        if (judgement_per_sub_item === 'NG') {
                                            $(`#td_item_no_${item_no}_judgement`).html(`<span class="badge badge-danger subitem-visual-judgement">NG</span>`);
                                            array_overall_judgement = [];
                                        } else {
                                            $(`#td_item_no_${item_no}_judgement`).html(`<span class="badge badge-success subitem-visual-judgement">OK</span>`);
                                            array_overall_judgement = [];
                                        }
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

    return this_igm;
})();
