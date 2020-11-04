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
            $table->string('part_number');
            $table->integer('revision_number');
            $table->integer('trail_stage');
            $table->integer('supplier_code');
            $table->string('trial_application');
            $table->string('kind_of_die');
            $table->string('model_name');
            $table->string('target_takt_time');
            $table->string('inspector_id');
            $table->string('actual_end_date')->nullable();
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
