

$(function(){
    //開発用の開始ボタン
    $("#startBtn").click(function(){
        $("#se_start").get(0).play();
        setTimeout(function(){
            timer();
            setTimeout(function(){
                $("#bgm_quiz_bgm01").get(0).play();
                $("#bgm_quiz_bgm01").get(0).volume = 0.25;
                $("#quiz_video").get(0).play();
                $(".p-game-control__start-block").eq(0).css("display","none");
                $(".p-game-control__answer-form-block").eq(0).css("display","flex");
            },400);
        },1400);
    })

    $("#confirm_btn").click(function(){
        
    });

    //回答フォームに文字を入力した際の処理
    $("#answerForm").on("input",function(){
        //映像の書き換え
        let enterd_text = $("#answerForm").val();
        render_answer(quiz_child[stage].output_text,quiz_child[stage].rewrite_key,enterd_text);
        //映像の停止・再開
        if(enterd_text.length == 0){
            if(video_end_flg == 0){
                $("#quiz_video").get(0).play();
            }
        }
        else{
            $("#quiz_video").get(0).pause();
        }
    });

    //回答時の処理
    $("#decisionBtn").click(function(){
        if(event_stop_flg == 0){
            //入力受付を停止
            event_stop("stop");
            //ボタン音再生
            $("#se_decision").get(0).play();
            $("#se_decision").get(0).volume = 1.0;
            //入力内容を取得
            let enterd_text = $("#answerForm").val();
            setTimeout(function(){
                //正誤判定
                let judge = ox_judge(enterd_text,quiz_child[stage].rewrite_key,quiz_child[stage].output_text);
                if(judge){
                    //正解時処理
                    console.log("正解");
                    //正解処理
                    correct_action(stage,quiz_child,teamMember,quiz_parent.type_id);
                    //ステージ番号の更新
                    stage++;
                }
                else{
                    //不正解時処理
                    //効果音
                    $("#se_uncorrect").get(0).play();
                    $("#se_uncorrect").get(0).volume = 1.0;
                    //不正解のテロップ
                    $(".p-quiz-telop__uncorrect-wrap").eq(0).css("display","block");
                    setTimeout(function(){
                        //回答フォームの文字を削除
                        $("#answerForm").val("");
                        //マスの文字を削除
                        render_answer(quiz_child[stage].output_text,quiz_child[stage].rewrite_key,"");
                        //不正解テロップの非表示化
                        $(".p-quiz-telop__uncorrect-wrap").eq(0).css("display","none");
                        //ビデオの再開
                        if(video_end_flg == 0){
                            $("#quiz_video").get(0).play();
                        }
                        //入力受付再開
                        event_stop("start");
                    },1700);
                }
            },1000);
        }
    });

    let hint_accept = 0;
    //もらいマスボタンを押した時の処理

    let hint_text;
    let hint_index;
    let hint_rewrite_key_work;

    $("#hintBtn").click(function(){
        //効果音再生
        $("#se_moraimasu").get(0).play();
        $("#se_moraimasu").get(0).volume = 1.0;
        //テロップ表示
        $(".p-quiz-telop__hint").removeClass("p-quiz-telop__hint").addClass("p-quiz-telop__hint--animation");
        //映像の停止
        $("#quiz_video").get(0).pause();
        //コントロールゾーンの切り替え
        $(".p-game-control__answer-form-block").eq(0).css("display","none");
        //ハートの表示を変更
        $(`.p-quiz-tasuke__heart--${remain_hint}`).eq(0).removeClass(`p-quiz-tasuke__heart--${remain_hint}`).addClass(`p-quiz-tasuke__heart--${remain_hint}anime`);
        setTimeout(function(){
            //効果音再生
            $("#se_input").get(0).play();
            $("#se_input").get(0).volume = 1.0;
            //クリックした箇所から対応するoutput_textの位置と文字を算出
            hint_rewrite_key_work = String(quiz_child[stage].rewrite_key).split("");
            console.log(hint_rewrite_key_work);
            for(let i in hint_rewrite_key_work){
                if(hint_rewrite_key_work[i] == "1"){
                    hint_index = i;
                    break;
                }
            }
            //コントロールゾーンの切り替え
            $(".p-game-control__answer-form-block").eq(0).css("display","flex");
            //rewrite_keyの更新
            hint_rewrite_key_work[hint_index] = 2;
            quiz_child[stage].rewrite_key = hint_rewrite_key_work.join("");
            //マスの再描画
            render_answer(quiz_child[stage].output_text,quiz_child[stage].rewrite_key,"");
            //もらいマステロップの非表示化
            $(".p-quiz-telop__hint--animation").removeClass("p-quiz-telop__hint--animation").addClass("p-quiz-telop__hint");
            //ハートを削除
            $(`.p-quiz-tasuke__heart--${remain_hint}anime`).eq(0).hide();
            setTimeout(function(){
                //マス目が助けマスで全て埋まった場合は正解時と同様の処理を行う
                if(array_search(hint_rewrite_key_work,"1").count == 0){
                    render_answer(quiz_child[stage].output_text,quiz_child[stage].rewrite_key,"");
                    correct_action(stage,quiz_child,teamMember,quiz_parent.type_id);
                    stage++;
                }
                //映像の再開
                if(video_end_flg == 0){
                    $("#quiz_video").get(0).play();
                }
                //ヒントの数を減らす
                remain_hint--;
                //ヒントが無くなったらボタンを非表示化
                if(remain_hint == 0){
                    $("#hintBtn").hide();
                }
            },1000);
        },2000);
    });

    //マス目をクリックしたときの処理
    $("body").on("click","div[class^=p-quiz-display__masu--]",function(){
        if(hint_accept == 1){
            
            
            //マスの色を変更
            if($("div[class^=p-quiz-display__masu--]").eq(index).hasClass("p-quiz-display__masu--nomal")){
                $("div[class^=p-quiz-display__masu--]").eq(index).removeClass("p-quiz-display__masu--nomal").addClass("p-quiz-display__masu-hint--nomal");
            }
            else{
                $("div[class^=p-quiz-display__masu--]").eq(index).removeClass("p-quiz-display__masu--start").addClass("p-quiz-display__masu-hint--start");
            }
            //受付状態フラグを非受付状態に
            hint_accept = 0;
            //コントロールゾーンの切り替え
            $("#hintForm").val("");
            $(".p-game-control__answer-form-block").eq(0).css("display","none");
            $(".p-game-control__hint-form-block").eq(0).css("display","flex");
            
        }
    });

    $("#hintDecisionBtn").click(function(){
        //効果音再生
        $("#se_decision").get(0).play();
        $("#se_decision").get(0).volume = 1.0;
       
        setTimeout(function(){
            //ヒントフォームに入力された文字の取得
            let input_hint = $("#hintForm").val();
            //ヒントが正しい場合
            if(input_hint == hint_text){
                
                //回答フォーム・ヒントフォームを空にする
                $("#answerForm").val("");
                $("#hintForm").val("");
                //コントロールゾーンの切り替え
                
                $(".p-game-control__hint-form-block").eq(0).css("display","none");
                

            }
            else{
                //効果音
                $("#se_uncorrect").get(0).play();
                $("#se_uncorrect").get(0).volume = 1.0;
                //不正解のテロップ
                $(".p-quiz-telop__uncorrect-wrap").eq(0).css("display","block");
                setTimeout(function(){
                    //回答フォーム・ヒントフォームを空にする
                    $("#answerForm").val("");
                    $("#hintForm").val("");
                    //マスの再描画
                    render_answer(quiz_child[stage].output_text,quiz_child[stage].rewrite_key,"");
                    //コントロールゾーンの切り替え
                    $(".p-game-control__answer-form-block").eq(0).css("display","flex");
                    $(".p-game-control__hint-form-block").eq(0).css("display","none");
                    //不正解テロップの削除
                    $(".p-quiz-telop__uncorrect-wrap").eq(0).css("display","none");
                    if(video_end_flg == 0){
                        $("#quiz_video").get(0).play();
                    }
                },1700);
            }
        },1000);
    });



    //映像が終了したらフラグを立てる
    $("#quiz_video").on("ended",function(){
        video_end_flg = 1;
    });
});

//ディスプレイのマスを描画
function render_answer(output_text,key,input_value){
    key = String(key);
    let work_output_text = output_text.split("");
    let work_key = key.split("");
    let masu_start_flg = 0;
    let text_start_flg = 0;

    // 入力された文字を文字列に変換
    input_value = String(input_value);
    //１文字ずつに分割
    let input_value_work = input_value.split("");
    //output用の配列
    let output = [];
    //keyが「１」の個数を調べる
    let result_of_search = array_search(work_key,1);
    //input_workの初期化
    for(let i=0; i<result_of_search.count; i++){
        if(i < input_value_work.length){
            output[i] = input_value_work[i];
        }
        else{
            output[i] = "";
        }
    }

    $(".p-quiz-display__masu-wrapper").eq(0).html("");

    //カウンター(以下のループ処理内でkeyが1である時のみカウントアップする)
    let count = 0;

    for(let i in work_key){
        if(work_key[i] == "1"){
            text_start_flg = 0;
            if(masu_start_flg == 0){
                $(".p-quiz-display__masu-wrapper").eq(0).append(`<div  class="p-quiz-display__masu--start">${output[count]}</div>`);
                masu_start_flg = 1;
            }
            else{
                $(".p-quiz-display__masu-wrapper").eq(0).append(`<div  class="p-quiz-display__masu--nomal">${output[count]}</div>`);
            }
            count++;
        }
        else if(work_key[i] == "2"){
            text_start_flg = 0;
            if(masu_start_flg == 0){
                $(".p-quiz-display__masu-wrapper").eq(0).append(`<div  class="p-quiz-display__masu-hint--start">${work_output_text[i]}</div>`);
                masu_start_flg = 1;
            }
            else{
                $(".p-quiz-display__masu-wrapper").eq(0).append(`<div  class="p-quiz-display__masu-hint--nomal">${work_output_text[i]}</div>`);
            }
        }
        else if(work_key[i] == "0"){
            masu_start_flg = 0;
            if(text_start_flg == 0){
                $(".p-quiz-display__masu-wrapper").eq(0).append(`<div  class="p-quiz-display__text--start">${work_output_text[i]}</div>`);
                text_start_flg = 1;
            }
            else{
                $(".p-quiz-display__masu-wrapper").eq(0).append(`<div  class="p-quiz-display__text--nomal">${work_output_text[i]}</div>`);
            }
        }
    }

}

function array_search(array,key){
    let result = {
        count: 0,
        hit_index: [],
    }
    for(let i in array){
        if(array[i] == key){
            result.hit_index[result.count] = i;
            result.count++;
        }
    }
    return result;
}

//「カタカナ」を「ひらがな」に変換する
function kanaToHira(str) {
    return str.replace(/[\u30a1-\u30f6]/g, function(match) {
        var chr = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(chr);
    });
}

//正誤判定
function ox_judge(value,rewrite_key,output_text){
    //value,output_textの「カタカナ」を「ひらがな」に変換する
    value = kanaToHira(value);
    output_text = kanaToHira(output_text);
    //rewrite_keyを数値→文字列変換
    rewrite_key = String(rewrite_key);
    //正誤判定用の文字列を作成する
    let key_work = rewrite_key.split("");
    let output_text_work = output_text.split("");
    let answer;
    let answer_work = [];
    let j = 0;
    for(let i in key_work){
        if(key_work[i] == 1){
            answer_work[j] = output_text_work[i];
            j++;
        }
    }
    answer = answer_work.join("");
    //正誤判定結果を返す
    if(value == answer){
        return true;
    }
    else{
        return false;
    }
}

//正解時処理
function correct_action(challenged_stage,quiz_child,teamMember,quiz_type){
    $("#se_correct").get(0).play();
    $("#se_correct").get(0).volume = 1.0;
    correct_color_change("red");
    $("#answerForm").val("");
    //問題タイプが「1」
    if(quiz_type == 1){
        $(".p-quiz-display__c-photo-wrap").eq(0).html(`<img src="./img/quiz/${quiz_parent.parent_id}/c_photo/${challenged_stage + 1}.png">`).css("display","block");
        $("div[class^=p-quiz-list__contents]").eq(challenged_stage).css("background-image",`url(./img/quiz/${quiz_parent.parent_id}/c_thumb/${challenged_stage + 1}.png)`);
        video_end_flg = 0;
        $(".p-quiz-display__contents").eq(0).attr({"src":`./movie/quiz/${quiz_parent.parent_id}/que/${challenged_stage + 2}.mp4`});
        if(challenged_stage < 5){
            setTimeout(function(){
                correct_color_change("blue");
                correct_common_action(challenged_stage,quiz_child,teamMember);
                $(".p-quiz-display__c-photo-wrap").eq(0).css("display","none");
                $("#quiz_video").get(0).play();
                event_stop("start");
            },2500);
        }
        else if(challenged_stage == 5){
            setTimeout(function(){
                $(".p-quiz-display__secret").eq(0).css("display","flex");
                $(".p-quiz-display__c-photo-wrap").eq(0).css("display","none");
                setTimeout(function(){
                    correct_color_change("blue");
                    correct_common_action(challenged_stage,quiz_child,teamMember);
                    rotate_change();
                    $(".p-quiz-list__secret").eq(0).fadeOut(500);
                    setTimeout(function(){
                        $("#quiz_video").get(0).play();
                        if(remain_time > 31){
                            $("#bgm_quiz_bgm01").get(0).pause();
                            $("#bgm_quiz_bgm02").get(0).play();
                            $("#bgm_quiz_bgm02").get(0).volume = 0.25;
                        }
                        event_stop("start");
                    },1300);
                },2000);
            },2500);
        }
        //クリア時の処理
        else if(challenged_stage == 6){
            clearInterval(timer_interval);
            setTimeout(function(){
                correct_common_action(challenged_stage,quiz_child,teamMember);
                $("#bgm_quiz_bgm01").get(0).pause();
                $("#bgm_quiz_bgm02").get(0).pause();
                $("#bgm_quiz_bgm03").get(0).pause();
                $("#se_cleared").get(0).play();
                $("#se_cleared").get(0).volume = 0.7;
                setTimeout(function(){
                    $("#se_cleared_telop").get(0).play();
                    $("#se_cleared_telop").get(0).volume = 1.0;
                    $(".p-quiz-telop__clear").removeClass("p-quiz-telop__clear").addClass("p-quiz-telop__clear--animation");
                },1000);
            },2500);
        }
    }
}

//正解時共通処理
function correct_common_action(challenged_stage,quiz_child,teamMember){
    let next_stage = challenged_stage + 1;
    //回答枠に答えとなる文字を入れる
    write_answer_list(challenged_stage,quiz_child[challenged_stage].key,quiz_child[challenged_stage].output_text);
    //得点を更新
    sum_point = sum_point + quiz_child[challenged_stage].point;
    $(".p-quiz-point__score").text(sum_point);
    if(challenged_stage < 6){
        //アクティブフレームの変更
        active_flame(challenged_stage);
        //問題番号を更新
        $(".p-quiz-display__number").eq(0).text(num_circle[next_stage]);
        //枠の再描画
        render_masu_game_display(quiz_child[next_stage].output_text,quiz_child[next_stage].key);
    }
    if(challenged_stage < 5){
        //プレイヤー情報を更新
        hit_user_data = seach_member_by_order(teamMember.users,next_stage + 1);
        $(".p-quiz-display__comment").eq(0).text(hit_user_data.comment);
        $(".p-quiz-display__last-name").eq(0).text(hit_user_data.lastName);
        $(".p-quiz-display__first-name").eq(0).text(hit_user_data.firstName);
        $(".p-quiz-display__age").eq(0).text(`(${hit_user_data.age})`);
    }
}

//アクティブフレームの更新
function active_flame(challenged_stage){
    console.log(challenged_stage + 1);
    let border_color = "#23ED5F";
    //5問目まで
    if(challenged_stage + 1 < 5){
        $(".p-quiz-list__flame-upper").eq(challenged_stage).css("border","none");
        $(".p-quiz-list__flame-bottom").eq(challenged_stage).css("border","none");
        $(".p-quiz-list__flame-upper").eq(challenged_stage + 1).css({
            "border-top":`${border_color} solid 5px`,
            "border-left":`${border_color} solid 5px`,
            "border-right":`${border_color} solid 5px`,
        });
        $(".p-quiz-list__flame-bottom").eq(challenged_stage + 1).css({
            "border-bottom":`${border_color} solid 5px`,
            "border-left":`${border_color} solid 5px`,
            "border-right":`${border_color} solid 5px`,
        });
        $(".p-quiz-list__shadow--disactive").eq(0).removeClass("p-quiz-list__shadow--disactive").addClass("p-quiz-list__shadow--active");
    }
    //6問目
    else if(challenged_stage + 1 == 5){
        $(".p-quiz-list__flame-upper").eq(challenged_stage).css("border","none");
        $(".p-quiz-list__flame-bottom").eq(challenged_stage).css("border","none");
        $(".p-quiz-list__flame-upper-left").eq(0).css({
            "border-top":`${border_color} solid 5px`,
            "border-left":`${border_color} solid 5px`,
        });
        $(".p-quiz-list__flame-upper-right").eq(0).css({
            "border-top":`${border_color} solid 5px`,
            "border-right":`${border_color} solid 5px`,
            "border-bottom":`${border_color} solid 5px`,
        });
        $(".p-quiz-list__flame-bottom-left").eq(0).css({
            "border-left":`${border_color} solid 5px`,
            "border-right":`${border_color} solid 5px`,
            "border-bottom":`${border_color} solid 5px`,
        });
        $(".p-quiz-list__shadow--disactive").eq(0).removeClass("p-quiz-list__shadow--disactive").addClass("p-quiz-list__shadow--active");
    }
    else if(challenged_stage + 1 == 6){
        $(".p-quiz-list__flame-upper-left").eq(0).css({
            "border-bottom":`${border_color} solid 5px`,
        });
        $(".p-quiz-list__flame-upper-right").eq(0).css({
            "border-bottom":"none",
        });
        $(".p-quiz-list__flame-bottom-left").eq(0).css("border","none");
        $(".p-quiz-list__flame-bottom-right").eq(0).css({
            "border-left":`${border_color} solid 5px`,
            "border-right":`${border_color} solid 5px`,
            "border-bottom":`${border_color} solid 5px`,
        });
        $(".p-quiz-list__shadow--disactive").eq(0).removeClass("p-quiz-list__shadow--disactive").addClass("p-quiz-list__shadow--active");
    }
}

//回答枠に答えとなる文字を入れる
function write_answer_list(challenged_stage,key,output_text){
    key = String(key);
    let work_output_text = output_text.split("");
    let work_key = key.split("");
    let masu_start_flg = 0;
    let text_start_flg = 0;    
    $(".p-quiz-list__masu-wrapper").eq(challenged_stage).html("");

    for(let i in work_key){
        if(work_key[i] == "1"){
            text_start_flg = 0;
            if(masu_start_flg == 0){
                $(".p-quiz-list__masu-wrapper").eq(challenged_stage).append(`<div  class="p-quiz-list__masu--start">${work_output_text[i]}</div>`);
                masu_start_flg = 1;
            }
            else{
                $(".p-quiz-list__masu-wrapper").eq(challenged_stage).append(`<div  class="p-quiz-list__masu--nomal">${work_output_text[i]}</div>`);
            }
        }
        else if(work_key[i] == "0"){
            masu_start_flg = 0;
            if(text_start_flg == 0){
                $(".p-quiz-list__masu-wrapper").eq(challenged_stage).append(`<div  class="p-quiz-list__text--start">${work_output_text[i]}</div>`);
                text_start_flg = 1;
            }
            else{
                $(".p-quiz-list__masu-wrapper").eq(challenged_stage).append(`<div  class="p-quiz-list__text--nomal">${work_output_text[i]}</div>`);
            }
        }
    }
}

//7問目表示時アニメーション
function rotate_change(){
    let deg = 0;
    let add_deg = 5;
    let str_deg;
    let secret_animation = setInterval(function(){
        deg = deg + add_deg;
        str_deg = String(deg);
        console.log(`rotateX(${deg})`);
        if(0 < deg && deg < 90){
            $(".p-quiz-display__contents-box").eq(0).css("transform",`rotateX(${deg}deg)`);
        }
        else if(-90 <= deg && deg < 0){
            $(".p-quiz-display__contents-box").eq(0).css("transform",`rotateX(${deg}deg)`);
        }
        else if(deg == 90){
            deg = -90;
            $(".p-quiz-display__secret").eq(0).css("display","none");
            $(".p-quiz-display__contents-box").eq(0).css("transform",`rotateX(${deg}deg)`);
        }
        else if(deg == 0){
            $(".p-quiz-display__contents-box").eq(0).css("transform",`rotateX(0)`);
            clearInterval(secret_animation);
        }
        console.log("角度:" + deg + "deg");
    },15);

}

//正解時のマスの色の変更
function correct_color_change(color){
    $(".p-quiz-display__masu--start").css("background-color",color);
    $(".p-quiz-display__masu--nomal").css("background-color",color);
    $(".p-quiz-display__text--start").css("color",color);
    $(".p-quiz-display__text--nomal").css("color",color);
}

//入力受付・非受付状態の切り替え
function event_stop(event_name){
    if(event_name == "stop"){
        event_stop_flg = 1;
        $("#answerForm").prop("disabled",true);
    }
    else{
        event_stop_flg = 0;
        $("#answerForm").prop("disabled",false);
    }
}