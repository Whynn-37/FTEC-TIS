$(document).ready(function () {
    CHECKSHEET.LoadRefreshAlert();
    CHECKSHEET.InitializeCycleTimeTimer();
    CHECKSHEET.LoadDowntimeRunningTimeInterval();
});

let logVisit = function () {

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
};

window.addEventListener('beforeunload', logVisit);

const CHECKSHEET = (() => {
    let this_checksheet = {};

    let downtime_count = 1;

    let array_item = [];
    let array_sub_item = [];
    let array_file_type = ['png', 'jpg', 'jpeg','PNG', 'JPG', 'JPEG', 'pdf'];
    let array_files = [];

    // pang refresh ng trial ledger
    this_checksheet.LoadRefreshAlert = () => {
        $('#div_main_content').prop('hidden', true)
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
                    url: `store-trial-ledger`,
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: {
                        _token: _TOKEN
                    },
                    success: result => {
                        if (result.status === 'Success') {
                            swal.close();
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: result.message,
                                allowOutsideClick: false,
                            })
                            $('#div_main_content').prop('hidden', false);
                            CHECKSHEET.LoadPartnumber();
                        } else {
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
            url: `load-partnumber`,
            type: 'get',
            dataType: 'json',
            cache: false,
            success: data => {
                console.log(data.data);

                $('#slc_part_number').empty();
                let select_options = '<option value="" selected disabled>Select part no.</option>';

                data.data.forEach((value) => {
                    select_options += `<option value="${value.part_number}">${value.part_number}</option>`
                });

                $('#slc_part_number').append(select_options);
            }
        });
    };

    //
    this_checksheet.LoadInspectionReason = (part_number) => {
        // $('#slc_inspection_reason').LoadingOverlay('show');
        $('#slc_revision_number').empty();
        $.ajax({
            url: `load-inspection-reason`,
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {
                part_number: part_number
            },
            success: data => {
                // console.log(data);
                $('#slc_inspection_reason').empty();

                let select_options = '<option value="" selected disabled>Select inspection reason</option>';

                data.data.forEach((value) => {
                    select_options += `<option value="${value.inspection_reason}">${value.inspection_reason}</option>`;
                });

                $('#slc_inspection_reason').append(select_options);
                $('#slc_inspection_reason').LoadingOverlay('hide');
            }
        });
    };

    //
    this_checksheet.LoadRevision = (inspection_reason) => {
        $('#slc_revision_number').LoadingOverlay('show');
        $('#slc_trial_number').empty();

        let part_number = $('#slc_part_number').val();

        $.ajax({
            url: `load-revision`,
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {
                part_number: part_number,
                inspection_reason: inspection_reason
            },
            success: data => {
                $('#slc_revision_number').empty();

                let select_options = '<option value="" selected disabled>Select revision number</option>';

                data.data.forEach((value) => {
                    select_options += `<option value="${value.revision_number}">${value.revision_number}</option>`;
                });

                $('#slc_revision_number').append(select_options);
                $('#slc_revision_number').LoadingOverlay('hide');
            }
        });
    };

    //
    this_checksheet.LoadTrialNumber = (revision_number) => {

        let part_number = $('#slc_part_number').val();
        let inspection_reason = $('#slc_inspection_reason').val();

        $('#slc_trial_number').LoadingOverlay('show');

        $.ajax({
            url: `load-trial-number`,
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {
                part_number: part_number,
                inspection_reason: inspection_reason,
                revision_number: revision_number,
            },
            success: data => {
                $('#slc_trial_number').empty();

                let select_options = '<option value="" selected disabled>Select trial number</option>';

                data.data.forEach((value) => {
                    select_options += `<option value="${value.trial_number}">${value.trial_number}</option>`;
                });

                $('#slc_trial_number').append(select_options);
                $('#slc_trial_number').LoadingOverlay('hide');
            }
        });
    };

    //
    this_checksheet.LoadApplicationDate = () => {

        let part_number = $('#slc_part_number').val();
        let inspection_reason = $('#slc_inspection_reason').val();
        let revision_number = $('#slc_revision_number').val();
        let trial_number = $('#slc_trial_number').val();

        $.ajax({
            url: `load-application-date`,
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {
                part_number: part_number,
                inspection_reason: inspection_reason,
                revision_number: revision_number,
                trial_number: trial_number,
            },
            success: data => {
                $('#trial_checksheet_application_date').empty();
                $('#trial_checksheet_application_date').val(data.data.application_date);
            }
        });
    };

    // this_checksheet.LoadRevision = (part_number) => {
    //     $('#slc_revision_number').LoadingOverlay('show');
    //     $('#slc_trial_number').empty();
    //     $.ajax({
    //         url: `load-revision`,
    //         type: 'get',
    //         dataType: 'json',
    //         cache: false,
    //         data: {
    //             part_number: part_number
    //         },
    //         success: data => {
    //             $('#slc_revision_number').empty();

    //             let select_options = '<option value="" selected disabled>Select revision number</option>';

    //             data.data.forEach((value) => {
    //                 select_options += `<option value="${value.revision_number}">${value.revision_number}</option>`;
    //             });

    //             $('#slc_revision_number').append(select_options);
    //             $('#slc_revision_number').LoadingOverlay('hide');
    //         }
    //     });
    // };

    // this_checksheet.LoadTrialNumber = () => {

    //     let part_number = $('#slc_part_number').val();
    //     let revision_number = $('#slc_revision_number').val();

    //     $('#slc_trial_number').LoadingOverlay('show');

    //     $.ajax({
    //         url: `load-trial-number`,
    //         type: 'get',
    //         dataType: 'json',
    //         cache: false,
    //         data: {
    //             part_number: part_number,
    //             revision_number: revision_number,
    //         },
    //         success: data => {
    //             $('#slc_trial_number').empty();

    //             let select_options = '<option value="" selected disabled>Select trial number</option>';

    //             data.data.forEach((value) => {
    //                 select_options += `<option value="${value.trial_number}">${value.trial_number}</option>`;
    //             });

    //             $('#slc_trial_number').append(select_options);
    //             $('#slc_trial_number').LoadingOverlay('hide');
    //         }
    //     });
    // };

    //
    this_checksheet.ValidateLoadDetails = () => {

        let part_number = $('#slc_part_number').val();
        let inspection_reason = $('#slc_inspection_reason').val();
        let revision_number = $('#slc_revision_number').val();
        let trial_number = $('#slc_trial_number').val();

        let application_date = $('#trial_checksheet_application_date').val();

        if (part_number === null && revision_number === null && trial_number === null) {
            $('#span_error_part_number').remove();
            $('#span_error_revision_number').remove();
            $('#span_error_trial_number').remove();
            $('#slc_part_number').before('<span id ="span_error_part_number" class="span-error">Required</span>');
            $('#slc_revision_number').before('<span id ="span_error_revision_number" class="span-error">Required</span>');
            $('#slc_trial_number').before('<span id ="span_error_trial_number" class="span-error">Required</span>');
        } else if (revision_number === null && trial_number === null) {
            $('#span_error_part_number').remove();
            $('#span_error_revision_number').remove();
            $('#span_error_trial_number').remove();
            $('#slc_revision_number').before('<span id ="span_error_revision_number" class="span-error">Required</span>');
            $('#slc_trial_number').before('<span id ="span_error_trial_number" class="span-error">Required</span>');
        } else if (trial_number === null) {
            $('#span_error_part_number').remove();
            $('#span_error_revision_number').remove();
            $('#span_error_trial_number').remove();
            $('#slc_trial_number').before('<span id ="span_error_trial_number" class="span-error">Required</span>');
        } else {
            $('#span_error_part_number').remove();
            $('#span_error_revision_number').remove();
            $('#span_error_trial_number').remove();
            // CHECKSHEET.LoadDetails(part_number, inspection_reason, revision_number, trial_number);
            CHECKSHEET.LoadDetails(application_date);
        }

        // if (part_number === null && revision_number === null && trial_number === null) {
        //     $('#span_error_part_number').remove();
        //     $('#span_error_revision_number').remove();
        //     $('#span_error_trial_number').remove();
        //     $('#slc_part_number').before('<span id ="span_error_part_number" class="span-error">Required</span>');
        //     $('#slc_revision_number').before('<span id ="span_error_revision_number" class="span-error">Required</span>');
        //     $('#slc_trial_number').before('<span id ="span_error_trial_number" class="span-error">Required</span>');
        // } else if (revision_number === null && trial_number === null) {
        //     $('#span_error_part_number').remove();
        //     $('#span_error_revision_number').remove();
        //     $('#span_error_trial_number').remove();
        //     $('#slc_revision_number').before('<span id ="span_error_revision_number" class="span-error">Required</span>');
        //     $('#slc_trial_number').before('<span id ="span_error_trial_number" class="span-error">Required</span>');
        // } else if (trial_number === null) {
        //     $('#span_error_part_number').remove();
        //     $('#span_error_revision_number').remove();
        //     $('#span_error_trial_number').remove();
        //     $('#slc_trial_number').before('<span id ="span_error_trial_number" class="span-error">Required</span>');
        // } else {
        //     $('#span_error_part_number').remove();
        //     $('#span_error_revision_number').remove();
        //     $('#span_error_trial_number').remove();
        //     CHECKSHEET.LoadDetails(part_number, revision_number, trial_number);
        // }
    };

    //
    // this_checksheet.LoadDetails = (part_number, inspection_reason, revision_number, trial_number) => {
    this_checksheet.LoadDetails = (application_date) => {

        $('#accordion_details').LoadingOverlay('show');
        $('#div_card_takt_time').LoadingOverlay('show');

        $.ajax({
            url: `load-details`,
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {
                // part_number: part_number,
                // inspection_reason: inspection_reason,
                // revision_number: revision_number,
                // trial_number: trial_number,
                application_date: application_date,
            },
            success: data => {
                if (data.status === 'Success') {

                    //checksheet details
                    $('#trial_checksheet_id').val(data.data.trial_checksheets.id);
                    $('#trial_checksheet_application_date').val(data.data.trial_checksheets.application_date);
                    $('#txt_part_name').val(data.data.trial_checksheets.part_name);
                    $('#txt_model_name').val(data.data.trial_checksheets.model_name);
                    $('#txt_received_date').val(data.data.trial_checksheets.received_date);
                    $('#txt_inspection_completion_date').val(data.data.trial_checksheets.delivery_date);
                    $('#txt_actual_inspection_time').val(data.data.trial_checksheets.inspection_actual_time);
                    // $('#txt_inspection_reason').val(data.data.trial_checksheets.inspection_reason);
                    $('#txt_die_kind').val(data.data.trial_checksheets.die_class);
                    $('#txt_inspector').val(data.data.trial_checksheets.inspector_id);
                    $('#txt_supplier_code').val(data.data.trial_checksheets.supplier_code);
                    $('#txt_supplier_name').val(data.data.trial_checksheets.supplier_name);

                    // load ng IGM
                    // IGM.LoadIGM(data.data.trial_checksheets.id);
                    //load ng cycle time
                    CHECKSHEET.LoadCycleTime(data.data.trial_checksheets.inspection_required_time);
                    //load ng downtime
                    CHECKSHEET.LoadDowntime();

                    $('#btn_start_time').prop('disabled', false);

                    $('#accordion_details').LoadingOverlay('hide');
                    $('#div_card_takt_time').LoadingOverlay('hide');

                }
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
            if (result.value) {
                if (status === "start_takt_time") {
                    CHECKSHEET.StartCycleTime(downtime_running_time);
                } else {
                    CHECKSHEET.StopCycleTime(downtime_running_time);
                }
            }
        });
    };

    //
    this_checksheet.StartCycleTime = (downtime_running_time) => {

        $('#div_card_takt_time').LoadingOverlay('show');

        let trial_checksheet_id = $('#trial_checksheet_id').val();
        let application_date    = $('#trial_checksheet_application_date').val();
        let target_takt_time    = $('#div_target_takt_time_timer').attr('data-timer') / 60;
        let part_number         = $('#slc_part_number').val();
        let revision_number     = $('#slc_revision_number').val();
        let trial_number        = $('#slc_trial_number').val();
        let inspection_reason   = $('#slc_inspection_reason').val();
        

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
                //
                inspection_reason   : inspection_reason,
            },
            success: data => 
            {
                if (data.status === 'Success') {
                    //checksheet details
                    $('#slc_part_number').prop('readonly', true);
                    $('#slc_revision_number').prop('readonly', true);
                    $('#slc_trial_number').prop('readonly', true);
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


                    //pag show ng attachments at ssave button
                    $('#div_row_numbering_drawing').prop('hidden',false);
                    $('#div_row_special_tool_data').prop('hidden',false);
                    $('#div_row_others_2').prop('hidden',false);
                    $('#div_row_save_inspection').prop('hidden',false);

                    //pag show ng igm
                    $('#div_accordion_igm').prop('hidden', false);
                    $('#div_card_takt_time').LoadingOverlay('hide');
                }
            }
        });

        CHECKSHEET.LoadDowntimeRunningTimeInterval();
        FOOTER.LoadNavbarDateTimeInterval();
    };

    this_checksheet.LoadCycleTime = (inspection_required_time, status = "load_cycle_time") => {

        let trial_checksheet_id = $('#trial_checksheet_id').val();

        $.ajax({
            url: `load-cycle-time`,
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {
                trial_checksheet_id: trial_checksheet_id,
            },
            success: data => {
                $('#tbody_tbl_takt_time').empty();

                let tbody = '';
                var target_takt_time = inspection_required_time * 60;
                var total_sum_total_takt_time = 0;

                data.data.forEach((value) => {
                    //last array element of target takt time
                    array_takt_time_data = data.data[data.data.length - 1];
                    target_takt_time = array_takt_time_data['takt_time'] * 60;

                    // sum ng takt time para sa actual time na timer
                    let sum_total_takt_time = 0;
                    data.data.forEach((value) => {
                        sum_total_takt_time += parseFloat(value.total_takt_time);
                    });

                    total_sum_total_takt_time = -Math.abs(sum_total_takt_time * 60);

                    tbody += `<tr>
                        <td>${value.start_date}</td>
                        <td>${value.start_time}</td>
                        <td>${value.end_time}</td>
                        <td>${value.total_takt_time}</td>
                    </tr>`;

                });

                if (status === 'load_cycle_time') {
                    //target takt time
                    $('#div_target_takt_time_timer').attr('data-timer', target_takt_time);
                    $("#div_target_takt_time_timer").TimeCircles().rebuild();
                    $("#div_target_takt_time_timer").TimeCircles().stop();

                    //actual time
                    $('#div_actual_time_timer').attr('data-timer', total_sum_total_takt_time);
                    $("#div_actual_time_timer").TimeCircles().rebuild();
                    $("#div_actual_time_timer").TimeCircles().stop();
                }
                $('#tbody_tbl_takt_time').html(tbody);
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
                    $('#slc_part_number').prop('readonly', false);
                    $('#slc_revision_number').prop('readonly', false);
                    $('#slc_trial_number').prop('readonly', false);

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

                    //pag show ng attachments at ssave button
                    $('#div_row_numbering_drawing').prop('hidden',true);
                    $('#div_row_special_tool_data').prop('hidden',true);
                    $('#div_row_others_2').prop('hidden',true);
                    $('#div_row_save_inspection').prop('hidden',true);

                    $('#div_accordion_igm').prop('hidden', true);
                    $('#div_card_takt_time').LoadingOverlay('hide');
                }
            }
        });
    };

    this_checksheet.DowntimeTimerAction = (status) => {

        let downtime_type           = $("#slc_downtime_type").val();

        if (downtime_type === null) 
        {
            $("#span_error_downtime_type").remove();
            $("#slc_downtime_type").before('<span id ="span_error_downtime_type" class="span-error">Required</span>');
        } 
        else {
            $("#span_error_downtime_type").remove();
            if (status === 'start_downtime') 
            {
                var text = 'start';
            } 
            else 
            {
                text = 'stop';
            }
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
    };

    this_checksheet.LoadDowntime = () => {

        let trial_checksheet_id = $('#trial_checksheet_id').val();

        if (trial_checksheet_id !== '')
        {
            $('#div_downtime').LoadingOverlay('show');

            $.ajax({
                url: `load-down-time`,
                type: 'get',
                dataType: 'json',
                cache: false,
                data: {
                    trial_checksheet_id: trial_checksheet_id,
                },
                success: data => 
                {
                    $('#tbody_tbl_downtime').empty();

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
                    $('#td_total_downtime').html(sum_downtime);

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
            $("#span_error_downtime_type").prop("disabled", true);
            $("#slc_downtime_type").prop("disabled", true);
            $("#btn_stop_time").prop("disabled", true);
            $("#div_takt_time_timer").TimeCircles().stop();

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
            $("#span_error_downtime_type").prop("disabled", false);
            $("#slc_downtime_type").val(null);
            $("#div_takt_time_timer").TimeCircles().start();
        }

        $.ajax({
            url     : `downtime`,
            type    : 'post',
            dataType: 'json',
            cache   : false,
            data    : {
                _token              : _TOKEN,
                trial_checksheet_id : trial_checksheet_id,
                type                : downtime_type,
                total_down_time     : total_down_time,
            },
            success: result => 
            {
                CHECKSHEET.LoadDowntime();
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
        let part_number             = $('#slc_part_number').val();
        let na_judgement_count      = 0;
        let ng_judgement_count      = 0;
        
        //attachments, ito lang kase itong tatlo ay required
        let numbering_drawing       = $('#txt_attachment_numbering_drawing').attr('name');
        let material_certification  = $('#txt_attachment_material_certification').attr('name');
        let special_tool_data       = $('#txt_attachment_special_tool_data').attr('name');

        //pangclear ng error texts
        $('.form_trial_checksheet_field_error').text('');

        $('.form_trial_checksheet_field').each(function () 
        {
            if ($(this).val() === '' || $(this).val() === null) 
            {
                $('.form_trial_checksheet_field_error').text('Required');
            } 
            else 
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
                        Swal.fire(
                            $.extend(swal_options, {
                                title   : "Are you sure?",
                                text    : `Click 'Yes' to finish the inspection, 'No' if you want to continue inspecting.`,
                            })
                        ).then((result) => 
                        {
                            if (result.value) 
                            {
                                //pagkuha ng item judgements para sa buong judgment ng trial
                                for (let index = 1; index <= parseInt(item_no_count); index++) 
                                {
                                    let item_judgment = $(`#td_item_no_${index}_judgement span`).text();
                                    
                                    if (item_judgment === 'N/A')
                                    {
                                        na_judgement_count++;
                                    }
                                    else if (item_judgment === 'NG')
                                    {
                                        ng_judgement_count++;
                                    }

                                    if (index === parseInt(item_no_count))
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

                                            CHECKSHEET.ProceedSaveTrialChecksheet(final_judgment)
                                        }
                                    }
                                }
                            }
                        });
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
                    
                    // pagrestart at stop ng timer
                    $("#div_target_takt_time_timer").TimeCircles().restart();
                    $("#div_target_takt_time_timer").TimeCircles().stop();

                    $("#div_actual_time_timer").TimeCircles().restart();
                    $("#div_actual_time_timer").TimeCircles().stop();

                    $("#div_takt_time_timer").TimeCircles().restart();
                    $("#div_takt_time_timer").TimeCircles().stop();

                    CHECKSHEET.StopCycleTime();

                    $('#form_trial_checksheet')[0].reset();
                    $('#slc_revision_number').empty();
                    $('#slc_trial_number').empty();

                    $('#btn_start_time').prop('disabled',true);

                    CHECKSHEET.LoadPartnumber();
                    item_no_count = '';
                    $('#div_trial_checksheet').LoadingOverlay('hide');

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: result.message,
                    })
                }
            }
        });
    };

    return this_checksheet;
})();
