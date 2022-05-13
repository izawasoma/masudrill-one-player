let quiz_child;
let quiz_parent;
const num_circle = ["①","②","③","④","⑤","⑥","⑦"];
let stage = 0;
let sum_point = 0;
let video_end_flg = 0;
let event_stop_flg = 0;
let remain_hint = 3;

//====================================
//●以下テスト用変数
//====================================

//プレイヤー情報
let teamMember = {
    teamName: "新インテリ軍",
    users: [
        {
            lastName:"石黒",
            firstName:"恵美",
            user_id: 2,
            age: 24,
            info: "東大2年",
            comment: "2年連続ミス東大",
            socketId: "1024ok12",
            state: "ok",
            order: 1,
        },
        {
            lastName:"丸井",
            firstName:"斗真",
            user_id:4,
            age: 22,
            info:"京大1年",
            comment:"100以上の資格を持つ男",
            socketId:"2410iw12",
            state:"ok",
            order: 2,
        },
        {
            lastName:"伊沢",
            firstName:"拓司",
            user_id: 12,
            age: 27,
            info: "QuizKnock",
            comment:"QuizKnock CEO",
            socketId:"3121df34",
            state:"ok",
            order: 6,
        },
        {
            lastName:"須貝",
            firstName:"駿貴",
            user_id: 22,
            age: 30,
            info: "QuizKnock",
            comment: "東京大学院を今年卒業！",
            socketId:"1201hg34",
            state:"ok",
            order: 5,
        },
        {
            lastName:"菊川",
            firstName:"怜",
            user_id: 52,
            age: 44,
            info:"東大卒",
            comment:"東大卒の「リケジョ」",
            socketId: "3167uj49",
            state:"ok",
            order: 3,
        },
        {
            lastName:"宮戸",
            firstName:"洋行",
            user_id: 84,
            age: 37,
            info:"GAG",
            comment:"年末Qさま学力王で優勝",
            socketId:"0129kx83",
            state:"ok",
            order: 4, 
        }
    ]
}
//markupリスト
let markup_list = [
    {id:1,before:"red",after:"fc-red"},
]