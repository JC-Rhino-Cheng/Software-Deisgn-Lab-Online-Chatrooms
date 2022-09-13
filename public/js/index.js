var user_photo_url = 'NaN';
var user_photo_url_backup = 'NaN';
var cur_chatroom_id;
var BreakException1 = 99999999;
var BreakException2 = -99999999;


function init() {
    var user_email = '';
    var user_name = '';
    cur_chatroom_id = 0;

    firebase.auth().onAuthStateChanged(function (user) {
        var menu_account = document.getElementById('dynamic-menu-account');
        var menu_chatroom = document.getElementById("dynamic-menu-chatroom");
        var menu_roomMem = document.getElementById("dynamic-menu-roomMember");
        // Check user login
        if (user) {
            cur_chatroom_id = 0;
            console.log("AuthStateChanged!");
            console.log("The logged in user is: " + user.displayName + " with UID: " + user.uid);
            user_email = user.email;
            user_name = user.displayName;
            user_photo_url = (user.photoURL == null || user.photoURL == "NaN") ? "NaN" : user.photoURL;
            user_photo_url_backup = user_photo_url;
            menu_account.innerHTML = "<span class='dropdown-item'>" + user.email + "</span><span class='dropdown-item text-muted text-right small'>UID: " + user.uid + "</span><div class='dropdown-divider'></div><span class='dropdown-item' id='logout-btn'>Logout</span>";

            //===========================================================================
            //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
            //因為user登入了，而且因為每個user能用的chatroom不同，所以菜單需要客製化
            var str_create = '<div class="dropdown-divider"></div><form class="dropdown-item form btn-sm btn-block">' + '<input class="form-control btn-sm btn-block" type="search" placeholder="New Room" aria-label="Create" id="create_txtbox" value="">' + '<button class="btn btn-outline-success btn-sm btn-block" type="button" id="create" onclick="Newing_chatroom();">Create</button>' + '</form>';

            var strBeforeid = '<a class="dropdown-item room" id="chatroomID ';
            var strAfterid = '" onclick="changeChatroom(this.id);updateChatroomMem(this.id);">';
            var strAfterChatroomName = '</a>';
            var total_rooms = [];
            var roomRef = firebase.database().ref("chatrooms");
            roomRef.once("value").then((snapshot) => {
                console.log("Loading the chatrooms of this user");
                //每個聊天室只能被特定的使用者看到，所以要過濾每個聊天室是否有目前登入的使用者的存在，有的話才畫進菜單裡
                snapshot.forEach((childshot) => {
                    if (childshot.key != "Num") {
                        if (childshot.child("Users/" + user.uid).exists()) {
                            var thisRoomName = childshot.child("RoomName").val();
                            var thisRoomID = childshot.child("RoomID").val();

                            var entireStr = strBeforeid + thisRoomID + strAfterid + thisRoomName + strAfterChatroomName;
                            total_rooms[total_rooms.length] = entireStr;
                        }
                    }
                });
                total_rooms[total_rooms.length] = str_create;

                menu_chatroom.innerHTML = total_rooms.join('');
                console.log("Load of chatrooms of this user completed");

            });
            //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
            //===========================================================================




            //===========================================================================
            //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
            //針對每個不同chatroom，顯示不同的聊天室成員
            var str_addMem = '<div class="dropdown-divider"></div><form class="dropdown-item form btn-sm btn-block">' + '<input class="form-control btn-sm btn-block" type="search" placeholder="Email/UID/username" aria-label="Create" id="addMem_txtbox" value="">' + '<button class="btn btn-outline-success btn-sm btn-block" type="button" id="addMem_button" onclick="addMem();">Add Member</button>' + '</form>';

            var strBeforeUID = '<a class="dropdown-item member" id="memUID ';
            var strAfterUID = '" >';
            var strAfterUserName = '</a>';
            var total_mems = [];
            var memRef = firebase.database().ref('chatrooms/' + cur_chatroom_id + "/Users");
            memRef.once("value").then((snapshot) => {
                console.log("Changing the list items into all the users in this chatroom");
                //每個聊天室只能被特定的使用者看到，所以要過濾每個聊天室是否有目前登入的使用者的存在，有的話才畫進菜單裡
                snapshot.forEach((childshot) => {
                    var thisMemName = childshot.val().Name;
                    var thisMemUID = childshot.val().UID;

                    var entireStr = strBeforeUID + thisMemUID + strAfterUID + thisMemName + strAfterUserName;
                    total_mems[total_mems.length] = entireStr;
                });
                total_mems[total_mems.length] = str_addMem;

                menu_roomMem.innerHTML = total_mems.join('');
                console.log("list items changed into all the users in this chatroom successfully");
            });
            //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
            //===========================================================================




            /// TODO 5: Complete logout button event
            ///         1. Add a listener to logout button 
            ///         2. Show alert when logout success or error (use "then & catch" syntex)
            setTimeout(() => {
                //console.log("In TimeOut");

                document.getElementById("logout-btn").addEventListener("click", () => {

                    firebase.auth().signOut().then(() => {
                        // Sign-out successful.
                        alert("Signed out successfully!");
                        user = null;
                    }).catch((error) => {
                        // An error happened.
                        alert("Signed out FAILED!");
                    });
                })
            }, 10);

        } else {
            // It won't show any post if not login
            menu_account.innerHTML = "<a class='dropdown-item' href='signin.html'>Login</a>";
            document.getElementById('post_list').innerHTML = "";

            menu_chatroom.innerHTML = '<a class="dropdown-item room" id="chatroomID 0" onclick="changeChatroom(this.id);updateChatroomMem(this.id);">Public</a>';
            menu_roomMem.innerHTML = '<a class="dropdown-item room text-muted text-right small" id="GuestMode">Guest(You!)</a>';
        }
    });

    post_btn = document.getElementById('post_btn');
    post_txt = document.getElementById('comment');

    post_btn.addEventListener('click', function () {
        if (post_txt.value != "") {
            var current = new Date();
            var cur_time = current.toLocaleString();
            console.log(user_photo_url);
            console.log(user_photo_url_backup);
            //我也不知道為何明明就一摸一樣的東西，但是backup和不backup就有差



            //為了傳送html5 code，所以需要把「<」改成「&lt;」、把「>」改成「&gt;」
            var str_temp = post_txt.value;
            str_temp = str_temp.replace(/</g, "&lt;");//g代表global，可以全部取代，否則只會取代一個
            str_temp = str_temp.replace(/>/g, "&gt;");
            str_temp = str_temp.replace(/\n/g, "<br>");//接受使用者換行，並且提供正確的換行顯示

            firebase.database().ref("chatrooms/" + cur_chatroom_id + "/Contents").push({
                content: str_temp,
                author: user_name ? user_name : user_email,
                timestamp: cur_time,
                user_photo: user_photo_url_backup
            }).then(
                (sucMsg) => {
                    console.log("successed to push data!");

                    post_txt.value = "";
                },
                (errMsg) => {
                    console.log("FAILed to push data!", errMsg);
                    alert("未登入者不被允許發言！");
                }
                /*
                這個Promise的寫法好像不符合firebase的格式，應該寫成：
                dataRef.set("I'm writing data", function(error) {
                        if (error) {
                        alert("Data could not be saved." + error);
                    } else {
                        alert("Data saved successfully.");
                        }
                });
                才對！
                */
            );

            /*
            或者：
            var postsRef = ref.child("posts");
            var newPostRef = postsRef.push();
            newPostRef.set({
              author: "gracehop",
              title: "Announcing COBOL, a New Programming Language"
            });
            又或者：
            // we can also chain the two calls together
            postsRef.push().set({
              author: "alanisawesome",
              title: "The Turing Machine"
            });
            三種寫法都可以！
            */

        }
    });

    // The html code for post
    var str_QianZhiZuoYe = "<div class='my-3 p-3 bg-white rounded box-shadow'>"
    str_QianZhiZuoYe += "<div class='media text-muted pt-3'><img src='";
    var str_ZhongZhiZuoYe = "' alt='' class='mr-2 rounded' style='height:32px; width:32px;'>";
    str_ZhongZhiZuoYe += "<p class='media-body pb-3 mb-0 small lh-125 border-bottom border-gray'><class='d-block text-gray-dark'><b>";
    var str_HouZhiZuoYe = "</p></div></div>\n";

    var postsRef = firebase.database().ref('chatrooms/' + cur_chatroom_id + "/Contents");
    // List for store posts html
    var total_post = [];
    // Counter for checking history post update complete
    var first_count = 0;
    // Counter for checking when to update new post
    var second_count = 0;

    postsRef.once('value')
        .then(function (snapshot) {
            console.log("loading the contents of this chatroom");
            /// TODO 7: Get all history posts when the web page is loaded 
            ///         1. Get all history post and push to a list (str_QianZhiZuoYe + email + </strong> + data + str_HouZhiZuoYe)
            ///         2. count history message number and recond in "first_count"
            ///         Hint : Trace the code in this block, then you will know how to finish this TODO

            /// Join all post in list to html in once
            document.getElementById('post_list').innerHTML = total_post.join('');

            /// Add listener to update new post
            postsRef.on('child_added', function (data) {
                var curUser = firebase.auth().currentUser;
                if (curUser /* can see ONLY if logged in*/) {
                    second_count += 1;
                    //console.log(total_post, first_count, second_count);

                    if (second_count > first_count) {
                        var childData = data.val();
                        //console.log(childData); //childData格式： {author: "aa@aa.aa", content: "ABCDEFG", timestamp: "2021/4/19 上午4:35:14", user_photo: "..."}
                        user_photo_url = childData.user_photo == "NaN" ? "img/test.svg" : childData.user_photo;
                        var str_Author = (curUser.email == childData.author || curUser.displayName == childData.author) ? "您" : childData.author;

                        total_post[total_post.length] = str_QianZhiZuoYe + user_photo_url + str_ZhongZhiZuoYe + str_Author + "</b> 於 " + childData.timestamp + "<br><large>" + childData.content + "</large>" + str_HouZhiZuoYe;
                        document.getElementById('post_list').innerHTML = total_post.join('');

                        if (!(curUser.email == childData.author || curUser.displayName == childData.author)) {
                            //console.log("In it!");
                            notifyMe(childData.author, childData.content);
                        }
                    }

                }

            });






            
        }).then((sucMsg) => {console.log("loading the contents of this chatroom");})
        .catch(e => console.log(e.message));



    // 註冊通知的權限
    // request permission on page load
    document.addEventListener('DOMContentLoaded', function () {
        if (!Notification) {
            alert('Desktop notifications not available in your browser. Try Chromium.');
            return;
        }
        if (Notification.permission !== 'granted')
            Notification.requestPermission();
    });

}

// Custom alert
function create_alert(type, message) {
    var alertarea = document.getElementById('custom-alert');
    if (type == "success") {
        str_html = "<div class='alert alert-success alert-dismissible fade show' role='alert'><strong>Success! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    } else if (type == "error") {
        str_html = "<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    }
}







function Newing_chatroom() {
    var curUser = firebase.auth().currentUser;
    if (curUser /* can create a new room  ONLY if logged in*/) {
        var desired_chatroom_name = document.getElementById("create_txtbox").value;
        document.getElementById("create_txtbox").value = "";
        if (desired_chatroom_name == "") {
            alert("The desired name of room should't be blank!");
            return;
        }
        console.log("Wants to create a new chatroom with name: " + desired_chatroom_name);

        var idxOfNewChatroom = -1;
        var idx_ref = firebase.database().ref("chatrooms/Num");
        idx_ref.once("value").then((snapshot) => {
            idxOfNewChatroom = snapshot.val().chatrooms_count;//獲取目前的chatroom數（a.k.a. 新的chatroom的編號）
            idx_ref.set({
                chatrooms_count: idxOfNewChatroom + 1 //記得更新database裡的chatroom數
            }).then((sucMsg) => {
                console.log("Num of chatroom in db updated successfully! ");


                //把chatroom名稱推送到database上去
                firebase.database().ref('chatrooms/' + idxOfNewChatroom).set({
                    RoomName: desired_chatroom_name,
                    RoomID: idxOfNewChatroom
                }).then(() => {
                    console.log("db path: " + 'chatrooms/' + idxOfNewChatroom + " created");
                }).then(() => {

                    //創建好聊天室以後，要把此聊天室的第一個成員加入
                    var curUser = firebase.auth().currentUser;
                    firebase.database().ref('chatrooms/' + idxOfNewChatroom + '/Users/' + curUser.uid).set({
                        Name: curUser.displayName ? curUser.displayName : curUser.email,
                        Email: curUser.email,
                        Photo: curUser.photoURL ? curUser.photoURL : "NaN",
                        UID: curUser.uid
                    }).then(() => {
                        console.log("db path: " + 'chatrooms/' + idxOfNewChatroom + '/Users/' + curUser.uid + " created");

                        //因為現在有了新的chatroom，所以畫面上方選單的chatroom下拉選單內容需要重畫
                        var menu = document.getElementById("dynamic-menu-chatroom");
                        var str_create = '<div class="dropdown-divider"></div><form class="dropdown-item form btn-sm btn-block">' + '<input class="form-control btn-sm btn-block" type="search" placeholder="New Room" aria-label="Create" id="create_txtbox" value="">' + '<button class="btn btn-outline-success btn-sm btn-block" type="button" id="create" onclick="Newing_chatroom();">Create</button>' + '</form>';

                        var strBeforeid = '<a class="dropdown-item room" id="chatroomID ';
                        var strAfterid = '" onclick="changeChatroom(this.id);updateChatroomMem(this.id);">';
                        var strAfterChatroomName = '</a>';

                        var total_rooms = [];
                        var roomRef = firebase.database().ref("chatrooms");
                        roomRef.once("value").then((snapshot) => {
                            //每個聊天室只能被特定的使用者看到，所以要過濾每個聊天室是否有目前登入的使用者的存在，有的話才畫進菜單裡
                            snapshot.forEach((childshot) => {
                                if (childshot.key != "Num") {
                                    if (childshot.child("Users/" + curUser.uid).exists()) {
                                        var thisRoomName = childshot.child("RoomName").val();
                                        var thisRoomID = childshot.child("RoomID").val();

                                        var entireStr = strBeforeid + thisRoomID + strAfterid + thisRoomName + strAfterChatroomName;
                                        total_rooms[total_rooms.length] = entireStr;
                                    }
                                }
                            });
                            total_rooms[total_rooms.length] = str_create;

                            menu.innerHTML = total_rooms.join('');

                        });


                    });
                })./*創建好聊天室之後，就把使用者帶往那個新的聊天室*/then(() => {
                    firebase.database().ref("chatrooms/Num").once("value").then((snapshot) => {
                        idxOfNewChatroom = snapshot.val().chatrooms_count - 1;
                        changeChatroom("chatroomID " + idxOfNewChatroom.toString(), true);
                    });

                }).catch((errMsg) => {
                    console.log("FAILed to create a new chatroom!!!!!")
                });


            },
                (errMsg) => { console.log(errMsg) }
            );

        });
    }
}






function changeChatroom(idxOfTheRoom/*格式"chatroomID 1"*/, from_Newing_chatroom_func) {
    document.getElementById('post_list').innerHTML = "";
    var ID = idxOfTheRoom.split(" ")[1];
    cur_chatroom_id = ID;
    //console.log("changed to chatroom ID: " + ID);

    // The html code for post
    var str_QianZhiZuoYe = "<div class='my-3 p-3 bg-white rounded box-shadow'>"
    str_QianZhiZuoYe += "<div class='media text-muted pt-3'><img src='";
    var str_ZhongZhiZuoYe = "' alt='' class='mr-2 rounded' style='height:32px; width:32px;'>";
    str_ZhongZhiZuoYe += "<p class='media-body pb-3 mb-0 small lh-125 border-bottom border-gray'><class='d-block text-gray-dark'><b>";
    var str_HouZhiZuoYe = "</p></div></div>\n";

    var postsRef = firebase.database().ref('chatrooms/' + ID + "/Contents");
    // List for store posts html
    var total_post = [];
    // Counter for checking history post update complete
    var first_count = 0;
    // Counter for checking when to update new post
    var second_count = 0;

    postsRef.once('value')
        .then(function (snapshot) {
            /// Join all post in list to html in once
            document.getElementById('post_list').innerHTML = total_post.join('');

            /// Add listener to update new post
            postsRef.on('child_added', function (data) {
                var curUser = firebase.auth().currentUser;
                if (curUser /* can see ONLY if logged in*/) {
                    second_count += 1;
                    //console.log(total_post, first_count, second_count);

                    if (second_count > first_count) {
                        var childData = data.val();
                        //console.log(childData); //childData格式： {author: "aa@aa.aa", content: "ABCDEFG", timestamp: "2021/4/19 上午4:35:14", user_photo: "..."}
                        user_photo_url = childData.user_photo == "NaN" ? "img/test.svg" : childData.user_photo;
                        var str_Author = (curUser.email == childData.author || curUser.displayName == childData.author) ? "您" : childData.author;

                        total_post[total_post.length] = str_QianZhiZuoYe + user_photo_url + str_ZhongZhiZuoYe + str_Author + "</b> 於 " + childData.timestamp + "<br><large>" + childData.content + "</large>" + str_HouZhiZuoYe;
                        document.getElementById('post_list').innerHTML = total_post.join('');

                        if (!(curUser.email == childData.author || curUser.displayName == childData.author)) {
                            console.log("In it");
                            notifyMe(childData.author, childData.content);
                        }
                    }

                }

            });






        })./*把聊天室裡面的聊天內容更新後，也要記得把顯示的chatroom成員更換*/then(() => {
            //updateChatroomMem(ID);
            //但因為我已經把這個函式的執行也寫在html的onclick了所以就不用額外弄
            //上面一句不完全對，因為如果是從Newing_chatroom這個func過來的話，就需要
            if (from_Newing_chatroom_func) updateChatroomMem(idxOfTheRoom);
        })
        .catch(e => console.log(e.message));

}




function updateChatroomMem(idxOfTheRoom) {
    document.getElementById('post_list').innerHTML = "";
    var ID = idxOfTheRoom.split(" ")[1];

    var menu_roomMem = document.getElementById("dynamic-menu-roomMember");

    var str_addMem = '<div class="dropdown-divider"></div><form class="dropdown-item form btn-sm btn-block">' + '<input class="form-control btn-sm btn-block" type="search" placeholder="Email/UID/username" aria-label="Create" id="addMem_txtbox" value="">' + '<button class="btn btn-outline-success btn-sm btn-block" type="button" id="addMem_button" onclick="addMem();">Add Member</button>' + '</form>';
    var strBeforeUID = '<a class="dropdown-item member" id="memUID ';
    var strAfterUID = '" >';
    var strAfterUserName = '</a>';
    var total_mems = [];
    var memRef = firebase.database().ref('chatrooms/' + ID + "/Users");
    // memRef.once("value").then((snapshot) => {
    //     //每個聊天室只能被特定的使用者看到，所以要過濾每個聊天室是否有目前登入的使用者的存在，有的話才畫進菜單裡
    //     //console.log(snapshot.val());
    //     snapshot.forEach((childshot) => {
    //         var thisMemName = childshot.val().Name;
    //         var thisMemUID = childshot.val().UID;

    //         var entireStr = strBeforeUID + thisMemUID + strAfterUID + thisMemName + strAfterUserName;
    //         total_mems[total_mems.length] = entireStr;
    //     });
    //     total_mems[total_mems.length] = str_addMem;
    //     menu_roomMem.innerHTML = total_mems.join('');

    //})./*註冊監控是否有新增進來的聊天室成員，如果有的話就更新*/then(() => {
    //好像真的不用分成once和on兩個來寫，就跟助教的一樣，只要on就好了。
    memRef.on('child_added', function (data) {
        var childData = data.val();
        var thisMemName = childData.Name;
        var thisMemUID = childData.UID;

        var entireStr = strBeforeUID + thisMemUID + strAfterUID + thisMemName + strAfterUserName;

        if (total_mems.length != 0) {
            total_mems[total_mems.length - 1] = entireStr;//因為最後面原本還有讓使用者輸入的那個表格，所以是這個新的user取代那個表格，而那個表格要往下推移顯示
            total_mems[total_mems.length] = str_addMem;
        }
        else /*if (total_mems.length == 0)*/ {
            total_mems[total_mems.length /*- 1*/] = entireStr;//這句如果是一開始什麼都沒有的情況下要做修正，否則會寫到-1去
            total_mems[total_mems.length] = str_addMem;
        }


        menu_roomMem.innerHTML = total_mems.join('');

    });
    //});

}





function addMem() {
    if (cur_chatroom_id == 0) {
        alert("You can't add anyone into the Public Space. System would add every registered member into Public Space on its own.")
        return;
    }
    
    var whom_to_add = document.getElementById("addMem_txtbox").value;
    document.getElementById("addMem_txtbox").value = "";
    if (whom_to_add == "") {
        alert("Please enter at least one of the following information of the user: Email, Username, or UID.");
        return;
    }
    console.log("Wants to add a new member " + whom_to_add + " into chatroom ID : " + cur_chatroom_id);

    //需要確認使用者輸入的想加進來的人，是否是有註冊在籍的用戶？
    //檢查該用戶是否已經在這個聊天室裡面了？（雖然這個應該依照人類的思考脈絡應該先做，但對電腦來說既然是兩個條件都要做到，那我先檢查這個也沒差。為啥先檢查這個？因為這個比較簡單）
    //現在開始要：檢查該用戶是否已經在這個聊天室裡面了？
    var flag_user_not_inside_this_room = true;
    var memRef = firebase.database().ref('chatrooms/' + cur_chatroom_id + "/Users");
    memRef.once("value").then((snapshot) => {
        snapshot.forEach((childshot) => {
            if (whom_to_add == childshot.val().Email || whom_to_add == childshot.val().Name || whom_to_add == childshot.val().UID) {
                //這個用戶已經在這個聊天室裡面了！
                alert("The specified user: " + whom_to_add + " is alreay here!");
                flag_user_not_inside_this_room = false;

                return;
                //注意！！因為這是promise，所以即便return之後，他！！會！！繼續執行下面的then，所以才需要flag_user_not_inside_this_room這個flag！
            }
        });
    })/*現在開始要：確認使用者輸入的想加進來的人，是否是有註冊在籍的用戶？*/.then(() => {
        if (flag_user_not_inside_this_room) {
            var usersRef = firebase.database().ref('users');
            usersRef.once("value").then((snapshot) => {

                var dataOfGoalUser;
                try {
                    snapshot.forEach((childshot) => {
                        if (whom_to_add == childshot.val().Email || whom_to_add == childshot.val().Name || whom_to_add == childshot.val().UID) {

                            dataOfGoalUser = childshot.val();
                            //break;
                            //因為JS的forEach不支援break，所以轉而使用Exception
                            throw BreakException1;//確認是註冊在籍的用戶，就傳BreakException1
                        }
                    });
                    throw BreakException2;//找不到此用戶，就傳BreakException2

                } catch (err) {
                    if (err == BreakException1/*如果確實有這個用戶*/) {
                        firebase.database().ref('chatrooms/' + cur_chatroom_id + '/Users/' + dataOfGoalUser.UID).set({
                            Name: dataOfGoalUser.Name,
                            Email: dataOfGoalUser.Email,
                            Photo: dataOfGoalUser.Photo,
                            UID: dataOfGoalUser.UID
                        }).then(() => { console.log("The specified user: " + whom_to_add + " is added into chatroom ID: " + cur_chatroom_id); });
                    }
                    else if (err == BreakException2/*如果根本沒有這個用戶*/) {
                        alert("The specified user: " + whom_to_add + " DOES NOT exist!");
                    }
                };

            });
        }


    });




}




//限定後台管理員才能用，任何user都不能用 //這是我方便寫code用的，所以user永遠不會用到
function resetChatroomsOfDB() {
    var maxNum = -1;

    var idxRef = firebase.database().ref("chatrooms/Num");
    idxRef.once("value").then((snapshot) => {
        maxNum = snapshot.val().chatrooms_count - 1;
    });
    //目前已經得到聊天室總共有編號0~MaxNum(兩端都包含)

    var i;
    var roomRef = firebase.database().ref("chatrooms");
    for (i = 0; i <= maxNum; i++) {
        roomRef.child(i.toString()).remove().then(() => { console.log("chatroom ID: " + i + " removed successfully") });
    }


}




window.onload = function () {
    init();
};







function notifyMe(sender, msg) {
    msg = msg.replace(/<br>/g, " ");
    msg = msg.replace(/&lt;/g, "<");
    msg = msg.replace(/&gt;/g, ">");
    //console.log(msg);

    if (Notification.permission !== 'granted')
        Notification.requestPermission();
    else {
        var notification = new Notification('A message from ' + sender, {
            icon: 'https://firebasestorage.googleapis.com/v0/b/midterm-chatroom-c0c07.appspot.com/o/NotificationIcon.png?alt=media&token=408e172d-86f8-474a-a7bf-f42d402c6368',
            body: msg
        });
        notification.onclick = function () {
            //window.open('https://midterm-chatroom-c0c07.web.app');
        };
    }
}





/*
用來取得用在chrome通知的「Chat!」圖標的網址的code
// Create a root reference
    var storageRef = firebase.storage().ref('');
    // Create a reference to 'xxx.jpg'
    var imgRef = storageRef.child("NotificationIcon.png");
    // 'file' comes from the Blob or File API
    imgRef.getDownloadURL().then((url) => {
        imgURL = url;
        console.log(url);
    });

*/