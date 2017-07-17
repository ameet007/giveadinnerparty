<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Nahid\Talk\Facades\Talk;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Validation\ValidatesRequests;
use App\User;
use Validator;

class chatController extends Controller
{
    
    public function getInbox(){
        Talk::setAuthUserId(Auth::guard('user')->user()->id);
        $inboxes = Talk::getInbox();
        return view('user/inbox')->with([
            'inboxes'=>$inboxes,
        ]);
    }
    
    public function getChatHistory(Request $request, $id){
        Talk::setAuthUserId(Auth::guard('user')->user()->id);
        $conversations = Talk::getConversationsById($id);
        $withUser = $conversations->withUser;
        $messages = $conversations->messages;
        return view('user/message/chat')->with([
            'withUser'=>$withUser,
            'messages'=>$messages
        ]);
    }
    
    public function sendMessage(Request $request, $id){
        Talk::setAuthUserId(Auth::guard('user')->user()->id);
        $message = Talk::sendMessageByUserId($id, $request->input('message'));
        if ($message) {
            return response()->json(['status'=>'success', 'data'=>$message], 200);
        }
    }
}
