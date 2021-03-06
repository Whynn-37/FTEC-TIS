<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">
    <meta name="viewport" content="width=600,initial-scale = 2.3,user-scalable=no">
</head>

<body>
    <table bgcolor="white" border="0" cellpadding="0" cellspacing="0" class="bg_color" width="100%">
        <tbody>
            <tr>
                <td align="center">
                    <div class="main-header"
                    style="color: #1f2837; font-size: 28px; font-family: Open Sans, Helvetica, sans-serif; font-weight:700;line-height: 30px;">
                        TOUCHSCREEN INSPECTION SYSTEM
                    </div>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="container590" width="590">
                        <tbody>
                            <tr>
                                <td align="center" class="main-header"
                                    style="color: #1f2837; font-size: 20px; font-family: Open Sans, Helvetica, sans-serif; font-weight:400;line-height: 35px;">
                                    <!-- section text ======-->
                                    <div style="line-height: 50px;">
                                        {{$subject}} <span style="text-transform: uppercase;"></span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                            </tr>
                            <td align="left">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="container590"
                                    width="1000">
                                    <tbody>
                                        <tr align="left"
                                        style="color: #1f2837; font-size: 14px; font-family: Open Sans, Helvetica, sans-serif; line-height: 28px;">
                                            <td>
                                                @if($subject === 'For Re-inspection')
                                                    <p style="line-height: 26px; margin-bottom:15px;font-size:14;font-weight:700;">
                                                        TO: {{$data['get_approval']['inspect_by']}}
                                                    </p>
                                                    <p style="line-height: 20px;margin-bottom:15px;margin-left:20px;">
                                                        This is to inform you that, this part number is re-inspection.
                                                    </p>
                                                @elseif($subject === 'For Evaluation')
                                                    <p style="line-height: 26px; margin-bottom:15px;font-size:14;font-weight:700;">
                                                        TO: Evaluator
                                                    </p>
                                                    <p style="line-height: 20px;margin-bottom:15px;margin-left:20px;">
                                                        This is to inform you that, this part number is for evaluation
                                                    </p>
                                                @elseif($subject === 'For Re-Evaluation' || $subject === 'For Re-Evaluation - Approver')
                                                    <p style="line-height: 26px; margin-bottom:15px;font-size:14;font-weight:700;">
                                                        TO: {{$data['get_approval']['evaluated_by']}}
                                                    </p>
                                                    <p style="line-height: 20px;margin-bottom:15px;margin-left:20px;">
                                                        This is to inform you that, this part number is for re-evaluation
                                                    </p>
                                                @elseif($subject === 'For Approval')
                                                    <p style="line-height: 26px; margin-bottom:15px;font-size:14;font-weight:700;">
                                                        TO: Approver
                                                    </p>
                                                    <p style="line-height: 20px;margin-bottom:15px;margin-left:20px;">
                                                        This is to inform you that, this part number is for approval.
                                                    </p>
                                                @elseif($subject === 'For Re-Approval')
                                                    <p style="line-height: 26px; margin-bottom:15px;font-size:14;font-weight:700;">
                                                            TO: {{$data['get_approval']['approved_by']}}
                                                    </p>
                                                    <p style="line-height: 20px;margin-bottom:15px;margin-left:20px;">
                                                        This is to inform you that, this part number is for re-approval.
                                                    </p>
                                                @elseif($subject === 'Approved')
                                                    <p style="line-height: 26px; margin-bottom:15px;font-size:14;font-weight:700;">
                                                        TO: All
                                                    </p>
                                                    <p style="line-height: 20px;margin-bottom:15px;margin-left:20px;">
                                                        This is to inform you that, this part number is approved.
                                                    </p>
                                                @endif
                                                <p style="line-height: 26px;margin-bottom:15px;font-size:14;font-weight:700;margin-left:25%;">
                                                    Please see below details:
                                               </p>
                                            </td>
                                        </tr>
                                        <table align="center"
                                            style="text-align:center;font-family: Open Sans, Helvetica, sans-serif;padding:20px;">
                                                <thead>
                                                    <tr>
                                                        <th style="background-color:#1A416E;font-size:12px;"> ?????? </th>
                                                        <th style="font-size:16px;background-color:#1A416E;color:#ffffff;">PART NUMBER</th>
                                                        <th style="font-size:16px;background-color:#1A416E;color:#ffffff;"> {{$data['get_trial_ledger']['part_number']}} </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ?????? </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> PART NAME </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['get_trial_ledger']['part_name']}} </td>          
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ?????? </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> REVISION NUMBER </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['get_trial_ledger']['revision_number']}} </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ?????????????????? </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> TRIAL NUMBER </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['get_trial_ledger']['trial_number']}} </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ????????????????????? </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> SUPPLIER NAME </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['get_trial_ledger']['get_supplier']['supplier_name']}} </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ????????? </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> APPLICATION DATE </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['application_date']}} </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ?????? </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> JUDGMENT </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['judgment']}} </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ????????? </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> INSPECTED BY </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['get_approval']['inspect_by']}} </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ???????????? </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> INSPECTED DATE TIME </td>
                                                        <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['get_approval']['inspect_datetime']}} </td>
                                                    </tr>
                                                    @if($subject === 'For Approval' || $subject === 'For Re-Approval')
                                                        <tr>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ????????? </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> EVALUATED BY </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['get_approval']['evaluated_by']}} </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ????????? </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> EVALUATED DATE </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['get_approval']['evaluated_datetime']}} </td>
                                                        </tr>
                                                    @endif
                                                    @if ($subject === 'Approved')
                                                        <tr>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ????????? </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> EVALUATED BY </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['get_approval']['evaluated_by']}} </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ????????? </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> EVALUATED DATE </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['get_approval']['evaluated_datetime']}} </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ????????? </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> APPROVED BY </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['get_approval']['approved_by']}} </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ????????? </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> APPROVED DATE </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['get_approval']['approved_datetime']}} </td>
                                                        </tr>
                                                    @endif
                                                    @if($subject === 'For Re-inspection' || $subject === 'For Re-Evaluation - Approver' || $subject === 'For Re-Evaluation.')
                                                        <tr>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ????????? </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> DISAPPROVED BY </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['get_approval']['disapproved_by']}} </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ????????? </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> DISAPPROVED DATE </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['get_approval']['disapproved_datetime']}} </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> ?????? </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> REASON </td>
                                                            <td style="font-size:16px;background-color:#dfdfe2;color:#000000;"> {{$data['get_approval']['reason']}} </td>
                                                        </tr>
                                                    @endif
                                                </tbody>
                                        </table>
                                        <tr>
                                            <td align="left"
                                                style="color: #1f2837; font-size: 16px; font-family: Open Sans, Helvetica, sans-serif; line-height: 28px;">
                                                <p>To visit Touchscreen Inspection System, just click <a href="localhost/TIS/public">here.</a></p>
                                                <br>
                                                <p style="line-height: 26px; margin-bottom:15px;margin-left:15px;">
                                                    Thank you,
                                                </p>
                                                <p style="line-height: 26px; margin-bottom:15px;margin-left:15px;">
                                                    TIS
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <br>
                            <br>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <!-- /body -->
    <!-- FOOTER -->
    <table style="background-color:#01C091" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
            <tr>
                <td align="center">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="container590" width="1000">
                        <tbody>
                            <tr>
                                <td
                                    style="text-align: center;font-size: 16px;color: #fff; font-family: Open Sans, Helvetica, sans-serif;line-height: 15px;padding:10px;">
                                    <i>This is a system generated email, please do not reply.</i> 
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>

</body>

</html>
