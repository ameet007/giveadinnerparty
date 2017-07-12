<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->string('title');
            $table->text('description');
            $table->date('event_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('street');
            $table->string('city');
            $table->string('county')->nullable();
            $table->string('postal_code');
            $table->string('country');
            $table->string('drink_preferences');
            $table->string('food_included');
            $table->string('own_drinks');
            $table->string('drinks_included');
            $table->string('food_type');
            $table->string('food_drink_type');
            $table->string('open_to');
            $table->string('guest_gender');
            $table->integer('min_age');
            $table->integer('max_age');
            $table->string('orientation');
            $table->string('dress_code');
            $table->string('setting');
            $table->string('seating');
            $table->string('min_guests');
            $table->string('max_guests');
            $table->string('charity_id');
            $table->string('charity_cut');
            $table->string('reference_number')->nullable();
            $table->string('welcome_note');
            $table->integer('ticket_price');
            $table->integer('status');
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
        Schema::dropIfExists('events');
    }
}
