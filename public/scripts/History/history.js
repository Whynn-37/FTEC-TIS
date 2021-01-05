$(document).ready(function () {

    // HISTORY.LoadHistory();
});


const HISTORY = (() => {
        
    let this_history = {};
    
    this_history.LoadPartNumber = () => 
    {
        $('#tbl_history_data').LoadingOverlay('show');
        let status = $('#slc_status').val();
        
        $.ajax({
            url     : `load-part-number-column`,
            type    : 'get',
            dataType: 'json',
            data    :
            { 
                report_status: status
            },
            cache   : false,
            success: data => 
            {
                console.log(data);

                $('#tbl_history_data').DataTable().destroy();
                $('#tbody_tbl_history_data').empty();

                let tbody = '';
                data.forEach((value) => {
                    tbody +=
                        `<tr>
                        <td>
                            <button class="btn btn-primary btn-block" onclick="APPROVE.ViewFinishedInspectionData(${value.trial_checksheet_id},'finished');"><strong class="strong-font"><i class="ti-eye"></i> VIEW DATA</strong></button>
                        </td>
                        <td>${value.part_number}</td>
                        <td>${value.part_name}</td>
                        <td>${value.supplier_name}</td>
                        <td>${value.revision_number}</td>
                        <td>${value.trial_number}</td>
                        <td>${value.judgment}</td>
                        <td>${value.inspector}</td>
                        <td>${value.inspect_datetime}</td>
                        <td>${value.evaluated_by}</td>
                        <td>${value.evaluated_datetime}</td>
                        <td>${value.approved_by}</td>
                        <td>${value.approved_datetime}</td>
                        <td><a href ='#'>Download Here</a></td>
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
                    "scrollX": true,
                });
                $('#tbl_history_data').LoadingOverlay('hide');
            }
        });        
    };  

    this_history.LoadHistory = () =>
    {
        $('#tbl_history_data').LoadingOverlay('show');
        $.ajax({
            url     : `load-part-number-column`,
            type    : 'get',
            dataType: 'json',
            cache   : false,
            success: data => 
            {
               
            }
        });
    }

    return this_history;
     

})();