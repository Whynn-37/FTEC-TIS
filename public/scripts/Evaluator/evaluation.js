$(document).ready(function () {
    EVALUATE.LoadFinishedInspectionData();
    EVALUATE.LoadDisapprovedInspectionData();
    EVALUATE.LoadAttachments();
});

const EVALUATE = (() => {
    let this_evaluate = {};
    let onkeyup_number_only = 'onkeypress="return event.charCode >= 48 && event.charCode <= 57;"';

    let attachment_count = 5;
    let array_add_to_pdf = [];
    let add_to_pdf_count = 1;

    this_evaluate.LoadFinishedInspectionData = () => {

        $('#tbl_finished_inspection_data').LoadingOverlay('show');
        $.ajax({
            url: `load-inspection-finished`,
            type: 'get',
            dataType: 'json',
            cache: false,
            success: data => {

                if (data.status === 'Success') {
                    $('#tbl_finished_inspection_data').DataTable().destroy();
                    $('#tbody_tbl_finished_inspection_data').empty();

                    let tbody = '';
                    data.data.forEach((value) => {
                        tbody +=
                            `<tr>
                            <td>${value.part_number}</td>
                            <td>${value.revision_number}</td>
                            <td>${value.trial_number}</td>
                            <td>${value.date_finished}</td>
                            <td>${value.judgment}</td>
                            <td>
                                <button class="btn btn-primary btn-block" onclick="EVALUATE.ViewFinishedInspectionData(${value.id},'finished');"><strong class="strong-font"><i class="ti-eye"></i> VIEW DATA</strong></button>
                            </td>
                        </tr>`;
                    });

                    $('#tbody_tbl_finished_inspection_data').html(tbody);

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
            }
        });
    };

    this_evaluate.LoadDisapprovedInspectionData = () => {

        // $('#tbl_disapproved_inspection_data').LoadingOverlay('show');
        // $.ajax({
        //     url: `load-disapproved`,
        //     type: 'post',
        //     dataType: 'json',
        //     cache: false,
        //     success: data => {

        //         $('#tbl_disapproved_inspection_data').DataTable().destroy();
        //         $('#tbody_tbl_disapproved_inspection_data').empty();

        //         let tbody = '';
        //         data.response.forEach((val) => {
        //             tbody += 
        //             `<tr>
        //                 <td>test</td>
        //                 <td>test</td>
        //                 <td>test</td>
        //                 <td>test</td>
        //                 <td>test</td>
        //                 <td>
        //                     <button class="btn btn-danger btn-block" onclick="EVALUATE.ViewFinishedInspectionData('disapproved');"><strong class="strong-font"><i class="ti-eye"></i> VIEW DATA</strong></button>
        //                 </td>
        //             </tr>`;
        //         });


        //         $('#tbody_tbl_disapproved_inspection_data').html(tbody);
        //         $('#tbl_disapproved_inspection_data').DataTable({
        //             "paging": true,
        //             "lengthChange": true,
        //             "searching": true,
        //             "ordering": true,
        //             "info": true,
        //             "autoWidth": true,
        //         });
        //         $('#tbl_finished_inspection_data').LoadingOverlay('hide');
        //     }
        // });
        $('#tbl_disapproved_inspection_data').DataTable({
            "paging": true,
            "lengthChange": true,
            "searching": true,
            "ordering": true,
            "info": true,
            "autoWidth": true,
        });
    };

    this_evaluate.ViewFinishedInspectionData = (id, status) => {
        $('#modal_view_inspection_data').modal('show');

        if (status === 'finished') {
            $('#modal_header').css('background-image', '-webkit-linear-gradient(top left, #009670, #01c293)');
            $('#modal_header').css('background-image', 'linear-gradient(to bottom right, #009670, #01c293)');
            $('#modal_title').html('EVALUATION (FINISHED INSPECTION DATA)');
        } else {
            $('#modal_header').css('background-image', '-webkit-linear-gradient(top left, #c20131, #d81c4b)');
            $('#modal_header').css('background-image', 'linear-gradient(to bottom right, #c20131, #d81c4b)');
            $('#modal_title').html('EVALUATION (DISAPPROVED INSPECTION DATA)');
        }

        $('#div_modal_content').LoadingOverlay('show');

        $.ajax({
            url: `load-inspection-data`,
            type: 'post',
            dataType: 'json',
            cache: false,
            data:{
                _token:_TOKEN,
                id:id
            },
            success: data => {

                $('#div_modal_content').LoadingOverlay('hide');

            }
        });
    };

    this_evaluate.LoadAttachments = () => {

        let files = '';

        for (let index = 1; index <= attachment_count; index++) {
            files += `<div class="vertical-rectangle">
                <img id="img_attachment_${index}" src="${base_url}/template/assets/images/icon/file.png" class="file-image">
                <div class="file-options">
                    <button type="button" class="btn btn-green mb-3"><i class="ti-eye"></i> VIEW FILE</button>
                    <button id="btn_add_to_pdf_${index}" type="button" class="btn btn-green"  onclick="EVALUATE.AddToPdf(${index},'','file_${index}','unchecked');"><i class="ti-plus"></i> ADD TO PDF</button>
                </div>
            </div>`;
        }

        $('#div_attachments').html(files);
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

                    for (let index = 1; index <= attachment_count; index++) {

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

        console.log(array_add_to_pdf)
    };

    this_evaluate.AddToPdfCheckedImage = (count) => {
        return `${base_url}/template/assets/images/icon/check_file_${count}.png`;
    };

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
            <div class="col-md-6"><button type="button" class="btn btn-secondary btn-block btn-sm" onclick="EVALUATE.CancelHinsei(${item_no},'${tools}', '${type}', '${specs}', '${upper_limit}', '${lower_limit}');"><i class="ti-na"></i> CANCEL</button></div>
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
        <button type="button" class="btn btn-secondary btn-block" onclick="EVALUATE.CancelSubItem(${sub_no}, '${coordinates}', '${data1}', '${data2}', '${data3}', '${data4}', '${data5}')"><strong class="strong-font"><i class="ti-na"></i> CANCEL</strong></button>`;

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

    return this_evaluate;
})();
