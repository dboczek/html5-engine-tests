
engine = (function() {
    var that = {},
        engineTest,
        sceneList = {}, sceneListCount = 0,
        currentScene,
        currentMap,
        tileSize = 48,
        tilePadding = 2,
        testArea = $('#qunit-test-area'),
        Texture2D = require('cocos2d/Texture2D').Texture2D,
        cocos = require('cocos2d'),
        geo = require('geometry');
        
    that.tileSize = tileSize;
    
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

    that.prepareWaterWorldData = function(xTiles, yTiles, callback) {
        var spriteTexture = Texture2D.create({file: module.dirname + "/maps/img/tiles2.jpg"}),
            spriteFrames = [], framesCount = 8, tileCenterOffset = Math.round(that.tileSize / 2),
            entities = [], sprite;
        
        currentMap = cocos.nodes.TMXTiledMap.create({file: module.dirname + "/maps/empty.tmx"});
        
        // Prepare animation frames
        for (var i = 0; i < framesCount; i++) {
            spriteFrames.push(cocos.SpriteFrame.create({
                texture: spriteTexture,
                rect: geo.rectMake(
                    (tileSize + tilePadding) * i, (tileSize + tilePadding) * 12, // x, y
                    tileSize + tilePadding, tileSize // sizex, sizey
                )
            }));
        }
        
        for (var yPos = 0; yPos < yTiles; yPos++) {
            for (var xPos = 0; xPos < xTiles; xPos++) {
                sprite = cocos.nodes.Sprite.create({frame: spriteFrames[0]});
                sprite.set('position', geo.ccp(xPos * tileSize + tileCenterOffset, yPos * tileSize + tileCenterOffset));
                var animation = cocos.Animation.create({frames: spriteFrames, delay: 0.2}),
                    animate = cocos.actions.Animate.create({animation: animation, restoreOriginalFrame: false});
                sprite.runAction(cocos.actions.RepeatForever.create(animate));
                entities.push(sprite);
                //currentScene.addChild({child: sprite});
            }
        }
        
        that.worldData = entities;
        
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
        
        if (that.worldData != undefined) {
            for (var i = 0; i < that.worldData.length; i++) {
                currentScene.addChild({child: that.worldData[i]});
            }
            that.worldData = undefined;
        }
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
        
        // Prepare animation frames
        for (var i = 0; i < framesCount; i++) {
            spriteFrames.push(cocos.SpriteFrame.create({
                texture: spriteTexture,
                rect: geo.rectMake(
                    (tileSize + tilePadding) * i, 0, // x, y
                    tileSize + tilePadding, tileSize // sizex, sizey
                )
            }));
        }
        
        // Prepare one sprite
        var sprite = cocos.nodes.Sprite.create({frame: spriteFrames[0]});
        sprite.set('position', geo.ccp(xPos * tileSize + tileCenterOffset, yPos * tileSize + tileCenterOffset));
        currentScene.addChild({child: sprite});
        
        sprite.moveTo = function(x, y, duration, callback) {
            var position = geo.ccp(x * tileSize + tileCenterOffset, y * tileSize + tileCenterOffset),
                moveAction = moveToWithStop.create({duration: (duration / 1000), position: position});

            moveAction.set('runCallback', callback);
            sprite.runAction(moveAction);
        }
        
        sprite.playAnimation = function() {
            var animation = cocos.Animation.create({frames: spriteFrames, delay: 0.2}),
                animate = cocos.actions.Animate.create({animation: animation, restoreOriginalFrame: false});

            sprite.runAction(cocos.actions.RepeatForever.create(animate));
        }
        
        sprite.rotate = function(angle, duration, callback) {
            var rotation = rotateByWithStop.create({duration: (duration / 1000), angle: angle});
            rotation.set('runCallback', callback);
            sprite.set('anchorPoint', geo.ccp(0.5, 0.5));
            sprite.runAction(rotation);
        }
        
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
    
    var rotateByWithStop = cocos.actions.RotateBy.extend({
        stop: function() {
            if (typeof this.runCallback == 'function') {
                this.runCallback();
            }
            rotateByWithStop.superclass.stop.call(this);
        }
    });
    
    return that;
})();