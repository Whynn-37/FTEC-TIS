$(document).ready(function () {
    APPROVE.LoadAttachments();
});

const APPROVE = (() => {

    let this_approve = {};
    let array_add_to_pdf = [];
    let add_to_pdf_count = 1;
    let attachment_count = 5;

    this_approve.LoadAttachments = () => {

        let files = '';

        for (let index = 1; index <= attachment_count; index++) {
            files += `<div class="vertical-rectangle">
                <img id="img_attachment_${index}" src="${base_url}/template/assets/images/icon/file.png" class="file-image">
                <div class="file-options">
                    <button type="button" class="btn btn-green mb-3"><i class="ti-eye"></i> VIEW FILE</button>
                    <button id="btn_add_to_pdf_${index}" type="button" class="btn btn-green"  onclick="APPROVE.AddToPdf(${index},'','file_${index}','unchecked');"><i class="ti-plus"></i> ADD TO PDF</button>
                </div>
            </div>`;
        }

        $('#div_attachments').html(files);
    };

    this_approve.AddToPdf = (file_no, check_file_no, file_name, status) => {

        if (status === 'unchecked') {

            $(`#img_attachment_${file_no}`).attr('src', `${APPROVE.AddToPdfCheckedImage(add_to_pdf_count)}`);
            $(`#btn_add_to_pdf_${file_no}`).attr('onclick', `APPROVE.AddToPdf(${file_no},${add_to_pdf_count},'${file_name}','checked');`);
            $(`#btn_add_to_pdf_${file_no}`).html('<i class="ti-close"></i> REMOVE')
            array_add_to_pdf.push(file_name);
            add_to_pdf_count++;

        } else {
            let onclick_value = $(`#btn_add_to_pdf_${file_no}`).attr('onclick');
            let split_onclick_value = onclick_value.split(',');
            let check_file_no_value = split_onclick_value[1];

            if (parseInt(check_file_no_value) === add_to_pdf_count - 1) {
                $(`#img_attachment_${file_no}`).attr('src', `${base_url}/template/assets/images/icon/file.png`);
                $(`#btn_add_to_pdf_${file_no}`).attr('onclick', `APPROVE.AddToPdf(${file_no},'','${file_name}','unchecked');`)
                $(`#btn_add_to_pdf_${file_no}`).html('<i class="ti-plus"></i> ADD TO PDF')
            } else {

                $(`#img_attachment_${file_no}`).attr('src', `${base_url}/template/assets/images/icon/file.png`);
                $(`#btn_add_to_pdf_${file_no}`).attr('onclick', `APPROVE.AddToPdf(${file_no},'','${file_name}','unchecked');`)
                $(`#btn_add_to_pdf_${file_no}`).html('<i class="ti-plus"></i> ADD TO PDF')

                if (array_add_to_pdf.length > 1) {

                    for (let index = 1; index <= attachment_count; index++) {

                        let onclick_value = $(`#btn_add_to_pdf_${index}`).attr('onclick');
                        let split_onclick_value = onclick_value.split(',');
                        let check_file_no_value = split_onclick_value[1];

                        if (check_file_no_value !== '') {
                            if (parseInt(check_file_no_value) > check_file_no) {
                                $(`#img_attachment_${index}`).attr('src', `${APPROVE.AddToPdfCheckedImage(parseInt(check_file_no_value) - 1)}`);
                                $(`#btn_add_to_pdf_${index}`).attr('onclick', `APPROVE.AddToPdf(${index},${parseInt(check_file_no_value) - 1},'${file_name}','checked');`);
                            }
                        }
                    }
                }
            }

            array_add_to_pdf = $.grep(array_add_to_pdf, function (value) {
                return value != file_name;
            });
            $(`#img_attachment_${file_no}`).removeAttr('value');
            add_to_pdf_count--;
        }

        console.log(array_add_to_pdf)
    };

    this_approve.AddToPdfCheckedImage = (count) => {
        return `${base_url}/template/assets/images/icon/check_file_${count}.png`;
    };

    return this_approve;
})();
