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
        var myDir;
        var myPos = [bot.yourBot.pos.x, bot.yourBot.pos.y];
        
        var enemyBots = [];
        if(bot.yourBot.id != 1) enemyBots.push(bot.bot1);
        if(bot.yourBot.id != 2) enemyBots.push(bot.bot2);
        if(bot.yourBot.id != 3) enemyBots.push(bot.bot3);
        if(bot.yourBot.id != 4) enemyBots.push(bot.bot4);
        
        //bot.yourBot.doubleDrink=false;
        /*                                      * 
         * This Code Decides WHAT to do         *
         *                                      */
        
        if(bot.yourBot.life<=35){
		    console.log("going to tavern")
            findTavern();
	    }else if(bot.yourBot.life>=60 && bot.findDistance(myPos,closestMine())>4){
		    huntPlayer(Math.floor(Math.random()*25)+15);
	    }else{
            findMine();
        }
        
        
        /*                                      * 
         * This Code Determines HOW to do it    *
         *                                      */
        
        // This Code find the nearest freemine and sets myDir toward that direction // 
        function findMine(){
            console.log("Claiming a Free Mine!");
            myDir = bot.findPath(myPos, closestMine());
        }

        function closestMine(){
            var closestMine = bot.freeMines[0];
            for(i = 0; i < bot.freeMines.length; i++) {
                if(bot.findDistance(myPos, closestMine) > bot.findDistance(myPos, bot.freeMines[i])) {
                    closestMine = bot.freeMines[i];
                }
            }
            return closestMine;
        }
        
        function findTavern(){
            myDir= bot.findPath(myPos, closestTavern())
        }
        
        function closestTavern(){
            var closestTavern=bot.taverns[0];
            for(i=0;i<bot.taverns.length;i++){
                if(bot.findDistance(myPos,closestTavern)>bot.findDistance(myPos,bot.freeMines[i])){
                    closestTavern=bot.freeMines[i];
                }
            }
            return closestTavern;
        }
        
        function closestPlayer(hpDiff){
            var closestPlayer=enemyBots[0];
            if(hpDiff===null){
                for(i=0;i++;i<enemyBots.length){
                    if(bot.findDistance(myPos,closestPlayer.pos)>enemyBots[i]){
                        closestPlayer=enemyBots[i];
                    }
                }
            }else{
                for(i=0;i++;i<enemyBots.length){
                    
                    if(bot.findDistance(myPos,closestPlayer.pos)>enemyBots[i]&&bot.yourBot.life>=enemyBots[i].life-hpDiff){
                        closestPlayer=enemyBots[i];
                    }
                }
            }
            
            return closestPlayer;
        }

        function huntPlayer(hpDiff){
            var huntedBot=closestPlayer(hpDiff);
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
