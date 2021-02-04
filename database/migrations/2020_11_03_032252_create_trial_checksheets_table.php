<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrialChecksheetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('trial_checksheets', function (Blueprint $table) {
            $table->id();
            $table->string('application_date');
            $table->string('part_number');
            $table->string('revision_number');
            $table->integer('trial_number');
            $table->string('inspection_reason');
            $table->string('date_finished')->nullable();
            $table->string('judgment')->nullable();
            $table->string('date_inspected')->nullable();
            $table->string('temperature')->nullable();
            $table->string('humidity')->nullable();
            $table->integer('in_use')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('trial_checksheets');
    }
}
