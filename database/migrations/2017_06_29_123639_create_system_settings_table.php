<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSystemSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->increments('id');
            $table->string('company_name');
            $table->string('company_logo');
            $table->string('address1');
            $table->string('address2');
            $table->string('address3');
            $table->string('email');
            $table->string('telephone');
            $table->string('fax');
            $table->string('facebook');
            $table->string('twitter');
            $table->string('linkedIn');
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
        Schema::dropIfExists('system_settings');
    }
}
