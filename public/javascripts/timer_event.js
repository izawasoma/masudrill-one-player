function timer_event(remain_time){
    if(remain_time == 31){
        setTimeout(function(){
            $("#bgm_quiz_bgm01").get(0).pause();
            $("#bgm_quiz_bgm02").get(0).pause();
            $("#bgm_quiz_bgm03").get(0).play();
        },100);
    }
    else if(remain_time == 0){
        $("#se_time_up").get(0).play();
        $("#quiz_video").get(0).pause();
        $(".p-quiz-telop__time-up").removeClass("p-quiz-telop__time-up").addClass("p-quiz-telop__time-up--animation");
    }
}