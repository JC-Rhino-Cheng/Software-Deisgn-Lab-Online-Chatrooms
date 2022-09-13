# Software Studio 2021 Spring Midterm Project

## Topic
* Project Name : Chat!

## Basic Components
|Component|Score|Y/N|
|:-:|:-:|:-:|
|Membership Mechanism|15%|Y|
|Firebase Page|5%|Y|
|Database|15%|Y|
|RWD|15%|Y|
|Topic Key Function|20%|Y|

## Advanced Components
|Component|Score|Y/N|
|:-:|:-:|:-:|
|Third-Party Sign In|2.5%|Y|
|Chrome Notification|5%|Y|
|Use CSS Animation|2.5%|N|
|Security Report|5%|Y|

# 作品網址：//hidden

## Website Detail Description
>基本上我是直接把lab6的東西拿來改一改，所以整個架構差不多。
主要的差異在index.html，上方的橫幅除了Account選單之外，新增了Chatroom選單、RoomMember選單，總共新增了兩個選單。

>>Account選單相較lab6，新增用淺色顯示當前登入的UID的功能。

>>Chatroom選單，會詳列當前登入的使用者所擁有的聊天室。點按列表中的某一項，就可以切換到那個聊天室。另外，在最下方可以填寫想新增的聊天室的名字，一按下按鈕，系統就會新開一個只有該使用者的聊天室。如果這個聊天室想要新增別的使用者，可以見下方關於「RoomMember選單」的敘述。還有就是，所有註冊的使用者在初始時就會被系統自動加到Public聊天室。

>>RoomMember選單，會根據目前使用者所在的特定的聊天室，顯示目前該聊天室裡面的所有用戶有誰，所以Public聊天室裡面所列的清單，其實就是目前系統上所有有註冊用戶的清單。只要在某個聊天室之內，就可以在這個選單之中以UID、Email、使用者名稱共三種輸入內容來新增聊天室成員，惟Public聊天室不接受新增任何人，因為這是系統會自動維護的。
>>聊天室內容，和lab6的主要差異在於，
>>>(1)如果是使用Google帳號登入，系統會一併帶入Google帳戶的大頭貼照，在聊天時就不會只有預設的紫色照片。

>>>(2)如果使用者要傳遞的訊息裡面有換行，顯示的時候可以正常顯示換行，而不會所有內容全部擠在第一行。


# Components Description : 
1. init : 程式初始化，如果已經有使用者登入，就依照該使用者該顯示什麼聊天室內容、使用者資訊、聊天室列表、該聊天室的成員的列表，就顯示什麼聊天室內容、使用者資訊、聊天室列表、該聊天室的成員的列表。
2. Newing_chatroom : 讀取使用者想要的新聊天室的名稱，在後台DB儲存該聊天室在系統中的流水號、聊天室成員、聊天室內容。等待DB回應創建成功之後，就把使用者帶到該聊天室裡面，顯示該聊天室該顯示的聊天室內容、使用者資訊、聊天室列表、該聊天室的成員的列表。
3. changeChatroom : 如果使用者在沒有要創建新的聊天室的情況底下，想要進入現有的聊天室，就透過這個函式顯示該聊天室該顯示的聊天室內容、使用者資訊、聊天室列表、該聊天室的成員的列表。
4. updateChatroomMem : 因為聊天室有可能新增成員，所以在RoomMember列表的部分需要透過此function來維護。
5. addMem : 在使用者送出新添加某位聊天室成員時，負責和DB溝通的function。
6. resetChatroomsOfDB ： 是網站管理員在維護系統時所用，執行此function後會把所有後台DB資料清空並且初始化到只有Public聊天室。

# Other Functions Description : 
0. 我沒有寫Spec規定的以外的功能。但有兩個特點：（1）如果是Google登入的話，可以帶入Google大頭貼；(2)使用者所有換行的內容都可以正常顯示。

