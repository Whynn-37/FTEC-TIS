$(document).ready(function () {

});

const EVALUATE = (() => {
    let this_evaluate = {};
    let onkeyup_number_only = 'onkeypress="return event.charCode >= 48 && event.charCode <= 57;"';

    this_evaluate.Hinsei = (item_no, tools, type, specs, upper_limit, lower_limit) => {

        $(`#btn_item_no_${item_no}_hinsei`).prop('hidden', true);
        EVALUATE.RemarksInputs(item_no, tools, type, specs, upper_limit, lower_limit);
        EVALUATE.ItemDataInputs(item_no, tools, type, specs, upper_limit, lower_limit);
    };

    this_evaluate.HinseiButton = (item_no, tools, type, specs, upper_limit, lower_limit) => {
        let button = `<button id="btn_item_no_${item_no}_hinsei" type="button" class="btn btn-primary btn-block" onclick="EVALUATE.Hinsei(${item_no},'${tools}', '${type}', '${specs}', '${upper_limit}', '${lower_limit}');"><strong class="strong-font"><i class="ti-notepad"></i> HINSEI</strong></button>`;

        $(`#td_item_no_${item_no}_hinsei`).html(button);
    }

    this_evaluate.ItemDataInputs = (item_no, tools, type, specs, upper_limit, lower_limit) => {

        let td_tools = `<input type="text" class="form-control" name="" id="txt_item_no_${item_no}_tools" value="${tools}">`;
        let td_type = `<input type="text" class="form-control" name="" id="txt_item_no_${item_no}_type" value="${type}">`;
        let td_specs = `<input type="text" class="form-control" name="" id="txt_item_no_${item_no}_specs" value="${specs}">`;
        let td_upper_limit = `<input type="number" class="form-control" name="" id="txt_item_no_${item_no}_upper_limit" value="${upper_limit}">`;
        let td_lower_limit = `<input type="number" class="form-control" name="" id="txt_item_no_${item_no}_lower_limit" value="${lower_limit}">`;

        $(`#td_item_no_${item_no}_tools`).html(td_tools);
        $(`#td_item_no_${item_no}_type`).html(td_type);
        $(`#td_item_no_${item_no}_specs`).html(td_specs);
        $(`#td_item_no_${item_no}_upper_limit`).html(td_upper_limit);
        $(`#td_item_no_${item_no}_lower_limit`).html(td_lower_limit);
    }

    this_evaluate.RemarksInputs = (item_no, tools, type, specs, upper_limit, lower_limit) => {
        let td_remarks = `
        <textarea class="form-control textarea_hinsei" name="" id="txt_item_no_1_hinsei_remarks" placeholder="Enter remarks"></textarea>
        <br>
        <div class="row">
            <div class="col-md-6"><button type="button" class="btn btn-success btn-block btn-sm" onclick="EVALUATE.SaveHinsei(${item_no},'${tools}', '${type}', '${specs}', '${upper_limit}', '${lower_limit}');"><i class="ti-check"></i> SAVE</button></div>
            <div class="col-md-6"><button type="button" class="btn btn-secondary btn-block btn-sm" onclick="EVALUATE.CancelHinsei(${item_no},'${tools}', '${type}', '${specs}', '${upper_limit}', '${lower_limit}');"><i class="ti-close"></i> CANCEL</button></div>
        </div>`;

        $(`#td_item_no_${item_no}_hinsei`).html(td_remarks);
    }

    this_evaluate.SaveHinsei = (item_no, tools, type, specs, upper_limit, lower_limit) => {

        Swal.fire($.extend(swal_options, {
            title: 'Are you sure you want to save?',
        })).then((result) => {
            if (result.value) {
                EVALUATE.HinseiButton(item_no, tools, type, specs, upper_limit, lower_limit);
                $(`#td_item_no_${item_no}_tools`).html(tools);
                $(`#td_item_no_${item_no}_type`).html(type);
                $(`#td_item_no_${item_no}_specs`).html(specs);
                $(`#td_item_no_${item_no}_upper_limit`).html(upper_limit);
                $(`#td_item_no_${item_no}_lower_limit`).html(lower_limit);

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Hinsei successful',
                })

            }
        })
    }

    this_evaluate.CancelHinsei = (item_no, tools, type, specs, upper_limit, lower_limit) => {
        EVALUATE.HinseiButton(item_no, tools, type, specs, upper_limit, lower_limit);

        $(`#td_item_no_${item_no}_tools`).html(tools);
        $(`#td_item_no_${item_no}_type`).html(type);
        $(`#td_item_no_${item_no}_specs`).html(specs);
        $(`#td_item_no_${item_no}_upper_limit`).html(upper_limit);
        $(`#td_item_no_${item_no}_lower_limit`).html(lower_limit);
    }

    this_evaluate.SubItemEditButton = (sub_no, coordinates, data1, data2, data3, data4, data5) => {
        let button = `<button id="btn_edit_sub_no_1" type="button" class="btn btn-success btn-block" onclick="EVALUATE.EditSubItem(${sub_no}, '${coordinates}', '${data1}', '${data2}', '${data3}', '${data4}', '${data5}');"><strong class="strong-font"><i class="ti-pencil-alt"></i> EDIT</strong></button>`

        $(`#td_sub_no_${sub_no}_edit`).html(button);
    }

    this_evaluate.EditSubItem = (sub_no, coordinates, data1, data2, data3, data4, data5) => {
        $(`#btn_edit_sub_no_${sub_no}`).prop('hidden', true);

        let td_coordinates = `<input type="text" class="form-control" name="" id="txt_sub_no_${sub_no}_coordinates" value="${coordinates}">`;
        let td_data1 = `<input type="number" class="form-control" name="" id="txt_sub_no_${sub_no}_data1" value="${data1}">`;
        let td_data2 = `<input type="number" class="form-control" name="" id="txt_sub_no_${sub_no}_data2" value="${data2}">`;
        let td_data3 = `<input type="number" class="form-control" name="" id="txt_sub_no_${sub_no}_data3" value="${data3}">`;
        let td_data4 = `<input type="number" class="form-control" name="" id="txt_sub_no_${sub_no}_data4" value="${data4}">`;
        let td_data5 = `<input type="number" class="form-control" name="" id="txt_sub_no_${sub_no}_data5" value="${data5}">`;
        let td_edit_button = `
        <button type="button" class="btn btn-success btn-block" onclick="EVALUATE.SaveSubItem(${sub_no}, '${coordinates}', '${data1}', '${data2}', '${data3}', '${data4}', '${data5}')"><strong class="strong-font"><i class="ti-check"></i> SAVE</strong></button>
        <button type="button" class="btn btn-secondary btn-block" onclick="EVALUATE.CancelSubItem(${sub_no}, '${coordinates}', '${data1}', '${data2}', '${data3}', '${data4}', '${data5}')"><strong class="strong-font"><i class="ti-close"></i> CANCEL</strong></button>`;

        $(`#td_sub_no_${sub_no}_coordinates`).html(td_coordinates);
        $(`#td_sub_no_${sub_no}_data1`).html(td_data1);
        $(`#td_sub_no_${sub_no}_data2`).html(td_data2);
        $(`#td_sub_no_${sub_no}_data3`).html(td_data3);
        $(`#td_sub_no_${sub_no}_data4`).html(td_data4);
        $(`#td_sub_no_${sub_no}_data5`).html(td_data5);
        $(`#td_sub_no_${sub_no}_edit`).html(td_edit_button);

    }

    this_evaluate.SaveSubItem = (sub_no, coordinates, data1, data2, data3, data4, data5) => {
        Swal.fire($.extend(swal_options, {
            title: 'Are you sure you want to save?',
        })).then((result) => {
            if (result.value) {
                EVALUATE.SubItemEditButton(sub_no, coordinates, data1, data2, data3, data4, data5);
                $(`#td_sub_no_${sub_no}_coordinates`).html(coordinates);
                $(`#td_sub_no_${sub_no}_data1`).html(data1);
                $(`#td_sub_no_${sub_no}_data2`).html(data2);
                $(`#td_sub_no_${sub_no}_data3`).html(data3);
                $(`#td_sub_no_${sub_no}_data4`).html(data4);
                $(`#td_sub_no_${sub_no}_data5`).html(data5);

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Edit successful',
                })

            }
        })
    }

    this_evaluate.CancelSubItem = (sub_no, coordinates, data1, data2, data3, data4, data5) => {
        let button = `<button type="button" id ="btn_edit_sub_no_1" type ="button" class ="btn btn-success btn-block" onclick ="EVALUATE.EditSubItem(1,33,22,11,55,22,99);"> <strong class ="strong-font"> <i class="ti-pencil-alt"></i> EDIT</strong></button>`;

        $(`#td_sub_no_${sub_no}_coordinates`).html(coordinates);
        $(`#td_sub_no_${sub_no}_data1`).html(data1);
        $(`#td_sub_no_${sub_no}_data2`).html(data2);
        $(`#td_sub_no_${sub_no}_data3`).html(data3);
        $(`#td_sub_no_${sub_no}_data4`).html(data4);
        $(`#td_sub_no_${sub_no}_data5`).html(data5);
        $(`#td_sub_no_${sub_no}_edit`).html(button);
    }

    this_evaluate.ApproveData = () => {
        Swal.fire($.extend(swal_options, {
            title: 'Are you sure you want to approve?',
        })).then((result) => {
            if (result.value) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Approve successful',
                })
            }
        })
    }

    this_evaluate.DisapproveData = () => {
        Swal.fire($.extend(swal_options, {
            title: 'Are you sure you want to disapprove?',
        })).then((result) => {
            if (result.value) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Disapprove successful',
                })
            }
        })
    }

    return this_evaluate;
})();
