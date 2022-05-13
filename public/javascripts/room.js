$(function(){
    var socket = io();
    console.log(user_id);
    let gameData;
    let roomNum;
    let is_parent;

    $("#makeRoom").click(function(){
        roomNum = Math.floor(Math.random() * ((9999 + 1) - 1000)) + 1000;
        socket.emit("makeRoom",roomNum);
        socket.emit("joinRoom",{roomNum:roomNum,user_id:user_id});
        is_parent = true;
        $("#p-game-wait-room-id").text(`ルーム番号：${roomNum}`);
        $("#room-select-display").fadeOut(500);
        setTimeout(function(){
            $("#wait-display").fadeIn(500).css("display","grid");
        },500);
    });

    $("#entryRoom").click(function(){
        $("#room-select-display").fadeOut(500);
        is_parent = false;
        setTimeout(function(){
            $("#room-entry").fadeIn(500).addClass("room-entry-active");
        },500);
    });

    $("#room-entry-decide").click(function(){
        let roomNum = $("#room-entry-form").val();
        roomNum = Number(roomNum);
        socket.emit("joinRoom",{roomNum:roomNum,user_id:user_id});
        is_parent = false;
    })
    
    socket.on('updateMember', function (receivedGameData) {
        gameData = receivedGameData;
        console.log(gameData);
        $("#waiting-member").css("display","flex");
        if($("#room-entry").hasClass("room-entry-active")){
            $("#p-game-wait-room-id").text(`ルーム番号：${gameData.roomNum}`);
            $("#room-entry").fadeOut(500).removeClass("room-entry-active");
            setTimeout(function(){
                $("#wait-display").fadeIn(500).css("display","grid");
            },500);
        }
        $("#wait-display-member").html("");
        for(let i = 0; i < 6; i++){
            if(gameData.teamMember.users[i] != undefined){
                $("#wait-display-member").append(`
                    <tr>
                        <th class="p-room-wait__th">メンバー${i + 1}</th>
                        <td class="p-room-wait__td">${gameData.teamMember.users[i].lastName} ${gameData.teamMember.users[i].firstName}</td>
                        <td class="p-room-wait__order"></td>
                    </tr>
                `);
            }
            else{
                $("#wait-display-member").append(`
                    <tr>
                        <th class="p-room-wait__th">メンバー${i + 1}</th>
                        <td class="p-room-wait__td"></td>
                        <td class="p-room-wait__order"></td>
                    </tr>
                `);
            }
        }
    });
    socket.on('cannotJoinRoom',function(roomNum){
        $("#room-entry-error").text(`ルームコード「${roomNum}」に一致する部屋が見つかりません`);
    });
    socket.on('parentSetting',function(){
        $("#waiting-member").fadeOut(500);
        setTimeout(function(){
            $("#waiting-member-name-setting-parent").fadeIn(500).css("display","flex");
        },500);
    });
    socket.on('childSetting',function(){
        $("#waiting-member").fadeOut(500);
        setTimeout(function(){
            $("#waiting-member-name-setting-child").fadeIn(500).css("display","flex");
        },500);
        console.log("child");
    });
    $("#team-name-decide").click(function(){
        let teamName = $("#team-name-form").val();
        socket.emit("decideTeamName",{roomNum:gameData.roomNum,teamName:teamName});     
    });
    //チーム名を決めた際に飛んでくるイベント
    socket.on("decideTeamName",function(teamName){
        if(is_parent){
            $(".p-room-wait__order").addClass("p-room-wait__order--select").removeClass("p-room-wait__order");
            $("#waiting-member-name-setting-parent").fadeOut(500);
            setTimeout(function(){
                $("#waiting-order-setting-parent").fadeIn(500).css("display","flex");
            },500);
        }
        else{
            $("#waiting-member-name-setting-child").fadeOut(500);
            setTimeout(function(){
                $("#waiting-order-setting-child").fadeIn(500).css("display","flex");
            },500);
        }
        $("#p-game-wait-team-name").text(teamName);
    });
    //順番決め
    let player_order_work; //何番目の要素をクリックしたか
    let player_order = []; //clickされた順番に要素番号が入っていく
    let player_order_count = 1; //順番
    let player_order_flg = 0; //同じ場所をclickした時のためのフラグ

    $('body').on('click', ".p-room-wait__order--select" , function() {
        //何番目をクリックしたかを取得
        player_order_work = $(".p-room-wait__order--select").index(this);
        //フラグの初期化
        player_order_flg = 0;
        //重複clickのチェック
        for(let i in player_order){
            if(player_order[i] == player_order_work){
                //同じものを２回クリックした場合、flgを立てる
                player_order_flg = 1;
            }
        }
        //重複clickでない場合は以下の処理を実行
        if(player_order_flg == 0){
            //テーブルへ順番をレンダリング
            $(".p-room-wait__order--select").eq(player_order_work).text(player_order_count);
            //順番を保存
            player_order[player_order_count - 1] = player_order_work;
            //順番をカウントアップ
            player_order_count++;
        }
        console.log(player_order_work);
        console.log(player_order);
        console.log(player_order_count);
    });

    $("#order-setting-decide").click(function(){
        //6人分選択されていれば以下を実行
        if(player_order.length == 6){
            //Socket>>サーバーサイドに確定した順番を送信
            socket.emit("decidePlayerOrder",{roomNum:gameData.roomNum,player_order:player_order});
        } 
        //6人分選択されていなければ以下を実行
        else{
        }
    });

    $("#order-setting-reset").click(function(){
        //テーブルの順番を消す
        $(".p-room-wait__order--select").text("");
        //順番にかかわる配列や変数も初期化
        player_order = [];
        player_order_count = 1;
    });

    socket.on("decidePlayerOrder",function(data){
        gameData = data;
        if(is_parent){
            //クラスを元に戻す
            $(".p-room-wait__order--select").addClass("p-room-wait__order").removeClass("p-room-wait__order--select");
            //順番設定画面のフェードアウト
            $("#waiting-order-setting-parent").fadeOut(500);
        }
        else{
            //順番設定中メッセージ画面のフェードアウト
            $("#waiting-order-setting-child").fadeOut(500);
            //順番を画面に出力
            for(let i in gameData.teamMember.users){
                $(".p-room-wait__order").eq(i).text(gameData.teamMember.users[i].order);
            }
        }
        //準備完了確認テーブルの名簿を作成
        for(let i in gameData.teamMember.users){
            $("#p-room-wait__ready-member").append(`<th class="p-room-wait__ready-th">${gameData.teamMember.users[i].lastName} ${gameData.teamMember.users[i].firstName}</th>`);
            $("#p-room-wait__ready-state").append(`<td class="p-room-wait__ready-td">準備中</td>`)
        }
        //準備完了確認画面を出力
        setTimeout(function(){
            $("#waiting-ready-check").fadeIn(500).css("display","flex");
        },500);
    });

    $("#waiting-ready").click(function(){
        let userData = whoAreYouByUserId(gameData.teamMember.users,user_id);
        console.log(userData);
        //Socket>>サーバーサイドに準備完了ボタンを押した人物の情報を送信
        socket.emit("waiting-ready",{userData:userData,roomNum:gameData.roomNum});
        $("#waiting-ready").css("display","none");
    });
    
    socket.on("waiting-ready",function(data){
        //データを最新のデータに書き換え
        gameData = data.gameData;
        console.log(data);
        console.log("▼gamedata書き換え後");
        console.log(gameData);
        //テーブルを書き換え
        $(".p-room-wait__ready-td").eq(data.index).text("準備OK");
    })

    socket.on("all-member-ready",function(data){
        console.log(data);
        console.log("全員の準備が完了しました")
    });

    function whoAreYouByUserId(userObj,user_id){
        for(let i in userObj){
            if(userObj[i].user_id == user_id){
                return {userData:userObj[i],index:i};
            }
        }
        return null;
    }
});