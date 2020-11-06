<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTaktTimesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('takt_times', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('trial_checksheet_id');
            $table->string('start_date');
            $table->string('start_time');
            $table->string('date_finished');
            $table->string('end_time');
            $table->string('actual_time');
            $table->string('total_takt_time');
            $table->string('takt_time');
            $table->timestamps();
            $table->foreign('trial_checksheet_id')->references('id')->on('trial_checksheets');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('takt_times');
    }
}
