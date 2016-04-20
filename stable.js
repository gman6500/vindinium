var Bot = require('bot');
var PF = require('pathfinding');
// var bot = new Bot('YOUR KEY HERE', 'arena', 'http://vindinium.org'); //Put your bot's code here and change training to Arena when you want to fight others.
var bot = new Bot('YOUR KEY HERE', 'arena', 'http://52.53.211.7:9000'); //Put your bot's code here and change training to Arena when you want to fight others.
var goDir;
var Promise = require('bluebird');

Bot.prototype.botBrain = function() {
    return new Promise(function(resolve, reject) {
        _this = bot;
        //////* Write your bot below Here *//////
        //////* Set `myDir` in the direction you want to go and then bot.goDir is set to myDir at the bottom *////////
        
        /*                                      * 
         * This Code is global data!            *
         *                                      */
        
        // Set myDir to what you want and it will set bot.goDir to that direction at the end.  Unless it is "none"
        if(bot.data.game.turn=1){
            bot.allMines=bot.freeMines;
        }
        var myDir;
        var myPos = [bot.yourBot.pos.x, bot.yourBot.pos.y];
        
        
        var enemyBots = [];
        
        if(bot.yourBot.id != 1) enemyBots.push(bot.bot1);
        if(bot.yourBot.id != 2) enemyBots.push(bot.bot2);
        if(bot.yourBot.id != 3) enemyBots.push(bot.bot3);
        if(bot.yourBot.id != 4) enemyBots.push(bot.bot4);
        
        var enemyMines=[];
        enemyMines=enemyMines.concat(enemyBots[0].mines);
        enemyMines=enemyMines.concat(enemyBots[1].mines);
        enemyMines=enemyMines.concat(enemyBots[2].mines);
        enemyMines=enemyMines.concat(bot.freeMines);
        // console.log(enemyMines);
        var scare=100-bot.yourBot.life;
        var anger=findAnger();
        var greed=findGreed();
        
        
        //bot.yourBot.doubleDrink=false;
        /*                                      * 
         * This Code Decides WHAT to do         *
         *                                      */
        console.log("Anger: "+anger+" Scare: "+scare+" Greed: "+greed)
        if(scare>anger&&scare>greed){
            findTavern();
        }else if(anger>greed){
            huntPlayer();
        }else{
            findMine();
        }
        
        
        /*                                      * 
         * This Code Determines HOW to do it    *
         *                                      */
        
        // This Code find the nearest freemine and sets myDir toward that direction // 
        
        
        
        function findAnger(){
            var closePlayer=closestPlayer();
            var distance= bot.findDistance(myPos,[closePlayer.pos.x,closePlayer.pos.y]);
            var mineModifier=(bot.allMines.length-closePlayer.mineCount)*10
            var tempAnger= 100-distance*10-scare/2-mineModifier-closePlayer.life;
            if(tempAnger>100){
                tempAnger=100;
            }
            if(closePlayer.mineCount===0){
                anger=0
            }
            return tempAnger;
        }
        
        function findGreed(){
            var closeMine=closestMine();
            var distance=bot.findDistance(myPos,closeMine);
            // console.log(bot);
            var mineModifier=(bot.allMines.length-bot.yourBot.mineCount)*10;
            
            var tempGreed=100-distance*10-scare/2+mineModifier;
            
            if(scare<30){
                tempGreed=30;
            }else if(bot.allMines===bot.yourBot.mines){
                tempGreed=0;
                scare=100;
            }
            return tempGreed;
        }
        
        function findMine(){
            console.log("Claiming a Free Mine!");
            console.log(bot.findPath(myPos, closestMine()))
            var closeMine=closestMine();
            console.log(closeMine)
            console.log(bot.findPath(myPos, closeMine))
            myDir = bot.findPath(myPos, closeMine);
            console.log(myDir)
        }

        function closestMine(){
            var closestMine = enemyMines[0];
            // console.log('Closest Mine:'+ closestMine)
            for(i = 0; i < enemyMines.length; i++) {
                if(bot.findDistance(myPos, closestMine) > bot.findDistance(myPos, enemyMines[i])&&bot.findPath(myPos, enemyMines[i])!=='none') {
                    closestMine = enemyMines[i];
                }
                // console.log('Closest Mine:'+ closestMine)
            }
            // console.log(closestMine)
            return closestMine;
        }
        
        function findTavern(){
            console.log("Going to Tavern");
            myDir= bot.findPath(myPos, closestTavern())
        }
        
        function closestTavern(){
            var closestTavern=bot.taverns[0];
            for(i=0;i<bot.taverns.length;i++){
                if(bot.findDistance(myPos,closestTavern)>bot.findDistance(myPos,bot.taverns[i])){
                    closestTavern=bot.taverns[i];
                }
            }
            return closestTavern;
        }
        
        function closestPlayer(){
            var closestPlayer=enemyBots[0];
            
            for(i=0;i++;i<enemyBots.length){
                if(bot.findDistance(myPos,closestPlayer.pos)>enemyBots[i]){
                    closestPlayer=enemyBots[i];
                }
            }
            return closestPlayer;
        }

        function huntPlayer(){
            var huntedBot=closestPlayer();
            console.log("Hunting bot: "+ huntedBot.id);
            myDir=bot.findPath(myPos,[huntedBot.pos.x,huntedBot.pos.y]);
        }
        
        
        /*                                                                                                                              * 
         * This Code Sets your direction based on myDir.  If you are trying to go to a place that you can't reach, you move randomly.   *
         * Otherwise you move in the direction set by your code.  Feel free to change this code if you want.                            */
        if(myDir === "none") {
            console.log("Going Random!");
            var rand = Math.floor(Math.random() * 4);
            var dirs = ["north", "south", "east", "west"];
            bot.goDir = dirs[rand];
        } else {
            bot.goDir = myDir;
        }
        
        
        
        ///////////* DON'T REMOVE ANTYTHING BELOW THIS LINE *//////////////
        resolve();
    });
}
bot.runGame();
