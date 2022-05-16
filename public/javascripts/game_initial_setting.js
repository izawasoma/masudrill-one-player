var socket = io();

//選択された問題番号
let select_num = 1;
//問題情報を取得する
socket.emit("getQuestionData",select_num);
socket.on("getQuestionData",function(data){
    quiz_child = data.quizChild;
    quiz_parent = data.quizParent[0];
    console.log(data);
    //問題情報を取得した後は、データを用いて描画を行う
    initial_setting(quiz_child,quiz_parent,teamMember);
});

//game_displayの描画を行う
function initial_setting(quiz_child,quiz_parent,teamMember){
    //▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽
    //メインディスプレイ
    //▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽

    let quiz_num;
    let hit_user;
    let work_output_text = [];
    let work_key = [];
    let output_text;
    let key;
    //▶下部の問題リスト

    //1問目～5問目
    for(let i = 0; i<5; i++){
        //何問目かを取得
        quiz_num = i + 1;
        //その問題を答える人物を取得
        hit_user = seach_member_by_order(teamMember.users,quiz_num);
        //リストを書き加える
        $("#gameMainDisplay").append(`
            <div class="p-game-display__quiz-list--q${quiz_num} p-quiz-list">
				<!-- 名前 -->
				<div class="p-quiz-list__user-name"><span>${hit_user.info}</span>${hit_user.lastName}</div>
				<!-- 問題 -->
				<div class="p-quiz-list__contents">
					<div class="p-quiz-list__number">${num_circle[i]}</div>
					<div class="p-quiz-list__point--q${quiz_num}">${quiz_child[i].point}<span>点</span></div>
					<div class="p-quiz-list__masu-wrapper">
					</div>
				</div>
				<!-- アクティブフレームや影など -->
				<div class="p-quiz-list__flame">
					<div class="p-quiz-list__flame-upper"></div>
					<div class="p-quiz-list__flame-bottom"></div>
				</div>
				<div class="p-quiz-list__shadow--disactive"></div>
			</div>
        `);
    }
    //6問目と7問目
    //その問題を答える人物を取得
    hit_user = seach_member_by_order(teamMember.users,6);
    $("#gameMainDisplay").append(`
        <div class="p-game-display__quiz-list--q6andq7 p-quiz-list--q6andq7">
            <!-- 名前 -->
            <div class="p-quiz-list__user-name--q6andq7"><span>${hit_user.info}</span>${hit_user.lastName}</div>
            <!-- 問題 -->
            <div class="p-quiz-list__contents--q6">
                <div class="p-quiz-list__number">${num_circle[5]}</div>
                <div class="p-quiz-list__point--q6">${quiz_child[5].point}<span>点</span></div>
                <div class="p-quiz-list__masu-wrapper">
                </div>
                <div class="p-quiz-list__shadow--disactive"></div>
            </div>
            <!-- 問題 -->
            <div class="p-quiz-list__contents--q7">
                <div class="p-quiz-list__masu-wrapper"></div>
                <div class="p-quiz-list__secret">?</div>
                <div class="p-quiz-list__number">${num_circle[6]}</div>
                <div class="p-quiz-list__point--q7">${quiz_child[6].point}<span>点</span></div>
            </div>
            <!-- アクティブフレームや影など -->
            <div class="p-quiz-list__flame--q6andq7">
                <div class="p-quiz-list__flame-upper-left"></div>
                <div class="p-quiz-list__flame-upper-right"></div>
                <div class="p-quiz-list__flame-bottom-left"></div>
                <div class="p-quiz-list__flame-bottom-right"></div>
            </div>
        </div>
    `);  
    //問題コンテンツの設定
    if(quiz_parent.type_id == 1){
        for(let i = 0; i < 7; i++){
            quiz_num = i + 1;
            if(i<5){
                $(`.p-quiz-list__contents`).eq(i).css("background-image",`url(./img/quiz/${quiz_parent.parent_id}/thumb/${quiz_num}.png)`);
            }
            else{
                $(`.p-quiz-list__contents--q${quiz_num}`).eq(0).css("background-image",`url(./img/quiz/${quiz_parent.parent_id}/thumb/${quiz_num}.png)`);
            }
        }
    }
    //マス目を設定する
    for(let i in quiz_child){
        render_masu_game_list(quiz_child[i].output_text,quiz_child[i].key,i);
    }

    //アクティブフレーム
    let border_color = "#23ED5F";
    $(".p-quiz-list__flame-upper").eq(0).css({
        "border-top":`${border_color} solid 5px`,
        "border-left":`${border_color} solid 5px`,
        "border-right":`${border_color} solid 5px`,
    });
    $(".p-quiz-list__flame-bottom").eq(0).css({
        "border-bottom":`${border_color} solid 5px`,
        "border-left":`${border_color} solid 5px`,
        "border-right":`${border_color} solid 5px`,
    });

    //▶左上の部分
    //問題タイトル
    $(".p-quiz-display__title").eq(0).html(convert_markup(markup_list,quiz_parent.sub_title));
    //最初のプレイヤー
    hit_user = seach_member_by_order(teamMember.users,1);
    $(".p-quiz-display__comment").eq(0).html(hit_user.comment);
    $(".p-quiz-display__last-name").eq(0).html(hit_user.lastName);
    $(".p-quiz-display__first-name").eq(0).html(hit_user.firstName);
    $(".p-quiz-display__age").eq(0).html(`(${hit_user.age})`);
    //最初の問題
    render_masu_game_display(quiz_child[0].output_text,quiz_child[0].key);

    //▶右上の部分
    //チーム名
    $(".p-quiz-teamname").eq(0).text(teamMember.teamName);
    //制限時間
    setting_timer(quiz_parent.time);

    //▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽
    //一覧部分
    //▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽
    //一覧の枠組みを形成
    for(let i=0; i<7; i++){
        //何問目かを取得
        quiz_num = i + 1;
        //描画
        $(".p-game-preview-list__list").eq(0).append(`
            <!-- 問題 -->
			<div class="p-game-preview-list__contents--q${quiz_num}">
				<div class="p-game-preview-list__number">${num_circle[i]}</div>
				<div class="p-game-preview-list__point--q${quiz_num}">${quiz_child[i].point}<span>点</span></div>
				<div class="p-game-preview-list__masu-wrapper">
				</div>
			</div>
        `);
    }
    //問題コンテンツの設定
    if(quiz_parent.type_id == 1){
        for(let i = 0; i < 7; i++){
            quiz_num = i + 1;
            $(`.p-game-preview-list__contents--q${quiz_num}`).eq(0).css("background-image",`url(./img/quiz/${quiz_parent.parent_id}/thumb/${quiz_num}.png)`);
        }
    }
    //マス目を設定する
    for(let i in quiz_child){
        render_masu_list_list(quiz_child[i].output_text,quiz_child[i].key,i);
    }
    //タイトル部分を設定
    $(".p-game-preview-list__title").eq(0).html(convert_markup(markup_list,quiz_parent.sub_title));

    //▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽
    //一番初めの一画面タイトル部分
    //▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽▼▽
    $(".p-game-title__title").eq(0).html(`<div>${convert_markup(markup_list,quiz_parent.title)}</div>`);
    $(".p-game-title__title").eq(1).html(`<div>${convert_markup(markup_list,quiz_parent.title)}</div>`);
    $(".p-game-title__right-contents").eq(0).css("background-image",`url(./../img/background/${quiz_parent.title_back})`);
    $(".p-game-title__left-contents").eq(0).css("background-image",`url(./../img/background/${quiz_parent.title_back})`);

}


//==============================
//■<???> -> <span class="???">に変換する関数
//==============================

function convert_markup(markup_list,value){
    for(let i in markup_list){
        before_start_str = "<" + markup_list[i].before + ">";
        before_end_str = "</" + markup_list[i].before + ">";
        after_start_str = "<span class='" + markup_list[i].after+ "'>";
        after_end_str = "</span>";

        value = value.replace(before_start_str,after_start_str);
        value = value.replace(before_end_str,after_end_str);
    }
    return value;
}

//==============================
//■順番に一致するメンバー情報を取得する
//==============================

function seach_member_by_order(users,order_num){
    for(let i in users){
        if(users[i].order == order_num){
            return users[i];
        }
    }
}

//==============================
//■マス目の描画（メイン画面リスト部）
//==============================
function render_masu_game_list(output_text,key,index){
    key = String(key);
    let work_output_text = output_text.split("");
    let work_key = key.split("");
    let masu_start_flg = 0;
    let text_start_flg = 0;

    for(let i in work_key){
        if(work_key[i] == "1"){
            text_start_flg = 0;
            if(masu_start_flg == 0){
                $(".p-quiz-list__masu-wrapper").eq(index).append(`<div  class="p-quiz-list__masu--start"></div>`);
                masu_start_flg = 1;
            }
            else{
                $(".p-quiz-list__masu-wrapper").eq(index).append(`<div  class="p-quiz-list__masu--nomal"></div>`);
            }
        }
        else if(work_key[i] == "0"){
            masu_start_flg = 0;
            if(text_start_flg == 0){
                $(".p-quiz-list__masu-wrapper").eq(index).append(`<div  class="p-quiz-list__text--start">${work_output_text[i]}</div>`);
                text_start_flg = 1;
            }
            else{
                $(".p-quiz-list__masu-wrapper").eq(index).append(`<div  class="p-quiz-list__text--nomal">${work_output_text[i]}</div>`);
            }
        }
    }
}

//==============================
//■マス目の描画（メイン画面ディスプレイ部）
//==============================
function render_masu_game_display(output_text,key){
    key = String(key);
    let work_output_text = output_text.split("");
    let work_key = key.split("");
    let masu_start_flg = 0;
    let text_start_flg = 0;
    $(".p-quiz-display__masu-wrapper").eq(0).html("");

    for(let i in work_key){
        if(work_key[i] == "1"){
            text_start_flg = 0;
            if(masu_start_flg == 0){
                $(".p-quiz-display__masu-wrapper").eq(0).append(`<div  class="p-quiz-display__masu--start"></div>`);
                masu_start_flg = 1;
            }
            else{
                $(".p-quiz-display__masu-wrapper").eq(0).append(`<div  class="p-quiz-display__masu--nomal"></div>`);
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

//==============================
//■マス目の描画（リスト画面）
//==============================
function render_masu_list_list(output_text,key,index){
    key = String(key);
    let work_output_text = output_text.split("");
    let work_key = key.split("");
    let masu_start_flg = 0;
    let text_start_flg = 0;

    for(let i in work_key){
        if(work_key[i] == "1"){
            text_start_flg = 0;
            if(masu_start_flg == 0){
                $(".p-game-preview-list__masu-wrapper").eq(index).append(`<div  class="p-game-preview-list__masu--start"></div>`);
                masu_start_flg = 1;
            }
            else{
                $(".p-game-preview-list__masu-wrapper").eq(index).append(`<div  class="p-game-preview-list__masu--nomal"></div>`);
            }
        }
        else if(work_key[i] == "0"){
            masu_start_flg = 0;
            if(text_start_flg == 0){
                $(".p-game-preview-list__masu-wrapper").eq(index).append(`<div  class="p-game-preview-list__text--start">${work_output_text[i]}</div>`);
                text_start_flg = 1;
            }
            else{
                $(".p-game-preview-list__masu-wrapper").eq(index).append(`<div  class="p-game-preview-list__text--nomal">${work_output_text[i]}</div>`);
            }
        }
    }
}

//==============================
//■制限時間の数字部分
//==============================
function setting_timer(time){
    let strTime = String(time);
    let arrayStr = strTime.split("");
    $(".p-quiz-timer__hundreds_place").eq(0).text(arrayStr[0]);
    $(".p-quiz-timer__ten_place").eq(0).text(arrayStr[1]);
    $(".p-quiz-timer__one_place").eq(0).text(arrayStr[2]);
}