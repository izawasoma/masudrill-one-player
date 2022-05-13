const time = 210; //制限時間
let remain_time = time; //カウント用変数
let timer_interval;
function timer(){
    const max_width = 875; //ゲージの最大横幅
    let width = 875; //ゲージの表示横幅
    let before_time = time; //アニメーション前の制限時間
    let after_time = before_time - 30; //アニメーション後の制限時間
    let digit_before_time = right_justified(3,before_time);
    let digit_after_time = right_justified(3,after_time);
    let animation_flg = [];
    for(let i=0; i<3; i++){
        if(digit_after_time[i] == digit_before_time[i]){
            animation_flg[i] = 0;
        }
        else{
            animation_flg[i] = 1;
        }
    }

    timer_interval = setInterval(function(){
        //残り時間算出
        remain_time = remain_time - 0.1;
        remain_time = Math.round(remain_time * 100) / 100;
        //横幅算出
        width = remain_time * max_width / time;
        $('#gauge').css('width',width);
        //タイマーの桁のアニメーション
        if(remain_time < after_time){ 
            if(animation_flg[0] == 1){
                rotate_change_hundred(digit_after_time[0]);
            }
            if(animation_flg[1] == 1){
                rotate_change_ten(digit_after_time[1]);
            }
            if(animation_flg[2] == 1){
                rotate_change_one(digit_after_time[2]);
            }
            before_time = after_time; //アニメーション前の制限時間
            if(before_time >= 31){
                after_time = before_time - 30; //アニメーション後の制限時間
            }
            else if(before_time <= 30 && before_time >= 1){
                warning_back();
                after_time = before_time - 1; //アニメーション後の制限時間
            }
            else{
                clearInterval(timer);
            }
            digit_before_time = right_justified(3,before_time);
            digit_after_time = right_justified(3,after_time);
            console.log(digit_after_time);
            animation_flg = [];
            for(let i=0; i<3; i++){
                if(digit_after_time[i] == digit_before_time[i]){
                    animation_flg[i] = 0;
                }
                else{
                    animation_flg[i] = 1;
                }
            }
        }
        timer_event(remain_time);
    },100);
}

function right_justified(bit,number){
    number = number.toString(10);
    let num_array = number.split(''); //入力値を分割し格納する配列
    let right_justified_array = []; //右詰め後の配列
    //初期化
    for(let i=0; i<bit; i++){
        right_justified_array[i] = "";
    }
    //右詰め処理
    for(let i=num_array.length-1; i>-1; i=i-1){
        right_justified_array[i + (bit - num_array.length)] = num_array[i];
    }
    return right_justified_array;
}

function rotate_change_one(num){
    let x = 0;
    one_beforId = setInterval(function(){
        $('#one_place').css('transform','scaleX(80%) rotateX(' + x + 'deg)');
        x = x + 5;
        
        if(x>90){
            clearInterval(one_beforId);
            $('#one_place').text(num);
            one_afterId = setInterval(function(){
                $('#one_place').css('transform','scaleX(80%) rotateX(' + x + 'deg)');
                x = x + 5;
                
                if(x>360){
                    clearInterval(one_afterId);                   
                }
            },0.1);
        }
    },0.1);
}
function rotate_change_hundred(num){
    let x = 0;
    hundred_beforId = setInterval(function(){
        $('#hundreds_place').css('transform','scaleX(80%) rotateX(' + x + 'deg)');
        x = x + 5;
        
        if(x>90){
            clearInterval(hundred_beforId);
            $('#hundreds_place').text(num);
            hundred_afterId = setInterval(function(){
                $('#hundreds_place').css('transform','scaleX(80%) rotateX(' + x + 'deg)');
                x = x + 5;
                
                if(x>360){
                    clearInterval(hundred_afterId);                   
                }
            },0.1);
        }
    },0.1);
}
function rotate_change_ten(num){
    let x = 0;
    ten_beforId = setInterval(function(){
        $('#ten_place').css('transform','scaleX(80%) rotateX(' + x + 'deg)');
        x = x + 5;
        if(x>90){
            clearInterval(ten_beforId);
            $('#ten_place').text(num);
            ten_afterId = setInterval(function(){
                $('#ten_place').css('transform','scaleX(80%) rotateX(' + x + 'deg)');
                x = x + 5;
                
                if(x>360){
                    clearInterval(ten_afterId);                   
                }
            },0.1);
        }
    },0.1);
}

function warning_back(){
    $('#warning').fadeIn(450);
    setTimeout(function(){
        $('#warning').fadeOut(450);
    },450)
}