<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApprovalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('approvals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('trial_checksheet_id');
            $table->string('evaluated_by')->nullable();
            $table->string('evaluated_datetime')->nullable();
            $table->string('approved_by')->nullable();
            $table->string('approved_datetime')->nullable();
            $table->string('disapproved_by')->nullable();
            $table->string('disapproved_datetime')->nullable();
            $table->integer('decision');
            $table->text('reason')->nullable();
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
        Schema::dropIfExists('approvals');
    }
}
