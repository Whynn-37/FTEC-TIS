<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChecksheetDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('checksheet_data', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('checksheet_item_id');
            $table->integer('sub_number')->nullable();
            $table->string('coordinates')->nullable();
            $table->text('data')->nullable();
            $table->string('judgment')->nullable();
            $table->string('remarks')->nullable();
            $table->string('hinsei')->nullable();
            $table->timestamps();
            $table->foreign('checksheet_item_id')->references('id')->on('checksheet_items');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('checksheet_data');
    }
}
