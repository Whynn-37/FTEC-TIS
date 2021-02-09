$(document).ready(function () 
{
    $('#tbl_history_data').DataTable();
    $("#accordion_attachment").remove();
    
});

const HISTORY = (() => {
        
    let this_history = {};
    
    this_history.loadHistoryList = () => 
    {
        $('#tbl_history_data').LoadingOverlay('show');
        let status = $('#slc_status').val();
        let file_button = '';
        let file_button_color = 'btn-primary';
        let button_style = '';
        let history_function = 'APPROVE.ViewFinishedInspectionData';
        let approved_button = 0;

        if(status === 'FOR INSPECTION')
        {
            file_button = 'disabled';
            file_button_color = 'btn-secondary';
            button_style = 'cursor: not-allowed;';
            history_function = 'HISTORY.ViewForInspectionHistory';
        }
        else
        {
            $('.modal-footer').hide();
        }

        if (status === 'APPROVED') 
        {
            approved_button = 1;
        }

        $('#modal_view_inspection_data .modal-title').html(`<h3 class="modal-title" id="modal_title">HISTORY - ${status}</h3>`);
        
        $.ajax({
            url     : `history-search/${status}`,
            type    : 'get',
            dataType: 'json',
            cache   : false,
            success: data => 
            {

                $('#tbl_history_data').DataTable().destroy();
                $('#tbody_tbl_history_data').empty();
                let tbody = '';
                data.data.forEach((value) => {
                        tbody +=
                        `<tr>
                        <td>
                            <button class="btn btn-primary btn-block" onclick="${history_function}('${value.id}', ${approved_button});"><strong class="strong-font"><i class="ti-eye"></i> VIEW DATA</strong></button>
                        </td>
                        <td>${value.part_number}</td>
                        <td>${value.revision_number}</td>
                        <td>${value.trial_number}</td>
                        <td>${value.inspection_reason}</td>
                        <td>${value.judgment}</td>
                        <td>${value.inspect_by}</td>
                        <td>${value.inspect_datetime}</td>
                        <td>${value.evaluated_by}</td>
                        <td>${value.evaluated_datetime}</td>
                        <td>${value.approved_by}</td>
                        <td>${value.approved_datetime}</td>
                        <td>${value.disapproved_by}</td>
                        <td>${value.disapproved_datetime}</td>
                        <td><button class="btn ${file_button_color} btn-block" ${file_button} style="${button_style}" onclick="HISTORY.viewFiles('${value.id}','${status}','${value.file_name}','${value.file_folder}','${value.file_name_merge}');">VIEW FILES</button></td>
                    </tr>`;
                });

                $('#tbody_tbl_history_data').html(tbody);

                $('#tbl_history_data').DataTable({
                    "paging": true,
                    "lengthChange": false,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": true,
                });
                $('#tbl_history_data').LoadingOverlay('hide');
            }
        });        
    };  

    this_history.ViewForInspectionHistory = (id, approved_button = '') => 
    {
        $('.history-trial_checksheet_modal').modal('show');

        $('#div_modal_content').LoadingOverlay('show');

        $.ajax({
            url     : `get-inspection-history`,
            type    : 'get',
            dataType: 'json',
            cache   : false,
            data    : {
                id      : id
            },
            success: data => 
            {
                console.log(data);
                // //checksheet details
                $('.history-trial_checksheet_modal #txt_part_number').val(data.data.part_number);
                $('.history-trial_checksheet_modal #txt_revision').val(data.data.revision_number);
                $('.history-trial_checksheet_modal #txt_trial_number').val(data.data.trial_number);
                $('.history-trial_checksheet_modal #txt_part_name').val(data.data.part_name);
                $('.history-trial_checksheet_modal #txt_model_name').val(data.data.model_name);//hindi pa kasama sa returned data
                $('.history-trial_checksheet_modal #txt_supplier_code').val(data.data.supplier_code);
                $('.history-trial_checksheet_modal #txt_supplier_name').val(data.data.supplier_name);//hindi pa kasama sa returned data
                $('.history-trial_checksheet_modal #txt_received_date').val(data.data.received_date);//hindi pa kasama sa returned data
                $('.history-trial_checksheet_modal #txt_inspection_completion_date').val(data.data.date_finished);
                $('.history-trial_checksheet_modal #txt_actual_inspection_time').val(data.data.inspection_actual_time);//hindi pa kasama sa returned data
                $('.history-trial_checksheet_modal #txt_inspection_reason').val(data.data.inspection_reason);
                $('.history-trial_checksheet_modal #txt_die_kind').val(data.data.die_class);
                $('.history-trial_checksheet_modal #txt_inspector').val(data.data.inspector_id); //hindi pa kasama sa returned data
                
                $('#div_modal_content').LoadingOverlay('hide');
            }
        });
    };

    this_history.viewFiles = (id,status,file_name,file_folder,file_name_merge) =>
    {
        $(".history-file-name-modal").modal("show");
        $(".history-file-name-modal .modal-title").html(`<h5 class="modal-title"> ${status} </h5>`);

        let file_names = file_name.split(',');

        let files       = '';
        let files_1     = '';
        let file_count  = 0;

        if(status === 'FOR EVALUATION' || status === 'DISAPPROVED')
        {
            if(file_names.length <= 3)
            {
                for(b = 0; b < file_names.length; b++)
                {
                    files += `
                        <div class="vertical-rectangle">
                            <img id="" src="${base_url}/template/assets/images/icon/file.png" class="file-image">
                            <div class="file-options">
                                <button type="button" class="btn btn-green mb-3" onclick="HISTORY.openFiles('${file_names[b]}','${file_folder}','0');"><i class="ti-eye"></i> VIEW FILE</button>
                            </div>

                            <center style="margin-top: 200px;">
                                <span>${file_names[b]}</span>
                            </center>
                        </div>
                    `;
                }
            }
            else
            {
                for(b = 0; b < 3; b++)
                {
                    files += `
                        <div class="vertical-rectangle">
                            <img id="" src="${base_url}/template/assets/images/icon/file.png" class="file-image">
                            <div class="file-options">
                                <button type="button" class="btn btn-green mb-3" onclick="HISTORY.openFiles('${file_names[b]}','${file_folder}','0');"><i class="ti-eye"></i> VIEW FILE</button>
                            </div>
                            <center style="margin-top: 200px;">
                                <span>${file_names[b]}</span>
                            </center>
                        </div>
                    `;
                }

                if(file_names.length == 5)
                {
                    file_count = file_names.length - 2;
                }
                else
                {
                    file_count = file_names.length - 1;
                }

                for(a = file_count; a < file_names.length; a++)
                {
                    files_1 += `
                        <div class="vertical-rectangle">
                            <img id="" src="${base_url}/template/assets/images/icon/file.png" class="file-image">
                            <div class="file-options">
                                <button type="button" class="btn btn-green mb-3" onclick="HISTORY.openFiles('${file_names[a]}','${file_folder}','0');"><i class="ti-eye"></i> VIEW FILE</button>
                            </div>
                            <center style="margin-top: 200px;">
                                <span>${file_names[a]}</span>
                            </center>
                        </div>
                    `;
                }
            }
        }
        else if(status === 'FOR APPROVAL' || status === 'APPROVED')
        {
            files += `
                <div class="vertical-rectangle">
                    <img id="" src="${base_url}/template/assets/images/icon/file.png" class="file-image">
                    <div class="file-options">
                        <button type="button" class="btn btn-green mb-3" onclick="HISTORY.openFiles('${file_names}','${file_folder}','.pdf');"><i class="ti-eye"></i> VIEW FILE</button>
                    </div>
                    <center style="margin-top: 195px;font-size:12px;">
                        <span>${file_folder}.pdf</span>
                    </center>
                </div>
            `;

            files += `
                <div class="vertical-rectangle">
                    <img id="" src="${base_url}/template/assets/images/icon/file.png" class="file-image">
                    <div class="file-options">
                        <button type="button" class="btn btn-green mb-3" onclick="HISTORY.openFiles('${file_names}','${file_folder}','.xlsx');"><i class="ti-eye"></i> VIEW FILE</button>
                    </div>
                    <center style="margin-top: 195px;font-size:12px;">
                        <span>${file_folder}.xlsx</span>
                    </center>
                </div>
            `;
        }
        
        $('#div_attachments').html(files);
        $('#div_attachments_1').html(files_1);
    }

    this_history.openFiles = (file_names,file_folder,ext) =>
    {
        if(ext == 0)
        {
            window.open(`../../../tis/storage/app/public/${file_folder}/${file_names}`, "_blank", "width=1200,height=600, left = 2300,top = 200");
        }
        else if(ext === '.pdf')
        {
            window.open(`../../../tis/storage/app/public/${file_folder}/${file_folder}${ext}`, "_blank", "width=1200,height=600, left = 2300,top = 200");
        }
        else
        {
            window.open(`../../../tis/storage/app/public/${file_folder}/${file_folder}${ext}`);
        }
    }

    this_history.editDataInspection =  (trial_checksheet_id,decision) =>
    {
        $.ajax({
            url     : `edit-data-inspection`,
            type    : 'patch',
            dataType: 'json',
            data    : 
            {
                _token              : _TOKEN,
                trial_checksheet_id : trial_checksheet_id,
                decision            : decision
            },
            success: data => 
            {
                Swal.fire({
                    icon    : 'success',
                    title   : data.status,
                    text    : data.message,
                })

                HISTORY.loadHistoryList();
                $("#modal_view_inspection_data").modal("hide");

            }

        })
    }

    return this_history;
    
})();