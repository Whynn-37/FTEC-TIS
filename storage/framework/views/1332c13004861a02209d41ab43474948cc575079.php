<?php $__env->startComponent('mail::message'); ?>
<h4>TO: JACK BALATO AIDAHALAB</h4>

<p class="indent">
    DETAILS: SI ARNIEL AY ISANG MALAKING BULAOS
</p>


<div class="table-responsive">
    <table class="table table-bordered indent">
        <thead>
            <tr>
                <th>Trial Number</th>
                <th>Part Number</th>
                <th>Revision Number</th>
                <th>Sample Data</th>
                <th>Sample Data</th>
                <th>Sample Data</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><?php echo e($data['trial_number']); ?></td>
                <td><?php echo e($data['part_number']); ?></td>
                <td><?php echo e($data['revision_number']); ?></td>
                <td>Sample Data</td>
                <td>Sample Data</td>
                <td>Sample Data</td>
            </tr>
        </tbody>
    </table>
</div>
    

<?php if (isset($__componentOriginal2dab26517731ed1416679a121374450d5cff5e0d)): ?>
<?php $component = $__componentOriginal2dab26517731ed1416679a121374450d5cff5e0d; ?>
<?php unset($__componentOriginal2dab26517731ed1416679a121374450d5cff5e0d); ?>
<?php endif; ?>
<?php echo $__env->renderComponent(); ?>
<?php /**PATH C:\xampp\htdocs\TIS\resources\views/Mail/EmailNotification.blade.php ENDPATH**/ ?>