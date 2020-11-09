$(document).ready(function () {
    CHECKSHEET.LoadRefreshAlert();
    CHECKSHEET.LoadCycleTimeTimer();
    CHECKSHEET.LoadDowntimeRunningTimeInterval();
});

const CHECKSHEET = (() => {
    let this_checksheet = {};

    let downtime_count = 1;

    let array_item = [];
    let array_sub_item = [];
    let array_file_type = ['PNG', 'JPG', 'JPEG', 'pdf', 'xlsx', 'xls'];
    let array_files = [];

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
                setTimeout(function () {
                    swal.close();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Update complete',
                        allowOutsideClick: false,
                    })
                    $('#div_main_content').prop('hidden', false);
                }, 2000);
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

    this_checksheet.LoadCycleTimeTimer = () => {
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

        Swal.fire(
            $.extend(swal_options, {
                confirmButtonText: 'Yes',
                title: "Are you sure?",
            })
        ).then((result) => {
            if (result.value) {
                if (status === "start_takt_time") {
                    CHECKSHEET.TaktTimeStart(downtime_running_time);
                } else {
                    CHECKSHEET.TaktTimeStop(downtime_running_time);
                }
            }
        });
    };

    this_checksheet.TaktTimeStart = (downtime_running_time) => {
        Swal.fire(
            $.extend(swal_options, {
                title: "Do you want to load the IGM?",
            })
        ).then((result) => {
            if (result.value) {
                CHECKSHEET.ProceedTaktTimeStart(downtime_running_time);
                alert('load igm dito');
                $('#div_accordion_igm').prop('hidden', false);
            } else {
                $('#thead_tbl_igm').prop('hidden', true);
                $('#tbody_tbl_igm').prop('hidden', true);
                item_no_count = 0;
            }
        });

    };

    this_checksheet.ProceedTaktTimeStart = (downtime_running_time) => {
        let new_date = new Date();
        let date_now = new_date.getDate() + "/" + (new_date.getMonth() + 1) + "/" + new_date.getFullYear();

        $("#div_target_takt_time_timer").TimeCircles().start();
        $("#div_takt_time_timer").TimeCircles().start();
        $("#div_actual_time_timer").TimeCircles().start();
        $("#btn_start_time").prop("hidden", true);
        $("#btn_stop_time").prop("hidden", false);
        $("#btn_start_downtime").prop("disabled", false);
        $("#slc_downtime_type").prop("disabled", false);

        $("#td_start_time_takt_time").html(downtime_running_time);

        if ($("#td_date_start_takt_time").html() === "") {
            $("#td_date_start_takt_time").html(date_now);
        }
        if ($("#td_end_time_takt_time").html() !== "") {
            $("#td_end_time_takt_time").html("");
        }

        CHECKSHEET.LoadDowntimeRunningTimeInterval();
        FOOTER.LoadNavbarDateTimeInterval();
    };

    this_checksheet.TaktTimeStop = (downtime_running_time) => {
        let takt_time_left = $("#div_takt_time_timer").TimeCircles().getTime();
        let absolute_value_takt_time_left = Math.abs(Math.floor(takt_time_left));
        let total_takt_time = $("#td_total_takt_time").html();
        let converted_takt_time_left = CONVERSION.ConvertSecondsToTime(absolute_value_takt_time_left);

        if (total_takt_time === "") {
            $("#td_total_takt_time").html(converted_takt_time_left);
        } else {
            converted_total_takt_time = CONVERSION.ConvertTimeToSeconds(total_takt_time);
            sum_total_takt_time = converted_total_takt_time + absolute_value_takt_time_left;
            new_total_takt_time = CONVERSION.ConvertSecondsToTime(sum_total_takt_time);
            $("#td_total_takt_time").html(new_total_takt_time);
        }

        $("#td_end_time_takt_time").html(downtime_running_time);
        $("#btn_start_time").prop("hidden", false);
        $("#btn_stop_time").prop("hidden", true);
        $("#div_target_takt_time_timer").TimeCircles().stop();
        $("#div_actual_time_timer").TimeCircles().stop();
        $("#div_takt_time_timer").TimeCircles().restart();
        $("#div_takt_time_timer").TimeCircles().stop();
        $("#btn_start_downtime").prop("disabled", true);
    };

    this_checksheet.DowntimeTimerAction = (status) => {
        let downtime_running_time = $("#txt_downtime_running_time").text();
        let downtime_type = $("#slc_downtime_type").val();

        Swal.fire(
            $.extend(swal_options, {
                title: "Are you sure?",
            })
        ).then((result) => {
            if (result.value) {
                if (status === "start_downtime") {
                    if (downtime_type === null) {
                        $("#span_error_downtime_type").text("Select type");
                    } else {
                        CHECKSHEET.DowntimeStart(downtime_running_time, downtime_type);
                    }
                } else {
                    CHECKSHEET.DowntimeFinish(downtime_running_time, downtime_type);
                }
            }
        });
    };

    this_checksheet.DowntimeStart = (downtime_running_time, downtime_type) => {
        $("#div_downtime_timer").TimeCircles().start();
        $("#btn_finish_downtime").prop("disabled", false);
        $("#btn_start_downtime").prop("disabled", true);
        $("#span_error_downtime_type").text("");
        $("#slc_downtime_type").val(null);
        $("#slc_downtime_type").prop("disabled", true);
        let tr = "";
        tr += `<tr>
            <td>${downtime_type}</td>
            <td id="td_downtime_start_time${downtime_count}">${downtime_running_time}</td>
            <td id="td_downtime_end_time${downtime_count}"></td>
            <td id="td_downtime${downtime_count}"></td>
        </tr>`;
        $("#tbody_tbl_downtime_code").append(tr);
        $("#div_takt_time_timer").TimeCircles().stop();
    };

    this_checksheet.DowntimeFinish = (downtime_running_time) => {
        $("#div_downtime_timer").TimeCircles().restart();
        $("#div_downtime_timer").TimeCircles().stop();
        $("#btn_finish_downtime").prop("disabled", true);
        $("#btn_start_downtime").prop("disabled", false);
        $("#slc_downtime_type").prop("disabled", false);
        $(`#td_downtime_end_time${downtime_count}`).html(downtime_running_time);

        // start time and end time column calculation
        let downtime_start_time = $(
            `#td_downtime_start_time${downtime_count}`
        ).html();
        let converted_downtime_start_time = CONVERSION.ConvertTimeToSeconds(downtime_start_time);
        let converted_downtime_end_time = CONVERSION.ConvertTimeToSeconds(downtime_running_time);
        //downtime column calculation
        let downtime_difference = converted_downtime_end_time - converted_downtime_start_time;
        let converted_downtime_difference = CONVERSION.ConvertSecondsToTime(downtime_difference);

        $(`#td_downtime${downtime_count}`).html(converted_downtime_difference);
        if (downtime_count === 1) {
            $("#td_total_downtime").html(converted_downtime_difference);
        } else {
            total_downtime = $("#td_total_downtime").html();
            // total down time column calculation
            converted_downtime_difference = CONVERSION.ConvertTimeToSeconds(converted_downtime_difference);
            converted_total_downtime = CONVERSION.ConvertTimeToSeconds(total_downtime);
            sum_total_downtime = CONVERSION.ConvertSecondsToTime(converted_total_downtime + converted_downtime_difference);

            total_downtime = $("#td_total_downtime").html(sum_total_downtime);
        }
        $("#div_takt_time_timer").TimeCircles().start();
        downtime_count++;
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
