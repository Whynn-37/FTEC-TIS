<?php $__env->startComponent('mail::message'); ?>
<h4>TO: JACK BALATO AIDAHALAB</h4>
    

<table>
    <thead class="table table-bordered">
        <tr>
            <th>No.</th>
            <th>Part Number</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td><?php echo e($data['part_number']); ?></td>
        </tr>
    </tbody>
</table>

<div class="footer">
<i>This is system generated email notification, please don`t reply on this email.</i>
</div>
<?php if (isset($__componentOriginal2dab26517731ed1416679a121374450d5cff5e0d)): ?>
<?php $component = $__componentOriginal2dab26517731ed1416679a121374450d5cff5e0d; ?>
<?php unset($__componentOriginal2dab26517731ed1416679a121374450d5cff5e0d); ?>
<?php endif; ?>
<?php echo $__env->renderComponent(); ?>
<?php /**PATH C:\xampp\htdocs\TIS\resources\views/emails/test_email.blade.php ENDPATH**/ ?>