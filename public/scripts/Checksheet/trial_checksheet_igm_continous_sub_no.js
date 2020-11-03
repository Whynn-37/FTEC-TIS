$(document).ready(function () {

});

const IGM = (() => {
    let this_igm = {};

    var sub_no_count = 0; // count kung ilan ang sub no
    var item_no_count = 1; // count kung ilan ang item no
    var new_item_no_count = 0; // count kung ilan ang new_item_no_count
    var existing_sub_no_count_per_item;

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
            tr_new_item = IGM.AddIgmItemNoInputs(type, '', previous_item_no, item_no_count, existing_sub_no_count);
            $('#tbody_tbl_new_igm').html(tr_new_item);
            $('#tfoot_add_igm_item').prop('hidden', true);
        } else {
            if (existing_sub_no_count === 0) {
                // kung yung aaddan ng item ay yung last item no
                if (previous_item_no === item_no_count) {
                    item_no_count++;
                    new_item_no_count++;
                    tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no, item_no_count, existing_sub_no_count);
                    $(`#tr_item_no_${previous_item_no}`).after(tr_new_item);
                } else {
                    item_no_count++;
                    IGM.AddIgmItemNoInputsBetweenChangeId(type, previous_item_no, existing_sub_no_count, added_item_no_between_count);
                    new_item_no_count++;
                    tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no, new_item_no_count, existing_sub_no_count);
                    $(`#tr_item_no_${previous_item_no}`).after(tr_new_item);
                }

            } else {

                // PAGKA MAY EXISTING SUB ITEM, HINDI PA TAPOS TO.
                if (previous_item_no === item_no_count) {
                    item_no_count++;
                    new_item_no_count++;
                    if (type === 'MC') {
                        tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no, item_no_count, existing_sub_no_count);
                        $(`#tr_item_no_${previous_item_no}_sub_no_${existing_sub_no_count}`).after(tr_new_item);
                    } else {
                        tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no, item_no_count, existing_sub_no_count);
                        $(`#tr_item_no_${previous_item_no}_sub_no_max_${existing_sub_no_count}`).after(tr_new_item);
                    }
                } else {
                    item_no_count++;
                    new_item_no_count++;
                    IGM.AddIgmItemNoInputsBetweenChangeId(type, previous_item_no, existing_sub_no_count, added_item_no_between_count);
                    if (type === 'MC') {
                        tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no, item_no_count, existing_sub_no_count);
                        $(`#tr_item_no_${previous_item_no}_sub_no_${existing_sub_no_count}`).after(tr_new_item);
                    } else {
                        tr_new_item = IGM.AddIgmItemNoInputs(type, IGM.AddIgmItemNoHeader(previous_item_no), previous_item_no, item_no_count, existing_sub_no_count);
                        $(`#tr_item_no_${previous_item_no}_sub_no_max_${existing_sub_no_count}`).after(tr_new_item);
                    }
                }

            }
        }
        $(`#a_add_igm_item_no_${previous_item_no}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${previous_item_no},${existing_sub_no_count},${added_item_no_between_count});`);
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

        if (previous_item_no === item_no_count) {
            var item_no_holder = item_no_count;

        } else {
            item_no_holder = parseInt(previous_item_no) + 1;
        }
        let tr_new_item = '';

        // if (existing_sub_no_count === 0) {
        //     var existing_sub_no_count_holder = 0
        // } else {
        //     existing_sub_no_count_holder = existing_sub_no_count;
        // }
        let existing_sub_no_count_holder = 0

        if (type === 'MC') {
            tr_new_item += `${tr_new_item_header}
            <tr id="tr_item_no_${item_no_holder}">
                <td>
                    <div class="dropright">
                        <span id="span_item_no_${item_no_holder}_label">${item_no_holder}</span>
                        <button id="btn_validate_sub_no_count_${item_no_holder}" class="dropdown-toggle button_dropdown" type="button" data-toggle="dropdown" style="margin-left: 20%;"  onclick="IGM.ValidateSubNoCount(${existing_sub_no_count_holder},${item_no_holder});"></button>
                        <div class="dropdown-menu">
                            <a id="a_add_igm_item_no_${item_no_holder}" class="dropdown-item" onclick="IGM.AddIgmItemNo('${type}',${item_no_holder},${existing_sub_no_count_holder},0);" style="cursor: pointer"><i class="ti-plus"></i> ADD ITEM</a>
                            <a id="a_add_igm_item_no_${item_no_holder}_sub_no" class="dropdown-item" onclick="IGM.AddIgmSubNo('${type}',${item_no_holder},${existing_sub_no_count_holder},0);" style="cursor: pointer"><i class="ti-plus"></i> ADD SUB ITEM</a>
                            <a id="a_remove_igm_item_no_${item_no_holder}" class="dropdown-item"><i class="ti-close"></i> REMOVE</a>
                        </div>
                    </div>
                </td> 
                <td><input id="txt_item_no_${item_no_holder}_tools" type="text" class="form-control form-control-sm input_text_center" value="-" disabled></td>
                <td><input id="txt_item_no_${item_no_holder}_type" type="text" class="form-control form-control-sm input_text_center" placeholder="Enter type"></td>
                <td><input id="txt_item_no_${item_no_holder}_specs" type="text" class="form-control form-control-sm input_text_center" value="-" disabled></td>
                <td><input id="txt_item_no_${item_no_holder}_upper_limit" type="text" class="form-control form-control-sm input_text_center" value="-" disabled></td>
                <td><input id="txt_item_no_${item_no_holder}_lower_limit" type="text" class="form-control form-control-sm input_text_center" placeholder="Enter lower limit"></td>
                <td id="td_item_no_${item_no_holder}_judgement" class="input_text_center">GOOD/NG</td>
            </tr>`;
        } else {
            tr_new_item += `${tr_new_item_header}
            <tr id="tr_item_no_${item_no_holder}">
                <td>
                    <div class="dropright">
                        <span id="span_item_no_${item_no_holder}_label">${item_no_holder}</span>
                        <button id="btn_validate_sub_no_count_${item_no_holder}" class="dropdown-toggle button_dropdown" type="button" data-toggle="dropdown" style="margin-left: 20%;"  onclick="IGM.ValidateSubNoCount(${existing_sub_no_count_holder},${item_no_holder});"></button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" onclick="IGM.AddIgmItemNo('${type}',${sub_no_count},${existing_sub_no_count_holder},0);" style="cursor: pointer"><i class="ti-plus"></i> ADD ITEM</a>
                            <a class="dropdown-item" onclick="IGM.AddIgmSubNo('${type}',${item_no_holder},${existing_sub_no_count_holder},0);" style="cursor: pointer"><i class="ti-plus"></i> ADD SUB ITEM</a>
                            <a id="a_remove_igm_item_no_${item_no_holder}" class="dropdown-item"><i class="ti-close"></i> REMOVE</a>
                        </div>
                    </div>
                </td> 
                <td><input id="txt_item_no_${item_no_holder}_tools" type="text" class="form-control form-control-sm nput_text_center" placeholder="Enter tools"></td>
                <td><input id="txt_item_no_${item_no_holder}_type" type="text" class="form-control form-control-sm nput_text_center" placeholder="Enter type"></td>
                <td><input id="txt_item_no_${item_no_holder}_specs" type="text" class="form-control form-control-sm nput_text_center" placeholder="Enter specs"></td>
                <td><input id="txt_item_no_${item_no_holder}_upper_limit" type="text" class="form-control form-control-sm nput_text_center" placeholder="Enter upper limit"></td>
                <td><input id="txt_item_no_${item_no_holder}_lower_limit" type="text" class="form-control form-control-sm nput_text_center" placeholder="Enter lower limit"></td>
                <td id="td_item_no_${item_no_holder}_judgement" class="input_text_center">GOOD/NG</td>
            </tr>`;
        }

        return tr_new_item;
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

                IGM.AddIgmItemNoInputsBetweenChangeIdIfStatement(type, existing_sub_no_count, previous_item_no_holder, next_item_no_holder, added_item_no_between_count_holder);
                $(`#a_add_igm_item_no_${previous_item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${previous_item_no},${existing_sub_no_count},${added_item_no_between_count_increment});`);

            } else {
                next_item_no_holder = parseInt(count) + 2;
                previous_item_no_holder = parseInt(count) + 1;
                if (added_item_no_between_count_holder >= 1) {
                    IGM.AddIgmItemNoInputsBetweenChangeIdIfStatement(type, existing_sub_no_count, previous_item_no_holder, next_item_no_holder, added_item_no_between_count_holder);
                    $(`#a_add_igm_item_no_${previous_item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${previous_item_no},${existing_sub_no_count},${added_item_no_between_count_increment});`);

                } else {
                    $(`#a_add_igm_item_no_${previous_item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${previous_item_no},${existing_sub_no_count},${added_item_no_between_count_increment});`);
                    $(`#span_item_no_${previous_item_no_holder}_label`).text(`${next_item_no_holder}`);
                    $(`#span_item_no_${previous_item_no_holder}_label`).attr('id', `span_item_no_${next_item_no_holder}_label`);
                    $(`#tr_item_no_${previous_item_no_holder}_column`).attr('id', `tr_item_no_${next_item_no_holder}_column`);
                    $(`#tr_item_no_${previous_item_no_holder}`).attr('id', `tr_item_no_${next_item_no_holder}`);
                    $(`#a_add_igm_item_no_${previous_item_no_holder}`).attr('id', `a_add_igm_item_no_${next_item_no_holder}`);
                    $(`#a_add_igm_item_no_${previous_item_no_holder}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${next_item_no_holder},0);`);
                    $(`#a_add_igm_item_no_${previous_item_no_holder}_sub_no`).attr('id', `a_add_igm_item_no_${next_item_no_holder}_sub_no`);
                    $(`#a_add_igm_item_no_${previous_item_no_holder}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${next_item_no_holder},${existing_sub_no_count},${added_item_no_between_count});`);
                    $(`#txt_item_no_${previous_item_no_holder}_tools`).attr('id', `txt_item_no_${next_item_no_holder}_tools`);
                    $(`#txt_item_no_${previous_item_no_holder}_type`).attr('id', `txt_item_no_${next_item_no_holder}_type`);
                    $(`#txt_item_no_${previous_item_no_holder}_specs`).attr('id', `txt_item_no_${next_item_no_holder}_specs`);
                    $(`#txt_item_no_${previous_item_no_holder}_upper_limit`).attr('id', `txt_item_no_${next_item_no_holder}_upper_limit`);
                    $(`#txt_item_no_${previous_item_no_holder}_lower_limit`).attr('id', `txt_item_no_${next_item_no_holder}_lower_limit`);
                    $(`#td_item_no_${previous_item_no_holder}_judgement`).attr('id', `td_item_no_${next_item_no_holder}_judgement`);

                    $(`#a_remove_igm_item_no_${previous_item_no_holder}`).attr('id', `a_remove_igm_item_no_${next_item_no_holder}`);
                    $(`#a_remove_igm_item_no_${previous_item_no_holder}`).attr('onclick', `onclick=IGM.RemoveIgmItemNo(${next_item_no_holder});`);
                    $(`#btn_validate_sub_no_count_${previous_item_no_holder}`).attr('id', `btn_validate_sub_no_count_${next_item_no_holder}`);
                    $(`#btn_validate_sub_no_count_${previous_item_no_holder}`).attr('onclick', `onclick=IGM.ValidateSubNoCount(${existing_sub_no_count},${next_item_no_holder});`);
                }
            }

            if (count === new_item_no_count) {
                IGM.AddIgmItemNoInputsBetweenChangeTemporaryIdToOriginalId(type, previous_item_no, existing_sub_no_count, added_item_no_between_count, );
            }
        }
    };

    this_igm.AddIgmItemNoInputsBetweenChangeTemporaryIdToOriginalId = (type, previous_item_no, existing_sub_no_count, added_item_no_between_count) => {
        next_item_no_holder = parseInt(previous_item_no) + 2;
        added_item_no_between_count_holder = added_item_no_between_count + new_item_no_count;

        for (let count = 1; count <= added_item_no_between_count_holder; count++) {
            $(`#tr_item_no_${next_item_no_holder}_1_column`).attr('id', `tr_item_no_${next_item_no_holder}_column`);

            $(`#span_item_no_${next_item_no_holder}_1_label`).attr('id', `span_item_no_${next_item_no_holder}_label`);
            $(`#tr_item_no_${next_item_no_holder}_1`).attr('id', `tr_item_no_${next_item_no_holder}`);
            $(`#a_add_igm_item_no_${next_item_no_holder}_1`).attr('id', `a_add_igm_item_no_${next_item_no_holder}`);
            $(`#a_add_igm_item_no_${next_item_no_holder}_1_1`).attr('onclick', `IGM.AddIgmItemNo('${type}',${next_item_no_holder},0);`);
            $(`#a_add_igm_item_no_${next_item_no_holder}_1_sub_no`).attr('id', `a_add_igm_item_no_${next_item_no_holder}_sub_no`);
            $(`#a_add_igm_item_no_${next_item_no_holder}_1_1_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${next_item_no_holder},${existing_sub_no_count},${added_item_no_between_count});`);
            $(`#txt_item_no_${next_item_no_holder}_1_tools`).attr('id', `txt_item_no_${next_item_no_holder}_tools`);
            $(`#txt_item_no_${next_item_no_holder}_1_type`).attr('id', `txt_item_no_${next_item_no_holder}_type`);
            $(`#txt_item_no_${next_item_no_holder}_1_specs`).attr('id', `txt_item_no_${next_item_no_holder}_specs`);
            $(`#txt_item_no_${next_item_no_holder}_1_upper_limit`).attr('id', `txt_item_no_${next_item_no_holder}_upper_limit`);
            $(`#txt_item_no_${next_item_no_holder}_1_lower_limit`).attr('id', `txt_item_no_${next_item_no_holder}_lower_limit`);
            $(`#td_item_no_${next_item_no_holder}_1_judgement`).attr('id', `td_item_no_${next_item_no_holder}_judgement`);

            $(`#a_remove_igm_item_no_${next_item_no_holder}_1`).attr('id', `a_remove_igm_item_no_${next_item_no_holder}`);
            $(`#a_remove_igm_item_no_${next_item_no_holder}`).attr('onclick', `onclick=IGM.RemoveIgmItemNo(${next_item_no_holder});`);
            $(`#btn_validate_sub_no_count_${next_item_no_holder}_1`).attr('id', `btn_validate_sub_no_count_${next_item_no_holder}`);
            $(`#btn_validate_sub_no_count_${next_item_no_holder}`).attr('onclick', `onclick=IGM.ValidateSubNoCount(${existing_sub_no_count},${next_item_no_holder});`);
            next_item_no_holder++;
        }
    };

    this_igm.AddIgmItemNoInputsBetweenChangeIdIfStatement = (type, existing_sub_no_count, previous_item_no_holder, next_item_no_holder, added_item_no_between_count_holder) => {
        $(`#tr_item_no_${previous_item_no_holder}_column`).attr('id', `tr_item_no_${next_item_no_holder}_1_column`);
        $(`#span_item_no_${previous_item_no_holder}_label`).text(`${next_item_no_holder}`);
        $(`#span_item_no_${previous_item_no_holder}_label`).attr('id', `span_item_no_${next_item_no_holder}_1_label`);
        $(`#tr_item_no_${previous_item_no_holder}`).attr('id', `tr_item_no_${next_item_no_holder}_1`);
        $(`#a_add_igm_item_no_${previous_item_no_holder}`).attr('id', `a_add_igm_item_no_${next_item_no_holder}_1`);
        $(`#a_add_igm_item_no_${next_item_no_holder}_1`).attr('onclick', `IGM.AddIgmItemNo('${type}',${next_item_no_holder},${existing_sub_no_count},${added_item_no_between_count_holder});`);
        $(`#a_add_igm_item_no_${previous_item_no_holder}_sub_no`).attr('id', `a_add_igm_item_no_${next_item_no_holder}_1_sub_no`);
        $(`#a_add_igm_item_no_${next_item_no_holder}_1_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${next_item_no_holder},${existing_sub_no_count},${added_item_no_between_count_holder});`);
        $(`#txt_item_no_${previous_item_no_holder}_tools`).attr('id', `txt_item_no_${next_item_no_holder}_1_tools`);
        $(`#txt_item_no_${previous_item_no_holder}_type`).attr('id', `txt_item_no_${next_item_no_holder}_1_type`);
        $(`#txt_item_no_${previous_item_no_holder}_specs`).attr('id', `txt_item_no_${next_item_no_holder}_1_specs`);
        $(`#txt_item_no_${previous_item_no_holder}_upper_limit`).attr('id', `txt_item_no_${next_item_no_holder}_1_upper_limit`);
        $(`#txt_item_no_${previous_item_no_holder}_lower_limit`).attr('id', `txt_item_no_${next_item_no_holder}_1_lower_limit`);
        $(`#td_item_no_${previous_item_no_holder}_judgement`).attr('id', `td_item_no_${next_item_no_holder}_1_judgement`);

        $(`#a_remove_igm_item_no_${previous_item_no_holder}`).attr('id', `a_remove_igm_item_no_${next_item_no_holder}_1`);
        $(`#a_remove_igm_item_no_${previous_item_no_holder}_1`).attr('onclick', `IGM.RemoveIgmItemNo(${next_item_no_holder});`);
        $(`#btn_validate_sub_no_count_${previous_item_no_holder}`).attr('id', `btn_validate_sub_no_count_${next_item_no_holder}_1`);
        $(`#btn_validate_sub_no_count_${previous_item_no_holder}_1`).attr('onclick', `IGM.ValidateSubNoCount(${existing_sub_no_count},${next_item_no_holder});`);
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
        }
    };

    this_igm.RemoveIgmItemNo = (item_no) => {
        if (new_item_no_count === 1) {
            $(`#tr_item_no_${item_no}`).remove();
            $('#tfoot_add_igm_item').prop('hidden', false);
            $('#tbl_new_igm').prop('hidden', true);
        } else {
            $(`#tr_item_no_${item_no}`).remove();
            $(`#tr_item_no_${item_no}_column`).remove();
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

            if (type === 'MC') {
                var rowspan_count = 2;
            } else {
                rowspan_count = 3;
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
            $('#th_new_igm_item_no_extra_column').prop('hidden', false);
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
            let label_no = sub_no_count - existing_sub_no_count

            if (type === 'MC') {
                $(`#tr_item_no_${item_no_count}_sub_no_${previous_sub_no}`).after(tr);
                $(`#th_tr_item_no_${item_no_count}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) + 1);
                IGM.AddSubNoChangeRemoveSubNoOnClick(type, item_no_count, added_item_no_between_count, existing_sub_no_count_per_item, label_no);

            } else {
                $(`#tr_item_no_${item_no_count}_sub_no_max_${previous_sub_no}`).after(tr);
                $(`#th_tr_item_no_${item_no_count}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) + 2);
                IGM.AddSubNoChangeRemoveSubNoOnClick(type, item_no_count, added_item_no_between_count, existing_sub_no_count_per_item, label_no);

            }


        }
    };

    this_igm.AddIgmSubNoInputs = (type, next_number, tr_sub_no_column, item_no_count, existing_sub_no_count_per_item, added_item_no_between_count) => {
        let tr = '';
        let new_sub_no = existing_sub_no_count_per_item;

        if (type === 'MC') {
            tr += `${tr_sub_no_column}<tr id="tr_item_no_${item_no_count}_sub_no_${new_sub_no}" >
            <td>
                <div class="dropright">
                    <span id="span_sub_no_${next_number}_label">${next_number}</span>
                    <button style="margin-left: 20%;" class="dropdown-toggle button_dropdown" type="button" data-toggle="dropdown"></button>
                    <div class="dropdown-menu">
                        <a id="a_remove_item_no_${item_no_count}_sub_no_${new_sub_no}" class="dropdown-item" onclick="IGM.RemoveSubNo('${type}',${new_sub_no},${item_no_count},${added_item_no_between_count},${existing_sub_no_count_per_item},${next_number});" style="cursor: pointer"><i class="ti-close"></i> REMOVE</a>
                    </div>
                </div>
            </td>
            <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_coordinates" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Coordinates"></td>
            <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_1" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Visual"></td>
            <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_2" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Visual"></td>
            <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_3" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Visual"></td>
            <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_4" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Visual"></td>
            <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_visual_5" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Visual"></td>
            <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_judgement">GOOD/NG</td>
            </tr`;

        } else {
            tr += `${tr_sub_no_column}
            <tr id="tr_item_no_${item_no_count}_sub_no_${new_sub_no}" >
                <td style="vertical-align: middle;" rowspan="2">
                    <div class="dropright">
                    <span id="span_sub_no_${next_number}_label">${next_number}</span>
                    <button style="margin-left: 20%;" class="dropdown-toggle button_dropdown" type="button" data-toggle="dropdown"></button>
                        <div class="dropdown-menu">
                            <a id="a_remove_item_no_${item_no_count}_sub_no_${new_sub_no}" class="dropdown-item" onclick="IGM.RemoveSubNo('${type}',${new_sub_no},${item_no_count},${added_item_no_between_count},${existing_sub_no_count_per_item},${next_number});" style="cursor: pointer;text-align:center;"><i class="ti-close"></i> REMOVE</a>
                        </div>
                    </div>
                </td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_coordinates" style="vertical-align: middle;" rowspan="2"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Coordinates"></td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_min_1" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Min"></td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_min_2" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Min"></td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_min_3" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Min"></td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_min_4" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Min"></td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_min_5" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Min"></td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_judgement" style="vertical-align: middle;" rowspan="2" class="td_sub_no_input">GOOD/NG</td>
            </tr>
            <tr id="tr_item_no_${item_no_count}_sub_no_max_${new_sub_no}">
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_max_1" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Max"></td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_max_2" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Max"></td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_max_3" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Max"></td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_max_4" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Max"></td>
                <td id="td_item_no_${item_no_count}_sub_no_${new_sub_no}_max_5" class="td_sub_no_input"><input type="text" class="form-control form-control-sm input_text_center" placeholder="Enter Max"></td>
            </tr>`;
        }
        return tr;
    };

    this_igm.AddSubNoChangeRemoveSubNoOnClick = (type, item_no_count, added_item_no_between_count, existing_sub_no_count_per_item, label_no) => {

        for (let sub_no = 1; sub_no < existing_sub_no_count_per_item; sub_no++) {
            $(`#a_remove_item_no_${item_no_count}_sub_no_${sub_no}`).attr('onclick', `IGM.RemoveSubNo('${type}',${sub_no},${item_no_count},${added_item_no_between_count},${existing_sub_no_count_per_item},${label_no});`)
            label_no++;
        }
    }

    this_igm.RemoveSubNo = (type, sub_no, item_no, added_item_no_between_count, existing_sub_no_count_per_item, label_no) => {

        let rowspan = $(`#th_tr_item_no_${item_no}_sub_no_column_rowspan`).attr('rowspan');
        let existing_sub_no_count_per_item_holder = existing_sub_no_count_per_item - 1;

        $(`#a_add_igm_item_no_${item_no}`).attr('onclick', `IGM.AddIgmItemNo('${type}',${item_no},${existing_sub_no_count_per_item_holder},${added_item_no_between_count});`);
        $(`#a_add_igm_item_no_${item_no}_sub_no`).attr('onclick', `IGM.AddIgmSubNo('${type}',${item_no},${existing_sub_no_count_per_item_holder},${added_item_no_between_count});`);
        $(`#btn_validate_sub_no_count_${item_no}`).attr('onclick', `IGM.ValidateSubNoCount(${existing_sub_no_count_per_item_holder},${item_no})`);

        if (existing_sub_no_count_per_item === 1) {

            $(`#tr_item_no_${item_no}_sub_no_column`).remove();
            if (type === 'MC') {
                $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();

            } else {
                $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
                $(`#tr_item_no_${item_no}_sub_no_max_${sub_no}`).remove();
            }
            $('#th_new_igm_item_no_extra_column').prop('hidden', true);
            sub_no_count--;

        } else {
            let next_sub_no = parseInt(label_no) + 1;
            if (existing_sub_no_count_per_item === sub_no) {
                if (type === 'MC') {
                    $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
                    $(`#th_tr_item_no_${item_no}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) - 1);
                } else {
                    $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
                    $(`#tr_item_no_${item_no}_sub_no_max_${sub_no}`).remove();
                    $(`#th_tr_item_no_${item_no}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) - 2);
                }

                sub_no_count--;
                existing_sub_no_count_per_item--;

                let label_no_holder = label_no - sub_no_count;
                for (let sub_no = 1; sub_no <= existing_sub_no_count_per_item; sub_no++) {
                    $(`#a_remove_item_no_${item_no}_sub_no_${sub_no}`).attr('onclick', `IGM.RemoveSubNo('${type}',${sub_no},${item_no},${added_item_no_between_count},${existing_sub_no_count_per_item},${label_no_holder});`)
                    label_no_holder++;
                }
            } else {
                if (type === 'MC') {
                    $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
                    $(`#th_tr_item_no_${item_no}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) - 1);
                } else {
                    $(`#tr_item_no_${item_no}_sub_no_${sub_no}`).remove();
                    $(`#tr_item_no_${item_no}_sub_no_max_${sub_no}`).remove();
                    $(`#th_tr_item_no_${item_no}_sub_no_column_rowspan`).attr('rowspan', parseInt(rowspan) - 2);
                }
                sub_no_count--;
                existing_sub_no_count_per_item--;

                let label_no_holder = label_no;
                for (let count = sub_no; count <= sub_no_count; count++) {
                    if (type === 'MC') {
                        IGM.RemoveSubNoChangeIdMC(item_no, sub_no, count, type, next_sub_no, added_item_no_between_count, existing_sub_no_count_per_item, label_no_holder);
                    } else {
                        IGM.RemoveSubNoChangeIdMMAndMMF(item_no, sub_no, count, type, next_sub_no, added_item_no_between_count, existing_sub_no_count_per_item, label_no_holder);
                    }
                    label_no_holder++;
                }
            }

        }
    };

    this_igm.RemoveSubNoChangeIdMC = (item_no, sub_no, count, type, next_sub_no, added_item_no_between_count, existing_sub_no_count_per_item, label_no) => {

        if (count === sub_no) {
            var sub_no_holder = sub_no;
            var next_sub_no_holder = next_sub_no;
        } else {
            sub_no_holder = count;
            next_sub_no_holder = parseInt(count) + 1;
        }
        $(`#tr_item_no_${item_no}_sub_no_${next_sub_no_holder}`).attr('id', `tr_item_no_${item_no}_sub_no_${sub_no_holder}`);
        $(`#span_sub_no_${next_sub_no_holder}_label`).text(label_no);
        $(`#span_sub_no_${next_sub_no_holder}_label`).attr('id', `span_sub_no_${sub_no_holder}_label`);
        //button
        $(`#a_remove_item_no_${item_no}_sub_no_${next_sub_no_holder}`).attr('onclick', `IGM.RemoveSubNo('${type}',${sub_no_holder},${item_no},${added_item_no_between_count},${existing_sub_no_count_per_item},${label_no});`);
        $(`#a_remove_item_no_${item_no}_sub_no_${next_sub_no_holder}`).attr('id', `a_remove_item_no_${item_no}_sub_no_${sub_no_holder}`);
        //visuals
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_coordinates`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_coordinates`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_visual_1`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_visual_1`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_visual_2`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_visual_2`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_visual_3`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_visual_3`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_visual_4`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_visual_4`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_visual_5`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_visual_5`);
        //judgement
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_judgement`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_judgement`);

    };

    this_igm.RemoveSubNoChangeIdMMAndMMF = (item_no, sub_no, count, type, next_sub_no, added_item_no_between_count, existing_sub_no_count_per_item, label_no) => {
        if (count === sub_no) {
            var sub_no_holder = sub_no;
            var next_sub_no_holder = next_sub_no;
        } else {
            var sub_no_holder = count;
            var next_sub_no_holder = parseInt(count) + 1;
        }

        $(`#tr_item_no_${item_no}_sub_no_${next_sub_no_holder}`).attr('id', `tr_item_no_${item_no}_sub_no_${sub_no_holder}`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_judgement`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_judgement`);
        $(`#span_sub_no_${next_sub_no_holder}_label`).text(label_no);
        $(`#span_sub_no_${next_sub_no_holder}_label`).attr('id', `span_sub_no_${sub_no_holder}_label`);

        //button
        $(`#a_remove_item_no_${item_no}_sub_no_${next_sub_no_holder}`).attr('onclick', `IGM.RemoveSubNo('${type}',${sub_no_holder},${item_no},${added_item_no_between_count},${existing_sub_no_count_per_item},${label_no});`);
        $(`#a_remove_item_no_${item_no}_sub_no_${next_sub_no_holder}`).attr('id', `a_remove_item_no_${item_no}_sub_no_${sub_no_holder}`);
        //details
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_coordinates`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_coordinates`);

        //min
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_min_1`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_min_1`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_min_2`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_min_2`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_min_3`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_min_3`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_min_4`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_min_4`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_min_5`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_min_5`);
        //max
        $(`#tr_item_no_${item_no}_sub_no_max_${next_sub_no_holder}`).attr('id', `tr_item_no_${item_no}_sub_no_max_${sub_no_holder}`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_max_1`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_max_1`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_max_2`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_max_2`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_max_3`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_max_3`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_max_4`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_max_4`);
        $(`#td_item_no_${item_no}_sub_no_${next_sub_no_holder}_max_5`).attr('id', `td_item_no_${item_no}_sub_no_${sub_no_holder}_max_5`);

    };

    return this_igm;
})();
