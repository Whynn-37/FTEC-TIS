<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChecksheetItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('checksheet_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('trial_checksheet_id');
            $table->integer('item_number')->nullable();
            $table->string('tools')->nullable();
            $table->string('type')->nullable();
            $table->string('specification')->nullable();
            $table->string('upper_limit')->nullable();
            $table->string('lower_limit')->nullable();
            $table->integer('judgment')->nullable();
            $table->integer('item_type')->nullable();
            $table->integer('remarks')->nullable();
            $table->integer('hinsei')->nullable();
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
        Schema::dropIfExists('checksheet_items');
    }
}
