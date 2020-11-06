<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDownTimesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('down_times', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('trial_checksheet_id');
            $table->string('type');
            $table->string('start_time');
            $table->string('down_time');
            $table->string('total_down_time');
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
        Schema::dropIfExists('down_times');
    }
}
