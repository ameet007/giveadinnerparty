<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('last_name')->nullable();
            $table->string('dob')->nullable();
            $table->string('status')->nullable()->nullable();
            $table->string('gender')->nullable();
            $table->string('ethnicity')->nullable();
            $table->string('sexuality')->nullable();
            $table->string('telephone')->nullable();
            $table->text('address')->nullable();
            $table->string('town')->nullable();
            $table->string('county')->nullable();
            $table->string('country')->nullable();
            $table->string('postcode')->nullable();
            $table->text('spoken_languages')->nullable();
            $table->string('hosting_option')->nullable();
            $table->string('notifications')->nullable();
            $table->string('invites')->nullable();
            $table->text('about')->nullable();
            $table->text('hobbies')->nullable();
            $table->string('profession')->nullable();
            $table->string('education')->nullable();
            $table->string('religion')->nullable();
            $table->string('paypal_fname')->nullable();
            $table->string('paypal_lname')->nullable();
            $table->string('paypal_email')->nullable();
            $table->text('photos')->nullable();
            $table->integer('confirmed')->default(0);
            $table->string('confirmation_code')->nullable();
            $table->integer('is_disabled')->default(0);
            $table->rememberToken();
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
        Schema::drop('users');
    }
}
