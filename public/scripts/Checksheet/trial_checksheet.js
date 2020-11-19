$(document).ready(function () {
    CHECKSHEET.LoadRefreshAlert();
    CHECKSHEET.InitializeCycleTimeTimer();
    CHECKSHEET.LoadDowntimeRunningTimeInterval();
});

const CHECKSHEET = (() => {
    let this_checksheet = {};

    let downtime_count = 1;

    let array_item = [];
    let array_sub_item = [];
    let array_file_type = ['PNG', 'JPG', 'JPEG', 'pdf', 'xlsx', 'xls'];
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
                $('#slc_part_number').empty();
                let select_options = '<option value="" selected disabled>Select part no.</option>';

                data.data.forEach((value) => {
                    select_options += `<option value="${value.part_number}">${value.part_number}</option>`
                });

                $('#slc_part_number').append(select_options);
            }
        });
    };

    this_checksheet.LoadRevision = (part_number) => {
        $('#slc_revision_number').LoadingOverlay('show');

        $.ajax({
            url: `load-revision`,
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {
                part_number: part_number
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

    this_checksheet.LoadTrialNumber = () => {

        let part_number = $('#slc_part_number').val();
        let revision_number = $('#slc_revision_number').val();

        $('#slc_trial_number').LoadingOverlay('show');

        $.ajax({
            url: `load-trial-number`,
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {
                part_number: part_number,
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

    this_checksheet.ValidateLoadDetails = () => {

        let part_number = $('#slc_part_number').val();
        let revision_number = $('#slc_revision_number').val();
        let trial_number = $('#slc_trial_number').val();

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
            CHECKSHEET.LoadDetails(part_number, revision_number, trial_number);
        }
    };

    this_checksheet.LoadDetails = (part_number, revision_number, trial_number) => {

        $('#accordion_details').LoadingOverlay('show');
        $('#div_card_takt_time').LoadingOverlay('show');

        $.ajax({
            url: `load-details`,
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {
                part_number: part_number,
                revision_number: revision_number,
                trial_number: trial_number,
            },
            success: data => {
                if (data.status === 'Success') {

                    //checksheet details
                    $('#trial_checksheet_id').val(data.data.trial_checksheets.id);
                    $('#txt_part_name').val(data.data.trial_checksheets.part_name);
                    $('#txt_model_name').val(data.data.trial_checksheets.model_name);
                    $('#txt_received_date').val(data.data.trial_checksheets.received_date);
                    $('#txt_inspection_completion_date').val(data.data.trial_checksheets.delivery_date);
                    $('#txt_actual_inspection_time').val(data.data.trial_checksheets.inspection_actual_time);
                    $('#txt_inspection_reason').val(data.data.trial_checksheets.inspection_reason);
                    $('#txt_die_kind').val(data.data.trial_checksheets.die_class);
                    $('#txt_inspector').val(data.data.trial_checksheets.inspector_id);
                    $('#txt_supplier_code').val(data.data.trial_checksheets.supplier_code);
                    $('#txt_supplier_name').val(data.data.trial_checksheets.supplier_name);

                    var target_takt_time = data.data.trial_checksheets.inspection_required_time * 60;
                    var total_takt_time = 0;

                    //existing na takt time
                    if (data.data.takt_times.length > 0) {
                        //last array element of target takt time
                        array_takt_time_data = data.data.takt_times[data.data.takt_times.length - 1];
                        target_takt_time = array_takt_time_data['takt_time'] * 60;

                        // sum ng takt time para sa actual time na timer
                        let sum_total_takt_time = 0;
                        data.data.takt_times.forEach((value) => {
                            sum_total_takt_time += parseFloat(value.total_takt_time);
                        });

                        total_takt_time = -Math.abs(sum_total_takt_time * 60);
                        CHECKSHEET.LoadCycleTime();
                        CHECKSHEET.LoadDowntime();
                    }

                    //target takt time
                    $('#div_target_takt_time_timer').attr('data-timer', target_takt_time);
                    $("#div_target_takt_time_timer").TimeCircles().rebuild();
                    $("#div_target_takt_time_timer").TimeCircles().stop();

                    //actual time
                    $('#div_actual_time_timer').attr('data-timer', total_takt_time);
                    $("#div_actual_time_timer").TimeCircles().rebuild();
                    $("#div_actual_time_timer").TimeCircles().stop();

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

    this_checksheet.StartCycleTime = (downtime_running_time) => {

        $('#div_card_takt_time').LoadingOverlay('show');

        let trial_checksheet_id = $('#trial_checksheet_id').val();
        let target_takt_time = $('#div_target_takt_time_timer').attr('data-timer') / 60;
        let part_number = $('#slc_part_number').val();
        let revision_number = $('#slc_revision_number').val();
        let trial_number = $('#slc_trial_number').val();

        $.ajax({
            url: `start-cycle-time`,
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {
                _token: _TOKEN,
                trial_checksheet_id: trial_checksheet_id,
                takt_time: target_takt_time,
                part_number: part_number,
                revision_number: revision_number,
                trial_number: trial_number,
            },
            success: data => {

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

                    $('#trial_checksheet_id').val(data.data.trial_checksheet_id);

                    CHECKSHEET.LoadCycleTime();

                    $('#div_accordion_igm').prop('hidden', false);
                    $('#div_card_takt_time').LoadingOverlay('hide');
                }
            }
        });

        CHECKSHEET.LoadDowntimeRunningTimeInterval();
        FOOTER.LoadNavbarDateTimeInterval();
    };

    this_checksheet.LoadCycleTime = () => {

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
                data.data.forEach((value) => {

                    tbody += `<tr>
                        <td>${value.start_date}</td>
                        <td>${value.start_time}</td>
                        <td>${value.end_time}</td>
                        <td>${value.total_takt_time}</td>
                    </tr>`;

                });
                $('#tbody_tbl_takt_time').html(tbody);
            }
        });
    };

    this_checksheet.StopCycleTime = (actual_time) => {

        $('#div_card_takt_time').LoadingOverlay('show');

        let trial_checksheet_id = $('#trial_checksheet_id').val();

        let remaining_target_takt_time = $('#div_target_takt_time_timer').TimeCircles().getTime();
        let converted_remaining_target_takt_time = remaining_target_takt_time / 60;

        let remaining_takt_time = $("#div_takt_time_timer").TimeCircles().getTime();
        let absolute_value_remaining_takt_time = Math.abs(Math.floor(remaining_takt_time));
        let converted_remaining_takt_time = absolute_value_remaining_takt_time / 60;

        let remaining_actual_time = $("#div_actual_time_timer").TimeCircles().getTime();
        let absolute_value_remaining_actual_time = Math.abs(Math.floor(remaining_actual_time));
        let converted_remaining_actual_time = absolute_value_remaining_actual_time / 60;

        $.ajax({
            url: `stop-cycle-time`,
            type: 'patch',
            dataType: 'json',
            cache: false,
            data: {
                _token: _TOKEN,
                trial_checksheet_id: trial_checksheet_id,
                total_takt_time: converted_remaining_takt_time.toFixed(2),
                actual_time: converted_remaining_actual_time.toFixed(2),
                takt_time: converted_remaining_target_takt_time.toFixed(2),
            },
            success: data => {

                if (data.status === 'Success') {
                    CHECKSHEET.LoadCycleTime();
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

                    $('#div_card_takt_time').LoadingOverlay('hide');
                }
            }
        });
    };

    this_checksheet.DowntimeTimerAction = (status) => {

        let downtime_running_time = $("#txt_downtime_running_time").text();
        let downtime_type = $("#slc_downtime_type").val();

        if (downtime_type === null) {
            $("#span_error_downtime_type").remove();
            $("#slc_downtime_type").before('<span id ="span_error_downtime_type" class="span-error">Required</span>');
        } else {

            $("#span_error_downtime_type").remove();
            if (status === 'start_downtime') {
                var text = 'start';
            } else {
                text = 'stop';
            }
            Swal.fire(
                $.extend(swal_options, {
                    title: `Are you sure you want to ${text} downtime?`,
                })
            ).then((result) => {
                if (result.value) {
                    CHECKSHEET.Downtime(text, downtime_type);
                }
            });
        }
    };

    this_checksheet.LoadDowntime = () => {
        let trial_checksheet_id = $('#trial_checksheet_id').val();

        $.ajax({
            url: `load-down-time`,
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {
                trial_checksheet_id: trial_checksheet_id,
            },
            success: data => {
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
            }
        });
    };

    this_checksheet.Downtime = (status, downtime_type) => {

        let trial_checksheet_id = $('#trial_checksheet_id').val();

        if (status === 'start') {

            $("#div_downtime_timer").TimeCircles().start();
            $("#btn_finish_downtime").prop("disabled", false);
            $("#btn_start_downtime").prop("disabled", true);
            $("#span_error_downtime_type").prop("disabled", true);
            $("#slc_downtime_type").prop("disabled", true);
            $("#btn_stop_time").prop("disabled", true);

            var total_down_time = null;
        } else {
            let downtime = $("#div_downtime_timer").TimeCircles().getTime();
            let absolute_value_downtime = Math.abs(Math.floor(downtime));
            total_down_time = (absolute_value_downtime / 60).toFixed(2);

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
            url: `downtime`,
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {
                _token: _TOKEN,
                trial_checksheet_id: trial_checksheet_id,
                type: downtime_type,
                total_down_time: total_down_time,
            },
            success: result => {
                CHECKSHEET.LoadDowntime();
            }
        });

        $("#div_takt_time_timer").TimeCircles().stop();
    };

    this_checksheet.AttachFile = () => {

        $('#tbl_attachment').prop('hidden', false);
        $('#txt_attachment').LoadingOverlay('show');
        $('#tbl_attachment').LoadingOverlay('show');
        $('#div_date_inspected').remove();

        let date_inspected_input = `<div id="div_date_inspected">
            <label>DATE INSPECTED:</label>&nbsp;
            <span id="span_date_inspected" class="span-error"></span>
            <input class="form-control mb-3" type="text"
                placeholder="Date Inspected" id="txt_date_inspected" disabled>
        </div>`;

        $('#lbl_temperature').before(date_inspected_input);

        let file_length = $('#txt_attachment')[0].files.length;
        let tr = '';

        for (let file_count = 0; file_count < file_length; file_count++) {
            let file = $('#txt_attachment')[0].files[file_count];
            let file_name = $('#txt_attachment')[0].files[file_count].name;
            let split_file = file_name.split('.');

            if (array_file_type.includes(split_file[1]) === true) {
                array_files.push(file);
                tr += `
                <tr id="tr_attached_file_${file_count}">
                    <td>${file_name}</td>
                    <td>
                        <button class="btn btn-danger btn-xs" onclick="CHECKSHEET.RemoveAttachedFile(${file_count},'${file_name}');"><i class="ti-close"></i> REMOVE</button>
                    </td>
                </tr>`;

            } else {
                $('#txt_attachment span').remove();
                $('#txt_attachment').after(`<span class="span-error">"${file_name}" is an invalid file</span><br><br>`)
            }
        }
        $('#tbody_tbl_attachment').html(tr);
        $('#txt_attachment').LoadingOverlay('hide');
        $('#tbl_attachment').LoadingOverlay('hide');
    };

    this_checksheet.RemoveAttachedFile = (file_no, file_name_in_table) => {

        $(`#tr_attached_file_${file_no}`).remove();

        for (let file_count = 0; file_count < array_files.length; file_count++) {

            if (array_files[file_count].name === file_name_in_table) {

                array_files = $.grep(array_files, function (value) {
                    return value.name != file_name_in_table;
                });
            }
        }

        if (array_files.length === 0) {
            $('#txt_attachment').val('');
            $('#div_date_inspected').remove();
            $('#tbl_attachment').prop('hidden', true);
            let date_inspected_input = `<div id="div_date_inspected">
                <label>DATE INSPECTED:</label>&nbsp;
                <span id="span_date_inspected" class="span-error"></span>
                <input class="form-control mb-3" type="text"
                    placeholder="Date Inspected" id="txt_date_inspected" disabled>
            </div>`;

            $('#div_tble_attachment').after(date_inspected_input);
        }
    };

    this_checksheet.SaveTrialChecksheet = () => {

        let part_no = $('#slc_part_no').val();
        let attachment = $('#txt_attachment').val();
        let temperature = $('#txt_temperature').val();
        let humidity = $('#txt_humidity').val();

        $('.form_trial_checksheet_field').each(function () {
            if ($(this).val() === '' || $(this).val() === null) {
                $('.form_trial_checksheet_field_error').text('Required');
            } else {
                if (part_no !== null) {
                    $('#span_part_no').prop('hidden', true);
                }
                if (attachment !== '') {
                    $('#span_attach_file').prop('hidden', true);
                }
                if (temperature !== '') {
                    $('#span_temperature').prop('hidden', true);
                }
                if (humidity !== '') {
                    $('#span_humidity').prop('hidden', true);
                }
                if (part_no !== null && attachment !== '' && temperature !== '' && humidity !== '') {
                    Swal.fire(
                        $.extend(swal_options, {
                            title: "Are you sure?",
                        })
                    ).then((result) => {
                        if (result.value) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Saved Successfully',
                            })
                            CHECKSHEET.SaveTrialChecksheetGetExistingIGMItem();
                            CHECKSHEET.SaveTrialChecksheetGetAddedIGMItem();
                            console.log(array_item)
                            console.log(array_sub_item)
                            $('#form_trial_checksheet')[0].reset();
                            $('#slc_part_no').val('').trigger('change');
                        }
                    });
                }
            }
        });
    };

    this_checksheet.SaveTrialChecksheetGetExistingIGMItem = () => {

        let existing_item_no_count = item_no_count - new_item_no_count;

        for (let item_count = 1; item_count <= existing_item_no_count; item_count++) {
            array_item.push({
                item_no: item_count,
                item_tools: $(`#td_item_no_${item_count}_tools`).html(),
                item_type: $(`#td_item_no_${item_count}_type`).html(),
                item_specs: $(`#td_item_no_${item_count}_specs`).html(),
                item_upper_limit: $(`#td_item_no_${item_count}_upper_limit`).html(),
                item_lower_limit: $(`#td_item_no_${item_count}_lower_limit`).html(),
                item_judgement: $(`#td_item_no_${item_count}_judgement`).html()
            });

            let item_no_type = $(`#span_item_no_${item_count}_type`).text();
            let sub_item_count_per_item = $(`#span_item_no_${item_count}_sub_item_count`).text();

            for (let sub_item_count = 1; sub_item_count <= sub_item_count_per_item; sub_item_count++) {

                if (item_no_type === 'MC') {

                    array_sub_item.push({
                        item_no: item_count,
                        sub_no: sub_item_count,
                        //coordinates
                        sub_item_coordinates: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_coordinates`).html(),
                        //data
                        sub_item_visual_1: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_visual_1`).html(),
                        sub_item_visual_2: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_visual_2`).html(),
                        sub_item_visual_3: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_visual_3`).html(),
                        sub_item_visual_4: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_visual_4`).html(),
                        sub_item_visual_5: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_visual_5`).html(),
                        //judgment
                        sub_item_judgement: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_judgement`).html(),
                    });

                } else {

                    array_sub_item.push({
                        item_no: item_count,
                        sub_no: sub_item_count,
                        //coordinates
                        sub_item_coordinates: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_coordinates`).html(),
                        //min
                        sub_item_min_1: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_min_1`).html(),
                        sub_item_min_2: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_min_2`).html(),
                        sub_item_min_3: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_min_3`).html(),
                        sub_item_min_4: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_min_4`).html(),
                        sub_item_min_5: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_min_5`).html(),
                        //max
                        sub_item_max_1: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_max_1`).html(),
                        sub_item_max_2: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_max_2`).html(),
                        sub_item_max_3: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_max_3`).html(),
                        sub_item_max_4: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_max_4`).html(),
                        sub_item_max_5: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_max_5`).html(),
                        //judgement
                        sub_item_judgement: $(`#td_item_no_${item_count}_sub_no_${sub_item_count}_judgement`).html()
                    });

                }

            }
        }
    };

    this_checksheet.SaveTrialChecksheetGetAddedIGMItem = () => {

        let item_no = (item_no_count - new_item_no_count) + 1;

        for (let item_count = 1; item_count <= new_item_no_count; item_count++) {
            array_item.push({
                item_no: item_no,
                item_tools: $(`#txt_item_no_${item_no}_tools`).val(),
                item_type: $(`#txt_item_no_${item_no}_type`).val(),
                item_specs: $(`#txt_item_no_${item_no}_specs`).val(),
                item_upper_limit: $(`#txt_item_no_${item_no}_upper_limit`).val(),
                item_lower_limit: $(`#txt_item_no_${item_no}_lower_limit`).val(),
                item_judgement: $(`#td_item_no_${item_no}_judgement`).html()
            });

            let a_add_igm_item_no_onclick = $(`#a_add_igm_item_no_${item_no}`).attr('onclick');
            let split_a_add_igm_item_no_onclick = a_add_igm_item_no_onclick.split(',');
            let sub_item_count_per_item = split_a_add_igm_item_no_onclick[2];

            let split_split_a_add_igm_item_no_onclick = split_a_add_igm_item_no_onclick[0].split('(');
            let item_no_type = split_split_a_add_igm_item_no_onclick[1].replace(/'/g, '');

            for (let sub_item_count = 1; sub_item_count <= sub_item_count_per_item; sub_item_count++) {

                if (item_no_type === 'MC') {

                    array_sub_item.push({
                        item_no: item_no,
                        sub_no: sub_item_count,
                        //coordinates
                        sub_item_coordinates: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_coordinates`).val(),
                        //data
                        sub_item_visual_1: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_visual_1`).val(),
                        sub_item_visual_2: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_visual_2`).val(),
                        sub_item_visual_3: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_visual_3`).val(),
                        sub_item_visual_4: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_visual_4`).val(),
                        sub_item_visual_5: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_visual_5`).val(),
                        //judgment
                        sub_item_judgement: $(`#td_item_no_${item_no}_sub_no_${sub_item_count}_judgement`).html(),
                    });

                } else {

                    array_sub_item.push({
                        item_no: item_no,
                        sub_no: sub_item_count,
                        //coordinates
                        sub_item_coordinates: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_coordinates`).val(),
                        //min
                        sub_item_min_1: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_min_1`).val(),
                        sub_item_min_2: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_min_2`).val(),
                        sub_item_min_3: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_min_3`).val(),
                        sub_item_min_4: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_min_4`).val(),
                        sub_item_min_5: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_min_5`).val(),
                        //max
                        sub_item_max_1: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_max_1`).val(),
                        sub_item_max_2: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_max_2`).val(),
                        sub_item_max_3: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_max_3`).val(),
                        sub_item_max_4: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_max_4`).val(),
                        sub_item_max_5: $(`#txt_item_no_${item_no}_sub_no_${sub_item_count}_max_5`).val(),
                        //judgement
                        sub_item_judgement: $(`#td_item_no_${item_no}_sub_no_${sub_item_count}_judgement`).html()
                    });

                }

            }
            item_no++;
        }
    };


    return this_checksheet;
})();
