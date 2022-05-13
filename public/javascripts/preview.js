$(function(){
    $("#previewStart").click(function(){
        $(this).hide();
        console.log(quiz_parent);

        $(".p-game-title").eq(0).css("display","block");
        $(".p-game-preview-list").eq(0).css("display","flex");
        $("#bgm_title_call").get(0).play();
        $("#bgm_title_call").volume = 1.0;
        new Promise((resolve, reject) => {
            setTimeout(function(){
                $("#se_open").get(0).play();
                $("#se_open").volume = 1.0;
                $(".p-game-title__left").eq(0).addClass("p-game-title__left-open");
                $(".p-game-title__right").eq(0).addClass("p-game-title__right-open");
                resolve();
            },14000);
        }).then(function(){
            return new Promise((resolve, reject) => {
                setTimeout(function(){
                    $("#bgm_list").get(0).play();
                    $("#bgm_list").get(0).volume = 0.5;
                    resolve();
                },500);
            })
        }).then(function(){
            if(quiz_parent.preview_pattern_id == 1){
                new Promise((resolve, reject) => {
                    setTimeout(function(){
                        $("#se_change").get(0).play();
                        $("#se_change").get(0).volume = 1.0;
                        preview_movie_set(quiz_child,quiz_parent,0);
                        $(".p-game-preview-list").eq(0).css("display","none");
                        $(".p-game-preview-movie").css("display","flex");
                        resolve();
                    },15500);
                }).then(function(){
                    return new Promise((resolve, reject) => {
                        setTimeout(function(){
                            $("#se_change").get(0).play();
                            $("#se_change").get(0).volume = 1.0;
                            preview_movie_set(quiz_child,quiz_parent,1);
                            resolve();
                        },15500);
                    })
                }).then(function(){
                    return new Promise((resolve, reject) => {
                        setTimeout(function(){
                            $(".p-game-preview-movie").css("display","none");
                            $("#gameMainDisplay").css("display","grid");
                            $(".p-game-title").css("display","none")
                        },25000);
                    })
                }).then(function(){
                    setTimeout(function(){
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
                    },2000);
                });
            }
        });
    });
});

function preview_movie_set(quiz_child,quiz_parent,index){
    let movie_num_list = quiz_parent.preview_list.split(",");
    let movie_num = movie_num_list[index];
    $(".p-game-preview-movie__num").text(num_circle[movie_num - 1]);
    $("div[class^=p-game-preview-movie__point--]").eq(0).attr("class",`p-game-preview-movie__point--q${movie_num}`).html(`${quiz_child[movie_num - 1].point}<span class="p-game-preview-movie__unit">点</span>`);
    render_masu_movie_list(quiz_child[movie_num - 1].output_text,quiz_child[movie_num - 1].key);
    $(".p-game-preview-movie__movie").eq(0).attr("src",`./movie/quiz/${quiz_parent.parent_id}/list/${movie_num}.mp4`);
    $(".p-game-preview-movie__movie").eq(0).get(0).play();
}

//==============================
//■マス目の描画（メイン画面リスト部）
//==============================
function render_masu_movie_list(output_text,key){
    key = String(key);
    let work_output_text = output_text.split("");
    let work_key = key.split("");
    let masu_start_flg = 0;
    let text_start_flg = 0;

    $(".p-game-preview-movie__masu-wrapper").eq(0).html("");

    for(let i in work_key){
        if(work_key[i] == "1"){
            text_start_flg = 0;
            if(masu_start_flg == 0){
                $(".p-game-preview-movie__masu-wrapper").eq(0).append(`<div  class="p-game-preview-movie__masu--start"></div>`);
                masu_start_flg = 1;
            }
            else{
                $(".p-game-preview-movie__masu-wrapper").eq(0).append(`<div  class="p-game-preview-movie__masu--nomal"></div>`);
            }
        }
        else if(work_key[i] == "0"){
            masu_start_flg = 0;
            if(text_start_flg == 0){
                $(".p-game-preview-movie__masu-wrapper").eq(0).append(`<div  class="p-game-preview-movie__text--start">${work_output_text[i]}</div>`);
                text_start_flg = 1;
            }
            else{
                $(".p-game-preview-movie__masu-wrapper").eq(0).append(`<div  class="p-game-preview-movie__text--nomal">${work_output_text[i]}</div>`);
            }
        }
    }
}