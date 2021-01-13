<!-- Large modal start -->
<div class="modal fade add-supplier-modal">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"> ADD SUPPLIER </h5>
                <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-6">
                        <label> Supplier Code  </label>
                        <input class="form-control" type="text" id="txt_supplier_code">
                    </div>
                    <div class="col-6">
                        <label> Supplier Name  </label>
                        <input class="form-control" type="text" id="txt_supplier_name">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" onclick="SUPPLIER.addSupplier();">SAVE</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<!-- Large modal modal end -->


<!-- Large modal start -->
<div class="modal fade upload-supplier-modal">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"> UPLOAD SUPPLIER </h5>
                <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
            </div>
            <div class="modal-body">
                <form id="form_supplier" method="post" enctype="multipart/form-data">
                    @csrf
                    <div class="row">
                        <div class="col-7">
                            <label> UPLOAD FILE </label>
                            <input type="file"  class="form-control form_upload_supplier" id="txt_upload_file" name="upload_file">
                        </div>
                        <div class="col-2">
                            <label>&nbsp;</label>
                            <button type="button" class="btn btn-primary" onclick="SUPPLIER.uploadSupplierList();"><b> <i class="ti-upload"> </i> UPLOAD </b></button>    
                        </div>
                        <div class="col-2" >
                            <label>&nbsp;</label>
                            <button class="btn btn-success" style="margin-left:35px;"><b> <i class="ti-download"> </i> DOWNLOAD </b></button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                {{-- <button type="button" class="btn btn-success">SAVE</button> --}}
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<!-- Large modal modal end -->