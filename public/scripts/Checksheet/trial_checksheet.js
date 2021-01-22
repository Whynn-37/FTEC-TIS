$(document).ready(function () {
    CHECKSHEET.LoadRefreshAlert();
    CHECKSHEET.InitializeCycleTimeTimer();
    CHECKSHEET.LoadDowntimeRunningTimeInterval();
    CHECKSHEET.LoadDowntimeTypes();
});

let logVisit = function (event) {

    let trial_checksheet_id = $('#trial_checksheet_id').val();

    let remaining_target_takt_time = $('#div_target_takt_time_timer').TimeCircles().getTime();
    let converted_remaining_target_takt_time = remaining_target_takt_time / 60;

    let remaining_takt_time = $("#div_takt_time_timer").TimeCircles().getTime();
    let absolute_value_remaining_takt_time = Math.abs(Math.floor(remaining_takt_time));
    let converted_remaining_takt_time = absolute_value_remaining_takt_time / 60;

    let remaining_actual_time = $("#div_actual_time_timer").TimeCircles().getTime();
    let absolute_value_remaining_actual_time = Math.abs(Math.floor(remaining_actual_time));
    let converted_remaining_actual_time = absolute_value_remaining_actual_time / 60;

    // URL to send the data to
    let url = `api/stop-cycle-time?trial_checksheet_id=${trial_checksheet_id}&actual_time=${converted_remaining_actual_time.toFixed(2)}&total_takt_time=${converted_remaining_takt_time.toFixed(2)}&takt_time=${Math.abs(converted_remaining_target_takt_time.toFixed(2))}`;

    let result = navigator.sendBeacon(url);

    if (result) {
        console.log('Successfully queued!');
    } else {
        console.log('Failure.');
    }

    event.preventDefault()
    event.returnValue = ''
};

let logDowntime = function (event) {
    

    let trial_checksheet_id     = $('#trial_checksheet_id').val();

    let downtime_type           = $("#slc_downtime_type").val();
    let others_description      = $("#txt_others_description").val();

    let downtime                = $("#div_downtime_timer").TimeCircles().getTime();
    let absolute_value_downtime = Math.abs(Math.floor(downtime));
    total_down_time             = (absolute_value_downtime / 60).toFixed(2);

    //yung (downtime_type === 'Others') ? others_description : downtime_type ay ako naglagay - george
    // URL to send the data to
    if (downtime_type !== null) 
    {
        let url = `api/downtime?trial_checksheet_id=${trial_checksheet_id}&type=${(downtime_type === 'Others') ? others_description : downtime_type}&total_down_time=${total_down_time}`;

        let result = navigator.sendBeacon(url);
    
        if (result) {
            console.log('Successfully queued!');
    
        } else {
            console.log('Failure.');
        } 
    }

    event.preventDefault()
    event.returnValue = ''
};

window.addEventListener('beforeunload', logVisit);
window.addEventListener('beforeunload', logDowntime);

const CHECKSHEET = (() => {
    let this_checksheet = {};
    
    let array_file_type = ['png', 'jpg', 'jpeg','PNG', 'JPG', 'JPEG', 'pdf'];
    let array_downtime_type = ['Breaktime','Clinic','Confirmation','Meeting','Parts Problem','Phonecall','Toilet','Others'];

    // pang refresh ng trial ledger
    this_checksheet.LoadRefreshAlert = () => {

        $('#div_main_content').prop('hidden', true);

        Swal.fire(
            $.extend(swal_options_refresh, {
                title: "Click refresh to update the trial ledger data",
            })
        ).then((result) => {
            if (result.value) {
                Swal.fire({
                    title: "Updating...",
                    imageUrl: `${base_url}/template/assets/images/icon/updating3.gif`,
                    imageWidth: 350,
                    imageHeight: 250,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                })
                $.ajax({
                    url     : `store-trial-ledger`,
                    type    : 'post',
                    dataType: 'json',
                    cache   : false,
                    data    : 
                    {
                        _token: _TOKEN
                    },
                    success: result => 
                    {
                        if (result.status === 'Success') 
                        {
                            swal.close();
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: result.message,
                                allowOutsideClick: false,
                            })
                            $('#div_main_content').prop('hidden', false);
                            CHECKSHEET.LoadPartnumber();
                            CHECKSHEET.getForInspection();
                        } 
                        else 
                        {
                            swal.close();
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: result.message,
                                allowOutsideClick: false,
                            })
                            $('#div_main_content').prop('hidden', false);
                        }
                    }
                });
            }
        });
    };

    this_checksheet.LoadPartnumber = () => {

        $.ajax({
            url     : `load-partnumber`,
            type    : 'get',
            dataType: 'json',
            cache   : false,
            success : data => 
            {
                $('#slc_part_number').empty();

                if (data.status === 'Success')
                {
                    let select_options = '<option value="" selected disabled>Select part no.</option>';
    
                    data.data.forEach((value) => {
                        select_options += `<option value="${value.part_number}">${value.part_number}</option>`
                    });
    
                    $('#slc_part_number').append(select_options);
                }
                else
                {
                    Swal.fire({
                        icon: 'error',
                        title: data.status,
                        text: data.message,
                    })
                }
            }
        });
    };

    //
    this_checksheet.LoadInspectionReason = (part_number) => {

        $('#slc_revision_number').empty();
        $('#slc_trial_number').empty();

        $.ajax({
            url     : `load-inspection-reason`,
            type    : 'get',
            dataType: 'json',
            cache   : false,
            data    : 
            {
                part_number: part_number
            },
            success: data => 
            {
                $('#slc_inspection_reason').empty();

                if (data.status === 'Success')
                {
                    let select_options = '<option value="" selected disabled>Select inspection reason</option>';

                    data.data.forEach((value) => {
                        select_options += `<option value="${value.inspection_reason}">${value.inspection_reason}</option>`;
                    });

                    $('#slc_inspection_reason').append(select_options);
                }
                else
                {
                    Swal.fire({
                        icon: 'error',
                        title: data.status,
                        text: data.message,
                    })
                }
            }
        });
    };

    //
    this_checksheet.LoadRevision = (inspection_reason) => {

        $('#slc_trial_number').empty();

        let part_number = $('#slc_part_number').val();

        $.ajax({
            url     : `load-revision`,
            type    : 'get',
            dataType: 'json',
            cache   : false,
            data    : 
            {
                part_number         : part_number,
                inspection_reason   : inspection_reason
            },
            success: data => 
            {
                $('#slc_revision_number').empty();

                if (data.status === 'Success')
                {
                    let select_options = '<option value="" selected disabled>Select revision number</option>';
    
                    data.data.forEach((value) => {
                        select_options += `<option value="${value.revision_number}">${value.revision_number}</option>`;
                    });
    
                    $('#slc_revision_number').append(select_options);
                }
                else
                {
                    Swal.fire({
                        icon: 'error',
                        title: data.status,
                        text: data.message,
                    })
                }
            }
        });
    };

    //
    this_checksheet.LoadTrialNumber = (revision_number) => {

        let part_number = $('#slc_part_number').val();
        let inspection_reason = $('#slc_inspection_reason').val();

        $.ajax({
            url     : `load-trial-number`,
            type    : 'get',
            dataType: 'json',
            cache   : false,
            data    : 
            {
                part_number         : part_number,
                inspection_reason   : inspection_reason,
                revision_number     : revision_number,
            },
            success: data => 
            {
                $('#slc_trial_number').empty();

                if (data.status === 'Success')
                {
                    let select_options = '<option value="" selected disabled>Select trial number</option>';

                    data.data.forEach((value) => {
                        select_options += `<option value="${value.trial_number}">${value.trial_number}</option>`;
                    });
    
                    $('#slc_trial_number').append(select_options);
                }
                else
                {
                    Swal.fire({
                        icon: 'error',
                        title: data.status,
                        text: data.message,
                    })
                }
            }
        });
    };

    //
    this_checksheet.LoadApplicationDate = () => {

        let part_number         = $('#slc_part_number').val();
        let inspection_reason   = $('#slc_inspection_reason').val();
        let revision_number     = $('#slc_revision_number').val();
        let trial_number        = $('#slc_trial_number').val();

        $.ajax({
            url     : `load-application-date`,
            type    : 'get',
            dataType: 'json',
            cache   : false,
            data    : 
            {
                part_number         : part_number,
                inspection_reason   : inspection_reason,
                revision_number     : revision_number,
                trial_number        : trial_number,
            },
            success: data => 
            {
                if (data.status === 'Success')
                {
                    $('#trial_checksheet_application_date').empty();
                    $('#trial_checksheet_application_date').val(data.data.application_date);
                }
                else
                {
                    Swal.fire({
                        icon: 'error',
                        title: data.status,
                        text: data.message,
                    })
                }
            }
        });
    };

    this_checksheet.ValidateLoadDetails = () => {

        let part_number         = $('#slc_part_number').val();
        let inspection_reason   = $('#slc_inspection_reason').val();
        let revision_number     = $('#slc_revision_number').val();
        let trial_number        = $('#slc_trial_number').val();

        let application_date    = $('#trial_checksheet_application_date').val();

        $('.form_trial_checksheet_field_error').text('');

        if (part_number === null  && inspection_reason === null && revision_number === null && trial_number === null) 
        {
            $('#span_error_part_number').remove();
            $('#span_error_slc_inspection_reason').remove();
            $('#span_error_revision_number').remove();
            $('#span_error_trial_number').remove();
            $('#slc_part_number').before('<span id ="span_error_part_number" class="span-error">Required</span>');
            $('#slc_inspection_reason').before('<span id ="span_error_slc_inspection_reason" class="span-error">Required</span>');
            $('#slc_revision_number').before('<span id ="span_error_revision_number" class="span-error">Required</span>');
            $('#slc_trial_number').before('<span id ="span_error_trial_number" class="span-error">Required</span>');
        } 
        else if (inspection_reason === null && revision_number === null && trial_number === null) 
        {
            $('#span_error_part_number').remove();
            $('#span_error_revision_number').remove();
            $('#span_error_trial_number').remove();
            $('#span_error_slc_inspection_reason').remove();
            $('#slc_inspection_reason').before('<span id ="span_error_slc_inspection_reason" class="span-error">Required</span>');
            $('#slc_revision_number').before('<span id ="span_error_revision_number" class="span-error">Required</span>');
            $('#slc_trial_number').before('<span id ="span_error_trial_number" class="span-error">Required</span>');
        } 
        else if (revision_number === null && trial_number === null) 
        {
            $('#span_error_part_number').remove();
            $('#span_error_revision_number').remove();
            $('#span_error_trial_number').remove();
            $('#span_error_slc_inspection_reason').remove();
            $('#slc_revision_number').before('<span id ="span_error_revision_number" class="span-error">Required</span>');
            $('#slc_trial_number').before('<span id ="span_error_trial_number" class="span-error">Required</span>');
        } 
        else if (trial_number === null)
        {
            $('#span_error_part_number').remove();
            $('#span_error_revision_number').remove();
            $('#span_error_trial_number').remove();
            $('#span_error_slc_inspection_reason').remove();
            $('#slc_trial_number').before('<span id ="span_error_trial_number" class="span-error">Required</span>');
        }
        else 
        {
            $('#span_error_part_number').remove();
            $('#span_error_revision_number').remove();
            $('#span_error_trial_number').remove();
            $('#span_error_slc_inspection_reason').remove();

            CHECKSHEET.LoadDetails(application_date);
        }
    };

    this_checksheet.LoadDetails = (application_date) => {

        $('#accordion_details').LoadingOverlay('show');
        $('#div_card_takt_time').LoadingOverlay('show');

        $.ajax({
            url     : `load-details`,
            type    : 'get',
            dataType: 'json',
            cache   : false,
            data    : 
            {
                application_date: application_date,
            },
            success: data => 
            {
                if (data.status === 'Success') 
                {
                    //checksheet details
                    $('#txt_part_number').val(data.data.trial_checksheets.part_number);
                    $('#txt_inspection_reason').val(data.data.trial_checksheets.inspection_reason);
                    $('#txt_revision_number').val(data.data.trial_checksheets.revision_number);
                    $('#txt_trial_number').val(data.data.trial_checksheets.trial_number);

                    $('#trial_checksheet_id').val(data.data.trial_checksheets.id);
                    $('#trial_checksheet_application_date').val(data.data.trial_checksheets.application_date);
                    $('#txt_part_name').val(data.data.trial_checksheets.part_name);
                    $('#txt_model_name').val(data.data.trial_checksheets.model_name);
                    $('#txt_received_date').val(data.data.trial_checksheets.received_date);
                    $('#txt_plan_start_date').val(data.data.trial_checksheets.plan_start_date);
                    $('#txt_inspection_required_time').val(data.data.trial_checksheets.inspection_required_time);
                    $('#txt_die_kind').val(data.data.trial_checksheets.die_class);
                    $('#txt_inspector').val(data.data.trial_checksheets.inspector_id);
                    $('#txt_supplier_code').val(data.data.trial_checksheets.supplier_code);
                    $('#txt_supplier_name').val(data.data.trial_checksheets.supplier_name);

                    //load ng cycle time
                    CHECKSHEET.LoadCycleTime(data.data.trial_checksheets.inspection_required_time);
                    //load ng downtime
                    CHECKSHEET.LoadDowntime();

                    $('#btn_start_time').prop('disabled', false);

                    
                }
                else
                {
                    Swal.fire({
                        icon: 'error',
                        title: data.status,
                        text: data.message,
                    })
                }

                $('#accordion_details').LoadingOverlay('hide');
                $('#div_card_takt_time').LoadingOverlay('hide');
            }
        });
    };

    this_checksheet.LoadDowntimeRunningTime = () => {
        var new_date = new Date();
        let date_now = `${new_date.getMonth() + 1}/${new_date.getDate()}/${new_date.getFullYear()}`;
        var txt_time =
            new_date.getHours() + ":" + new_date.getMinutes() + ":" + new_date.getSeconds();
        document.getElementById(
            "txt_downtime_running_time"
        ).innerHTML = txt_time;
        $('#txt_date_inspected').val(date_now);
    };

    this_checksheet.LoadDowntimeRunningTimeInterval = () => {
        setInterval(function () {
            CHECKSHEET.LoadDowntimeRunningTime();
        }, 1000);
    };

    this_checksheet.LoadDowntimeTypes = () => {
        
        let downtime_type = `<option value="" selected disabled>Select type
        </option>`;
        
        for (let index = 0; index < array_downtime_type.length; index++) 
        {
            downtime_type += `<option value="${array_downtime_type[index]}">${array_downtime_type[index]}</option>`
        }

        $('#slc_downtime_type').append(downtime_type);
    };

    this_checksheet.ShowTextboxOthersDowntime = (type) => {

        if (type ==='Others')
        {
            $('#div_others_downtype').prop('hidden',false);
            $('#txt_others_description').val('');
            $('#txt_others_description').focus();
        }
        else
        {
            $('#div_others_downtype').prop('hidden',true);
        }
    };

    this_checksheet.InitializeCycleTimeTimer = () => {

        $("#btn_start_time").prop("hidden", false);
        $("#btn_stop_time").prop("hidden", true);

        $("#div_target_takt_time_timer").TimeCircles({
            count_past_zero: false,
        });
        $("#div_takt_time_timer").TimeCircles();
        $("#div_actual_time_timer").TimeCircles();
        $("#div_takt_time_timer").TimeCircles();
        $("#div_downtime_timer").TimeCircles();

        $("#div_target_takt_time_timer").TimeCircles().stop();
        $("#div_takt_time_timer").TimeCircles().stop();
        $("#div_actual_time_timer").TimeCircles().stop();
        $("#div_downtime_timer").TimeCircles().stop();

        $("#btn_finish_downtime").prop("disabled", true);
        $("#btn_start_downtime").prop("disabled", true);
        $("#slc_downtime_type").prop("disabled", true);
    };

    this_checksheet.TaktTimeTimerAction = (status) => {

        let downtime_running_time = $("#txt_downtime_running_time").text();

        if (status === 'start_takt_time') {
            var text = 'start';
        } else {
            text = 'stop';
        }

        Swal.fire(
            $.extend(swal_options, {
                confirmButtonText: 'Yes',
                title: `Are you sure you want to ${text}?`,
                text: ''
            })
        ).then((result) => {
            if (result.value) 
            {
                if (status === "start_takt_time") 
                {
                    CHECKSHEET.StartCycleTime(downtime_running_time);
                } 
                else 
                {
                    CHECKSHEET.StopCycleTime(downtime_running_time);
                }
            }
        });
    };

    //
    this_checksheet.StartCycleTime = () => {

        $('#div_card_takt_time').LoadingOverlay('show');

        let trial_checksheet_id = $('#trial_checksheet_id').val();
        let application_date    = $('#trial_checksheet_application_date').val();
        let target_takt_time    = $('#div_target_takt_time_timer').attr('data-timer') / 60;
        // let part_number         = $('#slc_part_number').val();
        // let revision_number     = $('#slc_revision_number').val();
        // let trial_number        = $('#slc_trial_number').val();
        // let inspection_reason   = $('#slc_inspection_reason').val();
        let part_number         = $('#txt_part_number').val();
        let revision_number     = $('#txt_revision_number').val();
        let trial_number        = $('#txt_trial_number').val();
        let inspection_reason   = $('#txt_inspection_reason').val();
        
        $.ajax({
            url     : `start-cycle-time`,
            type    : 'post',
            dataType: 'json',
            cache   : false,
            data    : {
                _token              : _TOKEN,
                trial_checksheet_id : trial_checksheet_id,
                application_date    : application_date,
                takt_time           : target_takt_time,
                part_number         : part_number,
                revision_number     : revision_number,
                trial_number        : trial_number,
                inspection_reason   : inspection_reason,
            },
            success: data => 
            {
                if (data.status === 'Success') 
                {
                    //checksheet details
                    $('#slc_part_number option:not(:selected)').attr('disabled', true);
                    $('#slc_revision_number option:not(:selected)').attr('disabled', true);
                    $('#slc_trial_number option:not(:selected)').attr('disabled', true);
                    $('#slc_inspection_reason option:not(:selected)').attr('disabled', true);
                    
                    $('#btn_validate_load_details').prop('disabled', true);
                    //target takt time
                    $("#div_target_takt_time_timer").TimeCircles().start();
                    $("#div_takt_time_timer").TimeCircles().start();
                    $("#div_actual_time_timer").TimeCircles().start();
                    //downtime
                    $("#btn_start_time").prop("hidden", true);
                    $("#btn_stop_time").prop("hidden", false);
                    $("#btn_start_downtime").prop("disabled", false);
                    $("#slc_downtime_type").prop("disabled", false);

                    $('#trial_checksheet_id').val(data.data.takt_time.trial_checksheet_id);

                    CHECKSHEET.LoadCycleTime(0, 'start');
                    IGM.LoadIGM(data.data.takt_time.trial_checksheet_id);

                    //pag seset ng add new item
                    
                    $('#btn_add_new_igm_item_no').attr('onclick',`IGM.AddIgmItemNo('',${item_no_count},0,0,'new');`);

                    //pag show ng attachments at ssave button
                    $('#div_row_numbering_drawing').prop('hidden',false);
                    $('#div_row_special_tool_data').prop('hidden',false);
                    $('#div_row_others_2').prop('hidden',false);
                    $('#div_row_save_inspection').prop('hidden',false);
                    $('#div_row_save_inspection').prop('hidden',false);
                    //pag show ng igm
                    $('#div_accordion_igm').prop('hidden', false);
                    $('#div_inspection_list').hide();
                }
                else
                {
                    Swal.fire({
                        icon: 'error',
                        title: data.status,
                        text: data.message,
                    })
                }

                $('#div_card_takt_time').LoadingOverlay('hide');
            }
        });

        CHECKSHEET.LoadDowntimeRunningTimeInterval();
        FOOTER.LoadNavbarDateTimeInterval();
    };

    this_checksheet.LoadCycleTime = (inspection_required_time, status = "load_cycle_time") => {

        let trial_checksheet_id = $('#trial_checksheet_id').val();

        $.ajax({
            url     : `load-cycle-time`,
            type    : 'get',
            dataType: 'json',
            cache   : false,
            data    : 
            {
                trial_checksheet_id: trial_checksheet_id,
            },
            success: data => 
            {
                $('#tbl_takt_time').DataTable().destroy();
                $('#tbody_tbl_takt_time').empty();

                let tbody = '';
                var target_takt_time = inspection_required_time * 60;
                var total_sum_total_takt_time = 0;

                data.data.forEach((value) => 
                {
                    //last array element of target takt time
                    array_takt_time_data = data.data[data.data.length - 1];
                    target_takt_time = array_takt_time_data['takt_time'] * 60;

                    // sum ng takt time para sa actual time na timer
                    let sum_total_takt_time = 0;
                    data.data.forEach((value) => 
                    {
                        sum_total_takt_time += parseFloat(value.total_takt_time);
                    });

                    total_sum_total_takt_time = -Math.abs(sum_total_takt_time * 60);

                    tbody += `<tr>
                        <td>${value.start_date}</td>
                        <td>${value.start_time}</td>
                        <td>${(value.end_time == null) ? '' : value.end_time}</td>
                        <td>${(value.total_takt_time == null) ? '' : value.total_takt_time}</td>
                    </tr>`;

                });

                // if (data.status === 'Success')
                // {
                //     if (status === 'load_cycle_time') 
                //     {
                //         //target takt time
                //         $('#div_target_takt_time_timer').attr('data-timer', target_takt_time);
                //         $("#div_target_takt_time_timer").TimeCircles().rebuild();
                //         $("#div_target_takt_time_timer").TimeCircles().stop();
    
                //         //actual time
                //         $('#div_actual_time_timer').attr('data-timer', total_sum_total_takt_time);
                //         $("#div_actual_time_timer").TimeCircles().rebuild();
                //         $("#div_actual_time_timer").TimeCircles().stop();
                //     }
                // }
                // else
                // {
                    if (status === 'load_cycle_time') 
                    {
                        //target takt time
                        $('#div_target_takt_time_timer').attr('data-timer', target_takt_time);
                        $("#div_target_takt_time_timer").TimeCircles().rebuild();
                        $("#div_target_takt_time_timer").TimeCircles().stop();
    
                        //actual time
                        $('#div_actual_time_timer').attr('data-timer', total_sum_total_takt_time);
                        $("#div_actual_time_timer").TimeCircles().rebuild();
                        $("#div_actual_time_timer").TimeCircles().stop();

                        Swal.fire({
                            icon: 'success',
                            title: data.status,
                            text: data.message,
                            timer: 500
                        })
                    }

                    
                // } //naka comment kase pagka walang iloload nalabas pa swal na error

                $('#tbody_tbl_takt_time').html(tbody);
                $('#tbl_takt_time').DataTable({
                    "paging": true,
                    "lengthChange": false,
                    "searching": false,
                    "ordering": false,
                    "info": true,
                    "autoWidth": true,
                });
            }
        });
    };

    this_checksheet.StopCycleTime = () => {

        $('#div_card_takt_time').LoadingOverlay('show');

        let trial_checksheet_id                     = $('#trial_checksheet_id').val();

        let remaining_target_takt_time              = $('#div_target_takt_time_timer').TimeCircles().getTime();
        let converted_remaining_target_takt_time    = Math.abs(remaining_target_takt_time / 60);

        let remaining_takt_time                     = $("#div_takt_time_timer").TimeCircles().getTime();
        let absolute_value_remaining_takt_time      = Math.abs(Math.floor(remaining_takt_time));
        let converted_remaining_takt_time           = absolute_value_remaining_takt_time / 60;

        let remaining_actual_time                   = $("#div_actual_time_timer").TimeCircles().getTime();
        let absolute_value_remaining_actual_time    = Math.abs(Math.floor(remaining_actual_time));
        let converted_remaining_actual_time         = absolute_value_remaining_actual_time / 60;

        $.ajax({
            url     : `stop-cycle-time`,
            type    : 'post',
            dataType: 'json',
            cache   : false,
            data    : {
                _token              : _TOKEN,
                trial_checksheet_id : trial_checksheet_id,
                total_takt_time     : converted_remaining_takt_time.toFixed(2),
                actual_time         : converted_remaining_actual_time.toFixed(2),
                takt_time           : converted_remaining_target_takt_time.toFixed(2),
            },
            success: data => 
            {
                if (data.status === 'Success') 
                {
                    CHECKSHEET.LoadCycleTime(0, 'stop');

                    //checksheet details
                    $('#slc_part_number option:not(:selected)').attr('disabled', false);
                    $('#slc_revision_number option:not(:selected)').attr('disabled', false);
                    $('#slc_trial_number option:not(:selected)').attr('disabled', false);
                    $('#slc_inspection_reason option:not(:selected)').attr('disabled', false);

                    $('#btn_validate_load_details').prop('disabled', false);

                    //cycle time
                    $("#btn_start_time").prop("hidden", false);
                    $("#btn_stop_time").prop("hidden", true);
                    $("#div_target_takt_time_timer").TimeCircles().stop();
                    $("#div_actual_time_timer").TimeCircles().stop();
                    $("#div_takt_time_timer").TimeCircles().restart();
                    $("#div_takt_time_timer").TimeCircles().stop();

                    //downtime
                    $("#slc_downtime_type").prop("disabled", true);
                    $("#btn_start_downtime").prop("disabled", true);

                    //IGM
                    $('#tfoot_add_igm_item').remove();
                    $('#tbl_new_igm').prop('hidden', true);
                    $('#tbody_tbl_new_igm').empty();
                    
                    //pag show ng attachments at ssave button
                    $('#div_row_numbering_drawing').prop('hidden',true);
                    $('#div_row_special_tool_data').prop('hidden',true);
                    $('#div_row_others_2').prop('hidden',true);
                    $('#div_row_save_inspection').prop('hidden',true);

                    $('#div_accordion_igm').prop('hidden', true);
                    $('#div_inspection_list').show();
                }
                else
                {
                    Swal.fire({
                        icon: 'error',
                        title: data.status,
                        text: data.message,
                    })
                }
                $('#div_card_takt_time').LoadingOverlay('hide');
            }
        });
    };

    this_checksheet.DowntimeTimerAction = (status) => {

        let downtime_type       = $("#slc_downtime_type").val();
        let others_description  = $("#txt_others_description").val();

        if (downtime_type === null) 
        {
            $("#span_error_downtime_type").remove();
            $("#span_error_others").remove();
            $("#slc_downtime_type").after('<span id ="span_error_downtime_type" class="span-error">Required</span>');
        } 
        else 
        {
            $("#span_error_downtime_type").remove();
            $("#span_error_others").remove();

            if (status === 'start_downtime') 
            {
                var text = 'start';
            } 
            else 
            {
                text = 'stop';
            }

            //para sa others na type, yung nasa textbox ang ipapasa na type
            if (downtime_type === 'Others')
            {
                if (others_description === '')
                {
                    $("#txt_others_description").after('<span id ="span_error_others" class="span-error">Required</span>');
                }
                else
                {
                    Swal.fire(
                        $.extend(swal_options, {
                            title: `Are you sure you want to ${text} downtime?`,
                            text: ''
                        })
                    ).then((result) => 
                    {
                        if (result.value) 
                        {
                            CHECKSHEET.Downtime(text, others_description);
                        }
                    });
                }
            }
            else
            {
                Swal.fire(
                    $.extend(swal_options, {
                        title: `Are you sure you want to ${text} downtime?`,
                        text: ''
                    })
                ).then((result) => 
                {
                    if (result.value) 
                    {
                        CHECKSHEET.Downtime(text, downtime_type);
                    }
                });
            }
        }
    };

    this_checksheet.LoadDowntime = () => {

        let trial_checksheet_id = $('#trial_checksheet_id').val();

        if (trial_checksheet_id !== '')
        {
            $('#div_downtime').LoadingOverlay('show');

            $.ajax({
                url     : `load-down-time`,
                type    : 'get',
                dataType: 'json',
                cache   : false,
                data    : 
                {
                    trial_checksheet_id: trial_checksheet_id,
                },
                success: data => 
                {
                    $('#tbody_tbl_downtime').empty();

                    if (data.status === 'Success')
                    {
                        // sum ng downtime
                        let sum_downtime = 0;
                        data.data.forEach((value) => {
                            sum_downtime += parseFloat(value.total_down_time);
                        });
    
                        let tbody = '';
                        data.data.forEach((value) => {
    
                            tbody += `<tr>
                                <td>${value.type}</td>
                                <td>${value.start_time}</td>
                                <td>${value.down_time}</td>
                                <td>${value.total_down_time}</td>
                            </tr>`;
    
                        });
                        $('#tbody_tbl_downtime').html(tbody);
                        $('#td_total_downtime').html((isNaN(sum_downtime.toFixed(2)) ? '' : sum_downtime.toFixed(2)));
                    }
                    else
                    {
                        Swal.fire({
                            icon: 'error',
                            title: data.status,
                            text: data.message,
                        })
                    }

                    $('#div_downtime').LoadingOverlay('hide');
                }
            });
        }
    };

    this_checksheet.Downtime = (status, downtime_type) => {

        let trial_checksheet_id = $('#trial_checksheet_id').val();

        if (status === 'start') 
        {
            $("#div_downtime_timer").TimeCircles().start();
            $("#btn_finish_downtime").prop("disabled", false);
            $("#btn_start_downtime").prop("disabled", true);
            $("#txt_others_description").prop("disabled", true);
            $("#slc_downtime_type").prop("disabled", true);
            $("#btn_stop_time").prop("disabled", true);
            $("#div_takt_time_timer").TimeCircles().stop();

            //pag show ng attachments at ssave button
            $('#div_row_numbering_drawing').prop('hidden',true);
            $('#div_row_special_tool_data').prop('hidden',true);
            $('#div_row_others_2').prop('hidden',true);
            $('#div_row_save_inspection').prop('hidden',true);
            //igm
            $('#div_accordion_igm').prop('hidden', true);

            var total_down_time = null;
        } 
        else 
        {
            let downtime                = $("#div_downtime_timer").TimeCircles().getTime();
            let absolute_value_downtime = Math.abs(Math.floor(downtime));
            total_down_time             = (absolute_value_downtime / 60).toFixed(2);

            $("#div_downtime_timer").TimeCircles().restart();
            $("#div_downtime_timer").TimeCircles().stop();
            $("#btn_finish_downtime").prop("disabled", true);
            $("#btn_start_downtime").prop("disabled", false);
            $("#btn_stop_time").prop("disabled", false);
            $("#slc_downtime_type").prop("disabled", false);
            $("#txt_others_description").prop("disabled", false);
            $("#div_others_downtype").prop("hidden", true);
            $("#slc_downtime_type").val(null);
            $("#div_takt_time_timer").TimeCircles().start();

            //pag show ng attachments at ssave button
            $('#div_row_numbering_drawing').prop('hidden',false);
            $('#div_row_special_tool_data').prop('hidden',false);
            $('#div_row_others_2').prop('hidden',false);
            $('#div_row_save_inspection').prop('hidden',false);
            //igm
            $('#div_accordion_igm').prop('hidden', false);
        }

        $.ajax({
            url     : `downtime`,
            type    : 'post',
            dataType: 'json',
            cache   : false,
            data    : 
            {
                _token              : _TOKEN,
                trial_checksheet_id : trial_checksheet_id,
                type                : downtime_type,
                total_down_time     : total_down_time,
            },
            success: result => 
            {
                if (result.status === 'Success')
                {
                    CHECKSHEET.LoadDowntime();
                }
                else
                {
                    Swal.fire({
                        icon: 'error',
                        title: result.status,
                        text: result.message,
                    })
                }
            }
        });
    };

    this_checksheet.ValidateAttachment = (file,file_label) => {

        let split_file_type = file.split('.');
        let file_type       = split_file_type[1];

        if ($.inArray(file_type, array_file_type) === -1)
        {
            $(`#span_attach_file_${file_label}`).text('Invalid file');
            $(`#txt_attachment_${file_label}`).val(null);
        }
        else
        {
            $(`#span_attach_file_${file_label}`).text('');
        }
    };

    this_checksheet.ValidateSaveTrialChecksheet = () => {
        let temperature             = $('#txt_temperature').val();
        let humidity                = $('#txt_humidity').val();
        let part_number             = $('#txt_part_number').val();
        let na_judgement_count      = 0;
        let ng_judgement_count      = 0;
        
        //attachments, ito lang kase itong tatlo ay required
        let numbering_drawing       = $('#txt_attachment_numbering_drawing').attr('name');
        let material_certification  = $('#txt_attachment_material_certification').attr('name');
        let special_tool_data       = $('#txt_attachment_special_tool_data').attr('name');

        //pangclear ng error texts
        $('.form_trial_checksheet_field_error').text('');
        let required_count  = 0;
        let loop_count      = 0;


        $('.form_trial_checksheet_field').each(function () 
        {
            if ($(this).val() === '' || $(this).val() === null) 
            {
                $('.form_trial_checksheet_field_error').text('Required');
                required_count++;
            }
            loop_count++;

            if (loop_count === 9)
            {
                if (required_count === 0)
                {
                    (part_number !== null)  ? $('#span_part_no').prop('hidden', true)       :'';
                    (temperature !== '')    ? $('#span_temperature').prop('hidden', true)   :'';
                    (humidity !== '')       ? $('#span_humidity').prop('hidden', true)      : '';
    
                    if (part_number !== null && numbering_drawing !== '' && material_certification !== ''&& special_tool_data !== '' && temperature !== '' && humidity !== '') 
                    {
                        //checking kung may niload na igm or kung hindi man niload, merong inadd na item. basta dapat may IGM
                        if (item_no_count == 0 || item_no_count === '')
                        {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Incomplete checksheet',
                                text: 'No IGM checksheet found',
                            })
                        }
                        else
                        {
                            //nilagyan ko nito gawa nung onclick na function na kapag naka dash ay buburahin yung dash sa textbox. kaso hindi gumagana yung onchange na function pagka ganon unless manual na burahin yung dash. nilagay ko to para pagka save lalgyan nalang ulit ng dash
                            for (let item_no_index = 1; item_no_index <= parseInt(item_no_count); item_no_index++) 
                            {
                                let type = $(`#slc_item_no_${item_no_index}_type`).val();
    
                                if (type === 'Min and Max' || type === 'Min and Max and Form Tolerance')
                                {
                                    //pagkuha ng sub no count
                                    let onclick_value   = $(`#a_add_igm_item_no_${item_no_index}_sub_no`).attr('onclick').split(',');
                                    let sub_no_count    = onclick_value[2];
    
                                    for (let sub_no_index = 1; sub_no_index <= sub_no_count; sub_no_index++) 
                                    {
                                        for (let min_max_index = 1; min_max_index <= 5; min_max_index++) 
                                        {
                                            let min_value = $(`#txt_item_no_${item_no_index}_sub_no_${sub_no_index}_min_${min_max_index}`).val();
                                            let max_value = $(`#txt_item_no_${item_no_index}_sub_no_${sub_no_index}_max_${min_max_index}`).val();
    
                                            if (min_value === '')
                                            {
                                                $(`#txt_item_no_${item_no_index}_sub_no_${sub_no_index}_min_${min_max_index}`).val('-');
                                            }
                
                                            if (max_value === '')
                                            {
                                                $(`#txt_item_no_${item_no_index}_sub_no_${sub_no_index}_max_${min_max_index}`).val('-');
                                            }
                                        }
                                    }
                                }
    
                                //pagkuha ng item judgements para sa buong judgment ng trial
                                let item_judgment = $(`#td_item_no_${item_no_index}_judgement span`).text();
                                
                                if (item_judgment === 'N/A')
                                {
                                    na_judgement_count++;
                                }
                                else if (item_judgment === 'NG')
                                {
                                    ng_judgement_count++;
                                }
    
                                if (item_no_index === parseInt(item_no_count))
                                {
                                    if (na_judgement_count > 0)
                                    {
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Item with no judgement has been found',
                                            text: 'Please check your checksheet items.',
                                        })
                                    }
                                    else
                                    {
                                        //checking if NG or OK
                                        (ng_judgement_count > 0) ? final_judgment = 'NG' : final_judgment = 'GOOD';
                                        
                                        Swal.fire(
                                            $.extend(swal_options, {
                                                title   : "Are you sure?",
                                                text    : `Click 'Yes' to finish the inspection, 'No' if you want to continue inspecting.`,
                                            })
                                        ).then((result) => 
                                        {
                                            if (result.value) 
                                            {
                                                CHECKSHEET.ProceedSaveTrialChecksheet(final_judgment)
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    };
    
    this_checksheet.ProceedSaveTrialChecksheet = (final_judgment) => {

        $('#div_trial_checksheet').LoadingOverlay('show');

        let form_data = new FormData($('#form_trial_checksheet')[0]);
        form_data.append('judgment',final_judgment)

        $.ajax({
            url         : `finished-checksheet`,
            type        : 'post',
            dataType    : 'json',
            cache       : false,
			contentType : false,
			processData : false,
            data        : form_data,
            success: result => 
            {
                if (result.status === 'Success')
                {  
                    $('.form_trial_checksheet_field_error').remove();
                    
                    $('#btn_validate_load_igm').prop('hidden', false);
                    $('#tbl_igm').prop('hidden', true);
                    $('#tbody_tbl_igm').prop('hidden', true);

                    $('#tbl_new_igm').prop('hidden', true);
                    $('#tbody_tbl_new_igm').empty();

                    //pag empty ng table sa takt time at downtime
                    $('#tbody_tbl_takt_time').empty();
                    $('#tbody_tbl_downtime').empty();
                    $('#td_total_downtime').html('');
                    
                    CHECKSHEET.StopCycleTime();

                    $('#form_trial_checksheet')[0].reset();
                    $('#txt_revision_number').empty();
                    $('#txt_trial_number').empty();
                    $('#txt_inspection_reason').empty();

                    $('#btn_start_time').prop('disabled',true);

                    CHECKSHEET.getForInspection();
                    item_no_count = '';
                    

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: result.message,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                        allowOutsideClick: false,
                    }).then((result) => 
                    {
                        if (result.value) 
                        {
                            location.reload();
                        }
                    })
                }
                else
                {
                    Swal.fire({
                        icon: 'error',
                        title: result.status,
                        text: result.message,
                    })
                }

                $('#div_trial_checksheet').LoadingOverlay('hide');
            }
        });
    };

    this_checksheet.getForInspection = () =>
    {
        $('#tbl_inspection_list').LoadingOverlay('show');
        
        $.ajax({
            url     : `get-for-inspection`,
            type    : 'get',
            dataType: 'json',
            cache   : false,
            success: data => 
            {
                $('#tbl_inspection_list').DataTable().destroy();
                $('#tbody_tbl_inspection_list').empty();

                console.log(data);

                let tbody = '';
               
                data.data.forEach((value) => {


                    tbody +=
                        `<tr>
                        <td> 
                            <button type="button" class="btn btn-primary btn-block" onclick="CHECKSHEET.LoadDetails('${value.application_date}');" ><strong class="strong-font"><i class="ti-search"></i> INSPECT </strong></button> 
                        </td>
                        <td> ${value.part_number} </td>
                        <td> ${value.inspection_reason} </td>
                        <td> ${value.revision_number} </td>
                        <td> ${value.trial_number} </td>
                        <td> ${value.part_name} </td>
                        <td> ${value.supplier_code} / ${value.supplier_name} </td>
                        <td> ${value.inspector_id} </td>
                    </tr>`;
                    
                });

                $('#tbody_tbl_inspection_list').html(tbody);

                $('#tbl_inspection_list').DataTable(
                    {
                        pageLength : 5,
                        lengthMenu: [5, 10, 50, 100]
                    }
                );
                $('#tbl_inspection_list').LoadingOverlay('hide');
            }
        });        
    }

    return this_checksheet;
})();


