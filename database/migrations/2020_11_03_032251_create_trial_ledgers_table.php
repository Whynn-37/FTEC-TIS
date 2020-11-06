<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrialLedgersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('trial_ledgers', function (Blueprint $table) {
            $table->string('application_date');
            $table->string('received_date')->nullable();
            $table->integer('supplier_code');
            $table->string('part_number');
            $table->string('part_name');
            $table->integer('revision_number');
            $table->string('inspection_reason');
            $table->string('die_class');
            $table->string('model_name')->nullable();
            $table->string('delivery_date')->nullable();
            $table->string('judgment')->nullable();
            $table->integer('trail_number');
            $table->string('inspection_actual_time')->nullable();
            $table->string('inspection_required_time')->nullable();
            $table->string('plan_start_date')->nullable();
            $table->string('plan_end_date')->nullable();
            $table->string('actual_end_date')->nullable();
            $table->string('inspector_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('trial_ledgers');
    }
}
