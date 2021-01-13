$(document).ready(function () {

   SUPPLIER.loadSupplierList();

   $('.loadingoverlay').attr('style', 'z-index:-1 !important');

});


const SUPPLIER = (() => {
        
    let this_supplier = {};
    
    this_supplier.loadSupplierList = () => 
    {
        $('#tbl_supplier_data').LoadingOverlay('show');
        
        $.ajax({
            url     : `load-supplier`,
            type    : 'get',
            dataType: 'json',
            data    :
            { 
                report_status: status
            },
            cache   : false,
            success: data => 
            {
                $('#tbl_supplier_data').DataTable().destroy();
                $('#tbody_tbl_supplier_data').empty();

                let tbody = '';
                data.data.forEach((value) => {
                    
                    tbody +=
                        `<tr>
                        <td> ${value.id} </td>
                        <td> ${value.supplier_code} </td>
                        <td> ${value.supplier_name} </td>
                        <td>
                            <button class="btn btn-primary btn-block" style="width:47%;float:left;" onclick="SUPPLIER.showUpdateModal('${value.supplier_code}','${value.supplier_name}');" ><strong class="strong-font"><i class="ti-pencil"></i> UPDATE</strong></button>
                            <button class="btn btn-danger btn-block"  style="width:47%;float:right;" onclick="SUPPLIER.deleteSupplier('${value.id}');" ><strong class="strong-font"><i class="ti-trash"></i> DELETE</strong></button>
                        </td>
                    </tr>`;
                });

                $('#tbody_tbl_supplier_data').html(tbody);

                $('#tbl_supplier_data').DataTable({
                    "paging": true,
                    "lengthChange": false,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": true,
                    "scrollX": true,
                });
                $('#tbl_supplier_data').LoadingOverlay('hide');
            }
        });        
    };

    this_supplier.clearData = () =>
    {
        $('.add-supplier-modal').modal('show');

        $("#txt_supplier_code").val('');
        $("#txt_supplier_name").val('');
    };
    
    this_supplier.addSupplier = () => 
    {
        let supplier_code = $("#txt_supplier_code").val();
        let supplier_name = $("#txt_supplier_name").val();

        $.ajax({
            url     : `update-supplier`,
            type    : 'post',
            dataType: 'json',
            data    :
            { 
                _token        : _TOKEN,
                supplier_code : supplier_code,
                supplier_name : supplier_name
            },
            cache   : false,
            success: data => 
            {
                setTimeout(function() {
                    SUPPLIER.loadSupplierList();
                }, 1500);

                $(".add-supplier-modal").modal("hide");

                Swal.fire({
                    position: 'top-center',
                    icon: 'success',
                    title: 'Successfully Save !',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        });
    };

    this_supplier.showUpdateModal = (supplier_code,supplier_name) =>
    {
        $('.add-supplier-modal').modal('show');

        $("#txt_supplier_code").val(supplier_code);
        $("#txt_supplier_name").val(supplier_name);
    };

    this_supplier.uploadSupplierList = () =>
    {
        let formData = new FormData($('#form_supplier')[0]);
        
        $.ajax({
            url         : `store-supplier`,
            type        : 'post',
            dataType    : 'json',
            cache       : false,
			contentType : false,
			processData : false,
            data        : formData,
            success: result => 
            {
                if(result.status === 'Error File')
                {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: `${result.message}`,
                        showConfirmButton: false,
                        timer: 2000
                    })
                }

               if(result.data === true)
               {
                    setTimeout(function() {
                        SUPPLIER.loadSupplierList();
                    }, 1500);

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Successfully Save !',
                        showConfirmButton: false,
                        timer: 1500
                    })

                    $(".upload-supplier-modal").modal("hide");
               }
               else
               {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Failed to Upload Data',
                    showConfirmButton: true,
                    timer: 2000
                })
               }
            }
        }); 
    }

    this_supplier.deleteSupplier = (id) =>
    {
        console.log(id);

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) 
            {
              $.ajax({
                    url     : `delete-supplier`,
                    type    : 'delete',
                    dataType: 'json',
                    data    :
                    { 
                        _token        : _TOKEN,
                        id            : id
                    },
                    cache   : false,
                    success: data => 
                    {
                        setTimeout(function() {
                            SUPPLIER.loadSupplierList();
                        }, 1500);

                        Swal.fire(
                            'Deleted!',
                            'Successfully Deleted',
                            'success'
                        )
                    }
                });
            }
        })
    }

    return this_supplier;
     
})();