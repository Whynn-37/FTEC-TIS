$(document).ready(function () {
    
    APPROVE.LoadFinishedInspectionData();
    APPROVE.LoadDisapprovedInspectionData();
});

const APPROVE = (() => {

    let this_approve = {};
   

    this_approve.LoadFinishedInspectionData = () => {
        $('#tbl_finished_inspection_data').DataTable({
            "paging": true,
            "lengthChange": true,
            "searching": true,
            "ordering": true,
            "info": true,
            "autoWidth": true,
        });
    };

    this_approve.LoadDisapprovedInspectionData = () => {
        $('#tbl_disapproved_inspection_data').DataTable({
            "paging": true,
            "lengthChange": true,
            "searching": true,
            "ordering": true,
            "info": true,
            "autoWidth": true,
        });
    };

    this_approve.ViewFinishedInspectionData = () => {
        $('#modal_view_inspection_data').modal('show');
    };

   

    return this_approve;
})();
