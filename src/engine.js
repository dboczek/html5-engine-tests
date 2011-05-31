
engine = (function() {
    var that = {},
        engineTest,
        sceneList = {}, sceneListCount = 0,
        currentScene,
        currentMap,
        tileSize = 48,
        testArea = $('#qunit-test-area'),
        Texture2D = require('cocos2d/Texture2D').Texture2D,
        cocos = require('cocos2d'),
        geo = require('geometry');
    
    that.initViewport = function(pixelsWidth, pixelsHeight) {
        testArea.css({'width': pixelsWidth, 'height': pixelsHeight});
        engineTest = cocos.nodes.Layer.extend({
            init: function() {
                engineTest.superclass.init.call(this);
                var director = cocos.Director.get('sharedDirector');
                var s = director.get('winSize');
                var label = cocos.nodes.Label.create({string: 'Test', fontName: 'Arial', fontSize: 76});
                this.addChild({child: label, z: 1});
                label.set('position', geo.ccp(s.width / 2, s.height / 2));
            }
        });
    };
    
    that.destroyViewport = function() {
        //testArea.empty();
        //cocos.Director.get('sharedDirector').replaceScene(currentScene);
    };
    
    that.prepareWorldData = function(xTiles, yTiles, callback) {
        //currentMap = cocos.nodes.TMXTiledMap.create({file: module.dirname + "/maps/orthogonal-test1.tmx"});
        currentMap = cocos.nodes.TMXTiledMap.create({file: module.dirname + "/maps/large48.tmx"});
        if (typeof callback == 'function') {
            callback();
        }
    };
    
    that.createScene = function(sceneName) {
        sceneList[sceneName] = cocos.nodes.Scene.create();
        sceneListCount++;
        //$('.currentS1cene', testArea).remove();
        testArea.append('<div class="scene" id="' + sceneName + '"></div>')
        var sceneArea = $('#' + sceneName);
        sceneArea.css({'width': '100%', 'height': '100%'});
    };
    
    that.showScene = function(sceneName, callback) {
        var director = cocos.Director.get('sharedDirector');
        director.attachInView($('#' + sceneName)[0]);
        //director.set('displayFPS', true);
        
        var label = cocos.nodes.Label.create({string: sceneName, fontName: 'Arial', fontSize: 24});
        label.set('position', geo.ccp(100, 100));
        
        currentScene = sceneList[sceneName];
        currentScene.addChild({child: engineTest.create()});
        currentScene.addChild({child: currentMap, z: 0, tag: 1});
        currentScene.addChild({child: label, z: 2});
        if (sceneListCount > 1) {
            $('.scene', testArea).not('#' + sceneName).remove();
            director.replaceScene(currentScene);
        } else {
            director.runWithScene(currentScene);
        }
        if (typeof callback == 'function') {
            callback();
        }
    };
    
    that.moveViewportTo = function(x, y, duration, callback) {
        var doAction = moveToWithStop.create({duration: (duration / 1000), position: geo.ccp(-x, -y)});
        doAction.set('runCallback', callback);
        currentMap.runAction(doAction);
    };
    
    that.putEntity = function(xPos, yPos, spriteName) {
        var spriteTexture = Texture2D.create({file: module.dirname + "/sprites/kayak.png"}),
            spriteFrames = [], framesCount = 10, tileCenterOffset = Math.round(tileSize / 2);
        
        for (var i = 0; i < framesCount; i++) {
            spriteFrames.push(cocos.SpriteFrame.create({
                texture: spriteTexture,
                rect: geo.rectMake(tileSize * i, 0, tileSize * (i + 1), tileSize)
            }));
        }
        var sprite = cocos.nodes.Sprite.create({frame: spriteFrames[0]});
        sprite.set('position', geo.ccp(xPos * tileSize + tileCenterOffset, yPos * tileSize + tileCenterOffset));
        currentScene.addChild({child: sprite});
        
        sprite.moveTo = function(x, y, duration, callback) {
            var position = geo.ccp(x * tileSize + tileCenterOffset, y * tileSize + tileCenterOffset),
                moveAction = moveToWithStop.create({duration: (duration / 1000), position: position});
            moveAction.set('runCallback', callback);
            sprite.runAction(moveAction);
        }
        
        //sprite.set('anchorPoint', geo.ccp(0.5, 0.5));
        //var animation = cocos.Animation.create({frames: spriteFrames, delay: 0.2}),
        //    animate = cocos.actions.Animate.create({animation: animation, restoreOriginalFrame: false});
        //
        //sprite.runAction(cocos.actions.RepeatForever.create(animate));
        
        return sprite;
    }
    
    var moveToWithStop = cocos.actions.MoveTo.extend({
        stop: function() {
            if (typeof this.runCallback == 'function') {
                this.runCallback();
            }
            moveToWithStop.superclass.stop.call(this);
        }
    });
    
    return that;
})();