$(document).ready(function () {

    ACTIVITY_LOG.loadActivityLogs();

    $('.loadingoverlay').attr('style', 'z-index:-1 !important');
 
 });


 const ACTIVITY_LOG = (() => {

    let this_activity_log = {};


    this_activity_log.loadActivityLogs = () =>
    {
        $('#tbl_activity_log_data').LoadingOverlay('show');
        
        $.ajax({
            url     : `load-activity-logs`,
            type    : 'get',
            dataType: 'json',
            cache   : false,
            success: data => 
            {
                $('#tbl_activity_log_data').DataTable().destroy();
                $('#tbody_tbl_activity_log_data').empty();

                console.log(data);

                let tbody = '';
                let no = 1;
                data.data.forEach((value) => {

                    tbody +=
                        `<tr>
                        <td> ${no} </td>
                        <td> ${value.subject} </td>
                        <td> ${value.url} </td>
                        <td> ${value.method} </td>
                        <td> ${value.ip} </td>
                        <td> ${value.browser} </td>
                        <td> ${value.user_id} </td>
                        <td> ${value.updated_at} </td>
                        <td> ${value.created_at} </td>
                    </tr>`;

                    no++;
                });

                $('#tbody_tbl_activity_log_data').html(tbody);

                $('#tbl_activity_log_data').DataTable(
                    {
                        pageLength : 5,
                        lengthMenu: [5, 10, 50, 100]
                    }
                );
                $('#tbl_activity_log_data').LoadingOverlay('hide');
            }
        });        
    }

    return this_activity_log;

})();