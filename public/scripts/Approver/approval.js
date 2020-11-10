$(document).ready(function () {

});

const APPROVE = (() => {
    let this_approve = {};

    this_approve.AddToPdf = (status) => {
        if (status === undefined) {
            $('#img_attachment_1').attr('src', `${base_url}/template/assets/images/icon/check_file.png`);
            $('#btn_add_to_pdf_1').attr('onclick', `APPROVE.AddToPdf('checked');`);
        } else {
            $('#img_attachment_1').attr('src', `${base_url}/template/assets/images/icon/file.png`);
            $('#btn_add_to_pdf_1').attr('onclick', `APPROVE.AddToPdf();`)
        }
    };

    return this_approve;
})();
